var express = require('express');
var router = express.Router();
var http = require('http');
var io = require('../socketio.js');


router.get('/', function(req, res, next) {
  res.render('BocomFx/BocomFx');
});

router.post('/Send', function(req, res, next) {
  var postData = req.body['reqContent'];

  var options = {
    host: '182.251.43.38',
    port: 20001,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };

  var req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
      console.log(`BODY: ${chunk}`);
      io.emit('BocomFx', {
        data: chunk
      });
    });
    res.on('end', () => {
      console.log('No more data in response.');
    });
  });

  req.on('error', (e) => {
    console.log(`problem with request: ${e.message}`);
  });

  // write data to request body
  req.write(postData);
  req.end();

});

module.exports = router;
