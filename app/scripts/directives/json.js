'use strict';

angular.module('radarApp')
  .directive('json', [
    function () {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elem, attr, ngModel) {
          var types = attr.json.split(',');

          //For DOM -> model validation
          ngModel.$parsers.unshift(function(value) {
            var valid;
            if (value === '') {
              ngModel.$setValidity('json', true);
              return undefined;
            }
            try {
              value = JSON.parse(value);
              if (types.length > 0) {
                valid = types.indexOf(typeof(value)) !== -1;
              } else {
                valid = true;
              }
              ngModel.$setValidity('json', valid);
              return valid ? value : undefined;
            } catch (e) {
              ngModel.$setValidity('json', false);
              return undefined;
            }
          });

          //For model -> DOM validation
          // ngModel.$formatters.unshift(function(value) {
          //   ngModel.$setValidity('blacklist', blacklist.indexOf(value) === -1);
          //   return value;
          // });
        }
      };
    }
  ]);
