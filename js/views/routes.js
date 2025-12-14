// Routes View - Shows all scenic routes
export class RoutesView {
    constructor(dataLoader) {
        this.dataLoader = dataLoader;
        this.routes = [];
    }

    async render() {
        this.routes = await this.dataLoader.getRoutes();
        return `
            <div class="routes-container">
                <header class="page-header">
                    <div class="page-icon">🛣️</div>
                    <h1>Scenic Routes</h1>
                    <p class="page-subtitle">
                        ${this.routes.length} curated motorhome routes across Europe and beyond
                    </p>
                </header>

                <div class="routes-list">
                    ${this.renderRoutesList()}
                </div>
            </div>

            <style>
                .routes-container {
                    max-width: 1200px;
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

                .routes-list {
                    display: grid;
                    gap: 30px;
                }

                .route-card {
                    background: white;
                    border-radius: 20px;
                    padding: 40px;
                    box-shadow: 0 5px 20px rgba(0,0,0,0.05);
                    transition: transform 0.2s, box-shadow 0.2s;
                    cursor: pointer;
                    border-left: 5px solid #667eea;
                }

                .route-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 8px 30px rgba(0,0,0,0.1);
                }

                .route-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 20px;
                }

                .route-title {
                    font-size: 1.8rem;
                    font-weight: 700;
                    color: #333;
                    margin-bottom: 10px;
                }

                .route-duration {
                    background: #f0f4ff;
                    color: #667eea;
                    padding: 8px 16px;
                    border-radius: 20px;
                    font-size: 0.9rem;
                    font-weight: 600;
                }

                .route-description {
                    color: #666;
                    line-height: 1.7;
                    font-size: 1.05rem;
                    margin-bottom: 25px;
                }

                .route-meta {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    margin-bottom: 25px;
                    padding: 20px;
                    background: #f8f9fa;
                    border-radius: 12px;
                }

                .route-meta-item {
                    display: flex;
                    flex-direction: column;
                }

                .route-meta-label {
                    font-size: 0.85rem;
                    color: #888;
                    margin-bottom: 5px;
                }

                .route-meta-value {
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: #333;
                }

                .route-highlights {
                    margin-top: 25px;
                }

                .route-highlights h3 {
                    color: #667eea;
                    margin-bottom: 15px;
                    font-size: 1.2rem;
                }

                .route-highlights ul {
                    list-style: none;
                    padding: 0;
                }

                .route-highlights li {
                    padding: 10px 0;
                    color: #666;
                    position: relative;
                    padding-left: 25px;
                }

                .route-highlights li:before {
                    content: "→";
                    position: absolute;
                    left: 0;
                    color: #667eea;
                    font-weight: bold;
                }

                @media (max-width: 768px) {
                    .page-header h1 {
                        font-size: 2rem;
                    }

                    .route-card {
                        padding: 25px;
                    }

                    .route-header {
                        flex-direction: column;
                        gap: 15px;
                    }

                    .route-meta {
                        grid-template-columns: 1fr;
                        gap: 15px;
                    }
                }
            </style>
        `;
    }

    renderRoutesList() {
        if (this.routes.length === 0) {
            return '<p style="padding: 40px; text-align: center; color: #666;">No routes available</p>';
        }

        return this.routes.map(route => this.renderRouteCard(route)).join('');
    }

    renderRouteCard(route) {
        const name = this.getLocalizedText(route.name);
        const description = this.getLocalizedText(route.description);
        const duration = route.duration || 'N/A';
        const distance = route.distance || 'N/A';
        const difficulty = route.difficulty || 'N/A';
        const highlights = route.highlights || [];

        return `
            <div class="route-card" data-route-id="${route.id}">
                <div class="route-header">
                    <div>
                        <div class="route-title">${name}</div>
                    </div>
                    ${duration !== 'N/A' ? `<div class="route-duration">${duration}</div>` : ''}
                </div>

                <div class="route-description">${description}</div>

                <div class="route-meta">
                    ${distance !== 'N/A' ? `
                        <div class="route-meta-item">
                            <div class="route-meta-label">Distance</div>
                            <div class="route-meta-value">${distance}</div>
                        </div>
                    ` : ''}
                    ${difficulty !== 'N/A' ? `
                        <div class="route-meta-item">
                            <div class="route-meta-label">Difficulty</div>
                            <div class="route-meta-value">${this.formatDifficulty(difficulty)}</div>
                        </div>
                    ` : ''}
                    <div class="route-meta-item">
                        <div class="route-meta-label">Route ID</div>
                        <div class="route-meta-value">${route.id}</div>
                    </div>
                </div>

                ${this.renderHighlights(highlights)}
            </div>
        `;
    }

    renderHighlights(highlights) {
        if (!highlights || highlights.length === 0) {
            return '';
        }

        // Handle both localized and plain array formats
        const highlightsList = Array.isArray(highlights)
            ? highlights.map(h => this.getLocalizedText(h))
            : [this.getLocalizedText(highlights)];

        if (highlightsList.length === 0 || highlightsList[0] === 'N/A') {
            return '';
        }

        return `
            <div class="route-highlights">
                <h3>Highlights</h3>
                <ul>
                    ${highlightsList.map(h => `<li>${h}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    formatDifficulty(difficulty) {
        const levels = {
            'easy': '🟢 Easy',
            'moderate': '🟡 Moderate',
            'challenging': '🟠 Challenging',
            'difficult': '🔴 Difficult'
        };
        return levels[difficulty.toLowerCase()] || difficulty;
    }

    getLocalizedText(textObj) {
        if (!textObj) return 'N/A';
        if (typeof textObj === 'string') return textObj;
        return textObj.en || textObj.he || 'N/A';
    }
}
