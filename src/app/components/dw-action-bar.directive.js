(function() {
    'use strict';

    angular
        .module('app')
        .directive('dwActionBar', dwActionBar);

    function dwActionBar() {
        var directive = {
            restrict: 'E',
            templateUrl: 'app/components/dw-action-bar.html',
            scope: {
              query: "=",
              addAction: "@",
              printTemplateUrl: "@"
            },
            controller: Controller,
            controllerAs: 'dm',
            bindToController: true
        };

        return directive;
    }

    /* @ngInject */
    function Controller($state, $window, printService) {
        var dm = this;

        dm.print = print;
        dm.search = search;
        dm.goBack = goBack;

        //////////////////////

        function print() {
          printService.print(dm.printTemplateUrl, {});
        }

        function search() {
          dm.query.page = 0;
          $state.search(dm.query);
        }

        function goBack(){
          $window.history.back();
        }
    }
})();
