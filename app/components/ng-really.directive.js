(function() {
    'use strict';

    angular
        .module('app')
        .directive('ngReally', ngReally);

    function ngReally() {
        var directive = {
            restrict: 'A',
            link: linkFunc
        };

        return directive;

        function linkFunc(scope, element, attr, ctrl) {
          element.bind("click", function() {
              var message = attr.ngReally;
              if (message && attr.ngReallyClick && confirm(message)) {
                scope.$apply(attr.ngReallyClick);
              }
          });

          scope.$on("$destroy", function() {
            element.off("click");
          });
        }
    }
})();
