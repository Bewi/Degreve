(function() {
    'use strict';

    angular
        .module('app')
        .directive('orderDirection', orderDirection);

    function orderDirection() {
        var directive = {
            restrict: 'EA',
            template: '<i class="fa fa-chevron-up pull-right" ng-class="{true: \'fa-chevron-up\', false: \'fa-chevron-down\' }[dm.query.orderByDirection == 1]" ng-if="dm.query.orderBy == dm.orderBy"></i>',
            scope: {
              orderBy: "@",
              query: "=orderDirectionQuery"
            },
            controller: function (){},
            controllerAs: 'dm',
            bindToController: true
        };

        return directive;
    }
})();
