﻿#region references

using System;
using System.Collections.Generic;
using System.Linq;
using ColloSys.DataLayer.Enumerations;
using ColloSys.DataLayer.SessionMgr;
using ColloSys.DataLayer.Stakeholder;
using ColloSys.QueryBuilder.StakeholderBuilder;
using NHibernate.Linq;

#endregion

namespace AngularUI.Stakeholder.addedit.Working
{
    public static class WorkingPaymentHelper
    {
        private static readonly StakeQueryBuilder StakeQuery = new StakeQueryBuilder();
        private static readonly HierarchyQueryBuilder HierarchyQuery = new HierarchyQueryBuilder();

        public static IEnumerable<Stakeholders> GetStkhByReportingLevel(Guid hierarchyId, ColloSysEnums.ReportingLevel level)
        {
            var hierarchyList = new List<Guid>();
            if ((int)level == 0)
            {
                return StakeQuery.GetAllStakeholders();
            }
            var allHierarchies = HierarchyQuery.GetAllHierarchies().ToList();
            for (var i = 1; i <= (int)level; i++)
            {
                var reportsToId = allHierarchies.Single(x => x.Id == hierarchyId).ReportsTo;
                if (reportsToId == Guid.Empty) break;
                hierarchyList.Add(reportsToId);
                hierarchyId = reportsToId;
            }

            var stkhList = StakeQuery.OnHierarchyId(hierarchyList).ToList();
            return stkhList;
        }

        public static IEnumerable<Stakeholders> GetStkhWorkingByReportingLevel(Guid hierarchyId, ColloSysEnums.ReportingLevel level, ScbEnums.Products product)
        {
            var stkhList = GetStkhByReportingLevel(hierarchyId, level);
            var stkhProductList = new List<Stakeholders>();
            foreach (var stkh in stkhList)
            {
                if (stkh.StkhWorkings.Count == 0) stkhProductList.Add(stkh);
                var hasProduct = stkh.StkhWorkings.Any(x => x.Products == product);
                if (hasProduct) stkhProductList.Add(stkh);
            }
            return stkhProductList;
        }

        public static void UpdateAndSave(List<StkhWorking> workList)
        {
            var session = SessionManager.GetCurrentSession();

            using (var transaction = session.BeginTransaction())
            {
                var stake = session.Query<Stakeholders>()
                       .Where(x => x.Id == workList[0].Stakeholder.Id)
                       .Fetch(x => x.StkhWorkings)
                       .Single();
                stake.StkhWorkings = workList;
                session.Merge(stake);
                transaction.Commit();
                session.Close();
            }
        }

        public static SalaryDetails GetSalaryDetails(StkhPayment currentPayment, Dictionary<string, decimal> fixpayData)
        {
            var payment = new SalaryDetails
            {
                FixpayBasic = currentPayment.FixpayBasic,
                FixpayGross = currentPayment.FixpayGross,
            };

            payment.EmployeePfPct = fixpayData["EmployeePF"];
            //payment.EmployeePfPct = 12;
            payment.EmployeePf = payment.FixpayBasic * (payment.EmployeePfPct / 100);

            payment.EmployerPfPct = fixpayData["EmployerPF"];
            //payment.EmployerPfPct = (decimal)13.61;
            payment.EmployerPf = payment.FixpayBasic * (payment.EmployerPfPct / 100);

            payment.EmployeeEsicPct = payment.FixpayGross >= 15000 ? 0 : fixpayData["EmployeeESIC"];
            //payment.EmployeeEsicPct = payment.FixpayTotal >= 15000 ? 0 : (decimal)1.75;
            payment.EmployeeEsic = payment.FixpayGross * (payment.EmployeeEsicPct / 100);

            payment.EmployerEsicPct = payment.FixpayGross >= 15000 ? 0 : fixpayData["EmployerESIC"];
            //payment.EmployerEsicPct = payment.FixpayTotal >= 15000 ? 0 : (decimal)4.75;
            payment.EmployerEsic = payment.FixpayGross * (payment.EmployerEsicPct / 100);

            var midTotal = payment.FixpayGross + payment.EmployerEsic + payment.EmployerPf;

            //TODO : get count of employees from db
            payment.ServiceChargePct = 8;
            payment.ServiceCharge = midTotal * (payment.EmployerEsicPct / 100);

            payment.ServiceTaxPct = fixpayData["ServiceTax"];
            //payment.ServiceTaxPct = (decimal)12.36;
            payment.ServiceTax = (midTotal + payment.ServiceCharge) * (payment.ServiceTaxPct / 100);

            payment.FixpayTotal = midTotal + payment.ServiceTax + payment.ServiceCharge;

            return payment;
        }
    }
}