const express = require('express');
const router = express.Router();

router.use('/create-group', require('./create-group'));
router.use('/', require('./rud'));

module.exports = router;