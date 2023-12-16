var express = require('express');
var router = express.Router();
router.use(express.static('public'));
router.use(express.urlencoded({ extended: true }));

const mongojs = require('mongojs')
const db = mongojs('bezeroakdb',['bezeroak'])

const multer  = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.originalname.split(".")[0] + '-' + uniqueSuffix + "." + file.mimetype.split("/")[1])
    }
  })

const upload = multer({'storage': storage })
let users = [];

db.bezeroak.find(function (err,userdocs) {
  if (err) {
    console.log(err)
  }
  else {
    users = userdocs
  }
})

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render("users", {
    title: "Users", 
    users: users
  });
});

router.get('/list', function(req, res, next) {
  db.bezeroak.find(function (err, user) {
    if (err) {
      console.log(err)
    }
    else {
      res.json(user)
    }})})


router.post("/new", (req, res) => {
  console.log(req.body)
  db.bezeroak.insert(req.body, function (err, user) {
    if (err) {
      console.log(err)
    }
    else {
      console.log(user)
      res.json(user);
    }
  })
});

router.delete("/delete/:id", (req, res) => {
  users = users.filter(user => user.id != req.params.id);
  db.bezeroak.remove({id: parseInt(req.params.id)}, function (err,user) {
    if (err) {
      console.log(err)
    }
    else {
      console.log(user)
    }
  })
  res.json(users);
});

router.put("/update/:id", (req, res) => {
  db.bezeroak.update({id: parseInt(req.params.id)}, {$set: {izena: req.body.izena, irudia: req.body.irudia, abizena: req.body.abizena, email:req.body.email}}, function (err,user) {
    if (err) {
      console.log(err)
    }
    else {
      console.log(user)
    }
  })
  res.json(users);
})

router.post('/profile', upload.single('avatar'), function (req, res, next) {
  try {
    res.send(req.file.filename)
  }
  catch (TypeError) {
    res.send("null")
  }
})

module.exports = router;
