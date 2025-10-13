(function($) {
    $('.hhs-accordion a.accordion-title').click(function(j) {
        var dropDown = $(this).closest('li').find('.hhs-accordion-content');

        $(this).closest('.hhs-accordion').find('.hhs-accordion-content').not(dropDown).slideUp();

        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
        } else {
            $(this).closest('.hhs-accordion').find('a.active').removeClass('active');
            $(this).addClass('active');
        }

        dropDown.stop(false, true).slideToggle();

        j.preventDefault();
    });
	
	
	var menuSection = document.querySelectorAll('.accordion-title');
	observer = new IntersectionObserver(function(menuItems){
		menuItems.forEach(function(menuItem) {
			if (menuItem.intersectionRatio > 0 && window.innerWidth > 1024) {
				var menuItem = document.querySelector('.accordion-title[data-menu="' + menuItem.target.id + '"]:not(.active)');
				if(menuItem) {
					menuItem.click();
				}
			}
		});
	});
	menuSection.forEach(function(section) {
		var dataId = section.dataset.menu;
    if (dataId) {
      var menuId = document.querySelector('#' + dataId);
      observer.observe(menuId);
    }
	});
})(jQuery);
