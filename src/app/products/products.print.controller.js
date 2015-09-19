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
            pm.products = R.sortBy(R.prop('label'), result.data);

            var sum = R.reduce(add, 0);

            pm.totalStock = sum(R.map(R.prop('stock'), pm.products));
            pm.totalPrice = sum(R.map(calculatePrice, pm.products));
          });
        }

        function add(a, b) {
           return a + b;
        }

        function calculatePrice(product) {
          if (!product.priceBuy || !product.stock)
            return 0;

          return (product.priceBuy * product.stock);
        }
    }
})();
