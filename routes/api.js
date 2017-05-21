var express = require('express');
var router = express.Router();

var userController = require('./controllers/user.js');
var locationController = require('./controllers/location.js');

// Location routes
router.post('/user', userController.saveUser);

// Location routes
router.get('/location', locationController.getAllLocation);
router.post('/location', locationController.saveLocation);

module.exports = router;
