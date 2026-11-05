import re

with open('chatbot.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Fix 1: Add packing/guide to fallback section and add default response
old_fallback = """                if (topics.includes('places')) response += formatPlaces(cityData, 5) + '\\n';

                if (topics.includes('food')) response += formatFood(cityData) + '\\n';

                if (topics.includes('hotels')) response += formatHotels(cityData) + '\\n';

                if (topics.includes('transport')) response += formatTransport(cityData) + '\\n';

                if (topics.includes('time')) response += `📅 Best time: ${cityData.bestTime}\\n\\n`;

                if (topics.includes('budget')) response += formatHotels(cityData) + '\\n' + formatTips(cityData);

                if (topics.includes('tips')) response += formatTips(cityData);

                return response.trim();"""

new_fallback = """                if (topics.includes('places')) response += formatPlaces(cityData, 5) + '\\n';

                if (topics.includes('food')) response += formatFood(cityData) + '\\n';

                if (topics.includes('hotels')) response += formatHotels(cityData) + '\\n';

                if (topics.includes('transport')) response += formatTransport(cityData) + '\\n';

                if (topics.includes('time')) response += `📅 Best time: ${cityData.bestTime}\\n\\n`;

                if (topics.includes('budget')) response += formatHotels(cityData) + '\\n' + formatTips(cityData);

                if (topics.includes('tips')) response += formatTips(cityData);
                if (topics.includes('packing')) response += formatPacking(cityData) + '\\n';
                if (topics.includes('guide')) response += formatComprehensiveGuide(cityData) + '\\n';

                if (!response) response = formatComprehensiveGuide(cityData);

                return response.trim();"""

if old_fallback in js:
    js = js.replace(old_fallback, new_fallback, 1)
    print("1. Fixed fallback section")
else:
    print("1. SKIP: fallback section already modified")

# Fix 2: Update greeting to show comprehensive guide
old_greet = "                    response += `\\n\\n\\ud83d\\udccd Heading to ${CHATBOT_DB[destLower].name}? Ask me about it!`;"
new_greet = "                    response += `\\n\\n📍 Heading to ${CHATBOT_DB[destLower].name}? Here's your complete guide!\\n\\n`;\r\n                    response += formatComprehensiveGuide(CHATBOT_DB[destLower]);"

if old_greet in js:
    js = js.replace(old_greet, new_greet, 1)
    print("2. Fixed greeting to show comprehensive guide")
else:
    # Try without escape chars
    old_greet2 = '                    response += `\\n\\n\\ud83d\\udccd Heading to ${CHATBOT_DB[destLower].name}? Ask me about it!`;'
    if old_greet2 in js:
        js = js.replace(old_greet2, new_greet, 1)
        print("2. Fixed greeting (alt match)")
    else:
        print("2. SKIP: greeting already modified or not found")

# Fix 3: Update default response
old_default = "    if (!response) response = formatPlaces(cityData, 5) + '\\n💡 Ask about food, hotels, transport, or tips for ' + cityData.name + '!';"
new_default = "    if (!response) response = formatComprehensiveGuide(cityData);"

if old_default in js:
    js = js.replace(old_default, new_default, 1)
    print("3. Fixed default response to comprehensive guide")
else:
    print("3. SKIP: default response already modified")

with open('chatbot.js', 'w', encoding='utf-8') as f:
    f.write(js)

# Verify
if 'formatComprehensiveGuide' in js:
    count = js.count('formatComprehensiveGuide')
    print(f"\nformatComprehensiveGuide occurrences: {count}")
    if count >= 3:
        print("All guide references present!")
