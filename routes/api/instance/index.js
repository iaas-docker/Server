const express = require('express');
const router = express.Router();

router.use('/create-group', require('./create-group'));

module.exports = router;