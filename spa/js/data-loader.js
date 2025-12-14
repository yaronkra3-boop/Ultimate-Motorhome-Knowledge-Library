// Data Loader - Fetches and manages the unified dataset
export class DataLoader {
    constructor() {
        this.data = null;
        this.dataPath = '../datasets/dataset-unified.json';
    }

    async loadData() {
        try {
            const response = await fetch(this.dataPath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.data = await response.json();
            console.log('Data loaded successfully:', this.data.metadata);
            return this.data;
        } catch (error) {
            console.error('Error loading data:', error);
            throw error;
        }
    }

    // Get all locations
    getLocations() {
        return this.data?.data?.locations || [];
    }

    // Get all routes
    getRoutes() {
        return this.data?.data?.routes || [];
    }

    // Get all guides
    getGuides() {
        return this.data?.data?.guides || [];
    }

    // Get all tips
    getTips() {
        return this.data?.data?.tips || [];
    }

    // Get all costs
    getCosts() {
        return this.data?.data?.costs || [];
    }

    // Get all contacts
    getContacts() {
        return this.data?.data?.contacts || [];
    }

    // Get guides by category
    getGuidesByCategory(category) {
        return this.getGuides().filter(guide => guide.category === category);
    }

    // Get locations by type
    getLocationsByType(type) {
        return this.getLocations().filter(loc => loc.type === type);
    }

    // Search across all data
    search(query) {
        if (!query || !this.data) return [];

        const lowerQuery = query.toLowerCase();
        const results = [];

        // Search locations
        this.getLocations().forEach(loc => {
            if (this.matchesQuery(loc, lowerQuery, ['name', 'description', 'address'])) {
                results.push({
                    type: 'Location',
                    title: this.getLocalizedText(loc.name),
                    description: this.getLocalizedText(loc.description)?.substring(0, 150) + '...',
                    route: `locations/${loc.id}`,
                    data: loc
                });
            }
        });

        // Search guides
        this.getGuides().forEach(guide => {
            if (this.matchesQuery(guide, lowerQuery, ['title', 'content', 'category'])) {
                results.push({
                    type: 'Guide',
                    title: this.getLocalizedText(guide.title),
                    description: this.getLocalizedText(guide.content)?.substring(0, 150) + '...',
                    route: `guides/${guide.id}`,
                    data: guide
                });
            }
        });

        // Search routes
        this.getRoutes().forEach(route => {
            if (this.matchesQuery(route, lowerQuery, ['name', 'description'])) {
                results.push({
                    type: 'Route',
                    title: this.getLocalizedText(route.name),
                    description: this.getLocalizedText(route.description)?.substring(0, 150) + '...',
                    route: `routes/${route.id}`,
                    data: route
                });
            }
        });

        return results.slice(0, 50); // Limit to 50 results
    }

    // Helper: Check if object matches query in specified fields
    matchesQuery(obj, query, fields) {
        return fields.some(field => {
            const value = obj[field];
            if (!value) return false;

            // Handle localized text
            if (typeof value === 'object' && (value.en || value.he)) {
                return (value.en?.toLowerCase().includes(query) ||
                        value.he?.toLowerCase().includes(query));
            }

            // Handle regular strings
            if (typeof value === 'string') {
                return value.toLowerCase().includes(query);
            }

            return false;
        });
    }

    // Helper: Get localized text (prefer English, fallback to Hebrew)
    getLocalizedText(textObj) {
        if (!textObj) return '';
        if (typeof textObj === 'string') return textObj;
        return textObj.en || textObj.he || '';
    }

    // Get statistics
    getStats() {
        return this.data?.statistics || {};
    }

    // Get metadata
    getMetadata() {
        return this.data?.metadata || {};
    }
}
