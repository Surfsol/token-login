const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const UsersModel = require('./users-model')

router.post('/register', (req, res)=>{
    let user = req.body

    const hash = bcrypt.hashSync(user.password, 10);
    user.password = hash
    
    UsersModel.add(user)
        .then(saved => {
            console.log(saved)
            res.status(201).json(saved)
        })
        .catch(err => {
            res.status(500).json(err)
        })
})

router.post('/login', (req,res)=> {
    let { username, password } = req.body

    UsersModel.findBy({ username })
        .first()
        .then(user => {
            if(user && bcrypt.compareSync(password, user.password)) {
                const token = generateToken(user)
                res.status(200).json({
                    message: `Welcome back ${user.username}!`,
                    token
                })
            } else {
                res.status(401).json({ message: 'Invalid Credentials'})
            }
        })
        .catch(error => {
            res.status(500).json(error)
        })
})

function generateToken(user){
    let username = user.username
    console.log(`username`, username)
    
  const payload = {
      subject: user.id, //sub property in header
      username
      //additional data, do not include sensitve info
  }
 
  const secret = process.env.JWT_SECRET || "aslskek34l4kfnad"
  const options = {
      expiresIn : '8h'
  }
  console.log(`payload`, payload, secret, options)
  return jwt.sign(payload, secret, options)
}

router.get("/logout", (req, res) => {
    if (req.session) {
      //kills session
      req.session.destroy(error => {
        //check if possible error
        if (error) {
          res
            .status(500)
            .json({
              message:
                "error logging you out. try again."
            });
        } else {
          res.status(200).json({ message: "logged out successfully" });
        }
      });
    } else {
      res.status(200).json({ message: "come back soon" });
    }
  });

  module.exports = router;