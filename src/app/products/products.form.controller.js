(function() {
    'use strict';

    angular
        .module('app.products')
        .controller('ProductsFormController', ProductsFormController);

    /* @ngInject */
    function ProductsFormController($state, $window, product, notificationService) {
        var vm = this;

        vm.product = product;
        vm.submit = submit;
        vm.cancel = cancel;

        function submit() {
          if (vm.productForm.$invalid)
            return;

          var editMode = product._id ? true : false;
          if (editMode)
            vm.product.$update(successCallback, errorCallback);
          else
            vm.product.$save(successCallback, errorCallback);

          function successCallback() {
            notificationService.success("Produit " + (editMode ? "modifié." : "ajouté."));
            $state.go('products');
          }

          function errorCallback() {
            notificationService.error("Une erreur est survenue lors de " +  (editMode ? "la modification" : "l'ajout") + " du produit <br/>Erreur:  " + error);
          }
        }

        function cancel() {
          $window.history.back();
        }
    }
})();
