const mongoose = require('mongoose')

const AutoIncrement = require('mongoose-sequence')(mongoose)

const contributionSchema = new mongoose.Schema(
    {
        member: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Member'
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Category'
        },
        date: {
            type: Date,
            required: true
            
        },
        notes: {
            type: String,
            required: false,
            default: null
        },
        amount: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
)




module.exports = mongoose.model('Contribution', contributionSchema)