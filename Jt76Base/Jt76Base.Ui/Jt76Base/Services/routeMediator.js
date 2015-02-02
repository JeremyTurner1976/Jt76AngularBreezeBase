(function () {
    "use strict";

    var serviceId = "routeMediator";

    angular
        .module("app")
        .factory(serviceId, ["$location", "$rootScope", "config", "logger", routeMediator]);

    function routeMediator($location, $rootScope, config, logger) {
        var handlingRouteChangeError = false;

        var service = {
            setRoutingHandlers: setRoutingHandlers
        };

        return service;

        function setRoutingHandlers() {
            updateDocTitle();
            handleRoutingErrors();
            handleInitialLoad();
        }

        function handleInitialLoad() {
            $rootScope.$on("$routeChangeSuccess",
            function (event, current, previous) {
                $rootScope.bInitialLoad = false; //set in common
            });
        }

        function updateDocTitle() {
            $rootScope.$on("$routeChangeSuccess",
                function (event, current, previous) {
                    var title = config.docTitle + " " + (current.title || "Loading");
                    $rootScope.title = title;
                    handlingRouteChangeError = false;
                });
        }

        function handleRoutingErrors() {
            $rootScope.$on("$routeChangeError",
                function (event, current, previous, rejection) {
                    if (handlingRouteChangeError) { return;}
                        handlingRouteChangeError = true;
                        var msg = "Error routing: " + (current && current.name)
                            + ". " + (rejection.msg || "");
                    logger.logWarning(msg, current, serviceId, true);
                    //TODO alert to user
                    $location.path("/");
                });
        }
    }
})();