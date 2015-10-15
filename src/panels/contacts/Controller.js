(function() {
  angular.module('CmMerchantConfigApp')
    .controller('ContactPanelController', Controller);

  function Controller($scope,$rootScope, merchantConfigService) {
    $scope.error = {};

    if (merchantConfigService.merchantConfig.contacts.keyCommercial.phone) {
      var keyCommercialPhone = merchantConfigService.merchantConfig.contacts.keyCommercial.phone.toString();
      $scope.keyCommercialPhone = [
        keyCommercialPhone.substring(0,3),
        keyCommercialPhone.substring(3,10)
      ]
    } else {
      $scope.keyCommercialPhone = [];
    }

    if (merchantConfigService.merchantConfig.contacts.it.phone) {
      var itPhone = merchantConfigService.merchantConfig.contacts.it.phone.toString();
      $scope.itPhone = [
        itPhone.substring(0,3),
        itPhone.substring(3,10)
      ]
    } else {
      $scope.itPhone = [];
    }

    if (merchantConfigService.merchantConfig.contacts.oneBoxBilling.phone) {
      var oneBoxBillingPhone = merchantConfigService.merchantConfig.contacts.oneBoxBilling.phone.toString();
      $scope.oneBoxBillingPhone = [
        oneBoxBillingPhone.substring(0,3),
        oneBoxBillingPhone.substring(3,10)
      ]
    } else {
      $scope.oneBoxBillingPhone = [];
    }


    $scope.onlyDigits = function($event) {
      if(isNaN(String.fromCharCode($event.keyCode))){
        $event.preventDefault();
      }
    };

    $scope.changeFocusKeyCommercial = function() {
      if ($scope.keyCommercialPhone[0] && $scope.keyCommercialPhone[0].length >= 2) {
        angular.element('#keyCommercialPhone').trigger('focus');
      }
    };

    $scope.changeFocusIt = function() {
      if ($scope.itPhone[0] && $scope.itPhone[0].length >= 2) {
        angular.element('#itPhone').trigger('focus');
      }
    };

    $scope.changeFocusOneBoxBilling = function() {
      if ($scope.oneBoxBillingPhone[0] && $scope.oneBoxBillingPhone[0].length >= 2) {
        angular.element('#oneBoxBillingPhone').trigger('focus');
      }
    };

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
        $scope.error.keyCommercialPhone = "This input is required";
      }
    },true);

    $scope.$watch(function() {
      return $scope.itPhone;
    },function(value) {
      if (value.length > 0) {
        merchantConfigService.merchantConfig.contacts.it.phone = value.join("");
        if (merchantConfigService.merchantConfig.contacts.it.phone.length < 10) {
          $scope.error.itPhone = "Phone number must have 10 digits";
        } else {
          $scope.error.itPhone = "";
        }
      } else {
        $scope.error.itPhone = "This input is required";
      }
    },true);

    $scope.$watch(function() {
      return $scope.oneBoxBillingPhone;
    },function(value) {
      if (value.length > 0) {
        merchantConfigService.merchantConfig.contacts.oneBoxBilling.phone = value.join("");
        if (merchantConfigService.merchantConfig.contacts.oneBoxBilling.phone.length < 10) {
          $scope.error.oneBoxBillingPhone = "Phone number must have 10 digits";
        } else {
          $scope.error.oneBoxBillingPhone = "";
        }
      } else {
        $scope.error.oneBoxBillingPhone = "This input is required";
      }
    },true);

    $rootScope.next = function() {
      $scope.submitted = true;
      if ($scope.form.$valid) {
        $rootScope.currentPanel = 'administrators';
      }
    };
    $rootScope.back = function() {
      $rootScope.currentPanel = 'addresses';
    };
  }
})();