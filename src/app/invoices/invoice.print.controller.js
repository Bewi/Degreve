(function() {
    'use strict';
    
    angular 
        .module('app.invoices')
        .controller('InvoicePrintController', InvoicePrintController)
    
    function InvoicePrintController() {
        var pm = this;
        
        pm.getPosProducts = getPosProducts;
        pm.getNegProducts = getNegProducts;
        pm.getTotalPrice = getTotalPrice;
        pm.getTotalVAT = getTotalVAT;
        pm.getTotalPriceVATIncluded = getTotalPriceVATIncluded;
        pm.getProductTotalPrice = getProductTotalPrice;
        pm.getProductTotalVAT = getProductTotalVAT;
        
        function getPosProducts(products) {
            return R.filter(function(product) {
                return !product.returned && !product.defect; 
            }, products)
        }
        
        function getNegProducts(products) {
            return R.filter(function(product) {
                return product.returned || product.defect; 
            }, products)
        }
        
        function getTotalPrice(invoice) {
            return R.reduce(function(total, product) {
                return total + getProductTotalPrice(invoice.discount, product) * product.amount;
            }, 0, invoice.products);           
        }
        
        function getTotalVAT(invoice) {
            return R.reduce(function(total, product) {
                return total + getProductTotalVAT(invoice.discount, product) * product.amount;
            }, 0, invoice.products);
        }
        
        function getTotalPriceVATIncluded(invoice) {
            return getTotalPrice(invoice) + getTotalVAT(invoice);
        }
        
        function getProductTotalPrice(discountPerc, product) {
            if (product.isExtra)
                return product.priceSell;

            var sign = product.returned || product.defect ? -1 : 1;

            var discount = discountPerc ? discountPerc / 100 * product.priceSell : 0;
            discount = Number(discount.toFixed(2));
            return sign * (product.priceSell - discount);
        }
        
        function getProductTotalVAT(discountPerc, product) {
            return getProductTotalPrice(discountPerc, product) * product.vat / 100;
        }
    }
    
}());