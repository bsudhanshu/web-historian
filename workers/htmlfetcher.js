// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.htmlFetcher = function() {
  archive.readListOfUrls(function (urls) {
    archive.downloadUrls(urls);
  });
};

exports.htmlFetcher();