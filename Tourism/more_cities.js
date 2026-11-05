// Additional cities to merge into CHATBOT_DB
const MORE_CITIES = {
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
    },
    manali: {
        name: 'Manali', state: 'Himachal Pradesh', bestTime: 'March to June, December to February',
        tagline: 'Adventure Capital — mountains, snow, and adrenaline',
        places: [
            { name: 'Solang Valley', type: 'nature', desc: 'Adventure hub. Paragliding, skiing.', tip: 'Winter for skiing.', budget: '₹500-2000 activities' },
            { name: 'Hadimba Temple', type: 'spiritual', desc: 'Wooden temple in cedar forest.', tip: 'Beautiful setting.', budget: 'Free' },
            { name: 'Old Manali', type: 'cultural', desc: 'Quaint village. Cafes, backpacker vibe.', tip: 'Evening walks.', budget: 'Free' },
            { name: 'Rohtang Pass', type: 'nature', desc: 'Mountain pass at 3,978m.', tip: 'Permit needed.', budget: '₹500 + permit' },
            { name: 'Jogini Waterfall', type: 'nature', desc: 'Trek to beautiful waterfall.', tip: 'Easy 2-hour trek.', budget: 'Free' },
            { name: 'Vashisht Village', type: 'spiritual', desc: 'Hot springs and temple.', tip: 'Natural hot bath.', budget: 'Free' },
            { name: 'Mall Road', type: 'market', desc: 'Shopping and dining.', tip: 'Evening stroll.', budget: 'Free' },
            { name: 'Great Himalayan NP', type: 'nature', desc: 'UNESCO national park.', tip: 'Full day needed.', budget: '₹200' }
        ],
        food: ['Thukpa', 'Momos', 'Trout at Johnson\'s', 'Dham', 'Israeli food', 'Maggi everywhere'],
        hotels: [{ name: 'The Himalayan', budget: 'Luxury ₹12K+', rating: '4.6' }, { name: 'Manu Allaya', budget: 'Luxury ₹10K+', rating: '4.7' }, { name: 'Hotel Beas', budget: 'Premium ₹3K+', rating: '4.0' }, { name: 'Zostel Manali', budget: 'Budget ₹400-1200', rating: '4.1' }],
        transport: ['Walking old town', 'Taxi', 'Local bus', 'Bike rental', 'HRTC bus to Rohtang'],
        tips: ['Rohtang permit sells out fast', 'Acclimatize before going high', 'Old Manali > New Manali', 'Carry layers — weather changes fast']
    },
    pushkar: {
        name: 'Pushkar', state: 'Rajasthan', bestTime: 'October to March',
        tagline: 'Sacred Lake Town — pilgrimage meets hippie vibes',
        places: [
            { name: 'Pushkar Lake', type: 'spiritual', desc: 'Sacred lake. 52 ghats. Holy dip.', tip: 'Sunrise magical.', budget: 'Free' },
            { name: 'Brahma Temple', type: 'spiritual', desc: 'One of few Brahma temples.', tip: 'Small but significant.', budget: 'Free' },
            { name: 'Pushkar Camel Fair', type: 'cultural', desc: 'Nov annual fair. Thousands of camels.', tip: 'Book months ahead.', budget: 'Free' },
            { name: 'Savitri Temple', type: 'spiritual', desc: 'Hilltop temple. Panoramic views.', tip: 'Ropeway or trek.', budget: '₹75 ropeway' },
            { name: 'Varah Ghat', type: 'spiritual', desc: 'Evening aarti ghat.', tip: 'Attend aarti.', budget: 'Free' },
            { name: 'Pushkar Bazaar', type: 'market', desc: 'Leather, jewelry, textiles.', tip: 'Bargain essential.', budget: 'Free' },
            { name: 'Cardamom Cafe', type: 'cultural', desc: 'Rooftop cafe. Lake views.', tip: 'Live music evenings.', budget: 'Free' },
            { name: 'Rose Garden', type: 'nature', desc: 'Finest roses in India.', tip: 'Buy rose products.', budget: 'Free' }
        ],
        food: ['Malpua', 'Dal Bati', 'Thali at Little Italy', 'Pizza at Edelweiss', 'Lassi at Rainbow', 'Chai rooftops'],
        hotels: [{ name: 'Westin Pushkar', budget: 'Luxury ₹10K+', rating: '4.6' }, { name: 'Inn Seventh Heaven', budget: 'Premium ₹3K+', rating: '4.4' }, { name: 'Hotel Temple View', budget: 'Budget ₹1K-2K', rating: '4.0' }, { name: 'Zostel Pushkar', budget: 'Budget ₹400-1000', rating: '4.1' }],
        transport: ['Walking small town', 'Auto-rickshaw', 'Camel rides', 'Scooter rental', 'Bus from Ajmer 14km'],
        tips: ['Holy dip in Pushkar Lake is spiritual', 'Camel Fair Nov is world-famous', 'Rooftop cafes for sunset', 'Pushkar small — 2 days enough']
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
    },
    cooporg: {
        name: 'Coorg', state: 'Karnataka', bestTime: 'October to May',
        tagline: 'Scotland of India — coffee plantations and misty hills',
        places: [
            { name: 'Abbey Falls', type: 'nature', desc: 'Beautiful waterfall. Coffee estates.', tip: 'Monsoon best.', budget: '₹15' },
            { name: 'Raja\'s Seat', type: 'nature', desc: 'Viewpoint. Musical garden.', tip: 'Sunset.', budget: '₹10' },
            { name: 'Dubare Elephant Camp', type: 'nature', desc: 'Elephant bathing, feeding.', tip: 'River rafting too.', budget: '₹500' },
            { name: 'Namdroling Monastery', type: 'spiritual', desc: 'Tibetan monastery. Golden Temple.', tip: 'Peaceful.', budget: 'Free' },
            { name: 'Talacauvery', type: 'spiritual', desc: 'Origin of river Kaveri.', tip: 'Early morning.', budget: 'Free' },
            { name: 'Coffee Plantation Tour', type: 'cultural', desc: 'Walk through estates. Tasting.', tip: 'Stay at plantation.', budget: '₹200-500' },
            { name: 'Bylakuppe', type: 'cultural', desc: 'Tibetan settlement. Golden Temple.', tip: 'Authentic Tibetan food.', budget: 'Free' },
            { name: 'Nisargadhama', type: 'nature', desc: 'Island park. Bamboo rafting.', tip: 'Families.', budget: '₹50' }
        ],
        food: ['Pandi Curry pork', 'Akki Roti', 'Bamboo Shoot Curry', 'Kadambuttu', 'Coorgi Biryani', 'Coffee'],
        hotels: [{ name: 'Tamara Coorg', budget: 'Luxury ₹20K+', rating: '4.8' }, { name: 'Orange County', budget: 'Luxury ₹15K+', rating: '4.7' }, { name: 'Coorg Wilderness', budget: 'Premium ₹5K+', rating: '4.5' }, { name: 'Zostel Coorg', budget: 'Budget ₹500-1500', rating: '4.1' }],
        transport: ['Rented car essential', 'Jeep safari', 'Walking plantation', 'Bus from Mysore 3h', 'Taxi'],
        tips: ['Rented car is essential', 'Stay at coffee plantation', 'Try Pandi Curry authentic', 'Rain Jun-Sep carry rain gear']
    },
    munnar: {
        name: 'Munnar', state: 'Kerala', bestTime: 'September to May',
        tagline: 'Tea Capital of South India — rolling green hills',
        places: [
            { name: 'Tea Plantations', type: 'nature', desc: 'Endless green hills.', tip: 'Tata Tea Museum.', budget: '₹75 museum' },
            { name: 'Eravikulam National Park', type: 'nature', desc: 'Nilgiri Tahr habitat.', tip: 'Go early tickets limited.', budget: '₹120' },
            { name: 'Top Station', type: 'nature', desc: 'Highest point. Tamil Nadu border.', tip: 'Fog can block.', budget: 'Free' },
            { name: 'Mattupetty Dam', type: 'nature', desc: 'Dam with boating.', tip: 'Speed boat.', budget: '₹50' },
            { name: 'Echo Point', type: 'nature', desc: 'Lake with echo.', tip: 'Quick stop.', budget: '₹10' },
            { name: 'Kundala Lake', type: 'nature', desc: 'Scenic lake. Shikara boats.', tip: 'Less crowded.', budget: '₹150' },
            { name: 'Attukal Waterfalls', type: 'nature', desc: 'Cascading waterfall.', tip: 'Short trek.', budget: 'Free' },
            { name: 'Photo Point', type: 'nature', desc: 'Scenic valley viewpoint.', tip: 'Great photos.', budget: 'Free' }
        ],
        food: ['Kerala meals', 'Appam and Stew', 'Cardamom Tea', 'Fish Curry', 'Dosa', 'Chocolate'],
        hotels: [{ name: 'SpiceTree Munnar', budget: 'Luxury ₹12K+', rating: '4.7' }, { name: 'Fragrant Nature', budget: 'Premium ₹5K+', rating: '4.5' }, { name: 'Blanket Hotel', budget: 'Premium ₹4K+', rating: '4.3' }, { name: 'Zostel Munnar', budget: 'Budget ₹500-1200', rating: '4.0' }],
        transport: ['Rented car best', 'Auto-rickshaw', 'Bus from Kochi 4h', 'Taxi', 'Walking town'],
        tips: ['Carry warm clothes always misty', 'Eravikulam tickets sell out by 8 AM', 'Visit tea factory', 'Combine with Thekkady 2h']
    }
};
