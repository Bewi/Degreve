(function () {
  'use strict';

  angular
    .module('app.products')
    .controller('ProductsController',ProductsController );

  /* @ngInject */
  function ProductsController($state, productsPrep, ProductsResource, notificationService) {
    var vm = this;
    vm.query = new Query("label");
    vm.products = [];
    vm.remove = remove;
    vm.orderBy = orderBy;
    vm.total = 0;
    vm.appliedSearch = '';

    activate();

    ////////////////

    function activate() {
      angular.extend(vm.query, $state.params);

      vm.products = productsPrep.data;
      vm.query.page = productsPrep.page;
      vm.query.pageSize = productsPrep.pageSize;
      vm.total = productsPrep.total;
      vm.appliedSearch = vm.query.search;
    }

    function remove(id) {
      ProductsResource.remove({ id: id }).$promise.then(function() {
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
