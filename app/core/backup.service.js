(function() {
    'use strict';

    angular
        .module('app.core')
        .service('backupService', backupService);

      /* @ngInject */
      function backupService($http, serviceUrl) {
        /* jshint validthis: true */
        this.perform = perform;
        this.restore = restore;
        /* jshint validthis: false */

        function perform() {
          return $http.post(serviceUrl + "/backup", {});
        }

        function restore() {
          return $http.post(serviceUrl + "/backup/restore", {});
        }
    }
})();
