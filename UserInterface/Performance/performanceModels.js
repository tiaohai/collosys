﻿csapp.factory("$csPerformanceModels", ["$csShared", function ($csShared) {

    var performanceParam = function () {
        return {
            Product: { type: "enum", label: "Product", valueList: $csShared.enums.Products },
            Weightage: { type: "number", template: "percentage" },
            Param: { type: "text" },
            ParameterType: { type: "enum", valueList: $csShared.enums.ParameterType },
            TargetOn: { type: "enum", valueList: $csShared.enums.TargetOn },
            SelectParam: { type: "checkbox" },
            ParamsOn: { type: "enum", valueList: $csShared.enums.PolicyOn ,label:"Param On"},
            ParamsForProduct: { label: "Product", type: "text" },
            ParamsForStatkeholder: { label: "Stakeholder", type: "select", textField: "Name", valueField: "Id" },
            ParamsForHierarchy: { label: "Hierarchy", type: "select", textField: "Designation", valueField: "Id" },
            StartDate: { type: "date",label:"Start Date" },
            EndDate: { type: "date",label:"End Date" }
        };
    };

   var init = function () {
        var models = {};

        models.PerformanceParam = {
            Table: 'PerformanceParam',
            Columns: performanceParam()
        };
        
        return models;
    };

    return {
        init: init
    };

}]);