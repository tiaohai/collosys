﻿using System;
using System.IO;
using ColloSys.DataLayer.ClientData;
using ColloSys.DataLayer.Domain;
using ColloSys.DataLayer.Enumerations;
using ColloSys.FileUploader.Utilities;
using ColloSys.FileUploaderService.AliasPayment;
using ColloSys.FileUploaderService.ExcelReader;
using ColloSys.FileUploaderService.FileReader;
using ColloSys.FileUploaderService.RecordManager;
using ColloSys.FileUploaderService.RowCounter;
using NHibernate.Tool.hbm2ddl;
using NUnit.Framework;

using ReflectionExtension.ExcelReader;

namespace ReflectionExtension.Tests.FileReaderTest
{
    [TestFixture]
    class FileProcessesTest
    {
        private FileProcess _fileProcess;
        private FileScheduler _fileScheduler;
        private FileDataProvider _obj;
        private ICounter _counter;
        //SetUpAssembliesForTest objTest = new SetUpAssembliesForTest();
        private SchemaExport _db;

        [SetUp]
        public void Init()
        {
            var fileDate = new DateTime();
            var dirPath = "";
            _obj = new FileDataProvider(fileDate,dirPath);
            _counter = new ExcelRecordCounter();
            _fileProcess = new FileProcess();
            
            _fileScheduler = _obj.GetFileScheduler("", ColloSysEnums.FileAliasName.E_PAYMENT_WO_AUTO);
        }

        [Test]
        public void Test_ComputeStatus_Assigning_ErrorRow_To_FileScheduler()
        {
            //Arrange
            _fileScheduler.ErrorRows = 1;
            _fileScheduler.ValidRows = 5;

            //Act
            _fileProcess.ComputeStatus(_fileScheduler, _counter);


            Assert.AreEqual(_fileScheduler.UploadStatus, ColloSysEnums.UploadStatus.DoneWithError);
        }

        [Test]
        public void Test_UpdateFileScheduler_Assigning_UploadStatus()
        {
            //Arrange
            _fileProcess.UpdateFileScheduler(_fileScheduler, _counter, ColloSysEnums.UploadStatus.DoneWithError);

            var fs = new FileScheduler();
            IExcelReader exreader = SharedUtility.GetInstance(new FileInfo(_fileScheduler.FileDirectory + @"\" + _fileScheduler.FileName),_counter);
            //IAliasRecordCreator<Payment> objrecord = new RlsPaymentLinerRecordCreator(_fileScheduler);
           // IRecord<Payment> record = new RecordCreator<Payment>(objrecord, exreader, _counter);
            // RlsPaymentLinerFileReader rls=new RlsPaymentLinerFileReader();

            //Act
            _fileProcess.UpdateFileScheduler(_fileScheduler, _counter, ColloSysEnums.UploadStatus.UploadRequest);

            //Assert
            Assert.AreEqual(fs.ValidRows, 10);
        }

        [Test]
        public void Test_UpdateFileStatus_Asssigning()
        {
            //Arrange
            var file = new FileScheduler() { FileDetail = { } };

            //Act
            _fileProcess.UpdateFileStatus(_fileScheduler, ColloSysEnums.UploadStatus.Done, _counter);

            //Assert
            Assert.AreEqual(_fileScheduler.UploadStatus, ColloSysEnums.UploadStatus.Done);
        }

    }


 
}
