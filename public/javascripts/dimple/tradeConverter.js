$(function() {
    var socket = io('http://localhost:88');
    var btnConnect = $('#btnConnect');
    var lblConnectStatus = $('#lblConnectStatus');
    var btnSend = $('#btnSend');
    
    socket.on('dimple/tradeConverter', onDimpleTradeConverter);
    
    btnConnect.on('click', onBtnConnectClick);
    btnSend.on('click', onBtnSendClick);

    function onDimpleTradeConverter(message) {
        if (message.messageType == 'disconnect') {
            lblConnectStatus.text('Disconnected');
            btnConnect.button('connect');
        }
        else if (message.messageType == 'connect') {
            lblConnectStatus.text('Connected');
            btnConnect.button('disconnect');
        }
        else if (message.messageType == 'response') {
            $('#taResContent').val(message.data);
        }
    }
    
    function onBtnConnectClick(event) {
        if (lblConnectStatus.text() == 'Disconnected') {
            $.ajax({
                url: '/dimple/tradeConverter/connect',
                cache: false
            });
        }
        else {
            $.ajax({
                url: '/dimple/tradeConverter/disconnect',
                cache: false
            });
        }
    }
  
    function onBtnSendClick(event) {
        if (lblConnectStatus.text() == 'Disconnected')
            return;
        $.ajax({
            url: '/dimple/tradeConverter/request',
            method: 'POST',
            data: {
                reqContent: $('#taReqContent').val()
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