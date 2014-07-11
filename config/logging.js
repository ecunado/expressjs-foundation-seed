"use strict";

var winston = require('winston');

module.exports = function (app, config) {

  // Redefine Console transport
  winston.add(winston.transports.Console, {
    level: 'debug',
    silent: false,
    colorize: true,
    timestamp: true
  });

};