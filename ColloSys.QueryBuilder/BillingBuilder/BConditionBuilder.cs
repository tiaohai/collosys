﻿#region references

using System;
using System.Collections.Generic;
using ColloSys.DataLayer.Domain;
using ColloSys.DataLayer.Infra.SessionMgr;
using ColloSys.DataLayer.SessionMgr;
using ColloSys.QueryBuilder.BaseTypes;
using ColloSys.QueryBuilder.TransAttributes;
using NHibernate.Criterion;

#endregion


namespace ColloSys.QueryBuilder.BillingBuilder
{
    public class BConditionBuilder : Repository<BCondition>
    {
        public override QueryOver<BCondition, BCondition> ApplyRelations()
        {
            return QueryOver.Of<BCondition>();
        }

        [Transaction]
        public IEnumerable<BCondition> OnSubpolicyId(Guid subpolicyId)
        {
           return SessionManager.GetCurrentSession().QueryOver<BCondition>()
                              .Where(c => c.BillingSubpolicy.Id == subpolicyId)
                              .List();
        }
    }
}
