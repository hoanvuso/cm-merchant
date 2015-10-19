(function () {

  angular.module('CmMerchantConfigApp')
    .controller('DebtorCommunicationsController', Controller);

  function Controller($scope,$rootScope, merchantConfigService,$modal, Modal) {
    $scope.communication = merchantConfigService.communication = merchantConfigService.communication || {};
    $scope.step = merchantConfigService.communication.step = merchantConfigService.communication.step ||  1;
    if (merchantConfigService.communication.newInvoice) {
      if ($scope.step >= 4) {
        $scope.step3Day = parseInt($scope.communication.pastDueReminder.reminderFrequency) +
          parseInt($scope.communication.invoicePastDue.invoicePastDueDate);
      }
      if ($scope.step >= 5) {
        $scope.step4Day = parseInt($scope.communication.seriousArrears.daysAfterInvoicePastDueDate - 0) +
          parseInt($scope.communication.invoicePastDue.invoicePastDueDate);
      }
      if ($scope.step >= 6) {
        $scope.step5Day = $scope.step4Day + parseInt($scope.communication.seriousArrearsReminder.reminderFrequency);
        $scope.step6Amount = $scope.communication.seriousArrears.minArrearsAmount;
      }
      if ($scope.step >= 7) {
        $scope.step6Day = $scope.step5Day +
          ($scope.communication.seriousArrearsReminder.reminderFrequency * $scope.communication.seriousArrearsReminder.maxNoReminders)
        $scope.step7Amount = $scope.communication.seriousArrears.minArrearsAmount;
      }
    }


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

            $scope.back = function() {
              $modalInstance.dismiss('cancel');
            };

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
        if ($scope.step === 1) {
          $scope.step = merchantConfigService.communication.step = 2;
        }
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
            $scope.invoicePastDue = angular.copy(invoicePastDue);

            $scope.back = function() {
              $modalInstance.dismiss('cancel');
            };

            $scope.next = function(form) {
              $scope.submitted = true;
              console.log(form.$valid);
              if (form.$valid) {
                $modalInstance.close($scope.invoicePastDue);
              }
            }
          }
        ]
      });

      invoicePastDueModal.result.then(function(result) {

        $scope.communication.invoicePastDue = result;
        $scope.communication.invoicePastDue.invoicePastDueDate = 1;
        if ($scope.step === 2) {
          $scope.step = merchantConfigService.communication.step = 3;
        }
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

            $scope.back = function() {
              $modalInstance.dismiss('cancel');
            };

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
        if ($scope.step === 3) {
          $scope.step = merchantConfigService.communication.step = 4;
          var seriousArrearsConfirmModal = $modal.open({
            templateUrl: 'merchantconfig/panels/debtorcommunications/modals/serious-arrears-confirm.modal.html',
            size: 'md',
            backdrop: 'static',
            controller: [
              '$scope','$modalInstance',
              function($scope,$modalInstance) {
                $scope.confirm = true;
                $scope.next = function() {
                  $modalInstance.close($scope.confirm);
                }
              }
            ]
          });

          seriousArrearsConfirmModal.result.then(function(result) {
            console.log(result);
            if (result) {
              console.log("true");
              $scope.step = 4;
            } else {
              console.log("false");
              $scope.step = 7;
              $scope.communication.seriousArrears = {};
              $scope.communication.seriousArrearsReminder = {};
              $scope.communication.seriousArrears.daysAfterInvoicePastDueDate = 60;
              $scope.communication.seriousArrears.minArrearsAmount = 500;
              $scope.communication.seriousArrearsReminder.reminderFrequency = 5;
              $scope.communication.seriousArrearsReminder.maxNoReminders = 3;

              $scope.step4Day = parseInt($scope.communication.seriousArrears.daysAfterInvoicePastDueDate) +
                parseInt($scope.communication.invoicePastDue.invoicePastDueDate);
              $scope.step5Day = $scope.step4Day + parseInt($scope.communication.seriousArrearsReminder.reminderFrequency);
              $scope.step6Amount = $scope.communication.seriousArrears.minArrearsAmount;
              $scope.step6Day = $scope.step5Day +
                ($scope.communication.seriousArrearsReminder.reminderFrequency * $scope.communication.seriousArrearsReminder.maxNoReminders)
              $scope.step7Amount = $scope.communication.seriousArrears.minArrearsAmount;
            }
          })
        }
      });
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

            $scope.back = function() {
              $modalInstance.dismiss('cancel');
            };

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
        if ($scope.step === 4) {
          $scope.step = merchantConfigService.communication.step = 5;
        }
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

            $scope.back = function() {
              $modalInstance.dismiss('cancel');
            };

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
        if ($scope.step === 5) {
          $scope.step = merchantConfigService.communication.step = 6;
        }
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

            $scope.back = function() {
              $modalInstance.dismiss('cancel');
            };

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
        if ($scope.step === 6) {
          $scope.step = merchantConfigService.communication.step = 7;
        }
        $scope.step6Day = $scope.step5Day +
          ($scope.communication.seriousArrearsReminder.reminderFrequency * $scope.communication.seriousArrearsReminder.maxNoReminders)
        $scope.step7Amount = $scope.communication.seriousArrears.minArrearsAmount;
      })
    };

    $rootScope.next = function() {
      $rootScope.currentPanel = 'confirmation';
    };
    $rootScope.back = function() {
      $rootScope.currentPanel = 'businessrules';
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
