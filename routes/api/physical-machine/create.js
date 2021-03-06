var express = require('express');
var router = express.Router();
const {header, body, validationResult} = require('express-validator/check');
const {PhysicalMachine, MachineStates} = require('../../models/PhysicalMachine');
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

    const {name, mac, cores, ram, memory, freeCores, freeRam, freeMemory, operatingSystem, ipAddressId} = req.body;
    await Authentication.verifyAdminToken(req.headers.auth_token);
    let errorMessage = await performChecks(mac, ipAddressId);
    if (errorMessage !== undefined) {
      return ErrorHandler.errorCustomMessage(errorMessage, res);
    }

    await changeIpStateToAssigned(ipAddressId);

    let newMachine = {
      name, mac, cores, ram, memory, freeCores, freeRam, freeMemory,
      assignedRanges: [], operatingSystem, ipAddressId
    };
    newMachine.state = MachineStates.RUNNING;
    let newPhysicalMachine = await new PhysicalMachine(newMachine).save();
    return res.json(newPhysicalMachine);
  } catch (err){
    ErrorHandler.processError(err, res)
  }
});

async function changeIpStateToAssigned(ipId) {
  await IpAddress.updateOne({ '_id': ipId}, { state: IpStates.ASSIGNED });
}

async function performChecks(mac, ipAddressId) {
  if ( (await PhysicalMachine.findOne({mac})) != null){
    return 'The machine already exists.';
  }
  let ipAddress = await IpAddress.findById(ipAddressId);
  if (ipAddress == null){
    return 'The ip address does not exist';
  }
  if (ipAddress.state == IpStates.ASSIGNED){
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
