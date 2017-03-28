const express      = require('express');
const path         = require('path');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const http         = require('http');


/* Swagger Configuration */
const swaggerUi       = require('swagger-ui-express');
const swaggerJSDoc 	  = require('swagger-jsdoc');


const users = require('./routes/route-users');
const auth  = require('./routes/route-auth');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())

/* APIs */
app.use('/api/users', users);
app.use('/api/auth', auth);

var host = normalizePort(process.env.HOST || 'localhost');
var port = normalizePort(process.env.PORT || '3000');

var defaultUrl = '';
if(  host !== 'localhost'){
    var defaultUrl = host;    
}else{
    var defaultUrl = host+':'+port;
}
console.log(defaultUrl);

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
    apis: ['./routes/route-*.js'],
};


var swaggerSpec = swaggerJSDoc(options);

app.get('/swagger.json', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});


app.use('/documentation', swaggerUi.serve, swaggerUi.setup(swaggerSpec));



/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

module.exports = app;
