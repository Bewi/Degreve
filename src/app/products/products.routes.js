(function () {
  'use strict';

  angular
      .module('app.products')
      .config(configBlock);

  /* @ngInject */
  function configBlock($stateProvider) {
    $stateProvider.state("products", {
      url: '/products?orderBy&orderByDirection&page&pageSize&search',
      templateUrl: 'app/products/products.html',
      controller: 'ProductsController',
      controllerAs: 'vm',
      params: {
        orderBy: 'label',
        orderByDirection: '1',
        page: '0',
        pageSize: '10'
      },
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
  function productListPrepService(ProductsResource, $stateParams) {
    var resource = ProductsResource.query($stateParams);
    return resource.$promise;
  }

  function productPrepService(ProductsResource, $stateParams) {
    if ($stateParams.productId)
      return ProductsResource.get({ id: $stateParams.productId });

    return new ProductsResource({});
  }

}());
