import json
import re
from typing import List, Dict, Set

def extract_mentioned_entities(text: str) -> Dict[str, List[str]]:
    """Extract specific mentions from text that might need references."""

    if not text:
        return {}

    entities = {
        'websites': [],
        'apps': [],
        'brands': [],
        'stores': [],
        'services': []
    }

    # Websites - look for domain patterns and specific mentions
    website_patterns = [
        r'(?:www\.)?amazon\.de\b',
        r'(?:www\.)?amazon\.com\b',
        r'(?:www\.)?aliexpress\.com\b',
        r'(?:www\.)?ebay\.de\b',
        r'(?:www\.)?ebay\.com\b',
        r'(?:www\.)?mobile\.de\b',
        r'(?:www\.)?autoscout24\.de\b',
        r'(?:www\.)?caravan24\.com\b',
        r'(?:www\.)?reimo\.com\b',
        r'(?:www\.)?campingaz\.com\b',
        r'(?:www\.)?gaslow\.co\.uk\b',
        r'(?:www\.)?propangas\.de\b',
    ]

    website_keywords = [
        'Amazon Germany', 'Amazon.de', 'Amazon DE',
        'AliExpress',
        'eBay',
        'mobile.de',
        'AutoScout24',
    ]

    # Apps
    app_keywords = [
        'iOverlander',
        'Park4Night',
        'Sygic',
        'Polarsteps',
        'Maps.me',
        'MAPS.ME',
        'Campercontact',
        'SearchForSites',
        'ACSI',
        'Waze',
        'Google Maps',
    ]

    # Brands/Products
    brand_keywords = [
        'Truma',
        'Webasto',
        'Dometic',
        'Victron',
        'Alde',
        'Gaslow',
        'GOK',
        'Campingaz',
        'Renogy',
        'EPever',
        'Battle Born',
        'Lifos',
        'Coleman',
        'Fiamma',
        'Thule',
        'Teltonika',
        'Huawei',
        'TP-Link',
        'Starlink',
    ]

    # Stores/Chains
    store_keywords = [
        'Intermarché',
        'Intermarche',
        'Lidl',
        'Aldi',
        'Carrefour',
        'Leclerc',
        'Decathlon',
        'Bauhaus',
        'Hornbach',
        'OBI',
        'Globus',
    ]

    # Services
    service_keywords = [
        'ADAC',
        'AXA',
        'Starlink',
        'TolCard',
        'Telepass',
        'Via-T',
        'DKV',
    ]

    # Check for website patterns
    for pattern in website_patterns:
        matches = re.findall(pattern, text, re.IGNORECASE)
        entities['websites'].extend(matches)

    # Check for keywords
    for keyword in website_keywords:
        if re.search(r'\b' + re.escape(keyword) + r'\b', text, re.IGNORECASE):
            entities['websites'].append(keyword)

    for keyword in app_keywords:
        if re.search(r'\b' + re.escape(keyword) + r'\b', text, re.IGNORECASE):
            entities['apps'].append(keyword)

    for keyword in brand_keywords:
        if re.search(r'\b' + re.escape(keyword) + r'\b', text, re.IGNORECASE):
            entities['brands'].append(keyword)

    for keyword in store_keywords:
        if re.search(r'\b' + re.escape(keyword) + r'\b', text, re.IGNORECASE):
            entities['stores'].append(keyword)

    for keyword in service_keywords:
        if re.search(r'\b' + re.escape(keyword) + r'\b', text, re.IGNORECASE):
            entities['services'].append(keyword)

    # Remove duplicates and clean up
    for key in entities:
        entities[key] = list(set([e.strip() for e in entities[key] if e.strip()]))

    return entities

def get_existing_reference_names(references: List[Dict]) -> Set[str]:
    """Extract names from existing references for comparison."""
    if not references:
        return set()

    names = set()
    for ref in references:
        if 'name' in ref:
            names.add(ref['name'].lower())

    return names

def is_already_referenced(entity: str, existing_refs: Set[str]) -> bool:
    """Check if an entity is already covered in references."""
    entity_lower = entity.lower()

    # Direct match
    if any(entity_lower in ref or ref in entity_lower for ref in existing_refs):
        return True

    # Check for partial matches (e.g., "Amazon" in "Amazon.de")
    keywords = entity_lower.split()
    for keyword in keywords:
        if len(keyword) > 3:  # Skip short words
            if any(keyword in ref for ref in existing_refs):
                return True

    return False

def analyze_guide(guide: Dict) -> List[Dict]:
    """Analyze a single guide for missing references."""

    missing = []

    # Get existing references
    existing_refs = get_existing_reference_names(guide.get('references', []))

    # Combine all text content
    all_text = ""

    # Add content
    if 'content' in guide:
        content = guide['content']
        if isinstance(content, dict):
            content_en = content.get('en', '')
            if isinstance(content_en, list):
                all_text += " ".join([str(item) for item in content_en]) + " "
            else:
                all_text += str(content_en) + " "
        else:
            all_text += str(content) + " "

    # Add tips
    if 'tips' in guide:
        tips = guide['tips']
        if isinstance(tips, dict):
            tips_en = tips.get('en', [])
            if isinstance(tips_en, list):
                for tip in tips_en:
                    if isinstance(tip, str):
                        all_text += tip + " "
                    elif isinstance(tip, dict):
                        all_text += str(tip) + " "
        elif isinstance(tips, list):
            for tip in tips:
                if isinstance(tip, str):
                    all_text += tip + " "
                elif isinstance(tip, dict):
                    all_text += str(tip) + " "

    # Extract entities
    entities = extract_mentioned_entities(all_text)

    # Check each entity type
    for entity_type, entity_list in entities.items():
        for entity in entity_list:
            if not is_already_referenced(entity, existing_refs):
                # Find context where it's mentioned
                context_match = re.search(
                    r'.{0,100}' + re.escape(entity) + r'.{0,100}',
                    all_text,
                    re.IGNORECASE
                )
                context = context_match.group(0) if context_match else entity

                missing.append({
                    'guide_id': guide['id'],
                    'guide_title': guide['title']['en'] if isinstance(guide['title'], dict) else guide['title'],
                    'entity': entity,
                    'entity_type': entity_type,
                    'mentioned_in_content': context.strip()
                })

    return missing

def main():
    # Read dataset
    with open('dataset-guides.json', 'r') as f:
        data = json.load(f)

    guides = data['guides']
    all_missing = []

    print(f"Analyzing {len(guides)} guides...")

    for i, guide in enumerate(guides):
        missing = analyze_guide(guide)
        all_missing.extend(missing)

        if (i + 1) % 10 == 0:
            print(f"Processed {i + 1}/{len(guides)} guides...")

    print(f"\nFound {len(all_missing)} potentially missing references")

    # Group by entity for easier review
    entity_counts = {}
    for item in all_missing:
        entity = item['entity']
        if entity not in entity_counts:
            entity_counts[entity] = 0
        entity_counts[entity] += 1

    print("\nTop entities mentioned without references:")
    for entity, count in sorted(entity_counts.items(), key=lambda x: x[1], reverse=True)[:20]:
        print(f"  {entity}: {count} guides")

    # Save detailed results
    output = {
        'summary': {
            'total_guides_analyzed': len(guides),
            'total_missing_references': len(all_missing),
            'unique_entities': len(entity_counts)
        },
        'missing_references': all_missing,
        'entity_frequency': entity_counts
    }

    with open('enrichments/missing-references-analysis.json', 'w') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f"\nSaved to enrichments/missing-references-analysis.json")

if __name__ == '__main__':
    main()
