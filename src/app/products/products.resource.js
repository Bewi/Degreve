(function () {
    'use strict';

    angular
        .module('app.products')
        .factory('ProductsResource', ProductsResource);

    /* @ngInject */
    function ProductsResource($resource) { 
      return $resource("http://localhost:4242/products/:id", {id: "@id"});
    }
}());
