﻿using ColloSys.DataLayer.Domain;
using ColloSys.DataLayer.Enumerations;

namespace ColloSys.FileUploaderService.AliasWriteOff.Rls
{
// ReSharper disable once InconsistentNaming
    public class RWriteOffAutoGbRC:RWriteOffSharedRC
    {
        private const uint AccountPosition = 1;
        private const uint AccountLength = 11;
        private const uint CycleString = 5;
        public RWriteOffAutoGbRC() : base(AccountPosition, AccountLength, CycleString)
        {
            TodayRecordList.AddEntities(DbLayer.GetPreviousRecords<RWriteoff>(ScbEnums.Products.AUTO));
        }
    }
}
