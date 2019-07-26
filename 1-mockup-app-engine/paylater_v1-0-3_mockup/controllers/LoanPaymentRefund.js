'use strict';

var utils = require('../utils/writer.js');
var LoanPaymentRefund = require('../service/LoanPaymentRefundService');

module.exports.paylaterConsumer_idLoanPaymentRefundPOST = function paylaterConsumer_idLoanPaymentRefundPOST (req, res, next) {
  var consumer_id = req.swagger.params['consumer_id'].value;
  var request_body = req.swagger.params['request_body'].value;
  LoanPaymentRefund.paylaterConsumer_idLoanPaymentRefundPOST(consumer_id,request_body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
