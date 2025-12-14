/**
 * Data Loader Module
 * Handles loading and caching of location data
 */

const DataLoader = (function() {
  let locationsData = null;
  let isLoading = false;

  /**
   * Load locations data from JSON file
   * @returns {Promise<Object>} Locations data
   */
  async function loadLocations() {
    if (locationsData) {
      return locationsData;
    }

    if (isLoading) {
      // Wait for existing load to complete
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (!isLoading) {
            clearInterval(checkInterval);
            resolve(locationsData);
          }
        }, 100);
      });
    }

    try {
      isLoading = true;
      const response = await fetch('data/locations.json');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      locationsData = data;
      return data;
    } catch (error) {
      console.error('Error loading locations data:', error);
      throw error;
    } finally {
      isLoading = false;
    }
  }

  /**
   * Get all locations
   * @returns {Promise<Array>} Array of location objects
   */
  async function getAllLocations() {
    const data = await loadLocations();
    return data.locations || [];
  }

  /**
   * Get location by ID
   * @param {string} id - Location ID
   * @returns {Promise<Object|null>} Location object or null
   */
  async function getLocationById(id) {
    const locations = await getAllLocations();
    return locations.find(loc => loc.id === id) || null;
  }

  /**
   * Filter locations by type
   * @param {string} type - Location type
   * @returns {Promise<Array>} Filtered locations
   */
  async function getLocationsByType(type) {
    const locations = await getAllLocations();
    if (type === 'all') {
      return locations;
    }
    return locations.filter(loc => loc.type === type);
  }

  /**
   * Search locations by query
   * @param {string} query - Search query
   * @returns {Promise<Array>} Matching locations
   */
  async function searchLocations(query) {
    if (!query || query.trim() === '') {
      return getAllLocations();
    }

    const locations = await getAllLocations();
    const searchTerm = query.toLowerCase().trim();

    return locations.filter(loc => {
      // Search in name
      if (loc.name?.en?.toLowerCase().includes(searchTerm)) {
        return true;
      }

      // Search in city
      if (loc.address?.city?.toLowerCase().includes(searchTerm)) {
        return true;
      }

      // Search in country
      if (loc.address?.country?.toLowerCase().includes(searchTerm)) {
        return true;
      }

      // Search in region
      if (loc.address?.region?.toLowerCase().includes(searchTerm)) {
        return true;
      }

      // Search in full address
      if (loc.address?.fullAddress?.en?.toLowerCase().includes(searchTerm)) {
        return true;
      }

      return false;
    });
  }

  /**
   * Get metadata about the dataset
   * @returns {Promise<Object>} Metadata object
   */
  async function getMetadata() {
    const data = await loadLocations();
    return data.metadata || {};
  }

  // Public API
  return {
    loadLocations,
    getAllLocations,
    getLocationById,
    getLocationsByType,
    searchLocations,
    getMetadata
  };
})();

// Make available globally
window.DataLoader = DataLoader;
