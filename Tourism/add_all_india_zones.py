import re

with open('app.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Find the end of the dangerZones array
marker = 'const dangerZones = ['
start = js.find(marker)
bracket = 0
end = start
for i in range(start, len(js)):
    if js[i] == '[':
        bracket += 1
    elif js[i] == ']':
        bracket -= 1
        if bracket == 0:
            end = i
            break

# New zones to add
new_zones = [
    # === NORTH INDIA ===
    {
        "name": "Delhi NCR",
        "name_hi": "दिल्ली NCR",
        "lat": 28.6139, "lng": 77.2090,
        "risk": "moderate",
        "riskLabel": "Air Pollution, Heatwave & Petty Crime",
        "riskLabel_hi": "वायु प्रदूषण, लू और छोटी अपराध",
        "description": "Severe air pollution Nov-Feb (AQI 400+). Summer heatwave Apr-Jun (45-48°C). Tourist scams at monuments. Pickpocketing in crowded areas. Seismic Zone IV.",
        "description_hi": "नवंबर-फरवरी में गंभीर वायु प्रदूषण। ग्रीष्मकालीन लू। स्मारकों पर धोखाधड़ी। भूकंपीय क्षेत्र IV।",
        "advisory": "Wear N95 masks in winter. Avoid outdoor activity 11AM-4PM in summer. Keep valuables secure.",
        "advisory_hi": "सर्दियों में N95 मास्क पहनें। ग्रीष्म में दोपहर 11-4 बजे बाहरी गतिविधि से बचें।",
        "radius": 30000
    },
    {
        "name": "Uttar Pradesh Flood Plains",
        "name_hi": "उत्तर प्रदेश बाढ़ मैदान",
        "lat": 26.8467, "lng": 80.9462,
        "risk": "natural",
        "riskLabel": "Annual Flooding & Extreme Heat",
        "riskLabel_hi": "वार्षिक बाढ़ और अत्यधिक गर्मी",
        "description": "Ganga and Yamuna flood plains. Extreme heatwave May-Jun (48°C+). Encephalitis outbreaks in eastern UP. Poor air quality in winter.",
        "description_hi": "गंगा और यमुना बाढ़ मैदान। अत्यधिक गर्मी मई-जून। पूर्वी UP में दिमागी बुखार।",
        "advisory": "Avoid flood-prone areas during monsoon. Drink plenty of water in summer. Use mosquito repellent.",
        "advisory_hi": "मानसून में बाढ़ प्रवण क्षेत्रों से बचें। ग्रीष्म में खूब पानी पिएं। मच्छर भगाने वाला उपयोग करें।",
        "radius": 40000
    },
    {
        "name": "Haryana & Punjab Heatwave",
        "name_hi": "हरियाणा और पंजाब लू",
        "lat": 29.0588, "lng": 76.0856,
        "risk": "moderate",
        "riskLabel": "Extreme Heatwave & Stubble Burning",
        "riskLabel_hi": "अत्यधिक लू और पराली जलाना",
        "description": "Temperatures exceed 47°C May-Jun. Severe air pollution Oct-Nov from stubble burning. Hailstorms in spring.",
        "description_hi": "मई-जून में तापमान 47°C से अधिक। पराली जलाने से अक्टूबर-नवंबर में गंभीर प्रदूषण।",
        "advisory": "Avoid outdoor exposure 11AM-4PM in summer. Wear masks Oct-Nov. Stay hydrated.",
        "advisory_hi": "ग्रीष्म में दोपहर 11-4 बजे बाहर न जाएं। अक्टूबर-नवंबर में मास्क पहनें।",
        "radius": 35000
    },
    {
        "name": "Himachal Pradesh Snowfall Zone",
        "name_hi": "हिमाचल प्रदेश बर्फबारी क्षेत्र",
        "lat": 32.08, "lng": 77.05,
        "risk": "natural",
        "riskLabel": "Heavy Snowfall & Road Blockades",
        "riskLabel_hi": "भारी बर्फबारी और सड़क अवरोध",
        "description": "Rohtang Pass, Keylong, and high-altitude areas receive heavy snowfall Oct-Mar. Roads close for months. Avalanches possible.",
        "description_hi": "रोहतांग पास, केलांग और ऊंचाई वाले क्षेत्रों में अक्टूबर-मार्च में भारी बर्फबारी। महीनों सड़कें बंद।",
        "advisory": "Carry snow chains. Check road status. Avoid high passes Nov-Mar. Keep emergency food and warm clothing.",
        "advisory_hi": "बर्फ श्रृंखला ले जाएं। सड़क स्थिति जांचें। नवंबर-मार्च में ऊंचे पास से बचें।",
        "radius": 30000
    },
    # === CENTRAL INDIA ===
    {
        "name": "Madhya Pradesh & Tribal Belt",
        "name_hi": "मध्य प्रदेश और आदिवासी बेल्ट",
        "lat": 22.9734, "lng": 78.6569,
        "risk": "moderate",
        "riskLabel": "Naxal Activity, Flooding & Extreme Heat",
        "riskLabel_hi": "नक्सल गतिविधि, बाढ़ और अत्यधिक गर्मी",
        "description": "Mandla, Dindori, Balaghat districts have Naxal presence. Narmada and Chambal flood annually. Summer temperatures reach 47°C.",
        "description_hi": "मंडला, दिंडोरी, बालाघाट जिलों में नक्सल उपस्थिति। नर्मदा और चंबल सालाना बाढ़।",
        "advisory": "Avoid forest routes in tribal districts. Don't cross flooded rivers. Carry water in summer.",
        "advisory_hi": "आदिवासी जिलों में वन मार्गों से बचें। बाढ़ वाली नदियों को पार न करें।",
        "radius": 40000
    },
    {
        "name": "Gujarat Industrial & Coastal Zone",
        "name_hi": "गुजरात औद्योगिक और तटीय क्षेत्र",
        "lat": 22.3072, "lng": 72.1370,
        "risk": "moderate",
        "riskLabel": "Industrial Hazards, Cyclone & Flooding",
        "riskLabel_hi": "औद्योगिक खतरे, चक्रवात और बाढ़",
        "description": "Vadodara, Ankleshwar industrial belt — chemical accident risk. Surat faces annual flooding. Cyclone risk along Saurashtra coast.",
        "description_hi": "वडोदरा, अंकलेश्वर औद्योगिक बेल्ट — रासायनिक दुर्घटना जोखिम। सूरत में सालाना बाढ़।",
        "advisory": "Follow industrial safety signs. Monitor cyclone warnings. Evacuate during floods.",
        "advisory_hi": "औद्योगिक सुरक्षा संकेतों का पालन करें। चक्रवात चेतावनी की निगरानी करें।",
        "radius": 35000
    },
    # === EAST INDIA ===
    {
        "name": "West Bengal & Kolkata Urban",
        "name_hi": "पश्चिम बंगाल और कोलकाता शहरी",
        "lat": 22.5726, "lng": 88.3639,
        "risk": "natural",
        "riskLabel": "Cyclone, Urban Flooding & Nor'westers",
        "riskLabel_hi": "चक्रवात, शहरी बाढ़ और नर्थवेस्टर",
        "description": "Kolkata faces severe urban waterlogging. Cyclones from Bay of Bengal (May-Jun, Oct-Nov). Kalbaisakhi storms cause sudden damage.",
        "description_hi": "कोलकाता में गंभीर शहरी जलभराव। बंगाल की खाड़ी से चक्रवात। कालबैसाखी तूफान।",
        "advisory": "Avoid low-lying areas during monsoon. Monitor cyclone alerts. Stay indoors during Kalbaisakhi.",
        "advisory_hi": "मानसून में निचले इलाकों से बचें। चक्रवात अलर्ट की निगरानी करें।",
        "radius": 30000
    },
    {
        "name": "Odisha Coastal & Tribal Belt",
        "name_hi": "ओडिशा तटीय और आदिवासी बेल्ट",
        "lat": 19.8135, "lng": 85.8312,
        "risk": "natural",
        "riskLabel": "Super Cyclone & Tribal Maoist Zone",
        "riskLabel_hi": "सुपर चक्रवात और आदिवासी माओवादी क्षेत्र",
        "description": "Malkangiri, Koraput, Rayagada have Maoist presence. Coast hit by super cyclones. KBK region faces severe drought and malnutrition.",
        "description_hi": "मलकानगिरी, कोरापुट, रायगड़ा में माओवादी उपस्थिति। तट पर सुपर चक्रवात।",
        "advisory": "Obtain permission for tribal areas. Monitor cyclone warnings. Carry emergency supplies in KBK region.",
        "advisory_hi": "आदिवासी क्षेत्रों के लिए अनुमति लें। चक्रवात चेतावनी की निगरानी करें।",
        "radius": 40000
    },
    {
        "name": "Sikkim & Darjeeling",
        "name_hi": "सिक्किम और दार्जिलिंग",
        "lat": 27.3389, "lng": 88.6065,
        "risk": "natural",
        "riskLabel": "Landslides, Earthquake & GLOF",
        "riskLabel_hi": "भूस्खलन, भूकंप और हिमनद झील विस्फोट",
        "description": "Annual landslides block NH10. Seismic Zone IV-V. Glacial lake outburst floods in Sikkim. Tea estate landslides during monsoon.",
        "description_hi": "सालाना भूस्खलन NH10 अवरुद्ध। भूकंपीय क्षेत्र IV-V। सिक्किम में हिमनद झील विस्फोट।",
        "advisory": "Check road status. Avoid monsoon trekking. Know earthquake safety drills.",
        "advisory_hi": "सड़क स्थिति जांचें। मानसून ट्रेकिंग से बचें। भूकंप सुरक्षा जानें।",
        "radius": 35000
    },
    # === SOUTH INDIA ===
    {
        "name": "Karnataka Flood & Urban Zone",
        "name_hi": "कर्नाटक बाढ़ और शहरी क्षेत्र",
        "lat": 12.9716, "lng": 77.5946,
        "risk": "natural",
        "riskLabel": "Urban Flooding & Western Ghats Landslides",
        "riskLabel_hi": "शहरी बाढ़ और पश्चिमी घाट भूस्खलन",
        "description": "Bangalore faces severe waterlogging during monsoon. Belgaum, Hubli flood annually. Western Ghats landslides in Kodagu and Chikmagalur.",
        "description_hi": "बेंगलुरु में मानसून में गंभीर जलभराव। बेलगाम, हुबली में सालाना बाढ़।",
        "advisory": "Avoid low-lying areas in Bangalore during rain. Check road conditions for Western Ghats travel.",
        "advisory_hi": "बारिश के दौरान बेंगलुरु के निचले इलाकों से बचें। पश्चिमी घाट यात्रा के लिए सड़क स्थिति जांचें।",
        "radius": 30000
    },
    {
        "name": "Andhra Pradesh & Telangana Flood Zone",
        "name_hi": "आंध्र प्रदेश और तेलंगाना बाढ़ क्षेत्र",
        "lat": 16.5062, "lng": 78.6480,
        "risk": "natural",
        "riskLabel": "Cyclone, Flood & Urban Waterlogging",
        "riskLabel_hi": "चक्रवात, बाढ़ और शहरी जलभराव",
        "description": "Visakhapatnam, Machilipatnam cyclone-prone. Hyderabad faces urban flooding. Godavari and Krishna rivers flood annually.",
        "description_hi": "विशाखापत्तनम, मचिलीपट्नम चक्रवात-प्रवण। हैदराबाद में शहरी बाढ़।",
        "advisory": "Monitor IMD alerts. Evacuate coastal areas during cyclone. Avoid riverbanks during monsoon.",
        "advisory_hi": "IMD अलर्ट की निगरानी करें। चक्रवात में तटीय क्षेत्र खाली करें।",
        "radius": 35000
    },
    {
        "name": "Tamil Nadu Interior & Nilgiris",
        "name_hi": "तमिलनाडु अंतर्देशीय और नीलगिरी",
        "lat": 11.4074, "lng": 76.6960,
        "risk": "natural",
        "riskLabel": "Landslides, Wild Animals & Heat",
        "riskLabel_hi": "भूस्खलन, जंगली जानवर और गर्मी",
        "description": "Nilgiris and Coimbatore face landslides during monsoon. Wild elephant attacks on forest roads. Interior Tamil Nadu experiences extreme heat.",
        "description_hi": "नीलगिरी और कोयंबत्तूर में मानसून में भूस्खलन। जंगली हाथी हमले।",
        "advisory": "Avoid forest roads at dawn/dusk. Don't stop near elephant corridors. Carry water in summer.",
        "advisory_hi": "सुबह/शाम वन सड़कों से बचें। हाथी गलियारों के पास न रुकें।",
        "radius": 25000
    },
    {
        "name": "Lakshadweep Islands",
        "name_hi": "लक्षद्वीप द्वीपसमूह",
        "lat": 10.5667, "lng": 72.6417,
        "risk": "natural",
        "riskLabel": "Sea Level Rise & Cyclone Risk",
        "riskLabel_hi": "समुद्र स्तर वृद्धि और चक्रवात जोखिम",
        "description": "Low-lying islands vulnerable to sea level rise and coastal erosion. Cyclone risk Oct-Dec. Limited freshwater. Restricted access for tourists.",
        "description_hi": "निचले द्वीप समुद्र स्तर वृद्धि और तटीय कटाव के प्रति संवेदनशील।",
        "advisory": "Follow island regulations. Monitor cyclone warnings. Respect restricted areas.",
        "advisory_hi": "द्वीप नियमों का पालन करें। चक्रवात चेतावनी की निगरानी करें।",
        "radius": 20000
    },
    # === WEST INDIA ===
    {
        "name": "Maharashtra Urban & Industrial",
        "name_hi": "महाराष्ट्र शहरी और औद्योगिक",
        "lat": 19.0760, "lng": 72.8777,
        "risk": "moderate",
        "riskLabel": "Urban Flooding, Earthquake & Industrial Risk",
        "riskLabel_hi": "शहरी बाढ़, भूकंप और औद्योगिक जोखिम",
        "description": "Mumbai faces annual monsoon flooding. Pune earthquake-prone (Seismic Zone IV). JNPT industrial corridor has chemical risk. Thane Creek flooding.",
        "description_hi": "मुंबई में सालाना मानसून बाढ़। पुणे भूकंप-प्रवण। JNPT औद्योगिक कॉरिडोर।",
        "advisory": "Avoid low-lying areas during monsoon. Know earthquake drop-cover-hold. Follow industrial safety signs.",
        "advisory_hi": "मानसून में निचले इलाकों से बचें। भूकंप सुरक्षा जानें।",
        "radius": 30000
    },
    # === NORTHEAST INDIA ===
    {
        "name": "Assam & Brahmaputra Valley",
        "name_hi": "असम और ब्रह्मपुत्र घाटी",
        "lat": 26.2006, "lng": 92.9376,
        "risk": "natural",
        "riskLabel": "Annual Devastating Floods & Erosion",
        "riskLabel_hi": "वार्षिक विनाशकारी बाढ़ और कटाव",
        "description": "Brahmaputra and Barak valleys flood annually. Riverbank erosion displaces millions. Kaziranga submerges. Elephant-human conflict in fringe areas.",
        "description_hi": "ब्रह्मपुत्र और बराक घाटी सालाना बाढ़। नदी तट कटाव। काजीरंगा जलमग्न।",
        "advisory": "Avoid Kaziranga during monsoon. Don't cross flooded roads. Stay away from eroding riverbanks.",
        "advisory_hi": "मानसून में काजीरंगा से बचें। बाढ़ वाली सड़कें पार न करें।",
        "radius": 40000
    },
    {
        "name": "Mizoram, Tripura & Barak Valley",
        "name_hi": "मिजोरम, त्रिपुरा और बराक घाटी",
        "lat": 23.1648, "lng": 92.9376,
        "risk": "natural",
        "riskLabel": "High Seismic Zone V & Landslides",
        "riskLabel_hi": "उच्च भूकंपीय क्षेत्र V और भूस्खलन",
        "description": "Both states in India's highest seismic zone. 2021 Mizoram earthquake 6.1 magnitude. Landslides during monsoon. Myanmar border porous.",
        "description_hi": "दोनों राज्य भारत के सर्वोच्च भूकंपीय जोखिम क्षेत्र में। 2021 मिजोरम भूकंप।",
        "advisory": "Know earthquake safety. Avoid old buildings. Get permits for border areas.",
        "advisory_hi": "भूकंप सुरक्षा जानें। पुरानी इमारतों से बचें। सीमा क्षेत्रों के लिए परमिट लें।",
        "radius": 35000
    },
    {
        "name": "Arunachal Pradesh Border",
        "name_hi": "अरुणाचल प्रदेश सीमा",
        "lat": 27.1044, "lng": 93.6920,
        "risk": "moderate",
        "riskLabel": "China Border Tension & Insurgency",
        "riskLabel_hi": "चीन सीमा तनाव और उग्रवाद",
        "description": "Active Line of Actual Control with China. Inner Line Permit required. Arunachal faces earthquake risk. Remote areas with limited connectivity.",
        "description_hi": "चीन के साथ सक्रिय वास्तविक नियंत्रण रेखा। आंतरिक रेखा परमिट आवश्यक।",
        "advisory": "Obtain Inner Line Permit. Don't approach LAC. Carry satellite communicator in remote areas.",
        "advisory_hi": "आंतरिक रेखा परमिट प्राप्त करें। LAC के पास न जाएं। दूरदराज में सैटेलाइट संचारक ले जाएं।",
        "radius": 40000
    },
    # === ISLAND TERRITORIES ===
    {
        "name": "Andaman & Nicobar Deep Islands",
        "name_hi": "अंडमान और निकोबार दीप क्षेत्र",
        "lat": 8.5, "lng": 93.0,
        "risk": "natural",
        "riskLabel": "Restricted Tribal Zones & Tsunami Risk",
        "riskLabel_hi": "प्रतिबंधित आदिवासी क्षेत्र और सुनामी जोखिम",
        "description": "Sentinel Island and other tribal areas — entering is illegal and life-threatening. Active seismic zone. Restricted Area Permit needed.",
        "description_hi": "सेंटिनल द्वीप और अन्य आदिवासी क्षेत्र — प्रवेश गैरकानूनी और जानलेवा।",
        "advisory": "Never approach restricted tribal islands. Carry emergency supplies. Follow tsunami warning signals.",
        "advisory_hi": "प्रतिबंधित आदिवासी द्वीपों के पास कभी न जाएं। आपातकालीन आपूर्ति ले जाएं।",
        "radius": 50000
    },
    # === ADDITIONAL THREATS ===
    {
        "name": "Chhattisgarh & Odisha Naxal Corridor",
        "name_hi": "छत्तीसगढ़ और ओडिशा नक्सल कॉरिडोर",
        "lat": 18.5204, "lng": 81.5,
        "risk": "high",
        "riskLabel": "Naxal-Maoist Insurgency & IED Risk",
        "riskLabel_hi": "नक्सल-माओवादी विद्रोह और IED जोखिम",
        "description": "Combined Chhattisgarh-Odisha Naxal corridor. Bastar, Malkangiri, Koraput are active conflict zones. IED attacks on roads.",
        "description_hi": "छत्तीसगढ़-ओडिशा नक्सल कॉरिडोर। बस्तर, मलकानगिरी, कोरापुट सक्रिय संघर्ष क्षेत्र।",
        "advisory": "Do not travel without district collector permission. Avoid forest routes. Travel in convoy.",
        "advisory_hi": "जिला कलेक्टर की अनुमति के बिना यात्रा न करें। वन मार्गों से बचें।",
        "radius": 45000
    },
    {
        "name": "Rajasthan Thar Desert Interior",
        "name_hi": "राजस्थान थार मरुस्थल अंतर्देशीय",
        "lat": 24.5854, "lng": 70.8597,
        "risk": "moderate",
        "riskLabel": "Extreme Heat, Dehydration & Sandstorms",
        "riskLabel_hi": "अत्यधिक गर्मी, निर्जलीकरण और रेत तूफान",
        "description": "Deep desert areas with temperatures exceeding 50°C. Zero mobile network. No water sources for 50+ km stretches. Sandstorms common Mar-Jun.",
        "description_hi": "गहरे मरुस्थल क्षेत्र जहां तापमान 50°C से अधिक। कोई मोबाइल नेटवर्क। 50+ किमी तक पानी नहीं।",
        "advisory": "Never venture deep desert alone. Carry 6+ liters water. Use satellite communicator. Travel with experienced guide.",
        "advisory_hi": "अकेले गहरे मरुस्थल में न जाएं। 6+ लीटर पानी ले जाएं। सैटेलाइट संचारक ले जाएं।",
        "radius": 40000
    },
    {
        "name": "Uttarakhand Char Dham & High Altitude",
        "name_hi": "उत्तराखंड चार धाम और ऊंचाई क्षेत्र",
        "lat": 31.0661, "lng": 78.5,
        "risk": "natural",
        "riskLabel": "High Altitude Sickness & Extreme Weather",
        "riskLabel_hi": "ऊंचाई बीमारी और चरम मौसम",
        "description": "Badrinath, Yamunotri, Gangotri at 10,000-15,000 ft. Severe altitude sickness risk. Roads close Oct-May. Extreme weather changes rapidly.",
        "description_hi": "बद्रीनाथ, यमुनोत्री, गंगोत्री 10,000-15,000 फीट पर। गंभीर ऊंचाई बीमारी।",
        "advisory": "Acclimatize properly. Carry Diamox. Don't trek alone. Check weather before departure.",
        "advisory_hi": "ठीक से ऊंचाई के अनुकूल हों। Diamox ले जाएं। अकेले ट्रेक न करें।",
        "radius": 35000
    },
    {
        "name": "Jammu & Pir Panjal Range",
        "name_hi": "जम्मू और पीर पंजाल रेंज",
        "lat": 32.7266, "lng": 74.8570,
        "risk": "moderate",
        "riskLabel": "Landslides, Heavy Snowfall & Border Tension",
        "riskLabel_hi": "भूस्खलन, भारी बर्फबारी और सीमा तनाव",
        "description": "Pir Panjal range faces heavy snowfall and landslides. Vaishno Devi pilgrimage route can be treacherous. Border areas near Pakistan have security risks.",
        "description_hi": "पीर पंजाल रेंज में भारी बर्फबारी और भूस्खलन। वैष्णो देवी तीर्थ मार्ग खतरनाक।",
        "advisory": "Check Vaishno Devi track status. Carry warm clothing. Avoid border areas.",
        "advisory_hi": "वैष्णो देवी ट्रैक स्थिति जांचें। गर्म कपड़े ले जाएं। सीमा क्षेत्रों से बचें।",
        "radius": 30000
    },
    {
        "name": "Himachal Kinnaur & Lahaul-Spiti",
        "name_hi": "हिमाचल किन्नौर और लाहौल-स्पिति",
        "lat": 32.5, "lng": 78.0,
        "risk": "moderate",
        "riskLabel": "Extreme Isolation, Landslides & Cold",
        "riskLabel_hi": "अत्यधिक एकांत, भूस्खलन और ठंड",
        "description": "Roads close for months Oct-Jun. No ATMs, limited mobile. 2023 Himachal floods killed 400+. Kinnaur landslide cut off 50+ villages.",
        "description_hi": "अक्टूबर-जून में महीनों सड़कें बंद। कोई ATM, सीमित मोबाइल। 2023 हिमाचल बाढ़।",
        "advisory": "Carry cash and satellite communicator. Acclimatize properly. Travel with experienced guide.",
        "advisory_hi": "नकद और सैटेलाइट संचारक ले जाएं। ठीक से ऊंचाई के अनुकूल हों।",
        "radius": 35000
    }
]

# Build the new zones string
new_zones_str = ""
for z in new_zones:
    new_zones_str += "    {\n"
    new_zones_str += f'        name: "{z["name"]}",\n'
    new_zones_str += f'        name_hi: "{z["name_hi"]}",\n'
    new_zones_str += f'        lat: {z["lat"]}, lng: {z["lng"]},\n'
    new_zones_str += f'        risk: "{z["risk"]}",\n'
    new_zones_str += f'        riskLabel: "{z["riskLabel"]}",\n'
    new_zones_str += f'        riskLabel_hi: "{z["riskLabel_hi"]}",\n'
    new_zones_str += f'        description: "{z["description"]}",\n'
    new_zones_str += f'        description_hi: "{z["description_hi"]}",\n'
    new_zones_str += f'        advisory: "{z["advisory"]}",\n'
    new_zones_str += f'        advisory_hi: "{z["advisory_hi"]}",\n'
    new_zones_str += f'        radius: {z["radius"]}\n'
    new_zones_str += "    },\n"

# Insert before the closing ]
new_js = js[:end] + "\n" + new_zones_str + js[end:]

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(new_js)

# Verify count
names = re.findall(r'name: "([^"]*)"', new_js[start:end + len(new_zones_str)])
print(f"Total zones: {len(names)}")
for i, n in enumerate(names):
    print(f"  {i+1}. {n}")
