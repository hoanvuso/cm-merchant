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
    });
})();