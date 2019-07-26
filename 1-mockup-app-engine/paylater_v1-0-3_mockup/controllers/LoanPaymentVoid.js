'use strict';

var utils = require('../utils/writer.js');
var LoanPaymentVoid = require('../service/LoanPaymentVoidService');

module.exports.paylaterConsumer_idLoanPaymentVoidPOST = function paylaterConsumer_idLoanPaymentVoidPOST (req, res, next) {
  var consumer_id = req.swagger.params['consumer_id'].value;
  var request_body = req.swagger.params['request_body'].value;
  LoanPaymentVoid.paylaterConsumer_idLoanPaymentVoidPOST(consumer_id,request_body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
