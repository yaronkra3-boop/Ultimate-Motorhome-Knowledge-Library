// Map View - Interactive Leaflet map with all locations (shadcn style)
export class MapView {
    constructor(dataLoader) {
        this.dataLoader = dataLoader;
        this.locations = [];
        this.map = null;
        this.markers = [];
    }

    async render() {
        this.locations = await this.dataLoader.getLocations();

        return `
            <div class="map-container">
                <header class="map-header">
                    <div class="map-header-content">
                        <div>
                            <h1 class="map-title">Interactive Map</h1>
                            <p class="map-subtitle">${this.locations.length} verified motorhome locations</p>
                        </div>
                        <div class="map-controls">
                            <button class="btn btn-outline" id="zoom-europe">Europe</button>
                            <button class="btn btn-outline" id="zoom-israel">Israel</button>
                            <button class="btn btn-primary" id="locate-me">📍 My Location</button>
                        </div>
                    </div>
                </header>

                <div id="leaflet-map"></div>

                <div class="map-legend">
                    <h3>Location Types</h3>
                    <div class="legend-items">
                        <div class="legend-item">
                            <span class="legend-marker parking">🅿️</span>
                            <span>Parking</span>
                        </div>
                        <div class="legend-item">
                            <span class="legend-marker camping">🏕️</span>
                            <span>Campground</span>
                        </div>
                        <div class="legend-item">
                            <span class="legend-marker service">🔧</span>
                            <span>Service</span>
                        </div>
                        <div class="legend-item">
                            <span class="legend-marker storage">🏪</span>
                            <span>Storage</span>
                        </div>
                    </div>
                </div>
            </div>

            <style>
                .map-container {
                    max-width: 100%;
                    margin: 0;
                    position: relative;
                }

                .map-header {
                    background: hsl(var(--card));
                    border-bottom: 1px solid hsl(var(--border));
                    padding: 1rem;
                }

                .map-header-content {
                    max-width: 1280px;
                    margin: 0 auto;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 1rem;
                }

                .map-title {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: hsl(var(--foreground));
                    margin-bottom: 0.25rem;
                }

                .map-subtitle {
                    font-size: 0.875rem;
                    color: hsl(var(--muted-foreground));
                }

                .map-controls {
                    display: flex;
                    gap: 0.5rem;
                    flex-wrap: wrap;
                }

                #leaflet-map {
                    width: 100%;
                    height: calc(100vh - 200px);
                    min-height: 500px;
                    z-index: 1;
                }

                .map-legend {
                    position: absolute;
                    bottom: 2rem;
                    left: 1rem;
                    background: hsl(var(--card));
                    border: 1px solid hsl(var(--border));
                    border-radius: calc(var(--radius) + 4px);
                    padding: 1rem;
                    z-index: 1000;
                    box-shadow: 0 4px 12px rgb(0 0 0 / 0.1);
                }

                .map-legend h3 {
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: hsl(var(--muted-foreground));
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    margin-bottom: 0.75rem;
                }

                .legend-items {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .legend-item {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.875rem;
                    color: hsl(var(--foreground));
                }

                .legend-marker {
                    font-size: 1.25rem;
                }

                /* Leaflet popup styling to match shadcn */
                .leaflet-popup-content-wrapper {
                    border-radius: calc(var(--radius) + 4px) !important;
                    border: 1px solid hsl(var(--border)) !important;
                    box-shadow: 0 4px 12px rgb(0 0 0 / 0.1) !important;
                }

                .leaflet-popup-content {
                    margin: 1rem !important;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
                }

                .popup-title {
                    font-size: 1rem;
                    font-weight: 600;
                    color: hsl(var(--foreground));
                    margin-bottom: 0.5rem;
                }

                .popup-address {
                    font-size: 0.75rem;
                    color: hsl(var(--muted-foreground));
                    margin-bottom: 0.75rem;
                }

                .popup-description {
                    font-size: 0.875rem;
                    color: hsl(var(--foreground));
                    line-height: 1.5;
                    margin-bottom: 0.75rem;
                }

                .popup-amenities {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.25rem;
                    margin-bottom: 0.75rem;
                }

                .popup-amenity {
                    font-size: 1rem;
                }

                .popup-cost {
                    font-weight: 600;
                    font-size: 0.875rem;
                }

                .popup-cost.free {
                    color: #22c55e;
                }

                .popup-cost.paid {
                    color: #f59e0b;
                }

                @media (max-width: 768px) {
                    .map-header-content {
                        flex-direction: column;
                        align-items: flex-start;
                    }

                    #leaflet-map {
                        height: calc(100vh - 250px);
                    }

                    .map-legend {
                        bottom: 1rem;
                        left: 0.5rem;
                        right: 0.5rem;
                    }

                    .legend-items {
                        flex-direction: row;
                        flex-wrap: wrap;
                    }
                }
            </style>
        `;
    }

    afterRender() {
        // Initialize map after DOM is ready
        setTimeout(() => this.initMap(), 100);
    }

    initMap() {
        // Initialize Leaflet map centered on Europe
        this.map = L.map('leaflet-map').setView([48.8566, 10.3522], 5);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(this.map);

        // Add markers for all locations
        this.addLocationMarkers();

        // Setup control buttons
        this.setupControls();
    }

    addLocationMarkers() {
        this.locations.forEach(location => {
            const coords = location.coordinates;
            // Support both lat/lng and latitude/longitude formats
            const lat = coords?.lat || coords?.latitude;
            const lng = coords?.lng || coords?.longitude;
            if (!lat || !lng) return;

            const icon = this.getMarkerIcon(location.type);
            const marker = L.marker([lat, lng], { icon })
                .addTo(this.map)
                .bindPopup(this.createPopupContent(location));

            this.markers.push(marker);
        });

        // Fit map to markers if we have any
        if (this.markers.length > 0) {
            const group = L.featureGroup(this.markers);
            this.map.fitBounds(group.getBounds().pad(0.1));
        }
    }

    getMarkerIcon(type) {
        const iconMap = {
            'parking': '🅿️',
            'campground': '🏕️',
            'service': '🔧',
            'storage': '🏪',
            'scenic': '🌄'
        };

        const emoji = iconMap[type] || '📍';

        return L.divIcon({
            html: `<div style="font-size: 1.5rem; text-align: center; line-height: 1;">${emoji}</div>`,
            className: 'emoji-marker',
            iconSize: [30, 30],
            iconAnchor: [15, 15],
            popupAnchor: [0, -15]
        });
    }

    createPopupContent(location) {
        const name = this.getLocalizedText(location.name);
        const description = this.getLocalizedText(location.description);
        const address = this.getFullAddress(location);
        const amenities = location.amenities || [];
        const cost = location.cost || {};

        const costText = cost.type === 'free' ? 'Free' : `€${cost.amount || '?'}`;
        const costClass = cost.type === 'free' ? 'free' : 'paid';

        const amenityEmojis = amenities.map(a => this.formatAmenity(a)).join(' ');

        return `
            <div class="popup-content">
                <div class="popup-title">${name}</div>
                <div class="popup-address">${address}</div>
                <div class="popup-description">${description?.substring(0, 150) || ''}${description?.length > 150 ? '...' : ''}</div>
                ${amenities.length > 0 ? `<div class="popup-amenities">${amenityEmojis}</div>` : ''}
                <div class="popup-cost ${costClass}">${costText}</div>
            </div>
        `;
    }

    setupControls() {
        // Zoom to Europe
        document.getElementById('zoom-europe')?.addEventListener('click', () => {
            this.map.setView([48.8566, 10.3522], 5);
        });

        // Zoom to Israel
        document.getElementById('zoom-israel')?.addEventListener('click', () => {
            this.map.setView([31.0461, 34.8516], 8);
        });

        // Locate me
        document.getElementById('locate-me')?.addEventListener('click', () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        this.map.setView([latitude, longitude], 12);
                        L.marker([latitude, longitude])
                            .addTo(this.map)
                            .bindPopup('📍 You are here')
                            .openPopup();
                    },
                    (error) => {
                        console.error('Geolocation error:', error);
                        alert('Could not get your location');
                    }
                );
            } else {
                alert('Geolocation is not supported by your browser');
            }
        });
    }

    getLocalizedText(textObj) {
        if (!textObj) return '';
        if (typeof textObj === 'string') return textObj;
        return textObj.en || textObj.he || '';
    }

    getFullAddress(location) {
        const addr = location.address || {};
        if (addr.fullAddress) {
            return this.getLocalizedText(addr.fullAddress);
        }
        const parts = [addr.city, addr.region, addr.country].filter(Boolean);
        return parts.join(', ') || 'Location not specified';
    }

    formatAmenity(amenity) {
        const amenityMap = {
            'water': '💧',
            'dump_station': '🚽',
            'grey_water_disposal': '💦',
            'electricity': '⚡',
            'wifi': '📶',
            'security': '🔒'
        };
        return `<span class="popup-amenity">${amenityMap[amenity] || amenity}</span>`;
    }
}
