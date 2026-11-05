#!/usr/bin/env python3
"""Enhance live tracking with comprehensive features"""

# Read app.js
with open('app.js', 'r', encoding='utf-8') as f:
    js = f.read()

# 1. Add new state variables after lastKnownPosition
old_state = "let lastKnownPosition = null;"
new_state = """let lastKnownPosition = null;
let trackingTrail = [];
let trailPolyline = null;
let trackingStartTime = null;
let totalDistanceTraveled = 0;
let lastTrackedPos = null;
let currentSpeed = 0;
let currentHeading = 0;
let trackingPanelVisible = false;
let batteryLevel = null;"""

js = js.replace(old_state, new_state, 1)

# 2. Enhance onPositionUpdate function
old_on_position = """function onPositionUpdate(position) {
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

new_on_position = """function onPositionUpdate(position) {
    const { latitude, longitude, speed, altitude, heading, accuracy } = position.coords;
    lastKnownPosition = { lat: latitude, lng: longitude };
    currentSpeed = speed ? speed * 3.6 : 0; // m/s to km/h
    currentHeading = heading || 0;

    // Calculate distance from last position
    if (lastTrackedPos) {
        const segDist = getDistance(lastTrackedPos.lat, lastTrackedPos.lng, latitude, longitude);
        if (segDist > 0.01) { // Ignore GPS jitter < 10m
            totalDistanceTraveled += segDist;
            trackingTrail.push([latitude, longitude]);
            if (trailPolyline) {
                trailPolyline.setLatLngs(trackingTrail);
            } else if (map) {
                trailPolyline = L.polyline(trackingTrail, {
                    color: '#ff6b35',
                    weight: 3,
                    opacity: 0.7,
                    dashArray: '8, 6'
                }).addTo(map);
            }
        }
    } else {
        trackingTrail.push([latitude, longitude]);
    }
    lastTrackedPos = { lat: latitude, lng: longitude };

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
        // Heading indicator circle
        userMarker.bindPopup('<b>\\u{1F4CD} Your Live Location</b><br>Lat: ' + latitude.toFixed(6) + '<br>Lng: ' + longitude.toFixed(6));
    }

    if (accuracy) {
        userMarker.setRadius(Math.max(8, Math.min(50, accuracy / 5)));
    }

    map.setView([latitude, longitude], map.getZoom());

    // Update tracking panel
    updateTrackingPanel(latitude, longitude, speed, altitude, heading, accuracy);

    // Check if in danger zone
    checkDangerZones(latitude, longitude);

    // Check nearby POIs along route
    checkNearbyPOIsForTracking(latitude, longitude);

    // Get battery
    if (!batteryLevel) getBatteryStatus();
}"""

js = js.replace(old_on_position, new_on_position, 1)

# 3. Enhance startTracking function
old_start = """function startTracking() {
    if (!navigator.geolocation) {
        showToast('Geolocation is not supported by your browser');
        return;
    }

    isTracking = true;
    document.getElementById('track-btn').innerHTML = '<i class="fas fa-stop"></i> <span data-i18n="btn_stop">Stop Tracking</span>';

    // Get initial position
    navigator.geolocation.getCurrentPosition(onPositionUpdate, onError, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
    });

    // Watch position
    trackingInterval = navigator.geolocation.watchPosition(onPositionUpdate, onError, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000
    });

    showToast('Live tracking started! \\u{1F4CD}');
}"""

new_start = """function startTracking() {
    if (!navigator.geolocation) {
        showToast('Geolocation is not supported by your browser');
        return;
    }

    isTracking = true;
    trackingStartTime = Date.now();
    totalDistanceTraveled = 0;
    trackingTrail = [];
    lastTrackedPos = null;
    if (trailPolyline && map) { map.removeLayer(trailPolyline); trailPolyline = null; }

    document.getElementById('track-btn').innerHTML = '<i class="fas fa-stop"></i> <span data-i18n="btn_stop">Stop Tracking</span>';
    document.getElementById('track-btn').classList.add('tracking-active');

    // Show tracking panel
    const panel = document.getElementById('tracking-panel');
    if (panel) { panel.style.display = 'block'; panel.classList.add('panel-open'); }

    // Get initial position
    navigator.geolocation.getCurrentPosition(onPositionUpdate, onError, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
    });

    // Watch position
    trackingInterval = navigator.geolocation.watchPosition(onPositionUpdate, onError, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000
    });

    showToast('\\u{1F4CD} Live tracking started! Your location is being monitored.');
    getBatteryStatus();
}"""

js = js.replace(old_start, new_start, 1)

# 4. Enhance stopTracking function
old_stop = """function stopTracking() {
    isTracking = false;
    if (trackingInterval) {
        navigator.geolocation.clearWatch(trackingInterval);
        trackingInterval = null;
    }
    document.getElementById('track-btn').innerHTML = '<i class="fas fa-crosshairs"></i> <span data-i18n="btn_track">Start Live Tracking</span>';
    showToast('Tracking stopped');
}"""

new_stop = """function stopTracking() {
    isTracking = false;
    if (trackingInterval) {
        navigator.geolocation.clearWatch(trackingInterval);
        trackingInterval = null;
    }
    document.getElementById('track-btn').innerHTML = '<i class="fas fa-crosshairs"></i> <span data-i18n="btn_track">Start Live Tracking</span>';
    document.getElementById('track-btn').classList.remove('tracking-active');

    const panel = document.getElementById('tracking-panel');
    if (panel) { panel.style.display = 'none'; panel.classList.remove('panel-open'); }

    // Generate trip summary
    if (trackingStartTime && totalDistanceTraveled > 0) {
        const elapsed = Math.round((Date.now() - trackingStartTime) / 60000);
        showToast('\\u{1F4CA} Trip Summary: ' + totalDistanceTraveled.toFixed(1) + ' km in ' + elapsed + ' min');
    } else {
        showToast('Tracking stopped');
    }
}"""

js = js.replace(old_stop, new_stop, 1)

# 5. Add new helper functions before the DANGER ZONES RENDERING section
insert_marker = "// ==================== DANGER ZONES RENDERING ===================="

new_tracking_helpers = """// ==================== TRACKING PANEL ====================
function updateTrackingPanel(lat, lng, speed, altitude, heading, accuracy) {
    // Coords
    const coordsEl = document.getElementById('track-coords');
    if (coordsEl) coordsEl.textContent = lat.toFixed(6) + ', ' + lng.toFixed(6);

    // Speed
    const speedEl = document.getElementById('track-speed');
    if (speedEl) speedEl.textContent = currentSpeed.toFixed(1) + ' km/h';

    // Altitude
    const altEl = document.getElementById('track-altitude');
    if (altEl) altEl.textContent = altitude ? altitude.toFixed(0) + ' m' : 'N/A';

    // Heading
    const headEl = document.getElementById('track-heading');
    if (headEl) {
        const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
        const dir = heading ? dirs[Math.round(heading / 45) % 8] : '--';
        headEl.textContent = dir + (heading ? ' (' + heading.toFixed(0) + '\\u00b0)' : '');
    }

    // Accuracy
    const accEl = document.getElementById('track-accuracy');
    if (accEl) accEl.textContent = accuracy ? '\\u00b1' + accuracy.toFixed(0) + 'm' : 'N/A';

    // Distance traveled
    const distEl = document.getElementById('track-distance');
    if (distEl) distEl.textContent = totalDistanceTraveled.toFixed(2) + ' km';

    // Elapsed time
    const timeEl = document.getElementById('track-elapsed');
    if (timeEl && trackingStartTime) {
        const secs = Math.floor((Date.now() - trackingStartTime) / 1000);
        const h = Math.floor(secs / 3600);
        const m = Math.floor((secs % 3600) / 60);
        const s = secs % 60;
        timeEl.textContent = (h > 0 ? h + 'h ' : '') + m + 'm ' + s + 's';
    }

    // Distance to destination
    const destEl = document.getElementById('track-dest-dist');
    const etaEl = document.getElementById('track-eta');
    if (destEl && typeof getCurrentUser === 'function') {
        const user = getCurrentUser();
        if (user && user.destination) {
            const destCoords = getDestinationCoords(user.destination);
            if (destCoords) {
                const remDist = getDistance(lat, lng, destCoords.lat, destCoords.lng);
                destEl.textContent = remDist.toFixed(1) + ' km remaining';
                if (etaEl) {
                    if (currentSpeed > 5) {
                        const etaH = remDist / currentSpeed;
                        const etaMins = Math.round(etaH * 60);
                        if (etaMins > 60) {
                            etaEl.textContent = Math.floor(etaMins / 60) + 'h ' + (etaMins % 60) + 'm';
                        } else {
                            etaEl.textContent = etaMins + ' min';
                        }
                    } else {
                        etaEl.textContent = 'Calculating...';
                    }
                }
            }
        }
    }

    // Battery
    const batEl = document.getElementById('track-battery');
    if (batEl && batteryLevel !== null) {
        batEl.textContent = batteryLevel + '%';
        batEl.style.color = batteryLevel > 50 ? '#27ae60' : batteryLevel > 20 ? '#f39c12' : '#e74c3c';
    }
}

function getDestinationCoords(dest) {
    const coords = {
        'kolkata': { lat: 22.5726, lng: 88.3639 },
        'delhi': { lat: 28.7041, lng: 77.1025 },
        'mumbai': { lat: 19.0760, lng: 72.8777 },
        'bangalore': { lat: 12.9716, lng: 77.5946 },
        'chennai': { lat: 13.0827, lng: 80.2707 },
        'jaipur': { lat: 26.9124, lng: 75.7873 },
        'varanasi': { lat: 25.3176, lng: 82.9739 },
        'goa': { lat: 15.2993, lng: 74.1240 },
        'agra': { lat: 27.1767, lng: 78.0081 },
        'pune': { lat: 18.5204, lng: 73.8567 },
        'udaipur': { lat: 24.5854, lng: 73.7125 },
        'shimla': { lat: 31.1048, lng: 77.1734 },
        'manali': { lat: 32.2432, lng: 77.1892 },
        'srinagar': { lat: 34.0837, lng: 74.7973 },
        'amritsar': { lat: 31.6340, lng: 74.8723 },
        'rishikesh': { lat: 30.0869, lng: 78.2676 },
        'hampi': { lat: 15.3350, lng: 76.4600 },
        'leh': { lat: 34.1526, lng: 77.5771 },
        'darjeeling': { lat: 27.0360, lng: 88.2627 },
        'mysore': { lat: 12.2958, lng: 76.6394 },
        'hyderabad': { lat: 17.3850, lng: 78.4867 },
        'ooty': { lat: 11.4102, lng: 76.6950 },
        'madurai': { lat: 9.9252, lng: 78.1198 },
        'pondicherry': { lat: 11.9416, lng: 79.8083 },
        'jaisalmer': { lat: 26.9157, lng: 70.9083 },
        'jodhpur': { lat: 26.2389, lng: 73.0243 },
        'pushkar': { lat: 26.4900, lng: 74.5510 },
        'gangtok': { lat: 27.3389, lng: 88.6065 },
        'tirupati': { lat: 13.6288, lng: 79.4192 },
        'rameshwaram': { lat: 9.2876, lng: 79.3129 },
        'kanyakumari': { lat: 8.0883, lng: 77.5385 },
        'coorg': { lat: 12.3375, lng: 75.8069 },
        'alleppey': { lat: 9.4981, lng: 76.3388 },
        'khajuraho': { lat: 24.8318, lng: 79.9199 },
        'bodhgaya': { lat: 24.6961, lng: 84.9911 },
        'dwarka': { lat: 22.2394, lng: 68.9678 },
        'somnath': { lat: 20.8880, lng: 70.4013 },
        'lumbai': { lat: 19.0760, lng: 72.8777 },
        'kochi': { lat: 9.9312, lng: 76.2673 },
        'agra': { lat: 27.1767, lng: 78.0081 },
        'nashik': { lat: 19.9975, lng: 73.7898 },
        'ajmer': { lat: 26.4499, lng: 74.6399 },
        'mount_abu': { lat: 24.5926, lng: 72.7156 },
        'ranthambore': { lat: 26.0173, lng: 76.5026 },
        'sunderbans': { lat: 21.9497, lng: 89.1833 },
        'ladakh': { lat: 34.1526, lng: 77.5771 },
        'himachal': { lat: 31.1048, lng: 77.1734 },
        'kashmir': { lat: 34.0837, lng: 74.7973 },
        'rajasthan': { lat: 26.9124, lng: 75.7873 },
        'northeast': { lat: 27.3389, lng: 88.6065 },
        'kerala': { lat: 9.9312, lng: 76.2673 },
        'udaipur': { lat: 24.5854, lng: 73.7125 }
    };
    const key = dest.toLowerCase().trim();
    return coords[key] || null;
}

function getBatteryStatus() {
    if ('getBattery' in navigator) {
        navigator.getBattery().then(function(battery) {
            batteryLevel = Math.round(battery.level * 100);
            battery.addEventListener('levelchange', function() {
                batteryLevel = Math.round(battery.level * 100);
                const batEl = document.getElementById('track-battery');
                if (batEl) {
                    batEl.textContent = batteryLevel + '%';
                    batEl.style.color = batteryLevel > 50 ? '#27ae60' : batteryLevel > 20 ? '#f39c12' : '#e74c3c';
                }
            });
            const batEl = document.getElementById('track-battery');
            if (batEl) {
                batEl.textContent = batteryLevel + '%';
                batEl.style.color = batteryLevel > 50 ? '#27ae60' : batteryLevel > 20 ? '#f39c12' : '#e74c3c';
            }
        }).catch(function() {});
    }
}

function checkNearbyPOIsForTracking(lat, lng) {
    if (!isTracking) return;
    // Check for nearby emergency POIs (hospitals, police) within 1km
    const nearby = (typeof samplePlaces !== 'undefined') ? samplePlaces : [];
    nearby.forEach(place => {
        const dist = getDistance(lat, lng, place.lat, place.lng);
        if (dist < 1 && dist > 0.05) {
            // Within 1km - could be useful for emergency
        }
    });
}

function shareLiveLocation() {
    if (!lastKnownPosition) {
        showToast('No location data available yet');
        return;
    }
    const lat = lastKnownPosition.lat;
    const lng = lastKnownPosition.lng;
    const googleMapsUrl = 'https://www.google.com/maps?q=' + lat + ',' + lng;

    if (navigator.share) {
        navigator.share({
            title: '\\u{1F4CD} My Live Location - Bharat Suraksha',
            text: 'I am currently at this location. Tracking via Bharat Suraksha tourist safety app.\\nLat: ' + lat.toFixed(6) + ', Lng: ' + lng.toFixed(6),
            url: googleMapsUrl
        }).catch(function() {});
    } else {
        // Fallback: copy to clipboard
        const text = 'My Live Location: ' + googleMapsUrl + '\\nLat: ' + lat.toFixed(6) + ', Lng: ' + lng.toFixed(6);
        navigator.clipboard.writeText(text).then(function() {
            showToast('\\u{1F517} Location link copied to clipboard! Share it with your emergency contacts.');
        }).catch(function() {
            // Final fallback
            const ta = document.createElement('textarea');
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            showToast('\\u{1F517} Location link copied!');
        });
    }
}

function toggleTrackingPanel() {
    const panel = document.getElementById('tracking-panel');
    if (!panel) return;
    trackingPanelVisible = !trackingPanelVisible;
    panel.style.display = trackingPanelVisible ? 'block' : 'none';
}

"""

js = js.replace(insert_marker, new_tracking_helpers + insert_marker, 1)

# Write updated file
with open('app.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("Enhanced tracking in app.js")
print(f"File size: {len(js)} bytes")
