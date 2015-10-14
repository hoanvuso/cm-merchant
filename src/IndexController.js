(function () {

  angular.module('CmMerchantConfigApp')
    .controller('IndexController', Controller);

  function Controller($scope, $http, $window, ji, cm, referralPartnerConfig, FileUploader, changePasswordDialog, merchantConfigService) {

    $scope.merchantConfigService = merchantConfigService;
    $scope.referralPartnerConfig = referralPartnerConfig;
    $scope.changePasswordDialog = changePasswordDialog;
    $scope.importConfig = importConfig;
    $scope.exportConfig = exportConfig;
    $scope.validateAndExportConfig = validateAndExportConfig;
    $scope.logout = logout;

    $scope.uploader = new FileUploader();
    $scope.uploader.url = '/iapi/loadConfig';
    $scope.uploader.onSuccessItem = onUploadSuccess;
    $scope.uploader.onErrorItem = onUploadError;
    $scope.uploader.autoUpload = true;

    $scope.currentPanel = 'general';

    $scope.$watch(function () {
      return $scope.currentPanel
    }, function (value) {
      if (value !== 'general' && merchantConfigService.merchantConfig.general.merchantTradingName) {
        $scope.tradingName = merchantConfigService.merchantConfig.general.merchantTradingName;
      }
    });

    refresh();

    function selectFile() {
      $scope.fileSelectInput[0].dispatchEvent(new MouseEvent('click', {
        'view': window,
        'bubbles': true,
        'cancelable': true
      }));
    }

    function importConfig() {
      selectFile();
    }

    function exportConfig() {
      $http.post('/iapi/stashConfigWithoutValidation', merchantConfigService.merchantConfig)
        .then(function (response) {
          $window.location.assign("/iapi/saveConfig");
        },
        function (response) {
          cm.handleHttpAPIError(response);
        });
    }

    function validateAndExportConfig() {
      $http.post('/iapi/validateAndStashConfig', merchantConfigService.merchantConfig)
        .then(function (response) {
          $window.location.assign("/iapi/saveConfig");
        },
        function (response) {
          cm.handleHttpAPIError(response);
        });
    }

    function onUploadSuccess(item, response, status, headers) {
      merchantConfigService.merchantConfig = response;
      if (merchantConfigService.merchantConfig.general.entityType == 'SoleTrader'
        || merchantConfigService.merchantConfig.general.entityType == 'PtyLtd'
        || merchantConfigService.merchantConfig.general.entityType == 'Partnership') {
        merchantConfigService.generalEntityType = merchantConfigService.merchantConfig.general.entityType;
      } else {
        merchantConfigService.generalEntityType = 'Other';
      }
      if (merchantConfigService.merchantConfig.general.accountingPackage == 'Xero'
        || merchantConfigService.merchantConfig.general.accountingPackage == 'MYOBAccountRight') {
        merchantConfigService.generalAccountingPackage = merchantConfigService.merchantConfig.general.accountingPackage;
      } else {
        merchantConfigService.generalAccountingPackage = 'Other';
      }
      if (merchantConfigService.merchantConfig.paymentTerms.availablePaymentTerms && merchantConfigService.merchantConfig.paymentTerms.availablePaymentTerms.length) {
        merchantConfigService.universallyAvailablePaymentTermsSelected = true;
        merchantConfigService.universallyAvailablePaymentTerms = {
          termDuration: merchantConfigService.merchantConfig.paymentTerms.availablePaymentTerms[0].termDuration,
          paymentInterval: merchantConfigService.merchantConfig.paymentTerms.availablePaymentTerms[0].paymentInterval
        };
      } else {
        merchantConfigService.universallyAvailablePaymentTermsSelected = false;
        merchantConfigService.universallyAvailablePaymentTerms = {
          termDuration: null,
          paymentInterval: null
        };
      }
      if (merchantConfigService.merchantConfig.fees.directDebitChargeToDebtor
        || merchantConfigService.merchantConfig.fees.visaRateToDebtor
        || merchantConfigService.merchantConfig.fees.mastercardRateToDebtor
        || merchantConfigService.merchantConfig.fees.amexRateToDebtor
        || merchantConfigService.merchantConfig.fees.dinersRateToDebtor) {
        merchantConfigService.debtorSurchargesSelected = true;
      } else {
        merchantConfigService.debtorSurchargesSelected = false;
      }
      if (merchantConfigService.merchantConfig.debtorCommunications.seriousArrearsNotifications
        && (merchantConfigService.merchantConfig.debtorCommunications.seriousArrearsNotifications.minimumArrearsAmount
        || merchantConfigService.merchantConfig.debtorCommunications.seriousArrearsNotifications.minimumDaysOverdue
        || merchantConfigService.merchantConfig.debtorCommunications.seriousArrearsNotifications.delayBetweenReminders
        || merchantConfigService.merchantConfig.debtorCommunications.seriousArrearsNotifications.maximumNumberOfReminders
        || merchantConfigService.merchantConfig.debtorCommunications.seriousArrearsNotifications.sendSms)) {
        merchantConfigService.seriousArrearsNotificationsEnabled = true;
      } else {
        merchantConfigService.seriousArrearsNotificationsEnabled = false;
      }
      merchantConfigService.mailingAddressSameAsBusinessAddress = merchantConfigService.merchantConfig.addresses.mailing && merchantConfigService.merchantConfig.addresses.business
        && merchantConfigService.merchantConfig.addresses.mailing.poBox === merchantConfigService.merchantConfig.addresses.business.poBox
        && merchantConfigService.merchantConfig.addresses.mailing.unitOrLevel === merchantConfigService.merchantConfig.addresses.business.unitOrLevel
        && merchantConfigService.merchantConfig.addresses.mailing.propertyName === merchantConfigService.merchantConfig.addresses.business.propertyName
        && merchantConfigService.merchantConfig.addresses.mailing.addressLine1 === merchantConfigService.merchantConfig.addresses.business.addressLine1
        && merchantConfigService.merchantConfig.addresses.mailing.addressLine2 === merchantConfigService.merchantConfig.addresses.business.addressLine2
        && merchantConfigService.merchantConfig.addresses.mailing.suburb === merchantConfigService.merchantConfig.addresses.business.suburb
        && merchantConfigService.merchantConfig.addresses.mailing.state === merchantConfigService.merchantConfig.addresses.business.state
        && merchantConfigService.merchantConfig.addresses.mailing.postCode === merchantConfigService.merchantConfig.addresses.business.postCode
        && merchantConfigService.merchantConfig.addresses.mailing.country === merchantConfigService.merchantConfig.addresses.business.country;

    }

    function onUploadError(item, response, status, headers) {
      cm.handleHttpAPIError(response);
    }

    function refresh() {
      //// This is really just to trigger authentication (otherwise upload will fail silently)
      //$http.get('/sapi/merchantconfigPage/getPageInitializationDetails')
      //    .then(function (response) {
      //          },
      //          function (response) {
      //              $scope.queryStatus = 'failed';
      //              cm.handleHttpAPIError(response);
      //          });
    }

    function logout() {
      $http.get('/logout2')
        .then(function () {
          $window.location.assign("login?then=merchantconfig");
        },
        function (response) {
          if (response && response.status === 401) {
            ji.showErrorDialog("You are already signed out");
          } else {
            ji.showErrorDialog(response);
          }
        });
    }

    function save() {
      if ($scope.form.validate(true)) {
      }
    }

  }

})();