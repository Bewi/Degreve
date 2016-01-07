(function() {
  'use strict';

  angular.module('app.invoices', [
    'ngResource',
    'ui.router',
    'ui-notification',
    'ui.bootstrap',
    'app.core',
    'app.customers',
    'app.products'
  ]);
}());
