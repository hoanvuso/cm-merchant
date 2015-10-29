(function () {

  angular.module('CmMerchantConfigApp')
    .controller('BankingPanelController', Controller);

  function Controller($scope,$rootScope, merchantConfigService,Modal) {
    $scope.error = {};
    $scope.submitted = $rootScope.bankingClean;

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

    $scope.$watch(function() {
      return $scope.form.$valid
    },function(value) {
      $rootScope.formValid = value;
    });

    $scope.$watch(function() {
      return $scope.form.$dirty
    },function(value) {
      if (!$rootScope.formDirty) {
        $rootScope.formDirty = value;
      }
    });

    $rootScope.next = function() {
      $scope.submitted = true;
      $rootScope.bankingInvalid = !$scope.form.$valid;
      $rootScope.bankingClean = !$scope.form.$dirty;
      $rootScope.currentPanel = 'businessrules';
    };

    $rootScope.back = function() {
      $rootScope.currentPanel = 'administrators';
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
