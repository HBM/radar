'use strict';

angular.module('radarApp')
  .directive('method', [
    function () {
      return {
        restrict: 'A',
        templateUrl: 'partials/method.html',
        replace: true,
        scope: {
          method: '='
        },
        controller: function ($scope) {

          $scope.argsJSON = '[]';

          $scope.$watch('argsJSON', function(argsJSON) {
            try {
              $scope.args = JSON.parse(argsJSON);
            } catch(e) {
              $scope.args = [];
            }
          });

        }
      };
    }
  ]);
