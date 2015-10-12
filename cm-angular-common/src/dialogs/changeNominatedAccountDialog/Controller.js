(function () {

    angular.module('CmCommon')
        .controller('ChangeNominatedAccountDialogController', Controller);

    function Controller($scope, $http, cm, ji, paymentScheduleId) {

        $scope.model = {
            paymentMethod: 'Visa',
            card: {
                number: null
            }
        };

        $scope.currentPanel = 'paymentMethodPanel';

        $scope.ji = ji;
        $scope.onExpiryMonthChange = onExpiryMonthChange;
        $scope.onExpiryYearChange = onExpiryYearChange;
        $scope.paymentMethodPanelNext = paymentMethodPanelNext;
        $scope.ccDetailsPanelPrevious = ccDetailsPanelPrevious;
        $scope.ccDetailsPanelNext = ccDetailsPanelNext;
        $scope.ddrDetailsPanelPrevious = ddrDetailsPanelPrevious;
        $scope.ddrDetailsPanelNext = ddrDetailsPanelNext;
        $scope.suppressErrorFormatting = suppressErrorFormatting;
        $scope.expiryMonthHasError = expiryMonthHasError;
        $scope.expiryYearHasError = expiryYearHasError;
        $scope.showCardNumberRequiredError = showCardNumberRequiredError;
        $scope.showWrongCardTypeError = showWrongCardTypeError;
        $scope.showExpiryMonthRequiredError = showExpiryMonthRequiredError;
        $scope.showExpiryYearRequiredError = showExpiryYearRequiredError;
        $scope.showExpiryPastError = showExpiryPastError;

        function paymentMethodPanelNext() {
            slideInFromRight($scope.model.paymentMethod === 'DDR' ? 'ddrDetailsPanel' : 'ccDetailsPanel');
        }

        function ccDetailsPanelPrevious() {
            slideInFromLeft('paymentMethodPanel');
        }

        function ccDetailsPanelNext(creditCardForm) {

            // "Touch" all the fields so error messages show on failed validation
            creditCardForm.cardNumber.$setDirty();
            creditCardForm.cardExpiryMonth.$setDirty();
            creditCardForm.cardExpiryYear.$setDirty();
            creditCardForm.cvc.$setDirty();

            // Validate and make payment
            if (ji.validateForm(creditCardForm, {expectedCardType: $scope.model.paymentMethod})) {
                changeNominatedAccount();
            }

        }

        function ddrDetailsPanelPrevious() {
            slideInFromLeft('paymentMethodPanel');
        }

        function ddrDetailsPanelNext(ddrForm) {

            // "Touch" all the fields so error messages show on failed validation
            ddrForm.accountName.$setDirty();
            ddrForm.bsbNumber.$setDirty();
            ddrForm.accountNumber.$setDirty();

            // Validate and make payment
            if (ji.validateForm(ddrForm)) {
                changeNominatedAccount();
            }

        }

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

        function suppressErrorFormatting(creditCardForm) {
            return creditCardForm.cardNumber.$jiHasFocus
                   && creditCardForm.cardNumber.$untouched
                   && !(showCardNumberRequiredError(creditCardForm)
                        || showWrongCardTypeError(creditCardForm));
        }

        function showCardNumberRequiredError(creditCardForm) {
            return creditCardForm.cardNumber.$jiHasFocus
                   && creditCardForm.cardNumber.$error.required
                   && !creditCardForm.cardNumber.$pristine;
        }

        function showWrongCardTypeError(creditCardForm) {
            return creditCardForm.cardNumber.$viewValue
                   && creditCardForm.cardNumber.$invalid
                   && creditCardForm.cardNumber.$ccEagerType
                   && creditCardForm.cardNumber.$ccEagerType != $scope.model.paymentMethod;
        }

        function showExpiryPastError(creditCardForm) {
            return creditCardForm.cardExpiryMonth.$viewValue
                   && creditCardForm.cardExpiryYear.$viewValue
                   && creditCardForm.$error.ccExp;
        }

        function expiryMonthHasError(creditCardForm) {
            return (creditCardForm.cardExpiryMonth.$invalid || (creditCardForm.$error.ccExp && !creditCardForm.cardExpiryYear.$pristine))
                   && !creditCardForm.cardExpiryMonth.$pristine;
        }

        function expiryYearHasError(creditCardForm) {
            return (creditCardForm.cardExpiryYear.$invalid || (creditCardForm.$error.ccExp && !creditCardForm.cardExpiryMonth.$pristine))
                   && !creditCardForm.cardExpiryYear.$pristine;
        }

        function showExpiryMonthRequiredError(creditCardForm) {
            return creditCardForm.cardExpiryMonth.$jiHasFocus
                   && (creditCardForm.cardExpiryMonth.$error.required || !creditCardForm.cardExpiryMonth.$viewValue)  // There seems to be a "bug" in cc-exp-month that gives a parse error instead of a required error
                   && !creditCardForm.cardExpiryMonth.$pristine;
        }

        function showExpiryYearRequiredError(creditCardForm) {
            return creditCardForm.cardExpiryYear.$jiHasFocus
                   && creditCardForm.cardExpiryYear.$error.required
                   && !creditCardForm.cardExpiryYear.$pristine;
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

        function changeNominatedAccount() {
            slideInFromRight('resultsPanel');
            var requestUrl, requestObject;
            if ($scope.model.paymentMethod === 'DDR') {
                requestUrl = '/sapi/changeNominatedAccountDialog/changeNominatedAccountToDirectEntry';
                requestObject = {
                    paymentScheduleId: paymentScheduleId,
                    accountName: $scope.model.account.name,
                    bsb: $scope.model.account.bsb,
                    accountNumber: $scope.model.account.number
                };
            } else {
                requestUrl = '/sapi/changeNominatedAccountDialog/changeNominatedAccountToCreditCard';
                requestObject = {
                    paymentScheduleId: paymentScheduleId,
                    cardType: translatePaymentMethod($scope.model.paymentMethod),
                    cardNumber: $scope.model.card.number,
                    cardExpiryMonth: $scope.model.card.expiryMonth,
                    cardExpiryYear: $scope.model.card.expiryYear,
                    cardCvc: $scope.model.card.cvc
                };
            }
            $scope.processing = true;
            $http.post(requestUrl, requestObject)
                .then(function (response) {
                          $scope.processing = false;
                          $scope.success = true;
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