var express = require('express');
var router = express.Router();
const {header, body, validationResult} = require('express-validator/check');
const {Image} = require('../../models/Image');
const {DockerImage, TYPE} = require('../../models/DockerImage');
const Authentication = require('../../helpers/authentication');
const ErrorHandler = require('../../helpers/error-handler');

router.post('/docker', validateInput(), (req, res) => {
  //Verify all required params are present
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return ErrorHandler.processBadRequestError(errors, res);
  }

  const {name, opertingSystem, registryId} = req.body;
  let newImage = {type: TYPE.DOCKER};
  let newDockerImage = {registryId, opertingSystem, name};

  Authentication.verifyAdminToken(req.headers.auth_token)
    .then((r) => DockerImage.findOne({ registryId }))
    .then(response => {
      if (response != null) {
        return ErrorHandler.errorCustomMessage('The docker image already exists.', res);
      }
      return new DockerImage(newDockerImage).save();
    }).then(response => {
      newImage.backedById = response['_id'];
      return new Image(newImage).save();
    })
    .then(response => res.json(response))
    .catch(err => ErrorHandler.processError(err, res));

});

function validateInput() {
  return [
    body('name').isString(),
    body('operatingSystem').isString(),
    body('registryId').isString(),
    header('auth_token').exists()
  ]
}

module.exports = router;
