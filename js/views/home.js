// Home View - Main landing page with category cards (shadcn style)
export class HomeView {
    constructor(dataLoader) {
        this.dataLoader = dataLoader;
    }

    async render() {
        const stats = await this.dataLoader.getStats();

        return `
            <div class="home-container">
                <!-- Hero Section -->
                <section class="hero">
                    <h1 class="hero-title">Ultimate Motorhome Knowledge Library</h1>
                    <p class="hero-subtitle">Your comprehensive guide to motorhome living, travel, and technical knowledge</p>

                    <!-- Stats Cards -->
                    <div class="stats-grid">
                        <div class="card">
                            <div class="card-header">
                                <h3 class="card-title">Locations</h3>
                                <p class="card-description">${stats.totalLocations || 0}</p>
                            </div>
                        </div>
                        <div class="card">
                            <div class="card-header">
                                <h3 class="card-title">Guides</h3>
                                <p class="card-description">${stats.totalGuides || 0}</p>
                            </div>
                        </div>
                        <div class="card">
                            <div class="card-header">
                                <h3 class="card-title">Routes</h3>
                                <p class="card-description">${stats.totalRoutes || 0}</p>
                            </div>
                        </div>
                        <div class="card">
                            <div class="card-header">
                                <h3 class="card-title">Tips</h3>
                                <p class="card-description">${stats.totalTips || 0}</p>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Categories -->
                <section class="categories-grid">
                    ${await this.renderCategoryCards()}
                </section>
            </div>

            <style>
                .home-container {
                    max-width: 1280px;
                    margin: 0 auto;
                }

                .hero {
                    padding: 4rem 0 3rem;
                    text-align: center;
                }

                .hero-title {
                    font-size: 3rem;
                    font-weight: 800;
                    margin-bottom: 1rem;
                    background: linear-gradient(135deg, hsl(var(--primary)) 0%, #764ba2 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .hero-subtitle {
                    font-size: 1.25rem;
                    color: hsl(var(--muted-foreground));
                    margin-bottom: 2.5rem;
                }

                @media (max-width: 768px) {
                    .hero-title {
                        font-size: 2rem;
                    }

                    .hero-subtitle {
                        font-size: 1rem;
                    }
                }
            </style>
        `;
    }

    async renderCategoryCards() {
        const stats = await this.dataLoader.getStats();

        const categories = [
            {
                icon: '🗺️',
                title: 'Locations & Navigation',
                description: 'Interactive maps, parking spots, camping areas, scenic routes, and navigation tools for planning your journey.',
                route: 'locations',
                stats: [
                    { label: 'Locations', value: stats.totalLocations || 0 },
                    { label: 'Routes', value: stats.totalRoutes || 0 }
                ]
            },
            {
                icon: '📚',
                title: 'Knowledge Guides',
                description: 'Comprehensive guides covering technical systems, equipment, legal requirements, and daily living on the road.',
                route: 'guides',
                stats: [
                    { label: 'Guides', value: stats.totalGuides || 0 },
                    { label: 'Tips', value: stats.totalTips || 0 }
                ]
            },
            {
                icon: '🛣️',
                title: 'Scenic Routes',
                description: 'Curated motorhome routes across Europe and beyond, with highlights, tips, and community experiences.',
                route: 'routes',
                stats: [
                    { label: 'Routes', value: stats.totalRoutes || 0 }
                ]
            }
        ];

        return categories.map(cat => `
            <a href="#${cat.route}" class="category-card">
                <div class="card">
                    <div class="card-header" style="padding: 2rem;">
                        <span class="category-icon">${cat.icon}</span>
                        <h2 class="category-title">${cat.title}</h2>
                        <p class="category-description">${cat.description}</p>
                    </div>
                    <div class="card-footer">
                        <div class="category-stats">
                            ${cat.stats.map(s => `
                                <div class="category-stat">
                                    <span class="stat-value">${s.value}</span>
                                    <span class="stat-label">${s.label}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </a>
        `).join('');
    }
}
