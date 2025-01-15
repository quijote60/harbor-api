const express = require('express')
const router = express.Router()
const contributionsController = require('../controllers/contributionsController')
//const contributionsController = require('../controllers/contributionsControl')
const verifyJWT = require('../middleware/verifyJWT')

//router.use(verifyJWT)

router.route('/')
    .get(contributionsController.getAllContributions)
    .post(contributionsController.createNewContribution)
    .patch(contributionsController.updateContribution)
    .delete(contributionsController.deleteContribution)


router.get('/by-month-year', contributionsController.getAllContributionsByMonthYear);

module.exports = router