#!/usr/bin/env python3
"""Enhance notification system with dynamic event-based notifications"""

with open('app.js', 'r', encoding='utf-8') as f:
    js = f.read()

# 1. Add pushNotif helper function after saveNotifs
old_save = """function saveNotifs() {
    localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(notifications));
}"""

new_save = """function saveNotifs() {
    localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(notifications));
}

function pushNotif(category, severity, icon, title, message) {
    const id = category + '-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);
    const notif = {
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

js = js.replace(old_save, new_save, 1)

# 2. Add tracking notifications in startTracking
old_start = """    showToast('\\u{1F4CD} Live tracking started! Your location is being monitored.');
    getBatteryStatus();"""

new_start = """    showToast('\\u{1F4CD} Live tracking started! Your location is being monitored.');
    pushNotif('tracking', 'info', '\\u{1F4CD}', 'Live Tracking Started', 'GPS location tracking is now active. Your position is being monitored for safety.');
    getBatteryStatus();"""

js = js.replace(old_start, new_start, 1)

# 3. Add tracking stopped notification in stopTracking
old_stop_summary = """        showToast('\\u{1F4CA} Trip Summary: ' + totalDistanceTraveled.toFixed(1) + ' km in ' + elapsed + ' min');
    } else {
        showToast('Tracking stopped');
    }
}"""

new_stop_summary = """        showToast('\\u{1F4CA} Trip Summary: ' + totalDistanceTraveled.toFixed(1) + ' km in ' + elapsed + ' min');
        pushNotif('tracking', 'info', '\\u{1F4CA}', 'Tracking Stopped', 'Trip summary: ' + totalDistanceTraveled.toFixed(1) + ' km covered in ' + elapsed + ' min.');
    } else {
        showToast('Tracking stopped');
        pushNotif('tracking', 'info', '\\u{1F6D1}', 'Tracking Stopped', 'Live location tracking has been stopped.');
    }
}"""

js = js.replace(old_stop_summary, new_stop_summary, 1)

# 4. Enhance danger zone notification in checkDangerZones
old_danger_notif = """                    notifications.unshift({
                        id: 'danger-' + zone.name.replace(/\\s/g, ''),
                        category: 'safety',
                        severity: 'critical',
                        icon: zone.risk === 'high' ? '🚨' : '⚠️',
                        title: 'DANGER: ' + zone.name,
                        message: zone.riskLabel + ' — ' + zone.advisory,
                        time: new Date().toISOString(),
                        read: false
                    });
                    if (typeof saveNotifs === 'function') saveNotifs();
                    if (typeof renderNotifs === 'function') renderNotifs();
                    if (typeof updateNotifBadge === 'function') updateNotifBadge();"""

new_danger_notif = """                    pushNotif('safety', 'critical', zone.risk === 'high' ? '🚨' : '⚠️', 'DANGER: ' + zone.name, zone.riskLabel + ' — ' + zone.advisory);"""

js = js.replace(old_danger_notif, new_danger_notif, 1)

# 5. Add location access denied notification in onError
old_error = """function onError(error) {
    console.error('Geolocation error:', error);
    if (error.code === 1) {
        showToast('Location access denied. Please enable location services.');
    } else {
        showToast('Error getting location: ' + error.message);
    }
}"""

new_error = """function onError(error) {
    console.error('Geolocation error:', error);
    if (error.code === 1) {
        showToast('Location access denied. Please enable location services.');
        pushNotif('tracking', 'warning', '📍', 'Location Access Denied', 'Please enable location services in your browser settings to use live tracking.');
    } else {
        showToast('Error getting location: ' + error.message);
        pushNotif('tracking', 'warning', '⚠️', 'Location Error', error.message);
    }
}"""

js = js.replace(old_error, new_error, 1)

# 6. Add profile edit notification
old_save_profile = """function saveProfile() {
    const user = JSON.parse(localStorage.getItem('bharatSurakshaCurrentUser') || '{}');"""

new_save_profile = """function saveProfile() {
    const user = JSON.parse(localStorage.getItem('bharatSurakshaCurrentUser') || '{}');
    const oldDest = user.destination;
    const oldBudget = user.budget;"""

js = js.replace(old_save_profile, new_save_profile, 1)

# Find where the profile is saved and add notification
old_profile_saved = """    localStorage.setItem('bharatSurakshaCurrentUser', JSON.stringify(user));
    document.getElementById('edit-profile-modal').style.display = 'none';
    showToast('Profile updated successfully!');
    enterApp();
}"""

new_profile_saved = """    localStorage.setItem('bharatSurakshaCurrentUser', JSON.stringify(user));
    document.getElementById('edit-profile-modal').style.display = 'none';
    showToast('Profile updated successfully!');
    pushNotif('profile', 'info', '👤', 'Profile Updated', 'Your trip details have been updated. Destination: ' + (user.destination || 'Not set') + ', Budget: ' + (user.budget || 'Not set') + '.');
    enterApp();
}"""

js = js.replace(old_profile_saved, new_profile_saved, 1)

# 7. Add travel mode change notification
old_switch_mode = """function switchTravelMode(mode) {
    currentTravelMode = mode;
    document.querySelectorAll('.travel-mode-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('[data-mode="' + mode + '"]').classList.add('active');
    updateRouteInfo();
}"""

new_switch_mode = """function switchTravelMode(mode) {
    currentTravelMode = mode;
    document.querySelectorAll('.travel-mode-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('[data-mode="' + mode + '"]').classList.add('active');
    updateRouteInfo();
    var modeNames = { driving: 'Car', bus: 'Bus', train: 'Train', flight: 'Flight', cycling: 'Cycle', walking: 'Walk' };
    pushNotif('route', 'info', '🗺️', 'Travel Mode Changed', 'Switched to ' + (modeNames[mode] || mode) + ' mode. Route and ETA updated.');
}"""

js = js.replace(old_switch_mode, new_switch_mode, 1)

# 8. Add share location notification
old_share = """    showToast('\\u{1F517} Location link copied to clipboard! Share it with your emergency contacts.');
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

new_share = """    showToast('\\u{1F517} Location link copied to clipboard! Share it with your emergency contacts.');
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

js = js.replace(old_share, new_share, 1)

# 9. Add language change notification in the lang selector handler
old_lang_handler = """    if (select) {
        select.value = currentLang;
        select.addEventListener('change', (e) => {
            currentLang = e.target.value;
            applyTranslations();
            renderDangerZones();
        });
    }"""

new_lang_handler = """    if (select) {
        select.value = currentLang;
        select.addEventListener('change', (e) => {
            currentLang = e.target.value;
            applyTranslations();
            renderDangerZones();
            var langNames = { en:'English', hi:'Hindi', bn:'Bengali', te:'Telugu', mr:'Marathi', ta:'Tamil', ur:'Urdu', gu:'Gujarati', kn:'Kannada', ml:'Malayalam', or:'Odia', pa:'Punjabi', as:'Assamese', mai:'Maithili', ks:'Kashmiri', ne:'Nepali', sd:'Sindhi', doi:'Dogri', mni:'Manipuri', sat:'Santali', bodo:'Bodo', es:'Spanish', fr:'French', de:'German', zh:'Chinese', ja:'Japanese', ko:'Korean', ar:'Arabic', ru:'Russian', pt:'Portuguese', it:'Italian', th:'Thai', vi:'Vietnamese', tr:'Turkish', nl:'Dutch', sv:'Swedish', pl:'Polish' };
            pushNotif('settings', 'info', '\\u{1F310}', 'Language Changed', 'Interface language switched to ' + (langNames[currentLang] || currentLang) + '.');
        });
    }"""

js = js.replace(old_lang_handler, new_lang_handler, 1)

# 10. Add SOS notification when SOS is triggered
old_sos = """function triggerSOS() {
    if (!confirm('This will call emergency services (112) and share your location. Continue?')) return;

    // Play alarm
    playDangerSound();

    // Share location if tracking
    if (lastKnownPosition) {
        const msg = 'EMERGENCY! I need help. My location: https://www.google.com/maps?q=' + lastKnownPosition.lat + ',' + lastKnownPosition.lng;
        showToast('SOS Alert Sent! 🚨');
    } else {
        showToast('SOS Alert Sent! 🚨');
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
        showToast('SOS Alert Sent! 🚨 Location shared.');
    } else {
        showToast('SOS Alert Sent! 🚨');
    }

    // Try to call 112
    window.location.href = 'tel:112';
}"""

js = js.replace(old_sos, new_sos, 1)

# 11. Add login notification
old_enter = """function enterApp() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('main-app').classList.add('visible');
"""

new_enter = """function enterApp() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('main-app').classList.add('visible');
    var user = getCurrentUser();
    if (user && user.name) {
        pushNotif('account', 'info', '\\u{1F44B}', 'Welcome, ' + user.name + '!', 'Logged in successfully. Destination: ' + (user.destination || 'Not set') + '.');
    }
"""

js = js.replace(old_enter, new_enter, 1)

# 12. Add notification for personal contacts added
old_add_contact = """function addPersonalContact() {
    const name = document.getElementById('contact-name').value.trim();
    const phone = document.getElementById('contact-phone').value.trim();"""

new_add_contact = """function addPersonalContact() {
    var name = document.getElementById('contact-name').value.trim();
    var phone = document.getElementById('contact-phone').value.trim();"""

js = js.replace(old_add_contact, new_add_contact, 1)

# Find where contact is actually added to array and add notif
old_push_contact = """    personalContacts.push({ name, phone });
    localStorage.setItem('bharatSurakshaContacts', JSON.stringify(personalContacts));
    document.getElementById('contact-name').value = '';
    document.getElementById('contact-phone').value = '';
    showToast('Contact added!');
    renderPersonalContacts();"""

new_push_contact = """    personalContacts.push({ name: name, phone: phone });
    localStorage.setItem('bharatSurakshaContacts', JSON.stringify(personalContacts));
    document.getElementById('contact-name').value = '';
    document.getElementById('contact-phone').value = '';
    showToast('Contact added!');
    pushNotif('contacts', 'info', '\\u{1F4DE}', 'Emergency Contact Added', name + ' (' + phone + ') has been added to your emergency contacts.');
    renderPersonalContacts();"""

js = js.replace(old_push_contact, new_push_contact, 1)

# Write updated file
with open('app.js', 'w', encoding='utf-8') as f:
    f.write(js)

print(f"Enhanced notifications in app.js ({len(js)} bytes)")
