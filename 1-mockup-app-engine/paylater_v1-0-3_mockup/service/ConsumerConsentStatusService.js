'use strict';


/**
 * Consumer Consent Status
 * The TPP/Merchant requests the status of the consent request that was sent after the consumer has been authenticated by the bank/ASPSP.
 *
 * consumer_id String Unique and unambiguous identification of a consumer.
 * request_body ConsentStatusRequest Consumer Consent Status Request
 * returns ConsentStatusResponse
 **/
exports.paylaterConsumer_idConsumerConsentStatusPOST = function(consumer_id,request_body) {
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

