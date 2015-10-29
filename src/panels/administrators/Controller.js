(function () {

  angular.module('CmMerchantConfigApp')
    .controller('AdministratorPanelController', Controller);

  function Controller($scope,$rootScope, merchantConfigService,Modal) {
    $scope.submitted = $rootScope.administratorsClean;

    $scope.$watch(function() {
      return $scope.form.$valid
    },function(value) {
      $rootScope.formValid = value;
    });

    $scope.$watch(function() {
      return $scope.form.$dirty
    },function(value) {
      if (!$rootScope.formDirty) {
        $rootScope.formDirty = value;
      }
    });

    $rootScope.next = function() {
      $scope.submitted = true;
      $rootScope.administratorsInvalid = !$scope.form.$valid;
      $rootScope.administratorsClean = !$scope.form.$dirty;
      $rootScope.currentPanel = 'banking';
    };
    $rootScope.back = function() {
      $rootScope.currentPanel = 'contacts';
    };
  }

})();
