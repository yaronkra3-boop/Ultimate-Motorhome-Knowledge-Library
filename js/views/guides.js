// Guides View - Shows all knowledge guides organized by category
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
                                All Guides <span class="count">${this.guides.length}</span>
                            </button>
                            ${this.categories.map(cat => `
                                <button class="category-filter" data-category="${cat.name}">
                                    ${this.formatCategoryName(cat.name)} <span class="count">${cat.count}</span>
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

                .guides-content {
                    display: grid;
                    grid-template-columns: 280px 1fr;
                    gap: 30px;
                }

                .categories-sidebar {
                    background: white;
                    padding: 25px;
                    border-radius: 15px;
                    box-shadow: 0 5px 20px rgba(0,0,0,0.05);
                    height: fit-content;
                    position: sticky;
                    top: 100px;
                }

                .categories-sidebar h3 {
                    margin-bottom: 20px;
                    color: #667eea;
                }

                .category-list {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .category-filter {
                    background: transparent;
                    border: none;
                    padding: 12px 15px;
                    text-align: left;
                    cursor: pointer;
                    border-radius: 8px;
                    font-size: 0.95rem;
                    transition: background 0.2s;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .category-filter:hover {
                    background: #f5f7fa;
                }

                .category-filter.active {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    font-weight: 600;
                }

                .category-filter .count {
                    font-size: 0.85rem;
                    opacity: 0.8;
                }

                .guides-list {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
                    gap: 25px;
                }

                .guide-card {
                    background: white;
                    border-radius: 15px;
                    padding: 30px;
                    box-shadow: 0 5px 20px rgba(0,0,0,0.05);
                    transition: transform 0.2s, box-shadow 0.2s;
                    cursor: pointer;
                    border-left: 4px solid #667eea;
                }

                .guide-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 8px 30px rgba(0,0,0,0.1);
                }

                .guide-category-tag {
                    display: inline-block;
                    background: #f0f4ff;
                    color: #667eea;
                    padding: 5px 12px;
                    border-radius: 20px;
                    font-size: 0.8rem;
                    margin-bottom: 15px;
                }

                .guide-title {
                    font-size: 1.4rem;
                    font-weight: 700;
                    color: #333;
                    margin-bottom: 15px;
                    line-height: 1.3;
                }

                .guide-content {
                    color: #666;
                    line-height: 1.6;
                    font-size: 0.95rem;
                }

                .guide-meta {
                    margin-top: 20px;
                    padding-top: 20px;
                    border-top: 1px solid #eee;
                    font-size: 0.85rem;
                    color: #888;
                }

                @media (max-width: 1024px) {
                    .guides-content {
                        grid-template-columns: 1fr;
                    }

                    .categories-sidebar {
                        position: static;
                    }
                }

                @media (max-width: 768px) {
                    .page-header h1 {
                        font-size: 2rem;
                    }

                    .guides-list {
                        grid-template-columns: 1fr;
                    }
                }
            </style>
        `;
    }

    renderGuidesList() {
        if (this.guides.length === 0) {
            return '<p style="padding: 40px; text-align: center; color: #666;">No guides available</p>';
        }

        return this.guides.map(guide => this.renderGuideCard(guide)).join('');
    }

    renderGuideCard(guide) {
        const title = this.getLocalizedText(guide.title);
        const summary = this.getLocalizedText(guide.summary || guide.content);
        const category = guide.category || 'uncategorized';

        return `
            <div class="guide-card" data-guide-id="${guide.id}" data-category="${category}">
                <div class="guide-category-tag">${this.formatCategoryName(category)}</div>
                <div class="guide-title">${title}</div>
                <div class="guide-content">
                    ${summary?.substring(0, 200)}${summary?.length > 200 ? '...' : ''}
                </div>
                <div class="guide-meta">
                    ${guide.difficulty || ''} ${guide.timeRequired ? '• ' + guide.timeRequired : ''}
                </div>
            </div>
        `;
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
