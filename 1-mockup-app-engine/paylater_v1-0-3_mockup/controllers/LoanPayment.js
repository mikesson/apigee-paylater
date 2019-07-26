'use strict';

var utils = require('../utils/writer.js');
var LoanPayment = require('../service/LoanPaymentService');

module.exports.paylaterConsumer_idLoanPaymentPOST = function paylaterConsumer_idLoanPaymentPOST (req, res, next) {
  var consumer_id = req.swagger.params['consumer_id'].value;
  var request_body = req.swagger.params['request_body'].value;
  LoanPayment.paylaterConsumer_idLoanPaymentPOST(consumer_id,request_body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
