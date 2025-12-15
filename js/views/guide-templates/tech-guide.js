// Tech Guide Template - For technology, navigation, connectivity, electronics, solar-power
// Features: Specifications, compatibility notes, cost comparison, product recommendations

export function renderTechGuide(guide, helpers) {
    const { getLocalizedText, getTipIcon, language, isRTL } = helpers;
    const dir = isRTL ? 'rtl' : 'ltr';

    const title = getLocalizedText(guide.title);
    const summary = getLocalizedText(guide.summary);
    const content = guide.content || [];
    const tips = guide.tips || [];
    const category = guide.category || 'technology';
    const products = guide.products || [];
    const specs = guide.specifications || null;

    // Separate tips
    const compatibilityNotes = tips.filter(t => t.type === 'warning' || t.type === 'compatibility');
    const proTips = tips.filter(t => t.type !== 'warning' && t.type !== 'compatibility');

    const langToggle = language === 'he'
        ? `<a href="#guide/${guide.id}?lang=en" class="lang-toggle">EN 🇬🇧</a>`
        : `<a href="#guide/${guide.id}?lang=he" class="lang-toggle">עב 🇮🇱</a>`;

    return `
        <div class="guide-detail-container tech-guide" dir="${dir}">
            <div class="guide-detail-header">
                <a href="#guides" class="back-link">
                    <span class="back-arrow">${isRTL ? '→' : '←'}</span> ${isRTL ? 'חזרה למדריכים' : 'Back to Guides'}
                </a>
                <div class="guide-badges">
                    ${langToggle}
                    <span class="badge badge-tech">${formatCategory(category)}</span>
                </div>
            </div>

            <article class="guide-article">
                <header class="guide-title-section tech-header">
                    <div class="tech-icon">${getCategoryIcon(category)}</div>
                    <h1 class="guide-title">${title}</h1>
                    <p class="guide-summary">${summary}</p>
                </header>

                ${compatibilityNotes.length > 0 ? renderCompatibilityNotes(compatibilityNotes, getLocalizedText, getTipIcon) : ''}

                ${content.length > 0 ? renderTechSections(content, getLocalizedText) : ''}

                ${proTips.length > 0 ? renderTechTips(proTips, getLocalizedText, getTipIcon) : ''}

                ${guide.extra_info ? renderExtraInfo(guide.extra_info) : ''}

                ${guide.references && guide.references.length > 0 ? renderReferences(guide.references) : ''}

                ${renderTechFooter(guide)}
            </article>
        </div>

        <style>
            .tech-guide .tech-header {
                background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
                border-bottom: 3px solid #10b981;
            }

            .tech-icon {
                font-size: 3rem;
                margin-bottom: 1rem;
            }

            .badge-tech {
                background: rgba(16, 185, 129, 0.1);
                color: #10b981;
                border: 1px solid rgba(16, 185, 129, 0.3);
            }

            /* Compatibility Notes */
            .compatibility-notes {
                padding: 1.5rem 2rem;
                border-bottom: 1px solid hsl(var(--border));
                background: linear-gradient(135deg, #fefce8 0%, #fef9c3 100%);
            }

            .compatibility-header {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                margin-bottom: 1rem;
            }

            .compatibility-header h3 {
                color: #713f12;
                font-size: 1rem;
                font-weight: 600;
                margin: 0;
            }

            .compatibility-list {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }

            .compatibility-item {
                display: flex;
                align-items: flex-start;
                gap: 0.5rem;
                font-size: 0.875rem;
                color: #78350f;
                line-height: 1.5;
            }

            /* Quick Specs */
            .quick-specs {
                padding: 1.5rem 2rem;
                border-bottom: 1px solid hsl(var(--border));
                background: hsl(var(--muted));
            }

            .quick-specs h2 {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-size: 1rem;
                font-weight: 600;
                color: hsl(var(--foreground));
                margin-bottom: 1rem;
            }

            .specs-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                gap: 1rem;
            }

            .spec-card {
                background: hsl(var(--background));
                border: 1px solid hsl(var(--border));
                border-radius: var(--radius);
                padding: 1rem;
            }

            .spec-label {
                font-size: 0.7rem;
                color: hsl(var(--muted-foreground));
                text-transform: uppercase;
                letter-spacing: 0.05em;
                margin-bottom: 0.25rem;
            }

            .spec-value {
                font-size: 1rem;
                font-weight: 600;
                color: hsl(var(--foreground));
            }

            /* Tech Sections */
            .tech-sections {
                padding: 2rem;
            }

            .tech-sections h2 {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-size: 1.25rem;
                font-weight: 600;
                color: hsl(var(--foreground));
                margin-bottom: 1.5rem;
            }

            .tech-section-card {
                background: hsl(var(--background));
                border: 1px solid hsl(var(--border));
                border-radius: var(--radius);
                margin-bottom: 1.5rem;
                overflow: hidden;
            }

            .tech-section-header {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1rem 1.25rem;
                background: linear-gradient(135deg, hsl(var(--muted)) 0%, #ecfdf5 100%);
                border-bottom: 1px solid hsl(var(--border));
            }

            .tech-section-number {
                width: 2rem;
                height: 2rem;
                background: #10b981;
                color: white;
                border-radius: var(--radius);
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 700;
                font-size: 0.875rem;
                flex-shrink: 0;
            }

            .tech-section-title {
                font-weight: 600;
                color: hsl(var(--foreground));
            }

            .tech-section-body {
                padding: 1.25rem;
                color: hsl(var(--muted-foreground));
                line-height: 1.7;
            }

            /* Comparison Table */
            .comparison-section {
                padding: 2rem;
                border-top: 1px solid hsl(var(--border));
                background: hsl(var(--muted));
            }

            .comparison-section h2 {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-size: 1.25rem;
                font-weight: 600;
                color: hsl(var(--foreground));
                margin-bottom: 1.5rem;
            }

            .comparison-table {
                width: 100%;
                border-collapse: collapse;
                background: hsl(var(--background));
                border-radius: var(--radius);
                overflow: hidden;
                border: 1px solid hsl(var(--border));
            }

            .comparison-table th {
                background: #10b981;
                color: white;
                padding: 1rem;
                text-align: left;
                font-size: 0.875rem;
                font-weight: 600;
            }

            .comparison-table td {
                padding: 1rem;
                border-bottom: 1px solid hsl(var(--border));
                font-size: 0.875rem;
                color: hsl(var(--foreground));
            }

            .comparison-table tr:last-child td {
                border-bottom: none;
            }

            .comparison-table tr:hover td {
                background: hsl(var(--muted));
            }

            .comparison-pro {
                color: #10b981;
            }

            .comparison-con {
                color: #ef4444;
            }

            /* Tech Tips */
            .tech-tips-section {
                padding: 2rem;
                border-top: 1px solid hsl(var(--border));
            }

            .tech-tips-section h2 {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-size: 1.25rem;
                font-weight: 600;
                color: hsl(var(--foreground));
                margin-bottom: 1.5rem;
            }

            .tech-tip-item {
                display: flex;
                gap: 0.75rem;
                padding: 1rem;
                background: hsl(var(--muted));
                border: 1px solid hsl(var(--border));
                border-left: 4px solid #10b981;
                border-radius: var(--radius);
                margin-bottom: 0.75rem;
            }

            .tech-tip-icon {
                font-size: 1.25rem;
                flex-shrink: 0;
            }

            .tech-tip-text {
                color: hsl(var(--foreground));
                line-height: 1.6;
            }

            /* Setup Checklist */
            .setup-checklist {
                padding: 2rem;
                border-top: 1px solid hsl(var(--border));
                background: linear-gradient(to bottom, hsl(var(--muted)), hsl(var(--card)));
            }

            .setup-checklist h2 {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-size: 1.25rem;
                font-weight: 600;
                color: hsl(var(--foreground));
                margin-bottom: 1.5rem;
            }

            .setup-steps {
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
            }

            .setup-step {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                padding: 1rem;
                background: hsl(var(--background));
                border: 1px solid hsl(var(--border));
                border-radius: var(--radius);
            }

            .setup-step-number {
                width: 1.75rem;
                height: 1.75rem;
                background: #10b981;
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 600;
                font-size: 0.75rem;
                flex-shrink: 0;
            }

            .setup-step-text {
                font-size: 0.875rem;
                color: hsl(var(--foreground));
            }

            /* Tech Footer */
            .tech-footer {
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

            [dir="rtl"] .tech-section-header,
            [dir="rtl"] .tech-tip-item,
            [dir="rtl"] .compatibility-item,
            [dir="rtl"] .setup-step {
                flex-direction: row-reverse;
            }

            [dir="rtl"] .tech-section-body,
            [dir="rtl"] .guide-summary,
            [dir="rtl"] .guide-title {
                text-align: right;
            }

            [dir="rtl"] .footer-meta {
                flex-direction: row-reverse;
            }

            [dir="rtl"] .comparison-table th,
            [dir="rtl"] .comparison-table td {
                text-align: right;
            }

            @media (max-width: 768px) {
                .specs-grid {
                    grid-template-columns: 1fr 1fr;
                }

                .comparison-table {
                    font-size: 0.75rem;
                }

                .comparison-table th,
                .comparison-table td {
                    padding: 0.75rem 0.5rem;
                }

                .tech-footer {
                    flex-direction: column;
                    align-items: flex-start;
                }

                [dir="rtl"] .tech-footer {
                    align-items: flex-end;
                }
            }
        </style>
    `;
}

function formatCategory(category) {
    const categoryMap = {
        'technology': 'Technology',
        'navigation': 'Navigation',
        'connectivity': 'Connectivity',
        'electronics': 'Electronics',
        'solar-power': 'Solar Power',
        'internet-connectivity': 'Internet',
        'navigation-software': 'Nav Software',
        'communication': 'Communication'
    };
    return categoryMap[category] || category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ');
}

function getCategoryIcon(category) {
    const iconMap = {
        'technology': '📱',
        'navigation': '🧭',
        'connectivity': '📡',
        'electronics': '⚡',
        'solar-power': '☀️',
        'internet-connectivity': '🌐',
        'navigation-software': '🗺️',
        'communication': '📞'
    };
    return iconMap[category] || '💻';
}

function renderCompatibilityNotes(notes, getLocalizedText, getTipIcon) {
    return `
        <div class="compatibility-notes">
            <div class="compatibility-header">
                <span>⚠️</span>
                <h3>Compatibility Notes</h3>
            </div>
            <div class="compatibility-list">
                ${notes.map(n => `
                    <div class="compatibility-item">
                        <span>${getTipIcon(n.type)}</span>
                        <span>${getLocalizedText(n.text)}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderQuickSpecs(guide, getLocalizedText) {
    // Generate specs based on guide category
    const category = guide.category || 'technology';

    const defaultSpecs = {
        'technology': [
            { label: 'Type', value: 'Mobile/Fixed' },
            { label: 'Power', value: '12V/220V' },
            { label: 'Coverage', value: 'Europe-wide' },
            { label: 'Setup', value: 'DIY Possible' }
        ],
        'navigation': [
            { label: 'Platform', value: 'iOS/Android' },
            { label: 'Offline Maps', value: 'Available' },
            { label: 'Truck Mode', value: 'Yes' },
            { label: 'Updates', value: 'Regular' }
        ],
        'connectivity': [
            { label: 'Technology', value: 'Satellite/Cellular' },
            { label: 'Speed', value: 'Variable' },
            { label: 'Coverage', value: 'Global/Regional' },
            { label: 'Monthly Cost', value: 'Variable' }
        ],
        'solar-power': [
            { label: 'Panel Type', value: 'Rigid/Flexible' },
            { label: 'Output', value: '100-400W' },
            { label: 'Installation', value: 'Professional' },
            { label: 'ROI', value: '2-3 Years' }
        ]
    };

    const specs = defaultSpecs[category] || defaultSpecs['technology'];

    return `
        <div class="quick-specs">
            <h2>📊 Quick Specifications</h2>
            <div class="specs-grid">
                ${specs.map(spec => `
                    <div class="spec-card">
                        <div class="spec-label">${spec.label}</div>
                        <div class="spec-value">${spec.value}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderTechSections(content, getLocalizedText) {
    return `
        <div class="tech-sections">
            <h2>📖 Detailed Information</h2>
            <div class="sections-list">
                ${content.map((section, index) => {
                    const sectionTitle = getLocalizedText(section.title);
                    const sectionDescription = getLocalizedText(section.description);
                    const sectionNum = section.step || (index + 1);

                    return `
                        <div class="tech-section-card">
                            <div class="tech-section-header">
                                <span class="tech-section-number">${sectionNum}</span>
                                <span class="tech-section-title">${sectionTitle}</span>
                            </div>
                            <div class="tech-section-body">
                                ${sectionDescription}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

function renderComparisonTable(guide, getLocalizedText) {
    // Generate comparison based on category
    const category = guide.category || 'technology';

    const comparisons = {
        'technology': {
            headers: ['Feature', 'Basic', 'Advanced'],
            rows: [
                ['Installation', 'DIY', 'Professional'],
                ['Cost', '€50-200', '€200-500+'],
                ['Maintenance', 'Minimal', 'Regular'],
                ['Reliability', 'Good', 'Excellent']
            ]
        },
        'navigation': {
            headers: ['App', 'Pros', 'Cons'],
            rows: [
                ['Sygic Truck', 'Height/weight limits', 'Subscription'],
                ['Google Maps', 'Free, updated', 'No truck mode'],
                ['Waze', 'Real-time traffic', 'Data heavy'],
                ['HERE WeGo', 'Offline maps', 'Less updates']
            ]
        },
        'connectivity': {
            headers: ['Solution', 'Speed', 'Cost/Month'],
            rows: [
                ['Starlink', '50-200 Mbps', '€50-100'],
                ['4G/5G eSIM', '10-100 Mbps', '€20-50'],
                ['WiFi Hotspots', 'Variable', 'Free-€5/day'],
                ['Satellite Phone', 'Low (data)', '€50-150']
            ]
        }
    };

    const comparison = comparisons[category] || comparisons['technology'];

    return `
        <div class="comparison-section">
            <h2>⚖️ Options Comparison</h2>
            <table class="comparison-table">
                <thead>
                    <tr>
                        ${comparison.headers.map(h => `<th>${h}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${comparison.rows.map(row => `
                        <tr>
                            ${row.map((cell, i) => `<td>${cell}</td>`).join('')}
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function renderTechTips(tips, getLocalizedText, getTipIcon) {
    return `
        <div class="tech-tips-section">
            <h2>💡 Pro Tips</h2>
            <div class="tech-tips-list">
                ${tips.map(tip => `
                    <div class="tech-tip-item">
                        <span class="tech-tip-icon">${getTipIcon(tip.type)}</span>
                        <span class="tech-tip-text">${getLocalizedText(tip.text)}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderSetupChecklist(category) {
    const checklists = {
        'technology': [
            'Check power requirements (12V/220V)',
            'Verify compatibility with your vehicle',
            'Purchase necessary cables and adapters',
            'Test in a controlled environment first',
            'Keep firmware/software updated'
        ],
        'navigation': [
            'Download offline maps before departure',
            'Enter your vehicle dimensions accurately',
            'Set up toll avoidance preferences',
            'Configure speed limit warnings',
            'Test routing before your trip'
        ],
        'connectivity': [
            'Check coverage maps for your route',
            'Set up data monitoring',
            'Configure VPN if needed',
            'Download offline content as backup',
            'Test connection speed'
        ],
        'solar-power': [
            'Calculate your daily power needs',
            'Size panels appropriately',
            'Install charge controller',
            'Position panels for optimal sun',
            'Monitor battery health regularly'
        ]
    };

    const checklist = checklists[category] || checklists['technology'];

    return `
        <div class="setup-checklist">
            <h2>✅ Setup Checklist</h2>
            <div class="setup-steps">
                ${checklist.map((step, index) => `
                    <div class="setup-step">
                        <span class="setup-step-number">${index + 1}</span>
                        <span class="setup-step-text">${step}</span>
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

function renderTechFooter(guide) {
    return `
        <div class="tech-footer">
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
