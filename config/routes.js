"use strict";

var winston = require('winston'),
  express = require('express');

module.exports = function (app) {

  // home
  app.get('/', function (req, res) {
    res.render('index.html');
  });

  // Static content routing
  app.use(express.static(__dirname + '/../public/'));

  // 404 routes
  app.use(function (req, res, next) {
    winston.verbose('[API 404 ERROR] %s -- %s %s', req.ip, req.method, req.url);
    next();
  });

  // Error handling
  app.use(function (err, req, res, next) {
    // TODO
  });

};