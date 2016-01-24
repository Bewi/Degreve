(function(){
    'use strict';
    
    angular
        .module('app')
        .directive('dwUnique', dwUnique);
        
    /* @ngInject */
    function dwUnique($q, $timeout) {
        return {
            require: ['ngModel'],
            link: link,
            scope: { dwUnique: '&' }
        };
        
        function link(scope, element, attrs, controllers) {
            if (attrs.disabled)
                return;
                
            var ngModelController = controllers[0];
            var initialValue = attrs.dwUniqueInitialValue;           
            var currentValue;
            
            element.on('blur', validateModel);
            
            scope.$destroy(destroy);
             
            function validateModel() {
                
                if (currentValue === ngModelController.$modelValue)
                    return;
                    
                currentValue = ngModelController.$modelValue;
                    
                if (initialValue == currentValue) {
                    $timeout(function() {
                        ngModelController.$setValidity("unique", true);
                    });
                    return;
                }
                
                $q.when(scope.dwUnique({value: currentValue})).then(function(val) {
                    ngModelController.$setValidity("unique", val);
                });
            }
            
            function destroy() {
                element.off('blur', validateModel);
            }           
        }
    }
}());