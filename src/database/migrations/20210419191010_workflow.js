
exports.up = function(knex) {
    return knex.schema.createTable('workflow', function(table) {
        table.uuid('uuid').primary().notNullable();
        table.enu('status', ['inserted', 'consumed']);
        table.jsonb('data');
        table.specificType('steps', 'TEXT[]');
        table.unique('uuid');
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('workflow')
};
