(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('printService', printService);

    /* @ngInject */
    function printService($http, $document, $timeout, $rootScope, $compile,Electron) {
        return {
          print: print
        };
        function print(templateUrl, data) {
          $http.get(templateUrl).success(function(template){
            var printScope = $rootScope.$new();

            var printBox = $compile($("<div class='print-box'>" + template + "</div>"))(printScope);
            printBox.appendTo('body');

            waitForRenderAndPrint(printScope);

            $timeout(function() { printBox.remove(); }, 1000);
          });
        }

        function waitForRenderAndPrint (scope) {
            if(scope.$$phase || $http.pendingRequests.length) {
                $timeout(function() { waitForRenderAndPrint(scope); });
            } else {
              Electron.mainWindow.print();
            }
        }
    }
})();
