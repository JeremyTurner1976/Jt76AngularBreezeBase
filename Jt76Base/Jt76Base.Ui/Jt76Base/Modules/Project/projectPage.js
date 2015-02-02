(function () {
    "use strict";

    var strControllerId = "projectPage";

    angular.module("app").controller(strControllerId,
    ["common", projectPage]);

    function projectPage(common) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(strControllerId);
        var logError = getLogFn(strControllerId, "error");
        var logSuccess = getLogFn(strControllerId, "success");

        var vm = this;
        common.$rootScope.strTitle = "Project Page";
        common.$rootScope.htmlTitleMessage = "A placeholder for content to come.";

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