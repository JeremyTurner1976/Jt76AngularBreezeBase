(function () {
    "use strict";

    var strControllerId = "mainContainer";

    angular.module("app").controller(strControllerId,
    ["common", mainContainer]);

    function mainContainer(common) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(strControllerId);
        var logError = getLogFn(strControllerId, "error");
        var logSuccess = getLogFn(strControllerId, "success");

        progress(50, $('#progressBar'));

        var vm = this;
   
        function activate() {
            common.activateController([], strControllerId).then(function (data) {
                logSuccess("Jt76 has loaded. Retrieving app data.");
            });
        }

        activate();

        function progress(percent, $element) {
            var progressBarWidth = percent * $element.width() / 100;
            $element.find('div').animate({ width: progressBarWidth }, 500).html(percent + "%&nbsp;");
        }
    }
})();