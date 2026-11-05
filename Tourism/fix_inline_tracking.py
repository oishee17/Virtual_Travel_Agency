#!/usr/bin/env python3
"""Update inline tracking functions in index.html"""

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Find the LIVE TRACKING section in inline JS and replace everything up to DANGER ZONES RENDERING
lt_start = html.find('// ==================== LIVE TRACKING ====================')
lt_end_marker = '// ==================== DANGER ZONES RENDERING ===================='
lt_end = html.find(lt_end_marker, lt_start)

if lt_start == -1 or lt_end == -1:
    print("Could not find LIVE TRACKING section boundaries")
    print(f"lt_start={lt_start}, lt_end={lt_end}")
    exit(1)

# Find the state variables to update too
old_state_inline = "let lastKnownPosition = null;"
new_state_inline = """let lastKnownPosition = null;
let trackingTrail = [];
let trailPolyline = null;
let trackingStartTime = null;
let totalDistanceTraveled = 0;
let lastTrackedPos = null;
let currentSpeed = 0;
let currentHeading = 0;
let trackingPanelVisible = false;
let batteryLevel = null;"""

html = html.replace(old_state_inline, new_state_inline, 1)

# Replace the entire LIVE TRACKING section
new_tracking_section = """// ==================== LIVE TRACKING ====================
function toggleTracking() {
    if (isTracking) {
        stopTracking();
    } else {
        startTracking();
    }
}

function startTracking() {
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
    var shareBtn = document.getElementById('share-loc-btn');
    if (shareBtn) shareBtn.style.display = 'inline-flex';

    // Show tracking panel
    var panel = document.getElementById('tracking-panel');
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
}

function stopTracking() {
    isTracking = false;
    if (trackingInterval) {
        navigator.geolocation.clearWatch(trackingInterval);
        trackingInterval = null;
    }
    document.getElementById('track-btn').innerHTML = '<i class="fas fa-crosshairs"></i> <span data-i18n="btn_track">Start Live Tracking</span>';
    document.getElementById('track-btn').classList.remove('tracking-active');
    var shareBtn = document.getElementById('share-loc-btn');
    if (shareBtn) shareBtn.style.display = 'none';

    var panel = document.getElementById('tracking-panel');
    if (panel) { panel.style.display = 'none'; panel.classList.remove('panel-open'); }

    if (trackingStartTime && totalDistanceTraveled > 0) {
        var elapsed = Math.round((Date.now() - trackingStartTime) / 60000);
        showToast('\\u{1F4CA} Trip Summary: ' + totalDistanceTraveled.toFixed(1) + ' km in ' + elapsed + ' min');
    } else {
        showToast('Tracking stopped');
    }
}

function onPositionUpdate(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    var speed = position.coords.speed;
    var altitude = position.coords.altitude;
    var heading = position.coords.heading;
    var accuracy = position.coords.accuracy;
    lastKnownPosition = { lat: latitude, lng: longitude };
    currentSpeed = speed ? speed * 3.6 : 0;
    currentHeading = heading || 0;

    // Calculate distance from last position
    if (lastTrackedPos) {
        var segDist = getDistance(lastTrackedPos.lat, lastTrackedPos.lng, latitude, longitude);
        if (segDist > 0.01) {
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
}

function onError(error) {
    console.error('Geolocation error:', error);
    if (error.code === 1) {
        showToast('Location access denied. Please enable location services.');
    } else {
        showToast('Error getting location: ' + error.message);
    }
}

var dangerAlertDismissed = {};
var dangerAlertCooldown = {};

function checkDangerZones(lat, lng) {
    dangerZones.forEach(function(zone) {
        var distance = getDistance(lat, lng, zone.lat, zone.lng);
        if (distance <= zone.radius / 1000) {
            var now = Date.now();
            if (dangerAlertCooldown[zone.name] && (now - dangerAlertCooldown[zone.name]) < 300000) return;
            if (dangerAlertDismissed[zone.name]) return;
            dangerAlertCooldown[zone.name] = now;
            playDangerSound();
            showDangerPopup(zone);
            if (typeof notifications !== 'undefined') {
                var existing = notifications.find(function(n) { return n.id === 'danger-' + zone.name.replace(/\\s/g, ''); });
                if (!existing) {
                    notifications.unshift({
                        id: 'danger-' + zone.name.replace(/\\s/g, ''),
                        category: 'safety',
                        severity: 'critical',
                        icon: zone.risk === 'high' ? '\\u{1F6A8}' : '\\u26A0\\uFE0F',
                        title: 'DANGER: ' + zone.name,
                        message: zone.riskLabel + ' \\u2014 ' + zone.advisory,
                        time: new Date().toISOString(),
                        read: false
                    });
                    if (typeof saveNotifs === 'function') saveNotifs();
                    if (typeof renderNotifs === 'function') renderNotifs();
                    if (typeof updateNotifBadge === 'function') updateNotifBadge();
                }
            }
        }
    });
}

function playDangerSound() {
    try {
        var ctx = new (window.AudioContext || window.webkitAudioContext)();
        for (var i = 0; i < 3; i++) {
            var osc = ctx.createOscillator();
            var gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = 880;
            osc.type = 'square';
            gain.gain.value = 0.3;
            osc.start(ctx.currentTime + i * 0.3);
            osc.stop(ctx.currentTime + i * 0.3 + 0.15);
        }
    } catch(e) {}
}

function showDangerPopup(zone) {
    var overlay = document.getElementById('danger-alert-overlay');
    var zoneName = document.getElementById('danger-alert-zone-name');
    var desc = document.getElementById('danger-alert-desc');
    var advisory = document.getElementById('danger-alert-advisory');
    var icon = document.getElementById('danger-alert-icon');
    if (!overlay) return;
    icon.textContent = zone.risk === 'high' ? '\\u{1F6A8}' : zone.risk === 'natural' ? '\\u{1F30D}' : '\\u26A0\\uFE0F';
    zoneName.textContent = zone.name + ' \\u2014 ' + zone.riskLabel;
    desc.textContent = zone.description;
    advisory.innerHTML = '<strong>\\u26A0\\uFE0F Advisory:</strong> ' + zone.advisory;
    overlay.style.display = 'flex';
}

function dismissDangerAlert() {
    var overlay = document.getElementById('danger-alert-overlay');
    if (overlay) overlay.style.display = 'none';
}

// ==================== TRACKING PANEL ====================
function updateTrackingPanel(lat, lng, speed, altitude, heading, accuracy) {
    var coordsEl = document.getElementById('track-coords');
    if (coordsEl) coordsEl.textContent = lat.toFixed(6) + ', ' + lng.toFixed(6);

    var speedEl = document.getElementById('track-speed');
    if (speedEl) speedEl.textContent = currentSpeed.toFixed(1) + ' km/h';

    var altEl = document.getElementById('track-altitude');
    if (altEl) altEl.textContent = altitude ? altitude.toFixed(0) + ' m' : 'N/A';

    var headEl = document.getElementById('track-heading');
    if (headEl) {
        var dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
        var dir = heading ? dirs[Math.round(heading / 45) % 8] : '--';
        headEl.textContent = dir + (heading ? ' (' + heading.toFixed(0) + '\\u00b0)' : '');
    }

    var accEl = document.getElementById('track-accuracy');
    if (accEl) accEl.textContent = accuracy ? '\\u00b1' + accuracy.toFixed(0) + 'm' : 'N/A';

    var distEl = document.getElementById('track-distance');
    if (distEl) distEl.textContent = totalDistanceTraveled.toFixed(2) + ' km';

    var timeEl = document.getElementById('track-elapsed');
    if (timeEl && trackingStartTime) {
        var secs = Math.floor((Date.now() - trackingStartTime) / 1000);
        var h = Math.floor(secs / 3600);
        var m = Math.floor((secs % 3600) / 60);
        var s = secs % 60;
        timeEl.textContent = (h > 0 ? h + 'h ' : '') + m + 'm ' + s + 's';
    }

    var destEl = document.getElementById('track-dest-dist');
    var etaEl = document.getElementById('track-eta');
    if (destEl && typeof getCurrentUser === 'function') {
        var user = getCurrentUser();
        if (user && user.destination) {
            var destCoords = getDestinationCoords(user.destination);
            if (destCoords) {
                var remDist = getDistance(lat, lng, destCoords.lat, destCoords.lng);
                destEl.textContent = remDist.toFixed(1) + ' km remaining';
                if (etaEl) {
                    if (currentSpeed > 5) {
                        var etaH = remDist / currentSpeed;
                        var etaMins = Math.round(etaH * 60);
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

    var batEl = document.getElementById('track-battery');
    if (batEl && batteryLevel !== null) {
        batEl.textContent = batteryLevel + '%';
        batEl.style.color = batteryLevel > 50 ? '#27ae60' : batteryLevel > 20 ? '#f39c12' : '#e74c3c';
    }
}

function getDestinationCoords(dest) {
    var coords = {
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
        'leh': { lat: 34.1526, lng: 77.5771 },
        'darjeeling': { lat: 27.0360, lng: 88.2627 },
        'mysore': { lat: 12.2958, lng: 76.6394 },
        'hyderabad': { lat: 17.3850, lng: 78.4867 },
        'ooty': { lat: 11.4102, lng: 76.6950 },
        'kashmir': { lat: 34.0837, lng: 74.7973 },
        'ladakh': { lat: 34.1526, lng: 77.5771 },
        'himachal': { lat: 31.1048, lng: 77.1734 },
        'rajasthan': { lat: 26.9124, lng: 75.7873 },
        'northeast': { lat: 27.3389, lng: 88.6065 },
        'kerala': { lat: 9.9312, lng: 76.2673 },
        'kochi': { lat: 9.9312, lng: 76.2673 }
    };
    var key = dest.toLowerCase().trim();
    return coords[key] || null;
}

function getBatteryStatus() {
    if ('getBattery' in navigator) {
        navigator.getBattery().then(function(battery) {
            batteryLevel = Math.round(battery.level * 100);
            battery.addEventListener('levelchange', function() {
                batteryLevel = Math.round(battery.level * 100);
                var batEl = document.getElementById('track-battery');
                if (batEl) {
                    batEl.textContent = batteryLevel + '%';
                    batEl.style.color = batteryLevel > 50 ? '#27ae60' : batteryLevel > 20 ? '#f39c12' : '#e74c3c';
                }
            });
            var batEl = document.getElementById('track-battery');
            if (batEl) {
                batEl.textContent = batteryLevel + '%';
                batEl.style.color = batteryLevel > 50 ? '#27ae60' : batteryLevel > 20 ? '#f39c12' : '#e74c3c';
            }
        }).catch(function() {});
    }
}

function checkNearbyPOIsForTracking(lat, lng) {}

function shareLiveLocation() {
    if (!lastKnownPosition) {
        showToast('No location data available yet');
        return;
    }
    var lat = lastKnownPosition.lat;
    var lng = lastKnownPosition.lng;
    var googleMapsUrl = 'https://www.google.com/maps?q=' + lat + ',' + lng;

    if (navigator.share) {
        navigator.share({
            title: '\\u{1F4CD} My Live Location - Bharat Suraksha',
            text: 'I am currently at this location.\\nLat: ' + lat.toFixed(6) + ', Lng: ' + lng.toFixed(6),
            url: googleMapsUrl
        }).catch(function() {});
    } else {
        var text = 'My Live Location: ' + googleMapsUrl + '\\nLat: ' + lat.toFixed(6) + ', Lng: ' + lng.toFixed(6);
        navigator.clipboard.writeText(text).then(function() {
            showToast('\\u{1F517} Location link copied to clipboard!');
        }).catch(function() {
            var ta = document.createElement('textarea');
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            showToast('\\u{1F517} Location link copied!');
        });
    }
}

"""

# Replace the LIVE TRACKING section
html = html[:lt_start] + new_tracking_section + html[lt_end:]

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print(f"Updated inline tracking in index.html ({len(html)} bytes)")
