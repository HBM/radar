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
