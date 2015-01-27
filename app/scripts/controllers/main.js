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
    storage['radar.connections'] = storage['radar.connections'] || '[{}]';
    var storedConnections;
    try {
      storedConnections = JSON.parse(storage['radar.connections']);
    } catch(e) {
      storedConnections = [];
    }
    var lastCon = storedConnections[storedConnections.length - 1];


    $scope.url = lastCon && lastCon.url || '';
    $scope.port = lastCon && lastCon.port || 80;
    $scope.status = 'disconnected';
    $scope.connect = function() {
      $scope.status = 'connecting';
      delete $scope.elements;
      if ($scope.peer) {
        $scope.peer.$close();
      }
      $scope.peer = new $jet.$Peer({
        url: 'ws://' + $scope.url + ':' + $scope.port,
        scope: $scope
      });
      $scope.peer.$connected.then(function() {
        $scope.status = 'connected';
        var connection = {
          port: $scope.port,
          url: $scope.url
        };
        if (storedConnections.filter(function(stored) {
          if (angular.equals(stored, connection)) {
            return true;
          }
          return false;
        }).length === 0) {
          storedConnections.push(connection);
          storage['radar.connections'] = JSON.stringify(storedConnections);
        };
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

    $scope.fetch = function() {
      if ($scope.status !== 'connected') {
        return;
      }
      $scope.reset();
      $scope.elements = $scope.peer.$fetch({
        sort: {
          from: 1,
          to: 10
        }
      });
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

//    $scope.elements = $scope.peer
  }]);
