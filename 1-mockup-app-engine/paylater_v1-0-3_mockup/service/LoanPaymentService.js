'use strict';


/**
 * Loan Payment
 * The user requests the Bank/ASPSP for a Loan, based on one of the Loan Offers supplied earlier.
 *
 * consumer_id String Unique and unambiguous identification of a consumer.
 * request_body LoanPaymentRequest Loan Payment Request
 * returns LoanPaymentResponse
 **/
exports.paylaterConsumer_idLoanPaymentPOST = function(consumer_id,request_body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "loan_payment_resource_identification" : "LP0001"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

