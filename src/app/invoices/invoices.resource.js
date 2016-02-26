(function() {
  'use strict';

  angular
    .module('app.invoices')
    .factory('InvoicesResource', InvoicesResource);

    /* @NgInject */
    function InvoicesResource($resource, serviceUrl) {
      // TODO: Move service URL to const
      return $resource(serviceUrl+ "/invoices/:id", {id: "@id"}, {
        getNextNumber: {
          action: 'getNextNumber',
          method: 'GET',
          url: serviceUrl +'/invoices/nextNumber',
          isArray: false      
        },
        validateNumber: {
            action: 'validateNumber',
            method: 'GET',
            url: serviceUrl + '/invoices/validate/:number',
            params: {number: "@number"},
            isArray: false
        }
      });
    }

})();
