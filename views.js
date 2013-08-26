function getViews(express, app, config, flickr) {
  "use strict";
  var OAUTH_TOKEN = config.oauth_token,
      OAUTH_SECRET = config.oauth_secret;

  app.use(express.static(__dirname + "/static"));
  
  var collections = [],
      photosets = [];

  function getCollections() {
    for (var i = 0, ilen = albums.collections.length; i < ilen; i++) {
      var item = [];
      for (var x = 0, xlen = albums.collections[i].albums.length; x < xlen; x++) {
        item.push("<li><a href='/gallery?album=" + albums.collections[i].albums[x].id + "&title=" + albums.collections[i].albums[x].title.replace(/_/gi, " ") + "'><i class='icon-camera'></i>&nbsp;"  + albums.collections[i].albums[x].title.replace(/_/gi, " ") + "</a></li>");
      }
      if (albums.collections[i].title !== "Root") {
        collections.unshift("<li class='expanded'><a href=#><i class='icon-folder-close'></i>&nbsp;" + albums.collections[i].title + "</a><ul class='sublist'>" + item.join("") + "</ul></li>");
      } else {
        collections.push(item.join(""));
      }
    }
  }

  function getSets() {
    for (var i = 0, len = albums.photosets.length; i < len; i++) {
      photosets.push("<li><a href='/gallery.html?album=" + albums.photosets[i].id + "&title=" + albums.photosets[i].title.replace(/_/gi, " ") + "'><i class='icon-camera'></i>&nbsp;"  + albums.photosets[i].title.replace(/_/gi, " ") + "</a></li>");
    }
  }

  app.get("/", function (req, res) {
    if (config.use === "collections") {
      if (!collections.length) {
        getCollections();
      }
      res.render("index", {
        title : config.title,
        quote : config.quote,
        author : config.quoteAuthor,
        getAlbums : JSON.stringify(collections)
      });
    } else {
      if (!photosets.length) {
        getSets();
      }
      res.render("index", {
        title : config.title,
        quote : config.quote,
        author : config.quoteAuthor,
        getAlbums : JSON.stringify(photosets)
      });
    }
  }); // End "/"

  app.get("/gallery", function (req, res) {
    flickr.getPhotoSetPhotos(OAUTH_TOKEN, OAUTH_SECRET, req.query.album,
      function () {
        var data = [];
        for (var i = 0, ilen = this.length; i < ilen; i++) {
          data.push({large:this[i].large, thumb:this[i].thumb});
        }
        if (config.use === "collections") {
          if (!collections.length) {
            getCollections();
          }
          res.render("gallery", {
            meta : config.use,
            title : req.query.title,
            data : JSON.stringify(data),
            getAlbums : JSON.stringify(collections)
          });
        } else {
          if (!photosets.length) {
            getSets();
          }
          res.render("gallery", {
            meta : config.use,
            title : req.query.title,
            data : JSON.stringify(data),
            getAlbums : JSON.stringify(photosets)
          });
        }
      });
  }); // End "/gallery"
} // End getViews

exports.getViews = getViews;