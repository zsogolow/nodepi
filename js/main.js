_(document).bind('DOMContentLoaded', function () {

    if ('ontouchstart' in document.documentElement) {
        document.body.classList.add('touch-enabled');
    }

    var _tabs = _('.tab'),
        _sections = _('.tab-section'),
        _tabsContainer = _('.tabs'),
        _menuToggle = _('.menu-icon');

    function clickTab(tab) {
        var netContent = _.http('/html/' + tab + '.html').get();
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
                for (var i = 1; i <= 6; i++) {
                    (function (i) {
                        setTimeout(function () {
                            _.http('/ping?id=' + i).get();
                        }, 10);
                    })(i);
                }
                // var _lightState = _('.relay-template .lights-state');
                // var lightState = _.http('/lightsState').get();
                // function getStateString(state) {
                //     return state == 0 ? "off" : state == 1 ? "on" : "off"
                // }
                // lightState.then(function (data) {
                //     _lightState.html(getStateString(data));
                // }).catch(function (err) {
                //     console.log(`oops! ${err}`);
                // })
                // _('.relay-template .off-button').bind('click', function () {
                //     console.log('off');
                //     var lightsOff = _.http('/lightsOff').post();
                //     lightsOff.then(function (data) {
                //         _lightState.html(getStateString(data));
                //     });
                // });

                // _('.relay-template .on-button').bind('click', function () {
                //     console.log('on');
                //     var lightsOn = _.http('/lightsOn').post();
                //     lightsOn.then(function (data) {
                //         _lightState.html(getStateString(data));
                //     });
                // });

                break;
            default:
                break;
        }
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

    function resize(event) { }
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