var express = require('express');
var app = express();
var path = require('path');
var errorHandler = require('errorhandler');
var bodyParser = require('body-parser');
var Promise = require('bluebird');
var db = require('sqlite');

var routes = require('./routes/index.js');
var apiRoutes = require('./routes/api.js');

var port = 4000;

//Set up express statics
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

//Configure body parser to parse requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// development only
app.use(errorHandler());

//Set up home route
app.get('/', routes.index);

//API routes
app.use('/api', apiRoutes);

app.use('*', routes.index);

Promise.resolve()
  .then(() => db.open('./db/database.sqlite',{ cached: true } , { Promise }))
  .then(() => db.migrate({ force: false })) //change to 'last' for clean db
  .catch(err => console.error(err.stack))
  // Finally, launch Node.js app
  .finally(() => app.listen(port, function () {
      console.log("The app is running on port " + port);
    })
  );
/*
app.listen(3000, function () {
  console.log("The app is running on 3000!");
});
*/
