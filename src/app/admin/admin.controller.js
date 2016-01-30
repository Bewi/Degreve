(function() {
    'use strict';
    
    angular
        .module('app.admin')
        .controller('AdminController', AdminController);
        
    /* @ngInject */
    function AdminController(logsPrep, backupService) {
        var vm = this;
        
        vm.logs = logsPrep.data;
        vm.restoreData = backupService.restore;
        vm.transformData = backupService.transform;
    }
    
}());