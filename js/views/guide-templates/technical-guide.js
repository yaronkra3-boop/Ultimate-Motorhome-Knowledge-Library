// Technical Guide Template - For maintenance, gas systems, equipment, vehicle-maintenance, heating
// Features: Tools list, safety warnings, difficulty rating, step-by-step instructions

export function renderTechnicalGuide(guide, helpers) {
    const { getLocalizedText, getDifficultyClass, formatDifficulty, getTipIcon, language, isRTL } = helpers;
    const dir = isRTL ? 'rtl' : 'ltr';
    const textAlign = isRTL ? 'right' : 'left';

    const title = getLocalizedText(guide.title);
    const summary = getLocalizedText(guide.summary);
    const content = guide.content || [];
    const tips = guide.tips || [];
    const tools = guide.tools || [];
    const difficulty = guide.difficulty || 'intermediate';
    const category = guide.category || 'maintenance';
    const estimatedTime = guide.estimatedTime || null;
    const safetyLevel = guide.safetyLevel || 'medium';

    // Separate tips into safety warnings and regular tips
    const safetyWarnings = tips.filter(t => t.type === 'warning' || t.type === 'danger' || t.type === 'safety');
    const regularTips = tips.filter(t => t.type !== 'warning' && t.type !== 'danger' && t.type !== 'safety');

    const langToggle = language === 'he'
        ? `<a href="#guide/${guide.id}?lang=en" class="lang-toggle">EN 🇬🇧</a>`
        : `<a href="#guide/${guide.id}?lang=he" class="lang-toggle">עב 🇮🇱</a>`;

    return `
        <div class="guide-detail-container technical-guide" dir="${dir}">
            <div class="guide-detail-header">
                <a href="#guides" class="back-link">
                    <span class="back-arrow">${isRTL ? '→' : '←'}</span> ${isRTL ? 'חזרה למדריכים' : 'Back to Guides'}
                </a>
                <div class="guide-badges">
                    ${langToggle}
                    <span class="badge badge-technical">${formatCategory(category)}</span>
                    <span class="badge ${getDifficultyClass(difficulty)}">${formatDifficulty(difficulty)}</span>
                    ${estimatedTime ? `<span class="badge badge-time">⏱️ ${estimatedTime}</span>` : ''}
                </div>
            </div>

            ${safetyWarnings.length > 0 ? renderSafetyBanner(safetyWarnings, getLocalizedText, getTipIcon) : ''}

            <article class="guide-article">
                <header class="guide-title-section technical-header">
                    <div class="technical-icon">🔧</div>
                    <h1 class="guide-title">${title}</h1>
                    <p class="guide-summary">${summary}</p>
                </header>

                ${tools.length > 0 ? renderToolsSection(tools, getLocalizedText) : renderToolsPlaceholder()}

                ${content.length > 0 ? renderTechnicalSteps(content, getLocalizedText) : ''}

                ${regularTips.length > 0 ? renderProTips(regularTips, getLocalizedText, getTipIcon) : ''}

                ${guide.extra_info ? renderExtraInfo(guide.extra_info) : ''}

                ${guide.references && guide.references.length > 0 ? renderReferences(guide.references) : ''}

                ${renderTechnicalFooter(guide)}
            </article>
        </div>

        <style>
            .technical-guide .technical-header {
                background: linear-gradient(135deg, hsl(var(--muted)) 0%, hsl(220 14% 96%) 100%);
                border-bottom: 3px solid #f59e0b;
            }

            .technical-icon {
                font-size: 3rem;
                margin-bottom: 1rem;
            }

            .badge-technical {
                background: rgba(245, 158, 11, 0.1);
                color: #f59e0b;
                border: 1px solid rgba(245, 158, 11, 0.3);
            }

            .badge-time {
                background: hsl(var(--muted));
                color: hsl(var(--muted-foreground));
            }

            /* Safety Banner */
            .safety-banner {
                background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
                border: 2px solid #f59e0b;
                border-radius: calc(var(--radius) + 4px);
                padding: 1.5rem;
                margin-bottom: 1.5rem;
            }

            .safety-banner-header {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                margin-bottom: 1rem;
            }

            .safety-banner-header h3 {
                color: #92400e;
                font-size: 1rem;
                font-weight: 700;
                margin: 0;
            }

            .safety-banner-icon {
                font-size: 1.5rem;
            }

            .safety-items {
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
            }

            .safety-item {
                display: flex;
                align-items: flex-start;
                gap: 0.5rem;
                font-size: 0.9rem;
                color: #78350f;
                line-height: 1.5;
            }

            /* Tools Section */
            .tools-section {
                padding: 1.5rem 2rem;
                border-bottom: 1px solid hsl(var(--border));
                background: hsl(var(--muted));
            }

            .tools-section h2 {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-size: 1rem;
                font-weight: 600;
                color: hsl(var(--foreground));
                margin-bottom: 1rem;
            }

            .tools-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
                gap: 0.75rem;
            }

            .tool-item {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.75rem 1rem;
                background: hsl(var(--background));
                border: 1px solid hsl(var(--border));
                border-radius: var(--radius);
                font-size: 0.875rem;
            }

            .tool-icon {
                font-size: 1.25rem;
            }

            .tools-placeholder {
                padding: 1.5rem 2rem;
                border-bottom: 1px solid hsl(var(--border));
                background: hsl(var(--muted));
            }

            .tools-placeholder-content {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                padding: 1rem;
                background: hsl(var(--background));
                border: 1px dashed hsl(var(--border));
                border-radius: var(--radius);
                color: hsl(var(--muted-foreground));
                font-size: 0.875rem;
            }

            /* Technical Steps */
            .technical-steps {
                padding: 2rem;
            }

            .technical-steps h2 {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-size: 1.25rem;
                font-weight: 600;
                color: hsl(var(--foreground));
                margin-bottom: 1.5rem;
            }

            .step-card {
                background: hsl(var(--background));
                border: 1px solid hsl(var(--border));
                border-radius: var(--radius);
                margin-bottom: 1rem;
                overflow: hidden;
            }

            .step-card-header {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1rem 1.25rem;
                background: hsl(var(--muted));
                border-bottom: 1px solid hsl(var(--border));
            }

            .step-badge {
                width: 2rem;
                height: 2rem;
                background: #f59e0b;
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 700;
                font-size: 0.875rem;
                flex-shrink: 0;
            }

            .step-card-title {
                font-weight: 600;
                color: hsl(var(--foreground));
            }

            .step-card-body {
                padding: 1.25rem;
                color: hsl(var(--muted-foreground));
                line-height: 1.7;
            }

            /* Pro Tips */
            .pro-tips-section {
                padding: 2rem;
                border-top: 1px solid hsl(var(--border));
                background: linear-gradient(to bottom, hsl(var(--muted)), hsl(var(--card)));
            }

            .pro-tips-section h2 {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-size: 1.25rem;
                font-weight: 600;
                color: hsl(var(--foreground));
                margin-bottom: 1.5rem;
            }

            .pro-tip-item {
                display: flex;
                gap: 0.75rem;
                padding: 1rem;
                background: hsl(var(--background));
                border: 1px solid hsl(var(--border));
                border-left: 4px solid #22c55e;
                border-radius: var(--radius);
                margin-bottom: 0.75rem;
            }

            .pro-tip-icon {
                font-size: 1.25rem;
                flex-shrink: 0;
            }

            .pro-tip-text {
                color: hsl(var(--foreground));
                line-height: 1.6;
            }

            /* Technical Footer */
            .technical-footer {
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

            /* Extra Info Section */
            .extra-info-section {
                padding: 2rem;
                border-top: 1px solid hsl(var(--border));
                background: linear-gradient(to bottom, hsl(210 40% 98%), hsl(var(--card)));
            }

            .extra-info-section h2 {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-size: 1.25rem;
                font-weight: 600;
                color: hsl(var(--foreground));
                margin-bottom: 1rem;
            }

            .extra-info-content {
                color: hsl(var(--muted-foreground));
                line-height: 1.8;
                font-size: 0.95rem;
                background: hsl(var(--background));
                padding: 1.5rem;
                border-radius: var(--radius);
                border: 1px solid hsl(var(--border));
            }

            /* References Section */
            .references-section {
                padding: 2rem;
                border-top: 1px solid hsl(var(--border));
                background: hsl(var(--muted));
            }

            .references-section h2 {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-size: 1.25rem;
                font-weight: 600;
                color: hsl(var(--foreground));
                margin-bottom: 1.5rem;
            }

            .references-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                gap: 1.5rem;
            }

            .reference-group h3 {
                font-size: 0.9rem;
                font-weight: 600;
                color: hsl(var(--muted-foreground));
                margin-bottom: 0.75rem;
                padding-bottom: 0.5rem;
                border-bottom: 1px solid hsl(var(--border));
            }

            .reference-list {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }

            .reference-item {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                padding: 0.75rem 1rem;
                background: hsl(var(--background));
                border: 1px solid hsl(var(--border));
                border-radius: var(--radius);
                text-decoration: none;
                color: hsl(var(--foreground));
                transition: all 0.2s;
            }

            .reference-item:hover {
                border-color: hsl(var(--primary));
                background: hsl(var(--accent));
                transform: translateX(4px);
            }

            .reference-icon {
                font-size: 1.25rem;
                flex-shrink: 0;
            }

            .reference-name {
                flex: 1;
                font-size: 0.875rem;
                line-height: 1.4;
            }

            .reference-external {
                color: hsl(var(--primary));
                font-size: 0.875rem;
                opacity: 0;
                transition: opacity 0.2s;
            }

            .reference-item:hover .reference-external {
                opacity: 1;
            }

            [dir="rtl"] .reference-item:hover {
                transform: translateX(-4px);
            }

            [dir="rtl"] .reference-item {
                flex-direction: row-reverse;
            }

            @media (max-width: 768px) {
                .references-grid {
                    grid-template-columns: 1fr;
                }
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

            [dir="rtl"] .step-card-header,
            [dir="rtl"] .pro-tip-item,
            [dir="rtl"] .safety-item,
            [dir="rtl"] .tool-item {
                flex-direction: row-reverse;
            }

            [dir="rtl"] .step-card-body,
            [dir="rtl"] .guide-summary,
            [dir="rtl"] .guide-title {
                text-align: right;
            }

            [dir="rtl"] .footer-meta {
                flex-direction: row-reverse;
            }

            @media (max-width: 768px) {
                .tools-grid {
                    grid-template-columns: 1fr;
                }

                .technical-footer {
                    flex-direction: column;
                    align-items: flex-start;
                }

                [dir="rtl"] .technical-footer {
                    align-items: flex-end;
                }
            }
        </style>
    `;
}

function formatCategory(category) {
    const categoryMap = {
        'maintenance': 'Maintenance',
        'gas_systems': 'Gas Systems',
        'equipment': 'Equipment',
        'vehicle-maintenance': 'Vehicle Care',
        'heating': 'Heating',
        'water-systems': 'Water Systems',
        'electrical-systems': 'Electrical',
        'power-systems': 'Power Systems'
    };
    return categoryMap[category] || category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ');
}

function renderSafetyBanner(warnings, getLocalizedText, getTipIcon) {
    return `
        <div class="safety-banner">
            <div class="safety-banner-header">
                <span class="safety-banner-icon">⚠️</span>
                <h3>Safety First - Read Before Starting</h3>
            </div>
            <div class="safety-items">
                ${warnings.map(w => `
                    <div class="safety-item">
                        <span>${getTipIcon(w.type)}</span>
                        <span>${getLocalizedText(w.text)}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderToolsSection(tools, getLocalizedText) {
    return `
        <div class="tools-section">
            <h2>🧰 Tools & Materials Needed</h2>
            <div class="tools-grid">
                ${tools.map(tool => {
                    const toolName = getLocalizedText(tool);
                    return `
                        <div class="tool-item">
                            <span class="tool-icon">🔧</span>
                            <span>${toolName}</span>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

function renderToolsPlaceholder() {
    return `
        <div class="tools-placeholder">
            <div class="tools-placeholder-content">
                <span>🧰</span>
                <span>Tools and materials will vary based on your specific vehicle and setup. Check manufacturer recommendations.</span>
            </div>
        </div>
    `;
}

function renderTechnicalSteps(content, getLocalizedText) {
    return `
        <div class="technical-steps">
            <h2>📋 Step-by-Step Instructions</h2>
            <div class="steps-list">
                ${content.map((step, index) => {
                    const stepTitle = getLocalizedText(step.title);
                    const stepDescription = getLocalizedText(step.description);
                    const stepNum = step.step || (index + 1);

                    return `
                        <div class="step-card">
                            <div class="step-card-header">
                                <span class="step-badge">${stepNum}</span>
                                <span class="step-card-title">${stepTitle}</span>
                            </div>
                            <div class="step-card-body">
                                ${stepDescription}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

function renderProTips(tips, getLocalizedText, getTipIcon) {
    return `
        <div class="pro-tips-section">
            <h2>💡 Pro Tips</h2>
            <div class="pro-tips-list">
                ${tips.map(tip => `
                    <div class="pro-tip-item">
                        <span class="pro-tip-icon">${getTipIcon(tip.type)}</span>
                        <span class="pro-tip-text">${getLocalizedText(tip.text)}</span>
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
    // Group references by type
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
        'insurance': '🛡️ Insurance'
    };

    const typeIcons = {
        'official': '🏢',
        'purchase': '🛒',
        'info': 'ℹ️',
        'appstore': '📱',
        'video': '🎬',
        'technical': '🔧',
        'government': '🏛️',
        'insurance': '🛡️'
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

function renderTechnicalFooter(guide) {
    return `
        <div class="technical-footer">
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
