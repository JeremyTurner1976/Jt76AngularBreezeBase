(function () {
    "use strict";

    var serviceId = "repositories";

    angular.module("app").factory(serviceId,
        ["$injector", repositories]);

    function repositories($injector) {
        var manager;

        var service  = {
            getRepo: getRepo,
            init: init
        }

        return service;

        //called exclusively by dataContext
        function init(mgr) { manager = mgr; }

        function getRepo(strRepoName) {
            var strFullRepoName = "repository." + strRepoName;
            var repo = $injector.get(strFullRepoName);
            return new repo(manager);
        }
    }
})();
