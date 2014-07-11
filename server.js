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
var development = (port != 80);

// Disable X-Powered-By HTTP response header 
app.disable('x-powered-by');
app.set('view engine', 'html');
if (!development) {
  app.enable('view cache');
}

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

module.exports = app;