const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const memberSchema = new mongoose.Schema(
    {
        member_id: {
            type: Number,
            required: [true, "Member_id is required"]
            
        },
        first_name: {
            type: String,
            required: false
        },
        last_name: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: false
        },
        city: {
            type: String,
            required: false
        },
        state: {
            type: String,
            required: false
        },
        zip_code: {
            type: String,
            required: false
        },
        email: {
            type: String,
            required: false
        },
        completed: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
)




module.exports = mongoose.model('Member', memberSchema)