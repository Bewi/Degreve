(function () {
    'use strict';

    angular
        .module('app.products')
        .factory('ProductsResource', ProductsResource);

    /* @ngInject */
    function ProductsResource($resource, serviceUrl) { 
      return $resource(serviceUrl + "/products/:id", {id: "@id"});
    }
}());
