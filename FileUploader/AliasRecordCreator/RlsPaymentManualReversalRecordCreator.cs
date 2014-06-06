﻿#region references

using System;
using ColloSys.DataLayer.ClientData;
using ColloSys.DataLayer.Domain;
using ColloSys.FileUploaderService.AliasRecordCreator;
using ReflectionExtension.ExcelReader;

#endregion


namespace ColloSys.FileUploader.AliasReader
{
    public class RlsPaymentManualReversalRecordCreator : AliasPaymentRecordCreator
    {
        #region ctor
        private const uint AccountPosition = 3;
        private const uint AccountLength = 8;

        public RlsPaymentManualReversalRecordCreator(FileScheduler fileShedular) :
            base(fileShedular, AccountPosition, AccountLength){}

        #endregion

        public override bool GetComputations(Payment record, IExcelReader reader)
        {
            try
            {
                record.IsDebit = (record.TransAmount > 0);
                return true;
            }
            catch (Exception exception)
            {

                throw new Exception("Computted Record is Not Set", exception);
            }
        }

    }
}
