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
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "loan_offers" : [ {
    "loan_offer_resource_identification" : "LO0001",
    "principal_amount" : {
      "currency" : "EUR",
      "Amount" : "3000"
    },
    "validity_date" : {
      "date_time" : {
        "from_date_time" : "2018-05-30T08:00:00Z",
        "to_date_time" : "2018-06-01T23:59:59Z"
      }
    },
    "purpose" : {
      "description" : "TV1",
      "line_item" : [ {
        "identification" : "TV Set"
      } ]
    },
    "interest_rate" : [ {
      "rate" : "2.00"
    } ],
    "number_of_tranches" : "3",
    "tranche" : [ {
      "tranche_number" : "T0001",
      "due_date" : "2018-07-01",
      "principal_amount" : {
        "currency" : "EUR",
        "amount" : "1000"
      },
      "interest_amount" : {
        "currency" : "EUR",
        "amount" : "4.95"
      },
      "last_tranche_indicator" : false
    }, {
      "tranche_number" : "T0002",
      "due_date" : "2018-08-01",
      "principal_amount" : {
        "currency" : "EUR",
        "amount" : "1000"
      },
      "interest_amount" : {
        "currency" : "EUR",
        "amount" : "3.30"
      },
      "last_tranche_indicator" : false
    }, {
      "tranche_number" : "T0003",
      "due_date" : "2018-09-01",
      "principal_amount" : {
        "currency" : "EUR",
        "amount" : "1000"
      },
      "interest_amount" : {
        "currency" : "EUR",
        "amount" : "1.65"
      },
      "last_tranche_indicator" : true
    } ],
    "charges_and_fees" : {
      "record" : [ {
        "amount" : {
          "currency" : "EUR",
          "amount" : "30"
        },
        "type" : "SETUP"
      } ]
    },
    "total_loan_cost" : {
      "currency" : "EUR",
      "amount" : "3039.90"
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
    "loan_offer_resource_identification" : "LO0002",
    "principal_amount" : {
      "currency" : "EUR",
      "Amount" : "3000"
    },
    "total_loan_cost" : {
      "currency" : "EUR",
      "amount" : "3039.90"
    },
    "validity_date" : {
      "date_time" : {
        "from_date_time" : "2018-05-30T08:00:00Z",
        "to_date_time" : "2018-06-01T23:59:59Z"
      }
    },
    "purpose" : {
      "description" : "TV01"
    },
    "interest_rate" : [ {
      "rate" : "1.50"
    } ],
    "number_of_tranches" : "3",
    "tranche" : [ {
      "tranche_number" : "T0011",
      "due_date" : "2018-07-01",
      "principal_amount" : {
        "currency" : "EUR",
        "Amount" : "1500"
      },
      "interest_amount" : {
        "currency" : "EUR",
        "Amount" : "3.72"
      },
      "last_tranche_indicator" : false
    }, {
      "tranche_number" : "T0012",
      "due_date" : "2018-09-01",
      "principal_amount" : {
        "currency" : "EUR",
        "Amount" : "1500"
      },
      "interest_amount" : {
        "currency" : "EUR",
        "Amount" : "1.86"
      },
      "last_tranche_indicator" : true
    } ],
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
  } ]
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

