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
          var flattenObject = function(dst, parent, parentPath) {
            if (!angular.isDefined(parentPath)) {
              parentPath = '';
            }
            dst[parentPath] = [];
            Object.keys(parent).forEach(function(key) {
              if (angular.isObject(parent[key])) {
                flattenObject(dst, parent[key], parentPath + '.' + key);
              } else {
                dst[parentPath].push({
                  parent: parent,
                  name: key
                });
              }
            });
          };
          $scope.$watch('state', function(state) {
            $scope.flatTree = {};
            flattenObject($scope.flatTree, state.$value);
          });
        }
      };
    }
  ]);
