# Next Session Notes - Ticket 013: Motorhome Knowledge Library

**Created**: December 15, 2025
**For**: Next session continuation

---

## Priority Tasks: Enrich Guides with Photos & Links

### 1. Add Photos to Guides

**Strategy**:
- **First choice**: Use original photos from WhatsApp chat history if they exist and are connected to the guide topic
- **Fallback**: Find relevant photos from the internet that match the guide content

**Examples**:
- Gas system guides → photos of LPG systems, refill adapters
- Location guides → photos of the actual campsite/location
- Technical guides → photos of equipment, tools, installations

### 2. Add Reference Links to Guides

**Goal**: Make guides practical with actionable links

**Link Types to Add**:
| Guide Topic | Link Examples |
|-------------|---------------|
| Starlink | starlink.com official site |
| LPG refilling kit | Amazon link + photo of the kit |
| Euroloo / Thetford | Official product pages |
| Navigation apps | App store links (Sygic, Park4Night) |
| Locations mentioned | Google Maps links, official campsite websites |
| Equipment | Amazon/eBay purchase links with photos |

**Format for each guide**:
```
## References & Links
- [Product Name](url) - brief description
- [Official Website](url)
- Purchase options: [Amazon](url) | [eBay](url)
```

### 3. Extend to Locations & Routes

**Locations**:
- Add official website links for campsites
- Google Maps/coordinates link
- Booking links if applicable
- Photos of the location

**Routes**:
- Each waypoint should have:
  - Map marker
  - Link to the specific place
  - Photo if available

---

## Data Structure Changes Needed

Consider adding to guide JSON:
```json
{
  "references": [
    {
      "name": "Starlink Official",
      "url": "https://starlink.com",
      "type": "official"
    },
    {
      "name": "LPG Refill Adapter Kit",
      "url": "https://amazon.com/...",
      "type": "purchase",
      "image": "path/to/image.jpg"
    }
  ],
  "images": [
    {
      "src": "path/to/image.jpg",
      "caption": "LPG adapter setup",
      "source": "original" | "web"
    }
  ]
}
```

---

## Source for Original Photos

Check WhatsApp export data for images that were shared alongside the messages that became guides. The original extraction included 5,300+ messages - some likely had photos attached.

---

*Remember: The goal is to make each guide a practical, actionable resource with visual content and direct links to products, places, and official sources.*
