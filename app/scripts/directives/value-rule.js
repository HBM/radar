'use strict';

angular.module('radarApp')
  .directive('valueRule', [
    function () {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elem, attr, ngModel) {
          var regExp = /(.*?)\s*(==|>|<)\s*([^\s]+)\s*/;
          var opsLut = {
            '==': 'equals',
            '>': 'greaterThan',
            '<': 'lessThan'
          };

          var toModel = function(value) {
            var model = ngModel.$modelValue;
            var matches = value.match(regExp);
            if (value === '') {
              model.fieldString = '';
              model.value = undefined;
              ngModel.$setValidity('valueRule', true);
              return model
            }
            if (!matches) {
              ngModel.$setValidity('valueRule', false);
            } else {
              try {
                model.fieldString = matches[1];
                model.op = opsLut[matches[2]];
                if (model.op) {
                  model.value = JSON.parse(matches[3]);
                  ngModel.$setValidity('valueRule', true);
                } else {
                  ngModel.$setValidity('valueRule', false);
                }
              } catch (e) {
                ngModel.$setValidity('valueRule', false);
              }
            }
            return model;
          };

          ngModel.$parsers.unshift(toModel);

          var toView = function(valueRule) {
            if (valueRule.value !== undefined) {
              ngModel.$setValidity('valueRule', true);
              return valueRule.fieldString + ' == ' + JSON.stringify(valueRule.value);
            } else {
              return undefined;
            }
          };

          ngModel.$formatters.push(toView);
        }
      };
    }
  ]);
