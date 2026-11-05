#!/usr/bin/env python3
"""Update inline notification functions in index.html"""

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Add pushNotif after saveNotifs in inline JS
old_save_notif = """function saveNotifs() {
    localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(notifications));
}"""

new_save_notif = """function saveNotifs() {
    localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(notifications));
}

function pushNotif(category, severity, icon, title, message) {
    var id = category + '-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);
    var notif = {
        id: id,
        category: category,
        severity: severity,
        icon: icon,
        title: title,
        message: message,
        time: new Date().toISOString(),
        read: false
    };
    notifications.unshift(notif);
    if (notifications.length > 50) notifications = notifications.slice(0, 50);
    saveNotifs();
    renderNotifs();
    updateNotifBadge();
    showToast(notif);
    return notif;
}"""

html = html.replace(old_save_notif, new_save_notif, 1)

# 2. Add tracking started notification
old_track_start = """    showToast('\\u{1F4CD} Live tracking started! Your location is being monitored.');
    getBatteryStatus();"""

new_track_start = """    showToast('\\u{1F4CD} Live tracking started! Your location is being monitored.');
    pushNotif('tracking', 'info', '\\u{1F4CD}', 'Live Tracking Started', 'GPS location tracking is now active. Your position is being monitored for safety.');
    getBatteryStatus();"""

html = html.replace(old_track_start, new_track_start, 1)

# 3. Add tracking stopped notification
old_track_stop_summary = """        showToast('\\u{1F4CA} Trip Summary: ' + totalDistanceTraveled.toFixed(1) + ' km in ' + elapsed + ' min');
    } else {
        showToast('Tracking stopped');
    }
}"""

new_track_stop_summary = """        showToast('\\u{1F4CA} Trip Summary: ' + totalDistanceTraveled.toFixed(1) + ' km in ' + elapsed + ' min');
        pushNotif('tracking', 'info', '\\u{1F4CA}', 'Tracking Stopped', 'Trip summary: ' + totalDistanceTraveled.toFixed(1) + ' km covered in ' + elapsed + ' min.');
    } else {
        showToast('Tracking stopped');
        pushNotif('tracking', 'info', '\\u{1F6D1}', 'Tracking Stopped', 'Live location tracking has been stopped.');
    }
}"""

html = html.replace(old_track_stop_summary, new_track_stop_summary, 1)

# 4. Enhance danger zone notification
old_danger_push = """                    notifications.unshift({
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
                    if (typeof updateNotifBadge === 'function') updateNotifBadge();"""

new_danger_push = """                    pushNotif('safety', 'critical', zone.risk === 'high' ? '\\u{1F6A8}' : '\\u26A0\\uFE0F', 'DANGER: ' + zone.name, zone.riskLabel + ' \\u2014 ' + zone.advisory);"""

html = html.replace(old_danger_push, new_danger_push, 1)

# 5. Enhance onError with notifications
old_onerror = """function onError(error) {
    console.error('Geolocation error:', error);
    if (error.code === 1) {
        showToast('Location access denied. Please enable location services.');
    } else {
        showToast('Error getting location: ' + error.message);
    }
}"""

new_onerror = """function onError(error) {
    console.error('Geolocation error:', error);
    if (error.code === 1) {
        showToast('Location access denied. Please enable location services.');
        pushNotif('tracking', 'warning', '\\u{1F4CD}', 'Location Access Denied', 'Please enable location services in your browser settings to use live tracking.');
    } else {
        showToast('Error getting location: ' + error.message);
        pushNotif('tracking', 'warning', '\\u26A0\\uFE0F', 'Location Error', error.message);
    }
}"""

html = html.replace(old_onerror, new_onerror, 1)

# 6. Add SOS notification
old_sos = """function triggerSOS() {
    if (!confirm('This will call emergency services (112) and share your location. Continue?')) return;

    // Play alarm
    playDangerSound();

    // Share location if tracking
    if (lastKnownPosition) {
        var msg = 'EMERGENCY! I need help. My location: https://www.google.com/maps?q=' + lastKnownPosition.lat + ',' + lastKnownPosition.lng;
        showToast('SOS Alert Sent! \\u{1F6A8}');
    } else {
        showToast('SOS Alert Sent! \\u{1F6A8}');
    }

    // Try to call 112
    window.location.href = 'tel:112';
}"""

new_sos = """function triggerSOS() {
    if (!confirm('This will call emergency services (112) and share your location. Continue?')) return;

    // Play alarm
    playDangerSound();
    playDangerSound();

    // Push SOS notification
    pushNotif('emergency', 'critical', '\\u{1F6A8}', 'SOS EMERGENCY ACTIVATED', 'Emergency services (112) have been contacted. Your location is being shared with emergency contacts.');

    // Share location if tracking
    if (lastKnownPosition) {
        var msg = 'EMERGENCY! I need help. My location: https://www.google.com/maps?q=' + lastKnownPosition.lat + ',' + lastKnownPosition.lng;
        if (navigator.share) {
            navigator.share({ title: 'SOS - Bharat Suraksha', text: msg }).catch(function(){});
        } else {
            navigator.clipboard.writeText(msg).catch(function(){});
        }
        showToast('SOS Alert Sent! \\u{1F6A8} Location shared.');
    } else {
        showToast('SOS Alert Sent! \\u{1F6A8}');
    }

    // Try to call 112
    window.location.href = 'tel:112';
}"""

html = html.replace(old_sos, new_sos, 1)

# 7. Add share location notification
old_share_clipboard = """            showToast('\\u{1F517} Location link copied to clipboard! Share it with your emergency contacts.');
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
}"""

new_share_clipboard = """            showToast('\\u{1F517} Location link copied to clipboard! Share it with your emergency contacts.');
            pushNotif('tracking', 'info', '\\u{1F517}', 'Location Shared', 'Your live location link has been copied. Share it with your emergency contacts for safety.');
        }).catch(function() {
            var ta = document.createElement('textarea');
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            showToast('\\u{1F517} Location link copied!');
            pushNotif('tracking', 'info', '\\u{1F517}', 'Location Shared', 'Your live location link has been copied to clipboard.');
        });
    }
}"""

html = html.replace(old_share_clipboard, new_share_clipboard, 1)

# 8. Add language change notification
old_lang_inline = """        select.addEventListener('change', (e) => {
            currentLang = e.target.value;
            applyTranslations();
            renderDangerZones();
        });"""

new_lang_inline = """        select.addEventListener('change', (e) => {
            currentLang = e.target.value;
            applyTranslations();
            renderDangerZones();
            var langNames = { en:'English', hi:'Hindi', bn:'Bengali', te:'Telugu', mr:'Marathi', ta:'Tamil', ur:'Urdu', gu:'Gujarati', kn:'Kannada', ml:'Malayalam', or:'Odia', pa:'Punjabi', as:'Assamese', mai:'Maithili', ks:'Kashmiri', ne:'Nepali', sd:'Sindhi', doi:'Dogri', mni:'Manipuri', sat:'Santali', bodo:'Bodo', es:'Spanish', fr:'French', de:'German', zh:'Chinese', ja:'Japanese', ko:'Korean', ar:'Arabic', ru:'Russian', pt:'Portuguese', it:'Italian', th:'Thai', vi:'Vietnamese', tr:'Turkish', nl:'Dutch', sv:'Swedish', pl:'Polish' };
            pushNotif('settings', 'info', '\\u{1F310}', 'Language Changed', 'Interface language switched to ' + (langNames[currentLang] || currentLang) + '.');
        });"""

html = html.replace(old_lang_inline, new_lang_inline, 1)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print(f"Updated inline notifications in index.html ({len(html)} bytes)")
