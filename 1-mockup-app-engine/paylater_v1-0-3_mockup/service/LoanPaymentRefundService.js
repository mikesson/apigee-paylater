'use strict';


/**
 * Loan Payment Refund
 * Requests the Bank/ASPSP for the details of the amount and account to execute a simple refund of a previously defined LoanPayment.
 *
 * consumer_id String Unique and unambiguous identification of a consumer.
 * request_body LoanPaymentRefundRequest Loan Payment Refund Request
 * returns LoanPaymentRefundResponse
 **/
exports.paylaterConsumer_idLoanPaymentRefundPOST = function(consumer_id,request_body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "return_account" : {
    "other" : {
      "identification" : "BankAccountId"
    }
  },
  "return_amount" : {
    "amount" : "1000",
    "currency" : "EUR"
  }
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

