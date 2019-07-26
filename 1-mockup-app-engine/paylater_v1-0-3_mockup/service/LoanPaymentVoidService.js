'use strict';


/**
 * Loan Payment Void
 * The user requests the cancellation of a previously established loan payment.
 *
 * consumer_id String Unique and unambiguous identification of a consumer.
 * request_body LoanPaymentVoidRequest Loan Payment Void Request
 * returns LoanPaymentVoidResponse
 **/
exports.paylaterConsumer_idLoanPaymentVoidPOST = function(consumer_id,request_body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "status_code" : "PACK"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

