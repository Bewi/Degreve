(function() {
  'use strict';

  angular
    .module('app.invoices')
    .factory('InvoicesResource', InvoicesResource);

    /* @NgInject */
    function InvoicesResource($resource) {
      // TODO: Move service URL to const
      return $resource("http://localhost:4242/invoices/:id", {id: "@id"}, {
        getNextNumber: {
          action: 'getNextNumber',
          method: 'GET',
          url: 'http://localhost:4242/invoices/nextNumber',
          isArray: false      
        },
        validateNumber: {
            action: 'validateNumber',
            method: 'GET',
            url: 'http://localhost:4242/invoices/validate/:number',
            params: {number: "@number"},
            isArray: false
        }
      });
    }

})();
