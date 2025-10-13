
// REQUIREMENTS
// * Needs to exist an EMPTY div with the classname "pages" - This is where all the page numbers will be created inside
// * Needs to exist an EMPTY div inside the items with the classname "item-page" - This is where the items will store their page belonging
// * Needs to exist an EMPTY div at the top inside the items with the id "top-scroll" - This is what will make the page scroll to the top of the module when a page number is pressed

function pagination(filterClass, itemClass, itemsPerPage, filterInputItemsString) {
  $(document).ready(function() {
    function reloadIsotope() {
      $(filterClass).isotope({
        itemSelector: itemClass,
        layoutMode: "fitRows"
      })
    }

    reloadIsotope()

    var $pagesRow = $(".pages");
    var currentPage = 1;


    function setPage() {
      $(".page-number").removeClass("on-page");
      $(`.page-number:eq(${currentPage-1})`).addClass("on-page");
      
      var items = $(itemClass);
      for (item of items) {
        pageNum = parseInt($(item).find(".item-page").attr("id"));
        if (currentPage == pageNum) {
          $(item).show(); // Set display to none for items not on the current page
        }
        else {
          $(item).hide();
        }
      }
      reloadIsotope()
    }


    function createPages() {
      currentPage = 1
      $items = $(itemClass).toArray();
      var visibleItems = $(itemClass).not(':hidden').toArray();
      var numPages = Math.ceil(visibleItems.length / itemsPerPage);

      $items.forEach(function (item) {
        $(item).find(".item-page").attr("id", "");
      })

      // Create new page numbers
      $pagesRow.empty();
      for (let i = 0; i < numPages; i++) {
        pageNumberDiv = $('<div>').addClass('page-number').text((i + 1).toString());
        pageNumberDiv.appendTo($pagesRow);
      }
      // Delay event binding so the pagination numbers get to be created and load in
      setTimeout(function() {
        $('.page-number').on('click', function(event) {
          event.preventDefault();
          halfScreenHeight = $(window).height() / 2;
          halfCardHeight = $(itemClass).height() / 2;
          topScrollDiv = $('#top-scroll');

          pos =  topScrollDiv.offset().top - halfScreenHeight + halfCardHeight;
          if (pos < 0) {pos = 0;}
          // Scroll up so the top of the module is in the middle of the screen.
          $('html, body').animate({scrollTop: pos}, 500); // Adjust animation duration as needed
        })
      }, 500)

      $('.page-number').on('click', function() {
        currentPage = parseInt($(this).text());
        setPage();
      });

      var page = 1;
      var itemNum = 0;
      visibleItems.forEach(function (item) {
        if (itemNum === itemsPerPage) {
          page++;
          itemNum = 0;
        }
        $(item).find(".item-page").attr("id", page.toString()); // Add page number class
        if (page != currentPage) {
          $(item).hide(); // Set display to none for items not on the current page
        }
        itemNum++;
      })
      reloadIsotope()
      $(`.page-number:eq(0)`).addClass("on-page");
    }
    
    setTimeout(createPages, 300)
    $(filterInputItemsString).on("change", function() {
        setTimeout(createPages, 0);
    });
  });
}









