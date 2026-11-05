// ==================== TOURIST GUIDE CHATBOT ====================

const CHATBOT_DB = {

    delhi: {

        name: 'Delhi', state: 'Delhi (NCR)', bestTime: 'October to March',

        tagline: 'Heart of India — Mughal heritage meets modern metropolis',

        places: [

            { name: 'Red Fort', type: 'monument', desc: 'UNESCO site. Stunning Mughal fortress built by Shah Jahan.', tip: 'Book online. Closed Mondays.', budget: '₹35' },

            { name: 'Qutub Minar', type: 'monument', desc: '73m victory tower from 1193. UNESCO World Heritage.', tip: 'Visit early morning.', budget: '₹35' },

            { name: 'India Gate', type: 'landmark', desc: 'War memorial honoring 70,000+ soldiers. Beautiful lawns.', tip: 'Visit after 6 PM for lights.', budget: 'Free' },

            { name: 'Humayun\'s Tomb', type: 'monument', desc: 'Inspiration for the Taj Mahal. UNESCO site.', tip: 'Golden hour light is best.', budget: '₹35' },

            { name: 'Lotus Temple', type: 'spiritual', desc: 'Lotus-shaped Bahá\'í House of Peace. 2,500 capacity.', tip: 'Silence enforced inside.', budget: 'Free' },

            { name: 'Chandni Chowk', type: 'market', desc: 'Oldest market in Old Delhi. Parathewali Gali.', tip: 'Take a cycle-rickshaw.', budget: 'Free' },

            { name: 'Akshardham', type: 'spiritual', desc: 'Modern Hindu temple. Boat ride + musical fountain.', tip: 'No phones inside.', budget: 'Free' },

            { name: 'Jama Masjid', type: 'spiritual', desc: 'India\'s largest mosque. Stunning Old Delhi views.', tip: 'Climb south minaret.', budget: 'Free' }

        ],

        food: ['Paranthas at Paranthe Wali Gali', 'Chole Bhature at Sita Ram', 'Butter Chicken at Moti Mahal', 'Chaat at Bengali Market', 'Kebabs at Karim\'s', 'Kulfi at Kuremal'],

        hotels: [{ name: 'The Imperial', budget: 'Luxury ₹15K+', rating: '4.7' }, { name: 'Taj Mahal Hotel', budget: 'Luxury ₹12K+', rating: '4.6' }, { name: 'The LaLiT', budget: 'Premium ₹7K+', rating: '4.4' }, { name: 'Zostel Delhi', budget: 'Budget ₹500-1500', rating: '4.0' }],

        transport: ['Delhi Metro (best)', 'Auto-rickshaw', 'Uber/Ola', 'Hop-on Hop-off bus', 'Cycle-rickshaw in Old Delhi'],

        tips: ['Wear mask Nov-Feb (AQI 400+)', 'Beware touts at monuments', 'Get Tourist Metro Card', 'Weekend getaway: Agra 2h by train']
        ,
        packing: {'climate':'Extreme heat (45C summer), cold foggy winters (2-5C)','dress':'Light cotton summer, heavy woolens winter, modest for mosques','shoes':'Comfortable walking shoes, sandals','medicine':'N95 masks (AQI 400+), sunscreen SPF50, ORS','comfort':'Water bottle, hand sanitizer, power bank, umbrella','snacks':'Dry fruits, energy bars'},

    },

    mumbai: {

        name: 'Mumbai', state: 'Maharashtra', bestTime: 'November to February',

        tagline: 'City of Dreams — Bollywood, Gateway, and beyond',

        places: [

            { name: 'Gateway of India', type: 'monument', desc: 'Iconic arch overlooking Arabian Sea. Ferry point.', tip: 'Visit at sunset.', budget: 'Free' },

            { name: 'Marine Drive', type: 'landmark', desc: '3.6km curved promenade. Queen\'s Necklace at night.', tip: 'Evening walk is magical.', budget: 'Free' },

            { name: 'Elephanta Caves', type: 'monument', desc: 'UNESCO rock-cut caves. 7th century Shiva sculptures.', tip: 'Ferry takes 1 hour.', budget: '₹40 + ₹150 ferry' },

            { name: 'CST Station', type: 'heritage', desc: 'UNESCO Gothic Victorian railway station.', tip: 'Best at night lit up.', budget: 'Free' },

            { name: 'Juhu Beach', type: 'beach', desc: 'Most famous Mumbai beach. Street food paradise.', tip: 'Try bhel puri.', budget: 'Free' },

            { name: 'Haji Ali Dargah', type: 'spiritual', desc: 'Mosque on sea islet. Accessible at low tide.', tip: 'Check tide timings.', budget: 'Free' },

            { name: 'Siddhivinayak Temple', type: 'spiritual', desc: 'Most popular Ganesh temple. Bollywood visits.', tip: 'Tuesday is busiest.', budget: 'Free' },

            { name: 'Colaba Causeway', type: 'market', desc: 'Bustling street market. Bargain shopping.', tip: 'Haggle at 40% of price.', budget: 'Free' }

        ],

        packing: {'climate':'Hot humid (32-37C), monsoon Jun-Sep, mild winters (18-25C)','dress':'Light cotton, waterproof jacket monsoon, light layers winter','shoes':'Comfortable walking shoes, waterproof sandals','medicine':'ORS, mosquito repellent, sunscreen, basic first-aid','comfort':'Umbrella/raincoat, waterproof bag, power bank','snacks':'Dry fruits, packaged water'},

        food: ['Vada Pav at Ashok Vada Pav', 'Pav Bhaji at Sardar', 'Pani Puri at Elco', 'Bombil Fry at Mahesh', 'Missal Pav at Aaswad', 'Kheema Pav at Café Madras'],

        hotels: [{ name: 'Taj Mahal Palace', budget: 'Luxury ₹18K+', rating: '4.8' }, { name: 'Leela Mumbai', budget: 'Luxury ₹12K+', rating: '4.6' }, { name: 'Trident BKC', budget: 'Premium ₹8K+', rating: '4.5' }, { name: 'Hotel Residency', budget: 'Budget ₹2K-4K', rating: '3.9' }],

        transport: ['Local Train (fastest)', 'BEST Bus', 'Metro Line 1&2', 'Uber/Ola', 'Auto-rickshaw (suburbs)'],

        tips: ['Avoid local trains peak hours', 'Monsoon Jun-Sep disrupts city', 'Try Irani cafés', 'Gateway→Elephanta ferry']

    },

    kolkata: {

        name: 'Kolkata', state: 'West Bengal', bestTime: 'October to March',

        tagline: 'City of Joy — cultural capital of India',

        places: [

            { name: 'Victoria Memorial', type: 'monument', desc: 'White marble memorial. Museum with 28,394 artifacts.', tip: 'Evening sound & light show.', budget: '₹30' },

            { name: 'Howrah Bridge', type: 'landmark', desc: 'World\'s longest cantilever bridge over Hooghly.', tip: 'View from Prinsep Ghat.', budget: 'Free' },

            { name: 'BITM', type: 'museum', desc: 'India\'s first science museum. Interactive exhibits.', tip: 'Great for families.', budget: '₹50' },

            { name: 'Alipore Zoo', type: 'attraction', desc: 'Oldest zoo. Royal Bengal Tigers, elephants.', tip: 'Closed Thursdays.', budget: '₹50' },

            { name: 'Eden Gardens', type: 'landmark', desc: 'India\'s largest cricket stadium. 68,000 seats.', tip: 'Check match schedules.', budget: 'Free' },

            { name: 'Birla Planetarium', type: 'museum', desc: 'Largest in Asia. Sky shows daily.', tip: 'Shows at 12:30, 2:30, 4:30.', budget: '₹80' },

            { name: 'Jorasanko Thakur Bari', type: 'heritage', desc: 'Tagore family home. Rabindranath\'s birthplace.', tip: 'Guided tours available.', budget: '₹50' },

            { name: 'Kalighat Temple', type: 'spiritual', desc: 'One of 51 Shakti Peethas. Goddess Kali shrine.', tip: 'Visit early morning.', budget: 'Free' }

        ],

        packing: {'climate':'Hot humid (30-38C), pleasant winters (12-25C), monsoon Jun-Sep','dress':'Light cotton, shawl for AC, modest for temples','shoes':'Walking shoes, waterproof sandals','medicine':'ORS, mosquito repellent, sunscreen, digestive tablets','comfort':'Umbrella, power bank, water bottle, wet wipes','snacks':'Dry fruits, packaged water'},

        food: ['Kathi Rolls at Kusum Rolls', 'Mishti Doi at 6 Ballygunge Place', 'Bengali Thali at Oh! Calcutta', 'Puchka at Vivekananda Park', 'Rosogolla at KC Das', 'Biryani at Arsalan'],

        hotels: [{ name: 'Oberoi Grand', budget: 'Luxury ₹15K+', rating: '4.7' }, { name: 'Taj Bengal', budget: 'Luxury ₹12K+', rating: '4.6' }, { name: 'ITC Sonar', budget: 'Premium ₹8K+', rating: '4.5' }, { name: 'Hotel Astor', budget: 'Budget ₹2K-4K', rating: '3.8' }],

        transport: ['Metro (fastest)', 'Tram (oldest in India)', 'Yellow Taxi', 'Uber/Ola', 'Ferry across Hooghly'],

        tips: ['Durga Puja Oct is incredible but crowded', 'Learn "Dhonnobad" (Thank you)', 'Park Street for nightlife', 'Try the tram ride']

    },

    bangalore: {

        name: 'Bangalore', state: 'Karnataka', bestTime: 'October to February',

        tagline: 'Garden City of India — tech hub with green soul',

        places: [

            { name: 'Lalbagh Garden', type: 'park', desc: '240 acres. 1,854 plant species. Glass house.', tip: 'Morning visit best.', budget: '₹20' },

            { name: 'Cubbon Park', type: 'park', desc: '300-acre green lung. Victorian buildings.', tip: 'Great for walks.', budget: 'Free' },

            { name: 'Bangalore Palace', type: 'heritage', desc: 'Tudor-style palace. Royal artifacts.', tip: 'Audio guide recommended.', budget: '₹230' },

            { name: 'ISKCON Temple', type: 'spiritual', desc: 'Largest ISKCON temple. Evening aarti.', tip: 'Aarti at 7 PM.', budget: 'Free' },

            { name: 'Nandi Hills', type: 'nature', desc: 'Hill station 60km away. Sunrise point.', tip: 'Start 5 AM for sunrise.', budget: '₹20' },

            { name: 'Bannerghatta', type: 'nature', desc: 'Wildlife safari, zoo, butterfly park.', tip: 'Full day trip.', budget: '₹800 safari' },

            { name: 'UB City', type: 'shopping', desc: 'Premium luxury mall. Fine dining.', tip: 'Evening outings.', budget: 'Free' },

            { name: 'Vidhana Soudha', type: 'landmark', desc: 'Legislative building. Illuminated Sundays.', tip: 'Night viewing best.', budget: 'Exterior only' }

        ],

        packing: {'climate':'Pleasant year-round (20-33C), occasional rain, cool evenings','dress':'Light cotton, light jacket for evenings, casual comfortable','shoes':'Walking shoes, sneakers, comfortable sandals','medicine':'Sunscreen, basic first-aid, allergy tablets','comfort':'Light jacket evenings, power bank, umbrella','snacks':'Dry fruits, filter coffee, energy bars'},

        food: ['Masala Dosa at MTR', 'Filter Coffee at Indian Coffee House', 'Bisi Bele Bath at Vidyarthi Bhavan', 'Pulao at Meghana Foods', 'Momos at Tibetan Kitchen', 'Craft Beer at Toit'],

        hotels: [{ name: 'Leela Palace', budget: 'Luxury ₹15K+', rating: '4.7' }, { name: 'Taj West End', budget: 'Luxury ₹10K+', rating: '4.6' }, { name: 'JW Marriott', budget: 'Premium ₹7K+', rating: '4.5' }, { name: 'Zostel Bangalore', budget: 'Budget ₹500-1500', rating: '4.0' }],

        transport: ['Namma Metro', 'BMTC Bus', 'Uber/Ola', 'Auto-rickshaw', 'Rented bikes'],

        tips: ['Traffic is legendary — plan 2x time', 'Pleasant weather year-round', 'Craft beer culture is huge', 'Weekend: Nandi Hills, Coorg']

    },

    chennai: {

        name: 'Chennai', state: 'Tamil Nadu', bestTime: 'November to February',

        tagline: 'Gateway to South India — temples, beaches, Carnatic music',

        places: [

            { name: 'Marina Beach', type: 'beach', desc: '2nd longest urban beach. 13km.', tip: 'Evening visits only.', budget: 'Free' },

            { name: 'Kapaleeshwarar Temple', type: 'spiritual', desc: '7th century Dravidian temple. Colorful gopuram.', tip: 'Evening puja.', budget: 'Free' },

            { name: 'Fort St. George', type: 'heritage', desc: 'First English fortress in India (1644).', tip: 'Closed Fridays.', budget: '₹25' },

            { name: 'Government Museum', type: 'museum', desc: '2nd oldest museum. Bronze gallery famous.', tip: 'Allow 3 hours.', budget: '₹15' },

            { name: 'Santhome Cathedral', type: 'spiritual', desc: 'Built over Apostle St. Thomas\'s tomb.', tip: 'Beautiful stained glass.', budget: 'Free' },

            { name: 'Mylapore', type: 'cultural', desc: 'Historic neighborhood. Silk shops, music.', tip: 'Dec music season famous.', budget: 'Free' },

            { name: 'Cholamandal Artists Village', type: 'art', desc: 'Artists\' commune. Galleries, sculpture.', tip: 'Handmade souvenirs.', budget: 'Free' },

            { name: 'VGP Universal Kingdom', type: 'entertainment', desc: 'Beach-side amusement park.', tip: 'Combo tickets save.', budget: '₹600-800' }

        ],

        packing: {'climate':'Hot humid (25-38C), heavy monsoon Oct-Dec, pleasant Dec-Feb','dress':'Light breathable cotton, covered for temples, rain gear monsoon','shoes':'Comfortable sandals, walking shoes','medicine':'ORS, mosquito repellent, sunscreen SPF50+','comfort':'Umbrella, wet wipes, power bank, water bottle','snacks':'Dry fruits, buttermilk packets'},

        food: ['Dosa at Saravana Bhavan', 'Chettinad Chicken at Ponnusamy', 'Filter Coffee at Mylapore', 'Biryani at Dindigul Thalappakatti', 'Idli at Murugan Idli Shop', 'Meals at Anjappar'],

        hotels: [{ name: 'Taj Coromandel', budget: 'Luxury ₹12K+', rating: '4.7' }, { name: 'ITC Grand Chola', budget: 'Luxury ₹10K+', rating: '4.6' }, { name: 'Radisson Blu', budget: 'Premium ₹5K+', rating: '4.3' }, { name: 'Zostel Chennai', budget: 'Budget ₹500-1500', rating: '4.0' }],

        transport: ['Chennai Metro', 'MTC Bus', 'Suburban Train', 'Uber/Ola', 'Auto-rickshaw'],

        tips: ['Very hot — carry water always', 'Dec music season is world-famous', 'Dress modestly at temples', 'Day trip to Mahabalipuram']

    },

    pune: {

        name: 'Pune', state: 'Maharashtra', bestTime: 'October to March',

        tagline: 'Oxford of the East — history, culture, nightlife',

        places: [

            { name: 'Aga Khan Palace', type: 'heritage', desc: 'Where Gandhi was imprisoned. Beautiful gardens.', tip: 'Gandhi\'s ashes preserved.', budget: '₹30' },

            { name: 'Shaniwar Wada', type: 'monument', desc: 'Peshwa fortress (1732). Sound & light show.', tip: 'Show at 7:15 PM.', budget: '₹25' },

            { name: 'Sinhagad Fort', type: 'nature', desc: 'Hill fortress. Trekking, waterfalls.', tip: 'Best in monsoon.', budget: '₹20' },

            { name: 'Dagdusheth Ganpati', type: 'spiritual', desc: 'Most famous Ganesh temple. Elaborate festivals.', tip: 'Festival time spectacular.', budget: 'Free' },

            { name: 'Kelkar Museum', type: 'museum', desc: 'Quirky museum. 20,000+ artifacts.', tip: 'Fascinating and underrated.', budget: '₹20' },

            { name: 'Pashan Lake', type: 'nature', desc: 'Serene lake. Birdwatching, flamingos in winter.', tip: 'Early morning for birds.', budget: 'Free' },

            { name: 'Okayama Friendship Garden', type: 'park', desc: 'Japanese garden. Bonsai, zen.', tip: 'Peaceful retreat.', budget: '₹10' },

            { name: 'Koregaon Park', type: 'nightlife', desc: 'Trendy cafes, pubs, Osho Resort.', tip: 'Friday nights vibrant.', budget: 'Free' }

        ],

        packing: {'climate':'Pleasant (15-35C), heavy monsoon Jun-Sep, cool winters','dress':'Light layers, rain gear monsoon, warm jacket winter mornings','shoes':'Walking shoes, waterproof shoes monsoon','medicine':'Sunscreen, basic first-aid, allergy tablets','comfort':'Light jacket, power bank, umbrella','snacks':'Dry fruits, energy bars'},

        food: ['Mastani at Sujata Mastani', 'Misal Pav at Bedekar', 'Vada Pav at Garden Vada Pav', 'Bakarvadi at Chitale', 'Chinese at Marzorin', 'Thali at Shreyas'],

        hotels: [{ name: 'JW Marriott', budget: 'Luxury ₹10K+', rating: '4.6' }, { name: 'Westin Pune', budget: 'Luxury ₹8K+', rating: '4.5' }, { name: 'Novotel', budget: 'Premium ₹5K+', rating: '4.3' }, { name: 'Zostel Pune', budget: 'Budget ₹500-1500', rating: '4.0' }],

        transport: ['Pune Metro', 'PMPML Bus', 'Uber/Ola', 'Auto-rickshaw', 'Rent bike for forts'],

        tips: ['Trekker\'s paradise — Sinhagad, Rajgad, Torna', 'Ganesh Chaturthi Aug-Sep is biggest festival', 'Weekend: Lonavala, Alibaug within 2h', 'MG Road for cafes']

    },

    jaipur: {

        name: 'Jaipur', state: 'Rajasthan', bestTime: 'October to March',

        tagline: 'Pink City — royal heritage and vibrant bazaars',

        places: [

            { name: 'Amber Fort', type: 'monument', desc: 'Magnificent hilltop fortress. Mirror palace.', tip: 'Go early. Jeep ride up.', budget: '₹100' },

            { name: 'Hawa Mahal', type: 'monument', desc: 'Palace of Winds. 953 small windows.', tip: 'Photo from opposite café.', budget: '₹50' },

            { name: 'City Palace', type: 'heritage', desc: 'Royal family home. Museum inside.', tip: 'Allow 3 hours.', budget: '₹200' },

            { name: 'Jantar Mantar', type: 'monument', desc: 'UNESCO astronomical observatory.', tip: 'Guided tour recommended.', budget: '₹50' },

            { name: 'Nahargarh Fort', type: 'nature', desc: 'Panoramic Jaipur views. Sunset point.', tip: 'Open till 10 PM.', budget: '₹50' },

            { name: 'Jal Mahal', type: 'landmark', desc: 'Water palace in Man Sagar Lake.', tip: 'Boat rides available.', budget: 'Free' },

            { name: 'Albert Hall Museum', type: 'museum', desc: 'Oldest Rajasthan museum. Egyptian mummy.', tip: 'Beautiful at night.', budget: '₹40' },

            { name: 'Birla Mandir', type: 'spiritual', desc: 'White marble temple. Stunning carvings.', tip: 'Beautiful at night.', budget: 'Free' }

        ],

        packing: {'climate':'Hot (25-45C summer), pleasant winters (8-22C), monsoon Jul-Sep','dress':'Light cotton, comfortable modest clothing for forts/palaces, head scarf','shoes':'Comfortable walking shoes, sandals','medicine':'Sunscreen SPF50+, ORS, lip balm, anti-dehydration tablets','comfort':'Water bottle (2L+), hat/cap, umbrella, sunglasses','snacks':'Dry fruits, energy bars, extra water'},

        food: ['Dal Bati Churma at Chokhi Dhani', 'Kachori at Rawat', 'Lassi at Lassiwala MI Road', 'Laal Maas at 1135 AD', 'Pyaaz Kachori at Tapri', 'Ghewar at Laxmi Bhandar'],

        hotels: [{ name: 'Rambagh Palace', budget: 'Luxury ₹25K+', rating: '4.9' }, { name: 'Oberoi Rajvilas', budget: 'Luxury ₹20K+', rating: '4.8' }, { name: 'Samode Haveli', budget: 'Premium ₹8K+', rating: '4.6' }, { name: 'Zostel Jaipur', budget: 'Budget ₹500-1500', rating: '4.1' }],

        transport: ['Jaipur Metro', 'BSRT Bus', 'Uber/Ola', 'Auto-rickshaw', 'Rented scooter'],

        tips: ['Bargain hard at Johari Bazaar', 'Comfortable shoes needed', 'Chokhi Dhani for Rajasthani experience', 'Ranthambore 3.5h for tiger safari']

    },

    varanasi: {

        name: 'Varanasi', state: 'Uttar Pradesh', bestTime: 'October to March',

        tagline: 'Spiritual capital — where the Ganges meets eternity',

        places: [

            { name: 'Dashashwamedh Ghat', type: 'spiritual', desc: 'Main ghat. Spectacular Ganga Aarti.', tip: 'Reach by 5 PM.', budget: 'Free' },

            { name: 'Kashi Vishwanath', type: 'spiritual', desc: 'One of 12 Jyotirlingas. Most sacred.', tip: 'Long queues. Special darshan.', budget: 'Free' },

            { name: 'Sarnath', type: 'monument', desc: 'Buddha\'s first sermon site. Dhamek Stupa.', tip: 'Half day trip.', budget: '₹20 museum' },

            { name: 'Assi Ghat', type: 'spiritual', desc: 'Southern ghat. Sunrise yoga.', tip: 'Morning yoga classes.', budget: 'Free' },

            { name: 'Manikarnika Ghat', type: 'spiritual', desc: 'Cremation ghat. Deeply spiritual.', tip: 'Be respectful. No photos.', budget: 'Free' },

            { name: 'Ramnagar Fort', type: 'heritage', desc: '18th century Mughal fort. Museum.', tip: 'Boat ride to fort.', budget: '₹50' },

            { name: 'BHU Campus', type: 'spiritual', desc: 'University campus. Modern temple.', tip: 'Peaceful walks.', budget: 'Free' },

            { name: 'Tulsi Manas Temple', type: 'spiritual', desc: 'Where Ramcharitmanas was written.', tip: 'Marble carved verses.', budget: 'Free' }

        ],

        packing: {'climate':'Extreme heat (40-48C summer), pleasant winters (8-22C)','dress':'Light cotton, modest for ghats/temples, head covering optional','shoes':'Comfortable walking shoes, waterproof sandals','medicine':'ORS, sunscreen SPF50+, mosquito repellent, anti-diarrheal','comfort':'Water bottle, umbrella, flashlight for evening aarti','snacks':'Dry fruits, malaiyo (winter specialty)'},

        food: ['Kachori Sabzi at Kachori Gali', 'Banarasi Paan at Deepak', 'Malaiyo at Dashashwamedh', 'Lassi at Blue Lassi Shop', 'Chaat at Kashi Chaat Bhandar', 'Thandai at Bhimsen Ghat'],

        hotels: [{ name: 'Taj Nadesar Palace', budget: 'Luxury ₹15K+', rating: '4.7' }, { name: 'BrijRama Palace', budget: 'Luxury ₹12K+', rating: '4.8' }, { name: 'Suryaudho Haveli', budget: 'Premium ₹5K+', rating: '4.5' }, { name: 'Zostel Varanasi', budget: 'Budget ₹400-1200', rating: '4.2' }],

        transport: ['E-rickshaw', 'Boat rides', 'Auto-rickshaw', 'Walking (best for ghats)', 'Cycle-rickshaw old city'],

        tips: ['Sunrise boat ride is essential', 'Easy-off shoes for temples', 'Visit during Dev Deepawali (Nov)', 'Carry cloth for cremation ghat visit']

    },

    agra: {

        name: 'Agra', state: 'Uttar Pradesh', bestTime: 'October to March',

        tagline: 'City of the Taj — home to the world\'s greatest love monument',

        places: [

            { name: 'Taj Mahal', type: 'monument', desc: 'UNESCO site. Wonder of the World. Shah Jahan\'s tribute.', tip: 'Sunrise visit. Closed Fridays. ₹45 foreigners.', budget: '₹50 Indians' },

            { name: 'Agra Fort', type: 'monument', desc: 'UNESCO Mughal fortress. Taj Mahal view from here.', tip: '3 hours needed.', budget: '₹50' },

            { name: 'Fatehpur Sikri', type: 'monument', desc: 'UNESCO ghost city. Mughal capital for 10 years.', tip: '40km from Agra. Half day trip.', budget: '₹50' },

            { name: 'Mehtab Bagh', type: 'park', desc: 'Moonlight garden. Taj Mahal view across river.', tip: 'Best for sunset photos.', budget: '₹25' },

            { name: 'Itimad-ud-Daulah', type: 'monument', desc: 'Baby Taj. Exquisite marble inlay work.', tip: 'Less crowded than Taj.', budget: '₹30' },

            { name: 'Akbar\'s Tomb', type: 'monument', desc: 'Sikandara. Impressive Mughal architecture.', tip: 'Large campus.', budget: '₹25' },

            { name: 'Kinari Bazaar', type: 'market', desc: 'Chaos of colors. Marble souvenirs.', tip: 'Haggle hard.', budget: 'Free' },

            { name: 'Chini Ka Rauza', type: 'monument', desc: 'Chinese glazed tile tomb. Unique.', tip: 'Off the beaten path.', budget: '₹20' }

        ],

        packing: {'climate':'Hot (25-45C), pleasant winters (8-22C), foggy Dec-Jan','dress':'Light cotton summer, warm layers winter, modest for monuments','shoes':'Comfortable walking shoes (lots of walking at Taj)','medicine':'Sunscreen, ORS, basic first-aid','comfort':'Water bottle, hat, umbrella, sunglasses','snacks':'Dry fruits, petha (local sweet), energy bars'},

        food: ['Petha at Various Shops', 'Bedai & Jalebi at Deviram', 'Mughlai at Pinch of Spice', 'Chole Bhature at Sita Ram', 'Lassi atshaliram', 'Tandoori at Taj Resorts'],

        hotels: [{ name: 'The Oberoi Amarvilas', budget: 'Luxury ₹30K+', rating: '4.9' }, { name: 'ITC Mughal', budget: 'Luxury ₹10K+', rating: '4.6' }, { name: 'Courtyard by Marriott', budget: 'Premium ₹5K+', rating: '4.3' }, { name: 'Zostel Agra', budget: 'Budget ₹400-1200', rating: '4.1' }],

        transport: ['Cycle-rickshaw', 'Auto-rickshaw', 'Uber/Ola', 'Tonga (horse carriage)', 'Delhi-Agra train (2h)'],

        tips: ['Book Taj tickets online to skip lines', 'Taj by moonlight on full moon night', 'Agra is a day trip from Delhi', 'Buy marble inlay souvenirs']

    },

    goa: {

        name: 'Goa', state: 'Goa', bestTime: 'November to February',

        tagline: 'Beach Paradise — sun, sand, seafood, and nightlife',

        places: [

            { name: 'Baga Beach', type: 'beach', desc: 'Most popular beach. Water sports, nightlife.', tip: 'Night markets nearby.', budget: 'Free' },

            { name: 'Old Goa Churches', type: 'monument', desc: 'UNESCO Portuguese churches. Basilica of Bom Jesus.', tip: 'Dress modestly.', budget: 'Free' },

            { name: 'Dudhsagar Falls', type: 'nature', desc: 'India\'s tallest waterfall. 310 meters.', tip: 'Jeep safari only.', budget: '₹500' },

            { name: 'Fort Aguada', type: 'heritage', desc: '17th century Portuguese fort. Lighthouse.', tip: 'Sunset views.', budget: 'Free' },

            { name: 'Palolem Beach', type: 'beach', desc: 'Crescent-shaped. Calm waters. South Goa.', tip: 'Kayak to monkey island.', budget: 'Free' },

            { name: 'Anjuna Flea Market', type: 'market', desc: 'Wednesday market. Hippie vibes. Souvenirs.', tip: 'Bargain is key.', budget: 'Free' },

            { name: 'Chapora Fort', type: 'heritage', desc: 'Dil Chahta Hai fort. Panoramic views.', tip: 'Climb for sunset.', budget: 'Free' },

            { name: 'Spice Plantations', type: 'nature', desc: 'Ponda spice farms. Tours with lunch.', tip: 'Sahakari plantation is popular.', budget: '₹400' }

        ],

        packing: {'climate':'Hot humid (25-33C), pleasant Nov-Feb, monsoon Jun-Sep','dress':'Beachwear, swimwear, light cotton, modest for churches/temples','shoes':'Flip-flops, sandals, water shoes for rocky beaches','medicine':'Sunscreen SPF50+, mosquito repellent, ORS, anti-diarrheal','comfort':'Beach towel, waterproof bag, hat, sunglasses','snacks':'Coconut water, cashewnuts, seafood'},

        food: ['Fish Curry Rice at local shacks', 'Bebinca at Venite', 'Prawn Balchão at Gunpowder', 'Vindaloo at Gunpowder', 'Feni at local bars', 'Xacuti at Fisherman\'s Wharf'],

        hotels: [{ name: 'Taj Fort Aguada', budget: 'Luxury ₹15K+', rating: '4.7' }, { name: 'Leela Goa', budget: 'Luxury ₹12K+', rating: '4.8' }, { name: 'The Park', budget: 'Premium ₹5K+', rating: '4.3' }, { name: 'Zostel Goa', budget: 'Budget ₹400-1200', rating: '4.0' }],

        transport: ['Rented scooter/bike (best)', 'Auto-rickshaw', 'Uber/Ola (limited)', 'Bus (Kadamba)', 'Taxi'],

        tips: ['Rent a scooter — best way to explore', 'North Goa = party, South Goa = peace', 'Monsoon Jun-Sep closes many beach shacks', 'Carry sunscreen always']

    },

    udaipur: {

        name: 'Udaipur', state: 'Rajasthan', bestTime: 'September to March',

        tagline: 'City of Lakes — Venice of the East',

        places: [

            { name: 'City Palace', type: 'heritage', desc: 'Largest palace complex in Rajasthan.', tip: 'Allow 3-4 hours.', budget: '₹300' },

            { name: 'Lake Pichola', type: 'nature', desc: 'Iconic lake. Boat rides to Jag Mandir.', tip: 'Sunset boat ride.', budget: '₹400 boat' },

            { name: 'Jagdish Temple', type: 'spiritual', desc: 'Indo-Aryan temple. Intricate carvings.', tip: 'Evening aarti.', budget: 'Free' },

            { name: 'Saheliyon Ki Bari', type: 'park', desc: 'Garden of Maidens. Lotus pools, fountains.', tip: 'Peaceful morning visit.', budget: '₹30' },

            { name: 'Monsoon Palace', type: 'monument', desc: 'Hilltop palace. Panoracular views.', tip: 'Sunset is spectacular.', budget: '₹80' },

            { name: 'Jag Mandir', type: 'heritage', desc: 'Island palace in Lake Pichola.', tip: 'Boat from City Palace.', budget: '₹400' },

            { name: 'Fateh Sagar Lake', type: 'nature', desc: 'Second lake. Nehru Island Garden.', tip: 'Speed boat rides.', budget: '₹50' },

            { name: 'Shilpgram', type: 'cultural', desc: 'Rural arts & crafts village. Live demos.', tip: 'Dec festival is amazing.', budget: '₹30' }

        ],

        packing: {'climate':'Hot (25-42C summer), pleasant winters (8-22C), monsoon Jul-Sep','dress':'Light cotton, comfortable clothing for palaces, evening wear','shoes':'Comfortable walking shoes, sandals','medicine':'Sunscreen, ORS, lip balm, basic medicines','comfort':'Water bottle, hat, umbrella, sunglasses','snacks':'Dry fruits, dal baati churma'},

        food: ['Dal Bati at Raas Leela', 'Rajasthani Thali at Ambrai', 'Pyaaz Kachori at MP Shadows', 'Lassi at Fateh Sagar', 'Italian at Upré by 1559 AD', 'Street food at Hathi Pol'],

        hotels: [{ name: 'Taj Lake Palace', budget: 'Luxury ₹25K+', rating: '4.9' }, { name: 'Oberoi Udaivilas', budget: 'Luxury ₹30K+', rating: '4.9' }, { name: 'Jagat Niwas', budget: 'Premium ₹4K+', rating: '4.5' }, { name: 'Zostel Udaipur', budget: 'Budget ₹400-1200', rating: '4.2' }],

        transport: ['Auto-rickshaw', 'Walking (old city)', 'Uber/Ola (limited)', 'Boat rides', 'Rented bike'],

        tips: ['Sunset boat ride is a must', 'Roof-top restaurants for lake views', 'Painting workshops available', '2-3 days minimum needed']

    },

    shimla: {

        name: 'Shimla', state: 'Himachal Pradesh', bestTime: 'March to June, December to January',

        tagline: 'Queen of Hills — colonial charm meets mountain serenity',

        places: [

            { name: 'The Ridge', type: 'landmark', desc: 'Open space in heart of Shimla. Mountain views.', tip: 'Evening stroll.', budget: 'Free' },

            { name: 'Mall Road', type: 'market', desc: 'Shopping street. Colonial-era buildings.', tip: 'Cars banned. Walking only.', budget: 'Free' },

            { name: 'Jakhoo Temple', type: 'spiritual', desc: 'Hanuman temple on highest point. 33m statue.', tip: 'Monkeys are aggressive.', budget: 'Free' },

            { name: 'Christ Church', type: 'heritage', desc: 'Second oldest church in North India. Gothic.', tip: 'Beautiful stained glass.', budget: 'Free' },

            { name: 'Kufri', type: 'nature', desc: 'Hill station 16km away. Snow activities.', tip: 'Winter for skiing.', budget: 'Free' },

            { name: 'Chadwick Falls', type: 'nature', desc: 'Waterfall surrounded by forests.', tip: 'Monsoon for best flow.', budget: 'Free' },

            { name: 'Naldehra', type: 'nature', desc: 'Golf course with mountain backdrop.', tip: 'Best for picnics.', budget: 'Free' },

            { name: 'Toy Train', type: 'heritage', desc: 'UNESCO Kalka-Shimla railway.', tip: 'Book in advance.', budget: '₹800' }

        ],

        packing: {'climate':'Cool (5-25C summer), cold snowy winters (-2 to 8C)','dress':'Warm layers, heavy woolens winter, light jacket summer, rain gear','shoes':'Trekking boots with grip, waterproof shoes, comfortable walking shoes','medicine':'Cold medicine, sunscreen (high altitude UV), lip balm, basic first-aid','comfort':'Thermos flask, warm socks, gloves, umbrella','snacks':'Hot chocolate, dry fruits, Maggi (local favorite)'},

        food: ['Siddu at local dhabas', 'Chana Madra at Himachali Rasoi', 'Thukpa at Nepal House', 'Momos at every corner', 'Apple pie at Wake & Bake', 'Tudor at Goofa Coffee'],

        hotels: [{ name: 'Wildflower Hall', budget: 'Luxury ₹25K+', rating: '4.8' }, { name: 'The Oberoi', budget: 'Luxury ₹20K+', rating: '4.7' }, { name: 'Hotel Combermere', budget: 'Premium ₹4K+', rating: '4.2' }, { name: 'Zostel Shimla', budget: 'Budget ₹500-1500', rating: '4.0' }],

        transport: ['Walking (best in Mall Road)', 'Local bus', 'Taxi', 'Toy Train', 'Auto-rickshaw'],

        tips: ['Book Toy Train well in advance', 'Carry warm clothes even in summer', 'Avoid weekends — too crowded', 'Snowfall Dec-Jan is magical']

    },

    manali: {

        name: 'Manali', state: 'Himachal Pradesh', bestTime: 'March to June, December to February',

        tagline: 'Adventure Capital — mountains, snow, and adrenaline',

        places: [

            { name: 'Solang Valley', type: 'nature', desc: 'Adventure hub. Paragliding, skiing, zorbing.', tip: 'Winter for skiing.', budget: 'Activities ₹500-2000' },

            { name: 'Hadimba Temple', type: 'spiritual', desc: 'Wooden temple in cedar forest.', tip: 'Beautiful setting.', budget: 'Free' },

            { name: 'Old Manali', type: 'cultural', desc: 'Quaint village. Cafes, shops, backpacker vibe.', tip: 'Best for evening walks.', budget: 'Free' },

            { name: 'Rohtang Pass', type: 'nature', desc: 'Mountain pass at 3,978m. Snow-capped.', tip: 'Permit needed. Book online.', budget: '₹500 + permit' },

            { name: 'Jogini Waterfall', type: 'nature', desc: 'Trek to beautiful waterfall.', tip: 'Easy 2-hour trek.', budget: 'Free' },

            { name: 'Vashisht Village', type: 'spiritual', desc: 'Hot springs and ancient temple.', tip: 'Natural hot water bath.', budget: 'Free' },

            { name: 'Mall Road Manali', type: 'market', desc: 'Shopping and dining street.', tip: 'Evening stroll.', budget: 'Free' },

            { name: 'Great Himalayan National Park', type: 'nature', desc: 'UNESCO site. Wildlife and trekking.', tip: 'Full day needed.', budget: '₹200' }

        ],

        packing: {'climate':'Cool (10-25C summer), freezing snowy winters (-7 to 5C)','dress':'Heavy woolens winter, light layers summer, waterproof jacket monsoon','shoes':'Trekking boots with grip, waterproof shoes','medicine':'Altitude sickness pills (for Rohtang), cold medicine, sunscreen','comfort':'Thermos, warm gloves, beanie cap, power bank','snacks':'Siddu (local bread), dry fruits, hot soups'},

        food: ['Thukpa at Lily\'s', 'Momos at Uncle\'s Kitchen', 'Trout at Johnson\'s Café', 'Dham at local feasts', 'Israeli food at Lazy Dog', 'Maggi at every café'],

        hotels: [{ name: 'The Himalayan', budget: 'Luxury ₹12K+', rating: '4.6' }, { name: 'Manu Allaya', budget: 'Luxury ₹10K+', rating: '4.7' }, { name: 'Hotel Beas', budget: 'Premium ₹3K+', rating: '4.0' }, { name: 'Zostel Manali', budget: 'Budget ₹400-1200', rating: '4.1' }],

        transport: ['Walking (old town)', 'Local bus', 'Taxi', 'Rented bike/scooter', 'HRTC bus to Rohtang'],

        tips: ['Rohtang permit sells out fast', 'Acclimatize before going high', 'Carry layers — weather changes fast', 'Old Manali > New Manali for vibes']

    },

    darjeeling: {

        name: 'Darjeeling', state: 'West Bengal', bestTime: 'April to June, October to December',

        tagline: 'Queen of the Himalayas — tea gardens and Kanchenjunga views',

        places: [

            { name: 'Tiger Hill', type: 'nature', desc: 'Sunrise point. Kanchenjunga view.', tip: 'Start 4 AM.', budget: '₹30 jeep' },

            { name: 'Darjeeling Himalayan Railway', type: 'heritage', desc: 'UNESCO Toy Train. Steam engine.', tip: 'Joy ride recommended.', budget: '₹800' },

            { name: 'Tea Gardens', type: 'nature', desc: 'Lush tea plantations. Factory tours.', tip: 'Makaibari estate.', budget: '₹100-300' },

            { name: 'Batasia Loop', type: 'landmark', desc: 'Spiral railway with war memorial.', tip: 'Great photo spot.', budget: '₹10' },

            { name: 'Padmaja Naidu Zoo', type: 'attraction', desc: 'Snow leopards, red pandas.', tip: 'Closed Mondays.', budget: '₹50' },

            { name: 'Peace Pagoda', type: 'spiritual', desc: 'Japanese Buddhist stupa. Serene.', tip: 'Panoramic views.', budget: 'Free' },

            { name: 'Rock Garden', type: 'park', desc: 'Terraced garden. Waterfalls.', tip: 'Good for walks.', budget: '₹10' },

            { name: 'Observatory Hill', type: 'spiritual', desc: 'Makalay temple. Mountain views.', tip: 'Best sunset point.', budget: 'Free' }

        ],

        packing: {'climate':'Cool (5-25C), foggy mornings, cold snowy winters (-2 to 8C)','dress':'Warm layers, heavy woolens winter, light jacket summer, rain gear','shoes':'Trekking boots, waterproof shoes, comfortable walking shoes','medicine':'Cold medicine, sunscreen, lip balm, basic first-aid','comfort':'Thermos, warm socks, gloves, rain poncho','snacks':'Momos, thukpa, Darjeeling tea, dry fruits'},

        food: ['Momos everywhere', 'Thukpa', 'Darjeeling Tea at tea houses', 'Sel Roti at local shops', 'Chowmein at Keventers', 'Chinese at Hong Kong Restaurant'],

        hotels: [{ name: 'Mayfair Darjeeling', budget: 'Luxury ₹10K+', rating: '4.6' }, { name: 'Windamere Hotel', budget: 'Premium ₹6K+', rating: '4.5' }, { name: 'Hotel Sinclairs', budget: 'Premium ₹4K+', rating: '4.2' }, { name: 'Zostel Darjeeling', budget: 'Budget ₹400-1000', rating: '4.0' }],

        transport: ['Toy Train', 'Shared jeeps', 'Walking', 'Taxi', 'Ropeway'],

        tips: ['Wake 4 AM for Tiger Hill sunrise', 'Carry warm clothes even in summer', 'Buy tea as souvenir', 'Toy train ride is a must']

    },

    srinagar: {

        name: 'Srinagar', state: 'Jammu & Kashmir', bestTime: 'March to October',

        tagline: 'Paradise on Earth — houseboats, gardens, and Dal Lake',

        places: [

            { name: 'Dal Lake', type: 'nature', desc: 'Iconic lake. Shikara rides, floating markets.', tip: 'Sunrise shikara ride.', budget: '₹500-1000 shikara' },

            { name: 'Mughal Gardens', type: 'park', desc: 'Nishat, Shalimar, Chashme Shahi.', tip: 'All three in one day.', budget: '₹50 each' },

            { name: 'Nigeen Lake', type: 'nature', desc: 'Quieter alternative to Dal Lake.', tip: 'Houseboat stays.', budget: 'Varies' },

            { name: 'Shankaracharya Temple', type: 'spiritual', desc: 'Ancient hilltop temple. Valley views.', tip: '250 steps to top.', budget: 'Free' },

            { name: 'Pari Mahal', type: 'heritage', desc: 'Mughal garden school. Terraced gardens.', tip: 'Evening light.', budget: '₹20' },

            { name: 'Hazratbal Shrine', type: 'spiritual', desc: 'White marble mosque on Dal Lake.', tip: 'Peaceful setting.', budget: 'Free' },

            { name: 'Floating Vegetable Market', type: 'market', desc: 'Early morning floating market on Dal Lake.', tip: 'Start 6 AM.', budget: 'Free' },

            { name: 'Gulmarg Gondola', type: 'nature', desc: 'World\'s highest cable car. Skiing.', tip: '2 hours from Srinagar.', budget: '₹700 gondola' }

        ],

        packing: {'climate':'Pleasant (10-25C summer), cold snowy winters (-2 to 10C)','dress':'Warm layers even summer, heavy woolens winter, rain gear monsoon','shoes':'Trekking boots, waterproof shoes, comfortable walking shoes','medicine':'Cold medicine, sunscreen, basic first-aid','comfort':'Thermos, warm clothing, rain gear','snacks':'Kahwa tea, dry fruits, local wazwan'},

        food: ['Rogan Josh at Ahdoos', 'Dum Aloo at Matamaal', 'Kahwa tea everywhere', 'Sheermal at local bakeries', 'Wazwan feast (traditional)', 'Noshe Doodh at tea shops'],

        hotels: [{ name: 'The Lalit Grand Palace', budget: 'Luxury ₹12K+', rating: '4.7' }, { name: 'Houseboats', budget: 'Premium ₹5K-15K', rating: '4.5' }, { name: 'Hotel Heevan', budget: 'Premium ₹4K+', rating: '4.3' }, { name: 'Zostel Srinagar', budget: 'Budget ₹400-1200', rating: '4.1' }],

        transport: ['Shikara on Dal Lake', 'Auto-rickshaw', 'Taxi', 'Walking', 'Shared sumos'],

        tips: ['Stay on a houseboat at least one night', 'Check security advisories before visit', 'Carry cash — ATMs unreliable', 'Gulmarg gondola needs advance booking']

    },

    amritsar: {

        name: 'Amritsar', state: 'Punjab', bestTime: 'October to March',

        tagline: 'Spiritual Heart of Sikhism — Golden Temple city',

        places: [

            { name: 'Golden Temple', type: 'spiritual', desc: 'Holiest Sikh shrine. Gold-plated. Langar feeds 50,000 daily.', tip: 'Visit at night when lit.', budget: 'Free' },

            { name: 'Jallianwala Bagh', type: 'monument', desc: '1919 massacre memorial. Bullet marks visible.', tip: 'Emotionally powerful.', budget: 'Free' },

            { name: 'Wagah Border', type: 'landmark', desc: 'India-Pakistan border ceremony.', tip: 'Reach 2 hours early.', budget: 'Free' },

            { name: 'Partition Museum', type: 'museum', desc: 'Tales of 1947 partition. Moving stories.', tip: 'Allow 2-3 hours.', budget: '₹10' },

            { name: 'Gobindgarh Fort', type: 'heritage', desc: '200-year-old fort. Museum, light show.', tip: 'Evening light show.', budget: '₹150' },

            { name: 'Hall Bazaar', type: 'market', desc: 'Traditional market. Phulkari, juttis.', tip: 'Haggle for souvenirs.', budget: 'Free' },

            { name: 'Durgiana Temple', type: 'spiritual', desc: 'Hindu temple similar to Golden Temple.', tip: 'Evening visit.', budget: 'Free' },

            { name: 'Ram Tirath', type: 'spiritual', desc: 'Ancient site. Birthplace of Luv and Kush.', tip: 'Annual fair in November.', budget: 'Free' }

        ],

        packing: {'climate':'Extreme (0-45C), hot summers, cold foggy winters, pleasant Oct-Mar','dress':'Light cotton summer, heavy woolens winter, head covering for Golden Temple','shoes':'Comfortable walking shoes, slip-ons for temple','medicine':'Sunscreen, ORS, cold medicine, basic first-aid','comfort':'Water bottle, head covering, warm shawl winter','snacks':'Amritsari kulcha, lassi, dry fruits'},

        food: ['Langar at Golden Temple (free!)', 'Amritsari Kulcha at Kulcha Land', 'Chole at Bharawan Da Dhaba', 'Lassi at Ahuja Milk Bhai', 'Jalebi at Old City', 'Fish at Makhan Fish Corner'],

        hotels: [{ name: 'Taj Swarna', budget: 'Luxury ₹8K+', rating: '4.6' }, { name: 'Hyatt Amritsar', budget: 'Luxury ₹7K+', rating: '4.5' }, { name: 'Hotel Gold Palace', budget: 'Premium ₹3K+', rating: '4.0' }, { name: 'Zostel Amritsar', budget: 'Budget ₹400-1000', rating: '4.1' }],

        transport: ['Auto-rickshaw', 'Cycle-rickshaw', 'Uber/Ola', 'Walking (old city)', 'Bus'],

        tips: ['Golden Temple langar is a must — free meal for all', 'Cover your head at Golden Temple', 'Wagah border ceremony starts 4 PM', 'Try the kulcha-chole breakfast']

    },

    rishikesh: {

        name: 'Rishikesh', state: 'Uttarakhand', bestTime: 'September to November, February to May',

        tagline: 'Yoga Capital of the World — spirituality meets adventure',

        places: [

            { name: 'Laxman Jhula', type: 'landmark', desc: 'Iconic suspension bridge over Ganges.', tip: 'Best at sunset.', budget: 'Free' },

            { name: 'Ram Jhula', type: 'landmark', desc: 'Larger suspension bridge. Markets nearby.', tip: 'Explore Swarg Ashram.', budget: 'Free' },

            { name: 'Ganga Aarti', type: 'spiritual', desc: 'Evening ceremony at Parmarth Niketan.', tip: 'Reach by 5:30 PM.', budget: 'Free' },

            { name: 'Beatles Ashram', type: 'heritage', desc: 'Where Beatles stayed in 1968. Meditation caves.', tip: 'Allow 2 hours.', budget: '₹150' },

            { name: 'Neelkanth Mahadev', type: 'spiritual', desc: 'Shiva temple in forested hills.', tip: '30km drive. steep climb.', budget: 'Free' },

            { name: 'River Rafting', type: 'adventure', desc: 'White water rafting on Ganges. Grade 1-4.', tip: 'Book with certified operators.', budget: '₹1000-3000' },

            { name: 'Triveni Ghat', type: 'spiritual', desc: 'Confluence of 3 rivers. Evening aarti.', tip: 'Peaceful morning visit.', budget: 'Free' },

            { name: 'Neer Garh Waterfall', type: 'nature', desc: 'Two-tier waterfall. Short trek.', tip: 'Monsoon for best flow.', budget: '₹30' }

        ],

        packing: {'climate':'Pleasant (15-35C), warm summers, cool winters (5-20C), monsoon Jul-Sep','dress':'Comfortable cotton, modest for temples/ashrams, light layers winter','shoes':'Trekking shoes (for rafting/trekking), comfortable sandals','medicine':'Sunscreen, basic first-aid, motion sickness pills (rafting)','comfort':'Waterproof bag, power bank, flashlight','snacks':'Dry fruits, banana chips, energy bars'},

        food: ['Aloo Puri at Chotiwala', 'Thali at Gandhaati Restaurant', 'Pizza at Little Buddha Café', 'Juices at Ganga Beach', 'Indian at Chula', 'Lassi at Revision'],

        hotels: [{ name: 'Taj Rishikesh', budget: 'Luxury ₹12K+', rating: '4.7' }, { name: 'EllBee Ganga View', budget: 'Premium ₹5K+', rating: '4.4' }, { name: 'Hotel Ganga Kinare', budget: 'Premium ₹4K+', rating: '4.3' }, { name: 'Zostel Rishikesh', budget: 'Budget ₹400-1000', rating: '4.2' }],

        transport: ['Walking', 'Auto-rickshaw', 'Local bus', 'Bike rental', 'Dehradun airport (35km)'],

        tips: ['Best for yoga retreats — try 200hr course', 'Bungee jumping at Mohan Chatti', 'Visit during International Yoga Festival (Mar)', 'Cafes along Ganga are magical']

    },

    mysore: {

        name: 'Mysore', state: 'Karnataka', bestTime: 'October to March',

        tagline: 'City of Palaces — royal elegance and silk sarees',

        places: [

            { name: 'Mysore Palace', type: 'heritage', desc: 'Stunning Indo-Saracenic palace. Illuminated Sundays.', tip: 'Sunday evening illumination.', budget: '₹70' },

            { name: 'Chamundi Hills', type: 'spiritual', desc: 'Chamundeshwari temple. City panoramic view.', tip: 'Sunset is best.', budget: 'Free' },

            { name: 'Brindavan Gardens', type: 'park', desc: 'Terraced gardens. Musical fountain.', tip: 'Fountain at 7 PM.', budget: '₹15' },

            { name: 'Mysore Zoo', type: 'attraction', desc: 'One of oldest zoos. Well-maintained.', tip: 'Closed Tuesdays.', budget: '₹50' },

            { name: 'St. Philomena\'s Church', type: 'heritage', desc: 'Neo-Gothic cathedral. 2nd tallest in Asia.', tip: 'Beautiful interior.', budget: 'Free' },

            { name: 'Karanji Lake', type: 'nature', desc: 'Butterfly park, bird sanctuary.', tip: 'Morning walk.', budget: '₹30' },

            { name: 'Devaraja Market', type: 'market', desc: 'Traditional market. Sandalwood, silk.', tip: 'Buy Mysore silk.', budget: 'Free' },

            { name: 'Rail Museum', type: 'museum', desc: 'Royal rail carriages. Vintage locomotives.', tip: 'Kids love it.', budget: '₹20' }

        ],

        packing: {'climate':'Pleasant (20-35C), cool winters (15-25C), monsoon Jun-Oct','dress':'Light cotton, traditional dress optional for palace, modest for temples','shoes':'Comfortable walking shoes, sandals','medicine':'Sunscreen, mosquito repellent, basic first-aid','comfort':'Water bottle, umbrella, power bank','snacks':'Mysore pak, dry fruits, filter coffee'},

        food: ['Mysore Pak at Guru Sweets', 'Masala Dosa at Vinayaka', 'Mysore Bonda at Park View', 'Filter Coffee at Coffee Day', 'Thali at Hotel RRR', 'Non-veg at Parkview'],

        hotels: [{ name: 'Radisson Blu Plaza', budget: 'Luxury ₹7K+', rating: '4.5' }, { name: 'The Gateway Hotel', budget: 'Premium ₹5K+', rating: '4.4' }, { name: 'Southern Star', budget: 'Premium ₹3K+', rating: '4.2' }, { name: 'Zostel Mysore', budget: 'Budget ₹400-1000', rating: '4.0' }],

        transport: ['Auto-rickshaw', 'City bus', 'Uber/Ola', 'Walking (old city)', 'Cycle-rickshaw'],

        tips: ['Sunday palace illumination is spectacular', 'Dasara festival (Oct) is grand', 'Buy Mysore silk and sandalwood', 'Day trip to Coorg (3h)']

    },

    hampi: {

        name: 'Hampi', state: 'Karnataka', bestTime: 'October to February',

        tagline: 'Ruins of Vijayanagara — boulder-strewn wonderland',

        places: [

            { name: 'Virupaksha Temple', type: 'spiritual', desc: 'Active temple. Insanction pillar.', tip: 'Evening aarti.', budget: 'Free' },

            { name: 'Vijaya Vittala Temple', type: 'monument', desc: 'Stone chariot and musical pillars.', tip: 'Famous stone chariot.', budget: '₹40' },

            { name: 'Hampi Bazaar', type: 'heritage', desc: 'Ancient market street. Ruins.', tip: 'Walk through history.', budget: 'Free' },

            { name: 'Matanga Hill', type: 'nature', desc: 'Best sunset point in Hampi.', tip: 'Climb 30 minutes.', budget: 'Free' },

            { name: 'Hemakuta Hill', type: 'nature', desc: 'Sunrise point. Group of temples.', tip: 'Easy climb.', budget: 'Free' },

            { name: 'Royal Enclosure', type: 'monument', desc: 'Queen\'s bath, elephant stables.', tip: 'Large complex.', budget: '₹40' },

            { name: 'Coracle Ride', type: 'adventure', desc: 'Traditional round boat on Tungabhadra.', tip: 'Sunset ride.', budget: '₹100' },

            { name: 'Anegundi Village', type: 'cultural', desc: 'Heritage village across the river.', tip: 'Walk or coracle across.', budget: 'Free' }

        ],

        packing: {'climate':'Hot (25-38C), pleasant Nov-Feb, monsoon Jun-Oct','dress':'Light cotton, comfortable for climbing rocks, modest for temples','shoes':'Sturdy walking/rock-climbing shoes, sandals','medicine':'Sunscreen SPF50+, ORS, basic first-aid','comfort':'Water bottle (carry extra!), hat, umbrella','snacks':'Dry fruits, bananas, energy bars'},

        food: ['Thali at Mango Tree', 'Pizza at Goan Corner', 'Banana Pancakes at German Bakery', 'Lassi at various cafes', 'South Indian at Virupaksha Bazaar', 'Smoothies at Laughing Buddha'],

        hotels: [{ name: 'Evolve Back Hampi', budget: 'Luxury ₹25K+', rating: '4.9' }, { name: 'Clarks Inn', budget: 'Premium ₹4K+', rating: '4.2' }, { name: 'Goan Corner', budget: 'Budget ₹800-2000', rating: '4.0' }, { name: 'Zostel Hampi', budget: 'Budget ₹400-1000', rating: '4.1' }],

        transport: ['Auto-rickshaw', 'Rented bicycle/moped', 'Walking', 'Coracle', 'Bus to Hospet (13km)'],

        tips: ['Rent a bicycle to explore', 'Carry lots of water', 'Hampi is huge — 2-3 days minimum', 'Sunrise from Hemakuta, sunset from Matanga']

    },

    khajuraho: {

        name: 'Khajuraho', state: 'Madhya Pradesh', bestTime: 'October to March',

        tagline: 'Temples of Passion — medieval erotic sculptures',

        places: [

            { name: 'Western Group Temples', type: 'monument', desc: 'UNESCO site. Kandariya Mahadeva.', tip: 'Sound & light show evening.', budget: '₹40' },

            { name: 'Eastern Group Temples', type: 'monument', desc: 'Jain and Hindu temples.', tip: 'Less crowded.', budget: 'Free' },

            { name: 'Khajuraho Dance Festival', type: 'cultural', desc: 'Feb classical dance festival.', tip: 'Book early.', budget: 'Free outdoor' },

            { name: 'Raneh Falls', type: 'nature', desc: 'Granite canyon waterfall.', tip: 'Monsoon for best flow.', budget: '₹25' },

            { name: 'Panna National Park', type: 'nature', desc: 'Tiger reserve. Jeep safari.', tip: 'Morning safari.', budget: '₹1500' },

            { name: 'Archaeological Museum', type: 'museum', desc: 'Sculptures and artifacts.', tip: 'Good context for temples.', budget: '₹10' },

            { name: 'Vishwanath Temple', type: 'monument', desc: 'Nandi bull statue entrance.', tip: 'Well-preserved.', budget: '₹40' },

            { name: 'Lakshmi Temple', type: 'spiritual', desc: 'Small but beautiful temple.', tip: 'Quick visit.', budget: '₹40' }

        ],

        packing: {'climate':'Hot (25-42C), pleasant Oct-Mar, monsoon Jul-Sep','dress':'Light cotton, comfortable clothing for temple visits','shoes':'Comfortable walking shoes, sandals','medicine':'Sunscreen, ORS, mosquito repellent','comfort':'Water bottle, hat, umbrella, sunglasses','snacks':'Dry fruits, local food, energy bars'},

        food: ['Thali at Local restaurants', 'Indian at Madhu Kitchen', 'Continental at Raja Café', 'Chaat near temples', 'South Indian at SSE Café', 'Lassi at various'],

        hotels: [{ name: 'Taj Chandela', budget: 'Luxury ₹8K+', rating: '4.6' }, { name: 'Radisson Blu', budget: 'Premium ₹5K+', rating: '4.4' }, { name: 'Hotel Clarks', budget: 'Premium ₹3K+', rating: '4.1' }, { name: 'Zostel Khajuraho', budget: 'Budget ₹400-1000', rating: '4.0' }],

        transport: ['Auto-rickshaw', 'Bicycle rental', 'Walking', 'Taxi', 'Train from Jhansi (3h)'],

        tips: ['Visit Western Group at dawn for fewer crowds', 'Sound & light show at 7 PM is excellent', 'Combine with Panna safari', '2 days is enough']

    },

    leh: {

        name: 'Leh', state: 'Ladakh', bestTime: 'June to September',

        tagline: 'Land of High Passes — otherworldly landscapes',

        places: [

            { name: 'Pangong Lake', type: 'nature', desc: 'Iconic blue lake at 14,270ft. Bollywood famous.', tip: 'Overnight camp by lake.', budget: '₹1500 camp' },

            { name: 'Nubra Valley', type: 'nature', desc: 'Double-humped camel valley. Sand dunes.', tip: '2-day trip minimum.', budget: '₹3000 package' },

            { name: 'Leh Palace', type: 'heritage', desc: '17th century palace. City views.', tip: 'Sunset from top.', budget: '₹25' },

            { name: 'Magnetic Hill', type: 'landmark', desc: 'Gravity-defying hill. Optical illusion?', tip: 'On way to Gurudwara.', budget: 'Free' },

            { name: 'Shanti Stupa', type: 'spiritual', desc: 'White-domed stupa. Panoramic views.', tip: 'Best sunrise point.', budget: 'Free' },

            { name: 'Thiksey Monastery', type: 'spiritual', desc: 'Mini Potala Palace. Tibetan Buddhism.', tip: '6:30 AM prayer.', budget: '₹50' },

            { name: 'Khardung La', type: 'nature', desc: 'World\'s highest motorable pass (17,982ft).', tip: 'Altitude sickness risk.', budget: 'Free' },

            { name: 'Hemis Monastery', type: 'spiritual', desc: 'Largest monastery. Festival in June.', tip: 'June festival is spectacular.', budget: '₹50' }

        ],

        packing: {'climate':'Extreme cold (-30C to 15C), high altitude, dry desert climate','dress':'Heavy woolens, thermal innerwear, windproof jacket, sunglasses','shoes':'Trekking boots, warm socks, sturdy walking shoes','medicine':'Altitude sickness pills (Diamox), sunscreen SPF50+, lip balm, oxygen canisters','comfort':'Thermos, hand warmers, warm gloves, sleeping bag liner','snacks':'Thukpa, momos, butter tea, energy bars'},

        food: ['Thukpa at Chopsticks', 'Momos at Tibetan Kitchen', 'Skyu at Local Kitchen', 'Butter Tea everywhere', 'Tingmo at Alchi Kitchen', 'Momos and noodles'],

        hotels: [{ name: 'The Grand Dragon', budget: 'Luxury ₹10K+', rating: '4.6' }, { name: 'Hotel Zen Ladakh', budget: 'Premium ₹4K+', rating: '4.3' }, { name: 'Hotel Ladakh Palace', budget: 'Premium ₹3K+', rating: '4.2' }, { name: 'Zostel Leh', budget: 'Budget ₹500-1500', rating: '4.0' }],

        transport: ['Rented bike (best!)', 'Shared taxi', 'Auto-rickshaw', 'Bus', 'Private taxi for day trips'],

        tips: ['Acclimatize 2-3 days before anything', 'Carry oxygen if going above 14,000ft', 'Bike ride on Khardung La is bucket list', 'Carry cash — no ATMs in remote areas']

    },

    hderabad: {

        name: 'Hyderabad', state: 'Telangana', bestTime: 'October to March',

        tagline: 'City of Pearls and Biryani — Nizam\'s grand legacy',

        places: [

            { name: 'Charminar', type: 'monument', desc: 'Iconic 1591 monument. Four minarets.', tip: 'Climb for Laad Bazaar view.', budget: '₹25' },

            { name: 'Golconda Fort', type: 'monument', desc: 'Medieval fortress. Acoustic engineering marvel.', tip: 'Sound & light show.', budget: '₹25' },

            { name: 'Hussain Sagar Lake', type: 'landmark', desc: 'Buddha statue in middle of lake.', tip: 'Boat ride at sunset.', budget: 'Free' },

            { name: 'Salar Jung Museum', type: 'museum', desc: 'One man\'s collection. World\'s largest.', tip: 'Allow full day.', budget: '₹20' },

            { name: 'Chowmahalla Palace', type: 'heritage', desc: 'Nizam\'s palace. Vintage car collection.', tip: 'Well-maintained.', budget: '₹100' },

            { name: 'Birla Mandir', type: 'spiritual', desc: 'White marble temple on hill.', tip: 'City views at night.', budget: 'Free' },

            { name: 'Laad Bazaar', type: 'market', desc: 'Bangle market near Charminar.', tip: 'Buy lac bangles.', budget: 'Free' },

            { name: 'Ramoji Film City', type: 'entertainment', desc: 'World\'s largest film studio complex.', tip: 'Full day needed.', budget: '₹1200' }

        ],

        packing: { climate: "Cold (-30 to 20C), dry, high altitude UV", dress: "Heavy woolens, thermal layers, waterproof jacket, sunglasses essential", shoes: "Insulated waterproof boots, trekking shoes, warm socks", medicine: "Altitude sickness Diamox, SPF50+ sunscreen, lip balm, first-aid", comfort: "Thermal innerwear, gloves, beanie, balaclava, oxygen can, power bank", snacks: "Dry fruits, nuts, energy bars, glucose, warm liquids" },

        food: ['Biryani at Paradise/Shah Ghouse', 'Haleem during Ramadan', 'Irani Chai at Nimrah', 'Double Ka Meetha at Hotel', 'Luqmi at Hotel Nayaab', 'Chicken 65 — invented here!'],

        hotels: [{ name: 'Taj Falaknuma Palace', budget: 'Luxury ₹15K+', rating: '4.8' }, { name: 'Park Hyatt', budget: 'Luxury ₹10K+', rating: '4.7' }, { name: 'ITC Kakatiya', budget: 'Premium ₹6K+', rating: '4.5' }, { name: 'Zostel Hyderabad', budget: 'Budget ₹500-1500', rating: '4.0' }],

        transport: ['Metro', 'Auto-rickshaw', 'Uber/Ola', 'City bus', 'Cycle-rickshaw old city'],

        tips: ['Biryani at Paradise is overrated — try Shah Ghouse', 'Old city walk is incredible', 'Ramoji Film City needs full day', 'Buy pearls as souvenirs']

    },

    ahmedabad: {

        name: 'Ahmedabad', state: 'Gujarat', bestTime: 'November to February',

        tagline: 'Heritage City — Gandhi\'s home and textile capital',

        places: [

            { name: 'Sabarmati Ashram', type: 'heritage', desc: 'Gandhi\'s home. Museum of independence.', tip: 'Peaceful, reflective.', budget: 'Free' },

            { name: 'Adalaj Stepwell', type: 'monument', desc: '5-story octagonal stepwell. Islamic architecture.', tip: 'Cool inside even in summer.', budget: 'Free' },

            { name: 'Jama Masjid', type: 'spiritual', desc: 'Ahmedabad\'s largest mosque. Yellow sandstone.', tip: 'Beautiful interior.', budget: 'Free' },

            { name: 'Kankaria Lake', type: 'landmark', desc: 'Circular lake. Zoo, toy train, amusement.', tip: 'Evening stroll.', budget: '₹25' },

            { name: 'Calico Museum', type: 'museum', desc: 'World\'s finest textile collection.', tip: 'Guided tour only.', budget: 'Free' },

            { name: 'Sidi Saiyyed Mosque', type: 'spiritual', desc: 'Famous stone lattice window (tree of life).', tip: 'Symbol of Ahmedabad.', budget: 'Free' },

            { name: 'Heritage Walk', type: 'cultural', desc: 'Walk through Pols (traditional neighborhoods).', tip: 'Start at 8 AM from Calico Museum.', budget: '₹200 guided' },

            { name: 'Science City', type: 'attraction', desc: 'IMAX theatre, space museum.', tip: 'Great for kids.', budget: '₹100' }

        ],

        food: ['Dhokla at various', 'Khaman at Jagdish', 'Undhiyu (winter)', 'Fafda-Jalebi breakfast', 'Gujarati Thali at Agashiye', 'Khandvi at Mothers Recipe'],

        hotels: [{ name: 'Taj Skyline', budget: 'Luxury ₹8K+', rating: '4.6' }, { name: 'Hyatt Regency', budget: 'Luxury ₹7K+', rating: '4.5' }, { name: 'Hotel Comfort Inn', budget: 'Premium ₹3K+', rating: '4.0' }, { name: 'Zostel Ahmedabad', budget: 'Budget ₹400-1000', rating: '4.0' }],

        transport: ['BRTS Bus', 'Auto-rickshaw', 'Uber/Ola', 'Walking (old city)', 'Metro'],

        tips: ['Heritage walk is essential', 'Try Gujarati Thali — unlimited food!', 'Diwali celebrations are spectacular', 'Combine with Rann of Kutch (5h)']
        ,
        packing: {'climate':'Very hot summers (45C+), mild pleasant winters (10-25C)','dress':'Light cotton clothing, sun-protective hats','shoes':'Breathable walking shoes, sandals','medicine':'Sunscreen SPF50+, ORS sachets','comfort':'Cotton towel, water bottle, electrolyte packets','snacks':'Dry snacks, water'},

    },

    lucknow: {

        name: 'Lucknow', state: 'Uttar Pradesh', bestTime: 'October to March',

        tagline: 'City of Nawabs — tehzeeb (culture) and kebabs',

        places: [

            { name: 'Bara Imambara', type: 'monument', desc: 'Grand Nawabi architecture. Bhool Bhulaiya maze.', tip: 'Hire guide for maze.', budget: '₹50' },

            { name: 'Rumi Darwaza', type: 'monument', desc: 'Awadhi architecture gateway. Iconic.', tip: 'Best at night lit up.', budget: 'Free' },

            { name: 'Chota Imambara', type: 'monument', desc: 'Crystal chandeliers, gold throne.', tip: 'Stunning interior.', budget: '₹25' },

            { name: 'Hazratganj', type: 'market', desc: 'Colonial-era shopping street.', tip: 'For kebabs and shopping.', budget: 'Free' },

            { name: 'British Residency', type: 'heritage', desc: '1857 siege site. Ruins and cemetery.', tip: 'Historically significant.', budget: '₹25' },

            { name: 'Clock Tower', type: 'landmark', desc: 'Husainabad Clock Tower. Victorian Gothic.', tip: 'Photogenic.', budget: 'Free' },

            { name: 'Ambedkar Park', type: 'park', desc: 'Grand memorial park. Stone elephants.', tip: 'Beautiful at night.', budget: 'Free' },

            { name: 'Chowk', type: 'market', desc: 'Old Lucknow market. Chikankari capital.', tip: 'Buy chikankari embroidery.', budget: 'Free' }

        ],

        packing: {'climate':'Extreme heat (40-46C summer), foggy cold winters (2-15C)','dress':'Light cotton summer, heavy woolens winter, moderate clothing','shoes':'Comfortable walking shoes, sandals','medicine':'Sunscreen, ORS, mosquito repellent, cold medicine winter','comfort':'Water bottle, umbrella, warm shawl winter','snacks':'Kebabs, biryani, dry fruits'},

        food: ['Galouti Kebab at Dastarkhwan', 'Tunday Kebab at Tunday Kababi', 'Biryani at Idrees', 'Chaat at Royal Cafe', 'Sheermal at Chowk', 'Roomali Roti at Sakhawat'],

        hotels: [{ name: 'Taj Mahal Lucknow', budget: 'Luxury ₹8K+', rating: '4.6' }, { name: 'Vivanta Lucknow', budget: 'Luxury ₹6K+', rating: '4.5' }, { name: 'Hotel Clarks Avadh', budget: 'Premium ₹4K+', rating: '4.2' }, { name: 'Zostel Lucknow', budget: 'Budget ₹400-1000', rating: '4.0' }],

        transport: ['Metro', 'Auto-rickshaw', 'Uber/Ola', 'Cycle-rickshaw', 'Walking (Chowk area)'],

        tips: ['Lucknow is a foodie paradise', 'Bhool Bhulaiya maze is tricky — follow guide', 'Buy chikankari embroidery souvenirs', 'Nawabi hospitality is legendary']

    },

    pondicherry: {

        name: 'Pondicherry', state: 'Tamil Nadu', bestTime: 'October to March',

        tagline: 'French Riviera of the East — colonial charm meets spirituality',

        places: [

            { name: 'Promenade Beach', type: 'beach', desc: '1.5km rock beach. French quarter nearby.', tip: 'Morning walk.', budget: 'Free' },

            { name: 'Auroville', type: 'spiritual', desc: 'Experimental township. Matrimandir.', tip: 'Book Matrimandir visit online.', budget: 'Free' },

            { name: 'French Quarter', type: 'cultural', desc: 'Colonial buildings, cafes, boutiques.', tip: 'Walk or cycle.', budget: 'Free' },

            { name: 'Aurobindo Ashram', type: 'spiritual', desc: 'Spiritual community. Meditation.', tip: 'Silence maintained.', budget: 'Free' },

            { name: 'Paradise Beach', type: 'beach', desc: 'Boat ride to island beach.', tip: 'Catamaran ride.', budget: '₹200 boat' },

            { name: 'Chunnambar Boat House', type: 'nature', desc: 'Backwater boat rides.', tip: 'Sunset cruise.', budget: '₹150' },

            { name: 'Rock Beach', type: 'beach', desc: 'Rocky coastline. Evening vibes.', tip: 'Street food at night.', budget: 'Free' },

            { name: 'Botanical Garden', type: 'park', desc: 'French-era garden. 280+ plant species.', tip: 'Quick visit.', budget: '₹10' }

        ],

        packing: {'climate':'Hot humid (25-38C), pleasant Oct-Feb, monsoon Oct-Dec','dress':'Light cotton, beachwear, French Quarter casual wear','shoes':'Comfortable walking shoes, flip-flops','medicine':'Sunscreen, mosquito repellent, ORS, basic first-aid','comfort':'Beach towel, hat, sunglasses, water bottle','snacks':'Croissants, filter coffee, seafood'},

        food: ['Croissants at Baker Street', 'French cuisine at Carte Blanche', 'South Indian at Murugan', 'Seafood at The Promenade', 'Crepes at Indian Kafe', 'Filter Coffee everywhere'],

        hotels: [{ name: 'The Promenade', budget: 'Luxury ₹10K+', rating: '4.7' }, { name: 'Palais de Mahe', budget: 'Premium ₹6K+', rating: '4.6' }, { name: 'Hotel Atithi', budget: 'Premium ₹3K+', rating: '4.2' }, { name: 'Zostel Pondicherry', budget: 'Budget ₹400-1200', rating: '4.1' }],

        transport: ['Rented bicycle/scooter (best)', 'Auto-rickshaw', 'Walking (French Quarter)', 'Uber/Ola (limited)', 'Bus'],

        tips: ['Rent a scooter to explore', 'French Quarter is best walked/cycled', 'Matrimandir visit needs advance booking', 'Combine with Mahabalipuram day trip']

    },

    jodhpur: {

        name: 'Jodhpur', state: 'Rajasthan', bestTime: 'October to March',

        tagline: 'Blue City — Mehrangarh fortress crowns the skyline',

        places: [

            { name: 'Mehrangarh Fort', type: 'monument', desc: 'Massive fortress. One of India\'s finest museums.', tip: 'Audio guide included.', budget: '₹200' },

            { name: 'Blue City Walk', type: 'cultural', desc: 'Brahmpuri neighborhood. Blue houses.', tip: 'Guided walk recommended.', budget: 'Free' },

            { name: 'Jaswant Thada', type: 'monument', desc: 'White marble cenotaph. "Taj Mahal of Marwar".', tip: 'Golden hour light.', budget: '₹30' },

            { name: 'Clock Tower & Sardar Market', type: 'market', desc: 'Vibrant bazaar. Spices, textiles.', tip: 'Buy spices and bandhani.', budget: 'Free' },

            { name: 'Umaid Bhawan Palace', type: 'heritage', desc: 'Still home to Jodhpur royal family. Part museum.', tip: 'Don\'t miss the vintage car collection.', budget: '₹30 museum' },

            { name: 'Mandore Gardens', type: 'park', desc: 'Cenotaphs of Marwar rulers. Beautiful gardens.', tip: 'Peaceful evening.', budget: 'Free' },

            { name: 'Toorji Ka Jhalra', type: 'monument', desc: 'Stepwell restored by Queen Toorji.', tip: 'Great photo spot.', budget: 'Free' },

            { name: 'Bishnoi Village Safari', type: 'cultural', desc: 'Rural Rajasthan. Wildlife, pottery, weaving.', tip: 'Half day trip.', budget: '₹1000' }

        ],

        packing: {'climate':'Extreme desert heat (25-45C), pleasant winters (7-22C)','dress':'Full cotton/linen covering body, scarf for sand, light layers winter','shoes':'Closed sandals/boots, comfortable walking shoes','medicine':'Sunscreen SPF50+, ORS, lip balm, eye drops','comfort':'Scarf/dupatta, sunglasses, water bottle (2L+), hat/cap','snacks':'Dal baati churma, mirchi vada, pyaaz kachori'},

        food: ['Mirchi Bada at Jodhpur Sweets', 'Mawa Kachori at Jhankar', 'Dal Bati at Gypsy Restaurant', 'Lassi at Mishrilal', 'Pyaaz Kachori at Patel', 'Street food at Clock Tower'],

        hotels: [{ name: 'Umaid Bhawan Palace', budget: 'Luxury ₹25K+', rating: '4.9' }, { name: 'RAAS Jodhpur', budget: 'Luxury ₹12K+', rating: '4.8' }, { name: 'Indana Palace', budget: 'Premium ₹5K+', rating: '4.5' }, { name: 'Zostel Jodhpur', budget: 'Budget ₹400-1200', rating: '4.1' }],

        transport: ['Auto-rickshaw', 'Walking (blue city)', 'Uber/Ola', 'Taxi for fort', 'Cycle-rickshaw'],

        tips: ['Mehrangarh Fort is jaw-dropping — give it 3 hours', 'Blue City walk is magical at dawn', 'Buy bandhani and spices at Sardar Market', 'Desert safari available (Thar Desert)']

    },

    ooty: {

        name: 'Ooty', state: 'Tamil Nadu', bestTime: 'October to June',

        tagline: 'Queen of Hill Stations — Nilgiri tea gardens and pleasant weather',

        places: [

            { name: 'Nilgiri Mountain Railway', type: 'heritage', desc: 'UNESCO Toy Train. Steam engine.', tip: 'Book well in advance.', budget: '₹250' },

            { name: 'Botanical Garden', type: 'park', desc: '1848 garden. 650+ plant species.', tip: 'Fossilized tree trunk.', budget: '₹30' },

            { name: 'Ooty Lake', type: 'nature', desc: 'Boating on serene lake.', tip: 'Pedal boat.', budget: '₹200' },

            { name: 'Doddabetta Peak', type: 'nature', desc: 'Highest point in Nilgiris. Telescope house.', tip: 'Clear days for views.', budget: '₹15' },

            { name: 'Tea Museum', type: 'museum', desc: 'History of tea in Nilgiris. Tasting.', tip: 'Buy fresh tea.', budget: '₹100' },

            { name: 'Rose Garden', type: 'park', desc: '20,000 rose varieties.', tip: 'Blooms Apr-May.', budget: '₹30' },

            { name: 'Pykara Falls', type: 'nature', desc: 'Waterfall and lake. Boating.', tip: '20km from Ooty.', budget: '₹20' },

            { name: 'Coonoor', type: 'nature', desc: 'Tea town. Sim\'s Park.', tip: 'Toy train stops here.', budget: 'Free' }

        ],

        packing: {'climate':'Cool (10-25C year-round), misty mornings, chilly evenings, rain Jun-Sep','dress':'Light woolens, jacket for evenings, rain gear monsoon','shoes':'Comfortable walking shoes for tea estates, waterproof shoes','medicine':'Mosquito repellent, sunscreen, basic medicines','comfort':'Light shawl/cardigan, water bottle, camera','snacks':'Tea estate cafe snacks, homemade chocolates, dry fruits'},

        food: ['Tea at tea shops', 'Chocolate at Kingstar', 'South Indian at Claudius', 'Homemade cakes at bakeries', 'Biryani at Shinkow', 'Eucalyptus oil souvenirs'],

        hotels: [{ name: 'Savoy Hotel', budget: 'Luxury ₹10K+', rating: '4.6' }, { name: 'Sterling Ooty', budget: 'Premium ₹5K+', rating: '4.3' }, { name: 'Hotel Darshan', budget: 'Premium ₹3K+', rating: '4.0' }, { name: 'Zostel Ooty', budget: 'Budget ₹400-1000', rating: '4.0' }],

        transport: ['Toy Train', 'Bus', 'Taxi', 'Auto-rickshaw', 'Walking (town)'],

        tips: ['Toy Train is a must — book 2 weeks ahead', 'Carry warm jacket — always cold', 'Tea plantations everywhere — buy fresh', 'Combine with Coonoor and Kotagiri']

    },

    pushkar: {

        name: 'Pushkar', state: 'Rajasthan', bestTime: 'October to March',

        tagline: 'Sacred Lake Town — pilgrimage meets hippie vibes',

        places: [

            { name: 'Pushkar Lake', type: 'spiritual', desc: 'Sacred lake. 52 ghats. Holy dip.', tip: 'Sunrise is magical.', budget: 'Free' },

            { name: 'Brahma Temple', type: 'spiritual', desc: 'One of few Brahma temples in world.', tip: 'Small but significant.', budget: 'Free' },

            { name: 'Pushkar Camel Fair', type: 'cultural', desc: 'Nov annual fair. Thousands of camels.', tip: 'Book accommodation months ahead.', budget: 'Free' },

            { name: 'Savitri Temple', type: 'spiritual', desc: 'Hilltop temple. Panoramic views.', tip: 'Ropeway or trek.', budget: '₹75 ropeway' },

            { name: 'Varah Ghat', type: 'spiritual', desc: 'Main evening aarti ghat.', tip: 'Attend evening aarti.', budget: 'Free' },

            { name: 'Pushkar Bazaar', type: 'market', desc: 'Leather goods, jewelry, textiles.', tip: 'Bargain is essential.', budget: 'Free' },

            { name: 'Cardamom Cafe', type: 'cultural', desc: 'Rooftop cafe with lake views.', tip: 'Live music evenings.', budget: 'Free entry' },

            { name: 'Rose Garden', type: 'nature', desc: 'Pushkar grows finest roses in India.', tip: 'Buy rose products.', budget: 'Free' }

        ],

        packing: {'climate':'Hot (25-42C summer), pleasant winters (5-22C), monsoon Jul-Sep','dress':'Light cotton, modest clothing for temples (no alcohol/meat)','shoes':'Comfortable walking shoes, sandals','medicine':'Sunscreen SPF50+, ORS, lip balm','comfort':'Water bottle, hat, umbrella, sunglasses','snacks':'Malpua, dry fruits, lassi'},

        food: ['Malpua at corner shops', 'Dal Bati at Sunset Café', 'Thali at Little Italy', 'Pizza at Café Edelweiss', 'Lassi at Rainbow Café', 'Chai at every rooftop'],

        hotels: [{ name: 'The Westin Pushkar', budget: 'Luxury ₹10K+', rating: '4.6' }, { name: 'Inn Seventh Heaven', budget: 'Premium ₹3K+', rating: '4.4' }, { name: 'Hotel Temple View', budget: 'Budget ₹1K-2K', rating: '4.0' }, { name: 'Zostel Pushkar', budget: 'Budget ₹400-1000', rating: '4.1' }],

        transport: ['Walking (town is small)', 'Auto-rickshaw', 'Camel rides', 'Scooter rental', 'Bus from Ajmer (14km)'],

        tips: ['Pushkar Lake holy dip is a spiritual experience', 'Camel Fair (Nov) is world-famous', 'Rooftop cafes for sunset views', 'Pushkar is small — 2 days enough']

    },

    dharamshala: {

        name: 'Dharamshala', state: 'Himachal Pradesh', bestTime: 'March to June, September to November',

        tagline: 'Little Lhasa — Dalai Lama\'s home in the Himalayas',

        places: [

            { name: 'Tsuglagkhang Complex', type: 'spiritual', desc: 'Dalai Lama\'s temple. Tibetan Parliament.', tip: 'Free photography outside.', budget: 'Free' },

            { name: 'McLeod Ganj', type: 'cultural', desc: 'Tibetan settlement. Cafes, shops, monasteries.', tip: 'Walk the main street.', budget: 'Free' },

            { name: 'Bhagsu Waterfall', type: 'nature', desc: 'Beautiful waterfall. Short walk.', tip: 'Bhagsu Nag temple nearby.', budget: 'Free' },

            { name: 'Triund Trek', type: 'adventure', desc: 'Easy Himalayan trek. Spectacular views.', tip: '2 days recommended.', budget: 'Free' },

            { name: 'Namgyal Monastery', type: 'spiritual', desc: 'Largest Tibetan monastery outside Tibet.', tip: 'Morning prayers.', budget: 'Free' },

            { name: 'Kangra Fort', type: 'heritage', desc: 'Oldest fort in India. Stunning valley views.', tip: 'Allow 2 hours.', budget: '₹150' },

            { name: 'Naddi Viewpoint', type: 'nature', desc: 'Panoramic Dhauladhar range views.', tip: 'Sunset point.', budget: 'Free' },

            { name: 'Tibetan Market', type: 'market', desc: 'Handicrafts, thangkas, singing bowls.', tip: 'Buy singing bowls.', budget: 'Free' }

        ],

        packing: {'climate':'Cool (0-25C), cold snowy winters (-2 to 8C), monsoon Jul-Sep','dress':'Warm layers, heavy woolens winter, light jacket summer, rain gear','shoes':'Trekking boots, waterproof shoes, comfortable walking shoes','medicine':'Cold medicine, sunscreen, basic first-aid','comfort':'Thermos, warm socks, gloves, rain poncho','snacks':'Tibetan thukpa, momos, dry fruits'},

        food: ['Thukpa at被告 Lunch Box', 'Momos at Snow Lion', 'Tibetan food at Norbulingka Café', 'Pizza at Jimmy\'s Italian', 'Chai at every cafe', 'Tingmo at local Tibetan shops'],

        hotels: [{ name: 'The Dalai Lama Residency Hotel', budget: 'Premium ₹5K+', rating: '4.5' }, { name: 'Hotel Devs', budget: 'Premium ₹3K+', rating: '4.2' }, { name: 'Snow Lion Residency', budget: 'Premium ₹3K+', rating: '4.3' }, { name: 'Zostel McLeod Ganj', budget: 'Budget ₹400-1200', rating: '4.2' }],

        transport: ['Walking (McLeod Ganj)', 'Auto-rickshaw', 'Bus', 'Taxi', 'Gaggal Airport (15km)'],

        tips: ['Triund trek is amazing — start early', 'Attend a cooking class for Tibetan food', 'Buy singing bowls and thangkas', 'Meditation courses available at monasteries']

    },

    coorg: {

        name: 'Coorg', state: 'Karnataka', bestTime: 'October to May',

        tagline: 'Scotland of India — coffee plantations and misty hills',

        places: [

            { name: 'Abbey Falls', type: 'nature', desc: 'Beautiful waterfall surrounded by coffee estates.', tip: 'Monsoon for best flow.', budget: '₹15' },

            { name: 'Raja\'s Seat', type: 'nature', desc: 'Viewpoint with musical garden.', tip: 'Sunset point.', budget: '₹10' },

            { name: 'Dubare Elephant Camp', type: 'nature', desc: 'Elephant bathing, feeding, and safari.', tip: 'Book river rafting too.', budget: '₹500' },

            { name: 'Namdroling Monastery', type: 'spiritual', desc: 'Tibetan monastery. Golden Temple.', tip: 'Peaceful setting.', budget: 'Free' },

            { name: 'Talacauvery', type: 'spiritual', desc: 'Origin of river Kaveri. Brahmagiri hills.', tip: 'Early morning for views.', budget: 'Free' },

            { name: 'Coffee Plantation Tour', type: 'cultural', desc: 'Walk through coffee estates. Tasting.', tip: 'Stay at a plantation stay.', budget: '₹200-500' },

            { name: 'Bylakuppe', type: 'cultural', desc: 'Tibetan settlement. Golden Temple.', tip: 'Authentic Tibetan food.', budget: 'Free' },

            { name: 'Nisargadhama', type: 'nature', desc: 'Island park. Bamboo rafting, deer park.', tip: 'Great for families.', budget: '₹50' }

        ],

        packing: {'climate':'Pleasant (10-25C), misty, heavy monsoon Jun-Sep','dress':'Light woolens, rain jacket, comfortable cotton','shoes':'Waterproof trekking shoes, comfortable sandals','medicine':'Leech repellent (monsoon), mosquito repellent, sunscreen','comfort':'Rain poncho, umbrella, water bottle','snacks':'Coffee plantation snacks, pork curry, dry fruits'},

        food: ['Pandi Curry (pork) at Coorg Kitchen', 'Akki Roti at local homes', 'Bamboo Shoot Curry', 'Coffee at plantation cafes', 'Kadambuttu (rice dumplings)', 'Coorgi Biryani at Empire'],

        hotels: [{ name: 'Tamara Coorg', budget: 'Luxury ₹20K+', rating: '4.8' }, { name: 'The Orange County', budget: 'Luxury ₹15K+', rating: '4.7' }, { name: 'Coorg Wilderness Resort', budget: 'Premium ₹5K+', rating: '4.5' }, { name: 'Zostel Coorg', budget: 'Budget ₹500-1500', rating: '4.1' }],

        transport: ['Rented car (essential)', 'Jeep safari', 'Walking (plantation area)', 'Bus from Mysore (3h)', 'Taxi'],

        tips: ['Rented car is essential — no public transport', 'Stay at a coffee plantation', 'Try authentic Coorgi Pandi Curry', 'Rains Jun-Sep — carry rain gear']

    },

    munnar: {

        name: 'Munnar', state: 'Kerala', bestTime: 'September to May',

        tagline: 'Tea Capital of South India — rolling green hills',

        places: [

            { name: 'Tea Plantations', type: 'nature', desc: 'Endless green hills of tea.', tip: 'Tata Tea Museum.', budget: '₹75 museum' },

            { name: 'Eravikulam National Park', type: 'nature', desc: 'Nilgiri Tahr habitat. Shuttle bus only.', tip: 'Go early — tickets limited.', budget: '₹120' },

            { name: 'Top Station', type: 'nature', desc: 'Highest point. Kerala-Tamil Nadu border.', tip: 'Fog can block views.', budget: 'Free' },

            { name: 'Mattupetty Dam', type: 'nature', desc: 'Dam with boating. Indo-Swiss farm.', tip: 'Speed boat ride.', budget: '₹50' },

            { name: 'Echo Point', type: 'nature', desc: 'Lake with echo. Shola forests.', tip: 'Quick stop.', budget: '₹10' },

            { name: 'Kundala Lake', type: 'nature', desc: 'Scenic lake. Shikara and pedal boats.', tip: 'Less crowded.', budget: '₹150' },

            { name: 'Attukal Waterfalls', type: 'nature', desc: 'Beautiful cascading waterfall.', tip: 'Short trek.', budget: 'Free' },

            { name: 'Photo Point', type: 'nature', desc: 'Scenic valley viewpoint.', tip: 'Great photos.', budget: 'Free' }

        ],

        packing: {'climate':'Cool (10-25C), misty mornings, heavy monsoon Jun-Oct','dress':'Light woolens, waterproof jacket, comfortable layers','shoes':'Waterproof trekking shoes, comfortable walking shoes','medicine':'Leech repellent (monsoon), mosquito repellent, sunscreen','comfort':'Rain poncho, umbrella, warm shawl for evenings','snacks':'Tea, cardamom snacks, dry fruits'},

        food: ['Kerala meals at Saravana Bhavan', 'Appam and Stew at local restaurants', 'Cardamom Tea everywhere', 'Kerala Fish Curry', 'Dosa at various', 'Chocolate at Snow Valley'],

        hotels: [{ name: 'SpiceTree Munnar', budget: 'Luxury ₹12K+', rating: '4.7' }, { name: 'Fragrant Nature', budget: 'Premium ₹5K+', rating: '4.5' }, { name: 'Blanket Hotel', budget: 'Premium ₹4K+', rating: '4.3' }, { name: 'Zostel Munnar', budget: 'Budget ₹500-1200', rating: '4.0' }],

        transport: ['Rented car (best)', 'Auto-rickshaw', 'Bus from Kochi (4h)', 'Taxi', 'Walking (town)'],

        tips: ['Carry warm clothes — always misty', 'Eravikulam tickets sell out by 8 AM', 'Visit a tea factory', 'Combine with Thekkady (2h)']

    },

    haridwar: {

        name: 'Haridwar', state: 'Uttarakhand', bestTime: 'October to March',

        tagline: 'Gateway to the Gods — sacred Ganges ghat city',

        places: [

            { name: 'Har Ki Pauri Ghat', type: 'spiritual', desc: 'Most sacred ghat. Evening Ganga Aarti.', tip: 'Reach by 5 PM for aarti.', budget: 'Free' },

            { name: 'Mansa Devi Temple', type: 'spiritual', desc: 'Hilltop temple. Cable car available.', tip: 'Ropeway ride is scenic.', budget: '₹120 ropeway' },

            { name: 'Chandi Devi Temple', type: 'spiritual', desc: 'Neel Parvat hilltop temple.', tip: 'Trek or cable car.', budget: '₹100 ropeway' },

            { name: 'Maya Devi Temple', type: 'spiritual', desc: 'One of 51 Shakti Peethas.', tip: 'Ancient and powerful.', budget: 'Free' },

            { name: 'Bharat Mata Temple', type: 'spiritual', desc: 'Multi-story temple with unity map.', tip: 'Unique architecture.', budget: 'Free' },

            { name: 'Daksha Mahadev Temple', type: 'spiritual', desc: 'Ancient Shiva temple. Mythological significance.', tip: 'Kumbh Mela site.', budget: 'Free' },

            { name: 'Vaishno Devi Temple', type: 'spiritual', desc: 'Replica of Kashmir Vaishno Devi.', tip: 'Artificial cave temple.', budget: '₹50' },

            { name: 'Rajaji National Park', type: 'nature', desc: 'Wildlife sanctuary. Elephants, tigers.', tip: 'Jeep safari available.', budget: '₹150' }

        ],

        food: ['Kachori at Mohan Ji', 'Puri Sabzi at Brijwasi', 'Chole Bhature', 'Aloo Puri', 'Lassi at Hoshiyar Singh', 'Prasad at temples'],

        hotels: [{ name: 'Radisson Blu', budget: 'Premium ₹5K+', rating: '4.4' }, { name: 'Hotel Ganga Lahari', budget: 'Premium ₹3K+', rating: '4.2' }, { name: 'Hotel Alpana', budget: 'Budget ₹1K-2K', rating: '3.8' }, { name: 'Zostel Haridwar', budget: 'Budget ₹400-1000', rating: '4.0' }],

        transport: ['Auto-rickshaw', 'Cycle-rickshaw', 'Walking ghat area', 'Bus', 'Train from Delhi 4h'],

        tips: ['Ganga Aarti at Har Ki Pauri is unmissable', 'Carry a bag for ghats — shoes stay outside', 'Kumbh Mela happens every 12 years', 'Combine with Rishikesh (25km)']
        ,
        packing: {'climate':'Hot summers (40C), pleasant winters (5-20C)','dress':'Modest clothing for temples, light cottons','shoes':'Slip-on shoes (remove at temples), waterproof sandals','medicine':'ORS, basic first-aid','comfort':'Reusable water bottle, mosquito repellent, flashlight','snacks':'Temple prasad area snacks, dry fruits'},

    },

    dehradun: {

        name: 'Dehradun', state: 'Uttarakhand', bestTime: 'March to June, September to November',

        tagline: 'Valley of Gods — Doon School city and gateway to Mussoorie',

        places: [

            { name: 'Robber\'s Cave', type: 'nature', desc: 'Natural river cave formation. Picnic spot.', tip: 'Wear waterproof shoes.', budget: '₹25' },

            { name: 'Sahastradhara', type: 'nature', desc: 'Thousand-fold waterfall. Sulphur springs.', tip: 'Monsoon for best flow.', budget: '₹20' },

            { name: 'Forest Research Institute', type: 'museum', desc: 'Gothic building. Botanical museum.', tip: 'Allow 2 hours.', budget: '₹40' },

            { name: 'Mindrolling Monastery', type: 'spiritual', desc: 'Tibetan monastery. 60m Buddha statue.', tip: 'Peaceful gardens.', budget: '₹20' },

            { name: 'Tiger Falls', type: 'nature', desc: '312m waterfall. Trek required.', tip: 'Carry water and snacks.', budget: '₹50' },

            { name: 'Malsi Deer Park', type: 'nature', desc: 'Deer park with nature walk.', tip: 'Quick visit.', budget: '₹30' },

            { name: 'Paltan Bazaar', type: 'market', desc: 'Main market. Local shopping.', tip: 'Buy caramel balls.', budget: 'Free' },

            { name: 'Clock Tower', type: 'landmark', desc: 'Ghanta Ghar. City center.', tip: 'Photo spot.', budget: 'Free' }

        ],

        food: ['Momos everywhere', 'Chole Bhature at Kolkata House', 'Rajma Chawal at local dhabas', 'Kadhi Chawal', 'Aloo Tikki at Paltan Bazaar', 'Bal Mithai famous sweet'],

        hotels: [{ name: 'JW Marriott', budget: 'Luxury ₹8K+', rating: '4.6' }, { name: 'Hyatt Regency', budget: 'Premium ₹5K+', rating: '4.4' }, { name: 'Hotel Madhuban', budget: 'Premium ₹3K+', rating: '4.0' }, { name: 'Zostel Dehradun', budget: 'Budget ₹400-1000', rating: '4.1' }],

        transport: ['City bus', 'Auto-rickshaw', 'Uber/Ola', 'Walking', 'Train from Delhi 5h'],

        tips: ['Gateway to Mussoorie (35km)', 'Try the famous Bal Mithai sweet', 'Robber\'s Cave is crowded on weekends', 'Combine with Mussoorie weekend trip']
        ,
        packing: {'climate':'Pleasant (15-35C), monsoon heavy Jul-Sep','dress':'Light layers, rain jacket monsoon','shoes':'Waterproof trekking shoes, comfortable walking shoes','medicine':'Leech repellent (monsoon), sunscreen, ORS','comfort':'Rain poncho, power bank, reusable water bottle','snacks':'Local petha, dry fruits'},

    },

    mussoorie: {

        name: 'Mussoorie', state: 'Uttarakhand', bestTime: 'March to June, September to November',

        tagline: 'Queen of the Hills — colonial hill station above the clouds',

        places: [

            { name: 'Kempty Falls', type: 'nature', desc: 'Famous waterfall. Swimming pool at base.', tip: 'Go early to avoid crowds.', budget: '₹50' },

            { name: 'Camel\'s Back Road', type: 'nature', desc: '3km walking path. Rock shaped like camel.', tip: 'Best for sunset walks.', budget: 'Free' },

            { name: 'Gun Hill', type: 'nature', desc: 'Second highest point. Ropeway to top.', tip: 'Panoramic views.', budget: '₹75 ropeway' },

            { name: 'Lal Tibba', type: 'nature', desc: 'Highest point in Mussoorie.', tip: 'Telescope views of Himalayas.', budget: '₹50' },

            { name: 'Cloud\'s End', type: 'nature', desc: 'Where clouds meet the earth. Forest trails.', tip: 'Nature walks.', budget: 'Free' },

            { name: 'Company Garden', type: 'park', desc: 'Boating, waterfall, mini zoo.', tip: 'Great for families.', budget: '₹25' },

            { name: 'Mall Road', type: 'market', desc: 'Shopping street. colonial charm.', tip: 'Evening stroll.', budget: 'Free' },

            { name: 'Christ Church', type: 'heritage', desc: '1836 church. Gothic architecture.', tip: 'Historic landmark.', budget: 'Free' }

        ],

        food: ['Momos at every corner', 'Rajma Chawal', 'Bun Tikki', 'Russian Cuisine at Emily\'s', 'Magaaz at local shops', 'Chai with bun maska'],

        hotels: [{ name: 'JW Marriott Mussoorie', budget: 'Luxury ₹15K+', rating: '4.7' }, { name: 'The Savoy', budget: 'Luxury ₹12K+', rating: '4.6' }, { name: 'Hotel Royal Orchid', budget: 'Premium ₹4K+', rating: '4.2' }, { name: 'Zostel Mussoorie', budget: 'Budget ₹500-1200', rating: '4.0' }],

        transport: ['Walking Mall Road', 'Taxi', 'Local bus from Dehradun', 'Ropeway', 'Rented bike'],

        tips: ['Book accommodation in advance on weekends', 'Mall Road is pedestrian-only', 'Kempty Falls gets very crowded', 'Snowfall in December is magical']
        ,
        packing: {'climate':'Cool (0-25C), freezing in winter with snow','dress':'Heavy woolens winter, light layers summer','shoes':'Trekking boots with grip, waterproof shoes','medicine':'Cold medication, sunscreen','comfort':'Thermos flask, warm socks, gloves, umbrella','snacks':'Hot chocolate supplies, dry fruits, energy bars'},

    },

    nainital: {

        name: 'Nainital', state: 'Uttarakhand', bestTime: 'March to June, October to December',

        tagline: 'Lake District of India — emerald lake in a valley',

        places: [

            { name: 'Naini Lake', type: 'nature', desc: 'Heart-shaped lake. Boating paradise.', tip: 'Rowing and paddling boats.', budget: '₹150-300 boat' },

            { name: 'Naina Devi Temple', type: 'spiritual', desc: 'Shakti Peetha on lake northern shore.', tip: 'Lake view from temple.', budget: 'Free' },

            { name: 'Snow View Point', type: 'nature', desc: 'Cable car to Himalayan views.', tip: 'Nanda Devi peak visible.', budget: '₹150 ropeway' },

            { name: 'Tiffin Top', type: 'nature', desc: 'Horse ride to hilltop viewpoint.', tip: 'Panoramic valley views.', budget: '₹200 horse' },

            { name: 'Eco Cave Gardens', type: 'nature', desc: 'Connected animal-shaped caves.', tip: 'Fun for kids.', budget: '₹60' },

            { name: 'Bhimtal Lake', type: 'nature', desc: 'Larger lake 22km away. Quieter.', tip: 'Fish aquarium on island.', budget: '₹100 boat' },

            { name: 'Nal Damyanti Tal', type: 'nature', desc: 'Small natural lake. Peaceful.', tip: 'Picnic spot.', budget: 'Free' },

            { name: 'Thandi Sadak', type: 'nature', desc: 'Cool walkway around lake.', tip: 'Evening stroll.', budget: 'Free' }

        ],

        food: ['Ras reshad at local restaurants', 'Momos', 'Aloo ke gutke', 'Bal Mithai', 'Chai by the lake', 'Chinese at Sakley\'s'],

        hotels: [{ name: 'The Naini Retreat', budget: 'Luxury ₹8K+', rating: '4.5' }, { name: 'Hotel Shiv Regency', budget: 'Premium ₹3K+', rating: '4.2' }, { name: 'Hotel Evergreen', budget: 'Budget ₹1.5K-3K', rating: '3.9' }, { name: 'Zostel Nainital', budget: 'Budget ₹500-1200', rating: '4.1' }],

        transport: ['Walking lake area', 'Taxi', 'Trolley/Cable car', 'Horse rides', 'Bus from Delhi 7h'],

        tips: ['Naini Lake boating is must', 'Avoid weekends — extremely crowded', 'Visit Bhimtal for quieter experience', 'Snow in December-January']
        ,
        packing: {'climate':'Cool (0-28C), snowfall Dec-Feb','dress':'Heavy woolens winter, light cotton summer','shoes':'Trekking boots (snow grip), waterproof shoes','medicine':'Cold cream, lip balm, sunscreen SPF50','comfort':'Thermos, warm blanket, gloves','snacks':'Hot soup packets, dry fruits, chocolate'},

    },

    dalhousie: {

        name: 'Dalhousie', state: 'Himachal Pradesh', bestTime: 'March to June, October to December',

        tagline: 'Little Switzerland of India — pine-clad slopes and colonial charm',

        places: [

            { name: 'Khajjiar', type: 'nature', desc: 'Mini Switzerland. Meadow lake.', tip: 'Horse riding available.', budget: '₹100 entry' },

            { name: 'Dainkund Peak', type: 'nature', desc: 'Highest point. Wind sings through trees.', tip: '1.5km trek.', budget: 'Free' },

            { name: 'Kalatop Wildlife Sanctuary', type: 'nature', desc: 'Bear sanctuary. Nature trails.', tip: 'Guided walks.', budget: '₹100' },

            { name: 'Subhash Baoli', type: 'nature', desc: 'Spring where Netaji stayed.', tip: 'Peaceful picnic spot.', budget: 'Free' },

            { name: 'St. John\'s Church', type: 'heritage', desc: '1863 church. Gothic architecture.', tip: 'Beautiful stained glass.', budget: 'Free' },

            { name: 'Garam Sadak', type: 'landmark', desc: 'Warm road — never gets cold.', tip: 'Unique microclimate.', budget: 'Free' },

            { name: 'Panchpula', type: 'nature', desc: 'Waterfalls and streams.', tip: 'Picnic spot.', budget: 'Free' },

            { name: 'Satdhara Falls', type: 'nature', desc: 'Seven springs waterfall.', tip: 'Medicinal water.', budget: 'Free' }

        ],

        food: ['Siddu at dhabas', 'Rajma Chawal', 'Momos', 'Thukpa', 'Chai with pakoras', 'Local Himachali thali'],

        hotels: [{ name: 'Hotel Himdhara', budget: 'Premium ₹4K+', rating: '4.3' }, { name: 'Elgin Hall', budget: 'Premium ₹3K+', rating: '4.2' }, { name: 'Hotel Sachin', budget: 'Budget ₹1K-2K', rating: '3.8' }, { name: 'Zostel Dalhousie', budget: 'Budget ₹400-1000', rating: '4.0' }],

        transport: ['Walking', 'Taxi', 'Local bus', 'Shared jeeps', 'Gypsy for Khajjiar'],

        tips: ['Khajjiar is a day trip from Dalhousie', 'Carry warm clothes even in summer', 'Kalatop for nature lovers', 'Less crowded than Manali/Shimla']
        ,
        packing: {'climate':'Cold (-5 to 25C), heavy snowfall Dec-Feb','dress':'Heavy woolens, thermal innerwear, waterproof jacket','shoes':'Snow boots with grip, waterproof trekking shoes','medicine':'Cold and flu medicine, lip balm','comfort':'Hand warmers, thermos, sleeping bag','snacks':'Energy bars, chocolate, dry fruits'},

    },

    kasol: {

        name: 'Kasol', state: 'Himachal Pradesh', bestTime: 'March to June, September to November',

        tagline: 'Mini Israel of India — backpacker paradise in Parvati Valley',

        places: [

            { name: 'Kheerganga Trek', type: 'adventure', desc: 'Famous trek to natural hot springs.', tip: '2-day trek. Camp overnight.', budget: 'Free trek' },

            { name: 'Parvati River', type: 'nature', desc: 'Crystal clear river flowing through town.', tip: 'Riverside cafes.', budget: 'Free' },

            { name: 'Tosh Village', type: 'cultural', desc: 'End of road village. Mountain views.', tip: '2km walk from road end.', budget: 'Free' },

            { name: 'Malana Village', type: 'cultural', desc: 'Ancient democracy village. Restricted entry.', tip: 'Respect local customs.', budget: 'Free' },

            { name: 'Rasol Waterfall', type: 'nature', desc: 'Hidden waterfall trek.', tip: 'Ask locals for route.', budget: 'Free' },

            { name: 'Manikaran Sahib', type: 'spiritual', desc: 'Gurudwara with hot springs.', tip: 'Cook rice in hot spring!', budget: 'Free' },

            { name: 'Chalal Trek', type: 'adventure', desc: 'Easy 3km riverside trek.', tip: 'Best for beginners.', budget: 'Free' },

            { name: 'Café Culture', type: 'cultural', desc: 'Israeli, German, Italian cafes.', tip: 'Try shakshuka and hummus.', budget: 'Free entry' }

        ],

        food: ['Shakshuka at Evergreen Café', 'Hummus and Pita', 'Israeli breakfast', 'Italian pizza', 'Himachali Dham', 'Chai everywhere'],

        hotels: [{ name: 'The Hosteller Kasol', budget: 'Premium ₹2K+', rating: '4.3' }, { name: 'Hotel Sandhya', budget: 'Budget ₹1K-2K', rating: '3.9' }, { name: 'Parvati Woods Camps', budget: 'Budget ₹800-2000', rating: '4.0' }, { name: 'Zostel Kasol', budget: 'Budget ₹400-1000', rating: '4.2' }],

        transport: ['Walking', 'Local bus', 'Shared taxi', 'Hitchhiking common', 'Bike rental'],

        tips: ['Kheerganga trek is a must', 'Start trek early morning', 'Cash is king — limited ATMs', 'Respect local village rules']
        ,
        packing: {'climate':'Cool (0-25C), cold nights year-round','dress':'Warm layers even in summer, rain gear','shoes':'Trekking boots essential, waterproof sandals','medicine':'Leech repellent, altitude sickness pills','comfort':'Sleeping bag liner, flashlight, power bank','snacks':'Trail mix, energy bars, instant noodles'},

    },

    coonoor: {

        name: 'Coonoor', state: 'Tamil Nadu', bestTime: 'October to May',

        tagline: 'Tea town with SIM\'s Park and stunning viewpoints',

        places: [

            { name: 'SIM\'s Park', type: 'park', desc: 'Botanical garden. 240+ species.', tip: 'Annual flower show May.', budget: '₹30' },

            { name: 'Dolphin\'s Nose', type: 'nature', desc: 'Viewpoint shaped like dolphin nose.', tip: 'Catherine Falls view.', budget: '₹10' },

            { name: 'Tea Factories', type: 'cultural', desc: 'Tea processing tours. Tasting.', tip: 'Buy fresh tea.', budget: '₹100' },

            { name: 'Lamb\'s Rock', type: 'nature', desc: 'Cliff viewpoint. Tea estates below.', tip: 'Sunrise point.', budget: 'Free' },

            { name: 'Pasteur Institute', type: 'museum', desc: '1907 institute. Rose garden.', tip: 'Quick visit.', budget: 'Free' },

            { name: 'Law\'s Falls', type: 'nature', desc: 'Waterfall in forest.', tip: 'Short walk from road.', budget: 'Free' },

            { name: 'Toy Train Station', type: 'heritage', desc: 'UNESCO railway. Ooty connection.', tip: 'Book in advance.', budget: '₹200' },

            { name: 'Wellington Golf Course', type: 'nature', desc: 'Military golf course. Scenic.', tip: 'For golf enthusiasts.', budget: 'Varies' }

        ],

        food: ['Tea at plantation cafes', 'South Indian at local restaurants', 'Chocolate at shops', 'Momos', 'Home-made cakes', 'Filter coffee'],

        hotels: [{ name: 'Stinger by Taj', budget: 'Premium ₹5K+', rating: '4.4' }, { name: 'Hotel Gateway Coonoor', budget: 'Premium ₹3K+', rating: '4.2' }, { name: 'Club Mahindra', budget: 'Premium ₹4K+', rating: '4.1' }, { name: 'Zostel Coonoor', budget: 'Budget ₹400-1000', rating: '4.0' }],

        transport: ['Auto-rickshaw', 'Taxi', 'Walking town area', 'Toy train', 'Bus from Mettupalayam'],

        tips: ['Less crowded alternative to Ooty', 'Toy train between Ooty-Coonoor', 'Buy fresh tea from factories', 'Combine with Ooty trip']
        ,
        packing: {'climate':'Pleasant (10-25C), misty mornings, chilly evenings','dress':'Light woolens, jacket for evenings','shoes':'Comfortable walking shoes for tea estate treks','medicine':'Mosquito repellent, sunscreen','comfort':'Light shawl/cardigan, water bottle, camera','snacks':'Tea estate cafe snacks, dry fruits, chocolates'},

    },

    kodaikanal: {

        name: 'Kodaikanal', state: 'Tamil Nadu', bestTime: 'October to June',

        tagline: 'Princess of Hill Stations — misty forests and star-shaped lake',

        places: [

            { name: 'Kodai Lake', type: 'nature', desc: 'Star-shaped lake. Boating, cycling.', tip: 'Cycle around the lake.', budget: '₹200 boat, ₹150 cycle' },

            { name: 'Coaker\'s Walk', type: 'nature', desc: '1km mountain path. Valley views.', tip: 'Morning walk.', budget: '₹10' },

            { name: 'Bryant Park', type: 'park', desc: 'Botanical garden. Rose garden.', tip: 'Annual flower show.', budget: '₹30' },

            { name: 'Pillar Rocks', type: 'nature', desc: 'Three giant rock pillars.', tip: 'Sunrise/sunset.', budget: '₹10' },

            { name: 'Dolphin\'s Nose', type: 'nature', desc: 'Rock shaped like dolphin. Falls view.', tip: 'Catherine Falls visible.', budget: '₹10' },

            { name: 'Berijam Lake', type: 'nature', desc: 'Forest-surrounded lake.', tip: 'Permit needed.', budget: '₹50' },

            { name: 'Pine Forest', type: 'nature', desc: 'Dense pine forest walk.', tip: 'Photography paradise.', budget: 'Free' },

            { name: 'Silver Cascade Falls', type: 'nature', desc: 'Waterfall near road.', tip: 'Quick stop.', budget: 'Free' }

        ],

        food: ['Chocolate at local shops', 'South Indian meals', 'Momos', 'Tibetan food', 'Home-made cheese', 'Filter coffee'],

        hotels: [{ name: 'The Tamara Kodai', budget: 'Luxury ₹12K+', rating: '4.7' }, { name: 'Vivanta Kodai', budget: 'Premium ₹5K+', rating: '4.4' }, { name: 'Hotel Kodai International', budget: 'Premium ₹3K+', rating: '4.1' }, { name: 'Zostel Kodaikanal', budget: 'Budget ₹500-1200', rating: '4.0' }],

        transport: ['Walking', 'Taxi', 'Auto-rickshaw', 'Bicycle rental', 'Bus from Madurai 3h'],

        tips: ['Cycle around Kodai Lake', 'Carry warm clothes always misty', 'Homemade chocolates are famous', 'Combine with Madurai temple visit']
        ,
        packing: {'climate':'Cool (8-25C), misty and rainy Jul-Oct','dress':'Light woolens, waterproof jacket','shoes':'Waterproof trekking shoes, comfortable sandals','medicine':'Leech repellent, cold cream, sunscreen, ORS','comfort':'Umbrella, rain poncho, warm socks','snacks':'Homemade chocolates, dry fruits'},

    },

    wayanad: {

        name: 'Wayanad', state: 'Kerala', bestTime: 'October to May',

        tagline: 'Land of Paddy Fields — spice plantations and wildlife',

        places: [

            { name: 'Edakkal Caves', type: 'monument', desc: 'Prehistoric petroglyphs. 6000 years old.', tip: 'Steep climb.', budget: '₹100' },

            { name: 'Banasura Sagar Dam', type: 'landmark', desc: 'Largest earth dam in India.', tip: 'Boating available.', budget: '₹50' },

            { name: 'Chembra Peak', type: 'nature', desc: 'Heart-shaped lake trek.', tip: 'Permit needed. Start early.', budget: '₹75' },

            { name: 'Wayanad Wildlife Sanctuary', type: 'nature', desc: 'Elephant, tiger, deer habitat.', tip: 'Jeep safari.', budget: '₹300' },

            { name: 'Thirunelli Temple', type: 'spiritual', desc: 'Ancient Vishnu temple in forest.', tip: 'Papanasini stream.', budget: 'Free' },

            { name: 'Lakkidi Viewpoint', type: 'nature', desc: 'Gateway to Wayanad. Valley views.', tip: 'Photo stop.', budget: 'Free' },

            { name: 'Pookode Lake', type: 'nature', desc: 'Freshwater lake. Boating.', tip: 'Aquarium.', budget: '₹50' },

            { name: 'Kuruva Island', type: 'nature', desc: 'River island. Bamboo rafting.', tip: 'Nature walk.', budget: '₹100' }

        ],

        food: ['Kerala Meals on banana leaf', 'Fish Curry', 'Appam and Stew', 'Malabar Biryani', 'Banana chips', 'Spice tea'],

        hotels: [{ name: 'Vythiri Village Resort', budget: 'Luxury ₹12K+', rating: '4.7' }, { name: 'Windflower Resort', budget: 'Premium ₹5K+', rating: '4.5' }, { name: 'Hilton Garden Inn', budget: 'Premium ₹4K+', rating: '4.3' }, { name: 'Zostel Wayanad', budget: 'Budget ₹500-1200', rating: '4.0' }],

        transport: ['Rented car/jeep', 'Auto-rickshaw', 'Taxi', 'Bus from Calicut 3h', 'Walking resort area'],

        tips: ['Rented jeep is essential', 'Edakkal Caves require steep climb', 'Carry insect repellent', 'Spice plantation tours available']
        ,
        packing: {'climate':'Tropical (20-35C), heavy monsoon Jun-Oct','dress':'Light cotton, waterproof jacket monsoon','shoes':'Waterproof trekking shoes essential','medicine':'Leech repellent, mosquito repellent, ORS','comfort':'Rain poncho, insect repellent, power bank','snacks':'Trail mix, water bottles, energy bars'},

    },

    alleppey: {

        name: 'Alleppey', state: 'Kerala', bestTime: 'September to May',

        tagline: 'Venice of the East — houseboats on serene backwaters',

        places: [

            { name: 'Houseboat Cruise', type: 'nature', desc: 'Overnight backwater experience.', tip: 'Book in advance. Includes meals.', budget: '₹5000-15000' },

            { name: 'Alleppey Beach', type: 'beach', desc: 'Lighthouse beach. Beautiful sunset.', tip: 'Evening walk.', budget: 'Free' },

            { name: 'Backwater Canoe Ride', type: 'adventure', desc: 'Narrow canals through villages.', tip: 'Morning is best.', budget: '₹500-1000' },

            { name: 'Krishnapuram Palace', type: 'heritage', desc: '18th century palace. Kerala mural.', tip: 'Gajendra Moksha painting.', budget: '₹20' },

            { name: 'Marari Beach', type: 'beach', desc: 'Quiet fishing village beach.', tip: 'Coconut groves.', budget: 'Free' },

            { name: 'Vembanad Lake', type: 'nature', desc: 'Longest lake in India.', tip: 'Sunset cruise.', budget: '₹300-500' },

            { name: 'Champakulam Church', type: 'heritage', desc: 'One of oldest churches in India.', tip: 'Syrian Christian heritage.', budget: 'Free' },

            { name: 'Coir Museum', type: 'museum', desc: 'Coconut fiber products.', tip: 'Buy souvenirs.', budget: '₹20' }

        ],

        food: ['Kerala Meals banana leaf', 'Karimeen Pearl Spot fish', 'Appam with stew', 'Puttu and Kadala', 'Toddy shop food', 'Banana chips'],

        hotels: [{ name: 'Kumarakom Lake Resort', budget: 'Luxury ₹12K+', rating: '4.7' }, { name: 'Coconut Lagoon', budget: 'Premium ₹6K+', rating: '4.5' }, { name: 'Houseboat stay', budget: 'Premium ₹5K-15K', rating: '4.4' }, { name: 'Zostel Alleppey', budget: 'Budget ₹400-1200', rating: '4.1' }],

        transport: ['Houseboat', 'Auto-rickshaw', 'Canoe', 'Taxi', 'Bus from Cochin 1.5h'],

        tips: ['Overnight houseboat is a must', 'Book houseboat 2 weeks in advance', 'Monsoon houseboat is magical but rainy', 'Backwater canoe for narrow canals']
        ,
        packing: {'climate':'Hot humid (25-35C), heavy monsoon Jun-Sep','dress':'Light cotton/linen, rain gear','shoes':'Waterproof sandals, comfortable walking shoes','medicine':'Mosquito repellent, sunscreen, ORS','comfort':'Waterproof bag for houseboat, hat, umbrella','snacks':'Coconut water, banana chips, dry fruits'},

    },

    madurai: {

        name: 'Madurai', state: 'Tamil Nadu', bestTime: 'October to March',

        tagline: 'Temple City — 2500 years of continuous culture',

        places: [

            { name: 'Meenakshi Amman Temple', type: 'spiritual', desc: 'Magnificent Dravidian temple. 33000 sculptures.', tip: 'Evening ceremony.', budget: 'Free' },

            { name: 'Thirumalai Nayak Palace', type: 'heritage', desc: '17th century palace. Sound & light show.', tip: 'Show at 7 PM.', budget: '₹50' },

            { name: 'Gandhi Memorial Museum', type: 'museum', desc: 'Freedom struggle artifacts.', tip: 'Allow 2 hours.', budget: '₹10' },

            { name: 'Alagar Koil', type: 'spiritual', desc: 'Vishnu temple in hills. Scenic.', tip: '14km from city.', budget: 'Free' },

            { name: 'Vandiyur Mariamman Teppakulam', type: 'landmark', desc: '16th century tank. Float festival.', tip: 'Jan festival.', budget: 'Free' },

            { name: 'Pudhu Mandapam', type: 'market', desc: 'Market near temple. Shopping.', tip: 'Buy silk and brass.', budget: 'Free' },

            { name: 'Samayapuram Temple', type: 'spiritual', desc: 'Mariamman temple. Powerful.', tip: '30km from city.', budget: 'Free' },

            { name: 'Aayiram Kaal Mandapam', type: 'heritage', desc: 'Thousand-pillar hall.', tip: 'Architecture marvel.', budget: 'Free' }

        ],

        food: ['Jigarthanda at Famous Jigarthanda', 'Chettinad Chicken', 'Banana leaf meals', 'Kari Dosa', 'Idiyappam', 'Kothu Parotta'],

        hotels: [{ name: 'Heritage Madurai', budget: 'Luxury ₹8K+', rating: '4.6' }, { name: 'Taj Gateway Pasumalai', budget: 'Premium ₹5K+', rating: '4.4' }, { name: 'Hotel Royal Court', budget: 'Budget ₹2K-4K', rating: '4.0' }, { name: 'Zostel Madurai', budget: 'Budget ₹400-1000', rating: '4.0' }],

        transport: ['Auto-rickshaw', 'City bus', 'Walking temple area', 'Taxi', 'Train from Chennai 8h'],

        tips: ['Meenakshi Temple is unmissable', 'Evening ceremony is spectacular', 'Try Jigarthanda — unique drink', 'Combine with Rameshwaram trip']
        ,
        packing: {'climate':'Hot (25-40C), dry summers, pleasant Nov-Feb','dress':'Light cotton, covered shoulders/knees for temple','shoes':'Comfortable slip-ons, walking shoes','medicine':'Sunscreen, ORS, electrolyte tablets','comfort':'Water bottle, umbrella, power bank','snacks':'Jigarthanda drink, dry snacks'},

    },

    puri: {

        name: 'Puri', state: 'Odisha', bestTime: 'October to March',

        tagline: 'Jagannath Dham — holy city of Lord of the Universe',

        places: [

            { name: 'Jagannath Temple', type: 'spiritual', desc: 'One of Char Dham. Rath Yatra site.', tip: 'Non-Hindus cannot enter.', budget: 'Free' },

            { name: 'Puri Beach', type: 'beach', desc: 'Golden beach. Sunrise point.', tip: 'Morning swim.', budget: 'Free' },

            { name: 'Konark Sun Temple', type: 'monument', desc: 'UNESCO chariot temple. 30km away.', tip: 'Half day trip.', budget: '₹35' },

            { name: 'Chilika Lake', type: 'nature', desc: 'Asia\'s largest lagoon. Irrawaddy dolphins.', tip: 'Boat to Kalijai island.', budget: '₹300 boat' },

            { name: 'Raghurajpur', type: 'cultural', desc: 'Heritage crafts village. Pattachitra art.', tip: 'Buy paintings.', budget: 'Free' },

            { name: 'Gundicha Temple', type: 'spiritual', desc: 'Jagannath\'s garden house.', tip: 'Rath Yatra destination.', budget: 'Free' },

            { name: 'Swargadwar', type: 'landmark', desc: 'Sea beach market.', tip: 'Shopping.', budget: 'Free' },

            { name: 'Alarnath Temple', type: 'spiritual', desc: 'Kuldeep temple. 25km away.', tip: 'During Rath Yatra.', budget: 'Free' }

        ],

        food: ['Mahaprasad at Jagannath Temple', 'Chhena Poda', 'Khaja sweet', 'Dahi Vada', 'Puri and Sabji', 'Chilika fish'],

        hotels: [{ name: 'Mayfair Puri', budget: 'Premium ₹5K+', rating: '4.4' }, { name: 'Toshali Sands', budget: 'Premium ₹4K+', rating: '4.3' }, { name: 'Hotel holiday Resort', budget: 'Budget ₹1.5K-3K', rating: '3.9' }, { name: 'Zostel Puri', budget: 'Budget ₹400-1000', rating: '4.0' }],

        transport: ['Auto-rickshaw', 'Cycle-rickshaw', 'Bus', 'Taxi', 'Train from Bhubaneswar 2h'],

        tips: ['Rath Yatra (Jul) is world-famous', 'Mahaprasad is free temple food', 'Konark Temple is unmissable', 'Chilika Lake dolphin watching']
        ,
        packing: {'climate':'Hot humid (25-40C), cyclone season Oct-Dec','dress':'Light cotton, beachwear, modest for temple','shoes':'Sandals for beach, comfortable walking shoes','medicine':'Sunscreen SPF50, mosquito repellent, ORS','comfort':'Beach towel, waterproof bag, hat, umbrella','snacks':'Chuda ghasa, dry fruits, bottled water'},

    },

    gangtok: {

        name: 'Gangtok', state: 'Sikkim', bestTime: 'March to May, October to December',

        tagline: 'Land of Pure Bliss — Buddhist monasteries and Himalayan views',

        places: [

            { name: 'Tsomgo Lake', type: 'nature', desc: 'Glacial lake at 12,313ft.', tip: 'Permit needed. Book through hotel.', budget: '₹200 + permit' },

            { name: 'Baba Mandir', type: 'spiritual', desc: 'War memorial at 13,123ft.', tip: 'Combine with Tsomgo.', budget: 'Free' },

            { name: 'Rumtek Monastery', type: 'spiritual', desc: 'Largest monastery in Sikkim.', tip: 'Peaceful setting.', budget: 'Free' },

            { name: 'MG Marg', type: 'market', desc: 'Main street. Pedestrian only.', tip: 'Shopping and food.', budget: 'Free' },

            { name: 'Enchey Monastery', type: 'spiritual', desc: '200-year-old monastery.', tip: 'City view.', budget: 'Free' },

            { name: 'Hanuman Tok', type: 'spiritual', desc: 'Hanuman temple on hilltop.', tip: 'Sunrise views.', budget: 'Free' },

            { name: 'Ganesh Tok', type: 'spiritual', desc: 'Ganesh temple with city view.', tip: 'Small but scenic.', budget: 'Free' },

            { name: 'Tashi Viewpoint', type: 'nature', desc: 'Kanchenjunga views.', tip: 'Morning best.', budget: 'Free' }

        ],

        food: ['Momos everywhere', 'Thukpa', 'Gyathuk', 'Sel Roti', 'Churpee cheese', 'Sikkimese thali'],

        hotels: [{ name: 'Mayfair Gangtok', budget: 'Premium ₹5K+', rating: '4.5' }, { name: 'Hotel Denzong Regency', budget: 'Premium ₹3K+', rating: '4.3' }, { name: 'Hotel Tashi Delek', budget: 'Budget ₹2K-4K', rating: '4.0' }, { name: 'Zostel Gangtok', budget: 'Budget ₹500-1200', rating: '4.1' }],

        transport: ['Walking MG Marg', 'Taxi', 'Shared jeep', 'Ropeway', 'Bus'],

        tips: ['Inner Line Permit needed for some areas', 'Tsomgo Lake permit books fast', 'MG Marg is pedestrian-only', 'Combine with Pelling/Darjeeling']
        ,
        packing: {'climate':'Cool (0-25C), monsoon heavy Jun-Sep','dress':'Warm layers, waterproof jacket','shoes':'Trekking boots with grip, waterproof shoes','medicine':'Altitude sickness pills, cold medicine','comfort':'Power bank, reusable water bottle, warm gloves','snacks':'Momos, thukpa, energy bars for treks'},

    },

    shillong: {

        name: 'Shillong', state: 'Meghalaya', bestTime: 'October to May',

        tagline: 'Scotland of the East — music, waterfalls, and living root bridges',

        places: [

            { name: 'Umiam Lake', type: 'nature', desc: 'Man-made lake. Boating, kayaking.', tip: 'Sunset is stunning.', budget: '₹150 boat' },

            { name: 'Don Bosco Museum', type: 'museum', desc: 'NE India\'s largest museum.', tip: 'Allow 3 hours.', budget: '₹100' },

            { name: 'Ward\'s Lake', type: 'park', desc: 'Colonial lake. Gardens.', tip: 'Evening walk.', budget: '₹10' },

            { name: 'Shillong Peak', type: 'nature', desc: 'Highest point. City panorama.', tip: 'Military area — carry ID.', budget: 'Free' },

            { name: 'Elephant Falls', type: 'nature', desc: 'Three-tier waterfall.', tip: '25km from city.', budget: '₹20' },

            { name: 'Police Bazaar', type: 'market', desc: 'Main market. Shopping.', tip: 'Buy Khasi handicrafts.', budget: 'Free' },

            { name: 'Air Force Museum', type: 'museum', desc: 'Aviation history.', tip: 'Quick visit.', budget: 'Free' },

            { name: 'Laitlum Canyon', type: 'nature', desc: 'Dramatic canyon. Trek.', tip: 'Less crowded.', budget: 'Free' }

        ],

        food: ['Jadoh (red rice with pork)', 'Dohneiiong', 'Tungrymbai', 'Momos', 'Smoked meat', 'Khasi traditional food'],

        hotels: [{ name: 'Ri Kynjai', budget: 'Premium ₹5K+', rating: '4.5' }, { name: 'Hotel Centre Point', budget: 'Premium ₹3K+', rating: '4.2' }, { name: 'Hotel Alpine', budget: 'Budget ₹1.5K-3K', rating: '3.9' }, { name: 'Zostel Shillong', budget: 'Budget ₹500-1200', rating: '4.0' }],

        transport: ['Walking', 'Taxi', 'Shared taxi', 'Bus', 'Rented bike'],

        tips: ['Live music capital of NE India', 'Try Khasi food — unique flavors', 'Living root bridges nearby (Cherrapunji)', 'Carry rain gear always']
        ,
        packing: {'climate':'Pleasant (4-25C), heavy monsoon Jun-Sep','dress':'Light woolens, rain jacket','shoes':'Waterproof trekking shoes, comfortable sandals','medicine':'Leech repellent, sunscreen, cold medicine','comfort':'Umbrella, rain poncho, warm shawl','snacks':'Local street food, dry fruits'},

    },

    kaziranga: {

        name: 'Kaziranga', state: 'Assam', bestTime: 'November to April',

        tagline: 'One-Horned Rhino Capital — UNESCO wildlife sanctuary',

        places: [

            { name: 'Jeep Safari', type: 'nature', desc: 'Rhino, elephant, tiger, buffalo.', tip: 'Book early morning slot.', budget: '₹3500 jeep + ₹100 permit' },

            { name: 'Elephant Safari', type: 'nature', desc: 'Ride through grasslands.', tip: 'Most intimate experience.', budget: '₹1500' },

            { name: 'Kaziranga Orchid Park', type: 'park', desc: '500+ orchid species.', tip: 'Best Feb-Mar.', budget: '₹100' },

            { name: 'Kakochang Waterfall', type: 'nature', desc: 'Waterfall near sanctuary.', tip: 'Picnic spot.', budget: '₹20' },

            { name: 'Deoparbat Ruins', type: 'monument', desc: 'Ahom-era ruins.', tip: 'Historical significance.', budget: 'Free' },

            { name: 'Mithimukh Tea Estate', type: 'cultural', desc: 'Tea garden walks.', tip: 'Buy Assam tea.', budget: 'Free' },

            { name: 'Bokakhat Town', type: 'cultural', desc: 'Gateway town. Local market.', tip: 'Buy local crafts.', budget: 'Free' },

            { name: 'River Island Walk', type: 'nature', desc: 'Brahmaputra sandbar.', tip: 'Sunset.', budget: 'Free' }

        ],

        food: ['Assamese Thali', 'Masor Tenga (sour fish)', 'Duck curry', 'Pitha rice cakes', 'Jolpan breakfast', 'Tea from gardens'],

        hotels: [{ name: 'Vivanta Kaziranga', budget: 'Luxury ₹10K+', rating: '4.6' }, { name: 'Iora Retreat', budget: 'Premium ₹5K+', rating: '4.5' }, { name: 'Hotel Wild Grass', budget: 'Premium ₹3K+', rating: '4.2' }, { name: 'Zostel Kaziranga', budget: 'Budget ₹500-1200', rating: '4.0' }],

        transport: ['Jeep (essential)', 'Elephant safari', 'Auto-rickshaw', 'Taxi', 'Train from Guwahati 4h'],

        tips: ['Book safari 2 weeks in advance', 'Morning slot has best wildlife sightings', 'Carry binoculars', 'Elephant safari is more intimate than jeep']
        ,
        packing: {'climate':'Tropical (10-35C), park closed monsoon Jun-Sep','dress':'Earth-tone/olive clothing, long sleeves, hat','shoes':'Closed-toe sturdy shoes for safari','medicine':'Mosquito repellent, sunscreen, basic first-aid','comfort':'Binoculars, camera, water bottle, hat','snacks':'Packed lunch for safari, dry snacks'},

    },

    darbhanga: {

        name: 'Darbhanga', state: 'Bihar', bestTime: 'October to March',

        tagline: 'Cultural Capital of Mithila — art, literature, and traditions',

        places: [

            { name: 'Darbhanga Raj Palace', type: 'heritage', desc: 'Royal palace. Mithila art collection.', tip: 'Guided tours available.', budget: 'Free' },

            { name: 'Kusheshwar Asthan', type: 'spiritual', desc: 'Ancient Shiva temple.', tip: 'Bird sanctuary nearby.', budget: 'Free' },

            { name: 'Mithila Art Institute', type: 'cultural', desc: 'Learn Madhubani painting.', tip: 'Workshops available.', budget: '₹500 workshop' },

            { name: 'Ahilya Sthan', type: 'spiritual', desc: 'Mythological Ramayana site.', tip: 'Peaceful setting.', budget: 'Free' },

            { name: 'Lalit Narayan Mithila University', type: 'cultural', desc: 'Historic university campus.', tip: 'Architecture walk.', budget: 'Free' },

            { name: 'Sonauli Border', type: 'landmark', desc: 'India-Nepal border.', tip: 'Shopping cross-border.', budget: 'Free' },

            { name: 'Mithila Paintings Village', type: 'cultural', desc: 'Madhubani art village.', tip: 'Buy authentic paintings.', budget: 'Free' },

            { name: 'Jal庙 Temple', type: 'spiritual', desc: 'Water temple.', tip: 'Unique architecture.', budget: 'Free' }

        ],

        food: ['Litti Chokha', 'Thekua sweet', 'Dahi Chura', 'Makhana dishes', 'Mithila Thali', 'Tilkut'],

        hotels: [{ name: 'Hotel Vaishali', budget: 'Premium ₹3K+', rating: '4.0' }, { name: 'Hotel Sri Ram', budget: 'Budget ₹1K-2K', rating: '3.8' }, { name: 'OYO Hotels', budget: 'Budget ₹800-1500', rating: '3.5' }, { name: 'Treebo Hotels', budget: 'Budget ₹1K-2K', rating: '3.7' }],

        transport: ['Auto-rickshaw', 'Cycle-rickshaw', 'Bus', 'Taxi', 'Train from Patna 3h'],

        tips: ['Buy Madhubani paintings as souvenirs', 'Try Litti Chokha — Bihari specialty', 'Mithila culture is unique', 'Combine with Vaishali archaeological site']
        ,
        packing: {'climate':'Extreme (2-45C), hot summers, cold foggy winters','dress':'Light cotton summers, heavy woolens winters','shoes':'Comfortable walking shoes, sandals','medicine':'Sunscreen, ORS, mosquito repellent','comfort':'Water bottle, umbrella, power bank','snacks':'Dry fruits, bottled water'},

    },

    warangal: {

        name: 'Warangal', state: 'Telangana', bestTime: 'October to March',

        tagline: 'Kakatiya Heritage — medieval architectural marvels',

        places: [

            { name: 'Warangal Fort', type: 'monument', desc: 'Kakatiya fortress. Stone gateway.', tip: 'Allow 2 hours.', budget: '₹25' },

            { name: 'Thousand Pillar Temple', type: 'monument', desc: '1000-pillar temple. Star-shaped.', tip: 'Architecture marvel.', budget: '₹25' },

            { name: 'Ramappa Temple', type: 'monument', desc: 'UNESCO site. Floating bricks!', tip: 'One of finest temples.', budget: '₹25' },

            { name: 'Bhadrakali Temple', type: 'spiritual', desc: 'Goddess Kali temple.', tip: 'City patron deity.', budget: 'Free' },

            { name: 'Kakatiya Musical Garden', type: 'park', desc: 'Musical fountain garden.', tip: 'Evening show.', budget: '₹20' },

            { name: 'Eturnagaram Wildlife', type: 'nature', desc: 'Wildlife sanctuary.', tip: 'Jeep safari.', budget: '₹100' },

            { name: 'Packalu Lake', type: 'nature', desc: 'Scenic lake. Boating.', tip: 'Picnic spot.', budget: '₹30' },

            { name: 'Govindarajula Lake', type: 'nature', desc: 'Sunset point.', tip: 'Evening visit.', budget: 'Free' }

        ],

        food: ['Biryani Hyderabadi style', 'Sakinalu snack', 'Sarva Pindi', 'Hyderabadi Haleem', 'Double Ka Meetha', 'Lemon Rice'],

        hotels: [{ name: 'Hotel Grand Kakatiya', budget: 'Premium ₹4K+', rating: '4.3' }, { name: 'Hotel Makakita', budget: 'Budget ₹2K-3K', rating: '4.0' }, { name: 'OYO Hotels', budget: 'Budget ₹800-1500', rating: '3.5' }, { name: 'Treebo Hotels', budget: 'Budget ₹1K-2K', rating: '3.7' }],

        transport: ['Auto-rickshaw', 'Bus', 'Taxi', 'Walking old city', 'Train from Hyderabad 3h'],

        tips: ['Ramappa Temple is UNESCO listed', 'Buy Kakatiya crafts', 'Combine with Hyderabad trip', 'Thousand Pillar Temple is extraordinary']
        ,
        packing: {'climate':'Hot (20-42C), monsoon Jul-Oct','dress':'Light cotton, temple-appropriate clothing','shoes':'Comfortable walking shoes, sandals','medicine':'Sunscreen, ORS, mosquito repellent','comfort':'Water bottle, hat, umbrella, power bank','snacks':'Local sweets, dry fruits'},

    },

    badami: {

        name: 'Badami', state: 'Karnataka', bestTime: 'October to February',

        tagline: 'Cave Temple Town — Chalukyan rock-cut marvels',

        places: [

            { name: 'Badami Cave Temples', type: 'monument', desc: '4 cave temples. 6th century.', tip: 'All 4 caves need 3 hours.', budget: '₹25' },

            { name: 'Agastya Lake', type: 'nature', desc: 'Sacred lake below cliffs.', tip: 'Sunrise reflections.', budget: 'Free' },

            { name: 'Bhutanatha Group', type: 'monument', desc: 'Lakeside temple group.', tip: 'Beautiful setting.', budget: '₹25' },

            { name: 'Upper Shivalaya', type: 'monument', desc: 'Hilltop temple. City views.', tip: 'Climb for panorama.', budget: '₹25' },

            { name: 'Badami Fort', type: 'heritage', desc: 'Hilltop fort. Military architecture.', tip: 'Steep climb.', budget: '₹25' },

            { name: 'Malgudi Days Village', type: 'cultural', desc: 'TV serial location.', tip: 'Literary connection.', budget: 'Free' },

            { name: 'Banashankari Temple', type: 'spiritual', desc: 'Ancient temple 5km away.', tip: 'Car festival.', budget: 'Free' },

            { name: 'Pattadakal', type: 'monument', desc: 'UNESCO site. Chalukyan architecture.', tip: '30km away.', budget: '₹25' }

        ],

        food: ['Jolada Rotti', 'Ennegai stuffed brinjal', 'Badami Puran Poli', 'North Karnataka Thali', 'Ragi Mudde', 'Yenne Badnekayi'],

        hotels: [{ name: 'Hotel The Heritage', budget: 'Premium ₹3K+', rating: '4.2' }, { name: 'Hotel Badami Court', budget: 'Budget ₹1.5K-3K', rating: '4.0' }, { name: 'Homestays', budget: 'Budget ₹800-2000', rating: '4.1' }, { name: 'MTDC Resort', budget: 'Premium ₹3K+', rating: '4.0' }],

        transport: ['Auto-rickshaw', 'Walking caves', 'Taxi', 'Bus', 'Train from Hubli 2h'],

        tips: ['Combine Badami-Aihole-Pattadakal circuit', 'Cave 1 has finest carvings', 'Early morning for best photos', 'Hampi is 6 hours away']
        ,
        packing: {'climate':'Very hot (25-42C), pleasant Nov-Feb','dress':'Light cotton, sun hat','shoes':'Sturdy walking shoes for cave exploration','medicine':'Sunscreen, ORS, anti-heat medicine','comfort':'Water bottle (carry extra!), hat, umbrella','snacks':'Local food, energy bars'},

    },

    gokarna: {

        name: 'Gokarna', state: 'Karnataka', bestTime: 'October to March',

        tagline: 'Temple Town turned Beach Paradise — India\'s alternative to Goa',

        places: [

            { name: 'Om Beach', type: 'beach', desc: 'Om-shaped beach. Surfing.', tip: 'Best for sunset.', budget: 'Free' },

            { name: 'Kudle Beach', type: 'beach', desc: 'Longest beach. Hippie vibes.', tip: 'Best cafes.', budget: 'Free' },

            { name: 'Mahabaleshwar Temple', type: 'spiritual', desc: 'Ancient Shiva temple.', tip: 'Dress modestly.', budget: 'Free' },

            { name: 'Half Moon Beach', type: 'beach', desc: 'Secluded beach. Trek to reach.', tip: 'Carry water and food.', budget: 'Free' },

            { name: 'Paradise Beach', type: 'beach', desc: 'Remote beach. Boat access.', tip: 'Boat from Om Beach.', budget: '₹200 boat' },

            { name: 'Yana Rocks', type: 'nature', desc: 'Limestone rock formations.', tip: 'Trek through forest.', budget: 'Free' },

            { name: 'Murudeshwar Temple', type: 'spiritual', desc: 'Giant Shiva statue. 1hr away.', tip: 'World\'s second tallest.', budget: 'Free' },

            { name: 'Beach Trek', type: 'adventure', desc: 'Trek between beaches.', tip: 'Start from Kudle.', budget: 'Free' }

        ],

        food: ['Thali at Namaste Café', 'Israeli food', 'Pizza at Café Inferno', 'Fresh fish curry', 'Banana pancakes', 'Chai everywhere'],

        hotels: [{ name: 'SwaSwara', budget: 'Luxury ₹15K+', rating: '4.7' }, { name: 'Namaste Sanjeevini', budget: 'Premium ₹2K+', rating: '4.2' }, { name: 'Beach huts', budget: 'Budget ₹500-1500', rating: '3.9' }, { name: 'Zostel Gokarna', budget: 'Budget ₹400-1000', rating: '4.1' }],

        transport: ['Walking beach treks', 'Auto-rickshaw', 'Boat between beaches', 'Shared jeep', 'Train from Hubli 3h'],

        tips: ['Beach trek is the highlight', 'Less crowded than Goa', 'Om Beach for surfing', 'Carry cash — limited ATMs']
        ,
        packing: {'climate':'Hot humid (22-35C), monsoon Jun-Sep','dress':'Beachwear, modest for temples','shoes':'Flip-flops for beach, sturdy sandals','medicine':'Sunscreen SPF50, mosquito repellent, ORS','comfort':'Beach towel, waterproof bag, hat','snacks':'Coconut water, seafood, dry fruits'},

    },

    mcleodganj: {

        name: 'McLeod Ganj', state: 'Himachal Pradesh', bestTime: 'March to June, September to November',

        tagline: 'Little Lhasa — Dalai Lama\'s home and Tibetan culture hub',

        places: [

            { name: 'Tsuglagkhang Complex', type: 'spiritual', desc: 'Dalai Lama\'s temple. Museum.', tip: 'Morning prayers.', budget: 'Free' },

            { name: 'Triund Trek', type: 'adventure', desc: 'Famous Himalayan trek.', tip: '2 days recommended.', budget: 'Free' },

            { name: 'Bhagsu Waterfall', type: 'nature', desc: 'Beautiful waterfall. Short walk.', tip: 'Nag temple nearby.', budget: 'Free' },

            { name: 'Namgyal Monastery', type: 'spiritual', desc: 'Largest Tibetan monastery outside Tibet.', tip: 'Meditation sessions.', budget: 'Free' },

            { name: 'Dal Lake', type: 'nature', desc: 'Small lake. Peaceful.', tip: 'Quick visit.', budget: 'Free' },

            { name: 'Norbulingka Institute', type: 'cultural', desc: 'Tibetan art preservation.', tip: 'Workshops available.', budget: 'Free' },

            { name: 'Tibetan Market', type: 'market', desc: 'Handicrafts, singing bowls.', tip: 'Buy singing bowls.', budget: 'Free' },

            { name: 'St. John in Wilderness', type: 'heritage', desc: '1852 Gothic church.', tip: 'Historic landmark.', budget: 'Free' }

        ],

        food: ['Tibetan food at Norbulingka', 'Momos everywhere', 'Thukpa', 'Tingmo', 'Tibetan bread', 'Chai at every cafe'],

        hotels: [{ name: 'Bir Hotel', budget: 'Premium ₹4K+', rating: '4.3' }, { name: 'Hotel Asia', budget: 'Premium ₹3K+', rating: '4.1' }, { name: 'Snow Lion Residency', budget: 'Premium ₹3K+', rating: '4.2' }, { name: 'Zostel McLeod Ganj', budget: 'Budget ₹400-1200', rating: '4.2' }],

        transport: ['Walking', 'Auto-rickshaw', 'Taxi', 'Shared jeep', 'Bus from Dharamshala'],

        tips: ['Triund trek is bucket list', 'Cooking classes for Tibetan food', 'Buy singing bowls and thangkas', 'Meditation courses available']
        ,
        packing: {'climate':'Cool (0-25C), snowfall in winter','dress':'Heavy woolens winter, light layers summer','shoes':'Trekking boots (Triund trek), waterproof shoes','medicine':'Cold medicine, altitude pills','comfort':'Thermos, warm gloves, sleeping bag liner','snacks':'Tibetan thukpa, momos, energy bars'},

    },

    varkala: {

        name: 'Varkala', state: 'Kerala', bestTime: 'October to March',

        tagline: 'Cliff Beach Paradise — red cliffs meeting Arabian Sea',

        places: [

            { name: 'Varkala Beach', type: 'beach', desc: 'Cliff-side beach. Surfer paradise.', tip: 'South cliff is quieter.', budget: 'Free' },

            { name: 'Papanasam Beach', type: 'beach', desc: 'Holy beach. Pilgrimage spot.', tip: 'Ritual bathing.', budget: 'Free' },

            { name: 'Janardanaswamy Temple', type: 'spiritual', desc: '2000-year-old Vishnu temple.', tip: 'Dress modestly.', budget: 'Free' },

            { name: 'Sivagiri Mutt', type: 'spiritual', desc: 'Sree Narayana Guru\'s ashram.', tip: 'Hilltop views.', budget: 'Free' },

            { name: 'Cliff Walk', type: 'nature', desc: 'Walk along cliff edge. Shops below.', tip: 'Sunset walk.', budget: 'Free' },

            { name: 'Kappil Beach', type: 'beach', desc: 'Where lake meets sea.', tip: '2km from Varkala.', budget: 'Free' },

            { name: 'Anchuthengu Fort', type: 'heritage', desc: '17th century British fort.', tip: '15km away.', budget: 'Free' },

            { name: 'Ayurvedic Centers', type: 'cultural', desc: 'Authentic Kerala Ayurveda.', tip: 'Book treatments.', budget: '₹1000+' }

        ],

        food: ['Fresh fish curry', 'Kerala meals banana leaf', 'Thali at Café del Mar', 'Smoothie bowls', 'Israeli food', 'Chai on cliff'],

        hotels: [{ name: 'Taj Green Cove Resort', budget: 'Luxury ₹10K+', rating: '4.7' }, { name: 'Cliff Abode', budget: 'Premium ₹3K+', rating: '4.4' }, { name: 'Beach huts', budget: 'Budget ₹800-2000', rating: '3.9' }, { name: 'Zostel Varkala', budget: 'Budget ₹400-1000', rating: '4.0' }],

        transport: ['Walking', 'Auto-rickshaw', 'Scooter rental', 'Bus', 'Train from Trivandrum 1h'],

        tips: ['Less crowded than Goa', 'Ayurveda treatments are authentic', 'South cliff is quieter', 'Sunset from cliff is magical']
        ,
        packing: {'climate':'Hot humid (22-35C), monsoon Jun-Sep','dress':'Beachwear, light cotton','shoes':'Sandals, flip-flops, water shoes','medicine':'Sunscreen SPF50, mosquito repellent, ORS','comfort':'Beach mat, waterproof bag, hat','snacks':'Fresh fish, coconut water, banana chips'},

    },

    rameshwaram: {

        name: 'Rameshwaram', state: 'Tamil Nadu', bestTime: 'October to April',

        tagline: 'Island Temple — one of Char Dham and bridge to Lanka',

        places: [

            { name: 'Ramanathaswamy Temple', type: 'spiritual', desc: 'Char Dham. Longest corridor in world.', tip: 'Holy dip in 22 theerthams.', budget: 'Free' },

            { name: 'Pamban Bridge', type: 'landmark', desc: 'Bridge connecting island to mainland.', tip: 'Train crossing is thrilling.', budget: 'Free' },

            { name: 'Dhanushkodi', type: 'landmark', desc: 'Ghost town. Land\'s end of India.', tip: 'Remains of 1964 cyclone.', budget: '₹50 jeep' },

            { name: 'Kothandaramaswamy Temple', type: 'spiritual', desc: 'Temple on Dhanushkodi shore.', tip: 'Historical Ramayana site.', budget: 'Free' },

            { name: 'APJ Abdul Kalam Memorial', type: 'museum', desc: 'Former president\'s memorial.', tip: 'Inspiring museum.', budget: 'Free' },

            { name: 'Villoondi Theertham', type: 'spiritual', desc: 'Underwater spring. Well in sea.', tip: 'Unique natural phenomenon.', budget: 'Free' },

            { name: 'Gandhamadhana Parvatham', type: 'spiritual', desc: 'Hilltop temple. Ram\'s footprint.', tip: 'City panoramic view.', budget: 'Free' },

            { name: 'Agni Theertham', type: 'spiritual', desc: 'Holy sea bathing spot.', tip: 'Early morning dip.', budget: 'Free' }

        ],

        food: ['South Indian meals', 'Fish curry', 'Rasam rice', 'Idli sambar', 'Paniyaram', 'Seer fish fry'],

        hotels: [{ name: 'Hotel Daiict', budget: 'Premium ₹3K+', rating: '4.2' }, { name: 'Hotel TamilNadu', budget: 'Premium ₹3K+', rating: '4.1' }, { name: 'Hotel Ashoka', budget: 'Budget ₹1K-2K', rating: '3.8' }, { name: 'OYO Hotels', budget: 'Budget ₹800-1500', rating: '3.5' }],

        transport: ['Auto-rickshaw', 'Bicycle', 'Bus', 'Taxi', 'Train from Madurai 3h'],

        tips: ['Holy dip in 22 theerthams is main ritual', 'Pamban Bridge train crossing is thrilling', 'Dhanushkodi ghost town is haunting', 'Combine with Madurai temple visit']
        ,
        packing: {'climate':'Hot (25-37C), humid year-round','dress':'Light cotton, traditional dress for temple','shoes':'Slip-on for temple, walking shoes','medicine':'Sunscreen, ORS, mosquito repellent','comfort':'Water bottle, umbrella','snacks':'Panchamirtham, dry snacks'},

    },





    jaisalmer: {

        name: 'Jaisalmer', state: 'Rajasthan', bestTime: 'October to March',

        tagline: 'Golden City — desert fortress rising from Thar sands',

        places: [

            { name: 'Jaisalmer Fort', type: 'monument', desc: 'Living fort. 1/4 of city lives inside.', tip: 'Explore all day.', budget: '₹50' },

            { name: 'Sam Sand Dunes', type: 'nature', desc: 'Desert dunes. Camel safari.', tip: 'Sunset camel ride.', budget: '₹1000-3000 package' },

            { name: 'Patwon Ki Haveli', type: 'heritage', desc: 'Largest haveli. Intricate carvings.', tip: '5 havelis in complex.', budget: '₹50' },

            { name: 'Gadisar Lake', type: 'nature', desc: 'Artificial lake. Boating.', tip: 'Sunset.', budget: '₹100 boat' },

            { name: 'Bada Bagh', type: 'heritage', desc: 'Royal cenotaphs.', tip: 'Sunrise/sunset.', budget: '₹50' },

            { name: 'Desert National Park', type: 'nature', desc: 'Great Indian Bustard habitat.', tip: 'Jeep safari.', budget: '₹200' },

            { name: 'Kuldhara Ghost Village', type: 'heritage', desc: 'Abandoned haunted village.', tip: 'Spooky evening.', budget: '₹50' },

            { name: 'Vyas Chattri', type: 'heritage', desc: 'Cenotaphs of poets.', tip: 'Architecture.', budget: 'Free' }

        ],

        food: ['Dal Bati', 'Ker Sangri', 'Gatte Ki Sabji', 'Makhaniya Lassi', 'Desert camp dinner', 'Bajra Roti'],

        hotels: [{ name: 'Suryagarh', budget: 'Luxury ₹15K+', rating: '4.8' }, { name: 'Hotel Helsinki House', budget: 'Premium ₹3K+', rating: '4.3' }, { name: '1st Gate Home Fusion', budget: 'Premium ₹3K+', rating: '4.5' }, { name: 'Zostel Jaisalmer', budget: 'Budget ₹400-1200', rating: '4.2' }],

        transport: ['Walking fort area', 'Auto-rickshaw', 'Camel', 'Jeep safari', 'Train from Jodhpur 5h'],

        tips: ['Desert camp overnight is must', 'Fort has shops, cafes inside', 'Buy leather and mirror work', 'Camel safari at sunset is magical']
        ,
        packing: {'climate':'Extreme desert (5-48C)','dress':'Full cotton/linen covering body, scarf for sand','shoes':'Closed sandals/boots, walking shoes','medicine':'Sunscreen SPF50+, ORS, lip balm, eye drops','comfort':'Scarf, sunglasses, water bottle (2L+), hat','snacks':'Dal baati churma, pyaaz kachori'},

    }

};

// Greeting patterns

const greetings = ['hi', 'hello', 'hey', 'namaste', 'namaskar', 'vanakkam', 'good morning', 'good evening', 'good afternoon', 'howdy', 'sup', 'nǐ hǎo'];

const thankPatterns = ['thank', 'thanks', 'dhanyavad', 'shukriya', 'dhonnobad', 'thank you', 'thx'];

const stopWords = ['the', 'a', 'an', 'in', 'at', 'to', 'of', 'for', 'and', 'or', 'is', 'are', 'what', 'where', 'how', 'which', 'about', 'tell', 'me', 'show', 'give', 'some', 'can', 'you', 'please', 'from', 'near', 'my', 'i', 'want', 'need', 'going', 'visit', 'trip', 'travel'];



const topicKeywords = {

    places: ['place', 'spot', 'visit', 'see', 'attraction', 'monument', 'temple', 'fort', 'museum', 'park', 'garden', 'beach', 'ghat', 'landmark', 'church', 'mosque', 'palace', 'sight', 'sightseeing', 'explore', 'tour', 'temple', 'lake', 'falls', 'waterfall'],

    food: ['food', 'eat', 'restaurant', 'cafe', 'dish', 'cuisine', 'snack', 'breakfast', 'lunch', 'dinner', 'street food', 'thali', 'biryani', 'dosa', 'chaat', 'drink', 'coffee', 'tea', 'hungry', 'non-veg', 'veg', 'best food'],

    hotels: ['hotel', 'stay', 'room', 'lodge', 'hostel', 'accommodation', 'resort', 'airbnb', 'where to stay', 'night', 'sleep', 'book'],

    transport: ['transport', 'travel', 'get around', 'bus', 'train', 'metro', 'taxi', 'cab', 'auto', 'rickshaw', 'ride', 'commute', 'fly', 'flight', 'airport', 'how to reach'],

    time: ['when', 'best time', 'season', 'month', 'weather', 'climate', 'temperature', 'summer', 'winter', 'monsoon', 'rain'],

    budget: ['budget', 'cost', 'price', 'expensive', 'cheap', 'money', 'afford', 'splurge', 'save', 'rupee'],

    tips: ['tip', 'advice', 'suggestion', 'recommend', 'hack', 'avoid', 'must', 'should', 'important', 'note', 'careful', 'warning', 'safe', 'danger', 'risk'],

    packing: ['pack', 'packing', 'carry', 'bring', 'essential', 'essentials', 'clothes', 'dress', 'shoes', 'kit', 'bag', 'luggage', 'prepare', 'what to wear', 'what to carry', 'what to bring', 'outfit'],

    climate: ['climate', 'temperature', 'how hot', 'how cold', 'weather now', 'is it cold', 'is it hot', 'rainy', 'sunny', 'snow', 'fog'],

    medicine: ['medicine', 'medical', 'health', 'tablet', 'first aid', 'sick', 'pharmacy', 'doctor'],

    guide: ['guide', 'tell me about', 'tell me', 'overview', 'everything about', 'what to know', 'know about', 'info about', 'information about', 'comprehensive', 'complete guide', 'full guide', 'describe', 'details about', 'about ', 'what is', 'introduce', 'explain', 'help me plan', 'plan my trip', 'trip plan', 'travel guide', 'tour guide', 'explore']

};



function extractCity(query) {

    const lower = query.toLowerCase();

    const ALIASES = {
        'kashmir': 'srinagar', 'ladakh': 'leh', 'himachal': 'shimla',
        'uttarakhand': 'rishikesh', 'kerala': 'alleppey', 'rajasthan': 'jaipur',
        'northeast': 'gangtok', 'jammu': 'srinagar', 'madhya pradesh': 'khajuraho',
        'karnataka': 'bangalore', 'tamil nadu': 'chennai', 'andhra pradesh': 'hderabad',
        'west bengal': 'kolkata', 'maharashtra': 'mumbai', 'gujarat': 'ahmedabad',
        'odisha': 'puri', 'assam': 'kaziranga', 'himachal pradesh': 'shimla',
        'jammu and kashmir': 'srinagar', 'goa beaches': 'goa', 'pink city': 'jaipur',
        'city of joy': 'kolkata', 'city of lakes': 'udaipur', 'sun city': 'jodhpur',
        'holy city': 'varanasi', 'golden city': 'jaisalmer', 'queen of hills': 'darjeeling',
        'silicon valley': 'bangalore', 'gateway of india': 'mumbai',
    };

    for (const [alias, city] of Object.entries(ALIASES)) {
        if (lower.includes(alias)) return city;
    }

    for (const city of Object.keys(CHATBOT_DB)) {

        if (lower.includes(city)) return city;

    }

    const words = lower.split(/[\s,]+/);

    for (const word of words) {

        for (const city of Object.keys(CHATBOT_DB)) {

            if (city.startsWith(word) || word.startsWith(city.substring(0, 4))) return city;

        }

    }

    return null;

}



function detectTopics(query) {

    const lower = query.toLowerCase();

    const found = [];

    for (const [topic, keywords] of Object.entries(topicKeywords)) {

        for (const kw of keywords) {

            if (lower.includes(kw)) { found.push(topic); break; }

        }

    }

    if (found.length === 0) found.push('places');

    return found;

}



function formatPlaces(cityData, limit = 8) {

    let msg = `🗺️ Top places to visit in ${cityData.name}:\n\n`;

    const shown = cityData.places.slice(0, limit);

    const typeEmoji = { monument: '🏛️', landmark: '🏗️', spiritual: '🛕', nature: '🌿', beach: '🏖️', museum: '🏛️', market: '🛍️', park: '🌳', heritage: '🏰', entertainment: '🎢', art: '🎨', cultural: '🎭', nightlife: '🌙', adventure: '🪂' };

    shown.forEach((p, i) => {

        msg += `${typeEmoji[p.type] || '📍'} ${i + 1}. ${p.name}\n   ${p.desc}\n   💡 Tip: ${p.tip}\n   💰 ${p.budget}\n\n`;

    });

    return msg;

}



function formatFood(cityData) {

    let msg = `🍽️ Must-try food in ${cityData.name}:\n\n`;

    cityData.food.forEach((f, i) => { msg += `${i + 1}. ${f}\n`; });

    msg += `\n💡 Ask locals for hidden food gems — they always know best!`;

    return msg;

}



function formatHotels(cityData) {

    let msg = `🏨 Recommended stays in ${cityData.name}:\n\n`;

    cityData.hotels.forEach((h, i) => { msg += `${i + 1}. ${h.name} — ${h.budget} (⭐ ${h.rating})\n`; });

    return msg;

}



function formatTransport(cityData) {

    let msg = `🚗 Getting around ${cityData.name}:\n\n`;

    cityData.transport.forEach((t, i) => { msg += `${i + 1}. ${t}\n`; });

    return msg;

}



function formatTips(cityData) {

    let msg = `💡 Essential tips for ${cityData.name}:\n\n`;

    cityData.tips.forEach((t, i) => { msg += `${i + 1}. ${t}\n`; });

    return msg;

}



function formatPacking(cityData) {

    if (!cityData.packing) return 'No specific packing info available.';

    const p = cityData.packing;

    let msg = '\ud83c\udf92 Essential Packing Guide for ' + cityData.name + ':\n\n';

    msg += '\u2744\ufe0f Climate: ' + p.climate + '\n\n';

    msg += '\ud83d\udc55 Dress: ' + p.dress + '\n\n';

    msg += '\ud83d\udc5f Shoes: ' + p.shoes + '\n\n';

    msg += '\ud83d\udc8a Medicine: ' + p.medicine + '\n\n';

    msg += '\ud83e\uddec Comfort: ' + p.comfort + '\n\n';

    msg += '\ud83c\udf79 Snacks: ' + p.snacks + '\n\n';

    msg += 'Always carry ID copy and emergency contacts printed separately from phone!';

    return msg;

}



function generateChatResponse(query) {

    const lower = query.toLowerCase().trim();

    for (const g of greetings) {

        if (lower === g || lower.startsWith(g)) {

            const user = getCurrentUser();

            const dest = user && user.destination ? user.destination : null;

            let response = `Namaste! 🙏 I'm <b>Bharat Guide</b>, your AI tourist assistant.\n\nI have detailed info about 30+ Indian cities.`;

            if (dest) {

                const destLower = dest.toLowerCase().split(',')[0].trim();

                if (CHATBOT_DB[destLower]) {

                    response += `\n\n📍 Heading to ${CHATBOT_DB[destLower].name}? Here's your complete guide!\n\n`;
                    response += formatComprehensiveGuide(CHATBOT_DB[destLower]);

                }

            }

            response += `\n\nJust type a city name or ask anything!`;

            return response;

        }

    }

    for (const t of thankPatterns) {

        if (lower.includes(t)) return `You're welcome! 😊 Have a wonderful trip! Feel free to ask anything else. Bharat Mata Ki Jai! 🇮🇳`;

    }

    if (lower.includes('all cities') || lower.includes('list all') || lower.includes('which cities') || lower.includes('supported')) {

        let msg = `🌍 I have info about these cities:\n\n`;

        const sorted = Object.values(CHATBOT_DB).sort((a, b) => a.name.localeCompare(b.name));

        sorted.forEach(c => { msg += `📍 ${c.name} — ${c.tagline}\n`; });

        msg += `\nAsk me about any of these!`;

        return msg;

    }

    const city = extractCity(lower);

    const topics = detectTopics(lower);

    if (!city) {

        const user = getCurrentUser();

        if (user && user.destination) {

            const destLower = user.destination.toLowerCase().split(',')[0].trim();

            if (CHATBOT_DB[destLower]) {

                const cityData = CHATBOT_DB[destLower];

                let response = `📍 About ${cityData.name} (your destination):\n\n`;

                if (topics.includes('places')) response += formatPlaces(cityData, 5) + '\n';

                if (topics.includes('food')) response += formatFood(cityData) + '\n';

                if (topics.includes('hotels')) response += formatHotels(cityData) + '\n';

                if (topics.includes('transport')) response += formatTransport(cityData) + '\n';

                if (topics.includes('time')) response += `📅 Best time: ${cityData.bestTime}\n\n`;

                if (topics.includes('budget')) response += formatHotels(cityData) + '\n' + formatTips(cityData);

                if (topics.includes('tips')) response += formatTips(cityData);
                if (topics.includes('packing')) response += formatPacking(cityData) + '\n';
                if (topics.includes('guide')) response += formatComprehensiveGuide(cityData) + '\n';

                if (!response) response = formatComprehensiveGuide(cityData);

                return response.trim();

            }

        }

        const cityList = Object.keys(CHATBOT_DB).map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(', ');

        return `🤔 I'm not sure which city you mean. I have info about:\n\n${cityList}\n\nTry: "Places to visit in Kolkata" or "Best food in Delhi"`;

    }

    const cityData = CHATBOT_DB[city];

    let response = '';

    if (topics.includes('places')) response += formatPlaces(cityData) + '\n';

    if (topics.includes('food')) response += formatFood(cityData) + '\n';

    if (topics.includes('hotels')) response += formatHotels(cityData) + '\n';

    if (topics.includes('transport')) response += formatTransport(cityData) + '\n';

    if (topics.includes('time')) response += `📅 Best time to visit ${cityData.name}: ${cityData.bestTime}\n\n`;

    if (topics.includes('budget')) { response += `💰 Budget tips for ${cityData.name}:\n\n` + formatHotels(cityData) + '\n' + formatTips(cityData); }

    if (topics.includes('tips')) response += formatTips(cityData) + '\n';

    if (topics.includes('packing')) response += formatPacking(cityData) + '\n';
    if (topics.includes('guide')) response += formatComprehensiveGuide(cityData) + '\n';

    if (topics.includes('climate')) response += '\u2744\ufe0f Climate in ' + cityData.name + ': ' + (cityData.packing ? cityData.packing.climate : cityData.bestTime) + '\n\nBest time: ' + cityData.bestTime + '\n\n';

    if (topics.includes('medicine')) response += '\ud83d\udc8a Health for ' + cityData.name + ': ' + (cityData.packing ? cityData.packing.medicine : 'Carry basic first-aid.') + '\n\nCall 108 (Ambulance) or 104 (Health)\n';

    if (!response) response = formatComprehensiveGuide(cityData);

    return response.trim();

}




function formatComprehensiveGuide(cityData) {
    var msg = '';
    var typeEmoji = { monument: '\u26f2\ufe0f', landmark: '\ud83c\udfd7\ufe0f', spiritual: '\ud83d\uded5', nature: '\ud83c\udf3f', beach: '\ud83c\udfd6\ufe0f', museum: '\ud83c\udfdb\ufe0f', market: '\ud83d\udecd\ufe0f', park: '\ud83c\udf33', heritage: '\ud83c\udff0', adventure: '\ud83e\ude82', art: '\ud83c\udfa8', cultural: '\ud83c\udfad' };

    msg += '\ud83d\udccd ' + cityData.name + ' \u2014 ' + cityData.tagline + '\n';
    msg += '\ud83d\udccd State/Region: ' + cityData.state + '\n\n';
    msg += '\ud83d\udcc5 Best Time to Visit: ' + cityData.bestTime + '\n\n';

    msg += '\ud83d\uddfa\ufe0f TOP PLACES TO VISIT:\n';
    cityData.places.slice(0, 8).forEach(function(p, i) {
        msg += (typeEmoji[p.type] || '\ud83d\udccd') + ' ' + (i+1) + '. ' + p.name + '\n';
        msg += '   ' + p.desc + '\n';
        msg += '   \ud83d\udca1 Tip: ' + p.tip + '  |  \ud83d\udcb0 ' + p.budget + '\n';
    });
    msg += '\n';

    msg += '\ud83c\udf7d\ufe0f MUST-TRY FOOD:\n';
    cityData.food.forEach(function(f, i) { msg += (i+1) + '. ' + f + '\n'; });
    msg += '\n';

    if (cityData.packing) {
        msg += '\u2744\ufe0f WEATHER & CLIMATE:\n' + cityData.packing.climate + '\n\n';
        msg += '\ud83d\udc55 DRESS CODE:\n' + cityData.packing.dress + '\n\n';
        msg += '\ud83d\udc5f FOOTWEAR:\n' + cityData.packing.shoes + '\n\n';
        msg += '\ud83d\udc8a MEDICINES TO CARRY:\n' + cityData.packing.medicine + '\n\n';
        msg += '\ud83e\uddcc COMFORT TIPS:\n' + cityData.packing.comfort + '\n\n';
        msg += '\ud83c\udf79 SNACKS FOR JOURNEY:\n' + cityData.packing.snacks + '\n\n';
    }

    msg += '\ud83d\ude97 GETTING AROUND:\n';
    cityData.transport.forEach(function(t, i) { msg += (i+1) + '. ' + t + '\n'; });
    msg += '\n';

    msg += '\ud83c\udfe8 WHERE TO STAY:\n';
    cityData.hotels.forEach(function(h, i) { msg += (i+1) + '. ' + h.name + ' \u2014 ' + h.budget + ' (\u2b50 ' + h.rating + ')\n'; });
    msg += '\n';

    msg += '\ud83d\udca1 TRAVEL TIPS:\n';
    cityData.tips.forEach(function(t, i) { msg += (i+1) + '. ' + t + '\n'; });
    msg += '\n';

    msg += '\ud83d\ude4f Always carry ID copy and emergency contacts separately from phone!';
    msg += '\n\ud83d\udcde Emergency: 112 (Police) | 108 (Ambulance) | 1800-111-363 (Tourist Helpline)';
    return msg;
}
// ==================== CHATBOT UI ====================

function populateChatSuggestions() {

    const container = document.getElementById('chatbot-suggestions');

    if (!container) return;



    const allCities = Object.keys(CHATBOT_DB);

    const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;

    const dest = user && user.destination ? user.destination.toLowerCase().split(',')[0].trim() : null;



    let suggestions = [];



    // First: user's destination guide

    if (dest && CHATBOT_DB[dest]) {

        suggestions.push({ text: 'Tell me about ' + CHATBOT_DB[dest].name, label: '\ud83d\udccd Complete guide for ' + CHATBOT_DB[dest].name });

    }



    // Pick 5 diverse cities from different regions

    const regionPicks = ['goa', 'jaipur', 'varanasi', 'munnar', 'kolkata', 'shimla', 'leh', 'srinagar', 'udaipur', 'rishikesh', 'pondicherry', 'gangtok', 'jaisalmer', 'ooty', 'hampi', 'coorg', 'madurai', 'jodhpur', 'manali', 'amritsar'];

    const available = regionPicks.filter(c => allCities.includes(c) && c !== dest);

    // Shuffle and pick 5

    for (let i = available.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [available[i], available[j]] = [available[j], available[i]];

    }

    const pickedCities = available.slice(0, 5);

    pickedCities.forEach(c => {

        suggestions.push({ text: 'Tell me about ' + CHATBOT_DB[c].name, label: '\ud83d\udccd ' + CHATBOT_DB[c].name });

    });



    // Topic-based suggestions for user's destination

    const topicCity = dest && CHATBOT_DB[dest] ? CHATBOT_DB[dest].name : pickedCities[0] ? CHATBOT_DB[pickedCities[0]].name : 'Delhi';

    suggestions.push({ text: 'Best food in ' + topicCity, label: '\ud83c\udf7d\ufe0f Food in ' + topicCity });

    suggestions.push({ text: 'Packing for ' + topicCity, label: '\ud83c\udf92 Packing for ' + topicCity });

    suggestions.push({ text: 'How to reach ' + topicCity, label: '\ud83d\ude97 Transport to ' + topicCity });

    suggestions.push({ text: 'List all cities', label: '\ud83c\udf0d All cities' });



    container.innerHTML = suggestions.map(s =>

        '<button onclick="chatQuickAsk(\'' + s.text.replace(/'/g, "\\'") + '\')">' + s.label + '</button>'

    ).join('');

}



function toggleChatbot() {

    const panel = document.getElementById('chatbot-panel');

    const badge = document.getElementById('chatbot-badge');

    panel.classList.toggle('open');

    if (badge) badge.style.display = 'none';

    populateChatSuggestions();

}



function chatQuickAsk(text) {

    document.getElementById('chatbot-input').value = text;

    sendChatMessage();

}



function sendChatMessage() {

    const input = document.getElementById('chatbot-input');

    const msg = input.value.trim();

    if (!msg) return;

    const messages = document.getElementById('chatbot-messages');

    const userDiv = document.createElement('div');

    userDiv.className = 'chat-msg user';

    userDiv.innerHTML = '<div class="chat-avatar"><i class="fas fa-user"></i></div><div class="chat-bubble">' + escapeHtml(msg) + '</div>';

    messages.appendChild(userDiv);

    input.value = '';

    messages.scrollTop = messages.scrollHeight;

    const typingDiv = document.createElement('div');

    typingDiv.className = 'chat-msg bot';

    typingDiv.id = 'chat-typing';

    typingDiv.innerHTML = '<div class="chat-avatar"><i class="fas fa-robot"></i></div><div class="chat-typing"><span></span><span></span><span></span></div>';

    messages.appendChild(typingDiv);

    messages.scrollTop = messages.scrollHeight;

    setTimeout(() => {

        typingDiv.remove();

        const response = generateChatResponse(msg);

        const botDiv = document.createElement('div');

        botDiv.className = 'chat-msg bot';

        botDiv.innerHTML = '<div class="chat-avatar"><i class="fas fa-robot"></i></div><div class="chat-bubble">' + response.replace(/\n/g, '<br>') + '</div>';

        messages.appendChild(botDiv);

        messages.scrollTop = messages.scrollHeight;

    }, 600 + Math.random() * 800);

}



function escapeHtml(text) {

    const div = document.createElement('div');

    div.textContent = text;

    return div.innerHTML;

}



