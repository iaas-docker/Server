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
          return User.findOne({firebaseId: decodedToken.uid})
        })
        .then( user => {
          if (user && ( isAdmin && user.admin ) )
            resolve(user);
          if (user && !isAdmin)
            resolve(user);
          if (user && isAdmin)
            reject('User is not an admin');
          else
            reject('Authentication failed');
        })
        .catch((error) => reject(error));
    });
  }

}

module.exports = Authentication;
