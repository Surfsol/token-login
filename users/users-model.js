//connection to database
const db = require('../data/db-config')

module.exports = {
    add,
    find,
    findBy,
    findById

}

function find() {
    return db('users').select('id', 'username');
  }

async function add(user){
    const[id] = await db('users').insert(user)

    return findById(id)
}

function findById(id){
    return db('users')
        .where({id})
        .first()
}

function findBy(filter){
    return db('users').where(filter)
}