(function () {
    "use strict";
    var controllerId = "errorDetails";
    angular.module("app").controller(controllerId,
    ["$routeParams", "$scope", "$window", "$location", "common", "dataContext", "config", "bootstrap.dialog", errorDetails]);

    function errorDetails($routeParams, $scope, $window, $location, common, dataContext, config, bootStrapDialog) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, "error");
        var logSuccess = getLogFn(controllerId, "success");

        var requestEvents = {
            newError: "newError"
        }

        var vm = this;
        common.$rootScope.strTitle = "Admin Error";
        common.$rootScope.htmlTitleMessage = "Handle your business.";

        vm.getErrorMessage = getErrorMessage;
        vm.error = [];

        //selects
        vm.lookupErrorLevels = [];

        //save methods
        vm.isSaving = false;
        vm.goBack = goBack;
        vm.cancel = cancel;
        vm.save = save;
        Object.defineProperty(vm, "canSave", {
            get: canSave
        });
        vm.hasChanges = false;
        function canSave() {
            return (vm.hasChanges || isNewError()) && !vm.isSaving && $scope.Form.$valid;
        }

        //delete
        vm.deleteError = deleteError;

        //delete visibility
        vm.bShowDelete = false;

        activate();

        function activate() {
            onDestroy();
            onHasChanges();

            var promises = [getRequestedError(false), getLookupErrorLevels()];
            common.activateController(promises, controllerId)
                .then(function () {
                    logSuccess("Activated " + getErrorMessage() + " View");
                });
        }

        function getLookupErrorLevels() {
            log("Gathered data for the lookup error level dropdown");
            return vm.lookupErrorLevels = dataContext.lookups.lookupCachedData.errorLevels;
        }

        function getRequestedError(bForceRefresh) {
            var nErrorId = $routeParams.id;

            if (isNewError()) {
                var newError = dataContext.errors.create();
                vm.bShowDelete = false;
                return vm.error = newError;
            }

            //otherwise an edit request
            return dataContext.errors.getById(nErrorId, bForceRefresh).then(function (data) {
                vm.error = data;

                vm.bShowDelete = true;
            }, function (error) {
                logError("Unable to get error " + nErrorId);
            });
        }

        function getErrorMessage() {
            if (vm.error) {
                var strErrorMessage = vm.error.strMessage || "New Error";
                if (strErrorMessage.length >= 50)
                    strErrorMessage = vm.error.strMessage.substr(0, 50) + "...";
                return "Error: " + strErrorMessage;
            }
            return "Error: " + "New Error";
        }

        function goBack() {
            $window.history.back();
            //could have change logic
        }

        function isNewError() {
            return $routeParams.id === requestEvents.newError;
        }

        function cancel() {
            dataContext.cancel();
            if (!vm.error.entityAspect.entityState.isUnchanged()) {
                logError("The error was not cancelled");
            } else {
                getRequestedError(false);
            }
        }

        function gotoErrors() {
            $location.path("/admin/errors");
        }

        function save() {
            vm.isSaving = true;

            return dataContext.save()
            .then(function (saveResult) {
                vm.isSaving = false;
                logSuccess("The error has been saved");
            }, function (error) {
                vm.isSaving = false;
            });
        }

        //angular events, subscriber events
        function onDestroy() {
            $scope.$on("$destroy", function () {
                dataContext.cancel();
            });
        }

        function onHasChanges() {
            $scope.$on(config.events.hasChangesChanged, function (event, data) {
                vm.hasChanges = data.hasChanges && !isNewError();
            });
        }

        function deleteError() {
            var strMessage = vm.error.strMessage || "This item";

            return bootStrapDialog.deleteDialog(getErrorMessage(), "This message will be erased.")
            .then(confirmDelete); //second function for no

            function confirmDelete() {
                dataContext.markDeleted(vm.error);
                vm.save().then(success, failed); //saveError()

                function success() {
                    log(strMessage + " has been deleted");
                    gotoErrors();
                }

                function failed(error) {
                    cancel();
                }
            }
        }
    }
})();