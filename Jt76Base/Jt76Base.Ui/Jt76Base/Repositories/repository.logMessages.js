(function () {
    "use strict";

    var serviceId = "repository.logMessages";

    angular.module("app").factory(serviceId,
        ["model", "repository.abstract", repositoryLogMessages]);

    function repositoryLogMessages(model, abstractRepository) {
        var strEntityCollectionName = model.entityCollectionNames.logMessages;
        var strEntityName = model.entityNames.logMessage;
        var entityQuery = breeze.EntityQuery;

        var strSelect = null;
        var strOrderBy = "dtCreated desc, id";
        var nDefaultLoadSize = 500;

        function ctor(mgr) {
            this.serviceId = serviceId;
            this.entityName = strEntityName;
            this.manager = mgr;
            //exposed data access functions
            this.getAll = getAll;
            this.getCount = getCount;
            this.getById = getById;
            this.create = create;
        }

        //allow this repo access to the abstract repository
        abstractRepository.extend(ctor);
        return ctor;

        function repoPredicate(strSearchFilter) {
            return breeze.Predicate.create('strConcatAll', 'contains', strSearchFilter);
                //.create('strBody', 'contains', strSearchFilter);
                //.or('dtLocalCreated', 'contains', strSearchFilter);
        }

        //will not need altered for basic use
        function getAll(bForceRefresh, nPage, nPageSize, strOrderByParam) {
            var self = this;
            return self._getAll(bForceRefresh, nPage, nPageSize, strOrderByParam, strOrderBy, nDefaultLoadSize, strEntityCollectionName, strEntityName, strSelect);
        }

        //will not need altered for basic use
        function getCount() {
            var self = this;
            return self._getCount(strEntityCollectionName);
        }

        //will not need altered for basic use
        function getById(nId, bForceRefresh) {
            var self = this;
            if (!self._areItemsLoaded())
                return self._getById(strEntityName, nId, true);

            //else it is in cache or we want to force the call
            return self._getById(strEntityName, nId, bForceRefresh);
        }

        //will not need altered for basic use
        function create() {
            return this.manager.createEntity(strEntityName);
        }
    }
})();
