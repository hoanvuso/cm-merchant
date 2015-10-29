(function () {
  angular.module('CmMerchantConfigApp').directive('emailCheck', function(){
    return {
      restrict: 'A',
      scope: {
        model: '=ngModel'
      },
      link: function(scope, elem){

      }
    };
  }).directive('customOnChange', function() {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var onChangeHandler = scope.$eval(attrs.customOnChange);
        element.bind('change', onChangeHandler);
      }
    };
  }).directive('onlyDigits', function() {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        element.bind('keypress',function($event) {
          if(isNaN(String.fromCharCode($event.keyCode))){
            $event.preventDefault();
          }
        })
      }
    }
  }).directive('changeFocus', function() {
      return {
        restrict: 'A',
        scope: {
          target: '@changeFocus'
        },
        link: function ($scope, element, attrs) {
          element.bind('keydown',function($event) {
            var charCode = ($event.which) ? $event.which : event.keyCode;
            if ((charCode >= 48 && charCode <= 57) || charCode == 43) {
              if (element.val().length == element.attr("maxlength")) {
                var $nextElement = angular.element($scope.target);
                if ($nextElement.length) {
                  $nextElement[0].focus();
                }
              }
            }
          })
        }
      }
    }).directive('changePrefix', function($timeout) {
    return {
      restrict: 'A',
      require: 'ngModel',
      scope: {
        prefix: '=changePrefix'
      },
      link: function ($scope, element, attrs,ctrl) {
        element.bind('keyup',function($event) {
          var numberPattern = /\d+/g;
          var number = element.val().match(numberPattern);
          var charCode = ($event.which) ? $event.which : event.keyCode;
          if ((charCode >= 48 && charCode <= 57) || charCode == 43) {
            if (number) {
              if ($scope.prefix === 'fixed') {
                element.val('$' + number[0]);
                $scope.ngModel = number[0];

              } else {

                element.val(number.join("") + '%');
                $scope.ngModel = number[0];
              }
              $timeout(function() {
                $scope.$apply();
              },1000);
            }
          }
        });
        $scope.$watch(function() {
          return $scope.prefix;
        },function(value) {
          var numberPattern = /\d+/g;
          var number = element.val().match( numberPattern );
          console.log(number);
          if (number) {
            if (value === 'fixed') {
              element.val('$' + number[0]);
              ctrl.$setViewValue(number[0]);
                $scope.ngModel = number[0];
            } else {
              element.val(number.join("") + '%');
              ctrl.$setViewValue(number.join(""));
                $scope.ngModel = number.join("")
            }
            $timeout(function() {
              $scope.$apply();
            },1000);
          }
        })
      }
    }
  }).directive('maxValue',function() {
    return {
      restrict: 'A',
      require: 'ngModel',
      //scope: {
      //  max: '=maxValue'
      //},
      link: function($scope,element,attrs,ctrl) {
        var max = Number(attrs['maxValue']);
        $scope.$watch(function() {
          return ctrl.$modelValue;
        },function(value) {
          if (value) {
            ctrl.$setValidity('maxValue',value <= max)
          }
        });
      }
    }
  }).directive('percentageInput',function() {
    return {
      restrict: 'A',
      require: 'ngModel',
      //scope: {
      //  max: '=maxValue'
      //},
      link: function($scope,element,attrs,ctrl) {
        var decimalPlaces = attrs['decimalPlaces'] ? Number(attrs['decimalPlaces']) : 0;

        ctrl.$formatters.push(function (inputValue) {
          if (inputValue) {
            var formattedValue = parseFloat(inputValue).toFixed(2) + '%';
            element.val(formattedValue);
            return formattedValue;
          } else {
            return '';
          }

        });

        // Parser
        ctrl.$parsers.push(function (inputValue) {
          if (inputValue) {

            var numericValue = Number(parseFloat(inputValue.toString().replace(/[^0-9-.]/g, '')).toFixed(decimalPlaces));
            var sanitizedValue = inputValue.replace(/[^0-9-.]/g, '');
            if (sanitizedValue === '' || sanitizedValue === '-') return '';
            var signPrefix = sanitizedValue.charAt(0) === '-' ? '-' : '';
            var numericIntegerPart = Math.abs(parseInt(sanitizedValue));
            var integerPart = '' + numericIntegerPart;
            if (decimalPlaces == 0) {
              fractionalPart = '';
              periodPresent = false;
            } else if (sanitizedValue.match(/\./)) {
              var fractionalPart = sanitizedValue.replace(/.*\./, '');
              var periodPresent = true;
            } else {
              fractionalPart = '';
              periodPresent = false;
            }

            var formattedValue;
            if (integerPart === inputValue) {
              formattedValue = numericValue + '%';
            } else {


              if (integerPart === '') {
                if (fractionalPart === '') {
                  formattedValue = signPrefix + '0.' + '%';
                } else {
                  formattedValue = signPrefix + '0.' + '%' + fractionalPart.substr(0, decimalPlaces);
                }
              } else {
                if (fractionalPart === '') {
                  formattedValue = signPrefix + numericIntegerPart + (periodPresent ? '.' : '') + '%';
                } else {
                  formattedValue = signPrefix + numericIntegerPart + "." + fractionalPart.substr(0, decimalPlaces) + '%';
                }
              }
            }

            element.val(formattedValue);
            setCaretPosition(element[0], formattedValue.length - 1);
            return Number(numericValue);

          } else if (inputValue === '0') {
            return 0;
          } else {
            return '';
          }

          function setCaretPosition(elem, caretPos) {

            if (elem != null) {
              if (elem.createTextRange) {
                var range = elem.createTextRange();
                range.move('character', caretPos);
                range.select();
              }
              else {
                if (elem.selectionStart) {
                  elem.focus();
                  elem.setSelectionRange(caretPos, caretPos);
                }
                else
                  elem.focus();
              }
            }
          }

        });
      }
    }
  });
})();