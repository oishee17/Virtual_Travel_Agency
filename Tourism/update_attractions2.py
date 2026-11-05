import re

with open('app.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Build all new attractions as properly escaped JS
# Using double quotes for all string values to avoid apostrophe issues
NEW_ENTRIES = []
def add(name, cat, desc, icon):
    NEW_ENTRIES.append(f'        {{ name: "{name}", cat: "{cat}", desc: "{desc}", icon: "{icon}" }}')

# GOA
add("Basilica of Bom Jesus", "heritage", "UNESCO World Heritage. Baroque architecture, St. Francis Xavier.", "⛪")
add("Calangute Beach", "beach", "Queen of beaches. Water sports, shacks, nightlife.", "🏖️")
add("Fort Aguada", "heritage", "17th-century Portuguese fort with lighthouse.", "🏰")
add("Dudhsagar Falls", "nature", "603m four-tiered waterfall. One of India tallest.", "🌊")
add("Anjuna Flea Market", "shopping", "Wednesday flea market. Hippie culture, trinkets.", "🛍️")
add("Chapora Fort", "heritage", "Dil Chahta Hai fort. Panoramic Vagator views.", "🏰")
add("Spice Plantations", "nature", "Sahakari farm tour. Pepper, cardamom, vanilla.", "🌿")
add("Fontainhas", "culture", "Latin Quarter. Colorful Portuguese houses.", "🎨")

# AGRA
add("Taj Mahal", "monument", "UNESCO Wonder of the World. White marble masterpiece.", "🕌")
add("Agra Fort", "heritage", "UNESCO site. Massive red sandstone Mughal fortress.", "🏰")
add("Fatehpur Sikri", "heritage", "Abandoned Mughal city. Buland Darwaza, Panch Mahal.", "🏛️")
add("Mehtab Bagh", "nature", "Moonlight Garden. Perfect Taj Mahal sunset view.", "🌅")
add("Itimad-ud-Daulah", "monument", "Baby Taj. Precursor to Taj Mahal with inlay work.", "🕌")
add("Kinari Bazaar", "shopping", "Busy market near Jama Masjid. Marble inlay souvenirs.", "🛍️")
add("Akbars Tomb", "heritage", "Sikandra. Grand Mughal garden tomb.", "🏛️")
add("Chini Ka Rauza", "heritage", "Persian-style tomb. Exquisite glazed tile work.", "🏛️")

# UDAIPUR
add("Lake Pichola", "scenic", "Iconic lake. Boat ride to Jag Mandir and Lake Palace.", "⛵")
add("City Palace", "heritage", "Largest palace complex in Rajasthan.", "🏰")
add("Jag Mandir", "heritage", "Island palace. Inspiration for Taj Mahal.", "🏛️")
add("Saheliyon Ki Bari", "nature", "Garden of Maidens. Lotus pools, marble elephants.", "🌿")
add("Monsoon Palace", "heritage", "Hilltop palace. Panoramic sunset views.", "🏰")
add("Jagdish Temple", "spiritual", "Indo-Aryan temple. Intricate carvings, daily aarti.", "🛕")
add("Fateh Sagar Lake", "scenic", "Scenic lake with Nehru Island. Boating.", "🌊")
add("Shilpgram", "culture", "Arts and crafts village. Rajasthani folk performances.", "🎭")

# SHIMLA
add("The Ridge", "landmark", "Open space in heart of Shimla. Mountain views.", "🏔️")
add("Mall Road", "shopping", "Colonial-era shopping street. Cafes, shops.", "🛍️")
add("Jakhoo Temple", "spiritual", "Hanuman temple on highest point. 33m statue.", "🛕")
add("Christ Church", "heritage", "Second oldest church in North India.", "⛪")
add("Kufri", "nature", "Hill station 16km away. Snow activities.", "⛷️")
add("Toy Train", "experience", "UNESCO Kalka-Shimla railway. Scenic journey.", "🚂")
add("Chadwick Falls", "nature", "Waterfall in dense forests. Best in monsoon.", "🌊")
add("Naldehra", "nature", "Golf course with mountain backdrop.", "⛳")

# MANALI
add("Solang Valley", "nature", "Adventure hub. Paragliding, zorbing, skiing.", "🏔️")
add("Rohtang Pass", "nature", "Snow-capped pass at 3,978m. Stunning views.", "🗻")
add("Hadimba Temple", "spiritual", "Ancient cave temple in cedar forest.", "🛕")
add("Old Manali", "culture", "Bohemian village. Cafes, live music, backpacker vibes.", "🎵")
add("Jogini Waterfall", "nature", "Trek through apple orchards to waterfall.", "🌊")
add("Vashisht Hot Springs", "nature", "Natural hot sulphur springs. Temple nearby.", "♨️")
add("Manu Temple", "spiritual", "Ancient temple dedicated to sage Manu.", "🛕")
add("Mall Road Manali", "shopping", "Main street. Shops, cafes, Tibetan market.", "🛍️")

# SRINAGAR
add("Dal Lake", "scenic", "Jewel of Srinagar. Shikara rides, floating gardens.", "⛵")
add("Mughal Gardens", "nature", "Nishat Bagh, Shalimar Bagh. Terraced gardens.", "🌿")
add("Shankaracharya Temple", "spiritual", "Ancient hilltop temple. Panoramic lake views.", "🛕")
add("Pari Mahal", "heritage", "Palace of Fairies. Mughal-era terraced garden.", "🏰")
add("Nigeen Lake", "scenic", "Tranquil lake. Quieter alternative to Dal Lake.", "🌊")
add("Jamia Masjid", "spiritual", "Grand mosque. Beautiful Indo-Saracenic architecture.", "🕌")
add("Floating Market", "experience", "Morning vegetable market on boats.", "🛶")
add("Pahalgam", "nature", "Valley of Shepherds. Meadow trek, river rafting.", "🏔️")

# AMRITSAR
add("Golden Temple", "spiritual", "Holiest Sikh shrine. Gold-plated, sacred pool.", "🛕")
add("Jallianwala Bagh", "heritage", "Memorial of 1919 massacre. Narrow passage.", "🏛️")
add("Wagah Border", "experience", "India-Pakistan border ceremony. Flag lowering.", "🇮🇳")
add("Partition Museum", "museum", "First museum on Partition. Powerful exhibits.", "🏛️")
add("Hall Bazaar", "shopping", "Historic bazaar. Punjabi juttis, fabrics.", "🛍️")
add("Ram Tirath", "spiritual", "Birthplace of Luv and Kush. Ancient temple.", "🛕")
add("Gobindgarh Fort", "heritage", "18th century fort. Light shows, museums.", "🏰")
add("Khalsa College", "heritage", "Gothic-Sikh architecture. Beautiful building.", "🏛️")

# RISHIKESH
add("Laxman Jhula", "landmark", "Iconic suspension bridge over Ganges.", "🌉")
add("Ram Jhula", "landmark", "Suspension bridge connecting ashrams.", "🌉")
add("Beatles Ashram", "heritage", "Where Beatles meditated in 1968. Street art.", "🎵")
add("Triveni Ghat", "spiritual", "Sacred confluence. Evening Ganga Aarti.", "🔥")
add("Neer Garh Waterfall", "nature", "Two-tiered waterfall. Short trek.", "🌊")
add("River Rafting", "experience", "White water rafting on Ganges.", "🚣")
add("Kunjapuri Temple", "spiritual", "Hilltop temple. Sunrise views of Himalayas.", "🌅")
add("Neelkanth Mahadev", "spiritual", "Shiva temple in forest. Pilgrimage trek.", "🛕")

# HAMPI
add("Virupaksha Temple", "spiritual", "Living temple. UNESCO site, 50m tower.", "🛕")
add("Vijaya Vittala Temple", "heritage", "Musical pillars, stone chariot.", "🏛️")
add("Hampi Bazaar", "heritage", "Ancient market street. Ruins, boulders.", "🛍️")
add("Matanga Hill", "nature", "Best sunset point. Climb among boulders.", "🌅")
add("Royal Enclosure", "heritage", "Ruins of palaces, baths, elephant stables.", "🏰")
add("Elephant Stables", "heritage", "Indo-Islamic domed halls. Royal elephants.", "🐘")
add("Hemakuta Hill", "nature", "Sunrise spot. Jain temples, boulder landscape.", "🌄")
add("Tungabhadra Dam", "nature", "Massive dam. Boating, gardens.", "🌊")

# LEH
add("Pangong Lake", "scenic", "134km long lake. Color-changing waters at 4,350m.", "🌊")
add("Leh Palace", "heritage", "17th century palace. Tibetan architecture.", "🏰")
add("Nubra Valley", "nature", "Valley of flowers. Double-humped camels.", "🏔️")
add("Thiksey Monastery", "spiritual", "12-story gompa. Mini Potala.", "🛕")
add("Khardung La", "nature", "Highest motorable pass at 5,359m.", "🗻")
add("Magnetic Hill", "experience", "Gravity-defying hill. Optical illusion.", "🧲")
add("Shanti Stupa", "spiritual", "White-domed stupa. 360-degree valley views.", "🌅")
add("Hemis Monastery", "spiritual", "Largest monastery. Famous Hemis festival.", "🛕")

# DARJEELING
add("Tiger Hill", "nature", "Sunrise over Kanchenjunga. Best panorama.", "🌅")
add("Batasia Loop", "experience", "Spiral railway loop. War memorial.", "🚂")
add("Darjeeling Himalayan Railway", "experience", "UNESCO Toy Train. Steam engines.", "🚂")
add("Peace Pagoda", "spiritual", "Japanese Buddhist stupa. Four avatars.", "🛕")
add("Tea Gardens", "nature", "Makaibari, Happy Valley. Tea plucking tours.", "🍵")
add("Padmaja Naidu Zoo", "nature", "Snow leopards, red pandas.", "🐼")
add("Rock Garden", "nature", "Mini Zoo park. Waterfalls, trekking.", "🌿")
add("Observatory Hill", "scenic", "Panoramic views. Mahakal Temple.", "🏔️")

# MYSORE
add("Mysore Palace", "heritage", "Indo-Saracenic palace. 98,000 lights Sundays.", "🏰")
add("Chamundi Hills", "spiritual", "Chamundeshwari Temple. City views.", "🛕")
add("Brindavan Gardens", "nature", "Terraced gardens. Musical fountain.", "🌿")
add("St. Philomena Church", "heritage", "Neo-Gothic church. One of tallest.", "⛪")
add("Devaraja Market", "shopping", "Century-old market. Mysore silk, spices.", "🛍️")
add("Karanji Lake", "nature", "Butterfly park, bird sanctuary.", "🦋")
add("Jaganmohan Palace", "museum", "Art gallery. Raja Ravi Varma paintings.", "🎨")
add("Rail Museum", "museum", "Heritage locomotives. Royal carriages.", "🚂")

# HYDERABAD
add("Charminar", "monument", "Iconic 1591 monument. Four minarets.", "🕌")
add("Golconda Fort", "heritage", "Massive fortress. Acoustic engineering.", "🏰")
add("Hussain Sagar Lake", "scenic", "Heart-shaped lake. Buddha statue.", "🌊")
add("Salar Jung Museum", "museum", "Largest one-man collection. Veiled Rebecca.", "🏛️")
add("Birla Mandir", "spiritual", "White marble temple. City views.", "🛕")
add("Ramoji Film City", "entertainment", "Largest film studio complex. Theme parks.", "🎬")
add("Chowmahalla Palace", "heritage", "Nizam palace. Vintage cars, chandeliers.", "🏰")
add("Laad Bazaar", "shopping", "Bangle market near Charminar.", "🛍️")

# OOTY
add("Botanical Garden", "nature", "1848 garden. 650+ plant species.", "🌿")
add("Ooty Lake", "scenic", "Boating on artificial lake.", "⛵")
add("Nilgiri Mountain Railway", "experience", "UNESCO Toy Train. 16 tunnels.", "🚂")
add("Doddabetta Peak", "nature", "Highest point. Telescope house.", "🏔️")
add("Tea Museum", "museum", "Tea processing history. Tasting.", "🍵")
add("Rose Garden", "nature", "17,000 rose varieties. Annual flower show.", "🌹")
add("Pykara Lake", "nature", "Scenic lake. Boating, waterfalls.", "🌊")
add("Lambs Rock", "scenic", "Viewpoint. Coimbatore plains, tea estates.", "🌅")

# KOLKATA
add("Victoria Memorial", "monument", "White marble. Museum with 28,394 artifacts.", "🏛️")
add("Howrah Bridge", "landmark", "World longest cantilever bridge.", "🌉")
add("BITM", "museum", "India first science museum.", "🔬")
add("Alipore Zoo", "nature", "Oldest zoo. Royal Bengal Tigers.", "🐯")
add("Eden Gardens", "landmark", "India largest cricket stadium.", "🏏")
add("Birla Planetarium", "museum", "Largest in Asia. Sky shows daily.", "🌌")
add("Jorasanko Thakur Bari", "heritage", "Tagore family home. Rabindranath birthplace.", "🏛️")
add("Dakshineswar Temple", "spiritual", "Kali temple. Where Ramakrishna meditated.", "🛕")

# DELHI
add("Red Fort", "monument", "UNESCO site. Mughal fortress, light show.", "🏰")
add("Qutub Minar", "monument", "73m victory tower from 1193. UNESCO.", "🗼")
add("India Gate", "landmark", "War memorial. Beautiful lawns, evening lights.", "🏛️")
add("Humayuns Tomb", "heritage", "Inspiration for Taj Mahal. UNESCO.", "🏛️")
add("Lotus Temple", "spiritual", "Lotus-shaped Bahai House of Peace.", "🪷")
add("Chandni Chowk", "market", "Oldest market. Parathewali Gali.", "🛒")
add("Akshardham", "spiritual", "Modern Hindu temple. Boat ride.", "🛕")
add("Jama Masjid", "spiritual", "India largest mosque. Old Delhi views.", "🕌")

# MUMBAI
add("Gateway of India", "monument", "Iconic arch. Ferry to Elephanta.", "🏛️")
add("Marine Drive", "landmark", "3.6km promenade. Queens Necklace.", "🌊")
add("Elephanta Caves", "heritage", "UNESCO rock-cut caves. 7th century.", "🏛️")
add("CST Station", "heritage", "UNESCO Gothic Victorian railway.", "🚂")
add("Juhu Beach", "beach", "Famous beach. Street food paradise.", "🏖️")
add("Haji Ali Dargah", "spiritual", "Mosque on sea islet.", "🕌")
add("Siddhivinayak Temple", "spiritual", "Most popular Ganesh temple.", "🛕")
add("Colaba Causeway", "shopping", "Bustling street market.", "🛍️")

# BANGALORE
add("Lalbagh Botanical Garden", "nature", "240 acres. Glass house, 1000+ species.", "🌿")
add("Bangalore Palace", "heritage", "Tudor-style palace. Wood carvings.", "🏰")
add("Cubbon Park", "nature", "300 acres. Colonial-era green lung.", "🌳")
add("ISKCON Temple", "spiritual", "Largest ISKCON temple. Gothic architecture.", "🛕")
add("Tipu Sultans Palace", "heritage", "Summer residence. Teak pillars.", "🏰")
add("Nandi Hills", "nature", "Hill fortress. Sunrise point.", "🏔️")
add("Vidhana Soudha", "landmark", "Legislative seat. Neo-Dravidian.", "🏛️")
add("UB City", "shopping", "Luxury mall. Fine dining.", "🛍️")

# CHENNAI
add("Marina Beach", "beach", "World second longest urban beach.", "🏖️")
add("Kapaleeshwarar Temple", "spiritual", "Dravidian architecture. Colorful gopuram.", "🛕")
add("Fort St. George", "heritage", "First British fortress in India.", "🏰")
add("Santhome Cathedral", "heritage", "Built over tomb of Apostle St. Thomas.", "⛪")
add("Government Museum", "museum", "Second oldest museum. Bronze gallery.", "🏛️")
add("Mylapore", "culture", "Traditional neighborhood. Temples.", "🎭")
add("Elliot Beach", "beach", "Bessy Beach. Serene, less crowded.", "🏖️")
add("DakshinaChitra", "culture", "Heritage village. South Indian crafts.", "🎨")

# PUNE
add("Shaniwar Wada", "heritage", "Peshwa palace fortress. Light show.", "🏰")
add("Aga Khan Palace", "heritage", "Gandhi imprisonment site. Beautiful gardens.", "🏛️")
add("Sinhagad Fort", "heritage", "Hill fortress. Trek, history, food.", "🏰")
add("Dagdusheth Halwai Ganpati", "spiritual", "Most famous Ganesh temple in Pune.", "🛕")
add("Raja Dinkar Kelkar Museum", "museum", "Indian decorative arts. Mastani Mahal.", "🎨")
add("Osho Ashram", "spiritual", "International meditation resort.", "🧘")
add("Pashan Lake", "nature", "Scenic lake. Bird watching.", "🐦")
add("Lavasa", "nature", "Planned hill city. Waterfront.", "🏔️")

# JAIPUR
add("Amber Fort", "heritage", "Hilltop palace. Sheesh Mahal, elephant ride.", "🏰")
add("Hawa Mahal", "monument", "Palace of Winds. 953 honeycomb windows.", "🏛️")
add("City Palace Jaipur", "heritage", "Royal residence. Museums, courtyards.", "🏰")
add("Jantar Mantar", "heritage", "UNESCO astronomical instruments.", "🔭")
add("Nahargarh Fort", "heritage", "Sunset point. Panoramic Jaipur views.", "🏰")
add("Jal Mahal", "scenic", "Water Palace. Floating in Man Sagar Lake.", "🏛️")
add("Birla Mandir Jaipur", "spiritual", "White marble temple. Hilltop.", "🛕")
add("Albert Hall Museum", "museum", "Oldest museum. Egyptian mummy.", "🏛️")

new_block = "    goa: [\n" + ",\n".join(NEW_ENTRIES[:8]) + "\n    ],\n"
new_block += "    agra: [\n" + ",\n".join(NEW_ENTRIES[8:16]) + "\n    ],\n"
new_block += "    udaipur: [\n" + ",\n".join(NEW_ENTRIES[16:24]) + "\n    ],\n"
new_block += "    shimla: [\n" + ",\n".join(NEW_ENTRIES[24:32]) + "\n    ],\n"
new_block += "    manali: [\n" + ",\n".join(NEW_ENTRIES[32:40]) + "\n    ],\n"
new_block += "    srinagar: [\n" + ",\n".join(NEW_ENTRIES[40:48]) + "\n    ],\n"
new_block += "    amritsar: [\n" + ",\n".join(NEW_ENTRIES[48:56]) + "\n    ],\n"
new_block += "    rishikesh: [\n" + ",\n".join(NEW_ENTRIES[56:64]) + "\n    ],\n"
new_block += "    hampi: [\n" + ",\n".join(NEW_ENTRIES[64:72]) + "\n    ],\n"
new_block += "    leh: [\n" + ",\n".join(NEW_ENTRIES[72:80]) + "\n    ],\n"
new_block += "    darjeeling: [\n" + ",\n".join(NEW_ENTRIES[80:88]) + "\n    ],\n"
new_block += "    mysore: [\n" + ",\n".join(NEW_ENTRIES[88:96]) + "\n    ],\n"
new_block += "    hyderabad: [\n" + ",\n".join(NEW_ENTRIES[96:104]) + "\n    ],\n"
new_block += "    ooty: [\n" + ",\n".join(NEW_ENTRIES[104:112]) + "\n    ],\n"
new_block += "    kolkata: [\n" + ",\n".join(NEW_ENTRIES[112:120]) + "\n    ],\n"
new_block += "    delhi: [\n" + ",\n".join(NEW_ENTRIES[120:128]) + "\n    ],\n"
new_block += "    mumbai: [\n" + ",\n".join(NEW_ENTRIES[128:136]) + "\n    ],\n"
new_block += "    bangalore: [\n" + ",\n".join(NEW_ENTRIES[136:144]) + "\n    ],\n"
new_block += "    chennai: [\n" + ",\n".join(NEW_ENTRIES[144:152]) + "\n    ],\n"
new_block += "    pune: [\n" + ",\n".join(NEW_ENTRIES[152:160]) + "\n    ],\n"
new_block += "    jaipur: [\n" + ",\n".join(NEW_ENTRIES[160:168]) + "\n    ],\n"

# Insert before the closing };
js = js.replace("    ]\n};\n\nfunction generateAttractions", "    ],\n" + new_block + "};\n\nfunction generateAttractions", 1)

# Now replace the generateAttractions function
OLD_FUNC = '''function generateAttractions(destination) {
    const container = document.getElementById('attractions-list');
    if (!container) return;
    const dest = (destination || '').toLowerCase();
    let cityKey = '';
    for (const k of Object.keys(CITY_ATTRACTIONS)) {
        if (dest.includes(k)) { cityKey = k; break; }
    }
    if (!cityKey) {
        container.innerHTML = '<p style="color:var(--text-muted);font-size:0.9rem;text-align:center;padding:20px;">Attractions data available for: Delhi, Mumbai, Bangalore, Chennai, Kolkata, Pune, Jaipur, Varanasi</p>';
        return;
    }
    const attractions = CITY_ATTRACTIONS[cityKey];'''

NEW_FUNC = '''function generateAttractions(destination) {
    const container = document.getElementById('attractions-list');
    if (!container) return;
    const dest = (destination || '').toLowerCase();
    
    const destAliases = {
        "kashmir": "srinagar", "ladakh": "leh", "himachal": "shimla",
        "uttarakhand": "rishikesh", "kerala": "alleppey", "rajasthan": "jaipur",
        "northeast": "gangtok", "jammu": "srinagar", "madhya pradesh": "khajuraho",
        "karnataka": "bangalore", "tamil nadu": "chennai", "andhra pradesh": "hyderabad",
        "west bengal": "kolkata", "maharashtra": "mumbai", "gujarat": "ahmedabad",
        "odisha": "puri", "assam": "kaziranga", "himachal pradesh": "shimla",
        "jammu and kashmir": "srinagar",
    };
    
    let cityKey = "";
    for (const k of Object.keys(CITY_ATTRACTIONS)) {
        if (dest.includes(k)) { cityKey = k; break; }
    }
    if (!cityKey) {
        for (const [alias, key] of Object.entries(destAliases)) {
            if (dest.includes(alias)) { cityKey = key; break; }
        }
    }
    
    let attractions = [];
    if (cityKey && CITY_ATTRACTIONS[cityKey]) {
        attractions = CITY_ATTRACTIONS[cityKey];
    } else if (typeof CHATBOT_DB !== "undefined") {
        for (const [key, cityData] of Object.entries(CHATBOT_DB)) {
            if (dest.includes(key) || key.includes(dest)) {
                const typeIcons = { monument: "🏛️", landmark: "🗼", spiritual: "🛕", nature: "🌿", heritage: "🏰", market: "🛍️", beach: "🏖️", museum: "🎨", culture: "🎭", scenic: "🏔️", experience: "⭐", entertainment: "🎪" };
                const typeCats = { monument: "monument", landmark: "landmark", spiritual: "spiritual", nature: "nature", heritage: "heritage", market: "shopping", beach: "beach", museum: "museum", culture: "culture", scenic: "scenic", experience: "experience", entertainment: "entertainment" };
                attractions = cityData.places.map(p => ({
                    name: p.name,
                    cat: typeCats[p.type] || "heritage",
                    desc: p.desc + (p.budget ? " (Entry: " + p.budget + ")" : "") + (p.tip ? " Tip: " + p.tip : ""),
                    icon: typeIcons[p.type] || "📍"
                }));
                cityKey = key;
                break;
            }
        }
    }
    
    if (attractions.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:30px;color:var(--text-muted);"><i class="fas fa-search-location" style="font-size:2rem;margin-bottom:10px;display:block;color:var(--primary);"></i><p style="font-size:1.05rem;margin-bottom:5px;">No attractions found for "' + (destination || "your destination") + '"</p><p style="font-size:0.85rem;">Try: Delhi, Mumbai, Kolkata, Jaipur, Goa, Varanasi, Shimla, Manali, Srinagar, Leh, or 54+ supported cities.</p></div>';
        return;
    }'''

js = js.replace(OLD_FUNC, NEW_FUNC, 1)

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(js)

print(f"Updated app.js: {len(js)} bytes")
