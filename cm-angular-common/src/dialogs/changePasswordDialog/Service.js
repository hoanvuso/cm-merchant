(function () {

    angular.module('CmCommon')
        .factory('changePasswordDialog', function ($modal) {
                     return new Service($modal);
                 });

    function Service($modal) {

        this.open = function (somethingChangedHandler) {

            $modal.open({
                templateUrl: '/common/dialogs/changePasswordDialog/dialog.html',
                controller: 'ChangePasswordDialogController',
                windowClass: 'change-password-dialog',
                backdrop: false
            }).result.then(function (somethingChanged) {
                               if (somethingChanged && somethingChangedHandler) {
                                   somethingChangedHandler();
                               }
                           });
        }

    }

})();