$(function() {
    var socket = io('http://localhost:88');
    var btnConnect = $('#btnConnect');
    var lblConnectStatus = $('#lblConnectStatus');
    var btnCreate = $('#btnCreate');
    
    socket.on('DimpleTradeAdapter', onDimpleTradeAdapter);
    
    btnConnect.on('click', onBtnConnectClick);
    btnCreate.on('click', onBtnCreateClick);

    var tblOrder = $('#tblOrder').DataTable({
        columns: [
            {data: 'sysOrderNo'},
            {data: 'localOrderNo'},
            {data: 'contractId'},
            {data: 'bsFlag'},
            {data: 'eoFlag'},
            {data: 'shFlag'},
            {data: 'price'},
            {data: 'qty'},
            {data: 'orderType'},
            {data: 'orderAttr'},
            {data: 'orderTime'},
            {data: 'tradePurpose'}
        ]
    });
    
    function onDimpleTradeAdapter(data) {
        if (data.evtType == 'disconnect') {
            lblConnectStatus.text('Disconnected');
            btnConnect.button('connect');
        }
        else if (data.evtType == 'connect') {
            lblConnectStatus.text('Connected');
            btnConnect.button('disconnect');
        }
        else if (data.evtType == 'ordercreate') {
            tblOrder.row.add(data.data).draw();
        }
    }
    
    function onBtnConnectClick(event) {
        if (lblConnectStatus.text() == 'Disconnected') {
            $.ajax({
                url: '/DimpleTradeAdapter/Connect',
                cache: false
            });
        }
        else {
            $.ajax({
                url: '/DimpleTradeAdapter/Disconnect',
                cache: false
            });
        }
    }
  
    function onBtnCreateClick(event) {
        if (lblConnectStatus.text() == 'Disconnected')
            return;
        $.ajax({
            url: '/DimpleTradeAdapter/CreateOrder',
            method: 'POST',
            data: {
                clientId: $('#inpClientId').val(),
                contractId: $('#inpContractId').val(),
                bsFlag: $('#inpBsFlag').val(),
                eoFlag: $('#inpEoFlag').val(),
                shFlag: $('#inpShFlag').val(),
                stopPrice: $('#inpStopPrice').val(),
                price: $('#inpPrice').val(),
                qty: $('#inpQty').val(),
                orderType: $('#inpOrderType').val(),
                orderAttr: $('#inpOrderAttr').val(),
                tradePurpose: $('#inpTradePurpose').val()
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