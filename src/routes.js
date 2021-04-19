const express = require('express')

const routes = express.Router()

const Controller = require('./controller/controller')

routes.post('/workflow', Controller.createWorkflow)
routes.patch('/workflow/:uuid', Controller.updateWorkflow)
routes.get('/workflow', Controller.listWorkflows)
routes.get('/workflow/consume', Controller.consumeWorkflow)

module.exports = routes