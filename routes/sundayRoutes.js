const express = require('express')
const router = express.Router()
const sundayController = require('../controllers/sundayController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/')
    .get(sundayController.getSearchContributions),

    

module.exports = router