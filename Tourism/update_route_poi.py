import re

with open('app.js', 'r', encoding='utf-8') as f:
    js = f.read()

# 1. Add POI marker placement function and modify initRouteMap

OLD_ROUTE_END = """        <div class="route-stat"><i class="fas fa-external-link-alt"></i> <a href="https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${fromCoord.lat},${fromCoord.lng};${toCoord.lat},${toCoord.lng}" target="_blank" style="color:var(--primary);font-weight:600;">Open in OpenStreetMap</a></div>
    `;
}"""

NEW_ROUTE_END = """        <div class="route-stat"><i class="fas fa-external-link-alt"></i> <a href="https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${fromCoord.lat},${fromCoord.lng};${toCoord.lat},${toCoord.lng}" target="_blank" style="color:var(--primary);font-weight:600;">Open in OpenStreetMap</a></div>
    `;

    // Add nearby POI markers along the route
    addRoutePOIMarkers(fromCoord, toCoord, from, to);
}

let routePOIMarkers = [];
let routePOIVisible = true;

function addRoutePOIMarkers(fromCoord, toCoord, from, to) {
    // Clear existing POI markers
    routePOIMarkers.forEach(m => { try { routeMap.removeLayer(m); } catch(e){} });
    routePOIMarkers = [];

    if (!samplePlaces || !routeMap) return;

    const fromKey = (from || '').toLowerCase().split(',')[0].trim();
    const toKey = (to || '').toLowerCase().split(',')[0].trim();

    // Find places from origin and destination cities
    const relevantPlaces = samplePlaces.filter(p => p.city === fromKey || p.city === toKey);

    // Also find places roughly along the route (within ~150km of the route line)
    const allPlaces = samplePlaces.filter(p => {
        if (p.city === fromKey || p.city === toKey) return false;
        // Check if place is roughly between origin and destination
        const minLat = Math.min(fromCoord.lat, toCoord.lat) - 3;
        const maxLat = Math.max(fromCoord.lat, toCoord.lat) + 3;
        const minLng = Math.min(fromCoord.lng, toCoord.lng) - 3;
        const maxLng = Math.max(fromCoord.lng, toCoord.lng) + 3;
        return p.lat >= minLat && p.lat <= maxLat && p.lng >= minLng && p.lng <= maxLng;
    });

    const allNearby = [...relevantPlaces, ...allPlaces];

    const colors = { hospital: '#3498db', police: '#9b59b6', hotel: '#f1c40f', restaurant: '#27ae60' };
    const icons = { hospital: '🏥', police: '🚔', hotel: '🏨', restaurant: '🍽️' };
    const labels = { hospital: 'Hospital', police: 'Police', hotel: 'Hotel', restaurant: 'Restaurant' };

    allNearby.forEach(place => {
        if (!place.lat || !place.lng || !routePOIVisible) return;

        const color = colors[place.type] || '#ff6b35';
        const icon = icons[place.type] || '📍';

        // Create custom icon
        const poiIcon = L.divIcon({
            className: 'route-poi-marker',
            html: '<div style="background:' + color + ';color:white;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:14px;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);cursor:pointer;">' + icon + '</div>',
            iconSize: [28, 28],
            iconAnchor: [14, 14]
        });

        const marker = L.marker([place.lat, place.lng], { icon: poiIcon }).addTo(routeMap);

        const budgetColor = place.budget && place.budget.includes('Luxury') ? '#e74c3c' :
                            place.budget && place.budget.includes('Premium') ? '#f39c12' :
                            place.budget && place.budget.includes('Budget') ? '#27ae60' :
                            place.budget && place.budget.includes('Free') ? '#3498db' : '#64748b';

        marker.bindPopup(
            '<div style="min-width:200px;font-family:inherit;">' +
            '<div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">' +
            '<span style="background:' + color + '20;color:' + color + ';padding:2px 8px;border-radius:12px;font-size:0.75rem;font-weight:600;">' + labels[place.type] + '</span>' +
            '<span style="background:' + budgetColor + '20;color:' + budgetColor + ';padding:2px 8px;border-radius:12px;font-size:0.75rem;font-weight:600;">' + (place.budget || 'N/A') + '</span>' +
            '</div>' +
            '<b style="font-size:1.05em;">' + icon + ' ' + place.name + '</b><br>' +
            '<small style="color:#666;">' + place.address + '</small><br>' +
            '<div style="margin-top:4px;display:flex;gap:12px;align-items:center;">' +
            '<span style="color:#f39c12;font-weight:600;">⭐ ' + (place.rating || 'N/A') + '</span>' +
            '<span style="color:#888;font-size:0.8em;">(' + formatNumber(place.reviews || 0) + ' reviews)</span>' +
            '</div>' +
            '<a href="tel:' + place.phone + '" style="display:inline-block;margin-top:6px;padding:4px 12px;background:#27ae60;color:white;border-radius:6px;text-decoration:none;font-size:0.85rem;font-weight:600;">📞 Call ' + place.phone + '</a>' +
            '</div>'
        );

        marker._poiType = place.type;
        routePOIMarkers.push(marker);
    });

    // Update POI count badge
    updatePOICount();
}

function toggleRoutePOI(type) {
    if (type === 'all') {
        routePOIVisible = !routePOIVisible;
    }
    routePOIMarkers.forEach(m => {
        if (!routePOIVisible) {
            try { routeMap.removeLayer(m); } catch(e){}
        } else if (type === 'all' || m._poiType === type) {
            m.addTo(routeMap);
        }
    });
    // Update toggle button states
    document.querySelectorAll('.route-poi-toggle').forEach(btn => {
        if (type === 'all') {
            btn.classList.toggle('active', routePOIVisible);
        }
    });
    updatePOICount();
}

function updatePOICount() {
    const badge = document.getElementById('route-poi-count');
    if (badge) {
        const visible = routePOIMarkers.filter(m => routeMap.hasLayer(m)).length;
        badge.textContent = visible + ' places';
    }
}"""

js = js.replace(OLD_ROUTE_END, NEW_ROUTE_END, 1)

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(js)

print(f'Updated app.js: {len(js)} bytes')
