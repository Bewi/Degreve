(function() {
    'use strict';

    angular
        .module('app')
        .directive('actionBar', actionBar);

    function actionBar() {
        var directive = {
            restrict: 'E',
            templateUrl: 'app/components/action-bar.html',
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
