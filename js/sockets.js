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
                updateDuino(data.data);
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

        var _template = _duino.children('#template');
        if (!_template.data('init')) {
            initTemplateActions(_template, duinoType, duinoId);
        }

        console.log(duino);
    }

    function initTemplateActions(_template, type, id) {
        if (type == 'relay') {
            var _cloneMe = _('.relay-template');
            var _relayTemplate = _(_cloneMe.item(0).cloneNode(true));
            _relayTemplate.data('id', id);
            _template.item(0).appendChild(_relayTemplate.item(0));

            var holla = {
                'id': id + ''
            };

            var _lightState = _relayTemplate.children('.lights-state');
            var lightState = _.http('/lightsState?id=' + id).get();

            function getStateString(state) {
                return state == 0 ? "off" : state == 1 ? "on" : "off"
            }
            lightState.then(function (data) {
                _lightState.html(getStateString(data));
            }).catch(function (err) {
                console.log(`oops! ${err}`);
            })
            _relayTemplate.children('.off-button').bind('click', function () {
                console.log('off');
                var lightsOff = _.http('/lightsOff').post(holla);
                lightsOff.then(function (data) {
                    _lightState.html(getStateString(data));
                });
            });

            _relayTemplate.children('.on-button').bind('click', function () {
                console.log('on');
                var lightsOn = _.http('/lightsOn').post(holla);
                lightsOn.then(function (data) {
                    _lightState.html(getStateString(data));
                });
            });


            _relayTemplate.removeClass('hidden');
        } else { }

        _template.data('init', true);
    }
});