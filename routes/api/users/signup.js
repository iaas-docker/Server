const express = require('express');
const router = express.Router();
const {body, validationResult} = require('express-validator/check');
const firebase = require('firebase');
const User = require('../../models/Users');
const portusRest = require('../../helpers/axios-helper').portusInstance();
const ErrorHandler = require('../../helpers/error-handler');

router.post('/', validate(), (req, res, next) => {
  //Verify all required params are present
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }

  const {email, name, password} = req.body;
  let newUser = {email, name};
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then( response => {
      newUser['_id'] = response.user.uid;
      return createPortusRequest(email, name, password);
    })
    .then( response => {
      newUser.portusId = response.data.id;
      return portusTokenRequest(newUser.portusId);
    })
    .then( response => {
      newUser.portusToken = response.data.plain_token;
      let dbUser = new User(newUser);
      return dbUser.save()
    })
    .then( response => res.json(response) )
    .catch((error) => {
      ErrorHandler.processError(error, res);
    });
});

function createPortusRequest(email, name, password) {
  return portusRest.post('api/v1/users', { user: {
      username: email,
      email: email,
      display_name: name+':'+email,
      password: password,
      bot: true
    }
  });
}

function portusTokenRequest(userId) {
  return portusRest.post('api/v1/users/'+userId+'/application_tokens', '',{
    params: {
      application: 'IaaS'
    }
  });
}

function validate() {
  return [
    body('email').isEmail(),
    body('name').exists(),
    body('password').isLength({min: 9})
  ]
}

module.exports = router;
