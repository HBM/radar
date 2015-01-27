'use strict';

angular.module('radarApp')
  .directive('state', [
    function () {
      return {
        restrict: 'A',
        templateUrl: 'partials/state.html',
        replace: true,
        scope: {
          state: '='
        },
        controller: function ($scope) {
          var flattenObject = function(dst, root, parentPath) {
            parentPath = parentPath || '';
            Object.keys(root).forEach(function(key) {
              if (angular.isObject(root[key])) {
                flattenObject(dst,root[key],parentPath + '.' + key);
              } else {
                dst.push({
                  parent: root,
                  parentPath: parentPath,
                  name: key
                });
              }
            });
          };
          $scope.$watch('state', function(state) {
            $scope.flatTree = [];
            flattenObject($scope.flatTree, state.$value);
          });
        },
        link: function (scope, element, attrs) {}
      };
    }
  ]);
