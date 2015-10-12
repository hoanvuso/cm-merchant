(function () {

    angular.module('CmCommon')
        .factory('remainingOnTermsDialog', function ($modal, $http, cm, ji) {
                     return new Service($modal, $http, cm, ji);
                 });

    function Service($modal, $http, cm, ji) {

        this.open = function (debtorId, totalOutstandingAmount, somethingChangedHandler) {
            if (isNaN(totalOutstandingAmount)) {
                throw new Error("remainingOnTermsDialog.open(): totalOutstandingAmount is not a number");
            }
            if (totalOutstandingAmount <= 0) {
                throw new Error("There is no outstanding amount");
            }
            $http.get('/sapi/remainingOnTermsDialog/getDialogInitDetails?debtorId=' + debtorId)
                .then(function (response) {
                          var debtor = response.data.debtor;

                          if (debtor.invoicesForAllocation.invoices.length === 0) {
                              ji.showErrorDialog("There are no outstanding invoices");
                          } else {
                              $modal.open({
                                  templateUrl: '/common/dialogs/remainingOnTermsDialog/dialog.html',
                                  controller: 'RemainingOnTermsDialogController',
                                  windowClass: 'remaining-on-terms-dialog',
                                  resolve: {
                                      debtor: function () {
                                          return debtor;
                                      },
                                      totalOutstandingAmount: function () {
                                          return totalOutstandingAmount;
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