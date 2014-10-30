/**
 * jQuery plugin to produce the ripple effect from the Google Material Design spec:
 * http://www.google.com/design/spec/animation/responsive-interaction.html
 *
 * This plugin was modified from a codepen simulating the effect:
 * http://codepen.io/Craigtut/pen/dIfzv
 */
(function($) {

	// Check if an event is supported - stripped down version
	// from http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
	function isEventSupported(eventName) {
		var el = document.createElement('div');
		eventName = 'on' + eventName;
		var isSupported = (eventName in el);
		if (!isSupported) {
			el.setAttribute(eventName, 'return;');
			isSupported = typeof el[eventName] == 'function';
		}
		el = null;
		return isSupported;
	}

	/**
	 * jQuery.fn.ripple
	 * @param {Object} options
	 * @param {String} [options.event=mousedown] The interaction event
	 * @param {String} [options.color=#fff] The ripple effect color
	 */
	$.fn.ripple = function(options) {
		var opts = $.extend({}, {
				event: isEventSupported('touchstart') && 'touchstart' || 'mousedown',
				color: '#fff'
			}, options);

		// Bind the event to run the effect
		$(this).on(opts.event, function(ev) {
			var x, y,
				$paper = $(this),
				$ink = $('<div/>'),
				size = Math.max($paper.width(), $paper.height());

			// Set up ripple styles
			$ink.addClass('ripple-effect');
			$ink.css({
				height: size,
				width: size
			});

			// get click coordinates
			// logic = click coordinates relative to page
			// - position relative to page - half of self height/width to make it controllable from the center
			x = ev.pageX - $paper.offset().left - $ink.width()/2;
			y = ev.pageY - $paper.offset().top - $ink.height()/2;

			// Set up ripple position and place it in the DOM
			$ink.css({top: y + 'px', left: x + 'px', backgroundColor: opts.color})
				.appendTo($paper);

			// Remove the div after animation is complete
			window.setTimeout(function(){
				$ink.remove();
			}, 2000);
		});
	};

}(jQuery));
