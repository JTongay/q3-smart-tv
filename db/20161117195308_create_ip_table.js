
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('ips', function(table){
    table.increments();
    table.string('address');
    table.integer('user_id').unsigned().index().references('id').inTable('users').onDelete('CASCADE');
    table.timestamps(true, true);
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('ips');
};
