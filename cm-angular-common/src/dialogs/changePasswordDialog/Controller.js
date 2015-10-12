(function () {

    angular.module('CmCommon')
        .controller('ChangePasswordDialogController', Controller);

    function Controller($scope, app, $http, cm) {

        $scope.app = app;
        $scope.ok = ok;
        $scope.passwordConfirmationDiffers = passwordConfirmationDiffers;
        $scope.model = {};

        $scope.passwordConfirmation = null;

        function passwordConfirmationDiffers() {
            return ($scope.model.password || $scope.passwordConfirmation) && $scope.model.password != $scope.passwordConfirmation
        }

        function ok() {
            if (passwordConfirmationDiffers()) {
                $scope.form.passwordConfirmation.element.focus();
            } else {
                if ($scope.form.validate(true)) {
                    $http.post('/sapi/changePasswordDialog/changePassword', '"' + $scope.model.password + '"')
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

})();
