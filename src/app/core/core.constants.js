(function() {
    'use strict';

    angular
        .module('app.core')
        .constant('serviceUrl', 'http://localhost:4242')
        .constant('socketUrl', 'ws://localhost:4243');
})();
