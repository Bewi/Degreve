(function() {
  'use strict';

  angular
    .module('app.invoices')
    .config(configBlock);

  /* @NgInject */
  function configBlock($stateProvider) {
    $stateProvider.state('invoices', {
      url: '/invoices?orderBy&orderByDirection&page&pageSize&search',
      templateUrl: 'app/invoices/invoices.html',
      controller: 'InvoicesController',
      controllerAs: 'vm',
      params: {
        orderBy: 'number',
        orderByDirection: '-1',
        page: '0',
        pageSize: '10'
      },
      resolve: { invoicesPrep: invoicesPrepService }
    });
  }

  /* @NgInject */
  function invoicesPrepService(InvoicesResource, $stateParams) {
    return InvoicesResource.query($stateParams).$promise;
  }

})();
