(function () {
  angular.module('CmMerchantConfigApp')
    .filter('abnNumber',function() {
      return function(input) {
        if (input) {
          return  input.substring(0,2) + ' ' + input.substring(2,5) + ' ' + input.substring(5,8) + ' ' + input.substring(8,11)
        }
      }
    })
    .filter('phoneNumber',function() {
      return function(input) {
        if (input) {
          return  '(' + input.substring(0,2) + ') ' + input.substring(2,6) + ' ' + input.substring(6,10)
        }
      }
    })
    .filter('mobileNumber',function() {
      return function(input) {
        if (input) {
          return  input.substring(0,4) + ' ' + input.substring(4,7) + ' ' + input.substring(7,10)
        }
      }
    })
    .filter('accountBSB',function() {
      return function(input) {
        if (input) {
          return  input.substring(0,3) + '-' + input.substring(3,6);
        }
      }
    })
    .filter('accountNumber',function() {
      return function(input) {
        if (input) {
          return   input.substring(0,2) + '-' + input.substring(2,6) + '-' + input.substring(6,9);
        }
      }
    })
    .filter('percentage',function($filter) {
      return function(input,decimals) {
        console.log(isNaN(input));
        console.log(isNaN(input));
        if (input && !isNaN(input)) {
          return $filter('number')(input, decimals) + '%';
        }
        return input;
      }
    })
    .filter('dueDate', function() {
      return function(input) {
        if (input) {
          if (input > 1) {
            return input + ' days';
          }
          return input + ' day';
        }
      }
    }).filter('noDay', function() {
      return function(input) {
        if (input) {
          return 'Day ' + input;
        }
      }
    })
    .filter('amount', function($filter) {
      return function(input,decimals) {
        if (input && !isNaN(input)) {
          return '$' + $filter('number')(input, decimals);
        }
        return input;
      }
    })
    .filter('reminderss', function() {
      return function(input) {
        if (input) {
          if (input > 1) {
            return '(max. ' +input + ' reminders)';
          }
          return '(max. ' + input + ' reminder)';
        }
      }
    });
})();