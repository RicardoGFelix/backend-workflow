const connection = require('../database/connections')
const amqp = require('amqplib')
const convert = require('json-2-csv')
const FileSystem = require('fs')

module.exports = {
    async createWorkflow(req, res){
        try {
            const {uuid, status, data, steps} = req.body;
            await connection('workflow').insert({
                uuid,
                status,
                data,
                steps
            });
            
            const workflow = {
                uuid,
                status,
                data,
                steps
            }

            const rabbitmq = async () => {
                let conn = await amqp.connect('amqp://localhost:5672')
                let ch = await conn.createChannel()

                const msg = JSON.stringify(workflow)

                ch.assertQueue('workflow_queue', {durable: false})
                ch.sendToQueue('workflow_queue', new Buffer.from(msg))

                console.log('Send %s', msg)

                process.once('SIGINT', () => conn.close())

            }

            rabbitmq()
            
            return res.json(workflow);
        } catch (error) {
            return res.json(error);
        }
    },

    async listWorkflows(req, res){
        try {
            const workflows = await connection('workflow').select('*');

            return res.json(workflows);
        } catch (error){
            return res.json(error);
        }
    },

    async updateWorkflow(req, res){
        try {
            const {status} = req.body;
            const {uuid} = req.params;

            await connection('workflow').select('*').where('uuid', uuid).update('status', status);

            return res.json('The update was successful!');
        } catch (error) {
            return res.json(error);
        }
    },

    // Método para que um workflow seja consumido
    async consumeWorkflow(req, res){
        try {
            const workflow = await connection('workflow').select('*').where('status', 'inserted').first()

            // retirar workflow consumido da fila
            

            let conn = await amqp.connect('amqp://localhost:5672')
            let ch = await conn.createChannel()

            const message = JSON.stringify(workflow)

            ch.assertQueue('workflow_queue', {durable: false})
            ch.prefetch(1)

            console.log(' [x] Consuming message %s', message)

            ch.consume('workflow_queue', msg => {
                ch.ack(msg)
                console.log('Message consumed!')
                ch.close()
                
            }, { noAck: false })
            
            // alterar status do workflow consumido da fila para 'consumed' no banco de dados
            
            await connection('workflow').select('*').where('uuid', workflow.uuid).update('status', 'consumed')

            
            // gerando arquivo csv a partir dos dados em json do workflow consumido
            
            /*const data_workflow = [workflow.data]
            
            const csv = convert.json2csv(data_workflow, (error, csv) => {
            if (error) { throw error }
            
            console.log(csv)
            
            FileSystem.writeFileSync('./csv-workflows/${workflow.uuid}.csv', csv)
            
            })*/

            return res.json("Workflow consumido.")
        } catch (error) {
            return res.json(error)
        }
    }
}
