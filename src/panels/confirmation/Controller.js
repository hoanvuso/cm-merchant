(function () {

  angular.module('CmMerchantConfigApp')
    .controller('ConfirmationPanelController', Controller);

  function Controller($scope,$rootScope, merchantConfigService,$modal) {
    $scope.review = function(type) {
      if (type === 1) {
        $modal.open({
          templateUrl: 'merchantconfig/panels/confirmation/merchant-detail-review.html',
          size: 'lg',
          controller: function($scope,merchantConfigService) {
            $scope.selecteddIndustry = {};
            $scope.selectedBusinessState = {};
            $scope.selectedMailingState = {};
            $scope.industryTypes = [
              {id: 0,name: 'Type 1'},
              {id: 1,name: 'Type 2'},
              {id: 2,name: 'Type 3'}
            ];

            $scope.states = [
              { id: 0, name: 'state 1' },
              { id: 1, name: 'state 2' },
              { id: 2, name: 'state 3' }
            ];

            var m = moment();
            $scope.merchantOfferDate = m.format("D MMMM YYYY");
            $scope.oneBoxDate =  m.add(5,'days').format("D MMMM YYYY");
            $scope.merchantConfigService = merchantConfigService;
            $scope.communication =  merchantConfigService.communication;
            $scope.step = merchantConfigService.communication.step || 1;
            if ($scope.step >= 5) {
              $scope.step4Day = parseInt($scope.communication.seriousArrears.daysAfterInvoicePastDueDate - 0) +
                parseInt($scope.communication.invoicePastDue.invoicePastDueDate);
            }
            if ($scope.step >= 7) {
              $scope.step4Day = parseInt($scope.communication.seriousArrears.daysAfterInvoicePastDueDate - 0) +
                parseInt($scope.communication.invoicePastDue.invoicePastDueDate);
              $scope.step5Day = $scope.step4Day + parseInt($scope.communication.seriousArrearsReminder.reminderFrequency);
              $scope.step6Day = $scope.step5Day +
                ($scope.communication.seriousArrearsReminder.reminderFrequency * $scope.communication.seriousArrearsReminder.maxNoReminders)
              $scope.step7Amount = $scope.communication.seriousArrears.minArrearsAmount;
            }

            if (merchantConfigService.merchantConfig.general.accountingPackage) {
              $scope.packageName = merchantConfigService.merchantConfig.general.accountingPackage
            } else {
              $scope.packageName = merchantConfigService.merchantConfig.general.AccountingPackageDetail.name + ', ' + merchantConfigService.merchantConfig.general.AccountingPackageDetail.version
            }
            if (merchantConfigService.merchantConfig.general.industryType != null) {
              $scope.selecteddIndustry = _.find($scope.industryTypes,{id: merchantConfigService.merchantConfig.general.industryType});
            }
            if (merchantConfigService.merchantConfig.addresses.business.state != null) {
              $scope.selectedBusinessState = _.find($scope.states,{id: merchantConfigService.merchantConfig.addresses.business.state});
              console.log($scope.selectedBusinessState);
            }
            if (merchantConfigService.merchantConfig.addresses.mailing.state != null) {
              $scope.selectedMailingState = _.find($scope.states,{id: merchantConfigService.merchantConfig.addresses.mailing.state});
            }

          }
        })
      }
    }

    $rootScope.next = function() {
      $rootScope.currentPanel = 'referral';
    };

    $rootScope.back = function() {
      $rootScope.currentPanel = 'debtorcommunications';
    };
  }

})();
