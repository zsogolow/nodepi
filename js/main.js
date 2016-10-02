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

                    var _networkListDiv = _('#network-list');
                    for (var prop in netInfo) {
                        if (netInfo.hasOwnProperty(prop)) {
                            var netCon = netInfo[prop];
                            var networkDiv = generateNetConDiv(netCon);
                            _networkListDiv.item(0).appendChild(networkDiv);
                        }
                    }

                }).catch(function (err) {
                    console.log(`oops! ${err}`);
                });
                break;

            case 'duinos':
                var lightState = _.http('/lightState').get();
                lightState.then(function (data) {
                    _("#lightState").html(data == 0 ? "off" : data == 1 ? "on" : "off");
                    console.log(data);
                }).catch(function (err) {
                    console.log(`oops! ${err}`);
                })
                _('#offButton').bind('click', function () {
                    console.log('off');
                    _.http('/lightsOff').post();
                });

                _('#onButton').bind('click', function () {
                    console.log('on');
                    _.http('/lightsOn').post();
                });
                break;
            default:
                break;
        }
    }

    function generateNetConDiv(netCon) {
        var _div = _.create('div');
        _div.html(netCon);
        return _div.item(0);
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