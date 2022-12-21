const express = require('express')
const app = express()
require('dotenv').config()
const Person = require('./models/person')
//const morgan = require('morgan')
//const mongoose = require('mongoose')
app.use(express.json())
const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}
app.use(requestLogger)
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


app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/info', (request, response) => {
    const date = new Date()
    Person.find({}).then(persons => {
        response.send(
            `
            <div>
                <p>Phonebook has info for ${persons.length} people</p>
            </div>
            <div>
                <p>${date}</p>
            </div>`
        )
    })
})

app.get('/api/persons/:id', (request, response,next) => {
    // const id = Number(request.params.id)
    // const person = persons.find(person => person.id === id)
    // if (person) {
    //   response.json(person)
    // } else {
    //   response.status(404).end()
    // }
    Person.findById(request.params.id).then(person => {
        if (person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
    })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response,next) => {
    // const id = Number(request.params.id)
    // persons = persons.filter(person => person.id !== id)
    // response.status(204).end()
    Person.findByIdAndRemove(request.params.id)
        .then(() => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

// const generateId = () => {
//     return Math.floor(Math.random() * (100) + 1);
//   }
app.post('/api/persons', (request, response,next) => {
    const body = request.body

    //   if (!body.name) {
    //       return response.status(400).json({
    //       error: 'name missing'
    //       })
    //   }
    //   if (!body.number) {
    //     return response.status(400).json({
    //     error: 'number missing'
    //     })
    // }
    const person = new Person({
        //id: generateId(),
        name: body.name,
        number: body.number,
    })
    Person.find({ name: body.name }).count(function (err, count) {
        if(count>0)
        {
            return response.status(400).json({
                error: 'name must be unique'
            })
        }
        else{
            person.save().then(savedPerson => {
                response.json(savedPerson)
            })
                .catch(error => next(error))
        }
    })
    // persons = persons.concat(person)
    // response.json(person)
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query' })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }
    next(error)
}

app.use(errorHandler)
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})