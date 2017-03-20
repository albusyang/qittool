var express = require('express');
var router = express.Router();
var io = require('../socketio.js');

var net = require('net');
var client = null;
var clientTrade = null;

var messageId = 0;

router.get('/', function(req, res, next) {
  res.render('QuantitativeHedgingPlatform/QuantitativeHedgingPlatform');
});

router.get('/Connect', function(req, res, next) {
  client = new net.Socket();
  client.on('connect', function() {
    io.emit('QuantitativeHedgingPlatform', {
      header: {
        eventType: 'connect'
      }
    });
  });
  client.on('close', function(hasError) {
    console.log('connection close, hasError: ' + hasError);
    io.emit('QuantitativeHedgingPlatform', {
      header: {
        eventType: 'disconnect'
      }
    });
  });
  client.on('error', function(err) {
    console.log(err);
  });
  client.on('data', function(data) {
    var jsonString = data.toString();
    console.log(jsonString);
    var message = JSON.parse(jsonString);
    if (message.header.messageType == 'RESPONSE') {
      message.header.time = new Date();
      message.header.eventType = "response";
      io.emit('QuantitativeHedgingPlatform', message);
    }
    else if (message.header.messageType == 'QUOTE') {
      message.header.eventType = 'quote';
      io.emit('QuantitativeHedgingPlatform', message);
    }
  });
  
  client.connect({
    host: '127.0.0.1',
    port: 23001
  });
  
  res.send({
    success: true
  });
});

router.get('/Disconnect', function(req, res, next) {
  if (client)
    client.destroy();
  res.send({
    success: true
  });
});

router.post('/Subscribe', function(req, res, next) {
  console.log(req.body);
  messageId++;
  var message = {
      header: {
        messageId: '' + messageId,
        messageType: 'REQUEST',
        action: 'subscribe'
      },
      body: {
          code: req.body['code']
      }
  };

  io.emit('QuantitativeHedgingPlatform', {
    header: {
      messageId: '' + messageId,
      messageType: 'REQUEST',
      eventType: 'request',
      action: 'subscribe',
      time: new Date()
    },
    body: {
        code: req.body['code']
    }
  });

  var jsonString = JSON.stringify(message);
  jsonString += '\r\n';
  console.log(jsonString);

  client.write(jsonString);
  
  res.send({
    success: true
  });

});

router.get('/ConnectTrade', function(req, res, next) {
  clientTrade = new net.Socket();
  clientTrade.on('connect', function() {
    io.emit('QuantitativeHedgingPlatform', {
      header: {
        eventType: 'connectTrade'
      }
    });
  });
  clientTrade.on('close', function(hasError) {
    console.log('trade connection close, hasError: ' + hasError);
    io.emit('QuantitativeHedgingPlatform', {
      header: {
        eventType: 'disconnectTrade'
      }
    });
  });
  clientTrade.on('error', function(err) {
    console.log(err);
  });
  clientTrade.on('data', function(data) {
    var jsonString = data.toString();
    console.log(jsonString);
    var message = JSON.parse(jsonString);
    if (message.header.messageType == 'RESPONSE') {
      message.header.time = new Date();
      message.header.eventType = "response";
      io.emit('QuantitativeHedgingPlatform', message);
    }
  });
  
  clientTrade.connect({
    host: '127.0.0.1',
    port: 24001
  });
  
  res.send({
    success: true
  });
});

router.get('/DisconnectTrade', function(req, res, next) {
  if (clientTrade)
    clientTrade.destroy();
  res.send({
    success: true
  });
});

router.post('/CreateOrder', function(req, res, next) {
  console.log(req.body);
  messageId++;
  var message = {
      header: {
        messageId: '' + messageId,
        messageType: 'REQUEST',
        action: 'createOrder'
      },
      body: {
          code: req.body['code'],
          side: req.body['side'],
          quantity: req.body['quantity']
      }
  };

  io.emit('QuantitativeHedgingPlatform', {
    header: {
      messageId: '' + messageId,
      messageType: 'REQUEST',
      eventType: 'request',
      action: 'createOrder',
      time: new Date()
    },
    body: {
        code: req.body['code'],
        side: req.body['side'],
        quantity: req.body['quantity']
    }
  });

  var jsonString = JSON.stringify(message);
  jsonString += '\r\n';
  console.log(jsonString);

  clientTrade.write(jsonString);
  
  res.send({
    success: true
  });

});

module.exports = router;
