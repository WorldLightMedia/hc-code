




function loadMore(filterClass, itemClass, itemsOnInit, itemsPerLoad, filterInputItemsString, triggerType) {
  $(document).ready(function() {

    // global variables
    var currentLoad = 1;
    
    // Isotope init
    var $grid = $(filterClass).isotope({
      itemSelector: itemClass
    });

    function addLoad() {
      currentLoad += 1;
      var items = $(itemClass);
      for (item of items) {
        loadNum = parseInt($(item).find(".item-page").attr("id"));
        if (loadNum <= currentLoad) {
          $(item).show();
          if (loadNum == currentLoad) {$(item).addClass("animate__animated animate__fadeIn")};
        }
        else {
          $(item).hide();
        }
      }
      $(filterClass).isotope({
        itemSelector: itemClass
      });
      checkTrigger();
    }

    function createLoads() {
      currentLoad = 1;
      $items = $(itemClass).toArray();
      var visibleItems = $(itemClass).not(':hidden').toArray();
      
      checkTrigger();
      
      $items.forEach(function (item) {
        $(item).find(".item-page").attr("id", "");
      });

      var load = 1;
      var itemNum = 0;
      visibleItems.forEach(function (item) {
        if (itemNum === itemsOnInit && load === 1) {
          load += 1;
          itemNum = 0;
        }
        else if (itemNum === itemsPerLoad && load !== 1) {
          load++;
          itemNum = 0;
        }
        $(item).find(".item-page").attr("id", load.toString()); // Add page number class
        if (load > currentLoad) {
          $(item).hide(); // Set display to none for items not on the current page
        }
        itemNum++;
      });

      $(filterClass).isotope({
        itemSelector: itemClass
      });
      checkTrigger();
    }

    // Check if the trigger should be active, and updates the scroll trigger event
    function checkTrigger() {
      items = $(itemClass).toArray();
      visibleItems = $(itemClass).not(':hidden').toArray();
      if (visibleItems.length < itemsOnInit + (currentLoad-1)*itemsPerLoad || items.length == itemsOnInit + (currentLoad-1)*itemsPerLoad) {
         $('.load-more-btn').hide();
      }
      else {
        $('.load-more-btn').show();
      }
    }

    // Initial set up
    setTimeout(createLoads, 300);
    $(filterInputItemsString).on("change", function() {
        setTimeout(createLoads, 0);
    });

    // Trigger types
    if (triggerType == "button") {
      $('.load-more-btn').on('click', function() {
        addLoad();
      });
    }
    
  });
}



