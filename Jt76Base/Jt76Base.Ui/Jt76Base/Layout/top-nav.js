(function () {
    "use strict";

    var strControllerId = "top-nav";


    angular.module("app").controller(strControllerId,
        [topNav]);

    function topNav() {
        //var getLogFn = common.logger.getLogFn;
        //var log = getLogFn(strControllerId);
        //var logError = getLogFn(strControllerId, "error");
        //var logSuccess = getLogFn(strControllerId, "success");

        var vm = this;

        function activate() {
        }

        activate();

        $("#sidebarToggleLG").click(function () {
            if ($(".wrapper").hasClass("display-right")) {
                $(".wrapper").removeClass("display-right");
                $(".sidebar-right").removeClass("active");
            }
            else {
                //$('.nav-header').toggleClass('hide');
                $(".top-nav").toggleClass("sidebar-mini");
                $("aside").toggleClass("sidebar-mini");
                $("footer").toggleClass("sidebar-mini");
                $(".main-container").toggleClass("sidebar-mini");

                $(".main-menu").find(".openable").removeClass("open");
                $(".main-menu").find(".submenu").removeAttr("style");
            }
        });

        $("#sidebarToggleSM").click(function () {
            $("aside").toggleClass("active");
            $(".wrapper").toggleClass("display-left");
        });
    }
})();