angular.module('CmMerchantConfigApp')
  .factory('Modal', function ($rootScope, $modal) {
    function openModal(scope, modalClass) {
      var modalScope = $rootScope.$new();
      scope = scope || {};
      modalClass = modalClass || 'modal-default';

      angular.extend(modalScope, scope);

      return $modal.open({
        templateUrl: 'modals/modal.html',
        windowClass: modalClass,
        scope: modalScope,
        backdrop: 'static'
      });
    }

    return {
      confirm: {
        changeTab : function(cb) {
          cb = (cb || angular.noop);
          var modal;
          modal = openModal({
            modal: {
              dismissable: false,
              title: 'Confirm Change',
              html: '<p>Certain fields are missing or incomplete are you sure you want to move to the next tab?</p>',
              buttons: [{
                classes: 'btn-warning',
                text: 'Next tab',
                click: function(e) {
                  modal.close(e);
                  return cb(true);
                }
              }, {
                classes: 'btn-default',
                text: 'Back',
                click: function(e) {
                  modal.dismiss(e);
                  return cb(false);
                }
              }]
            }
          },'modal-danger')
        },
      },
    }
  });