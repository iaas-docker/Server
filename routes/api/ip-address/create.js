var express = require('express');
var router = express.Router();
const {header, body, validationResult} = require('express-validator/check');
const {IpAddress, IpStatus} = require('../../models/IpAddress');
const Authentication = require('../../helpers/authentication');
const ErrorHandler = require('../../helpers/error-handler');

router.post('/', validateInput(), (req, res) => {
  //Verify all required params are present
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return ErrorHandler.processBadRequestError(errors, res);
  }

  const {ip, mask, gateway} = req.body;
  Authentication.verifyAdminToken(req.headers.auth_token)
    .then((r) => IpAddress.findOne({ ip, mask, gateway }))
    .then(response => {
      if (response != null){
        return ErrorHandler.errorCustomMessage('The ip address exists.', res);
      }

      let newIp = {ip, mask, gateway};
      newIp.status = IpStatus.UN_ASSIGNED;
      return new IpAddress(newIp).save();
    })
    .then(response => res.json(response))
    .catch(err => ErrorHandler.processError(err, res));

});

function validateInput() {
  return [
    body('ip').isIP(4),
    body('mask').isIP(4),
    body('gateway').isIP(4),
    header('auth_token').exists()
  ]
}

module.exports = router;
