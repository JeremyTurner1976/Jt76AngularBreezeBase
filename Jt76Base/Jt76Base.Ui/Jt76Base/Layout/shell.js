(function () {
    "use strict";

    var strControllerId = "shell";

    angular.module("app").controller(strControllerId,
        ["common", shell]);

    function shell(common) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(strControllerId);
        var logError = getLogFn(strControllerId, "error");
        var logSuccess = getLogFn(strControllerId, "success");

        var vm = this;

        function activate() {
            common.activateController([], strControllerId).then(function (data) {
                logSuccess("Jt76 has loaded. Retrieving app data.");
            });
        }

        activate();

        //Scroll to Top
        $(".scroll-to-top").click(function () {
            $("html, body").animate({ scrollTop: 0 }, 600);
            return false;
        });
    }
})();