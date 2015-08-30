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
              printTemplateUrl: "@",
              search: "&"
            },
            controller: Controller,
            controllerAs: 'dm',
            bindToController: true
        };

        return directive;
    }

    /* @ngInject */
    function Controller(printService) {
        var dm = this;

        dm.print = print;

        function print() {
          printService.print(dm.printTemplateUrl, {});
        }
    }
})();
