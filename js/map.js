/**
 * Map Module
 * Handles interactive map with Leaflet.js and marker clustering
 */

const MapModule = (function() {
  let map = null;
  let markerClusterGroup = null;
  let allLocations = [];
  let currentMarkers = [];

  /**
   * Initialize the map
   */
  async function initMap() {
    // Create map centered on Europe
    map = L.map('map', {
      center: [50.0, 10.0],
      zoom: 5,
      minZoom: 3,
      maxZoom: 18
    });

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(map);

    // Initialize marker cluster group
    markerClusterGroup = L.markerClusterGroup({
      chunkedLoading: true,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      maxClusterRadius: 80
    });

    map.addLayer(markerClusterGroup);

    // Load and display locations
    await loadAndDisplayLocations();

    // Add locate control
    addLocateControl();
  }

  /**
   * Load locations and display markers
   */
  async function loadAndDisplayLocations() {
    try {
      allLocations = await DataLoader.getAllLocations();
      displayMarkers(allLocations);
      updateSidebar(allLocations);
    } catch (error) {
      console.error('Error loading locations:', error);
      alert('Failed to load locations. Please refresh the page.');
    }
  }

  /**
   * Display markers on the map
   * @param {Array} locations - Array of location objects
   */
  function displayMarkers(locations) {
    // Clear existing markers
    markerClusterGroup.clearLayers();
    currentMarkers = [];

    if (!locations || locations.length === 0) {
      return;
    }

    // Create markers for each location
    locations.forEach(location => {
      if (!location.coordinates || !location.coordinates.lat || !location.coordinates.lng) {
        console.warn(`Location ${location.id} missing coordinates`);
        return;
      }

      // Create custom icon based on type
      const icon = createCustomIcon(location.type);

      // Create marker
      const marker = L.marker(
        [location.coordinates.lat, location.coordinates.lng],
        { icon: icon }
      );

      // Create popup content
      const popupContent = createPopupContent(location);
      marker.bindPopup(popupContent);

      // Add marker to cluster group
      markerClusterGroup.addLayer(marker);
      currentMarkers.push({ marker, location });
    });

    // Fit map to show all markers
    if (markerClusterGroup.getLayers().length > 0) {
      map.fitBounds(markerClusterGroup.getBounds(), {
        padding: [50, 50],
        maxZoom: 12
      });
    }
  }

  /**
   * Create custom icon for location type
   * @param {string} type - Location type
   * @returns {L.DivIcon} Leaflet div icon
   */
  function createCustomIcon(type) {
    const icons = {
      storage: '🏪',
      parking: '🅿️',
      campground: '🏕️',
      service: '🔧'
    };

    const emoji = icons[type] || '📍';

    return L.divIcon({
      className: 'custom-marker-icon',
      html: `<div class="marker-content">${emoji}</div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });
  }

  /**
   * Create popup HTML content
   * @param {Object} location - Location object
   * @returns {string} HTML string
   */
  function createPopupContent(location) {
    const name = location.name?.en || 'Unknown Location';
    const city = location.address?.city || '';
    const country = location.address?.country || '';
    const address = city && country ? `${city}, ${country}` : (city || country || 'Address not available');

    let priceText = '';
    if (location.cost) {
      if (location.cost.type === 'free') {
        priceText = '<div class="popup-price">Free</div>';
      } else if (location.cost.amount) {
        const period = location.cost.period ? `/${location.cost.period}` : '';
        priceText = `<div class="popup-price">€${location.cost.amount}${period}</div>`;
      } else if (location.cost.notes?.en) {
        priceText = `<div class="popup-price">${location.cost.notes.en}</div>`;
      }
    }

    return `
      <div class="popup-content">
        <div class="popup-title">${name}</div>
        <div class="popup-address">${address}</div>
        ${priceText}
        <button class="popup-btn" onclick="MapModule.viewLocationDetails('${location.id}')">
          View Details
        </button>
      </div>
    `;
  }

  /**
   * Update sidebar with location cards
   * @param {Array} locations - Array of location objects
   */
  function updateSidebar(locations) {
    const sidebarContent = document.getElementById('sidebarContent');
    if (!sidebarContent) return;

    if (!locations || locations.length === 0) {
      sidebarContent.innerHTML = '<div class="loading">No locations found</div>';
      return;
    }

    const cardsHTML = locations.map(location => {
      const name = location.name?.en || 'Unknown Location';
      const city = location.address?.city || '';
      const country = location.address?.country || '';
      const address = city && country ? `${city}, ${country}` : (city || country || 'Address not available');

      let priceText = 'Price on request';
      if (location.cost) {
        if (location.cost.type === 'free') {
          priceText = 'Free';
        } else if (location.cost.amount) {
          const period = location.cost.period ? `/${location.cost.period}` : '';
          priceText = `€${location.cost.amount}${period}`;
        } else if (location.cost.notes?.en) {
          priceText = location.cost.notes.en;
        }
      }

      return `
        <div class="location-card" onclick="MapModule.flyToLocation('${location.id}')">
          <div class="location-card-title">${name}</div>
          <div class="location-card-address">${address}</div>
          <div class="location-card-price">${priceText}</div>
        </div>
      `;
    }).join('');

    sidebarContent.innerHTML = cardsHTML;
  }

  /**
   * Fly to location on map
   * @param {string} locationId - Location ID
   */
  async function flyToLocation(locationId) {
    const location = await DataLoader.getLocationById(locationId);
    if (!location || !location.coordinates) {
      return;
    }

    map.flyTo(
      [location.coordinates.lat, location.coordinates.lng],
      15,
      {
        duration: 1
      }
    );

    // Find and open the marker popup
    currentMarkers.forEach(({ marker, location: loc }) => {
      if (loc.id === locationId) {
        setTimeout(() => {
          marker.openPopup();
        }, 1000);
      }
    });
  }

  /**
   * View location details (placeholder for future detail page)
   * @param {string} locationId - Location ID
   */
  function viewLocationDetails(locationId) {
    // For MVP, just fly to location
    // In future, navigate to detail page
    console.log('View details for:', locationId);
    alert('Detail pages coming soon! For now, explore the map and location info.');
  }

  /**
   * Filter locations by type
   * @param {string} type - Location type or 'all'
   */
  async function filterByType(type) {
    const locations = await DataLoader.getLocationsByType(type);
    displayMarkers(locations);
    updateSidebar(locations);
  }

  /**
   * Search locations
   * @param {string} query - Search query
   */
  async function searchLocations(query) {
    const locations = await DataLoader.searchLocations(query);
    displayMarkers(locations);
    updateSidebar(locations);
  }

  /**
   * Add locate control (find user location)
   */
  function addLocateControl() {
    const locateControl = L.control({ position: 'topleft' });

    locateControl.onAdd = function() {
      const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
      div.innerHTML = '<a href="#" title="Find my location" style="font-size: 18px; text-decoration: none;">📍</a>';
      div.onclick = function(e) {
        e.preventDefault();
        map.locate({ setView: true, maxZoom: 12 });
      };
      return div;
    };

    locateControl.addTo(map);

    map.on('locationfound', function(e) {
      L.circle(e.latlng, {
        radius: e.accuracy / 2,
        color: '#4285F4',
        fillColor: '#4285F4',
        fillOpacity: 0.2
      }).addTo(map);
    });

    map.on('locationerror', function() {
      alert('Unable to determine your location');
    });
  }

  // Public API
  return {
    initMap,
    flyToLocation,
    viewLocationDetails,
    filterByType,
    searchLocations
  };
})();

// Initialize map when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  MapModule.initMap();
});

// Make available globally
window.MapModule = MapModule;
