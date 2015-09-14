(function() {
    'use strict';

    angular
        .module('app.core')
        .filter('highlight', highlight);

    /* @ngInject */
    function highlight($sce) {
        return hightlightFilter;

        function hightlightFilter(text, match) {
            if (!match)
              return $sce.trustAsHtml(text);

            return $sce.trustAsHtml(text.replace(new RegExp(match, 'gi'), '<b>$&</b>'));
        }
    }
})();
