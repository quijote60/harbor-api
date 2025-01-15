const User = require('../models/User')
const Member = require('../models/Member')
const Contribution = require('../models/Contribution')

const bcrypt = require('bcrypt')
const Category = require('../models/Category')

// @desc Get all users
// @route GET /users
// @access Private


const getSundayContributions = async (req, res) => {
    // Get all notes from MongoDB
    //const contributions = await Contribution.find().lean()
    //var datetime = "2024-08-06"
    var query = ({"date":{"$gte":new Date(new Date().setUTCHours(0, 0, 0, 0)).toISOString()}})
    

    const contributions = await Contribution.find(query).lean()

    // If no notes 
    if (!contributions?.length) {
        return res.status(400).json({ message: 'No contributions found' })
    }

    // Add username to each note before sending the response 
    // See Promise.all with map() here: https://youtu.be/4lqJBBEpjRE 
    // You could also do this with a for...of loop
    const contributionsWithMember = await Promise.all(contributions.map(async (contribution) => {
        const member = await Member.findById(contribution.member).lean().exec()
        const category = await Category.findById(contribution.category).lean().exec()
        return { ...contribution, member_id: member.member_id, member_last_name: member.last_name, category_id : category.category_id, category_name: category.category_name }
    }))

    res.json(contributionsWithMember)
}
const getSearchContributions = async (req,res) => {
    const { id, member, category, date, notes, amount } = req.body
    const records = await Contribution.findOne({ member, category, amount ,date,amount}).lean().exec()

    const recordsWithMember = await Promise.all(records.map(async (record) => {
        const member = await Member.findById(record.member).lean().exec()
        const category = await Category.findById(record.category).lean().exec()
        return { ...record, member_id: member.member_id, member_last_name: member.last_name, category_id : category.category_id, category_name: category.category_name }
    }))

    res.json(recordsWithMember)
}

// @desc Create new note
// @route POST /notes
// @access Private

// @desc Update a note
// @route PATCH /notes
// @access Private

// @desc Delete a user
// @route DELETE /users
// @access Private

module.exports = {
   
    getSundayContributions,
    getSearchContributions
    
}