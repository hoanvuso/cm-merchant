angular.module('CmMerchantConfigApp', ['ngRoute',
                                       'ngAnimate',
                                       'ui.bootstrap',
                                       'ngSanitize',
                                       'angularFileUpload',
                                       'jiAngular',
                                       'ngCookies',
                                       'ngMask',
                                       'CmCommon'])
    .constant('skin', {
        stylesheet: "div.navbar {\n" +
                    "    border-bottom: solid #5782bc 3px;\n" +
                    "    padding: 0;\n" +
                    "    border-radius: 0;\n" +
                    "}\n" +
                    "\n" +
                    "div.navbar a {\n" +
                    "    color: #5782bc;\n" +
                    "}\n" +
                    "\n" +
                    "table.cm-table {\n" +
                    "    border-color: #5782bc;\n" +
                    "}\n" +
                    "\n" +
                    "table.cm-table th {\n" +
                    "    background-color: #5782bc;\n" +
                    "}\n" +
                    "\n" +
                    "table.cm-table td {\n" +
                    "    border-color: #5782bc;\n" +
                    "}",
        navbar: {
            headerContent: "<img src='/assets/cm/CM-Logo-240x50.png' style='margin: 10px'>",
            classes: "navbar"
        }
    })
    .config(function ($routeProvider, $provide, $httpProvider) {
                JiConfig.baseAppConfig($provide, $httpProvider);
            })
    .directive('merchantconfigStylesheet', function (referralPartnerConfig,skin) {

                   return {
                       restrict: 'EA',
                       replace: 'false',
                       template: function () {
                           return "<style>\n" +
                             (referralPartnerConfig.appskin.stylesheet || skin.stylesheet) +
                                  "\n</style>";
                       }
                   };

               })
    .directive('merchantconfigNavbar', function (referralPartnerConfig) {

                   return {
                       restrict: 'EA',
                       replace: 'false',
                       link: function (scope, iElement, iAttrs) {
                           iElement.append(referralPartnerConfig.appskin.navbar.headerContent);
                       }
                   };

               });

angular.element(document).ready(function () {
    angular.injector(['ng', 'CmMerchantConfigAppPageInit']).get('pageInitializationService').initializePage();
});
