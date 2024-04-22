const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('assert')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)
const initialBlogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

  test('posts are returned as json', async () => {
    await api.get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
    })
  
  test('there are two notes', async () => {
    const res = await api.get('/api/blogs')
    assert(res.body.length == initialBlogs.length)
    // console.log('EL ASSERT',res.body.length == initialBlogs.length)
    })

  test("Unique identifiers are called id", async()=>{
    const res = await api.get('/api/blogs')
    res.body.forEach(obj => {
        // console.log('id' in obj)
        assert('id' in obj, true)
      });
    })  
  
    test.only('a valid blog can be added', async()=>{
      const newBlog = {
        title: "async/await simplifies making async calls",
        author: "autor asincrono",
        url: "Nueva url.com",
        likes: 7890
    }
    
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
      const res = await api.get('/api/blogs')   
      console.log(res.body)
      const titles = res.body.map(x => x.title)    
      // console.log('TITLE ',titles)    
      assert(res.body.length, initialBlogs.length + 1)
      assert(titles.includes('async/await simplifies making async calls'))
    })

after(async () => {
  await mongoose.connection.close()
})