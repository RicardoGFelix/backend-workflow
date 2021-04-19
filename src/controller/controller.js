const connection = require('../database/connections')

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
    }
}