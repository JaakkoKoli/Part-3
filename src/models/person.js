const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

personSchema.statics.format = (person) => {
    const formattedPerson = { ...person._doc, id: person._id }
    delete formattedPerson._id
    delete formattedPerson.__v
  
    return formattedPerson
}

const Person = mongoose.model('Person', personSchema)

module.exports = Person