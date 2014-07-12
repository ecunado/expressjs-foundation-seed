"use strict";

var winston = require('winston'),
  express = require('express'),
  I18n = require('i18n-2');

module.exports = function (app) {

  // Attach the i18n property to the express request object
  I18n.expressBind(app, {
    directory: __dirname + '/../i18n/',
    cookieName: 'lang',
    devMode: app.get('dev'),
    locales: ['es', 'en'], // locales available
    defaultLocale: 'es', // default locale
    subdomain: true // get locale from subdomain
  });

  // set locale from cookie
  app.use(function (req, res, next) {
    req.i18n.setLocaleFromCookie();
    next();
  });

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