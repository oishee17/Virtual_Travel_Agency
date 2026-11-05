import re

# Read files
with open('chatbot.js', 'r', encoding='utf-8') as f:
    chatbot = f.read()
with open('app.js', 'r', encoding='utf-8') as f:
    app = f.read()

# Extract new chatbot code (everything before AUTO-LOGIN CHECK)
chatbot_marker = '// ==================== AUTO-LOGIN CHECK ===================='
chatbot_idx = chatbot.rfind(chatbot_marker)
if chatbot_idx > 0:
    new_chatbot_code = chatbot[:chatbot_idx].rstrip()
else:
    new_chatbot_code = chatbot.rstrip()

# Find and remove old chatbot code from app.js
old_chatbot_start = app.find('// ==================== TOURIST GUIDE CHATBOT ====================')
old_auto_login = app.find(chatbot_marker)

if old_chatbot_start >= 0 and old_auto_login > old_chatbot_start:
    # Remove old chatbot code (keep from start to old_chatbot_start, then from auto-login onwards)
    before_chatbot = app[:old_chatbot_start].rstrip()
    from_auto_login = app[old_auto_login:]
    new_app = before_chatbot + '\n\n' + new_chatbot_code + '\n\n' + from_auto_login
else:
    # No old chatbot found, just insert before AUTO-LOGIN
    auto_idx = app.find(chatbot_marker)
    if auto_idx > 0:
        new_app = app[:auto_idx].rstrip() + '\n\n' + new_chatbot_code + '\n\n' + app[auto_idx:]
    else:
        print("ERROR: AUTO-LOGIN CHECK not found")
        exit(1)

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(new_app)
print(f"Updated app.js: {len(new_app)} bytes")

# Same for Main Code/app.js
with open('Main Code/app.js', 'r', encoding='utf-8') as f:
    main_app = f.read()

old_start = main_app.find('// ==================== TOURIST GUIDE CHATBOT ====================')
old_auto = main_app.find(chatbot_marker)

if old_start >= 0 and old_auto > old_start:
    before = main_app[:old_start].rstrip()
    after = main_app[old_auto:]
    new_main = before + '\n\n' + new_chatbot_code + '\n\n' + after
else:
    auto_idx = main_app.find(chatbot_marker)
    if auto_idx > 0:
        new_main = main_app[:auto_idx].rstrip() + '\n\n' + new_chatbot_code + '\n\n' + main_app[auto_idx:]
    else:
        print("ERROR: AUTO-LOGIN not found in Main Code/app.js")
        exit(1)

with open('Main Code/app.js', 'w', encoding='utf-8') as f:
    f.write(new_main)
print(f"Updated Main Code/app.js: {len(new_main)} bytes")
