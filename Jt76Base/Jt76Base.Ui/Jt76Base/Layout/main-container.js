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
        vm.strContentHeight = getInnerHeightStyle();

        function getInnerHeightStyle(){
            var nFooterHeight = 32;
            var nHeaderHeight = 52;
            var nOverallPadding = 15;
            var nDesiredHeight = (window.innerHeight - (nFooterHeight + nHeaderHeight + nOverallPadding));

            //min-height of the application
            if (nDesiredHeight < 450)
                nDesiredHeight = 450;

            return nDesiredHeight + "px";
        }
   
        function activate() {
        }

        activate();

        function progress(percent, $element) {
            var progressBarWidth = percent * $element.width() / 100;
            $element.find('div').animate({ width: progressBarWidth }, 500).html(percent + "%&nbsp;");
        }
    }
})();