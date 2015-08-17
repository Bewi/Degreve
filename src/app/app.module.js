(function () {
    'use strict';

    angular.module('app', [
        /* Libs */
        'ui.router',
        'ui-notification',
        'ngResource',
        'blockUI',
        'cfp.hotkeys',

        /* Core */
        'app.core',

        /* Features */
        'app.products'
    ]);
}());
