const router = require('express').Router()
const CatModel = require('./category-model')

router.get('/', (req, res)=>{
    CatModel.find()
    .then(cats => {
        res.json(cats)
    })
    .catch(err => res.send(err))
})

router.post('/new', (req, res)=> {
    let newCat = req.body

    CatModel.add(newCat)
        .then(saved => {
            res.status(201).json({category: saved})
        })
})
module.exports = router