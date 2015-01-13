/**
 * jQuery plugin to produce the ripple effect from the Google Material Design spec:
 * http://www.google.com/design/spec/animation/responsive-interaction.html
 *
 * This plugin was modified from a codepen simulating the effect:
 * http://codepen.io/Craigtut/pen/dIfzv
 */
(function($, ua) {

    var
        // setTimeout reference
        timer = null,

        // Better testing of touch support
        // See https://github.com/ngryman/jquery.finger/blob/v0.1.2/dist/jquery.finger.js#L7
        isChrome = /chrome/i.exec(ua),
        isAndroid = /android/i.exec(ua),
        hasTouch = 'ontouchstart' in window && !(isChrome && !isAndroid),

        // Notify applications of the ripple effect
        setRipple = function($paper) {
            if (!$paper.data('ripple')) {
                $paper
                    .data('ripple', true)
                    .trigger('ripple');
            }
        };

    /**
     * jQuery.fn.ripple
     * @param {Object} options
     * @param {String} [options.color=#fff] The ripple effect color
     */
    $.fn.ripple = function(options) {
        var opts = $.extend({}, { color: '#fff' }, options);
        opts.event = (hasTouch && 'touchstart.ripple') || 'mousedown.ripple';
        opts.end_event = (hasTouch && 'touchend.ripple mouseleave.ripple') || 'mouseup.ripple mouseleave.ripple';

        $(this)
            // Bind the event to run the effect
            .on(opts.event, function(ev) {
                var x, y, touch_ev,
                    $paper = $(this),
                    $ink = $('<div/>'),
                    size = Math.max($paper.width(), $paper.height());

                // Set up ripple effect styles
                $paper
                    .trigger('beforeripple')
                    .addClass('ripple-active');
                $ink
                    .addClass('ripple-effect')
                    .css({height: size, width: size});

                // get click coordinates
                // logic = click coordinates relative to page
                // - position relative to page - half of self height/width to make it controllable from the center
                touch_ev = hasTouch ? ev.originalEvent.touches[0] : ev;
                x = touch_ev.pageX - $paper.offset().left - $ink.width()/2;
                y = touch_ev.pageY - $paper.offset().top - $ink.height()/2;

                // Set up ripple position and place it in the DOM
                $ink
                    .css({top: y + 'px', left: x + 'px', backgroundColor: opts.color})
                    .appendTo($paper);

                // Delayed trigger
                timer = setTimeout(function() { setRipple($paper); }, 2000);
            })
            // Bind the event to end the paper-press ripple
            .on(opts.end_event, function(ev) {
                var $paper = $(this),
                    $ink = $paper.find('.ripple-effect');

                // Trigger the ripple if we hadn't yet
                if (timer) {
                    clearTimeout(timer);
                    timer = null;
                    setRipple($paper);
                }

                // Remove ripple effect styles
                $paper
                    .trigger('afterripple')
                    .removeClass('ripple-active');
                $ink
                    .css({backgroundColor: 'transparent'})
                    .one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function() {
                        $ink.remove();
                        $paper.removeData('ripple');
                    });
            });

        // Chaining
        return $(this);
    };

}(window.jQuery, navigator.userAgent));
