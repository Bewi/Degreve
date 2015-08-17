(function() {
    'use strict';

    angular
        .module('app.core')
        .provider('Electron', ElectronProvider);

    function ElectronProvider() {
        var remote = require('remote');
        var service = {
            mainWindow: remote.getCurrentWindow()
        };

        /* jshint validthis: true */
        this.activate = activate;

        this.$get = function() {
          return service;
        };
        /* jshint validthis: false */

        function activate() {
          document.addEventListener("keydown", function (e) {
          if (e.keyCode === 123) { // F12
              service.mainWindow.toggleDevTools();
            }
          });
        }
    }
})();
