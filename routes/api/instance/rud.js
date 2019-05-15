var express = require('express');
var router = express.Router();
const {InstanceGroup} = require('../../models/InstanceGroup');
const {Instance} = require('../../models/Instance');
const {IpAddress} = require('../../models/IpAddress');
const {PhysicalMachine} = require('../../models/PhysicalMachine');
const ErrorHandler = require('../../helpers/error-handler');
const Authentication = require('../../helpers/authentication');

router.get('/list', (req, res) => {
  Authentication.verifyUserToken(req.headers.auth_token)
    .then((user) => Instance.find({userId: user['_id']}).lean())
    .then(async instances => {
      let groups = {};
      for (let i=0; i<instances.length; i++) {
        let inst = instances[i];
        if (groups[inst.instanceGroupId] == null) {
          groups[inst.instanceGroupId] = await InstanceGroup.findById(inst.instanceGroupId).lean();
          groups[inst.instanceGroupId].instances = [];
        }

        inst = await formatInstance(inst);
        groups[inst.instanceGroupId].instances.push(inst);
      }

      let result = { instance_groups: [] };
      Object.keys(groups).forEach(group => result.instance_groups.push(groups[group]));
      res.json(result);
    })
    .catch(err => ErrorHandler.processError(err, res));
});

router.get('/:id', (req, res) => {
  Authentication.verifyUserToken(req.headers.auth_token)
    .then((user) => Instance.findOne({_id: req.params.id, userId: user._id}).lean())
    .then(async inst => {
      if (inst == null){
        return ErrorHandler.errorCustomMessage("Instance not found or doesn't belong to user", res);
      }
      inst = await formatInstance(inst);
      res.json(inst);
    })
    .catch(err => ErrorHandler.processError(err, res));
});

async function formatInstance(inst){
  if (inst.portRangeStart) {
    inst.assignedPortRange = inst.portRangeStart + ' - ' + (inst.portRangeStart + 100);
    delete inst.portRangeStart;
  }

  let physicalMachine = await PhysicalMachine.findById(inst.physicalMachineId).lean();
  inst.physicalMachine = physicalMachine;
  delete inst.physicalMachineId;

  if (physicalMachine) {
    inst.ipAddress = await IpAddress.findById(physicalMachine.ipAddressId).lean();
  }
  delete inst.ipAddressId;
  return inst;
}

module.exports = router;
