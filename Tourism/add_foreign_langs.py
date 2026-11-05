import re

# Foreign languages to add
FOREIGN_LANGS = {
    'es': 'Español',
    'fr': 'Français',
    'de': 'Deutsch',
    'zh': '中文',
    'ja': '日本語',
    'ko': '한국어',
    'ar': 'العربية',
    'ru': 'Русский',
    'pt': 'Português',
    'it': 'Italiano',
    'th': 'ไทย',
    'vi': 'Tiếng Việt',
    'tr': 'Türkçe',
    'nl': 'Nederlands',
    'sv': 'Svenska',
    'pl': 'Polski',
}

# New option HTML for both dropdowns
from_options = ''
for code, name in FOREIGN_LANGS.items():
    from_options += f'                    <option value="{code}">{name}</option>\n'

separator = '                    <option value="" disabled>─── Foreign Languages ───</option>\n'

# === 1. Update index.html - translator-from dropdown ===
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

old_from_close = '                    <option value="doi">डोगरी</option>\n                </select>\n                <textarea id="translator-input"'
new_from_close = '                    <option value="doi">डोगरी</option>\n' + separator + from_options + '                </select>\n                <textarea id="translator-input"'

if old_from_close in html:
    html = html.replace(old_from_close, new_from_close, 1)
    print("1. Updated translator-from dropdown in index.html")
else:
    print("1. SKIP: translator-from marker not found")

# Update translator-to dropdown
old_to_close = '                    <option value="doi">डोगरी</option>\n                </select>\n                <textarea id="translator-output"'
new_to_close = '                    <option value="doi">डोगरी</option>\n' + separator + from_options + '                </select>\n                <textarea id="translator-output"'

if old_to_close in html:
    html = html.replace(old_to_close, new_to_close, 1)
    print("2. Updated translator-to dropdown in index.html")
else:
    print("2. SKIP: translator-to marker not found")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Saved index.html")

# === 2. Update Main Code/index.html ===
with open('Main Code/index.html', 'r', encoding='utf-8') as f:
    html2 = f.read()

if old_from_close in html2:
    html2 = html2.replace(old_from_close, new_from_close, 1)
    print("3. Updated translator-from in Main Code/index.html")

if old_to_close in html2:
    html2 = html2.replace(old_to_close, new_to_close, 1)
    print("4. Updated translator-to in Main Code/index.html")

with open('Main Code/index.html', 'w', encoding='utf-8') as f:
    f.write(html2)
print("Saved Main Code/index.html")

# === 3. Update myMemoryLangMap in app.js ===
with open('app.js', 'r', encoding='utf-8') as f:
    appjs = f.read()

old_map = """const myMemoryLangMap = {
    en:'en-GB', hi:'hi-IN', bn:'bn-IN', te:'te-IN', mr:'mr-IN',
    ta:'ta-IN', ur:'ur-PK', gu:'gu-IN', kn:'kn-IN', ml:'ml-IN',
    or:'or-IN', pa:'pa-IN', as:'as-IN', mai:'mai-IN', ks:'ks-IN',
    ne:'ne-NP', sd:'sd-PK', doi:'doi-IN'
};"""

new_map = """const myMemoryLangMap = {
    en:'en-GB', hi:'hi-IN', bn:'bn-IN', te:'te-IN', mr:'mr-IN',
    ta:'ta-IN', ur:'ur-PK', gu:'gu-IN', kn:'kn-IN', ml:'ml-IN',
    or:'or-IN', pa:'pa-IN', as:'as-IN', mai:'mai-IN', ks:'ks-IN',
    ne:'ne-NP', sd:'sd-PK', doi:'doi-IN',
    es:'es-ES', fr:'fr-FR', de:'de-DE', zh:'zh-CN', ja:'ja-JP',
    ko:'ko-KR', ar:'ar-SA', ru:'ru-RU', pt:'pt-PT', it:'it-IT',
    th:'th-TH', vi:'vi-VN', tr:'tr-TR', nl:'nl-NL', sv:'sv-SE', pl:'pl-PL'
};"""

if old_map in appjs:
    appjs = appjs.replace(old_map, new_map, 1)
    print("5. Updated myMemoryLangMap in app.js")
else:
    print("5. SKIP: myMemoryLangMap marker not found")

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(appjs)

# Also update Main Code/app.js
with open('Main Code/app.js', 'r', encoding='utf-8') as f:
    appjs2 = f.read()

if old_map in appjs2:
    appjs2 = appjs2.replace(old_map, new_map, 1)
    print("6. Updated myMemoryLangMap in Main Code/app.js")

with open('Main Code/app.js', 'w', encoding='utf-8') as f:
    f.write(appjs2)

# === 4. Update phrasebook.js languageNames ===
with open('phrasebook.js', 'r', encoding='utf-8') as f:
    pb = f.read()

old_names = """const languageNames = {
    en: "English", hi: "\u0939\u093f\u0928\u094d\u0926\u0940", bn: "\u09ac\u09be\u0982\u09b2\u09be", te: "\u0c24\u0c46\u0c32\u0c41\u0c17\u0c41", mr: "\u092e\u0930\u093e\u0920\u0940",
    ta: "\u0ba4\u0bae\u0bbf\u0bb4\u0bcd", ur: "\u0627\u0631\u062f\u0648", gu: "\u0a97\u0ac1\u0a9c\u0ab0\u0abe\u0aa4\u0ac0", kn: "\u0c95\u0ca8\u0ccd\u0ca8\u0ca1", ml: "\u0d2e\u0d32\u0d2f\u0d3e\u0d33\u0d02",
    or: "\u0b13\u0b21\u0b3f\u0b06", pa: "\u0a2a\u0a70\u0a1c\u0a3e\u0a2c\u0a40", as: "\u0985\u099a\u09ae\u09c0\u09af\u09bc\u09be", mai: "\u092e\u0948\u0925\u093f\u0932\u0940", ks: "\u06a9\u0650\u0634\u064f\u0631",
    ne: "\u0928\u0947\u092a\u093e\u0932\u0940", sd: "\u033c\u0646\u0648\u063a\u064a", doi: "\u0921\u094b\u0917\u0930\u0940"
};"""

new_names = """const languageNames = {
    en: "English", hi: "\u0939\u093f\u0928\u094d\u0926\u0940", bn: "\u09ac\u09be\u0982\u09b2\u09be", te: "\u0c24\u0c46\u0c32\u0c41\u0c17\u0c41", mr: "\u092e\u0930\u093e\u0920\u0940",
    ta: "\u0ba4\u0bae\u0bbf\u0bb4\u0bcd", ur: "\u0627\u0631\u062f\u0648", gu: "\u0a97\u0ac1\u0a9c\u0ab0\u0abe\u0aa4\u0ac0", kn: "\u0c95\u0ca8\u0ccd\u0ca8\u0ca1", ml: "\u0d2e\u0d32\u0d2f\u0d3e\u0d33\u0d02",
    or: "\u0b13\u0b21\u0b3f\u0b06", pa: "\u0a2a\u0a70\u0a1c\u0a3e\u0a2c\u0a40", as: "\u0985\u099a\u09ae\u09c0\u09af\u09bc\u09be", mai: "\u092e\u0948\u0925\u093f\u0932\u0940", ks: "\u06a9\u0650\u0634\u064f\u0631",
    ne: "\u0928\u0947\u092a\u093e\u0932\u0940", sd: "\u033c\u0646\u0648\u063a\u064a", doi: "\u0921\u094b\u0917\u0930\u0940",
    es: "Espa\u00f1ol", fr: "Fran\u00e7ais", de: "Deutsch", zh: "\u4e2d\u6587", ja: "\u65e5\u672c\u8a9e",
    ko: "\ud55c\uad6d\uc5b4", ar: "\u0627\u0644\u0639\u0631\u0628\u064a\u0629", ru: "\u0420\u0443\u0441\u0441\u043a\u0438\u0439", pt: "Portugu\u00eas", it: "Italiano",
    th: "\u0e44\u0e17\u0e22", vi: "Ti\u1ebfng Vi\u1ec7t", tr: "T\u00fcrk\u00e7e", nl: "Nederlands", sv: "Svenska", pl: "Polski"
};"""

if old_names in pb:
    pb = pb.replace(old_names, new_names, 1)
    print("7. Updated languageNames in phrasebook.js")
else:
    print("7. SKIP: languageNames marker not found")

# === 5. Add foreign language entries to phrasebook ===
# Find the last entry and add foreign language phrases
foreign_phrases = """
    // FOREIGN LANGUAGE PHRASES
    // Greetings
    { en:"Hello", es:"Hola", fr:"Bonjour", de:"Hallo", zh:"你好", ja:"こんにちは", ko:"안녕하세요", ar:"مرحبا", ru:"Здравствуйте", pt:"Olá", it:"Ciao", th:"สวัสดี", vi:"Xin chào", tr:"Merhaba", nl:"Hallo", sv:"Hej", pl:"Cześć" },
    { en:"Good morning", es:"Buenos días", fr:"Bonjour", de:"Guten Morgen", zh:"早上好", ja:"おはようございます", ko:"좋은 아침이에요", ar:"صباح الخير", ru:"Доброе утро", pt:"Bom dia", it:"Buongiorno", th:"สวัสดีตอนเช้า", vi:"Chào buổi sáng", tr:"Günaydın", nl:"Goedemorgen", sv:"God morgon", pl:"Dzień dobry" },
    { en:"Good evening", es:"Buenas tardes", fr:"Bonsoir", de:"Guten Abend", zh:"晚上好", ja:"こんばんは", ko:"좋은 저녁이에요", ar:"مساء الخير", ru:"Добрый вечер", pt:"Boa noite", it:"Buonasera", th:"สวัสดีตอนเย็น", vi:"Chào buổi tối", tr:"İyi akşamlar", nl:"Goedenavond", sv:"God kväll", pl:"Dobry wieczór" },
    { en:"Goodbye", es:"Adiós", fr:"Au revoir", de:"Auf Wiedersehen", zh:"再见", ja:"さようなら", ko:"안녕히 가세요", ar:"مع السلامة", ru:"До свидания", pt:"Adeus", it:"Arrivederci", th:"ลาก่อน", vi:"Tạm biệt", tr:"Hoşça kal", nl:"Tot ziens", sv:"Hej då", pl:"Do widzenia" },
    // Essentials
    { en:"Yes", es:"Sí", fr:"Oui", de:"Ja", zh:"是", ja:"はい", ko:"네", ar:"نعم", ru:"Да", pt:"Sim", it:"Sì", th:"ใช่", vi:"Vâng", tr:"Evet", nl:"Ja", sv:"Ja", pl:"Tak" },
    { en:"No", es:"No", fr:"Non", de:"Nein", zh:"不", ja:"いいえ", ko:"아니요", ar:"لا", ru:"Нет", pt:"Não", it:"No", th:"ไม่", vi:"Không", tr:"Hayır", nl:"Nee", sv:"Nej", pl:"Nie" },
    { en:"Please", es:"Por favor", fr:"S'il vous plaît", de:"Bitte", zh:"请", ja:"お願いします", ko:"제발", ar:"من فضلك", ru:"Пожалуйста", pt:"Por favor", it:"Per favore", th:"กรุณา", vi:"Xin vui lòng", tr:"Lütfen", nl:"Alstublieft", sv:"Snälla", pl:"Proszę" },
    { en:"Thank you", es:"Gracias", fr:"Merci", de:"Danke", zh:"谢谢", ja:"ありがとう", ko:"감사합니다", ar:"شكرا", ru:"Спасибо", pt:"Obrigado", it:"Grazie", th:"ขอบคุณ", vi:"Cảm ơn", tr:"Teşekkür ederim", nl:"Dank je", sv:"Tack", pl:"Dziękuję" },
    { en:"Sorry", es:"Lo siento", fr:"Désolé", de:"Entschuldigung", zh:"对不起", ja:"すみません", ko:"미안합니다", ar:"آسف", ru:"Извините", pt:"Desculpe", it:"Scusa", th:"ขอโทษ", vi:"Xin lỗi", tr:"Özür dilerim", nl:"Sorry", sv:"Förlåt", pl:"Przepraszam" },
    { en:"I don't understand", es:"No entiendo", fr:"Je ne comprends pas", de:"Ich verstehe nicht", zh:"我不明白", ja:"わかりません", ko:"이해가 안 됩니다", ar:"لا أفهم", ru:"Я не понимаю", pt:"Não entendo", it:"Non capisco", th:"ฉันไม่เข้าใจ", vi:"Tôi không hiểu", tr:"Anlamıyorum", nl:"Ik begrijp het niet", sv:"Jag förstår inte", pl:"Nie rozumiem" },
    { en:"Do you speak English?", es:"¿Habla inglés?", fr:"Parlez-vous anglais?", de:"Sprechen Sie Englisch?", zh:"你会说英语吗?", ja:"英語を話しますか?", ko:"영어 하시나요?", ar:"هل تتحدث الإنجليزية?", ru:"Вы говорите по-английски?", pt:"Você fala inglês?", it:"Parla inglese?", th:"คุณพูดภาษาอังกฤษได้ไหม?", vi:"Bạn có nói tiếng Anh không?", tr:"İngilizce konuşuyor musunuz?", nl:"Spreekt u Engels?", sv:"Talar du engelska?", pl:"Czy mówisz po angielsku?" },
    // Help & Safety
    { en:"Help!", es:"¡Ayuda!", fr:"Au secours!", de:"Hilfe!", zh:"救命!", ja:"助けて!", ko:"도와주세요!", ar:"مساعدة!", ru:"Помощь!", pt:"Socorro!", it:"Aiuto!", th:"ช่วยด้วย!", vi:"Cứu tôi!", tr:"İmdat!", nl:"Help!", sv:"Hjälp!", pl:"Pomocy!" },
    { en:"Call the police", es:"Llame a la police", fr:"Appelez la police", de:"Rufen Sie die Polizei", zh:"请叫警察", ja:"警察を呼んでください", ko:"경찰을 불러주세요", ar:"اتصل بالشرطة", ru:"Вызовите полицию", pt:"Chame a polícia", it:"Chiamate la polizia", th:"เรียกตำรวจ", vi:"Gọi cảnh sát", tr:"Polisi arayın", nl:"Bel de politie", sv:"Ring polisen", pl:"Wezwij policję" },
    { en:"I need a doctor", es:"Necesito un doctor", fr:"J'ai besoin d'un médecin", de:"Ich brauche einen Arzt", zh:"我需要看医生", ja:"医者が必要です", ko:"의사가 필요합니다", ar:"أحتاج طبيب", ru:"Мне нужен врач", pt:"Preciso de um médico", it:"Ho bisogno di un dottore", th:"ฉันต้องการหมอ", vi:"Tôi cần bác sĩ", tr:"Doktora ihtiyacım var", nl:"Ik heb een dokter nodig", sv:"Jag behöver en läkare", pl:"Potrzebuję lekarza" },
    // Directions
    { en:"Where is the nearest hospital?", es:"¿Dónde está el hospital más cercano?", fr:"Où est l'hôpital le plus proche?", de:"Wo ist das nächste Krankenhaus?", zh:"最近的医院在哪里?", ja:"一番近い病院はどこですか?", ko:"가장 가까운 병원이 어디인가요?", ar:"أين أقرب مستشفى?", ru:"Где ближайшая больница?", pt:"Onde fica o hospital mais próximo?", it:"Dov'è l'ospedale più vicino?", th:"โรงพยาบาลที่ใกล้ที่สุดอยู่ที่ไหน?", vi:"Bệnh viện gần nhất ở đâu?", tr:"En yakın hastane nerede?", nl:"Waar is het dichtstbijzijnde ziekenhuis?", sv:"Var är närmaste sjukhus?", pl:"Gdzie jest najbliższy szpital?" },
    { en:"How much does this cost?", es:"¿Cuánto cuesta esto?", fr:"Combien ça coûte?", de:"Was kostet das?", zh:"这个多少钱?", ja:"これはいくらですか?", ko:"이것은 얼마인가요?", ar:"كم يكلف هذا?", ru:"Сколько это стоит?", pt:"Quanto custa isso?", it:"Quanto costa questo?", th:"อันนี้ราคาเท่าไหร่?", vi:"Cái này giá bao nhiêu?", tr:"Bu ne kadar?", nl:"Hoeveel kost dit?", sv:"Hur mycket kostar det?", pl:"Ile to kosztuje?" },
    { en:"Where is the nearest hotel?", es:"¿Dónde está el hotel más cercano?", fr:"Où est l'hôtel le plus proche?", de:"Wo ist das nächste Hotel?", zh:"最近的酒店在哪里?", ja:"一番近いホテルはどこですか?", ko:"가장 가까운 호텔이 어디인가요?", ar:"أين أقرب فندق?", ru:"Где ближайший отель?", pt:"Onde fica o hotel mais próximo?", it:"Dov'è l'hotel più vicino?", th:"โรงแรมที่ใกล้ที่สุดอยู่ที่ไหน?", vi:"Khách sạn gần nhất ở đâu?", tr:"En yakın otel nerede?", nl:"Waar is het dichtstbijzijnde hotel?", sv:"Var är närmaste hotell?", pl:"Gdzie jest najbliższy hotel?" },
    // Food & Dining
    { en:"I am vegetarian", es:"Soy vegetariano", fr:"Je suis végétarien", de:"Ich bin Vegetarier", zh:"我是素食者", ja:"私はベジタリアンです", ko:"저는 채식주의자입니다", ar:"أنا نباتي", ru:"Я вегетарианец", pt:"Sou vegetariano", it:"Sono vegetariano", th:"ฉันเป็นมังสวิรัติ", vi:"Tôi ăn chay", tr:"Vejetaryenim", nl:"Ik ben vegetarisch", sv:"Jag är vegetarian", pl:"Jestem wegetarianinem" },
    { en:"The food is delicious", es:"La comida está deliciosa", fr:"La nourriture est délicieuse", de:"Das Essen ist köstlich", zh:"食物很好吃", ja:"料理はとても美味しいです", ko:"음식이 맛있습니다", ar:"الطعام لذيذ", ru:"Еда очень вкусная", pt:"A comida está deliciosa", it:"Il cibo è delizioso", th:"อาหารอร่อยมาก", vi:"Đồ ăn rất ngon", tr:"Yemek çok lezzetli", nl:"Het eten is heerlijk", sv:"Maten är underbar", pl:"Jedzenie jest pyszne" },
    { en:"Water, please", es:"Agua, por favor", fr:"De l'eau, s'il vous plaît", de:"Wasser, bitte", zh:"请给我水", ja:"水をください", ko:"물 주세요", ar:"ماء من فضلك", ru:"Воду, пожалуйста", pt:"Água, por favor", it:"Acqua, per favore", th:"น้ำด้วยครับ/ค่ะ", vi:"Cho tôi xin nước", tr:"Su, lütfen", nl:"Water, alstublieft", sv:"Vatten, snälla", pl:"Wodę, proszę" },
    // Transport
    { en:"Where is the taxi stand?", es:"¿Dónde está la parada de taxis?", fr:"Où est la station de taxis?", de:"Wo ist der Taxistand?", zh:"出租车站在哪里?", ja:"タクシー乗り場はどこですか?", ko:"택시 정류장이 어디인가요?", ar:"أين موقف التاكسي?", ru:"Где стоянка такси?", pt:"Onde fica o ponto de táxi?", it:"Dov'è la fermata del taxi?", th:"แท็กซี่จอดอยู่ที่ไหน?", vi:"Đường đỗ taxi ở đâu?", tr:"Taksi durağı nerede?", nl:"Waar is de taxistand?", sv:"Var är taxiställen?", pl:"Gdzie jest postój taksówek?" },
    { en:"How far is it?", es:"¿Qué tan lejos está?", fr:"C'est loin?", de:"Wie weit ist es?", zh:"有多远?", ja:"どれくらい遠いですか?", ko:"얼마나 먼가요?", ar:"كم يبعد؟", ru:"Как далеко это?", pt:"Quão longe é?", it:"Quanto è lontano?", th:"ไกลแค่ไหน?", vi:"Xa không?", tr:"Ne kadar uzak?", nl:"Hoe ver is het?", sv:"Hur långt är det?", pl:"Jak daleko to jest?" },
    { en:"Please take me to this address", es:"Por favor, lléveme a esta dirección", fr:"Emmenez-moi à cette adresse, s'il vous plaît", de:"Bringen Sie mich bitte zu dieser Adresse", zh:"请带我去这个地址", ja:"この住所まで連れて行ってください", ko:"이 주소로 데려다 주세요", ar:"من فضلك خذني إلى هذا العنوان", ru:"Пожалуйста, отвезите меня по этому адресу", pt:"Por favor, me leve a este endereço", it:"Mi porti a questo indirizzo, per favore", th:"กรุณาพาฉันไปที่อยู่นี้", vi:"Xin hãy đưa tôi đến địa chỉ này", tr:"Lütfen beni bu adrese götürün", nl:"Breng me alsjeblieft naar dit adres", sv:"Ta mig till denna adress", pl:"Proszę zawieźć mnie pod ten adres" },
    // Accommodation
    { en:"I need a room", es:"Necesito una habitación", fr:"J'ai besoin d'une chambre", de:"Ich brauche ein Zimmer", zh:"我需要一个房间", ja:"部屋が必要です", ko:"방이 필요합니다", ar:"أحتاج غرفة", ru:"Мне нужна комната", pt:"Preciso de um quarto", it:"Ho bisogno di una camera", th:"ฉันต้องการห้อง", vi:"Tôi cần phòng", tr:"Odaya ihtiyacım var", nl:"Ik heb een kamer nodig", sv:"Jag behöver ett rum", pl:"Potrzebuję pokoju" },
    { en:"Is there Wi-Fi?", es:"¿Hay Wi-Fi?", fr:"Y a-t-il du Wi-Fi?", de:"Gibt es WLAN?", zh:"有Wi-Fi吗?", ja:"Wi-Fiはありますか?", ko:"와이파이가 있나요?", ar:"هل يوجد واي فاي?", ru:"Есть ли Wi-Fi?", pt:"Tem Wi-Fi?", it:"C'è il Wi-Fi?", th:"มี Wi-Fi ไหม?", vi:"Có Wi-Fi không?", tr:"Wi-Fi var mı?", nl:"Is er Wi-Fi?", sv:"Finns det Wi-Fi?", pl:"Czy jest Wi-Fi?" },
    // Emergency
    { en:"I need help, it's urgent!", es:"Necesito ayuda, es urgente!", fr:"J'ai besoin d'aide, c'est urgent!", de:"Ich brauche Hilfe, es ist dringend!", zh:"我需要帮助，很紧急!", ja:"助けが必要です、緊急です!", ko:"도움이 필요합니다, 긴급합니다!", ar:"أحتاج مساعدة، الأمر عاجل!", ru:"Мне нужна помощь, это срочно!", pt:"Preciso de ajuda, é urgente!", it:"Ho bisogno di aiuto, è urgente!", th:"ต้องการความช่วยเหลือ เร่งด่วน!", vi:"Tôi cần giúp đỡ, rất khẩn cấp!", tr:"Yardıma ihtiyacım var, acil!", nl:"Ik heb dringend hulp nodig!", sv:"Jag behöver hjälp, det är akut!", pl:"Potrzebuję pomocy, to pilne!" },
    { en:"Where is the pharmacy?", es:"¿Dónde está la farmacia?", fr:"Où est la pharmacie?", de:"Wo ist die Apotheke?", zh:"药房在哪里?", ja:"薬局はどこですか?", ko:"약국이 어디인가요?", ar:"أين الصيدلية?", ru:"Где аптека?", pt:"Onde fica a farmácia?", it:"Dov'è la farmacia?", th:"ร้านขายยาอยู่ที่ไหน?", vi:"Nhà thuốc ở đâu?", tr:"Eczane nerede?", nl:"Waar is de apotheek?", sv:"Var är apoteket?", pl:"Gdzie jest apteka?" },
];"""

# Find the end of the existing phrasebook entries and add foreign phrases
# Find the last }; in phrasebook
last_entry_pattern = r'(\};\s*\n\s*\]\s*\n\s*// Language display names)'
if re.search(last_entry_pattern, pb):
    pb = re.sub(last_entry_pattern, foreign_phrases.replace('\n];', '\n];').replace('\n// Language display names', '\n// Language display names'), pb, count=1)
    print("8. Added foreign language phrases to phrasebook.js")
else:
    # Try another pattern
    if pb.rstrip().endswith('];'):
        pb = pb.rstrip()[:-2] + '\n' + foreign_phrases + '\n'
        print("8. Added foreign language phrases to phrasebook.js (alt)")
    else:
        print("8. SKIP: Could not find phrasebook end marker")

with open('phrasebook.js', 'w', encoding='utf-8') as f:
    f.write(pb)

print("\nDone! Foreign languages added: Spanish, French, German, Chinese, Japanese, Korean, Arabic, Russian, Portuguese, Italian, Thai, Vietnamese, Turkish, Dutch, Swedish, Polish")
