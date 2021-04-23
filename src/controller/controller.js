const connection = require('../database/connections')
const amqp = require('amqplib')
const convert = require('json-2-csv')
const FileSystem = require('fs')

module.exports = {

    // cria um workflow no sistema, adicionando-o ao banco de dados e à fila
    async createWorkflow(req, res){
        try {
            const {uuid, status, data, steps} = req.body;

            // adiciona workflow ao banco de dados
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
                // cria a conexão
                let conn = await amqp.connect('amqp://localhost:5672')
                // cria o canal
                let ch = await conn.createChannel()

                // transforma o objeto JSON do workflow em string
                const msg = JSON.stringify(workflow)

                // cria a fila
                ch.assertQueue('workflow_queue', {durable: false})
                // adiciona o workflow (em string) à fila
                ch.sendToQueue('workflow_queue', new Buffer.from(msg))

                console.log('Send %s', msg)

            }

            rabbitmq()
            
            return res.json(workflow);
        } catch (error) {
            return res.json(error);
        }
    },

    // realiza uma listagem de todos os workflows inseridos no sistema
    async listWorkflows(req, res){
        try {
            
            const workflows = await connection('workflow').select('*');

            return res.json(workflows);
        } catch (error){
            return res.json(error);
        }
    },

    // atualiza o status de um workflow (que pode ser 'inserted' ou 'consumed')
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

    // Método que permite que um workflow seja consumido, o que altera seu status para 'consumed' e retira sua representação em string da fila criada
    async consumeWorkflow(req, res){
        try {
        
            // acessa o primeiro workflow com status 'inserted' do banco de dados (consequentemente é o primeiro workflow presente na fila)
            const workflow = await connection('workflow').select('*').where('status', 'inserted').first()

            // retirar workflow consumido da fila
            

            let conn = await amqp.connect('amqp://localhost:5672')
            let ch = await conn.createChannel()

            const message = JSON.stringify(workflow)

            ch.assertQueue('workflow_queue', {durable: false})
            ch.prefetch(1)

            console.log(' [x] Consuming message %s', message)

            // retira a representação em string do workflow consumido da fila
            ch.consume('workflow_queue', msg => {
                ch.ack(msg)
                console.log('Message consumed!')
                ch.close()
                
            }, { noAck: false })
            
            // altera status do workflow consumido da fila para 'consumed' no banco de dados
            
            await connection('workflow').select('*').where('uuid', workflow.uuid).update('status', 'consumed')

            
            // gerando arquivo csv a partir dos dados em json do workflow consumido
            
            /*const data_workflow = JSON.parse(workflow.data)
            
            const csv = convert.json2csv(data_workflow, (error, csv) => {
            if (error) { throw error }
            
            FileSystem.writeFileSync('./csv-workflows/{workflow.uuid}.csv', csv)
            
            })*/

            return res.json("Workflow consumido.")
        } catch (error) {
            return res.json(error)
        }
    }
}
