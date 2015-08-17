(function () {
    'use strict';

    angular
        .module('app')
        .directive('fullHeight', fullHeight);

    /* @ngInject */
    function fullHeight ($window) {
        return {
            restrict: 'A',
            link: link
        };

        ////////////////

        function link(scope, element, attr) {
            setHeight();

            angular.element($window).bind('resize', function (){
               setHeight();
            });

            function setHeight() {
                element.css('height', $window.innerHeight +"px");
            }
        }
    }
}());
