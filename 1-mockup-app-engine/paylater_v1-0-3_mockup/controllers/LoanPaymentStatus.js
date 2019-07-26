'use strict';

var utils = require('../utils/writer.js');
var LoanPaymentStatus = require('../service/LoanPaymentStatusService');

module.exports.paylaterConsumer_idLoanPaymentStatusPOST = function paylaterConsumer_idLoanPaymentStatusPOST (req, res, next) {
  var consumer_id = req.swagger.params['consumer_id'].value;
  var request_body = req.swagger.params['request_body'].value;
  LoanPaymentStatus.paylaterConsumer_idLoanPaymentStatusPOST(consumer_id,request_body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
