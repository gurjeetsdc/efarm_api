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

var port = '3000';
var defaultUrl = 'localhost:'+port
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



module.exports = app;
