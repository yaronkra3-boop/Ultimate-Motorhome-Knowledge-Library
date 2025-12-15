// Travel Guide Template - For travel-tips, lifestyle, safety, family-travel, community
// Features: Cultural tips, seasonal info, local recommendations, safety notes

export function renderTravelGuide(guide, helpers) {
    const { getLocalizedText, getTipIcon, language, isRTL } = helpers;
    const dir = isRTL ? 'rtl' : 'ltr';

    const title = getLocalizedText(guide.title);
    const summary = getLocalizedText(guide.summary);
    const content = guide.content || [];
    const tips = guide.tips || [];
    const category = guide.category || 'travel-tips';
    const region = guide.region || null;
    const bestSeason = guide.bestSeason || null;

    // Separate tips by type
    const safetyNotes = tips.filter(t => t.type === 'warning' || t.type === 'danger' || t.type === 'safety');
    const culturalTips = tips.filter(t => t.type === 'tip' || t.type === 'info');

    const langToggle = language === 'he'
        ? `<a href="#guide/${guide.id}?lang=en" class="lang-toggle">EN 🇬🇧</a>`
        : `<a href="#guide/${guide.id}?lang=he" class="lang-toggle">עב 🇮🇱</a>`;

    return `
        <div class="guide-detail-container travel-guide" dir="${dir}">
            <div class="guide-detail-header">
                <a href="#guides" class="back-link">
                    <span class="back-arrow">${isRTL ? '→' : '←'}</span> ${isRTL ? 'חזרה למדריכים' : 'Back to Guides'}
                </a>
                <div class="guide-badges">
                    ${langToggle}
                    <span class="badge badge-travel">${formatCategory(category)}</span>
                    ${region ? `<span class="badge badge-region">📍 ${region}</span>` : ''}
                </div>
            </div>

            <article class="guide-article">
                <header class="guide-title-section travel-header">
                    <div class="travel-icon">${getCategoryIcon(category)}</div>
                    <h1 class="guide-title">${title}</h1>
                    <p class="guide-summary">${summary}</p>
                </header>

                ${safetyNotes.length > 0 ? renderSafetyNotes(safetyNotes, getLocalizedText, getTipIcon) : ''}

                ${content.length > 0 ? renderTravelSections(content, getLocalizedText) : ''}

                ${culturalTips.length > 0 ? renderCulturalTips(culturalTips, getLocalizedText, getTipIcon) : ''}

                ${guide.extra_info ? renderExtraInfo(guide.extra_info) : ''}

                ${guide.references && guide.references.length > 0 ? renderReferences(guide.references) : ''}

                ${renderTravelFooter(guide)}
            </article>
        </div>

        <style>
            .travel-guide .travel-header {
                background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
                border-bottom: 3px solid #f59e0b;
                position: relative;
                overflow: hidden;
            }

            .travel-header::before {
                content: '';
                position: absolute;
                top: 0;
                right: 0;
                width: 200px;
                height: 200px;
                background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90' opacity='0.1'%3E🌍%3C/text%3E%3C/svg%3E") no-repeat;
                background-size: contain;
                opacity: 0.5;
            }

            .travel-icon {
                font-size: 3rem;
                margin-bottom: 1rem;
                position: relative;
                z-index: 1;
            }

            .badge-travel {
                background: rgba(245, 158, 11, 0.1);
                color: #b45309;
                border: 1px solid rgba(245, 158, 11, 0.3);
            }

            .badge-region {
                background: hsl(var(--muted));
                color: hsl(var(--muted-foreground));
            }

            /* Safety Notes */
            .safety-notes {
                padding: 1.5rem 2rem;
                border-bottom: 1px solid hsl(var(--border));
                background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
            }

            .safety-notes-header {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                margin-bottom: 1rem;
            }

            .safety-notes-header h3 {
                color: #991b1b;
                font-size: 1rem;
                font-weight: 600;
                margin: 0;
            }

            .safety-list {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }

            .safety-note-item {
                display: flex;
                align-items: flex-start;
                gap: 0.5rem;
                font-size: 0.875rem;
                color: #7f1d1d;
                line-height: 1.5;
            }

            /* Quick Facts */
            .quick-facts {
                padding: 1.5rem 2rem;
                border-bottom: 1px solid hsl(var(--border));
                background: hsl(var(--muted));
            }

            .quick-facts h2 {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-size: 1rem;
                font-weight: 600;
                color: hsl(var(--foreground));
                margin-bottom: 1rem;
            }

            .facts-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
                gap: 1rem;
            }

            .fact-card {
                background: hsl(var(--background));
                border: 1px solid hsl(var(--border));
                border-radius: var(--radius);
                padding: 1rem;
                text-align: center;
            }

            .fact-icon {
                font-size: 1.5rem;
                margin-bottom: 0.5rem;
            }

            .fact-label {
                font-size: 0.7rem;
                color: hsl(var(--muted-foreground));
                text-transform: uppercase;
                letter-spacing: 0.05em;
                margin-bottom: 0.25rem;
            }

            .fact-value {
                font-size: 0.9rem;
                font-weight: 600;
                color: hsl(var(--foreground));
            }

            /* Travel Sections */
            .travel-sections {
                padding: 2rem;
            }

            .travel-sections h2 {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-size: 1.25rem;
                font-weight: 600;
                color: hsl(var(--foreground));
                margin-bottom: 1.5rem;
            }

            .travel-section-card {
                background: hsl(var(--background));
                border: 1px solid hsl(var(--border));
                border-radius: var(--radius);
                margin-bottom: 1.5rem;
                overflow: hidden;
            }

            .travel-section-header {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1rem 1.25rem;
                background: linear-gradient(135deg, #fef3c7 0%, hsl(var(--muted)) 100%);
                border-bottom: 1px solid hsl(var(--border));
            }

            .section-icon {
                font-size: 1.5rem;
            }

            .travel-section-title {
                font-weight: 600;
                color: hsl(var(--foreground));
            }

            .travel-section-body {
                padding: 1.25rem;
                color: hsl(var(--muted-foreground));
                line-height: 1.7;
            }

            /* Highlights */
            .highlights-section {
                padding: 2rem;
                border-top: 1px solid hsl(var(--border));
                background: linear-gradient(135deg, #fef3c7 0%, hsl(var(--card)) 100%);
            }

            .highlights-section h2 {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-size: 1.25rem;
                font-weight: 600;
                color: hsl(var(--foreground));
                margin-bottom: 1.5rem;
            }

            .highlights-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                gap: 1rem;
            }

            .highlight-card {
                background: hsl(var(--background));
                border: 1px solid hsl(var(--border));
                border-radius: var(--radius);
                padding: 1.25rem;
                display: flex;
                gap: 1rem;
                align-items: flex-start;
            }

            .highlight-icon {
                font-size: 2rem;
                flex-shrink: 0;
            }

            .highlight-content h4 {
                font-size: 0.9rem;
                font-weight: 600;
                color: hsl(var(--foreground));
                margin-bottom: 0.25rem;
            }

            .highlight-content p {
                font-size: 0.8rem;
                color: hsl(var(--muted-foreground));
                line-height: 1.5;
            }

            /* Cultural Tips */
            .cultural-tips-section {
                padding: 2rem;
                border-top: 1px solid hsl(var(--border));
            }

            .cultural-tips-section h2 {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-size: 1.25rem;
                font-weight: 600;
                color: hsl(var(--foreground));
                margin-bottom: 1.5rem;
            }

            .cultural-tip-item {
                display: flex;
                gap: 0.75rem;
                padding: 1rem;
                background: hsl(var(--muted));
                border: 1px solid hsl(var(--border));
                border-left: 4px solid #f59e0b;
                border-radius: var(--radius);
                margin-bottom: 0.75rem;
            }

            .cultural-tip-icon {
                font-size: 1.25rem;
                flex-shrink: 0;
            }

            .cultural-tip-text {
                color: hsl(var(--foreground));
                line-height: 1.6;
            }

            /* Practical Info */
            .practical-info {
                padding: 2rem;
                border-top: 1px solid hsl(var(--border));
                background: hsl(var(--muted));
            }

            .practical-info h2 {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-size: 1.25rem;
                font-weight: 600;
                color: hsl(var(--foreground));
                margin-bottom: 1.5rem;
            }

            .practical-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                gap: 1rem;
            }

            .practical-card {
                background: hsl(var(--background));
                border: 1px solid hsl(var(--border));
                border-radius: var(--radius);
                padding: 1.25rem;
            }

            .practical-card h4 {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-size: 0.9rem;
                font-weight: 600;
                color: hsl(var(--foreground));
                margin-bottom: 0.75rem;
            }

            .practical-card ul {
                margin: 0;
                padding-left: 1.25rem;
                font-size: 0.85rem;
                color: hsl(var(--muted-foreground));
                line-height: 1.8;
            }

            /* Travel Footer */
            .travel-footer {
                padding: 1.5rem 2rem;
                border-top: 1px solid hsl(var(--border));
                background: hsl(var(--muted));
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-wrap: wrap;
                gap: 1rem;
            }

            .footer-meta {
                display: flex;
                gap: 2rem;
                flex-wrap: wrap;
            }

            .footer-meta-item {
                display: flex;
                flex-direction: column;
                gap: 0.25rem;
            }

            .footer-meta-label {
                font-size: 0.7rem;
                color: hsl(var(--muted-foreground));
                text-transform: uppercase;
                letter-spacing: 0.05em;
            }

            .footer-meta-value {
                font-size: 0.875rem;
                font-weight: 600;
                color: hsl(var(--foreground));
            }

            /* Language Toggle */
            .lang-toggle {
                display: inline-flex;
                align-items: center;
                gap: 0.25rem;
                padding: 0.5rem 0.75rem;
                background: hsl(var(--secondary));
                color: hsl(var(--secondary-foreground));
                border-radius: var(--radius);
                text-decoration: none;
                font-size: 0.875rem;
                font-weight: 500;
                transition: all 0.2s;
            }

            .lang-toggle:hover {
                background: hsl(var(--primary));
                color: hsl(var(--primary-foreground));
            }

            /* RTL Support */
            [dir="rtl"] .guide-detail-header {
                flex-direction: row-reverse;
            }

            [dir="rtl"] .guide-badges {
                flex-direction: row-reverse;
            }

            [dir="rtl"] .travel-section-header,
            [dir="rtl"] .cultural-tip-item,
            [dir="rtl"] .safety-note-item,
            [dir="rtl"] .highlight-card {
                flex-direction: row-reverse;
            }

            [dir="rtl"] .travel-section-body,
            [dir="rtl"] .guide-summary,
            [dir="rtl"] .guide-title {
                text-align: right;
            }

            [dir="rtl"] .footer-meta {
                flex-direction: row-reverse;
            }

            [dir="rtl"] .practical-card ul {
                padding-left: 0;
                padding-right: 1.25rem;
            }

            @media (max-width: 768px) {
                .facts-grid {
                    grid-template-columns: repeat(2, 1fr);
                }

                .highlights-grid,
                .practical-grid {
                    grid-template-columns: 1fr;
                }

                .travel-footer {
                    flex-direction: column;
                    align-items: flex-start;
                }

                [dir="rtl"] .travel-footer {
                    align-items: flex-end;
                }
            }
        </style>
    `;
}

function formatCategory(category) {
    const categoryMap = {
        'travel-tips': 'Travel Guide',
        'lifestyle': 'Lifestyle',
        'safety': 'Safety',
        'family-travel': 'Family Travel',
        'community': 'Community',
        'educational': 'Educational',
        'shopping': 'Shopping',
        'cooking': 'Cooking',
        'cooking-equipment': 'Cooking'
    };
    return categoryMap[category] || category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ');
}

function getCategoryIcon(category) {
    const iconMap = {
        'travel-tips': '🗺️',
        'lifestyle': '🏡',
        'safety': '🛡️',
        'family-travel': '👨‍👩‍👧‍👦',
        'community': '🤝',
        'educational': '📚',
        'shopping': '🛒',
        'cooking': '🍳',
        'cooking-equipment': '🍳'
    };
    return iconMap[category] || '✈️';
}

function renderSafetyNotes(notes, getLocalizedText, getTipIcon) {
    return `
        <div class="safety-notes">
            <div class="safety-notes-header">
                <span>🛡️</span>
                <h3>Safety Information</h3>
            </div>
            <div class="safety-list">
                ${notes.map(n => `
                    <div class="safety-note-item">
                        <span>${getTipIcon(n.type)}</span>
                        <span>${getLocalizedText(n.text)}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderQuickFacts(guide, getLocalizedText) {
    const category = guide.category || 'travel-tips';

    const defaultFacts = {
        'travel-tips': [
            { icon: '📅', label: 'Best Time', value: 'Spring/Fall' },
            { icon: '💰', label: 'Budget', value: 'Moderate' },
            { icon: '🚐', label: 'RV Friendly', value: 'Yes' },
            { icon: '🌍', label: 'Region', value: 'Europe' }
        ],
        'family-travel': [
            { icon: '👶', label: 'Kid Friendly', value: 'Yes' },
            { icon: '🎢', label: 'Activities', value: 'Many' },
            { icon: '🏥', label: 'Medical Access', value: 'Good' },
            { icon: '📶', label: 'Connectivity', value: 'Variable' }
        ],
        'safety': [
            { icon: '🔒', label: 'Safety Level', value: 'Moderate' },
            { icon: '🚨', label: 'Emergency #', value: '112' },
            { icon: '🏥', label: 'Healthcare', value: 'Available' },
            { icon: '👮', label: 'Police', value: 'Helpful' }
        ]
    };

    const facts = defaultFacts[category] || defaultFacts['travel-tips'];

    return `
        <div class="quick-facts">
            <h2>📋 At a Glance</h2>
            <div class="facts-grid">
                ${facts.map(fact => `
                    <div class="fact-card">
                        <div class="fact-icon">${fact.icon}</div>
                        <div class="fact-label">${fact.label}</div>
                        <div class="fact-value">${fact.value}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderTravelSections(content, getLocalizedText) {
    const sectionIcons = ['🎯', '📍', '🛣️', '🏕️', '🍽️', '🎭', '📸', '🛒'];

    return `
        <div class="travel-sections">
            <h2>📖 Guide Details</h2>
            <div class="sections-list">
                ${content.map((section, index) => {
                    const sectionTitle = getLocalizedText(section.title);
                    const sectionDescription = getLocalizedText(section.description);
                    const icon = sectionIcons[index % sectionIcons.length];

                    return `
                        <div class="travel-section-card">
                            <div class="travel-section-header">
                                <span class="section-icon">${icon}</span>
                                <span class="travel-section-title">${sectionTitle}</span>
                            </div>
                            <div class="travel-section-body">
                                ${sectionDescription}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

function renderHighlights(guide, getLocalizedText) {
    const category = guide.category || 'travel-tips';

    const defaultHighlights = {
        'travel-tips': [
            { icon: '🌅', title: 'Scenic Views', desc: 'Amazing landscapes and photo opportunities' },
            { icon: '🍷', title: 'Local Cuisine', desc: 'Traditional dishes and regional specialties' },
            { icon: '🏛️', title: 'Culture', desc: 'Rich history and cultural experiences' },
            { icon: '🤝', title: 'Friendly Locals', desc: 'Welcoming communities' }
        ],
        'family-travel': [
            { icon: '🎡', title: 'Kid Activities', desc: 'Fun for children of all ages' },
            { icon: '🏖️', title: 'Safe Areas', desc: 'Family-friendly environments' },
            { icon: '🍕', title: 'Kid Food', desc: 'Child-friendly dining options' },
            { icon: '🛏️', title: 'Facilities', desc: 'Family amenities available' }
        ]
    };

    const highlights = defaultHighlights[category] || defaultHighlights['travel-tips'];

    return `
        <div class="highlights-section">
            <h2>✨ Highlights</h2>
            <div class="highlights-grid">
                ${highlights.map(h => `
                    <div class="highlight-card">
                        <span class="highlight-icon">${h.icon}</span>
                        <div class="highlight-content">
                            <h4>${h.title}</h4>
                            <p>${h.desc}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderCulturalTips(tips, getLocalizedText, getTipIcon) {
    return `
        <div class="cultural-tips-section">
            <h2>💡 Local Insights</h2>
            <div class="cultural-tips-list">
                ${tips.map(tip => `
                    <div class="cultural-tip-item">
                        <span class="cultural-tip-icon">${getTipIcon(tip.type)}</span>
                        <span class="cultural-tip-text">${getLocalizedText(tip.text)}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderPracticalInfo(category) {
    const practicalInfo = [
        {
            icon: '🚐',
            title: 'Parking Tips',
            items: [
                'Look for designated motorhome areas',
                'Check local parking regulations',
                'Use apps like Park4Night',
                'Arrive early in peak season'
            ]
        },
        {
            icon: '💧',
            title: 'Services',
            items: [
                'Plan water fill-up stops',
                'Know dump station locations',
                'Check fuel availability',
                'Map out LPG refill points'
            ]
        },
        {
            icon: '🛒',
            title: 'Shopping',
            items: [
                'Local markets often best value',
                'Stock up before remote areas',
                'Cash may be needed in small towns',
                'Check store hours (varies by region)'
            ]
        }
    ];

    return `
        <div class="practical-info">
            <h2>🎒 Practical Information</h2>
            <div class="practical-grid">
                ${practicalInfo.map(info => `
                    <div class="practical-card">
                        <h4>${info.icon} ${info.title}</h4>
                        <ul>
                            ${info.items.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderExtraInfo(extraInfo) {
    return `
        <div class="extra-info-section">
            <h2>📚 Additional Information</h2>
            <div class="extra-info-content">
                ${extraInfo}
            </div>
        </div>
    `;
}

function renderReferences(references) {
    const grouped = references.reduce((acc, ref) => {
        const type = ref.type || 'info';
        if (!acc[type]) acc[type] = [];
        acc[type].push(ref);
        return acc;
    }, {});

    const typeLabels = {
        'official': '🏢 Official Resources',
        'purchase': '🛒 Where to Buy',
        'info': 'ℹ️ Useful Links',
        'appstore': '📱 Apps',
        'video': '🎬 Videos',
        'technical': '🔧 Technical Resources',
        'government': '🏛️ Government Resources',
        'insurance': '🛡️ Insurance',
        'tourism': '🗺️ Tourism Resources',
        'maps': '📍 Maps & Navigation',
        'camping': '🏕️ Camping Resources'
    };

    const typeIcons = {
        'official': '🏢',
        'purchase': '🛒',
        'info': 'ℹ️',
        'appstore': '📱',
        'video': '🎬',
        'technical': '🔧',
        'government': '🏛️',
        'insurance': '🛡️',
        'tourism': '🗺️',
        'maps': '📍',
        'camping': '🏕️'
    };

    return `
        <div class="references-section">
            <h2>🔗 References & Links</h2>
            <div class="references-grid">
                ${Object.entries(grouped).map(([type, refs]) => `
                    <div class="reference-group">
                        <h3>${typeLabels[type] || type}</h3>
                        <div class="reference-list">
                            ${refs.map(ref => `
                                <a href="${ref.url}" target="_blank" rel="noopener noreferrer" class="reference-item">
                                    <span class="reference-icon">${typeIcons[type] || '🔗'}</span>
                                    <span class="reference-name">${ref.name}</span>
                                    <span class="reference-external">↗</span>
                                </a>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderTravelFooter(guide) {
    return `
        <div class="travel-footer">
            <div class="footer-meta">
                <div class="footer-meta-item">
                    <span class="footer-meta-label">Guide ID</span>
                    <span class="footer-meta-value">${guide.id}</span>
                </div>
                <div class="footer-meta-item">
                    <span class="footer-meta-label">Category</span>
                    <span class="footer-meta-value">${formatCategory(guide.category)}</span>
                </div>
            </div>
            <a href="#guides" class="btn btn-outline">← Back to All Guides</a>
        </div>
    `;
}
