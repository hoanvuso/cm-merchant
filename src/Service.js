(function () {

  angular.module('CmMerchantConfigApp')
    .factory('merchantConfigService', function () {
      return new Service();
    });

  function Service() {

    this.merchantConfig = getDefaultMerchantConfig();
    this.generalAccountingPackage = "Xero";
    this.generalEntityType = "PtyLtd";
    this.save = save;

    this.universallyAvailablePaymentTerms = null;
    this.universallyAvailablePaymentTermsSelected = false;
    this.debtorSurchargesSelected = false;


    function save() {
      if (this.generalController.validate()) {
      }
    }

    function getDefaultMerchantConfig() {
      return {
        "abnNumber": null,
        "general": {
          "entityType": "PtyLtd",
          "industryType": "",
          "merchantName": null,
          "merchantTradingName": null,
          "primaryPhoneNumber": null,
          "afterHoursPhoneNumber": null,
          "accountingPackage": "Xero"
        },
        contacts: {
          keyCommercial: {},
          it: {},
          oneBoxBilling: {}
        },
        "banking": {
          "settlementAccountName": null,
          "settlementAccountBsb": null,
          "settlementAccountNumber": null
        },
        "debtorCommunications": {},
        "addresses": {
          "business": {
            "poBox": null,
            "unitOrLevel": null,
            "propertyName": null,
            "addressLine1": null,
            "addressLine2": null,
            "suburb": null,
            "state": null,
            "postCode": null,
            "country": "Australia"
          },
          "mailing": null
        },
        "merchantAdministrators": [
          {
            "emailAddress": null,
            "custom1": null,
            "custom2": null,
            "custom3": null,
            "custom4": null,
            "custom5": null
          }
        ],
        "paymentTerms": {
          "offersSpecialPaymentTerms": true,
          "serviceFeeRate": 1.10,
          "serviceFeeRateIsCostToMerchant": true,
          "availablePaymentTerms": []
        },
        "customizations": {
          "customFields": {
            "invoice": {
              "custom1": null,
              "custom2": null,
              "custom3": null,
              "custom4": null,
              "custom5": null
            },
            "merchantUser": {
              "custom1": null,
              "custom2": null,
              "custom3": null,
              "custom4": null,
              "custom5": null
            }
          }
        },
        "appskin": {
          "navbar": {
            "height": 100,
            "classes": "navbar",
            "headerContent": "<img src='/assets/cm/CM-Logo-240x50.png'>"
          },
          "reports": {
            "leftHeaderImage": "/assets/merchants/64030753819/CreekStDoveLogo.png",
            "rightHeaderImage": null
          },
          "email": {
            "centerHeaderImage": "/assets/cm/CM-Logo-240x50.png"
          },
          "mobile": {
            "navbar": {
              "leftContent": ""
            },
            "menuSidebar": {
              "headerContent": "<h3 class='menu-sidebar-header'>Collections Manager </h3>"
            }
          }
        }
      };
    }

  }

})();