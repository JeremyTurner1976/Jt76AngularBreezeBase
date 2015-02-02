(function () {
    "use strict";

    var strControllerId = "contact";

    angular.module("app").controller(strControllerId,
    ["common", "dataContext", contact]);

    function contact(common, dataContext) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(strControllerId);
        var logError = getLogFn(strControllerId, "error");
        var logSuccess = getLogFn(strControllerId, "success");

        var vm = this;
        common.$rootScope.strTitle = "Contact Jt76";
        common.$rootScope.htmlTitleMessage = "Always open to suggestions.";

        //properties
        vm.email = {
            strUserName: "",
            strUserEmail: "",
            strMessage: ""
        }

        //functions
        vm.sendEmail = sendEmail;

        function activate() {
            var promises = [];

            common.activateController(promises, strControllerId)
            .then(function () {
                logSuccess("Activated " + common.$rootScope.strTitle + " View");
            });
        }

        activate();

        function sendEmail() {
            var strEmailContent = vm.email.strUserName + "\r\n" + (vm.email.strUserEmail === "" ? "No email address attached" :vm.email.strUserEmail ) + "\r\n\r\n" + vm.email.strMessage;

            dataContext.sendEmail(JSON.stringify(strEmailContent)).then(function () {
                vm.email = {
                    strUserName: "",
                    strUserEmail: "",
                    strMessage: ""
                }
            });
        }

    }
})();