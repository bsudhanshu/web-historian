var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');
var request = require('request');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, 'utf8', function(err, data) {
    if (err) { throw err; }
    var urls = data.split('\n');
    callback(urls);
  });
};

exports.isUrlInList = function(url, callback) {
  exports.readListOfUrls(function(urls) {
    var isUrlThere = _.contains(urls, url.split('\n')[0]);
    callback(isUrlThere);
  });
};

exports.addUrlToList = function(url, callback) {
  exports.isUrlInList(url, function(inList) {
    if (!inList) {
      fs.appendFile(exports.paths.list, url);
    }
    callback(); 
  });
};

exports.isUrlArchived = function(url, callback) {
  fs.readdir(exports.paths.archivedSites, (err, files) => {
    if (err) { throw err; }
    var isFileArchived = _.contains(files, url);
    callback(isFileArchived); 
  });
};

exports.downloadUrls = function(urls) {
  urls.forEach(url => { 
    request('http://' + url, function(error, response, body) {
      if (url) {
        var fixturePath = exports.paths.archivedSites + '/' + url;
        fs.writeFile(fixturePath, body, function(err) {
          if (err) { throw err; }
        }); 
      }
    });
  });
};
  
// Create or clear the file.
// var fd = fs.openSync(fixturePath, 'w');
// fs.writeSync(fd, 'google');
// fs.closeSync(fd);

// // Write data to the file.
// fs.writeFileSync(fixturePath, body);
// console.log('error:', error); // Print the error if one occurred 
// console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received 
// console.log('body:', body); // Print the HTML for the Google homepage. 
//   https.get({
//     host: url
//    // path: ''
//   }, function(response) {
//     var body = '';
//     response.on('data', function(chunk) {
//       body += chunk;
//     });
//     response.on('end', function() {
//       var fixturePath = exports.paths.archivedSites + '/' + url;
//       var fd = fs.openSync(fixturePath, 'w');
//       fs.write(fd, body, function() {
//         fs.close(fd);
//       });
//     });
//   });
