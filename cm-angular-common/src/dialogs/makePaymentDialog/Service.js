(function () {

    angular.module('CmCommon')
        .factory('makePaymentDialog', function ($modal, $http, cm, ji) {
                     return new Service($modal, $http, cm, ji);
                 });

    function Service($modal, $http, cm, ji) {

        this.openForOutstandingInvoice = function(debtorId, invoiceId, somethingChangedHandler) {
            open('/sapi/makePaymentDialog/getOutstandingInvoiceForAllocation?debtorId=' + debtorId + "&invoiceId=" + invoiceId,
                 'Make Payment',
                 debtorId,
                 false,
                 somethingChangedHandler)
        };

        this.openForOutstandingInvoices = function(debtorId, somethingChangedHandler) {
            open('/sapi/makePaymentDialog/getOutstandingInvoicesForAllocation?debtorId=' + debtorId,
                 'Make Payment',
                 debtorId,
                 false,
                 somethingChangedHandler)
        };

        this.openForPaymentScheduleInvoices = function(debtorId, paymentScheduleId, somethingChangedHandler) {
            open('/sapi/makePaymentDialog/getPaymentScheduleInvoicesForAllocation?paymentScheduleId=' + paymentScheduleId,
                 'Make Payment against Schedule',
                 debtorId,
                 true,
                 somethingChangedHandler)
        };

        function open(invoicesForAllocationUrl, dialogTitle, debtorId, allowAllocationChangesToLastInvoiceOnly, somethingChangedHandler) {
            $http.get(invoicesForAllocationUrl)
                .then(function (response) {
                          var invoicesForAllocation = response.data;

                          if (invoicesForAllocation.invoices.length === 0) {
                              ji.showErrorDialog("There are no outstanding invoices");
                          } else {
                              $modal.open({
                                  templateUrl: '/common/dialogs/makePaymentDialog/dialog.html',
                                  controller: 'MakePaymentDialogController',
                                  windowClass: 'make-payment-dialog',
                                  resolve: {
                                      debtorId: function () {
                                          return debtorId;
                                      },
                                      invoicesForAllocation: function () {
                                          return invoicesForAllocation;
                                      },
                                      dialogTitle: function () {
                                          return dialogTitle;
                                      },
                                      allowAllocationChangesToLastInvoiceOnly: function () {
                                          return allowAllocationChangesToLastInvoiceOnly;
                                      }
                                  },
                                  backdrop: false
                              }).result.then(function (somethingChanged) {
                                                 if (somethingChanged && somethingChangedHandler) {
                                                     somethingChangedHandler();
                                                 }
                                             });
                          }

                      },
                      function (response) {
                          cm.handleHttpAPIError(response);
                      });
        }

    }

})();