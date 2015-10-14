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
  });
})();