'use strict';

angular.module('radarApp')
    .directive('connectionSetup', ['$window',
				   function ($window) {
				       return {
					   restrict: 'A',
					   templateUrl: 'partials/connection-setup.html',
					   replace: true,
					   scope: {
					       connect: '&',
					       status: '=',
					       disconnect: '&'
					   },
					   controller: function ($scope) {
					       $scope.state = {
						   expanded: false,
						   url: ''
					       };
					       var storage = $window.localStorage;
					       storage['radar.connections'] = storage['radar.connections'] || '[]';
					       var storedConnections;
					       try {
						   storedConnections = JSON.parse(storage['radar.connections']);
					       } catch(e) {
						   storedConnections = [];
					       }
					       $scope.storedConnections = storedConnections;
					       if (storedConnections.length > 0) {
						   $scope.state.url = storedConnections[0];
					       }
					       var validateWsUrl = function(url) {
						   var regexp = /(ws|wss):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
						   return regexp.test(url);
					       };
					       $scope.isValidWsUrl = false;
					       $scope.removeStoredConnection = function(con) {
						   storedConnections.splice(storedConnections.indexOf(con),1);
					       };
					       $scope.$watch('state.url', function(url) {
						   $scope.isValidWsUrl = validateWsUrl(url);
					       });
					       $scope.storedConnections = storedConnections;
					       $scope.$watch('storedConnections', function(connections) {
						   storage['radar.connections'] = JSON.stringify(connections);
					       }, true);

					       $scope.$watch('status', function(status) {
						   if (status === 'connected') {
						       if ($scope.storedConnections.indexOf($scope.state.url) === -1) {
							   $scope.storedConnections.unshift($scope.state.url);
						       }
						       $scope.nextAction = 'disconnect';
						   } else if (status === 'disconnected') {
						       $scope.nextAction = 'connect';
						   } else {
						       $scope.nextAction = false;
						   }
					       });

					       $scope.submit = function() {
						   if ($scope.nextAction) {
						       console.log($scope[$scope.nextAction]);
						       $scope[$scope.nextAction]({url: $scope.state.url});

						   }
					       };
					   }
				       };
				   }
				  ]);
