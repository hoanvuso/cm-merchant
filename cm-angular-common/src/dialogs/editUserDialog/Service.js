(function () {

    angular.module('CmCommon')
        .factory('editUserDialog', function ($modal, $http, cm, merchantConfig) {
                     return new Service($modal, $http, cm, merchantConfig);
                 });

    function Service($modal, $http, cm, merchantConfig) {

        this.openToEdit = function (userId, somethingChangedHandler) {
            $http.get('/sapi/editUserDialog/getUser?userId=' + userId)
                .then(function (response) {
                          open(response.data, somethingChangedHandler);
                      },
                      function (response) {
                          cm.handleHttpAPIError(response);
                      });
        };

        this.openForNew = function (somethingChangedHandler) {
            open({
                    "userId": null,
                    "merchantAbnNumber": merchantConfig.abnNumber,
                    "username": null,
                    "firstName": null,
                    "middleNameOrInitial": null,
                    "lastName": null,
                    "isAnAdmin": false,
                    "isATrustFundAdmin": false,
                    "custom1": null,
                    "custom2": null,
                    "custom3": null,
                    "custom4": null,
                    "custom5": null,
                    "inactivatedDatetime": null
                },
                somethingChangedHandler);
        };

        function open(user, somethingChangedHandler) {

            $modal.open({
                templateUrl: '/common/dialogs/editUserDialog/dialog.html',
                controller: 'EditUserDialogController',
                windowClass: 'edit-user-dialog',
                resolve: {
                    user: function () {
                        return user;
                    }
                },
                backdrop: false
            }).result.then(function (somethingChanged) {
                               if (somethingChanged && somethingChangedHandler) {
                                   somethingChangedHandler();
                               }
                           });
        }

    }

})();