(function() {
    'use strict';

    angular
        .module('app')
        .directive('dwPagination', dwPagination);

    function dwPagination() {
        var directive = {
            restrict: 'E',
            templateUrl: 'app/components/dw-pagination.html',
            scope: {
              total: "=",
              query: "="
            },
            controller: Controller,
            controllerAs: 'dm',
            bindToController: true
        };

        return directive;
    }

    /* @ngInject */
    function Controller($scope, $state) {
        var dm = this;

        dm.setPage = setPage;
        dm.pageCount = 0;
        dm.pages = [];

        var limitOfVisiblePages = 3;

        activate();

        function activate() {
          refreshPages(dm.query.page);
        }

        function setPage(page) {
          if (page == dm.query.page || page < 0 || page > dm.pageCount - 1)
            return;

          var query = angular.copy(dm.query);
          query.page = page;
          $state.transitionTo($state.current.name, query);
        }

        function refreshPages(page) {
          dm.pageCount = Math.ceil(dm.total / dm.query.pageSize);

          if (dm.pageCount <= 1)
            return;

          dm.pages.length = 0;

          var startIndex = getStartIndex(page, dm.pageCount);
          var endIndex = getEndIndex(startIndex, dm.pageCount, limitOfVisiblePages);

          for (var i = startIndex; i < endIndex; i++) {
            dm.pages.push(i);
          }
        }
    }

    function getStartIndex(page, pageCount) {
      var startIndex = 0;

      if (page > 1) {
        if (page == pageCount - 1)
          startIndex = page - 2;
        else
          startIndex = page - 1;
      }

      return startIndex;
    }

    function getEndIndex(startIndex, pageCount, limitOfVisiblePages) {
      var endIndex = startIndex + limitOfVisiblePages;

      if (endIndex <= pageCount)
        return endIndex;

      return pageCount;
    }
})();
