(function () {

    angular.module('CmMerchantConfigApp')
        .controller('BusinessRulesPanelController', Controller);

    function Controller($scope, merchantConfigService) {

        var savedDiscountForEarlyPaymentChangeValues = null, savedUniversallyAvailablePaymentTerms = [], savedDebtorSurcharges = null;

        $scope.paymentTerms = {
            termDuration: null,
            paymentInterval: null
        };

        merchantConfigService.businessRulesController = this;
        $scope.validate = validate;
        $scope.onDiscountForEarlyPaymentChange = onDiscountForEarlyPaymentChange;
        $scope.onUniversallyAvailablePaymentTerms = onUniversallyAvailablePaymentTerms;
        $scope.updateUniversallyAvailablePaymentTerms = updateUniversallyAvailablePaymentTerms;
        $scope.onDebtorSurchargesChange = onDebtorSurchargesChange;

        function validate() {
            return $scope.form.validate(true);
        }

        function onDiscountForEarlyPaymentChange() {
            if ($scope.discountForEarlyPayment) {
                if (savedDiscountForEarlyPaymentChangeValues && !( merchantConfigService.merchantConfig.discounts.earlyPaymentDays
                                                                   || merchantConfigService.merchantConfig.discounts.earlyPaymentDiscountInvoiceMin
                                                                   || merchantConfigService.merchantConfig.discounts.earlyPaymentDiscountAmount
                                                                   || merchantConfigService.merchantConfig.discounts.earlyPaymentDiscountRate))
                    merchantConfigService.merchantConfig.discounts = savedDiscountForEarlyPaymentChangeValues;
            } else {
                savedDiscountForEarlyPaymentChangeValues = merchantConfigService.merchantConfig.discounts
                    ? {
                    "earlyPaymentDays": merchantConfigService.merchantConfig.discounts.earlyPaymentDays,
                    "earlyPaymentDiscountInvoiceMin": merchantConfigService.merchantConfig.discounts.earlyPaymentDiscountInvoiceMin,
                    "earlyPaymentDiscountAmount": merchantConfigService.merchantConfig.discounts.earlyPaymentDiscountAmount,
                    "earlyPaymentDiscountRate": merchantConfigService.merchantConfig.discounts.earlyPaymentDiscountRate
                }
                    : null;
                merchantConfigService.merchantConfig.discounts = undefined;

            }
        }

        function onDebtorSurchargesChange() {
            if ($scope.debtorSurcharges) {
                if (savedDebtorSurcharges) {
                    merchantConfigService.merchantConfig.fees = savedDebtorSurcharges;
                }
            } else {
                savedDebtorSurcharges = merchantConfigService.merchantConfig.fees
                    ? merchantConfigService.merchantConfig.fees
                    : null;
                merchantConfigService.merchantConfig.fees = {
                    "directDebitChargeToDebtor": 0.00,
                    "visaRateToDebtor": 0.00,
                    "mastercardRateToDebtor": 0.00,
                    "amexRateToDebtor": 0.00,
                    "dinersRateToDebtor": 0.00
                };

            }
        }

        function onUniversallyAvailablePaymentTerms() {
            if (merchantConfigService.universallyAvailablePaymentTermsSelected) {
                merchantConfigService.universallyAvailablePaymentTerms = savedUniversallyAvailablePaymentTerms
                    ? savedUniversallyAvailablePaymentTerms
                    : {
                    termDuration: null,
                    paymentInterval: null
                };
            } else {
                savedUniversallyAvailablePaymentTerms = merchantConfigService.universallyAvailablePaymentTerms;
                merchantConfigService.universallyAvailablePaymentTerms = null;
            }
            updateUniversallyAvailablePaymentTerms();
        }

        function updateUniversallyAvailablePaymentTerms() {
            if (merchantConfigService.universallyAvailablePaymentTerms) {
                merchantConfigService.merchantConfig.paymentTerms.availablePaymentTerms = [
                    {
                        "description": Number(merchantConfigService.universallyAvailablePaymentTerms.paymentInterval) === 1
                            ? "A " + merchantConfigService.universallyAvailablePaymentTerms.termDuration + " month term, paying once a month"
                            : "A " + merchantConfigService.universallyAvailablePaymentTerms.termDuration + " month term, paying every " + merchantConfigService.universallyAvailablePaymentTerms.paymentInterval + " months",
                        "termDurationUnit": "Month",
                        "termDuration": merchantConfigService.universallyAvailablePaymentTerms.termDuration,
                        "paymentIntervalUnit": "Month",
                        "paymentInterval": merchantConfigService.universallyAvailablePaymentTerms.paymentInterval
                    }
                ];
            } else {
                merchantConfigService.merchantConfig.paymentTerms.availablePaymentTerms = [];
            }
        }

    }

})();
