﻿#region References
using System;
using System.ComponentModel.DataAnnotations;
using ColloSys.DataLayer.BaseEntity;
using ColloSys.DataLayer.Components;
using ColloSys.DataLayer.Enumerations;

#endregion

namespace ColloSys.DataLayer.Domain
{
    public class BillAmount : Entity, IApproverComponent
    {
        public virtual Stakeholders Stakeholder { get; set; }

        #region Propertity

        public virtual ScbEnums.Products Products { get; set; }

        public virtual uint BillMonth { get; set; }

        public virtual uint Cycle { get; set; }

        public virtual decimal FixedAmount { get; set; }

        public virtual decimal VariableAmount { get; set; }

        public virtual decimal Deductions { get; set; }

        public virtual decimal TaxAmount { get; set; }

        public virtual ColloSysEnums.BillPaymentStatus PayStatus { get; set; }

        public virtual DateTime PayStatusDate { get; set; }

        public virtual string PayStatusHistory { get; set; }

        public virtual decimal HoldAmount { get; set; }

        public virtual decimal HoldRepayment { get; set; }

        public virtual decimal TotalAmount { get; set; }

      

        #region DateRange
        [Required]
        [DataType(DataType.Date)]
        public virtual DateTime StartDate { get; set; }

        [Required]
        [DataType(DataType.Date)]
        public virtual DateTime EndDate { get; set; }

        #endregion

        #endregion

        #region IApprove
        public virtual ColloSysEnums.ApproveStatus Status { get; set; }
        public virtual string Description { get; set; }
        public virtual string ApprovedBy { get; set; }
        public virtual DateTime? ApprovedOn { get; set; }
        public virtual Guid OrigEntityId { get; set; }
        public virtual RowStatus RowStatus { get; set; }

        #endregion

        public virtual uint OriginMonth { get; set; }
    }
}