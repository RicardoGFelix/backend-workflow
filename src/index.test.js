const request = require('supertest')
const app = require('./server')

 describe('Test my app', () => {
     test('inserção realizada com sucesso', async () => {
         const res = await request(app)
         .post('/workflow')
         .send({
             uuid: '123e4567-e89b-12d3-a456-426655440000',
             status: 'inserted',
             data: {
                 nome: 'Entrada 1'
             },
             steps: ['Passo 1001', 'Passo 1002']
         })
         
         expect(res.statusCode).toEqual(200)
     })

     test('segunda inserção realizada com sucesso', async () => {
         const res = await request(app)
         .post('/workflow')
         .send({
            uuid: '100a0000-e55b-12d3-a456-426655440000',
            status: 'inserted',
            data: {
                nome: 'Entrada 2'
            },
            steps: ['Passo 2001', 'Passo 2002']
         })
         
         console.log(res.body)
         expect(res.statusCode).toEqual(200)
     })

     test('inserção deve dar erro pois o uuid passado já existe no database', async () => {
        const res = await request(app)
        .post('/workflow')
        .send({
           uuid: '123e4567-e89b-12d3-a456-426655440000',
           status: 'inserted',
           data: {
               nome: 'Entrada 3'
           },
           steps: ['Passo 3001', 'Passo 3002']
        })
        
        console.log(res.body)
        expect(res.statusCode).toEqual(200)       
     })

     test('inserção deve dar erro pois o uuid passado nulo', async () => {
        const res = await request(app)
        .post('/workflow')
        .send({
           uuid: null,
           status: 'inserted',
           data: {
               nome: 'Entrada 4'
           },
           steps: ['Passo 4001', 'Passo 4002']
        })
        
        console.log(res.body)
        expect(res.statusCode).toEqual(200)        
     })

     test('listagem de workflows bem sucedida', async () => {
         const res = await request(app).get('/workflow')
         
         expect(res.statusCode).toEqual(200)
     })
     
     test('Consumir workflow com sucesso', async () => {
         const res = await request(app).get('/workflow/consume')
         
         console.log(res.body)
         expect(res.statusCode).toEqual(200)
     })
     
     
     
     
 })
