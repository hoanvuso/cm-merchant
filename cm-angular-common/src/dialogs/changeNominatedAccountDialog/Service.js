(function () {

    angular.module('CmCommon')
        .factory('changeNominatedAccountDialog', function ($modal, $http, cm, ji) {
                     return new Service($modal, $http, cm, ji);
                 });

    function Service($modal) {

        this.open = function (paymentScheduleId, somethingChangedHandler) {
            if (!paymentScheduleId) throw new Error("changeNominatedAccountDialog: paymentScheduleId must be provided");
            $modal.open({
                templateUrl: '/common/dialogs/changeNominatedAccountDialog/dialog.html',
                controller: 'ChangeNominatedAccountDialogController',
                windowClass: 'change-nominated-account-dialog',
                resolve: {
                    paymentScheduleId: function () {
                        return paymentScheduleId;
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