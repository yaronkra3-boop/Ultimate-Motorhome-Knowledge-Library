// Locations View - Shows all parking locations and map
export class LocationsView {
    constructor(data) {
        this.data = data;
        this.locations = data?.data?.locations || [];
    }

    render() {
        return `
            <div class="locations-container">
                <header class="page-header">
                    <div class="page-icon">🗺️</div>
                    <h1>Locations & Navigation</h1>
                    <p class="page-subtitle">
                        Discover ${this.locations.length} verified motorhome parking locations across Europe and beyond
                    </p>
                </header>

                <div class="locations-content">
                    <div class="locations-filters">
                        <h3>Filter Locations</h3>
                        <div class="filter-group">
                            <label>
                                <input type="checkbox" data-filter="water"> Water Available
                            </label>
                            <label>
                                <input type="checkbox" data-filter="dump_station"> Dump Station
                            </label>
                            <label>
                                <input type="checkbox" data-filter="electricity"> Electricity
                            </label>
                            <label>
                                <input type="checkbox" data-filter="free"> Free Only
                            </label>
                        </div>
                    </div>

                    <div class="locations-list">
                        ${this.renderLocationsList()}
                    </div>
                </div>
            </div>

            <style>
                .locations-container {
                    max-width: 1400px;
                    margin: 0 auto;
                }

                .page-header {
                    text-align: center;
                    margin-bottom: 60px;
                }

                .page-icon {
                    font-size: 5rem;
                    margin-bottom: 20px;
                }

                .page-header h1 {
                    font-size: 3rem;
                    color: #667eea;
                    margin-bottom: 20px;
                }

                .page-subtitle {
                    font-size: 1.2rem;
                    color: #666;
                }

                .locations-content {
                    display: grid;
                    grid-template-columns: 250px 1fr;
                    gap: 30px;
                }

                .locations-filters {
                    background: white;
                    padding: 25px;
                    border-radius: 15px;
                    box-shadow: 0 5px 20px rgba(0,0,0,0.05);
                    height: fit-content;
                    position: sticky;
                    top: 100px;
                }

                .locations-filters h3 {
                    margin-bottom: 20px;
                    color: #667eea;
                }

                .filter-group {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .filter-group label {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    cursor: pointer;
                    font-size: 0.95rem;
                }

                .filter-group input[type="checkbox"] {
                    cursor: pointer;
                }

                .locations-list {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
                    gap: 25px;
                }

                .location-card {
                    background: white;
                    border-radius: 15px;
                    padding: 25px;
                    box-shadow: 0 5px 20px rgba(0,0,0,0.05);
                    transition: transform 0.2s, box-shadow 0.2s;
                    cursor: pointer;
                }

                .location-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 8px 30px rgba(0,0,0,0.1);
                }

                .location-name {
                    font-size: 1.3rem;
                    font-weight: 700;
                    color: #667eea;
                    margin-bottom: 10px;
                }

                .location-address {
                    color: #888;
                    font-size: 0.9rem;
                    margin-bottom: 15px;
                }

                .location-description {
                    color: #666;
                    font-size: 0.95rem;
                    line-height: 1.5;
                    margin-bottom: 15px;
                }

                .location-amenities {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    margin-bottom: 15px;
                }

                .amenity-tag {
                    background: #f0f4ff;
                    color: #667eea;
                    padding: 5px 12px;
                    border-radius: 20px;
                    font-size: 0.85rem;
                }

                .location-cost {
                    font-weight: 600;
                    color: #28a745;
                    font-size: 1.1rem;
                }

                .location-cost.paid {
                    color: #ffa500;
                }

                @media (max-width: 1024px) {
                    .locations-content {
                        grid-template-columns: 1fr;
                    }

                    .locations-filters {
                        position: static;
                    }
                }

                @media (max-width: 768px) {
                    .page-header h1 {
                        font-size: 2rem;
                    }

                    .locations-list {
                        grid-template-columns: 1fr;
                    }
                }
            </style>
        `;
    }

    renderLocationsList() {
        if (this.locations.length === 0) {
            return '<p style="padding: 40px; text-align: center; color: #666;">No locations available</p>';
        }

        return this.locations.slice(0, 50).map(loc => this.renderLocationCard(loc)).join('');
    }

    renderLocationCard(location) {
        const name = this.getLocalizedText(location.name);
        const description = this.getLocalizedText(location.description);
        const address = this.getFullAddress(location);
        const amenities = location.amenities || [];
        const cost = location.cost || {};

        const costText = cost.type === 'free' ? 'Free' : `€${cost.amount || '?'}`;
        const costClass = cost.type === 'free' ? '' : 'paid';

        return `
            <div class="location-card" data-location-id="${location.id}">
                <div class="location-name">${name}</div>
                <div class="location-address">${address}</div>
                <div class="location-description">${description?.substring(0, 120)}${description?.length > 120 ? '...' : ''}</div>

                ${amenities.length > 0 ? `
                    <div class="location-amenities">
                        ${amenities.map(a => `<span class="amenity-tag">${this.formatAmenity(a)}</span>`).join('')}
                    </div>
                ` : ''}

                <div class="location-cost ${costClass}">${costText}</div>
            </div>
        `;
    }

    getLocalizedText(textObj) {
        if (!textObj) return 'N/A';
        if (typeof textObj === 'string') return textObj;
        return textObj.en || textObj.he || 'N/A';
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
            'water': '💧 Water',
            'dump_station': '🚽 Dump',
            'grey_water_disposal': '💦 Grey Water',
            'electricity': '⚡ Electric',
            'wifi': '📶 WiFi',
            'security': '🔒 Secure'
        };
        return amenityMap[amenity] || amenity;
    }

    afterRender() {
        // Add filter functionality
        document.querySelectorAll('.filter-group input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.applyFilters());
        });
    }

    applyFilters() {
        // Get active filters
        const activeFilters = Array.from(document.querySelectorAll('.filter-group input:checked'))
            .map(cb => cb.dataset.filter);

        // Show/hide location cards based on filters
        document.querySelectorAll('.location-card').forEach(card => {
            const locationId = card.dataset.locationId;
            const location = this.locations.find(l => l.id === locationId);

            if (!location) {
                card.style.display = 'none';
                return;
            }

            let shouldShow = true;

            // Check each filter
            if (activeFilters.includes('free') && location.cost?.type !== 'free') {
                shouldShow = false;
            }

            if (activeFilters.includes('water') && !location.amenities?.includes('water')) {
                shouldShow = false;
            }

            if (activeFilters.includes('dump_station') && !location.amenities?.includes('dump_station')) {
                shouldShow = false;
            }

            if (activeFilters.includes('electricity') && !location.amenities?.includes('electricity')) {
                shouldShow = false;
            }

            card.style.display = shouldShow ? 'block' : 'none';
        });
    }
}
