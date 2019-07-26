'use strict';

var utils = require('../utils/writer.js');
var ConsumerConsent = require('../service/ConsumerConsentService');

module.exports.paylaterConsumer_idConsumerConsentPOST = function paylaterConsumer_idConsumerConsentPOST (req, res, next) {
  var consumer_id = req.swagger.params['consumer_id'].value;
  var request_body = req.swagger.params['request_body'].value;
  ConsumerConsent.paylaterConsumer_idConsumerConsentPOST(consumer_id,request_body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
