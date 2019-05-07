var express = require('express');
var router = express.Router();
const {InstanceGroup} = require('../../models/InstanceGroup');
const {Instance} = require('../../models/Instance');
const ErrorHandler = require('../../helpers/error-handler');
const Authentication = require('../../helpers/authentication');

router.get('/list', (req, res) => {
  Authentication.verifyUserToken(req.headers.auth_token)
    .then((user) => Instance.find({userId: user['_id']}).lean())
    .then(async instances => {
      let result = { instance_groups: [] };
      let groups = {};
      for (let i=0; i<instances.length; i++) {
        let instance = instances[i]
        if (groups[instance.instanceGroupId] == null) {
          groups[instance.instanceGroupId] = await InstanceGroup.findById(instance.instanceGroupId).lean();
          groups[instance.instanceGroupId].instances = [];
        }
        groups[instance.instanceGroupId].instances.push(instance);
      }
      Object.keys(groups).forEach(group => result.instance_groups.push(groups[group]));
      res.json(result);
    })
    .catch(err => ErrorHandler.processError(err, res));
});
module.exports = router;
