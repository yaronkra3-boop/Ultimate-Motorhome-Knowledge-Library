// Guides View - Shows all knowledge guides organized by category (shadcn style)
export class GuidesView {
    constructor(dataLoader) {
        this.dataLoader = dataLoader;
        this.guides = [];
        this.categories = [];
    }

    async loadGuides() {
        this.guides = await this.dataLoader.getGuides();
        this.categories = this.extractCategories();
    }

    extractCategories() {
        const categoryMap = new Map();

        this.guides.forEach(guide => {
            const category = guide.category || 'uncategorized';
            if (!categoryMap.has(category)) {
                categoryMap.set(category, []);
            }
            categoryMap.get(category).push(guide);
        });

        return Array.from(categoryMap.entries()).map(([name, guides]) => ({
            name,
            count: guides.length,
            guides
        })).sort((a, b) => b.count - a.count);
    }

    async render() {
        await this.loadGuides();
        return `
            <div class="guides-container">
                <header class="page-header">
                    <div class="page-icon">📚</div>
                    <h1>Knowledge Guides</h1>
                    <p class="page-subtitle">
                        ${this.guides.length} comprehensive guides across ${this.categories.length} categories
                    </p>
                </header>

                <div class="guides-content">
                    <div class="categories-sidebar">
                        <h3>Categories</h3>
                        <div class="category-list">
                            <button class="category-filter active" data-category="all">
                                All Guides <span class="badge">${this.guides.length}</span>
                            </button>
                            ${this.categories.map(cat => `
                                <button class="category-filter" data-category="${cat.name}">
                                    ${this.formatCategoryName(cat.name)} <span class="badge">${cat.count}</span>
                                </button>
                            `).join('')}
                        </div>
                    </div>

                    <div class="guides-list">
                        ${this.renderGuidesList()}
                    </div>
                </div>
            </div>

            <style>
                .guides-container {
                    max-width: 1280px;
                    margin: 0 auto;
                }

                .guides-content {
                    display: grid;
                    grid-template-columns: 280px 1fr;
                    gap: 2rem;
                }

                .categories-sidebar {
                    background: hsl(var(--card));
                    padding: 1.5rem;
                    border-radius: calc(var(--radius) + 4px);
                    border: 1px solid hsl(var(--border));
                    height: fit-content;
                    position: sticky;
                    top: 5rem;
                }

                .categories-sidebar h3 {
                    margin-bottom: 1rem;
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: hsl(var(--muted-foreground));
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .category-list {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }

                .category-filter {
                    background: transparent;
                    border: none;
                    padding: 0.75rem 1rem;
                    text-align: left;
                    cursor: pointer;
                    border-radius: var(--radius);
                    font-size: 0.875rem;
                    transition: all 0.2s;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    color: hsl(var(--foreground));
                }

                .category-filter:hover {
                    background: hsl(var(--accent));
                }

                .category-filter.active {
                    background: hsl(var(--primary));
                    color: hsl(var(--primary-foreground));
                }

                .category-filter.active .badge {
                    background: hsla(0, 0%, 100%, 0.2);
                    color: hsl(var(--primary-foreground));
                }

                .guides-list {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                    gap: 1.5rem;
                }

                .guide-card {
                    cursor: pointer;
                }

                .guide-card .card-header {
                    padding: 1.5rem;
                }

                .guide-category-tag {
                    margin-bottom: 0.75rem;
                }

                .guide-title {
                    font-size: 1.125rem;
                    font-weight: 600;
                    color: hsl(var(--foreground));
                    margin-bottom: 0.75rem;
                    line-height: 1.4;
                }

                .guide-summary {
                    color: hsl(var(--muted-foreground));
                    line-height: 1.6;
                    font-size: 0.875rem;
                }

                .guide-meta {
                    padding: 1rem 1.5rem;
                    border-top: 1px solid hsl(var(--border));
                    font-size: 0.75rem;
                    color: hsl(var(--muted-foreground));
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                }

                .guide-arrow {
                    margin-left: auto;
                    font-size: 1.25rem;
                    color: hsl(var(--primary));
                    opacity: 0;
                    transform: translateX(-5px);
                    transition: all 0.2s;
                }

                a.guide-card {
                    text-decoration: none;
                    display: block;
                    transition: transform 0.2s, box-shadow 0.2s;
                }

                a.guide-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgb(0 0 0 / 0.1);
                }

                a.guide-card:hover .guide-arrow {
                    opacity: 1;
                    transform: translateX(0);
                }

                @media (max-width: 1024px) {
                    .guides-content {
                        grid-template-columns: 1fr;
                    }

                    .categories-sidebar {
                        position: static;
                    }

                    .category-list {
                        flex-direction: row;
                        flex-wrap: wrap;
                        gap: 0.5rem;
                    }

                    .category-filter {
                        padding: 0.5rem 0.75rem;
                    }
                }

                @media (max-width: 768px) {
                    .guides-list {
                        grid-template-columns: 1fr;
                    }
                }
            </style>
        `;
    }

    renderGuidesList() {
        if (this.guides.length === 0) {
            return '<p style="padding: 2rem; text-align: center; color: hsl(var(--muted-foreground));">No guides available</p>';
        }

        return this.guides.map(guide => this.renderGuideCard(guide)).join('');
    }

    renderGuideCard(guide) {
        const title = this.getLocalizedText(guide.title);
        // Get summary - if not available, try to get first content item's description
        let summary = this.getLocalizedText(guide.summary);
        if (summary === 'N/A' && guide.content && guide.content.length > 0) {
            summary = this.getLocalizedText(guide.content[0]?.description || guide.content[0]?.title);
        }
        const category = guide.category || 'uncategorized';
        const contentCount = guide.content?.length || 0;
        const tipCount = guide.tips?.length || 0;
        const contributors = guide.contributors || null;

        // Safely truncate summary
        const truncatedSummary = typeof summary === 'string' && summary !== 'N/A'
            ? (summary.length > 180 ? summary.substring(0, 180) + '...' : summary)
            : summary;

        // Format contributors for display (extract just first names)
        const contributorDisplay = contributors ? this.formatContributors(contributors) : '';

        return `
            <a href="#guide/${guide.id}" class="guide-card card" data-guide-id="${guide.id}" data-category="${category}">
                <div class="card-header">
                    <span class="badge badge-primary guide-category-tag">${this.formatCategoryName(category)}</span>
                    <div class="guide-title">${title}</div>
                    ${contributorDisplay ? `<div class="guide-contributors">👤 ${contributorDisplay}</div>` : ''}
                    <div class="guide-summary">
                        ${truncatedSummary}
                    </div>
                </div>
                <div class="guide-meta">
                    ${contentCount > 0 ? `<span>${contentCount} steps</span>` : ''}
                    ${tipCount > 0 ? `<span>${tipCount} tips</span>` : ''}
                    <span class="guide-arrow">→</span>
                </div>
            </a>
        `;
    }

    formatContributors(contributors) {
        // Extract names and simplify
        // e.g., "Multiple contributors: Ilan, Elisha, Ephraim Lior" -> "Ilan, Elisha, Ephraim Lior"
        let cleaned = contributors.replace('Multiple contributors: ', '');
        cleaned = cleaned.replace(' (primary)', '');
        cleaned = cleaned.replace(' (supporting)', '');
        cleaned = cleaned.replace(', with input from ', ', ');
        // Remove Hebrew names in parentheses
        cleaned = cleaned.replace(/[א-ת]+ /g, '');
        cleaned = cleaned.replace(/\([^)]*\)/g, '');
        // Limit to reasonable length
        if (cleaned.length > 50) {
            const names = cleaned.split(',').slice(0, 3);
            cleaned = names.join(',') + '...';
        }
        return cleaned.trim();
    }

    formatCategoryName(category) {
        return category
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    getLocalizedText(textObj) {
        if (!textObj) return 'N/A';
        if (typeof textObj === 'string') return textObj;
        return textObj.en || textObj.he || 'N/A';
    }

    afterRender() {
        // Add category filter functionality
        document.querySelectorAll('.category-filter').forEach(button => {
            button.addEventListener('click', (e) => {
                const category = e.currentTarget.dataset.category;

                // Update active state
                document.querySelectorAll('.category-filter').forEach(btn =>
                    btn.classList.remove('active')
                );
                e.currentTarget.classList.add('active');

                // Filter guides
                this.filterByCategory(category);
            });
        });
    }

    filterByCategory(category) {
        document.querySelectorAll('.guide-card').forEach(card => {
            if (category === 'all') {
                card.style.display = 'block';
            } else {
                const cardCategory = card.dataset.category;
                card.style.display = cardCategory === category ? 'block' : 'none';
            }
        });
    }
}
