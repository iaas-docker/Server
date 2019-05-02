const express = require('express');
const router = express.Router();

router.use('/create', require('./create'));

module.exports = router;