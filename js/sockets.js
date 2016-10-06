_(document).bind('DOMContentLoaded', function () {
    var socket = io(location.host);
    socket.on('connected', function (data) {
        console.log(data);
        socket.emit('ack', {
            type: 'connected',
            data: 'hi!'
        });
    });

    socket.on('data', function (data) {
        // console.log(data);

        switch (data.type) {
            case 'uptime':
                updateUptime(data);
                break;

            case 'heartbeat':
                updateDuino(data.data);
                break;

            case 'ping':
                break;

            default:
                break;
        }
    });

    function updateUptime(data) {
        _('#uptimeField').html(data);
    }

    function updateDuino(duino) {
        var duinoType = duino.type;
        var duinoId = duino.id;
        var heartbeat = duino.heartbeat;
        var _duino = _('#duino-' + duinoId);

        _duino.children('#type').html(duinoType);
        _duino.children('.duino-id').html(duinoId);
        _duino.children('#last-heartbeat').html(heartbeat);

    }
});