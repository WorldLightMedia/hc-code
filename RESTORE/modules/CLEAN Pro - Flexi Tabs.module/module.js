const tabs = document.querySelectorAll('.c-tab');
const tabContents = document.querySelectorAll('.tab-content');
const selectMenu = document.createElement('select');
const tabsContainer = document.querySelector('.tabs-container');
let isMobile = false;

function checkIsMobile() {
  isMobile = window.innerWidth < 575;
}

// Function to clear existing options in selectMenu
function clearSelectMenu() {
  while (selectMenu.firstChild) {
    selectMenu.removeChild(selectMenu.firstChild);
  }
}

function createSelectMenu() {
  clearSelectMenu(); // Clear the select menu before adding new options
  tabs.forEach(tab => {
    const option = document.createElement('option');
    option.value = tab.dataset.tab;
    option.text = tab.innerText;
    selectMenu.appendChild(option);
  });

  selectMenu.addEventListener('change', () => {
    const selectedClass = selectMenu.value;

    tabs.forEach(tab => tab.classList.remove('active'));
    document.querySelector(`[data-tab="${selectedClass}"]`).classList.add('active');

    tabContents.forEach(content => content.classList.remove('active'));

    // Adjust here: Show tab content for the selected tab using class
    document.querySelectorAll(`.${selectedClass}`).forEach(el => el.classList.add('active'));
  });

  tabsContainer.insertBefore(selectMenu, tabsContainer.firstChild);
}

checkIsMobile();
if (isMobile) {
  createSelectMenu();
}

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    if (isMobile) {
      selectMenu.value = tab.dataset.tab;
      const event = new Event('change');
      selectMenu.dispatchEvent(event);
    } else {
      const tabClass = tab.dataset.tab;
      
      tabContents.forEach(content => content.classList.remove('active'));
      
      // Adjust here: Show tab content for the clicked tab using class
      document.querySelectorAll(`.${tabClass}`).forEach(el => el.classList.add('active'));

      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    }
  });
});

window.addEventListener('resize', () => {
  checkIsMobile();
  // Create or clear the select menu based on isMobile
  if (isMobile && !tabsContainer.contains(selectMenu)) {
    createSelectMenu();
  } else if (!isMobile && tabsContainer.contains(selectMenu)) {
    selectMenu.remove();
  }
});
