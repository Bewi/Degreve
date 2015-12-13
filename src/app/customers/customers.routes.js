(function () {
  'use strict';

  angular
      .module('app.customers')
      .config(configBlock);

  /* @ngInject */
  function configBlock($stateProvider) {
    $stateProvider.state("customers", {
      url: '/customers?orderBy&orderByDirection&page&pageSize&search',
      templateUrl: 'app/customers/customers.html',
      controller: 'CustomersController',
      controllerAs: 'vm',
      params: {
        orderBy: 'name',
        orderByDirection: '1',
        page: '0',
        pageSize: '10'
      },
      resolve: { customersPrep: customerListPrepService }
    }).state("customer-editor", {
      url: '/customer-editor/:customerId',
      templateUrl: 'app/customers/customer-editor.html',
      controller: 'CustomerEditorController',
      controllerAs: 'vm',
      resolve: { customer: customerPrepService }
    });
  }

  /* @ngInject */
  function customerListPrepService(CustomersResource, $stateParams) {
    return CustomersResource.query($stateParams).$promise;
  }

  function customerPrepService(CustomersResource, $stateParams) {
    if ($stateParams.customerId)
      return CustomersResource.get({ id: $stateParams.customerId }).$promise;

    return new CustomersResource();
  }

}());
