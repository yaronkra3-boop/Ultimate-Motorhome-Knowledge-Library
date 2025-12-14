// Data Loader - Fetches and manages categorized datasets
export class DataLoader {
    constructor() {
        this.data = {
            locations: null,
            guides: null,
            routes: null,
            costs: null,
            contacts: null,
            tips: null
        };
        this.dataPaths = {
            locations: 'datasets/mvp-locations-curated.json',
            guides: 'datasets/dataset-guides.json',
            routes: 'datasets/dataset-routes.json',
            costs: 'datasets/dataset-costs.json',
            contacts: 'datasets/dataset-contacts.json',
            tips: 'datasets/dataset-tips.json'
        };
        this.loadedCategories = new Set();
    }

    async loadData() {
        // Load only curated locations on initial load for fast startup
        try {
            await this.loadCategory('locations');
            console.log('Initial data loaded successfully');
            return this.data;
        } catch (error) {
            console.error('Error loading initial data:', error);
            throw error;
        }
    }

    async loadCategory(category) {
        if (this.loadedCategories.has(category)) {
            return this.data[category];
        }

        try {
            const response = await fetch(this.dataPaths[category]);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const json = await response.json();
            // Extract the array from nested structure (e.g., {metadata, locations} -> locations array)
            this.data[category] = json[category] || json;
            this.loadedCategories.add(category);
            console.log(`${category} data loaded successfully: ${this.data[category].length} items`);
            return this.data[category];
        } catch (error) {
            console.error(`Error loading ${category} data:`, error);
            throw error;
        }
    }

    // Get all locations
    async getLocations() {
        await this.loadCategory('locations');
        return this.data.locations || [];
    }

    // Get all routes
    async getRoutes() {
        await this.loadCategory('routes');
        return this.data.routes || [];
    }

    // Get all guides
    async getGuides() {
        await this.loadCategory('guides');
        return this.data.guides || [];
    }

    // Get all tips
    async getTips() {
        await this.loadCategory('tips');
        return this.data.tips || [];
    }

    // Get all costs
    async getCosts() {
        await this.loadCategory('costs');
        return this.data.costs || [];
    }

    // Get all contacts
    async getContacts() {
        await this.loadCategory('contacts');
        return this.data.contacts || [];
    }

    // Get guides by category
    async getGuidesByCategory(category) {
        const guides = await this.getGuides();
        return guides.filter(guide => guide.category === category);
    }

    // Get locations by type
    async getLocationsByType(type) {
        const locations = await this.getLocations();
        return locations.filter(loc => loc.type === type);
    }

    // Search across all data
    async search(query) {
        if (!query) return [];

        const lowerQuery = query.toLowerCase();
        const results = [];

        // Search locations
        const locations = await this.getLocations();
        locations.forEach(loc => {
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

        // Load and search guides if needed
        if (this.loadedCategories.has('guides')) {
            const guides = await this.getGuides();
            guides.forEach(guide => {
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
        }

        // Load and search routes if needed
        if (this.loadedCategories.has('routes')) {
            const routes = await this.getRoutes();
            routes.forEach(route => {
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
        }

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

    // Get statistics (load all categories to show counts)
    async getStats() {
        const locations = await this.getLocations();
        const guides = await this.getGuides();
        const routes = await this.getRoutes();
        const tips = await this.getTips();

        return {
            totalLocations: locations.length,
            totalGuides: guides.length,
            totalRoutes: routes.length,
            totalTips: tips.length
        };
    }

    // Get metadata
    getMetadata() {
        return {
            project: "Ultimate Motorhome Knowledge Library",
            dataVersion: "2.0-categorized",
            description: "Categorized dataset with lazy loading"
        };
    }
}
