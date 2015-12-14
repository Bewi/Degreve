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
      contollerAs: 'vm',
      params: {
        orderBy: '_id',
        orderByDirection: '1',
        page: '1',
        pageSize: '10'
      },
      resolve: { invoicesPrep: invoicesPrepService }
    });
  }

  /* @NgInject */
  function invoicesPrepService(InvoicesResource, $stateParams) {
    return invoicesResource.query($stateParams).$promise;
  }

})();
