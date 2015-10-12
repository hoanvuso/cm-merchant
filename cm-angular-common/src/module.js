(function () {

    angular.module('CmCommon', [])
        .directive('appskinStylesheet', function (merchantConfig) {

                       return {
                           restrict: 'EA',
                           replace: 'false',
                           template: function () {
                               return "<style>\n" +
                                      merchantConfig.appskin.stylesheet +
                                      "\n</style>";
                           }
                       };

                   })
        .directive('appskinNavbar', function (merchantConfig) {

                       return {
                           restrict: 'EA',
                           replace: 'false',
                           link: function (scope, iElement, iAttrs) {
                               iElement.append(merchantConfig.appskin.navbar.headerContent);
                           }
                       };

                   });

})();