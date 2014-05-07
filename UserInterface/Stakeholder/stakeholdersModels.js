﻿csapp.factory("$csStakeholderModels", ["$csShared", function ($csShared) {

    var stakeholder = function () {
        return {

            hierarchy: { label: 'Hierarchy', type: 'select' },
            designation: { label: 'Designation', valueField: 'Id', textField: 'Designation', type: 'select' },
            Name: { placeholder: 'enter name', label: "Name", type: 'text', pattern: '/^[a-zA-Z ]{1,100}$/', required: true, patternMessage: 'Invalid Name' },
            userId: { label: "UserId", editable: false, template: 'user', required: true, type: "text", pattern: '/^[0-9]{7}$/', patternMessage: 'Invalid ID' },
            mobile: { label: "Mobile No", type: 'text', pattern: '/^[0-9]{10}$/', template: 'phone', patternMessage: 'Invalid Mobile Number' },
            email: { label: "Email", type: 'email', patternMessage: 'Invalid Email' },
            date: { type: 'date', required: true },
            manager: { type: 'select', valueField: 'Id', textField: 'Name' },

            PAN: { label: 'PAN', type: 'text', template: 'pan' },
            TAN: { label: 'TAN', type: 'text', patternMessage: 'accepts only xxxxxxxx' },
            Registration: { label: 'Registration', pattern: '/^[a-zA-Z]*$/', type: 'text', patternMessage: 'special characters not allowed' },
            ServiceTaxNo: { label: 'ServiceTaxNo', pattern: '/^[a-zA-Z]*$/', type: 'text', patternMessage: 'special characters not allowed' },

            line1: { label: "Line1", type: 'text', required: true },
            line2: { label: "Line2", type: 'text', required: true },
            line3: { label: "Line3", type: 'text' },
            pincode: { label: "Pincode", type: "text" },
            landline: { label: "Landline", type: 'text', template: 'phone', patternMessage: "Invalid Number" }


        };
    };

    var stkhHierarchy = function () {
        return {
            designation: { label: 'Designation', valueField: 'Id', textField: 'Designation', type: 'select' },
            hierarchy: { label: 'Hierarchy', type: 'select' },
            ApplicationName: { label: 'Name', type: 'text' },
            LocationLevel: { label: 'LocationLevel', type: 'select' },
            PositionLevel: { label: 'PositionLevel', type: 'number', template: 'int' },
            IsIndividual: { label: 'IsIndividual', type: 'checkbox' },
            IsUser: { label: 'IsUser', type: 'checkbox' },
            HasWorking: { label: 'HasWorking', type: 'checkbox' },
            HasPayment: { label: 'HasPayment', type: 'checkbox' },
            HasBuckets: { label: 'HasBuckets', type: 'checkbox' },
            HasBankDetails: { label: 'HasBankDetails', type: 'checkbox' },
            HasMobileTravel: { label: 'HasMobileTravel', type: 'checkbox' },
            HasVarible: { label: 'HasVarible', type: 'checkbox' },
            HasFixed: { label: 'HasFixed', type: 'checkbox' },
            HasFixedIndividual: { label: 'HasFixedIndividual', type: 'checkbox' },
            HasAddress: { label: 'HasAddress', type: 'checkbox' },
            HasMultipleAddress: { label: 'HasMultipleAddress', type: 'checkbox' },
            HasRegistration: { label: 'HasRegistration', type: 'checkbox' },
            HasServiceCharge: { label: 'HasServiceCharge', type: 'checkbox' },
            ManageReportsTo: { label: 'ManageReportsTo', type: 'checkbox' },
            IsInAllocation: { label: 'IsInAllocation', type: 'checkbox' },
            IsEmployee: { label: 'IsEmployee', type: 'checkbox' },
            IsInField: { label: 'IsInField', type: 'checkbox' },
            ReportingLevel: { label: 'ReportingLevel', type: 'enum', valueList: $csShared.enums.ReportingLevel },
            Permissions: { label: 'Permissions', type: 'text' }
        };
    };

    var stkhWorking = function () {
        return {
            BucketStart: { label: 'BucketStart', type: 'select', textField: 'display', value: 'value' },
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
            PanNo: { label: 'PanNo', type: 'text' },
            TanNo: { label: 'TanNo', type: 'text' },
            ServiceTaxno: { label: 'ServiceTaxno', type: 'text' },
        };
    };

    var stakeAddress = function () {
        return {
            Line1: { label: 'Line1', type: 'text' },
            Line2: { label: 'Line2', type: 'text' },
            Line3: { label: 'Line3', type: 'text' },
            LandlineNo: { label: 'LandlineNo', type: 'text' },
            Pincode: { label: 'Pincode', type: 'number', template: 'uint' },
            Country: { label: 'Country', type: 'text' },
            StateCity: { label: 'StateCity', type: 'text' },
        };
    };

    var stakeView = function () {
        return {
            View: { label: "View", type: "enum" },
            Hierarchy: { label: "Hierarchy", type: "select", textField: 'Hierarchy' },
            Designation: { label: "Designation", type: "select", valueField: 'Id', textField: 'Designation' },
            Stake: { label: "Stakeholder/Agency", type: "select", valueField: 'Id', textField: 'Name' },
            Products: { label: "Products", type: "enum" },
        };
    };

    var init = function () {
        return {
            Stakeholder: stakeholder(),
            StkhHierarchy: stkhHierarchy(),
            StkhWorking: stkhWorking(),
            StkhPayment: stkhPayment(),
            StkhRegistration: stkhRegistration(),
            StakeAddress: stakeAddress(),
            StakeView: stakeView()
        };
    };

    return {
        init: init()
    };

}]);