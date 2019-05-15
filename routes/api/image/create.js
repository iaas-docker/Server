var express = require('express');
var router = express.Router();
const {header, body, validationResult} = require('express-validator/check');
const {Image, TYPE} = require('../../models/Image');
const {DockerImage} = require('../../models/DockerImage');
const Authentication = require('../../helpers/authentication');
const ErrorHandler = require('../../helpers/error-handler');

router.post('/docker', validateInput(), async (req, res) => {
  //Verify all required params are present

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ErrorHandler.processBadRequestError(errors, res);
    }

    const {name, operatingSystem: operatingSystem, dockerImageId, tag} = req.body;
    let newImage = {type: TYPE.DOCKER};
    let newDockerImage = {dockerImageId, tag, operatingSystem, name};

    let auth = await Authentication.verifyAdminToken(req.headers.auth_token)
    let dockerImage = await DockerImage.findOne({ tag });
    if (dockerImage != null) {
      return ErrorHandler.errorCustomMessage('The docker image already exists.', res);
    }

    let newDockerImageObj = await new DockerImage(newDockerImage).save();

    newImage.backedById = newDockerImageObj._id;
    let newImageObj = await new Image(newImage).save();
    return res.json(newImageObj);
  } catch (err){
    ErrorHandler.processError(err, res);
  }

  // const {name, operatingSystem: operatingSystem, dockerImageId, tag} = req.body;
  // let newImage = {type: TYPE.DOCKER};
  // let newDockerImage = {dockerImageId, tag, operatingSystem, name};
  //
  // Authentication.verifyAdminToken(req.headers.auth_token)
  //   .then((r) => DockerImage.findOne({ tag }))
  //   .then(response => {
  //     if (response != null) {
  //       return ErrorHandler.errorCustomMessage('The docker image already exists.', res);
  //     }
  //     return new DockerImage(newDockerImage).save();
  //   }).then(response => {
  //     newImage.backedById = response['_id'];
  //     return new Image(newImage).save();
  //   })
  //   .then(response => res.json(response))
  //   .catch(err => ErrorHandler.processError(err, res));

});

function validateInput() {
  return [
    body('name').isString(),
    body('operatingSystem').isString(),
    body('tag').isString(),
    body('dockerImageId').isString(),
    header('auth_token').exists()
  ]
}

module.exports = router;
