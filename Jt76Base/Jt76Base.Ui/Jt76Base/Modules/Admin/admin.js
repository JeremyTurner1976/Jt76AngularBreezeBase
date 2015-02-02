(function () {
    "use strict";

    var strControllerId = "admin";

    angular.module("app").controller(strControllerId,
    ["$routeParams", "$rootScope", "common", admin]);

    function admin($routeParams, $rootScope, common) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(strControllerId);
        var logError = getLogFn(strControllerId, "error");
        var logSuccess = getLogFn(strControllerId, "success");

        var vm = this;

        var strSubLink = $routeParams.url || "dashboard";
        vm.strInclude = "";

        function activate() {
            var promises = [getSubLink()];

            common.activateController(promises, strControllerId)
            .then(function () {
                $rootScope.bIsAdminMode = true;
            });
        }

        activate();

        function getSubLink() {
            var strBase = "/Jt76Base/Modules/Admin/";
            vm.strInclude = strBase + strSubLink + ".html";

            var sidebarElements = $(".admin-sidebar-accordion > li");
            angular.forEach(sidebarElements, function (element) {
                if (common.textContainsIgnoreCase(element.innerHTML, strSubLink))
                    $(element).addClass("active");
                else
                    $(element).removeClass("active");
            });
        }
    }
})();