(function() {
  'use strict';

  angular
    .module("app.customers")
    .controller("CustomersController", CustomersController);

  /* @ngInject */
  function CustomersController($state, notificationService, customersPrep, CustomersResource) {
    var vm = this;
    vm.query = new Query("firstName");
    vm.customers = [];
    vm.remove = remove;
    vm.orderBy = orderBy;
    vm.total = 0;
    vm.appliedSearch = '';

    activate();

    ////////////////

    function activate() {
      angular.extend(vm.query, $state.params);
      vm.customers = customersPrep.data;
      vm.query.page = customersPrep.page;
      vm.query.pageSize = customersPrep.pageSize;
      vm.total = customersPrep.total;
      vm.appliedSearch = vm.query.search;
    }

    function remove(id) {
      CustomersResource.remove({ id: id }).$promise.then(function() {
        notificationService.success("Produit supprimé");
        $state.reload();
      });
    }

    function orderBy(key) {
      vm.query.setOrder(key);
      $state.search(vm.query);
    }
  }

}());
