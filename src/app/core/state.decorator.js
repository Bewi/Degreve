//TODO: Replace this with module.decorator, which fails after minification.
//TODO: Should find out why !

(function() {
  'use strict';

  angular
    .module('app.core')
    .config(ConfigStateDecorator);

  /* @NgInject*/
  function ConfigStateDecorator($provide) {
    $provide.decorator('$state', StateDecorator);
  }

  function StateDecorator($delegate) {
    $delegate.search = function(query) {
        return $delegate.go($delegate.current, query);
    };

    return $delegate;
  }
})();
