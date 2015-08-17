(function () {
  'use strict';

  angular
      .module('app')
      .config(configBlock);

  /* @ngInject */
  function configBlock (NotificationProvider, blockUIConfig, hotkeysProvider, ElectronProvider) {
    NotificationProvider.setOptions({
      startTop: 55
    });

    blockUIConfig.template = '<div class="block-ui-overlay"></div><div class="box-loading"></div>';

    hotkeysProvider.templateTitle = 'Raccourcis clavier';
    hotkeysProvider.cheatSheetDescription = "Affiche / masque ce menu d'aide";

    ElectronProvider.activate();
  }
}());
