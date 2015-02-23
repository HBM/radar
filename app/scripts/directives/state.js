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
            if (angular.isArray(parent)) {
              parent.forEach(function(child, index) {
                var key = '[' + index + ']';
                if (angular.isObject(child)) {
                  flattenObject(child, parentPath + '.' + key);
                } else {
                  flatTree[parentPath][key] = {
                    parent: parent,
                    key: index,
                    name: key,
                    inputType: inputTypes[typeof child]
                  };
                }
              });
            } else {
              Object.keys(parent).forEach(function(key) {
                console.log('key',key, typeof key)
                if (angular.isObject(parent[key])) {
                  flattenObject(parent[key], parentPath + '.' + key);
                } else {
                  flatTree[parentPath][key] = {
                    parent: parent,
                    key: key,
                    name: key,
                    inputType: inputTypes[typeof parent[key]]
                  };
                }
              });
            }
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
                  parent: $scope.state,
                  name: '',
                  key: '$value',
                  inputType: inputTypes[typeof value]
                }
              };
            }
            $scope.valueAsJSON = angular.toJson(value,2);
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
