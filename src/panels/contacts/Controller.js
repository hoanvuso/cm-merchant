(function() {
  angular.module('CmMerchantConfigApp')
    .controller('ContactPanelController', Controller);

  function Controller($scope,$rootScope, merchantConfigService,Modal) {
    $scope.error = {};
    $scope.submitted = $rootScope.contactsInvalid;

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

    if (merchantConfigService.merchantConfig.contacts.accountReceivable.phone) {
      var accountReceivablePhone = merchantConfigService.merchantConfig.contacts.accountReceivable.phone.toString();
      $scope.accountReceivablePhone = [
        accountReceivablePhone.substring(0,3),
        accountReceivablePhone.substring(3,10)
      ]
    } else {
      $scope.accountReceivablePhone = [];
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

    $scope.$watch(function() {
      return $scope.accountReceivablePhone;
    },function(value) {
      if (value.length > 0) {
        merchantConfigService.merchantConfig.contacts.accountReceivable.phone = value.join("");
        if (merchantConfigService.merchantConfig.contacts.accountReceivable.phone.length < 10) {
          $scope.error.accountReceivablePhone = "Phone number must have 10 digits";
        } else {
          $scope.error.accountReceivablePhone = "";
        }
      } else {
        $scope.error.accountReceivablePhone = "This input is required";
      }
    },true);

    $scope.$watch(function() {
      return $scope.form.$valid
    },function(value) {
      $rootScope.formValid = value;
    });

    $rootScope.next = function() {
      $scope.submitted = true;
      $rootScope.contactsInvalid = !$scope.form.$valid;
      $rootScope.currentPanel = 'administrators';
    };
    $rootScope.back = function() {
      $rootScope.currentPanel = 'addresses';
    };
  }
})();