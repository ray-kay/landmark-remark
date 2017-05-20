var express = require('express');
var router = express.Router();

var locationController = require('./controllers/location.js');

// Location routes
router.post('/location', locationController.saveLocation);

module.exports = router;
