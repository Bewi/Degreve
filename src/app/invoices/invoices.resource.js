(function() {
  'use strict';

  angular
    .module('app.invoices')
    .factory('InvoicesResource', InvoicesResource);

    /* @NgInject */
    function InvoicesResource($resource) {
      // TODO: Move service URL to const
      return $resource("http://localhost:4242/customers/:id", {id: "@id"});
    }

})();
