const express = require('express');
const router = express.Router();
const sounds = require('./routes/sounds.js');

router.get('/sounds', sounds.getList);
router.get('/soundFile/:id', sounds.getSoundFile);
router.post('/playRemoteSound', sounds.playRemoteSound);
router.post('/stopRemoteSound', sounds.stopRemoteSound);
router.post('/changeRemoteVolume', sounds.changeRemoteVolume);

module.exports = router;
