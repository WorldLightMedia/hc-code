
// REQUIREMENTS
// * Needs to exist an EMPTY div with the classname "pages" - This is where all the page numbers will be created inside
// * Needs to exist an EMPTY div inside the items with the classname "item-page" - This is where the items will store their page belonging
// * Needs to exist an EMPTY div at the top inside the items with the id "top-scroll" - This is what will make the page scroll to the top of the module when a page number is pressed
function pagination(filterClass, itemClass, itemsPerPage, filterInputItemsString, searchInputString="", topScrollClass="#top-scroll", moduleId="") {
  return function() {
    $(document).ready(function() {
      function reloadIsotope() {
        $(filterClass).isotope({
          itemSelector: itemClass,
          layoutMode: "fitRows"
        })
      }

      reloadIsotope()

      var $pagesRow = $(moduleId + " .pages");
      var currentPage = 1;

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
        if (numPages > 5) {
          prevNavDiv = $('<div>').addClass('pages-prev-nav').text("Prev");
          prevNavDiv.css("opacity", "0");
          prevNavDiv.css("pointer-events", "none");
          prevNavDiv.appendTo($pagesRow);
        }
        for (let i = 0; i < numPages; i++) {
          pageNumberDiv = $('<div>').addClass('page-number').text((i + 1).toString());
          pageNumberDiv.appendTo($pagesRow);
        }
        if (numPages > 5) {
          nextNavDiv = $('<div>').addClass('pages-next-nav').text("Next");
          if (numPages == 1) {
            nextNavDiv.css("opacity", "0");
            nextNavDiv.css("pointer-events", "none");
          }
          nextNavDiv.appendTo($pagesRow);
        }
        
        // Delay event binding so the pagination numbers get to be created and load in
        setTimeout(function() {
          $(moduleId + ' .page-number').on('click', function(event) {
            event.preventDefault();
            halfScreenHeight = $(window).height() / 2;
            halfCardHeight = $(itemClass).height() / 2;
            topScrollDiv = $(topScrollClass);

            pos =  topScrollDiv.offset().top - halfScreenHeight + halfCardHeight;
            if (pos < 0) {pos = 0;}
            // Scroll up so the top of the module is in the middle of the screen.
            $('html, body').animate({scrollTop: pos}, 500); // Adjust animation duration as needed
          })
        }, 500)
        
        function setPage(page) {
          // Hide or show the prev & next navigation buttons
          if (page == 1) {
            $(".pages-prev-nav").css("opacity", "0");
            $(".pages-prev-nav").css("pointer-events", "none");
          }
          else {
            $(".pages-prev-nav").css("opacity", "1");
            $(".pages-prev-nav").css("pointer-events", "auto");
          }
          if (page == numPages) {
            $(".pages-next-nav").css("opacity", "0");
            $(".pages-next-nav").css("pointer-events", "none");
          }
          else {
            $(".pages-next-nav").css("opacity", "1");
            $(".pages-next-nav").css("pointer-events", "auto");
          }
          
          $(moduleId + " .page-number").removeClass("on-page");
          $(moduleId + ` .page-number:eq(${page-1})`).addClass("on-page");
          var items = $(itemClass);
          for (item of items) {
            pageNum = parseInt($(item).find(".item-page").attr("id"));
            if (page == pageNum) {
              $(item).show(); // Set display to none for items not on the current page
            }
            else {
              $(item).hide();
            }
          }
          reloadIsotope()
        }
        
        function hidePageNumbers(page) {
          lowerEnd = page;
          higherEnd = page+4;
          if (higherEnd > numPages) {
            lowerEnd -= (higherEnd-numPages);
            higherEnd -= (higherEnd-numPages);
          }
          $(moduleId + " .page-number").each(function() {
            item = $(this)
             pageNum = parseInt(item.text());
             
             if (pageNum > higherEnd || pageNum < lowerEnd) {
               item.hide()
             }
             else {
               item.show();
             }
           })
        }
        hidePageNumbers(1)

        $(moduleId + ' .page-number').on('click', function() {
          currentPage = parseInt($(this).text());
          if (numPages > 5) {hidePageNumbers(currentPage)};
          setPage(currentPage);
        });
        
        if (numPages > 5) {
          // Previous navigation
          $(moduleId + ' .pages-prev-nav').on('click', function(event) {
            currentPage -= 1;
            hidePageNumbers(currentPage);
            setPage(currentPage);
          });
          // Previous navigation
          $(moduleId + ' .pages-next-nav').on('click', function(event) {
            currentPage += 1;
            hidePageNumbers(currentPage);
            setPage(currentPage);
          });
        }

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
        $(moduleId + ` .page-number:eq(0)`).addClass("on-page");
      }

      setTimeout(createPages, 300)
      if ($(filterInputItemsString).length) {
        $(filterInputItemsString).on("change", function() {
          setTimeout(createPages, 0);
        });
      }
      if ($(searchInputString).length) {
        $(searchInputString).on("input", function() {
          setTimeout(createPages, 0);
        });
      }
    });
  }
}









