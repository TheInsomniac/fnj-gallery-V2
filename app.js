var fs = require("fs"),
    config = JSON.parse(fs.readFileSync(__dirname + "/config.json")),
    flickr = require(__dirname + "/lib/flickr.js");

var host = config.host,
    port = config.port,
    debug;

// Globals
albums = {"collections":[], "photosets":[]};

// Production or Development mode?
process.env.NODE_ENV = config.node_env;

// create express app instance
var express = require("express"),
    stylus = require("stylus"),
    uglifyJS = require("uglifyjs-middleware"),
    app = new express();

// development only
if ("development" == app.get("env")) {
  app.locals.pretty = true;
  debug = true;
  if (!fs.existsSync(__dirname + "/tmp")) {
    fs.mkdirSync(__dirname + "/tmp");
  }
}

// production only
if ("production" == app.get("env")) {
  debug = false;
}

app.set("views", __dirname + "/views");
app.set("view engine", "jade");

app.use(express.compress());

app.use(stylus.middleware({
    src:  __dirname + "/static/stylus/",
    dest: __dirname + "/static/css/",
    debug: false,
    compile : function(str, path) {
      "use strict";
      //console.log("compiling");
      return stylus(str)
        .set("filename", path)
        .set("warn", false)
        .set("compress", true);
    }
  })
 );

app.use(uglifyJS(__dirname + "/static", {
    generateSourceMap: true
  }
));

// retrieve routes api from api.js
var api = require("./api").api;
var _api = new api(app, debug, fs, config, flickr);

// retrieve views settings
var getViews = require("./views").getViews;
var _getViews = new getViews(express, app, config, flickr);

// determine if we want to run the http server. Loaded from config
if (config.runServer) {
  app.listen(port, function () {
    "use strict";
    console.log("Started in " + app.get("env") + " mode");
    console.log("Server listening on:\nhttp://" + host + ":" + port +
                "\nPress CTRL-C to terminate");
  });
}
