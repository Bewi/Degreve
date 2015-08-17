(function () {
    'use strict';

    angular
        .module('app.products')
        .factory('ProductsResource', ProductsResource);

    /* @ngInject */
    function ProductsResource($resource) {
      var actions = {
        update: {
          method: 'PUT'
        },
        query: {
          method: 'GET',
          transformResponse: function(data, headers) {
            return {
              data: JSON.parse(data),
              page: parseInt(headers('page')),
              pageSize: parseInt(headers('page-size')),
              total: parseInt(headers('total-count'))
            };
          }
        }
      };

      return $resource("http://localhost:4242/products/:id", {id: "@id"}, actions);
    }
}());
