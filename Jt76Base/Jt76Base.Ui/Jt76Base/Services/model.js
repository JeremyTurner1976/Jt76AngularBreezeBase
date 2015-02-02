(function () {
    "use strict";

    var serviceId = "model";

    angular
        .module("app")
        .factory(serviceId, ["common", model]);

    function model(common) {

        //NOTE: new entityCollections must have a singleton creation call in dataContext.prime()
        var entityCollectionNames = {
            errors: "Errors",
            logMessages: "LogMessages",
            lookups: "Lookups"
        };

        var entityNames = {
            error: "Error",
            logMessage: "LogMessage"
        };

        var service = {
            configureMetadataStore: configureMetadataStore,
            entityNames: entityNames,
            entityCollectionNames: entityCollectionNames
        };

        return service;

        //called from a holder of the metadataStore
        //Note the Object.defined properties will not populate unless the item is injected into the view
        function configureMetadataStore(metadataStore) {
            registerError(metadataStore);
            registerLogMessage(metadataStore);
        }

        function registerError(metadataStore) {
            //extend an object returned from Entity
            metadataStore.registerEntityTypeCtor(entityNames.error, Error);

            function Error() {
                //this.newProperty = ""; 
            }

            Object.defineProperty(Error.prototype, "dtLocalCreated", {
                get: function () {
                    return common.getFormattedLocalTime(this.dtCreated);
                }
            });

            Object.defineProperty(Error.prototype, "dtShortLocalCreated", {
                get: function () {
                    return common.getFormattedShortLocalTime(this.dtCreated);
                }
            });

            Object.defineProperty(Error.prototype, "strConcatAll", {
                get: function () {
                    var strReturn = this.dtShortLocalCreated +
                                    this.strMessage +
                                    this.strErrorLevel +
                                    this.strSource +
                                    this.strAdditionalInformation +
                                    this.strStackTrace;

                    return strReturn;
                }
            });
        }

        function registerLogMessage(metadataStore) {
            //extend an object returned from Entity
            metadataStore.registerEntityTypeCtor(entityNames.logMessage, LogMessage);

            function LogMessage() {
                //this.newProperty = "";
            }

            Object.defineProperty(LogMessage.prototype, "dtLocalCreated", {
                get: function () {
                    return common.getFormattedLocalTime(this.dtCreated);
                }
            });

            Object.defineProperty(LogMessage.prototype, "dtShortLocalCreated", {
                get: function () {
                    return common.getFormattedShortLocalTime(this.dtCreated);
                }
            });

            Object.defineProperty(LogMessage.prototype, "strConcatAll", {
                get: function () {
                    var strReturn = this.dtShortLocalCreated +
                                    this.strLogMessage;

                    return strReturn;
                }
            });
        }
    }
})();