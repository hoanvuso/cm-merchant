(function () {

    angular.module('CmCommon')
        .controller('RemainingOnTermsDialogController', Controller);

    function Controller($scope, $http, $filter, cm, ji, merchantConfig, debtor, totalOutstandingAmount) {

        $scope.currentPanel = 'paymentTermAndFrequencyPanel';
        $scope.offeredPaymentTerms = debtor.offeredPaymentTerms;
        $scope.merchantConfig = merchantConfig;
        $scope.totalOutstandingAmount = totalOutstandingAmount;

        $scope.model = {
            chosenTerm: $scope.offeredPaymentTerms[0],
            paymentMethod: 'Visa',
            card: {
                number: null
            }
        };

        $scope.onExpiryMonthChange = onExpiryMonthChange;
        $scope.onExpiryYearChange = onExpiryYearChange;
        $scope.extractFirstInstalmentDate = extractFirstInstalmentDate;
        $scope.extractFrequency = extractFrequency;
        $scope.extractInstallmentAmountsText = extractInstallmentAmountsText;
        $scope.paymentTermAndFrequencyPanelNext = paymentTermAndFrequencyPanelNext;
        $scope.paymentMethodPanelPrevious = paymentMethodPanelPrevious;
        $scope.paymentMethodPanelNext = paymentMethodPanelNext;
        $scope.proposedAgreementPanelPrevious = proposedAgreementPanelPrevious;
        $scope.proposedAgreementPanelNext = proposedAgreementPanelNext;
        $scope.ccDetailsPanelPrevious = ccDetailsPanelPrevious;
        $scope.ccDetailsPanelNext = ccDetailsPanelNext;
        $scope.ddrDetailsPanelPrevious = ddrDetailsPanelPrevious;
        $scope.ddrDetailsPanelNext = ddrDetailsPanelNext;

        function onExpiryMonthChange(creditCardForm) {
            if (creditCardForm.cardExpiryMonth.$viewValue.length > 1) {
                creditCardForm.cardExpiryYear.element.focus();
            }
        }

        function onExpiryYearChange(creditCardForm) {
            if (creditCardForm.cardExpiryYear.$viewValue.length > 1) {
                creditCardForm.cvc.element.focus();
            }
        }

        function paymentTermAndFrequencyPanelNext() {
            slideInFromRight('paymentMethodPanel');
        }

        function paymentMethodPanelPrevious() {
            slideInFromLeft('paymentTermAndFrequencyPanel');
        }

        function paymentMethodPanelNext() {

            $http.post('/sapi/remainingOnTermsDialog/generateTermPaymentAgreementForOutstandingInvoices',
                {
                    debtorId: debtor.debtorId,
                    merchantAvailablePaymentTermId: $scope.model.chosenTerm.merchantAvailablePaymentTermId,
                    debtorAvailablePaymentTermId: $scope.model.chosenTerm.debtorAvailablePaymentTermId,
                    paymentType: translatePaymentMethod($scope.model.paymentMethod),
                    expectedOutstandingAmount: $scope.totalOutstandingAmount
                })
                .then(function (response) {
                          $scope.model.proposedTermPaymentAgreement = response.data;
                          slideInFromRight('proposedAgreementPanel');
                      },
                      function (response) {
                          cm.handleHttpAPIError(response);
                      });
        }

        function proposedAgreementPanelPrevious() {
            slideInFromLeft('paymentMethodPanel');
        }

        function proposedAgreementPanelNext() {
            slideInFromRight($scope.model.paymentMethod === 'DDR' ? 'ddrDetailsPanel' : 'ccDetailsPanel');
        }

        function ccDetailsPanelPrevious() {
            slideInFromLeft('proposedAgreementPanel');
        }

        function ccDetailsPanelNext(creditCardForm) {

            // "Touch" all the fields so error messages show on failed validation
            creditCardForm.cardNumber.$setDirty();
            creditCardForm.cardExpiryMonth.$setDirty();
            creditCardForm.cardExpiryYear.$setDirty();
            creditCardForm.cvc.$setDirty();

            // Validate and make payment
            if (ji.validateForm(creditCardForm, {expectedCardType: $scope.model.paymentMethod})) {
                saveProposedTermPaymentAgreement();
            }

        }

        function ddrDetailsPanelPrevious() {
            slideInFromLeft('proposedAgreementPanel');
        }

        function ddrDetailsPanelNext(ddrForm) {

            // "Touch" all the fields so error messages show on failed validation
            ddrForm.accountName.$setDirty();
            ddrForm.bsbNumber.$setDirty();
            ddrForm.accountNumber.$setDirty();

            // Validate and make payment
            if (ji.validateForm(ddrForm)) {
                saveProposedTermPaymentAgreement();
            }

        }

        function saveProposedTermPaymentAgreement() {
            slideInFromRight('confirmationPanel');
            var requestObject;
            if ($scope.model.paymentMethod === 'DDR') {
                requestObject = {
                    debtorId: debtor.debtorId,
                    termPaymentAgreement: $scope.model.proposedTermPaymentAgreement,
                    bankAccountDetails: {
                        accountName: $scope.model.account.name,
                        bsb: $scope.model.account.bsb,
                        accountNumber: $scope.model.account.number
                    }
                };
            } else {
                requestObject = {
                    debtorId: debtor.debtorId,
                    termPaymentAgreement: $scope.model.proposedTermPaymentAgreement,
                    creditCardAccountDetails: {
                        creditCardType: translatePaymentMethod($scope.model.paymentMethod),
                        cardNumber: $scope.model.card.number,
                        creditCardExpiryMonth: getExpiryString($scope.model.card.expiryYear, $scope.model.card.expiryMonth),
                        cardCvc: $scope.model.card.cvc
                    }
                };
            }
            $scope.processing = true;
            $http.post('/sapi/remainingOnTermsDialog/saveNewTermPaymentAgreement', requestObject)
                .then(function (response) {
                          $scope.processing = false;
                          $scope.paymentAgreementSaved = true;
                      },
                      function (response) {
                          $scope.processing = false;
                          if (response.data && response.data.errorMessage) {
                              $scope.errorMessage = response.data.errorMessage;
                          } else {
                              cm.handleHttpAPIError(response);
                          }
                      });
        }

        function getExpiryString(year, month) {
            if (month < 10) {
                return year + "-0" + month;
            } else {
                return year + "-" + month;
            }
        }

        function extractFirstInstalmentDate(paymentAgreement) {
            if (paymentAgreement) {
                return paymentAgreement.paymentSchedules[0].scheduledPayments[0].scheduledDate;
            }
        }

        function extractFrequency(paymentAgreement) {
            if (paymentAgreement) {
                if (paymentAgreement.paymentIntervalUnit === "Month") {
                    if (paymentAgreement.paymentInterval === 1) {
                        return "Monthly";
                    } else {
                        return "Every " + paymentAgreement.paymentInterval + " months";
                    }
                } else if (paymentAgreement.paymentIntervalUnit === "Week") {
                    if (paymentAgreement.paymentInterval === 1) {
                        return "Weekly";
                    } else if (paymentAgreement.paymentInterval === 2) {
                        return "Fortnightly";
                    } else {
                        return "Every " + paymentAgreement.paymentInterval + " weeks";
                    }
                } else {
                    throw new Error('unrecognized paymentIntervalUnit "' + paymentAgreement.paymentIntervalUnit + '"');
                }
            }
        }

        function extractInstallmentAmountsText(paymentAgreement) {
            if (paymentAgreement) {

                var paymentSchedule = paymentAgreement.paymentSchedules[0];
                var scheduledPayments = paymentSchedule.scheduledPayments;
                var firstScheduledPayment = scheduledPayments[0];
                var lastScheduledPayment = scheduledPayments[scheduledPayments.length - 1];

                if (scheduledPayments.length === 1) {
                    return "A single payment of " + $filter('currency')(firstScheduledPayment.amount)
                           + (paymentSchedule.totalFeeAmount === 0 ? "" : " (which includes fees of " + $filter('currency')(paymentSchedule.totalFeeAmount) + ")");
                } else if (firstScheduledPayment.amount === lastScheduledPayment.amount) {
                    return scheduledPayments.length + " instalments of " + $filter('currency')(firstScheduledPayment.amount)
                           + (paymentSchedule.totalFeeAmount === 0 ? "" : " (which includes fees of " + $filter('currency')(paymentSchedule.totalFeeAmount) + ")");
                } else {
                    if (scheduledPayments.length === 2) {
                        return "An initial instalment of " + $filter('currency')(firstScheduledPayment.amount)
                               + (paymentSchedule.totalFeeAmount === 0 ? "" : " (which includes fees of " + $filter('currency')(paymentSchedule.totalFeeAmount) + ")")
                               + " and an additional installment of " + $filter('currency')(lastScheduledPayment.amount);
                    } else {
                        return "An initial instalment of " + $filter('currency')(firstScheduledPayment.amount)
                               + (paymentSchedule.totalFeeAmount === 0 ? "" : " (which includes fees of " + $filter('currency')(paymentSchedule.totalFeeAmount) + ")")
                               + " and " + (scheduledPayments.length - 1)
                               + " installments of " + $filter('currency')(lastScheduledPayment.amount);
                    }
                }

            }
        }

        function translatePaymentMethod(paymentMethod) {
            if (paymentMethod === "Visa") {
                return "Visa";
            } else if (paymentMethod === "MasterCard") {
                return "Mastercard";
            } else if (paymentMethod === "American Express") {
                return "Amex";
            } else if (paymentMethod === "Diners Club") {
                return "Diners";
            } else if (paymentMethod === "DDR") {
                return "DDR";
            } else {
                throw new Error("Unknown paymentMethod \"" + paymentMethod + "\"");
            }
        }

        function slideInFromLeft(panel) {
            $scope.panelContainer.children().removeClass("slide-left");
            $scope.panelContainer.children().addClass("slide-right");
            $scope.currentPanel = panel;
        }

        function slideInFromRight(panel) {
            $scope.panelContainer.children().removeClass("slide-right");
            $scope.panelContainer.children().addClass("slide-left");
            $scope.currentPanel = panel;
        }

    }

})();