// Locations View - Shows all parking locations (shadcn style)
export class LocationsView {
    constructor(dataLoader) {
        this.dataLoader = dataLoader;
        this.locations = [];
    }

    async render() {
        this.locations = await this.dataLoader.getLocations();
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
                            <label class="filter-checkbox">
                                <input type="checkbox" data-filter="water">
                                <span>💧 Water Available</span>
                            </label>
                            <label class="filter-checkbox">
                                <input type="checkbox" data-filter="dump_station">
                                <span>🚽 Dump Station</span>
                            </label>
                            <label class="filter-checkbox">
                                <input type="checkbox" data-filter="electricity">
                                <span>⚡ Electricity</span>
                            </label>
                            <label class="filter-checkbox">
                                <input type="checkbox" data-filter="free">
                                <span>🆓 Free Only</span>
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
                    max-width: 1280px;
                    margin: 0 auto;
                }

                .locations-content {
                    display: grid;
                    grid-template-columns: 250px 1fr;
                    gap: 2rem;
                }

                .locations-filters {
                    background: hsl(var(--card));
                    padding: 1.5rem;
                    border-radius: calc(var(--radius) + 4px);
                    border: 1px solid hsl(var(--border));
                    height: fit-content;
                    position: sticky;
                    top: 5rem;
                }

                .locations-filters h3 {
                    margin-bottom: 1rem;
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: hsl(var(--muted-foreground));
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .filter-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .filter-checkbox {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    cursor: pointer;
                    font-size: 0.875rem;
                    color: hsl(var(--foreground));
                    padding: 0.5rem;
                    border-radius: var(--radius);
                    transition: background 0.2s;
                }

                .filter-checkbox:hover {
                    background: hsl(var(--accent));
                }

                .filter-checkbox input[type="checkbox"] {
                    cursor: pointer;
                    width: 1rem;
                    height: 1rem;
                }

                .locations-list {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                    gap: 1.5rem;
                }

                .location-card {
                    cursor: pointer;
                }

                .location-card .card-header {
                    padding: 1.5rem;
                }

                .location-name {
                    font-size: 1.125rem;
                    font-weight: 600;
                    color: hsl(var(--foreground));
                    margin-bottom: 0.5rem;
                }

                .location-address {
                    color: hsl(var(--muted-foreground));
                    font-size: 0.75rem;
                    margin-bottom: 1rem;
                }

                .location-description {
                    color: hsl(var(--muted-foreground));
                    font-size: 0.875rem;
                    line-height: 1.6;
                    margin-bottom: 1rem;
                }

                .location-amenities {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                    margin-bottom: 1rem;
                }

                .location-footer {
                    padding: 1rem 1.5rem;
                    border-top: 1px solid hsl(var(--border));
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .location-cost {
                    font-weight: 600;
                    font-size: 0.875rem;
                }

                .location-cost.free {
                    color: #22c55e;
                }

                .location-cost.paid {
                    color: #f59e0b;
                }

                @media (max-width: 1024px) {
                    .locations-content {
                        grid-template-columns: 1fr;
                    }

                    .locations-filters {
                        position: static;
                    }

                    .filter-group {
                        flex-direction: row;
                        flex-wrap: wrap;
                        gap: 0.5rem;
                    }
                }

                @media (max-width: 768px) {
                    .locations-list {
                        grid-template-columns: 1fr;
                    }
                }
            </style>
        `;
    }

    renderLocationsList() {
        if (this.locations.length === 0) {
            return '<p style="padding: 2rem; text-align: center; color: hsl(var(--muted-foreground));">No locations available</p>';
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
        const costClass = cost.type === 'free' ? 'free' : 'paid';

        return `
            <div class="location-card card" data-location-id="${location.id}">
                <div class="card-header">
                    <div class="location-name">${name}</div>
                    <div class="location-address">${address}</div>
                    <div class="location-description">${description?.substring(0, 100)}${description?.length > 100 ? '...' : ''}</div>

                    ${amenities.length > 0 ? `
                        <div class="location-amenities">
                            ${amenities.map(a => `<span class="badge">${this.formatAmenity(a)}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
                <div class="location-footer">
                    <div class="location-cost ${costClass}">${costText}</div>
                    <span class="badge badge-primary">${location.type || 'Location'}</span>
                </div>
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
            'water': '💧',
            'dump_station': '🚽',
            'grey_water_disposal': '💦',
            'electricity': '⚡',
            'wifi': '📶',
            'security': '🔒'
        };
        return amenityMap[amenity] || amenity;
    }

    afterRender() {
        document.querySelectorAll('.filter-group input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.applyFilters());
        });
    }

    applyFilters() {
        const activeFilters = Array.from(document.querySelectorAll('.filter-group input:checked'))
            .map(cb => cb.dataset.filter);

        document.querySelectorAll('.location-card').forEach(card => {
            const locationId = card.dataset.locationId;
            const location = this.locations.find(l => l.id === locationId);

            if (!location) {
                card.style.display = 'none';
                return;
            }

            let shouldShow = true;

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
