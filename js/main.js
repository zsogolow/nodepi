_(document).bind('DOMContentLoaded', function () {

    if ('ontouchstart' in document.documentElement) {
        document.body.classList.add('touch-enabled');
    }

    var _tabs = _('.tab'),
        _sections = _('.tab-section'),
        _tabsContainer = _('.tabs'),
        _menuToggle = _('.menu-icon');

    function clickTab(tab) {
        var netContent = _.http('/' + tab).get();
        netContent.then(function (data) {
            _section = _('.tab-section[data-tab="' + tab + '"]');
            _section.addClass('active');
            _section.html(data);
            initTab(tab);
        });
    }

    function initTab(tab) {
        switch (tab) {
            case 'os':
                var osInfoPromise = _.http('/osInfo').get();
                osInfoPromise.then(function (data) {
                    var osInfo = JSON.parse(data);
                    console.log(osInfo);
                    _('#hostnameField').html(osInfo.hostname);
                    _('#loadavgField').html(osInfo.loadavg);
                    _('#uptimeField').html(osInfo.uptime);
                    _('#freememField').html(osInfo.freemem);
                    _('#totalmemField').html(osInfo.totalmem);
                    _('#cpusField').html(osInfo.cpus.length);
                    _('#typeField').html(osInfo.type);
                    _('#releaseField').html(osInfo.release);
                    _('#archField').html(osInfo.arch);
                    _('#platformField').html(osInfo.platform);
                    _('#eolField').html(osInfo.EOL);
                    _('#endiannessField').html(osInfo.endianness);
                }).catch(function (err) {
                    console.log(`oops! ${err}`);
                });
                break;

            case 'net':
                var netInfoPromise = _.http('/networkInfo').get();
                netInfoPromise.then(function (data) {
                    var netInfo = JSON.parse(data);
                    console.log(netInfo);
                }).catch(function (err) {
                    console.log(`oops! ${err}`);
                });
                break;

            case 'duinos':
                var duinos = _.http('/duinosState').get();
                duinos.then(function (data) {
                    var duinos = JSON.parse(data);
                    for (var prop in duinos) {
                        if (duinos.hasOwnProperty(prop)) {
                            var duino = duinos[prop];
                            var duinoType = duino.type;
                            var duinoId = duino.id;
                            var heartbeat = new Date(duino.heartbeat).toLocaleString();
                            var _duino = _('#duino-' + duinoId);
                            _duino.removeClass('hidden');
                            _duino.children('#type').html(duinoType);
                            _duino.children('.duino-id').html(duinoId);
                            _duino.children('#last-heartbeat').html(heartbeat);

                            var _template = _duino.children('#template');
                            if (!_template.data('init')) {
                                initTemplateActions(_template, duinoType, duinoId);
                            }
                        }
                    }
                }).catch(function (err) {
                    console.log(`oops! ${err}`);
                });

                break;
            default:
                break;
        }
    }

    function initTemplateActions(_template, type, id) {
        if (type == 'relay') {
            var _cloneMe = _('.relay-template');
            var cloneMe = _cloneMe.item(0);
            if (cloneMe) {
                var _relayTemplate = _(cloneMe.cloneNode(true));
                _relayTemplate.data('id', id);
                _template.item(0).appendChild(_relayTemplate.item(0));

                var holla = {
                    'id': id + ''
                };

                _relayTemplate.children('.off-button').bind('click', function () {
                    var lightsOff = _.http('/lightsOff').post(holla);
                    lightsOff.then(function (data) {}).catch(function (err) {});
                });

                _relayTemplate.children('.on-button').bind('click', function () {
                    var lightsOn = _.http('/lightsOn').post(holla);
                    lightsOn.then(function (data) {}).catch(function (err) {});
                });

                _relayTemplate.children('.ping-button').bind('click', function () {
                    var ping = _.http('/ping?id=' + id).get();
                    ping.then(function (data) {}).catch(function (err) {});
                });

                _relayTemplate.removeClass('hidden');
            }
        } else {
            var _cloneMe = _('.general-template');
            var cloneMe = _cloneMe.item(0);
            if (cloneMe) {
                var _genearlTemplate = _(cloneMe.cloneNode(true));
                _genearlTemplate.data('id', id);
                _template.item(0).appendChild(_genearlTemplate.item(0));

                var holla = {
                    'id': id + ''
                };

                _genearlTemplate.children('.ping-button').bind('click', function () {
                    var ping = _.http('/ping?id=' + id).get();
                    ping.then(function (data) {}).catch(function (err) {});
                });

                _genearlTemplate.removeClass('hidden');
            }
        }

        _template.data('init', true);
    }

    function initSocket() {
        var socket = io(location.host);
        socket.on('connected', function (data) {
            console.log(data);
            socket.emit('ack', {
                type: 'connected',
                data: 'hi!'
            });
        });

        socket.on('data', function (data) {
            switch (data.type) {
                case 'uptime':
                    updateUptime(data.data);
                    break;
                case 'heartbeat':
                    updateDuino(data.data);
                    break;
                case 'ping':
                    pong(data.data);
                    break;
                case 'relay_on':
                case 'relay_off':
                case 'relay_state':
                    updateDuinoLights(data.data);
                    break;
                default:
                    console.log(data.data);
                    break;
            }
        });

        function updateUptime(data) {
            _('#uptimeField').html(data);
        }

        function updateDuinoLights(duino) {
            var duinoType = duino.type;
            var duinoId = duino.id;
            var heartbeat = new Date(duino.heartbeat).toLocaleString();
            var _duino = _('#duino-' + duinoId);
            var lightsState = duino.extra;
            if (lightsState == 1) {
                _duino.removeClass('lights-off');
                _duino.addClass('lights-on');
            } else {
                _duino.removeClass('lights-on');
                _duino.addClass('lights-off');
            }
        }

        function updateDuino(duino) {
            var duinoType = duino.type;
            var duinoId = duino.id;
            var heartbeat = new Date(duino.heartbeat).toLocaleString();
            var _duino = _('#duino-' + duinoId);
            _duino.removeClass('hidden');
            _duino.children('#type').html(duinoType);
            _duino.children('.duino-id').html(duinoId);
            _duino.children('#last-heartbeat').html(heartbeat);

            var _template = _duino.children('#template');
            if (!_template.data('init')) {
                initTemplateActions(_template, duinoType, duinoId);
            }
        }

        function pong(duino) {
            var duinoId = duino.id;
            var _duino = _('#duino-' + duinoId);
            _duino.removeClass('hidden');
            _duino.addClass('pong');
            setTimeout(function () {
                _duino.removeClass('pong');
            }, 1000);
            // _duino.children('.pong-label').html('pong!');
            // setTimeout(function () {
            //     _duino.children('.pong-label').html('');
            // }, 2000);
        }
    }

    function init() {
        initSocket();

        _(_tabs.item(0)).addClass('active');
        _(_sections.item(0)).addClass('active');

        clickTab('duinos');

        _tabs.bind('click', function () {
            var _clicked = _(this);
            _tabs.removeClass('active');
            _sections.removeClass('active');
            _clicked.addClass('active');
            var tabData = _clicked.data('tab');
            clickTab(tabData);
        });

        _menuToggle.bind('click', function () {
            _menuToggle.toggleClass('open');
            _tabsContainer.toggleClass('open');
        });

        _('#powerButton').bind('click', function (evt) {
            if (confirm('are you sure you want to shut down?')) {
                var shutdownSig = _.http('/shutdown').post();
                shutdownSig.then(function (data) {
                    alert(data);
                }).catch(function (err) {
                    console.log(`oops! ${err}`);
                });
            }
        });

        _('#rebootButton').bind('click', function (evt) {
            if (confirm('are you sure you want to reboot?')) {
                var rebnootSig = _.http('/reboot').post();
                rebnootSig.then(function (data) {
                    alert(data);
                }).catch(function (err) {
                    console.log(`oops! ${err}`);
                });
            }
        });
    }

    function resize(event) {}
    var lastResizeEvent = undefined;
    var resizing = false;
    window.requestAnimationFrame = window.requestAnimationFrame || window.msRequestAnimationFrame;
    _(window).bind('resize', function (event) {
        lastResizeEvent = event;
        if (!resizing) {
            window.requestAnimationFrame(function () {
                resize(lastResizeEvent);
                resizing = false;
            });
        }
        resizing = true;
    });

    // finally, call the init method
    init();
});