import re

# Read chatbot.js
with open('chatbot.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Packing data for cities missing it
PACKING_DATA = {
    'delhi': "        packing: { climate: 'Extreme heat (45C summer), cold foggy winters (2-5C)', dress: 'Light cotton summer, heavy woolens winter, modest for mosques', shoes: 'Comfortable walking shoes, sandals', medicine: 'N95 masks (AQI 400+), sunscreen SPF50, ORS, inhaler for sensitive lungs', comfort: 'Water bottle, hand sanitizer, power bank, umbrella', snacks: 'Dry fruits, energy bars' },\n",
    'ahmedabad': "        packing: { climate: 'Very hot summers (45C+), mild pleasant winters (10-25C)', dress: 'Light cotton clothing, sun-protective hats', shoes: 'Breathable walking shoes, sandals', medicine: 'Sunscreen SPF50+, ORS sachets, anti-heat powder', comfort: 'Cotton towel, water bottle, electrolyte packets', snacks: 'Dry snacks, water' },\n",
    'haridwar': "        packing: { climate: 'Hot summers (40C), pleasant winters (5-20C)', dress: 'Modest clothing for temples, light cottons, warm layers in winter', shoes: 'Slip-on shoes (remove at temples), waterproof sandals', medicine: 'Ganga water purification tablets, ORS, basic first-aid', comfort: 'Reusable water bottle, mosquito repellent, flashlight', snacks: 'Temple prasad area snacks, dry fruits' },\n",
    'dehradun': "        packing: { climate: 'Pleasant (15-35C), monsoon heavy Jul-Sep', dress: 'Light layers, rain jacket monsoon, warm jacket winter', shoes: 'Waterproof trekking shoes, comfortable walking shoes', medicine: 'Leech repellent (monsoon), sunscreen, ORS, basic medicines', comfort: 'Rain poncho, power bank, reusable water bottle', snacks: 'Local petha, dry fruits' },\n",
    'mussoorie': "        packing: { climate: 'Cool (0-25C), freezing in winter with snow', dress: 'Heavy woolens winter (Dec-Feb), light layers summer, rain gear monsoon', shoes: 'Trekking boots with grip, waterproof shoes monsoon', medicine: 'Altitude sickness pills (if going higher), cold medication, sunscreen', comfort: 'Thermos flask, warm socks, gloves, umbrella', snacks: 'Hot chocolate supplies, dry fruits, energy bars' },\n",
    'nainital': "        packing: { climate: 'Cool (0-28C), snowfall Dec-Feb', dress: 'Heavy woolens winter, light cotton summer, rain gear monsoon', shoes: 'Trekking boots (snow grip), waterproof shoes', medicine: 'Cold cream, lip balm, sunscreen SPF50, basic first-aid', comfort: 'Thermos, warm blanket, gloves, muffler', snacks: 'Hot soup packets, dry fruits, chocolate' },\n",
    'dalhousie': "        packing: { climate: 'Cold (-5 to 25C), heavy snowfall Dec-Feb', dress: 'Heavy woolens, thermal innerwear, waterproof jacket', shoes: 'Snow boots with grip, waterproof trekking shoes', medicine: 'Cold & flu medicine, lip balm, petroleum jelly for skin', comfort: 'Hand warmers, thermos, sleeping bag for trekking', snacks: 'Energy bars, chocolate, dry fruits' },\n",
    'kasol': "        packing: { climate: 'Cool (0-25C), cold nights year-round', dress: 'Warm layers even in summer, heavy woolens winter, rain gear', shoes: 'Trekking boots essential, waterproof sandals for riverside', medicine: 'Leech repellent monsoon, altitude sickness pills, basic first-aid kit', comfort: 'Sleeping bag liner, flashlight, power bank, reusable bottle', snacks: 'Trail mix, energy bars, instant noodles' },\n",
    'coonoor': "        packing: { climate: 'Pleasant (10-25C), misty mornings, chilly evenings', dress: 'Light woolens, jacket for evenings, comfortable casual wear', shoes: 'Comfortable walking shoes for tea estate treks, sandals', medicine: 'Mosquito repellent (hill leeches in monsoon), sunscreen, basic medicines', comfort: 'Light shawl/cardigan, water bottle, camera', snacks: 'Tea estate cafe snacks, dry fruits, chocolates' },\n",
    'kodaikanal': "        packing: { climate: 'Cool (8-25C), misty and rainy Jul-Oct', dress: 'Light woolens, waterproof jacket, warm layers for mornings', shoes: 'Waterproof trekking shoes, comfortable sandals', medicine: 'Leech repellent (monsoon), cold cream, sunscreen, ORS', comfort: 'Umbrella, rain poncho, warm socks', snacks: 'Homemade chocolates, dry fruits, hot beverage supplies' },\n",
    'wayanad': "        packing: { climate: 'Tropical (20-35C), heavy monsoon Jun-Oct', dress: 'Light cotton clothes, leech-proof clothing monsoon, waterproof jacket', shoes: 'Waterproof trekking shoes essential, rubber chappals for rains', medicine: 'Leech repellent, mosquito repellent, sunscreen, ORS', comfort: 'Rain poncho, insect repellent, power bank', snacks: 'Trail mix, water bottles, energy bars' },\n",
    'alleppey': "        packing: { climate: 'Hot humid (25-35C), heavy monsoon Jun-Sep', dress: 'Light cotton/linen, rain gear, modest clothing for temples', shoes: 'Waterproof sandals, comfortable walking shoes', medicine: 'Mosquito repellent essential, sunscreen, ORS, anti-allergy pills', comfort: 'Waterproof bag for houseboat, sunscreen, hat, umbrella', snacks: 'Coconut water, banana chips, dry fruits' },\n",
    'madurai': "        packing: { climate: 'Hot (25-40C), dry summers, pleasant Nov-Feb', dress: 'Light cotton, covered shoulders/knees for Meenakshi Temple', shoes: 'Comfortable slip-ons (temple visits), walking shoes', medicine: 'Sunscreen, ORS, electrolyte tablets, basic stomach medicine', comfort: 'Water bottle, umbrella, hand fan, power bank', snacks: 'Jigarthanda drink, parotta, dry snacks' },\n",
    'puri': "        packing: { climate: 'Hot humid (25-40C), cyclone season Oct-Dec', dress: 'Light cotton, beachwear, modest dress for Jagannath Temple', shoes: 'Sandals for beach, comfortable walking shoes', medicine: 'Sunscreen SPF50, mosquito repellent, ORS, anti-diarrheal', comfort: 'Beach towel, waterproof bag, hat, umbrella', snacks: 'Chuda ghasa, dry fruits, bottled water' },\n",
    'gangtok': "        packing: { climate: 'Cool (0-25C), monsoon heavy Jun-Sep, snow in higher areas', dress: 'Warm layers, waterproof jacket, thermal innerwear for high altitude', shoes: 'Trekking boots with grip, waterproof shoes', medicine: 'Altitude sickness pills (for Nathula), cold medicine, basic first-aid', comfort: 'Power bank, reusable water bottle, warm gloves', snacks: 'Momos, thukpa, energy bars for treks' },\n",
    'shillong': "        packing: { climate: 'Pleasant (4-25C), heavy monsoon Jun-Sep', dress: 'Light woolens, rain jacket, warm layers for evenings', shoes: 'Waterproof trekking shoes, comfortable sandals', medicine: 'Leech repellent monsoon, sunscreen, cold medicine, ORS', comfort: 'Umbrella, rain poncho, warm shawl', snacks: 'Local street food, dry fruits, hot beverages' },\n",
    'kaziranga': "        packing: { climate: 'Tropical (10-35C), park closed monsoon (Jun-Sep)', dress: 'Earth-tone/olive clothing, long sleeves, hat for safari', shoes: 'Closed-toe sturdy shoes for safari, waterproof boots', medicine: 'Strong mosquito repellent essential, sunscreen, basic first-aid, anti-allergy', comfort: 'Binoculars, camera with zoom, water bottle, hat', snacks: 'Packed lunch for safari, water, dry snacks' },\n",
    'darbhanga': "        packing: { climate: 'Extreme (2-45C), hot summers, cold foggy winters', dress: 'Light cotton summers, heavy woolens winters, modest clothing', shoes: 'Comfortable walking shoes, sandals', medicine: 'Sunscreen, ORS sachets, mosquito repellent, basic medicines', comfort: 'Water bottle, umbrella (rain and sun), power bank', snacks: 'Laddu-peda, dry fruits, bottled water' },\n",
    'warangal': "        packing: { climate: 'Hot (20-42C), monsoon Jul-Oct, pleasant Oct-Feb', dress: 'Light cotton, comfortable clothing for temple visits', shoes: 'Comfortable walking shoes, sandals', medicine: 'Sunscreen SPF50+, ORS, mosquito repellent, basic first-aid', comfort: 'Water bottle, hat, umbrella, power bank', snacks: 'Bajra roti, local sweets, dry fruits' },\n",
    'badami': "        packing: { climate: 'Very hot (25-42C), pleasant Nov-Feb', dress: 'Light cotton, sun hat, temple-appropriate clothing', shoes: 'Sturdy walking shoes for cave exploration, sandals', medicine: 'Sunscreen (extreme heat), ORS, anti-heat medicine, basic first-aid', comfort: 'Water bottle (carry extra!), hat, umbrella, sunglasses', snacks: 'Jolada rotti, local food, energy bars' },\n",
    'gokarna': "        packing: { climate: 'Hot humid (22-35C), monsoon Jun-Sep', dress: 'Beachwear, modest clothes for temples, light cotton', shoes: 'Flip-flops for beach, sturdy sandals for rocky treks', medicine: 'Sunscreen SPF50, mosquito repellent, ORS, basic medicines', comfort: 'Beach towel, waterproof bag, sunscreen, hat', snacks: 'Coconut water, seafood, dry fruits' },\n",
    'mcleodganj': "        packing: { climate: 'Cool (0-25C), snowfall in winter', dress: 'Heavy woolens winter, light layers summer, rain gear monsoon', shoes: 'Trekking boots (Triund trek essential), waterproof shoes', medicine: 'Cold medicine, altitude pills for high treks, basic first-aid kit', comfort: 'Thermos, warm gloves, sleeping bag liner for treks', snacks: 'Tibetan thukpa, momos, energy bars for treks' },\n",
    'varkala': "        packing: { climate: 'Hot humid (22-35C), monsoon Jun-Sep', dress: 'Beachwear, light cotton, modest for Janardhan Swamy Temple', shoes: 'Sandals, flip-flops, water shoes for rocky beach', medicine: 'Sunscreen SPF50, mosquito repellent, ORS, anti-diarrheal', comfort: 'Beach mat, waterproof bag, hat, sunglasses', snacks: 'Fresh fish, coconut water, banana chips' },\n",
    'rameshwaram': "        packing: { climate: 'Hot (25-37C), humid year-round, cyclone risk Oct-Dec', dress: 'Light cotton, traditional dress for temple (men: dhoti-mandu, women: saree)', shoes: 'Slip-on for temple, comfortable walking shoes', medicine: 'Sunscreen, ORS, mosquito repellent, basic medicines', comfort: 'Water bottle, umbrella, sacred thread for temple rituals', snacks: 'Panchamirtham (temple prasad), dry snacks' },\n",
    'jaisalmer': "        packing: { climate: 'Extreme desert (5-48C), scorching summers, cold winters', dress: 'Full cotton/linen covering body from sun, scarf for sand, warm layers winter', shoes: 'Closed sandals/boots (sand protection), comfortable walking shoes', medicine: 'Sunscreen SPF50+, ORS, lip balm, eye drops (sand), anti-dehydration pills', comfort: 'Scarf/dupatta, sunglasses, water bottle (2L+), hat/cap', snacks: 'Dal baati churma, pyaaz kachori, extra water' },\n",
}

# For each city, find where to insert packing data
# It should go after the tips array and before the closing },
# Or after the places/food/hotels/tips arrays

for city_key, packing_line in PACKING_DATA.items():
    # Find the city block
    # Pattern: city_key: { ... tips: [...] ... },
    # We need to insert packing after tips line
    pattern = rf"(    {city_key}: \{{[^}}]*tips: \[[^\]]+\])"
    match = re.search(pattern, js, re.DOTALL)
    if match:
        old = match.group(0)
        # Check if packing already exists
        if 'packing:' in old:
            # Replace existing packing
            new = re.sub(r'\s*packing: \{[^}]+\},', '', old)
            new = new.rstrip() + ',\n' + packing_line
        else:
            # Add packing after tips
            new = old + ',\n' + packing_line
        js = js.replace(old, new, 1)
        print(f'  Fixed: {city_key}')
    else:
        print(f'  WARNING: Could not find tips in {city_key}')

# Write back
with open('chatbot.js', 'w', encoding='utf-8') as f:
    f.write(js)

print('\nDone!')
