const express = require('express');
const router = express.Router();

router.use('/users', require('./users'));
router.use('/physical-machine', require('./physical-machine'));
router.use('/ip-address', require('./ip-address'));
router.use('/instance', require('./instance'));

module.exports = router;