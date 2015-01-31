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
    var storage = $window.localStorage;
    storage['radar.connections'] = storage['radar.connections'] || '[]';
    var storedConnections;
    try {
      storedConnections = JSON.parse(storage['radar.connections']);
    } catch(e) {
      storedConnections = [];
    }
    $scope.storedConnections = storedConnections;
    var validateWsUrl = function(url) {
      var regexp = /(ws|wss):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
      return regexp.test(url);
    };
    $scope.isValidWsUrl = false;
    $scope.removeStoredConnection = function(con) {
      storedConnections.splice(storedConnections.indexOf(con),1);
    };
    $scope.clearStoredConnections = function() {
      storedConnections.length = 0;
    };
    $scope.$watch('newUrl', function(url) {
      $scope.isValidWsUrl = validateWsUrl(url);
      //$scope.$apply();
    });
    $scope.storedConnections = storedConnections;
    $scope.$watch('storedConnections', function(connections) {
      console.log(connections);
      storage['radar.connections'] = JSON.stringify(connections);
    }, true);
    $scope.newUrl = '';
    $scope.status = 'disconnected';
    $scope.disconnect = function() {
      $scope.url = '';
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
        $scope.url = url;
        if (storedConnections.indexOf(url) === -1) {
          storedConnections.push(url);

        }
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
