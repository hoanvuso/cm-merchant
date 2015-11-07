(function () {

  angular.module('CmMerchantConfigApp')
    .factory('merchantConfigService', function () {
      return new Service();
    });

  function Service() {

    this.step = 0;
    this.merchantConfig = getDefaultMerchantConfig();
    this.emailSubstitutions = getDefaultEmailSubstitutions();
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
          oneBoxBilling: {},
          accountReceivable: {}
        },
        "banking": {
          "settlementAccountName": null,
          "settlementAccountBsb": null,
          "settlementAccountNumber": null
        },
        "businessRule": {
          "discounts": {

          },
          "paymentTerm": {
          }
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
          "mailing": {
            state: null,
          }
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

    function getDefaultEmailSubstitutions() {
      return {
        newInvoice: {
          heading: 'Payment Instruction',
          salutation: 'Dear Sir/Madam',
          thankYou: 'We thank you in advance for your prompt attention to this matter',
          valediction: 'Your sincerely'
        },
        invoicePastDue: {
          heading: 'Statement',
          salutation: 'Dear Sir/Madam',
          invoiceDescription: 'Your current invoices are as follows:',
          thankYou: 'We thank you in advance for your prompt attention to this matter',
          valediction: 'Your sincerely'
        },
        invoicePastDueReminder: {
          heading: 'Payment Instruction',
          salutation: 'Dear Sir/Madam',
          invoiceDescription: 'Please see attached a copy of our invoice for our services provided as summarised below:',
          thankYou: 'We thank you in advance for your prompt attention to this matter',
          valediction: 'Your sincerely'
        },
        seriousArrears: {
          heading: 'Overdue Invoices Serious Arrears',
          salutation: 'Dear Sir/Madam',
          invoiceDescription: 'We advise of the following overdue invoices that are now in serious arrears with us:',
          descriptiveText:
            '<p><strong>You are advised</strong> that failure to take action will likely result is the following actions being taken by us:</p>' +
            ' <ol>' +
            '   <li>Formal recovery action being taken against you; and/or</li>' +
            '   <li>Credit default notices being lodged against you with a National Credit Rating agency</li>' +
            ' </ol>' +
            ' <p>If you are unable to pay this debt you are strongly encouraged to immediately contact the Accounts Department.</p>',
          valediction: 'Your sincerely'
        },
        seriousArrearsReminder: {
          heading: 'Overdue Invoices - Serious Arrears Reminder',
          salutation: 'Dear Sir/Madam',
          invoiceDescription: 'We advise of the following overdue invoices that are now in serious arrears with us:',
          descriptiveText:
          ' <p><strong>You are Reminded</strong> that failure to take action will likely result is the following actions being taken by us:</p>' +
          ' <ol>' +
          '   <li>Formal recovery action being taken against you and/or</li>' +
          '   <li>Credit default notices being lodged against you with a National Credit Rating agency</li>' +
          ' </ol>' +
          ' <p><strong>If you are unable to pay this debt you are strongly encouraged to immediately contact the Accounts Department.</strong></p>',
          valediction: 'Your sincerely'
        },
        noticeDefault: {
          heading: 'Notice of Default',
          salutation: 'Dear Sir/Madam',
          invoiceDescription: 'We regret that you have failed to respond to our Invoices outstanding payment requests',
          descriptiveText:
          ' <p>You are hereby notified:</p>' +
          ' <ul>' +
          '   <li>You are in default with us in respect of our payment terms</li>' +
          '   <li>No further system based communications will be issued to you</li>' +
          '   <li>If you do not take prompt action to rectify the matter with us, we may take legal action and/or refer the matter to a third party collections agent</li>' +
          '   <li>Such actions by us may affect your ability to obtain credit in the future</li>' +
          '   <li>We will look to pass the costs of any such actions on to you</li>' +
          ' </ul>' +
          ' <p>We remind you of your obligations and strongly suggest that you contact us immediately to discuss payment of your outstanding invoice balances and avoid any additional legal costs.</p>',
          valediction: 'Your sincerely'
        }
      }
    }

  }

})();