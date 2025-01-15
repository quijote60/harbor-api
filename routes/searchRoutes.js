const express = require('express')
const router = express.Router()
const searchController = require('../controllers/searchController')
const verifyJWT = require('../middleware/verifyJWT')

//router.use(verifyJWT)

router.route('/')
    .get(searchController.getSearchContributions)
    
    .patch(searchController.updateContribution)
    .delete(searchController.deleteContribution)

module.exports = router