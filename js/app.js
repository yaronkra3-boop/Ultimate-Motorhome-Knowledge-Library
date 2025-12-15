// Main Application Controller
import { Router } from './router.js';
import { DataLoader } from './data-loader.js';
import { HomeView } from './views/home.js';
import { MapView } from './views/map.js';
import { LocationsView } from './views/locations.js';
import { GuidesView } from './views/guides.js';
import { RoutesView } from './views/routes.js';
import { GuideDetailView } from './views/guide-detail.js';

class App {
    constructor() {
        this.router = new Router();
        this.dataLoader = new DataLoader();
        this.currentView = null;

        this.init();
    }

    async init() {
        // Load data
        await this.dataLoader.loadData();

        // Setup routes
        this.setupRoutes();

        // Setup search
        this.setupSearch();

        // Setup navigation
        this.setupNavigation();

        // Handle initial route
        this.router.handleRoute();
    }

    setupRoutes() {
        this.router.addRoute('home', () => this.loadView(HomeView));
        this.router.addRoute('map', () => this.loadView(MapView));
        this.router.addRoute('locations', () => this.loadView(LocationsView));
        this.router.addRoute('guides', () => this.loadView(GuidesView));
        this.router.addRoute('routes', () => this.loadView(RoutesView));

        // Guide detail route with parameter (params is an array like ['guide-001'])
        this.router.addRoute('guide', (params) => this.loadGuideDetail(params[0]));

        // Default route
        this.router.setDefaultRoute('home');
    }

    async loadGuideDetail(guideId) {
        const container = document.getElementById('main-content');
        container.innerHTML = '<div class="loading">Loading</div>';

        try {
            const view = new GuideDetailView(this.dataLoader);
            view.setGuideId(guideId);
            this.currentView = view;
            const html = await view.render();
            container.innerHTML = html;

            if (view.afterRender) {
                view.afterRender();
            }
        } catch (error) {
            console.error('Error loading guide:', error);
            container.innerHTML = '<div class="error">Error loading guide. Please try again.</div>';
        }
    }

    async loadView(ViewClass) {
        const container = document.getElementById('main-content');
        container.innerHTML = '<div class="loading">Loading</div>';

        try {
            this.currentView = new ViewClass(this.dataLoader);
            const html = await this.currentView.render();
            container.innerHTML = html;

            // Call post-render hook if it exists
            if (this.currentView.afterRender) {
                this.currentView.afterRender();
            }
        } catch (error) {
            console.error('Error loading view:', error);
            container.innerHTML = '<div class="error">Error loading content. Please try again.</div>';
        }
    }

    setupSearch() {
        const searchBtn = document.getElementById('search-btn');
        const closeSearch = document.getElementById('close-search');
        const searchOverlay = document.getElementById('search-overlay');
        const searchInput = document.getElementById('global-search');

        searchBtn.addEventListener('click', () => {
            searchOverlay.classList.remove('hidden');
            searchInput.focus();
        });

        closeSearch.addEventListener('click', () => {
            searchOverlay.classList.add('hidden');
            searchInput.value = '';
            document.getElementById('search-results').innerHTML = '';
        });

        // Close on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !searchOverlay.classList.contains('hidden')) {
                searchOverlay.classList.add('hidden');
                searchInput.value = '';
                document.getElementById('search-results').innerHTML = '';
            }
        });

        // Search functionality
        searchInput.addEventListener('input', (e) => {
            this.performSearch(e.target.value);
        });
    }

    async performSearch(query) {
        const resultsContainer = document.getElementById('search-results');

        if (!query || query.length < 2) {
            resultsContainer.innerHTML = '';
            return;
        }

        resultsContainer.innerHTML = '<p style="color: #666; padding: 20px;">Searching...</p>';

        const results = await this.dataLoader.search(query);

        if (results.length === 0) {
            resultsContainer.innerHTML = '<p style="color: #666; padding: 20px;">No results found</p>';
            return;
        }

        const html = `
            <h3 style="margin-bottom: 20px; color: #667eea;">Found ${results.length} results</h3>
            ${results.map(result => `
                <div style="padding: 15px; border-bottom: 1px solid #eee; cursor: pointer;"
                     onclick="window.location.hash = '${result.route}'">
                    <div style="font-weight: 600; color: #667eea; margin-bottom: 5px;">
                        ${result.type} - ${result.title}
                    </div>
                    <div style="font-size: 0.9rem; color: #666;">
                        ${result.description || ''}
                    </div>
                </div>
            `).join('')}
        `;

        resultsContainer.innerHTML = html;
    }

    setupNavigation() {
        // Handle nav link clicks
        document.querySelectorAll('.nav-links a, [data-route]').forEach(link => {
            link.addEventListener('click', (e) => {
                // Update active state
                document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
                if (e.target.classList.contains('nav-links')) {
                    e.target.classList.add('active');
                }
            });
        });

        // Listen for hash changes
        window.addEventListener('hashchange', () => {
            this.router.handleRoute();

            // Close search overlay if open
            document.getElementById('search-overlay').classList.add('hidden');
        });
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new App());
} else {
    new App();
}
