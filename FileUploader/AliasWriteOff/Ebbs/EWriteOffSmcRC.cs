﻿using ColloSys.DataLayer.Domain;
using ColloSys.DataLayer.Enumerations;

namespace ColloSys.FileUploaderService.AliasWriteOff.Ebbs
{
// ReSharper disable once InconsistentNaming
    public class EWriteOffSmcRC:EWriteOffSharedRC
    {
        private const uint Accountpos = 1;
        private const uint AccountLength = 11;
        private const uint ProductPos = 7;

        public EWriteOffSmcRC()
            : base(Accountpos, AccountLength,ProductPos)
        {
            TodayRecordList.AddEntities(DbLayer.GetPreviousRecords<EWriteoff>(ScbEnums.Products.SMC));
        }

        public override string GetValueForIsSettled()
        {
            return Reader.GetValue(11);
        }
    }
}
