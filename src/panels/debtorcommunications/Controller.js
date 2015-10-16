(function () {

  angular.module('CmMerchantConfigApp')
    .controller('DebtorCommunicationsController', Controller);

  function Controller($scope, merchantConfigService,$modal) {
    $scope.communication = {};
    $scope.step = 1;



    $scope.newInvoice = function(newInvoice) {
      var newInvoiceModal = $modal.open({
        templateUrl: 'merchantconfig/panels/debtorcommunications/modals/new-invoice.modal.html',
        size: 'lg',
        backdrop: 'static',
        controller: [
          '$scope','$modalInstance',
          function($scope,$modalInstance) {
            $scope.submitted = false;
            $scope.newInvoice = angular.copy(newInvoice);
            $scope.next = function(form) {
              $scope.submitted = true;
              if (form.$valid) {
                $modalInstance.close($scope.newInvoice);
              }
            }
          }
        ]
      });

      newInvoiceModal.result.then(function(result) {
        $scope.communication.newInvoice = result;
        $scope.step = 2;
      })

    };


    $scope.invoicePastDue = function(invoicePastDue) {
      var invoicePastDueModal = $modal.open({
        templateUrl: 'merchantconfig/panels/debtorcommunications/modals/invoice-past-due.modal.html',
        size: 'lg',
        backdrop: 'static',
        controller: [
          '$scope','$modalInstance',
          function($scope,$modalInstance) {
            $scope.submitted = false;
            $scope.invoicePastDue = angular.copy(invoicePastDue)
            $scope.next = function(form) {
              $scope.submitted = true;
              if (form.$valid) {
                $modalInstance.close($scope.invoicePastDue);
              }
            }
          }
        ]
      });

      invoicePastDueModal.result.then(function(result) {
        console.log(result);
        $scope.communication.invoicePastDue = result;
        $scope.communication.invoicePastDue.invoicePastDueDate = 1;
        $scope.step = 3;
      })
    };

    $scope.pastDueReminder = function(pastDueReminder) {
      var pastDueReminderModal = $modal.open({
        templateUrl: 'merchantconfig/panels/debtorcommunications/modals/past-due-reminder.modal.html',
        size: 'lg',
        backdrop: 'static',
        controller: [
          '$scope','$modalInstance',
          function($scope,$modalInstance) {
            $scope.submitted = false;
            $scope.pastDueReminder = angular.copy(pastDueReminder);
            $scope.next = function(form) {
              $scope.submitted = true;
              if (form.$valid) {
                $modalInstance.close($scope.pastDueReminder);
              }
            }
          }
        ]
      });

      pastDueReminderModal.result.then(function(result) {
        $scope.communication.pastDueReminder = result;
        $scope.step3Day = parseInt($scope.communication.pastDueReminder.reminderFrequency) +
          parseInt($scope.communication.invoicePastDue.invoicePastDueDate);
        console.log('step3',$scope.step3Day);
        $scope.step = 4;
      })
    };

    $scope.seriousArrears = function(seriousArrears) {
      var seriousArrearsModal = $modal.open({
        templateUrl: 'merchantconfig/panels/debtorcommunications/modals/serious-arrears.modal.html',
        size: 'lg',
        backdrop: 'static',
        controller: [
          '$scope','$modalInstance',
          function($scope,$modalInstance) {
            $scope.submitted = false;
            $scope.seriousArrears = angular.copy(seriousArrears);
            $scope.next = function(form) {
              $scope.submitted = true;
              if (form.$valid) {
                $modalInstance.close($scope.seriousArrears);
              }
            }
          }
        ]
      });

      seriousArrearsModal.result.then(function(result) {
        $scope.communication.seriousArrears = result;
        $scope.step4Day = parseInt($scope.communication.seriousArrears.daysAfterInvoicePastDueDate-0) +
          parseInt($scope.communication.invoicePastDue.invoicePastDueDate);
        $scope.step = 5;
      })
    };

    $scope.seriousArrearsReminder = function(seriousArrearsReminder) {
      var seriousArrearsReminderModal = $modal.open({
        templateUrl: 'merchantconfig/panels/debtorcommunications/modals/serious-arrears-reminder.modal.html',
        size: 'lg',
        backdrop: 'static',
        controller: [
          '$scope','$modalInstance',
          function($scope,$modalInstance) {
            $scope.submitted = false;
            $scope.seriousArrearsReminder = angular.copy(seriousArrearsReminder);
            $scope.next = function(form) {
              $scope.submitted = true;
              if (form.$valid) {
                $modalInstance.close($scope.seriousArrearsReminder);
              }
            }
          }
        ]
      });

      seriousArrearsReminderModal.result.then(function(result) {
        $scope.communication.seriousArrearsReminder = result;
        $scope.step5Day = $scope.step4Day + parseInt($scope.communication.seriousArrearsReminder.reminderFrequency);
        $scope.step6Amount = $scope.communication.seriousArrears.minArrearsAmount;
        $scope.step = 6;
      })
    };

    $scope.noticeDefault = function() {
      var noticeDefaultModal = $modal.open({
        templateUrl: 'merchantconfig/panels/debtorcommunications/modals/notice-of-default.modal.html',
        size: 'lg',
        backdrop: 'static',
        controller: [
          '$scope','$modalInstance',
          function($scope,$modalInstance) {
            $scope.submitted = false;
            $scope.next = function(form) {
              $scope.submitted = true;
              if (form.$valid) {
                $modalInstance.close();
              }
            }
          }
        ]
      });

      noticeDefaultModal.result.then(function() {
        $scope.step = 7;
        $scope.step6Day = $scope.step5Day +
          ($scope.communication.seriousArrearsReminder.reminderFrequency * $scope.communication.seriousArrearsReminder.maxNoReminders)
        $scope.step7Amount = $scope.communication.seriousArrears.minArrearsAmount;
      })
    };

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
