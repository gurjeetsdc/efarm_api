// Get the packages we need
var express    = require('express');
var mongoose   = require('mongoose');
var bodyParser = require('body-parser');
var ejs        = require('ejs');
var session    = require('express-session');
var passport   = require('passport');

/* Swagger Configuration */
const swaggerUi      = require('swagger-ui-express');
const swaggerJSDoc 	 = require('swagger-jsdoc');

/*Routers */
var userRouter   = require('./src/routes/user');
var cropRouter   = require('./src/routes/crop');

var clientRouter = require('./src/routes/client');
var oauth2Router = require('./src/routes/oauth2');

// Connect to the MongoDB
mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost:27017/outh_api_db');
mongoose.connect('mongodb://admin:admin@ds145370.mlab.com:45370/efarm');

// Create our Express application
var app = express();

// Set view engine to ejs
app.set('view engine', 'ejs');

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
  extended: true
}));

// Use express session support since OAuth2orize requires it
app.use(session({
  secret: 'ILoveCheapThrills',
  saveUninitialized: true,
  resave: true
}));

// Use the passport package in our application
app.use(passport.initialize());


// Create our Express router
var router = express.Router();

// Register all our routes with /api
router.get('/', function(req, res, next) {
    res.json({message: "API Version 1.0.0"});
});

app.use('/api',router);

// Create endpoint handlers for /Crops
app.use('/api', cropRouter);

// endpoint handlers for /users
app.use('/api', userRouter);

// Create endpoint handlers for /clients
app.use('/api', clientRouter);

// Create endpoint handlers for oauth2
app.use('/api', oauth2Router);


/* server configuration */
const host = process.env.HOST || 'localhost';
const port = process.env.PORT || '3000';

var defaultUrl = '';
if(  host == 'localhost' && port == '3000'){
    var defaultUrl = host+':'+port;
}else{
    var defaultUrl = 'efarmxapi.herokuapp.com';    
}

/* swagger Configuration. */
var swaggerDefinition = {
    info: { // API informations (required)
        title: 'eFarmX API Documentation', // Title (required)
        version: '0.0.0', // Version (required)
        description: 'API Documentation', // Description (optional)
    },
    host:  defaultUrl, // Host (optional)
    basePath: '/api', // Base path (optional)
};

// Options for the swagger docs
var options = {
    // Import swaggerDefinitions
    swaggerDefinition: swaggerDefinition,
    // Path to the API docs
    apis: ['./src/routes/*.js'],
};

var swaggerSpec = swaggerJSDoc(options);

app.get('/swagger.json', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

app.use('/documentation', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// Start the server
app.listen(port, function () {
  console.log('Server listening at: http://'+defaultUrl)
});