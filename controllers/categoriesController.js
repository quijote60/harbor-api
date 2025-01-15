const Category = require('../models/Category')
const Contribution = require('../models/Contribution')



// @desc Get all users
// @route GET /users
// @access Private
const getAllCategories = async (req, res) => {
    // Get all users from MongoDB
    const categories = await Category.find().lean()

    // If no users 
    if (!categories?.length) {
        return res.status(400).json({ message: 'No categories found' })
    }

    res.json(categories)
}

// @desc Create new user
// @route POST /users
// @access Private
const createNewCategory = async (req, res) => {
    const { category_id, category_name  } = req.body

    // Confirm data
    if (!category_id || !category_name ) {
        return res.status(400).json({ message: 'All fields are required' })
    }

   

    // Check for duplicate username
    const duplicate = await Category.findOne({ category_id }).lean().exec()

    // Check for duplicate category_name

    const duplicateName = await Category.findOne({category_name}).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate category_id' })
    }

    if (duplicateName) {
        return res.status(409).json({ message: 'Duplicate category_name' })
    }

    const categoryObject = { category_id, category_name }

    // Create and store new user 
    const category = await Category.create(categoryObject)

    if (category) { //created 
        res.status(201).json({ message: `New category ${category_id} ${category_name} created` })
    } else {
        res.status(400).json({ message: 'Invalid category data received' })
    }
}

// @desc Update a user
// @route PATCH /users
// @access Private
const updateCategory = async (req, res) => {
    const { id, category_id, category_name  } = req.body

    // Confirm data 
    if (!id || !category_id || !category_name ) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Does the user exist to update?
    const category = await Category.findById(id).exec()

    if (!category) {
        return res.status(400).json({ message: 'Category not found' })
    }

    // Check for duplicate 
    const duplicate = await Category.findOne({ category_id }).lean().exec()

    // Allow updates to the original user 
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate category' })
    }

    category.category_id = category_id
    category.category_name = category_name
    

    

    const updatedCategory = await category.save()

    res.json({ message: `${updatedCategory.category_id} ${updatedCategory.category_name} updated` })
}

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteCategory = async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Cateogry ID Required' })
    }

    // Does the category still shows in contributions?
    const contribution = await Contribution.findOne({ category: id }).lean().exec()
    if (contribution) {
        return res.status(400).json({ message: 'Category type shows in contributions' })
    }

    // Does the user exist to delete?
    const category = await Category.findById(id).exec()

    if (!category) {
        return res.status(400).json({ message: 'Category not found' })
    }

    const result = await category.deleteOne();
    const reply = `Category ${result.category_id} with ID ${result._id} deleted`
    //console.log(reply)
    //const reply = result.member_id

    res.json(reply)
}

module.exports = {
    getAllCategories,
    createNewCategory,
    updateCategory,
    deleteCategory
}