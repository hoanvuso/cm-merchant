(function () {

  angular.module('CmMerchantConfigApp')
    .controller('ReferralPanelController', Controller);

  function Controller($scope,$rootScope, merchantConfigService) {
    $rootScope.back = function() {
      $rootScope.currentPanel = 'confirmation';
    };
  }

})();
