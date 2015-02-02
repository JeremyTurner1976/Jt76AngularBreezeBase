(function () {
    "use strict";

    var app = angular.module("app");

    // Collect the routes
    app.constant("routes", getRoutes());

    // Configure the routes and route resolvers
    app.config(["$routeProvider", "routes", routeConfigurator]);
    function routeConfigurator($routeProvider, routes) {

        routes.forEach(function (r) {
            //$routeProvider.when(r.url, r.config);
            setRoute(r.url, r.config);
        });
        $routeProvider.otherwise({ redirectTo: "/" });

        function setRoute(url, definition) {
            //sets the resolvers for all the routes by extending
            //ie. if prime has not ran, it will run for each route
            definition.resolve = angular.extend(definition.resolve || {}, {
                prime: prime
            });

            $routeProvider.when(url, definition);
            return $routeProvider;
        }
    }

    prime.$inject = ["dataContext"];
    function prime(dc) {
        return dc.prime();
    }

    // Define the routes 
    function getRoutes() {
        return [
            {
                url: "/",
                config: {
                    templateUrl: "/Jt76Base/Modules/Dashboard/dashboard.html",
                    title: "Dashboard",
                    settings: {
                    }
                }
            },
            {
                url: "/about",
                config: {
                    templateUrl: "/Jt76Base/Modules/About/about.html",
                    title: "About",
                    settings: {
                    }
                }
            },
            {
                url: "/admin",
                config: {
                    templateUrl: "/Jt76Base/Modules/Admin/admin.html",
                    title: "Admin",
                    settings: {
                    }
                }
            },
            {
                url: "/admin/errors/:id",
                config: {
                    title: "Error",
                    templateUrl: "/Jt76Base/Modules/Admin/errorDetails.html",
                    settings: {}
                }
            },
            {
                url: "/admin/:url",
                config: {
                    templateUrl: "/Jt76Base/Modules/Admin/admin.html",
                    title: "Admin",
                    settings: {
                    }
                }
            },
            {
                url: "/contact",
                config: {
                    templateUrl: "/Jt76Base/Modules/Contact/contact.html",
                    title: "Contact",
                    settings: {
                    }
                }
            },
            {
                url: "/projects",
                config: {
                    templateUrl: "/Jt76Base/Modules/Project/projectPage.html",
                    title: "Open Workspace",
                    settings: {
                    }
                }
            }
        ];
    }
})();