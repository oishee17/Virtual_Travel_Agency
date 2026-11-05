#!/usr/bin/env python3
"""Add comprehensive POI data and live map POI markers"""

# Read app.js
with open('app.js', 'r', encoding='utf-8') as f:
    js = f.read()

# ═══════════════════════════════════════════════════════
# 1. ADD NEW POI TYPES TO samplePlaces (before closing ]);)
# ═══════════════════════════════════════════════════════

new_pois = """    // ── ATMs ──
    { name: "SBI ATM - Connaught Place", type: "atm", city: "delhi", lat: 28.6315, lng: 77.2167, address: "Block A, Connaught Place, New Delhi", phone: "1800-11-2211", rating: 4.0, reviews: 3200, budget: "Free", img: "🏧" },
    { name: "HDFC ATM - Karol Bagh", type: "atm", city: "delhi", lat: 28.6519, lng: 77.1898, address: "Ajmal Khan Rd, Karol Bagh, New Delhi", phone: "1800-266-4332", rating: 4.1, reviews: 2100, budget: "Free", img: "🏧" },
    { name: "ICICI ATM - Park Street", type: "atm", city: "kolkata", lat: 22.5530, lng: 88.3510, address: "42 Park Street, Kolkata", phone: "1800-2662", rating: 4.2, reviews: 1800, budget: "Free", img: "🏧" },
    { name: "SBI ATM - MG Road", type: "atm", city: "bangalore", lat: 12.9758, lng: 77.6064, address: "MG Road, Bangalore", phone: "1800-11-2211", rating: 3.9, reviews: 2500, budget: "Free", img: "🏧" },
    { name: "HDFC ATM - Juhu", type: "atm", city: "mumbai", lat: 19.1334, lng: 72.8298, address: "Juhu Tara Road, Mumbai", phone: "1800-266-4332", rating: 4.0, reviews: 1900, budget: "Free", img: "🏧" },
    { name: "Axis ATM - MI Road", type: "atm", city: "jaipur", lat: 26.9228, lng: 75.7873, address: "MI Road, Jaipur", phone: "1800-236-6800", rating: 4.1, reviews: 1500, budget: "Free", img: "🏧" },
    { name: "SBI ATM - T Nagar", type: "atm", city: "chennai", lat: 13.0408, lng: 80.2337, address: "Usman Road, T Nagar, Chennai", phone: "1800-11-2211", rating: 3.8, reviews: 2000, budget: "Free", img: "🏧" },
    { name: "ICICI ATM - FC Road", type: "atm", city: "pune", lat: 18.5195, lng: 73.8553, address: "Fergusson College Road, Pune", phone: "1800-2662", rating: 4.0, reviews: 1600, budget: "Free", img: "🏧" },
    { name: "HDFC ATM - Assi Ghat", type: "atm", city: "varanasi", lat: 25.2864, lng: 83.0080, address: "Assi Ghat Road, Varanasi", phone: "1800-266-4332", rating: 3.9, reviews: 1200, budget: "Free", img: "🏧" },
    // ── PHARMACIES ──
    { name: "Apollo Pharmacy - CP", type: "pharmacy", city: "delhi", lat: 28.6304, lng: 77.2177, address: "Block F, Connaught Place, New Delhi", phone: "011-41445555", rating: 4.3, reviews: 5600, budget: "Budget", img: "💊" },
    { name: "MedPlus - Nehru Place", type: "pharmacy", city: "delhi", lat: 28.5491, lng: 77.2530, address: "Nehru Place, New Delhi", phone: "011-26207777", rating: 4.1, reviews: 3400, budget: "Budget", img: "💊" },
    { name: "Apollo Pharmacy - Salt Lake", type: "pharmacy", city: "kolkata", lat: 22.5726, lng: 88.4106, address: "Sector V, Salt Lake, Kolkata", phone: "033-40002222", rating: 4.2, reviews: 2800, budget: "Budget", img: "💊" },
    { name: "Netmeds - Koramangala", type: "pharmacy", city: "bangalore", lat: 12.9352, lng: 77.6245, address: "80 Feet Road, Koramangala, Bangalore", phone: "080-40001234", rating: 4.4, reviews: 4200, budget: "Budget", img: "💊" },
    { name: "Apollo Pharmacy - Bandra", type: "pharmacy", city: "mumbai", lat: 19.0596, lng: 72.8295, address: "Linking Road, Bandra West, Mumbai", phone: "022-40002222", rating: 4.3, reviews: 3800, budget: "Budget", img: "💊" },
    { name: "1mg Pharmacy - MI Road", type: "pharmacy", city: "jaipur", lat: 26.9228, lng: 75.7900, address: "MI Road, Jaipur", phone: "0141-4000123", rating: 4.0, reviews: 2100, budget: "Budget", img: "💊" },
    { name: "Apollo Pharmacy - T Nagar", type: "pharmacy", city: "chennai", lat: 13.0398, lng: 80.2347, address: "Usman Road, T Nagar, Chennai", phone: "044-40002222", rating: 4.2, reviews: 3100, budget: "Budget", img: "💊" },
    { name: "MedPlus - Deccan", type: "pharmacy", city: "pune", lat: 18.5132, lng: 73.8393, address: "Deccan Gymkhana, Pune", phone: "020-40005555", rating: 4.1, reviews: 2400, budget: "Budget", img: "💊" },
    { name: "Apollo - Dashashwamedh", type: "pharmacy", city: "varanasi", lat: 25.3048, lng: 83.0105, address: "Dashashwamedh Ghat Road, Varanasi", phone: "0542-4000222", rating: 4.0, reviews: 1800, budget: "Budget", img: "💊" },
    // ── PETROL PUMPS ──
    { name: "IOCL Petrol Pump - ITO", type: "petrol", city: "delhi", lat: 28.6280, lng: 77.2410, address: "ITO, New Delhi", phone: "011-23345678", rating: 4.0, reviews: 1500, budget: "Moderate", img: "⛽" },
    { name: "BP Petrol Pump - Rajouri", type: "petrol", city: "delhi", lat: 28.6492, lng: 77.1220, address: "Rajouri Garden, New Delhi", phone: "011-25101234", rating: 4.1, reviews: 1200, budget: "Moderate", img: "⛽" },
    { name: "HP Petrol Pump - EM Bypass", type: "petrol", city: "kolkata", lat: 22.5180, lng: 88.3950, address: "EM Bypass, Kolkata", phone: "033-24301234", rating: 3.9, reviews: 1100, budget: "Moderate", img: "⛽" },
    { name: "IOCL Petrol Pump - Silk Board", type: "petrol", city: "bangalore", lat: 12.9170, lng: 77.6229, address: "Silk Board Junction, Bangalore", phone: "080-25701234", rating: 4.0, reviews: 1800, budget: "Moderate", img: "⛽" },
    { name: "HP Petrol Pump - Andheri", type: "petrol", city: "mumbai", lat: 19.1197, lng: 72.8464, address: "Andheri Kurla Road, Mumbai", phone: "022-26301234", rating: 4.1, reviews: 2000, budget: "Moderate", img: "⛽" },
    { name: "BP Petrol Pump - Tonk Road", type: "petrol", city: "jaipur", lat: 26.8840, lng: 75.7910, address: "Tonk Road, Jaipur", phone: "0141-2701234", rating: 3.8, reviews: 900, budget: "Moderate", img: "⛽" },
    { name: "IOCL Petrol Pump - OMR", type: "petrol", city: "chennai", lat: 12.9815, lng: 80.2480, address: "Old Mahabalipuram Road, Chennai", phone: "044-24501234", rating: 4.0, reviews: 1300, budget: "Moderate", img: "⛽" },
    { name: "HP Petrol Pump - Hinjewadi", type: "petrol", city: "pune", lat: 18.5912, lng: 73.7389, address: "Hinjewadi, Pune", phone: "020-27101234", rating: 3.9, reviews: 1000, budget: "Moderate", img: "⛽" },
    { name: "BP Petrol Pump - BHU", type: "petrol", city: "varanasi", lat: 25.2677, lng: 82.9913, address: "BHU Lanka Road, Varanasi", phone: "0542-2301234", rating: 3.8, reviews: 700, budget: "Moderate", img: "⛽" },
    // ── CAFES ──
    { name: "Starbucks - CP", type: "cafe", city: "delhi", lat: 28.6329, lng: 77.2195, address: "Block C, Connaught Place, New Delhi", phone: "011-45678901", rating: 4.4, reviews: 8900, budget: "Premium", img: "☕" },
    { name: "Blue Tokai - Defence Colony", type: "cafe", city: "delhi", lat: 28.5733, lng: 77.2343, address: "Defence Colony, New Delhi", phone: "011-26789012", rating: 4.6, reviews: 5400, budget: "Moderate", img: "☕" },
    { name: "Peter Cat - Park Street", type: "cafe", city: "kolkata", lat: 22.5544, lng: 88.3505, address: "18A Park Street, Kolkata", phone: "033-22297889", rating: 4.5, reviews: 12000, budget: "Moderate", img: "☕" },
    { name: "Third Wave - Indiranagar", type: "cafe", city: "bangalore", lat: 12.9784, lng: 77.6408, address: "100 Feet Road, Indiranagar, Bangalore", phone: "080-45678901", rating: 4.5, reviews: 7200, budget: "Moderate", img: "☕" },
    { name: "Leopold Cafe - Colaba", type: "cafe", city: "mumbai", lat: 18.9220, lng: 72.8347, address: "Colaba Causeway, Mumbai", phone: "022-22020123", rating: 4.3, reviews: 15000, budget: "Moderate", img: "☕" },
    { name: "Tapri Central - C-Scheme", type: "cafe", city: "jaipur", lat: 26.9150, lng: 75.7890, address: "C-Scheme, Jaipur", phone: "0141-4001234", rating: 4.4, reviews: 6800, budget: "Budget", img: "☕" },
    { name: "Saravana Bhavan - T Nagar", type: "cafe", city: "chennai", lat: 13.0418, lng: 80.2341, address: "Usman Road, T Nagar, Chennai", phone: "044-28345678", rating: 4.3, reviews: 9500, budget: "Moderate", img: "☕" },
    { name: "Cafe Goodluck - Deccan", type: "cafe", city: "pune", lat: 18.5135, lng: 73.8398, address: "FC Road, Deccan, Pune", phone: "020-25567890", rating: 4.5, reviews: 11000, budget: "Budget", img: "☕" },
    { name: "Cafe Repertwahr - Assi", type: "cafe", city: "varanasi", lat: 25.2860, lng: 83.0075, address: "Assi Ghat, Varanasi", phone: "0542-2345678", rating: 4.2, reviews: 3400, budget: "Budget", img: "☕" },
"""

# Find the last entry before ];  in samplePlaces
# The last entry is the "Baati Chokha" restaurant in varanasi
marker = '    { name: "Baati Chokha", type: "restaurant", city: "varanasi", lat: 25.2980, lng: 83.0050, address: "Narmada Bahwan, Godowlia, Varanasi", phone: "0542-2393333", rating: 4.3, reviews: 2900, budget: "Budget (<2K)", img: "🍽️" },\r\n];'
replacement = '    { name: "Baati Chokha", type: "restaurant", city: "varanasi", lat: 25.2980, lng: 83.0050, address: "Narmada Bahwan, Godowlia, Varanasi", phone: "0542-2393333", rating: 4.3, reviews: 2900, budget: "Budget (<2K)", img: "🍽️" },\r\n' + new_pois + '];'

js = js.replace(marker, replacement, 1)
print("Added new POI types to samplePlaces")

# ═══════════════════════════════════════════════════════
# 2. ADD LIVE MAP POI MARKERS AND FILTER BAR
# ═══════════════════════════════════════════════════════

insert_after = "// ==================== TRACKING PANEL ===================="

live_map_poi_code = """// ==================== LIVE MAP NEARBY POIS ====================
let livePOIMarkers = [];
let activeLivePOIFilter = 'all';
const DESTINATION_COORDS_MAP = {
    'kolkata': { lat: 22.5726, lng: 88.3639 }, 'delhi': { lat: 28.7041, lng: 77.1025 },
    'mumbai': { lat: 19.0760, lng: 72.8777 }, 'bangalore': { lat: 12.9716, lng: 77.5946 },
    'chennai': { lat: 13.0827, lng: 80.2707 }, 'jaipur': { lat: 26.9124, lng: 75.7873 },
    'varanasi': { lat: 25.3176, lng: 82.9739 }, 'pune': { lat: 18.5204, lng: 73.8567 },
    'goa': { lat: 15.2993, lng: 74.1240 }, 'agra': { lat: 27.1767, lng: 78.0081 },
    'udaipur': { lat: 24.5854, lng: 73.7125 }, 'shimla': { lat: 31.1048, lng: 77.1734 },
    'manali': { lat: 32.2432, lng: 77.1892 }, 'srinagar': { lat: 34.0837, lng: 74.7973 },
    'amritsar': { lat: 31.6340, lng: 74.8723 }, 'rishikesh': { lat: 30.0869, lng: 78.2676 },
    'leh': { lat: 34.1526, lng: 77.5771 }, 'darjeeling': { lat: 27.0360, lng: 88.2627 },
    'mysore': { lat: 12.2958, lng: 76.6394 }, 'hyderabad': { lat: 17.3850, lng: 78.4867 },
    'kashmir': { lat: 34.0837, lng: 74.7973 }, 'ladakh': { lat: 34.1526, lng: 77.5771 },
    'himachal': { lat: 31.1048, lng: 77.1734 }, 'rajasthan': { lat: 26.9124, lng: 75.7873 },
    'northeast': { lat: 27.3389, lng: 88.6065 }, 'kerala': { lat: 9.9312, lng: 76.2673 },
    'kochi': { lat: 9.9312, lng: 76.2673 }
};

function addLiveMapPOIs(dest) {
    if (!map || !samplePlaces || !dest) return;
    clearLiveMapPOIs();
    var destKey = dest.toLowerCase().trim();
    var destCoord = DESTINATION_COORDS_MAP[destKey];
    if (!destCoord) return;

    var places = samplePlaces.filter(function(p) { return p.city === destKey; });
    var nearby = samplePlaces.filter(function(p) {
        if (p.city === destKey) return false;
        var d = getDistance(destCoord.lat, destCoord.lng, p.lat, p.lng);
        return d < 150;
    });
    var all = places.concat(nearby);

    var colors = { hospital: '#3498db', police: '#9b59b6', hotel: '#f1c40f', restaurant: '#27ae60', atm: '#e67e22', pharmacy: '#1abc9c', petrol: '#e74c3c', cafe: '#8e44ad' };
    var icons = { hospital: '🏥', police: '🚔', hotel: '🏨', restaurant: '🍽️', atm: '🏧', pharmacy: '💊', petrol: '⛽', cafe: '☕' };
    var labels = { hospital: 'Hospital', police: 'Police Station', hotel: 'Hotel', restaurant: 'Restaurant', atm: 'ATM', pharmacy: 'Pharmacy', petrol: 'Petrol Pump', cafe: 'Cafe' };

    all.forEach(function(place) {
        if (!place.lat || !place.lng) return;
        var color = colors[place.type] || '#ff6b35';
        var icon = icons[place.type] || '📍';
        var poiIcon = L.divIcon({
            className: 'live-poi-marker',
            html: '<div style="background:' + color + ';color:white;border-radius:50%;width:30px;height:30px;display:flex;align-items:center;justify-content:center;font-size:15px;border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);cursor:pointer;transition:transform 0.2s;" onmouseover="this.style.transform=\\'scale(1.2)\\'" onmouseout="this.style.transform=\\'scale(1)\\'">' + icon + '</div>',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });
        var marker = L.marker([place.lat, place.lng], { icon: poiIcon }).addTo(map);
        var budgetColor = place.budget && place.budget.includes('Luxury') ? '#e74c3c' :
                          place.budget && place.budget.includes('Premium') ? '#f39c12' :
                          place.budget && place.budget.includes('Budget') ? '#27ae60' :
                          place.budget && place.budget.includes('Free') ? '#3498db' : '#64748b';
        var stars = '';
        for (var i = 0; i < 5; i++) {
            stars += i < Math.floor(place.rating || 0) ? '<span style="color:#f39c12;">★</span>' : '<span style="color:#555;">★</span>';
        }
        marker.bindPopup(
            '<div style="min-width:240px;font-family:inherit;">' +
            '<div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">' +
            '<span style="background:' + color + '20;color:' + color + ';padding:3px 10px;border-radius:12px;font-size:0.75rem;font-weight:600;">' + icon + ' ' + labels[place.type] + '</span>' +
            '<span style="background:' + budgetColor + '20;color:' + budgetColor + ';padding:3px 10px;border-radius:12px;font-size:0.75rem;font-weight:600;">' + (place.budget || 'N/A') + '</span>' +
            '</div>' +
            '<b style="font-size:1.1em;display:block;margin-bottom:4px;">' + place.name + '</b>' +
            '<div style="color:#888;font-size:0.85em;margin-bottom:4px;">\\u{1F4CD} ' + (place.address || 'Address not available') + '</div>' +
            '<div style="display:flex;align-items:center;gap:8px;margin:6px 0;">' +
            '<div style="display:flex;gap:1px;">' + stars + '</div>' +
            '<span style="color:#f39c12;font-weight:600;font-size:0.9em;">' + (place.rating || 'N/A') + '</span>' +
            '<span style="color:#888;font-size:0.8em;">(' + (place.reviews || 0).toLocaleString() + ' reviews)</span>' +
            '</div>' +
            '<div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap;">' +
            '<a href="tel:' + place.phone + '" style="display:inline-flex;align-items:center;gap:4px;padding:5px 12px;background:#27ae60;color:white;border-radius:6px;text-decoration:none;font-size:0.82rem;font-weight:600;">\\u{1F4DE} Call</a>' +
            '<a href="https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(place.name + ' ' + (place.address || '')) + '" target="_blank" style="display:inline-flex;align-items:center;gap:4px;padding:5px 12px;background:#4285f4;color:white;border-radius:6px;text-decoration:none;font-size:0.82rem;font-weight:600;">\\u{1F5FA}\\uFE0F Directions</a>' +
            '</div></div>'
        );
        marker._poiType = place.type;
        livePOIMarkers.push(marker);
    });
    updateLivePOICount();
}

function clearLiveMapPOIs() {
    livePOIMarkers.forEach(function(m) { try { map.removeLayer(m); } catch(e){} });
    livePOIMarkers = [];
}

function toggleLivePOI(type) {
    if (type === 'all') {
        activeLivePOIFilter = 'all';
        livePOIMarkers.forEach(function(m) { try { m.addTo(map); } catch(e){} });
    } else {
        activeLivePOIFilter = (activeLivePOIFilter === type) ? 'all' : type;
        livePOIMarkers.forEach(function(m) {
            if (activeLivePOIFilter === 'all' || m._poiType === activeLivePOIFilter) {
                try { m.addTo(map); } catch(e){}
            } else {
                try { map.removeLayer(m); } catch(e){}
            }
        });
    }
    document.querySelectorAll('.live-poi-toggle').forEach(function(btn) {
        var btnType = btn.getAttribute('onclick');
        if (btnType) {
            var match = btnType.match(/toggleLivePOI\\('(\\w+)'/);
            if (match) btn.classList.toggle('active', match[1] === activeLivePOIFilter);
        }
    });
    updateLivePOICount();
}

function updateLivePOICount() {
    var badge = document.getElementById('live-poi-count');
    if (badge) {
        var visible = livePOIMarkers.filter(function(m) { return map.hasLayer(m); }).length;
        badge.textContent = visible + ' places';
    }
}

"""

js = js.replace(insert_after, live_map_poi_code + insert_after, 1)

# 3. Hook addLiveMapPOIs into initMap after danger zones
old_init_end = "        dangerZoneMarkers.push(circle);\r\n    });\r\n}"
new_init_end = """        dangerZoneMarkers.push(circle);
    });

    // Add nearby POIs for destination
    var user = JSON.parse(localStorage.getItem('bharatSurakshaCurrentUser') || '{}');
    if (user.destination) {
        addLiveMapPOIs(user.destination);
        var destCoord = DESTINATION_COORDS_MAP[user.destination.toLowerCase().trim()];
        if (destCoord) {
            map.setView([destCoord.lat, destCoord.lng], 12);
        }
    }
}"""

js = js.replace(old_init_end, new_init_end, 1)

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(js)

print(f"Updated app.js ({len(js)} bytes)")
