(function() {
  'use strict';

  angular
    .module('app')
    .directive('ngSubmit', ngSubmit);

  function ngSubmit() {
    var directive = {
      restrict: 'A',
      link: linkFunc
    };

    return directive;

    function linkFunc(scope, element, attr, ctrl) {
      //focus first element
      element.find("input")[0].focus();
    }
  }
})();
