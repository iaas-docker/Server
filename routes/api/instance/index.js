const express = require('express');
const router = express.Router();

router.use('/create', require('./create'));
router.use('/create-group', require('./create-group'));

module.exports = router;