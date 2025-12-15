// Guide Detail View - Routes to appropriate template based on category
import { renderTechnicalGuide } from './guide-templates/technical-guide.js';
import { renderLegalGuide } from './guide-templates/legal-guide.js';
import { renderTechGuide } from './guide-templates/tech-guide.js';
import { renderTravelGuide } from './guide-templates/travel-guide.js';

export class GuideDetailView {
    constructor(dataLoader) {
        this.dataLoader = dataLoader;
        this.guide = null;
        this.guideId = null;
        // Get language from URL parameter or default to 'en'
        this.language = this.getLanguageFromUrl() || 'en';
    }

    getLanguageFromUrl() {
        const hash = window.location.hash;
        if (hash.includes('lang=he')) return 'he';
        if (hash.includes('lang=en')) return 'en';
        return null;
    }

    setGuideId(guideId) {
        // Strip query parameters from guide ID (e.g., "guide-010-005?lang=he" -> "guide-010-005")
        this.guideId = guideId?.split('?')[0];
    }

    async render() {
        const guides = await this.dataLoader.getGuides();
        this.guide = guides.find(g => g.id === this.guideId);

        if (!this.guide) {
            return this.renderNotFound();
        }

        // Helper functions passed to templates
        const helpers = {
            getLocalizedText: (textObj) => this.getLocalizedText(textObj, this.language),
            getDifficultyClass: this.getDifficultyClass.bind(this),
            formatDifficulty: this.formatDifficulty.bind(this),
            getTipIcon: this.getTipIcon.bind(this),
            language: this.language,
            isRTL: this.language === 'he'
        };

        // Select template based on category
        const templateType = this.getTemplateType(this.guide.category);

        switch (templateType) {
            case 'technical':
                return renderTechnicalGuide(this.guide, helpers);
            case 'legal':
                return renderLegalGuide(this.guide, helpers);
            case 'tech':
                return renderTechGuide(this.guide, helpers);
            case 'travel':
                return renderTravelGuide(this.guide, helpers);
            default:
                return renderTravelGuide(this.guide, helpers); // Default fallback
        }
    }

    getTemplateType(category) {
        // Map categories to template types
        const categoryMapping = {
            // Technical/Maintenance
            'maintenance': 'technical',
            'gas_systems': 'technical',
            'equipment': 'technical',
            'vehicle-maintenance': 'technical',
            'heating': 'technical',
            'water-systems': 'technical',
            'electrical-systems': 'technical',
            'power-systems': 'technical',
            'fuel-management': 'technical',
            'winter-travel': 'technical',

            // Legal/Documentation
            'legal': 'legal',
            'registration': 'legal',
            'insurance': 'legal',
            'visa-regulations': 'legal',
            'visa-and-border': 'legal',
            'customs': 'legal',
            'documentation': 'legal',
            'vehicle-registration': 'legal',

            // Technology
            'technology': 'tech',
            'navigation': 'tech',
            'connectivity': 'tech',
            'electronics': 'tech',
            'solar-power': 'tech',
            'internet-connectivity': 'tech',
            'navigation-software': 'tech',
            'communication': 'tech',

            // Travel/Lifestyle
            'travel-tips': 'travel',
            'lifestyle': 'travel',
            'safety': 'travel',
            'family-travel': 'travel',
            'community': 'travel',
            'educational': 'travel',
            'shopping': 'travel',
            'cooking': 'travel',
            'cooking-equipment': 'travel',
            'motorhome-selection': 'travel',
            'vehicle-selection': 'travel',
            'vehicles': 'travel',
            'planning': 'travel',
            'setup': 'tech',
            'living': 'travel',
            'climate-control': 'technical',
            'security': 'travel',
            'technical': 'technical',
            'language': 'travel',
            'terminology': 'travel',
            'technical-literature': 'travel',
            'infrastructure': 'legal',
            'purchasing': 'travel',
            'carretera-austral': 'travel'
        };

        return categoryMapping[category] || 'travel';
    }

    renderNotFound() {
        return `
            <div class="guide-detail-container">
                <div class="guide-not-found card">
                    <div class="card-header" style="text-align: center; padding: 3rem;">
                        <h1 style="font-size: 3rem; margin-bottom: 1rem;">🔍</h1>
                        <h2>Guide Not Found</h2>
                        <p style="color: hsl(var(--muted-foreground)); margin: 1rem 0;">
                            The guide you're looking for doesn't exist or has been removed.
                        </p>
                        <a href="#guides" class="btn btn-primary">Back to Guides</a>
                    </div>
                </div>
            </div>

            <style>
                .guide-detail-container {
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 2rem 1rem;
                }
            </style>
        `;
    }

    // Helper functions
    getLocalizedText(textObj, lang = 'en') {
        if (!textObj) return '';
        if (typeof textObj === 'string') return textObj;
        // Return the requested language, fallback to other language if not available
        if (lang === 'he') {
            return textObj.he || textObj.en || '';
        }
        return textObj.en || textObj.he || '';
    }

    getDifficultyClass(difficulty) {
        const classes = {
            'beginner': 'badge-beginner',
            'intermediate': 'badge-intermediate',
            'advanced': 'badge-advanced'
        };
        return classes[difficulty?.toLowerCase()] || 'badge-beginner';
    }

    formatDifficulty(difficulty) {
        const labels = {
            'beginner': '🟢 Beginner',
            'intermediate': '🟡 Intermediate',
            'advanced': '🔴 Advanced'
        };
        return labels[difficulty?.toLowerCase()] || difficulty;
    }

    getTipIcon(type) {
        const icons = {
            'warning': '⚠️',
            'tip': '💡',
            'danger': '🚫',
            'info': 'ℹ️',
            'safety': '🛡️',
            'compatibility': '🔄'
        };
        return icons[type] || 'ℹ️';
    }
}
