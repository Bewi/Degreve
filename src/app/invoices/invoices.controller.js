(function() {
  'use strict';

  angular
    .module('app.invoices')
    .controller('InvoicesController', InvoicesController);

  function InvoicesController($state, invoicesPrep) {
    var vm = this;

    vm.query = new Query('_id');
    vm.orderBy = orderBy;
    vm.total = 0;
    vm.appliedSearch = '';

    activate();

    ///////////////////////

    function activate() {
      angular.extend(vm.query, $state.params);
      vm.invoices = invoicesPrep.data;
      vm.query.page = invoicesPrep.page;
      vm.query.pageSize = invoicesPrep.pageSize;
      vm.total = invoicesPrep.total;
      vm.appliedSearch = vm.query.search;
    }
  }

})();
