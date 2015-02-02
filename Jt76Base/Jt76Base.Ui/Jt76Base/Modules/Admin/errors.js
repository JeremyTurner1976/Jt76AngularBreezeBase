(function () {
    "use strict";

    var controllerId = "errors";
    angular.module("app").controller(controllerId,
        ["$routeParams", "$location", "common", "dataContext", "config", errors]);

    function errors($routeParams, $location, common, dataContext, config) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, "error");
        var logSuccess = getLogFn(controllerId, "success");
        var keyCodes = config.keyCodes;

        var vm = this;
        common.$rootScope.strTitle = "Admin Errors";
        common.$rootScope.htmlTitleMessage = "Handle your business.";

        //errors
        vm.errors = [];
        vm.nErrorsCount = 0;

        //implement order by
        vm.orderBy = orderBy;
        vm.strOrderBy = "";
        vm.orderByNames = {
            dtCreated: "Created",
            strMessage: "Message",
            strSource: "Source and Level",
            strAdditionalInformation: "Additional Information"
        };
        vm.order = [
            "Created",
            "Message",
            "Source and Level",
            "Additional Information"
        ];

        //implement search
        vm.filteredErrors = [];
        vm.nFilteredErrorsCount = 0;

        vm.errorsSearchFunction = errorsSearchFunction;
        vm.errorsSearch = "";
        vm.errorsFilter = errorsFilter;
        var applyErrorsFilter = function () { }

        //implement paging
        vm.errorsPaging = {
            nCurrentPage: 1,
            nMaxPagesToShow: 10,
            nPageSize: 10,
            bShow: true
        }
        vm.errorsPageChanged = errorsPageChanged;

        Object.defineProperty(vm.errorsPaging, "nPageCount", {
            get: function () {
                var nCount = Math.ceil(vm.nErrorsCount / vm.errorsPaging.nPageSize);
                return nCount > 0 ? nCount : 1;
            }
        });

        //implement refresh
        vm.refreshErrors = refreshErrors;

        //implement drilldown
        vm.gotoError = gotoError;

        //implement add
        vm.addError = addError;

        //implement sim
        vm.simError = simError;

        activate();

        function activate() {
            var promises = [getErrors(false)]; //true load all fresh
            common.activateController(promises, controllerId)
            .then(function () {
                logSuccess("Activated " + common.$rootScope.strTitle + " View");

                //set the non changing models once
                vm.errors = vm.filteredErrors;
                vm.nErrorsCount = vm.errors.length;

                //createSearchThrottle assumes strong names 
                //vm.[name]Search is the search string
                //vm.[name] is the original unfiltered array
                //vm.filtered[Name] is the filtered array
                //vm.nFiltered[Name]Count is the filtered array count
                //vm.[Name]Paging is the page object and holds bShow
                //vm.[name]Filter is the filtering action
                applyErrorsFilter = common.createSearchThrottle(vm, "errors");
                //applyErrorsFilter(true); //true for no delay

                //call the cached results for the paged display
                getErrors(false, vm.errorsPaging.nCurrentPage, vm.errorsPaging.nPageSize);
            });
        }

        //gets
        function getErrors(bForceRefresh, nPage, nPageSize) {
            return dataContext.errors.getAll(bForceRefresh, nPage, nPageSize, vm.strOrderBy).then(function (data) {
                vm.errorsPaging.bShow = true; //getAll is always paged
                vm.filteredErrors = data;
                vm.nFilteredErrorsCount = vm.filteredErrors.length;
            });
        }

        //search functions
        function errorsSearchFunction($event) {
            //go back to paged view
            if ($event.keyCode === keyCodes.esc || vm.errorsSearch === "") {
                vm.errorsSearch = "";
                applyErrorsFilter(true); //turn off the error filter by calling with no delay
                getErrors(false, vm.errorsPaging.nCurrentPage, vm.errorsPaging.nPageSize); //get the paged list
                return;
            }
            //full filtered list
            applyErrorsFilter(false);
        }

        //filters
        function errorsFilter(error) {
            var isMatch = vm.errorsSearch ? (common.textContains(error.strConcatAll, vm.errorsSearch)) : true;
            vm.nFilteredErrorsCount += isMatch ? 1 : 0;
            return isMatch;
        }

        //page changed
        function errorsPageChanged(page) {
            if (!page) {
                return;
            }
            vm.errorsPaging.nCurrentPage = page;
            getErrors(false, vm.errorsPaging.nCurrentPage, vm.errorsPaging.nPageSize);
        }

        //refreshes then repages
        function refreshErrors() {
            return dataContext.errors.getAll(true).then(function (data) {
                vm.errorsSearch = "";
                vm.strOrderBy = "";
                vm.errorsPaging.nCurrentPage = 1;

                //update the counts on a full reload
                vm.errors = data;
                vm.nErrorsCount = data.length;

                getErrors(false, vm.errorsPaging.nCurrentPage, vm.errorsPaging.nPageSize);
            });
        }

        //navigation
        function gotoError(error) {
            if (error && error.id) {
                $location.path("/admin/errors/" + error.id);
            }
        }

        //sorts
        function orderBy(strOrder) {
            vm.strOrderBy = "";

            $.each(vm.orderByNames, function (key, value) {
                if (value === strOrder)
                    vm.strOrderBy = key;
            });

            if (strOrder.substr(0,2).indexOf("dt") === 0)
                vm.strOrderBy += " desc";
            else if (strOrder.length > 0)
                vm.strOrderBy += " asc";

            getErrors(false, vm.errorsPaging.nCurrentPage, vm.errorsPaging.nPageSize);
        }

        //add error
        function addError() {
            $location.path("/admin/errors/newError");
        }

        //simulate error
        function simError() {
            window.setTimeout(functionToRun, 1 * 1000);;
            return $q.when("");
        }

        //set a timed event
        var timeoutId = -1;

        function functionToRun() {
            logError("New error created and logged.");
            refreshErrors();
        }

        function delayRun() {
            timeoutId = setTimeout(functionToRun, 2 * 1000);
        }

        function cancelRun() {
            if (timeoutId === -1)
                return;

            clearTimeout(timeoutId);

            timeoutId = -1;
        }
    }
})();