(function() {
    'use strict';
    
    angular
        .module('app.admin')
        .controller('AdminController', AdminController);
        
    /* @ngInject */
    function AdminController(logsPrep, backupService, notificationService) {
        var vm = this;
        
        vm.logs = logsPrep.data;
        vm.restoreData = restoreData;
        vm.transformData = transformData;
        
        function restoreData() {
            backupService.restore().then(function() {
                notificationService.success("Restauration réalisée avec succès !");
            }, function(message) {
                if (message) {
                    notificationService.error(message);
                } else {
                    notificationService.error("Une erreur est survenue lors de la restauration des données");
                }
            });
        }
        
        function transformData() {
            backupService.transform().then(function() {
                notificationService.success("Transformation réalisée avec succès !")
            }, function() {
                notificationService.error("Une erreur est survenue lors de la transformation des données");
            });
        }
    }
    
}());