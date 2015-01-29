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
          var flatTree = {};
          $scope.flatTree = flatTree;
          $scope.asJSON = false;

          var inputTypes = {
            object: 'text', // applies to arrays
            number: 'number',
            string: 'text',
            boolean: 'checkbox'
          };

          var flattenObject = function(parent, parentPath) {
            if (!angular.isDefined(parentPath)) {
              parentPath = '';
            }
            flatTree[parentPath] = {};//flatTree[parentPath] || {};
            Object.keys(parent).forEach(function(key) {
              if (angular.isObject(parent[key])) {
                flattenObject(parent[key], parentPath + '.' + key);
              } else {
                flatTree[parentPath][key] = {
                  parent: parent,
                  name: key,
                  inputType: inputTypes[typeof parent[key]]
                };
              }
            });
            angular.forEach(flatTree, function(childs, parentPath) {
              if (Object.keys(childs).length === 0) {
                delete flatTree[parentPath];
              }
            });
          };


          $scope.$watch('state.$value', function(value) {
            Object.keys(flatTree).forEach(function(key) {
              delete flatTree[key];
            });

            if (angular.isObject(value)) {
              flattenObject(value);
            } else {
              flatTree[''] = {
                '': {
                  parent: {
                    '': value
                  },
                  name: ''
                }
              };
            }
            $scope.valueAsJSON = angular.toJson(value);
          });

          $scope.saveJSON = function() {
            try {
              $scope.state.$value = JSON.parse($scope.valueAsJSON);
              $scope.state.$save();
            } catch(e) {
              
            }
          };
        }
      };
    }
  ]);
