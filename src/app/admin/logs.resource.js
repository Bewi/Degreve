(function() {
    'use strict';
    
    angular
        .module('app.admin')
        .factory('LogsResource', LogsResource);
        
    /* @ngInject */
    function LogsResource($resource, serviceUrl) {
      return $resource(serviceUrl + "/logs");
    }
}());