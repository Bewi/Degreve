(function () {
  'use strict';

  angular
      .module('app')
      .config(configBlock);

  /* @ngInject */
  function configBlock ($provide, NotificationProvider, blockUIConfig, hotkeysProvider, ElectronProvider) {
    NotificationProvider.setOptions({
      startTop: 55
    });

    blockUIConfig.template = '<div class="block-ui-overlay"></div><div class="box-loading"></div>';

    hotkeysProvider.templateTitle = 'Raccourcis clavier';
    hotkeysProvider.cheatSheetDescription = "Affiche / masque ce menu d'aide";

    ElectronProvider.activate();

    $provide.decorator('$state', function($delegate, $stateParams) {
        $delegate.search = function(query) {
            return $delegate.go($delegate.current, query);
        };

        return $delegate;
    });


    $provide.decorator('$resource', function($delegate) {
      var actions = {
        update: {
          method: 'PUT'
        },
        query: {
          method: 'GET',
          transformResponse: function(data, headers) {
            return {
              data: JSON.parse(data),
              page: parseInt(headers('page')),
              pageSize: parseInt(headers('page-size')),
              total: parseInt(headers('total-count'))
            };
          }
        }
      };

      return function() {
        if (!arguments[2]) {
          arguments.length = 3;
          arguments[2] = {};
        }

        angular.extend(arguments[2], actions);

        return $delegate.apply(this, arguments);
      };
    });
  }
}());
