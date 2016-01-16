(function(){
    'use strict';
    
    angular
        .module('app')
        .directive('dwUnique', dwUnique);
        
    /* @ngInject */
    function dwUnique($q) {
        return {
            require: ['ngModel'],
            link: link,
            scope: { dwUnique: '&' }
        };
        
        function link(scope, element, attrs, controllers) {
            if (attrs.disabled)
                return;
                       
            var ngModelController = controllers[0];
            var currentValue;
            
            element.on('blur', validateModel);
            
            scope.$destroy(destroy);
             
            function validateModel() {
                if (currentValue === ngModelController.$modelValue)
                    return;
                
                currentValue = ngModelController.$modelValue;
                $q.when(scope.dwUnique({value: currentValue})).then(function(val) {
                    ngModelController.$setValidity("unique", val);
                    ngModelController.$setValidity("unique", val);
                });
            }
            
            function destroy() {
                element.off('blur', validateModel);
            }           
        }
    }
}());