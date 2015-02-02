(function () {
    "use strict";

    // Define the common module 
    // Contains services:
    //  - common
    //  - logger
    var commonModule = angular.module("common", []);

    // Must configure the common service and set its 
    // events via the commonConfigProvider
    commonModule.provider("commonConfig", function () {
        this.config = {
            // These are the properties we need to set
            controllerActivateSuccessEvent: ""
        };

        this.$get = function () {
            return {
                config: this.config
            };
        };
    });

    commonModule.factory("common",
        ["$q", "$rootScope", "$timeout", "commonConfig", "logger", common]);

    function common($q, $rootScope, $timeout, commonConfig, logger) {
        var throttles = {};

        //setup initial rootscope values
        $rootScope.bInitialLoad = true;

        var service = {
            // common angular dependencies - bundled together
            $broadcast: $broadcast, //event publishing
            $q: $q,
            $timeout: $timeout,
            $rootScope: $rootScope,
            // generic
            activateController: activateController,
            createSearchThrottle: createSearchThrottle,
            debouncedThrottle: debouncedThrottle,
            isNumber: isNumber,
            logger: logger, // for accessibility
            textContains: textContains,
            textContainsIgnoreCase: textContainsIgnoreCase,
            getFormattedLocalTime: getFormattedLocalTime,
            getFormattedShortLocalTime: getFormattedShortLocalTime
        };

        return service;

        function activateController(promises, controllerId) {
            return $q.all(promises).then(function (eventArgs) {
                var data = { controllerId: controllerId };
                $broadcast(commonConfig.config.controllerActivateSuccessEvent, data);
            });
        }

        function $broadcast() {
            return $rootScope.$broadcast.apply($rootScope, arguments);
        }

        function createSearchThrottle(viewmodel, list, filteredList, filteredListCount, filter, paging, delay) {
            // After a delay, search a viewmodel's list using 
            // a filter function, and return a filteredList.

            // custom delay or use default
            delay = +delay || 400;
            // if only vm and list parameters were passed, set others by naming convention 
            if (!filteredList) {
                paging = list + "Paging";
                // assuming list is named sessions, filteredList is filteredSessions
                filteredList = "filtered" + list[0].toUpperCase() + list.substr(1); //capitalize first letter
                // assuming list is named sessions, filteredListCount is nFilteredSessionsCount 
                filteredListCount = "nFiltered" + list[0].toUpperCase() + list.substr(1) + "Count";
                // filter function is named sessionFilter
                filter = list + "Filter"; // function in string form
            }

            // create the filtering function we will call from here
            var filterFn = function () {
                // translates to ...
                // vm.filteredSessions 
                //      = vm.sessions.filter(function(item( { returns vm.sessionFilter (item) } ); true or false is match return
                viewmodel[filteredList] = viewmodel[list].filter(function(item) {
                    return viewmodel[filter](item);
                });
                //reset the filtered count
                viewmodel[filteredListCount] = viewmodel[filteredList].length;
                //hide paging
                viewmodel[paging].bShow = false;
            };

            return (function () {
                // Wrapped in outer IFFE so we can use closure 
                // over filterInputTimeout which references the timeout
                var filterInputTimeout;

                // return what becomes the 'applyFilter' function in the controller
                return function(searchNow) {
                    if (filterInputTimeout) {
                        $timeout.cancel(filterInputTimeout);
                        filterInputTimeout = null;
                    }
                    if (searchNow || !delay) {
                        filterFn();
                    } else {
                        filterInputTimeout = $timeout(filterFn, delay);
                    }
                };
            })();
        }

        function debouncedThrottle(key, callback, delay, immediate) {
            // Perform some action (callback) after a delay. 
            // Track the callback by key, so if the same callback 
            // is issued again, restart the delay.

            var defaultDelay = 1000;
            delay = delay || defaultDelay;
            if (throttles[key]) {
                $timeout.cancel(throttles[key]);
                throttles[key] = undefined;
            }
            if (immediate) {
                callback();
            } else {
                throttles[key] = $timeout(callback, delay);
            }
        }

        function isNumber(val) {
            // negative or positive
            return /^[-]?\d+$/.test(val);
        }

        function textContainsIgnoreCase(text, searchText) {
            return text && -1 !== text.indexOf(searchText);
        }

        function textContains(text, searchText) {
            return text && -1 !== text.toLowerCase().indexOf(searchText.toLowerCase());
        }

        //formats dates, useful if not using data-jt76-date="date" directive, or using preset
        //preset = data-ng-bind-html="i.dtCreated | date: ' MMM d, yyyy h:mm:ss a'"
        function getFormattedLocalTime(dtCreated) {
            var localValue = moment.utc(dtCreated).toDate();
            var formattedValue = moment(localValue).format("MMMM Do YYYY, h:mm:ss a");
            return formattedValue;
        }

        //formats dates, in a short format
        function getFormattedShortLocalTime(dtCreated) {
            var localValue = moment.utc(dtCreated).toDate();
            var formattedValue = moment(localValue).format("MM/DD/YY h:mm a");
            return formattedValue;
        }
    }
})();