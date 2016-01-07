(function() {
  'use strict';

  angular
    .module('app.invoices')
    .config(configBlock);

  /* @NgInject */
  function configBlock($stateProvider) {
    $stateProvider.state('invoices', {
      url: '/invoices?orderBy&orderByDirection&page&pageSize&back&search&customerId',
      templateUrl: 'app/invoices/invoices.html',
      controller: 'InvoicesController',
      controllerAs: 'vm',
      params: {
        orderBy: 'number',
        orderByDirection: '-1',
        page: '0',
        pageSize: '10'
      },
      resolve: { invoicesPrep: invoiceListPrepService }
    }).state('invoice-editor', {
      url: '/invoice-editor/:invoiceId',
      templateUrl: 'app/invoices/invoice-editor.html',
      controller: 'InvoiceEditorController',
      controllerAs: 'vm',
      resolve: { invoice: invoicePrepService }
    });
  }

  /* @NgInject */
  function invoiceListPrepService(InvoicesResource, $stateParams) {
    return InvoicesResource.query($stateParams).$promise;
  }

  /* @NgInject */
  function invoicePrepService(InvoicesResource, $stateParams) {
    if ($stateParams.invoiceId)
      return InvoicesResource.get({ id: $stateParams.invoiceId }).$promise;

    return new InvoicesResource();
  }

})();
