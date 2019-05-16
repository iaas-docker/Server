var express = require('express');
var router = express.Router();
const {header, body, validationResult} = require('express-validator/check');
const {InstanceGroup} = require('../../models/InstanceGroup');
const {Instance, InstanceStates} = require('../../models/Instance');
const {Image} = require('../../models/Image');
const Authentication = require('../../helpers/authentication');
const ErrorHandler = require('../../helpers/error-handler');
const queue = require('../../helpers/queue.js');
const WORKER = 'worker';

router.post('/', validateInput(), async (req, res) => {

  try {
    //Verify all required params are present
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ErrorHandler.processBadRequestError(errors, res);
    }

    const {name, instances} = req.body;
    let userId, instanceGroup;
    let imageValidation = await validateImageIds(instances)
    if (imageValidation != undefined) {
      return ErrorHandler.errorCustomMessage('The image '+ imageValidation+' does not exist', res);
    }
    let user = await Authentication.verifyUserToken(req.headers.auth_token);
    userId = user._id;
    instanceGroup = {name, userId};
    let newInstanceGroup = await new InstanceGroup(instanceGroup).save();

    let list = [];
    for (const instance of instances) {
      const {name, cores, ram, memory, imageId} = instance;
      let newInstance = {
        name, cores, ram, memory, imageId, userId: userId,
        instanceGroupId: newInstanceGroup['_id'], baseImageId: imageId,
        state: InstanceStates.CREATING, stateMessage: 'Allocating resources'
      };
      let createdInst = await (new Instance(newInstance)).save();
      await queue.sendMessage(createdInst, WORKER);
      list.push(createdInst);
    }

    res.json({
      '_id': newInstanceGroup['_id'],
      name: newInstanceGroup.name,
      instances: list
    });
  } catch (err){
    ErrorHandler.processError(err, res)
  }

});

async function validateImageIds(instances){
  for (const instance of instances) {
    let img = await Image.findById(instance.imageId);
    if (img == null){
      return instance.imageId;
    }
  }
  return;
}

function validateInput() {
  return [
    body('name').isString(),
    body('instances').isArray(),
    body('instances.*.name').isString(),
    body('instances.*.cores').isNumeric(),
    body('instances.*.ram').isNumeric(),
    body('instances.*.memory').isNumeric(),
    body('instances.*.imageId').isString(),
    header('auth_token').exists()
  ]
}

module.exports = router;
