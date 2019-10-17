const express = require('express')

const server = express()

server.use(express.json())

// Data =========================================

let projects = [
  {
    "id": "1",
    "title": "Primeiro Projeto",
    "tasks": []
  },
  {
    "id": "2",
    "title": "Segundo Projeto",
    "tasks": []
  }
]

let numRequests = 0

// Middlewares ==================================

server.use((req, res, next) => {
  console.time('Request')
  console.log(`Metodo: ${req.method}; URL: ${req.url}`)
  console.log(`Num de requests: ${++numRequests}`)

  next()

  console.timeEnd('Request')
})

checkProjectExists = (req, res, next) => {
  const project = projects[req.params.id]
  
  if (!project) {
    return res.status(400).json({ error: 'Project does not exist' })
  }

  req.project = project

  return next()
}

// Routes =======================================

server.get('/projects', (req, res) => {
  return res.json(projects)
})

server.post('/projects', (req, res) => {
  const { id, title } = req.body

  projects.push({
    id: id,
    title: title,
    tasks: []
  })

  return res.json(projects)
})

server.put('/projects/:id', checkProjectExists, (req, res) => {
  const { title } = req.body

  req.project.title = title

  return res.json(req.project)
})

server.delete('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params

  projects.splice(id, 1)

  return res.send()
})

server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { title } = req.body

  req.project.tasks.push(title)

  return res.json(req.project)
})

server.listen(3000)