(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('printService', printService);

    /* @ngInject */
    function printService($http, $document, $timeout, $rootScope, $compile, Electron) {
        return {
          print: print
        };
        
        function print(templateUrl, data) {
          $http.get(templateUrl).success(function(template){
            var printScope = $rootScope.$new();
            
            if (data) 
                printScope.data = data;

            var printBox = $compile(angular.element("<div class='print-box'>" + template + "</div>"))(printScope);
            printBox.appendTo('body');
            
            // Wait half a sec, to be sure image is loaded, no better way :'(
            $timeout(function() {
                waitForRenderAndPrint(printScope);
                $timeout(function() { printBox.remove(); }, 1000);
            }, 500);
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
