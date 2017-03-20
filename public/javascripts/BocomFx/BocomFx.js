$(function() {
    var socket = io('http://localhost:88');
    var btnSend = $('#btnSend');

    socket.on('BocomFx', onBocomFx);
    
    btnSend.on('click', onBtnSendClick);

    function onBocomFx(data) {
        $('#taResContent').val(data.data);
    }
  
    function onBtnSendClick(event) {
        $.ajax({
            url: '/BocomFx/Send',
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