(function () {
  'use strict';

  angular
    .module('app')
    .controller('NavController', NavController);

  /* @ngInject */
  function NavController($state, backupService, notificationService) {
    /* jshint validthis: true */
    var vm = this;
    /* jshint validthis: false */

    vm.isCurrentState = isCurrentState;
    vm.backup = backup;

    ////////////////
    function isCurrentState(state) {
      return $state.$current.toString().indexOf(state) > -1;
    }

    function backup() {
      backupService.perform().then(function() {
        notificationService.success("Sauvegarde terminée avec succés");
      }, function(message) {
        if (message) {
            notificationService.error(message);
        } else {
            notificationService.error("Une erreur est survenur lors de la restauration des données");
        }
      });
    }   
  }

}());
