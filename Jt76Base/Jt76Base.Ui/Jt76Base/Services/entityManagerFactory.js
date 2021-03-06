﻿(function () {
    "use strict";

    var serviceId = "entityManagerFactory";

    angular.module("app").factory(serviceId, ["breeze", "config", "model", emFactory]);

    function emFactory(breeze, config, model) {
        // Convert server-side PascalCase to client-side camelCase property names
        breeze.config.initializeAdapterInstance("modelLibrary", "backingStore", true);

        breeze.NamingConvention.camelCase.setAsDefault();
        // Do not validate when we attach a newly created entity to an EntityManager.
        // We could also set this per entityManager
        new breeze.ValidationOptions({ validateOnAttach: false }).setAsDefault();

        var serviceName = config.remoteServiceName;

        //var metadataStore = new breeze.MetadataStore();
        var metadataStore = createMetadataStore();

        var provider = {
            metadataStore: metadataStore,
            newManager: newManager
        };

        return provider;

        function createMetadataStore() {
            var store = new breeze.MetadataStore();
            //extend the metadataStore
            model.configureMetadataStore(store);
            return store;
        }

        function newManager() {
            var manager = new breeze.EntityManager({
                serviceName: serviceName,
                metadataStore: metadataStore
            });

            return manager;
        }

    }
})();