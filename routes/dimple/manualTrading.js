var express = require('express');
var router = express.Router();
var io = require('../../socketio.js');

var net = require('net');
var client = null;

var localOrderNo = 0;

router.get('/', function(req, res, next) {
  res.render('dimple/manualTrading');
});

router.get('/connect', function(req, res, next) {
  client = new net.Socket();
  client.on('connect', function() {
    io.emit('dimple/manualTrading', {
      messageType: 'connect'
    });
  });
  client.on('close', function(hasError) {
    console.log('connection close, hasError: ' + hasError);
    io.emit('dimple/manualTrading', {
      messageType: 'disconnect'
    });
  });
  client.on('error', function(err) {
    console.log(err);
  });
  client.on('data', function(data) {
    var dataStr = data.toString();
    console.log(dataStr);
    var dataArr = dataStr.split('|');
    var msgType = dataArr[0];
    if (msgType == 'OnRtnTraderInsertOrders') {
      processCreateOrderResponse(dataArr);
    }
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

router.post('/createOrder', function(req, res, next) {
  console.log(req.body);
  var orderTime = new Date();
  orderTime = orderTime.getHours() 
                + ':' + orderTime.getMinutes() 
                + ':' + orderTime.getSeconds() 
                + '.' + orderTime.getMilliseconds()
  
  var msg = 'ReqTraderInsertOrders' + '|'
            + ++localOrderNo + '|'
            + '|'
            + req.body['clientId'] + '|'
            + req.body['contractId'] + '|'
            + req.body['bsFlag'] + '|'
            + req.body['eoFlag'] + '|'
            + req.body['shFlag'] + '|'
            + req.body['stopPrice'] + '|'
            + req.body['price'] + '|'
            + req.body['qty'] + '|'
            + req.body['orderType'] + '|'
            + req.body['orderAttr'] + '|'
            + orderTime + '|'
            + '|'
            + req.body['tradePurpose']
            + '\0';
  console.log(msg);
  client.write(msg);
  
  res.send({
    success: true
  });
});

function processCreateOrderResponse(dataArr) {
  if (dataArr[1] == 'true') {
    var dataObj = {
      sysOrderNo: dataArr[2],
      localOrderNo: dataArr[3],
      traderNo: dataArr[4],
      memberId: dataArr[5],
      clientId: dataArr[6],
      contractId: dataArr[7],
      exchCode: dataArr[8],
      bsFlag: dataArr[9],
      eoFlag: dataArr[10],
      shFlag: dataArr[11],
      price: dataArr[12],
      qty: dataArr[13],
      orderType: dataArr[14],
      orderAttr: dataArr[15],
      orderTime: dataArr[16],
      orderBatchNo: dataArr[17],
      tradeType: dataArr[18],
      tradingDay: dataArr[19],
      status: dataArr[20],
      actArbiContractId: dataArr[21],
      remainAmt: dataArr[22],
      type: dataArr[23],
      tradePurpose: dataArr[24]
    };
    io.emit('dimple/manualTrading', {
      messageType: 'order',
      data: dataObj
    })
  }
}

module.exports = router;
