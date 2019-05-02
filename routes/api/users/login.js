var express = require('express');
var router = express.Router();
var admin = require("firebase-admin");
var firebase = require('firebase');

router.post('/', function(req, res, next) {
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




module.exports = router;
