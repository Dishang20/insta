const router = require("express").Router();
const { showProfile } = require('../controller/instagramProfile')

router.post('/login', showProfile)

module.exports = router