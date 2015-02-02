(function () {
    "use strict";

    var serviceId = "repository.abstract";

    angular.module("app").factory(serviceId,
        ["common", "config", abstractRepository]);

    function abstractRepository(common, config) {
        var entityQuery = breeze.EntityQuery;
        var logError = common.logger.getLogFn(this.serviceId, "error");
        var $q = common.$q;

        function ctor() {
            this.isLoaded = false;
        }

        ctor.extend = function (repoCtor) {
            //put the constructor back on itself
            repoCtor.prototype = new ctor();
            repoCtor.prototype.constructor = new ctor();
        }

        //shared by repos
        ctor.prototype._getCount = _getCount;
        ctor.prototype._getInlineCount = _getInlineCount;
        ctor.prototype._getLocalEntityCount = _getLocalEntityCount;
        ctor.prototype._areItemsLoaded = _areItemsLoaded;
        ctor.prototype._getAll = _getAll;
        ctor.prototype._getAllLocal = _getAllLocal;
        ctor.prototype._getById = _getById;
        ctor.prototype._setIsPartial = _setIsPartial;
        ctor.prototype._queryFailed = _queryFailed;
        //convenience repo functions
        ctor.prototype.log = common.logger.getLogFn(this.serviceId);
        ctor.prototype.$q = common.$q;

        return ctor;

        function _getCount(strEntityCollectionName) {
            var self = this;
            if (self._areItemsLoaded()) {
                return self.$q.when(self._getLocalEntityCount(strEntityCollectionName));
            }

            return entityQuery.from(strEntityCollectionName)
                                .take(0)
                                .inlineCount() //dont load just get the count
                                .using(self.manager).execute()
                                .then(self._getInlineCount);
        }

        function _getInlineCount(data) {
            return data.inlineCount;
        }

        function _getLocalEntityCount(strId) {
            var collection = entityQuery.from(strId)
                            .using(this.manager)
                            .executeLocally();

            return $q.when(collection.length);
        }

        function _areItemsLoaded(bValue) {
            if (bValue === undefined)
                return this.isLoaded; //get

            return this.isLoaded = bValue; //set
        }

        function _getAllLocal(resource, ordering, predicate) {
            return entityQuery.from(resource)
            .orderBy(ordering)
            .where(predicate)
            .using(this.manager)
            .executeLocally(); //only use local data
        }

        function _getById(strEntityName, nId, bForceRefresh) {
            var self = this;
            var manager = self.manager;

            //get locally
            if (!bForceRefresh) {
                var entity = manager.getEntityByKey(strEntityName, nId);

                if (entity && !entity.isPartial) {
                    self.log("Retrieved [" + strEntityName + "] id: " + entity.id + " from cache.", entity, true);
                    if (entity.entityAspect.entityState.isDeleted()) {
                        entity = null; //hide topic marked for delete
                    }
                    return $q.when(entity);
                }
            }

            //else hit the service
            return manager.fetchEntityByKey(strEntityName, nId)
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.entity;
                if (!entity) {
                    self.log("Could not find [" + strEntityName + "] id: " + nId + " from cache.", null, true);
                    return null;
                }
                entity.isPartial = false; //have the full source including replies
                self.log("Retrieved [" + strEntityName + "] id: " + entity.id + " from remote source.", entity, true);
                return entity;
            }

        }

        function _setIsPartial(entities, bValue) {
            for (var i = entities.length; i--;) {
                entities[i].isPartial = bValue;
            }
            return entities;
        }

        function _queryFailed(error) {
            var msg = config.appErrorPrefix + "Error retrieving data." + error.message;
            logError(msg);
            throw (error);
        }

        //will not need altered for basic use
        function _getAll(bForceRefresh, nPage, nPageSize, strOrderByParam, strOrderBy, nDefaultLoadSize, strEntityCollectionName, strEntityName, strSelect) {
            var self = this;

            var strTempOrderBy = (strOrderByParam && strOrderByParam.length > 0) ? strOrderByParam + ", id" : strOrderBy;

            var nTake = nPageSize || nDefaultLoadSize;
            var nSkip = (nPage !== undefined && nPageSize !== undefined) ? (nPage - 1) * nPageSize : 0;

            if (self._areItemsLoaded() && !bForceRefresh) {
                return self.$q.when(getByPage());
            }

            //get the entire collection if the first load 
            return entityQuery.from(strEntityCollectionName)
                                .select(strSelect)
                                .orderBy(strTempOrderBy)
                                .toType(strEntityName)
                                .using(self.manager).execute()
                                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                self._areItemsLoaded(true); //set
                self.log("Retrieved [" + strEntityCollectionName + "] from remote data source. ", data.results.length, true);
                return data.results;
            }

            function getByPage() {

                var collection = entityQuery.from(strEntityCollectionName)
                                .select(strSelect)
                                //.where(predicate)
                                .orderBy(strTempOrderBy)
                                .take(nTake)
                                .skip(nSkip)
                                .toType(strEntityName)
                                .using(self.manager)
                                .executeLocally();

                return collection;
            }
        }

    }
})();
