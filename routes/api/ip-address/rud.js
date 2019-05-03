var express = require('express');
var router = express.Router();
const {IpAddress, IpStatus} = require('../../models/IpAddress');
const ErrorHandler = require('../../helpers/error-handler');
const Authentication = require('../../helpers/authentication');

router.get('/list', (req, res) => {
  Authentication.verifyAdminToken(req.headers.auth_token)
    .then((r) => IpAddress.find())
    .then(response => {
      res.json(response);
    })
    .catch(err => ErrorHandler.processError(err, res));
});

module.exports = router;
