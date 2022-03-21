const router = require("express").Router();
const { showProfile, getAuthCode } = require('../controller/instagramProfile')

router.post('/login', getAuthCode)
router.get('/', showProfile)

module.exports = router