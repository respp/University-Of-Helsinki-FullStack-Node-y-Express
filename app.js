const config = require('./utils/config')
const express = require('express')
const app = express()
const middleware = require('./utils/middleware')
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

logger.info('connecting to url', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
.then(res=>{
  logger.info('connected to MongoDB')
})
.catch(err=>{
  logger.error('error connecting to MongoDB', err.message)
})

app.use(cors())
app.use(express.json())

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)

// app.use(middleware.errorHandler)

module.exports=app
