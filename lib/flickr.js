var fs = require("fs"),
  config = JSON.parse(fs.readFileSync(__dirname + "/../config.json")),
  debug;

if (config.node_env === "development") {
  debug = true;
} else {
  debug = false;
}

var FlickrAPI = require("flickr-oauth/index").FlickrAPI,
  API_KEY = config.api_key,
  API_SECRET = config.api_secret,
  flickr = new FlickrAPI(API_KEY, API_SECRET);

function getUserPhotos(auth_token, auth_token_secret, userId, callback) {
  "use strict";
  flickr.authenticate(auth_token, auth_token_secret)
    .people.getPhotos(userId, function (err, data) {
    if (err) {
      console.log(err);
    }
    if (callback) {
      callback.call(data);
    }
  });
}

function getUserCollections(auth_token, auth_token_secret, userId, callback) {
  "use strict";
  var albums = [];
  flickr.authenticate(auth_token, auth_token_secret)
    .collections.getTree(userId, function (err, data) {
    if (err) {
      console.log(err);
    }
    var collections = data.collections.collection;
    if (debug) {
      //console.log(JSON.stringify(collections, null, 4));
      fs.writeFileSync(__dirname + "/../tmp/collections-raw.json",
        JSON.stringify(collections, null, 4));
    }
    for (var i = 0, ilen = collections.length; i < ilen; i++) {
      var collection = [];
      for (var x = 0, xlen = collections[i].set.length; x < xlen; x++) {
        collection.push({
          id: collections[i].set[x].id,
          title: collections[i].set[x].title
        });
      }
      albums.push({
        title: collections[i].title,
        albums: collection
      });
    }
    if (callback) {
      callback.call(albums);
    }
  });
}

function getUserPhotoSets(auth_token, auth_token_secret, userId, callback) {
  "use strict";
  var albums = [];
  flickr.authenticate(auth_token, auth_token_secret)
    .photosets.getList(userId, function (err, data) {
    if (err) {
      console.log(err);
    }
    var photoSets = data.photosets.photoset;
    if (debug) {
      //console.log(JSON.stringify(photoSets, null, 4));
      fs.writeFileSync(__dirname + "/../tmp/sets-raw.json",
        JSON.stringify(albums, null, 4));
    }
    for (var i = 0, len = photoSets.length; i < len; i++) {
      albums.push({
        id: photoSets[i].id,
        title: photoSets[i].title._content
      });
    }
    if (callback) {
      callback.call(albums);
    }
  });
}

function getPhotoSetPhotos(auth_token, auth_token_secret, id, callback) {
  "use strict";
  var extras = {
    extras: ["url_q", "url_n", "url_z", "url_o"]
  };
  flickr.authenticate(auth_token, auth_token_secret)
    .photosets.getPhotos(id, extras, function (err, data) {
    if (err) {
      console.log(err);
    }
    var photos = [];
    if (data.stat !== "fail") {
      var photoSet = data.photoset.photo;
      if (debug) {
        //console.log(JSON.stringify(photoSets, null, 4));
        fs.writeFileSync(__dirname + "/../tmp/photoset-" + id + "-raw.json",
          JSON.stringify(photoSet, null, 4));
      }
      for (var i = 0, len = photoSet.length; i < len; i++) {
        var title, large_url;
        //var thumb_url;
        title = photoSet[i].title.slice(0, -4)
          .replace(/[^A-Za-z0-9]+/g, " ");
        large_url = "http://farm" +
          photoSet[i].farm + ".static.flickr.com/" +
          photoSet[i].server + "/" + photoSet[i].id +
          "_" + photoSet[i].secret + "_b.jpg";
        // thumb_url = "http://farm" +
        //     photoSet[i].farm + ".static.flickr.com/" +
        //     photoSet[i].server +
        //     "/" + photoSet[i].id +
        //     "_" + photoSet[i].secret +
        //     "_q.jpg";
        photos.push({
          title: title,
          thumb: photoSet[i].url_q,
          small: photoSet[i].url_n,
          medium: photoSet[i].url_z,
          large: large_url,
          original: photoSet[i].url_o
        });
        //photos.push({id: photoSet[i].id,
        //    title: photoSet[i].title,
        //    secret: photoSet[i].secret,
        //    farm: photoSet[i].farm,
        //    server: photoSet[i].server});
      }
    }
    if (callback) {
      callback.call(photos.reverse());
    }
  });
}

module.exports = {
  getUserPhotos: getUserPhotos,
  getUserPhotosets: getUserPhotoSets,
  getPhotoSetPhotos: getPhotoSetPhotos,
  getUserCollections: getUserCollections
};