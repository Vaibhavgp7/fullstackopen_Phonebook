const express = require('express')
const app = express()
require('dotenv').config()
const Person = require('./models/person')
const morgan = require('morgan')
const mongoose = require('mongoose')
app.use(express.json())

//app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
const cors = require('cors')
app.use(express.static('build'))
app.use(cors())
// app.use(morgan((tokens, req, res) => {
//   return [
//     tokens.method(req, res),
//     tokens.url(req, res),
//     tokens.status(req, res),
//     tokens.res(req, res, 'content-length'), '-',
//     tokens['response-time'](req, res), 'ms',
//     JSON.stringify(req.body)
//   ].join(' ')
// }))

// let persons = [
//     { 
//       "id": 1,
//       "name": "Arto Hellas", 
//       "number": "040-123456"
//     },
//     { 
//       "id": 2,
//       "name": "Ada Lovelace", 
//       "number": "39-44-5323523"
//     },
//     { 
//       "id": 3,
//       "name": "Dan Abramov", 
//       "number": "12-43-234345"
//     },
//     { 
//       "id": 4,
//       "name": "Mary Poppendieck", 
//       "number": "39-23-6423122"
//     }
// ]
// app.get('/', (request,response)=>{
//   response.json("Hi, World!")
// })
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/info', (request, response) => {
    const date = new Date()
    response.send(
        `<div>
            <p>Phonebook has info for ${persons.length} people</p>
        </div>
        <div>
            <p>${date}</p>
        </div>`
    )
})

app.get('/api/persons/:id', (request, response) => {
    // const id = Number(request.params.id)
    // const person = persons.find(person => person.id === id)
    
    // if (person) {
    //   response.json(person)
    // } else {
    //   response.status(404).end()
    // }
    Person.findById(request.params.id).then(person => {
      response.json(person)
    })
  })

app.delete('/api/persons/:id', (request, response) => {
    // const id = Number(request.params.id)
    // persons = persons.filter(person => person.id !== id)
    // response.status(204).end()
    Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    })

const generateId = () => {
    return Math.floor(Math.random() * (100) + 1);
  }
  
app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({ 
        error: 'name missing' 
        })
    }
    if(Person.find({name: body.name}).then(persons => {
      return response.status(400).json({ 
        error: 'name must be unique'
    })
    }))
    
    if (!body.number) {
        return response.status(400).json({ 
        error: 'number missing' 
        })
    }

    const person = new Person({
        //id: generateId(),
        name: body.name,
        number: body.number,
    })

    // persons = persons.concat(person)
    // response.json(person)
    person.save().then(savedPerson => {
      response.json(savedPerson)
    })
})

const PORT = process.env.PORT 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})