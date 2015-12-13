(function() {
  'use strict';

  angular
    .module("app")
    .directive("input", dwInput);

  function dwInput() {
    return {
      restrict: "E",
      require: ["ngModel", "^form"],
      link: link
    };
  }

  function link(scope, element, attrs, controller) {
    var ngModelController = controller[0];
    var formController = controller [1];

    var submittedWatcher = scope.$watch(function() {
      return formController.$submitted;
    }, function() {
      if (formController.$submitted) {
        updateTooltip(getError());
        submittedWatcher(); // Destroy watcher once form has been submitted.
      }
    });

    scope.$watch(getError, function(error) {
      if (ngModelController.$dirty){
        updateTooltip(error, true);
      }
    });

    function getError() {
      for(var key in ngModelController.$error)
      {
        return key;
      }
    }

    function updateTooltip(error, showTooltip) {
      if (!error) {
        destroyTooltip();
      } else {
        updateErrorTooltip(error, showTooltip);
      }
    }

    function destroyTooltip() {
      $(element).tooltip("destroy");
      element.removeAttr("title");
    }

    function updateErrorTooltip(error, showTooltip) {
      var message;
      switch(error) {
        case 'required':
          message = "Champs requis";
          break;
        case 'number':
          message = "Nombre non valide";
          break;
        case 'email':
          message = "Email incorrect";
      }

      element.attr("title", message);

      var tooltip = $(element).tooltip("fixTitle");
      tooltip.data("bs.tooltip").tip().addClass("error");

      if (showTooltip)
        tooltip.tooltip("show");
    }
  }
}());
