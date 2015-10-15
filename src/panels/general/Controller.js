(function () {

  angular.module('CmMerchantConfigApp')
    .controller('GeneralPanelController', Controller);

  function Controller($scope, merchantConfigService,FileUploader) {
    $scope.error = {};
    if (merchantConfigService.merchantConfig.abnNumber) {
      var abnNumber = merchantConfigService.merchantConfig.abnNumber.toString();
      $scope.abnNumber = [
        abnNumber.substring(0,2),
        abnNumber.substring(2,5),
        abnNumber.substring(5,8),
        abnNumber.substring(8,11)
      ]
    } else {
      $scope.abnNumber = [];
    }

    if (merchantConfigService.merchantConfig.general.phone) {
      var phone = merchantConfigService.merchantConfig.general.phone.toString();
      $scope.phone = [
        phone.substring(0,3),
        phone.substring(3,10)
      ]
    } else {
      $scope.phone = [];
    }

    $scope.$watch(function() {
      return $scope.abnNumber;
    },function(value) {
      if (value.length > 0) {
        merchantConfigService.merchantConfig.abnNumber = value.join("");
        if (merchantConfigService.merchantConfig.abnNumber.length < 11) {
          $scope.error.abnNumber = "Abn number must have 11 digits";
        } else {
          $scope.error.abnNumber = "";
        }
        console.log($scope.error.abnNumber);
      }
    },true);

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
        console.log($scope.error.phone);
      }
    },true);

    $scope.onlyDigits = function($event) {
      if(isNaN(String.fromCharCode($event.keyCode))){
        $event.preventDefault();
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
    }

  }

})();
