const mongoose = require('mongoose')

const url = 'mongodb://admin:admin@ds229418.mlab.com:29418/part3'

mongoose.connect(url)

const Person = mongoose.model('Person',personSchema) 

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  id: Number
})

personSchema.statics.format = (person) => {
    const formattedPerson = { ...person._doc, id: person._id }
    delete formattedPerson._id
    delete formattedPerson.__v
  
    return formattedPerson
}

export default Person