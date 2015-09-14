(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('windowService', windowService);

    /* @ngInject */
    function windowService($state) {
      return {
        search: search
      };

      function search(query) {
        $state.transitionTo($state.current.name, query, {
           reload: false,
           notify: true
         });
      }
    }

}());
