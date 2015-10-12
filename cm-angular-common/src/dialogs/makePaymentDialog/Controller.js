(function () {

    angular.module('CmCommon')
        .controller('MakePaymentDialogController', Controller);

    function Controller($scope, $http, cm, ji, invoicesForAllocation, debtorId, dialogTitle, allowAllocationChangesToLastInvoiceOnly) {

        $scope.model = {
            invoicesForAllocation: augmentInvoicesForAllocation(invoicesForAllocation),
            paymentMethod: 'Visa',
            card: {
                number: null
            }
        };

        $scope.currentPanel = 'allocationPanel';

        $scope.ji = ji;
        $scope.dialogTitle = dialogTitle;
        $scope.disableAllButLastAllocatedInvoiceIfAppropriate = disableAllButLastAllocatedInvoiceIfAppropriate;
        $scope.onExpiryMonthChange = onExpiryMonthChange;
        $scope.onExpiryYearChange = onExpiryYearChange;
        $scope.allocationPanelNext = allocationPanelNext;
        $scope.paymentMethodPanelPrevious = paymentMethodPanelPrevious;
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
        $scope.makePayment = makePayment;

        disableAllButLastAllocatedInvoiceIfAppropriate();

        function disableAllButLastAllocatedInvoiceIfAppropriate() {
            if (allowAllocationChangesToLastInvoiceOnly) {
                var invoices = $scope.model.invoicesForAllocation.invoices;
                var disableAllRemainingRows = false;
                for (var i = invoices.length - 1; i >= 0; i--) {
                    if (disableAllRemainingRows) {
                        invoices[i].allocationChangedDisabled = true;
                        invoices[i].allocatedAmount = invoices[i].outstandingAmount - invoices[i].discountIfFullyPaid;
                        invoices[i].discount = invoices[i].discountIfFullyPaid;
                    } else {
                        invoices[i].allocationChangedDisabled = false;
                    }
                    if (invoices[i].include) {
                        disableAllRemainingRows = true;
                    }
                }
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

        function allocationPanelNext() {
            if (ji.checkFieldsValid($scope.allocationTable)) {
                slideInFromRight('paymentMethodPanel');
            }
        }

        function paymentMethodPanelPrevious() {
            slideInFromLeft('allocationPanel');
        }

        function paymentMethodPanelNext() {
            $http.post('/sapi/makePaymentDialog/getCustomerPayableTransactionFeesTotal',
                {
                    debtorId: debtorId,
                    paymentType: translatePaymentMethod($scope.model.paymentMethod),
                    paymentAmount: $scope.model.invoicesForAllocation.getTotalAllocated()
                })
                .then(function (response) {
                          $scope.model.transactionFeeToCustomerAmount = response.data;
                          slideInFromRight($scope.model.paymentMethod === 'DDR' ? 'ddrDetailsPanel' : 'ccDetailsPanel');
                      },
                      function (response) {
                          cm.handleHttpAPIError(response);
                      });
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
                makePayment();
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
                makePayment();
            }

        }

        function augmentInvoicesForAllocation(invoicesForAllocation) {

            invoicesForAllocation.possibleDiscounts = false;
            for (var i = 0; i < invoicesForAllocation.invoices.length; i++) {
                invoicesForAllocation.invoices[i].include = true;
                if (invoicesForAllocation.invoices[i].discount) invoicesForAllocation.possibleDiscounts = true;
            }

            invoicesForAllocation.getTotalAllocated = function () {
                var totalAllocated = 0;
                for (var i = 0; i < invoicesForAllocation.invoices.length; i++) {
                    if (isNaN(invoicesForAllocation.invoices[i].allocatedAmount)) {
                        return null;
                    } else {
                        totalAllocated += Number(invoicesForAllocation.invoices[i].allocatedAmount);
                    }
                }
                return totalAllocated;
            };

            invoicesForAllocation.extractAllocations = function () {
                var allocations = [];
                for (var i = 0; i < invoicesForAllocation.invoices.length; i++) {
                    var allocation = invoicesForAllocation.invoices[i];
                    allocations.push({
                        invoiceId: allocation.invoiceId,
                        invoiceNumber: allocation.invoiceNumber,
                        amount: allocation.allocatedAmount,
                        associatedDiscountAmount: allocation.discount
                    });
                }
                return allocations;
            };

            return invoicesForAllocation;
        }

        function validateOrAdjustAllocation(scope, element, attr, ctrl) {
            if (scope.invoice.allocatedAmount && scope.invoice.allocatedAmount > scope.invoice.outstandingAmount) {
                ctrl.$setValidity("allocatedMoreThanOutstanding", false);
                ctrl.errorMessage = "Allocated amount (" + scope.invoice.allocatedAmount + ") is greater than outstanding amount (" + scope.invoice.outstandingAmount + ")";
            } else {
                ctrl.$setValidity("allocatedMoreThanOutstanding", true);
                ctrl.errorMessage = null;

            }
            if (scope.invoice.allocatedAmount
                && scope.invoice.discountIfFullyPaid
                && scope.invoice.allocatedAmount === scope.invoice.outstandingAmount - scope.invoice.discountIfFullyPaid) {
                scope.invoice.discount = scope.invoice.discountIfFullyPaid;
            } else {
                scope.invoice.discount = 0;
            }
        }

        function makePayment() {
            slideInFromRight('resultsPanel');
            var requestUrl, requestObject;
            if ($scope.model.paymentMethod === 'DDR') {
                requestUrl = '/sapi/makePaymentDialog/makeDirectEntryPayment';
                requestObject = {
                    debtorId: debtorId,
                    accountName: $scope.model.account.name,
                    bsb: $scope.model.account.bsb,
                    accountNumber: $scope.model.account.number,
                    amount: $scope.model.invoicesForAllocation.getTotalAllocated(),
                    allocations: $scope.model.invoicesForAllocation.extractAllocations()
                };
            } else {
                requestUrl = '/sapi/makePaymentDialog/makeCreditCardPayment';
                requestObject = {
                    cardType: translatePaymentMethod($scope.model.paymentMethod),
                    debtorId: debtorId,
                    cardNumber: $scope.model.card.number,
                    cardExpiryMonth: $scope.model.card.expiryMonth,
                    cardExpiryYear: $scope.model.card.expiryYear,
                    cardCvc: $scope.model.card.cvc,
                    amount: $scope.model.invoicesForAllocation.getTotalAllocated(),
                    allocations: $scope.model.invoicesForAllocation.extractAllocations()
                };
            }
            $scope.processing = true;
            $http.post(requestUrl, requestObject)
                .then(function (response) {
                          $scope.processing = false;
                          $scope.payment = response.data;
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