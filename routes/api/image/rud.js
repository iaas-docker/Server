var express = require('express');
var router = express.Router();
const {Image} = require('../../models/Image');
const {DockerImage} = require('../../models/DockerImage');
const ErrorHandler = require('../../helpers/error-handler');
const Authentication = require('../../helpers/authentication');

router.get('/list', (req, res) => {
  Authentication.verifyAdminToken(req.headers.auth_token)
    .then((r) => Image.find().lean())
    .then(async response => {
      for (let i=0; i<response.length; i++)
        response[i].backedBy = await DockerImage.findById(response[i].backedById).lean();
      res.json(response);
    })
    .catch(err => ErrorHandler.processError(err, res));
});

module.exports = router;
