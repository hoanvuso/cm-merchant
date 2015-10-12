(function () {

    angular.module('CmMerchantConfigApp')
        .controller('EmailAddressesPanelController', Controller);

    function Controller($scope, merchantConfigService) {

        merchantConfigService.emailAddressesController = this;
        this.validate = validate;

        function validate() {
            return $scope.form.validate(true);
        }

    }

})();
