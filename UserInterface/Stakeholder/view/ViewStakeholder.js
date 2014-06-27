﻿
csapp.factory('ViewStakeholderDatalayer', ["Restangular", function (rest) {

    var restApi = rest.all('ViewStakeApi');

    var getStakeholder = function () {
        return restApi.customGET('GetAllStakeHolders');
    };

    var getFilteredList = function (filterParam) {
        return restApi.customGET("GetFilteredList", { "filterParam": filterParam });
    };

    var searchStakeholder = function (param) {
        return restApi.customGET('GetStakeById', { 'param': param });
    };

    return {
        GetStakeholder: getStakeholder,
        GetFilteredList: getFilteredList,
        SearchStakeholder: searchStakeholder
    };

}]);

csapp.controller('viewStake', [
    '$scope', '$log', 'ViewStakeholderDatalayer', '$location', "$timeout",
    function ($scope, $log, datalayer, $location, $timeout) {

        var getAllStakeholders = function () {
            return datalayer.GetStakeholder().then(function (data) {
                $scope.stakeholders = data;
            });
        };

        (function () {
            //getAllStakeholders();
            $scope.fields = {
                filters: { type: 'enum', label: 'View' },
                Search: { placeholder: "enter ID/Name to edit", type: 'text' }
            };
            $scope.filterList = ['Approved', 'Unapproved', "Search"];
        })();

        $scope.switchPage = function (data, page) {
            switch (page.toUpperCase()) {
                case 'BASIC':
                    $location.path('/stakeholder/add/' + data.Id);
                    break;
                case 'PAYMENT':
                case 'WORKING':
                    $location.path('/stakeholder/working/edit/' + data.Id);
                    break;
                default:
                    throw "invalid page name " + page;
            }
        };

        $scope.searchStake = function (param) {
            if (param.length < 3) {
                return;
            }
            $timeout(function () {
                datalayer.SearchStakeholder(param).then(function (data) {
                    $scope.stakeholders = data;
                });
            }, 300
            );


        };

        $scope.getStakeholders = function (filterParam) {
            if (filterParam === 'Search') return;
            datalayer.GetFilteredList(filterParam).then(function (data) {
                $scope.stakeholders = data;
            });
        };
    }
]);
