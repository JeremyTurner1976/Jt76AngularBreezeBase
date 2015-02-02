(function () {
    "use strict";

    var serviceId = "repository.lookups";

    angular.module("app").factory(serviceId,
        ["model", "repository.abstract", repositoryLookup]);

    function repositoryLookup(model, abstractRepository) {
        var strEntityName = model.entityCollectionNames.lookups;
        var entityQuery = breeze.EntityQuery;

        var lookups = [];

        function ctor(mgr) {
            this.serviceId = serviceId;
            this.strEntityName = strEntityName;
            this.manager = mgr;
            //exposed data access functions
            this.getAll = getAll;
            this.setLookups = setLookups;
        }

        //allow this repo access to the abstract repository
        abstractRepository.extend(ctor);
        return ctor;

        function getAll() {
            var self = this; //to help with closure
            return entityQuery.from(self.strEntityName)
            .using(self.manager).execute()
            .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                self.lookups = data.results;
                self.log("Retrieved [" + self.strEntityName + "] from remote data source. ", data.results.length, true);
                return true;
            }
        }

        function setLookups() {
            this.lookupCachedData = {
                errorLevels: this.lookups[0].errorLevels
        };
        }
    }
})();
