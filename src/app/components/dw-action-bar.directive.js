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
    function Controller($state, printService) {
        var dm = this;

        dm.print = print;
        dm.search = search;

        //////////////////////

        function print() {
          printService.print(dm.printTemplateUrl, {});
        }

        function search() {
          dm.query.page = 0;
          $state.transitionTo($state.current.name, dm.query);
        }
    }
})();
