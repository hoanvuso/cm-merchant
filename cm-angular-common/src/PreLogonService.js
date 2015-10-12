(function () {

    angular.module('CmCommon')
        .factory('preLogon', function ($http, $timeout, $rootScope) {
                     return new Service($http, $timeout, $rootScope);
                 });


    function Service($http, $timeout, $rootScope) {

        this.getInitializationDetails = function (appModule, appPageName) {
            if (!appModule) throw new Error("CmCommon preLogon service getInitializationDetails(): appModule must be provided");
            if (!appPageName) throw new Error("CmCommon preLogon service getInitializationDetails(): appPageName must be provided");

            var numberOfAttempts = 0;
            getDetails();

            function getDetails() {

                console.log("getPreLogonInitializationDetails attempt: " + (numberOfAttempts + 1));

                $http.get('/iapi/getPreLogonInitializationDetails')
                    .then(function (response) {
                              if (response.status === 200
                                  && response.data
                                  && typeof response.data === "string"
                                  && response.data.substr(0, 22) === '<!-- logonPageFlag -->') {

                                  handleError(response);

                              }
                              handleSuccess(response);
                          },
                          function (response) {
                              if (numberOfAttempts++ < 0) {
                                  $timeout(getDetails, 500);
                              } else {
                                  handleError(response);
                              }
                          });

                function handleSuccess(response) {
                    angular.module(appModule)
                        .constant("appPageName", appPageName)
                        .constant("merchantConfig", response.data.merchantConfig)
                        .constant("referralPartnerConfig", response.data.referralPartnerConfig)
                        .constant("preLogonInitSuccess", true)
                        .constant("cmLib", new CmLib($rootScope, {success: true}));
                    angular.bootstrap(document, [appModule]);
                }

                function handleError(response) {
                    angular.module(appModule)
                        .constant("appPageName", appPageName)
                        .constant("merchantConfig", null)
                        .constant("preLogonInitSuccess", false)
                        .constant("cmLib", new CmLib($rootScope, {success: false, errorResponse: response}));
                    angular.bootstrap(document, [appModule]);
                }

            }

        }

    }

    function CmLib($rootScope, preLogonInitializationResult) {

        this.baseAppRun = function (ji) {

            if (!preLogonInitializationResult.success) {
                ji.showErrorDialog(preLogonInitializationResult.errorResponse);
            }

            // Published services
            $rootScope.log = function (variable) {
                console.log(variable);
            };
            $rootScope.alert = function (text) {
                if (typeof text === "string") {
                    alert(text);
                } else {
                    alert(angular.toJson(text, "pretty"));
                }
            };

        };

        this.baseAppConfig = function ($provide, $httpProvider) {
            if (preLogonInitializationResult.success) {

                // If $httpProvider.responseInterceptors exists then angular 1.2.x is being used
                if ($httpProvider.responseInterceptors) {
                    $httpProvider.responseInterceptors.push(JiConfig.logonPageToUnauthorizedResponseTransformFunction);
                } else {
                    $httpProvider.interceptors.push(JiConfig.logonPageToUnauthorizedResponseInterceptor);
                }

                // default exception handler just logs uncaught exceptions - this will show an alert also
                $provide.decorator("$exceptionHandler", function ($delegate) {
                    return function (exception, cause) {
                        $delegate(exception, cause);
                        var errorMessage, causeMessage;
                        if (typeof exception === "string") {
                            errorMessage = exception;
                        } else if (exception.message) {
                            errorMessage = exception.message;
                        } else {
                            errorMessage = angular.toJson(exception, "pretty");
                        }
                        if (cause) {
                            alert('exception:\n' + errorMessage
                                  + '\n\ncause:\n' + (typeof cause === "string" ? cause : angular.toJson(cause, "pretty")));
                        } else {
                            alert(errorMessage);
                        }
                    };
                });

                return true;

            } else {
                return false;
            }
        };

    }

})();
