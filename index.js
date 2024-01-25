const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())
app.use(express.static('dist'))

require('dotenv').config()



const Person = require('./models/person')


// Use morgan to log REST-commands
morgan.token('body', (req, res) => {
    if (req.method === 'POST') {
        const bodyText = `{"name":"${req.body.name}","number":"${req.body.number}"}`
        console.log(bodyText)
        return bodyText
    } else {
        return ''
    }
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))



app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
    // response.json(persons)
})

app.get('/api/persons/:id', (request, response, next) => {

    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                console.log(person)
                response.json(person)
            } else {
                console.log('No person found with id: ', id)
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.get('/info', (request, response) => {
    Person.find({}).then(persons => {
        const personLen = persons.length
        const date = new Date()
        console.log(date)
        response.send(
            `<div>
                <p>Phonebook has info for ${personLen} people</p>
                <p>${date}</p>
            </div>`
        )
    })
})

app.delete('/api/persons/:id', (request, response) => {

    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})


app.post('/api/persons', (request, response, next) => {
    console.log('Posting a person')
    const body = request.body

    const newPerson = Person({
        name: body.name,
        number: body.number,
    })
    console.log("Adding a person", newPerson)
    newPerson.save().then(savedPerson => {
        response.json(savedPerson)
    })
    .catch(error => next(error))

})

app.put('/api/persons/:id', (request, response, next) => {
    console.log('Updating a person')
    const body = request.body

    Person.findByIdAndUpdate(
        request.params.id,
        { number: body.number },
        { new: true, runValidators: true, context: 'query'})
        .then(result => {
            console.log('Result from updating: ', result)
            response.json(result)
        })
        .catch(error => next(error))

})


const errorHandler = (error, request, response, next) => {
    console.log(' *** Handling the error *** ')
    console.log(error)
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
