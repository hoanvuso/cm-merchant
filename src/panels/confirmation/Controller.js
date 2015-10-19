(function () {

  angular.module('CmMerchantConfigApp')
    .controller('ConfirmationPanelController', Controller);

  function Controller($scope,$rootScope, merchantConfigService) {
    $rootScope.next = function() {
      $rootScope.currentPanel = 'referral';
    };

    $rootScope.back = function() {
      $rootScope.currentPanel = 'debtorcommunications';
    };
  }

})();
