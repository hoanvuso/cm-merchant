(function () {

  angular.module('CmMerchantConfigApp')
    .controller('ContactPanelController', Controller);

  function Controller($scope, merchantConfigService) {
    $scope.error = {};
    
    function initPhone(name){
      if (merchantConfigService.merchantConfig[name]) {
        var phone = merchantConfigService.merchantConfig[name].toString();
        $scope[name] = [
          phone.substring(0,3),
          phone.substring(3,10)
        ];
      } else {
        $scope[name] = [];
      }
    }
    
    function watchPhone(name){
      $scope.$watch(function() {
        return $scope[name];
      },function(value) {
        if (value.length > 0) {
          merchantConfigService.merchantConfig[name] = value.join("");
          if (merchantConfigService.merchantConfig[name].length < 10) {
            $scope.error[name] = "Phone number must have 10 digits";
          } else {
            $scope.error[name] = "";
          }
        }
      },true);
    }
    
    initPhone('comercialContactPhone');
    watchPhone('comercialContactPhone');
    initPhone('itAdminPhone');
    watchPhone('itAdminPhone');
    initPhone('cmBillingPhone');
    watchPhone('cmBillingPhone');


    $scope.onlyDigits = function($event) {
      if(isNaN(String.fromCharCode($event.keyCode))){
        $event.preventDefault();
      }
    };
    
    this.validate = validate;
    function validate() {
      return $scope.form.validate(true);
    }
  }
})();
