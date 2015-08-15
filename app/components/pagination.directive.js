(function() {
    'use strict';

    angular
        .module('app')
        .directive('pagination', pagination);

    function pagination() {
        var directive = {
            restrict: 'E',
            templateUrl: 'app/components/pagination.html',
            scope: {
              total: "=",
              pageSize: "=",
              currentPage: "=",
              pagingAction: "&"
            },
            controller: Controller,
            controllerAs: 'dm',
            bindToController: true
        };

        return directive;
    }

    /* @ngInject */
    function Controller($scope) {
        var dm = this;

        dm.setPage = setPage;
        dm.pageCount = 0;
        dm.pages = [];

        var limitOfVisiblePages = 3;

        activate();

        function activate() {
          refreshPages(dm.currentPage);

          $scope.$watch(function () {
             return dm.total;
         },function(value){
             refreshPages(dm.page);
         });
        }

        function setPage(page) {
          if (page == dm.currentPage || page < 0 || page > dm.pageCount - 1)
            return;

          dm.pagingAction({ page: page });

          refreshPages(page);
        }

        function refreshPages(page) {
          dm.pageCount = Math.ceil(dm.total / dm.pageSize);

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
