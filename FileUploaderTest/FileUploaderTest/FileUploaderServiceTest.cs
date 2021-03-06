﻿using ColloSys.DataLayer.ClientData;
using ColloSys.DataLayer.Domain;
using ColloSys.FileUploaderService;
using NUnit.Framework;

namespace ReflectionExtension.Tests.FileUploaderTest
{
    [TestFixture]
    public class FileUploaderServiceTest
    {
        [Test]
        public void Test()
        {
            FileUploaderService1.UploadFiles();
        }

        [Test]
        public void Check_Property_Type()
        {
            var rliner = new RLiner();
            var propertyInfo = rliner.GetType().GetProperty("FileDate");
        }

        [Test]
        public void Check_Property_Type_RWriteOff()
        {
            var rWriteOff = new RWriteoff();
            var trimed = " SETTLEMENT".TrimEnd().TrimStart();
            var propertyInfo = rWriteOff.GetType().GetProperty(" SETTLEMENT".TrimEnd().TrimStart());
        }

        [Test]
        public void Check_Property_Type_Payment()
        {
            var rWriteOff = new Payment();
            var propertyInfo = rWriteOff.GetType().GetProperty("Status".TrimEnd().TrimStart());
        }

        [Test]
        public void Check_Property_Type_E_WriteOff()
        {
            var rWriteOff = new EWriteoff();//BadDebtsIncurred_3011 BADDEBTSINCURRED_2005
            var propertyInfo = rWriteOff.GetType().GetProperty("BadDebtsIncurred_3011".TrimEnd().TrimStart());
        }


    }
}
