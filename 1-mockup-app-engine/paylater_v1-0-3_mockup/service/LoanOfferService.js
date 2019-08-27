'use strict';

/**
 * Loan Offer
 * Requests the Bank/ASPSP for a number of Loan Offers based on the criteria in the request.
 *
 * consumer_id String Unique and unambiguous identification of a consumer.
 * request_body LoanOfferRequest Loan Offer Request
 * returns LoanOfferResponse
 **/

exports.paylaterConsumer_idLoanOfferPOST = function(consumer_id,request_body) {
  console.log('request_body: ' + JSON.stringify(request_body))
  console.log('consumer_id: ' + JSON.stringify(consumer_id))
  // preps to populate sample payload
  var loanOfferResourceIdentification1 = 'LO' + Math.floor(1000 + Math.random() * 9000)
  var loanOfferResourceIdentification2 = 'LO' + Math.floor(1000 + Math.random() * 9000)
  var today = new Date()
  var todayPlusOneWeek = new Date()
  todayPlusOneWeek.setDate(todayPlusOneWeek.getDate() + 7);  // default validity is one week
  console.log('today: ' + today.toISOString())
  console.log('today plus one week: ' + todayPlusOneWeek.toISOString())
  var requestedCurrency = request_body.principal_amount.currency
  var interestRate = 2
  var upfrontPayment = parseInt(request_body.up_front_payment.amount, 10) // what the consumer is willing to pay upfront
  var principalAmount = parseInt(request_body.principal_amount.amount, 10) // the total value of goods
  console.log('upfrontPayment: ' + upfrontPayment)
  console.log('principalAmount: ' + principalAmount)
  var firstLoanPaymentDue = addMonthsUTC(today,1) // first payment after one month
  var secondLoanPaymentDue =  addMonthsUTC(today,2)  // second payment after two months
  var thirdLoanPaymentDue =  addMonthsUTC(today,3)  // third payment after three months 
  console.log('firstLoanPaymentDue: ' + firstLoanPaymentDue.toISOString())
  console.log('secondLoanPaymentDue: ' + secondLoanPaymentDue.toISOString())
  console.log('thirdLoanPaymentDue: ' + thirdLoanPaymentDue.toISOString())
  var remainingAmount = principalAmount - upfrontPayment
  console.log('remainingAmount: ' + remainingAmount)
  var numOfTranches = 3
  var setupFee = 30
  var tranche1 = 2.95
  var tranche2 = 1.70
  var tranche3 = 1
  var tranchesSum = tranche1 + tranche2 + tranche3
  var trancheSplit = (remainingAmount + setupFee) / numOfTranches
  var totalLoanCost = remainingAmount + setupFee + tranchesSum

  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "loan_offers" : [ {
    "loan_offer_resource_identification" : loanOfferResourceIdentification1,
    "principal_amount" : {
      "currency" : requestedCurrency,
      "Amount" : request_body.principal_amount.amount
    },
    "validity_date" : {
      "date_time" : {
        "from_date_time" : today.toISOString().split('T')[0],
        "to_date_time" : todayPlusOneWeek.toISOString().split('T')[0]
      }
    },
    "purpose" : {
      "description" : request_body.purpose.description,
      "line_item" : [ {
        "identification" : request_body.purpose.description
      } ]
    },
    "interest_rate" : [ {
      "rate" : interestRate.toString()
    } ],
    "number_of_tranches" : numOfTranches.toString(),
    "tranche" : [ {
      "tranche_number" : "T0001",
      "due_date" : firstLoanPaymentDue.toISOString().split('T')[0],
      "principal_amount" : {
        "currency" : requestedCurrency,
        "amount" : trancheSplit
      },
      "interest_amount" : {
        "currency" : requestedCurrency,
        "amount" : tranche1
      },
      "last_tranche_indicator" : false
    }, {
      "tranche_number" : "T0002",
      "due_date" : secondLoanPaymentDue.toISOString().split('T')[0],
      "principal_amount" : {
        "currency" : requestedCurrency,
        "amount" : trancheSplit
      },
      "interest_amount" : {
        "currency" : requestedCurrency,
        "amount" : tranche2
      },
      "last_tranche_indicator" : false
    }, {
      "tranche_number" : "T0003",
      "due_date" : thirdLoanPaymentDue.toISOString().split('T')[0],
      "principal_amount" : {
        "currency" : requestedCurrency,
        "amount" : trancheSplit
      },
      "interest_amount" : {
        "currency" : requestedCurrency,
        "amount" : tranche3
      },
      "last_tranche_indicator" : true
    } ],
    "charges_and_fees" : {
      "record" : [ {
        "amount" : {
          "currency" : requestedCurrency,
          "amount" : setupFee
        },
        "type" : "SETUP"
      } ]
    },
    "total_loan_cost" : {
      "currency" : requestedCurrency,
      "amount" : totalLoanCost
    },
    "hal_links" : {
      "consent" : {
        "href" : "a",
        "uri_template" : true
      },
      "loan_offers" : [ {
        "href" : "a",
        "uri_template" : true
      } ]
    }
  }, {
    "loan_offer_resource_identification" : loanOfferResourceIdentification2,
    "principal_amount" : {
      "currency" : requestedCurrency,
      "Amount" : request_body.principal_amount.amount
    },
    "validity_date" : {
      "date_time" : {
        "from_date_time" : today.toISOString().split('T')[0],
        "to_date_time" : todayPlusOneWeek.toISOString().split('T')[0]
      }
    },
    "purpose" : {
      "description" : request_body.purpose.description,
      "line_item" : [ {
        "identification" : request_body.purpose.description
      } ]
    },
    "interest_rate" : [ {
      "rate" : interestRate.toString()
    } ],
    "number_of_tranches" : numOfTranches.toString(),
    "tranche" : [ {
      "tranche_number" : "T0001",
      "due_date" : firstLoanPaymentDue,
      "principal_amount" : {
        "currency" : requestedCurrency,
        "amount" : trancheSplit
      },
      "interest_amount" : {
        "currency" : requestedCurrency,
        "amount" : tranche1
      },
      "last_tranche_indicator" : false
    }, {
      "tranche_number" : "T0002",
      "due_date" : secondLoanPaymentDue,
      "principal_amount" : {
        "currency" : requestedCurrency,
        "amount" : trancheSplit
      },
      "interest_amount" : {
        "currency" : requestedCurrency,
        "amount" : tranche2
      },
      "last_tranche_indicator" : false
    }, {
      "tranche_number" : "T0003",
      "due_date" : thirdLoanPaymentDue,
      "principal_amount" : {
        "currency" : requestedCurrency,
        "amount" : trancheSplit
      },
      "interest_amount" : {
        "currency" : requestedCurrency,
        "amount" : tranche3
      },
      "last_tranche_indicator" : true
    } ],
    "charges_and_fees" : {
      "record" : [ {
        "amount" : {
          "currency" : requestedCurrency,
          "amount" : setupFee
        },
        "type" : "SETUP"
      } ]
    },
    "total_loan_cost" : {
      "currency" : requestedCurrency,
      "amount" : totalLoanCost
    },
    "hal_links" : {
      "consent" : {
        "href" : "a",
        "uri_template" : true
      },
      "loan_offers" : [ {
        "href" : "a",
        "uri_template" : true
      } ]
    }
  }  ]
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


function addMonthsUTC (date, count) {
  if (date && count) {
    var m, d = (date = new Date(+date)).getUTCDate()

    date.setUTCMonth(date.getUTCMonth() + count, 1)
    m = date.getUTCMonth()
    date.setUTCDate(d)
    if (date.getUTCMonth() !== m) date.setUTCDate(0)
  }
  return date
}