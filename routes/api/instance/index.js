const express = require('express');
const router = express.Router();

router.use('/create-group', require('./create-group'));
router.use('/', require('./delete'));
router.use('/', require('./restart'));
router.use('/', require('./stop'));
router.use('/', require('./resume'));
router.use('/', require('./rud'));

module.exports = router;