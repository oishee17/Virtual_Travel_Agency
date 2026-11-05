import re

with open('app.js', 'r', encoding='utf-8') as f:
    js = f.read()

# 1. Add more curated cities to CITY_ATTRACTIONS (before the closing };)
NEW_ATTRACTIONS = """    goa: [
        { name: 'Basilica of Bom Jesus', cat: 'heritage', desc: 'UNESCO World Heritage. Baroque architecture, St. Francis Xavier remains.', icon: '⛪' },
        { name: 'Calangute Beach', cat: 'beach', desc: 'Queen of beaches. Water sports, shacks, nightlife.', icon: '🏖️' },
        { name: 'Fort Aguada', cat: 'heritage', desc: '17th-century Portuguese fort with lighthouse. Sunset views.', icon: '🏰' },
        { name: 'Dudhsagar Falls', cat: 'nature', desc: '603m four-tiered waterfall. One of India\'s tallest.', icon: '🌊' },
        { name: 'Anjuna Flea Market', cat: 'shopping', desc: 'Wednesday flea market. Hippie culture, trinkets, clothes.', icon: '🛍️' },
        { name: 'Chapora Fort', cat: 'heritage', desc: 'Dil Chahta Hai fort. Panoramic views of Vagator beach.', icon: '🏰' },
        { name: 'Spice Plantations', cat: 'nature', desc: 'Sahakari spice farm tour. Pepper, cardamom, vanilla.', icon: '🌿' },
        { name: 'Fontainhas', cat: 'culture', desc: 'Latin Quarter. Colorful Portuguese houses, art galleries.', icon: '🎨' },
    ],
    agra: [
        { name: 'Taj Mahal', cat: 'monument', desc: 'UNESCO Wonder of the World. White marble masterpiece by Shah Jahan.', icon: '🕌' },
        { name: 'Agra Fort', cat: 'heritage', desc: 'UNESCO site. Massive red sandstone Mughal fortress.', icon: '🏰' },
        { name: 'Fatehpur Sikri', cat: 'heritage', desc: 'Abandoned Mughal city. Buland Darwaza, Panch Mahal.', icon: '🏛️' },
        { name: 'Mehtab Bagh', cat: 'nature', desc: 'Moonlight Garden. Perfect Taj Mahal sunset view.', icon: '🌅' },
        { name: 'Itimad-ud-Daulah', cat: 'monument', desc: 'Baby Taj. Precursor to Taj Mahal with inlay work.', icon: '🕌' },
        { name: 'Kinari Bazaar', cat: 'shopping', desc: 'Busy market near Jama Masjid. Marble inlay souvenirs.', icon: '🛍️' },
        { name: 'Akbar\'s Tomb', cat: 'heritage', desc: 'Sikandra. Grand Mughal garden tomb.', icon: '🏛️' },
        { name: 'Chini Ka Rauza', cat: 'heritage', desc: 'Persian-style tomb. Exquisite glazed tile work.', icon: '🏛️' },
    ],
    udaipur: [
        { name: 'Lake Pichola', cat: 'scenic', desc: 'Iconic lake. Boat ride to Jag Mandir and Lake Palace.', icon: '⛵' },
        { name: 'City Palace', cat: 'heritage', desc: 'Largest palace complex in Rajasthan. Overlooking Lake Pichola.', icon: '🏰' },
        { name: 'Jag Mandir', cat: 'heritage', desc: 'Island palace. inspiration for Taj Mahal.', icon: '🏛️' },
        { name: 'Saheliyon Ki Bari', cat: 'nature', desc: 'Garden of Maidens. Lotus pools, marble elephants.', icon: '🌿' },
        { name: 'Monsoon Palace', cat: 'heritage', desc: 'Hilltop palace. Panoramic sunset views of Udaipur.', icon: '🏰' },
        { name: 'Jagdish Temple', cat: 'spiritual', desc: 'Indo-Aryan temple. Intricate carvings, daily aarti.', icon: '🛕' },
        { name: 'Fateh Sagar Lake', cat: 'scenic', desc: 'Scenic lake with Nehru Island. Boating and views.', icon: '🌊' },
        { name: 'Shilpgram', cat: 'culture', desc: 'Arts & crafts village. Rajasthani folk performances.', icon: '🎭' },
    ],
    shimla: [
        { name: 'The Ridge', cat: 'landmark', desc: 'Open space in heart of Shimla. Mountain views, events.', icon: '🏔️' },
        { name: 'Mall Road', cat: 'shopping', desc: 'Colonial-era shopping street. Cafes, shops, no cars.', icon: '🛍️' },
        { name: 'Jakhoo Temple', cat: 'spiritual', desc: 'Hanuman temple on highest point. 33m Hanuman statue.', icon: '🛕' },
        { name: 'Christ Church', cat: 'heritage', desc: 'Second oldest church in North India. Neo-Gothic style.', icon: '⛪' },
        { name: 'Kufri', cat: 'nature', desc: 'Hill station 16km away. Snow activities, skiing.', icon: '⛷️' },
        { name: 'Toy Train', cat: 'experience', desc: 'UNESCO Kalka-Shimla railway. Scenic mountain journey.', icon: '🚂' },
        { name: 'Chadwick Falls', cat: 'nature', desc: 'Waterfall in dense forests. Best in monsoon.', icon: '🌊' },
        { name: 'Naldehra', cat: 'nature', desc: 'Golf course with mountain backdrop. Picnic spot.', icon: '⛳' },
    ],
    manali: [
        { name: 'Solang Valley', cat: 'nature', desc: 'Adventure hub. Paragliding, zorbing, skiing.', icon: '🏔️' },
        { name: 'Rohtang Pass', cat: 'nature', desc: 'Snow-capped pass at 3,978m. Stunning Himalayan views.', icon: '🗻' },
        { name: 'Hadimba Temple', cat: 'spiritual', desc: 'Ancient cave temple in cedar forest. Unique architecture.', icon: '🛕' },
        { name: 'Old Manali', cat: 'culture', desc: 'Bohemian village. Cafes, live music, backpacker vibes.', icon: '🎵' },
        { name: 'Jogini Waterfall', cat: 'nature', desc: 'Trek through apple orchards to stunning waterfall.', icon: '🌊' },
        { name: 'Vashisht Hot Springs', cat: 'nature', desc: 'Natural hot sulphur springs. Temple nearby.', icon: '♨️' },
        { name: 'Manu Temple', cat: 'spiritual', desc: 'Ancient temple dedicated to sage Manu.', icon: '🛕' },
        { name: 'Mall Road Manali', cat: 'shopping', desc: 'Main street. Shops, cafes, Tibetan market.', icon: '🛍️' },
    ],
    srinagar: [
        { name: 'Dal Lake', cat: 'scenic', desc: 'Jewel of Srinagar. Shikara rides, floating gardens.', icon: '⛵' },
        { name: 'Mughal Gardens', cat: 'nature', desc: 'Nishat Bagh, Shalimar Bagh. Terraced Mughal gardens.', icon: '🌿' },
        { name: 'Shankaracharya Temple', cat: 'spiritual', desc: 'Ancient hilltop temple. Panoramic lake views.', icon: '🛕' },
        { name: 'Pari Mahal', cat: 'heritage', desc: 'Palace of Fairies. Mughal-era terraced garden.', icon: '🏰' },
        { name: 'Nigeen Lake', cat: 'scenic', desc: 'Tranquil lake. Quieter alternative to Dal Lake.', icon: '🌊' },
        { name: 'Jamia Masjid', cat: 'spiritual', desc: 'Grand mosque. Beautiful Indo-Saracenic architecture.', icon: '🕌' },
        { name: 'Floating Market', cat: 'experience', desc: 'Morning vegetable market on boats. Unique experience.', icon: '🛶' },
        { name: 'Pahalgam', cat: 'nature', desc: 'Valley of Shepherds. Meadow trek, river rafting.', icon: '🏔️' },
    ],
    amritsar: [
        { name: 'Golden Temple', cat: 'spiritual', desc: 'Holiest Sikh shrine. Gold-plated, surrounded by sacred pool.', icon: '🛕' },
        { name: 'Jallianwala Bagh', cat: 'heritage', desc: 'Memorial of 1919 massacre. Narrow passage, bullet marks.', icon: '🏛️' },
        { name: 'Wagah Border', cat: 'experience', desc: 'India-Pakistan border ceremony. Patriotic flag lowering.', icon: '🇮🇳' },
        { name: 'Partition Museum', cat: 'museum', desc: 'First museum on Partition. Emotional, powerful exhibits.', icon: '🏛️' },
        { name: 'Hall Bazaar', cat: 'shopping', desc: 'Historic bazaar. Punjabi juttis, fabrics, street food.', icon: '🛍️' },
        { name: 'Ram Tirath', cat: 'spiritual', desc: 'Birthplace of Luv and Kush. Ancient temple.', icon: '🛕' },
        { name: 'Gobindgarh Fort', cat: 'heritage', desc: '18th century fort. Light shows, museums, heritage walks.', icon: '🏰' },
        { name: 'Khalsa College', cat: 'heritage', desc: 'Gothic-Sikh architecture. Beautiful heritage building.', icon: '🏛️' },
    ],
    rishikesh: [
        { name: 'Laxman Jhula', cat: 'landmark', desc: 'Iconic suspension bridge over Ganges. Scenic views.', icon: '🌉' },
        { name: 'Ram Jhula', cat: 'landmark', desc: 'Suspension bridge connecting ashrams. Evening aarti.', icon: '🌉' },
        { name: 'Beatles Ashram', cat: 'heritage', desc: 'Where Beatles meditated in 1968. Street art, ruins.', icon: '🎵' },
        { name: 'Triveni Ghat', cat: 'spiritual', desc: 'Sacred confluence. Evening Ganga Aarti ceremony.', icon: '🔥' },
        { name: 'Neer Garh Waterfall', cat: 'nature', desc: 'Two-tiered waterfall. Short trek from Laxman Jhula.', icon: '🌊' },
        { name: 'River Rafting', cat: 'experience', desc: 'White water rafting on Ganges. Rapids, cliff jumping.', icon: '🚣' },
        { name: 'Kunjapuri Temple', cat: 'spiritual', desc: 'Hilltop temple. Sunrise views of Himalayas.', icon: '🌅' },
        { name: 'Neelkanth Mahadev', cat: 'spiritual', desc: 'Shiva temple in forest. Pilgrimage trek.', icon: '🛕' },
    ],
    hampi: [
        { name: 'Virupaksha Temple', cat: 'spiritual', desc: 'Living temple. UNESCO site, 50m tower.', icon: '🛕' },
        { name: 'Vijaya Vittala Temple', cat: 'heritage', desc: 'Musical pillars, stone chariot. Iconic Hampi.', icon: '🏛️' },
        { name: 'Hampi Bazaar', cat: 'heritage', desc: 'Ancient market street. Ruins, boulders, views.', icon: '🛍️' },
        { name: 'Matanga Hill', cat: 'nature', desc: 'Best sunset point. Climb among giant boulders.', icon: '🌅' },
        { name: 'Royal Enclosure', cat: 'heritage', desc: 'Ruins of palaces, baths, elephant stables.', icon: '🏰' },
        { name: 'Elephant Stables', cat: 'heritage', desc: 'Indo-Islamic domed halls. Once housed royal elephants.', icon: '🐘' },
        { name: 'Hemakuta Hill', cat: 'nature', desc: 'Sunrise spot. Jain temples, boulder landscape.', icon: '🌄' },
        { name: 'Tungabhadra Dam', cat: 'nature', desc: 'Massive dam. Boating, gardens, evening water release.', icon: '🌊' },
    ],
    leh: [
        { name: 'Pangong Lake', cat: 'scenic', desc: '134km long lake. Color-changing waters at 4,350m.', icon: '🌊' },
        { name: 'Leh Palace', cat: 'heritage', desc: '17th century palace. Tibetan architecture, city views.', icon: '🏰' },
        { name: 'Nubra Valley', cat: 'nature', desc: 'Valley of flowers. Double-humped camels, monasteries.', icon: '🏔️' },
        { name: 'Thiksey Monastery', cat: 'spiritual', desc: '12-story gompa. Mini Potala, morning prayers.', icon: '🛕' },
        { name: 'Khardung La', cat: 'nature', desc: 'World\'s highest motorable pass (5,359m). Breathtaking.', icon: '🗻' },
        { name: 'Magnetic Hill', cat: 'experience', desc: 'Gravity-defying hill. Optical illusion or mystery?', icon: '🧲' },
        { name: 'Shanti Stupa', cat: 'spiritual', desc: 'White-domed stupa. 360° Leh valley views.', icon: '🌅' },
        { name: 'Hemis Monastery', cat: 'spiritual', desc: 'Largest monastery. Famous Hemis festival June.', icon: '🛕' },
    ],
    darjeeling: [
        { name: 'Tiger Hill', cat: 'nature', desc: 'Sunrise over Kanchenjunga. Best Himalayan panorama.', icon: '🌅' },
        { name: 'Batasia Loop', cat: 'experience', desc: 'Spiral railway loop. War memorial, toy train.', icon: '🚂' },
        { name: 'Darjeeling Himalayan Railway', cat: 'experience', desc: 'UNESCO Toy Train. Steam engines, scenic route.', icon: '🚂' },
        { name: 'Peace Pagoda', cat: 'spiritual', desc: 'Japanese Buddhist stupa. Four avatars of Buddha.', icon: '🛕' },
        { name: 'Tea Gardens', cat: 'nature', desc: 'Makaibari, Happy Valley. Tea plucking tours.', icon: '🍵' },
        { name: 'Padmaja Naidu Zoo', cat: 'nature', desc: 'Snow leopards, red pandas, Himalayan animals.', icon: '🐼' },
        { name: 'Rock Garden', cat: 'nature', desc: 'Mini Zoo park area. Waterfalls, trekking.', icon: '🌿' },
        { name: 'Observatory Hill', cat: 'scenic', desc: 'Panoramic views. Mahakal Temple at summit.', icon: '🏔️' },
    ],
    mysore: [
        { name: 'Mysore Palace', cat: 'heritage', desc: 'Indo-Saracenic palace. 98,000 lights on Sundays.', icon: '🏰' },
        { name: 'Chamundi Hills', cat: 'spiritual', desc: 'Chamundeshwari Temple. Panoramic city views.', icon: '🛕' },
        { name: 'Brindavan Gardens', cat: 'nature', desc: 'Terraced gardens. Musical fountain show.', icon: '🌿' },
        { name: 'St. Philomena Church', cat: 'heritage', desc: 'Neo-Gothic church. One of Asia\'s tallest.', icon: '⛪' },
        { name: 'Devaraja Market', cat: 'shopping', desc: 'Century-old market. Mysore silk, spices, flowers.', icon: '🛍️' },
        { name: 'Karanji Lake', cat: 'nature', desc: 'Butterfly park, bird sanctuary. Nature walks.', icon: '🦋' },
        { name: 'Jaganmohan Palace', cat: 'museum', desc: 'Art gallery. Raja Ravi Varma paintings.', icon: '🎨' },
        { name: 'Rail Museum', cat: 'museum', desc: 'Heritage locomotives. Royal train carriages.', icon: '🚂' },
    ],
    hyderabad: [
        { name: 'Charminar', cat: 'monument', desc: 'Iconic 1591 monument. Four minarets, Laad Bazaar.', icon: '🕌' },
        { name: 'Golconda Fort', cat: 'heritage', desc: 'Massive fortress. Acoustic engineering, diamond trade.', icon: '🏰' },
        { name: 'Hussain Sagar Lake', cat: 'scenic', desc: 'Heart-shaped lake. Buddha statue, boating.', icon: '🌊' },
        { name: 'Salar Jung Museum', cat: 'museum', desc: 'Largest one-man collection. Veiled Rebecca, clocks.', icon: '🏛️' },
        { name: 'Birla Mandir', cat: 'spiritual', desc: 'White marble temple. Panoramic city views.', icon: '🛕' },
        { name: 'Ramoji Film City', cat: 'entertainment', desc: 'World\'s largest film studio complex. Theme parks.', icon: '🎬' },
        { name: 'Chowmahalla Palace', cat: 'heritage', desc: 'Nizam\'s palace. Vintage cars, chandeliers.', icon: '🏰' },
        { name: 'Laad Bazaar', cat: 'shopping', desc: 'Bangle market near Charminar. Lacquer bangles.', icon: '🛍️' },
    ],
    ooty: [
        { name: 'Botanical Garden', cat: 'nature', desc: '1848 garden. 650+ plant species, fossil tree trunk.', icon: '🌿' },
        { name: 'Ooty Lake', cat: 'scenic', desc: 'Boating on artificial lake. Eucalyptus surroundings.', icon: '⛵' },
        { name: 'Nilgiri Mountain Railway', cat: 'experience', desc: 'UNESCO Toy Train. Steam engine, 16 tunnels.', icon: '🚂' },
        { name: 'Doddabetta Peak', cat: 'nature', desc: 'Highest point. Telescope house, panoramic views.', icon: '🏔️' },
        { name: 'Tea Museum', cat: 'museum', desc: 'Tea processing history. Tasting sessions.', icon: '🍵' },
        { name: 'Rose Garden', cat: 'nature', desc: '17,000 rose varieties. Annual flower show.', icon: '🌹' },
        { name: 'Pykara Lake', cat: 'nature', desc: 'Scenic lake. Boating, nearby waterfalls.', icon: '🌊' },
        { name: 'Lamb\'s Rock', cat: 'scenic', desc: 'Viewpoint. Coimbatore plains, tea estates.', icon: '🌅' },
    ],
    goa: [
        { name: 'Basilica of Bom Jesus', cat: 'heritage', desc: 'UNESCO site. Baroque architecture, St. Francis Xavier.', icon: '⛪' },
        { name: 'Calangute Beach', cat: 'beach', desc: 'Queen of beaches. Water sports, shacks, nightlife.', icon: '🏖️' },
        { name: 'Fort Aguada', cat: 'heritage', desc: '17th-century Portuguese fort with lighthouse.', icon: '🏰' },
        { name: 'Dudhsagar Falls', cat: 'nature', desc: '603m four-tiered waterfall. One of India\'s tallest.', icon: '🌊' },
        { name: 'Anjuna Flea Market', cat: 'shopping', desc: 'Wednesday flea market. Hippie culture, trinkets.', icon: '🛍️' },
        { name: 'Chapora Fort', cat: 'heritage', desc: 'Dil Chahta Hai fort. Panoramic Vagator views.', icon: '🏰' },
        { name: 'Spice Plantations', cat: 'nature', desc: 'Sahakari farm tour. Pepper, cardamom, vanilla.', icon: '🌿' },
        { name: 'Fontainhas', cat: 'culture', desc: 'Latin Quarter. Colorful Portuguese houses.', icon: '🎨' },
    ],
    varanasi: [
        { name: 'Dashashwamedh Ghat', cat: 'spiritual', desc: 'Main ghat with spectacular evening Ganga Aarti.', icon: '🔥' },
        { name: 'Kashi Vishwanath Temple', cat: 'spiritual', desc: 'One of 12 Jyotirlingas. Most sacred Shiva temple.', icon: '🛕' },
        { name: 'Assi Ghat', cat: 'spiritual', desc: 'Southernmost ghat. Morning yoga and prayers.', icon: '🌅' },
        { name: 'Sarnath', cat: 'heritage', desc: 'Buddha\'s first sermon site. 10km from Varanasi.', icon: '☸️' },
        { name: 'Manikarnika Ghat', cat: 'spiritual', desc: 'Most sacred cremation ghat in Hinduism.', icon: '🔥' },
        { name: 'BHARAT KALA BHAVAN', cat: 'museum', desc: 'Art museum at BHU. Miniature paintings.', icon: '🎨' },
        { name: 'Vishwanath Gali', cat: 'shopping', desc: 'Famous bangle and silk shopping street.', icon: '🛒' },
        { name: 'Boat Ride on Ganges', cat: 'experience', desc: 'Sunrise boat ride past all ghats.', icon: '🛶' },
    ],
    delhi: [
        { name: 'Red Fort', cat: 'monument', desc: 'UNESCO site. Mughal fortress, light show.', icon: '🏰' },
        { name: 'Qutub Minar', cat: 'monument', desc: '73m victory tower from 1193. UNESCO site.', icon: '🗼' },
        { name: 'India Gate', cat: 'landmark', desc: 'War memorial. Beautiful lawns, evening lights.', icon: '🏛️' },
        { name: 'Humayun\'s Tomb', cat: 'heritage', desc: 'Inspiration for Taj Mahal. UNESCO site.', icon: '🏛️' },
        { name: 'Lotus Temple', cat: 'spiritual', desc: 'Lotus-shaped Bahai House of Peace.', icon: '🪷' },
        { name: 'Chandni Chowk', cat: 'market', desc: 'Oldest market. Parathewali Gali, spices.', icon: '🛒' },
        { name: 'Akshardham', cat: 'spiritual', desc: 'Modern Hindu temple. Boat ride, fountain.', icon: '🛕' },
        { name: 'Jama Masjid', cat: 'spiritual', desc: 'India\'s largest mosque. Old Delhi views.', icon: '🕌' },
    ],
    mumbai: [
        { name: 'Gateway of India', cat: 'monument', desc: 'Iconic arch. Ferry point to Elephanta.', icon: '🏛️' },
        { name: 'Marine Drive', cat: 'landmark', desc: '3.6km promenade. Queen\'s Necklace at night.', icon: '🌊' },
        { name: 'Elephanta Caves', cat: 'heritage', desc: 'UNESCO rock-cut caves. 7th century sculptures.', icon: '🏛️' },
        { name: 'CST Station', cat: 'heritage', desc: 'UNESCO Gothic Victorian railway.', icon: '🚂' },
        { name: 'Juhu Beach', cat: 'beach', desc: 'Famous Mumbai beach. Street food paradise.', icon: '🏖️' },
        { name: 'Haji Ali Dargah', cat: 'spiritual', desc: 'Mosque on sea islet. Accessible at low tide.', icon: '🕌' },
        { name: 'Siddhivinayak Temple', cat: 'spiritual', desc: 'Most popular Ganesh temple.', icon: '🛕' },
        { name: 'Colaba Causeway', cat: 'shopping', desc: 'Bustling street market. Bargain shopping.', icon: '🛍️' },
    ],
    kolkata: [
        { name: 'Victoria Memorial', cat: 'monument', desc: 'White marble. Museum with 28,394 artifacts.', icon: '🏛️' },
        { name: 'Howrah Bridge', cat: 'landmark', desc: 'World\'s longest cantilever bridge.', icon: '🌉' },
        { name: 'BITM', cat: 'museum', desc: 'India\'s first science museum.', icon: '🔬' },
        { name: 'Alipore Zoo', cat: 'nature', desc: 'Oldest zoo. Royal Bengal Tigers.', icon: '🐯' },
        { name: 'Eden Gardens', cat: 'landmark', desc: 'India\'s largest cricket stadium.', icon: '🏏' },
        { name: 'Birla Planetarium', cat: 'museum', desc: 'Largest in Asia. Sky shows daily.', icon: '🌌' },
        { name: 'Jorasanko Thakur Bari', cat: 'heritage', desc: 'Tagore family home. Birthplace.', icon: '🏛️' },
        { name: 'Dakshineswar Temple', cat: 'spiritual', desc: 'Kali temple. Where Ramakrishna meditated.', icon: '🛕' },
    ],
    bangalore: [
        { name: 'Lalbagh Botanical Garden', cat: 'nature', desc: '240 acres. Glass house, 1,000+ species.', icon: '🌿' },
        { name: 'Bangalore Palace', cat: 'heritage', desc: 'Tudor-style palace. Wood carvings, paintings.', icon: '🏰' },
        { name: 'Cubbon Park', cat: 'nature', desc: '300 acres. Colonial-era green lung of the city.', icon: '🌳' },
        { name: 'ISKCON Temple', cat: 'spiritual', desc: 'Largest ISKCON temple. Gothic architecture.', icon: '🛕' },
        { name: 'Tipu Sultan\'s Palace', cat: 'heritage', desc: 'Summer residence. Teak pillars, frescoes.', icon: '🏰' },
        { name: 'Nandi Hills', cat: 'nature', desc: 'Hill fortress. Sunrise point, ancient temple.', icon: '🏔️' },
        { name: 'Vidhana Soudha', cat: 'landmark', desc: 'Legislative seat. Neo-Dravidian architecture.', icon: '🏛️' },
        { name: 'UB City', cat: 'shopping', desc: 'Luxury mall. Fine dining, high-end brands.', icon: '🛍️' },
    ],
    chennai: [
        { name: 'Marina Beach', cat: 'beach', desc: 'World\'s second longest urban beach.', icon: '🏖️' },
        { name: 'Kapaleeshwarar Temple', cat: 'spiritual', desc: 'Dravidian architecture. Colorful gopuram.', icon: '🛕' },
        { name: 'Fort St. George', cat: 'heritage', desc: 'First British fortress in India. Museum.', icon: '🏰' },
        { name: 'Santhome Cathedral', cat: 'heritage', desc: 'Built over tomb of Apostle St. Thomas.', icon: '⛪' },
        { name: 'Government Museum', cat: 'museum', desc: 'Second oldest museum. Bronze gallery.', icon: '🏛️' },
        { name: 'Mylapore', cat: 'culture', desc: 'Traditional neighborhood. Temples, culture.', icon: '🎭' },
        { name: 'Elliot\'s Beach', cat: 'beach', desc: 'Bessy Beach. Serene, less crowded.', icon: '🏖️' },
        { name: 'DakshinaChitra', cat: 'culture', desc: 'Heritage village. South Indian crafts, dance.', icon: '🎨' },
    ],
    pune: [
        { name: 'Shaniwar Wada', cat: 'heritage', desc: 'Peshwa palace fortress. Light and sound show.', icon: '🏰' },
        { name: 'Aga Khan Palace', cat: 'heritage', desc: 'Gandhi\'s imprisonment site. Beautiful gardens.', icon: '🏛️' },
        { name: 'Sinhagad Fort', cat: 'heritage', desc: 'Hill fortress. Trek, history, local food.', icon: '🏰' },
        { name: 'Dagdusheth Halwai Ganpati', cat: 'spiritual', desc: 'Most famous Ganesh temple in Pune.', icon: '🛕' },
        { name: 'Raja Dinkar Kelkar Museum', cat: 'museum', desc: 'Indian decorative arts. Mastani Mahal.', icon: '🎨' },
        { name: 'Osho Ashram', cat: 'spiritual', desc: 'International meditation resort. Koregaon Park.', icon: '🧘' },
        { name: 'Pashan Lake', cat: 'nature', desc: 'Scenic lake. Bird watching, nature walks.', icon: '🐦' },
        { name: 'Lavasa', cat: 'nature', desc: 'Planned hill city. Waterfront, adventure sports.', icon: '🏔️' },
    ],
    jaipur: [
        { name: 'Amber Fort', cat: 'heritage', desc: 'Hilltop palace. Sheesh Mahal, elephant ride.', icon: '🏰' },
        { name: 'Hawa Mahal', cat: 'monument', desc: 'Palace of Winds. 953 honeycomb windows.', icon: '🏛️' },
        { name: 'City Palace', cat: 'heritage', desc: 'Royal residence. Museums, courtyards.', icon: '🏰' },
        { name: 'Jantar Mantar', cat: 'heritage', desc: 'UNESCO astronomical instruments.', icon: '🔭' },
        { name: 'Nahargarh Fort', cat: 'heritage', desc: 'Sunset point. Panoramic Jaipur views.', icon: '🏰' },
        { name: 'Jal Mahal', cat: 'scenic', desc: 'Water Palace. Floating in Man Sagar Lake.', icon: '🏛️' },
        { name: 'Birla Mandir', cat: 'spiritual', desc: 'White marble temple. Hilltop location.', icon: '🛕' },
        { name: 'Albert Hall Museum', cat: 'museum', desc: 'Oldest museum. Egyptian mummy, artifacts.', icon: '🏛️' },
    ],
"""

# Find the last entry before the closing of CITY_ATTRACTIONS
# Look for the varanasi closing bracket pattern
old_end = "    ]\n};\n\nfunction generateAttractions"
new_end = "    ],\n" + NEW_ATTRACTIONS + "};\n\nfunction generateAttractions"

js = js.replace(old_end, new_end, 1)

# 2. Rewrite generateAttractions to fall back to CHATBOT_DB
OLD_FUNC = """function generateAttractions(destination) {
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
    const attractions = CITY_ATTRACTIONS[cityKey];
    const catColors = { heritage: '#8B4513', monument: '#1a5276', spiritual: '#9b59b6', nature: '#27ae60', beach: '#0096d6', museum: '#f39c12', shopping: '#e74c3c', culture: '#e67e22', nightlife: '#7B68EE', market: '#e74c3c', scenic: '#0096d6', entertainment: '#ff6b35', experience: '#9b59b6', landmark: '#1a5276' };
    const catLabels = { heritage: 'Heritage', monument: 'Monument', spiritual: 'Spiritual', nature: 'Nature', beach: 'Beach', museum: 'Museum', shopping: 'Shopping', culture: 'Culture', nightlife: 'Nightlife', market: 'Market', scenic: 'Scenic', entertainment: 'Fun', experience: 'Must-Do', landmark: 'Landmark' };

    // Group by category
    const cats = {};
    attractions.forEach(a => {
        if (!cats[a.cat]) cats[a.cat] = [];
        cats[a.cat].push(a);
    });

    let html = '';
    Object.keys(cats).forEach(cat => {
        const color = catColors[cat] || '#64748b';
        html += '<div class="attraction-category">';
        html += '<div class="attraction-cat-header"><span class="attraction-cat-tag" style="background:' + color + '15;color:' + color + ';">' + (catLabels[cat] || cat) + '</span></div>';
        html += '<div class="attraction-grid">';
        cats[cat].forEach(a => {
            html += '<div class="attraction-chip">';
            html += '<span class="attraction-icon">' + a.icon + '</span>';
            html += '<div class="attraction-info"><strong>' + a.name + '</strong><span>' + a.desc + '</span></div>';
            html += '</div>';
        });
        html += '</div></div>';
    });
    container.innerHTML = html;
}"""

NEW_FUNC = """function generateAttractions(destination) {
    const container = document.getElementById('attractions-list');
    if (!container) return;
    const dest = (destination || '').toLowerCase();
    
    // Destination aliases
    const destAliases = {
        'kashmir': 'srinagar', 'ladakh': 'leh', 'himachal': 'shimla',
        'uttarakhand': 'rishikesh', 'kerala': 'alleppey', 'rajasthan': 'jaipur',
        'goa': 'goa', 'northeast': 'gangtok', 'jammu': 'srinagar',
        'madhya pradesh': 'khajuraho', 'karnataka': 'bangalore',
        'tamil nadu': 'chennai', 'andhra pradesh': 'hyderabad',
        'west bengal': 'kolkata', 'maharashtra': 'mumbai',
        'gujarat': 'ahmedabad', 'odisha': 'puri', 'assam': 'kaziranga',
        'himachal pradesh': 'shimla', 'uttarakhand': 'rishikesh',
        'jammu and kashmir': 'srinagar',
    };
    
    let cityKey = '';
    // Try direct match
    for (const k of Object.keys(CITY_ATTRACTIONS)) {
        if (dest.includes(k)) { cityKey = k; break; }
    }
    // Try aliases
    if (!cityKey) {
        for (const [alias, key] of Object.entries(destAliases)) {
            if (dest.includes(alias)) { cityKey = key; break; }
        }
    }
    
    let attractions = [];
    if (cityKey && CITY_ATTRACTIONS[cityKey]) {
        attractions = CITY_ATTRACTIONS[cityKey];
    } else if (typeof CHATBOT_DB !== 'undefined') {
        // Fallback to CHATBOT_DB places
        for (const [key, cityData] of Object.entries(CHATBOT_DB)) {
            if (dest.includes(key) || key.includes(dest)) {
                const typeIcons = { monument: '🏛️', landmark: '🗼', spiritual: '🛕', nature: '🌿', heritage: '🏰', market: '🛍️', beach: '🏖️', museum: '🎨', culture: '🎭', scenic: '🏔️', experience: '⭐', entertainment: '🎪' };
                const typeCats = { monument: 'monument', landmark: 'landmark', spiritual: 'spiritual', nature: 'nature', heritage: 'heritage', market: 'shopping', beach: 'beach', museum: 'museum', culture: 'culture', scenic: 'scenic', experience: 'experience', entertainment: 'entertainment' };
                attractions = cityData.places.map(p => ({
                    name: p.name,
                    cat: typeCats[p.type] || 'heritage',
                    desc: p.desc + (p.budget ? ' (Entry: ' + p.budget + ')' : '') + (p.tip ? ' Tip: ' + p.tip : ''),
                    icon: typeIcons[p.type] || '📍'
                }));
                cityKey = key;
                break;
            }
        }
    }
    
    if (attractions.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:30px;color:var(--text-muted);"><i class="fas fa-search-location" style="font-size:2rem;margin-bottom:10px;display:block;color:var(--primary);"></i><p style="font-size:1.05rem;margin-bottom:5px;">No attractions found for "' + (destination || 'your destination') + '"</p><p style="font-size:0.85rem;">Try entering a major city like Delhi, Mumbai, Kolkata, Jaipur, Goa, Varanasi, Shimla, Manali, Srinagar, Leh, or any of 54 supported cities.</p></div>';
        return;
    }
    
    const catColors = { heritage: '#8B4513', monument: '#1a5276', spiritual: '#9b59b6', nature: '#27ae60', beach: '#0096d6', museum: '#f39c12', shopping: '#e74c3c', culture: '#e67e22', nightlife: '#7B68EE', market: '#e74c3c', scenic: '#0096d6', entertainment: '#ff6b35', experience: '#9b59b6', landmark: '#1a5276' };
    const catLabels = { heritage: 'Heritage', monument: 'Monument', spiritual: 'Spiritual', nature: 'Nature', beach: 'Beach', museum: 'Museum', shopping: 'Shopping', culture: 'Culture', nightlife: 'Nightlife', market: 'Market', scenic: 'Scenic', entertainment: 'Fun', experience: 'Must-Do', landmark: 'Landmark' };

    // Group by category
    const cats = {};
    attractions.forEach(a => {
        if (!cats[a.cat]) cats[a.cat] = [];
        cats[a.cat].push(a);
    });

    const cityName = cityKey ? (CHATBOT_DB[cityKey] ? CHATBOT_DB[cityKey].name : cityKey.charAt(0).toUpperCase() + cityKey.slice(1)) : destination;
    let html = '<div style="margin-bottom:12px;padding:10px 16px;background:var(--card-bg);border-radius:12px;border-left:4px solid var(--primary);display:flex;align-items:center;gap:10px;"><i class="fas fa-map-marker-alt" style="color:var(--primary);font-size:1.1rem;"></i><div><strong style="color:var(--text);">Showing top spots in ' + cityName + '</strong><span style="color:var(--text-muted);font-size:0.85rem;margin-left:8px;">' + attractions.length + ' attractions found</span></div></div>';
    
    Object.keys(cats).forEach(cat => {
        const color = catColors[cat] || '#64748b';
        html += '<div class="attraction-category">';
        html += '<div class="attraction-cat-header"><span class="attraction-cat-tag" style="background:' + color + '15;color:' + color + ';">' + (catLabels[cat] || cat) + ' (' + cats[cat].length + ')</span></div>';
        html += '<div class="attraction-grid">';
        cats[cat].forEach(a => {
            html += '<div class="attraction-chip">';
            html += '<span class="attraction-icon">' + a.icon + '</span>';
            html += '<div class="attraction-info"><strong>' + a.name + '</strong><span>' + a.desc + '</span></div>';
            html += '</div>';
        });
        html += '</div></div>';
    });
    container.innerHTML = html;
}"""

js = js.replace(OLD_FUNC, NEW_FUNC, 1)

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(js)

print('Updated app.js:', len(js), 'bytes')
