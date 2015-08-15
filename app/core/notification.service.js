(function() {
    'use strict';

    angular
        .module('app.core')
        .service('notificationService', notificationService);

    /* @ngInject */
    function notificationService($injector) {
        /* jshint ignore:start */
        this.error = error;
        this.info = info;
        this.warn = warn;
        this.success = success;
        /* jshint ignore:end */

        var notifierConfig = {
          template: '',
          hasDelay: true,
          delay: 3000,
          type: 'info',
          position: 'top center'
        };

        var notifier;

        try {
          notifier = $injector.get('Notification');
        } catch (e){
          console.log("Notification service unavailable. Messages will be logged to console only.");
        }

        function error(message) {
          if (notifier)
            notifier.error(message);
          else
            console.error(message);
        }

        function info(message) {
          if (notifier)
            notifier.primary(message);
          else
            console.log(message);
        }

        function warn(message) {
          if (notifier)
            notifier.warning(message);
          else
            console.warn(message);
        }

        function success(message) {
          if (notifier)
            notifier.success(message);
          else
            console.log("Success: " + message);
        }
    }
})();
