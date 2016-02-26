(function() {
    'use strict';

    angular
        .module('app.customers')
        .factory('CustomersResource', CustomersResource);

    /* @ngInject */
    function CustomersResource($resource, serviceUrl) {
      return $resource(serviceUrl + "/customers/:id", {id: "@id"});
    }
})();
