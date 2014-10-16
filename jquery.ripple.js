(function($) {

	$.fn.ripple = function(options) {
		var opts = $.extend({}, {
				event: 'mousedown',
				color: '#fff'
			}, options);

		$(this).on(opts.event, function(ev) {
			var $ripple,
				$elem = $(this),
				$div = $('<div/>'),
				btnOffset = $elem.offset(),
				xPos = ev.pageX - btnOffset.left,
				yPos = ev.pageY - btnOffset.top;

			ev.preventDefault();

			$div.addClass('ripple-effect');
			$ripple = $('.ripple-effect');

			$ripple.css('height', $elem.height());
			$ripple.css('width', $elem.height());
			$div.css({
				top: yPos - ($ripple.height()/2),
				left: xPos - ($ripple.width()/2),
				background: opts.color
			}).appendTo($elem);

			window.setTimeout(function(){
				$div.remove();
			}, 2000);
		});
	};

}(jQuery));
