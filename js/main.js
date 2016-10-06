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
                            var heartbeat = duino.heartbeat;
                            var _duino = _('#duino-' + duinoId);

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
            var _relayTemplate = _(_cloneMe.item(0).cloneNode(true));
            _relayTemplate.data('id', id);
            _template.item(0).appendChild(_relayTemplate.item(0));

            var holla = {
                'id': id + ''
            };

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
        } else {}

        _template.data('init', true);
    }

    function init() {
        _(_tabs.item(0)).addClass('active');
        _(_sections.item(0)).addClass('active');

        clickTab('os');

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