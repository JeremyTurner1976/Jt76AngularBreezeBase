(function () {
    "use strict";

    var strControllerId = "sidebar-menu";

    angular.module("app").controller(strControllerId,
    ["$route", "$scope", "common", "config", "dataContext", sidebarMenu]);

    function sidebarMenu($route, $scope, common, config, dataContext) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(strControllerId);
        var logError = getLogFn(strControllerId, "error");
        var logSuccess = getLogFn(strControllerId, "success");

        var vm = this;
        vm.errorsCount = 0;
        vm.logMessagesCount = 0;
        vm.usersCount = 0;

        function activate() {

            var promises = [getErrorsCount(), getLogMessagesCount(), getUsersCount()];

            common.activateController(promises, strControllerId)
            .then(function () {
                setOnDataSetUpdated();
                log("Retrieved [admin counts] from remote data source.");
            });

            //get the starting site
            var sidebarElements = $(".sidebar-accordion > li");
            angular.forEach(sidebarElements, function (element) {
                if ($route.current.originalPath !== "/") {
                    if (common.textContainsIgnoreCase(element.innerHTML, $route.current.title))
                        $(element).addClass("active");
                    else
                        $(element).removeClass("active");
                }
            });
        }

        activate();

        //getCounts
        function getErrorsCount() {
            return dataContext.errors.getCount().then(function(data) {
                return vm.errorsCount = data;
            });
        }

        function getLogMessagesCount() {
            return dataContext.logMessages.getCount().then(function (data) {
                return vm.logMessagesCount = data;
            });
        }

        function getUsersCount() {
            //stubbed
            return common.$q.when(vm.usersCount = 0);
        }

        function setOnDataSetUpdated() {
            $scope.$on(config.events.dataSetUpdated, function (event, data) {
                getErrorsCount();
                getLogMessagesCount();
                getUsersCount();
            });
        }


        //Collapsible Sidebar Menu
        $(".sidebar-menu .openable > a").click(function () {

            if (!$("aside").hasClass("sidebar-mini") || Modernizr.mq("(max-width: 991px)")) {
                if ($(this).parent().children(".submenu").is(":hidden")) {
                    $(this).parent().siblings().removeClass("open").children(".submenu").slideUp(200);
                    $(this).parent().addClass("open").children(".submenu").slideDown(200);
                }
                else {
                    $(this).parent().removeClass("open").children(".submenu").slideUp(200);
                }
            }

            return true;
        });

        //Active sidebar icons
        $(".sidebar-accordion > li").click(function () {
            var self = $(this);

            var sidebarElements = $(".sidebar-accordion > li");
            angular.forEach(sidebarElements, function(element) {
                $(element).removeClass("active");

                if (element.uniqueID.indexOf(self[0].uniqueID) !== 0)
                    $(element).removeClass("open").children(".submenu").slideUp(200);
            });
  
            $(this).addClass("active");

            return true;
        });

        //Open active menu
        if (!$(".sidebar-menu").hasClass("sidebar-mini") || Modernizr.mq("(max-width: 767px)")) {
            $(".openable.open").children(".submenu").slideDown(200);
        }

    }
})();