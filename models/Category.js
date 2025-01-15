const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const categorySchema = new mongoose.Schema(
    {
        category_id: {
            type: Number,
            required: true
            
        },
        category_name : {
            type: String,
            required: true
        },
        
    },
    {
        timestamps: true
    }
)




module.exports = mongoose.model('Category', categorySchema)