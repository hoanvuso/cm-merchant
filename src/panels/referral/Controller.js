(function () {

  angular.module('CmMerchantConfigApp')
    .controller('ReferralPanelController', Controller);

  function Controller($scope,$rootScope, merchantConfigService) {
    $scope.submitted = false;
    $scope.error = {};
    $scope.industryTypes = [
      {id: 0,name: 'Type 1'},
      {id: 1,name: 'Type 2'},
      {id: 2,name: 'Type 3'},
    ];

    $scope.currentYear = new Date().getFullYear();
    $scope.pastYear = $scope.currentYear - 1;

    if (merchantConfigService.merchantConfig.contacts.keyCommercial.phone) {
      var keyCommercialPhone = merchantConfigService.merchantConfig.contacts.keyCommercial.phone.toString();
      $scope.keyCommercialPhone = [
        keyCommercialPhone.substring(0,3),
        keyCommercialPhone.substring(3,10)
      ]
    } else {
      $scope.keyCommercialPhone = [];
    }

    $scope.$watch(function() {
      return $scope.keyCommercialPhone;
    },function(value) {
      if (value.length > 0) {
        merchantConfigService.merchantConfig.contacts.keyCommercial.phone = value.join("");
        if (merchantConfigService.merchantConfig.contacts.keyCommercial.phone.length < 10) {
          $scope.error.keyCommercialPhone = "Phone number must have 10 digits";
        } else {
          $scope.error.keyCommercialPhone = "";
        }
      } else {
        $scope.error.keyCommercialPhone = "Key commercial phone number is required";
      }
    },true);


    $scope.authorised = function(form) {
      $scope.submitted = true;
      if (form.$valid) {
        if (merchantConfigService.step === 1) {
          merchantConfigService.step = 2;
          $rootScope.currentPanel = 'general';
        }
      }
      //$rootScope.currentPanel = 'confirmation';
    };
  }

})();
