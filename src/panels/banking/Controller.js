(function () {

  angular.module('CmMerchantConfigApp')
    .controller('BankingPanelController', Controller);

  function Controller($scope,$rootScope, merchantConfigService) {
    $scope.error = {};
    $scope.submitted = false;

    $scope.onlyDigits = function($event) {
      if(isNaN(String.fromCharCode($event.keyCode))){
        $event.preventDefault();
      }
    };
    if(!merchantConfigService.merchantConfig.banking.settlementAccountBsb){
      merchantConfigService.merchantConfig.banking.settlementAccountBsb = '';
    }
    
    if (merchantConfigService.merchantConfig.banking.settlementAccountBsb) {
      var bsb = merchantConfigService.merchantConfig.banking.settlementAccountBsb.toString();
      var item = bsb.split('-');
      $scope.bsb = [item[0]];
      if(item.length > 1){
        $scope.bsb.push(item[1]);
      }
    } else {
      $scope.bsb = [];
    }

    $rootScope.next = function() {
      $scope.submitted = true;
      if ($scope.form.$valid) {
        $rootScope.currentPanel = 'businessrules';
      }
    };
    $rootScope.back = function() {
      $rootScope.currentPanel = 'administrators';
      console.log($rootScope.currentPanel);
    };

    $scope.$watch(function() {
      return $scope.bsb;
    },function(value) {
      if (value.length > 0) {
        merchantConfigService.merchantConfig.banking.settlementAccountBsb = value.join("-");
        if (merchantConfigService.merchantConfig.banking.settlementAccountBsb.length < 7) {
          $scope.error.bsb = "Settlement Account BSB must have 6 digits";
        } else {
          $scope.error.bsb = "";
        }
      }
    },true);
  }
})();
