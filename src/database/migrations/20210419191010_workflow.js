
exports.up = function(knex) {
    return knex.schema.createTable('workflow', function(table) {
        table.uuid('uuid');
        table.enu('status', ['inserted', 'consumed']);
        table.jsonb('data');
        table.specificType('steps', 'TEXT[]');
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('workflow')
};
