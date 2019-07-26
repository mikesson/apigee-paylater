'use strict';


/**
 * Consumer Consent
 * Request from the TPP/Merchant to obtain consent from the Bank/ASPSP for a Consumer.
 *
 * consumer_id String Unique and unambiguous identification of a consumer.
 * request_body ConsentRequest Consumer Consent Request
 * returns ConsentResponse
 **/
exports.paylaterConsumer_idConsumerConsentPOST = function(consumer_id,request_body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "consumer_consent_resource_identification" : "CC0001"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

