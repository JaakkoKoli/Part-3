let persons = [
      {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
      },
      {
        "name": "Martti Tienari",
        "number": "040-123456",
        "id": 2
      },
      {
        "name": "Arto Järvinen",
        "number": "040-123456",
        "id": 3
      },
      {
        "name": "Lea Kutvonen",
        "number": "040-123456",
        "id": 4
      }
    ]

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const Person = require('./models/person')

morgan.token('content', function (req, res) { return JSON.stringify(req.body) })

app.use(express.static('build'))
app.use(morgan(':method :url :content :status :res[content-length] - :response-time ms'))
app.use(bodyParser.json())


app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req, res) => {
    Person.find({}).then(res => {
      res.send('puhelinluettelossa on '+res.length+' henkilön tiedot<br /><br />'+Date())
    })
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(res => {
      res.json(res)
    })
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)
  
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    
    Person.delete(id)
  
    response.status(204).end()
})

const generateId = () => {
    return Math.round(Math.random()*1000000)
}
  
  app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (body.name === undefined) {
      return response.status(400).json({error: 'name missing'})
    }

    if (body.number === undefined) {
        return response.status(400).json({error: 'number missing'})
    }

    if (persons.find(n=>n.name===body.name)) {
        return response.status(400).json({error: 'name must be unique'})
    }

    if (persons.find(n=>n.number===body.number)) {
        return response.status(400).json({error: 'number must be unique'})
    }

    const person = new Person({
      name: body.name,
      number: body.number,
      id: generateId()
    })
  
    person.save().then(res => {
      response.json(person)
    }).catch(e => {
      console.log(e)
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})