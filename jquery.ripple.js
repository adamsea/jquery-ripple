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
	var isChrome = /chrome/i.exec(ua),
		isAndroid = /android/i.exec(ua),
		hasTouch = 'ontouchstart' in window && !(isChrome && !isAndroid);

	/**
	 * jQuery.fn.ripple
	 * @param {Object} options
	 * @param {String} [options.color=#fff] The ripple effect color
	 */
	$.fn.ripple = function(options) {
		var opts = $.extend({}, { color: '#fff' }, options);
		opts.event = (hasTouch && 'touchstart.ripple') || 'mousedown.ripple';
		opts.end_event = (hasTouch && 'touchend.ripple mouseleave.ripple') || 'mouseup.ripple mouseleave.ripple';

		// Bind the event to run the effect
		$(this).on(opts.event, function(ev) {
			var x, y, touch_ev,
				$paper = $(this),
				$ink = $('<div/>'),
				size = Math.max($paper.width(), $paper.height());

			// Set up ripple styles
			$paper
				.trigger('beforeripple')
				.addClass('ripple-active');
			$ink
				.addClass('ripple-effect')
				.css({
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
			$ink
				.css({top: y + 'px', left: x + 'px', backgroundColor: opts.color})
				.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function() {
					$paper.trigger('ripple');
				})
				.appendTo($paper);
		});

		// Bind the event to end the paper-press ripple
		$(this).on(opts.end_event, function() {
			var $paper = $(this),
				$ink = $paper.find('.ripple-effect');
			$paper
				.trigger('afterripple')
				.removeClass('ripple-active');
			$ink
				.css('background-color', 'rgba(255, 255, 255, 0)')
				.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function() {
					$ink.remove();
				});
		});

		// Chaining
		return $(this);
	};

}(window.jQuery, navigator.userAgent));
