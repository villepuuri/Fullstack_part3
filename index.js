const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())


let persons = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
    },
    {
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: 2
    },
    {
        name: "Dan Abramov",
        number: "12-43-234345",
        id: 3
    },
    {
        name: "Mary Poppendieck",
        number: "39-23-6423122",
        id: 4
    }
]


morgan.token('body', (req, res) => { 
    if (req.method === 'POST'){
        const bodyText = `{"name":"${req.body.name}","number":"${req.body.number}"}`
        console.log(bodyText)
        return bodyText
    } else {
        return ''
    }
    })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))



app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log(id, typeof id)

    const person = persons.find(p => p.id === id)
    if (person) {
        console.log(person)
        response.json(person)
    } else {
        console.log('No person found with id: ', id)
        response.status(404).end()
    }
})

app.get('/info', (request, response) => {
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

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log('Deleting person with id ', id)
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()
})


app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({
            error: "Name is missing"
        })
    }
    else if (!body.number) {
        return response.status(400).json({
            error: "Number is missing"
        })
    }
    else if (persons.find(p => p.name === body.name)) {
        return response.status(400).json({
            error: "Name must be unique"
        })
    }
    else {
        const newPerson = {
            name: body.name,
            number: body.number,
            id: Math.floor(Math.random() * 10000)
        }
        console.log(newPerson)
        persons = persons.concat(newPerson)
        response.json(newPerson)
    }
})


const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
