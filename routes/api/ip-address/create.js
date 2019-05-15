var express = require('express');
var router = express.Router();
const {header, body, validationResult} = require('express-validator/check');
const {IpAddress, IpStates} = require('../../models/IpAddress');
const Authentication = require('../../helpers/authentication');
const ErrorHandler = require('../../helpers/error-handler');

router.post('/', validateInput(), async (req, res) => {
  //Verify all required params are present
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ErrorHandler.processBadRequestError(errors, res);
    }

    const {ip, mask, gateway} = req.body;

    let auth = await Authentication.verifyAdminToken(req.headers.auth_token)
    let ipAddress = await IpAddress.findOne({ip, mask, gateway});
    if (ipAddress != null) {
      return ErrorHandler.errorCustomMessage('The ip address already exists.', res);
    }

    let newIp = {ip, mask, gateway};
    newIp.state = IpStates.UN_ASSIGNED;
    let newIpAddress = await IpAddress(newIp).save();
    return res.json(newIpAddress);
  } catch (err){
    ErrorHandler.processError(err, res);
  }

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
