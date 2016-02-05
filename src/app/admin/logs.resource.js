(function() {
    'use strict';
    
    angular
        .module('app.admin')
        .factory('LogsResource', LogsResource);
        
    /* @ngInject */
    function LogsResource($resource) {
      return $resource("http://localhost:4242/logs");
    }
}());