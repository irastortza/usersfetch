var express = require('express');
var router = express.Router();

let users = [
  {id: Date.now(), izena: "John", abizena: "Doe", email: "john@doe.com"},
];

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render("users", {
    title: "Users", 
    users: users
  });
});

router.get('/list', function(req, res, next) {
  res.json(users)
  });


router.post("/new", (req, res) => {
  users.push(req.body);
  res.json(users);
});

router.delete("/delete/:id", (req, res) => {
  users = users.filter(user => user.id != req.params.id);
  res.json(users);
});

router.put("/update/:id", (req, res) => {
  let user = users.find(user => user.id == req.params.id);
  user.izena = req.body.izena;
  user.abizena = req.body.abizena;
  user.email = req.body.email;
  res.json(users);
})

module.exports = router;
