(function () {
    'use strict';

    angular
        .module('app.products')
        .controller('ProductsController',ProductsController );

    /* @ngInject */
    function ProductsController(productsPrep, ProductsResource, notificationService) {
        var vm = this;
        vm.activate = activate;
        vm.query = new Query("label");
        vm.products = [];
        vm.remove = remove;
        vm.search = search;
        vm.orderBy = orderBy;
        vm.print = print;
        vm.setPage = setPage;

        activate();

        ////////////////

        function activate() {
          refresh(productsPrep);
        }

        function remove(id) {
          ProductsResource.remove({ id: id }).$promise.then(function() {
            notificationService.success("Produit supprimé");
            search(vm.query);
          });
        }

        function search(query, resetPage) {
          if (resetPage)
            query.page = 0;
          ProductsResource.query(query).$promise.then(function(result) {
            refresh(result);
          }, function (error) {
            console.error(error);
          });
        }

        function refresh(result) {
          vm.products = result.data;
          vm.query.page = result.page;
          vm.query.pageSize = result.pageSize;
          vm.total = result.total;
        }

        function orderBy(key) {
          vm.query.setOrder(key);
          search(vm.query);
        }

        function setPage(page) {
          vm.query.page = page;
          search(vm.query);
        }
      }

}());
