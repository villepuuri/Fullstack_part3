
// Update the node version in WSL!!

const mongoose = require('mongoose')

console.log('starting')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

console.log('Working still like a dream')

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
    `mongodb+srv://pulle:${password}@fullstackdb.bfwwgl2.mongodb.net/personApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

console.log('Still working')

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})
const Person = mongoose.model('Person', personSchema)

if (name && number) {
    const person = new Person({
        name: name,
        number: number
    })
    person.save().then(result => {
        console.log('Person saved, wohoo!')
        mongoose.connection.close()
    })
}
else {
    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(p => {
            console.log(`${p.name} ${p.number}`)
        })
        mongoose.connection.close()
    })
}




