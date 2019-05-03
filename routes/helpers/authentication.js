var admin = require("firebase-admin");
const User = require('../models/Users');

class Authentication {

  static verifyAdminToken(idToken){
    return this.verifyUserToken(idToken, true);
  }

  static verifyUserToken(idToken, isAdmin){
    return new Promise((resolve, reject) => {
      admin.auth().verifyIdToken(idToken)
        .then((decodedToken) => {
          return User.findById(decodedToken.uid)
        })
        .then( user => {
          if (user && ( (isAdmin && user.admin ) || !isAdmin) )
            resolve(user);
          else
            reject('User is not an admin');
        })
        .catch((error) => reject(error));
    });
  }

}

module.exports = Authentication;
