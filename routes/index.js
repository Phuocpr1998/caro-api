var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  res.send("Caro api service");
});

module.exports = router;
