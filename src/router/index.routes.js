const router = require("express").Router();
const { showProfile, getProfileByApi } = require('../controller/instagramProfile')

router.post('/login', showProfile)

module.exports = router
