
exports.up = async function(knex) {
    // zoos table
  await knex.schema.createTable('zoos', (table) => {
      table.increments('id')
      table.text('name').notNull()
      table.text('address').notNull().unique()
  })

   //species table
   await knex.schema.createTable('species', (table) => {
    table.increments('id')
    table.text('name').notNull().unique()
})
    // animals table
  await knex.schema.createTable('animals', (table) => {
      table.increments('id')
      table.text('name').notNull()
      table.integer('species_id') // foreign key 
      .references('id') //this creates a reference for our foreign key pointing it to the id column
      .inTable('species') // this specifies that the id column is located in the species table 
      .onUpdate("CASCADE") // if the species id gets updated, update that change on here as well
      .onDelete('CASCADE') // this is saying, set the foreign key to null instead of giving us an error
  });

  await knex.schema.createTable('zoos_animals', (table) => {
    table.integer('zoo_id')
        .references('id')
        .inTable('zoos')
        .onUpdate("CASCADE") // if the species id gets updated, update that change on here as well
        .onDelete('CASCADE')
    table.integer('animal_id')
        .references('id')
        .inTable('animals')
        .onUpdate("CASCADE") // if the species id gets updated, update that change on here as well
        .onDelete('CASCADE')
    table.date('from_date')
    table.date('to_date')
    table.primary(['zoo_id', "animal_id"])
});
}

exports.down = async function(knex) {
    await knex.schema.dropTableIfExists("zoos_animals")
    await knex.schema.dropTableIfExists("animals")
    await knex.schema.dropTableIfExists("species")
    await knex.schema.dropTableIfExists('zoos')
};

