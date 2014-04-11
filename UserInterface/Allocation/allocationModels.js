﻿csapp.factory("$csAllocationModels", ["$csShared", function ($csShared) {

    var models = {};
    var allocSubpolicy = function () {
        return {
            Stakeholder: { label: "Select Stakeholder", type: "" },//TOBE Disscuss list type
            Name: { label: "Subpolicy Name", type: "text", pattern: "/^\w*$/", maxlength: 20, required: true },
            AllocateType: { label: "Policy Allocate Type", type: "enum", valueList: $csShared.enums.AllocationType, required: true },
            ReasonNotAllocate: { label: "Select Reason", type: "enums", valueList: "" },//TObe disscuss list
            NoAllocMonth: { label: "Allocate Months", type: "int", min: 0, required: true },
            Products: { label: "Product", type: "enum", valueList: $csShared.enums.Products, required: true },
            Product: { label: "Product", type: "text", required: true, editable: false },
            Category: { label: "Category", type: "enum", valueList: $csShared.enums.Category }
        };
    };

    var allocPolicy = function () {
        return {

        };
    };

    var init = function () {
        models.AllocSubpolicy = allocSubpolicy();
        models.AllocPolicy = allocPolicy();
        return models;
    };
    return {
        init: init,
        models: models
    };
}]);