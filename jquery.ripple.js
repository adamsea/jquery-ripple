/**
 * jQuery plugin to produce the ripple effect from the Google Material Design spec:
 * http://www.google.com/design/spec/animation/responsive-interaction.html
 *
 * This plugin was modified from a codepen simulating the effect:
 * http://codepen.io/Craigtut/pen/dIfzv
 */
(function($, ua) {

	// Better testing of touch support
	// See https://github.com/ngryman/jquery.finger/blob/v0.1.2/dist/jquery.finger.js#L7
	var isChrome = /chrome/i.exec(ua);
	var isAndroid = /android/i.exec(ua);
	var hasTouch = 'ontouchstart' in window && !(isChrome && !isAndroid);

	/**
	 * jQuery.fn.ripple
	 * @param {Object} options
	 * @param {String} [options.event=mousedown] The interaction event
	 * @param {String} [options.color=#fff] The ripple effect color
	 */
	$.fn.ripple = function(options) {
		var opts = $.extend({}, {
				event: hasTouch && 'touchstart' || 'mousedown',
				color: '#fff'
			}, options);

		// Bind the event to run the effect
		$(this).on(opts.event, function(ev) {
			var x, y, touch_ev,
				$paper = $(this),
				$ink = $('<div/>'),
				size = Math.max($paper.width(), $paper.height());

			// Set up ripple styles
			$paper.addClass('ripple-active');
			$ink.addClass('ripple-effect');
			$ink.css({
				height: size,
				width: size
			});

			// get click coordinates
			// logic = click coordinates relative to page
			// - position relative to page - half of self height/width to make it controllable from the center
			touch_ev = hasTouch ? ev.originalEvent.touches[0] : ev;
			x = touch_ev.pageX - $paper.offset().left - $ink.width()/2;
			y = touch_ev.pageY - $paper.offset().top - $ink.height()/2;

			// Set up ripple position and place it in the DOM
			$ink.css({top: y + 'px', left: x + 'px', backgroundColor: opts.color})
				.appendTo($paper);

			// Remove the div after animation is complete
			window.setTimeout(function() {
				$paper.removeClass('ripple-active');
				$ink.remove();
			}, 2000);
		});
	};

}(jQuery, navigator.userAgent));
