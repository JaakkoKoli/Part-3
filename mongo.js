const mongoose = require('mongoose')

const url = 'mongodb://admin:admin@ds229418.mlab.com:29418/part3'

mongoose.connect(url)

const Person = mongoose.model('Person', {
  name: String,
  number: String
})

if(process.argv.length===4){
    const person = new Person({
        name: process.argv[2],
        number: process.argv[3],
    })
    person
    .save()
    .then(result => {
            console.log("lisätään henkilö "+person.name+" numero "+person.number+" luetteloon")
            mongoose.connection.close()
        })
    .catch(e => {
        console.log(e)
    })
}else{
    Person.find({})
        .then(result => {
            result.forEach(p => {
                console.log(p.name+" "+p.number)
            })
            mongoose.connection.close()
        })
}