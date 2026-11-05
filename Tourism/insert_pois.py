#!/usr/bin/env python3
"""Insert new POI data into app.js after the last samplePlaces entry"""

with open('app.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the last entry and insert after it
marker = 'img: "\U0001F37D\uFE0F" },\r\n];'
pos = content.find(marker)
if pos == -1:
    # Try without \r
    marker = 'img: "\U0001F37D\uFE0F" },\n];'
    pos = content.find(marker)

if pos == -1:
    print("Could not find insertion point")
    exit(1)

insert_pos = pos + len('img: "\U0001F37D\uFE0F" },')

new_pois = """
    // ── ATMs ──
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
    { name: "Cafe Repertwahr - Assi", type: "cafe", city: "varanasi", lat: 25.2860, lng: 83.0075, address: "Assi Ghat, Varanasi", phone: "0542-2345678", rating: 4.2, reviews: 3400, budget: "Budget", img: "☕" }"""

content = content[:insert_pos] + new_pois + content[insert_pos:]

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(content)

print(f"Inserted 36 new POIs ({len(content)} bytes)")
