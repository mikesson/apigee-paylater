'use strict';

var utils = require('../utils/writer.js');
var ConsumerConsentStatus = require('../service/ConsumerConsentStatusService');

module.exports.paylaterConsumer_idConsumerConsentStatusPOST = function paylaterConsumer_idConsumerConsentStatusPOST (req, res, next) {
  var consumer_id = req.swagger.params['consumer_id'].value;
  var request_body = req.swagger.params['request_body'].value;
  ConsumerConsentStatus.paylaterConsumer_idConsumerConsentStatusPOST(consumer_id,request_body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
