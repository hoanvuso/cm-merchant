(function () {

    angular.module('CmMerchantConfigApp')
        .controller('DebtorCommunicationsController', Controller);

    function Controller($scope, merchantConfigService) {

        $scope.merchantConfigService = merchantConfigService;
        merchantConfigService.debtorCommunicationsController = this;
        this.validate = validate;
        $scope.validate = validate;
        $scope.onSeriousArrearsNotificationsChange = onSeriousArrearsNotificationsChange;

        var savedSeriousArrearsNotifications = null;

        function validate() {
            return $scope.form.validate(true);
        }

        function onSeriousArrearsNotificationsChange() {
            if (merchantConfigService.seriousArrearsNotificationsEnabled) {
                if (savedSeriousArrearsNotifications) {
                    merchantConfigService.merchantConfig.debtorCommunications.seriousArrearsNotifications = savedSeriousArrearsNotifications;
                }
            } else {
                savedSeriousArrearsNotifications = merchantConfigService.merchantConfig.debtorCommunications.seriousArrearsNotifications
                    ? merchantConfigService.merchantConfig.debtorCommunications.seriousArrearsNotifications
                    : null;
                merchantConfigService.merchantConfig.debtorCommunications.seriousArrearsNotifications = null;
            }
        }

    }

})();
