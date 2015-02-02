// Include in index.html so that app level exceptions are handled.
// Exclude from testRunner.html which should run exactly what it wants to run
(function () {
    "use strict";
    
    var app = angular.module("app");

    // Configure by setting an optional string value for appErrorPrefix.
    // Accessible via config.appErrorPrefix (via config value).

    //decorate exception handler service, resolve dependencies
    app.config(["$provide", function ($provide) {
        $provide.decorator("$exceptionHandler",
            ["$delegate", "config", "logger", "$injector", extendExceptionHandler]);
    }]);
    

    // Extend the $exceptionHandler service to log the client side error and also display a toast.
    // 
    function extendExceptionHandler($delegate, config, logger, $injector) {
        var appErrorPrefix = config.appErrorPrefix;
        var logError = logger.getLogFn("app", "error");
        var lastException;
        return function (exception, cause) {

            $delegate(exception, cause);
            //ensure no endless cycle if logging this causes an error
            if (appErrorPrefix && exception.message.indexOf(appErrorPrefix) === 0) { return; }
            if (exception === lastException) { return; } //loops possible: ie. remove $routeParams from errorDetails.js
            lastException = exception;

            var dataContext = $injector.get("dataContext");
            var newError = dataContext.errors.create();
            newError.strMessage = exception || "Not Available";
            newError.strSource = cause || "Save Failed";
            newError.strAdditionalInformation = appErrorPrefix + "Client Side Error";
            newError.strStackTrace = exception.stack || "Not Available";
            newError.strErrorLevel = "Warning";
            dataContext.save();

            var errorData = { exception: exception, cause: cause };
            var msg = appErrorPrefix + exception.message;
            logError(msg, errorData, true);
        };
    }
})();