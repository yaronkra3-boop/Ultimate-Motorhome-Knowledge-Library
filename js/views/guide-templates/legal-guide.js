// Legal Guide Template - For legal, registration, insurance, visa, customs, documentation
// Features: Requirements checklist, important dates, official links, document requirements

export function renderLegalGuide(guide, helpers) {
    const { getLocalizedText, getTipIcon, language, isRTL } = helpers;
    const dir = isRTL ? 'rtl' : 'ltr';

    const title = getLocalizedText(guide.title);
    const summary = getLocalizedText(guide.summary);
    const content = guide.content || [];
    const tips = guide.tips || [];
    const category = guide.category || 'legal';
    const lastUpdated = guide.lastUpdated || null;
    const jurisdiction = guide.jurisdiction || 'Europe';

    // Separate tips by type
    const importantNotes = tips.filter(t => t.type === 'warning' || t.type === 'danger');
    const regularTips = tips.filter(t => t.type !== 'warning' && t.type !== 'danger');

    const langToggle = language === 'he'
        ? `<a href="#guide/${guide.id}?lang=en" class="lang-toggle">EN 🇬🇧</a>`
        : `<a href="#guide/${guide.id}?lang=he" class="lang-toggle">עב 🇮🇱</a>`;

    return `
        <div class="guide-detail-container legal-guide" dir="${dir}">
            <div class="guide-detail-header">
                <a href="#guides" class="back-link">
                    <span class="back-arrow">${isRTL ? '→' : '←'}</span> ${isRTL ? 'חזרה למדריכים' : 'Back to Guides'}
                </a>
                <div class="guide-badges">
                    ${langToggle}
                    <span class="badge badge-legal">${formatCategory(category)}</span>
                    ${jurisdiction ? `<span class="badge badge-jurisdiction">🌍 ${jurisdiction}</span>` : ''}
                </div>
            </div>

            ${importantNotes.length > 0 ? renderLegalDisclaimer(importantNotes, getLocalizedText, getTipIcon) : renderDefaultDisclaimer()}

            <article class="guide-article">
                <header class="guide-title-section legal-header">
                    <div class="legal-icon">⚖️</div>
                    <h1 class="guide-title">${title}</h1>
                    <p class="guide-summary">${summary}</p>
                    ${lastUpdated ? `<p class="last-updated">Last verified: ${lastUpdated}</p>` : ''}
                </header>

                ${content.length > 0 ? renderLegalSections(content, getLocalizedText) : ''}

                ${regularTips.length > 0 ? renderLegalTips(regularTips, getLocalizedText, getTipIcon) : ''}

                ${guide.extra_info ? renderExtraInfo(guide.extra_info) : ''}

                ${guide.references && guide.references.length > 0 ? renderReferences(guide.references) : ''}

                ${renderLegalFooter(guide)}
            </article>
        </div>

        <style>
            .legal-guide .legal-header {
                background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
                border-bottom: 3px solid #6366f1;
            }

            .legal-icon {
                font-size: 3rem;
                margin-bottom: 1rem;
            }

            .badge-legal {
                background: rgba(99, 102, 241, 0.1);
                color: #6366f1;
                border: 1px solid rgba(99, 102, 241, 0.3);
            }

            .badge-jurisdiction {
                background: hsl(var(--muted));
                color: hsl(var(--muted-foreground));
            }

            .last-updated {
                font-size: 0.75rem;
                color: hsl(var(--muted-foreground));
                margin-top: 1rem;
                padding: 0.5rem 1rem;
                background: hsl(var(--background));
                border-radius: var(--radius);
                display: inline-block;
            }

            /* Legal Disclaimer */
            .legal-disclaimer {
                background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
                border: 2px solid #ef4444;
                border-radius: calc(var(--radius) + 4px);
                padding: 1.5rem;
                margin-bottom: 1.5rem;
            }

            .legal-disclaimer-header {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                margin-bottom: 1rem;
            }

            .legal-disclaimer-header h3 {
                color: #991b1b;
                font-size: 1rem;
                font-weight: 700;
                margin: 0;
            }

            .legal-disclaimer-icon {
                font-size: 1.5rem;
            }

            .disclaimer-text {
                color: #7f1d1d;
                font-size: 0.875rem;
                line-height: 1.6;
            }

            .disclaimer-items {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
                margin-top: 1rem;
            }

            .disclaimer-item {
                display: flex;
                align-items: flex-start;
                gap: 0.5rem;
                font-size: 0.875rem;
                color: #7f1d1d;
            }

            /* Legal Sections */
            .legal-sections {
                padding: 2rem;
            }

            .legal-sections h2 {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-size: 1.25rem;
                font-weight: 600;
                color: hsl(var(--foreground));
                margin-bottom: 1.5rem;
            }

            .legal-section-card {
                background: hsl(var(--background));
                border: 1px solid hsl(var(--border));
                border-radius: var(--radius);
                margin-bottom: 1.5rem;
                overflow: hidden;
            }

            .legal-section-header {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1rem 1.25rem;
                background: linear-gradient(135deg, hsl(var(--muted)) 0%, hsl(220 14% 96%) 100%);
                border-bottom: 1px solid hsl(var(--border));
            }

            .section-number {
                width: 2rem;
                height: 2rem;
                background: #6366f1;
                color: white;
                border-radius: var(--radius);
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 700;
                font-size: 0.875rem;
                flex-shrink: 0;
            }

            .legal-section-title {
                font-weight: 600;
                color: hsl(var(--foreground));
            }

            .legal-section-body {
                padding: 1.25rem;
                color: hsl(var(--muted-foreground));
                line-height: 1.7;
            }

            /* Document Checklist */
            .document-checklist {
                padding: 2rem;
                border-top: 1px solid hsl(var(--border));
                background: hsl(var(--muted));
            }

            .document-checklist h2 {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-size: 1.25rem;
                font-weight: 600;
                color: hsl(var(--foreground));
                margin-bottom: 1.5rem;
            }

            .checklist-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                gap: 1rem;
            }

            .checklist-item {
                display: flex;
                align-items: flex-start;
                gap: 0.75rem;
                padding: 1rem;
                background: hsl(var(--background));
                border: 1px solid hsl(var(--border));
                border-radius: var(--radius);
            }

            .checklist-checkbox {
                width: 1.25rem;
                height: 1.25rem;
                border: 2px solid #6366f1;
                border-radius: 4px;
                flex-shrink: 0;
                margin-top: 2px;
            }

            .checklist-label {
                font-size: 0.875rem;
                color: hsl(var(--foreground));
                line-height: 1.5;
            }

            /* Legal Tips */
            .legal-tips-section {
                padding: 2rem;
                border-top: 1px solid hsl(var(--border));
            }

            .legal-tips-section h2 {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-size: 1.25rem;
                font-weight: 600;
                color: hsl(var(--foreground));
                margin-bottom: 1.5rem;
            }

            .legal-tip-item {
                display: flex;
                gap: 0.75rem;
                padding: 1rem;
                background: hsl(var(--muted));
                border: 1px solid hsl(var(--border));
                border-left: 4px solid #6366f1;
                border-radius: var(--radius);
                margin-bottom: 0.75rem;
            }

            .legal-tip-icon {
                font-size: 1.25rem;
                flex-shrink: 0;
            }

            .legal-tip-text {
                color: hsl(var(--foreground));
                line-height: 1.6;
            }

            /* Official Resources */
            .official-resources {
                padding: 2rem;
                border-top: 1px solid hsl(var(--border));
                background: linear-gradient(to bottom, hsl(var(--muted)), hsl(var(--card)));
            }

            .official-resources h2 {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-size: 1.25rem;
                font-weight: 600;
                color: hsl(var(--foreground));
                margin-bottom: 1.5rem;
            }

            .resources-note {
                padding: 1rem;
                background: hsl(var(--background));
                border: 1px dashed hsl(var(--border));
                border-radius: var(--radius);
                color: hsl(var(--muted-foreground));
                font-size: 0.875rem;
                line-height: 1.6;
            }

            /* Legal Footer */
            .legal-footer {
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

            [dir="rtl"] .legal-section-header,
            [dir="rtl"] .legal-tip-item,
            [dir="rtl"] .disclaimer-item,
            [dir="rtl"] .checklist-item {
                flex-direction: row-reverse;
            }

            [dir="rtl"] .legal-section-body,
            [dir="rtl"] .guide-summary,
            [dir="rtl"] .guide-title,
            [dir="rtl"] .disclaimer-text {
                text-align: right;
            }

            [dir="rtl"] .footer-meta {
                flex-direction: row-reverse;
            }

            [dir="rtl"] .resources-note ul {
                margin-left: 0;
                margin-right: 1.5rem;
            }

            @media (max-width: 768px) {
                .checklist-grid {
                    grid-template-columns: 1fr;
                }

                .legal-footer {
                    flex-direction: column;
                    align-items: flex-start;
                }

                [dir="rtl"] .legal-footer {
                    align-items: flex-end;
                }
            }
        </style>
    `;
}

function formatCategory(category) {
    const categoryMap = {
        'legal': 'Legal & Regulations',
        'registration': 'Vehicle Registration',
        'insurance': 'Insurance',
        'visa-regulations': 'Visa & Entry',
        'visa-and-border': 'Border Crossing',
        'customs': 'Customs',
        'documentation': 'Documentation',
        'vehicle-registration': 'Registration'
    };
    return categoryMap[category] || category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ');
}

function renderDefaultDisclaimer() {
    return `
        <div class="legal-disclaimer">
            <div class="legal-disclaimer-header">
                <span class="legal-disclaimer-icon">⚠️</span>
                <h3>Important Legal Notice</h3>
            </div>
            <p class="disclaimer-text">
                This guide is provided for informational purposes only and should not be considered legal advice.
                Regulations change frequently. Always verify current requirements with official government sources
                before making any decisions.
            </p>
        </div>
    `;
}

function renderLegalDisclaimer(notes, getLocalizedText, getTipIcon) {
    return `
        <div class="legal-disclaimer">
            <div class="legal-disclaimer-header">
                <span class="legal-disclaimer-icon">⚠️</span>
                <h3>Important Legal Notice</h3>
            </div>
            <p class="disclaimer-text">
                This guide is provided for informational purposes only. Always verify with official sources.
            </p>
            <div class="disclaimer-items">
                ${notes.map(n => `
                    <div class="disclaimer-item">
                        <span>${getTipIcon(n.type)}</span>
                        <span>${getLocalizedText(n.text)}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderLegalSections(content, getLocalizedText) {
    return `
        <div class="legal-sections">
            <h2>📖 Key Information</h2>
            <div class="sections-list">
                ${content.map((section, index) => {
                    const sectionTitle = getLocalizedText(section.title);
                    const sectionDescription = getLocalizedText(section.description);
                    const sectionNum = section.step || (index + 1);

                    return `
                        <div class="legal-section-card">
                            <div class="legal-section-header">
                                <span class="section-number">${sectionNum}</span>
                                <span class="legal-section-title">${sectionTitle}</span>
                            </div>
                            <div class="legal-section-body">
                                ${sectionDescription}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

function renderDocumentChecklist(guide, getLocalizedText) {
    // Common documents for legal guides - can be customized per category
    const commonDocuments = [
        'Valid Passport (6+ months validity)',
        'Vehicle Registration Documents',
        'International Driving Permit',
        'Proof of Insurance',
        'Vehicle Ownership Proof',
        'Proof of Address'
    ];

    return `
        <div class="document-checklist">
            <h2>📋 Document Checklist</h2>
            <div class="checklist-grid">
                ${commonDocuments.map(doc => `
                    <div class="checklist-item">
                        <div class="checklist-checkbox"></div>
                        <span class="checklist-label">${doc}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderLegalTips(tips, getLocalizedText, getTipIcon) {
    return `
        <div class="legal-tips-section">
            <h2>💡 Helpful Tips</h2>
            <div class="legal-tips-list">
                ${tips.map(tip => `
                    <div class="legal-tip-item">
                        <span class="legal-tip-icon">${getTipIcon(tip.type)}</span>
                        <span class="legal-tip-text">${getLocalizedText(tip.text)}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderOfficialResources(guide, getLocalizedText) {
    return `
        <div class="official-resources">
            <h2>🔗 Official Resources</h2>
            <div class="resources-note">
                <p><strong>Always verify with official sources:</strong></p>
                <ul style="margin: 0.5rem 0 0 1.5rem; line-height: 1.8;">
                    <li>Check your country's foreign ministry travel advisories</li>
                    <li>Contact the embassy or consulate of your destination country</li>
                    <li>Visit official government immigration websites</li>
                    <li>Consult with a licensed legal professional for specific situations</li>
                </ul>
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

function renderLegalFooter(guide) {
    return `
        <div class="legal-footer">
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
