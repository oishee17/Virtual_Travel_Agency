import re

with open('app.js', 'r', encoding='utf-8') as f:
    js = f.read()

# ---- 1. Replace initMap (Google Maps -> Leaflet) ----
# Find the GOOGLE MAPS section and replace it
old_maps_start = js.find('// ==================== GOOGLE MAPS ====================')
old_tracking_start = js.find('// ==================== LIVE TRACKING ====================')

if old_maps_start >= 0 and old_tracking_start > old_maps_start:
    old_maps_section = js[old_maps_start:old_tracking_start]
    
    new_maps_section = """// ==================== LEAFLET MAPS (OpenStreetMap) ====================

function initMap() {
    map = L.map('map-container', {
        center: [20.5937, 78.9629],
        zoom: 5,
        zoomControl: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(map);

    L.control.scale({ imperial: false }).addTo(map);

    // Add danger zones to map
    dangerZones.forEach(zone => {
        const color = zone.risk === 'high' ? '#c0392b' :
                      zone.risk === 'moderate' ? '#e67e22' :
                      zone.risk === 'natural' ? '#9b59b6' : '#27ae60';

        const circle = L.circle([zone.lat, zone.lng], {
            color: color,
            fillColor: color,
            fillOpacity: 0.15,
            radius: zone.radius,
            weight: 2
        }).addTo(map);

        circle.bindPopup(
            '<div style="min-width:200px;font-family:inherit;">' +
            '<b style="font-size:1.1em;">' + zone.name + '</b><br>' +
            '<span style="color:' + color + ';font-weight:700;text-transform:uppercase;font-size:0.8em;">' + zone.riskLabel + '</span><br>' +
            '<p style="margin:8px 0;font-size:0.9em;color:#555;">' + zone.description + '</p>' +
            '<div style="background:#fff3e0;padding:8px;border-left:3px solid #ff6b35;font-size:0.85em;">' +
            '<strong>⚠ Advisory:</strong> ' + zone.advisory + '</div></div>'
        );

        dangerZoneMarkers.push(circle);
    });
}

"""
    js = js[:old_maps_start] + new_maps_section + js[old_tracking_start:]

# ---- 2. Replace onPositionUpdate (Google -> Leaflet) ----
old_pos = js.find("function onPositionUpdate(position) {")
if old_pos >= 0:
    # Find the end of the function
    depth = 0
    i = old_pos
    while i < len(js):
        if js[i] == '{':
            depth += 1
        elif js[i] == '}':
            depth -= 1
            if depth == 0:
                break
        i += 1
    old_func = js[old_pos:i+1]
    
    new_func = """function onPositionUpdate(position) {
    const { latitude, longitude } = position.coords;
    lastKnownPosition = { lat: latitude, lng: longitude };

    if (userMarker) {
        userMarker.setLatLng([latitude, longitude]);
    } else {
        userMarker = L.circleMarker([latitude, longitude], {
            radius: 10,
            fillColor: '#ff6b35',
            color: '#ffffff',
            weight: 3,
            fillOpacity: 1
        }).addTo(map);
        userMarker.bindPopup('<b>Your Location</b><br>Lat: ' + latitude.toFixed(4) + ', Lng: ' + longitude.toFixed(4));
        userMarker.openPopup();
    }

    map.setView([latitude, longitude], 12);

    // Check if in danger zone
    checkDangerZones(latitude, longitude);
}"""
    js = js.replace(old_func, new_func)

# ---- 3. Replace addPlaceMarkers (Google -> Leaflet) ----
old_markers = js.find("function addPlaceMarkers(")
if old_markers >= 0:
    depth = 0
    i = old_markers
    while i < len(js):
        if js[i] == '{':
            depth += 1
        elif js[i] == '}':
            depth -= 1
            if depth == 0:
                break
        i += 1
    old_func = js[old_markers:i+1]
    
    new_func = """function addPlaceMarkers(places) {
    // Clear existing markers
    nearbyMarkers.forEach(m => map.removeLayer(m));
    nearbyMarkers = [];

    const colors = { hospital: '#3498db', police: '#9b59b6', hotel: '#f1c40f', restaurant: '#27ae60' };
    const iconLabels = { hospital: '🏥', police: '🚔', hotel: '🏨', restaurant: '🍽️' };

    places.forEach(place => {
        if (!place.lat || !place.lng) return;
        const color = colors[place.type] || '#ff6b35';
        const marker = L.circleMarker([place.lat, place.lng], {
            radius: 8,
            fillColor: color,
            color: '#ffffff',
            weight: 2,
            fillOpacity: 0.9
        }).addTo(map);

        marker.bindPopup(
            '<div style="min-width:180px;font-family:inherit;">' +
            '<b>' + iconLabels[place.type] + ' ' + place.name + '</b><br>' +
            '<small>' + place.address + '</small><br>' +
            '<a href="tel:' + place.phone + '" style="color:#27ae60;font-weight:bold;">📞 ' + place.phone + '</a>' +
            (place._dist ? '<br><small>📍 ' + place._dist.toFixed(1) + ' km away</small>' : '') + '</div>'
        );

        nearbyMarkers.push(marker);
    });
}"""
    js = js.replace(old_func, new_func)

# ---- 4. Replace initRouteMap (Google -> Leaflet) ----
old_route = js.find("function initRouteMap(from, to) {")
if old_route >= 0:
    depth = 0
    i = old_route
    while i < len(js):
        if js[i] == '{':
            depth += 1
        elif js[i] == '}':
            depth -= 1
            if depth == 0:
                break
        i += 1
    old_func = js[old_route:i+1]
    
    new_func = """function initRouteMap(from, to) {
    routeFrom = from;
    routeTo = to;
    const fromKey = (from || '').toLowerCase().split(',')[0].trim();
    const toKey = (to || '').toLowerCase().split(',')[0].trim();
    const fromCoord = DESTINATION_COORDS[fromKey] || DESTINATION_COORDS['delhi'];
    const toCoord = DESTINATION_COORDS[toKey];
    if (!toCoord) {
        document.getElementById('route-info').innerHTML = '<div class="route-stat"><i class="fas fa-info-circle"></i> <strong>Destination not found in database. Showing Delhi as default.</strong></div>';
        return initRouteMap(from, 'delhi');
    }
    if (routeMap) { routeMap.remove(); routeMap = null; }
    const mapEl = document.getElementById('route-map');
    if (!mapEl) return;

    routeMap = L.map(mapEl, {
        center: [(fromCoord.lat + toCoord.lat) / 2, (fromCoord.lng + toCoord.lng) / 2],
        zoom: 6,
        zoomControl: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(routeMap);

    L.control.scale({ imperial: false }).addTo(routeMap);

    // Origin marker (orange)
    L.circleMarker([fromCoord.lat, fromCoord.lng], {
        radius: 10, fillColor: '#ff6b35', color: '#fff', weight: 3, fillOpacity: 1
    }).addTo(routeMap).bindPopup('<b>📍 ' + (from || 'Origin') + '</b>');

    // Destination marker (green)
    L.circleMarker([toCoord.lat, toCoord.lng], {
        radius: 10, fillColor: '#27ae60', color: '#fff', weight: 3, fillOpacity: 1
    }).addTo(routeMap).bindPopup('<b>🏁 ' + (to || 'Destination') + '</b>');

    // Draw straight route line
    const routeLine = L.polyline(
        [[fromCoord.lat, fromCoord.lng], [toCoord.lat, toCoord.lng]],
        { color: '#ff6b35', weight: 3, opacity: 0.8, dashArray: '10, 6' }
    ).addTo(routeMap);

    // Fit bounds
    const bounds = L.latLngBounds(
        [fromCoord.lat, fromCoord.lng],
        [toCoord.lat, toCoord.lng]
    );
    routeMap.fitBounds(bounds, { padding: [50, 50] });

    // Calculate distance
    const R = 6371;
    const dLat = (toCoord.lat - fromCoord.lat) * Math.PI / 180;
    const dLon = (toCoord.lng - fromCoord.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2)*Math.sin(dLat/2) + Math.cos(fromCoord.lat*Math.PI/180)*Math.cos(toCoord.lat*Math.PI/180)*Math.sin(dLon/2)*Math.sin(dLon/2);
    const dist = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    const speedMap = { driving: 80, train: 110, plane: 800 };
    const iconMap = { driving: 'fa-car', train: 'fa-train', plane: 'fa-plane' };
    const labelMap = { driving: 'Drive', train: 'Train', plane: 'Flight' };
    const speed = speedMap[currentTravelMode] || 80;
    const rawHours = dist / speed;
    const hrs = Math.floor(rawHours);
    const mins = Math.round((rawHours - hrs) * 60);
    const eta = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;

    document.getElementById('route-info').innerHTML = `
        <div class="route-stat"><i class="fas ${iconMap[currentTravelMode]}"></i> Mode: <strong>${labelMap[currentTravelMode]}</strong></div>
        <div class="route-stat"><i class="fas fa-road"></i> Distance: <strong>${dist.toFixed(0)} km</strong></div>
        <div class="route-stat"><i class="fas fa-clock"></i> Est. ${labelMap[currentTravelMode]} Time: <strong>${eta}</strong></div>
        <div class="route-stat"><i class="fas fa-map-marker-alt"></i> From: <strong>${from}</strong></div>
        <div class="route-stat"><i class="fas fa-flag-checkered"></i> To: <strong>${to}</strong></div>
        <div class="route-stat"><i class="fas fa-external-link-alt"></i> <a href="https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${fromCoord.lat},${fromCoord.lng};${toCoord.lat},${toCoord.lng}" target="_blank" style="color:var(--primary);font-weight:600;">Open in OpenStreetMap</a></div>
    `;
}"""
    js = js.replace(old_func, new_func)

# ---- 5. Remove any remaining googleInfoWindow references ----
js = js.replace('googleInfoWindow.setContent(', '// googleInfoWindow removed: ')
js = js.replace('googleInfoWindow.open(', '// googleInfoWindow removed: ')

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(js)

print(f"Updated app.js: {len(js)} bytes")
