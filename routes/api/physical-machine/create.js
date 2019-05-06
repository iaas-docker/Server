var express = require('express');
var router = express.Router();
const {header, body, validationResult} = require('express-validator/check');
const {PhysicalMachine, MachineStatus} = require('../../models/PhysicalMachine');
const {IpAddress, IpStatus} = require('../../models/IpAddress');
const Authentication = require('../../helpers/authentication');
const ErrorHandler = require('../../helpers/error-handler');

router.post('/', validateInput(), (req, res) => {
  //Verify all required params are present
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return ErrorHandler.processBadRequestError(errors, res);
  }
  
  const {name, mac, cores, memory, freeRam, freeMemory, operatingSystem, ipAddressId} = req.body;
  Authentication.verifyAdminToken(req.headers.auth_token)
    .then(async response => {
      let errorMessage = await performChecks(mac, ipAddressId);
      if (errorMessage !== undefined ){
        return ErrorHandler.errorCustomMessage(errorMessage, res);
      }

      await changeIpStatus(ipAddressId);

      let newMachine = {name, mac, cores, memory, freeRam, freeMemory, operatingSystem, ipAddressId, '_id': mac};
      newMachine.status = MachineStatus.RUNNING;
      return new PhysicalMachine(newMachine).save();
    })
    .then(response => res.json(response))
    .catch(err => ErrorHandler.processError(err, res));

});

async function changeIpStatus(ipId) {
  await IpAddress.updateOne({ '_id': ipId}, { status: IpStatus.ASSIGNED });
}

async function performChecks(mac, ipAddressId) {
  if ( (await PhysicalMachine.findById(mac)) != null){
    return 'The machine already exists.';
  }
  let ipAddress= await IpAddress.findById(ipAddressId);
  if (ipAddressId == null){
    return 'The ip address does not exist';
  }
  if (ipAddress.status == IpStatus.ASSIGNED){
    return 'The ip address is already assigned';
  }
  if ( (await PhysicalMachine.findOne({ipAddressId: ipAddressId})) != null){
    return 'There is already a machine with that ip address';
  }
  return undefined;
}

function validateInput() {
  return [
    body('name').isString(),
    body('mac').isMACAddress(),
    body('cores').isNumeric(),
    body('ram').isNumeric(),
    body('memory').isNumeric(),
    body('freeCores').isNumeric(),
    body('freeRam').isNumeric(),
    body('freeMemory').isNumeric(),
    body('operatingSystem').isString(),
    body('ipAddressId').isString(),
    header('auth_token').exists()
  ]
}

module.exports = router;
