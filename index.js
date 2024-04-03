const express = require('express')
const app = express()
const morgan = require('morgan')

//Initializations
app.use(express.json())

  //Settings
  const PORT = 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })

  //Data
let persons = [
  { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
  },
  { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
  },
  { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
  },
  { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
  }
]

//Middlewares
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(morgan('tiny'))

//Start the server
  app.get('/info', (request, response) => {
    const date = new Date()
    const numberOfEntries = persons.length
    response.send(`
    <div><p>Phonebook has info for 2 people</p></div>
    <div><p>${date} ${numberOfEntries}</p></div>
    `)
  })
  
  app.get('/api/persons', (request, response) => {
    response.json(persons)
  })

  app.get('/api/persons/:id',(req, res)=>{
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if (person){
        res.json(person)
    } else{
        res.status(404).end()
    }
  })

  app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)
  
    res.status(204).end()
  })

  const generateId = ()=>{
    const maxId = Math.random() * (100000 - 4) + 4
    return Math.floor(maxId)
  }

  app.post('/api/persons', (req, res) => {
    const body = req.body
    console.log(body)
    if(!body.name){
        return res.status(400).json({
            error: 'name missing'
        })
    }
    if(!body.number){
        return res.status(400).json({
            error: 'number missing'
        })
    }
    persons.forEach(p => {
        if(p.name == body.name){
            return res.status(400).json({
                error: 'name must be unique'
            })
        }
    });

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number,
    }

    persons = persons.concat(person)
    
    res.json(person)
})
