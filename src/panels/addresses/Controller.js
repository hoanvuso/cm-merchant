(function () {

  angular.module('CmMerchantConfigApp')
    .controller('AddressesPanelController', Controller);

  function Controller($scope,$rootScope, merchantConfigService,Modal) {
    $scope.submitted = $rootScope.addressesInvalid;
    $scope.activeTab = 'business';
    $scope.changeTab = function(tab) {
      $scope.activeTab = tab
    };

    $scope.states = [
      { id: 0, name: 'state 1' },
      { id: 1, name: 'state 2' },
      { id: 2, name: 'state 3' }
    ];

    $scope.$watch(function() {
      return $scope.form1.$valid;
    },function(value) {
      if ($scope.form.$valid && !value && !merchantConfigService.mailingAddressSameAsBusinessAddress) {
        $scope.activeTab = 'mailing'
      }
    });

    $scope.$watch(function() {
      return !($scope.form.$invalid || ($scope.form1.$invalid && !merchantConfigService.mailingAddressSameAsBusinessAddress))
    },function(value) {
      $rootScope.formValid = value;
    });

    $scope.$on('submitted',function(event,value) {
      $scope.submitted = value;
    });

    $rootScope.next = function() {
      $scope.submitted = true;
      $rootScope.addressesInvalid = $scope.form.$invalid || ($scope.form1.$invalid && !merchantConfigService.mailingAddressSameAsBusinessAddress);
      $rootScope.currentPanel = 'contacts';
    };


    $rootScope.back = function() {
      $rootScope.currentPanel = 'general';
    };

    merchantConfigService.addressesController = this;
    this.validate = validate;
    $scope.validate = validate;
    $scope.onSameAsBusinessAddressChange = onSameAsBusinessAddressChange;

    function onSameAsBusinessAddressChange() {
      if (merchantConfigService.mailingAddressSameAsBusinessAddress) {
        merchantConfigService.merchantConfig.addresses.mailing = merchantConfigService.merchantConfig.addresses.business;
      } else {
        merchantConfigService.merchantConfig.addresses.mailing = null;
      }
    }

    function validate() {
      return $scope.form.validate(true);
    }

  }

})();
