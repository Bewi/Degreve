(function() {
    'use strict';

    angular
        .module('app')
        .directive('dwReally', dwReally);

    function dwReally() {
        var directive = {
            restrict: 'A',
            link: linkFunc
        };

        return directive;

        function linkFunc(scope, element, attr, ctrl) {
          element.bind("click", function() {
              var message = attr.dwReally;
              if (message && attr.dwReallyClick && confirm(message)) {
                scope.$apply(attr.dwReallyClick);
              }
          });

          scope.$on("$destroy", function() {
            element.off("click");
          });
        }
    }
})();
