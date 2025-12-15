// Routes View - Shows all scenic routes (shadcn style)
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
                    max-width: 1000px;
                    margin: 0 auto;
                }

                .routes-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .route-card {
                    cursor: pointer;
                }

                .route-card .card-header {
                    padding: 2rem;
                }

                .route-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 1rem;
                    gap: 1rem;
                }

                .route-title {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: hsl(var(--foreground));
                    margin-bottom: 0.5rem;
                }

                .route-description {
                    color: hsl(var(--muted-foreground));
                    line-height: 1.7;
                    font-size: 0.95rem;
                }

                .route-meta {
                    display: flex;
                    gap: 2rem;
                    flex-wrap: wrap;
                    padding: 1.5rem 2rem;
                    border-top: 1px solid hsl(var(--border));
                    background: hsl(var(--muted));
                }

                .route-meta-item {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }

                .route-meta-label {
                    font-size: 0.75rem;
                    color: hsl(var(--muted-foreground));
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .route-meta-value {
                    font-size: 1rem;
                    font-weight: 600;
                    color: hsl(var(--foreground));
                }

                .route-highlights {
                    padding: 1.5rem 2rem;
                    border-top: 1px solid hsl(var(--border));
                }

                .route-highlights h3 {
                    color: hsl(var(--muted-foreground));
                    margin-bottom: 1rem;
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    font-weight: 600;
                }

                .route-highlights ul {
                    list-style: none;
                    padding: 0;
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                }

                .route-highlights li {
                    padding: 0.5rem 1rem;
                    background: hsl(var(--secondary));
                    border-radius: var(--radius);
                    color: hsl(var(--secondary-foreground));
                    font-size: 0.875rem;
                }

                @media (max-width: 768px) {
                    .route-card .card-header {
                        padding: 1.5rem;
                    }

                    .route-header {
                        flex-direction: column;
                    }

                    .route-meta {
                        padding: 1rem 1.5rem;
                        gap: 1rem;
                    }

                    .route-highlights {
                        padding: 1rem 1.5rem;
                    }
                }
            </style>
        `;
    }

    renderRoutesList() {
        if (this.routes.length === 0) {
            return '<p style="padding: 2rem; text-align: center; color: hsl(var(--muted-foreground));">No routes available</p>';
        }

        return this.routes.map(route => this.renderRouteCard(route)).join('');
    }

    renderRouteCard(route) {
        const name = this.getLocalizedText(route.name);
        const description = this.getLocalizedText(route.description);
        const duration = route.duration || null;
        const distance = route.distance || null;
        const difficulty = route.difficulty || null;
        const highlights = route.highlights || [];

        return `
            <div class="route-card card" data-route-id="${route.id}">
                <div class="card-header">
                    <div class="route-header">
                        <div>
                            <div class="route-title">${name}</div>
                        </div>
                        ${duration ? `<span class="badge badge-primary">${duration}</span>` : ''}
                    </div>
                    <div class="route-description">${description}</div>
                </div>

                <div class="route-meta">
                    ${distance ? `
                        <div class="route-meta-item">
                            <div class="route-meta-label">Distance</div>
                            <div class="route-meta-value">${distance}</div>
                        </div>
                    ` : ''}
                    ${difficulty ? `
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
