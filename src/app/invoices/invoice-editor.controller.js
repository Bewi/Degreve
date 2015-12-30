/* global R */
(function() {
    'use strict';

    angular
        .module('app.invoices')
        .controller('InvoiceEditorController', InvoiceEditorController);

    /* @ngInject */
    function InvoiceEditorController($window, $q, notificationService, invoice, InvoicesResource, CustomersResource) {
        var vm = this;

        vm.invoice = invoice;
        vm.editMode = invoice._id ? true : false;
        vm.paymentMethods = [
            { key: 0, name: "Liquide", printName: 'liquide' },
            { key: 1, name: "Carte", printName: 'par carte' },
            { key: 2, name: "Chèque", printName: 'par chèque' },
            { key: 3, name: "Aucun", printName: 'aucun' },
        ];

        vm.getCustomers = getCustomers;
        vm.submit = submit;
        vm.cancel = cancel;

        activate();

        function activate() {
            if (vm.editMode)
            {
                vm.invoice.date = new Date(vm.invoice.date);
                vm.invoice.paymentMethod = vm.paymentMethods[vm.invoice.paymentMethod.key];
                
                R.forEach(initProductStateActions, vm.invoice.products);
                
                return;
            }

            vm.invoice.paymentMethod = vm.paymentMethods[0];
            vm.invoice.date = new Date();
            vm.invoice.discount = 0;
            
            InvoicesResource.getNextNumber().$promise.then(function(response) {
                vm.invoice.number = response.nextNumber;
            });
        }

        function getCustomers(searchQuery) {
            var customerQuery = new Query("name");
            customerQuery.blockUi = false;
            customerQuery.search = searchQuery;
            
            return CustomersResource.query(customerQuery).$promise.then(function(response) {
                return $q.when(response.data);
            });
        }
        
        function submit() {
            console.log(vm.invoice);
            alert('TODO');
        }

        function cancel() {
            $window.history.back();
        }
        
         /**
         * Products state logic.
         * Does it belong here ?
         */
        function initProductStateActions(product) {
            product.setAsDefect = setAsDefect;
            product.setAsReturned = setAsReturned;
            product.setAsSell = setAsSell;
        }
        
        function setAsDefect(product){
            this.defect = true;
            this.returned = false;
        };
        
        function setAsReturned(product) {
            this.defect = false;
            this.returned = true;
        };
        
        function setAsSell(product) {
            this.defect = false;
            this.returned = false;
        };
    }
})();
