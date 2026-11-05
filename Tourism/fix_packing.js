const fs = require('fs');
let js = fs.readFileSync('chatbot.js', 'utf8').replace(/\r/g, '\n');

const PACKING = {
    delhi: { climate: 'Extreme heat (45C summer), cold foggy winters (2-5C)', dress: 'Light cotton summer, heavy woolens winter, modest for mosques', shoes: 'Comfortable walking shoes, sandals', medicine: 'N95 masks (AQI 400+), sunscreen SPF50, ORS', comfort: 'Water bottle, hand sanitizer, power bank, umbrella', snacks: 'Dry fruits, energy bars' },
    ahmedabad: { climate: 'Very hot summers (45C+), mild pleasant winters (10-25C)', dress: 'Light cotton clothing, sun-protective hats', shoes: 'Breathable walking shoes, sandals', medicine: 'Sunscreen SPF50+, ORS sachets', comfort: 'Cotton towel, water bottle, electrolyte packets', snacks: 'Dry snacks, water' },
    haridwar: { climate: 'Hot summers (40C), pleasant winters (5-20C)', dress: 'Modest clothing for temples, light cottons', shoes: 'Slip-on shoes (remove at temples), waterproof sandals', medicine: 'ORS, basic first-aid', comfort: 'Reusable water bottle, mosquito repellent, flashlight', snacks: 'Temple prasad area snacks, dry fruits' },
    dehradun: { climate: 'Pleasant (15-35C), monsoon heavy Jul-Sep', dress: 'Light layers, rain jacket monsoon', shoes: 'Waterproof trekking shoes, comfortable walking shoes', medicine: 'Leech repellent (monsoon), sunscreen, ORS', comfort: 'Rain poncho, power bank, reusable water bottle', snacks: 'Local petha, dry fruits' },
    mussoorie: { climate: 'Cool (0-25C), freezing in winter with snow', dress: 'Heavy woolens winter, light layers summer', shoes: 'Trekking boots with grip, waterproof shoes', medicine: 'Cold medication, sunscreen', comfort: 'Thermos flask, warm socks, gloves, umbrella', snacks: 'Hot chocolate supplies, dry fruits, energy bars' },
    nainital: { climate: 'Cool (0-28C), snowfall Dec-Feb', dress: 'Heavy woolens winter, light cotton summer', shoes: 'Trekking boots (snow grip), waterproof shoes', medicine: 'Cold cream, lip balm, sunscreen SPF50', comfort: 'Thermos, warm blanket, gloves', snacks: 'Hot soup packets, dry fruits, chocolate' },
    dalhousie: { climate: 'Cold (-5 to 25C), heavy snowfall Dec-Feb', dress: 'Heavy woolens, thermal innerwear, waterproof jacket', shoes: 'Snow boots with grip, waterproof trekking shoes', medicine: 'Cold and flu medicine, lip balm', comfort: 'Hand warmers, thermos, sleeping bag', snacks: 'Energy bars, chocolate, dry fruits' },
    kasol: { climate: 'Cool (0-25C), cold nights year-round', dress: 'Warm layers even in summer, rain gear', shoes: 'Trekking boots essential, waterproof sandals', medicine: 'Leech repellent, altitude sickness pills', comfort: 'Sleeping bag liner, flashlight, power bank', snacks: 'Trail mix, energy bars, instant noodles' },
    coonoor: { climate: 'Pleasant (10-25C), misty mornings, chilly evenings', dress: 'Light woolens, jacket for evenings', shoes: 'Comfortable walking shoes for tea estate treks', medicine: 'Mosquito repellent, sunscreen', comfort: 'Light shawl/cardigan, water bottle, camera', snacks: 'Tea estate cafe snacks, dry fruits, chocolates' },
    kodaikanal: { climate: 'Cool (8-25C), misty and rainy Jul-Oct', dress: 'Light woolens, waterproof jacket', shoes: 'Waterproof trekking shoes, comfortable sandals', medicine: 'Leech repellent, cold cream, sunscreen, ORS', comfort: 'Umbrella, rain poncho, warm socks', snacks: 'Homemade chocolates, dry fruits' },
    wayanad: { climate: 'Tropical (20-35C), heavy monsoon Jun-Oct', dress: 'Light cotton, waterproof jacket monsoon', shoes: 'Waterproof trekking shoes essential', medicine: 'Leech repellent, mosquito repellent, ORS', comfort: 'Rain poncho, insect repellent, power bank', snacks: 'Trail mix, water bottles, energy bars' },
    alleppey: { climate: 'Hot humid (25-35C), heavy monsoon Jun-Sep', dress: 'Light cotton/linen, rain gear', shoes: 'Waterproof sandals, comfortable walking shoes', medicine: 'Mosquito repellent, sunscreen, ORS', comfort: 'Waterproof bag for houseboat, hat, umbrella', snacks: 'Coconut water, banana chips, dry fruits' },
    madurai: { climate: 'Hot (25-40C), dry summers, pleasant Nov-Feb', dress: 'Light cotton, covered shoulders/knees for temple', shoes: 'Comfortable slip-ons, walking shoes', medicine: 'Sunscreen, ORS, electrolyte tablets', comfort: 'Water bottle, umbrella, power bank', snacks: 'Jigarthanda drink, dry snacks' },
    puri: { climate: 'Hot humid (25-40C), cyclone season Oct-Dec', dress: 'Light cotton, beachwear, modest for temple', shoes: 'Sandals for beach, comfortable walking shoes', medicine: 'Sunscreen SPF50, mosquito repellent, ORS', comfort: 'Beach towel, waterproof bag, hat, umbrella', snacks: 'Chuda ghasa, dry fruits, bottled water' },
    gangtok: { climate: 'Cool (0-25C), monsoon heavy Jun-Sep', dress: 'Warm layers, waterproof jacket', shoes: 'Trekking boots with grip, waterproof shoes', medicine: 'Altitude sickness pills, cold medicine', comfort: 'Power bank, reusable water bottle, warm gloves', snacks: 'Momos, thukpa, energy bars for treks' },
    shillong: { climate: 'Pleasant (4-25C), heavy monsoon Jun-Sep', dress: 'Light woolens, rain jacket', shoes: 'Waterproof trekking shoes, comfortable sandals', medicine: 'Leech repellent, sunscreen, cold medicine', comfort: 'Umbrella, rain poncho, warm shawl', snacks: 'Local street food, dry fruits' },
    kaziranga: { climate: 'Tropical (10-35C), park closed monsoon Jun-Sep', dress: 'Earth-tone/olive clothing, long sleeves, hat', shoes: 'Closed-toe sturdy shoes for safari', medicine: 'Mosquito repellent, sunscreen, basic first-aid', comfort: 'Binoculars, camera, water bottle, hat', snacks: 'Packed lunch for safari, dry snacks' },
    darbhanga: { climate: 'Extreme (2-45C), hot summers, cold foggy winters', dress: 'Light cotton summers, heavy woolens winters', shoes: 'Comfortable walking shoes, sandals', medicine: 'Sunscreen, ORS, mosquito repellent', comfort: 'Water bottle, umbrella, power bank', snacks: 'Dry fruits, bottled water' },
    warangal: { climate: 'Hot (20-42C), monsoon Jul-Oct', dress: 'Light cotton, temple-appropriate clothing', shoes: 'Comfortable walking shoes, sandals', medicine: 'Sunscreen, ORS, mosquito repellent', comfort: 'Water bottle, hat, umbrella, power bank', snacks: 'Local sweets, dry fruits' },
    badami: { climate: 'Very hot (25-42C), pleasant Nov-Feb', dress: 'Light cotton, sun hat', shoes: 'Sturdy walking shoes for cave exploration', medicine: 'Sunscreen, ORS, anti-heat medicine', comfort: 'Water bottle (carry extra!), hat, umbrella', snacks: 'Local food, energy bars' },
    gokarna: { climate: 'Hot humid (22-35C), monsoon Jun-Sep', dress: 'Beachwear, modest for temples', shoes: 'Flip-flops for beach, sturdy sandals', medicine: 'Sunscreen SPF50, mosquito repellent, ORS', comfort: 'Beach towel, waterproof bag, hat', snacks: 'Coconut water, seafood, dry fruits' },
    mcleodganj: { climate: 'Cool (0-25C), snowfall in winter', dress: 'Heavy woolens winter, light layers summer', shoes: 'Trekking boots (Triund trek), waterproof shoes', medicine: 'Cold medicine, altitude pills', comfort: 'Thermos, warm gloves, sleeping bag liner', snacks: 'Tibetan thukpa, momos, energy bars' },
    varkala: { climate: 'Hot humid (22-35C), monsoon Jun-Sep', dress: 'Beachwear, light cotton', shoes: 'Sandals, flip-flops, water shoes', medicine: 'Sunscreen SPF50, mosquito repellent, ORS', comfort: 'Beach mat, waterproof bag, hat', snacks: 'Fresh fish, coconut water, banana chips' },
    rameshwaram: { climate: 'Hot (25-37C), humid year-round', dress: 'Light cotton, traditional dress for temple', shoes: 'Slip-on for temple, walking shoes', medicine: 'Sunscreen, ORS, mosquito repellent', comfort: 'Water bottle, umbrella', snacks: 'Panchamirtham, dry snacks' },
    jaisalmer: { climate: 'Extreme desert (5-48C)', dress: 'Full cotton/linen covering body, scarf for sand', shoes: 'Closed sandals/boots, walking shoes', medicine: 'Sunscreen SPF50+, ORS, lip balm, eye drops', comfort: 'Scarf, sunglasses, water bottle (2L+), hat', snacks: 'Dal baati churma, pyaaz kachori' },
};

let fixed = 0;
const lines = js.split('\n');

for (const [key, packing] of Object.entries(PACKING)) {
    const packingStr = '        packing: ' + JSON.stringify(packing).replace(/"/g, "'") + ',';
    
    let inCity = false;
    let tipsLineIdx = -1;
    let cityStartIdx = -1;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        // Detect city start
        if (line.match(new RegExp('^    ' + key + ': \\{'))) {
            inCity = true;
            cityStartIdx = i;
            tipsLineIdx = -1;
            continue;
        }
        if (inCity && line.trim().startsWith('tips: [') && line.includes(']')) {
            tipsLineIdx = i;
            break;
        }
        // End of city block without finding tips
        if (inCity && cityStartIdx !== null && i > cityStartIdx && line.match(/^    [a-z_]+: \{$/)) {
            break;
        }
    }
    
    if (tipsLineIdx >= 0) {
        // Check if packing already exists
        if (lines[tipsLineIdx + 1] && lines[tipsLineIdx + 1].includes('packing:')) {
            console.log('Skip (already has packing):', key);
            continue;
        }
        lines.splice(tipsLineIdx + 1, 0, packingStr);
        fixed++;
        console.log('Fixed:', key, '@ line', tipsLineIdx + 1);
    } else {
        console.log('WARNING: No tips line found for', key);
    }
}

fs.writeFileSync('chatbot.js', lines.join('\n'));
console.log('\nTotal fixed:', fixed);
