(function () {
    "use strict";

    var strControllerId = "dashboard";

    angular.module("app").controller(strControllerId,
    ["common", "dataContext", dashboard]);

    function dashboard(common, dataContext) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(strControllerId);
        var logError = getLogFn(strControllerId, "error");
        var logSuccess = getLogFn(strControllerId, "success");

        var vm = this;
        common.$rootScope.strTitle = "Dashboard";
        common.$rootScope.htmlTitleMessage = "Welcome Back, Jeremy Turner , <i class='fa fa-map-marker text-danger'></i> Cheney";

        //weather data
        vm.strSummary = "";
        vm.currentWeather = [];
        vm.dailyWeather = [];

        //functions
        vm.getLocalWeather = getLocalWeather;

        //implement refresh
        vm.refreshWeather = refreshWeather;

        function activate() {
            var promises = [getLocalWeather(false)];

            common.activateController(promises, strControllerId)
            .then(function () {
                logSuccess("Activated " + common.$rootScope.strTitle + " View");
            });
        }

        activate();

        function getLocalWeather(bForceRefresh) {

            return dataContext.getLocalWeather(bForceRefresh).then(function(data) {
                vm.strSummary = data.strSummary;
                vm.currentWeather = data.currentWeather;
                vm.dailyWeather = data.dailyWeather;
                console.log(vm.strSummary);
                console.log(vm.currentWeather);
                console.log(vm.dailyWeather);
                decorateDailyWeather();

                return true;
            });

            function decorateDailyWeather() {
                var dtToday = moment().format("dddd");

                for (var i = 0; i < vm.dailyWeather.length; i++) {
                    vm.dailyWeather[i].background = "panel-body text-white " + getBackgroundColor(i);

                    var localMaxValue = moment.unix(vm.dailyWeather[i].temperatureMaxTime);
                    vm.dailyWeather[i].dtLocalMax = moment(localMaxValue).format("h a");

                    var localMinValue = moment.unix(vm.dailyWeather[i].temperatureMinTime);
                    vm.dailyWeather[i].dtLocalMin = moment(localMinValue).format("h a");

                    vm.dailyWeather[i].dtLocalDay = moment(localMaxValue).format("dddd");
                    if (vm.dailyWeather[i].dtLocalDay === dtToday && i !== 7)
                        vm.dailyWeather[i].dtLocalDay = "Today";

                    vm.dailyWeather[i].temperatureMax = Math.floor(vm.dailyWeather[i].temperatureMax);
                    vm.dailyWeather[i].temperatureMin = Math.floor(vm.dailyWeather[i].temperatureMin);
                }
            }

            function getBackgroundColor(index) {
                switch (index) {
                    case 0:
                        return "bg-primary";
                    case 1:
                        return "bg-blue";
                    case 2:
                        return "bg-light-green";
                    case 3:
                        return "bg-success";
                    case 4:
                        return "bg-purple";
                    case 5:
                        return "bg-info";
                    case 6:
                        return "bg-dark-green";
                    case 7:
                        return "bg-green";
                    case 8:
                        return "bg-dark-blue";
                    default:
                        return "bg-success";
                }
            }
        }

        function refreshWeather() {
            return getLocalWeather(true);
        }

    }
})();