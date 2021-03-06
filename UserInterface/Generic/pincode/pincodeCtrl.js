﻿csapp.controller("pincodeCtrl", ["$scope", "pincodeDataLayer", "$location", "$csModels",
    function ($scope, datalayer, $location, $csModels) {
        (function () {
            $scope.datalayer = datalayer;
            $scope.dldata = datalayer.dldata;
            $scope.dldata.Regions = [];
            $scope.dldata.States = [];
            $scope.dldata.Clusters = [];
            $scope.dldata.Districts = [];
            $scope.dldata.City = [];
            datalayer.getCityCategory();
            datalayer.getRegion();
            datalayer.getState();
            datalayer.getCluster();
            datalayer.getDistrict();
            datalayer.getCity();
            datalayer.getState();
            //datalayer.getWholePincode();
            $scope.eGPincodeModel = $csModels.getColumns("Pincode");
            $scope.dldata.PincodeUintList = [];
        })();

        $scope.openAddEditModal = function (mode, gPincodes) {
            if (mode === "edit") {
                $location.path("/generic/pincode/addedit/" + mode + "/" + gPincodes.Id);
            } else {
                $location.path("/generic/pincode/addedit/" + mode);
            }
        };

        //$scope.openAddEditModal = function (mode, gPincodes) {
        //    $modal.open({
        //        templateUrl: baseUrl + 'Generic/pincode/editPincode-modal.html',
        //        controller: 'editPincodeModalController',
        //        resolve: {
        //            gPincodes: function () {
        //                return {
        //                    gpincode: angular.copy(gPincodes),
        //                    displaymode: mode
        //                };
        //            }
        //        }

        //    });
        //};
    }]);

csapp.factory("pincodeDataLayer", ["Restangular", "$csnotify", "$csfactory",
    function (rest, $csnotify, $csfactory) {
        var dldata = {
            GPincodes: [],
            PincodeUintList: []
        };

        var pincodeApi = rest.all('PincodeApi');

        var showErrorMessage = function (response) {
            $csnotify.error(response.data);
        };

        var getState = function () {
            return pincodeApi.customGETLIST("GetStates").then(function (data) {
                dldata.States = data;
            }, showErrorMessage);
        };

        var getCityCategory = function () {
            return pincodeApi.customGETLIST("GetCityCategory").then(function (data) {
                dldata.CityCategory = data;
            }, showErrorMessage);
        };

        var getRegion = function () {
            return pincodeApi.customGETLIST("GetRegions").then(function (data) {
                dldata.Regions = data;
            }, showErrorMessage);
        };

        var getCluster = function () {
            return pincodeApi.customGETLIST("GetClusters").then(function (data) {
                dldata.Clusters = data;
            }, showErrorMessage);
        };

        var getDistrict = function () {
            return pincodeApi.customGETLIST("GetDistricts").then(function (data) {
                dldata.Districts = data;
            }, showErrorMessage);
        };

        var getCity = function () {
            return pincodeApi.customGETLIST("GetCity").then(function (data) {
                dldata.City = data;
            }, showErrorMessage);
        };

        var changeState = function (stateName) {
            if ($csfactory.isNullOrEmptyString(stateName)) return;
            pincodeApi.customGET("GetPincodes", { state: stateName }).then(function (data) {
                dldata.GPincodes = data;
                dldata.stateClusters = _.uniq(_.pluck(dldata.GPincodes, 'Cluster'));
                $csnotify.success("Pincodes loaded successfully");
            }, showErrorMessage);

        };

        var getData = function () {

            if (angular.isUndefined(dldata.GPincodedata)) {
                dldata.GPincodedata = {};
                dldata.GPincodedata.Country = 'India';
            }

            //#region Set value in Object

            //#endregion

            var gPincodedata = dldata.GPincodedata;

            return pincodeApi.customPOST(gPincodedata, "GetWholedata").then(function (data2) {
                if (angular.isUndefined(gPincodedata.Region) || gPincodedata.Region == "") {
                    dldata.RegionList = _.uniq(data2);
                    return;
                }
            }, showErrorMessage);
        };

        var getStateData = function (region) {
            var pincodeData = { Country: 'India', Region: region };
            return pincodeApi.customPOST(pincodeData, "GetWholedata").then(function (data2) {
                dldata.StateList = _.uniq(data2);
                return dldata.StateList;
            });
        };

        var getClusterData = function (region, state) {
            var pincodeData = { Country: 'India', Region: region, State: state };
            return pincodeApi.customPOST(pincodeData, "GetWholedata").then(function (data2) {
                dldata.ClusterList = _.uniq(data2);
                return dldata.ClusterList;
            });
        };

        var getDistrictData = function (region, state, cluster) {
            var pincodeData = { Country: 'India', Region: region, State: state, Cluster: cluster };
            return pincodeApi.customPOST(pincodeData, "GetWholedata").then(function (data2) {
                dldata.DistrictList = _.uniq(data2);
                return dldata.DistrictList;
            });
        };

        var getCityData = function (region, state, cluster, district) {
            var pincodeData = { Country: 'India', Region: region, State: state, Cluster: cluster, District: district };
            return pincodeApi.customPOST(pincodeData, "GetWholedata").then(function (data2) {
                dldata.CityList = _.uniq(data2);
                return dldata.CityList;
            });
        };

        var getWholePincode = function () {
            if (!$csfactory.isNullOrEmptyArray(dldata.PincodeUintList)) {
                pincodeApi.customGET('GetWholePincode').then(function (data) {
                    dldata.PincodeUintList = data;
                });
            } else {
                pincodeApi.customGET('GetWholePincode').then(function (data) {
                    dldata.PincodeUintList = data;
                });
            }
            return;
        };

        var pincodeArea = function (value, level) {
            return pincodeApi.customGET('GetPincodesArea', { area: value, city: level })
                .then(function (data) {
                    return data;
                });
        };

        var pincodeCity = function (city, district) {
            return pincodeApi.customGET('GetPincodeCity', { city: city, district: district }).then(function (data) {
                return data;
            });
        };

        var editPincode = function (gpincode, mode) {
            if (mode === "edit") {
                return pincodeApi.customPUT(gpincode, "Put", { id: gpincode.Id }).then(function (data) {
                    dldata.GPincodes = _.reject(dldata.GPincodes, function (pincode) { return pincode.Id == gpincode.Id; });
                    dldata.GPincodes.push(data);
                    dldata.PincodeUintList.push(data);
                    dldata.showTextBox = false;
                    dldata.isInEditMode = false;
                    $csnotify.success("Data saved");
                    return;
                }, showErrorMessage);
            } else {
                return pincodeApi.customPOST(gpincode, 'Post').then(function (data) {
                    $csnotify.success("Pincode saved..!!");
                    dldata.GPincodes.push(data);
                    dldata.PincodeUintList.push(data);
                    return data;
                }, function (data) {
                    $csnotify.error("Error occured, can't saved", data);
                });
            }
        };

        var getPincode = function (detailsid) {
            return pincodeApi.customGET('Get', { id: detailsid })
                .then(function (data) {
                    return data;
                }, function (data) {
                    $csnotify.error("Error occured, can't saved", data);
                });
        };

        return {
            dldata: dldata,
            getRegion: getRegion,
            getState: getState,
            getCityCategory: getCityCategory,
            getCluster: getCluster,
            getDistrict: getDistrict,
            changeState: changeState,
            getCity: getCity,
            getData: getData,
            getStateData: getStateData,
            getClusterData: getClusterData,
            getDistrictData: getDistrictData,
            getCityData: getCityData,
            getWholePincode: getWholePincode,
            pincodeArea: pincodeArea,
            pincodeCity: pincodeCity,
            editPincode: editPincode,
            Get: getPincode,
        };

    }]);

csapp.factory("pincodeFactory", ["pincodeDataLayer",
    function (datalayer) {

        var dldata = datalayer.dldata;
        var regionChange = function () {
            if (angular.isDefined(dldata.GPincodedata.State)) {
                dldata.GPincodedata.State = '';
                dldata.GPincodedata.Cluster = '';
                dldata.GPincodedata.District = '';
                dldata.GPincodedata.City = '';
                dldata.GPincodedata.CityCategory = '';
                dldata.GPincodedata.Area = '';
                dldata.showTextBox = false;
                dldata.GPincodedata.Pincode = '';
            }
        };

        var stateChange = function () {
            if (angular.isDefined(dldata.GPincodedata.Cluster)) {
                dldata.GPincodedata.Cluster = '';
                dldata.GPincodedata.District = '';
                dldata.GPincodedata.City = '';
                dldata.GPincodedata.CityCategory = '';
                dldata.GPincodedata.citydata = false;
                dldata.GPincodedata.Area = '';
                dldata.GPincodedata.Pincode = '';
            }
        };

        var clusterChange = function () {
            if (angular.isDefined(dldata.GPincodedata.District)) {
                dldata.GPincodedata.District = '';
                dldata.GPincodedata.City = '';
                dldata.GPincodedata.CityCategory = '';
                dldata.GPincodedata.citydata = false;
                dldata.GPincodedata.Area = '';
                dldata.GPincodedata.Pincode = '';
            }
        };

        var districtChange = function () {
            if (angular.isDefined(dldata.GPincodedata.City)) {
                dldata.GPincodedata.City = '';
                dldata.GPincodedata.CityCategory = '';
                dldata.GPincodedata.Area = '';
                dldata.GPincodedata.Pincode = '';
            }
        };

        var areaChange = function () {
            if (angular.isDefined(dldata.GPincodedata.Pincode)) {
                dldata.GPincodedata.Pincode = '';
            }
        };

        var reset = function (gpincode) {
            gpincode.Region = '';
            gpincode.State = '';
            gpincode.Cluster = '';
            gpincode.District = '';
            gpincode.City = '';
            gpincode.CityCategory = '';
            gpincode.Area = '';
            gpincode.Pincode = '';
        };

        var resetedit = function (gpincode) {
            gpincode.City = '';
            gpincode.CityCategory = '';
            gpincode.Area = '';
        };

        return {
            regionChange: regionChange,
            stateChange: stateChange,
            clusterChange: clusterChange,
            districtChange: districtChange,
            areaChange: areaChange,
            reset: reset,
            resetedit: resetedit,
        };
    }]);

csapp.controller("editPincodeModalController", ["$scope", "pincodeDataLayer", "$routeParams",
    "$csModels", "pincodeFactory", "$csnotify", "$location",
    function ($scope, datalayer, $routeParams, $csModels, factory, $csnotify, $location) {

        $scope.getRegion = function () {
            datalayer.getData().then(function () {
                $scope.eGPincodeModel.Region.valueList = datalayer.dldata.RegionList;
            });
        };

        (function () {
            $scope.datalayer = datalayer;
            $scope.dldata = datalayer.dldata;
            $scope.eGPincodeModel = $csModels.getColumns("Pincode");
            if (angular.isDefined($routeParams.id)) {
                datalayer.Get($routeParams.id).then(function (data) {
                    $scope.GPincodedata = data;
                    $scope.eGPincodeModel.Region.valueList = datalayer.dldata.Regions;
                    $scope.eGPincodeModel.State.valueList = datalayer.dldata.States;
                    $scope.eGPincodeModel.Cluster.valueList = datalayer.dldata.Clusters;
                    $scope.eGPincodeModel.District.valueList = datalayer.dldata.Districts;
                    $scope.eGPincodeModel.City.valueList = datalayer.dldata.City;
                });
            } else {
                $scope.GPincodedata = {
                    Country: "India",
                    Region: '',
                    Cluster: '',
                    District: '',
                    City: '',
                    CityCategory: '',
                    Area: '',
                    Pincode: '',
                };
                $scope.getRegion();
            }
            datalayer.getWholePincode();
        })();

        var dldata = datalayer.dldata;
        $scope.getState = function (region) {
            datalayer.getStateData(region).then(function (data) {
                $scope.eGPincodeModel.State.valueList = data;
            });
        };

        $scope.getCluster = function (region, state) {
            datalayer.getClusterData(region, state).then(function (data) {
                $scope.eGPincodeModel.Cluster.valueList = data;
            });
        };

        $scope.getDistrict = function (region, state, cluster) {
            datalayer.getDistrictData(region, state, cluster).then(function (data) {
                $scope.eGPincodeModel.District.valueList = data;
            });
        };

        $scope.getCity = function (region, state, cluster, district) {
            datalayer.getCityData(region, state, cluster, district).then(function (data) {
                $scope.eGPincodeModel.City.valueList = data;
            });
        };

        $scope.pincodedata = function (pincode) {
            factory.pincodedata(pincode);
        };

        $scope.save = function (pincode, mode) {
            if ($routeParams.mode === 'add') {
                pincode.IsInUse = 'true';
            }
            datalayer.editPincode(pincode, mode).then(function (data) {
                $scope.GPincodedata.Region = '';
                $scope.GPincodedata.State = '';
                $scope.GPincodedata.Cluster = '';
                $scope.GPincodedata.District = '';
                $scope.GPincodedata.City = '';
                $scope.GPincodedata.CityCategory = '';
                $scope.GPincodedata.Area = '';
                $scope.GPincodedata.Pincode = '';
                $location.path("/generic/pincode");
            });
        };

        $scope.closeEditModel = function () {
            if (angular.isDefined($scope.GPincodedata))
                $scope.GPincodedata.Region = '';
            $scope.GPincodedata.State = '';
            $scope.GPincodedata.Cluster = '';
            $scope.GPincodedata.District = '';
            $scope.GPincodedata.City = '';
            $scope.GPincodedata.CityCategory = '';
            $scope.GPincodedata.Area = '';
            $scope.GPincodedata.Pincode = '';
            $location.path("/generic/pincode");
        };

        $scope.reset = function (gpincode,form) {
            factory.reset(gpincode);
            form.$setPristine();
        };

        $scope.resetedit = function (gpincode) {
            factory.resetedit(gpincode);
        };


        $scope.regionChange = function () {
            factory.regionChange();
        };

        $scope.stateChange = function () {
            factory.stateChange();
        };

        $scope.clusterChange = function () {
            factory.clusterChange();
        };

        $scope.districtChange = function () {
            factory.districtChange();
        };

        $scope.areaChange = function () {
            factory.areaChange();
        };

        $scope.addCity = function () {
            $scope.showTextBox = true;
        };

        $scope.pincodeArea = function (value, city) {
            if (value.length >= 3) {
                return datalayer.pincodeArea(value, city);
            }
        };

        $scope.pincodeCity = function (value, city) {
            if (value.length >= 3) {
                return datalayer.pincodeCity(value, city);
            }
        };

        $scope.cancelCity = function () {
            $scope.showTextBox = false;
        };

        $scope.pincodedata = function (pincode) {
            var pincodeexist = parseInt(pincode);
            if ($routeParams.mode === 'add') {
                var isExist = _.find(dldata.PincodeUintList, function (item) {
                    return item == pincodeexist;
                });
                if (angular.isDefined(isExist)) {
                    $scope.alreadyExist = true;
                    $csnotify.success("Pincode Already Exist");
                } else {
                    $scope.alreadyExist = false;
                }
            }
            return dldata.PincodeUintList.indexOf(pincodeexist) === -1;
        };

        //$scope.pincodeCheck = function (value) {
        //    var data = dldata.PincodeUintList;
        //    return data.indexOf(value) === -1;
        //};



        (function (mode) {
            switch (mode) {
                case "add":
                    $scope.modelTitle = "Add New Pincode";
                    break;
                case "edit":
                    $scope.modelTitle = "Edit Pincode";
                    break;
                default:
                    throw ("Invalid display mode : " + JSON.stringify(gPincodes));
            }
            $scope.mode = mode;
        })($routeParams.mode);
    }]);

