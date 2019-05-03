const express = require('express');
const router = express.Router();
const ErrorHandler = require('../../helpers/error-handler');
const portusRest = require('../../helpers/axios-helper').portusInstance();
var admin = require("firebase-admin");

router.use('/signup', require('./signup'));
router.use('/login', require('./login'));

router.get('/deleteAll', (req, res) => {
  admin.auth().listUsers(1000)
    .then((listUsersResult) => {
      listUsersResult.users.forEach((userRecord) => {
        admin.auth().deleteUser(userRecord.uid)
      });
      return portusRest.get('api/v1/users')
    })
    .then(r => {
      r.data.forEach((user) => {
        console.log('File: index.js, Line 20', user);
        if (!user.admin)
          portusRest.delete('api/v1/users/'+user.id)
      });
      res.json('done');
    })
    .catch(function(error) {
      ErrorHandler.processError(error, res);
    });
});

module.exports = router;