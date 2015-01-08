var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var http = require('http');
var https = require('https');
var fs = require('fs');
var settings = require('settings');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  res.send('impropa server');
});

app.post('/set-impropa/', function (req, res) {
  if (req.body.secret_handshake && req.body.secret_handshake == settings.secret_handshake) {

    var new_file_location = settings.full_image_directory + req.body.new_filename;
    var file = fs.createWriteStream(new_file_location);

    if (req.body.image_url.substring(0, 5) == "https") {
      var request = https.get(req.body.image_url, function(response) {
        response.pipe(file);
      });
    } else {
      var request = http.get(req.body.image_url, function(response) {
        response.pipe(file);
      });
    }

    res.send(settings.url_the_image_will_become_available_on + req.body.new_filename);
  } else {
    res.send('impropa server');
  }
});

app.use(function (req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

var server = app.listen(settings.server_port, function () {

  var port = server.address().port;
  console.log('Listening at port %s', port);
});

