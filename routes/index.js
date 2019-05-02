const express = require('express');
const router = express.Router();
const API_VERSION = 'v1';

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/api/'+API_VERSION, require('./api'));

module.exports = router;
