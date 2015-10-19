(function () {

  angular.module('CmMerchantConfigApp')
    .controller('ReferralPanelController', Controller);

  function Controller($scope,$rootScope, merchantConfigService) {
    $rootScope.next = function() {
      $rootScope.currentPanel = 'debtorcommunications';
    };
    $rootScope.back = function() {
      $rootScope.currentPanel = 'referral';
    };
  }

})();
