(function () {

    angular.module('CmMerchantConfigApp')
        .controller('GeneralPanelController', Controller);

    function Controller($scope, merchantConfigService) {

        merchantConfigService.generalController = this;
        this.validate = validate;

        if (merchantConfigService.merchantConfig) {
            if (merchantConfigService.merchantConfig.general.entityType == 'SoleTrader'
                || merchantConfigService.merchantConfig.general.entityType == 'PtyLtd'
                || merchantConfigService.merchantConfig.general.entityType == 'Partnership') {
                $scope.entityTypeOptionsModel = merchantConfigService.merchantConfig.general.entityType;
            } else {
                $scope.entityTypeOptionsModel = 'Other';
                $scope.otherEntityType = merchantConfigService.merchantConfig.general.entityType;
            }

            if (merchantConfigService.merchantConfig.general.entityType == 'SoleTrader'
                || merchantConfigService.merchantConfig.general.entityType == 'PtyLtd'
                || merchantConfigService.merchantConfig.general.entityType == 'Partnership') {
                $scope.accountingPackageOptionsModel = merchantConfigService.merchantConfig.general.entityType;
            } else {
                $scope.accountingPackageOptionsModel = 'Other';
                $scope.otherAccountingPackage = merchantConfigService.merchantConfig.general.entityType;
            }
        }

        function validate() {
            return $scope.form.validate(true);
        }

        this.selectEntityType = function (entityType) {
            var asdfs = 3;
        }

    }

})();
