(function() {
    'use strict';

    angular
        .module('app.products')
        .controller('ProductsPrintController', ProductsPrintController);

    /* @ngInject */
    function ProductsPrintController(ProductsResource) {
        var pm = this;

        activate();

        function activate() {
          pm.today = new Date();

          ProductsResource.query().$promise.then(function(result) {
            pm.products = result.data;

            pm.totalStock = _.reduce(pm.products, function(memo, product) { return memo + product.stock; }, 0);
            pm.totalPrice = _.reduce(pm.products, function(memo, product) {
                if (!product.priceBuy || !product.stock)
                  return memo;
                return memo + (product.priceBuy * product.stock);
            }, 0);
          });
        }
    }
})();
