var express = require('express');
var router = express.Router();
var admin = require("firebase-admin");
const {body, validationResult} = require('express-validator/check');
var firebase = require('firebase');

router.post('/', validateInput(), (req, res) => {
  //Verify all required params are present
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }

  let email = req.body.email;
  let password = req.body.password;
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then( response => {
      let newUser = response.user;
      return createUserToken(newUser.uid)
    }).then( token => {
      res.send(token);
      firebase.auth().signOut();
    }).catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      res.status(500);
      res.json({error: errorCode+": "+errorMessage})
  } );
});

function createUserToken(userId) {
  return new Promise((resolve, reject) => {
    admin.auth().createCustomToken(userId)
      .then((customToken) => { resolve(customToken) })
      .catch((error) => reject(error) );
  });
}

function validateInput() {
  return [
    body('email').isEmail(),
    body('password').exists()
  ]
}

module.exports = router;
