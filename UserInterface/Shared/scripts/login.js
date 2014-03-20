﻿
csapp.factory("$csAuthFactory", function () {

    var authInfo = {
        isAuthorized: false,
        username: ''
    };

    var hasLoggedIn = function () {
        return authInfo.isAuthorized;
    };

    var loginUser = function (user) {
        authInfo.isAuthorized = true;
        authInfo.username = user;
    };

    var getUsername = function() {
        return authInfo.username;
    };

    var logoutUser = function () {
        authInfo.isAuthorized = false;
        authInfo.username = undefined;
    };

    var testingMode = function() {
        return true;
    };

    return {
        hasLoggedIn: hasLoggedIn,
        loginUser: loginUser,
        logoutUser: logoutUser,
        getUsername: getUsername,
        testingMode: testingMode
    };

});


csapp.controller("loginController", ["$scope", "$modalInstance", "$csAuthFactory", "Logger",
    function ($scope, $modalInstance, $csAuthFactory, logManager) {
        $scope.loginErrorMessage = "Invalid username or password.";
        $scope.login = {
            error: false,
            showForgot: false
        };
        var $log = logManager.getInstance("loginModalController");
        $csAuthFactory.logoutUser();

        $scope.loginUser = function (login) {
            if (login.username === login.password) {
                $csAuthFactory.loginUser(login.username);
                $log.info(login.username + " has logged in.");
                $modalInstance.close(login.username);
            } else {
                login.error = true;
            }
        };

        $scope.forgotPassword = function () {
            $scope.login.showForgot = true;
        };
    }]);

csapp.controller('LoginCtrl', ["$scope", "$modal", "$location", function ($scope, $modal, $location) {
    var modalInst = $modal.open({
        controller: "loginController",
        templateUrl: "/Shared/templates/login.html",
        backdrop: false,
        keyboard: false
    });

    modalInst.result.then(function() {
        $location.path("/home");
    });
}]);