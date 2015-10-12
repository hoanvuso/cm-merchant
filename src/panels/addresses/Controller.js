(function () {

    angular.module('CmMerchantConfigApp')
        .controller('AddressesPanelController', Controller);

    function Controller($scope, merchantConfigService) {

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
