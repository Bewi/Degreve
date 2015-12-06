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
        vm.editMode = product._id ? true : false;

        function submit() {
          if (vm.productForm.$invalid)
            return;

          vm.product.$save(successCallback, errorCallback);

          function successCallback() {
            notificationService.success("Produit " + (vm.editMode ? "modifié." : "ajouté."));
            $window.history.back();
          }

          function errorCallback(error) {
            notificationService.error("Une erreur est survenue lors de " +  (vm.editMode ? "la modification" : "l'ajout") + " du produit <br/>Erreur:  " + error.statusText);
          }
        }

        function cancel() {
          $window.history.back();
        }
    }
})();
