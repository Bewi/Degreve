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
        vm.readOnly = invoice._id ? true : false;
        
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
        vm.updateTotal = updateTotal;
        vm.setAsDefect = setAsDefect;
        vm.setAsReturned = setAsReturned;
        vm.setAsSell = setAsSell;
        vm.submit = submit;
        vm.cancel = cancel;

        activate();

        function activate() {
            if (vm.invoice._id)
            {
                vm.invoice.date = new Date(vm.invoice.date);
                vm.invoice.paymentMethod = vm.paymentMethods[vm.invoice.paymentMethod.key];
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
                vm.updateTotal();
            }
            
            // Clear input.
            vm.product = undefined;
        }
        
        function removeProduct(index) {
            if(!confirm("Êtes-vous sûr de vouloir supprimer ce produit de la facture ?")) {
                return;
            }
            
            vm.invoice.products.splice(index, 1);
            vm.updateTotal();            
        }
        
        function addExtra(productLabel) {
            var alreadyInInvoice = R.any(function(p) {return p.label === productLabel; }, vm.invoice.products);
             if (alreadyInInvoice) {
                alert('Produit déjà présent sur la facture.');
            } else {
                var id = Math.floor((10 + Math.random()) * 1000);

                var product = {
                    _id: id + "E",
                    label: productLabel,
                    amount: 1,
                    priceBuy: 0,
                    priceSell: 0,
                    vat: 0,
                    isExtra: true
                };

                vm.invoice.products.push(product);
            }
            
            // Clear input.
            vm.product = undefined;            
        }
        
        function submit() {
            if (vm.invoice.products.length === 0) {
                alert('Aucun produit présent sur la facture. \nVeuillez en ajouter avant de la sauvegarder!');
                return;
            }
            
            if (!confirm("Êtes-vous sur de vouloir finaliser cette facture ?")) {
                return;
            }
            
            vm.invoice.$save(successCallback, errorCallback);
            
            function successCallback() {
                notificationService.success("Facture clôturée !");
                $window.history.back();
            }

            function errorCallback(error) {
                notificationService.error("Une erreur est survenue lors de la clôture de la facture.<br/>Erreur:  " + error.statusText);
            }
        }

        function cancel() {
            $window.history.back();
        }
        
        /**
         * Calculations logic
         */
        function updateTotal() {
            vm.invoice._totalPrice = getTotalPrice();
            vm.invoice._totalVAT = getTotalVAT();
            vm.invoice._total = getTotalPriceVATIncluded();
        }
        
        function getTotalPrice() {
            return R.reduce(function(total, product) {
                return total + getProductTotalPrice(product) * product.amount;
            }, 0, vm.invoice.products);           
        }
        
        function getTotalVAT() {
            return R.reduce(function(total, product) {
                return total + getProductTotalVAT(product) * product.amount;
            }, 0, vm.invoice.products);
        }
        
        function getTotalPriceVATIncluded() {
            return getTotalPrice() + getTotalVAT();
        }
        
        function getProductTotalPrice(product) {
            if (product.isExtra)
                return product.priceSell;

            var sign = product.returned || product.defect ? -1 : 1;

            var discount = vm.invoice.discount ? vm.invoice.discount / 100 * product.priceSell : 0;
            discount = Number(discount.toFixed(2));
            return sign * (product.priceSell - discount);
        }
        
        function getProductTotalVAT(product) {
            return getProductTotalPrice(product) * product.vat / 100;
        }

        
         /**
         * Products state logic.
         * Does it belong here ?
         */
        function setAsDefect(product){
            product.defect = true;
            product.returned = false;
            vm.updateTotal();            
        };
        
        function setAsReturned(product) {
            product.defect = false;
            product.returned = true;
            vm.updateTotal();
        };
        
        function setAsSell(product) {
            product.defect = false;
            product.returned = false;
            vm.updateTotal();
        };
    }
})();
