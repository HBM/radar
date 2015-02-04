'use strict';

angular.module('radarApp')
  .directive('floatlabel', [
    function () {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {
          var label = scope.$eval(attrs.floatlabel);
          console.log(label);
          $(element).attr('placeholder', label);
          $(element).data('label', label);
          $(element).floatlabel();
        }
      };
    }
  ]);
