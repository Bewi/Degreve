(function () {
  'use strict';

  angular
      .module('app')
      .config(configBlock);

  /*@ngInject*/
  function configBlock (NotificationProvider, blockUIConfig, ElectronProvider) {
    NotificationProvider.setOptions({
      startTop: 55
    });

    blockUIConfig.template = '<div class="block-ui-overlay"></div><div class="box-loading"></div>';

    ElectronProvider.activate();
  }
}());
