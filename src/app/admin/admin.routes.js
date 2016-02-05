(function() {
    'use strict';
    
    angular
        .module('app.admin')
        .config(configBlock);
    
    /* @ngInject */
    function configBlock($stateProvider) {
        $stateProvider.state('admin', {
            url: '/admin',
            templateUrl: 'app/admin/admin.html',
            controller: 'AdminController',
            controllerAs: 'vm',
            resolve: {
                logsPrep: logsPrepService
            }       
        });
    }
    
    /* @ngInject */
    function logsPrepService(LogsResource) {
        return LogsResource.query().$promise;
    }
    
}());