(function( $ ) {
	$.fn.tabConvert = function(options) {
    
		var settings = $.extend({
			activeClass: "active",
			screenSize: 575,
		}, options );

		return this.each(function(i) {
			var wrap = $(this).wrap('<div class="tab-to-dropdown"></div>'),
					currentItem = $(this),
					container = $(this).closest('.tab-to-dropdown'),
					value = $(this).find('.'+settings.activeClass).text(),
					toggler = '<div class="selected-tab">'+ value +'</div>';
			currentItem.addClass('converted-tab');
			container.prepend(toggler);
			
			// function to slide dropdown
			function tabConvert_toggle(){
				currentItem.parent().find('.converted-tab').slideToggle();
			}

			container.find('.selected-tab').click(function(){
				tabConvert_toggle();
			});
			
			currentItem.find('button').click(function(e){
				var windowWidth = window.innerWidth;
				if( settings.screenSize >= windowWidth){
					tabConvert_toggle();
					var selected_text = $(this).text();
					$(this).closest('.tab-to-dropdown').find('.selected-tab').text(selected_text);
				}
			});
			
			//Remove toggle if screen size is bigger than defined screen size
			function resize_function(){
				var windowWidth = window.innerWidth;
				if( settings.screenSize >= windowWidth){
					currentItem.css('display','none');
					currentItem.parent().find('.selected-tab').css('display','');
				}else{
					currentItem.css('display','');
					currentItem.parent().find('.selected-tab').css('display','none');
				}
			}
			resize_function();
			
			$(window).resize(function(){
				resize_function();
			});
			
		});
	};

	// 	Toggle will appear on default screen size 767px
	$('.tabs').tabConvert({
	activeClass: "selected",
	});
  
// 	Toggle will appear on size 991px
  $('.nav-tabs').tabConvert({
    activeClass: "active",
		screenSize: 991,
  });

}( jQuery ));