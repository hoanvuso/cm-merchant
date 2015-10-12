(function () {

    var pageAppModuleName = 'CmMerchantConfigApp',
        appPageName = 'merchantconfig';

    angular.module('CmMerchantConfigAppPageInit', ['ui.bootstrap', 'jiAngular']);

    angular.module('CmMerchantConfigAppPageInit')
        .factory('pageInitializationService', function ($http, $timeout, ji) {
                     return new Service($http, $timeout, ji);
                 });


    function Service($http, $timeout, ji) {

        var thisService = this;
        this.initializePage = initializePage;

        function initializePage() {

            var numberOfAttempts = 0;
            getDetails();

            function getDetails() {

                console.log("getPreLogonInitializationDetails attempt: " + (numberOfAttempts + 1));

                $http.get('/iapi/referralPartnerConfig/referralPartner.json')
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
                    thisService.failed = false;
                    angular.module(pageAppModuleName)
                        .constant("appPageName", appPageName)
                        .constant("referralPartnerConfig", response.data);
                    angular.bootstrap(document, [pageAppModuleName]);
                }

                function handleError(response) {
                    thisService.failed = true;
                    thisService.errorResponse = response;
                    ji.showErrorDialog(response);
                    angular.module(pageAppModuleName)
                        .constant("appPageName", appPageName)
                        .constant("referralPartnerConfig", null);
                    angular.bootstrap(document, [pageAppModuleName]);
                }

            }

        }

    }

})();
