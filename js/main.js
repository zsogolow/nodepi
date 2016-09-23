_(document).bind('DOMContentLoaded', function () {

    if ('ontouchstart' in document.documentElement) {
        document.body.classList.add('touch-enabled');
    }

    var _tabs = _('.tab'),
        _sections = _('.tab-section'),
        _tabsContainer = _('.tabs'),
        _menuToggle = _('.menu-icon');


    _tabs.bind('click', function() {
        var _clicked = _(this);
        _tabs.removeClass('active');
        _sections.removeClass('active');
        _clicked.addClass('active');
        _('.tab-section[data-tab="' + _clicked.data('tab') + '"]').addClass('active');
    });

    _menuToggle.bind('click', function () {
        _menuToggle.toggleClass('open');
       _tabsContainer.toggleClass('open');
    });

    function init() {
        _(_tabs.item(0)).addClass('active');
        _(_sections.item(0)).addClass('active');
    }

    function resize(event) {
    }
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