const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../users/modal");
const jwt = require("jsonwebtoken");
const secret = "tobymacquire";

const validation = (req, res, next) => {
  
  if (req.body.username && req.body.password) {
    next();
  } else {
    res.status(404).json("username and password required");
  }
};


const usernameChecker = async (req, res, next) => {
 
  try {
    const check = await User.findBy({ username: req.body.username });
    if (check) {
      
      res.status(400).json("username taken");
    } else {
      next();
    }
  } catch (err) {
    res.status(404).json(err.message);
  }
};

const tokenMaker = (user) => {
  const payload = {
    subject: user.id,
    username: user.username,
  };
  const options = {
    expiresIn: "10000s",
  };
  return jwt.sign(payload, secret, options);
};

// router.post("/register", usernameChecker, async (req, res) => {

// const creds = req.body; //«δ╩«δ╩«δ╩«δ╩«δ╩«δ╩«δ╩«δ╩«δ╩«δ╩«δ╩«δ╩
// const hash = bcrypt.hashSync(creds.password, 5);
// creds.password = hash;

// User.add(creds)
//   .then((user) => {
//     res.status(201).json(user);
//   })

// const hash = bcrypt.hashSync(req.body.password, 5);
// req.body.password = hash
// try{
//   const data = await User.add({username: req.body.username, password: hash})
//   console.log(data)
//   const id = await User.findBy({username:data.username})
//   const newestUser = await User.findById(id)
//   res.status(201).json(newestUser)
// }
//   catch(err){
//     res.status(404).json(err.message)
//   };

// });

router.post("/register", validation, usernameChecker, (req, res) => {
  const theGoods = req.body;
    const hash = bcrypt.hashSync(theGoods.password, 7);
    theGoods.password = hash;
    User.add(theGoods)
      .then((user) => {
        res.status(201).json(user);
      })
      .catch((e) => res.status(500).json(e.message));
});

router.post("/login", validation, (req, res) => {
  const { password, username } = req.body;
  User.findBy({ username: username })
    .then((user) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = tokenMaker(user);
        res.status(200).json({
          message: "welcome back, " + user.username,
          token,
        });
      } else {
        res.status(401).json("invalid credentials");
      }
    })

    .catch((err) => res.status(400).json(err.message));
});

module.exports = router;
