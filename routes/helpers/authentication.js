var admin = require("firebase-admin");
const User = require('../models/Users');

class Authentication {

  static verifyAdminToken(idToken){
    return new Promise((resolve, reject) => {
      admin.auth().verifyIdToken(idToken)
        .then((decodedToken) => {
          return User.findById(decodedToken.uid)
        }).then( user => {
          if (user.admin)
            resolve(user.admin);
          else
            reject('User is not an admin');
        }).catch((error) => reject(error));
    });
  }

}

module.exports = Authentication;
