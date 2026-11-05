#!/usr/bin/env python3
"""Add comprehensive danger zones covering all of India"""

with open('app.js', 'r', encoding='utf-8') as f:
    js = f.read()

marker = 'radius: 55000\n    }\n];'
pos = js.find(marker)
if pos == -1:
    print("Could not find end of dangerZones array")
    exit(1)

insert_pos = pos + len('radius: 55000\n    }')

new_zones = """,
    {
        name: "Chhattisgarh Naxal Belt",
        name_hi: "छत्तीसगढ़ नक्सल बेल्ट",
        lat: 19.0745, lng: 81.0110, risk: "high",
        riskLabel: "Naxal-Maoist Insurgency", riskLabel_hi: "नक्सल-माओवादी विद्रोह",
        description: "Bastar, Dantewada, Sukma, and Bijapur districts are active Naxal zones. IEDs and ambushes reported. Travel restricted without permission.",
        description_hi: "बस्तर, दंतेवाड़ा, सुकमा और बीजापुर जिले सक्रिय नक्सल क्षेत्र हैं। आईईडी और घात लगाकर हमलों की सूचना।",
        advisory: "Do not travel to Bastar division without district collector permission. Avoid forest routes.",
        advisory_hi: "जिला कलेक्टर की अनुमति के बिना बस्तर प्रभाग में यात्रा न करें। वन मार्गों से बचें।",
        radius: 60000
    },
    {
        name: "Jharkhand Naxal Belt",
        name_hi: "झारखंड नक्सल बेल्ट",
        lat: 23.3441, lng: 85.3096, risk: "high",
        riskLabel: "Naxal-Maoist Insurgency", riskLabel_hi: "नक्सल-माओवादी विद्रोह",
        description: "West Singhbhum, Latehar, Palamu, and Gumla districts are active Naxal areas. Frequent IED attacks on roads.",
        description_hi: "पश्चिम सिंहभूम, लातेहार, पलामू और गुमला जिले सक्रिय नक्सल क्षेत्र। सड़कों पर बार-बार आईईडी हमले।",
        advisory: "Avoid travel after dark. Stay on main highways. Check security advisories.",
        advisory_hi: "अंधेरे के बाद यात्रा से बचें। मुख्य राजमार्गों पर रहें। सुरक्षा सलाह जांचें।",
        radius: 50000
    },
    {
        name: "Odisha Super Cyclone Zone",
        name_hi: "ओडिशा सुपर चक्रवात क्षेत्र",
        lat: 20.2961, lng: 85.8245, risk: "natural",
        riskLabel: "Super Cyclone Zone", riskLabel_hi: "सुपर चक्रवात क्षेत्र",
        description: "Odisha coast is among world's most cyclone-prone areas. Super Cyclone 1999 killed 10,000+. Cyclone Fani (2019) caused massive destruction.",
        description_hi: "ओडिशा तट दुनिया के सबसे चक्रवात-प्रवण क्षेत्रों में से एक है।",
        advisory: "Monitor IMD cyclone warnings. Evacuate when instructed. Stay away from coast during Apr-Jun, Oct-Dec.",
        advisory_hi: "IMD चक्रवात चेतावनी की निगरानी करें। चक्रवात के मौसम में तट से दूर रहें।",
        radius: 45000
    },
    {
        name: "Karnataka Flood Zone",
        name_hi: "कर्नाटक बाढ़ क्षेत्र",
        lat: 15.3173, lng: 75.7139, risk: "natural",
        riskLabel: "Annual Flooding & Landslides", riskLabel_hi: "वार्षिक बाढ़ और भूस्खलन",
        description: "North Karnataka (Belgaum, Hubli, Gadag) and coastal Karnataka face annual monsoon flooding. Western Ghats landslides cut off road access.",
        description_hi: "उत्तर कर्नाटक और तटीय कर्नाटक सालाना मानसून बाढ़ का सामना करते हैं।",
        advisory: "Avoid low-lying areas during monsoon. Check road conditions before Western Ghats travel.",
        advisory_hi: "मानसून के दौरान निचले इलाकों से बचें। पश्चिमी घाट यात्रा से पहले सड़क स्थिति जांचें।",
        radius: 35000
    },
    {
        name: "Maharashtra Flood & Landslide Zone",
        name_hi: "महाराष्ट्र बाढ़ और भूस्खलन क्षेत्र",
        lat: 19.7515, lng: 75.7139, risk: "natural",
        riskLabel: "Monsoon Flooding & Landslides", riskLabel_hi: "मानसून बाढ़ और भूस्खलन",
        description: "Kolhapur, Sangli, Satara, and Raigad face severe monsoon flooding. 2019 floods displaced 500,000+ people.",
        description_hi: "कोल्हापुर, सांगली, सातारा और रायगड गंभीर मानसून बाढ़ का सामना करते हैं।",
        advisory: "Avoid riverbank areas during monsoon. Don't cross flooded roads.",
        advisory_hi: "मानसून के दौरान नदी किनारे के इलाकों से बचें। बाढ़ वाली सड़कों को पार न करें।",
        radius: 40000
    },
    {
        name: "Andhra Pradesh Cyclone Zone",
        name_hi: "आंध्र प्रदेश चक्रवात क्षेत्र",
        lat: 16.5062, lng: 80.6480, risk: "natural",
        riskLabel: "Cyclone & Storm Surge", riskLabel_hi: "चक्रवात और तूफानी लहर",
        description: "Coastal AP (Visakhapatnam, Machilipatnam) is highly cyclone-prone. Cyclone Hudhud (2014) caused $7B damage.",
        description_hi: "तटीय आंध्र प्रदेश अत्यधिक चक्रवात-प्रवण है।",
        advisory: "Monitor IMD alerts. Evacuate coastal areas during cyclone warnings.",
        advisory_hi: "IMD अलर्ट की निगरानी करें। चक्रवात चेतावनी के दौरान तटीय क्षेत्र खाली करें।",
        radius: 40000
    },
    {
        name: "Sikkim & Darjeeling Landslide Zone",
        name_hi: "सिक्किम और दार्जिलिंग भूस्खलन क्षेत्र",
        lat: 27.3389, lng: 88.6065, risk: "natural",
        riskLabel: "Landslides & Earthquake", riskLabel_hi: "भूस्खलन और भूकंप",
        description: "Sikkim and Darjeeling face annual landslides blocking NH10. Seismic Zone IV. Glacial lake outburst floods possible.",
        description_hi: "सिक्किम और दार्जिलिंग सालाना भूस्खलन का सामना करते हैं।",
        advisory: "Check road status before travel. Avoid monsoon trekking.",
        advisory_hi: "यात्रा से पहले सड़क स्थिति जांचें। मानसून ट्रेकिंग से बचें।",
        radius: 35000
    },
    {
        name: "Assam Flood Zone",
        name_hi: "असम बाढ़ क्षेत्र",
        lat: 26.2006, lng: 92.9376, risk: "natural",
        riskLabel: "Annual Devastating Floods", riskLabel_hi: "वार्षिक विनाशकारी बाढ़",
        description: "Brahmaputra and Barak valleys flood annually. Kaziranga National Park submerges. 2020 floods affected 5.5 million people.",
        description_hi: "ब्रह्मपुत्र और बराक घाटी सालाना बाढ़ से प्रभावित। काजीरंगा जलमग्न।",
        advisory: "Avoid Kaziranga during monsoon. Don't cross flooded roads.",
        advisory_hi: "मानसून के दौरान काजीरंगा से बचें। बाढ़ वाली सड़कों को पार न करें।",
        radius: 50000
    },
    {
        name: "Mizoram & Tripura Earthquake Zone",
        name_hi: "मिजोरम और त्रिपुरा भूकंप क्षेत्र",
        lat: 23.1648, lng: 92.9376, risk: "natural",
        riskLabel: "High Seismic Zone V", riskLabel_hi: "उच्च भूकंपीय क्षेत्र V",
        description: "Both states in India's highest seismic risk zone. 2021 Mizoram earthquake (6.1 magnitude). Buildings vulnerable.",
        description_hi: "दोनों राज्य भारत के सर्वोच्च भूकंपीय जोखिम क्षेत्र में।",
        advisory: "Know earthquake safety. Avoid old buildings.",
        advisory_hi: "भूकंप सुरक्षा जानें। पुरानी इमारतों से बचें।",
        radius: 40000
    },
    {
        name: "Punjab & Rajasthan Border",
        name_hi: "पंजाब और राजस्थान सीमा",
        lat: 30.9022, lng: 71.4714, risk: "moderate",
        riskLabel: "Border Tensions & Drone Threats", riskLabel_hi: "सीमा तनाव और ड्रोन खतरे",
        description: "India-Pakistan border. Occasional ceasefire violations. Cross-border drone smuggling. Wagah Border ceremony area.",
        description_hi: "भारत-पाकिस्तान सीमा। कभी-कभी संघर्ष विराम उल्लंघन। सीमा पार ड्रोन तस्करी।",
        advisory: "Carry valid ID. Don't cross border areas without permission.",
        advisory_hi: "वैध आईडी ले जाएं। अनुमति के बिना सीमा क्षेत्रों को पार न करें।",
        radius: 35000
    },
    {
        name: "Ladakh Border (Siachen/Kargil)",
        name_hi: "लद्दाख सीमा (सियाचिन/कारगिल)",
        lat: 35.2167, lng: 75.7500, risk: "high",
        riskLabel: "Active Military Zone & Extreme Altitude", riskLabel_hi: "सक्रिय सैन्य क्षेत्र और अत्यधिक ऊंचाई",
        description: "Siachen Glacier — world's highest battlefield. Kargil sector has active military operations. Tourist access prohibited without military clearance.",
        description_hi: "सियाचिन ग्लेशियर — दुनिया का सबसे ऊंचा युद्धक्षेत्र। सैन्य मंजूरी के बिना प्रवेश वर्जित।",
        advisory: "Tourist access strictly prohibited without military clearance.",
        advisory_hi: "सैन्य मंजूरी के बिना पर्यटक प्रवेश सख्त वर्जित।",
        radius: 60000
    },
    {
        name: "Delhi Summer Heatwave",
        name_hi: "दिल्ली ग्रीष्मकालीन लू",
        lat: 28.6139, lng: 77.2090, risk: "moderate",
        riskLabel: "Extreme Heatwave (Apr-Jun)", riskLabel_hi: "अत्यधिक लू (अप्रैल-जून)",
        description: "Temperatures exceed 45-48°C in May-June. Heatwave deaths reported annually. Severe water shortage.",
        description_hi: "मई-जून में तापमान 45-48°C से अधिक। सालाना लू से मौतें।",
        advisory: "Avoid outdoor activity 11AM-4PM. Drink 4+ liters water daily.",
        advisory_hi: "दोपहर 11-4 बजे बाहरी गतिविधि से बचें। रोजाना 4+ लीटर पानी पिएं।",
        radius: 30000
    },
    {
        name: "Manipur Valley Insurgency",
        name_hi: "मणिपुर घाटी उग्रवाद",
        lat: 24.5237, lng: 93.7731, risk: "moderate",
        riskLabel: "Insurgency & Restricted Areas", riskLabel_hi: "उग्रवाद और प्रतिबंधित क्षेत्र",
        description: "Active insurgent groups. AFSPA in effect. Inner Line Permit required for some areas.",
        description_hi: "सक्रिय उग्रवादी समूह। AFSPA लागू। कुछ क्षेत्रों के लिए आंतरिक रेखा परमिट आवश्यक।",
        advisory: "Obtain Inner Line Permit. Avoid border areas.",
        advisory_hi: "आंतरिक रेखा परमिट प्राप्त करें। सीमा क्षेत्रों से बचें।",
        radius: 35000
    },
    {
        name: "Nagaland & Arunachal Border",
        name_hi: "नागालैंड और अरुणाचल सीमा",
        lat: 26.1581, lng: 94.5624, risk: "moderate",
        riskLabel: "Insurgency & Myanmar Border", riskLabel_hi: "उग्रवाद और म्यांमार सीमा",
        description: "Active insurgent groups. Myanmar border is porous. Protected Area Permit required for foreign nationals.",
        description_hi: "सक्रिय उग्रवादी समूह। म्यांमार सीमा असुरक्षित। विदेशियों के लिए संरक्षित क्षेत्र परमिट आवश्यक।",
        advisory: "Obtain Protected Area Permit. Don't venture near international border.",
        advisory_hi: "संरक्षित क्षेत्र परमिट प्राप्त करें। अंतर्राष्ट्रीय सीमा के पास न जाएं।",
        radius: 40000
    },
    {
        name: "Chennai Urban Flooding",
        name_hi: "चेन्नई शहरी बाढ़",
        lat: 12.9165, lng: 80.1480, risk: "natural",
        riskLabel: "Urban Flooding & Tsunami Risk", riskLabel_hi: "शहरी बाढ़ और सुनामी जोखिम",
        description: "2015 Chennai floods killed 500+. Northeast monsoon (Oct-Dec) brings extreme rainfall. IT corridor floods regularly.",
        description_hi: "2015 चेन्नई बाढ़ में 500+ लोग मारे गए। उत्तर-पूर्व मानसून अत्यधिक वर्षा।",
        advisory: "Avoid low-lying areas during Oct-Dec. Know tsunami evacuation routes.",
        advisory_hi: "अक्टूबर-दिसंबर के दौरान निचले इलाकों से बचें। सुनामी निकासी मार्ग जानें।",
        radius: 35000
    },
    {
        name: "Gujarat Kutch Rann",
        name_hi: "गुजरात कच्छ रन",
        lat: 23.8500, lng: 69.5000, risk: "natural",
        riskLabel: "Rann Flooding & Earthquake", riskLabel_hi: "रन बाढ़ और भूकंप",
        description: "Rann of Kutch floods during monsoon. 2001 Bhuj earthquake (7.7 magnitude). Salt desert difficult to navigate.",
        description_hi: "मानसून के दौरान रन ऑफ कच्छ बाढ़। 2001 भुज भूकंप।",
        advisory: "Don't venture into Rann during monsoon. Carry satellite communicator.",
        advisory_hi: "मानसून के दौरान रन में न जाएं। सैटेलाइट संचारक ले जाएं।",
        radius: 50000
    },
    {
        name: "Meghalaya Extreme Rainfall",
        name_hi: "मेघालय अत्यधिक वर्षा",
        lat: 25.2974, lng: 91.8835, risk: "natural",
        riskLabel: "Extreme Rainfall & Flash Floods", riskLabel_hi: "अत्यधिक वर्षा और अचानक बाढ़",
        description: "Wettest place on Earth (11,777mm annually). Deadly flash floods and landslides during monsoon.",
        description_hi: "पृथ्वी का सबसे गीला स्थान। मानसून में घातक अचानक बाढ़।",
        advisory: "Avoid monsoon travel. Stay away from river banks during heavy rain.",
        advisory_hi: "मानसून यात्रा से बचें। भारी बारिश में नदी किनारे से दूर रहें।",
        radius: 30000
    },
    {
        name: "Coorg & Wayanad Landslides",
        name_hi: "कूर्ग और वायनाड भूस्खलन",
        lat: 12.3375, lng: 75.8069, risk: "natural",
        riskLabel: "Landslides & Wild Elephants", riskLabel_hi: "भूस्खलन और जंगली हाथी",
        description: "Annual landslides during heavy monsoon. Wild elephant attacks on forest roads. Roads wash away.",
        description_hi: "भारी मानसून में सालाना भूस्खलन। जंगली हाथी हमले।",
        advisory: "Avoid forest roads at dawn/dusk. Don't stop near elephant corridors.",
        advisory_hi: "सुबह/शाम वन सड़कों से बचें। हाथी गलियारों के पास न रुकें।",
        radius: 25000
    },
    {
        name: "Spiti & Kinnaur Remote Zone",
        name_hi: "स्पिति और किन्नौर दूरस्थ क्षेत्र",
        lat: 32.2500, lng: 78.0000, risk: "moderate",
        riskLabel: "Extreme Altitude & Isolation", riskLabel_hi: "अत्यधिक ऊंचाई और एकांत",
        description: "Altitudes 12,000-15,000 ft. Roads close Oct-June. No ATMs, limited mobile. Helicopter rescue only. Mountain sickness common.",
        description_hi: "ऊंचाई 12,000-15,000 फीट। अक्टूबर-जून में सड़कें बंद। कोई ATM, सीमित मोबाइल।",
        advisory: "Carry cash. Acclimatize properly. Travel with experienced guide.",
        advisory_hi: "नकद ले जाएं। ठीक से ऊंचाई के अनुकूल हों। अनुभवी गाइड के साथ यात्रा करें।",
        radius: 35000
    },
    {
        name: "Kedarnath & Char Dham Zone",
        name_hi: "केदारनाथ और चार धाम क्षेत्र",
        lat: 30.7353, lng: 79.0669, risk: "natural",
        riskLabel: "Flash Floods & Extreme Weather", riskLabel_hi: "अचानक बाढ़ और चरम मौसम",
        description: "2013 Kedarnath disaster killed 5,700+. Glacial lake outburst floods. Extreme weather at high altitude.",
        description_hi: "2013 केदारनाथ आपदा में 5,700+ लोग मारे गए।",
        advisory: "Avoid monsoon pilgrimage. Register for Char Dham Yatra.",
        advisory_hi: "मानसून तीर्थयात्रा से बचें। चार धाम यात्रा पंजीकरण करें।",
        radius: 40000
    },
    {
        name: "Kashmir LOC Areas",
        name_hi: "कश्मीर LOC क्षेत्र",
        lat: 34.5000, lng: 74.3000, risk: "high",
        riskLabel: "Active Conflict Zone", riskLabel_hi: "सक्रिय संघर्ष क्षेत्र",
        description: "LOC areas — Baramulla, Kupwara, Bandipora, Shopian are active conflict zones. Unexploded ordnance risk.",
        description_hi: "LOC क्षेत्र — बारामूला, कुपवाड़ा, बांदीपोरा, शोपियां सक्रिय संघर्ष क्षेत्र।",
        advisory: "Tourist access prohibited in LOC areas without security clearance.",
        advisory_hi: "सुरक्षा मंजूरी के बिना LOC क्षेत्रों में प्रवेश वर्जित।",
        radius: 45000
    },
    {
        name: "Varanasi & UP River Floods",
        name_hi: "वाराणसी और UP नदी बाढ़",
        lat: 25.3176, lng: 82.9739, risk: "natural",
        riskLabel: "Ganga Flood Plains", riskLabel_hi: "गंगा बाढ़ मैदान",
        description: "Ganga and Yamuna flood plains submerge annually. Ghats become inaccessible during peak monsoon.",
        description_hi: "गंगा और यमुना बाढ़ मैदान सालाना जलमग्न। मानसून में घाट अप्राप्य।",
        advisory: "Check river levels before visiting ghats. Avoid low-lying areas during monsoon.",
        advisory_hi: "घाट यात्रा से पहले नदी स्तर जांचें। मानसून में निचले इलाकों से बचें।",
        radius: 30000
    },
    {
        name: "Rajasthan Border (Pakistan)",
        name_hi: "राजस्थान सीमा (पाकिस्तान)",
        lat: 27.0239, lng: 70.3819, risk: "moderate",
        riskLabel: "Border Tensions & Desert", riskLabel_hi: "सीमा तनाव और मरुस्थल",
        description: "India-Pakistan border in Thar Desert. Cross-border smuggling. Extreme heat in summer. Limited water sources.",
        description_hi: "थार मरुस्थल में भारत-पाकिस्तान सीमा। सीमा पार तस्करी। ग्रीष्म में अत्यधिक गर्मी।",
        advisory: "Carry valid ID. Avoid border areas after dark. Carry extra water.",
        advisory_hi: "वैध आईडी ले जाएं। अंधेरे के बाद सीमा क्षेत्रों से बचें। अतिरिक्त पानी ले जाएं।",
        radius: 40000
    },
    {
        name: "Goa Monsoon Flooding",
        name_hi: "गोवा मानसून बाढ़",
        lat: 15.4989, lng: 73.8278, risk: "natural",
        riskLabel: "Monsoon Flooding & Waterlogging", riskLabel_hi: "मानसून बाढ़ और जलभराव",
        description: "Goa faces severe waterlogging during monsoon. Roads flood, traffic halts. River bridges become impassable. Beach erosion.",
        description_hi: "मानसून के दौरान गोवा में गंभीर जलभराव। सड़कें जलमग्न।",
        advisory: "Avoid Goa during peak monsoon (Jul-Aug). Don't drive through flooded roads.",
        advisory_hi: "पीक मानसून (जुलाई-अगस्त) में गोवा से बचें। बाढ़ वाली सड़कों पर ड्राइव न करें।",
        radius: 20000
    },
    {
        name: "Uttarakhand Glacier Lake Zone",
        name_hi: "उत्तराखंड ग्लेशियर झील क्षेत्र",
        lat: 30.5000, lng: 79.5000, risk: "natural",
        riskLabel: "Glacial Lake Outburst Floods", riskLabel_hi: "हिमनदी झील विस्फोट बाढ़",
        description: "Multiple glacial lakes at risk of outburst floods. Climate change accelerating glacier melt. Chamoli disaster 2021 killed 200+.",
        description_hi: "विस्फोट बाढ़ के जोखिम में कई हिमनदी झीलें। जलवायु परिवर्तन ग्लेशियर पिघलने को तेज कर रहा।",
        advisory: "Avoid glacial trekking in monsoon. Monitor GLOF alerts.",
        advisory_hi: "मानसून में हिमनदी ट्रेकिंग से बचें। GLOF अलर्ट की निगरानी करें।",
        radius: 45000
    },
    {
        name: "Himachal Kinnaur & Lahaul",
        name_hi: "हिमाचल किन्नौर और लाहौल",
        lat: 31.6500, lng: 77.9500, risk: "natural",
        riskLabel: "Landslides & Extreme Cold", riskLabel_hi: "भूस्खलन और अत्यधिक ठंड",
        description: "Kinnaur and Lahaul-Spiti face massive landslides. 2023 Himachal floods killed 400+. Roads close for months in winter.",
        description_hi: "किन्नौर और लाहौल-स्पिति भारी भूस्खलन का सामना करते हैं। 2023 हिमाचल बाढ़ में 400+ मौतें।",
        advisory: "Avoid monsoon travel. Winter travel requires 4x4 vehicles.",
        advisory_hi: "मानसून यात्रा से बचें। सर्दियों की यात्रा के लिए 4x4 वाहन आवश्यक।",
        radius: 35000
    }
]"""

js = js[:insert_pos] + new_zones + js[insert_pos:]

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(js)

count = js.count('riskLabel:')
print(f"Total danger zones with riskLabel: {count}")
