(function () {
  'use strict';

  angular
    .module('app.products')
    .controller('ProductsController',ProductsController );

  /* @ngInject */
  function ProductsController($state, productsPrep, ProductsResource, notificationService, windowService) {
    var vm = this;
    vm.activate = activate;
    vm.query = new Query("label");
    vm.products = [];
    vm.remove = remove;
    vm.orderBy = orderBy;

    activate();

    ////////////////

    function activate() {
      angular.extend(vm.query, $state.params);

      vm.products = productsPrep.data;
      vm.query.page = productsPrep.page;
      vm.query.pageSize = productsPrep.pageSize;
      vm.total = productsPrep.total;
    }

    function remove(id) {
      ProductsResource.remove({ id: id }).$promise.then(function() {
        notificationService.success("Produit supprimé");
        $state.reload();
      });
    }

    function orderBy(key) {
      vm.query.setOrder(key);
      windowService.search(vm.query);
    }
  }

}());
