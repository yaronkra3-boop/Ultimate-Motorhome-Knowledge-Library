/**
 * Search Module
 * Handles search and filter functionality
 */

const SearchModule = (function() {
  let searchInput;
  let searchClear;
  let filterButtons;

  /**
   * Initialize search functionality
   */
  function init() {
    searchInput = document.getElementById('searchInput');
    searchClear = document.getElementById('searchClear');
    filterButtons = document.querySelectorAll('.filter-btn');

    if (!searchInput || !searchClear) {
      console.warn('Search elements not found');
      return;
    }

    // Add event listeners
    searchInput.addEventListener('input', handleSearchInput);
    searchInput.addEventListener('keyup', handleSearchKeyup);
    searchClear.addEventListener('click', clearSearch);

    filterButtons.forEach(btn => {
      btn.addEventListener('click', handleFilterClick);
    });
  }

  /**
   * Handle search input
   */
  function handleSearchInput(e) {
    const query = e.target.value;

    // Show/hide clear button
    if (query.length > 0) {
      searchClear.classList.add('visible');
    } else {
      searchClear.classList.remove('visible');
    }
  }

  /**
   * Handle search keyup (debounced search)
   */
  let searchTimeout;
  function handleSearchKeyup(e) {
    const query = e.target.value;

    // Clear previous timeout
    clearTimeout(searchTimeout);

    // Debounce search (wait 300ms after user stops typing)
    searchTimeout = setTimeout(() => {
      performSearch(query);
    }, 300);
  }

  /**
   * Perform search
   * @param {string} query - Search query
   */
  function performSearch(query) {
    if (typeof MapModule !== 'undefined' && MapModule.searchLocations) {
      MapModule.searchLocations(query);
    }
  }

  /**
   * Clear search
   */
  function clearSearch() {
    searchInput.value = '';
    searchClear.classList.remove('visible');
    searchInput.focus();
    performSearch('');
  }

  /**
   * Handle filter button click
   * @param {Event} e - Click event
   */
  function handleFilterClick(e) {
    const button = e.currentTarget;
    const filterType = button.dataset.filter;

    // Update active state
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    // Apply filter
    if (typeof MapModule !== 'undefined' && MapModule.filterByType) {
      MapModule.filterByType(filterType);
    }

    // Clear search when filtering
    if (searchInput.value) {
      searchInput.value = '';
      searchClear.classList.remove('visible');
    }
  }

  // Public API
  return {
    init
  };
})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  SearchModule.init();
});

// Make available globally
window.SearchModule = SearchModule;
