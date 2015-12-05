// DEPENDENCIES
// ============
var express = require("express"),
    path = require("path"),
    http = require("http"),
    port = (process.env.PORT || 1251),
    server = module.exports = express();

// SERVER CONFIGURATION
// ====================
server.configure(function() {
  console.log("Starting up");
  console.log(process.cwd() + "/public/");
  console.log(__dirname);
  server.use(express["static"](process.cwd() + "/public/"));



  server.use(express.errorHandler({

    dumpExceptions: true,

    showStack: true

  }));

  server.use(express.bodyParser())

  server.use(server.router);

});

// SERVER
// ======

// Start Node.js Server
http.createServer(server).listen(port);

console.log('Welcome to Battlebets!\n\nPlease go to http://localhost:' + port + ' to start using Require.js and Backbone.js');