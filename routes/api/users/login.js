var express = require('express');
var router = express.Router();
const {body, validationResult} = require('express-validator/check');
var firebase = require('firebase');
const ErrorHandler = require('../../helpers/error-handler');

router.post('/', validateInput(), (req, res) => {
  //Verify all required params are present
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return ErrorHandler.processBadRequestError(errors, res);
  }

  const {email, password} = req.body;
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then( response => {
      let loggingUser = response.user;
      return createUserToken()
    }).then( token => {
      res.send(token);
      firebase.auth().signOut();
    }).catch((error) => {
      ErrorHandler.processError(error, res);
  } );
});

function createUserToken() {
  return new Promise((resolve, reject) => {
    firebase.auth().currentUser.getIdToken(true)
      .then((customToken) => { resolve(customToken) })
      .catch((error) => reject(error) );
  });
}

function validateInput() {
  return [
    body('email').isEmail(),
    body('password').isString()
  ]
}

module.exports = router;
