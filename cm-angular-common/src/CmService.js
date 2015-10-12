(function () {

    angular.module('CmCommon')
        .factory('cm', function ($window, ji, appPageName) {
                     return new Service($window, ji, appPageName);
                 });


    function Service($window, ji, appPageName) {

        this.handleHttpAPIError = function (response) {
            if (response.generatedByLogonPageToUnauthorizedResponseTransformFunction) {
                $window.location.assign("login?then=" + appPageName);
                //jiLogonDialog.open(function () {
                //                       $window.location.reload();
                //                   },
                //                   function (username) {
                //                       $http.post('/passwordreset/sendResetPasswordEmail?emailAddress=' + username + "&destinationPage=" + appPageName)
                //                           .then(function (response) {
                //                                     ji.showMessageDialog("Reset password email sent to " + username);
                //                                 },
                //                                 function (response) {
                //                                     ji.showErrorDialog(response);
                //                                 });
                //                   });
            } else {
                ji.showErrorDialog(response)
            }
        };

        this.AppService = function ($http, cm, initDetailsUrl) {

            var thisService = this, initializationIsComplete = false, postInitializationActions = [];

            this.user = null;

            this.addPostInitializationAction = addPostInitializationAction;

            initialize();

            function initialize() {
                $http.get(initDetailsUrl)
                    .then(function (response) {
                              for (var property in response.data) {
                                  thisService[property] = response.data[property];
                              }
                              initializationIsComplete = true;
                              executePostInitializationActions();
                          },
                          function (response) {
                              cm.handleHttpAPIError(response);
                          });
            }

            function executePostInitializationActions() {
                var actionFunction;
                while (actionFunction = postInitializationActions.shift()) {
                    actionFunction();
                }
            }

            function addPostInitializationAction(actionFunction) {
                if (initializationIsComplete) {
                    actionFunction();
                } else {
                    postInitializationActions.push(actionFunction);
                }
            }


        }

    }

})();