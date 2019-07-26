'use strict';

var utils = require('../utils/writer.js');
var LoanOffer = require('../service/LoanOfferService');

module.exports.paylaterConsumer_idLoanOfferPOST = function paylaterConsumer_idLoanOfferPOST (req, res, next) {
  var consumer_id = req.swagger.params['consumer_id'].value;
  var request_body = req.swagger.params['request_body'].value;
  LoanOffer.paylaterConsumer_idLoanOfferPOST(consumer_id,request_body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
