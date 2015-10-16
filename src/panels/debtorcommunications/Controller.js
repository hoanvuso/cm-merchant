(function () {

  angular.module('CmMerchantConfigApp')
  .controller('DebtorCommunicationsController', function($scope, $cookies, merchantConfigService) {
    $scope.merchantConfigService = merchantConfigService;
    merchantConfigService.debtorCommunicationsController = this;

    //communication active tab
    $scope.communicationActiveTab = $cookies.communicationActiveTab || 'new';
    /**
     * active tab nav
     * @param {String} tab
     * @returns {void}
     */
    $scope.setActiveTab = function (tab) {
      $cookies.communicationActiveTab = tab;
      $scope.communicationActiveTab = tab;
    };
  });
})();
