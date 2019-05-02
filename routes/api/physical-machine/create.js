var express = require('express');
var router = express.Router();
var admin = require("firebase-admin");
const {header, body, validationResult} = require('express-validator/check');
var firebase = require('firebase');
const {PhysicalMachine, MachineStatus} = require('../../models/PhysicalMachine');
const Authentication = require('../../helpers/authentication');
const ErrorHandler = require('../../helpers/error-handler');

router.post('/', validateInput(), (req, res) => {
  //Verify all required params are present
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return ErrorHandler.processBadRequestError(errors, res);
  }

  Authentication.verifyAdminToken(req.headers.auth_token)
    .then(response => {
      const {name, mac, cores, memory, freeRam, freeMemory, operatingSystem, ipAddressId} = req.body;
      let newMachine = {name, mac, cores, memory, freeRam, freeMemory, operatingSystem, ipAddressId};
      newMachine.status = MachineStatus.RUNNING;
      console.log('File: create.js, Line 22', newMachine);
      let physicalMachine = new PhysicalMachine(newMachine);
      return physicalMachine.save()
    })
    .then(response => res.json(response))
    .catch(err => ErrorHandler.processError(err, res));

});

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
