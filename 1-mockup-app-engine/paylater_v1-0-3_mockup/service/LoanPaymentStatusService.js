'use strict';


/**
 * Loan Payment Status
 * The user requests the bank/ASPSP if the Loan Request has been accepted.
 *
 * consumer_id String Unique and unambiguous identification of a consumer.
 * request_body LoanPaymentStatusRequest Loan Payment Status Request
 * returns LoanPaymentStatusResponse
 **/
exports.paylaterConsumer_idLoanPaymentStatusPOST = function(consumer_id,request_body) {
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

