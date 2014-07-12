"use strict";

var winston = require('winston'),
  express = require('express'),
  hbs = require('express3-handlebars'),
  handlebars;

// Logging config
require('./config/logging');

// create express app
var app = express();
var port = process.env.PORT || 80;
var development = process.env.DEVELOPMENT_MODE || false;

// process event handlers
process.on('uncaughtException', function (err) {
  // handle the error safely
  winston.error('Uncaught Exception. Stack trace:\n%s', err.stack);
});

// Disable X-Powered-By HTTP response header 
app.disable('x-powered-by');
app.set('view engine', 'html');
if (!development) {
  app.enable('view cache');
}
app.set('dev', development);

// create new handlebars engine. Set html as template extension
handlebars = hbs.create({
  defaultLayout: 'main',
  extname: '.html', //set extension to .html so handlebars knows what to look for
  // Uses multiple partials dirs, templates in "shared/templates/" are shared
  // with the client-side of the app (see below).
  partialsDir: [
    'views/partials/'
  ]
});

// template engine
app.engine('html', handlebars.engine);

// routes config
require('./config/routes')(app);

// Start listening
app.listen(port);

// process event handlers
process.on('uncaughtException', function (err) {
  // handle the error safely
  winston.error('Uncaught Exception. Stack trace:\n%s', err.stack);
});

winston.info("Server listening %s", port);

module.exports = app;