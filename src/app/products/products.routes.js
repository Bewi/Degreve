(function () {
  'use strict';

  angular
      .module('app.products')
      .config(configBlock);

  /* @ngInject */
  function configBlock($stateProvider) {
    $stateProvider.state("products", {
      url: '/products',
      templateUrl: 'app/products/products.html',
      controller: 'ProductsController',
      controllerAs: 'vm',
      resolve: { productsPrep: productListPrepService }
    }).state("products-add", {
      url: '/products-form/:productId',
      templateUrl: 'app/products/products.form.html',
      controller: 'ProductsFormController',
      controllerAs: 'vm',
      resolve: { product: productPrepService }
    });
  }

  /* @ngInject */
  function productListPrepService(ProductsResource) {
    var query = new Query("label");
    var resource = ProductsResource.query(query);
    return resource.$promise;
  }

  function productPrepService(ProductsResource, $stateParams) {
    if ($stateParams.productId)
      return ProductsResource.get({ id: $stateParams.productId });

    console.log(new ProductsResource());
    return new ProductsResource({});
  }

}());
