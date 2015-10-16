(function () {
  angular.module('CmMerchantConfigApp')
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
    .filter('amount', function() {
      return function(input) {
        if (input) {
          return '$' + input;
        }
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