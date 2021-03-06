﻿using ColloSys.DataLayer.Generic;

#region References

using System;
using System.Collections.Generic;
using ColloSys.DataLayer.Allocation;
using ColloSys.DataLayer.ClientData;
using ColloSys.DataLayer.Components;
using ColloSys.DataLayer.Enumerations;
using ColloSys.DataLayer.SharedDomain;

#endregion

// ReSharper disable CheckNamespace
// ReSharper disable ClassWithVirtualMembersNeverInherited.Global
// ReSharper disable DoNotCallOverridableMethodsInConstructor
// ReSharper disable MemberCanBeProtected.Global
// ReSharper disable UnusedAutoPropertyAccessor.Global

namespace ColloSys.DataLayer.Domain
{
    public class RLiner : UploadableEntity, IUniqueKey
    {
        #region Properties

        public virtual ColloSysEnums.DelqFlag Flag { get; set; }
        public virtual decimal PrincipalDue { get; set; }
        public virtual string DelqHistoryString { get; set; }

        public virtual string AccountNo { get; set; }
        public virtual string CustomerName { get; set; }
        public virtual decimal LoanTotalDue { get; set; }
        public virtual decimal InterestCharge { get; set; }
        public virtual decimal LateCharge { get; set; }
        public virtual decimal BounceCharge { get; set; }
        public virtual decimal FeeCharge { get; set; }
        public virtual decimal TotalDue { get; set; }
        public virtual decimal RevisedDue { get; set; }
        public virtual decimal Emi { get; set; }
        public virtual decimal EmiDue { get; set; }
        public virtual string Branch { get; set; }
        public virtual uint Tenure { get; set; }
        public virtual DateTime? FirstInstDate { get; set; }
        public virtual DateTime? FinalInstDate { get; set; }
        public virtual uint ProductCode { get; set; }
        public virtual string ProductName { get; set; }
        public virtual ScbEnums.Products Product { get; set; }
        public virtual string AgeCode { get; set; }
        public virtual string Bucket { get; set; }
        public virtual decimal LoanPrinDue { get; set; }
        public virtual uint Cycle { get; set; }
        public virtual bool IsImpaired { get; set; }
        public virtual string CustStatus { get; set; }
        public virtual DateTime? AllocStartDate { get; set; }
        public virtual DateTime? AllocEndDate { get; set; }
        public override DateTime FileDate { get; set; }
        public override ulong FileRowNo { get; set; }

        public virtual bool IsReferred { get; set; }
        public virtual uint Pincode { get; set; }
        public virtual ColloSysEnums.AllocStatus AllocStatus { get; set; }
        public virtual ColloSysEnums.NoAllocResons? NoAllocResons { get; set; }
        public override FileScheduler FileScheduler { get; set; }
        public virtual GPincode GPincode { get; set; }
        #endregion

        #region Relationship

        public override IList<string> GetExcludeInExcelProperties()
        {
            var memberHelper = new MemberHelper<RLiner>();
            return new List<string> {
                memberHelper.GetName(x => x.Id),
                memberHelper.GetName(x => x.Version),
                memberHelper.GetName(x => x.CreatedBy),
                memberHelper.GetName(x => x.CreatedOn),
                memberHelper.GetName(x => x.CreateAction),
                memberHelper.GetName(x => x.IsReferred),
                memberHelper.GetName(x => x.Pincode),
                memberHelper.GetName(x => x.AllocStatus),
                memberHelper.GetName(x => x.NoAllocResons),
                memberHelper.GetName(x => x.FileScheduler),
                memberHelper.GetName(x => x.GPincode),
                memberHelper.GetName(x => x.Allocs)
            };
        }

        public virtual Iesi.Collections.Generic.ISet<Allocations> Allocs { get; set; }

        #endregion

        #region NotMapped Fields

        

        #endregion
    }
}

