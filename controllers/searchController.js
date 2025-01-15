const User = require('../models/User')
const Member = require('../models/Member')
const Contribution = require('../models/Contribution')

const bcrypt = require('bcrypt')
const Category = require('../models/Category')

// @desc Get all users
// @route GET /users
// @access Private

const getSearchContributions = async (req,res) => {
    const { id, member, category, date, notes, amount } = req.body
    const contributions = await Contribution.findOne({ member, category, amount ,date,amount}).lean().exec()

    const contributionsWithMember = await Promise.all(contributions.map(async (record) => {
        const member = await Member.findById(record.member).lean().exec()
        const category = await Category.findById(record.category).lean().exec()
        return { ...record, member_id: member.member_id, member_last_name: member.last_name, category_id : category.category_id, category_name: category.category_name }
    }))

    res.json(contributionsWithMember)
}

// @desc Create new note
// @route POST /notes
// @access Private

// @desc Update a note
// @route PATCH /notes
// @access Private
const updateContribution = async (req, res) => {
    const { id, member, category, date, notes, amount } = req.body

    // Confirm data
    if (!id || !member || !category || !date || !notes || !amount) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Confirm note exists to update
    const contribution = await Contribution.findById(id).exec()

    if (!contribution) {
        return res.status(400).json({ message: 'Contribution not found' })
    }

    // Check for duplicate title
    const duplicate = await Contribution.findOne({ member, category, amount }).lean().exec()

    // Allow renaming of the original note 
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate contribution' })
    }

    contribution.member = member
    contribution.category = category
    contribution.date = date
    contribution.notes = notes
    contribution.amount = amount

    const updatedContribution = await contribution.save()

    res.json(`'${updatedContribution.member} ${updatedContribution.category} ${updatedContribution.amount}' updated`)
}
// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteContribution = async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Contribution ID required' })
    }

    // Confirm note exists to delete 
    const contributions = await Contribution.findById(id).exec()

    if (!contributions) {
        return res.status(400).json({ message: 'Contribution not found' })
    }
    
    //console.log(contributionsWithMember)

    //const contributions = await Contribution.find().lean()

    

    const result = await contributions.deleteOne();
    //const result = await contributionsWithMember.findByIdAndDelete(id)

    const reply = `Contribution with ID ${result._id} deleted`

    res.json(reply)
}

module.exports = {
    getSearchContributions,
    
    
    updateContribution,
    deleteContribution
}