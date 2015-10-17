(function () {

  angular.module('CmMerchantConfigApp')
    .controller('AdministratorPanelController', Controller);

  function Controller($scope,$rootScope, merchantConfigService,Modal) {
    $scope.submitted = false;

    $scope.$watch(function() {
      return $scope.form.$valid
    },function(value) {
      $rootScope.formValid = value;
    });

    $scope.$on('submitted',function(event,value) {
      $scope.submitted = value;
    });

    $rootScope.next = function() {
      $scope.submitted = true;
      if ($scope.form.$valid) {
        $rootScope.currentPanel = 'banking';
      } else {
        Modal.confirm.changeTab(function(confirm) {
          if (confirm) {
            $rootScope.currentPanel = 'banking';
          }
        });
      }
    };
    $rootScope.back = function() {
      $rootScope.currentPanel = 'contacts';
    };
  }

})();
