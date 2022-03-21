const router = require("express").Router();
const { showProfile, getAuthCode } = require('../controller/instagramProfile')

router.get('/login', getAuthCode)
router.get('/', showProfile)

module.exports = router