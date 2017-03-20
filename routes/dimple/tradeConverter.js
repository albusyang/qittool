var express = require('express');
var router = express.Router();
var io = require('../../socketio.js');

var net = require('net');
var client = null;

var localOrderNo = 0;

router.get('/', function(req, res, next) {
  res.render('dimple/tradeConverter');
});

router.get('/connect', function(req, res, next) {
  client = new net.Socket();
  client.on('connect', function() {
    io.emit('dimple/tradeConverter', {
      messageType: 'connect'
    });
  });
  client.on('close', function(hasError) {
    console.log('connection close, hasError: ' + hasError);
    io.emit('dimple/tradeConverter', {
      messageType: 'disconnect'
    });
  });
  client.on('error', function(err) {
    console.log(err);
  });
  client.on('data', function(data) {
    var dataStr = data.toString();
    onData(dataStr);
  });
  
  client.connect({
    host: '127.0.0.1',
    port: 6770
  });
  
  res.send({
    success: true
  });
});

router.get('/disconnect', function(req, res, next) {
  if (client)
    client.destroy();
  res.send({
    success: true
  });
});

router.post('/request', function(req, res, next) {
  var msg = req.body['reqContent'];
  msg += '\0';

  console.log(msg);
  client.write(msg);
  
  res.send({
    success: true
  });
});

function onData(resContent) {
  io.emit('dimple/tradeConverter', {
    messageType: 'response',
    data: resContent
  })
}

module.exports = router;
