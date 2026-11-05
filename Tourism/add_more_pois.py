#!/usr/bin/env python3
"""Add more POIs to samplePlaces for richer live map data"""

with open('app.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Find the last entry before ]; in samplePlaces
marker = 'img: "\u2615" },\n];'
pos = js.find(marker)
if pos == -1:
    marker = 'img: "\u2615" },\r\n];'
    pos = js.find(marker)
if pos == -1:
    print("Could not find insertion point")
    exit(1)

insert_pos = pos + len('img: "\u2615" },')

new_pois = """,
    // ═══════ MORE HOTELS ═══════
    { name: "The Oberoi Grand", type: "hotel", city: "kolkata", lat: 22.5560, lng: 88.3510, address: "15 Jawaharlal Nehru Road, Kolkata", phone: "033-22492323", rating: 4.7, reviews: 8500, budget: "Luxury (15K+)", img: "🏨" },
    { name: "ITC Sonar", type: "hotel", city: "kolkata", lat: 22.5280, lng: 88.3920, address: "1 JBS Haldane Avenue, Kolkata", phone: "033-23456789", rating: 4.5, reviews: 6200, budget: "Premium (5K-15K)", img: "🏨" },
    { name: "Hotel Sonar Bangla", type: "hotel", city: "kolkata", lat: 22.5350, lng: 88.4050, address: "Premises No. 2, Loudon Street, Kolkata", phone: "033-22801234", rating: 4.0, reviews: 3400, budget: "Moderate (2K-5K)", img: "🏨" },
    { name: "The Park Kolkata", type: "hotel", city: "kolkata", lat: 22.5530, lng: 88.3480, address: "17 Shakespeare Sarani, Kolkata", phone: "033-22498811", rating: 4.4, reviews: 5100, budget: "Premium (5K-15K)", img: "🏨" },
    { name: "OYO Townhouse Park Street", type: "hotel", city: "kolkata", lat: 22.5510, lng: 88.3530, address: "33 Park Street, Kolkata", phone: "033-40001234", rating: 3.8, reviews: 2200, budget: "Budget (<2K)", img: "🏨" },
    { name: "Hyatt Regency Delhi", type: "hotel", city: "delhi", lat: 28.5562, lng: 77.0980, address: "Bhikaji Cama Place, New Delhi", phone: "011-26781234", rating: 4.6, reviews: 12000, budget: "Luxury (15K+)", img: "🏨" },
    { name: "The Imperial Delhi", type: "hotel", city: "delhi", lat: 28.6246, lng: 77.2177, address: "Janpath, New Delhi", phone: "011-23341234", rating: 4.7, reviews: 9800, budget: "Luxury (15K+)", img: "🏨" },
    { name: "Taj Palace Delhi", type: "hotel", city: "delhi", lat: 28.5993, lng: 77.1691, address: "Sardar Patel Marg, New Delhi", phone: "011-26111234", rating: 4.5, reviews: 11000, budget: "Luxury (15K+)", img: "🏨" },
    { name: "The Leela Palace Delhi", type: "hotel", city: "delhi", lat: 28.5731, lng: 77.1685, address: "Diplomatic Enclave, Chanakyapuri", phone: "011-39331234", rating: 4.6, reviews: 7500, budget: "Luxury (15K+)", img: "🏨" },
    { name: "Zostel Delhi", type: "hotel", city: "delhi", lat: 28.6412, lng: 77.2180, address: "H-5/6, Chuna Mandi, Paharganj", phone: "011-45678901", rating: 4.1, reviews: 4500, budget: "Budget (<2K)", img: "🏨" },
    { name: "Taj Mahal Palace Mumbai", type: "hotel", city: "mumbai", lat: 18.9220, lng: 72.8330, address: "Apollo Bunder, Mumbai", phone: "022-66651234", rating: 4.7, reviews: 15000, budget: "Luxury (15K+)", img: "🏨" },
    { name: "The Oberoi Mumbai", type: "hotel", city: "mumbai", lat: 18.9260, lng: 72.8290, address: "Nariman Point, Mumbai", phone: "022-66321234", rating: 4.6, reviews: 10000, budget: "Luxury (15K+)", img: "🏨" },
    { name: "Trident Nariman Point", type: "hotel", city: "mumbai", lat: 18.9290, lng: 72.8250, address: "Nariman Point, Mumbai", phone: "022-66321234", rating: 4.4, reviews: 7800, budget: "Premium (5K-15K)", img: "🏨" },
    { name: "Hotel Residency Fort", type: "hotel", city: "mumbai", lat: 18.9340, lng: 72.8370, address: "MG Road, Fort, Mumbai", phone: "022-66301234", rating: 3.9, reviews: 3200, budget: "Moderate (2K-5K)", img: "🏨" },
    { name: "Treebo Trend Andheri", type: "hotel", city: "mumbai", lat: 19.1197, lng: 72.8464, address: "Andheri Kurla Road, Mumbai", phone: "022-40001234", rating: 3.8, reviews: 2100, budget: "Budget (<2K)", img: "🏨" },
    { name: "The Leela Palace Bangalore", type: "hotel", city: "bangalore", lat: 12.9986, lng: 77.5893, address: "HAL Airport Road, Bangalore", phone: "080-25211234", rating: 4.6, reviews: 9200, budget: "Luxury (15K+)", img: "🏨" },
    { name: "Taj West End Bangalore", type: "hotel", city: "bangalore", lat: 12.9765, lng: 77.5830, address: "Race Course Road, Bangalore", phone: "080-66601234", rating: 4.5, reviews: 7800, budget: "Luxury (15K+)", img: "🏨" },
    { name: "Royal Orchid Central", type: "hotel", city: "bangalore", lat: 12.9352, lng: 77.6245, address: "Koramangala, Bangalore", phone: "080-40001234", rating: 4.2, reviews: 4500, budget: "Moderate (2K-5K)", img: "🏨" },
    { name: "FabHotel Indiranagar", type: "hotel", city: "bangalore", lat: 12.9784, lng: 77.6408, address: "100 Feet Road, Indiranagar", phone: "080-45678901", rating: 3.9, reviews: 2800, budget: "Budget (<2K)", img: "🏨" },
    { name: "ITC Grand Chola Chennai", type: "hotel", city: "chennai", lat: 13.0340, lng: 80.2210, address: "Mount Road, Chennai", phone: "044-22331234", rating: 4.6, reviews: 8900, budget: "Luxury (15K+)", img: "🏨" },
    { name: "Taj Connemara Chennai", type: "hotel", city: "chennai", lat: 13.0604, lng: 80.2496, address: "Binny Road, Chennai", phone: "044-23451234", rating: 4.5, reviews: 6500, budget: "Luxury (15K+)", img: "🏨" },
    { name: "Residency Towers", type: "hotel", city: "chennai", lat: 13.0560, lng: 80.2430, address: "Sir Thyagaraya Road, Chennai", phone: "044-28301234", rating: 4.2, reviews: 4200, budget: "Premium (5K-15K)", img: "🏨" },
    { name: "OYO Home T Nagar", type: "hotel", city: "chennai", lat: 13.0408, lng: 80.2337, address: "Usman Road, T Nagar, Chennai", phone: "044-40001234", rating: 3.7, reviews: 1800, budget: "Budget (<2K)", img: "🏨" },
    { name: "Rambagh Palace Jaipur", type: "hotel", city: "jaipur", lat: 26.8930, lng: 75.8120, address: "Bhawani Singh Road, Jaipur", phone: "0141-23851234", rating: 4.8, reviews: 7200, budget: "Luxury (15K+)", img: "🏨" },
    { name: "The Oberoi Rajvilas", type: "hotel", city: "jaipur", lat: 26.9180, lng: 75.8120, address: "Goner Road, Jaipur", phone: "0141-26801234", rating: 4.7, reviews: 6800, budget: "Luxury (15K+)", img: "🏨" },
    { name: "ITC Rajputana", type: "hotel", city: "jaipur", lat: 26.9124, lng: 75.7873, address: "Palace Road, Jaipur", phone: "0141-23011234", rating: 4.3, reviews: 5100, budget: "Premium (5K-15K)", img: "🏨" },
    { name: "Hotel Pearl Palace", type: "hotel", city: "jaipur", lat: 26.9228, lng: 75.7900, address: "Hawa Mahal Road, Jaipur", phone: "0141-4001234", rating: 4.4, reviews: 8900, budget: "Budget (<2K)", img: "🏨" },
    { name: "Taj Nadesar Palace Varanasi", type: "hotel", city: "varanasi", lat: 25.3200, lng: 75.9800, address: "Nadesar Palace Grounds, Varanasi", phone: "0542-6633000", rating: 4.6, reviews: 2800, budget: "Luxury (15K+)", img: "🏨" },
    { name: "Hotel Ganges View", type: "hotel", city: "varanasi", lat: 25.2920, lng: 83.0080, address: "Assi Ghat, Varanasi", phone: "0542-2311895", rating: 4.2, reviews: 1600, budget: "Moderate (2K-5K)", img: "🏨" },
    { name: "Ramada Plaza JHV", type: "hotel", city: "varanasi", lat: 25.3310, lng: 83.0120, address: "Nadesar, Varanasi", phone: "0542-6660000", rating: 4.3, reviews: 2200, budget: "Premium (5K-15K)", img: "🏨" },
    { name: "Hotel Surya", type: "hotel", city: "varanasi", lat: 25.3060, lng: 83.0060, address: "The Mall Road, Varanasi", phone: "0542-2501234", rating: 3.9, reviews: 1400, budget: "Budget (<2K)", img: "🏨" },
    { name: "JW Marriott Pune", type: "hotel", city: "pune", lat: 18.5362, lng: 73.9140, address: "Senapati Bapat Road, Pune", phone: "020-66811234", rating: 4.5, reviews: 7500, budget: "Luxury (15K+)", img: "🏨" },
    { name: "Conrad Pune", type: "hotel", city: "pune", lat: 18.5310, lng: 73.8900, address: "Aundh-Ravet BRT Road, Pune", phone: "020-67001234", rating: 4.4, reviews: 5800, budget: "Luxury (15K+)", img: "🏨" },
    { name: "The Orchid Hotel Pune", type: "hotel", city: "pune", lat: 18.5530, lng: 73.9110, address: "Balewadi, Pune", phone: "020-40001234", rating: 4.2, reviews: 3900, budget: "Premium (5K-15K)", img: "🏨" },
    { name: "OYO Home Deccan", type: "hotel", city: "pune", lat: 18.5135, lng: 73.8398, address: "Deccan Gymkhana, Pune", phone: "020-45678901", rating: 3.7, reviews: 1500, budget: "Budget (<2K)", img: "🏨" },

    // ═══════ MORE RESTAURANTS ═══════
    { name: "Oh! Calcutta", type: "restaurant", city: "kolkata", lat: 22.5500, lng: 88.3550, address: "Forum Mall, Elgin Road, Kolkata", phone: "033-22801234", rating: 4.4, reviews: 6800, budget: "Moderate (2K-5K)", img: "🍽️" },
    { name: "6 Ballygunge Place", type: "restaurant", city: "kolkata", lat: 22.5250, lng: 88.3650, address: "6 Ballygunge Place, Kolkata", phone: "033-24601234", rating: 4.5, reviews: 8900, budget: "Premium (5K-15K)", img: "🍽️" },
    { name: "Kewpie's Kitchen", type: "restaurant", city: "kolkata", lat: 22.5300, lng: 88.3600, address: "10A Ramakrishna Temple Road, Kolkata", phone: "033-24561234", rating: 4.3, reviews: 5200, budget: "Moderate (2K-5K)", img: "🍽️" },
    { name: "Arsalan Restaurant", type: "restaurant", city: "kolkata", lat: 22.5540, lng: 88.3470, address: "Park Circus, Kolkata", phone: "033-22821234", rating: 4.4, reviews: 11000, budget: "Budget (<2K)", img: "🍽️" },
    { name: "Bhojohori Manna", type: "restaurant", city: "kolkata", lat: 22.5400, lng: 88.3520, address: "Dover Lane, Ballygunge, Kolkata", phone: "033-24701234", rating: 4.3, reviews: 7500, budget: "Moderate (2K-5K)", img: "🍽️" },
    { name: "Karim's Delhi", type: "restaurant", city: "delhi", lat: 28.6490, lng: 77.2330, address: "16 Gali Kababian, Jama Masjid, Delhi", phone: "011-23261234", rating: 4.4, reviews: 18000, budget: "Budget (<2K)", img: "🍽️" },
    { name: "Bukhara at ITC Maurya", type: "restaurant", city: "delhi", lat: 28.5993, lng: 77.1680, address: "Sardar Patel Marg, Chanakyapuri, Delhi", phone: "011-26111234", rating: 4.7, reviews: 12000, budget: "Luxury (15K+)", img: "🍽️" },
    { name: "Indian Accent", type: "restaurant", city: "delhi", lat: 28.5731, lng: 77.1685, address: "The Lodhi, New Delhi", phone: "011-69421234", rating: 4.8, reviews: 9500, budget: "Luxury (15K+)", img: "🍽️" },
    { name: "Saravana Bhavan CP", type: "restaurant", city: "delhi", lat: 28.6315, lng: 77.2167, address: "Connaught Place, New Delhi", phone: "011-45671234", rating: 4.3, reviews: 15000, budget: "Budget (<2K)", img: "🍽️" },
    { name: "Moti Mahal Deluxe", type: "restaurant", city: "delhi", lat: 28.6412, lng: 77.2210, address: "Daryaganj, Old Delhi", phone: "011-23281234", rating: 4.2, reviews: 10000, budget: "Moderate (2K-5K)", img: "🍽️" },
    { name: "Wasabi by Morimoto", type: "restaurant", city: "mumbai", lat: 18.9260, lng: 72.8290, address: "Taj Mahal Palace, Mumbai", phone: "022-66651234", rating: 4.6, reviews: 6500, budget: "Luxury (15K+)", img: "🍽️" },
    { name: "Trishna", type: "restaurant", city: "mumbai", lat: 18.9340, lng: 72.8370, address: "Fort, Mumbai", phone: "022-22701234", rating: 4.4, reviews: 8200, budget: "Premium (5K-15K)", img: "🍽️" },
    { name: "Britannia & Co", type: "restaurant", city: "mumbai", lat: 18.9280, lng: 72.8360, address: "Ballard Estate, Mumbai", phone: "022-22691234", rating: 4.5, reviews: 7800, budget: "Moderate (2K-5K)", img: "🍽️" },
    { name: "Prakash Restaurant", type: "restaurant", city: "mumbai", lat: 19.0760, lng: 72.8777, address: "Dadar, Mumbai", phone: "022-24101234", rating: 4.1, reviews: 5400, budget: "Budget (<2K)", img: "🍽️" },
    { name: "Mavalli Tiffin Room", type: "restaurant", city: "bangalore", lat: 12.9510, lng: 77.6070, address: "Lalbagh Road, Bangalore", phone: "080-26501234", rating: 4.4, reviews: 9500, budget: "Budget (<2K)", img: "🍽️" },
    { name: "Meghana Foods", type: "restaurant", city: "bangalore", lat: 12.9352, lng: 77.6245, address: "Koramangala, Bangalore", phone: "080-40001234", rating: 4.5, reviews: 12000, budget: "Budget (<2K)", img: "🍽️" },
    { name: "Karavalli at Vivanta", type: "restaurant", city: "bangalore", lat: 12.9765, lng: 77.5930, address: "Vivanta Taj, Bangalore", phone: "080-66601234", rating: 4.6, reviews: 6800, budget: "Luxury (15K+)", img: "🍽️" },
    { name: "Olive Beach", type: "restaurant", city: "bangalore", lat: 12.9784, lng: 77.6100, address: "Ashok Nagar, Bangalore", phone: "080-45671234", rating: 4.4, reviews: 5200, budget: "Premium (5K-15K)", img: "🍽️" },
    { name: "Dakshin at ITC Grand Chola", type: "restaurant", city: "chennai", lat: 13.0340, lng: 80.2210, address: "Mount Road, Chennai", phone: "044-22331234", rating: 4.5, reviews: 5800, budget: "Luxury (15K+)", img: "🍽️" },
    { name: "Murugan Idli Shop", type: "restaurant", city: "chennai", lat: 13.0560, lng: 80.2430, address: "T Nagar, Chennai", phone: "044-28301234", rating: 4.4, reviews: 8900, budget: "Budget (<2K)", img: "🍽️" },
    { name: "Peshawri at ITC Grand Chola", type: "restaurant", city: "chennai", lat: 13.0350, lng: 80.2220, address: "Mount Road, Chennai", phone: "044-22341234", rating: 4.5, reviews: 4500, budget: "Luxury (15K+)", img: "🍽️" },
    { name: "Anjappar", type: "restaurant", city: "chennai", lat: 13.0408, lng: 80.2337, address: "T Nagar, Chennai", phone: "044-24301234", rating: 4.3, reviews: 7200, budget: "Budget (<2K)", img: "🍽️" },
    { name: "1135 AD Jaipur", type: "restaurant", city: "jaipur", lat: 26.9180, lng: 75.8120, address: "Amber Fort Road, Jaipur", phone: "0141-26801234", rating: 4.6, reviews: 4500, budget: "Luxury (15K+)", img: "🍽️" },
    { name: "LMB Jaipur", type: "restaurant", city: "jaipur", lat: 26.9228, lng: 75.7873, address: "Johari Bazaar, Jaipur", phone: "0141-23701234", rating: 4.3, reviews: 9800, budget: "Moderate (2K-5K)", img: "🍽️" },
    { name: "Chokhi Dhani", type: "restaurant", city: "jaipur", lat: 26.8500, lng: 75.8000, address: "Tonk Road, Jaipur", phone: "0141-51901234", rating: 4.4, reviews: 11000, budget: "Moderate (2K-5K)", img: "🍽️" },
    { name: "Handi Restaurant", type: "restaurant", city: "jaipur", lat: 26.9200, lng: 75.7850, address: "MI Road, Jaipur", phone: "0141-23601234", rating: 4.2, reviews: 6500, budget: "Budget (<2K)", img: "🍽️" },
    { name: "Kashi Chaat Bhojanalaya", type: "restaurant", city: "varanasi", lat: 25.3109, lng: 83.0093, address: "Godowlia, Varanasi", phone: "0542-2345678", rating: 4.4, reviews: 5200, budget: "Budget (<2K)", img: "🍽️" },
    { name: "Blue Lassi Shop", type: "restaurant", city: "varanasi", lat: 25.3068, lng: 83.0060, address: "Manikarnika Ghat Road, Varanasi", phone: "0542-2399555", rating: 4.5, reviews: 3800, budget: "Budget (<2K)", img: "🍽️" },
    { name: "Baati Chokha", type: "restaurant", city: "varanasi", lat: 25.2980, lng: 83.0050, address: "Narmada Bahwan, Godowlia, Varanasi", phone: "0542-2393333", rating: 4.3, reviews: 2900, budget: "Budget (<2K)", img: "🍽️" },
    { name: "Mandi House Cafe", type: "restaurant", city: "varanasi", lat: 25.3040, lng: 83.0070, address: "Dashashwamedh Ghat, Varanasi", phone: "0542-2341234", rating: 4.1, reviews: 2200, budget: "Moderate (2K-5K)", img: "🍽️" },
    { name: "Malaka Spice", type: "restaurant", city: "pune", lat: 18.5310, lng: 73.8900, address: "Koregaon Park, Pune", phone: "020-67201234", rating: 4.5, reviews: 8200, budget: "Premium (5K-15K)", img: "🍽️" },
    { name: "Shabree Restaurant", type: "restaurant", city: "pune", lat: 18.5135, lng: 73.8398, address: "FC Road, Pune", phone: "020-25561234", rating: 4.3, reviews: 6500, budget: "Moderate (2K-5K)", img: "🍽️" },
    { name: "Vohuman Cafe", type: "restaurant", city: "pune", lat: 18.5195, lng: 73.8553, address: "FC Road, Pune", phone: "020-25671234", rating: 4.2, reviews: 7800, budget: "Budget (<2K)", img: "🍽️" },
    { name: "German Bakery", type: "restaurant", city: "pune", lat: 18.5310, lng: 73.8890, address: "Koregaon Park, Pune", phone: "020-67201234", rating: 4.4, reviews: 9500, budget: "Moderate (2K-5K)", img: "🍽️" },

    // ═══════ MORE PETROL PUMPS ═══════
    { name: "HP Petrol Pump - Salt Lake", type: "petrol", city: "kolkata", lat: 22.5726, lng: 88.4106, address: "Salt Lake Sector V, Kolkata", phone: "033-23451234", rating: 4.0, reviews: 1200, budget: "Moderate", img: "⛽" },
    { name: "IOCL Petrol Pump - Howrah", type: "petrol", city: "kolkata", lat: 22.5800, lng: 88.3200, address: "Howrah Bridge, Kolkata", phone: "033-22401234", rating: 3.9, reviews: 900, budget: "Moderate", img: "⛽" },
    { name: "BP Petrol Pump - Park Street", type: "petrol", city: "kolkata", lat: 22.5544, lng: 88.3505, address: "Park Street, Kolkata", phone: "033-22901234", rating: 4.1, reviews: 800, budget: "Moderate", img: "⛽" },
    { name: "IOCL Petrol Pump - Nehru Place", type: "petrol", city: "delhi", lat: 28.5491, lng: 77.2530, address: "Nehru Place, New Delhi", phone: "011-26201234", rating: 4.0, reviews: 1100, budget: "Moderate", img: "⛽" },
    { name: "HP Petrol Pump - Karol Bagh", type: "petrol", city: "delhi", lat: 28.6519, lng: 77.1898, address: "Karol Bagh, New Delhi", phone: "011-25801234", rating: 3.9, reviews: 950, budget: "Moderate", img: "⛽" },
    { name: "BP Petrol Pump - Connaught Place", type: "petrol", city: "delhi", lat: 28.6315, lng: 77.2167, address: "Connaught Place, New Delhi", phone: "011-23401234", rating: 4.0, reviews: 800, budget: "Moderate", img: "⛽" },
    { name: "IOCL Petrol Pump - Andheri", type: "petrol", city: "mumbai", lat: 19.1334, lng: 72.8298, address: "Andheri West, Mumbai", phone: "022-26701234", rating: 4.1, reviews: 1300, budget: "Moderate", img: "⛽" },
    { name: "HP Petrol Pump - Bandra", type: "petrol", city: "mumbai", lat: 19.0596, lng: 72.8295, address: "Bandra West, Mumbai", phone: "022-26401234", rating: 4.0, reviews: 1000, budget: "Moderate", img: "⛽" },
    { name: "IOCL Petrol Pump - Whitefield", type: "petrol", city: "bangalore", lat: 12.9698, lng: 77.7500, address: "Whitefield, Bangalore", phone: "080-28401234", rating: 4.0, reviews: 850, budget: "Moderate", img: "⛽" },
    { name: "HP Petrol Pump - Jayanagar", type: "petrol", city: "bangalore", lat: 12.9260, lng: 77.5830, address: "Jayanagar, Bangalore", phone: "080-26601234", rating: 3.9, reviews: 750, budget: "Moderate", img: "⛽" },
    { name: "IOCL Petrol Pump - Anna Nagar", type: "petrol", city: "chennai", lat: 13.0850, lng: 80.2100, address: "Anna Nagar, Chennai", phone: "044-26201234", rating: 4.0, reviews: 900, budget: "Moderate", img: "⛽" },
    { name: "HP Petrol Pump - Velachery", type: "petrol", city: "chennai", lat: 12.9815, lng: 80.2180, address: "Velachery, Chennai", phone: "044-22401234", rating: 3.9, reviews: 700, budget: "Moderate", img: "⛽" },
    { name: "IOCL Petrol Pump - Malviya Nagar", type: "petrol", city: "jaipur", lat: 26.8550, lng: 75.7900, address: "Malviya Nagar, Jaipur", phone: "0141-27901234", rating: 4.0, reviews: 650, budget: "Moderate", img: "⛽" },
    { name: "IOCL Petrol Pump - Bhelupur", type: "petrol", city: "varanasi", lat: 25.3200, lng: 83.0050, address: "Bhelupur, Varanasi", phone: "0542-23401234", rating: 3.9, reviews: 500, budget: "Moderate", img: "⛽" },
    { name: "HP Petrol Pump - Kothrud", type: "petrol", city: "pune", lat: 18.5074, lng: 73.8077, address: "Kothrud, Pune", phone: "020-25401234", rating: 4.0, reviews: 600, budget: "Moderate", img: "⛽" },

    // ═══════ MORE CAFES ═══════
    { name: "Flurys Park Street", type: "cafe", city: "kolkata", lat: 22.5530, lng: 88.3510, address: "Park Street, Kolkata", phone: "033-22291234", rating: 4.4, reviews: 10000, budget: "Moderate", img: "☕" },
    { name: "Cafe Coffee Day Sector V", type: "cafe", city: "kolkata", lat: 22.5726, lng: 88.4106, address: "Sector V, Salt Lake, Kolkata", phone: "033-40001234", rating: 4.0, reviews: 3500, budget: "Budget", img: "☕" },
    { name: "Cha Bar CP", type: "cafe", city: "delhi", lat: 28.6329, lng: 77.2195, address: "Connaught Place, New Delhi", phone: "011-45671234", rating: 4.3, reviews: 6200, budget: "Moderate", img: "☕" },
    { name: "Cafe Ivy Khan Market", type: "cafe", city: "delhi", lat: 28.6000, lng: 77.2270, address: "Khan Market, New Delhi", phone: "011-26901234", rating: 4.4, reviews: 4800, budget: "Moderate", img: "☕" },
    { name: "Bombay Coffee House", type: "cafe", city: "mumbai", lat: 19.0760, lng: 72.8777, address: "Dadar, Mumbai", phone: "022-24101234", rating: 4.3, reviews: 5500, budget: "Moderate", img: "☕" },
    { name: "Cafe Mondegar", type: "cafe", city: "mumbai", lat: 18.9340, lng: 72.8370, address: "Colaba, Mumbai", phone: "022-22051234", rating: 4.2, reviews: 7200, budget: "Budget", img: "☕" },
    { name: "Starbucks Koramangala", type: "cafe", city: "bangalore", lat: 12.9352, lng: 77.6245, address: "Koramangala, Bangalore", phone: "080-40001234", rating: 4.3, reviews: 5800, budget: "Premium", img: "☕" },
    { name: "Cafe Noir Lavelle Road", type: "cafe", city: "bangalore", lat: 12.9765, lng: 77.5930, address: "Lavelle Road, Bangalore", phone: "080-45671234", rating: 4.4, reviews: 4200, budget: "Moderate", img: "☕" },
    { name: "Writer's Cafe Chennai", type: "cafe", city: "chennai", lat: 13.0560, lng: 80.2430, address: "Nungambakkam, Chennai", phone: "044-28301234", rating: 4.2, reviews: 3800, budget: "Budget", img: "☕" },
    { name: "Cafe Bael Jaipur", type: "cafe", city: "jaipur", lat: 26.9228, lng: 75.7900, address: "C-Scheme, Jaipur", phone: "0141-4001234", rating: 4.3, reviews: 4500, budget: "Budget", img: "☕" },
    { name: "Pind Balluchi Varanasi", type: "cafe", city: "varanasi", lat: 25.3100, lng: 83.0080, address: "Godowlia, Varanasi", phone: "0542-2345678", rating: 4.1, reviews: 2800, budget: "Budget", img: "☕" },
    { name: "Cafe Goodluck FC Road", type: "cafe", city: "pune", lat: 18.5195, lng: 73.8553, address: "FC Road, Pune", phone: "020-25671234", rating: 4.5, reviews: 11000, budget: "Budget", img: "☕" },
"""

js = js[:insert_pos] + new_pois + js[insert_pos:]

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(js)

total = js.count('type: "')
print(f"Total POIs in samplePlaces: {total}")
