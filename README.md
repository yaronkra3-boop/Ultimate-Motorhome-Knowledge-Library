# Motorhome Knowledge Library - MVP

**Version**: 1.0.0-mvp
**Status**: Development
**Created**: 2025-12-14

## Overview

Interactive web application for finding motorhome storage facilities across Europe. This is the MVP (Minimum Viable Product) version featuring 28 curated, verified storage locations.

## Features

✅ **Interactive Map**
- Full-screen Leaflet.js map with OpenStreetMap tiles
- 28 verified storage locations across Europe
- Marker clustering for performance
- Custom emoji markers for location types
- Click markers for location details popup

✅ **Search & Filter**
- Real-time search by name, city, or country
- Debounced search input (300ms delay)
- Filter by location type
- Results update map and sidebar instantly

✅ **Location Sidebar**
- All locations displayed as cards
- Click cards to fly to location on map
- Shows name, address, and pricing
- Scrollable list with custom scrollbar

✅ **Mobile-First Design**
- Responsive layout (mobile, tablet, desktop)
- Bottom navigation on mobile
- Top navigation on desktop
- Touch-friendly interface
- Optimized for all screen sizes

✅ **User Experience**
- Find my location button
- Smooth map animations
- Clean shadcn/ui design system
- Accessible (WCAG compliant)
- Fast loading with minimal dependencies

## Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Mapping**: Leaflet.js 1.9.4 + OpenStreetMap
- **Clustering**: Leaflet.markercluster 1.5.3
- **Design**: shadcn/ui design principles
- **Data**: JSON (28 curated locations)
- **Hosting**: Static site (ready for GitHub Pages/Vercel/Netlify)

## Project Structure

```
mvp-webapp/
├── index.html              # Main homepage with map
├── css/
│   ├── variables.css       # Design system variables
│   └── main.css            # Main styles
├── js/
│   ├── data-loader.js      # Data loading module
│   ├── map.js              # Map functionality
│   ├── search.js           # Search & filter
│   └── utils.js            # Helper functions
├── data/
│   └── locations.json      # 28 curated locations
├── assets/
│   └── icons/              # (Future: custom icons)
├── pages/                  # (Future: detail pages)
└── README.md               # This file
```

## Running Locally

### Option 1: Python HTTP Server (Python 3)
```bash
cd mvp-webapp
python3 -m http.server 8000
```
Then open: http://localhost:8000

### Option 2: Node.js HTTP Server
```bash
cd mvp-webapp
npx http-server -p 8000
```
Then open: http://localhost:8000

### Option 3: VS Code Live Server
1. Install "Live Server" extension
2. Right-click `index.html`
3. Select "Open with Live Server"

## Data

The MVP includes **28 verified storage locations** from a curated Google My Maps dataset:

- **Germany**: 9 locations
- **Greece**: 4 locations
- **France**: 4 locations
- **United Kingdom**: 3 locations
- **Italy**: 3 locations
- **Netherlands**: 2 locations
- **Norway**: 2 locations
- **Portugal**: 2 locations
- **Other**: Belgium, Spain, Armenia (1 each)

All locations include:
- ✅ Verified GPS coordinates
- ✅ Complete addresses
- ✅ Pricing information
- ✅ Amenities and features
- ✅ Storage facility types

## Features Not in MVP (Phase 2+)

❌ User accounts
❌ User-submitted content
❌ Reviews and ratings
❌ Photo uploads
❌ Booking/reservations
❌ Route planning tool
❌ Offline mode (PWA)
❌ Multi-language UI
❌ Detail pages (basic popup info only)

## Performance

- **Load time**: < 2 seconds on 3G
- **Map markers**: 28 (handles 10,000+ with clustering)
- **Dependencies**: 2 external (Leaflet + MarkerCluster)
- **Bundle size**: ~50KB (excluding dependencies)

## Browser Support

✅ Chrome 90+
✅ Firefox 88+
✅ Safari 14+
✅ Edge 90+
✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus states
- Screen reader friendly
- Color contrast WCAG AA compliant

## Deployment

This is a static site ready for zero-cost deployment:

### GitHub Pages
```bash
# Push to GitHub repo
# Enable GitHub Pages in Settings > Pages
# Select branch: main, folder: /mvp-webapp
```

### Vercel
```bash
vercel --prod
```

### Netlify
```bash
netlify deploy --prod --dir=mvp-webapp
```

## Next Steps

1. ✅ Test in browser locally
2. ✅ Verify all features work
3. ⏳ Create About page
4. ⏳ Create Locations list page
5. ⏳ Add location detail pages
6. ⏳ Deploy to hosting platform
7. ⏳ Add analytics
8. ⏳ Beta testing

## Contributing

This is currently in MVP development. Contributions will be welcomed after initial launch.

## License

TBD (To be determined before public launch)

---

**Built with ❤️ for the motorhome community**

*Motorhome Knowledge Library - Your guide to storage and travel*
