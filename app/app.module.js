(function () {
    'use strict';

    angular.module('app', [
        /* Libs */
        'ui.router',
        'ui-notification',
        'ngResource',
        'blockUI',

        /* Core */
        'app.core',

        /* Features */
        'app.products'
    ]);
}());
