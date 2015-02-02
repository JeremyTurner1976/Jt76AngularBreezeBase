(function () {
    "use strict";

    var controllerId = "logMessages";
    angular.module("app").controller(controllerId,
        ["$routeParams", "$location", "common", "dataContext", "config", logMessages]);

    function logMessages($routeParams, $location, common, dataContext, config) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, "error");
        var logSuccess = getLogFn(controllerId, "success");
        var keyCodes = config.keyCodes;

        var vm = this;
        common.$rootScope.strTitle = "Admin Log Messages";
        common.$rootScope.htmlTitleMessage = "Handle your business.";

        //logMessages
        vm.logMessages = [];
        vm.nLogMessagesCount = 0;

        //implement order by
        vm.orderBy = orderBy;
        vm.strOrderBy = "";
        vm.orderByNames = {
            dtCreated: "Created",
            strLogMessage: "Log Message"
        };
        vm.order = [
            "Created",
            "Log Message"
        ];

        //implement search
        vm.filteredLogMessages = [];
        vm.nFilteredLogMessagesCount = 0;

        vm.logMessagesSearchFunction = logMessagesSearchFunction;
        vm.logMessagesSearch = "";
        vm.logMessagesFilter = logMessagesFilter;
        var applyLogMessagesFilter = function () { }

        //implement paging
        vm.logMessagesPaging = {
            nCurrentPage: 1,
            nMaxPagesToShow: 10,
            nPageSize: 10,
            bShow: true
        }
        vm.logMessagesPageChanged = logMessagesPageChanged;

        Object.defineProperty(vm.logMessagesPaging, "nPageCount", {
            get: function () {
                var nCount = Math.ceil(vm.nLogMessagesCount / vm.logMessagesPaging.nPageSize);
                return nCount > 0 ? nCount : 1;
            }
        });

        //implement refresh
        vm.refreshLogMessages = refreshLogMessages;

        //implement drilldown
        vm.gotoError = gotoError;

        activate();

        function activate() {
            var promises = [getLogMessages(false)]; //true load all fresh
            common.activateController(promises, controllerId)
            .then(function () {
                logSuccess("Activated " + common.$rootScope.strTitle + " View");

                //set the non changing models once
                vm.logMessages = vm.filteredLogMessages;
                vm.nLogMessagesCount = vm.logMessages.length;

                //createSearchThrottle assumes strong names 
                //vm.[name]Search is the search string
                //vm.[name] is the original unfiltered array
                //vm.filtered[Name] is the filtered array
                //vm.nFiltered[Name]Count is the filtered array count
                //vm.[Name]Paging is the page object and holds bShow
                //vm.[name]Filter is the filtering action
                applyLogMessagesFilter = common.createSearchThrottle(vm, "logMessages");
                //applyLogMessagesFilter(true); //true for no delay

                //call the cached results for the paged display
                getLogMessages(false, vm.logMessagesPaging.nCurrentPage, vm.logMessagesPaging.nPageSize);
            });
        }

        //gets
        function getLogMessages(bForceRefresh, nPage, nPageSize) {
            return dataContext.logMessages.getAll(bForceRefresh, nPage, nPageSize, vm.strOrderBy).then(function (data) {
                vm.logMessagesPaging.bShow = true; //getAll is always paged
                vm.filteredLogMessages = data;
                vm.nFilteredLogMessagesCount = vm.filteredLogMessages.length;
            });
        }

        //search functions
        function logMessagesSearchFunction($event) {
            //go back to paged view
            if ($event.keyCode === keyCodes.esc || vm.logMessagesSearch === "") {
                vm.logMessagesSearch = "";
                applyLogMessagesFilter(true); //turn off the error filter by calling with no delay
                getLogMessages(false, vm.logMessagesPaging.nCurrentPage, vm.logMessagesPaging.nPageSize); //get the paged list
                return;
            }
            //full filtered list
            applyLogMessagesFilter(false);
        }

        //filters
        function logMessagesFilter(error) {
            var isMatch = vm.logMessagesSearch ? (common.textContains(error.strConcatAll, vm.logMessagesSearch)) : true;
            vm.nFilteredLogMessagesCount += isMatch ? 1 : 0;
            return isMatch;
        }

        //page changed
        function logMessagesPageChanged(page) {
            if (!page) {
                return;
            }
            vm.logMessagesPaging.nCurrentPage = page;
            getLogMessages(false, vm.logMessagesPaging.nCurrentPage, vm.logMessagesPaging.nPageSize);
        }

        //refreshes then repages
        function refreshLogMessages() {
            return dataContext.logMessages.getAll(true).then(function (data) {
                vm.logMessagesSearch = "";
                vm.logMessagesPaging.nCurrentPage = 1;
                getLogMessages(false, vm.logMessagesPaging.nCurrentPage, vm.logMessagesPaging.nPageSize);
            });
        }

        //navigation
        function gotoError(error) {
            if (error && error.id) {
                $location.path("/logMessages/" + error.id);
            }
        }

        //sorts
        function orderBy(strOrder) {
            vm.strOrderBy = "";

            $.each(vm.orderByNames, function (key, value) {
                if (value === strOrder)
                    vm.strOrderBy = key;
            });

            if (strOrder.substr(0, 2).indexOf("dt") === 0)
                vm.strOrderBy += " desc";
            else if (strOrder.length > 0)
                vm.strOrderBy += " asc";

            getLogMessages(false, vm.logMessagesPaging.nCurrentPage, vm.logMessagesPaging.nPageSize);
        }

    }
})();