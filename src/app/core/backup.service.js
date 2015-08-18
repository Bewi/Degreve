(function() {
    'use strict';

    angular
        .module('app.core')
        .service('backupService', backupService);

      /* @ngInject */
      function backupService($http, $timeout, $q, serviceUrl, blockUI, Electron) {
        /* jshint validthis: true */
        this.perform = perform;
        this.restore = restore;
        /* jshint validthis: false */

        function perform() {
          var deferred = $q.defer();
          var electronWindow = Electron.mainWindow;
          var connection = new WebSocket("ws://localhost:4243");
          connection.onopen = onOpen;
          connection.onmessage = onMessage;
          connection.onerror = onError;
          connection.onclose = onClose;

          function onOpen() {
            $timeout(blockUI.start());
            connection.send("startSync");
            electronWindow.setProgressBar(0);
          }

          function onMessage(msg) {
            var status = JSON.parse(msg.data);
            electronWindow.setProgressBar(status.processed / status.total);
          }

          function onError(err) {
            console.error(err);
          }

          function onClose() {
            $timeout(blockUI.stop());
            console.warn("Connection closed");

            $timeout(function() {
              electronWindow.setProgressBar(-1);
            }, 1000);

            if (status.processed == status.total)
              deferred.resolve();
            else
                deferred.reject("Connection closed before end of sync.");

          }

          return deferred.promise;
        }

        function restore() {
          return $http.post(serviceUrl + "/backup/restore", {});
        }
    }
})();
