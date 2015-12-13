(function () {
    'use strict';

    angular
        .module('app')
        .config(configBlock);

    /*@ngInject*/
    function configBlock ($urlRouterProvider) {
        $urlRouterProvider.otherwise("/customers");
    }
}());
