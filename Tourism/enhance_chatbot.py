import re

with open('chatbot.js', 'r', encoding='utf-8') as f:
    js = f.read()

# 1. Add packing data to each city
packing_data = {
    'delhi': '{ climate: "Hot summers (45C), cold winters (2C), polluted Nov-Feb", dress: "Light cotton in summer, woolens in winter, modest for mosques", shoes: "Walking shoes, sandals", medicine: "N95 mask, sunscreen SPF50+, ORS, basic first-aid", comfort: "Water bottle, sanitizer, power bank, umbrella", snacks: "Dry fruits, energy bars, water" }',
    'mumbai': '{ climate: "Hot humid (38C), heavy monsoon Jun-Sep", dress: "Light breathable cotton, waterproof jacket monsoon", shoes: "Waterproof sandals, walking shoes", medicine: "ORS, mosquito repellent, sunscreen, anti-fungal", comfort: "Umbrella/raincoat, waterproof bag, power bank", snacks: "Dry fruits, packaged water" }',
    'kolkata': '{ climate: "Hot humid (38C), pleasant winters (12C), heavy monsoon", dress: "Light cotton, shawl for AC, modest for temples", shoes: "Walking shoes, waterproof sandals", medicine: "ORS, mosquito repellent, sunscreen, digestive tablets", comfort: "Umbrella, power bank, water bottle, wet wipes", snacks: "Dry fruits, packaged water" }',
    'bangalore': '{ climate: "Pleasant (15-35C), rain Jun-Sep", dress: "Light layers, warm mornings cool evenings", shoes: "Walking shoes, sneakers", medicine: "Sunscreen, basic first-aid, allergy tablets", comfort: "Light jacket evenings, power bank, umbrella", snacks: "Dry fruits, filter coffee, energy bars" }',
    'chennai': '{ climate: "Very hot (40C+), humid, monsoon Oct-Dec", dress: "Light cotton, cover shoulders for temples, sunscreen essential", shoes: "Breathable sandals, walking shoes", medicine: "Sunscreen SPF50+, ORS, mosquito repellent, anti-heat powder", comfort: "Sun hat, sunglasses, 3L+ water bottle, power bank", snacks: "Dry fruits, electrolyte packets, water" }',
    'pune': '{ climate: "Pleasant (10-38C), monsoon Jun-Sep", dress: "Light cotton summer, layers for treks", shoes: "Trekking shoes for forts, walking shoes", medicine: "Sunscreen, first-aid, ORS for treks", comfort: "Light jacket, umbrella, power bank, trekking gear", snacks: "Dry fruits, energy bars" }',
    'jaipur': '{ climate: "Extreme heat (48C), pleasant winters (5C), dry", dress: "Loose cotton summer, warm woolens winter, headscarf for sun", shoes: "Walking shoes, closed shoes for desert", medicine: "Sunscreen SPF50+, ORS essential!, anti-heat powder", comfort: "Water bottle 4L+, sun hat, umbrella, power bank", snacks: "Dry fruits, energy bars, electrolyte sachets" }',
    'varanasi': '{ climate: "Hot (45C), pleasant winters (10C), humid monsoon", dress: "Light modest clothes, cover head for temples", shoes: "Easy slip-on shoes, waterproof sandals", medicine: "ORS, sunscreen, mosquito repellent, water purification tablets", comfort: "Water bottle, wet wipes, cloth for ghats, power bank", snacks: "Dry fruits, packaged water, energy bars" }',
    'agra': '{ climate: "Extreme heat (47C), cold winters (2C), fog Dec-Jan", dress: "Light cotton summer, layers winter, comfortable for long walks", shoes: "Very comfortable walking shoes for Taj complex", medicine: "Sunscreen, ORS, first-aid, cold medicine winter", comfort: "Water bottle, sun hat, sunglasses, power bank", snacks: "Dry fruits, petha local sweet, water" }',
    'goa': '{ climate: "Hot humid (32C), monsoon Jun-Sep", dress: "Beach wear, light cotton, modest for churches", shoes: "Sandals, water shoes for rocky beaches", medicine: "Sunscreen SPF50+, mosquito repellent, anti-diarrheal", comfort: "Reef-safe sunscreen, waterproof bag, hat, power bank", snacks: "Coconut water, dry fruits, water" }',
    'udaipur': '{ climate: "Hot (42C), cold winters (5C), monsoon Jul-Sep", dress: "Light cotton summer, woolens winter, elegant for palaces", shoes: "Walking shoes, sandals", medicine: "Sunscreen, ORS, mosquito repellent", comfort: "Sun hat, water bottle, umbrella, power bank", snacks: "Dry fruits, energy bars, water" }',
    'shimla': '{ climate: "Cool summers (15-25C), freezing winters (-5 to 10C), snow Dec-Feb", dress: "Warm layers thermals, fleece, jacket, woolens", shoes: "Waterproof boots winter, walking shoes, grip sole for ice", medicine: "Altitude sickness medicine, cold/flu tablets, sunscreen snow glare", comfort: "Gloves, muffler, thermal innerwear, hand warmers, power bank", snacks: "Hot soup, tea, Maggi, dry fruits, energy bars" }',
    'manali': '{ climate: "Cool (10-25C), freezing winters (-10 to 5C), snow Oct-Apr", dress: "Heavy woolens winter, layers summer, waterproof jacket", shoes: "Waterproof boots, trekking shoes, grip for ice/snow", medicine: "Altitude sickness Diamox, first-aid, sunscreen, lip balm", comfort: "Thermal layers, gloves, beanie, sunglasses snow glare, power bank", snacks: "Hot tea/soup, Maggi, dry fruits, glucose" }',
    'darjeeling': '{ climate: "Pleasant (10-20C), cold winters (2-10C), monsoon Jun-Sep", dress: "Warm layers fleece, jacket, woolens, even summer cool", shoes: "Warm waterproof shoes, trekking shoes", medicine: "Cold tablets, sunscreen high altitude, motion sickness", comfort: "Gloves, muffler, umbrella monsoon, thermos, power bank", snacks: "Tea, Maggi, dry fruits, energy bars" }',
    'srinagar': '{ climate: "Hot summers (30C), freezing (-5 to 5C), snow Dec-Feb", dress: "Warm woolens winter, cotton summer, modest for mosques", shoes: "Waterproof boots winter, walking shoes", medicine: "Altitude sickness, first-aid, sunscreen, cold medicine", comfort: "Thermal layers, gloves, cap, warm blanket, power bank", snacks: "Kahwa tea, dry fruits, energy bars" }',
    'amritsar': '{ climate: "Hot (45C), cold winters (2C), fog Dec-Jan", dress: "Cotton summer, woolens winter, cover head at Golden Temple", shoes: "Comfortable walking shoes", medicine: "Sunscreen, ORS, cold medicine, first-aid", comfort: "Head covering scarf, water bottle, umbrella, power bank", snacks: "Langar free meal!, dry fruits, water" }',
    'rishikesh': '{ climate: "Pleasant (20-35C), cool winters (5-20C), monsoon Jul-Sep", dress: "Cotton, modest for temples/ashrams, light layers", shoes: "Trekking shoes, sandals", medicine: "First-aid, insect repellent, sunscreen, altitude if trekking", comfort: "Yoga mat if attending, light jacket, power bank, water", snacks: "Fruit juices, dry fruits, energy bars" }',
    'mysore': '{ climate: "Hot (35C), pleasant winters (15-25C), rain Jun-Oct", dress: "Light cotton, modest for temples", shoes: "Walking shoes, sandals", medicine: "Sunscreen, mosquito repellent, first-aid", comfort: "Light jacket evenings, umbrella monsoon, power bank", snacks: "Mysore Pak, dry fruits, filter coffee, water" }',
    'hampi': '{ climate: "Hot (38C+), pleasant Oct-Feb, monsoon Jun-Sep", dress: "Loose cotton, comfortable for climbing ruins", shoes: "Sturdy sandals/trekking shoes boulder terrain", medicine: "Sunscreen SPF50+, ORS essential!, mosquito repellent", comfort: "Water bottle 4L!, sun hat, power bank, sunscreen", snacks: "Dry fruits, energy bars, electrolyte packets" }',
    'khajuraho': '{ climate: "Hot (45C), pleasant winters (8-25C)", dress: "Light cotton, comfortable layers winter", shoes: "Walking shoes, sandals", medicine: "Sunscreen, ORS, first-aid, mosquito repellent", comfort: "Sun hat, water bottle, umbrella, power bank", snacks: "Dry fruits, packaged water, energy bars" }',
    'leh': '{ climate: "Cold (-30 to 20C), dry, high altitude UV", dress: "Heavy woolens, thermal layers, waterproof jacket, sunglasses essential", shoes: "Insulated waterproof boots, trekking shoes, warm socks", medicine: "Altitude sickness Diamox, SPF50+ sunscreen, lip balm, first-aid", comfort: "Thermal innerwear, gloves, beanie, balaclava, oxygen can, power bank", snacks: "Dry fruits, nuts, energy bars, glucose, warm liquids" }',
    'hyderabad': '{ climate: "Hot (42C), pleasant winters (15-28C)", dress: "Light cotton, modest for mosques", shoes: "Walking shoes, sandals", medicine: "Sunscreen, ORS, mosquito repellent, first-aid", comfort: "Sun hat, water bottle, umbrella monsoon, power bank", snacks: "Biryani energy, dry fruits, water" }',
    'ahmedabad': '{ climate: "Hot (45C), pleasant winters (10-28C)", dress: "Light cotton, traditional welcome, modest for temples", shoes: "Walking shoes, sandals", medicine: "Sunscreen SPF50+, ORS, first-aid", comfort: "Sun hat, water bottle, umbrella monsoon, power bank", snacks: "Dry fruits, buttermilk, water" }',
    'lucknow': '{ climate: "Hot (45C), cold winters (3-8C), fog Dec-Jan", dress: "Cotton summer, woolens winter, elegant Nawabi style", shoes: "Walking shoes, warm shoes winter", medicine: "Sunscreen, ORS, cold medicine, first-aid", comfort: "Warm layers winter, umbrella, power bank, water", snacks: "Kebabs energy, dry fruits, chai, water" }',
    'pondicherry': '{ climate: "Hot humid (35C), monsoon Oct-Nov", dress: "Beachwear, cotton, modest for ashram", shoes: "Sandals, walking shoes, water shoes", medicine: "Sunscreen SPF50+, mosquito repellent, anti-diarrheal", comfort: "Sun hat, reef-safe sunscreen, water bottle, power bank", snacks: "Pastries, dry fruits, coconut water, water" }',
    'jodhpur': '{ climate: "Extreme heat (48C), pleasant winter (7-25C), dry", dress: "Loose cotton, headscarf for sun, desert scarf", shoes: "Walking shoes, closed shoes desert safari", medicine: "Sunscreen SPF50+, ORS essential!, anti-heat powder", comfort: "Water bottle 4L+!, sun hat, desert scarf, power bank", snacks: "Dry fruits, energy bars, electrolyte sachets" }',
    'ooty': '{ climate: "Cool (5-25C), rain Jun-Oct, cold Dec-Feb", dress: "Warm layers jacket, fleece, woolens", shoes: "Warm shoes, trekking shoes, waterproof boots", medicine: "First-aid, cold medicine, sunscreen high altitude", comfort: "Gloves, muffler, umbrella rain, thermos, power bank", snacks: "Hot tea/chocolate, dry fruits, soup" }',
    'pushkar': '{ climate: "Hot (42C), pleasant winter (8-25C)", dress: "Light cotton, modest for holy lake", shoes: "Sandals, walking shoes", medicine: "Sunscreen, ORS, first-aid, mosquito repellent", comfort: "Sun hat, water bottle, scarf temples, power bank", snacks: "Malpua, dry fruits, chai, water" }',
    'dharamshala': '{ climate: "Cool (10-25C), cold winters (0-10C), monsoon Jul-Sep", dress: "Warm layers jacket, fleece, woolens", shoes: "Trekking shoes Triund, warm shoes", medicine: "Altitude sickness if trekking, first-aid, sunscreen", comfort: "Warm layers, gloves, muffler, umbrella, power bank", snacks: "Tibetan food, tea, Maggi, dry fruits" }',
    'coorg': '{ climate: "Pleasant (15-30C), heavy rain Jun-Oct", dress: "Light cotton, layers mornings, rain jacket essential", shoes: "Waterproof shoes, trekking shoes", medicine: "Insect repellent plantation, sunscreen, first-aid", comfort: "Rain jacket/umbrella essential, warm layers, power bank", snacks: "Coffee plantation, dry fruits, water" }',
    'munnar': '{ climate: "Cool (10-25C), rain Jun-Oct, cold Dec-Feb", dress: "Warm layers jacket, fleece, woolens", shoes: "Trekking shoes, warm shoes, waterproof boots", medicine: "First-aid, cold medicine, sunscreen, mosquito repellent", comfort: "Gloves, muffler, umbrella rain, thermos, power bank", snacks: "Tea plantation, dry fruits, hot chocolate" }',
}

for city_key, packing in packing_data.items():
    pattern = rf'(    {re.escape(city_key)}: \{{.*?tips: \[.*?\],)'
    match = re.search(pattern, js, re.DOTALL)
    if match:
        old = match.group(1)
        new = old + f'\n        packing: {packing},'
        js = js.replace(old, new, 1)

# 2. Add new topic keywords
old_topics = """    tips: ['tip', 'advice', 'suggestion', 'recommend', 'hack', 'avoid', 'must', 'should', 'important', 'note', 'careful', 'warning', 'safe', 'danger', 'risk']
};"""

new_topics = """    tips: ['tip', 'advice', 'suggestion', 'recommend', 'hack', 'avoid', 'must', 'should', 'important', 'note', 'careful', 'warning', 'safe', 'danger', 'risk'],
    packing: ['pack', 'packing', 'carry', 'bring', 'essential', 'essentials', 'clothes', 'dress', 'shoes', 'kit', 'bag', 'luggage', 'prepare', 'what to wear', 'what to carry', 'what to bring', 'outfit'],
    climate: ['climate', 'temperature', 'how hot', 'how cold', 'weather now', 'is it cold', 'is it hot', 'rainy', 'sunny', 'snow', 'fog'],
    medicine: ['medicine', 'medical', 'health', 'tablet', 'first aid', 'sick', 'pharmacy', 'doctor']
};"""

js = js.replace(old_topics, new_topics)

# 3. Add formatPacking function before generateChatResponse
old_gen = 'function generateChatResponse(query) {'
new_gen = """function formatPacking(cityData) {
    if (!cityData.packing) return 'No specific packing info available.';
    const p = cityData.packing;
    let msg = '\\ud83c\\udf92 Essential Packing Guide for ' + cityData.name + ':\\n\\n';
    msg += '\\u2744\\ufe0f Climate: ' + p.climate + '\\n\\n';
    msg += '\\ud83d\\udc55 Dress: ' + p.dress + '\\n\\n';
    msg += '\\ud83d\\udc5f Shoes: ' + p.shoes + '\\n\\n';
    msg += '\\ud83d\\udc8a Medicine: ' + p.medicine + '\\n\\n';
    msg += '\\ud83e\\uddec Comfort: ' + p.comfort + '\\n\\n';
    msg += '\\ud83c\\udf79 Snacks: ' + p.snacks + '\\n\\n';
    msg += 'Always carry ID copy and emergency contacts printed separately from phone!';
    return msg;
}

function generateChatResponse(query) {"""

js = js.replace(old_gen, new_gen)

# 4. Update response generation for packing/climate/medicine
old_resp = """    if (topics.includes('tips')) response += formatTips(cityData) + '\\n';
    if (!response) response = formatPlaces(cityData, 5) + '\\n\\u200b\\ud83d\\udca1 Ask about food, hotels, transport, or tips for ' + cityData.name + '!';"""

new_resp = """    if (topics.includes('tips')) response += formatTips(cityData) + '\\n';
    if (topics.includes('packing')) response += formatPacking(cityData) + '\\n';
    if (topics.includes('climate')) response += '\\u2744\\ufe0f Climate in ' + cityData.name + ': ' + (cityData.packing ? cityData.packing.climate : cityData.bestTime) + '\\n\\nBest time: ' + cityData.bestTime + '\\n\\n';
    if (topics.includes('medicine')) response += '\\ud83d\\udc8a Health for ' + cityData.name + ': ' + (cityData.packing ? cityData.packing.medicine : 'Carry basic first-aid.') + '\\n\\nCall 108 (Ambulance) or 104 (Health)\\n';
    if (!response) response = formatPlaces(cityData, 5) + '\\n\\ud83d\\udca1 Ask about food, hotels, transport, packing, or tips for ' + cityData.name + '!';"""

js = js.replace(old_resp, new_resp)

with open('chatbot.js', 'w', encoding='utf-8') as f:
    f.write(js)

print(f"Updated chatbot.js: {len(js)} bytes")
