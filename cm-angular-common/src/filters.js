(function () {

    angular.module('CmCommon')
        .filter('currencyOrBlank', function ($filter) {
                    return function (amount, symbol) {
                        if (amount) {
                            return $filter('currency')(Math.round(amount), symbol).replace('.00', '');
                        } else {
                            return '';
                        }
                    };
                });

})();
