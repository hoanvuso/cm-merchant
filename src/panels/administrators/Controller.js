(function () {

  angular.module('CmMerchantConfigApp')
    .controller('AdministratorPanelController', Controller);

  function Controller($scope,$rootScope, merchantConfigService,Modal) {
    $scope.submitted = $rootScope.administratorsInvalid;

    $scope.$watch(function() {
      return $scope.form.$valid
    },function(value) {
      $rootScope.formValid = value;
    });

    $rootScope.next = function() {
      $scope.submitted = true;
      $rootScope.administratorsInvalid = !$scope.form.$valid;
      $rootScope.currentPanel = 'banking';
    };
    $rootScope.back = function() {
      $rootScope.currentPanel = 'contacts';
    };
  }

})();
