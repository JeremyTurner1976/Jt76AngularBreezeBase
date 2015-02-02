(function () {
    "use strict";

    var strControllerId = "about";

    angular.module("app").controller(strControllerId,
    ["common", about]);

    function about(common) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(strControllerId);
        var logError = getLogFn(strControllerId, "error");
        var logSuccess = getLogFn(strControllerId, "success");

        var vm = this;
        common.$rootScope.strTitle = "About Jt76";
        common.$rootScope.htmlTitleMessage = "Just a short description of this site.";

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