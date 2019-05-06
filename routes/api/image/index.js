const express = require('express');
const router = express.Router();

router.use('/create', require('./create'));
router.use('/', require('./rud'));

module.exports = router;