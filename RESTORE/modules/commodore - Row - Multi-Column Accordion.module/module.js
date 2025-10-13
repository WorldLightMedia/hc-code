(function($) {	
	function accordion(el) {
		var dropDown = $(el).closest('li').find('.hhs-accordion-content');
        $(el).closest('.hhs-accordion-1').find('.hhs-accordion-content').not(dropDown).slideUp();
        if ($(el).hasClass('active')) {
            $(el).removeClass('active');
        } else {
            $(el).closest('.hhs-accordion-1').find('a.active').removeClass('active');
            $(el).addClass('active');
        }
        dropDown.stop(false, true).slideToggle();
	}
	function openAccordion(){
		var idHash = window.location.hash.split('#')[1];
		if(idHash) {
			var dataId = $('[data-id="'+ idHash +'"]');
			console.log(dataId);
			dataId.click();	
		}
	}
	$(function(){
		openAccordion()
	});
    $('.hhs-accordion-1 a.accordion-title').on('click', function(e) {
		e.preventDefault();        
		accordion(this);
    });	
})(jQuery);
