/* global R */
(function() {
    'use strict';

    angular
        .module('app.invoices')
        .controller('InvoiceEditorController', InvoiceEditorController);

    /* @ngInject */
    function InvoiceEditorController($window, $q, notificationService, invoice, InvoicesResource, CustomersResource, ProductsResource) {
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
        vm.getProducts = getProducts;
        vm.addProduct = addProduct;
        vm.addExtra = addExtra;
        vm.removeProduct = removeProduct;
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
            vm.invoice.products = [];
            
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
        
        function getProducts(searchQuery) {
            var productQuery = new Query("label");
            productQuery.blockUi = false;
            productQuery.search = searchQuery;
            
            return ProductsResource.query(productQuery).$promise.then(function(response) {
                return $q.when(response.data);
            });
        }
        
        function addProduct(product) {
            var alreadyInInvoice = R.any(function(p) { return p._id === product._id; }, vm.invoice.products);
            if (alreadyInInvoice) {
                alert('Produit déjà présent sur la facture.');
            } else if (product.stock <= 0) {
                alert("Stock insuffisant.");
            } else {
                product.amount = 1;
                vm.invoice.products.push(product);
            }
            
            // Clear input.
            vm.product = undefined;
        }
        
        function removeProduct(index) {
            if(!confirm("Êtes-vous sûr de vouloir supprimer ce produit de la facture ?")) {
                return;
            }
            
            vm.invoice.products.splice(index, 1);
        }
        
        function addExtra(productLabel) {
            alert("TODO");
            console.log(productLabel);
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
