﻿csapp.factory("$csStakeholderModels", ["$csShared", function ($csShared) {

    var stakeholder = function () {
        return {

            hierarchy: { label: 'Hierarchy', type: 'select' },
            designation: { label: 'Designation', valueField: 'Id', textField: 'Designation', type: 'select' },
            Name: { placeholder: 'enter name', label: "Name", type: 'text', pattern: '/^[a-zA-Z ]{1,100}$/', required: true, patternMessage: 'Invalid Name' },
            ExternalId: { label: "UserId", editable: false, required: true, type: "text" },
            MobileNo: { label: "Mobile No", type: 'text', template: 'phone' },
            EmailId: { label: "Email", type: 'email', patternMessage: 'Invalid Email' },
            JoiningDate: { type: 'date', required: true },
            ReportingManager: { type: 'select', valueField: 'Id', textField: 'Name', label: "Reporting Manager" },
        };
    };

    var stkhHierarchy = function () {
        return {
            designation: { label: 'Designation', type: 'text', maxlength: 100, minlength: 2, pattern: "/^[a-zA-Z ]+$/", patternMessage: "Only Characters Required", required: true },
            Hierarchy: { label: 'Hierarchy', type: 'enum', required: true },
            ReportsTo: { label: 'Reports To', type: 'select', textField: 'Designation', valueField: 'Id' },
            ReportsToDesignation: { label: 'Reports To', type: 'text' },
            WorkingReportsTo: { label: 'Working Reports To', type: 'select', textField: 'Designation', valueField: 'Id', },
            WorkingReportsLevel: { label: 'Working Reports Level', type: 'enum', required: true, valueList: $csShared.enums.ReportingLevel },
            ApplicationName: { label: 'Name', type: 'text' },
            LocationLevel: { label: 'LocationLevel', type: 'select', valueField: 'key', textField: 'value', required: true },
            PositionLevel: { label: 'PositionLevel', type: 'number', template: 'int' },
            IsIndividual: { label: 'IsIndividual', type: 'btn-radio', options: [true, false] },
            IsUser: { label: 'IsUser', type: 'btn-radio', options: [true, false] },
            HasWorking: { label: 'HasWorking', type: 'btn-radio', options: [true, false] },
            HasPayment: { label: 'HasPayment', type: 'btn-radio', options: [true, false] },
            HasBuckets: { label: 'HasBuckets', type: 'btn-radio', options: [true, false] },
            HasBankDetails: { label: 'Has Bank Details', type: 'btn-radio', options: [true, false] },
            HasMobileTravel: { label: 'Has Mobile Travel', type: 'btn-radio', options: [true, false] },
            HasVarible: { label: 'HasVariable', type: 'btn-radio', options: [true, false] },
            HasFixed: { label: 'HasFixed', type: 'btn-radio', options: [true, false] },
            HasFixedIndividual: { label: 'Has Fixed Individual', type: 'btn-radio', options: [true, false] },
            HasAddress: { label: 'HasAddress', type: 'btn-radio', options: [true, false] },
            HasMultipleAddress: { label: 'Has Multiple Address', type: 'btn-radio', options: [true, false] },
            HasRegistration: { label: 'Has Registration', type: 'btn-radio', options: [true, false] },
            HasServiceCharge: { label: 'Has Service Charge', type: 'btn-radio', options: [true, false] },
            ManageReportsTo: { label: 'Is Highest Level Designation', type: 'btn-radio', options: [true, false] },
            IsInAllocation: { label: 'Is In Allocation ', type: 'btn-radio', options: [true, false] },
            IsEmployee: { label: 'IsEmployee', type: 'btn-radio', options: [true, false] },
            IsInField: { label: 'IsInField', type: 'btn-radio', options: [true, false] },
            ReportingLevel: { label: 'ReportingLevel', type: 'enum', required: true, valueList: $csShared.enums.ReportingLevel },
            Permissions: { label: 'Permissions', type: 'text' }
        };
    };

    var stkhWorking = function () {
        return {
            BucketStart: { label: 'BucketStart', type: 'select', textField: 'display', valueField: 'value' },
            BucketEnd: { label: 'BucketEnd', type: 'number', template: 'uint' },
            Country: { label: 'Country', type: 'text' },
            State: { label: 'State', type: 'enum' },
            Region: { label: 'Region', type: 'enum' },
            Cluster: { label: 'Cluster', type: 'enum' },
            District: { label: 'District', type: 'enum' },
            City: { label: 'City', type: 'enum' },
            Area: { label: 'Area', type: 'enum' },
            Products: { label: 'Product', type: 'enum', valueList: $csShared.enums.ProductEnum, required: true, },
            ReportsTo: { label: 'Reports To', type: 'select', textField: 'Name', valueField: 'Id', required: true },
            StartDate: { label: 'StartDate', type: 'date' },
            EndDate: { label: 'EndDate', type: 'date' },
            LocationLevel: { label: 'LocationLevel', type: 'enum' },
        };
    };

    var stkhPayment = function () {
        return {
            Products: { label: 'Product', type: 'enum', valueList: $csShared.enums.ProductEnum, required: true, },
            BankAccNo: { label: 'BankAccNo', type: 'text' },
            BankAccName: { label: 'BankAccName', type: 'text' },
            BankIfscCode: { label: 'BankIfscCode', type: 'text' },
            MobileElig: { label: 'Mobile', type: 'number', template: 'decimal' },
            TravelElig: { label: 'Travel', type: 'number', template: 'decimal' },
            FixpayBasic: { label: 'Basic', type: 'number', template: 'rupee' },
            FixpayHra: { label: 'Hra', type: 'number', template: 'rupee' },
            FixpayOther: { label: 'Other', type: 'number', template: 'rupee' },
            FixpayTotal: { label: 'FixpayTotal', type: 'number', template: 'rupee' },
            ServiceCharge: { label: 'Service Charge', type: 'number', template: 'percentage' },
            StartDate: { label: 'StartDate', type: 'date' },
            EndDate: { label: 'EndDate', type: 'date' },
            CollectionPolicy: { label: 'Collection Policy', type: 'select', valueField: 'Id', textField: 'Name' },
            RecoveryPolicy: { label: 'Recovery Policy', type: 'select', valueField: 'Id', textField: 'Name' },
        };
    };

    var stkhRegistration = function () {
        return {
            Stakeholder: { label: 'Stakeholder' },
            HasCollector: { label: 'HasCollector', type: 'checkbox' },
            RegistrationNo: { label: 'RegistrationNo', type: 'text' },
            PanNo: { label: 'PanNo', type: 'text', template: 'pan' },
            TanNo: { label: 'TanNo', type: 'text' },
            ServiceTaxNo: { label: 'ServiceTaxno', type: 'text' },
        };
    };

    var stakeAddress = function () {
        return {
            Line1: { label: 'Building Name', type: 'text' },
            Line2: { label: 'Street/Area Name', type: 'text' },
            Line3: { label: 'Landmark', type: 'text' },
            StateCity: { label: 'City/State', type: 'text' },
            Pincode: { label: 'Pincode', type: 'text' },
            Country: { label: 'Country', type: 'text' },
            LandlineNo: { label: 'LandlineNo', type: 'text', template: 'phone' },
        };
    };


    var init = function () {
        var models = {};

        models.Stakeholder = {
            Table: 'Stakeholder',
            Columns: stakeholder()
        };

        models.StkhHierarchy = {
            Table: 'StkhHierarchy',
            Columns: stkhHierarchy()
        };

        models.StkhWorking = {
            Table: 'StkhWorking',
            Columns: stkhWorking()
        };

        models.StkhPayment = {
            Table: 'StkhPayment',
            Columns: stkhPayment()
        };

        models.StkhRegistration = {
            Table: 'StkhRegistration',
            Columns: stkhRegistration()
        };

        models.StakeAddress = {
            Table: 'StakeAddress',
            Columns: stakeAddress()
        };

        return models;
    };

    return {
        init: init
    };

}]);