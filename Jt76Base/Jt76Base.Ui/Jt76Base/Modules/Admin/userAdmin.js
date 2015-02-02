(function () {
    "use strict";

    var strControllerId = "adminUsers";

    angular.module("app").controller(strControllerId,
    ["common", adminUsers]);

    function adminUsers(common) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(strControllerId);
        var logError = getLogFn(strControllerId, "error");
        var logSuccess = getLogFn(strControllerId, "success");

        var vm = this;
        common.$rootScope.strTitle = "Admin Users";
        common.$rootScope.htmlTitleMessage = "Handle your business.";

        function activate() {
            var promises = [];

            common.activateController(promises, strControllerId)
            .then(function () {
                logSuccess("Activated " + common.$rootScope.strTitle + " View");
            });
        }

        activate();
    }
})();