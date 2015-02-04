'use strict';

angular.module('radarApp')
  .directive('floatlabel', [
    function () {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var label = scope.$eval(attrs.floatlabel);
	    var placeholder = scope.$eval(attrs.placeholder);
            console.log(label, placeholder);
          $(element).attr('placeholder', placeholder || label);
          $(element).data('label', label);
          $(element).floatlabel();
        }
      };
    }
  ]);
