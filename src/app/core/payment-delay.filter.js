(function() {
    'use strict';
    
    angular
        .module('app.core')
        .filter("paymentDelay", paymentDelay);
        
    function paymentDelay(){
        return function(input, forPrint){
            var pre = forPrint ? "en déant " : "";
            var direct = forPrint ? "comptant" : "Comptant";

            return input && input > 0 ? pre + input + " jours" : direct;
        };
    }
    
}());