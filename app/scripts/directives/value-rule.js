'use strict';

angular.module('radarApp')
  .directive('valueRule', [
    function () {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elem, attr, ngModel) {
          var regExp = /(.*)\s*(==|>|<)\s*(.*)\s*/
          //For DOM -> model validation
          ngModel.$parsers.unshift(function(value) {
            var matches = value.match(regExp);
            if (!matches) {
              ngModel.$setValidity('valueRule', false);
              return undefined;
            }
            try {
              var valueRule = {};
              valueRule.fieldString = matches[1];
              valueRule.value = JSON.parse(matches[3]);
              ngModel.$setValidity('json', true);
              return valueRule;
            } catch (e) {
              ngModel.$setValidity('json', false);
              return undefined;
            }
          });

          //For model -> DOM validation
          ngModel.$formatters.unshift(function(valueRule) {
            ngModel.$setValidity('valueRule', true);
            return valueRule.fieldString + ' == ' + JSON.stringify(valueRule.value);
          });
        }
      };
    }
  ]);
