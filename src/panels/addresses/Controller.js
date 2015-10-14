(function () {

  angular.module('CmMerchantConfigApp')
    .controller('AddressesPanelController', Controller);

  function Controller($scope, merchantConfigService) {
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
      },
    ]
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
