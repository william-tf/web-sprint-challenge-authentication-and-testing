const db = require('../../data/dbConfig')


function get(){ 
    return db("users")
}

function findBy(filter){ 

    return db("users").where(filter).first()
}

async function add(user){ 
     const [id] = await db("users").insert(user, "id" )
    return findById(id)
    
}

function findById(id){ 
    return db("users").where("id", id).first()
}

module.exports = {
    add,
    findBy,
    get,
    findById
}