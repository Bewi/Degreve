(function() {
    'use strict';

    angular
        .module('app.customers')
        .factory('CustomersResource', CustomersResource);

    /* @ngInject */
    function CustomersResource($resource) {
      return $resource("http://localhost:4242/customers/:id", {id: "@id"});
    }
})();
