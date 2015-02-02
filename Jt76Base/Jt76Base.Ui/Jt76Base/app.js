(function () {
    "use strict";

    window.app = angular.module("app", [
        // Angular modules 
        "ngAnimate", // animations
        "ngRoute", // routing
        "ngSanitize",       // sanitizes html bindings

        // Custom modules 
        "common",
        "common.bootstrap", // bootstrap dialog wrapper functions

        // Third Party
        "angular-loading-bar",
        "breeze.angular",
        "breeze.directives",
        "ui.bootstrap"      // ui-bootstrap (ex: carousel, pagination, dialog)
    ]);
    
    // Global.asax/window.onload action
    app.run(["$route", "$q", "$rootScope","routeMediator",
        function ($route, $q, $rootScope, routeMediator) {
            //include route to kickstart the routing
            breeze.core.extend($rootScope, $q); //allow breeze to interact with angular
            routeMediator.setRoutingHandlers();
        }
    ]);
})();