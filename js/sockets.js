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
                _('#uptimeField').html(data.data);
                break;
            case 'heartbeat':
                var duinoType = data.data.type;
                var duinoId = data.data.id;
                var heartbeat = data.data.heartbeat;
                var _duino = _('#duino-' + duinoId);

                _duino.children('#type').html(duinoType);
                _duino.children('.duino-id').html(duinoId);
                _duino.children('#last-heartbeat').html(heartbeat);

                var _template = _duino.children('#template');
                if (!_template.data('init')) {
                    initTemplateActions(_template, duinoType, duinoId);
                }
                console.log(data);

                break;
            default:
                break;
        }
    });

    function initTemplateActions(_template, type, id) {
        if (type == 'relay') {
            var _cloneMe = _('.relay-template');
            var _relayTemplate = _(_cloneMe.item(0).cloneNode(true));
            _relayTemplate.data('id', id);
            _template.item(0).appendChild(_relayTemplate.item(0));

            var _lightState = _('.relay-template .lights-state');
            var lightState = _.http('/lightsState').get();
            function getStateString(state) {
                return state == 0 ? "off" : state == 1 ? "on" : "off"
            }
            lightState.then(function (data) {
                _lightState.html(getStateString(data));
            }).catch(function (err) {
                console.log(`oops! ${err}`);
            })
            _('.relay-template .off-button').bind('click', function () {
                console.log('off');
                var lightsOff = _.http('/lightsOff').post();
                lightsOff.then(function (data) {
                    _lightState.html(getStateString(data));
                });
            });

            _('.relay-template .on-button').bind('click', function () {
                console.log('on');
                var lightsOn = _.http('/lightsOn').post();
                lightsOn.then(function (data) {
                    _lightState.html(getStateString(data));
                });
            });


            _relayTemplate.removeClass('hidden');
        } else {
        }

        _template.data('init', true);
    }
});