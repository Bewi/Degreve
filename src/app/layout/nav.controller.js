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
    vm.restore = restore;

    ////////////////
    function isCurrentState(state) {
      return $state.$current.toString().indexOf(state) > -1;
    }

    function backup() {
      backupService.perform().then(function() {
        notificationService.success("Sauvegarde terminée avec succés");
      }, function() {
        notificationService.error("Une erreur est survenue lors de la sauvegarde");
      });
    }

    function restore() {
      backupService.restore().then(function() {
        notificationService.success("Les données ont été restaurées");
      }, function() {
        notificationService.error("Une erreur est survenur lors de la restauration des données");
      });
    }
  }

}());
