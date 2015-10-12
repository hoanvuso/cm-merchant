(function () {

    angular.module('CmCommon')
        .controller('EditUserDialogController', Controller);

    function Controller($scope, app, merchantConfig, $http, cm, user) {

        $scope.dialogTitle = user.userId ? 'Edit User' : 'New User';
        $scope.app = app;
        setCustomFieldConfigs();
        $scope.custom1 = merchantConfig.customizations.customFields.merchantUser.custom1;
        $scope.ok = ok;
        $scope.passwordConfirmationDiffers = passwordConfirmationDiffers;

        setPartnerCheckboxesInitialState();
        $scope.model = angular.copy(user);
        $scope.passwordConfirmation = null;

        function setCustomFieldConfigs() {
            if (merchantConfig.customizations && merchantConfig.customizations.customFields && merchantConfig.customizations.customFields.merchantUser) {
                $scope.custom1 = merchantConfig.customizations.customFields.merchantUser.custom1;
                $scope.custom2 = merchantConfig.customizations.customFields.merchantUser.custom2;
                $scope.custom3 = merchantConfig.customizations.customFields.merchantUser.custom3;
                $scope.custom4 = merchantConfig.customizations.customFields.merchantUser.custom4;
                $scope.custom5 = merchantConfig.customizations.customFields.merchantUser.custom5;
            }
        }

        function setPartnerCheckboxesInitialState() {
            if (user.custom1) $scope.custom1Checked = true;
            if (user.custom2) $scope.custom2Checked = true;
            if (user.custom3) $scope.custom3Checked = true;
            if (user.custom4) $scope.custom4Checked = true;
            if (user.custom5) $scope.custom5Checked = true;
        }

        function passwordConfirmationDiffers() {
            return ($scope.model.password || $scope.passwordConfirmation) && $scope.model.password != $scope.passwordConfirmation
        }

        function ok() {
            if (passwordConfirmationDiffers()) {
                $scope.form.passwordConfirmation.element.focus();
            } else {
                if ($scope.form.validate(true)) {
                    if (user.userId) {
                        $http.post('/sapi/editUserDialog/updateMerchantUser', $scope.model)
                            .then(function (response) {
                                      $scope.$close(response.data);
                                  },
                                  function (response) {
                                      cm.handleHttpAPIError(response);
                                  });
                    } else {
                        $http.post('/sapi/editUserDialog/createMerchantUser', $scope.model)
                            .then(function (response) {
                                      $scope.$close(response.data);
                                  },
                                  function (response) {
                                      cm.handleHttpAPIError(response);
                                  });
                    }
                }
            }
        }

    }

})();
