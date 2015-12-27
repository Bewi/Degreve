(function () {
    'use strict';

    angular.module('app', [
        /* Libs */
        'ui.router',
        'ui-notification',
        'ngResource',
        'blockUI',
        'cfp.hotkeys',
        'ui.bootstrap',

        /* Core */
        'app.core',

        /* Features */
        'app.products',
        'app.customers',
        'app.invoices'
    ]);
}());
