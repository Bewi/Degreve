(function() {
    'use strict';

    angular
        .module('app.customers')
        .controller('CustomerEditorController', CustomerEditorController);

    /* @ngInject */
    function CustomerEditorController($state, $window, customer, notificationService) {
      var vm = this;

      vm.customer = customer;
      vm.submit = submit;
      vm.cancel = cancel;
      vm.editMode = customer._id ? true : false;

      function submit() {
        if (vm.customerForm.$invalid)
          return;

        vm.customer.$save(successCallback, errorCallback);

        function successCallback() {
          notificationService.success("Client " + (vm.editMode ? "modifié." : "ajouté."));
          $window.history.back();
        }

        function errorCallback(error) {
          notificationService.error("Une erreur est survenue lors de " +  (vm.editMode ? "la modification" : "l'ajout") + " du client <br/>Erreur:  " + error.statusText);
        }
      }

      function cancel() {
        $window.history.back();
      }
    }
})();
