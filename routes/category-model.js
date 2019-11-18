const db = require('../data/db-config')

module.exports = {
    add,
    find,
    findById
}

function find(){
    return db('category').select('id', 'title')
}

async function add(cat){
    const[id] = await db('category').insert(cat)

    return findById(id)
}

function findById(id){
    return db('category')
        .where({id})
        .first()
}