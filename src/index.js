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


morgan.token('content', function (req, res) { return JSON.stringify(req.body) })

app.use(morgan(':method :url :content :status :res[content-length] - :response-time ms'))
app.use(bodyParser.json())
app.use(express.static('build'))

app.get('/info', (req, res) => {
    res.send('puhelinluettelossa on '+persons.length+' henkilön tiedot<br /><br />'+Date())
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
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
    persons = persons.filter(note => note.id !== id)
  
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

    const person = {
      name: body.name,
      number: body.number,
      id: generateId()
    }
  
    persons = persons.concat(person)
  
    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})