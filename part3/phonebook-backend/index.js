require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()

app.use(express.json())
app.use(express.static('dist'))

morgan.token('post-body', (request) => {
  return request.method === 'POST' ? JSON.stringify(request.body) : ''
})

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :post-body')
)

app.get('/api/persons', (request, response, next) => {
  Person.find({}).then((persons) => {
    response.json(persons)
  }).catch((error) => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then((person) => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  }).catch((error) => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({ error: 'name is missing' })
  }

  if (!body.number) {
    return response.status(400).json({ error: 'number is missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then((savedPerson) => {
    response.status(201).json(savedPerson)
  }).catch((error) => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  if (!name) {
    return response.status(400).json({ error: 'name is missing' })
  }

  if (!number) {
    return response.status(400).json({ error: 'number is missing' })
  }

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then((updatedPerson) => {
      if (updatedPerson) {
        response.json(updatedPerson)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id).then(() => {
    response.status(204).end()
  }).catch((error) => next(error))
})

app.get('/info', (request, response, next) => {
  Person.countDocuments({}).then((count) => {
    const requestedAt = new Date().toString()
    response.send(`<p>Phonebook has info for ${count} people</p><p>${requestedAt}</p>`)
  }).catch((error) => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).json({ error: 'malformatted id' })
  }

  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  return next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
