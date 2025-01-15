
const Member = require('../models/Member')
const Contribution = require('../models/Contribution')


// @desc Get all users
// @route GET /users
// @access Private
const getAllMembers = async (req, res) => {
    // Get all users from MongoDB
    const members = await Member.find().lean()

    const members2 = await Member.find()

    // If no users 
    if (!members?.length) {
        return res.status(400).json({ message: 'No members found' })
    }

    res.json(members)
}

// @desc Create new user
// @route POST /users
// @access Private
const createNewMember = async (req, res) => {
    const { member_id, first_name, last_name, address, city, state, zip_code, email  } = req.body

    // Confirm data
    if (!member_id || !last_name ) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate username
    const duplicate = await Member.findOne({ member_id }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate member' })
    }

    

    const memberObject = { member_id, first_name, last_name, address, city, state, zip_code,email }

    // Create and store new user 
    const member = await Member.create(memberObject)

    if (member) { //created 
        res.status(201).json({ message: `New member ${member_id} ${last_name} created` })
    } else {
        res.status(400).json({ message: 'Invalid user data received' })
    }
}

// @desc Update a user
// @route PATCH /users
// @access Private
const updateMember = async (req, res) => {
    const { id, member_id, first_name, last_name, address, city, state, zip_code, email  } = req.body

    // Confirm data 
    if (!id || !member_id ) {
        return res.status(400).json({ message: 'All fields except password are required' })
    }

    // Does the user exist to update?
    const member = await Member.findById(id).exec()

    if (!member) {
        return res.status(400).json({ message: 'Member not found' })
    }

    // Check for duplicate 
    const duplicate = await Member.findOne({ member_id }).lean().exec()

    // Allow updates to the original user 
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate Member' })
    }

    member.member_id = member_id
    member.first_name = first_name
    member.last_name = last_name
    member.address = address
    member.city = city
    member.state = state
    member.zip_code = zip_code
    member.email = email

    

    const updatedMember = await member.save()

    res.json({ message: `${updatedMember.member_id} ${updatedMember.last_name} updated` })
}

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteMember = async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Member ID Required' })
    }

    // Does the member still has contributions?
   const contribution = await Contribution.findOne({ member: id }).lean().exec()
       if (contribution) {
           return res.status(400).json({ message: 'Member has contributions' })
       }

    // Does the user exist to delete?
    const member = await Member.findById(id).exec()

    if (!member) {
        return res.status(400).json({ message: 'Member not found' })
    }

    const result = await member.deleteOne();
    const reply = `Member ${result.member_id} with ID ${result._id} deleted`
    //console.log(reply)
    //const reply = result.member_id

    res.json(reply)
}

module.exports = {
    getAllMembers,
    createNewMember,
    updateMember,
    deleteMember
}