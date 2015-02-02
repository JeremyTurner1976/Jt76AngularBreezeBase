(function () {
    "use strict";

    var app = angular.module("app");

    // Configure Toastr
    toastr.options.timeOut = 4500;
    toastr.options.positionClass = "toast-bottom-right";

    var remoteServiceName = "/Api/V1/Breeze";

    var keyCodes = {
        backspace: 8,
        tab: 9,
        enter: 13,
        esc: 27,
        space: 32,
        pageup: 33,
        pagedown: 34,
        end: 35,
        home: 36,
        left: 37,
        up: 38,
        right: 39,
        down: 40,
        insert: 45,
        del: 46
    }

    //published event list
    var events = {
        controllerActivateSuccess: "controller.activateSuccess", //in Common
        hasChangesChanged: "dataContext.hasChangesChanged", //in dataContext
        dataSetUpdated: "dataContext.dataSetUpdated"
    };

    var config = {
        appErrorPrefix: "[Jt76 Error] ", //Configure the exceptionHandler decorator
        docTitle: "Jt76: ",
        events: events,
        remoteServiceName: remoteServiceName,
        version: "1.0.0",
        keyCodes: keyCodes
    };

    app.value("config", config);

    app.config(["$logProvider", function ($logProvider) {
        // turn debugging off/on (no info or warn)
        if ($logProvider.debugEnabled) {
            $logProvider.debugEnabled(true);
        }
    }]);

    //#region Configure the common service events via commonConfig
    app.config(["commonConfigProvider", function (cfg) {
        cfg.config.controllerActivateSuccessEvent = config.events.controllerActivateSuccess;
    }]);
    //#endregion
})();