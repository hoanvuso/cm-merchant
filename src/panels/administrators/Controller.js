(function () {

  angular.module('CmMerchantConfigApp')
    .controller('AdministratorPanelController', Controller);

  function Controller($scope,$rootScope, merchantConfigService) {
    $scope.submitted = false;


    $rootScope.next = function() {
      $scope.submitted = true;
      if ($scope.form.$valid) {
        $rootScope.currentPanel = 'banking';
      }
    };
    $rootScope.back = function() {
      $rootScope.currentPanel = 'contacts';
    };
  }

})();
