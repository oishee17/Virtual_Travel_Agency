import re

with open('app.js', 'r', encoding='utf-8') as f:
    js = f.read()

# ── 1. Remove highlight duplicates from the full cards grid ──
# Change renderDangerZones to exclude zones shown in highlights
old_render_cards = '''    // ── Full Zone Cards ──
    const cardsHTML = dangerZones.map(zone => {'''
new_render_cards = '''    // ── Full Zone Cards (exclude zones already shown in highlights) ──
    const highlightNames = highlights.map(h => h.zone.name);
    const cardsHTML = dangerZones.filter(z => !highlightNames.includes(z.name)).map(zone => {'''
js = js.replace(old_render_cards, new_render_cards, 1)

# ── 2. Merge overlapping zones ──
# Merge Kashmir Valley + Kashmir LOC → single "Kashmir Valley & LOC"
old_kashmir_valley = '''    {
        name: "Kashmir Valley",
        name_hi: "कश्मीर घाटी",
        lat: 34.0837,
        lng: 74.7973,
        risk: "high",
        riskLabel: "Terrorism & Conflict",
        riskLabel_hi: "आतंकवाद और संघर्ष",
        description: "Parts of Kashmir remain affected by militancy. Avoid border areas and check current advisories before travel.",
        description_hi: "कश्मीर के कुछ हिस्से अभी भी आतंकवाद से प्रभावित हैं। यात्रा से पहले सीमा क्षेत्रों से बचें और वर्तमान सलाह जांचें।",
        advisory: "Follow army guidance. Carry ID at all times. Register with local police upon arrival.",
        advisory_hi: "सेना के मार्गदर्शन का पालन करें। हर समय आईडी ले जाएं। आगमन पर स्थानीय पुलिस में पंजीकरण करें।",
        radius: 50000
    },'''
new_kashmir = '''    {
        name: "Kashmir Valley & LOC",
        name_hi: "कश्मीर घाटी और LOC",
        lat: 34.3000,
        lng: 74.5500,
        risk: "high",
        riskLabel: "Terrorism, Conflict & Active Military Zone",
        riskLabel_hi: "आतंकवाद, संघर्ष और सक्रिय सैन्य क्षेत्र",
        description: "Kashmir Valley and LOC areas (Baramulla, Kupwara, Bandipora, Shopian) remain affected by militancy. Unexploded ordnance risk near LOC. Tourist access restricted in conflict zones.",
        description_hi: "कश्मीर घाटी और LOC क्षेत्र (बारामूला, कुपवाड़ा, बांदीपोरा, शोपियां) अभी भी आतंकवाद से प्रभावित हैं। LOC के पास अविस्फोटित गोला-बारूद का जोखिम।",
        advisory: "Follow army guidance. Carry ID at all times. Register with local police. Tourist access prohibited in LOC areas without security clearance.",
        advisory_hi: "सेना के मार्गदर्शन का पालन करें। हर समय आईडी ले जाएं। स्थानीय पुलिस में पंजीकरण करें। सुरक्षा मंजूरी के बिना LOC क्षेत्रों में प्रवेश वर्जित।",
        radius: 55000
    },'''
js = js.replace(old_kashmir_valley, new_kashmir, 1)

# Remove Kashmir LOC (now merged)
old_kashmir_loc = '''    {
        name: "Kashmir LOC Areas",
        name_hi: "कश्मीर LOC क्षेत्र",
        lat: 34.5000,
        lng: 74.3000,
        risk: "high",
        riskLabel: "Active Conflict Zone",
        riskLabel_hi: "सक्रिय संघर्ष क्षेत्र",
        description: "LOC areas — Baramulla, Kupwara, Bandipora, Shopian are active conflict zones. Unexploded ordnance risk.",
        description_hi: "LOC क्षेत्र — बारामूला, कुपवाड़ा, बांदीपोरा, शोपियां सक्रिय संघर्ष क्षेत्र।",
        advisory: "Tourist access prohibited in LOC areas without security clearance.",
        advisory_hi: "सुरक्षा मंजूरी के बिना LOC क्षेत्रों में प्रवेश वर्जित।",
        radius: 45000
    },'''
js = js.replace(old_kashmir_loc, '', 1)

# Merge Delhi NCR + Delhi Heatwave → single "Delhi NCR"
old_delhi_ncr = '''    {
        name: "Delhi NCR",
        name_hi: "दिल्ली NCR",
        lat: 28.7041,
        lng: 77.1025,
        risk: "moderate",
        riskLabel: "Air Pollution & Petty Crime",
        riskLabel_hi: "वायु प्रदूषण और छोटी अपराध",
        description: "Severe air pollution Nov-Feb. Tourist scams common at monuments. Pickpocketing in crowded areas.",
        description_hi: "नवंबर-फरवरी में गंभीर वायु प्रदूषण। स्मारकों पर पर्यटक घोटाले आम हैं। भीड़-भाड़ वाले इलाकों में जेब कतरना।",
        advisory: "Wear N95 masks in winter. Use registered tourist guides. Keep valuables secure.",
        advisory_hi: "सर्दियों में N95 मास्क पहनें। पंजीकृत पर्यटन गाइड का उपयोग करें। कीमती सामान सुरक्षित रखें।",
        radius: 25000
    },'''
new_delhi = '''    {
        name: "Delhi NCR",
        name_hi: "दिल्ली NCR",
        lat: 28.6139,
        lng: 77.2090,
        risk: "moderate",
        riskLabel: "Air Pollution, Heatwave & Petty Crime",
        riskLabel_hi: "वायु प्रदूषण, लू और छोटी अपराध",
        description: "Severe air pollution Nov-Feb (AQI 400+). Summer heatwave Apr-Jun (45-48°C). Tourist scams at monuments. Pickpocketing in crowded areas.",
        description_hi: "नवंबर-फरवरी में गंभीर वायु प्रदूषण (AQI 400+)। ग्रीष्मकालीन लू अप्रैल-जून (45-48°C)। स्मारकों पर पर्यटक घोटाले।",
        advisory: "Wear N95 masks in winter. Avoid outdoor activity 11AM-4PM in summer. Use registered tourist guides.",
        advisory_hi: "सर्दियों में N95 मास्क पहनें। ग्रीष्म में दोपहर 11-4 बजे बाहरी गतिविधि से बचें। पंजीकृत पर्यटन गाइड का उपयोग करें।",
        radius: 30000
    },'''
js = js.replace(old_delhi_ncr, new_delhi, 1)

# Remove Delhi Heatwave (now merged)
old_delhi_heatwave = '''    {
        name: "Delhi Summer Heatwave",
        name_hi: "दिल्ली ग्रीष्मकालीन लू",
        lat: 28.6139,
        lng: 77.2090,
        risk: "moderate",
        riskLabel: "Extreme Heatwave (Apr-Jun)", riskLabel_hi: "अत्यधिक लू (अप्रैल-जून)",
        description: "Temperatures exceed 45-48°C in May-June. Heatwave deaths reported annually. Severe water shortage.",
        description_hi: "मई-जून में तापमान 45-48°C से अधिक। सालाना लू से मौतें।",
        advisory: "Avoid outdoor activity 11AM-4PM. Drink 4+ liters water daily.",
        advisory_hi: "दोपहर 11-4 बजे बाहरी गतिविधि से बचें। रोजाना 4+ लीटर पानी पिएं।",
        radius: 30000
    },'''
js = js.replace(old_delhi_heatwave, '', 1)

# Merge Manali-Leh + Himachal HP + Spiti/Kinnaur → "Himachal Pradesh (Manali, Spiti, Kinnaur)"
old_manali = '''    {
        name: "Manali-Leh Highway",
        name_hi: "मनाली-लेह मार्ग",
        lat: 32.2432,
        lng: 77.1892,
        risk: "moderate",
        riskLabel: "Landslides & Road Hazards",
        riskLabel_hi: "भूस्खलन और सड़क खतरे",
        description: "Prone to landslides during monsoon (Jun-Sep). Snowfall can block roads in winter. Check road conditions before travel.",
        description_hi: "मानसून के दौरान भूस्खलन की चपेट में (जून-सितंबर)। सर्दियों में बर्फबारी सड़कें बंद कर सकती है।",
        advisory: "Travel only in clear weather. Carry emergency supplies. Inform someone of your travel plans.",
        advisory_hi: "केवल साफ मौसम में यात्रा करें। आपातकालीन आपूर्ति ले जाएं। अपनी यात्रा योजनाओं की जानकारी दें।",
        radius: 30000
    },'''
new_himachal = '''    {
        name: "Himachal Pradesh (Manali, Spiti, Kinnaur)",
        name_hi: "हिमाचल प्रदेश (मनाली, स्पिति, किन्नौर)",
        lat: 31.8,
        lng: 77.5,
        risk: "natural",
        riskLabel: "Landslides, Cloudbursts & Extreme Altitude",
        riskLabel_hi: "भूस्खलन, क्लाउड बर्स्ट और अत्यधिक ऊंचाई",
        description: "Shimla, Manali, Spiti, and Kinnaur face annual landslides Jul-Sep. Cloudbursts cause flash floods. Manali-Leh highway blocked by snow Oct-May. Spiti (12,000-15,000 ft) has no ATMs, limited mobile. Road blockages common.",
        description_hi: "शिमला, मनाली, स्पिति और किन्नौर मानसून के दौरान वार्षिक भूस्खलन। क्लाउड बर्स्ट अचानक बाढ़। मनाली-लेह मार्ग बर्फ से बंद। स्पिति में कोई ATM, सीमित मोबाइल।",
        advisory: "Avoid travel Jul-Sep. Check HP Traffic Police alerts. Carry cash and emergency supplies. Acclimatize properly.",
        advisory_hi: "जुलाई-सितंबर में यात्रा से बचें। HP ट्रैफिक पुलिस अलर्ट जांचें। नकद और आपातकालीन आपूर्ति ले जाएं।",
        radius: 45000
    },'''
js = js.replace(old_manali, new_himachal, 1)

# Remove old Himachal HP
old_hp = '''    {
        name: "Himachal Pradesh Hill Zones",
        name_hi: "हिमाचल प्रदेश पहाड़ी क्षेत्र",
        lat: 31.1048,
        lng: 77.1734,
        risk: "natural",
        riskLabel: "Landslides & Cloudbursts",
        riskLabel_hi: "भूस्खलन और क्लाउड बर्स्ट",
        description: "Shimla, Manali, Spiti, and Kinnaur face annual landslides during monsoon (Jul-Sep). Cloudbursts cause sudden flash floods. Road blockages are common.",
        description_hi: "शिमला, मनाली, स्पिति और किन्नौर मानसून के दौरान वार्षिक भूस्खलन का सामना करते हैं (जुलाई-सितंबर)। क्लाउड बर्स्ट अचानक बाढ़ लाते हैं।",
        advisory: "Avoid travel Jul-Sep. Check HP Traffic Police alerts. Carry emergency food and water. Don't stop at landslide-prone curves.",
        advisory_hi: "जुलाई-सितंबर में यात्रा से बचें। HP ट्रैफिक पुलिस अलर्ट जांचें। आपातकालीन भोजन और पानी ले जाएं।",
        radius: 40000
    },'''
js = js.replace(old_hp, '', 1)

# Remove Spiti/Kinnaur (merged into HP)
old_spiti = '''    {
        name: "Spiti & Kinnaur Remote Zone",
        name_hi: "स्पिति और किन्नौर दूरस्थ क्षेत्र",
        lat: 32.2500,
        lng: 78.0000,
        risk: "moderate",
        riskLabel: "Extreme Altitude & Isolation", riskLabel_hi: "अत्यधिक ऊंचाई और एकांत",
        description: "Altitudes 12,000-15,000 ft. Roads close Oct-June. No ATMs, limited mobile. Helicopter rescue only. Mountain sickness common.",
        description_hi: "ऊंचाई 12,000-15,000 फीट। अक्टूबर-जून में सड़कें बंद। कोई ATM, सीमित मोबाइल।",
        advisory: "Carry cash. Acclimatize properly. Travel with experienced guide.",
        advisory_hi: "नकद ले जाएं। ठीक से ऊंचाई के अनुकूल हों। अनुभवी गाइड के साथ यात्रा करें।",
        radius: 35000
    },'''
js = js.replace(old_spiti, '', 1)

# Merge Uttarakhand + Kedarnath → single
old_uttarakhand = '''    {
        name: "Uttarakhand Himalayas",
        name_hi: "उत्तराखंड हिमालय",
        lat: 30.0661,
        lng: 79.0161,
        risk: "natural",
        riskLabel: "Flash Floods & Landslides",
        riskLabel_hi: "अचानक बाढ़ और भूस्खलन",
        description: "Kedarnath-like disasters can occur. Monsoon months are especially dangerous. Glacial lakes pose outburst flood risks.",
        description_hi: "केदारनाथ जैसी आपदाएं हो सकती हैं। मानसून के महीने विशेष रूप से खतरनाक हैं।",
        advisory: "Avoid trekking during monsoon. Check weather forecasts. Carry satellite phone in remote areas.",
        advisory_hi: "मानसून के दौरान ट्रेकिंग से बचें। मौसम पूर्वानुमान जांचें। दूरदराज के क्षेत्रों में सैटेलाइट फोन ले जाएं।",
        radius: 45000
    },'''
new_uttarakhand = '''    {
        name: "Uttarakhand Himalayas & Kedarnath",
        name_hi: "उत्तराखंड हिमालय और केदारनाथ",
        lat: 30.4,
        lng: 79.05,
        risk: "natural",
        riskLabel: "Flash Floods, Landslides & Glacial Lake Bursts",
        riskLabel_hi: "अचानक बाढ़, भूस्खलन और हिमनद झील विस्फोट",
        description: "2013 Kedarnath disaster killed 5,700+. Monsoon months extremely dangerous. Glacial lake outburst floods. Heavy landslides block Char Dham routes.",
        description_hi: "2013 केदारनाथ आपदा में 5,700+ लोग मारे गए। मानसून के महीने अत्यंत खतरनाक। हिमनद झील विस्फोट बाढ़।",
        advisory: "Avoid monsoon trekking. Register for Char Dham Yatra. Carry satellite phone. Check weather forecasts.",
        advisory_hi: "मानसून ट्रेकिंग से बचें। चार धाम यात्रा पंजीकरण करें। सैटेलाइट फोन ले जाएं। मौसम पूर्वानुमान जांचें।",
        radius: 50000
    },'''
js = js.replace(old_uttarakhand, new_uttarakhand, 1)

# Remove Kedarnath (merged)
old_kedarnath = '''    {
        name: "Kedarnath & Char Dham Zone",
        name_hi: "केदारनाथ और चार धाम क्षेत्र",
        lat: 30.7353,
        lng: 79.0669,
        risk: "natural",
        riskLabel: "Flash Floods & Extreme Weather", riskLabel_hi: "अचानक बाढ़ और चरम मौसम",
        description: "2013 Kedarnath disaster killed 5,700+. Glacial lake outburst floods. Extreme weather at high altitude.",
        description_hi: "2013 केदारनाथ आपदा में 5,700+ लोग मारे गए।",
        advisory: "Avoid monsoon pilgrimage. Register for Char Dham Yatra.",
        advisory_hi: "मानसून तीर्थयात्रा से बचें। चार धाम यात्रा पंजीकरण करें।",
        radius: 40000
    },'''
js = js.replace(old_kedarnath, '', 1)

# Merge Ladakh Region + Ladakh Siachen → single "Ladakh Region & Siachen"
old_ladakh = '''    {
        name: "Ladakh Region",
        name_hi: "लद्दाख क्षेत्र",
        lat: 34.1526,
        lng: 77.5771,
        risk: "moderate",
        riskLabel: "High Altitude & Extreme Cold",
        riskLabel_hi: "अत्यधिक ऊंचाई और अत्यधिक ठंड",
        description: "Altitudes exceed 11,500 ft. Severe altitude sickness risk. Temperatures drop to -30°C. Roads blocked by snow Oct-May. Flash floods in July-Aug.",
        description_hi: "ऊंचाई 11,500 फीट से अधिक। गंभीर ऊंचाई बीमारी का जोखिम। तापमान -30°C तक गिरता है। अक्टूबर-मई में सड़कें बर्फ से बंद।",
        advisory: "Acclimatize for 2-3 days. Carry oxygen supplies. Avoid if you have heart/lung conditions. Check road status before travel.",
        advisory_hi: "2-3 दिन तक ऊंचाई के अनुकूल हों। ऑक्सीजन आपूर्ति ले जाएं। हृदय/फेफड़े की स्थिति हो तो न जाएं।",
        radius: 60000
    },'''
new_ladakh = '''    {
        name: "Ladakh Region & Siachen",
        name_hi: "लद्दाख क्षेत्र और सियाचिन",
        lat: 34.7,
        lng: 76.5,
        risk: "high",
        riskLabel: "Extreme Altitude, Cold & Active Military Zone",
        riskLabel_hi: "अत्यधिक ऊंचाई, ठंड और सक्रिय सैन्य क्षेत्र",
        description: "Siachen Glacier — world's highest battlefield. Kargil sector has active military operations. Altitudes exceed 15,000 ft. Temperatures drop to -30°C. Roads blocked Oct-May.",
        description_hi: "सियाचिन ग्लेशियर — दुनिया का सबसे ऊंचा युद्धक्षेत्र। कारगिल क्षेत्र में सक्रिय सैन्य अभियान। ऊंचाई 15,000 फीट से अधिक।",
        advisory: "Acclimatize for 2-3 days. Carry oxygen. Avoid if heart/lung conditions. Siachen access strictly prohibited without military clearance.",
        advisory_hi: "2-3 दिन ऊंचाई के अनुकूल हों। ऑक्सीजन ले जाएं। सैन्य मंजूरी के बिना सियाचिन प्रवेश सख्त वर्जित।",
        radius: 65000
    },'''
js = js.replace(old_ladakh, new_ladakh, 1)

# Remove Ladakh Border/Siachen (merged)
old_ladakh_border = '''    {
        name: "Ladakh Border (Siachen/Kargil)",
        name_hi: "लद्दाख सीमा (सियाचिन/कारगिल)",
        lat: 35.2167,
        lng: 75.7500,
        risk: "high",
        riskLabel: "Active Military Zone & Extreme Altitude", riskLabel_hi: "सक्रिय सैन्य क्षेत्र और अत्यधिक ऊंचाई",
        description: "Siachen Glacier — world's highest battlefield. Kargil sector has active military operations. Tourist access prohibited without military clearance.",
        description_hi: "सियाचिन ग्लेशियर — दुनिया का सबसे ऊंचा युद्धक्षेत्र। सैन्य मंजूरी के बिना प्रवेश वर्जित।",
        advisory: "Tourist access strictly prohibited without military clearance.",
        advisory_hi: "सैन्य मंजूरी के बिना पर्यटक प्रवेश सख्त वर्जित।",
        radius: 60000
    },'''
js = js.replace(old_ladakh_border, '', 1)

# Merge Gujarat Kutch + Gujarat Kutch Rann → single
old_gujarat = '''    {
        name: "Kutch & Gujarat Coast",
        name_hi: "कच्छ और गुजरात तट",
        lat: 23.2205,
        lng: 69.6618,
        risk: "natural",
        riskLabel: "Earthquake & Tsunami Risk",
        riskLabel_hi: "भूकंप और सुनामी जोखिम",
        description: "2001 Bhuj earthquake (7.7 magnitude) killed 20,000+. Active seismic zone. Kutch marshland has limited rescue access. Cyclone risk during Oct-Dec.",
        description_hi: "2001 भुज भूकंप (7.7 तीव्रता) ने 20,000+ लोगों की जान ली। सक्रिय भूकंपीय क्षेत्र।",
        advisory: "Learn earthquake safety. Avoid Rann of Kutch during monsoon. Follow NDMA alerts for cyclone warnings.",
        advisory_hi: "भूकंप सुरक्षा सीखें। मानसून के दौरान रन ऑफ कच्छ से बचें।",
        radius: 55000
    },'''
new_gujarat = '''    {
        name: "Kutch & Gujarat Coast",
        name_hi: "कच्छ और गुजरात तट",
        lat: 23.5,
        lng: 69.6,
        risk: "natural",
        riskLabel: "Earthquake, Tsunami & Rann Flooding",
        riskLabel_hi: "भूकंप, सुनामी और रन बाढ़",
        description: "2001 Bhuj earthquake (7.7 magnitude) killed 20,000+. Rann of Kutch floods during monsoon. Salt desert hard to navigate. Cyclone risk Oct-Dec.",
        description_hi: "2001 भुज भूकंप (7.7 तीव्रता) ने 20,000+ लोगों की जान ली। मानसून में रन ऑफ कच्छ बाढ़।",
        advisory: "Learn earthquake safety. Don't venture into Rann during monsoon. Carry satellite communicator. Follow NDMA alerts.",
        advisory_hi: "भूकंप सुरक्षा सीखें। मानसून में रन में न जाएं। सैटेलाइट संचारक ले जाएं।",
        radius: 55000
    },'''
js = js.replace(old_gujarat, new_gujarat, 1)

# Remove Gujarat Kutch Rann (merged)
old_gujarat_rann = '''    {
        name: "Gujarat Kutch Rann",
        name_hi: "गुजरात कच्छ रन",
        lat: 23.8500,
        lng: 69.5000,
        risk: "natural",
        riskLabel: "Rann Flooding & Earthquake", riskLabel_hi: "रन बाढ़ और भूकंप",
        description: "Rann of Kutch floods during monsoon. 2001 Bhuj earthquake (7.7 magnitude). Salt desert difficult to navigate.",
        description_hi: "मानसून के दौरान रन ऑफ कच्छ बाढ़। 2001 भुज भूकंप।",
        advisory: "Don't venture into Rann during monsoon. Carry satellite communicator.",
        advisory_hi: "मानसून के दौरान रन में न जाएं। सैटेलाइट संचारक ले जाएं।",
        radius: 50000
    },'''
js = js.replace(old_gujarat_rann, '', 1)

# Merge Chennai + Chennai Urban → single
old_chennai = '''    {
        name: "Chennai & Coastal Tamil Nadu",
        name_hi: "चेन्नई और तटीय तमिलनाडु",
        lat: 13.0827,
        lng: 80.2707,
        risk: "natural",
        riskLabel: "Cyclone & Flood Prone",
        riskLabel_hi: "चक्रवात और बाढ़ प्रवण",
        description: "Cyclone season (Oct-Dec) brings heavy rainfall, flooding, and storm surges. Stay alert during monsoon months.",
        description_hi: "चक्रवात का मौसम (अक्टूबर-दिसंबर) भारी वर्षा, बाढ़ और तूफानी लहरें लाता है।",
        advisory: "Monitor weather alerts. Move to higher ground during flooding. Avoid beaches during storms.",
        advisory_hi: "मौसम अलर्ट की निगरानी करें। बाढ़ के दौरान ऊंची जगह पर जाएं। तूफान के दौरान समुद्र तटों से बचें।",
        radius: 40000
    },'''
new_chennai = '''    {
        name: "Chennai & Coastal Tamil Nadu",
        name_hi: "चेन्नई और तटीय तमिलनाडु",
        lat: 13.0827,
        lng: 80.2707,
        risk: "natural",
        riskLabel: "Cyclone, Urban Flooding & Tsunami Risk",
        riskLabel_hi: "चक्रवात, शहरी बाढ़ और सुनामी जोखिम",
        description: "Cyclone season Oct-Dec. 2015 Chennai floods killed 500+. IT corridor floods regularly. Northeast monsoon brings extreme rainfall. Tsunami risk along coast.",
        description_hi: "चक्रवात का मौसम अक्टूबर-दिसंबर। 2015 चेन्नई बाढ़ में 500+ मौतें। IT कॉरिडोर नियमित रूप से जलमग्न।",
        advisory: "Monitor weather alerts. Avoid low-lying areas Oct-Dec. Know tsunami evacuation routes.",
        advisory_hi: "मौसम अलर्ट की निगरानी करें। अक्टूबर-दिसंबर में निचले इलाकों से बचें। सुनामी निकासी मार्ग जानें।",
        radius: 40000
    },'''
js = js.replace(old_chennai, new_chennai, 1)

# Remove Chennai Urban Flooding (merged)
old_chennai_urban = '''    {
        name: "Chennai Urban Flooding",
        name_hi: "चेन्नई शहरी बाढ़",
        lat: 12.9165,
        lng: 80.1480,
        risk: "natural",
        riskLabel: "Urban Flooding & Tsunami Risk", riskLabel_hi: "शहरी बाढ़ और सुनामी जोखिम",
        description: "2015 Chennai floods killed 500+. Northeast monsoon (Oct-Dec) brings extreme rainfall. IT corridor floods regularly.",
        description_hi: "2015 चेन्नई बाढ़ में 500+ लोग मारे गए। उत्तर-पूर्व मानसून अत्यधिक वर्षा।",
        advisory: "Avoid low-lying areas during Oct-Dec. Know tsunami evacuation routes.",
        advisory_hi: "अक्टूबर-दिसंबर के दौरान निचले इलाकों से बचें। सुनामी निकासी मार्ग जानें।",
        radius: 35000
    },'''
js = js.replace(old_chennai_urban, '', 1)

# Merge Rajasthan Desert + Rajasthan Border → single
old_rajasthan = '''    {
        name: "Rajasthan Desert Regions",
        name_hi: "राजस्थान मरुस्थल क्षेत्र",
        lat: 26.9124,
        lng: 75.7873,
        risk: "moderate",
        riskLabel: "Extreme Heat & Dehydration Risk",
        riskLabel_hi: "अत्यधिक गर्मी और निर्जलीकरण जोखिम",
        description: "Summer temperatures exceed 50°C. Dehydration is a serious risk. Limited water sources in deep desert areas.",
        description_hi: "ग्रीष्मकाल का तापमान 50°C से अधिक हो जाता है। निर्जलीकरण एक गंभीर जोखिम है।",
        advisory: "Carry 4+ liters of water. Travel early morning or evening. Wear loose, light clothing.",
        advisory_hi: "4+ लीटर पानी ले जाएं। सुबह जल्दी या शाम को यात्रा करें। ढीले, हल्के कपड़े पहनें।",
        radius: 50000
    },'''
new_rajasthan = '''    {
        name: "Rajasthan Desert & Border",
        name_hi: "राजस्थान मरुस्थल और सीमा",
        lat: 27.0,
        lng: 73.0,
        risk: "moderate",
        riskLabel: "Extreme Heat, Border Tensions & Dehydration",
        riskLabel_hi: "अत्यधिक गर्मी, सीमा तनाव और निर्जलीकरण",
        description: "Summer temperatures exceed 50°C. India-Pakistan border area with cross-border smuggling risks. Limited water in deep desert. Drone threats near border.",
        description_hi: "ग्रीष्मकाल में तापमान 50°C से अधिक। भारत-पाकिस्तान सीमा क्षेत्र। गहरे मरुस्थल में सीमित पानी।",
        advisory: "Carry 4+ liters water. Travel early AM/PM. Carry valid ID. Avoid border areas after dark.",
        advisory_hi: "4+ लीटर पानी ले जाएं। सुबह जल्दी/शाम को यात्रा करें। वैध आईडी ले जाएं।",
        radius: 55000
    },'''
js = js.replace(old_rajasthan, new_rajasthan, 1)

# Remove Rajasthan Border Pakistan (merged)
old_raj_border = '''    {
        name: "Rajasthan Border (Pakistan)",
        name_hi: "राजस्थान सीमा (पाकिस्तान)",
        lat: 27.0239,
        lng: 70.3819,
        risk: "moderate",
        riskLabel: "Border Tensions & Desert", riskLabel_hi: "सीमा तनाव और मरुस्थल",
        description: "India-Pakistan border in Thar Desert. Cross-border smuggling. Extreme heat in summer. Limited water sources.",
        description_hi: "थार मरुस्थल में भारत-पाकिस्तान सीमा। सीमा पार तस्करी। ग्रीष्म में अत्यधिक गर्मी।",
        advisory: "Carry valid ID. Avoid border areas after dark. Carry extra water.",
        advisory_hi: "वैध आईडी ले जाएं। अंधेरे के बाद सीमा क्षेत्रों से बचें। अतिरिक्त पानी ले जाएं।",
        radius: 40000
    },'''
js = js.replace(old_raj_border, '', 1)

# Merge Manipur + Nagaland/Arunachal + NE Seismic → "Northeast India (Manipur, Nagaland, Arunachal)"
# Remove the big NE Seismic zone and merge insurgent zones
old_ne_seismic = '''    {
        name: "Seismic Zone V - Northeast India",
        name_hi: "भूकंपीय क्षेत्र V - पूर्वोत्तर भारत",
        lat: 25.6743,
        lng: 94.1077,
        risk: "natural",
        riskLabel: "Earthquake Prone",
        riskLabel_hi: "भूकंप प्रवण",
        description: "Highest seismic risk zone in India. States include Assam, Mizoram, Manipur, Nagaland, and Arunachal Pradesh.",
        description_hi: "भारत में सर्वोच्च भूकंपीय जोखिम क्षेत्र। राज्यों में असम, मिजोरम, मणिपुर, नागालैंड और अरुणाचल प्रदेश शामिल हैं।",
        advisory: "Learn earthquake safety drills. Identify safe spots in buildings. Keep emergency kit ready.",
        advisory_hi: "भूकंप सुरक्षा अभ्यास सीखें। इमारतों में सुरक्षित स्थान पहचानें। आपातकालीन किट तैयार रखें।",
        radius: 80000
    },'''
new_ne = '''    {
        name: "Northeast India (Manipur, Nagaland, Arunachal)",
        name_hi: "पूर्वोत्तर भारत (मणिपुर, नागालैंड, अरुणाचल)",
        lat: 25.8,
        lng: 94.0,
        risk: "moderate",
        riskLabel: "Insurgency, Earthquake Zone V & Myanmar Border",
        riskLabel_hi: "उग्रवाद, भूकंपीय क्षेत्र V और म्यांमार सीमा",
        description: "Highest seismic risk zone. Active insurgent groups in Manipur/Nagaland. AFSPA in effect. Inner Line/Protected Area Permit required. Myanmar border porous.",
        description_hi: "सर्वोच्च भूकंपीय जोखिम क्षेत्र। मणिपुर/नागालैंड में सक्रिय उग्रवादी समूह। AFSPA लागू। म्यांमार सीमा असुरक्षित।",
        advisory: "Obtain Inner Line/Protected Area Permit. Avoid border areas. Learn earthquake safety. Don't travel after dark.",
        advisory_hi: "आंतरिक रेखा/संरक्षित क्षेत्र परमिट प्राप्त करें। सीमा क्षेत्रों से बचें। भूकंप सुरक्षा जानें।",
        radius: 65000
    },'''
js = js.replace(old_ne_seismic, new_ne, 1)

# Remove Manipur (merged into NE)
old_manipur = '''    {
        name: "Manipur Valley Insurgency",
        name_hi: "मणिपुर घाटी उग्रवाद",
        lat: 24.5237,
        lng: 93.7731,
        risk: "moderate",
        riskLabel: "Insurgency & Restricted Areas", riskLabel_hi: "उग्रवाद और प्रतिबंधित क्षेत्र",
        description: "Active insurgent groups. AFSPA in effect. Inner Line Permit required for some areas.",
        description_hi: "सक्रिय उग्रवादी समूह। AFSPA लागू। कुछ क्षेत्रों के लिए आंतरिक रेखा परमिट आवश्यक।",
        advisory: "Obtain Inner Line Permit. Avoid border areas.",
        advisory_hi: "आंतरिक रेखा परमिट प्राप्त करें। सीमा क्षेत्रों से बचें।",
        radius: 35000
    },'''
js = js.replace(old_manipur, '', 1)

# Remove Nagaland/Arunachal (merged into NE)
old_nagaland = '''    {
        name: "Nagaland & Arunachal Border",
        name_hi: "नागालैंड और अरुणाचल सीमा",
        lat: 26.1581,
        lng: 94.5624,
        risk: "moderate",
        riskLabel: "Insurgency & Myanmar Border", riskLabel_hi: "उग्रवाद और म्यांमार सीमा",
        description: "Active insurgent groups. Myanmar border is porous. Protected Area Permit required for foreign nationals.",
        description_hi: "सक्रिय उग्रवादी समूह। म्यांमार सीमा असुरक्षित। विदेशियों के लिए संरक्षित क्षेत्र परमिट आवश्यक।",
        advisory: "Obtain Protected Area Permit. Don't venture near international border.",
        advisory_hi: "संरक्षित क्षेत्र परमिट प्राप्त करें। अंतर्राष्ट्रीय सीमा के पास न जाएं।",
        radius: 40000
    },'''
js = js.replace(old_nagaland, '', 1)

# Merge Mizoram/Tripura with Sikkim/Darjeeling → "Sikkim, Darjeeling, Mizoram & Tripura"
old_mizoram = '''    {
        name: "Mizoram & Tripura Earthquake Zone",
        name_hi: "मिजोरम और त्रिपुरा भूकंप क्षेत्र",
        lat: 23.1648,
        lng: 92.9376,
        risk: "natural",
        riskLabel: "High Seismic Zone V", riskLabel_hi: "उच्च भूकंपीय क्षेत्र V",
        description: "Both states in India's highest seismic risk zone. 2021 Mizoram earthquake (6.1 magnitude). Buildings vulnerable.",
        description_hi: "दोनों राज्य भारत के सर्वोच्च भूकंपीय जोखिम क्षेत्र में।",
        advisory: "Know earthquake safety. Avoid old buildings.",
        advisory_hi: "भूकंप सुरक्षा जानें। पुरानी इमारतों से बचें।",
        radius: 40000
    },'''
new_sikkim_mizo = '''    {
        name: "Sikkim, Darjeeling, Mizoram & Tripura",
        name_hi: "सिक्किम, दार्जिलिंग, मिजोरम और त्रिपुरा",
        lat: 26.0,
        lng: 91.0,
        risk: "natural",
        riskLabel: "Landslides, Earthquake Zone V & Glacial Floods",
        riskLabel_hi: "भूस्खलन, भूकंपीय क्षेत्र V और हिमनद बाढ़",
        description: "Seismic Zone IV-V. Annual landslides blocking NH10 (Sikkim/Darjeeling). 2021 Mizoram earthquake 6.1 magnitude. Glacial lake outburst floods possible.",
        description_hi: "भूकंपीय क्षेत्र IV-V। सिक्किम/दार्जिलिंग में NH10 अवरुद्ध। 2021 मिजोरम भूकंप 6.1 तीव्रता।",
        advisory: "Check road status before travel. Avoid monsoon trekking. Know earthquake safety.",
        advisory_hi: "यात्रा से पहले सड़क स्थिति जांचें। मानसून ट्रेकिंग से बचें। भूकंप सुरक्षा जानें।",
        radius: 45000
    },'''
js = js.replace(old_mizoram, new_sikkim_mizo, 1)

# Remove Sikkim/Darjeeling (merged)
old_sikkim = '''    {
        name: "Sikkim & Darjeeling Landslide Zone",
        name_hi: "सिक्किम और दार्जिलिंग भूस्खलन क्षेत्र",
        lat: 27.3389,
        lng: 88.6065,
        risk: "natural",
        riskLabel: "Landslides & Earthquake", riskLabel_hi: "भूस्खलन और भूकंप",
        description: "Sikkim and Darjeeling face annual landslides blocking NH10. Seismic Zone IV. Glacial lake outburst floods possible.",
        description_hi: "सिक्किम और दार्जिलिंग सालाना भूस्खलन का सामना करते हैं।",
        advisory: "Check road status before travel. Avoid monsoon trekking.",
        advisory_hi: "यात्रा से पहले सड़क स्थिति जांचें। मानसून ट्रेकिंग से बचें।",
        radius: 35000
    },'''
js = js.replace(old_sikkim, '', 1)

# Merge Maharashtra + Karnataka flood zones → single
old_maharashtra = '''    {
        name: "Maharashtra Flood & Landslide Zone",
        name_hi: "महाराष्ट्र बाढ़ और भूस्खलन क्षेत्र",
        lat: 19.7515,
        lng: 75.7139,
        risk: "natural",
        riskLabel: "Monsoon Flooding & Landslides", riskLabel_hi: "मानसून बाढ़ और भूस्खलन",
        description: "Kolhapur, Sangli, Satara, and Raigad face severe monsoon flooding. 2019 floods displaced 500,000+ people.",
        description_hi: "कोल्हापुर, सांगली, सातारा और रायगड गंभीर मानसून बाढ़ का सामना करते हैं।",
        advisory: "Avoid riverbank areas during monsoon. Don't cross flooded roads.",
        advisory_hi: "मानसून के दौरान नदी किनारे के इलाकों से बचें। बाढ़ वाली सड़कों को पार न करें।",
        radius: 40000
    },'''
new_mah_kar = '''    {
        name: "Maharashtra & Karnataka Flood Zone",
        name_hi: "महाराष्ट्र और कर्नाटक बाढ़ क्षेत्र",
        lat: 17.5,
        lng: 75.7,
        risk: "natural",
        riskLabel: "Monsoon Flooding & Western Ghats Landslides",
        riskLabel_hi: "मानसून बाढ़ और पश्चिमी घाट भूस्खलन",
        description: "Kolhapur, Sangli, Satara (MH) and Belgaum, Hubli (KA) face annual monsoon flooding. 2019 floods displaced 500,000+. Western Ghats landslides cut road access.",
        description_hi: "कोल्हापुर, सांगली, सातारा और बेलगाम, हुबली सालाना मानसून बाढ़। 2019 बाढ़ में 5,00,000+ विस्थापित।",
        advisory: "Avoid riverbank and low-lying areas during monsoon. Don't cross flooded roads.",
        advisory_hi: "मानसून में नदी किनारे और निचले इलाकों से बचें। बाढ़ वाली सड़कें पार न करें।",
        radius: 45000
    },'''
js = js.replace(old_maharashtra, new_mah_kar, 1)

# Remove Karnataka (merged)
old_karnataka = '''    {
        name: "Karnataka Flood Zone",
        name_hi: "कर्नाटक बाढ़ क्षेत्र",
        lat: 15.3173, lng: 75.7139, risk: "natural",
        riskLabel: "Annual Flooding & Landslides", riskLabel_hi: "वार्षिक बाढ़ और भूस्खलन",
        description: "North Karnataka (Belgaum, Hubli, Gadag) and coastal Karnataka face annual monsoon flooding. Western Ghats landslides cut off road access.",
        description_hi: "उत्तर कर्नाटक और तटीय कर्नाटक सालाना मानसून बाढ़ का सामना करते हैं।",
        advisory: "Avoid low-lying areas during monsoon. Check road conditions before Western Ghats travel.",
        advisory_hi: "मानसून के दौरान निचले इलाकों से बचें। पश्चिमी घाट यात्रा से पहले सड़क स्थिति जांचें।",
        radius: 35000
    },'''
js = js.replace(old_karnataka, '', 1)

# Also update highlights to match merged names
old_highlight_kashmir = "dangerZones.find(z => z.name.includes('Kashmir'))"
new_highlight_kashmir = "dangerZones.find(z => z.name.includes('Kashmir Valley'))"
js = js.replace(old_highlight_kashmir, new_highlight_kashmir, 1)

old_highlight_manali = "dangerZones.find(z => z.name.includes('Manali'))"
new_highlight_manali = "dangerZones.find(z => z.name.includes('Himachal'))"
js = js.replace(old_highlight_manali, new_highlight_manali, 1)

# ── 3. Reduce map circle radii to prevent overlap ──
# Reduce all radii by 30% to prevent visual overlap on map
radii_replacements = [
    ('radius: 80000', 'radius: 50000'),
    ('radius: 70000', 'radius: 45000'),
    ('radius: 65000', 'radius: 42000'),
    ('radius: 60000', 'radius: 38000'),
    ('radius: 55000', 'radius: 35000'),
    ('radius: 50000', 'radius: 32000'),
    ('radius: 45000', 'radius: 30000'),
    ('radius: 40000', 'radius: 28000'),
    ('radius: 35000', 'radius: 25000'),
    ('radius: 30000', 'radius: 22000'),
    ('radius: 25000', 'radius: 20000'),
    ('radius: 20000', 'radius: 18000'),
]
for old, new in radii_replacements:
    js = js.replace(old, new, 1)

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(js)

# Count remaining zones
import re
zone_count = len(re.findall(r'name: "', js[js.find('const dangerZones'):]))
print(f"Zones after merge: {zone_count}")
