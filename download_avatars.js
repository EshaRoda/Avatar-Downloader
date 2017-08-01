var request = require('request');
var fs = require('fs');
var input = process.argv.slice(2);
var USR_AGENT = "Avatar Downloader";

var GITHUB_USER = "EshaRoda";
var GITHUB_TOKEN = "b0ce24201fad9fba486f90ad22e678218c420707";

if (input.length !== 2) {
  console.log("Please Enter Owner Name and Repo");
  return false;
}

console.log('Welcome to the GitHub Avatar Downloader!');


function getRepoContributors(repoOwner, repoName, cb) {
  var requestURL = "https://" + GITHUB_USER + ":" + GITHUB_TOKEN + "@api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors";
  var options = {
    'url': requestURL,
    'headers': {
      'User-Agent': USR_AGENT
    }
  };
    request(options, function(err, response, body) {
    if (err) throw err;
    cb(err, JSON.parse(body));
  });
};


function downloadImageByURL(url, filePath) {
  request.get(url)
    .on('error', function (err) {
      console.log('Error Found!');
      throw err;
    })
    .on('response', function (response) {
      console.log('Response Status Code: ' + response.statusCode + ' ' + filePath );
    })
    .pipe( fs.createWriteStream(filePath))
    .on('finish', function() {
    console.log('Download complete: ' + filePath);
  });
}


getRepoContributors(input[0], input[1], function(err, result) {
  if (err)
    console.log("Errors:", err);
  result.forEach(function (user) {
    downloadImageByURL(user.avatar_url, "./avatars/" + user.login + '.jpg');
  });
});