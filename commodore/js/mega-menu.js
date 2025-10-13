// ADL WAS HERE
// Useage megaMenu(768) <- set breakpoint to fire above this point
// // Protect vars from escaping context
function megaMenu(breakPoint) {
	// grab width of browser
	var winWidth = $(window).width()
	
	//if window bigger than your breakpoint
	if (winWidth > breakPoint) {
		var menus = $('.mega-menu'), // grab aray of all mega menus
			numMenus = menus.length; // see how many there are

		// for each mega menu
		for (i = 1; i <= numMenus; i++) {
			
			// grab each drop and menu instance
			var drop = $('.mega-drop-' + i),
				menu = $('.mega-menu-' + i);

			
			
			//if the current drop exists then do your stuff
			if(drop) {
				// add class loaded to drop and hide the dropdown inside it.
				drop.addClass('loaded')
					.parent('a')
					.parent('li.hs-menu-depth-1')
					.find('ul.hs-menu-children-wrapper')
					.hide();
				// append the mega menu to the drop span
				drop.append(menu);
			}
		}

		// hover on span item 
		$('span.loaded').on('mouseover', function(e){

			// remove active class from mega menu
			$('.mega-menu').removeClass('active');
			// add class to curent mega menu
			$(this).find('.mega-menu').addClass('active');
	
			// hover off
		}).on("mouseleave", function(e){
			// remove active state from mega menu when you leave the menu item.
			$(this).find('.mega-menu').removeClass('active');
		});
	}
}