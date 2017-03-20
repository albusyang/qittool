$(function() {
    var socket = io('http://localhost:88');
    var btnConnect = $('#btnConnect');
    var btnSubscribe = $('#btnSubscribe');
    var btnConnectTrade = $('#btnConnectTrade');
    var btnSell = $('#btnSell');
    var btnBuy = $('#btnBuy');
    
    socket.on('QuantitativeHedgingPlatform', onQuantitativeHedgingPlatform);
    
    btnConnect.on('click', onBtnConnectClick);
    btnSubscribe.on('click', onBtnSubscribeClick);

    btnConnectTrade.on('click', onBtnConnectTradeClick);
    btnSell.on('click', onBtnSellClick);
    btnBuy.on('click', onBtnBuyClick);

    var tblMessage = $('#tblMessage').DataTable({
        order: [[0, 'desc']],
        columns: [
            {data: 'header.time'},
            {data: 'header.messageId'},
            {data: 'header.messageType', defaultContent: ''},
            {data: 'header.action'},
            {
                data: 'body',
                render: function (data, type, row, meta) {
                    if (data)
                        return JSON.stringify(data);
                },
                defaultContent: ''
            },
            {data: 'header.success', defaultContent: ''},
            {data: 'header.errorMessage', defaultContent: ''}
        ]
    });

    var tblOrder = $('#tblOrder').DataTable({
        order: [[0, 'desc']],
        columns: [
            {data: 'header.time'},
            {data: 'header.messageId'},
            {data: 'header.messageType', defaultContent: ''},
            {data: 'header.action'},
            {
                data: 'body',
                render: function (data, type, row, meta) {
                    if (data)
                        return JSON.stringify(data);
                },
                defaultContent: ''
            },
            {data: 'header.success', defaultContent: ''},
            {data: 'header.errorMessage', defaultContent: ''}
        ]
    });
    
    function onQuantitativeHedgingPlatform(data) {
        var eventType = data.header.eventType;
        var action = data.header.action;
        if (eventType == 'disconnect') {
            btnConnect.button('connect');
        }
        else if (eventType == 'connect') {
            btnConnect.button('disconnect');
        }
        if (eventType == 'disconnectTrade') {
            btnConnectTrade.button('connect');
        }
        else if (eventType == 'connectTrade') {
            btnConnectTrade.button('disconnect');
        }
        else if (eventType == 'request' && action == 'subscribe') {
            tblMessage.row.add(data).draw();
        }
        else if (eventType == 'response' && action == 'subscribe') {
            tblMessage.row.add(data).draw();
        }
        else if (eventType == 'request' && action == 'createOrder') {
            tblOrder.row.add(data).draw();
        }
        else if (eventType == 'response' && action == 'createOrder') {
            tblOrder.row.add(data).draw();
        }
        else if (eventType == 'quote') {
            var newBidPrice = data.body['bidPrice'];
            var oldBidPrice = btnSell.text();
            if (newBidPrice > oldBidPrice) {
                btnSell.removeClass('btn-danger').addClass('btn-primary');
            }
            else if (newBidPrice < oldBidPrice) {
                btnSell.removeClass('btn-primary').addClass('btn-danger');
            }
            btnSell.text(newBidPrice);

            var newAskPrice = data.body['askPrice'];
            var oldAskPrice = btnBuy.text();
            if (newAskPrice > oldAskPrice) {
                btnBuy.removeClass('btn-danger').addClass('btn-primary');
            }
            else if (newAskPrice < oldAskPrice) {
                btnBuy.removeClass('btn-primary').addClass('btn-danger');
            }
            btnBuy.text(newAskPrice);
        }
    }
    
    function onBtnConnectClick(event) {
        if (btnConnect.text() == 'Connect') {
            $.ajax({
                url: '/QuantitativeHedgingPlatform/Connect',
                cache: false
            });
        }
        else {
            $.ajax({
                url: '/QuantitativeHedgingPlatform/Disconnect',
                cache: false
            });
        }
    }

    function onBtnSubscribeClick(event) {
        if (btnConnect.text() == 'Connect')
            return;
        $.ajax({
            url: '/QuantitativeHedgingPlatform/Subscribe',
            method: 'POST',
            data: {
                code: 'AU9999'
            },
            success: function(data, textStatus, jqXHR) {
                if (data.success == true) {

                }
                else {

                }
            }
        });
    }

    function onBtnConnectTradeClick(event) {
        if (btnConnectTrade.text() == 'Connect Trade') {
            $.ajax({
                url: '/QuantitativeHedgingPlatform/ConnectTrade',
                cache: false
            });
        }
        else {
            $.ajax({
                url: '/QuantitativeHedgingPlatform/DisconnectTrade',
                cache: false
            });
        }
    }

    function onBtnSellClick(event) {
        if (btnConnectTrade.text() == 'Connect Trade')
            return;
        $.ajax({
            url: '/QuantitativeHedgingPlatform/CreateOrder',
            method: 'POST',
            data: {
                code: 'AU9999',
                side: 'SELL',
                quantity: 1
            },
            success: function(data, textStatus, jqXHR) {
                if (data.success == true) {

                }
                else {

                }
            }
        });
    }
    function onBtnBuyClick(event) {
        if (btnConnectTrade.text() == 'Connect Trade')
            return;
        $.ajax({
            url: '/QuantitativeHedgingPlatform/CreateOrder',
            method: 'POST',
            data: {
                code: 'AU9999',
                side: 'BUY',
                quantity: 1
            },
            success: function(data, textStatus, jqXHR) {
                if (data.success == true) {

                }
                else {

                }
            }
        });
    }
  
    
});