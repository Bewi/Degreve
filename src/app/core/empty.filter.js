(function() {
    'use strict';
    
    angular
        .module('app.core')
        .filter("empty", emptyFilter);

    function emptyFilter(){
        return function(input, defaultValue){
            return input ? input : defaultValue;
        };
    }
    
}());
