(function () {

  angular.module('CmMerchantConfigApp')
    .controller('AddressesPanelController', Controller);

  function Controller($scope,$rootScope, merchantConfigService) {
    $scope.submitted = false;
    $scope.activeTab = 'business';
    $scope.changeTab = function(tab) {
      $scope.activeTab = tab
    };

    $scope.states = [
      {
        name: "state 1",
        value: '0'
      },
      {
        name: "state 2",
        value: '1'
      },
      {
        name: "state 3",
        value: '2'
      }
    ];

    $rootScope.next = function() {
      $scope.submitted = true;
      if ($scope.form.$valid) {
        console.log(merchantConfigService.mailingAddressSameAsBusinessAddress);
        if ($scope.form1.$valid || merchantConfigService.mailingAddressSameAsBusinessAddress) {
          $rootScope.currentPanel = 'contacts';
        } else {
          $scope.activeTab = 'mailing'
        }
      }
    };
    $rootScope.back = function() {
      $rootScope.currentPanel = 'general';
    };

    merchantConfigService.addressesController = this;
    this.validate = validate;
    $scope.validate = validate;
    $scope.onSameAsBusinessAddressChange = onSameAsBusinessAddressChange;

    function onSameAsBusinessAddressChange() {
      if (merchantConfigService.mailingAddressSameAsBusinessAddress) {
        merchantConfigService.merchantConfig.addresses.mailing = merchantConfigService.merchantConfig.addresses.business;
      } else {
        merchantConfigService.merchantConfig.addresses.mailing = null;
      }
    }

    function validate() {
      return $scope.form.validate(true);
    }

  }

})();
