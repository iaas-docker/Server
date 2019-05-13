var express = require('express');
var router = express.Router();
const queue = require('../../helpers/queue.js');
const {Instance} = require('../../models/Instance');
const ErrorHandler = require('../../helpers/error-handler');
const Authentication = require('../../helpers/authentication');
const RESTART = 'RESTART';

router.post('/:id/restart', (req, res) => {
  console.log('File: rud.js, Line 34', req.params.id);
  Authentication.verifyUserToken(req.headers.auth_token)
    .then((user) => Instance.findOne({_id: req.params.id, userId: user['_id']}).lean())
    .then(async inst => {
      //Todo: verify if instance is paused
      if (inst == null){
        ErrorHandler.errorCustomMessage("Instance not found or not owned by user", res);
      }

      await queue.sendMessage(inst, RESTART, inst.physicalMachineId+'.fifo');
      res.json({result: 'processing'});
    })
    .catch(err => ErrorHandler.processError(err, res));
});

module.exports = router;
