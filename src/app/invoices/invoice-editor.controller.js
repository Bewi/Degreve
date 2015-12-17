(function() {
    'use strict';

    angular
        .module('app.invoices')
        .controller('InvoiceEditorController', InvoiceEditorController);

    /* @ngInject */
    function InvoiceEditorController($window, notificationService, invoice) {
        var vm = this;

        activate();

        function activate() {

        }
    }
})();
