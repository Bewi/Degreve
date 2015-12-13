(function () {
  'use strict';

  angular
      .module('app.products')
      .config(configBlock);

  /* @ngInject */
  function configBlock($stateProvider) {
    $stateProvider.state('products', {
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
    }).state('product-editor', {
      url: '/product-editor/:productId',
      templateUrl: 'app/products/product-editor.html',
      controller: 'ProductEditorController',
      controllerAs: 'vm',
      resolve: { product: productPrepService }
    });
  }

  /* @ngInject */
  function productListPrepService(ProductsResource, $stateParams) {
    return ProductsResource.query($stateParams).$promise;
  }

  /* @ngInject */
  function productPrepService(ProductsResource, $stateParams) {
    if ($stateParams.productId)
      return ProductsResource.get({ id: $stateParams.productId }).$promise;

    return new ProductsResource({});
  }

}());
