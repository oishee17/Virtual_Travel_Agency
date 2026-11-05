with open('chatbot.js', 'r', encoding='utf-8') as f:
    js = f.read()

old = "                    response += `\\n\\n📍 Heading to ${CHATBOT_DB[destLower].name}? Ask me about it!`;"
new = "                    response += `\\n\\n📍 Heading to ${CHATBOT_DB[destLower].name}? Here's your complete guide!\\n\\n`;\r\n                    response += formatComprehensiveGuide(CHATBOT_DB[destLower]);"

if old in js:
    js = js.replace(old, new, 1)
    print("Fixed greeting!")
else:
    print("Greeting not found (may already be updated)")

with open('chatbot.js', 'w', encoding='utf-8') as f:
    f.write(js)

# Verify
count = js.count('formatComprehensiveGuide')
print(f"formatComprehensiveGuide occurrences: {count}")
