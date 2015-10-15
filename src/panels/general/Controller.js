(function () {

  angular.module('CmMerchantConfigApp')
    .controller('GeneralPanelController', Controller);

  function Controller($scope,$rootScope, merchantConfigService,FileUploader) {
    $scope.error = {};
    $scope.submitted = false;
    if (merchantConfigService.merchantConfig.general.phone) {
      var phone = merchantConfigService.merchantConfig.general.phone.toString();
      $scope.phone = [
        phone.substring(0,2),
        phone.substring(2,10)
      ];
    } else {
      $scope.phone = [];
    }

    $scope.$watch(function() {
      return $scope.phone;
    },function(value) {
      if (value.length > 0) {
        merchantConfigService.merchantConfig.general.phone = value.join("");
        if (merchantConfigService.merchantConfig.general.phone.length < 10) {
          $scope.error.phone = "Phone number must have 10 digits";
        } else {
          $scope.error.phone = "";
        }
      } else {
        $scope.error.phone = "Phone number is required";
      }
    },true);

    $scope.onlyDigits = function($event) {
      if(isNaN(String.fromCharCode($event.keyCode))){
        $event.preventDefault();
      }
    };

    $scope.changeFocus = function() {
      if ($scope.phone[0] && $scope.phone[0].length >= 2) {
        angular.element('#phoneNumber').trigger('focus');
      }
    };

    $scope.uploadFile = function() {
      angular.element('#upload').trigger('click');
    };

    var uploader = $scope.uploader = new FileUploader({
      url: 'iapi/uploads',
      onAfterAddingFile : function(item) {
        item.upload();
      },
      onCompleteItem: function(item,res) {
        merchantConfigService.merchantConfig.general.logo = res.fileUrl
      }
    });

    uploader.filters.push({
      name: 'imageFilter',
      fn: function (item) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|png|'.indexOf(type) !== -1;
      }
    });

    $rootScope.next = function() {
      $scope.submitted = true;
      if ($scope.form.$valid) {
        $rootScope.currentPanel = 'addresses';
      }
    };

    merchantConfigService.generalController = this;
    this.validate = validate;

    if (merchantConfigService.merchantConfig) {
      if (merchantConfigService.merchantConfig.general.entityType == 'SoleTrader'
        || merchantConfigService.merchantConfig.general.entityType == 'PtyLtd'
        || merchantConfigService.merchantConfig.general.entityType == 'Partnership') {
        $scope.entityTypeOptionsModel = merchantConfigService.merchantConfig.general.entityType;
      } else {
        $scope.entityTypeOptionsModel = 'Other';
        $scope.otherEntityType = merchantConfigService.merchantConfig.general.entityType;
      }

      if (merchantConfigService.merchantConfig.general.entityType == 'SoleTrader'
        || merchantConfigService.merchantConfig.general.entityType == 'PtyLtd'
        || merchantConfigService.merchantConfig.general.entityType == 'Partnership') {
        $scope.accountingPackageOptionsModel = merchantConfigService.merchantConfig.general.entityType;
      } else {
        $scope.accountingPackageOptionsModel = 'Other';
        $scope.otherAccountingPackage = merchantConfigService.merchantConfig.general.entityType;
      }
    }

    function validate() {
      return $scope.form.validate(true);
    }

    this.selectEntityType = function (entityType) {
      var asdfs = 3;
    };

    $scope.uploadFile = function(event){      
      var files = event.target.files;
      var file = files[0];
      var ext = file.name.split('.').pop();
      if(ext !== 'png' && ext !== 'PNG'){ 
        $scope.error.logo = 'Accept png only';
         
      }else{
        $scope.error.logo = '';
      }
      $scope.$apply();
    };
  }

})();
