// Home View - Main landing page with category cards
export class HomeView {
    constructor(dataLoader) {
        this.dataLoader = dataLoader;
    }

    async render() {
        const stats = await this.dataLoader.getStats();

        return `
            <div class="home-container">
                <header class="home-header">
                    <h1 class="home-title">🚐 Ultimate Motorhome Knowledge Library</h1>
                    <p class="home-subtitle">Your comprehensive guide to motorhome living, travel, and technical knowledge</p>

                    <div class="stats-grid">
                        <div class="stat-card">
                            <span class="stat-number">${stats.totalLocations || 0}</span>
                            <span class="stat-label">Locations</span>
                        </div>
                        <div class="stat-card">
                            <span class="stat-number">${stats.totalGuides || 0}</span>
                            <span class="stat-label">Guides</span>
                        </div>
                        <div class="stat-card">
                            <span class="stat-number">${stats.totalRoutes || 0}</span>
                            <span class="stat-label">Routes</span>
                        </div>
                        <div class="stat-card">
                            <span class="stat-number">${stats.totalTips || 0}</span>
                            <span class="stat-label">Tips</span>
                        </div>
                    </div>
                </header>

                <div class="categories-grid">
                    ${await this.renderCategoryCards()}
                </div>
            </div>

            <style>
                .home-container {
                    max-width: 1400px;
                    margin: 0 auto;
                }

                .home-header {
                    text-align: center;
                    padding: 60px 20px;
                }

                .home-title {
                    font-size: 3.5rem;
                    margin-bottom: 20px;
                    font-weight: 700;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .home-subtitle {
                    font-size: 1.3rem;
                    color: #666;
                    margin-bottom: 40px;
                }

                .stats-grid {
                    display: flex;
                    justify-content: center;
                    gap: 30px;
                    flex-wrap: wrap;
                    margin-top: 40px;
                }

                .stat-card {
                    background: white;
                    padding: 25px 40px;
                    border-radius: 15px;
                    box-shadow: 0 5px 20px rgba(0,0,0,0.08);
                    text-align: center;
                }

                .stat-number {
                    font-size: 2.5rem;
                    font-weight: 700;
                    color: #667eea;
                    display: block;
                }

                .stat-label {
                    font-size: 1rem;
                    color: #666;
                }

                .categories-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
                    gap: 30px;
                    margin-top: 60px;
                }

                .category-card {
                    background: white;
                    border-radius: 20px;
                    padding: 40px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.08);
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                    cursor: pointer;
                }

                .category-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 15px 50px rgba(0,0,0,0.12);
                }

                .category-icon {
                    font-size: 3rem;
                    margin-bottom: 20px;
                    display: block;
                }

                .category-title {
                    font-size: 1.8rem;
                    font-weight: 700;
                    margin-bottom: 15px;
                    color: #667eea;
                }

                .category-description {
                    color: #666;
                    margin-bottom: 20px;
                    font-size: 1.05rem;
                    line-height: 1.6;
                }

                .category-stats {
                    display: flex;
                    gap: 20px;
                    margin-top: 20px;
                    padding-top: 20px;
                    border-top: 1px solid #eee;
                }

                .category-stat {
                    font-size: 0.9rem;
                    color: #888;
                }

                .category-stat strong {
                    color: #667eea;
                    font-size: 1.2rem;
                    display: block;
                    margin-bottom: 3px;
                }

                @media (max-width: 768px) {
                    .home-title {
                        font-size: 2.5rem;
                    }

                    .categories-grid {
                        grid-template-columns: 1fr;
                    }

                    .stats-grid {
                        gap: 15px;
                    }

                    .stat-card {
                        padding: 15px 25px;
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
            <div class="category-card" onclick="window.location.hash='${cat.route}'">
                <span class="category-icon">${cat.icon}</span>
                <h2 class="category-title">${cat.title}</h2>
                <p class="category-description">${cat.description}</p>
                <div class="category-stats">
                    ${cat.stats.map(s => `
                        <div class="category-stat">
                            <strong>${s.value}</strong>
                            ${s.label}
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }
}
