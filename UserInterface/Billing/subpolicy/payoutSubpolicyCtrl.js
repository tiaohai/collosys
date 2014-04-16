﻿
csapp.factory('payoutSubpolicyDataLayer', ['Restangular', '$csnotify', '$csfactory',
    function (rest, $csnotify, $csfactory) {
        var restApi = rest.all("PayoutSubpolicyApi");
        var dldata = {};
        dldata.dateValueEnum = ["First_Quarter", "Second_Quarter", "Third_Quarter", "Fourth_Quarter", "Start_of_Year", "Start_of_Month", "Start_of_Week", "Today", "End_of_Week", "End_of_Month", "End_of_Year", "Absolute_Date"];//done
        dldata.categorySwitch = [{ Name: 'Collection', Value: 'Liner' }, { Name: 'Recovery', Value: 'WriteOff' }];
        dldata.PayoutSubpolicyTypeSwitch = [{ Name: 'Formula', Value: 'Formula' }, { Name: 'Subpolicy', Value: 'Subpolicy' }];
        dldata.outputTypeSwitch = [{ Name: 'Number', Value: 'Number' }, { Name: 'Boolean', Value: 'Boolean' }];

        var getProducts = function () {
            restApi.customGET("GetProducts").then(function (data) {
                dldata.productsList = data;
            }, function (data) {
                $csnotify.error(data);
            });
        };

        var selectPayoutSubpolicy = function (spayoutSubpolicy) {
            dldata.payoutSubpolicy = spayoutSubpolicy;
            if (!angular.isUndefined(spayoutSubpolicy.GroupBy)) {
                if (!$csfactory.isNullOrEmptyString(spayoutSubpolicy.GroupBy))
                    dldata.payoutSubpolicy.GroupBy = JSON.parse(spayoutSubpolicy.GroupBy);
            }

            restApi.customGET("GetBConditions", { parentId: spayoutSubpolicy.Id }).then(function (data) {

                dldata.AllBConditions = data;
                dldata.payoutSubpolicy.BConditions = _.filter(data, { ConditionType: 'Condition' });
                dldata.payoutSubpolicy.BOutputs = _.filter(data, { ConditionType: 'Output' });

                _.forEach(dldata.payoutSubpolicy.BOutputs, function (outputval) {
                    if (outputval.Operator == 'None') {
                        outputval.Operator = "";
                    }
                    if (outputval.Lsqlfunction == 'None') {
                        outputval.Lsqlfunction = "";
                    }
                    return;
                });
                if (dldata.payoutSubpolicy.BOutputs.length < 0) {
                    dldata.payoutSubpolicy.BOutputs[0].Lsqlfunction = '';
                    dldata.payoutSubpolicy.BOutputs[0].Operator = '';
                }

                changeProductCategory();
                getRelation(angular.copy(spayoutSubpolicy));
            }, function (data) {
                $csnotify.error(data);
            });
        };

        var getRelation = function (subpolicy) {
            restApi.customPOST(subpolicy, "GetRelations").then(function (relation) {
                dldata.curRelation = relation;
                setIsPolicyApproved(dldata.curRelation);
            });
        };

        var changeProductCategory = function () {


            if (angular.isUndefined(dldata.payoutSubpolicy))
                return;

            if (angular.isUndefined(dldata.payoutSubpolicy.Id)) {
                dldata.payoutSubpolicy.BConditions = [];
                dldata.payoutSubpolicy.BOutputs = [];
            }
            resetCondition();
            resetOutput();

            var payoutSubpolicy = dldata.payoutSubpolicy;
            if (!angular.isUndefined(payoutSubpolicy.Products) && !angular.isUndefined(payoutSubpolicy.Category)) {

                // get subpolicy
                restApi.customGET("GetPayoutSubpolicy", { product: payoutSubpolicy.Products, category: payoutSubpolicy.Category }).then(function (data) {
                    dldata.payoutSubpolicyList = _.filter(data, { PayoutSubpolicyType: 'Subpolicy' });
                    if (dldata.payoutSubpolicyList.length==0) {
                        $csnotify.success("SubPolicy Not Available");
                    }
                }, function (data) {
                    $csnotify.error(data);
                });

                //get column names 

                restApi.customGET("GetColumns", { product: payoutSubpolicy.Products, category: payoutSubpolicy.Category }).then(function (data) {
                    dldata.columnDefs = data;
                    dldata.condLcolumnNames = data;
                    dldata.outColumnNames = _.filter(dldata.columnDefs, { InputType: 'number' });
                }, function (data) {
                    $csnotify.error(data);
                });

                // get formula names
                restApi.customGET("GetFormulaNames", { product: payoutSubpolicy.Products, category: payoutSubpolicy.Category }).then(function (data) {
                    dldata.formulaNames = data;
                }, function (data) {
                    $csnotify.error(data);
                });

                // get formula names
                restApi.customGET("GetMatrixNames", { product: payoutSubpolicy.Products, category: payoutSubpolicy.Category }).then(function (data) {
                    dldata.matrixNames = data;
                }, function (data) {
                    $csnotify.error(data);
                });

            } else {
                dldata.LcolumnNames = [];
                dldata.formulaNames = [];
                dldata.matrixNames = [];
            }
        };

        var setIsPolicyApproved = function (data) {

            if (data.Status === 'Approved') {
                dldata.IsPolicyApproved = true;
                dldata.policyapproved = true;
                $csnotify.success("Policy is already Approved");
            } else {
                dldata.policyapproved = false;
            }
        };

        var resetCondition = function () {
            dldata.newCondition = {};
            if (dldata.payoutSubpolicy.BConditions.length < 1) {
                dldata.newCondition.RelationType = '';
            } else {
                dldata.newCondition.RelationType = 'And';
            }
        };

        var resetOutput = function () {
            dldata.newOutput = {};
            if (dldata.payoutSubpolicy.BOutputs.length < 1) {
                dldata.newOutput.Operator = '';
            } else {
                dldata.newOutput.Operator = 'Plus';
            }
        };

        var savePayoutSubpolicy = function (payoutSubpolicy) {
            payoutSubpolicy.GroupBy = JSON.stringify(payoutSubpolicy.GroupBy);

            _.forEach(payoutSubpolicy.BOutputs, function (out) {
                payoutSubpolicy.BConditions.push(out);
            });
            if (payoutSubpolicy.Id) {

                restApi.customPUT(payoutSubpolicy, "Put", { id: payoutSubpolicy.Id }).then(function (data) {
                    dldata.payoutSubpolicyList = _.reject(dldata.payoutSubpolicyList, function (subpolicy) { return subpolicy.Id == data.Id; });
                    dldata.payoutSubpolicyList.push(data);
                    selectPayoutSubpolicy(data);
                    // $scope.resetPayoutSubpolicy();
                    $csnotify.success("Payout Subpolicy saved");
                }, function (data) {
                    $csnotify.error(data);
                });

            } else {
                restApi.customPOST(payoutSubpolicy, "Post").then(function (data) {
                    dldata.payoutSubpolicyList = _.reject(dldata.payoutSubpolicyList, function (subpolicy) { return subpolicy.Id == data.Id; });
                    dldata.payoutSubpolicyList.push(data);
                    selectPayoutSubpolicy(data);
                    $csnotify.success("Payout Subpolicy saved");
                }, function (data) {
                    $csnotify.error(data);
                });
            }
        };

        var getColumnValues = function (columnName) {
            restApi.customGET('GetValuesofColumn', { columnName: columnName }).then(function (data) {
                dldata.conditionValues = data;
            }, function (data) {
                $csnotify.error(data);
            });
        };

        var activateSubPoicy = function (modelData) {
            dldata.curRelation.StartDate = modelData.startDate;
            dldata.curRelation.EndDate = modelData.endDate;
            return restApi.customPOST(dldata.curRelation, "ActivateSubpolicy").then(function (data) {
                data.BillingPolicy = null;
                data.BillingSubpolicy = null;
                dldata.curRelation = data;
                $csnotify.success("Policy Activated");
            });
        };

        return {
            dldata: dldata,
            getProducts: getProducts,
            selectPayoutSubpolicy: selectPayoutSubpolicy,
            changeProductCategory: changeProductCategory,
            setIsPolicyApproved: setIsPolicyApproved,
            resetCondition: resetCondition,
            resetOutput: resetOutput,
            savePayoutSubpolicy: savePayoutSubpolicy,
            getColumnValues: getColumnValues,
            activateSubPoicy: activateSubPoicy
        };
    }]);

csapp.factory('payoutSubpolicyFactory', ['payoutSubpolicyDataLayer', '$csfactory',
    function (datalayer, $csfactory) {

        var dldata = datalayer.dldata;

        var disableIfRelationExists = function () {
            if (angular.isDefined(dldata.curRelation)) {
                if ($csfactory.isNullOrEmptyString(dldata.curRelation.BillingPolicy) || $csfactory.isNullOrEmptyString(dldata.curRelation.BillingSubpolicy))
                    return true;
                else return false;
            }
            return false;
        };

        var checkDuplicateName = function () {
            dldata.isDuplicateName = false;
            _.forEach(dldata.payoutSubpolicyList, function (subpolicy) {
                if (subpolicy.Name.toUpperCase() == dldata.payoutSubpolicy.Name.toUpperCase()) {
                    dldata.isDuplicateName = true;
                    return;
                }
            });
        };

        var addNewCondition = function (condition) {
            condition.Ltype = "Column";
            condition.Lsqlfunction = "";
            condition.ConditionType = 'Condition';
            condition.ParentId = dldata.payoutSubpolicy.Id;
            condition.Priority = dldata.payoutSubpolicy.BConditions.length;

            if (condition.dateValueEnum && condition.dateValueEnum != 'Absolute_Date') {
                condition.Rvalue = condition.dateValueEnum;
            }

            condition.Rvalue = JSON.stringify(condition.Rvalue);

            var con = angular.copy(condition);
            dldata.payoutSubpolicy.BConditions.push(con);
            dldata.conditionValueType = 'text';

            datalayer.resetCondition();
        };

        var deleteCondition = function (condition, index) {
            if ((dldata.payoutSubpolicy.BConditions.length == 1)) {
                dldata.newCondition.RelationType = '';
            }
            if (condition.Id) {
                condition.ParentId = '';
                dldata.deleteConditions.push(condition);
            }

            dldata.payoutSubpolicy.BConditions.splice(index, 1);
            if (dldata.payoutSubpolicy.BConditions.length > 0) {
                dldata.payoutSubpolicy.BConditions[0].RelationType = "";
            }


            for (var i = index; i < dldata.payoutSubpolicy.BConditions.length; i++) {
                dldata.payoutSubpolicy.BConditions[i].Priority = i;
            }
        };

        var addNewOutput = function (output) {
            output.ConditionType = 'Output';
            output.ParentId = dldata.payoutSubpolicy.Id;
            output.Priority = dldata.payoutSubpolicy.BOutputs.length;
            var out = angular.copy(output);
            dldata.payoutSubpolicy.BOutputs.push(out);

            datalayer.resetOutput();
        };

        var deleteOutput = function (output, index) {
            dldata.deleteConditions = [];
            if (dldata.payoutSubpolicy.BOutputs.length == 1) {
                dldata.newOutput.Operator = '';
            }
            if (output.Id) {
                output.ParentId = '';
                dldata.deleteConditions.push(output);
            }

            dldata.payoutSubpolicy.BOutputs.splice(index, 1);
            if (angular.isDefined(dldata.payoutSubpolicy.BOutputs[0])) {
                dldata.payoutSubpolicy.BOutputs[0].Operator = "";
            }

            for (var i = index; i < dldata.payoutSubpolicy.BOutputs.length; i++) {
                dldata.payoutSubpolicy.BOutputs[i].Priority = i;
            }
        };

        var resetPayoutSubpolicy = function () {
            dldata.payoutSubpolicy = {};
            dldata.payoutSubpolicy.BConditions = [];
            dldata.payoutSubpolicy.BOutputs = [];
            dldata.deleteConditions = [];
            dldata.newCondition = {};
            dldata.newOutput = {};
            dldata.payoutSubpolicy.Category = "Liner";
            dldata.payoutSubpolicy.PayoutSubpolicyType = 'Subpolicy';
            datalayer.resetCondition();
            datalayer.resetOutput();
        };



        var watchPayoutSubpolicy = function () {
            if (angular.isUndefined(dldata.payoutSubpolicy))
                return false;
            var outResult = _.find(dldata.payoutSubpolicy.BOutputs, function (output) {
                return (output.Lsqlfunction != "");
            });

            dldata.outputWithFunction = (outResult) ? true : false;
        };

        var modelDateValidation = function (startDate, endDate) {
            if (angular.isUndefined(endDate) || endDate == null) {
                dldata.isModalDateValid = true;
                return;
            }
            startDate = moment(startDate);
            endDate = moment(endDate);
            dldata.isModalDateValid = (endDate > startDate);
        };

        return {
            disableIfRelationExists: disableIfRelationExists,
            checkDuplicateName: checkDuplicateName,
            addNewCondition: addNewCondition,
            deleteCondition: deleteCondition,
            addNewOutput: addNewOutput,
            deleteOutput: deleteOutput,
            resetPayoutSubpolicy: resetPayoutSubpolicy,
            watchPayoutSubpolicy: watchPayoutSubpolicy,
            modelDateValidation: modelDateValidation
        };
    }]);

csapp.controller('payoutSubpolicyCtrl', ['$scope', 'payoutSubpolicyDataLayer', 'payoutSubpolicyFactory', '$modal', '$csBillingModels',
    function ($scope, datalayer, factory, $modal, $csBillingModels) {
        (function () {
            $scope.factory = factory;
            $scope.datalayer = datalayer;
            $scope.dldata = datalayer.dldata;
            $scope.dldata.payoutSubpolicy = {};
            $scope.dldata.payoutSubpolicy.Category = "Liner";
            $scope.dldata.payoutSubpolicy.PayoutSubpolicyType = 'Subpolicy';
            $scope.dldata.newCondition = {};
            $scope.dldata.newCondition.Rtype = "Value";
            $scope.showDiv = false;
            $scope.payoutSubpolicy = $csBillingModels.models.BillingSubpolicy;
            $scope.datalayer.getProducts();
        })();

        $scope.openmodal = function () {
            $scope.modalData = {};
            $scope.modalData.forActivate = true;
            $scope.modalData.startDate = null;
            $scope.modalData.endDate = null;
            $modal.open({
                templateUrl: '/Billing/subpolicy/subpolicy-date-model.html',
                controller: 'subpolicydatemodel',
                resolve: {
                    modalData: function () {
                        return $scope.modalData;
                    }
                }
            });
        };
        $scope.changeProductCategory = function() {
            $scope.datalayer.changeProductCategory();
            $scope.addsubpolicy();
            $scope.showDiv = false;

        };

        $scope.selectPayoutSubpolicy = function (spayoutSubpolicy) {
            $scope.datalayer.selectPayoutSubpolicy(spayoutSubpolicy);
            $scope.showDiv = true;
        };

        $scope.addsubpolicy = function() {
            $scope.showDiv = true;
            $scope.dldata.payoutSubpolicy.Name = '';
            $scope.dldata.payoutSubpolicy.Id = '';
            $scope.dldata.policyapproved = false;
            $scope.dldata.payoutSubpolicy.Description = '';
            $scope.dldata.payoutSubpolicy.BConditions = [];
            $scope.dldata.payoutSubpolicy.BOutputs = [];
            $scope.dldata.deleteConditions = [];
            $scope.dldata.newCondition = {};
            $scope.dldata.newOutput = {};
            $scope.dldata.payoutSubpolicy.Category = "Liner";
            $scope.dldata.payoutSubpolicy.PayoutSubpolicyType = 'Subpolicy';
        };

        $scope.changeLeftTypeName = function (condition) {
            condition.RtypeName = '';
            $scope.dldata.selectedLeftColumn = _.find($scope.dldata.columnDefs, { field: condition.LtypeName });

            $scope.dldata.condRcolumnNames = _.filter($scope.dldata.columnDefs, { InputType: $scope.dldata.selectedLeftColumn.InputType });

            var inputType = $scope.dldata.selectedLeftColumn.InputType;
            if (inputType === "text") {
                condition.Operator = '';
                condition.Rtype = 'Value';
                condition.Rvalue = '';
                $scope.datalayer.getColumnValues(condition.LtypeName);
                return;
            }

            if (inputType === "checkbox") {
              condition.Operator = "EqualTo";
                condition.Rtype = 'Value';
                condition.Rvalue = '';
                return;
            }

            if (inputType === "dropdown") {
                $scope.dldata.conditionValues = $scope.dldata.selectedLeftColumn.dropDownValues;
                condition.Rtype = 'Value';
                condition.Rvalue = '';
                return;
            }

            condition.Operator = '';
            condition.Rtype = 'Value';
            condition.Rvalue = '';
        };

        $scope.$watch("payoutSubpolicy.BOutputs.length", factory.watchPayoutSubpolicy);

    }]);

csapp.controller('subpolicydatemodel', [
    '$scope', 'payoutSubpolicyDataLayer', 'payoutSubpolicyFactory', 'modalData', '$modalInstance',
    function ($scope, datalayer, factory, modaldata, $modalInstance) {
        $scope.datalayer = datalayer;
        $scope.dldata = datalayer.dldata;
        $scope.factory = factory;

        $scope.modalData = modaldata;

        $scope.closeModel = function () {
            $modalInstance.dismiss();
        };

        $scope.activateSubPolicy = function (modalData) {
            $scope.datalayer.activateSubPoicy(modalData).then(function () {
                $modalInstance.close();
            });
        };
    }

]);
