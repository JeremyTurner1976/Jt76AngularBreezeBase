(function () {
    "use strict";

    var serviceId = "dataContext";
    angular.module("app").factory(serviceId,
        ["$http", "common", "entityManagerFactory", "model", "repositories", "config", dataContext]);

    function dataContext($http, common, emFactory, model, repositories, config) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, "error");
        var logSuccess = getLogFn(serviceId, "success");

        var events = config.events;
        var manager = emFactory.newManager();
        var $q = common.$q;
        var primePromise; //undefined to ensure this occurs only once

        var localWeather = [];

        var service = {
            prime: prime,
            cancel: cancel,
            save: save,
            markDeleted: markDeleted,
            //repositories added on demand

            //NON DB Actions
            sendEmail: sendEmail,
            getLocalWeather: getLocalWeather
        };
        init();

        return service;

        function init() {
            repositories.init(manager);
            defineLazyLoadedRepos();

            //setup an event that subscribes to breezes hasChangesChangedEvent
            //then publishes that event throughout the application
            setupEventForHasChangesChanged();
        }

        //add property to dataContext for each named repo
        function defineLazyLoadedRepos() {
            angular.forEach(model.entityCollectionNames, function (key, value) {
                Object.defineProperty(service, value, {
                    configurable: true, //set once
                    get: function () {
                        var repo = repositories.getRepo(value);
                        //take this property and no longer rewrite it
                        Object.defineProperty(service, value, {
                            value: repo,
                            configurable: false, //immutable
                            enumerable: true //collectionable
                        });
                    }
                });
            });
        }

        //this can be used to cache items that will always be needed - ie. dropdownlist items
        //also used to ensure the singletons are created per table
        function prime() {
            //if defined it has ran once
            if (primePromise) return primePromise;

            //IMPORTANT: This will fix lazy loaded repos not holding a reference
            if (service.lookups === "undefined")
                var initOne = service.lookups;
            if (service.errors === "undefined")
                var initTwo = service.errors;
            if (service.logMessages === "undefined")
            var initThree = service.logMessages;

            //gather one time load data
            primePromise = $q.all([service.lookups.getAll()]) //array possible for caching multiple breeze calls
            .then(success);
            return primePromise;

            function success() {
                //extendMetadata();
                service.lookups.setLookups();
                log("Primed the data");
            }
        }

        function cancel() {
            if (manager.hasChanges()) {
                manager.rejectChanges();
                logSuccess("Cancelled changes", null, true);
            }
        }

        function save() {
            if (manager.hasChanges()) {
                return manager.saveChanges()
                    .then(saveSucceeded, saveFailed);
            } else {
                logSuccess("No data has changed.");
                return $q.when(false);
            }

            function saveSucceeded(result) {
                dataSetUpdate();
                log("Saved Data", result);
            }

            function saveFailed(error) {
                var msg = config.appErrorPrefix + "Save Failed."; //+ breeze.saveErrorMessageService.getErrorMessage(error);
                error.message = msg + " " + breeze.saveErrorMessageService.getErrorMessage(error);
                logError(msg, error);
                throw error;
            }
        }

        function setupEventForHasChangesChanged() {
            manager.hasChangesChanged.subscribe(function (eventArgs) {
                var data = { hasChanges: eventArgs.hasChanges };
                //send the message
                common.$broadcast(events.hasChangesChanged, data);
            });
        }

        function dataSetUpdate() {
            var data = { valuesSaved: true };
            common.$broadcast(events.dataSetUpdated, data);
        }

        function markDeleted(entity) {
            return entity.entityAspect.setDeleted();
        }




        //NON DB Actions
        function sendEmail(strEmailContent) {
            var emailPromise = $q.all([$http.post(config.remoteServiceName + "/SendEmail", strEmailContent)])
            .then(success, error);
            return emailPromise;

            function success() {
                logSuccess("Email Sent.");
            }
            function error() {
                logError("Unable to send email. ", strEmailContent);
            }
        }

        function getLocalWeather(bForceRefresh) {
            if (localWeather.strSummary && !bForceRefresh)
                return $q.when(localWeather);

            var promise = $q.all([$http.get(config.remoteServiceName + "/LocalWeather")])
            .then(success, error);
            return promise;

            function success(data) {
                log("8 days of local weather gathered.");
                localWeather = data[0].data;
                return localWeather;
            }
            function error() {
                logError("Unable to gather local weather data.");
                return false;
            }
        }
    }
})();



////not used
//function extendMetadata() {
//    var metadataStore = manager.metadataStore;
//    var types = metadataStore.getEntityTypes();

//    types.forEach(function (type) {
//        if (type instanceof breeze.EntityType) {
//            set(type.shortName, type);
//        }
//    });

//    //can be used to set common types ie teachers, students
//    //var personEntityName = entityCollectionNames.person;
//    //['teachers', 'students', 'Deans'].foreach(function (r) {
//    //    set(r, personEntityName);
//    //});

//    function set(strResourceName, entityTypeOrName) {
//        metadataStore.setEntityTypeForResourceName(strResourceName, entityTypeOrName);
//    }
//}