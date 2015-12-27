//TODO: Replace this with module.decorator, which fails after minification.
//TODO: Should find out why !

(function() {
  'use strict';

  angular
    .module('app.core')
    .config(ConfigResourceDecorator);

  /* @NgInject*/
  function ConfigResourceDecorator($provide) {
    $provide.decorator('$resource', ResourceDecorator);
  }

  function ResourceDecorator($delegate) {
    var actions = {
      create: {
        method: 'POST'
      },
      update: {
        method: 'PUT'
      },
      query: {
        method: 'GET',
        params: {
            /** 
             * Specify if block-ui should be displayed for that request
             * Used for typeahead (block-ui is making a blur which prevent the typeahead to display data properly)
            **/
            blockUi: true  
        },
        transformResponse: function(data, headers) {
          return {
            data: JSON.parse(data),
            page: parseInt(headers('page')),
            pageSize: parseInt(headers('page-size')),
            total: parseInt(headers('total-count'))
          };
        }
      }
    };

    return function() {
      if (!arguments[2]) {
        arguments.length = 3;
        arguments[2] = {};
      }

      angular.extend(arguments[2], actions);

      var decoratedResource = $delegate.apply(this, arguments);

      decoratedResource.prototype.$save = function(successCallback, errorCallback) {
        if (this._id) {
          return this.$update(successCallback, errorCallback);
        }

        return this.$create(successCallback, errorCallback);
      };

      return decoratedResource;
    };
  }
})();
