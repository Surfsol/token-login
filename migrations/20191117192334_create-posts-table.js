
exports.up = function(knex) {
  return knex.schema
  .createTable('category', tbl => {
    tbl.increments(); //primary key
    tbl.string('title')
        .notNullable()
})
  .createTable('subreddit', tbl => {
    tbl.increments(); //primary key
    tbl.string('title')
        .notNullable()
    //foreign key, on knexfile.js, pool: is used for fk enforcement
    tbl.integer('category_id')
        .references('id')
        .inTable('category')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
})
  .createTable('posts', tbl => {
    tbl.increments(); //primary key
    tbl.string('post')
        .notNullable()
    //foreign key, on knexfile.js, pool: is used for fk enforcement
    tbl.integer('user_id')
        .unsigned() //integer must be positive, necessary in many dbs
        .notNullable()
        //referenced on users
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
    tbl.integer('subreddit_id')
        .unsigned() //integer must be positive, necessary in many dbs
        .notNullable()
        //referenced on users
        .references('id')
        .inTable('subreddit')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
})
    .createTable('postsByUser', tbl => {
        tbl.increments(); //primary key
        //foreign key, on knexfile.js, pool: is used for fk enforcement
        tbl.integer('user_id')
            .unsigned() //integer must be positive, necessary in many dbs
            .notNullable()
            //referenced on users
            .references('id')
            .inTable('users')
            .onUpdate('CASCADE')
            .onDelete('CASCADE')
        tbl.integer('post_id')
            .unsigned() //integer must be positive, necessary in many dbs
            .notNullable()
            //referenced on users
            .references('id')
            .inTable('posts')
            .onUpdate('CASCADE')
            .onDelete('CASCADE')
        tbl.integer('subreddit_id')
            .unsigned() //integer must be positive, necessary in many dbs
            .notNullable()
            //referenced on users
            .references('id')
            .inTable('subreddit')
            .onUpdate('CASCADE')
            .onDelete('CASCADE')
         //  this is to protect our database from having two of the same combinations of FKs.
         table.unique(['user_id', 'post_id'])
})
.createTable('user-favorites', tbl => {
    tbl.increments(); //primary key
    //foreign key, on knexfile.js, pool: is used for fk enforcement
    tbl.integer('user_id')
        .unsigned() //integer must be positive, necessary in many dbs
        .notNullable()
        //referenced on users
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
    tbl.integer('post_id')
        .unsigned() //integer must be positive, necessary in many dbs
        .notNullable()
        //referenced on users
        .references('id')
        .inTable('posts')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
})
};

exports.down = function(knex) {
    //drop tables in opposite order, which you set them up
    return knex.schema
        .dropTableIfExists('user-favorites')
        .dropTableIfExists('postsByUser')
        .dropTableIfExists('user-favorites')
        .dropTableIfExists('posts')
        .dropTableIfExists('subreddit')
        .dropTableIfExists('category')
  
};
