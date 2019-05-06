var express = require('express');
var router = express.Router();
const {header, body, validationResult} = require('express-validator/check');
const {InstanceGroup} = require('../../models/InstanceGroup');
const {Instance, InstanceStatus} = require('../../models/Instance');
const {Image} = require('../../models/Image');
const Authentication = require('../../helpers/authentication');
const ErrorHandler = require('../../helpers/error-handler');
const queue = require('../../helpers/queue.js');
const WORKER = 'worker';

router.post('/', validateInput(), (req, res) => {
  //Verify all required params are present
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return ErrorHandler.processBadRequestError(errors, res);
  }

  const {name, instances} = req.body;
  let userId, instanceGroup;
  validateImageIds(instances)
    .then((result) => {
      if (result != undefined){
        return ErrorHandler.errorCustomMessage('The image '+result+' does not exist', res);
      }
      return Authentication.verifyUserToken(req.headers.auth_token);
    })
    .then((user) => {
      userId = user['_id'];
      instanceGroup = {name, userId};
      return new InstanceGroup(instanceGroup).save();
    })
    .then(async response => {
      let list = [];
      for (const instance of instances) {
        const {name, cores, memory, storage, imageId} = instance;
        let newInstance = {name, cores, memory, storage, imageId, userId: userId,
          instanceGroupId: response['_id'], baseImageId: imageId,
          status: InstanceStatus.CREATING
        };
        let createdInst = await (new Instance(newInstance)).save();
        await queue.sendMessage(createdInst, WORKER);
        list.push(createdInst);
      }

      res.json({
        '_id':response['_id'],
        name: response.name,
        instances: list
      });
    })
    .catch(err => ErrorHandler.processError(err, res));

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
    body('instances.*.memory').isNumeric(),
    body('instances.*.storage').isNumeric(),
    body('instances.*.imageId').isString(),
    header('auth_token').exists()
  ]
}

module.exports = router;
