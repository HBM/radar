'use strict';

/**
 * @ngdoc function
 * @name radarApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the radarApp
 */

angular.module('radarApp')
  .controller('MainCtrl', ['$scope', '$jet', '$window', function ($scope, $jet, $window) {
    $scope.status = 'disconnected';
    $scope.disconnect = function() {
      $scope.peer.$close();
      delete $scope.elements;
      $scope.status = 'disconnected';
    };
    $scope.connect = function(url) {
      $scope.status = 'connecting';
      delete $scope.elements;
      if ($scope.peer) {
        $scope.peer.$close();
      }
      $scope.peer = new $jet.$Peer({
        url: url,
        scope: $scope
      });
      $scope.peer.$connected.then(function() {
        $scope.status = 'connected';
      }, function() {
        $scope.status = 'disconnected';
      });
    };

    $scope.reset = function() {
      if ($scope.elements) {
        $scope.elements.$unfetch();
      }
      delete $scope.elements;
    };

    $scope.showfetchExpressionAsJSON = false;
    $scope.fetchFrom = 1;
    $scope.fetchTo = 10;
    $scope.fetchCaseSensitive = true;
    $scope.fetchExpression = {
      sort: {}
    };

    $scope.$watch('[fetchFrom, fetchTo, pathFilters, fetchCaseSensitive, valueFilters]', function(fetch) {
      var pathFilters = fetch[2];
      var valueFilters = fetch[4];
      $scope.fetchExpression.sort.from = fetch[0];
      $scope.fetchExpression.sort.to = fetch[1];

      var activePathFilters = pathFilters.filter(function(pathFilter) {
        return pathFilter.active;
      });
      if (activePathFilters.length === 0) {
        delete $scope.fetchExpression.path;
      } else {
        $scope.fetchExpression.path = {};
        $scope.fetchExpression.path.caseInsensitive = !!!fetch[3];
      }
      activePathFilters.forEach(function(pathFilter) {
        $scope.fetchExpression.path[pathFilter.op] = pathFilter.value;
      });

      var activeValueFilters = valueFilters.filter(function(valueFilter) {
        return valueFilter.active;
      });
      delete $scope.fetchExpression.value;
      delete $scope.fetchExpression.valueField;
      activeValueFilters.forEach(function(valueFilter) {
        if (valueFilter.fieldString !== '') {
          $scope.fetchExpression.valueField = $scope.fetchExpression.valueField || {};
          var valueFieldRule = {};
          valueFieldRule[valueFilter.op] = valueFilter.value;
          $scope.fetchExpression.valueField[valueFilter.fieldString] = valueFieldRule;
        } else {
          $scope.fetchExpression.value = $scope.fetchExpression.value || {};
          $scope.fetchExpression.value[valueFilter.op] = valueFilter.value;
        }
      });
      $scope.fetchExpressionJSON = angular.toJson($scope.fetchExpression,2);
    }, true);

    $scope.fetch = function() {
      if ($scope.status !== 'connected') {
        return;
      }
      $scope.reset();
      $scope.elements = $scope.peer.$fetch($scope.fetchExpression);
      $scope.elements.$autoSave(false);
    };

    $scope.inputTypes = {
      string: 'text',
      number: 'number'
    };

    $scope.caseSensitive = false;

    $scope.pathFilters = [
      {
        op: 'contains',
        value: '',
        active: true
      },
      {
        op: 'startsWith',
        value: '',
        active: false
      }
    ];

    $scope.valueFilters = [
      {
        op: 'equals',
        value: '',
        fieldString: '',
        active: false,
        type: 'string'
      },
      {
        op: 'lessThan',
        value: '',
        fieldString: '',
        active: false,
        type: 'number'
      }
    ];

  }]);
