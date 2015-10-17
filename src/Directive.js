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
          element.bind('keypress',function() {
            if(element.val().length == element.attr("maxlength")) {
              var $nextElement = angular.element($scope.target);
              if($nextElement.length) {
                $nextElement[0].focus();
              }
            }
          })
        }
      }
    }).directive('changePrefix', function() {
    return {
      restrict: 'A',
      scope: {
        prefix: '=changePrefix'
      },
      link: function ($scope, element, attrs) {
        element.bind('keypress',function() {
          var numberPattern = /\d+/g;
          var number = element.val().match( numberPattern );
          if (number) {
            if ($scope.prefix === 'fixed') {
              element.val('$' + number[0]);
            } else {
              element.val(number + '%');
            }
          }
        });
        $scope.$watch(function() {
          return $scope.prefix;
        },function(value) {
          var numberPattern = /\d+/g;
          var number = element.val().match( numberPattern );
          if (number) {
            if (value === 'fixed') {
              element.attr('maxlength',4)
              element.val('$' + number[0]);
            } else {
              element.attr('maxlength',3)
              element.val(number + '%');
            }
          }
        })
      }
    }
  });
})();