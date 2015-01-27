'use strict';

/**
 * @ngdoc function
 * @name radarApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the radarApp
 */
angular.module('radarApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
