const User = require('../models/User')
const Member = require('../models/Member')
const Contribution = require('../models/Contribution')

const bcrypt = require('bcrypt')
const Category = require('../models/Category')

// @desc Get all users
// @route GET /users
// @access Private

const getAllContributions = async (req, res) => {
    // Get all users from MongoDB
    const contributions = await Contribution.find().lean().exec()

    // If no users 
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

    const getAllContributionsByMonthYear = async (req, res) => {
        // Get all contributions from MongoDB
        const contributions = await Contribution.find().lean().exec();
    
        // Group contributions by month and year, and calculate the sum of amounts
        const contributionsByMonthYear = contributions.reduce((acc, contribution) => {
            const date = new Date(contribution.date);
            const monthYear = `${date.toLocaleString('default', { month: 'long' })}-${date.getFullYear()}`;
    
            if (!acc[monthYear]) {
                acc[monthYear] = {
                    monthYear,
                    sumOfAmount: 0
                };
            }
    
            acc[monthYear].sumOfAmount += contribution.amount;
            return acc;
        }, {});
    
        // Convert the object to an array and sort by monthYear
        const contributionsArray = Object.values(contributionsByMonthYear).sort((a, b) => {
            const [monthA, yearA] = a.monthYear.split('-');
            const [monthB, yearB] = b.monthYear.split('-');
            const monthIndex = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            return (yearA - yearB) || (monthIndex.indexOf(monthA) - monthIndex.indexOf(monthB));
        });
    
        res.json(contributionsArray);
    };




// @desc Create new note
// @route POST /notes
// @access Private
const createNewContribution = async (req, res) => {
    const { member, category, date, notes, amount  } = req.body

    // Confirm data
    if (!member || !category || !date || !amount) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate title
    //const duplicate = await Contribution.findOne({ member, category, amount ,date}).lean().exec()

    //if (duplicate) {
      //  return res.status(409).json({ message: 'Duplicate contribution' })
    //}

    // Create and store the new user 
    const contribution = await Contribution.create({ member, category, date, notes, amount })

    if (contribution) { // Created 
        return res.status(201).json({ message: 'New contribution created' })
    } else {
        return res.status(400).json({ message: 'Invalid contribution data received' })
    }

}
// @desc Update a note
// @route PATCH /notes
// @access Private
const updateContribution = async (req, res) => {
    const { id, member, category, date, notes, amount } = req.body

    // Confirm data - remove notes from required fields check
    if (!id || !member || !category || !date || !amount) {
        return res.status(400).json({ message: 'All required fields must be filled' })
    }

    // Confirm contribution exists to update
    const contribution = await Contribution.findById(id).exec()

    if (!contribution) {
        return res.status(400).json({ message: 'Contribution not found' })
    }

    // Check for duplicate title
    //const duplicate = await Contribution.findOne({ member, category, amount }).lean().exec()

    // Allow renaming of the original contribution
    //if (duplicate && duplicate?._id.toString() !== id) {
       // return res.status(409).json({ message: 'Duplicate contribution' })
   //}

    contribution.member = member
    contribution.category = category
    contribution.date = date
    contribution.notes = notes || null  // Allow null/empty values
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
    getAllContributions,
    getAllContributionsByMonthYear,  // added this function for the new route
    createNewContribution,
    updateContribution,
    deleteContribution
}