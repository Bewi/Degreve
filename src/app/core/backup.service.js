(function() {
    'use strict';

    angular
        .module('app.core')
        .service('backupService', backupService);

      /* @ngInject */
      function backupService($http, $timeout, $q, serviceUrl, socketUrl, blockUI, Electron) {
        /* jshint validthis: true */
        this.perform = perform;
        this.restore = restore;
        this.transform = transform;
        /* jshint validthis: false */

        function perform(notify) {
            return startSocketing('startSync', notify);
        }

        function restore(notify) {
          return startSocketing('startRestore', notify);
        }
        
        function transform() {
            return $http.post(serviceUrl + '/transform');
        }
        
        function startSocketing(type, notify) {
            var deferred = $q.defer();
            var electronWindow = Electron.mainWindow;
            var connection = new WebSocket(socketUrl);
            var status = {};
            
            connection.onopen = onOpen;
            connection.onmessage = onMessage;
            connection.onerror = onError;
            connection.onclose = onClose;

            function onOpen() {
                $timeout(blockUI.start());
                connection.send(type);
                electronWindow.setProgressBar(0);
            }

            function onMessage(msg) {
                status = JSON.parse(msg.data);
                electronWindow.setProgressBar(status.processed + status.failed / status.total);
                
                if (notify) {
                    notify('progress', status);
                }
            }

            function onError(err) {
                console.error(err);
                
                if (notify) {
                    notify('error', err);
                }
            }

            function onClose(closeEvent) {
                $timeout(blockUI.stop());
                console.warn("Connection closed");

                $timeout(function() {
                    electronWindow.setProgressBar(-1);
                }, 1000);
                
                if (closeEvent.code == 500) {
                    console.error("Reason : ", closeEvent.reason);
                    deferred.reject();
                }                
                else if (status.failed > 0) {
                    deferred.reject("Echec de la synchornisation de " + status.failed + " sur " + status.total + " fichiers");
                }
                else if (status.processed != status.total) {
                    deferred.reject("Connection closed before end of sync.");
                }
                else {
                    deferred.resolve();
                }
            }
            
            return deferred.promise;
        }       
    }
})();
