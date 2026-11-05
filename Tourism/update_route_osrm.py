#!/usr/bin/env python3
"""Update route map to use OSRM routing for actual road routes"""

with open('app.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Replace the entire initRouteMap function
old_init = """function initRouteMap(from, to) {
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

    const speedMap = { driving: 80, bus: 35, train: 110, plane: 800, cycling: 15, walking: 5 };
    const iconMap = { driving: 'fa-car', bus: 'fa-bus', train: 'fa-train', plane: 'fa-plane', cycling: 'fa-bicycle', walking: 'fa-walking' };
    const labelMap = { driving: 'Drive', bus: 'Bus', train: 'Train', plane: 'Flight', cycling: 'Cycle', walking: 'Walk' };
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

new_init = """function initRouteMap(from, to) {
    routeFrom = from;
    routeTo = to;
    var fromKey = (from || '').toLowerCase().split(',')[0].trim();
    var toKey = (to || '').toLowerCase().split(',')[0].trim();
    var fromCoord = DESTINATION_COORDS[fromKey] || DESTINATION_COORDS['delhi'];
    var toCoord = DESTINATION_COORDS[toKey];
    if (!toCoord) {
        document.getElementById('route-info').innerHTML = '<div class="route-stat"><i class="fas fa-info-circle"></i> <strong>Destination not found. Showing Delhi as default.</strong></div>';
        return initRouteMap(from, 'delhi');
    }
    if (routeMap) { routeMap.remove(); routeMap = null; }
    var mapEl = document.getElementById('route-map');
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
    }).addTo(routeMap).bindPopup('<b>\\u{1F4CD} ' + (from || 'Origin') + '</b>');

    // Destination marker (green)
    L.circleMarker([toCoord.lat, toCoord.lng], {
        radius: 10, fillColor: '#27ae60', color: '#fff', weight: 3, fillOpacity: 1
    }).addTo(routeMap).bindPopup('<b>\\u{1F3C1} ' + (to || 'Destination') + '</b>');

    // Fit bounds initially
    var bounds = L.latLngBounds([fromCoord.lat, fromCoord.lng], [toCoord.lat, toCoord.lng]);
    routeMap.fitBounds(bounds, { padding: [50, 50] });

    // Straight dashed line as fallback (will be replaced by OSRM route)
    var fallbackLine = L.polyline(
        [[fromCoord.lat, fromCoord.lng], [toCoord.lat, toCoord.lng]],
        { color: '#ff6b35', weight: 2, opacity: 0.4, dashArray: '8, 8' }
    ).addTo(routeMap);

    // Show loading state
    var speedMap = { driving: 80, bus: 35, train: 110, plane: 800, cycling: 15, walking: 5 };
    var iconMap = { driving: 'fa-car', bus: 'fa-bus', train: 'fa-train', plane: 'fa-plane', cycling: 'fa-bicycle', walking: 'fa-walking' };
    var labelMap = { driving: 'Drive', bus: 'Bus', train: 'Train', plane: 'Flight', cycling: 'Cycle', walking: 'Walk' };
    var modeLabel = labelMap[currentTravelMode] || 'Drive';

    document.getElementById('route-info').innerHTML = '<div class="route-stat"><i class="fas fa-spinner fa-spin"></i> <strong>Calculating shortest route...</strong></div>';

    // Fetch actual road route from OSRM
    var osrmProfile = currentTravelMode === 'cycling' ? 'bike' : currentTravelMode === 'walking' ? 'foot' : 'car';
    var osrmUrl = 'https://router.project-osrm.org/route/v1/' + osrmProfile + '/' + fromCoord.lng + ',' + fromCoord.lat + ';' + toCoord.lng + ',' + toCoord.lat + '?overview=full&geometries=geojson&steps=true';

    fetch(osrmUrl)
        .then(function(resp) { return resp.json(); })
        .then(function(data) {
            if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
                var route = data.routes[0];
                var coords = route.geometry.coordinates.map(function(c) { return [c[1], c[0]]; });

                // Remove fallback line
                try { routeMap.removeLayer(fallbackLine); } catch(e) {}

                // Draw actual road route with gradient effect
                // Outer glow
                L.polyline(coords, { color: '#ff6b35', weight: 8, opacity: 0.25 }).addTo(routeMap);
                // Main route line
                L.polyline(coords, { color: '#ff6b35', weight: 4, opacity: 0.9 }).addTo(routeMap);
                // Inner highlight
                L.polyline(coords, { color: '#ffaa00', weight: 2, opacity: 0.6 }).addTo(routeMap);

                // Fit map to route
                routeMap.fitBounds(L.latLngBounds(coords), { padding: [40, 40] });

                // Calculate actual road distance and time
                var roadDist = route.distance / 1000; // meters to km
                var roadDuration = route.duration; // seconds
                var rHrs = Math.floor(roadDuration / 3600);
                var rMins = Math.round((roadDuration % 3600) / 60);
                var routeEta = rHrs > 0 ? rHrs + 'h ' + rMins + 'm' : rMins + 'm';

                // Also compute straight-line distance for comparison
                var R = 6371;
                var dLat = (toCoord.lat - fromCoord.lat) * Math.PI / 180;
                var dLon = (toCoord.lng - fromCoord.lng) * Math.PI / 180;
                var a = Math.sin(dLat/2)*Math.sin(dLat/2) + Math.cos(fromCoord.lat*Math.PI/180)*Math.cos(toCoord.lat*Math.PI/180)*Math.sin(dLon/2)*Math.sin(dLon/2);
                var straightDist = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

                // Show route steps (first 5)
                var stepsHtml = '';
                if (route.legs && route.legs[0] && route.legs[0].steps) {
                    var steps = route.legs[0].steps;
                    var showSteps = steps.slice(0, 6);
                    stepsHtml = '<div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--border);"><div style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;"><i class="fas fa-directions"></i> Route Directions</div>';
                    showSteps.forEach(function(step, i) {
                        var stepDist = (step.distance / 1000).toFixed(1);
                        var maneuver = step.maneuver ? step.maneuver.type : '';
                        var maneuverIcon = '➡️';
                        if (maneuver === 'turn') maneuverIcon = step.maneuver.modifier === 'right' ? '➡️' : '⬅️';
                        else if (maneuver === 'roundabout') maneuverIcon = '🔄';
                        else if (maneuver === 'exit roundabout') maneuverIcon = '↩️';
                        else if (maneuver === 'arrive') maneuverIcon = '🏁';
                        else if (maneuver === 'depart') maneuverIcon = '🚗';
                        var name = step.name && step.name !== '' ? step.name : 'Continue';
                        stepsHtml += '<div style="display:flex;align-items:center;gap:8px;padding:4px 0;font-size:0.8em;"><span>' + maneuverIcon + '</span><span style="flex:1;color:var(--text);">' + name + '</span><span style="color:var(--text-muted);">' + stepDist + ' km</span></div>';
                    });
                    if (steps.length > 6) {
                        stepsHtml += '<div style="font-size:0.75rem;color:var(--text-muted);padding:4px 0;">... and ' + (steps.length - 6) + ' more steps</div>';
                    }
                    stepsHtml += '</div>';
                }

                document.getElementById('route-info').innerHTML =
                    '<div class="route-stat"><i class="fas ' + iconMap[currentTravelMode] + '"></i> Mode: <strong>' + modeLabel + '</strong></div>' +
                    '<div class="route-stat"><i class="fas fa-road"></i> Distance: <strong>' + roadDist.toFixed(0) + ' km</strong></div>' +
                    '<div class="route-stat"><i class="fas fa-clock"></i> Est. Time: <strong>' + routeEta + '</strong></div>' +
                    '<div class="route-stat"><i class="fas fa-map-marker-alt"></i> From: <strong>' + from + '</strong></div>' +
                    '<div class="route-stat"><i class="fas fa-flag-checkered"></i> To: <strong>' + to + '</strong></div>' +
                    '<div class="route-stat" style="font-size:0.78em;color:var(--text-muted);"><i class="fas fa-info-circle"></i> As the crow flies: ' + straightDist.toFixed(0) + ' km | Road: ' + roadDist.toFixed(0) + ' km</div>' +
                    '<div class="route-stat"><i class="fas fa-external-link-alt"></i> <a href="https://www.openstreetmap.org/directions?engine=fossgis_osrm_' + osrmProfile + '&route=' + fromCoord.lat + ',' + fromCoord.lng + ';' + toCoord.lat + ',' + toCoord.lng + '" target="_blank" style="color:var(--primary);font-weight:600;">Open in OpenStreetMap</a></div>' +
                    stepsHtml;

            } else {
                // OSRM failed, keep fallback
                var R = 6371;
                var dLat = (toCoord.lat - fromCoord.lat) * Math.PI / 180;
                var dLon = (toCoord.lng - fromCoord.lng) * Math.PI / 180;
                var a = Math.sin(dLat/2)*Math.sin(dLat/2) + Math.cos(fromCoord.lat*Math.PI/180)*Math.cos(toCoord.lat*Math.PI/180)*Math.sin(dLon/2)*Math.sin(dLon/2);
                var dist = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                var speed = speedMap[currentTravelMode] || 80;
                var rawHours = dist / speed;
                var hrs = Math.floor(rawHours);
                var mins = Math.round((rawHours - hrs) * 60);
                var eta = hrs > 0 ? hrs + 'h ' + mins + 'm' : mins + 'm';
                document.getElementById('route-info').innerHTML =
                    '<div class="route-stat"><i class="fas ' + iconMap[currentTravelMode] + '"></i> Mode: <strong>' + modeLabel + '</strong></div>' +
                    '<div class="route-stat"><i class="fas fa-road"></i> Distance: <strong>' + dist.toFixed(0) + ' km (straight line)</strong></div>' +
                    '<div class="route-stat"><i class="fas fa-clock"></i> Est. Time: <strong>' + eta + '</strong></div>' +
                    '<div class="route-stat"><i class="fas fa-map-marker-alt"></i> From: <strong>' + from + '</strong></div>' +
                    '<div class="route-stat"><i class="fas fa-flag-checkered"></i> To: <strong>' + to + '</strong></div>' +
                    '<div class="route-stat"><i class="fas fa-external-link-alt"></i> <a href="https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=' + fromCoord.lat + ',' + fromCoord.lng + ';' + toCoord.lat + ',' + toCoord.lng + '" target="_blank" style="color:var(--primary);font-weight:600;">Open in OpenStreetMap</a></div>';
            }
        })
        .catch(function(err) {
            // Network error, keep fallback
            var R = 6371;
            var dLat = (toCoord.lat - fromCoord.lat) * Math.PI / 180;
            var dLon = (toCoord.lng - fromCoord.lng) * Math.PI / 180;
            var a = Math.sin(dLat/2)*Math.sin(dLat/2) + Math.cos(fromCoord.lat*Math.PI/180)*Math.cos(toCoord.lat*Math.PI/180)*Math.sin(dLon/2)*Math.sin(dLon/2);
            var dist = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            var speed = speedMap[currentTravelMode] || 80;
            var rawHours = dist / speed;
            var hrs = Math.floor(rawHours);
            var mins = Math.round((rawHours - hrs) * 60);
            var eta = hrs > 0 ? hrs + 'h ' + mins + 'm' : mins + 'm';
            document.getElementById('route-info').innerHTML =
                '<div class="route-stat"><i class="fas ' + iconMap[currentTravelMode] + '"></i> Mode: <strong>' + modeLabel + '</strong></div>' +
                '<div class="route-stat"><i class="fas fa-road"></i> Distance: <strong>' + dist.toFixed(0) + ' km</strong></div>' +
                '<div class="route-stat"><i class="fas fa-clock"></i> Est. Time: <strong>' + eta + '</strong></div>' +
                '<div class="route-stat"><i class="fas fa-map-marker-alt"></i> From: <strong>' + from + '</strong></div>' +
                '<div class="route-stat"><i class="fas fa-flag-checkered"></i> To: <strong>' + to + '</strong></div>' +
                '<div class="route-stat"><i class="fas fa-exclamation-triangle" style="color:#f39c12;"></i> <strong>Offline mode</strong> — showing straight-line estimate</div>' +
                '<div class="route-stat"><i class="fas fa-external-link-alt"></i> <a href="https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=' + fromCoord.lat + ',' + fromCoord.lng + ';' + toCoord.lat + ',' + toCoord.lng + '" target="_blank" style="color:var(--primary);font-weight:600;">Open in OpenStreetMap</a></div>';
        });
}"""

js = js.replace(old_init, new_init, 1)

# Also update switchTravelMode to re-fetch route
old_switch = """function switchTravelMode(mode) {
    currentTravelMode = mode;
    document.querySelectorAll('.travel-mode-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('[data-mode="' + mode + '"]').classList.add('active');
    updateRouteInfo();
    var modeNames = { driving: 'Car', bus: 'Bus', train: 'Train', flight: 'Flight', cycling: 'Cycle', walking: 'Walk' };
    pushNotif('route', 'info', '🗺️', 'Travel Mode Changed', 'Switched to ' + (modeNames[mode] || mode) + ' mode. Route and ETA updated.');
}"""

new_switch = """function switchTravelMode(mode) {
    currentTravelMode = mode;
    document.querySelectorAll('.travel-mode-btn').forEach(function(b) { b.classList.remove('active'); });
    document.querySelector('[data-mode="' + mode + '"]').classList.add('active');
    // Re-fetch route with new mode
    if (routeFrom && routeTo) {
        initRouteMap(routeFrom, routeTo);
    }
    updateRouteInfo();
    var modeNames = { driving: 'Car', bus: 'Bus', train: 'Train', flight: 'Flight', cycling: 'Cycle', walking: 'Walk' };
    pushNotif('route', 'info', '\\u{1F5FA}\\uFE0F', 'Travel Mode Changed', 'Switched to ' + (modeNames[mode] || mode) + ' mode. Route recalculated.');
}"""

js = js.replace(old_switch, new_switch, 1)

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(js)

print(f"Updated route map with OSRM routing ({len(js)} bytes)")
