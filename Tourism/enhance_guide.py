import re

with open('chatbot.js', 'r', encoding='utf-8') as f:
    js = f.read()

changes = 0

# 1. Add 'guide' topic keywords
old_kw = "    medicine: ['medicine', 'medical', 'health', 'tablet', 'first aid', 'sick', 'pharmacy', 'doctor']\n\n};"
new_kw = """    medicine: ['medicine', 'medical', 'health', 'tablet', 'first aid', 'sick', 'pharmacy', 'doctor'],

    guide: ['guide', 'tell me about', 'tell me', 'overview', 'everything about', 'what to know', 'know about', 'info about', 'information about', 'comprehensive', 'complete guide', 'full guide', 'describe', 'details about', 'about ', 'what is', 'introduce', 'explain', 'help me plan', 'plan my trip', 'trip plan', 'travel guide', 'tour guide', 'explore']

};"""

if old_kw in js:
    js = js.replace(old_kw, new_kw, 1)
    changes += 1
    print("1. Added guide topic keywords")
else:
    print("1. SKIP: guide keywords already present or marker not found")

# 2. Add formatComprehensiveGuide function before CHATBOT UI section
if 'function formatComprehensiveGuide' not in js:
    guide_func = """
function formatComprehensiveGuide(cityData) {
    var msg = '';
    var typeEmoji = { monument: '\\u26f2\\ufe0f', landmark: '\\ud83c\\udfd7\\ufe0f', spiritual: '\\ud83d\\uded5', nature: '\\ud83c\\udf3f', beach: '\\ud83c\\udfd6\\ufe0f', museum: '\\ud83c\\udfdb\\ufe0f', market: '\\ud83d\\udecd\\ufe0f', park: '\\ud83c\\udf33', heritage: '\\ud83c\\udff0', adventure: '\\ud83e\\ude82', art: '\\ud83c\\udfa8', cultural: '\\ud83c\\udfad' };

    msg += '\\ud83d\\udccd ' + cityData.name + ' \\u2014 ' + cityData.tagline + '\\n';
    msg += '\\ud83d\\udccd State/Region: ' + cityData.state + '\\n\\n';
    msg += '\\ud83d\\udcc5 Best Time to Visit: ' + cityData.bestTime + '\\n\\n';

    msg += '\\ud83d\\uddfa\\ufe0f TOP PLACES TO VISIT:\\n';
    cityData.places.slice(0, 8).forEach(function(p, i) {
        msg += (typeEmoji[p.type] || '\\ud83d\\udccd') + ' ' + (i+1) + '. ' + p.name + '\\n';
        msg += '   ' + p.desc + '\\n';
        msg += '   \\ud83d\\udca1 Tip: ' + p.tip + '  |  \\ud83d\\udcb0 ' + p.budget + '\\n';
    });
    msg += '\\n';

    msg += '\\ud83c\\udf7d\\ufe0f MUST-TRY FOOD:\\n';
    cityData.food.forEach(function(f, i) { msg += (i+1) + '. ' + f + '\\n'; });
    msg += '\\n';

    if (cityData.packing) {
        msg += '\\u2744\\ufe0f WEATHER & CLIMATE:\\n' + cityData.packing.climate + '\\n\\n';
        msg += '\\ud83d\\udc55 DRESS CODE:\\n' + cityData.packing.dress + '\\n\\n';
        msg += '\\ud83d\\udc5f FOOTWEAR:\\n' + cityData.packing.shoes + '\\n\\n';
        msg += '\\ud83d\\udc8a MEDICINES TO CARRY:\\n' + cityData.packing.medicine + '\\n\\n';
        msg += '\\ud83e\\uddcc COMFORT TIPS:\\n' + cityData.packing.comfort + '\\n\\n';
        msg += '\\ud83c\\udf79 SNACKS FOR JOURNEY:\\n' + cityData.packing.snacks + '\\n\\n';
    }

    msg += '\\ud83d\\ude97 GETTING AROUND:\\n';
    cityData.transport.forEach(function(t, i) { msg += (i+1) + '. ' + t + '\\n'; });
    msg += '\\n';

    msg += '\\ud83c\\udfe8 WHERE TO STAY:\\n';
    cityData.hotels.forEach(function(h, i) { msg += (i+1) + '. ' + h.name + ' \\u2014 ' + h.budget + ' (\\u2b50 ' + h.rating + ')\\n'; });
    msg += '\\n';

    msg += '\\ud83d\\udca1 TRAVEL TIPS:\\n';
    cityData.tips.forEach(function(t, i) { msg += (i+1) + '. ' + t + '\\n'; });
    msg += '\\n';

    msg += '\\ud83d\\ude4f Always carry ID copy and emergency contacts separately from phone!';
    msg += '\\n\\ud83d\\udcde Emergency: 112 (Police) | 108 (Ambulance) | 1800-111-363 (Tourist Helpline)';
    return msg;
}"""

    marker = '// ==================== CHATBOT UI ===================='
    if marker in js:
        js = js.replace(marker, guide_func + '\n' + marker, 1)
        changes += 1
        print("2. Added formatComprehensiveGuide function")
    else:
        print("2. SKIP: CHATBOT UI marker not found")
else:
    print("2. SKIP: formatComprehensiveGuide already exists")

# 3. Add guide handling in fallback section (no city detected)
old_fb = "        if (topics.includes('packing')) response += formatPacking(cityData) + '\\n';\n\n        return response.trim();"
new_fb = "        if (topics.includes('packing')) response += formatPacking(cityData) + '\\n';\n        if (topics.includes('guide')) response += formatComprehensiveGuide(cityData) + '\\n';\n\n        return response.trim();"

if old_fb in js:
    js = js.replace(old_fb, new_fb, 1)
    changes += 1
    print("3. Added guide handling in fallback section")
else:
    print("3. SKIP: fallback marker not found (may already exist)")

# 4. Add guide handling in main section (city detected)
old_main = "    if (topics.includes('packing')) response += formatPacking(cityData) + '\\n';\n\n    if (topics.includes('climate'))"
new_main = "    if (topics.includes('packing')) response += formatPacking(cityData) + '\\n';\n    if (topics.includes('guide')) response += formatComprehensiveGuide(cityData) + '\\n';\n\n    if (topics.includes('climate'))"

if old_main in js:
    js = js.replace(old_main, new_main, 1)
    changes += 1
    print("4. Added guide handling in main section")
else:
    print("4. SKIP: main section marker not found")

# 5. Update default response (no topic match) to show comprehensive guide
old_default = "    if (!response) response = formatPlaces(cityData, 5) + '\\n\\ud83d\\udca1 Ask about food, hotels, transport, or tips for ' + cityData.name + '!';"
new_default = "    if (!response) response = formatComprehensiveGuide(cityData);"

if old_default in js:
    js = js.replace(old_default, new_default, 1)
    changes += 1
    print("5. Updated default response to comprehensive guide")
else:
    print("5. SKIP: default response marker not found")

# 6. Update greeting for destination to show guide
old_greet = "                    response += `\\n\\n\\ud83d\\udccd Heading to ${CHATBOT_DB[destLower].name}? Ask me about it!`;"
new_greet = "                    response += `\\n\\n\\ud83d\\udccd Heading to ${CHATBOT_DB[destLower].name}? Here's your complete guide!\\n\\n`;\n                    response += formatComprehensiveGuide(CHATBOT_DB[destLower]);"

if old_greet in js:
    js = js.replace(old_greet, new_greet, 1)
    changes += 1
    print("6. Updated greeting to show comprehensive guide")
else:
    print("6. SKIP: greeting marker not found")

with open('chatbot.js', 'w', encoding='utf-8') as f:
    f.write(js)

print(f"\nTotal changes: {changes}")
