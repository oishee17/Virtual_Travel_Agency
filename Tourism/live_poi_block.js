let livePOIMarkers = [];
let activeLivePOIFilter = 'all';
let livePOIData = [];        // places available around the current destination
let livePOIStats = { shown: 0, total: 0, limit: 0, zoom: 0 };
let livePOIRefreshTimer = null;

// How many places of each category the map shows at a given zoom (index = zoom).
// Zooming in reveals more hotels, restaurants, hospitals, pharmacies, etc.
const LIVE_POI_ZOOM_LIMITS = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 5, 8, 12, 18, 25];

const LIVE_POI_STYLES = {
    hospital:   { color: '#3498db', icon: '🏥', label: 'Hospital' },
    police:     { color: '#9b59b6', icon: '🚔', label: 'Police Station' },
    hotel:      { color: '#f1c40f', icon: '🏨', label: 'Hotel' },
    restaurant: { color: '#27ae60', icon: '🍽️', label: 'Restaurant' },
    atm:        { color: '#e67e22', icon: '🏧', label: 'ATM' },
    pharmacy:   { color: '#1abc9c', icon: '💊', label: 'Pharmacy' },
    petrol:     { color: '#e74c3c', icon: '⛽', label: 'Petrol Pump' },
    cafe:       { color: '#8e44ad', icon: '☕', label: 'Cafe' }
};

function getLivePOILimit(zoom) {
    var z = Math.round(zoom);
    if (z < 0) z = 0;
    if (z >= LIVE_POI_ZOOM_LIMITS.length) z = LIVE_POI_ZOOM_LIMITS.length - 1;
    return LIVE_POI_ZOOM_LIMITS[z];
}

function addLiveMapPOIs(dest) {
    if (!map) return;
    livePOIData = [];
    var destKey = String(dest || '').toLowerCase().trim();
    var destCoord = DESTINATION_COORDS_MAP[destKey];

    if (destCoord) {
        var seen = {};
        var addPlace = function(place) {
            if (!place || !place.lat || !place.lng) return;
            var key = place.type + '|' + place.name.toLowerCase();
            if (seen[key]) return;
            seen[key] = true;
            livePOIData.push(place);
        };
        // Curated places in the destination city
        samplePlaces.forEach(function(place) {
            if (place.city === destKey) addPlace(place);
        });
        // Plus curated places from other cities within 150 km of the destination
        samplePlaces.forEach(function(place) {
            if (place.city === destKey || !place.lat || !place.lng) return;
            if (getDistance(destCoord.lat, destCoord.lng, place.lat, place.lng) <= 150) addPlace(place);
        });
    }
    renderLivePOIMarkers();
}

// Chooses which places to draw for the current zoom / filter.
// The closest places of each category are kept, so every zoom step adds more.
function renderLivePOIMarkers() {
    if (!map) return;
    clearLiveMapPOIs();

    var zoom = map.getZoom();
    var limit = getLivePOILimit(zoom);
    var center = map.getCenter();
    var markerSize = zoom <= 12 ? 24 : (zoom <= 14 ? 28 : 32);
    var filter = activeLivePOIFilter;

    var groups = {};
    livePOIData.forEach(function(place) {
        if (filter !== 'all' && place.type !== filter) return;
        var dist = getDistance(center.lat, center.lng, place.lat, place.lng);
        if (!groups[place.type]) groups[place.type] = [];
        groups[place.type].push({ place: place, dist: dist });
    });

    var shown = 0;
    var available = 0;
    Object.keys(groups).forEach(function(type) {
        var style = LIVE_POI_STYLES[type] || { color: '#ff6b35', icon: '📍', label: 'Place' };
        groups[type].sort(function(a, b) { return a.dist - b.dist; });
        available += groups[type].length;
        groups[type].slice(0, limit).forEach(function(entry) {
            addLivePOIMarker(entry.place, entry.dist, style, markerSize);
            shown++;
        });
    });

    livePOIStats = { shown: shown, total: available, limit: limit, zoom: zoom };
    updateLivePOICount();
}

function addLivePOIMarker(place, dist, style, size) {
    var poiIcon = L.divIcon({
        className: 'live-poi-marker',
        html: '<div style="background:' + style.color + ';color:white;border-radius:50%;width:' + size + 'px;height:' + size + 'px;display:flex;align-items:center;justify-content:center;font-size:' + Math.round(size * 0.55) + 'px;border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);cursor:pointer;transition:transform 0.2s;" onmouseover="this.style.transform=\'scale(1.2)\'" onmouseout="this.style.transform=\'scale(1)\'">' + style.icon + '</div>',
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2]
    });
    var marker = L.marker([place.lat, place.lng], { icon: poiIcon }).addTo(map);
    marker.bindPopup(buildLivePOIPopup(place, dist, style));
    marker._poiType = place.type;
    livePOIMarkers.push(marker);
}

function buildLivePOIPopup(place, dist, style) {
    var html = '<div style="min-width:240px;font-family:inherit;">';
    html += '<div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;flex-wrap:wrap;">';
    html += '<span style="background:' + style.color + '20;color:' + style.color + ';padding:3px 10px;border-radius:50px;font-size:0.75rem;font-weight:600;">' + style.icon + ' ' + style.label + '</span>';
    if (place.budget) {
        var budgetColor = place.budget.indexOf('Luxury') >= 0 ? '#e74c3c' :
                          place.budget.indexOf('Premium') >= 0 ? '#f39c12' :
                          place.budget.indexOf('Budget') >= 0 ? '#27ae60' : '#3498db';
        html += '<span style="background:' + budgetColor + '20;color:' + budgetColor + ';padding:3px 10px;border-radius:50px;font-size:0.75rem;font-weight:600;">' + place.budget + '</span>';
    }
    if (typeof dist === 'number') {
        html += '<span style="background:#64748b20;color:#64748b;padding:3px 10px;border-radius:50px;font-size:0.75rem;font-weight:600;">' + formatPOIDistance(dist) + '</span>';
    }
    html += '</div>';
    html += '<b style="font-size:1.1em;display:block;margin-bottom:4px;">' + place.name + '</b>';
    html += '<div style="color:#888;font-size:0.85em;margin-bottom:4px;">\u{1F4CD} ' + (place.address || 'Address not available') + '</div>';
    if (place.rating) {
        var stars = '';
        for (var i = 0; i < 5; i++) {
            stars += i < Math.floor(place.rating) ? '<span style="color:#f39c12;">★</span>' : '<span style="color:#555;">★</span>';
        }
        html += '<div style="display:flex;align-items:center;gap:8px;margin:6px 0;">' +
            '<div style="display:flex;gap:1px;">' + stars + '</div>' +
            '<span style="color:#f39c12;font-weight:600;font-size:0.9em;">' + place.rating + '</span>' +
            '<span style="color:#888;font-size:0.8em;">(' + (place.reviews || 0).toLocaleString() + ' reviews)</span>' +
            '</div>';
    }
    html += '<div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap;">';
    if (place.phone) {
        html += '<a href="tel:' + place.phone + '" style="display:inline-flex;align-items:center;gap:4px;padding:5px 12px;background:#27ae60;color:white;border-radius:50px;text-decoration:none;font-size:0.82rem;font-weight:600;">\u{1F4DE} Call</a>';
    }
    html += '<a href="https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(place.name + ' ' + (place.address || '')) + '" target="_blank" style="display:inline-flex;align-items:center;gap:4px;padding:5px 12px;background:#4285f4;color:white;border-radius:50px;text-decoration:none;font-size:0.82rem;font-weight:600;">\u{1F5FA}\uFE0F Directions</a>';
    html += '</div></div>';
    return html;
}

function formatPOIDistance(km) {
    if (km < 1) return Math.max(50, Math.round(km * 1000 / 50) * 50) + ' m away';
    return km.toFixed(1) + ' km away';
}

function clearLiveMapPOIs() {
    livePOIMarkers.forEach(function(m) { try { map.removeLayer(m); } catch(e){} });
    livePOIMarkers = [];
}

function toggleLivePOI(type) {
    activeLivePOIFilter = (type === 'all' || activeLivePOIFilter === type) ? 'all' : type;
    document.querySelectorAll('.live-poi-toggle').forEach(function(btn) {
        var onclick = btn.getAttribute('onclick') || '';
        var match = onclick.match(/toggleLivePOI\('(\w+)'/);
        if (match) btn.classList.toggle('active', match[1] === activeLivePOIFilter);
    });
    renderLivePOIMarkers();
}

function updateLivePOICount() {
    var badge = document.getElementById('live-poi-count');
    if (!badge) return;
    var stats = livePOIStats;
    if (!livePOIData.length) {
        badge.textContent = 'No nearby places for this destination yet';
        return;
    }
    if (!stats.shown) {
        badge.textContent = 'Zoom in to see nearby places';
        return;
    }
    badge.textContent = stats.shown + ' of ' + stats.total + ' places · ' +
        (stats.shown < stats.total ? 'zoom in for more' : 'all showing');
}

function scheduleLivePOIRefresh() {
    if (!map) return;
    clearTimeout(livePOIRefreshTimer);
    livePOIRefreshTimer = setTimeout(renderLivePOIMarkers, 200);
}
