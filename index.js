var express = require('express');
var app = express();
//var compression = require('compression');
var path = require('path');
var errorHandler = require('errorhandler');
var bodyParser = require('body-parser');
//var apiRoutes = require('./routes/api.js');
//var s3Credentials = require('./routes/s3Credentials.js');
//var cors = require('cors');

var routes = require('./routes/index.js');

express.Router();

// Disabled as suggested in the prerender issue.
// We'll remove this once our prerender issue (some pages not being rendered)
// is fixed.
// https://github.com/prerender/prerender-node/issues/109
//app.disable('etag');

//Set up express statics
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

//Configure body parser to parse requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));


// S3Credentials for files upload
//app.use(cors());

// development only
//if ('development' === process.env.NODE_ENV) {
  app.use(errorHandler());
//}

app.use('*', routes.index);

app.listen(3000, function () {
  console.log("The app is running on 3000!");
});
