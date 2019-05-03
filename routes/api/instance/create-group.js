var express = require('express');
var router = express.Router();
const {header, body, validationResult} = require('express-validator/check');
const {InstanceGroup} = require('../../models/InstanceGroup');
const {Instance, InstanceStatus} = require('../../models/Instance');
const Authentication = require('../../helpers/authentication');
const ErrorHandler = require('../../helpers/error-handler');

router.post('/', validateInput(), (req, res) => {
  //Verify all required params are present
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return ErrorHandler.processBadRequestError(errors, res);
  }

  //Todo: Add user id to instance based on token
  //Todo: Add base image to instance
  const {name, instances} = req.body;
  let userId, instanceGroup;
  Authentication.verifyUserToken(req.headers.auth_token)
    .then((user) => {
      userId = user['_id'];
      instanceGroup = {name, userId}
      let instanceGroupDB = new InstanceGroup(instanceGroup);
      return instanceGroupDB.save()
    })
    .then(async response => {
      let list = [];
      for (const instance of instances) {
        const {name, cores, memory, storage, imageId } = instance;
        let newInstance = {name, cores, memory, storage, imageId, userId: userId,
          instanceGroupId: response['_id'], baseImageId: imageId,
          status: InstanceStatus.CREATING
        };
        let r = await (new Instance(newInstance)).save();
        list.push(r);
        console.log('File: create-group.js, Line 35', r);
      };
      res.json(list)
    })
    .then(response => res.json(response))
    .catch(err => ErrorHandler.processError(err, res));

});

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
