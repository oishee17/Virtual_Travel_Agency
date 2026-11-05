/**
 * Bharat Suraksha - Tourist Safety Portal
 * Main Application Logic
 */

// ==================== STATE ====================
let map = null;
let userMarker = null;
let trackingInterval = null;
let isTracking = false;
let nearbyMarkers = [];
let dangerZoneMarkers = [];
let currentLang = 'en';
let personalContacts = JSON.parse(localStorage.getItem('bharatSurakshaContacts') || '[]');
let lastKnownPosition = null;
let trackingTrail = [];
let trailPolyline = null;
let trackingStartTime = null;
let totalDistanceTraveled = 0;
let lastTrackedPos = null;
let currentSpeed = 0;
let currentHeading = 0;
let trackingPanelVisible = false;
let batteryLevel = null;

// ==================== HELPER FUNCTIONS ====================
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('bharatSurakshaCurrentUser') || '{}');
}

// ==================== DANGER ZONES DATA ====================
const dangerZones = [
    {
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
        radius: 25000
    },{
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
        radius: 15000
    },
{
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
        radius: 15000
    },
{
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
        radius: 27300
    },
{
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
        radius: 20800
    },
{
        name: "Bihar Flood Plains",
        name_hi: "बिहार बाढ़ मैदान",
        lat: 25.6093,
        lng: 85.1376,
        risk: "natural",
        riskLabel: "Annual Flooding",
        riskLabel_hi: "वार्षिक बाढ़",
        description: "Bihar experiences devastating floods every monsoon season. Rivers like Kosi and Gandak frequently change course.",
        description_hi: "बिहार हर मानसून के मौसम में विनाशकारी बाढ़ का अनुभव करता है। कोसी और गंडक जैसी नदियां बार-बार अपना पाठ बदलती हैं।",
        advisory: "Know evacuation routes. Keep documents in waterproof bags. Follow district administration alerts.",
        advisory_hi: "निकासी मार्ग जानें। दस्तावेजों को वाटरप्रूफ बैग में रखें। जिला प्रशासन अलर्ट का पालन करें।",
        radius: 24700
    },
{
        name: "Mumbai Coastal Belt",
        name_hi: "मुंबई तटीय बेल्ट",
        lat: 19.0760,
        lng: 72.8777,
        risk: "moderate",
        riskLabel: "Monsoon Flooding, Earthquake & Terrorism History",
        riskLabel_hi: "मानसून बाढ़ और आतंकवाद इतिहास",
        description: "2008 terror attacks history. Annual monsoon flooding disrupts transport. Pune earthquake-prone (Seismic Zone IV). Thane Creek flooding. Industrial corridor chemical risk.",
        description_hi: "2008 आतंकवादी हमलों का इतिहास। वार्षिक मानसून बाढ़ परिवहन को बाधित करती है।",
        advisory: "Avoid isolated areas at night. Monitor flood warnings. Know nearest evacuation routes.",
        advisory_hi: "रात में अलग-थलग इलाकों से बचें। बाढ़ चेतावनी की निगरानी करें। निकटतम निकासी मार्ग जानें।",
        radius: 19500
    },
{
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
        radius: 35750
    },
{
        name: "Andaman & Nicobar Islands",
        name_hi: "अंडमान और निकोबार द्वीपसमूह",
        lat: 11.7401,
        lng: 92.6586,
        risk: "natural",
        riskLabel: "Tsunami & Earthquake Zone",
        riskLabel_hi: "सुनामी और भूकंप क्षेत्र",
        description: "2004 tsunami devastated the islands. Located in active seismic zone. Tribes areas are restricted — entering is illegal.",
        description_hi: "2004 सुनामी ने द्वीपों को तबाह कर दिया। सक्रिय भूकंपीय क्षेत्र में स्थित। आदिवासी क्षेत्र प्रतिबंधित हैं।",
        advisory: "Follow tsunami warning signals. Respect restricted tribal areas. Carry emergency supplies.",
        advisory_hi: "सुनामी चेतावनी संकेतों का पालन करें। प्रतिबंधित आदिवासी क्षेत्रों का सम्मान करें। आपातकालीन आपूर्ति ले जाएं।",
        radius: 29250
    },
{
        name: "Goa Beach Areas",
        name_hi: "गोवा समुद्र तट क्षेत्र",
        lat: 15.2993,
        lng: 74.1240,
        risk: "safe",
        riskLabel: "Generally Safe — Swim with Caution",
        riskLabel_hi: "आम तौर पर सुरक्षित — सावधानी से तैरें",
        description: "Popular tourist destination with generally good safety. Some drowning incidents during monsoon. Drug-related scams exist.",
        description_hi: "लोकप्रिय पर्यटन स्थल जो आम तौर पर सुरक्षित है। मानसून के दौरान कुछ डूबने की घटनाएं।",
        advisory: "Swim only at guarded beaches. Beware of drug offers. Use licensed water sports operators.",
        advisory_hi: "केवल सुरक्षित समुद्र तटों पर तैरें। नशे के प्रस्तावों से सावधान रहें। लाइसेंस प्राप्त जल खेल संचालकों का उपयोग करें।",
        radius: 15000
    },
{
        name: "Kerala Backwaters & Hill Stations",
        name_hi: "केरल बैकवाटर और हिल स्टेशन",
        lat: 10.8505,
        lng: 76.2711,
        risk: "safe",
        riskLabel: "Safe — Monsoon Caution",
        riskLabel_hi: "सुरक्षित — मानसून सावधानी",
        description: "One of India's safest tourist states. Beautiful backwaters and hill stations. Occasional landslides in Western Ghats during heavy rain.",
        description_hi: "भारत के सबसे सुरक्षित पर्यटन राज्यों में से एक। भव्य बैकवाटर और हिल स्टेशन।",
        advisory: "Avoid houseboat travel during heavy monsoon. Check road conditions for hill stations.",
        advisory_hi: "भारी मानसून के दौरान हाउसबोट यात्रा से बचें। हिल स्टेशनों के लिए सड़क स्थिति जांचें।",
        radius: 19500
    },
{
        name: "Sundarbans Delta",
        name_hi: "सुंदरवन डेल्टा",
        lat: 21.9497,
        lng: 89.1833,
        risk: "natural",
        riskLabel: "Cyclone & Tidal Flood Zone",
        riskLabel_hi: "चक्रवात और ज्वारीय बाढ़ क्षेत्र",
        description: "World's largest mangrove delta. Extremely vulnerable to cyclones (Oct-Nov). Tidal surges can inundate low-lying areas within hours.",
        description_hi: "दुनिया का सबसे बड़ा मैंग्रोव डेल्टा। चक्रवातों के प्रति अत्यंत संवेदनशील (अक्टूबर-नवंबर)। ज्वारीय लहरें कुछ ही घंटों में निचले इलाकों में जलमग्न हो सकती हैं।",
        advisory: "Never visit during cyclone warnings. Stay on designated evacuation routes. Carry life jackets in boat tours.",
        advisory_hi: "चक्रवात चेतावनी के दौरान कभी न जाएं। निर्धारित निकासी मार्गों पर रहें। बोट टूर में लाइफ जैकेट पहनें।",
        radius: 22750
    },
{
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
        radius: 42250
    },
{
        name: "Nepal Border Belt",
        name_hi: "नेपाल सीमा बेल्ट",
        lat: 27.1751,
        lng: 78.0421,
        risk: "moderate",
        riskLabel: "Seismic Risk & Cross-border Issues",
        riskLabel_hi: "भूकंपीय जोखिम और सीमा पार मुद्दे",
        description: "Uttarakhand-UP-Nepal border in Seismic Zone IV-V. 2015 Nepal earthquake devastated this region. Unregulated border crossings pose safety risks.",
        description_hi: "उत्तराखंड-UP-नेपाल सीमा भूकंपीय क्षेत्र IV-V में। 2015 नेपाल भूकंप ने इस क्षेत्र को तबाह कर दिया।",
        advisory: "Stay away from old/unreinforced buildings. Know earthquake drop-cover-hold. Use only official border crossings.",
        advisory_hi: "पुरानी/असुरक्षित इमारतों से दूर रहें। भूकंप सुरक्षा जानें। केवल आधिकारिक सीमा पार प्रवेश का उपयोग करें।",
        radius: 32500
    },
{
        name: "Chhattisgarh Naxal Belt",
        name_hi: "छत्तीसगढ़ नक्सल बेल्ट",
        lat: 19.0745, lng: 81.0110, risk: "high",
        riskLabel: "Naxal-Maoist Insurgency", riskLabel_hi: "नक्सल-माओवादी विद्रोह",
        description: "Bastar, Dantewada, Sukma, and Bijapur districts are active Naxal zones. IEDs and ambushes reported. Travel restricted without permission.",
        description_hi: "बस्तर, दंतेवाड़ा, सुकमा और बीजापुर जिले सक्रिय नक्सल क्षेत्र हैं। आईईडी और घात लगाकर हमलों की सूचना।",
        advisory: "Do not travel to Bastar division without district collector permission. Avoid forest routes.",
        advisory_hi: "जिला कलेक्टर की अनुमति के बिना बस्तर प्रभाग में यात्रा न करें। वन मार्गों से बचें।",
        radius: 39000
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
        radius: 32500
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
        radius: 29250
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
        radius: 26000
    },
{
        name: "Assam Flood Zone",
        name_hi: "असम बाढ़ क्षेत्र",
        lat: 26.2006, lng: 92.9376, risk: "natural",
        riskLabel: "Annual Devastating Floods", riskLabel_hi: "वार्षिक विनाशकारी बाढ़",
        description: "Brahmaputra and Barak valleys flood annually. Kaziranga National Park submerges. 2020 floods affected 5.5 million people. Riverbank erosion displaces millions. Elephant-human conflict.",
        description_hi: "ब्रह्मपुत्र और बराक घाटी सालाना बाढ़ से प्रभावित। काजीरंगा जलमग्न।",
        advisory: "Avoid Kaziranga during monsoon. Don't cross flooded roads.",
        advisory_hi: "मानसून के दौरान काजीरंगा से बचें। बाढ़ वाली सड़कों को पार न करें।",
        radius: 32500
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
        radius: 22750
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
        radius: 19500
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
        radius: 16250
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
        radius: 19500
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
        radius: 15000
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
        radius: 29250
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
        radius: 22750
    },

    {
        name: "Delhi NCR",
        name_hi: "दिल्ली NCR",
        lat: 28.6139, lng: 77.209,
        risk: "moderate",
        riskLabel: "Air Pollution, Heatwave & Petty Crime",
        riskLabel_hi: "वायु प्रदूषण, लू और छोटी अपराध",
        description: "Severe air pollution Nov-Feb (AQI 400+). Summer heatwave Apr-Jun (45-48°C). Tourist scams at monuments. Pickpocketing in crowded areas. Seismic Zone IV.",
        description_hi: "नवंबर-फरवरी में गंभीर वायु प्रदूषण। ग्रीष्मकालीन लू। स्मारकों पर धोखाधड़ी। भूकंपीय क्षेत्र IV।",
        advisory: "Wear N95 masks in winter. Avoid outdoor activity 11AM-4PM in summer. Keep valuables secure.",
        advisory_hi: "सर्दियों में N95 मास्क पहनें। ग्रीष्म में दोपहर 11-4 बजे बाहरी गतिविधि से बचें।",
        radius: 30000
    },
    {
        name: "Uttar Pradesh Flood Plains",
        name_hi: "उत्तर प्रदेश बाढ़ मैदान",
        lat: 26.8467, lng: 80.9462,
        risk: "natural",
        riskLabel: "Annual Flooding & Extreme Heat",
        riskLabel_hi: "वार्षिक बाढ़ और अत्यधिक गर्मी",
        description: "Ganga and Yamuna flood plains. Extreme heatwave May-Jun (48°C+). Encephalitis outbreaks in eastern UP. Poor air quality in winter.",
        description_hi: "गंगा और यमुना बाढ़ मैदान। अत्यधिक गर्मी मई-जून। पूर्वी UP में दिमागी बुखार।",
        advisory: "Avoid flood-prone areas during monsoon. Drink plenty of water in summer. Use mosquito repellent.",
        advisory_hi: "मानसून में बाढ़ प्रवण क्षेत्रों से बचें। ग्रीष्म में खूब पानी पिएं। मच्छर भगाने वाला उपयोग करें।",
        radius: 40000
    },
    {
        name: "Haryana & Punjab Heatwave",
        name_hi: "हरियाणा और पंजाब लू",
        lat: 29.0588, lng: 76.0856,
        risk: "moderate",
        riskLabel: "Extreme Heatwave & Stubble Burning",
        riskLabel_hi: "अत्यधिक लू और पराली जलाना",
        description: "Temperatures exceed 47°C May-Jun. Severe air pollution Oct-Nov from stubble burning. Hailstorms in spring.",
        description_hi: "मई-जून में तापमान 47°C से अधिक। पराली जलाने से अक्टूबर-नवंबर में गंभीर प्रदूषण।",
        advisory: "Avoid outdoor exposure 11AM-4PM in summer. Wear masks Oct-Nov. Stay hydrated.",
        advisory_hi: "ग्रीष्म में दोपहर 11-4 बजे बाहर न जाएं। अक्टूबर-नवंबर में मास्क पहनें।",
        radius: 35000
    },
    {
        name: "Himachal Pradesh Snowfall Zone",
        name_hi: "हिमाचल प्रदेश बर्फबारी क्षेत्र",
        lat: 32.08, lng: 77.05,
        risk: "natural",
        riskLabel: "Heavy Snowfall & Road Blockades",
        riskLabel_hi: "भारी बर्फबारी और सड़क अवरोध",
        description: "Rohtang Pass, Keylong, and high-altitude areas receive heavy snowfall Oct-Mar. Roads close for months. Avalanches possible.",
        description_hi: "रोहतांग पास, केलांग और ऊंचाई वाले क्षेत्रों में अक्टूबर-मार्च में भारी बर्फबारी। महीनों सड़कें बंद।",
        advisory: "Carry snow chains. Check road status. Avoid high passes Nov-Mar. Keep emergency food and warm clothing.",
        advisory_hi: "बर्फ श्रृंखला ले जाएं। सड़क स्थिति जांचें। नवंबर-मार्च में ऊंचे पास से बचें।",
        radius: 30000
    },
    {
        name: "Madhya Pradesh & Tribal Belt",
        name_hi: "मध्य प्रदेश और आदिवासी बेल्ट",
        lat: 22.9734, lng: 78.6569,
        risk: "moderate",
        riskLabel: "Naxal Activity, Flooding & Extreme Heat",
        riskLabel_hi: "नक्सल गतिविधि, बाढ़ और अत्यधिक गर्मी",
        description: "Mandla, Dindori, Balaghat districts have Naxal presence. Narmada and Chambal flood annually. Summer temperatures reach 47°C.",
        description_hi: "मंडला, दिंडोरी, बालाघाट जिलों में नक्सल उपस्थिति। नर्मदा और चंबल सालाना बाढ़।",
        advisory: "Avoid forest routes in tribal districts. Don't cross flooded rivers. Carry water in summer.",
        advisory_hi: "आदिवासी जिलों में वन मार्गों से बचें। बाढ़ वाली नदियों को पार न करें।",
        radius: 40000
    },
    {
        name: "Gujarat Industrial & Coastal Zone",
        name_hi: "गुजरात औद्योगिक और तटीय क्षेत्र",
        lat: 22.3072, lng: 72.137,
        risk: "moderate",
        riskLabel: "Industrial Hazards, Cyclone & Flooding",
        riskLabel_hi: "औद्योगिक खतरे, चक्रवात और बाढ़",
        description: "Vadodara, Ankleshwar industrial belt — chemical accident risk. Surat faces annual flooding. Cyclone risk along Saurashtra coast.",
        description_hi: "वडोदरा, अंकलेश्वर औद्योगिक बेल्ट — रासायनिक दुर्घटना जोखिम। सूरत में सालाना बाढ़।",
        advisory: "Follow industrial safety signs. Monitor cyclone warnings. Evacuate during floods.",
        advisory_hi: "औद्योगिक सुरक्षा संकेतों का पालन करें। चक्रवात चेतावनी की निगरानी करें।",
        radius: 35000
    },
    {
        name: "West Bengal & Kolkata Urban",
        name_hi: "पश्चिम बंगाल और कोलकाता शहरी",
        lat: 22.5726, lng: 88.3639,
        risk: "natural",
        riskLabel: "Cyclone, Urban Flooding & Nor'westers",
        riskLabel_hi: "चक्रवात, शहरी बाढ़ और नर्थवेस्टर",
        description: "Kolkata faces severe urban waterlogging. Cyclones from Bay of Bengal (May-Jun, Oct-Nov). Kalbaisakhi storms cause sudden damage.",
        description_hi: "कोलकाता में गंभीर शहरी जलभराव। बंगाल की खाड़ी से चक्रवात। कालबैसाखी तूफान।",
        advisory: "Avoid low-lying areas during monsoon. Monitor cyclone alerts. Stay indoors during Kalbaisakhi.",
        advisory_hi: "मानसून में निचले इलाकों से बचें। चक्रवात अलर्ट की निगरानी करें।",
        radius: 30000
    },
    {
        name: "Odisha Coastal & Tribal Belt",
        name_hi: "ओडिशा तटीय और आदिवासी बेल्ट",
        lat: 19.8135, lng: 85.8312,
        risk: "natural",
        riskLabel: "Super Cyclone & Tribal Maoist Zone",
        riskLabel_hi: "सुपर चक्रवात और आदिवासी माओवादी क्षेत्र",
        description: "Malkangiri, Koraput, Rayagada have Maoist presence. Coast hit by super cyclones. KBK region faces severe drought and malnutrition.",
        description_hi: "मलकानगिरी, कोरापुट, रायगड़ा में माओवादी उपस्थिति। तट पर सुपर चक्रवात।",
        advisory: "Obtain permission for tribal areas. Monitor cyclone warnings. Carry emergency supplies in KBK region.",
        advisory_hi: "आदिवासी क्षेत्रों के लिए अनुमति लें। चक्रवात चेतावनी की निगरानी करें।",
        radius: 40000
    },
    {
        name: "Sikkim & Darjeeling",
        name_hi: "सिक्किम और दार्जिलिंग",
        lat: 27.3389, lng: 88.6065,
        risk: "natural",
        riskLabel: "Landslides, Earthquake & GLOF",
        riskLabel_hi: "भूस्खलन, भूकंप और हिमनद झील विस्फोट",
        description: "Annual landslides block NH10. Seismic Zone IV-V. Glacial lake outburst floods in Sikkim. Tea estate landslides during monsoon.",
        description_hi: "सालाना भूस्खलन NH10 अवरुद्ध। भूकंपीय क्षेत्र IV-V। सिक्किम में हिमनद झील विस्फोट।",
        advisory: "Check road status. Avoid monsoon trekking. Know earthquake safety drills.",
        advisory_hi: "सड़क स्थिति जांचें। मानसून ट्रेकिंग से बचें। भूकंप सुरक्षा जानें।",
        radius: 35000
    },
    {
        name: "Karnataka Flood & Urban Zone",
        name_hi: "कर्नाटक बाढ़ और शहरी क्षेत्र",
        lat: 12.9716, lng: 77.5946,
        risk: "natural",
        riskLabel: "Urban Flooding & Western Ghats Landslides",
        riskLabel_hi: "शहरी बाढ़ और पश्चिमी घाट भूस्खलन",
        description: "Bangalore faces severe waterlogging during monsoon. Belgaum, Hubli flood annually. Western Ghats landslides in Kodagu and Chikmagalur.",
        description_hi: "बेंगलुरु में मानसून में गंभीर जलभराव। बेलगाम, हुबली में सालाना बाढ़।",
        advisory: "Avoid low-lying areas in Bangalore during rain. Check road conditions for Western Ghats travel.",
        advisory_hi: "बारिश के दौरान बेंगलुरु के निचले इलाकों से बचें। पश्चिमी घाट यात्रा के लिए सड़क स्थिति जांचें।",
        radius: 30000
    },
    {
        name: "Andhra Pradesh & Telangana Flood Zone",
        name_hi: "आंध्र प्रदेश और तेलंगाना बाढ़ क्षेत्र",
        lat: 16.5062, lng: 78.648,
        risk: "natural",
        riskLabel: "Cyclone, Flood & Urban Waterlogging",
        riskLabel_hi: "चक्रवात, बाढ़ और शहरी जलभराव",
        description: "Visakhapatnam, Machilipatnam cyclone-prone. Hyderabad faces urban flooding. Godavari and Krishna rivers flood annually.",
        description_hi: "विशाखापत्तनम, मचिलीपट्नम चक्रवात-प्रवण। हैदराबाद में शहरी बाढ़।",
        advisory: "Monitor IMD alerts. Evacuate coastal areas during cyclone. Avoid riverbanks during monsoon.",
        advisory_hi: "IMD अलर्ट की निगरानी करें। चक्रवात में तटीय क्षेत्र खाली करें।",
        radius: 35000
    },
    {
        name: "Tamil Nadu Interior & Nilgiris",
        name_hi: "तमिलनाडु अंतर्देशीय और नीलगिरी",
        lat: 11.4074, lng: 76.696,
        risk: "natural",
        riskLabel: "Landslides, Wild Animals & Heat",
        riskLabel_hi: "भूस्खलन, जंगली जानवर और गर्मी",
        description: "Nilgiris and Coimbatore face landslides during monsoon. Wild elephant attacks on forest roads. Interior Tamil Nadu experiences extreme heat.",
        description_hi: "नीलगिरी और कोयंबत्तूर में मानसून में भूस्खलन। जंगली हाथी हमले।",
        advisory: "Avoid forest roads at dawn/dusk. Don't stop near elephant corridors. Carry water in summer.",
        advisory_hi: "सुबह/शाम वन सड़कों से बचें। हाथी गलियारों के पास न रुकें।",
        radius: 25000
    },
    {
        name: "Lakshadweep Islands",
        name_hi: "लक्षद्वीप द्वीपसमूह",
        lat: 10.5667, lng: 72.6417,
        risk: "natural",
        riskLabel: "Sea Level Rise & Cyclone Risk",
        riskLabel_hi: "समुद्र स्तर वृद्धि और चक्रवात जोखिम",
        description: "Low-lying islands vulnerable to sea level rise and coastal erosion. Cyclone risk Oct-Dec. Limited freshwater. Restricted access for tourists.",
        description_hi: "निचले द्वीप समुद्र स्तर वृद्धि और तटीय कटाव के प्रति संवेदनशील।",
        advisory: "Follow island regulations. Monitor cyclone warnings. Respect restricted areas.",
        advisory_hi: "द्वीप नियमों का पालन करें। चक्रवात चेतावनी की निगरानी करें।",
        radius: 20000
    },
    {
        name: "Mizoram, Tripura & Barak Valley",
        name_hi: "मिजोरम, त्रिपुरा और बराक घाटी",
        lat: 23.1648, lng: 92.9376,
        risk: "natural",
        riskLabel: "High Seismic Zone V & Landslides",
        riskLabel_hi: "उच्च भूकंपीय क्षेत्र V और भूस्खलन",
        description: "Both states in India's highest seismic zone. 2021 Mizoram earthquake 6.1 magnitude. Landslides during monsoon. Myanmar border porous.",
        description_hi: "दोनों राज्य भारत के सर्वोच्च भूकंपीय जोखिम क्षेत्र में। 2021 मिजोरम भूकंप।",
        advisory: "Know earthquake safety. Avoid old buildings. Get permits for border areas.",
        advisory_hi: "भूकंप सुरक्षा जानें। पुरानी इमारतों से बचें। सीमा क्षेत्रों के लिए परमिट लें।",
        radius: 35000
    },
    {
        name: "Arunachal Pradesh Border",
        name_hi: "अरुणाचल प्रदेश सीमा",
        lat: 27.1044, lng: 93.692,
        risk: "moderate",
        riskLabel: "China Border Tension & Insurgency",
        riskLabel_hi: "चीन सीमा तनाव और उग्रवाद",
        description: "Active Line of Actual Control with China. Inner Line Permit required. Arunachal faces earthquake risk. Remote areas with limited connectivity.",
        description_hi: "चीन के साथ सक्रिय वास्तविक नियंत्रण रेखा। आंतरिक रेखा परमिट आवश्यक।",
        advisory: "Obtain Inner Line Permit. Don't approach LAC. Carry satellite communicator in remote areas.",
        advisory_hi: "आंतरिक रेखा परमिट प्राप्त करें। LAC के पास न जाएं। दूरदराज में सैटेलाइट संचारक ले जाएं।",
        radius: 40000
    },
    {
        name: "Andaman & Nicobar Deep Islands",
        name_hi: "अंडमान और निकोबार दीप क्षेत्र",
        lat: 8.5, lng: 93.0,
        risk: "natural",
        riskLabel: "Restricted Tribal Zones & Tsunami Risk",
        riskLabel_hi: "प्रतिबंधित आदिवासी क्षेत्र और सुनामी जोखिम",
        description: "Sentinel Island and other tribal areas — entering is illegal and life-threatening. Active seismic zone. Restricted Area Permit needed.",
        description_hi: "सेंटिनल द्वीप और अन्य आदिवासी क्षेत्र — प्रवेश गैरकानूनी और जानलेवा।",
        advisory: "Never approach restricted tribal islands. Carry emergency supplies. Follow tsunami warning signals.",
        advisory_hi: "प्रतिबंधित आदिवासी द्वीपों के पास कभी न जाएं। आपातकालीन आपूर्ति ले जाएं।",
        radius: 50000
    },
    {
        name: "Chhattisgarh & Odisha Naxal Corridor",
        name_hi: "छत्तीसगढ़ और ओडिशा नक्सल कॉरिडोर",
        lat: 18.5204, lng: 81.5,
        risk: "high",
        riskLabel: "Naxal-Maoist Insurgency & IED Risk",
        riskLabel_hi: "नक्सल-माओवादी विद्रोह और IED जोखिम",
        description: "Combined Chhattisgarh-Odisha Naxal corridor. Bastar, Malkangiri, Koraput are active conflict zones. IED attacks on roads.",
        description_hi: "छत्तीसगढ़-ओडिशा नक्सल कॉरिडोर। बस्तर, मलकानगिरी, कोरापुट सक्रिय संघर्ष क्षेत्र।",
        advisory: "Do not travel without district collector permission. Avoid forest routes. Travel in convoy.",
        advisory_hi: "जिला कलेक्टर की अनुमति के बिना यात्रा न करें। वन मार्गों से बचें।",
        radius: 45000
    },
    {
        name: "Rajasthan Thar Desert Interior",
        name_hi: "राजस्थान थार मरुस्थल अंतर्देशीय",
        lat: 24.5854, lng: 70.8597,
        risk: "moderate",
        riskLabel: "Extreme Heat, Dehydration & Sandstorms",
        riskLabel_hi: "अत्यधिक गर्मी, निर्जलीकरण और रेत तूफान",
        description: "Deep desert areas with temperatures exceeding 50°C. Zero mobile network. No water sources for 50+ km stretches. Sandstorms common Mar-Jun.",
        description_hi: "गहरे मरुस्थल क्षेत्र जहां तापमान 50°C से अधिक। कोई मोबाइल नेटवर्क। 50+ किमी तक पानी नहीं।",
        advisory: "Never venture deep desert alone. Carry 6+ liters water. Use satellite communicator. Travel with experienced guide.",
        advisory_hi: "अकेले गहरे मरुस्थल में न जाएं। 6+ लीटर पानी ले जाएं। सैटेलाइट संचारक ले जाएं।",
        radius: 40000
    },
    {
        name: "Uttarakhand Char Dham & High Altitude",
        name_hi: "उत्तराखंड चार धाम और ऊंचाई क्षेत्र",
        lat: 31.0661, lng: 78.5,
        risk: "natural",
        riskLabel: "High Altitude Sickness & Extreme Weather",
        riskLabel_hi: "ऊंचाई बीमारी और चरम मौसम",
        description: "Badrinath, Yamunotri, Gangotri at 10,000-15,000 ft. Severe altitude sickness risk. Roads close Oct-May. Extreme weather changes rapidly.",
        description_hi: "बद्रीनाथ, यमुनोत्री, गंगोत्री 10,000-15,000 फीट पर। गंभीर ऊंचाई बीमारी।",
        advisory: "Acclimatize properly. Carry Diamox. Don't trek alone. Check weather before departure.",
        advisory_hi: "ठीक से ऊंचाई के अनुकूल हों। Diamox ले जाएं। अकेले ट्रेक न करें।",
        radius: 35000
    },
    {
        name: "Jammu & Pir Panjal Range",
        name_hi: "जम्मू और पीर पंजाल रेंज",
        lat: 32.7266, lng: 74.857,
        risk: "moderate",
        riskLabel: "Landslides, Heavy Snowfall & Border Tension",
        riskLabel_hi: "भूस्खलन, भारी बर्फबारी और सीमा तनाव",
        description: "Pir Panjal range faces heavy snowfall and landslides. Vaishno Devi pilgrimage route can be treacherous. Border areas near Pakistan have security risks.",
        description_hi: "पीर पंजाल रेंज में भारी बर्फबारी और भूस्खलन। वैष्णो देवी तीर्थ मार्ग खतरनाक।",
        advisory: "Check Vaishno Devi track status. Carry warm clothing. Avoid border areas.",
        advisory_hi: "वैष्णो देवी ट्रैक स्थिति जांचें। गर्म कपड़े ले जाएं। सीमा क्षेत्रों से बचें।",
        radius: 30000
    },
    {
        name: "Himachal Kinnaur & Lahaul-Spiti",
        name_hi: "हिमाचल किन्नौर और लाहौल-स्पिति",
        lat: 32.5, lng: 78.0,
        risk: "moderate",
        riskLabel: "Extreme Isolation, Landslides & Cold",
        riskLabel_hi: "अत्यधिक एकांत, भूस्खलन और ठंड",
        description: "Roads close for months Oct-Jun. No ATMs, limited mobile. 2023 Himachal floods killed 400+. Kinnaur landslide cut off 50+ villages.",
        description_hi: "अक्टूबर-जून में महीनों सड़कें बंद। कोई ATM, सीमित मोबाइल। 2023 हिमाचल बाढ़।",
        advisory: "Carry cash and satellite communicator. Acclimatize properly. Travel with experienced guide.",
        advisory_hi: "नकद और सैटेलाइट संचारक ले जाएं। ठीक से ऊंचाई के अनुकूल हों।",
        radius: 35000
    },
];

// ==================== SAMPLE NEARBY PLACES ====================
const samplePlaces = [
    // ── DELHI ──
    { name: "AIIMS Delhi", type: "hospital", city: "delhi", lat: 28.5672, lng: 77.2100, address: "Sri Aurobindo Marg, New Delhi", phone: "011-26588500", rating: 4.5, reviews: 12400, budget: "Free/Subsidized", img: "🏥" },
    { name: "Safdarjung Hospital", type: "hospital", city: "delhi", lat: 28.5690, lng: 77.2060, address: "Ansari Nagar, New Delhi", phone: "011-26707348", rating: 4.2, reviews: 8900, budget: "Free/Subsidized", img: "🏥" },
    { name: "Max Hospital Saket", type: "hospital", city: "delhi", lat: 28.5244, lng: 77.2066, address: "1 Press Enclave Road, Saket, New Delhi", phone: "011-26515050", rating: 4.3, reviews: 6200, budget: "Premium (5K-15K)", img: "🏥" },
    { name: "Connaught Place Police Station", type: "police", city: "delhi", lat: 28.6315, lng: 77.2167, address: "Connaught Place, New Delhi", phone: "011-23365248", rating: 3.8, reviews: 1200, budget: "Free", img: "🚔" },
    { name: "Railway Protection Force", type: "police", city: "delhi", lat: 28.6448, lng: 77.2167, address: "New Delhi Railway Station", phone: "011-23345678", rating: 3.6, reviews: 800, budget: "Free", img: "🚔" },
    { name: "Hauz Khas Police Station", type: "police", city: "delhi", lat: 28.5494, lng: 77.2001, address: "Hauz Khas Village, New Delhi", phone: "011-26853322", rating: 3.9, reviews: 650, budget: "Free", img: "🚔" },
    { name: "The Leela Palace Delhi", type: "hotel", city: "delhi", lat: 28.5720, lng: 77.1688, address: "Diplomatic Enclave, Chanakyapuri, New Delhi", phone: "011-39333333", rating: 4.7, reviews: 4500, budget: "Luxury (15K+)", img: "🏨" },
    { name: "The Oberoi New Delhi", type: "hotel", city: "delhi", lat: 28.6045, lng: 77.2180, address: "Dr Zakir Hussain Marg, New Delhi", phone: "011-24363030", rating: 4.8, reviews: 5200, budget: "Luxury (15K+)", img: "🏨" },
    { name: "Hotel Janpath", type: "hotel", city: "delhi", lat: 28.6225, lng: 77.2130, address: "Janpath, Connaught Place, New Delhi", phone: "011-23341122", rating: 3.4, reviews: 1800, budget: "Budget (<2K)", img: "🏨" },
    { name: "Karim's Restaurant", type: "restaurant", city: "delhi", lat: 28.6507, lng: 77.2334, address: "16, Gali Kababian, Jama Masjid, Delhi", phone: "011-23269880", rating: 4.4, reviews: 15000, budget: "Moderate (2K-5K)", img: "🍽️" },
    { name: "Bukhara, ITC Maurya", type: "restaurant", city: "delhi", lat: 28.5987, lng: 77.1680, address: "Sardar Patel Marg, Delhi", phone: "011-26112233", rating: 4.6, reviews: 8200, budget: "Premium (5K-15K)", img: "🍽️" },
    { name: "Saravana Bhavan CP", type: "restaurant", city: "delhi", lat: 28.6305, lng: 77.2182, address: "A Block, Connaught Place, New Delhi", phone: "011-43501234", rating: 4.1, reviews: 5600, budget: "Moderate (2K-5K)", img: "🍽️" },

    // ── MUMBAI ──
    { name: "Breach Candy Hospital", type: "hospital", city: "mumbai", lat: 18.9747, lng: 72.7956, address: "60A, Bhulabhai Desai Road, Mumbai", phone: "022-23671818", rating: 4.3, reviews: 5100, budget: "Premium (5K-15K)", img: "🏥" },
    { name: "KEM Hospital Mumbai", type: "hospital", city: "mumbai", lat: 19.0108, lng: 72.8456, address: "Parel, Mumbai, Maharashtra", phone: "022-24107000", rating: 4.1, reviews: 9800, budget: "Free/Subsidized", img: "🏥" },
    { name: "Bandra Police Station", type: "police", city: "mumbai", lat: 19.0544, lng: 72.8378, address: "Bandra West, Mumbai", phone: "022-26422957", rating: 3.7, reviews: 750, budget: "Free", img: "🚔" },
    { name: "Marine Drive Police Station", type: "police", city: "mumbai", lat: 18.9437, lng: 72.8234, address: 'J.N. Road, Near CCS, Mumbai', phone: "022-22833333", rating: 3.8, reviews: 580, budget: "Free", img: "🚔" },
    { name: "Taj Mahal Palace Hotel", type: "hotel", city: "mumbai", lat: 18.9220, lng: 72.8347, address: "Apollo Bunder, Mumbai", phone: "022-66653366", rating: 4.7, reviews: 11000, budget: "Luxury (15K+)", img: "🏨" },
    { name: "The Oberoi Mumbai", type: "hotel", city: "mumbai", lat: 18.9269, lng: 72.8228, address: "Nariman Point, Mumbai", phone: "022-66325757", rating: 4.6, reviews: 7800, budget: "Luxury (15K+)", img: "🏨" },
    { name: "Trident Nariman Point", type: "hotel", city: "mumbai", lat: 18.9318, lng: 72.8175, address: "Nariman Point, Mumbai", phone: "022-66324343", rating: 4.5, reviews: 6200, budget: "Premium (5K-15K)", img: "🏨" },
    { name: "Leopold Cafe", type: "restaurant", city: "mumbai", lat: 18.9241, lng: 72.8324, address: "Colaba Causeway, Colaba, Mumbai", phone: "022-22020175", rating: 4.2, reviews: 9500, budget: "Moderate (2K-5K)", img: "🍽️" },
    { name: "Trishna Restaurant", type: "restaurant", city: "mumbai", lat: 18.9237, lng: 72.8312, address: "17, Kala Ghoda, Fort, Mumbai", phone: "022-22020935", rating: 4.4, reviews: 4200, budget: "Moderate (2K-5K)", img: "🍽️" },
    { name: "Britannia & Co.", type: "restaurant", city: "mumbai", lat: 18.9329, lng: 72.8362, address: "4, Ballard Estate, Fort, Mumbai", phone: "022-22614164", rating: 4.5, reviews: 3800, budget: "Budget (<2K)", img: "🍽️" },

    // ── BANGALORE ──
    { name: "Narayana Health City", type: "hospital", city: "bangalore", lat: 12.9063, lng: 77.5658, address: "258/A Bommasandra Industrial Area, Bangalore", phone: "080-71222222", rating: 4.4, reviews: 7800, budget: "Moderate (2K-5K)", img: "🏥" },
    { name: "Manipal Hospital Whitefield", type: "hospital", city: "bangalore", lat: 12.9956, lng: 77.7523, address: "#143, 203, Whitefield Main Road, Bangalore", phone: "080-49170000", rating: 4.3, reviews: 5400, budget: "Premium (5K-15K)", img: "🏥" },
    { name: "Koramangala Police Station", type: "police", city: "bangalore", lat: 12.9352, lng: 77.6245, address: "Koramangala, Bangalore", phone: "080-25534444", rating: 3.9, reviews: 1100, budget: "Free", img: "🚔" },
    { name: "Whitefield Police Station", type: "police", city: "bangalore", lat: 12.9698, lng: 77.7500, address: "Whitefield, Bangalore", phone: "080-28452042", rating: 3.7, reviews: 620, budget: "Free", img: "🚔" },
    { name: "Leela Palace Bangalore", type: "hotel", city: "bangalore", lat: 12.9987, lng: 77.5862, address: "23, Old Airport Road, Bangalore", phone: "080-39795399", rating: 4.7, reviews: 5600, budget: "Luxury (15K+)", img: "🏨" },
    { name: "The Oberoi Bangalore", type: "hotel", city: "bangalore", lat: 12.9716, lng: 77.5946, address: "37-39, Mahatma Gandhi Road, Bangalore", phone: "080-25585858", rating: 4.6, reviews: 4800, budget: "Luxury (15K+)", img: "🏨" },
    { name: "Royal Orchid Central", type: "hotel", city: "bangalore", lat: 12.9784, lng: 77.6408, address: "#1, Infantry Road, Bangalore", phone: "080-42427777", rating: 4.0, reviews: 2200, budget: "Moderate (2K-5K)", img: "🏨" },
    { name: "Mavalli Tiffin Room", type: "restaurant", city: "bangalore", lat: 12.9520, lng: 77.5740, address: "14, Lalbagh Road, Bangalore", phone: "080-22224488", rating: 4.3, reviews: 7200, budget: "Budget (<2K)", img: "🍽️" },
    { name: "Vidyarthi Bhavan", type: "restaurant", city: "bangalore", lat: 12.9846, lng: 77.5722, address: "39, Seshadri Road, Bangalore", phone: "080-26677588", rating: 4.5, reviews: 11000, budget: "Budget (<2K)", img: "🍽️" },
    { name: "Meghana Foods", type: "restaurant", city: "bangalore", lat: 12.9592, lng: 77.6474, address: "12, Residency Road, Bangalore", phone: "080-42065197", rating: 4.2, reviews: 5800, budget: "Moderate (2K-5K)", img: "🍽️" },

    // ── CHENNAI ──
    { name: "Apollo Hospital Chennai", type: "hospital", city: "chennai", lat: 13.0102, lng: 80.2565, address: "21, Greams Road, Chennai", phone: "044-28298282", rating: 4.5, reviews: 10200, budget: "Premium (5K-15K)", img: "🏥" },
    { name: "Government General Hospital", type: "hospital", city: "chennai", lat: 13.0827, lng: 80.2758, address: "EVR Periyar Salai, Chennai", phone: "044-25305010", rating: 3.9, reviews: 6500, budget: "Free/Subsidized", img: "🏥" },
    { name: "SSC Railway Police", type: "police", city: "chennai", lat: 13.0796, lng: 80.2755, address: "Chennai Central Station", phone: "044-25330704", rating: 3.7, reviews: 480, budget: "Free", img: "🚔" },
    { name: "T Nagar Police Station", type: "police", city: "chennai", lat: 13.0405, lng: 80.2343, address: "T Nagar, Chennai", phone: "044-24345234", rating: 3.8, reviews: 390, budget: "Free", img: "🚔" },
    { name: "Taj Fisherman's Cove", type: "hotel", city: "chennai", lat: 12.7855, lng: 80.2525, address: "Covelong Beach, Chennai", phone: "044-67413333", rating: 4.5, reviews: 4100, budget: "Luxury (15K+)", img: "🏨" },
    { name: "The Leela Palace Chennai", type: "hotel", city: "chennai", lat: 12.9940, lng: 80.2464, address: "Adyar, Chennai", phone: "044-30113011", rating: 4.6, reviews: 3600, budget: "Luxury (15K+)", img: "🏨" },
    { name: "Hotel Savera", type: "hotel", city: "chennai", lat: 13.0515, lng: 80.2530, address: "146, Dr Radhakrishnan Salai, Chennai", phone: "044-28113011", rating: 3.8, reviews: 1900, budget: "Moderate (2K-5K)", img: "🏨" },
    { name: "Saravana Bhavan", type: "restaurant", city: "chennai", lat: 13.0569, lng: 80.2505, address: "No. 22, Govindan Street, Chennai", phone: "044-24320098", rating: 4.3, reviews: 8500, budget: "Budget (<2K)", img: "🍽️" },
    { name: "Annalakshmi", type: "restaurant", city: "chennai", lat: 13.0604, lng: 80.2530, address: "6, GST Road, Chennai", phone: "044-23456789", rating: 4.2, reviews: 3200, budget: "Budget (<2K)", img: "🍽️" },
    { name: "Dosai", type: "restaurant", city: "chennai", lat: 12.9868, lng: 80.2450, address: "36, LB Road, Adyar, Chennai", phone: "044-24456789", rating: 4.4, reviews: 2800, budget: "Budget (<2K)", img: "🍽️" },

    // ── KOLKATA ──
    { name: "Belle Vue Clinic", type: "hospital", city: "kolkata", lat: 22.5352, lng: 88.3639, address: "1, Play Park Street, Kolkata", phone: "033-22237592", rating: 4.2, reviews: 4600, budget: "Premium (5K-15K)", img: "🏥" },
    { name: "CMRI Hospital Kolkata", type: "hospital", city: "kolkata", lat: 22.5294, lng: 88.3610, address: "234/1, AJC Bose Road, Kolkata", phone: "033-24567890", rating: 4.3, reviews: 3800, budget: "Premium (5K-15K)", img: "🏥" },
    { name: "Park Street Police Station", type: "police", city: "kolkata", lat: 22.5505, lng: 88.3510, address: "Park Street, Kolkata", phone: "033-22250424", rating: 3.8, reviews: 620, budget: "Free", img: "🚔" },
    { name: "Loudon Street Police Station", type: "police", city: "kolkata", lat: 22.5420, lng: 88.3575, address: "Loudon Street, Kolkata", phone: "033-22882563", rating: 3.6, reviews: 380, budget: "Free", img: "🚔" },
    { name: "ITC Sonar Kolkata", type: "hotel", city: "kolkata", lat: 22.5226, lng: 88.4081, address: "JBS Haldane Avenue, Kolkata", phone: "033-23454545", rating: 4.5, reviews: 4200, budget: "Luxury (15K+)", img: "🏨" },
    { name: "Taj Bengal Kolkata", type: "hotel", city: "kolkata", lat: 22.5363, lng: 88.3614, address: "36, Alipore Road, Kolkata", phone: "033-22233333", rating: 4.6, reviews: 3900, budget: "Luxury (15K+)", img: "🏨" },
    { name: "Hotel Astor", type: "hotel", city: "kolkata", lat: 22.5482, lng: 88.3525, address: "15, Shakespeare Sarani, Kolkata", phone: "033-22824422", rating: 3.7, reviews: 1500, budget: "Moderate (2K-5K)", img: "🏨" },
    { name: "Peter Cat Restaurant", type: "restaurant", city: "kolkata", lat: 22.5505, lng: 88.3515, address: "18A, Park Street, Kolkata", phone: "033-22248463", rating: 4.4, reviews: 8200, budget: "Moderate (2K-5K)", img: "🍽️" },
    { name: "6 Ballygunge Place", type: "restaurant", city: "kolkata", lat: 22.5225, lng: 88.3670, address: "6, Ballygunge Place, Kolkata", phone: "033-24556995", rating: 4.5, reviews: 4800, budget: "Moderate (2K-5K)", img: "🍽️" },
    { name: "Oh! Calcutta", type: "restaurant", city: "kolkata", lat: 22.5450, lng: 88.3560, address: "33, Shakespeare Sarani, Kolkata", phone: "033-22810845", rating: 4.1, reviews: 3500, budget: "Moderate (2K-5K)", img: "🍽️" },

    // ── PUNE ──
    { name: "Ruby Hall Clinic", type: "hospital", city: "pune", lat: 18.5362, lng: 73.8937, address: "40, Sassoon Road, Pune", phone: "020-66455555", rating: 4.4, reviews: 7200, budget: "Premium (5K-15K)", img: "🏥" },
    { name: "Jehangir Hospital", type: "hospital", city: "pune", lat: 18.5280, lng: 73.8785, address: "32, Sassoon Road, Pune", phone: "020-66455555", rating: 4.2, reviews: 5100, budget: "Moderate (2K-5K)", img: "🏥" },
    { name: "Pune City Police Control Room", type: "police", city: "pune", lat: 18.5204, lng: 73.8567, address: "Pune City, Maharashtra", phone: "020-26126296", rating: 3.9, reviews: 780, budget: "Free", img: "🚔" },
    { name: "Deccan Police Station", type: "police", city: "pune", lat: 18.5137, lng: 73.8396, address: "Deccan Gymkhana, Pune", phone: "020-25534222", rating: 3.7, reviews: 520, budget: "Free", img: "🚔" },
    { name: "Hotel Taj Blue Diamond", type: "hotel", city: "pune", lat: 18.5330, lng: 73.8800, address: "11, Koregaon Road, Pune", phone: "020-66603030", rating: 4.5, reviews: 4400, budget: "Luxury (15K+)", img: "🏨" },
    { name: "The Westin Pune", type: "hotel", city: "pune", lat: 18.5553, lng: 73.9135, address: "Senapati Bapat Road, Pune", phone: "020-67228888", rating: 4.4, reviews: 3800, budget: "Luxury (15K+)", img: "🏨" },
    { name: "Lemon Tree Premier", type: "hotel", city: "pune", lat: 18.5373, lng: 73.8920, address: "12, Bund Garden Road, Pune", phone: "020-67228888", rating: 3.9, reviews: 2100, budget: "Moderate (2K-5K)", img: "🏨" },
    { name: "Shabree Restaurant", type: "restaurant", city: "pune", lat: 18.5195, lng: 73.8553, address: "1106/60, Apte Road, Pune", phone: "020-25533555", rating: 4.3, reviews: 4500, budget: "Moderate (2K-5K)", img: "🍽️" },
    { name: "Vaishali Restaurant", type: "restaurant", city: "pune", lat: 18.5167, lng: 73.8390, address: "1212/1, FC Road, Pune", phone: "020-25531288", rating: 4.4, reviews: 7800, budget: "Budget (<2K)", img: "🍽️" },
    { name: "Kayani Bakery", type: "restaurant", city: "pune", lat: 18.5223, lng: 73.8760, address: "6, Kayani Building, East Street, Pune", phone: "020-66301442", rating: 4.6, reviews: 5200, budget: "Budget (<2K)", img: "🍽️" },

    // ── JAIPUR ──
    { name: "Sawai Man Singh Hospital", type: "hospital", city: "jaipur", lat: 26.8930, lng: 75.8072, address: "SMS Hospital, Jaipur", phone: "0141-2560291", rating: 4.1, reviews: 8200, budget: "Free/Subsidized", img: "🏥" },
    { name: "Fortis Escorts Hospital", type: "hospital", city: "jaipur", lat: 26.8840, lng: 75.7922, address: "Malviya Nagar, Jaipur", phone: "0141-2522222", rating: 4.3, reviews: 4600, budget: "Premium (5K-15K)", img: "🏥" },
    { name: "Jaipur Pink City Police", type: "police", city: "jaipur", lat: 26.9124, lng: 75.7873, address: "Jaipur, Rajasthan", phone: "0141-2610373", rating: 3.8, reviews: 680, budget: "Free", img: "🚔" },
    { name: "Hawa Mahal Police Station", type: "police", city: "jaipur", lat: 26.9239, lng: 75.8267, address: "Hawa Mahal Road, Jaipur", phone: "0141-2634567", rating: 3.6, reviews: 320, budget: "Free", img: "🚔" },
    { name: "Rambagh Palace", type: "hotel", city: "jaipur", lat: 26.8997, lng: 75.8111, address: "Bhawani Singh Road, Jaipur", phone: "0141-2381462", rating: 4.7, reviews: 5800, budget: "Luxury (15K+)", img: "🏨" },
    { name: "The Oberoi Rajvilas", type: "hotel", city: "jaipur", lat: 26.8634, lng: 75.8125, address: "Goner Road, Jaipur", phone: "0141-2680222", rating: 4.8, reviews: 4900, budget: "Luxury (15K+)", img: "🏨" },
    { name: "Hotel Pearl Palace", type: "hotel", city: "jaipur", lat: 26.9239, lng: 75.8215, address: "51, Hathroi Fort Road, Jaipur", phone: "0141-2373828", rating: 4.2, reviews: 3200, budget: "Budget (<2K)", img: "🏨" },
    { name: "Chokhi Dhani", type: "restaurant", city: "jaipur", lat: 26.8300, lng: 75.7500, address: "Tonk Road, Jaipur", phone: "0141-2770556", rating: 4.3, reviews: 6400, budget: "Moderate (2K-5K)", img: "🍽️" },
    { name: "LMB Restaurant", type: "restaurant", city: "jaipur", lat: 26.9225, lng: 75.8262, address: "Johari Bazaar, Jaipur", phone: "0141-2373090", rating: 4.2, reviews: 4100, budget: "Moderate (2K-5K)", img: "🍽️" },
    { name: "Masala Chowk", type: "restaurant", city: "jaipur", lat: 26.9096, lng: 75.8080, address: "Ram Niwas Garden, Jaipur", phone: "0141-2615886", rating: 4.1, reviews: 3500, budget: "Budget (<2K)", img: "🍽️" },

    // ── VARANASI ──
    { name: "BHU Hospital", type: "hospital", city: "varanasi", lat: 25.2677, lng: 83.0062, address: "BHU Campus, Varanasi", phone: "0542-2307254", rating: 4.0, reviews: 4800, budget: "Free/Subsidized", img: "🏥" },
    { name: "Sir Sunderlal Hospital", type: "hospital", city: "varanasi", lat: 25.2670, lng: 83.0080, address: "BHU Campus, Varanasi", phone: "0542-2307410", rating: 4.1, reviews: 3200, budget: "Free/Subsidized", img: "🏥" },
    { name: "Varanasi Cantt Police Station", type: "police", city: "varanasi", lat: 25.3109, lng: 83.0107, address: "Cantt Area, Varanasi", phone: "0542-2507850", rating: 3.7, reviews: 420, budget: "Free", img: "🚔" },
    { name: "Dashashwamedh Ghat Police Post", type: "police", city: "varanasi", lat: 25.3046, lng: 83.0103, address: "Dashashwamedh Ghat, Varanasi", phone: "0542-2390123", rating: 3.5, reviews: 280, budget: "Free", img: "🚔" },
    { name: "Taj Nadesar Palace", type: "hotel", city: "varanasi", lat: 25.3200, lng: 75.9800, address: "Nadesar Palace Grounds, Varanasi", phone: "0542-6633000", rating: 4.6, reviews: 2800, budget: "Luxury (15K+)", img: "🏨" },
    { name: "Hotel Ganges View", type: "hotel", city: "varanasi", lat: 25.2920, lng: 83.0080, address: "Assi Ghat, Varanasi", phone: "0542-2311895", rating: 4.2, reviews: 1600, budget: "Moderate (2K-5K)", img: "🏨" },
    { name: "Ramada Plaza JHV", type: "hotel", city: "varanasi", lat: 25.3310, lng: 83.0120, address: "Nadesar, Varanasi", phone: "0542-6660000", rating: 4.3, reviews: 2200, budget: "Premium (5K-15K)", img: "🏨" },
    { name: "Kashi Chaat Bhojanalaya", type: "restaurant", city: "varanasi", lat: 25.3109, lng: 83.0093, address: "Godowlia, Varanasi", phone: "0542-2345678", rating: 4.4, reviews: 5200, budget: "Budget (<2K)", img: "🍽️" },
    { name: "Blue Lassi Shop", type: "restaurant", city: "varanasi", lat: 25.3068, lng: 83.0060, address: "Manikarnika Ghat Road, Varanasi", phone: "0542-2399555", rating: 4.5, reviews: 3800, budget: "Budget (<2K)", img: "🍽️" },
    { name: "Baati Chokha", type: "restaurant", city: "varanasi", lat: 25.2980, lng: 83.0050, address: "Narmada Bahwan, Godowlia, Varanasi", phone: "0542-2393333", rating: 4.3, reviews: 2900, budget: "Budget (<2K)", img: "🍽️" },
    // ── ATMs ──
    { name: "SBI ATM - Connaught Place", type: "atm", city: "delhi", lat: 28.6315, lng: 77.2167, address: "Block A, Connaught Place, New Delhi", phone: "1800-11-2211", rating: 4.0, reviews: 3200, budget: "Free", img: "🏧" },
    { name: "HDFC ATM - Karol Bagh", type: "atm", city: "delhi", lat: 28.6519, lng: 77.1898, address: "Ajmal Khan Rd, Karol Bagh, New Delhi", phone: "1800-266-4332", rating: 4.1, reviews: 2100, budget: "Free", img: "🏧" },
    { name: "ICICI ATM - Park Street", type: "atm", city: "kolkata", lat: 22.5530, lng: 88.3510, address: "42 Park Street, Kolkata", phone: "1800-2662", rating: 4.2, reviews: 1800, budget: "Free", img: "🏧" },
    { name: "SBI ATM - MG Road", type: "atm", city: "bangalore", lat: 12.9758, lng: 77.6064, address: "MG Road, Bangalore", phone: "1800-11-2211", rating: 3.9, reviews: 2500, budget: "Free", img: "🏧" },
    { name: "HDFC ATM - Juhu", type: "atm", city: "mumbai", lat: 19.1334, lng: 72.8298, address: "Juhu Tara Road, Mumbai", phone: "1800-266-4332", rating: 4.0, reviews: 1900, budget: "Free", img: "🏧" },
    { name: "Axis ATM - MI Road", type: "atm", city: "jaipur", lat: 26.9228, lng: 75.7873, address: "MI Road, Jaipur", phone: "1800-236-6800", rating: 4.1, reviews: 1500, budget: "Free", img: "🏧" },
    { name: "SBI ATM - T Nagar", type: "atm", city: "chennai", lat: 13.0408, lng: 80.2337, address: "Usman Road, T Nagar, Chennai", phone: "1800-11-2211", rating: 3.8, reviews: 2000, budget: "Free", img: "🏧" },
    { name: "ICICI ATM - FC Road", type: "atm", city: "pune", lat: 18.5195, lng: 73.8553, address: "Fergusson College Road, Pune", phone: "1800-2662", rating: 4.0, reviews: 1600, budget: "Free", img: "🏧" },
    { name: "HDFC ATM - Assi Ghat", type: "atm", city: "varanasi", lat: 25.2864, lng: 83.0080, address: "Assi Ghat Road, Varanasi", phone: "1800-266-4332", rating: 3.9, reviews: 1200, budget: "Free", img: "🏧" },
    // ── PHARMACIES ──
    { name: "Apollo Pharmacy - CP", type: "pharmacy", city: "delhi", lat: 28.6304, lng: 77.2177, address: "Block F, Connaught Place, New Delhi", phone: "011-41445555", rating: 4.3, reviews: 5600, budget: "Budget", img: "💊" },
    { name: "MedPlus - Nehru Place", type: "pharmacy", city: "delhi", lat: 28.5491, lng: 77.2530, address: "Nehru Place, New Delhi", phone: "011-26207777", rating: 4.1, reviews: 3400, budget: "Budget", img: "💊" },
    { name: "Apollo Pharmacy - Salt Lake", type: "pharmacy", city: "kolkata", lat: 22.5726, lng: 88.4106, address: "Sector V, Salt Lake, Kolkata", phone: "033-40002222", rating: 4.2, reviews: 2800, budget: "Budget", img: "💊" },
    { name: "Netmeds - Koramangala", type: "pharmacy", city: "bangalore", lat: 12.9352, lng: 77.6245, address: "80 Feet Road, Koramangala, Bangalore", phone: "080-40001234", rating: 4.4, reviews: 4200, budget: "Budget", img: "💊" },
    { name: "Apollo Pharmacy - Bandra", type: "pharmacy", city: "mumbai", lat: 19.0596, lng: 72.8295, address: "Linking Road, Bandra West, Mumbai", phone: "022-40002222", rating: 4.3, reviews: 3800, budget: "Budget", img: "💊" },
    { name: "1mg Pharmacy - MI Road", type: "pharmacy", city: "jaipur", lat: 26.9228, lng: 75.7900, address: "MI Road, Jaipur", phone: "0141-4000123", rating: 4.0, reviews: 2100, budget: "Budget", img: "💊" },
    { name: "Apollo Pharmacy - T Nagar", type: "pharmacy", city: "chennai", lat: 13.0398, lng: 80.2347, address: "Usman Road, T Nagar, Chennai", phone: "044-40002222", rating: 4.2, reviews: 3100, budget: "Budget", img: "💊" },
    { name: "MedPlus - Deccan", type: "pharmacy", city: "pune", lat: 18.5132, lng: 73.8393, address: "Deccan Gymkhana, Pune", phone: "020-40005555", rating: 4.1, reviews: 2400, budget: "Budget", img: "💊" },
    { name: "Apollo - Dashashwamedh", type: "pharmacy", city: "varanasi", lat: 25.3048, lng: 83.0105, address: "Dashashwamedh Ghat Road, Varanasi", phone: "0542-4000222", rating: 4.0, reviews: 1800, budget: "Budget", img: "💊" },
    // ── PETROL PUMPS ──
    { name: "IOCL Petrol Pump - ITO", type: "petrol", city: "delhi", lat: 28.6280, lng: 77.2410, address: "ITO, New Delhi", phone: "011-23345678", rating: 4.0, reviews: 1500, budget: "Moderate", img: "⛽" },
    { name: "BP Petrol Pump - Rajouri", type: "petrol", city: "delhi", lat: 28.6492, lng: 77.1220, address: "Rajouri Garden, New Delhi", phone: "011-25101234", rating: 4.1, reviews: 1200, budget: "Moderate", img: "⛽" },
    { name: "HP Petrol Pump - EM Bypass", type: "petrol", city: "kolkata", lat: 22.5180, lng: 88.3950, address: "EM Bypass, Kolkata", phone: "033-24301234", rating: 3.9, reviews: 1100, budget: "Moderate", img: "⛽" },
    { name: "IOCL Petrol Pump - Silk Board", type: "petrol", city: "bangalore", lat: 12.9170, lng: 77.6229, address: "Silk Board Junction, Bangalore", phone: "080-25701234", rating: 4.0, reviews: 1800, budget: "Moderate", img: "⛽" },
    { name: "HP Petrol Pump - Andheri", type: "petrol", city: "mumbai", lat: 19.1197, lng: 72.8464, address: "Andheri Kurla Road, Mumbai", phone: "022-26301234", rating: 4.1, reviews: 2000, budget: "Moderate", img: "⛽" },
    { name: "BP Petrol Pump - Tonk Road", type: "petrol", city: "jaipur", lat: 26.8840, lng: 75.7910, address: "Tonk Road, Jaipur", phone: "0141-2701234", rating: 3.8, reviews: 900, budget: "Moderate", img: "⛽" },
    { name: "IOCL Petrol Pump - OMR", type: "petrol", city: "chennai", lat: 12.9815, lng: 80.2480, address: "Old Mahabalipuram Road, Chennai", phone: "044-24501234", rating: 4.0, reviews: 1300, budget: "Moderate", img: "⛽" },
    { name: "HP Petrol Pump - Hinjewadi", type: "petrol", city: "pune", lat: 18.5912, lng: 73.7389, address: "Hinjewadi, Pune", phone: "020-27101234", rating: 3.9, reviews: 1000, budget: "Moderate", img: "⛽" },
    { name: "BP Petrol Pump - BHU", type: "petrol", city: "varanasi", lat: 25.2677, lng: 82.9913, address: "BHU Lanka Road, Varanasi", phone: "0542-2301234", rating: 3.8, reviews: 700, budget: "Moderate", img: "⛽" },
    // ── CAFES ──
    { name: "Starbucks - CP", type: "cafe", city: "delhi", lat: 28.6329, lng: 77.2195, address: "Block C, Connaught Place, New Delhi", phone: "011-45678901", rating: 4.4, reviews: 8900, budget: "Premium", img: "☕" },
    { name: "Blue Tokai - Defence Colony", type: "cafe", city: "delhi", lat: 28.5733, lng: 77.2343, address: "Defence Colony, New Delhi", phone: "011-26789012", rating: 4.6, reviews: 5400, budget: "Moderate", img: "☕" },
    { name: "Peter Cat - Park Street", type: "cafe", city: "kolkata", lat: 22.5544, lng: 88.3505, address: "18A Park Street, Kolkata", phone: "033-22297889", rating: 4.5, reviews: 12000, budget: "Moderate", img: "☕" },
    { name: "Third Wave - Indiranagar", type: "cafe", city: "bangalore", lat: 12.9784, lng: 77.6408, address: "100 Feet Road, Indiranagar, Bangalore", phone: "080-45678901", rating: 4.5, reviews: 7200, budget: "Moderate", img: "☕" },
    { name: "Leopold Cafe - Colaba", type: "cafe", city: "mumbai", lat: 18.9220, lng: 72.8347, address: "Colaba Causeway, Mumbai", phone: "022-22020123", rating: 4.3, reviews: 15000, budget: "Moderate", img: "☕" },
    { name: "Tapri Central - C-Scheme", type: "cafe", city: "jaipur", lat: 26.9150, lng: 75.7890, address: "C-Scheme, Jaipur", phone: "0141-4001234", rating: 4.4, reviews: 6800, budget: "Budget", img: "☕" },
    { name: "Saravana Bhavan - T Nagar", type: "cafe", city: "chennai", lat: 13.0418, lng: 80.2341, address: "Usman Road, T Nagar, Chennai", phone: "044-28345678", rating: 4.3, reviews: 9500, budget: "Moderate", img: "☕" },
    { name: "Cafe Goodluck - Deccan", type: "cafe", city: "pune", lat: 18.5135, lng: 73.8398, address: "FC Road, Deccan, Pune", phone: "020-25567890", rating: 4.5, reviews: 11000, budget: "Budget", img: "☕" },
    { name: "Cafe Repertwahr - Assi", type: "cafe", city: "varanasi", lat: 25.2860, lng: 83.0075, address: "Assi Ghat, Varanasi", phone: "0542-2345678", rating: 4.2, reviews: 3400, budget: "Budget", img: "☕" },
,
    // ═══════ MORE HOTELS ═══════
    { name: "The Oberoi Grand", type: "hotel", city: "kolkata", lat: 22.5560, lng: 88.3510, address: "15 Jawaharlal Nehru Road, Kolkata", phone: "033-22492323", rating: 4.7, reviews: 8500, budget: "Luxury (15K+)", img: "🏨" },
    { name: "ITC Sonar", type: "hotel", city: "kolkata", lat: 22.5280, lng: 88.3920, address: "1 JBS Haldane Avenue, Kolkata", phone: "033-23456789", rating: 4.5, reviews: 6200, budget: "Premium (5K-15K)", img: "🏨" },
    { name: "Hotel Sonar Bangla", type: "hotel", city: "kolkata", lat: 22.5350, lng: 88.4050, address: "Premises No. 2, Loudon Street, Kolkata", phone: "033-22801234", rating: 4.0, reviews: 3400, budget: "Moderate (2K-5K)", img: "🏨" },
    { name: "The Park Kolkata", type: "hotel", city: "kolkata", lat: 22.5530, lng: 88.3480, address: "17 Shakespeare Sarani, Kolkata", phone: "033-22498811", rating: 4.4, reviews: 5100, budget: "Premium (5K-15K)", img: "🏨" },
    { name: "OYO Townhouse Park Street", type: "hotel", city: "kolkata", lat: 22.5510, lng: 88.3530, address: "33 Park Street, Kolkata", phone: "033-40001234", rating: 3.8, reviews: 2200, budget: "Budget (<2K)", img: "🏨" },
    { name: "Hyatt Regency Delhi", type: "hotel", city: "delhi", lat: 28.5562, lng: 77.0980, address: "Bhikaji Cama Place, New Delhi", phone: "011-26781234", rating: 4.6, reviews: 12000, budget: "Luxury (15K+)", img: "🏨" },
    { name: "The Imperial Delhi", type: "hotel", city: "delhi", lat: 28.6246, lng: 77.2177, address: "Janpath, New Delhi", phone: "011-23341234", rating: 4.7, reviews: 9800, budget: "Luxury (15K+)", img: "🏨" },
    { name: "Taj Palace Delhi", type: "hotel", city: "delhi", lat: 28.5993, lng: 77.1691, address: "Sardar Patel Marg, New Delhi", phone: "011-26111234", rating: 4.5, reviews: 11000, budget: "Luxury (15K+)", img: "🏨" },
    { name: "The Leela Palace Delhi", type: "hotel", city: "delhi", lat: 28.5731, lng: 77.1685, address: "Diplomatic Enclave, Chanakyapuri", phone: "011-39331234", rating: 4.6, reviews: 7500, budget: "Luxury (15K+)", img: "🏨" },
    { name: "Zostel Delhi", type: "hotel", city: "delhi", lat: 28.6412, lng: 77.2180, address: "H-5/6, Chuna Mandi, Paharganj", phone: "011-45678901", rating: 4.1, reviews: 4500, budget: "Budget (<2K)", img: "🏨" },
    { name: "Taj Mahal Palace Mumbai", type: "hotel", city: "mumbai", lat: 18.9220, lng: 72.8330, address: "Apollo Bunder, Mumbai", phone: "022-66651234", rating: 4.7, reviews: 15000, budget: "Luxury (15K+)", img: "🏨" },
    { name: "The Oberoi Mumbai", type: "hotel", city: "mumbai", lat: 18.9260, lng: 72.8290, address: "Nariman Point, Mumbai", phone: "022-66321234", rating: 4.6, reviews: 10000, budget: "Luxury (15K+)", img: "🏨" },
    { name: "Trident Nariman Point", type: "hotel", city: "mumbai", lat: 18.9290, lng: 72.8250, address: "Nariman Point, Mumbai", phone: "022-66321234", rating: 4.4, reviews: 7800, budget: "Premium (5K-15K)", img: "🏨" },
    { name: "Hotel Residency Fort", type: "hotel", city: "mumbai", lat: 18.9340, lng: 72.8370, address: "MG Road, Fort, Mumbai", phone: "022-66301234", rating: 3.9, reviews: 3200, budget: "Moderate (2K-5K)", img: "🏨" },
    { name: "Treebo Trend Andheri", type: "hotel", city: "mumbai", lat: 19.1197, lng: 72.8464, address: "Andheri Kurla Road, Mumbai", phone: "022-40001234", rating: 3.8, reviews: 2100, budget: "Budget (<2K)", img: "🏨" },
    { name: "The Leela Palace Bangalore", type: "hotel", city: "bangalore", lat: 12.9986, lng: 77.5893, address: "HAL Airport Road, Bangalore", phone: "080-25211234", rating: 4.6, reviews: 9200, budget: "Luxury (15K+)", img: "🏨" },
    { name: "Taj West End Bangalore", type: "hotel", city: "bangalore", lat: 12.9765, lng: 77.5830, address: "Race Course Road, Bangalore", phone: "080-66601234", rating: 4.5, reviews: 7800, budget: "Luxury (15K+)", img: "🏨" },
    { name: "Royal Orchid Central", type: "hotel", city: "bangalore", lat: 12.9352, lng: 77.6245, address: "Koramangala, Bangalore", phone: "080-40001234", rating: 4.2, reviews: 4500, budget: "Moderate (2K-5K)", img: "🏨" },
    { name: "FabHotel Indiranagar", type: "hotel", city: "bangalore", lat: 12.9784, lng: 77.6408, address: "100 Feet Road, Indiranagar", phone: "080-45678901", rating: 3.9, reviews: 2800, budget: "Budget (<2K)", img: "🏨" },
    { name: "ITC Grand Chola Chennai", type: "hotel", city: "chennai", lat: 13.0340, lng: 80.2210, address: "Mount Road, Chennai", phone: "044-22331234", rating: 4.6, reviews: 8900, budget: "Luxury (15K+)", img: "🏨" },
    { name: "Taj Connemara Chennai", type: "hotel", city: "chennai", lat: 13.0604, lng: 80.2496, address: "Binny Road, Chennai", phone: "044-23451234", rating: 4.5, reviews: 6500, budget: "Luxury (15K+)", img: "🏨" },
    { name: "Residency Towers", type: "hotel", city: "chennai", lat: 13.0560, lng: 80.2430, address: "Sir Thyagaraya Road, Chennai", phone: "044-28301234", rating: 4.2, reviews: 4200, budget: "Premium (5K-15K)", img: "🏨" },
    { name: "OYO Home T Nagar", type: "hotel", city: "chennai", lat: 13.0408, lng: 80.2337, address: "Usman Road, T Nagar, Chennai", phone: "044-40001234", rating: 3.7, reviews: 1800, budget: "Budget (<2K)", img: "🏨" },
    { name: "Rambagh Palace Jaipur", type: "hotel", city: "jaipur", lat: 26.8930, lng: 75.8120, address: "Bhawani Singh Road, Jaipur", phone: "0141-23851234", rating: 4.8, reviews: 7200, budget: "Luxury (15K+)", img: "🏨" },
    { name: "The Oberoi Rajvilas", type: "hotel", city: "jaipur", lat: 26.9180, lng: 75.8120, address: "Goner Road, Jaipur", phone: "0141-26801234", rating: 4.7, reviews: 6800, budget: "Luxury (15K+)", img: "🏨" },
    { name: "ITC Rajputana", type: "hotel", city: "jaipur", lat: 26.9124, lng: 75.7873, address: "Palace Road, Jaipur", phone: "0141-23011234", rating: 4.3, reviews: 5100, budget: "Premium (5K-15K)", img: "🏨" },
    { name: "Hotel Pearl Palace", type: "hotel", city: "jaipur", lat: 26.9228, lng: 75.7900, address: "Hawa Mahal Road, Jaipur", phone: "0141-4001234", rating: 4.4, reviews: 8900, budget: "Budget (<2K)", img: "🏨" },
    { name: "Taj Nadesar Palace Varanasi", type: "hotel", city: "varanasi", lat: 25.3200, lng: 75.9800, address: "Nadesar Palace Grounds, Varanasi", phone: "0542-6633000", rating: 4.6, reviews: 2800, budget: "Luxury (15K+)", img: "🏨" },
    { name: "Hotel Ganges View", type: "hotel", city: "varanasi", lat: 25.2920, lng: 83.0080, address: "Assi Ghat, Varanasi", phone: "0542-2311895", rating: 4.2, reviews: 1600, budget: "Moderate (2K-5K)", img: "🏨" },
    { name: "Ramada Plaza JHV", type: "hotel", city: "varanasi", lat: 25.3310, lng: 83.0120, address: "Nadesar, Varanasi", phone: "0542-6660000", rating: 4.3, reviews: 2200, budget: "Premium (5K-15K)", img: "🏨" },
    { name: "Hotel Surya", type: "hotel", city: "varanasi", lat: 25.3060, lng: 83.0060, address: "The Mall Road, Varanasi", phone: "0542-2501234", rating: 3.9, reviews: 1400, budget: "Budget (<2K)", img: "🏨" },
    { name: "JW Marriott Pune", type: "hotel", city: "pune", lat: 18.5362, lng: 73.9140, address: "Senapati Bapat Road, Pune", phone: "020-66811234", rating: 4.5, reviews: 7500, budget: "Luxury (15K+)", img: "🏨" },
    { name: "Conrad Pune", type: "hotel", city: "pune", lat: 18.5310, lng: 73.8900, address: "Aundh-Ravet BRT Road, Pune", phone: "020-67001234", rating: 4.4, reviews: 5800, budget: "Luxury (15K+)", img: "🏨" },
    { name: "The Orchid Hotel Pune", type: "hotel", city: "pune", lat: 18.5530, lng: 73.9110, address: "Balewadi, Pune", phone: "020-40001234", rating: 4.2, reviews: 3900, budget: "Premium (5K-15K)", img: "🏨" },
    { name: "OYO Home Deccan", type: "hotel", city: "pune", lat: 18.5135, lng: 73.8398, address: "Deccan Gymkhana, Pune", phone: "020-45678901", rating: 3.7, reviews: 1500, budget: "Budget (<2K)", img: "🏨" },

    // ═══════ MORE RESTAURANTS ═══════
    { name: "Oh! Calcutta", type: "restaurant", city: "kolkata", lat: 22.5500, lng: 88.3550, address: "Forum Mall, Elgin Road, Kolkata", phone: "033-22801234", rating: 4.4, reviews: 6800, budget: "Moderate (2K-5K)", img: "🍽️" },
    { name: "6 Ballygunge Place", type: "restaurant", city: "kolkata", lat: 22.5250, lng: 88.3650, address: "6 Ballygunge Place, Kolkata", phone: "033-24601234", rating: 4.5, reviews: 8900, budget: "Premium (5K-15K)", img: "🍽️" },
    { name: "Kewpie's Kitchen", type: "restaurant", city: "kolkata", lat: 22.5300, lng: 88.3600, address: "10A Ramakrishna Temple Road, Kolkata", phone: "033-24561234", rating: 4.3, reviews: 5200, budget: "Moderate (2K-5K)", img: "🍽️" },
    { name: "Arsalan Restaurant", type: "restaurant", city: "kolkata", lat: 22.5540, lng: 88.3470, address: "Park Circus, Kolkata", phone: "033-22821234", rating: 4.4, reviews: 11000, budget: "Budget (<2K)", img: "🍽️" },
    { name: "Bhojohori Manna", type: "restaurant", city: "kolkata", lat: 22.5400, lng: 88.3520, address: "Dover Lane, Ballygunge, Kolkata", phone: "033-24701234", rating: 4.3, reviews: 7500, budget: "Moderate (2K-5K)", img: "🍽️" },
    { name: "Karim's Delhi", type: "restaurant", city: "delhi", lat: 28.6490, lng: 77.2330, address: "16 Gali Kababian, Jama Masjid, Delhi", phone: "011-23261234", rating: 4.4, reviews: 18000, budget: "Budget (<2K)", img: "🍽️" },
    { name: "Bukhara at ITC Maurya", type: "restaurant", city: "delhi", lat: 28.5993, lng: 77.1680, address: "Sardar Patel Marg, Chanakyapuri, Delhi", phone: "011-26111234", rating: 4.7, reviews: 12000, budget: "Luxury (15K+)", img: "🍽️" },
    { name: "Indian Accent", type: "restaurant", city: "delhi", lat: 28.5731, lng: 77.1685, address: "The Lodhi, New Delhi", phone: "011-69421234", rating: 4.8, reviews: 9500, budget: "Luxury (15K+)", img: "🍽️" },
    { name: "Saravana Bhavan CP", type: "restaurant", city: "delhi", lat: 28.6315, lng: 77.2167, address: "Connaught Place, New Delhi", phone: "011-45671234", rating: 4.3, reviews: 15000, budget: "Budget (<2K)", img: "🍽️" },
    { name: "Moti Mahal Deluxe", type: "restaurant", city: "delhi", lat: 28.6412, lng: 77.2210, address: "Daryaganj, Old Delhi", phone: "011-23281234", rating: 4.2, reviews: 10000, budget: "Moderate (2K-5K)", img: "🍽️" },
    { name: "Wasabi by Morimoto", type: "restaurant", city: "mumbai", lat: 18.9260, lng: 72.8290, address: "Taj Mahal Palace, Mumbai", phone: "022-66651234", rating: 4.6, reviews: 6500, budget: "Luxury (15K+)", img: "🍽️" },
    { name: "Trishna", type: "restaurant", city: "mumbai", lat: 18.9340, lng: 72.8370, address: "Fort, Mumbai", phone: "022-22701234", rating: 4.4, reviews: 8200, budget: "Premium (5K-15K)", img: "🍽️" },
    { name: "Britannia & Co", type: "restaurant", city: "mumbai", lat: 18.9280, lng: 72.8360, address: "Ballard Estate, Mumbai", phone: "022-22691234", rating: 4.5, reviews: 7800, budget: "Moderate (2K-5K)", img: "🍽️" },
    { name: "Prakash Restaurant", type: "restaurant", city: "mumbai", lat: 19.0760, lng: 72.8777, address: "Dadar, Mumbai", phone: "022-24101234", rating: 4.1, reviews: 5400, budget: "Budget (<2K)", img: "🍽️" },
    { name: "Mavalli Tiffin Room", type: "restaurant", city: "bangalore", lat: 12.9510, lng: 77.6070, address: "Lalbagh Road, Bangalore", phone: "080-26501234", rating: 4.4, reviews: 9500, budget: "Budget (<2K)", img: "🍽️" },
    { name: "Meghana Foods", type: "restaurant", city: "bangalore", lat: 12.9352, lng: 77.6245, address: "Koramangala, Bangalore", phone: "080-40001234", rating: 4.5, reviews: 12000, budget: "Budget (<2K)", img: "🍽️" },
    { name: "Karavalli at Vivanta", type: "restaurant", city: "bangalore", lat: 12.9765, lng: 77.5930, address: "Vivanta Taj, Bangalore", phone: "080-66601234", rating: 4.6, reviews: 6800, budget: "Luxury (15K+)", img: "🍽️" },
    { name: "Olive Beach", type: "restaurant", city: "bangalore", lat: 12.9784, lng: 77.6100, address: "Ashok Nagar, Bangalore", phone: "080-45671234", rating: 4.4, reviews: 5200, budget: "Premium (5K-15K)", img: "🍽️" },
    { name: "Dakshin at ITC Grand Chola", type: "restaurant", city: "chennai", lat: 13.0340, lng: 80.2210, address: "Mount Road, Chennai", phone: "044-22331234", rating: 4.5, reviews: 5800, budget: "Luxury (15K+)", img: "🍽️" },
    { name: "Murugan Idli Shop", type: "restaurant", city: "chennai", lat: 13.0560, lng: 80.2430, address: "T Nagar, Chennai", phone: "044-28301234", rating: 4.4, reviews: 8900, budget: "Budget (<2K)", img: "🍽️" },
    { name: "Peshawri at ITC Grand Chola", type: "restaurant", city: "chennai", lat: 13.0350, lng: 80.2220, address: "Mount Road, Chennai", phone: "044-22341234", rating: 4.5, reviews: 4500, budget: "Luxury (15K+)", img: "🍽️" },
    { name: "Anjappar", type: "restaurant", city: "chennai", lat: 13.0408, lng: 80.2337, address: "T Nagar, Chennai", phone: "044-24301234", rating: 4.3, reviews: 7200, budget: "Budget (<2K)", img: "🍽️" },
    { name: "1135 AD Jaipur", type: "restaurant", city: "jaipur", lat: 26.9180, lng: 75.8120, address: "Amber Fort Road, Jaipur", phone: "0141-26801234", rating: 4.6, reviews: 4500, budget: "Luxury (15K+)", img: "🍽️" },
    { name: "LMB Jaipur", type: "restaurant", city: "jaipur", lat: 26.9228, lng: 75.7873, address: "Johari Bazaar, Jaipur", phone: "0141-23701234", rating: 4.3, reviews: 9800, budget: "Moderate (2K-5K)", img: "🍽️" },
    { name: "Chokhi Dhani", type: "restaurant", city: "jaipur", lat: 26.8500, lng: 75.8000, address: "Tonk Road, Jaipur", phone: "0141-51901234", rating: 4.4, reviews: 11000, budget: "Moderate (2K-5K)", img: "🍽️" },
    { name: "Handi Restaurant", type: "restaurant", city: "jaipur", lat: 26.9200, lng: 75.7850, address: "MI Road, Jaipur", phone: "0141-23601234", rating: 4.2, reviews: 6500, budget: "Budget (<2K)", img: "🍽️" },
    { name: "Kashi Chaat Bhojanalaya", type: "restaurant", city: "varanasi", lat: 25.3109, lng: 83.0093, address: "Godowlia, Varanasi", phone: "0542-2345678", rating: 4.4, reviews: 5200, budget: "Budget (<2K)", img: "🍽️" },
    { name: "Blue Lassi Shop", type: "restaurant", city: "varanasi", lat: 25.3068, lng: 83.0060, address: "Manikarnika Ghat Road, Varanasi", phone: "0542-2399555", rating: 4.5, reviews: 3800, budget: "Budget (<2K)", img: "🍽️" },
    { name: "Baati Chokha", type: "restaurant", city: "varanasi", lat: 25.2980, lng: 83.0050, address: "Narmada Bahwan, Godowlia, Varanasi", phone: "0542-2393333", rating: 4.3, reviews: 2900, budget: "Budget (<2K)", img: "🍽️" },
    { name: "Mandi House Cafe", type: "restaurant", city: "varanasi", lat: 25.3040, lng: 83.0070, address: "Dashashwamedh Ghat, Varanasi", phone: "0542-2341234", rating: 4.1, reviews: 2200, budget: "Moderate (2K-5K)", img: "🍽️" },
    { name: "Malaka Spice", type: "restaurant", city: "pune", lat: 18.5310, lng: 73.8900, address: "Koregaon Park, Pune", phone: "020-67201234", rating: 4.5, reviews: 8200, budget: "Premium (5K-15K)", img: "🍽️" },
    { name: "Shabree Restaurant", type: "restaurant", city: "pune", lat: 18.5135, lng: 73.8398, address: "FC Road, Pune", phone: "020-25561234", rating: 4.3, reviews: 6500, budget: "Moderate (2K-5K)", img: "🍽️" },
    { name: "Vohuman Cafe", type: "restaurant", city: "pune", lat: 18.5195, lng: 73.8553, address: "FC Road, Pune", phone: "020-25671234", rating: 4.2, reviews: 7800, budget: "Budget (<2K)", img: "🍽️" },
    { name: "German Bakery", type: "restaurant", city: "pune", lat: 18.5310, lng: 73.8890, address: "Koregaon Park, Pune", phone: "020-67201234", rating: 4.4, reviews: 9500, budget: "Moderate (2K-5K)", img: "🍽️" },

    // ═══════ MORE PETROL PUMPS ═══════
    { name: "HP Petrol Pump - Salt Lake", type: "petrol", city: "kolkata", lat: 22.5726, lng: 88.4106, address: "Salt Lake Sector V, Kolkata", phone: "033-23451234", rating: 4.0, reviews: 1200, budget: "Moderate", img: "⛽" },
    { name: "IOCL Petrol Pump - Howrah", type: "petrol", city: "kolkata", lat: 22.5800, lng: 88.3200, address: "Howrah Bridge, Kolkata", phone: "033-22401234", rating: 3.9, reviews: 900, budget: "Moderate", img: "⛽" },
    { name: "BP Petrol Pump - Park Street", type: "petrol", city: "kolkata", lat: 22.5544, lng: 88.3505, address: "Park Street, Kolkata", phone: "033-22901234", rating: 4.1, reviews: 800, budget: "Moderate", img: "⛽" },
    { name: "IOCL Petrol Pump - Nehru Place", type: "petrol", city: "delhi", lat: 28.5491, lng: 77.2530, address: "Nehru Place, New Delhi", phone: "011-26201234", rating: 4.0, reviews: 1100, budget: "Moderate", img: "⛽" },
    { name: "HP Petrol Pump - Karol Bagh", type: "petrol", city: "delhi", lat: 28.6519, lng: 77.1898, address: "Karol Bagh, New Delhi", phone: "011-25801234", rating: 3.9, reviews: 950, budget: "Moderate", img: "⛽" },
    { name: "BP Petrol Pump - Connaught Place", type: "petrol", city: "delhi", lat: 28.6315, lng: 77.2167, address: "Connaught Place, New Delhi", phone: "011-23401234", rating: 4.0, reviews: 800, budget: "Moderate", img: "⛽" },
    { name: "IOCL Petrol Pump - Andheri", type: "petrol", city: "mumbai", lat: 19.1334, lng: 72.8298, address: "Andheri West, Mumbai", phone: "022-26701234", rating: 4.1, reviews: 1300, budget: "Moderate", img: "⛽" },
    { name: "HP Petrol Pump - Bandra", type: "petrol", city: "mumbai", lat: 19.0596, lng: 72.8295, address: "Bandra West, Mumbai", phone: "022-26401234", rating: 4.0, reviews: 1000, budget: "Moderate", img: "⛽" },
    { name: "IOCL Petrol Pump - Whitefield", type: "petrol", city: "bangalore", lat: 12.9698, lng: 77.7500, address: "Whitefield, Bangalore", phone: "080-28401234", rating: 4.0, reviews: 850, budget: "Moderate", img: "⛽" },
    { name: "HP Petrol Pump - Jayanagar", type: "petrol", city: "bangalore", lat: 12.9260, lng: 77.5830, address: "Jayanagar, Bangalore", phone: "080-26601234", rating: 3.9, reviews: 750, budget: "Moderate", img: "⛽" },
    { name: "IOCL Petrol Pump - Anna Nagar", type: "petrol", city: "chennai", lat: 13.0850, lng: 80.2100, address: "Anna Nagar, Chennai", phone: "044-26201234", rating: 4.0, reviews: 900, budget: "Moderate", img: "⛽" },
    { name: "HP Petrol Pump - Velachery", type: "petrol", city: "chennai", lat: 12.9815, lng: 80.2180, address: "Velachery, Chennai", phone: "044-22401234", rating: 3.9, reviews: 700, budget: "Moderate", img: "⛽" },
    { name: "IOCL Petrol Pump - Malviya Nagar", type: "petrol", city: "jaipur", lat: 26.8550, lng: 75.7900, address: "Malviya Nagar, Jaipur", phone: "0141-27901234", rating: 4.0, reviews: 650, budget: "Moderate", img: "⛽" },
    { name: "IOCL Petrol Pump - Bhelupur", type: "petrol", city: "varanasi", lat: 25.3200, lng: 83.0050, address: "Bhelupur, Varanasi", phone: "0542-23401234", rating: 3.9, reviews: 500, budget: "Moderate", img: "⛽" },
    { name: "HP Petrol Pump - Kothrud", type: "petrol", city: "pune", lat: 18.5074, lng: 73.8077, address: "Kothrud, Pune", phone: "020-25401234", rating: 4.0, reviews: 600, budget: "Moderate", img: "⛽" },

    // ═══════ MORE CAFES ═══════
    { name: "Flurys Park Street", type: "cafe", city: "kolkata", lat: 22.5530, lng: 88.3510, address: "Park Street, Kolkata", phone: "033-22291234", rating: 4.4, reviews: 10000, budget: "Moderate", img: "☕" },
    { name: "Cafe Coffee Day Sector V", type: "cafe", city: "kolkata", lat: 22.5726, lng: 88.4106, address: "Sector V, Salt Lake, Kolkata", phone: "033-40001234", rating: 4.0, reviews: 3500, budget: "Budget", img: "☕" },
    { name: "Cha Bar CP", type: "cafe", city: "delhi", lat: 28.6329, lng: 77.2195, address: "Connaught Place, New Delhi", phone: "011-45671234", rating: 4.3, reviews: 6200, budget: "Moderate", img: "☕" },
    { name: "Cafe Ivy Khan Market", type: "cafe", city: "delhi", lat: 28.6000, lng: 77.2270, address: "Khan Market, New Delhi", phone: "011-26901234", rating: 4.4, reviews: 4800, budget: "Moderate", img: "☕" },
    { name: "Bombay Coffee House", type: "cafe", city: "mumbai", lat: 19.0760, lng: 72.8777, address: "Dadar, Mumbai", phone: "022-24101234", rating: 4.3, reviews: 5500, budget: "Moderate", img: "☕" },
    { name: "Cafe Mondegar", type: "cafe", city: "mumbai", lat: 18.9340, lng: 72.8370, address: "Colaba, Mumbai", phone: "022-22051234", rating: 4.2, reviews: 7200, budget: "Budget", img: "☕" },
    { name: "Starbucks Koramangala", type: "cafe", city: "bangalore", lat: 12.9352, lng: 77.6245, address: "Koramangala, Bangalore", phone: "080-40001234", rating: 4.3, reviews: 5800, budget: "Premium", img: "☕" },
    { name: "Cafe Noir Lavelle Road", type: "cafe", city: "bangalore", lat: 12.9765, lng: 77.5930, address: "Lavelle Road, Bangalore", phone: "080-45671234", rating: 4.4, reviews: 4200, budget: "Moderate", img: "☕" },
    { name: "Writer's Cafe Chennai", type: "cafe", city: "chennai", lat: 13.0560, lng: 80.2430, address: "Nungambakkam, Chennai", phone: "044-28301234", rating: 4.2, reviews: 3800, budget: "Budget", img: "☕" },
    { name: "Cafe Bael Jaipur", type: "cafe", city: "jaipur", lat: 26.9228, lng: 75.7900, address: "C-Scheme, Jaipur", phone: "0141-4001234", rating: 4.3, reviews: 4500, budget: "Budget", img: "☕" },
    { name: "Pind Balluchi Varanasi", type: "cafe", city: "varanasi", lat: 25.3100, lng: 83.0080, address: "Godowlia, Varanasi", phone: "0542-2345678", rating: 4.1, reviews: 2800, budget: "Budget", img: "☕" },
    { name: "Cafe Goodluck FC Road", type: "cafe", city: "pune", lat: 18.5195, lng: 73.8553, address: "FC Road, Pune", phone: "020-25671234", rating: 4.5, reviews: 11000, budget: "Budget", img: "☕" },

    // ── EXTRA HOSPITALS (so closer zoom levels reveal more) ──
    { name: "Sir Ganga Ram Hospital", type: "hospital", city: "delhi", lat: 28.6389, lng: 77.1890, address: "Rajinder Nagar, New Delhi", img: "🏥" },
    { name: "Fortis Escorts Heart Institute", type: "hospital", city: "delhi", lat: 28.5605, lng: 77.2745, address: "Okhla Road, New Delhi", img: "🏥" },
    { name: "Lilavati Hospital", type: "hospital", city: "mumbai", lat: 19.0513, lng: 72.8267, address: "Bandra West, Mumbai", img: "🏥" },
    { name: "Kokilaben Dhirubhai Ambani Hospital", type: "hospital", city: "mumbai", lat: 19.1316, lng: 72.8254, address: "Andheri West, Mumbai", img: "🏥" },
    { name: "Fortis Hospital Bannerghatta", type: "hospital", city: "bangalore", lat: 12.8926, lng: 77.5970, address: "Bannerghatta Road, Bangalore", img: "🏥" },
    { name: "Manipal Hospital Old Airport Road", type: "hospital", city: "bangalore", lat: 12.9581, lng: 77.6493, address: "Old Airport Road, Bangalore", img: "🏥" },
    { name: "MIOT International", type: "hospital", city: "chennai", lat: 13.0213, lng: 80.1690, address: "Manapakkam, Chennai", img: "🏥" },
    { name: "Kauvery Hospital Alwarpet", type: "hospital", city: "chennai", lat: 13.0330, lng: 80.2530, address: "Alwarpet, Chennai", img: "🏥" },
    { name: "AMRI Hospital Salt Lake", type: "hospital", city: "kolkata", lat: 22.5867, lng: 88.4090, address: "Salt Lake, Kolkata", img: "🏥" },
    { name: "Apollo Gleneagles Hospital", type: "hospital", city: "kolkata", lat: 22.5749, lng: 88.4009, address: "Canal Circular Road, Kolkata", img: "🏥" },
    { name: "Medica Superspecialty Hospital", type: "hospital", city: "kolkata", lat: 22.5074, lng: 88.4013, address: "Mukundapur, Kolkata", img: "🏥" },
    { name: "Sassoon General Hospital", type: "hospital", city: "pune", lat: 18.5270, lng: 73.8740, address: "Sassoon Road, Pune", img: "🏥" },
    { name: "Deenanath Mangeshkar Hospital", type: "hospital", city: "pune", lat: 18.5010, lng: 73.8280, address: "Erandwane, Pune", img: "🏥" },
    { name: "Narayana Multispeciality Hospital", type: "hospital", city: "jaipur", lat: 26.8390, lng: 75.8009, address: "Ajmer Road, Jaipur", img: "🏥" },
    { name: "EHCC Hospital", type: "hospital", city: "jaipur", lat: 26.8900, lng: 75.8200, address: "Jawahar Lal Nehru Marg, Jaipur", img: "🏥" },
    { name: "Heritage Hospital", type: "hospital", city: "varanasi", lat: 25.2767, lng: 82.9917, address: "Lanka, Varanasi", img: "🏥" },
    { name: "Apex Hospital", type: "hospital", city: "varanasi", lat: 25.3070, lng: 82.9990, address: "Bhelupur, Varanasi", img: "🏥" },

];

// ==================== INITIALIZATION ====================
let mapInitialized = false;
let routeMapInitialized = false;

function ensureMapInitialized() {
    if (!mapInitialized && document.getElementById('map-container')) {
        try {
            initMap();
            mapInitialized = true;
        } catch(e) {
            console.warn('Map init deferred:', e.message);
            setTimeout(() => ensureMapInitialized(), 500);
        }
    }
}

// IntersectionObserver to init map when scrolled into view
if (typeof IntersectionObserver !== 'undefined') {
    const mapObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting && !mapInitialized) {
                ensureMapInitialized();
            }
        });
    }, { threshold: 0.1 });
    setTimeout(function() {
        var mc = document.getElementById('map-container');
        if (mc) mapObserver.observe(mc);
    }, 1000);
}

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initLanguageSelector();
    renderDangerZones();
    renderPersonalContacts();
    renderDestinationPlaces();
    initSOSButton();

    // Map is initialized lazily when needed
});

// ==================== LEAFLET MAPS (OpenStreetMap) ====================

function initMap() {
    if (map) return;
    var container = document.getElementById("map-container");
    if (!container || container.offsetHeight === 0) throw new Error("Map container not ready");

    // Get user destination for zoom focus
    var user = JSON.parse(localStorage.getItem('bharatSurakshaCurrentUser') || '{}');
    var destKey = (user.destination || '').toLowerCase().trim();
    var destCoord = DESTINATION_COORDS_MAP ? DESTINATION_COORDS_MAP[destKey] : null;
    var centerLat = destCoord ? destCoord.lat : 20.5937;
    var centerLng = destCoord ? destCoord.lng : 78.9629;
    var startZoom = destCoord ? 12 : 5;

    map = L.map('map-container', {
        center: [centerLat, centerLng],
        zoom: startZoom,
        zoomControl: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(map);

    L.control.scale({ imperial: false }).addTo(map);

    // Add nearby POIs for destination; more appear as the user zooms in
    addLiveMapPOIs(destCoord ? user.destination : '');
    map.on('zoomend moveend', scheduleLivePOIRefresh);

    // Add danger zones to map (only those near the destination or all if no dest)
    dangerZones.forEach(function(zone) {
        // If we have a destination, only show zones within 500km
        if (destCoord) {
            var dist = getDistance(centerLat, centerLng, zone.lat, zone.lng);
            if (dist > 500) return; // skip zones far from destination
        }
        var color = zone.risk === 'high' ? '#c0392b' :
                    zone.risk === 'moderate' ? '#e67e22' :
                    zone.risk === 'natural' ? '#9b59b6' : '#27ae60';

        var circle = L.circle([zone.lat, zone.lng], {
            color: color,
            fillColor: color,
            fillOpacity: 0.15,
            radius: zone.radius,
            weight: 2
        }).addTo(map);

        circle.bindPopup(
            '<div style="min-width:200px;font-family:inherit;">' +
            '<b style="font-size:1.1em;">' + zone.name + '</b><br>' +
            '<span style="color:' + color + ';font-weight:700;text-transform:uppercase;font-size:0.8em;">' + zone.riskLabel + '</span><br>' +
            '<p style="margin:8px 0;font-size:0.9em;color:#555;">' + zone.description + '</p>' +
            '<div style="background:#fff3e0;padding:8px;border-left:3px solid #ff6b35;font-size:0.85em;">' +
            '<strong>⚠ Advisory:</strong> ' + zone.advisory + '</div></div>'
        );

        dangerZoneMarkers.push(circle);
    });
}

// ==================== LIVE TRACKING ====================
function toggleTracking() {
    if (isTracking) {
        stopTracking();
    } else {
        startTracking();
    }
}

function startTracking() {
    if (!navigator.geolocation) {
        showToast('Geolocation is not supported by your browser');
        return;
    }

    isTracking = true;
    document.getElementById('track-btn').innerHTML = '<i class="fas fa-stop"></i> <span data-i18n="btn_stop">Stop Tracking</span>';

    // Get initial position
    navigator.geolocation.getCurrentPosition(onPositionUpdate, onError, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
    });

    // Watch position
    trackingInterval = navigator.geolocation.watchPosition(onPositionUpdate, onError, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000
    });

    showToast('Live tracking started! 📍');
}

function stopTracking() {
    isTracking = false;
    if (trackingInterval) {
        navigator.geolocation.clearWatch(trackingInterval);
        trackingInterval = null;
    }
    document.getElementById('track-btn').innerHTML = '<i class="fas fa-crosshairs"></i> <span data-i18n="btn_track">Start Live Tracking</span>';
    document.getElementById('track-btn').classList.remove('tracking-active');

    const panel = document.getElementById('tracking-panel');
    if (panel) { panel.style.display = 'none'; panel.classList.remove('panel-open'); }

    // Generate trip summary
    if (trackingStartTime && totalDistanceTraveled > 0) {
        const elapsed = Math.round((Date.now() - trackingStartTime) / 60000);
        showToast('\u{1F4CA} Trip Summary: ' + totalDistanceTraveled.toFixed(1) + ' km in ' + elapsed + ' min');
        pushNotif('tracking', 'info', '\u{1F4CA}', 'Tracking Stopped', 'Trip summary: ' + totalDistanceTraveled.toFixed(1) + ' km covered in ' + elapsed + ' min.');
    } else {
        showToast('Tracking stopped');
        pushNotif('tracking', 'info', '\u{1F6D1}', 'Tracking Stopped', 'Live location tracking has been stopped.');
    }
}

function onPositionUpdate(position) {
    const { latitude, longitude, speed, altitude, heading, accuracy } = position.coords;
    lastKnownPosition = { lat: latitude, lng: longitude };
    currentSpeed = speed ? speed * 3.6 : 0; // m/s to km/h
    currentHeading = heading || 0;

    // Calculate distance from last position
    if (lastTrackedPos) {
        const segDist = getDistance(lastTrackedPos.lat, lastTrackedPos.lng, latitude, longitude);
        if (segDist > 0.01) { // Ignore GPS jitter < 10m
            totalDistanceTraveled += segDist;
            trackingTrail.push([latitude, longitude]);
            if (trailPolyline) {
                trailPolyline.setLatLngs(trackingTrail);
            } else if (map) {
                trailPolyline = L.polyline(trackingTrail, {
                    color: '#ff6b35',
                    weight: 3,
                    opacity: 0.7,
                    dashArray: '8, 6'
                }).addTo(map);
            }
        }
    } else {
        trackingTrail.push([latitude, longitude]);
    }
    lastTrackedPos = { lat: latitude, lng: longitude };

    if (userMarker) {
        userMarker.setLatLng([latitude, longitude]);
    } else {
        userMarker = L.circleMarker([latitude, longitude], {
            radius: 15000,
            fillColor: '#ff6b35',
            color: '#ffffff',
            weight: 3,
            fillOpacity: 1
        }).addTo(map);
        // Heading indicator circle
        userMarker.bindPopup('<b>\u{1F4CD} Your Live Location</b><br>Lat: ' + latitude.toFixed(6) + '<br>Lng: ' + longitude.toFixed(6));
    }

    if (accuracy) {
        userMarker.setRadius(Math.max(8, Math.min(50, accuracy / 5)));
    }

    map.setView([latitude, longitude], map.getZoom());

    // Update tracking panel
    updateTrackingPanel(latitude, longitude, speed, altitude, heading, accuracy);

    // Check if in danger zone
    checkDangerZones(latitude, longitude);

    // Check nearby POIs along route
    checkNearbyPOIsForTracking(latitude, longitude);

    // Get battery
    if (!batteryLevel) getBatteryStatus();
}

function onError(error) {
    console.error('Geolocation error:', error);
    if (error.code === 1) {
        showToast('Location access denied. Please enable location services.');
        pushNotif('tracking', 'warning', '📍', 'Location Access Denied', 'Please enable location services in your browser settings to use live tracking.');
    } else {
        showToast('Error getting location: ' + error.message);
        pushNotif('tracking', 'warning', '⚠️', 'Location Error', error.message);
    }
}

let dangerAlertDismissed = {};
let dangerAlertCooldown = {};

function checkDangerZones(lat, lng) {
    dangerZones.forEach(zone => {
        const distance = getDistance(lat, lng, zone.lat, zone.lng);
        if (distance <= zone.radius / 1000) {
            const now = Date.now();
            // Cooldown: don't re-alert same zone within 5 minutes
            if (dangerAlertCooldown[zone.name] && (now - dangerAlertCooldown[zone.name]) < 300000) return;
            if (dangerAlertDismissed[zone.name]) return;

            dangerAlertCooldown[zone.name] = now;

            // Play alert sound
            playDangerSound();

            // Show popup
            showDangerPopup(zone);

            // Also add to notifications
            if (typeof notifications !== 'undefined') {
                const existing = notifications.find(n => n.id === 'danger-' + zone.name.replace(/\s/g, ''));
                if (!existing) {
                    pushNotif('safety', 'critical', zone.risk === 'high' ? '🚨' : '⚠️', 'DANGER: ' + zone.name, zone.riskLabel + ' — ' + zone.advisory);
                }
            }
        }
    });
}

function playDangerSound() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        // Play 3 short warning beeps
        for (let i = 0; i < 3; i++) {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = 880;
            osc.type = 'square';
            gain.gain.value = 0.3;
            osc.start(ctx.currentTime + i * 0.3);
            osc.stop(ctx.currentTime + i * 0.3 + 0.15);
        }
    } catch(e) { /* Audio not available */ }
}

function showDangerPopup(zone) {
    const overlay = document.getElementById('danger-alert-overlay');
    const zoneName = document.getElementById('danger-alert-zone-name');
    const desc = document.getElementById('danger-alert-desc');
    const advisory = document.getElementById('danger-alert-advisory');
    const icon = document.getElementById('danger-alert-icon');

    if (!overlay) return;

    icon.textContent = zone.risk === 'high' ? '🚨' : zone.risk === 'natural' ? '🌍' : '⚠️';
    zoneName.textContent = zone.name + ' — ' + zone.riskLabel;
    desc.textContent = zone.description;
    advisory.innerHTML = '<strong>⚠ Advisory:</strong> ' + zone.advisory;
    overlay.style.display = 'flex';
}

function dismissDangerAlert() {
    const overlay = document.getElementById('danger-alert-overlay');
    if (overlay) overlay.style.display = 'none';
}

// ==================== LIVE MAP NEARBY POIS ====================
let livePOIMarkers = [];
let activeLivePOIFilter = 'all';
let livePOIData = [];        // places available around the current destination
let livePOIStats = { shown: 0, total: 0, limit: 0, zoom: 0 };
let livePOIRefreshTimer = null;
let livePOILastView = null;

// How many places of each category the map shows at a given zoom (index = zoom).
// Zooming in reveals more hotels, restaurants, hospitals, pharmacies, etc.
const LIVE_POI_ZOOM_LIMITS = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 5, 8, 12, 18, 25];

const LIVE_POI_STYLES = {
    hospital:   { color: '#3498db', icon: '🏥', label: 'Hospital' },
    police:     { color: '#9b59b6', icon: '🚔', label: 'Police Station' },
    hotel:      { color: '#f1c40f', icon: '🏨', label: 'Hotel' },
    restaurant: { color: '#27ae60', icon: '🍽️', label: 'Restaurant' },
    atm:        { color: '#e67e22', icon: '🏧', label: 'ATM' },
    pharmacy:   { color: '#1abc9c', icon: '💊', label: 'Pharmacy' },
    petrol:     { color: '#e74c3c', icon: '⛽', label: 'Petrol Pump' },
    cafe:       { color: '#8e44ad', icon: '☕', label: 'Cafe' }
};

const DESTINATION_COORDS_MAP = {
    'kolkata': { lat: 22.5726, lng: 88.3639 }, 'delhi': { lat: 28.7041, lng: 77.1025 },
    'mumbai': { lat: 19.0760, lng: 72.8777 }, 'bangalore': { lat: 12.9716, lng: 77.5946 },
    'chennai': { lat: 13.0827, lng: 80.2707 }, 'jaipur': { lat: 26.9124, lng: 75.7873 },
    'varanasi': { lat: 25.3176, lng: 82.9739 }, 'pune': { lat: 18.5204, lng: 73.8567 },
    'goa': { lat: 15.2993, lng: 74.1240 }, 'agra': { lat: 27.1767, lng: 78.0081 },
    'udaipur': { lat: 24.5854, lng: 73.7125 }, 'shimla': { lat: 31.1048, lng: 77.1734 },
    'manali': { lat: 32.2432, lng: 77.1892 }, 'srinagar': { lat: 34.0837, lng: 74.7973 },
    'amritsar': { lat: 31.6340, lng: 74.8723 }, 'rishikesh': { lat: 30.0869, lng: 78.2676 },
    'leh': { lat: 34.1526, lng: 77.5771 }, 'darjeeling': { lat: 27.0360, lng: 88.2627 },
    'mysore': { lat: 12.2958, lng: 76.6394 }, 'hyderabad': { lat: 17.3850, lng: 78.4867 },
    'kashmir': { lat: 34.0837, lng: 74.7973 }, 'ladakh': { lat: 34.1526, lng: 77.5771 },
    'himachal': { lat: 31.1048, lng: 77.1734 }, 'rajasthan': { lat: 26.9124, lng: 75.7873 },
    'northeast': { lat: 27.3389, lng: 88.6065 }, 'kerala': { lat: 9.9312, lng: 76.2673 },
    'kochi': { lat: 9.9312, lng: 76.2673 }
};

function getLivePOILimit(zoom) {
    var z = Math.round(zoom);
    if (z < 0) z = 0;
    if (z >= LIVE_POI_ZOOM_LIMITS.length) z = LIVE_POI_ZOOM_LIMITS.length - 1;
    return LIVE_POI_ZOOM_LIMITS[z];
}

function addLiveMapPOIs(dest) {
    if (!map) return;
    livePOIData = [];
    var destKey = String(dest || '').toLowerCase().trim();
    var destCoord = DESTINATION_COORDS_MAP[destKey];

    if (destCoord) {
        var seen = {};
        var addPlace = function(place) {
            if (!place || !place.lat || !place.lng) return;
            var key = place.type + '|' + place.name.toLowerCase();
            if (seen[key]) return;
            seen[key] = true;
            livePOIData.push(place);
        };
        // Curated places in the destination city
        samplePlaces.forEach(function(place) {
            if (place.city === destKey) addPlace(place);
        });
        // Plus curated places from other cities within 150 km of the destination
        samplePlaces.forEach(function(place) {
            if (place.city === destKey || !place.lat || !place.lng) return;
            if (getDistance(destCoord.lat, destCoord.lng, place.lat, place.lng) <= 150) addPlace(place);
        });
    }
    renderLivePOIMarkers();
}

// Chooses which places to draw for the current zoom / filter.
// The closest places of each category are kept, so every zoom step adds more.
function renderLivePOIMarkers() {
    if (!map) return;
    clearLiveMapPOIs();

    var zoom = map.getZoom();
    var limit = getLivePOILimit(zoom);
    var center = map.getCenter();
    var markerSize = zoom <= 12 ? 24 : (zoom <= 14 ? 28 : 32);
    var filter = activeLivePOIFilter;

    var groups = {};
    livePOIData.forEach(function(place) {
        if (filter !== 'all' && place.type !== filter) return;
        var dist = getDistance(center.lat, center.lng, place.lat, place.lng);
        if (!groups[place.type]) groups[place.type] = [];
        groups[place.type].push({ place: place, dist: dist });
    });

    var shown = 0;
    var available = 0;
    Object.keys(groups).forEach(function(type) {
        var style = LIVE_POI_STYLES[type] || { color: '#ff6b35', icon: '📍', label: 'Place' };
        groups[type].sort(function(a, b) { return a.dist - b.dist; });
        available += groups[type].length;
        groups[type].slice(0, limit).forEach(function(entry) {
            addLivePOIMarker(entry.place, entry.dist, style, markerSize);
            shown++;
        });
    });

    livePOILastView = { zoom: zoom, lat: center.lat, lng: center.lng };
    livePOIStats = { shown: shown, total: available, limit: limit, zoom: zoom };
    updateLivePOICount();
}

function addLivePOIMarker(place, dist, style, size) {
    var poiIcon = L.divIcon({
        className: 'live-poi-marker',
        html: '<div style="background:' + style.color + ';color:white;border-radius:50%;width:' + size + 'px;height:' + size + 'px;display:flex;align-items:center;justify-content:center;font-size:' + Math.round(size * 0.55) + 'px;border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);cursor:pointer;transition:transform 0.2s;" onmouseover="this.style.transform=\'scale(1.2)\'" onmouseout="this.style.transform=\'scale(1)\'">' + style.icon + '</div>',
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2]
    });
    var marker = L.marker([place.lat, place.lng], { icon: poiIcon }).addTo(map);
    marker.bindPopup(buildLivePOIPopup(place, dist, style));
    marker._poiType = place.type;
    livePOIMarkers.push(marker);
}

function buildLivePOIPopup(place, dist, style) {
    var html = '<div style="min-width:240px;font-family:inherit;">';
    html += '<div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;flex-wrap:wrap;">';
    html += '<span style="background:' + style.color + '20;color:' + style.color + ';padding:3px 10px;border-radius:50px;font-size:0.75rem;font-weight:600;">' + style.icon + ' ' + style.label + '</span>';
    if (place.budget) {
        var budgetColor = place.budget.indexOf('Luxury') >= 0 ? '#e74c3c' :
                          place.budget.indexOf('Premium') >= 0 ? '#f39c12' :
                          place.budget.indexOf('Budget') >= 0 ? '#27ae60' : '#3498db';
        html += '<span style="background:' + budgetColor + '20;color:' + budgetColor + ';padding:3px 10px;border-radius:50px;font-size:0.75rem;font-weight:600;">' + place.budget + '</span>';
    }
    if (typeof dist === 'number') {
        html += '<span style="background:#64748b20;color:#64748b;padding:3px 10px;border-radius:50px;font-size:0.75rem;font-weight:600;">' + formatPOIDistance(dist) + '</span>';
    }
    html += '</div>';
    html += '<b style="font-size:1.1em;display:block;margin-bottom:4px;">' + place.name + '</b>';
    html += '<div style="color:#888;font-size:0.85em;margin-bottom:4px;">\u{1F4CD} ' + (place.address || 'Address not available') + '</div>';
    if (place.rating) {
        var stars = '';
        for (var i = 0; i < 5; i++) {
            stars += i < Math.floor(place.rating) ? '<span style="color:#f39c12;">★</span>' : '<span style="color:#555;">★</span>';
        }
        html += '<div style="display:flex;align-items:center;gap:8px;margin:6px 0;">' +
            '<div style="display:flex;gap:1px;">' + stars + '</div>' +
            '<span style="color:#f39c12;font-weight:600;font-size:0.9em;">' + place.rating + '</span>' +
            '<span style="color:#888;font-size:0.8em;">(' + (place.reviews || 0).toLocaleString() + ' reviews)</span>' +
            '</div>';
    }
    html += '<div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap;">';
    if (place.phone) {
        html += '<a href="tel:' + place.phone + '" style="display:inline-flex;align-items:center;gap:4px;padding:5px 12px;background:#27ae60;color:white;border-radius:50px;text-decoration:none;font-size:0.82rem;font-weight:600;">\u{1F4DE} Call</a>';
    }
    html += '<a href="https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(place.name + ' ' + (place.address || '')) + '" target="_blank" style="display:inline-flex;align-items:center;gap:4px;padding:5px 12px;background:#4285f4;color:white;border-radius:50px;text-decoration:none;font-size:0.82rem;font-weight:600;">\u{1F5FA}\uFE0F Directions</a>';
    html += '</div></div>';
    return html;
}

function formatPOIDistance(km) {
    if (km < 1) return Math.max(50, Math.round(km * 1000 / 50) * 50) + ' m away';
    return km.toFixed(1) + ' km away';
}

function clearLiveMapPOIs() {
    livePOIMarkers.forEach(function(m) { try { map.removeLayer(m); } catch(e){} });
    livePOIMarkers = [];
}

function toggleLivePOI(type) {
    activeLivePOIFilter = (type === 'all' || activeLivePOIFilter === type) ? 'all' : type;
    document.querySelectorAll('.live-poi-toggle').forEach(function(btn) {
        var onclick = btn.getAttribute('onclick') || '';
        var match = onclick.match(/toggleLivePOI\('(\w+)'/);
        if (match) btn.classList.toggle('active', match[1] === activeLivePOIFilter);
    });
    renderLivePOIMarkers();
}

function updateLivePOICount() {
    var badge = document.getElementById('live-poi-count');
    if (!badge) return;
    var stats = livePOIStats;
    if (!livePOIData.length) {
        badge.textContent = 'No nearby places for this destination yet';
        return;
    }
    if (!stats.shown) {
        badge.textContent = 'Zoom in to see nearby places';
        return;
    }
    badge.textContent = stats.shown + ' of ' + stats.total + ' places · ' +
        (stats.shown < stats.total ? 'zoom in for more' : 'all showing');
}

function scheduleLivePOIRefresh() {
    if (!map) return;
    // Skip tiny pans (e.g. live GPS updates) so markers are not rebuilt needlessly
    var zoom = map.getZoom();
    var center = map.getCenter();
    if (livePOILastView && livePOILastView.zoom === zoom &&
        getDistance(livePOILastView.lat, livePOILastView.lng, center.lat, center.lng) < 0.25) return;
    clearTimeout(livePOIRefreshTimer);
    livePOIRefreshTimer = setTimeout(renderLivePOIMarkers, 200);
}

// ==================== TRACKING PANEL ====================
function updateTrackingPanel(lat, lng, speed, altitude, heading, accuracy) {
    // Coords
    const coordsEl = document.getElementById('track-coords');
    if (coordsEl) coordsEl.textContent = lat.toFixed(6) + ', ' + lng.toFixed(6);

    // Speed
    const speedEl = document.getElementById('track-speed');
    if (speedEl) speedEl.textContent = currentSpeed.toFixed(1) + ' km/h';

    // Altitude
    const altEl = document.getElementById('track-altitude');
    if (altEl) altEl.textContent = altitude ? altitude.toFixed(0) + ' m' : 'N/A';

    // Heading
    const headEl = document.getElementById('track-heading');
    if (headEl) {
        const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
        const dir = heading ? dirs[Math.round(heading / 45) % 8] : '--';
        headEl.textContent = dir + (heading ? ' (' + heading.toFixed(0) + '\u00b0)' : '');
    }

    // Accuracy
    const accEl = document.getElementById('track-accuracy');
    if (accEl) accEl.textContent = accuracy ? '\u00b1' + accuracy.toFixed(0) + 'm' : 'N/A';

    // Distance traveled
    const distEl = document.getElementById('track-distance');
    if (distEl) distEl.textContent = totalDistanceTraveled.toFixed(2) + ' km';

    // Elapsed time
    const timeEl = document.getElementById('track-elapsed');
    if (timeEl && trackingStartTime) {
        const secs = Math.floor((Date.now() - trackingStartTime) / 1000);
        const h = Math.floor(secs / 3600);
        const m = Math.floor((secs % 3600) / 60);
        const s = secs % 60;
        timeEl.textContent = (h > 0 ? h + 'h ' : '') + m + 'm ' + s + 's';
    }

    // Distance to destination
    const destEl = document.getElementById('track-dest-dist');
    const etaEl = document.getElementById('track-eta');
    if (destEl && typeof getCurrentUser === 'function') {
        const user = getCurrentUser();
        if (user && user.destination) {
            const destCoords = getDestinationCoords(user.destination);
            if (destCoords) {
                const remDist = getDistance(lat, lng, destCoords.lat, destCoords.lng);
                destEl.textContent = remDist.toFixed(1) + ' km remaining';
                if (etaEl) {
                    if (currentSpeed > 5) {
                        const etaH = remDist / currentSpeed;
                        const etaMins = Math.round(etaH * 60);
                        if (etaMins > 60) {
                            etaEl.textContent = Math.floor(etaMins / 60) + 'h ' + (etaMins % 60) + 'm';
                        } else {
                            etaEl.textContent = etaMins + ' min';
                        }
                    } else {
                        etaEl.textContent = 'Calculating...';
                    }
                }
            }
        }
    }

    // Battery
    const batEl = document.getElementById('track-battery');
    if (batEl && batteryLevel !== null) {
        batEl.textContent = batteryLevel + '%';
        batEl.style.color = batteryLevel > 50 ? '#27ae60' : batteryLevel > 20 ? '#f39c12' : '#e74c3c';
    }
}

function getDestinationCoords(dest) {
    const coords = {
        'kolkata': { lat: 22.5726, lng: 88.3639 },
        'delhi': { lat: 28.7041, lng: 77.1025 },
        'mumbai': { lat: 19.0760, lng: 72.8777 },
        'bangalore': { lat: 12.9716, lng: 77.5946 },
        'chennai': { lat: 13.0827, lng: 80.2707 },
        'jaipur': { lat: 26.9124, lng: 75.7873 },
        'varanasi': { lat: 25.3176, lng: 82.9739 },
        'goa': { lat: 15.2993, lng: 74.1240 },
        'agra': { lat: 27.1767, lng: 78.0081 },
        'pune': { lat: 18.5204, lng: 73.8567 },
        'udaipur': { lat: 24.5854, lng: 73.7125 },
        'shimla': { lat: 31.1048, lng: 77.1734 },
        'manali': { lat: 32.2432, lng: 77.1892 },
        'srinagar': { lat: 34.0837, lng: 74.7973 },
        'amritsar': { lat: 31.6340, lng: 74.8723 },
        'rishikesh': { lat: 30.0869, lng: 78.2676 },
        'hampi': { lat: 15.3350, lng: 76.4600 },
        'leh': { lat: 34.1526, lng: 77.5771 },
        'darjeeling': { lat: 27.0360, lng: 88.2627 },
        'mysore': { lat: 12.2958, lng: 76.6394 },
        'hyderabad': { lat: 17.3850, lng: 78.4867 },
        'ooty': { lat: 11.4102, lng: 76.6950 },
        'madurai': { lat: 9.9252, lng: 78.1198 },
        'pondicherry': { lat: 11.9416, lng: 79.8083 },
        'jaisalmer': { lat: 26.9157, lng: 70.9083 },
        'jodhpur': { lat: 26.2389, lng: 73.0243 },
        'pushkar': { lat: 26.4900, lng: 74.5510 },
        'gangtok': { lat: 27.3389, lng: 88.6065 },
        'tirupati': { lat: 13.6288, lng: 79.4192 },
        'rameshwaram': { lat: 9.2876, lng: 79.3129 },
        'kanyakumari': { lat: 8.0883, lng: 77.5385 },
        'coorg': { lat: 12.3375, lng: 75.8069 },
        'alleppey': { lat: 9.4981, lng: 76.3388 },
        'khajuraho': { lat: 24.8318, lng: 79.9199 },
        'bodhgaya': { lat: 24.6961, lng: 84.9911 },
        'dwarka': { lat: 22.2394, lng: 68.9678 },
        'somnath': { lat: 20.8880, lng: 70.4013 },
        'lumbai': { lat: 19.0760, lng: 72.8777 },
        'kochi': { lat: 9.9312, lng: 76.2673 },
        'agra': { lat: 27.1767, lng: 78.0081 },
        'nashik': { lat: 19.9975, lng: 73.7898 },
        'ajmer': { lat: 26.4499, lng: 74.6399 },
        'mount_abu': { lat: 24.5926, lng: 72.7156 },
        'ranthambore': { lat: 26.0173, lng: 76.5026 },
        'sunderbans': { lat: 21.9497, lng: 89.1833 },
        'ladakh': { lat: 34.1526, lng: 77.5771 },
        'himachal': { lat: 31.1048, lng: 77.1734 },
        'kashmir': { lat: 34.0837, lng: 74.7973 },
        'rajasthan': { lat: 26.9124, lng: 75.7873 },
        'northeast': { lat: 27.3389, lng: 88.6065 },
        'kerala': { lat: 9.9312, lng: 76.2673 },
        'udaipur': { lat: 24.5854, lng: 73.7125 }
    };
    const key = dest.toLowerCase().trim();
    return coords[key] || null;
}

function getBatteryStatus() {
    if ('getBattery' in navigator) {
        navigator.getBattery().then(function(battery) {
            batteryLevel = Math.round(battery.level * 100);
            battery.addEventListener('levelchange', function() {
                batteryLevel = Math.round(battery.level * 100);
                const batEl = document.getElementById('track-battery');
                if (batEl) {
                    batEl.textContent = batteryLevel + '%';
                    batEl.style.color = batteryLevel > 50 ? '#27ae60' : batteryLevel > 20 ? '#f39c12' : '#e74c3c';
                }
            });
            const batEl = document.getElementById('track-battery');
            if (batEl) {
                batEl.textContent = batteryLevel + '%';
                batEl.style.color = batteryLevel > 50 ? '#27ae60' : batteryLevel > 20 ? '#f39c12' : '#e74c3c';
            }
        }).catch(function() {});
    }
}

function checkNearbyPOIsForTracking(lat, lng) {
    if (!isTracking) return;
    // Check for nearby emergency POIs (hospitals, police) within 1km
    const nearby = (typeof samplePlaces !== 'undefined') ? samplePlaces : [];
    nearby.forEach(place => {
        const dist = getDistance(lat, lng, place.lat, place.lng);
        if (dist < 1 && dist > 0.05) {
            // Within 1km - could be useful for emergency
        }
    });
}

function shareLiveLocation() {
    if (!lastKnownPosition) {
        showToast('No location data available yet');
        return;
    }
    const lat = lastKnownPosition.lat;
    const lng = lastKnownPosition.lng;
    const googleMapsUrl = 'https://www.google.com/maps?q=' + lat + ',' + lng;

    if (navigator.share) {
        navigator.share({
            title: '\u{1F4CD} My Live Location - Bharat Suraksha',
            text: 'I am currently at this location. Tracking via Bharat Suraksha tourist safety app.\nLat: ' + lat.toFixed(6) + ', Lng: ' + lng.toFixed(6),
            url: googleMapsUrl
        }).catch(function() {});
    } else {
        // Fallback: copy to clipboard
        const text = 'My Live Location: ' + googleMapsUrl + '\nLat: ' + lat.toFixed(6) + ', Lng: ' + lng.toFixed(6);
        navigator.clipboard.writeText(text).then(function() {
            showToast('\u{1F517} Location link copied to clipboard! Share it with your emergency contacts.');
        }).catch(function() {
            // Final fallback
            const ta = document.createElement('textarea');
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            showToast('\u{1F517} Location link copied!');
        });
    }
}

function toggleTrackingPanel() {
    const panel = document.getElementById('tracking-panel');
    if (!panel) return;
    trackingPanelVisible = !trackingPanelVisible;
    panel.style.display = trackingPanelVisible ? 'block' : 'none';
}

// ==================== DANGER ZONES RENDERING ====================
function renderDangerZones() {
    const grid = document.getElementById('danger-zones-grid');
    if (!grid) return;
    const lang = currentLang;

    // ── Full Zone Cards ──
    const cardsHTML = dangerZones.map(zone => {
        const name = (lang === 'hi' && zone.name_hi) ? zone.name_hi : zone.name;
        const riskLabel = (lang === 'hi' && zone.riskLabel_hi) ? zone.riskLabel_hi : zone.riskLabel;
        const description = (lang === 'hi' && zone.description_hi) ? zone.description_hi : zone.description;
        const advisory = (lang === 'hi' && zone.advisory_hi) ? zone.advisory_hi : zone.advisory;

        const iconMap = {
            high: 'fas fa-skull-crossbones',
            moderate: 'fas fa-exclamation-triangle',
            natural: 'fas fa-cloud-showers-heavy',
            safe: 'fas fa-check-circle'
        };
        const typeEmoji = {
            'terrorism': '🚔', 'conflict': '⚔️', 'landslide': '⛰️', 'road': '🛣️',
            'earthquake': '🔴', 'flood': '🌊', 'cyclone': '🌀', 'tsunami': '🌊',
            'heat': '🌡️', 'pollution': '💨', 'crime': '🔒', 'safe': '✅'
        };
        // Detect type from riskLabel
        const riskLower = zone.riskLabel.toLowerCase();
        let detectedType = 'safe';
        for (const [key, emoji] of Object.entries(typeEmoji)) {
            if (riskLower.includes(key)) { detectedType = key; break; }
        }
        if (riskLower.includes('terror') || riskLower.includes('conflict')) detectedType = 'terrorism';
        if (riskLower.includes('landslide') || riskLower.includes('cloudburst')) detectedType = 'landslide';
        if (riskLower.includes('earthquake') || riskLower.includes('seismic')) detectedType = 'earthquake';
        if (riskLower.includes('flood') || riskLower.includes('cyclone') || riskLower.includes('tsunami')) detectedType = 'flood';
        if (riskLower.includes('heat') || riskLower.includes('dehydr')) detectedType = 'heat';
        if (riskLower.includes('pollution') || riskLower.includes('crime')) detectedType = 'pollution';
        if (riskLower.includes('altitude') || riskLower.includes('cold')) detectedType = 'road';

        const emoji = typeEmoji[detectedType] || '⚠️';

        return `
            <div class="danger-zone-card ${zone.risk}-border" onclick="flyToZone(${zone.lat}, ${zone.lng})">
                <div class="zone-type-bar"></div>
                <div class="zone-header">
                    <div class="zone-icon ${zone.risk}">
                        <i class="${iconMap[zone.risk] || 'fas fa-exclamation-circle'}"></i>
                    </div>
                    <div class="zone-title">
                        <h3>${emoji} ${name}</h3>
                        <span class="risk-badge ${zone.risk}">${riskLabel}</span>
                    </div>
                </div>
                <div class="zone-body">
                    <p>${description}</p>
                    <div class="advisory">
                        <strong>⚠ ${lang === 'hi' ? 'सलाह:' : 'Advisory:'}</strong> ${advisory}
                    </div>
                </div>
            </div>
        `;
    }).join('');

    grid.innerHTML = '<div class="danger-zones-grid">' + cardsHTML + '</div>';
}

function flyToZone(lat, lng) {
    if (map) {
        map.panTo({lat, lng});
        map.setZoom(10);
        document.getElementById('map').scrollIntoView({ behavior: 'smooth' });
    }
}

// ==================== NEARBY PLACES ====================
const CITY_COORDS = {
    delhi: [28.6139, 77.2090], mumbai: [19.0760, 72.8777], bangalore: [12.9716, 77.5946],
    chennai: [13.0827, 80.2707], kolkata: [22.5726, 88.3639], pune: [18.5204, 73.8567],
    jaipur: [26.9124, 75.7873], varanasi: [25.3176, 83.0064]
};

function getUserCity() {
    const user = JSON.parse(localStorage.getItem('bharatSurakshaCurrentUser') || '{}');
    return (user.destination || '').toLowerCase().trim();
}

function renderDestinationPlaces() {
    const userCity = getUserCity();
    let cityKey = '';
    for (const k of Object.keys(CITY_COORDS)) {
        if (userCity.includes(k)) { cityKey = k; break; }
    }
    const container = document.getElementById('places-results');
    if (!container) return;

    if (!cityKey) {
        container.innerHTML = '<div style="text-align:center;padding:40px;grid-column:1/-1;color:var(--text-secondary);"><i class="fas fa-map-marker-alt" style="font-size:2rem;display:block;margin-bottom:12px;color:var(--primary);"></i><h3 style="margin-bottom:8px;">Select a Destination</h3><p>Your destination (' + (userCity || 'not set') + ') is not yet in our database.<br>Supported cities: Delhi, Mumbai, Bangalore, Chennai, Kolkata, Pune, Jaipur, Varanasi</p></div>';
        return;
    }

    let places = samplePlaces.filter(p => p.city === cityKey);

    // If user location available, compute distances
    if (lastKnownPosition) {
        places.forEach(p => {
            p._dist = getDistance(lastKnownPosition.lat, lastKnownPosition.lng, p.lat, p.lng);
        });
    } else {
        // Use city center as reference
        const cc = CITY_COORDS[cityKey];
        places.forEach(p => {
            p._dist = getDistance(cc[0], cc[1], p.lat, p.lng);
        });
    }

    // Sort each category by distance
    const categories = [
        { key: 'hotel', label: 'Hotels', icon: '🏨', color: '#f1c40f' },
        { key: 'hospital', label: 'Hospitals', icon: '🏥', color: '#e74c3c' },
        { key: 'restaurant', label: 'Restaurants', icon: '🍽️', color: '#2ecc71' },
        { key: 'police', label: 'Police Stations', icon: '🚔', color: '#3498db' }
    ];

    const cityNames = { delhi: 'Delhi', mumbai: 'Mumbai', bangalore: 'Bangalore', chennai: 'Chennai', kolkata: 'Kolkata', pune: 'Pune', jaipur: 'Jaipur', varanasi: 'Varanasi' };

    let html = '<div style="grid-column:1/-1;margin-bottom:10px;"><h3 style="font-size:1.3rem;"><i class="fas fa-map-marker-alt" style="color:var(--primary);margin-right:8px;"></i>Nearby Places in ' + cityNames[cityKey] + '</h3><p style="color:var(--text-secondary);font-size:0.9rem;">Showing hotels, hospitals, restaurants & police stations sorted by proximity</p></div>';

    categories.forEach(cat => {
        const catPlaces = places.filter(p => p.type === cat.key).sort((a, b) => (a._dist || 9999) - (b._dist || 9999));
        if (catPlaces.length === 0) return;

        html += '<div class="places-category" style="grid-column:1/-1;">';
        html += '<div class="places-cat-header"><span class="places-cat-icon" style="background:' + cat.color + '22;color:' + cat.color + ';">' + cat.icon + '</span><h4>' + cat.label + '</h4><span class="places-cat-count">' + catPlaces.length + ' found</span></div>';
        html += '<div class="places-cat-grid">';

        catPlaces.forEach(p => {
            const stars = renderStars(p.rating);
            const dist = p._dist != null ? p._dist.toFixed(1) : '';
            const distBadge = dist ? '<span class="place-dist-badge"><i class="fas fa-location-arrow"></i> ' + dist + ' km</span>' : '';
            const budgetColor = p.budget.includes('Budget') ? '#27ae60' : p.budget.includes('Moderate') ? '#f39c12' : p.budget.includes('Premium') ? '#e67e22' : '#e74c3c';

            html += '<div class="place-card" data-type="' + p.type + '">';
            html += '<div class="place-card-top"><span class="place-type ' + p.type + '">' + p.type + '</span>' + distBadge + '</div>';
            html += '<h4>' + (p.img || '') + ' ' + p.name + '</h4>';
            html += '<p class="place-address"><i class="fas fa-map-pin" style="color:var(--text-muted);margin-right:4px;"></i>' + p.address + '</p>';
            html += '<div class="place-meta"><div class="place-rating">' + stars + ' <span>(' + p.rating.toFixed(1) + ')</span></div><div class="place-reviews"><i class="fas fa-comment"></i> ' + formatNumber(p.reviews) + ' reviews</div></div>';
            html += '<div class="place-budget"><span class="place-budget-tag" style="background:' + budgetColor + '22;color:' + budgetColor + ';">💰 ' + p.budget + '</span></div>';
            html += '<div class="place-actions"><a href="tel:' + p.phone + '" class="btn btn-primary"><i class="fas fa-phone"></i> Call</a><button class="btn btn-secondary" onclick="flyToZone(' + p.lat + ',' + p.lng + ')"><i class="fas fa-map-marker-alt"></i> Map</button></div>';
            html += '</div>';
        });

        html += '</div></div>';
    });

    container.innerHTML = html;

    // Also add markers on map
    addPlaceMarkers(places);
    if (lastKnownPosition && map) {
        map.panTo({lat: lastKnownPosition.lat, lng: lastKnownPosition.lng}); map.setZoom(12);
    } else if (cityKey && map) {
        const cc = CITY_COORDS[cityKey];
        map.panTo({lat: cc[0], lng: cc[1]}); map.setZoom(12);
    }
}

function renderStars(rating) {
    let html = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(rating)) html += '<i class="fas fa-star"></i>';
        else if (i - rating < 1) html += '<i class="fas fa-star-half-alt"></i>';
        else html += '<i class="far fa-star"></i>';
    }
    return html;
}

function formatNumber(n) {
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return n.toString();
}

function showNearbyPlaces() {
    renderDestinationPlaces();
    document.getElementById('map').scrollIntoView({ behavior: 'smooth' });
}

function addPlaceMarkers(places) {
    // Clear existing markers
    nearbyMarkers.forEach(m => map.removeLayer(m));
    nearbyMarkers = [];

    const colors = { hospital: '#3498db', police: '#9b59b6', hotel: '#f1c40f', restaurant: '#27ae60' };
    const iconLabels = { hospital: '🏥', police: '🚔', hotel: '🏨', restaurant: '🍽️' };

    places.forEach(place => {
        if (!place.lat || !place.lng) return;
        const color = colors[place.type] || '#ff6b35';
        const marker = L.circleMarker([place.lat, place.lng], {
            radius: 15000,
            fillColor: color,
            color: '#ffffff',
            weight: 2,
            fillOpacity: 0.9
        }).addTo(map);

        marker.bindPopup(
            '<div style="min-width:180px;font-family:inherit;">' +
            '<b>' + iconLabels[place.type] + ' ' + place.name + '</b><br>' +
            '<small>' + place.address + '</small><br>' +
            '<a href="tel:' + place.phone + '" style="color:#27ae60;font-weight:bold;">📞 ' + place.phone + '</a>' +
            (place._dist ? '<br><small>📍 ' + place._dist.toFixed(1) + ' km away</small>' : '') + '</div>'
        );

        nearbyMarkers.push(marker);
    });
}

function filterNearbyPlaces() {
    renderDestinationPlaces();
}

function filterPlaces(type) {
    renderDestinationPlaces();
}

function searchPlaces() {
    const query = document.getElementById('search-input').value.toLowerCase().trim();
    if (!query) { renderDestinationPlaces(); return; }
    const userCity = getUserCity();
    let cityKey = '';
    for (const k of Object.keys(CITY_COORDS)) { if (userCity.includes(k)) { cityKey = k; break; } }
    if (!cityKey) return;
    const places = samplePlaces.filter(p => p.city === cityKey && (p.name.toLowerCase().includes(query) || p.address.toLowerCase().includes(query) || p.type.toLowerCase().includes(query)));
    const container = document.getElementById('places-results');
    if (!container) return;
    if (places.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:var(--text-secondary);grid-column:1/-1;padding:40px;">No places found matching your search.</p>';
        return;
    }
    renderDestinationPlaces();
}

// ==================== TRANSLATOR ====================

// Language code mapping for MyMemory API
const myMemoryLangMap = {
    en:'en-GB', hi:'hi-IN', bn:'bn-IN', te:'te-IN', mr:'mr-IN',
    ta:'ta-IN', ur:'ur-PK', gu:'gu-IN', kn:'kn-IN', ml:'ml-IN',
    or:'or-IN', pa:'pa-IN', as:'as-IN', mai:'mai-IN', ks:'ks-IN',
    ne:'ne-NP', sd:'sd-PK', doi:'doi-IN',
    es:'es-ES', fr:'fr-FR', de:'de-DE', zh:'zh-CN', ja:'ja-JP',
    ko:'ko-KR', ar:'ar-SA', ru:'ru-RU', pt:'pt-PT', it:'it-IT',
    th:'th-TH', vi:'vi-VN', tr:'tr-TR', nl:'nl-NL', sv:'sv-SE', pl:'pl-PL'
};

/**
 * Search the offline phrasebook for an exact or close match.
 * Returns { from, to } phrase objects if found, null otherwise.
 */
function searchPhrasebook(input, fromLang, toLang) {
    if (typeof phrasebook === 'undefined') return null;
    const normalized = input.toLowerCase().trim();
    let bestMatch = null;
    for (const entry of phrasebook) {
        const sourceText = (entry[fromLang] || '').toLowerCase().trim();
        if (sourceText && (sourceText === normalized || normalized.includes(sourceText) || sourceText.includes(normalized))) {
            const hasTarget = entry[toLang] && entry[toLang].trim();
            if (hasTarget) return { from: entry[fromLang], to: entry[toLang] };
            if (!bestMatch) bestMatch = { from: entry[fromLang], to: entry[toLang] || entry['en'] || '' };
        }
    }
    return bestMatch;
}

async function translateText() {
    const input = document.getElementById('translator-input').value.trim();
    const fromLang = document.getElementById('translator-from').value;
    const toLang = document.getElementById('translator-to').value;

    if (!input) {
        showToast('Please enter text to translate');
        return;
    }

    const output = document.getElementById('translator-output');
    const statusEl = document.getElementById('translator-status');
    output.value = 'Translating...';
    if (statusEl) statusEl.textContent = '';

    // --- Step 1: Try offline phrasebook first (instant, no internet) ---
    const phraseMatch = searchPhrasebook(input, fromLang, toLang);
    if (phraseMatch && phraseMatch.to) {
        output.value = phraseMatch.to;
        if (statusEl) statusEl.innerHTML = '<i class="fas fa-check-circle"></i> Translated from offline phrasebook';
        return;
    }

    // --- Step 2: Try MyMemory API (free, no key needed) ---
    if (statusEl) statusEl.innerHTML = '<i class="fas fa-globe"></i> Translating online...';
    try {
        const sl = myMemoryLangMap[fromLang] || fromLang;
        const tl = myMemoryLangMap[toLang] || toLang;
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(input)}&langpair=${sl}|${tl}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.responseStatus === 200 && data.responseData && data.responseData.translatedText) {
            const translated = data.responseData.translatedText;
            // MyMemory sometimes returns the input if it can't translate
            if (translated.toLowerCase() !== input.toLowerCase()) {
                output.value = translated;
                if (statusEl) statusEl.innerHTML = '<i class="fas fa-globe"></i> Translated via MyMemory API';
                return;
            }
        }
    } catch (e) {
        console.log('MyMemory API failed, trying Google fallback:', e);
    }

    // --- Step 3: Fallback to Google Translate unofficial API ---
    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${fromLang}&tl=${toLang}&dt=t&q=${encodeURIComponent(input)}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data && data[0]) {
            const translated = data[0].map(item => item[0]).join('');
            output.value = translated;
            if (statusEl) statusEl.innerHTML = '<i class="fas fa-globe"></i> Translated via Google';
        } else {
            output.value = 'Translation unavailable.';
            if (statusEl) statusEl.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Translation unavailable — try a phrase from the quick phrases below';
        }
    } catch (error) {
        console.error('Translation error:', error);
        output.value = phraseMatch ? phraseMatch.to : 'No internet. Use quick phrases below for instant offline translation.';
        if (statusEl) statusEl.innerHTML = '<i class="fas fa-wifi"></i> Offline — use quick phrases below for instant translation';
    }
}

/**
 * Render the quick-phrase category tabs and phrase chips
 */
function renderPhraseCategories() {
    const container = document.getElementById('phrase-categories');
    if (!container || typeof phraseCategories === 'undefined') return;

    container.innerHTML = phraseCategories.map(cat => `
        <button class="phrase-category-btn" onclick="showPhrases('${cat.id}')" id="cat-${cat.id}">
            <span>${cat.icon}</span> ${cat.label}
        </button>
    `).join('');
}

function showPhrases(categoryId) {
    const toLang = document.getElementById('translator-to').value;
    const container = document.getElementById('phrase-chips');
    if (!container || typeof phrasebook === 'undefined') return;

    // Highlight active category
    document.querySelectorAll('.phrase-category-btn').forEach(b => b.classList.remove('active'));
    const catBtn = document.getElementById('cat-' + categoryId);
    if (catBtn) catBtn.classList.add('active');

    const cat = phraseCategories.find(c => c.id === categoryId);
    if (!cat) return;

    container.innerHTML = cat.phrases.map(idx => {
        const phrase = phrasebook[idx];
        if (!phrase) return '';
        const enText = phrase.en;
        const translated = phrase[toLang] || phrase['en'];
        return `<button class="phrase-chip" onclick="usePhrase('${enText.replace(/'/g, "\\'")}')" title="${translated}">
            <span class="phrase-en">${enText}</span>
            <span class="phrase-translated">${translated}</span>
        </button>`;
    }).join('');
}

function usePhrase(enText) {
    document.getElementById('translator-input').value = enText;
    translateText();
    // Scroll to translator
    document.getElementById('translator').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function showPhrasesForCurrentLang() {
    const activeCat = document.querySelector('.phrase-category-btn.active');
    showPhrases(activeCat ? activeCat.id.replace('cat-', '') : phraseCategories[0].id);
}

// Initialize phrasebook UI on load
setTimeout(() => {
    renderPhraseCategories();
    if (typeof phraseCategories !== 'undefined' && phraseCategories.length > 0) {
        showPhrases(phraseCategories[0].id);
    }
}, 100);

function swapLanguages() {
    const from = document.getElementById('translator-from');
    const to = document.getElementById('translator-to');
    const input = document.getElementById('translator-input');
    const output = document.getElementById('translator-output');

    const tempLang = from.value;
    from.value = to.value;
    to.value = tempLang;

    const tempText = input.value;
    input.value = output.value;
    output.value = tempText;
}

function speakTranslation() {
    const text = document.getElementById('translator-output').value;
    const lang = document.getElementById('translator-to').value;

    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9;
    speechSynthesis.speak(utterance);
}

function copyTranslation() {
    const text = document.getElementById('translator-output').value;
    if (!text) return;

    navigator.clipboard.writeText(text).then(() => {
        showToast('Translation copied to clipboard!');
    }).catch(() => {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('Translation copied!');
    });
}

// ==================== LANGUAGE / i18n ====================
function initLanguageSelector() {
    const select = document.getElementById('lang-select');
    if (select) {
        // Populate language options dynamically
        if (select.options.length <= 1) {
            const langs = [
                { v: 'en', t: 'English' }, { v: 'hi', t: 'हिन्दी' }, { v: 'bn', t: 'বাংলা' },
                { v: 'te', t: 'తెలుగు' }, { v: 'mr', t: 'मराठी' }, { v: 'ta', t: 'தமிழ்' },
                { v: 'ur', t: 'اردو' }, { v: 'gu', t: 'ગુજરાતી' }, { v: 'kn', t: 'ಕನ್ನಡ' },
                { v: 'ml', t: 'മലയാളം' }, { v: 'or', t: 'ଓଡ଼ିଆ' }, { v: 'pa', t: 'ਪੰਜਾਬੀ' },
                { v: 'as', t: 'অসমীয়া' }, { v: 'mai', t: 'मैथिली' }, { v: 'sat', t: 'ᱥᱟᱱᱛᱟᱲᱤ' },
                { v: 'ks', t: 'کٲشُر' }, { v: 'ne', t: 'नेपाली' }, { v: 'sd', t: 'سنڌي' },
                { v: 'doi', t: 'डोगरी' }, { v: 'mni', t: 'ꯃꯩꯇꯩ' }, { v: 'sat', t: 'ᱥᱟᱱᱛᱟᱲᱤ' },
                { v: 'es', t: 'Español' }, { v: 'fr', t: 'Français' }, { v: 'de', t: 'Deutsch' },
                { v: 'zh', t: '中文' }, { v: 'ja', t: '日本語' }, { v: 'ko', t: '한국어' },
                { v: 'ar', t: 'العربية' }, { v: 'ru', t: 'Русский' }, { v: 'pt', t: 'Português' },
                { v: 'it', t: 'Italiano' }, { v: 'th', t: 'ไทย' }, { v: 'vi', t: 'Tiếng Việt' },
                { v: 'tr', t: 'Türkçe' }, { v: 'nl', t: 'Nederlands' }, { v: 'sv', t: 'Svenska' },
                { v: 'pl', t: 'Polski' }
            ];
            select.innerHTML = '';
            langs.forEach(l => {
                const opt = document.createElement('option');
                opt.value = l.v; opt.textContent = l.t;
                select.appendChild(opt);
            });
        }
        select.value = currentLang;
        select.addEventListener('change', (e) => {
            currentLang = e.target.value;
            applyTranslations();
            renderDangerZones();
            var langNames = { en:'English', hi:'Hindi', bn:'Bengali', te:'Telugu', mr:'Marathi', ta:'Tamil', ur:'Urdu', gu:'Gujarati', kn:'Kannada', ml:'Malayalam', or:'Odia', pa:'Punjabi', as:'Assamese', mai:'Maithili', ks:'Kashmiri', ne:'Nepali', sd:'Sindhi', doi:'Dogri', mni:'Manipuri', sat:'Santali', bodo:'Bodo', es:'Spanish', fr:'French', de:'German', zh:'Chinese', ja:'Japanese', ko:'Korean', ar:'Arabic', ru:'Russian', pt:'Portuguese', it:'Italian', th:'Thai', vi:'Vietnamese', tr:'Turkish', nl:'Dutch', sv:'Swedish', pl:'Polish' };
            pushNotif('settings', 'info', '\u{1F310}', 'Language Changed', 'Interface language switched to ' + (langNames[currentLang] || currentLang) + '.');
        });
    }
}

function applyTranslations() {
    const langData = translations[currentLang] || translations['en'];

    // Apply translations to elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (langData[key]) {
            el.textContent = langData[key];
        }
    });

    // Apply placeholder translations
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (langData[key]) {
            el.placeholder = langData[key];
        }
    });

    // Update page title
    document.title = langData.brand + ' - ' + (langData.hero_subtitle || '');
}

// ==================== EMERGENCY CONTACTS ====================
function addEmergencyContact() {
    const name = document.getElementById('contact-name').value.trim();
    const phone = document.getElementById('contact-phone').value.trim();

    if (!name || !phone) {
        showToast('Please enter both name and phone number');
        return;
    }

    personalContacts.push({ name, phone, id: Date.now() });
    localStorage.setItem('bharatSurakshaContacts', JSON.stringify(personalContacts));
    renderPersonalContacts();

    document.getElementById('contact-name').value = '';
    document.getElementById('contact-phone').value = '';
    showToast(`${name} added to emergency contacts!`);
}

function removeContact(id) {
    personalContacts = personalContacts.filter(c => c.id !== id);
    localStorage.setItem('bharatSurakshaContacts', JSON.stringify(personalContacts));
    renderPersonalContacts();
    showToast('Contact removed');
}

function renderPersonalContacts() {
    const container = document.getElementById('personal-contacts');
    if (!container) return;

    if (personalContacts.length === 0) {
        container.innerHTML = '<p style="color:var(--text-muted);padding:10px;">No personal contacts added yet. Add trusted contacts below.</p>';
        return;
    }

    container.innerHTML = personalContacts.map(contact => `
        <div class="personal-contact">
            <div class="contact-info">
                <i class="fas fa-user"></i>
                <div>
                    <strong>${contact.name}</strong>
                    <span style="color:var(--text-muted);margin-left:8px;">${contact.phone}</span>
                </div>
            </div>
            <div class="contact-actions">
                <a href="tel:${contact.phone}" title="Call"><i class="fas fa-phone" style="color:#27ae60;"></i></a>
                <button onclick="removeContact(${contact.id})" title="Remove"><i class="fas fa-trash" style="color:#e74c3c;"></i></button>
            </div>
        </div>
    `).join('');
}

// ==================== SOS BUTTON ====================
function initSOSButton() {
    const sosButton = document.getElementById('sos-button');
    if (sosButton) {
        sosButton.addEventListener('click', handleSOS);
    }
}

function handleSOS() {
    const confirmed = confirm('🚨 EMERGENCY SOS\n\nThis will:\n1. Call Police (100)\n2. Share your location with emergency contacts\n\nProceed?');

    if (confirmed) {
        // Try to share location
        if (lastKnownPosition) {
            const locationUrl = `https://maps.google.com/?q=${lastKnownPosition.lat},${lastKnownPosition.lng}`;
            const message = `🚨 EMERGENCY! I need help!\n\nMy location: ${locationUrl}\n\nSent via Bharat Suraksha`;

            // Try Web Share API
            if (navigator.share) {
                navigator.share({
                    title: 'Emergency SOS - Bharat Suraksha',
                    text: message,
                    url: locationUrl
                }).catch(() => {});
            }

            // Alert personal contacts
            personalContacts.forEach(contact => {
                console.log(`Alert sent to ${contact.name}: ${message}`);
            });
        }

        // Call police
        window.location.href = 'tel:100';
    }
}

// ==================== NAVIGATION ====================
function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('open');
        });

        // Close menu on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
            });
        });
    }

    // Active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}

// ==================== UTILITIES ====================
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function toRad(deg) {
    return deg * (Math.PI / 180);
}

function showToast(message) {
    // Remove existing toasts
    document.querySelectorAll('.toast').forEach(t => t.remove());

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fas fa-info-circle"></i><span>${message}</span><button class="toast-dismiss" onclick="this.closest('.toast').remove()" aria-label="Close">\u00d7</button>`;
    document.body.appendChild(toast);

    const timer = setTimeout(() => {
        toast.remove();
    }, 5000);
    toast.querySelector('.toast-dismiss').addEventListener('click', () => clearTimeout(timer));
}

// ==================== LOGIN / REGISTER ====================
const DESTINATION_COORDS = {
    'jaipur': { lat: 26.9124, lng: 75.7873 }, 'delhi': { lat: 28.6139, lng: 77.2090 },
    'mumbai': { lat: 19.0760, lng: 72.8777 }, 'goa': { lat: 15.2993, lng: 74.1240 },
    'kashmir': { lat: 34.0837, lng: 74.7973 }, 'manali': { lat: 32.2432, lng: 77.1892 },
    'varanasi': { lat: 25.3176, lng: 83.0064 }, 'kolkata': { lat: 22.5726, lng: 88.3639 },
    'chennai': { lat: 13.0827, lng: 80.2707 }, 'bangalore': { lat: 12.9716, lng: 77.5946 },
    'agra': { lat: 27.1767, lng: 78.0081 }, 'udaipur': { lat: 24.5854, lng: 73.7125 },
    'shimla': { lat: 31.1048, lng: 77.1734 }, 'rishikesh': { lat: 30.0869, lng: 78.2676 },
    'hampi': { lat: 15.3350, lng: 76.4600 }, 'darjeeling': { lat: 27.0360, lng: 88.2627 },
    'pondicherry': { lat: 11.9416, lng: 79.8083 }, 'andaman': { lat: 11.7401, lng: 92.6586 },
    'ooty': { lat: 11.4102, lng: 76.6950 }, 'coorg': { lat: 12.4244, lng: 75.7382 },
    'pushkar': { lat: 26.4900, lng: 74.5511 }, 'mysore': { lat: 12.2958, lng: 76.6394 },
    'pune': { lat: 18.5204, lng: 73.8567 }, 'hyderabad': { lat: 17.3850, lng: 78.4867 },
    'lucknow': { lat: 26.8467, lng: 80.9462 }, 'patna': { lat: 25.6093, lng: 85.1376 },
    'gangtok': { lat: 27.3389, lng: 88.6065 }, 'ladakh': { lat: 34.1526, lng: 77.5771 },
};

function showLoginTab(tab) {
    document.querySelectorAll('.login-tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById('login-form').style.display = tab === 'login' ? 'block' : 'none';
    document.getElementById('register-form').style.display = tab === 'register' ? 'block' : 'none';
}

function handleLogin() {
    const name = document.getElementById('login-name').value.trim();
    const password = document.getElementById('login-password').value.trim();
    if (!name || !password) { showToast('Please fill in all fields'); return; }
    const users = JSON.parse(localStorage.getItem('bharatSurakshaUsers') || '{}');
    if (users[name] && users[name].password === password) {
        localStorage.setItem('bharatSurakshaCurrentUser', JSON.stringify(users[name]));
        enterApp();
    } else {
        showToast('Account not created. Please register first.');
    }
}

function handleRegister() {
    const name = document.getElementById('reg-name').value.trim();
    const password = document.getElementById('reg-password').value.trim();
    if (!name || !password) { showToast('Please fill in name and password'); return; }
    if (password.length < 4) { showToast('Password must contain at least 4 characters'); return; }
    const user = {
        name, password,
        nationality: document.getElementById('reg-nationality').value,
        language: document.getElementById('reg-language').value,
        location: document.getElementById('reg-location').value.trim() || 'Not specified',
        destination: document.getElementById('reg-destination').value.trim() || 'Not specified',
        budget: document.getElementById('reg-budget').value,
        accessibility: document.getElementById('reg-accessibility').value,
    };
    const users = JSON.parse(localStorage.getItem('bharatSurakshaUsers') || '{}');
    users[name] = user;
    localStorage.setItem('bharatSurakshaUsers', JSON.stringify(users));
    localStorage.setItem('bharatSurakshaCurrentUser', JSON.stringify(user));
    showToast('Account created! Welcome, ' + name);
    enterApp();
}

function enterApp() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('main-app').classList.add('visible');
    var user = getCurrentUser();
    if (user && user.name) {
        pushNotif('account', 'info', '\u{1F44B}', 'Welcome, ' + user.name + '!', 'Logged in successfully. Destination: ' + (user.destination || 'Not set') + '.');
    }
    populateDashboard();
    initNotifications();
    // Initialize map with retry
    setTimeout(() => { try { ensureMapInitialized(); } catch(e) {} }, 500);

    setTimeout(() => { try { if (!mapInitialized) initMap(); mapInitialized = true; } catch(e) {} }, 1500);
}

// ══════════════════════════════════════════════════
// NOTIFICATION SYSTEM
// ══════════════════════════════════════════════════

let notifications = [];
let notifFilter = 'all';
const NOTIF_STORAGE_KEY = 'bharatSurakshaNotifications';

function initNotifications() {
    // Load saved notifications
    const saved = localStorage.getItem(NOTIF_STORAGE_KEY);
    if (saved) {
        try { notifications = JSON.parse(saved); } catch(e) { notifications = []; }
    }

    // Generate fresh notifications
    generateNotifications();

    // Render
    renderNotifs();
    updateNotifBadge();

    // Bell toggle
    const bell = document.getElementById('notif-bell');
    const panel = document.getElementById('notif-panel');
    if (bell) {
        bell.addEventListener('click', function(e) {
            e.stopPropagation();
            panel.classList.toggle('open');
            bell.classList.toggle('active');
        });
    }

    // Close panel when clicking outside
    document.addEventListener('click', function(e) {
        if (panel && !panel.contains(e.target) && !bell.contains(e.target)) {
            panel.classList.remove('open');
            bell.classList.remove('active');
        }
    });

    // Show toast for unread critical/warning notifications after 2s
    setTimeout(() => {
        const unread = notifications.filter(n => !n.read && (n.severity === 'critical' || n.severity === 'warning') && !n.toastShown);
        unread.slice(0, 2).forEach(n => {
            showToast(n);
            n.toastShown = true;
        });
        saveNotifs();
    }, 2000);
}

function generateNotifications() {
    const user = JSON.parse(localStorage.getItem('bharatSurakshaCurrentUser') || '{}');
    const dest = (user.destination || '').toLowerCase();
    const now = new Date();
    const month = now.getMonth() + 1;
    const newNotifs = [];

    // Weather-based alerts
    const weatherAlerts = getWeatherNotifications(dest, month);
    weatherAlerts.forEach(a => {
        if (!notifications.find(n => n.id === a.id)) newNotifs.push(a);
    });

    // Safety alerts
    const safetyAlerts = getSafetyNotifications(dest);
    safetyAlerts.forEach(a => {
        if (!notifications.find(n => n.id === a.id)) newNotifs.push(a);
    });

    // Crowd alerts
    const crowdAlerts = getCrowdNotifications(dest);
    crowdAlerts.forEach(a => {
        if (!notifications.find(n => n.id === a.id)) newNotifs.push(a);
    });

    // Accessibility tips
    if (user.accessibility && user.accessibility !== 'none') {
        const accessNotifs = getAccessibilityNotifications(user.accessibility, dest);
        accessNotifs.forEach(a => {
            if (!notifications.find(n => n.id === a.id)) newNotifs.push(a);
        });
    }

    // General info
    const infoNotifs = getGeneralNotifications(dest);
    infoNotifs.forEach(a => {
        if (!notifications.find(n => n.id === a.id)) newNotifs.push(a);
    });

    // Add new notifications at the top
    notifications = [...newNotifs, ...notifications];

    // Keep max 50
    if (notifications.length > 50) notifications = notifications.slice(0, 50);

    saveNotifs();
}

function getWeatherNotifications(dest, month) {
    const alerts = [];

    // Monsoon alerts (Jun-Sep)
    if (month >= 6 && month <= 9) {
        alerts.push({
            id: 'weather-monsoon-' + month,
            category: 'weather',
            severity: 'warning',
            icon: '🌧️',
            title: 'Monsoon Alert',
            message: 'Heavy rainfall expected. Carry rain gear and avoid low-lying areas.',
            time: new Date().toISOString(),
            read: false
        });
        if (['mumbai', 'kolkata', 'chennai', 'mumbai', 'goa'].some(c => dest.includes(c))) {
            alerts.push({
                id: 'weather-flood-' + dest.substring(0,5),
                category: 'weather',
                severity: 'critical',
                icon: '🌊',
                title: 'Waterlogging Risk',
                message: `${user.destination || 'Your destination'} is prone to waterlogging during monsoon. Avoid travel during heavy rain.`,
                time: new Date().toISOString(),
                read: false
            });
        }
    }

    // Cyclone season (Oct-Dec)
    if (month >= 10 && month <= 12) {
        if (['chennai', 'kolkata', 'andaman', 'odisha', 'visakhapatnam'].some(c => dest.includes(c))) {
            alerts.push({
                id: 'weather-cyclone-' + month,
                category: 'weather',
                severity: 'critical',
                icon: '🌀',
                title: 'Cyclone Season Warning',
                message: 'Cyclone season active in coastal areas. Monitor IMD advisories before travel.',
                time: new Date().toISOString(),
                read: false
            });
        }
    }

    // Heat wave (Mar-Jun)
    if (month >= 3 && month <= 6) {
        if (['rajasthan', 'jaipur', 'jodhpur', 'udaipur', 'jaisalmer', 'delhi', 'agra', 'lucknow'].some(c => dest.includes(c))) {
            alerts.push({
                id: 'weather-heat-' + month,
                category: 'weather',
                severity: 'warning',
                icon: '🌡️',
                title: 'Extreme Heat Warning',
                message: 'Temperatures above 42°C expected. Stay hydrated, avoid outdoor 12PM-4PM.',
                time: new Date().toISOString(),
                read: false
            });
        }
    }

    // Winter pollution
    if (month >= 11 || month <= 2) {
        if (['delhi', 'agra', 'lucknow', 'patna'].some(c => dest.includes(c))) {
            alerts.push({
                id: 'weather-pollution-' + month,
                category: 'weather',
                severity: 'warning',
                icon: '😷',
                title: 'Air Quality Alert',
                message: 'AQI in "Very Poor" category. Wear N95 masks outdoors. Sensitive groups should stay indoors.',
                time: new Date().toISOString(),
                read: false
            });
        }
    }

    // UV Index (always)
    alerts.push({
        id: 'weather-uv-' + month,
        category: 'weather',
        severity: 'info',
        icon: '☀️',
        title: 'UV Index Advisory',
        message: 'Apply SPF 50+ sunscreen. Wear sunglasses and a hat when outdoors.',
        time: new Date().toISOString(),
        read: false
    });

    return alerts;
}

function getSafetyNotifications(dest) {
    const alerts = [];

    const dangerZones = [
        { match: ['kashmir', 'srinagar', 'anantnag', 'baramulla'], title: 'Kashmir Security Advisory', msg: 'Exercise extreme caution. Check current security situation before travel. Avoid remote areas.', severity: 'critical', icon: '⚠️' },
        { match: ['manali', 'leh', 'ladakh', 'rohtang'], title: 'Landslide Risk', msg: 'Road conditions may be hazardous. Check HP tourism alerts before travel. Carry emergency supplies.', severity: 'warning', icon: '🏔️' },
        { match: ['chamoli', 'uttarakhand', 'rishikesh', 'kedarnath', 'badrinath'], title: 'Flash Flood Advisory', msg: 'Uttarakhand is prone to flash floods during monsoon. Monitor river levels and weather advisories.', severity: 'warning', icon: '🌊' },
        { match: ['northeast', 'assam', 'manipur', 'nagaland', 'mizoram', 'tripura'], title: 'Seismic Zone Alert', msg: 'Northeast India falls in high seismic zone. Know earthquake safety protocols.', severity: 'warning', icon: '🌍' },
        { match: ['andaman', 'nicobar'], title: 'Tsunami Zone', msg: 'Andaman & Nicobar Islands are in tsunami-prone zone. Know evacuation routes upon arrival.', severity: 'info', icon: '🌊' },
    ];

    dangerZones.forEach(dz => {
        if (dz.match.some(matchWord => dest.includes(matchWord))) {
            alerts.push({
                id: 'safety-' + dz.match[0] + '-' + Date.now(),
                category: 'safety',
                severity: dz.severity,
                icon: dz.icon,
                title: dz.title,
                message: dz.msg,
                time: new Date().toISOString(),
                read: false
            });
        }
    });

    // General safety tip
    alerts.push({
        id: 'safety-tips-general',
        category: 'safety',
        severity: 'info',
        icon: '🛡️',
        title: 'Safety Tip',
        message: 'Always share your live location with a trusted contact. Keep emergency numbers handy.',
        time: new Date().toISOString(),
        read: false
    });

    return alerts;
}

function getCrowdNotifications(dest) {
    const alerts = [];

    const crowdedSpots = [
        { name: 'Taj Mahal', loc: ['agra', 'taj'], crowd: 92, peak: '10AM-2PM' },
        { name: 'Red Fort', loc: ['delhi'], crowd: 88, peak: '11AM-3PM' },
        { name: 'Gateway of India', loc: ['mumbai'], crowd: 85, peak: '5PM-9PM' },
        { name: 'Amber Fort', loc: ['jaipur', 'rajasthan'], crowd: 80, peak: '10AM-1PM' },
        { name: 'Marine Drive', loc: ['mumbai'], crowd: 78, peak: '6PM-10PM' },
        { name: 'Vaishno Devi', loc: ['katra', 'vaishno'], crowd: 90, peak: '4AM-10AM' },
    ];

    crowdedSpots.forEach(spot => {
        if (spot.loc.some(l => dest.includes(l)) && spot.crowd >= 85) {
            alerts.push({
                id: 'crowd-' + spot.name.replace(/\s/g, '').toLowerCase(),
                category: 'crowd',
                severity: spot.crowd > 90 ? 'critical' : 'warning',
                icon: '👥',
                title: `Overcrowding at ${spot.name}`,
                message: `Current crowd level: ${spot.crowd}%. Peak hours: ${spot.peak}. Visit early morning or late evening for a better experience.`,
                time: new Date().toISOString(),
                read: false
            });
        }
    });

    return alerts;
}

function getAccessibilityNotifications(accessType, dest) {
    const tips = {
        wheelchair: { icon: '♿', title: 'Wheelchair Accessibility Tip', message: 'Many Indian monuments have limited wheelchair access. Contact ASI (Archaeological Survey of India) before visiting. Metro stations in Delhi, Mumbai, and Bangalore have wheelchair facilities.' },
        visual: { icon: '👁️', title: 'Visual Impairment Tip', message: 'Download the "Seeing AI" app for free. Most railway stations have tactile paths. Ask for assistance at airport counters — entitled to free wheelchair/assistance service.' },
        hearing: { icon: '👂', title: 'Hearing Impairment Tip', message: 'Keep written communication cards ready in Hindi/local language. Many tourist offices have staff who can assist with sign language via video call.' },
        mobility: { icon: '🦽', title: 'Limited Mobility Tip', message: 'Book accessible hotel rooms in advance. Use pre-paid taxi services for comfortable travel. Many temples have special entry queues for disabled visitors.' },
        other: { icon: 'ℹ️', title: 'Accessibility Info', message: 'Dial disability helpline: 1800-180-1551 (toll-free). Tourist information centers at major stations can assist with special needs.' }
    };

    const tip = tips[accessType];
    if (tip) {
        return [{
            id: 'access-' + accessType,
            category: 'accessibility',
            severity: 'info',
            icon: tip.icon,
            title: tip.title,
            message: tip.message,
            time: new Date().toISOString(),
            read: false
        }];
    }
    return [];
}

function getGeneralNotifications(dest) {
    const notifs = [];

    // SIM card info for foreign tourists
    notifs.push({
        id: 'info-sim-tourist',
        category: 'info',
        severity: 'info',
        icon: '📱',
        title: 'Tourist SIM Card',
        message: 'Foreign tourists: Get a prepaid SIM at airport counters (Jio, Airtel, Vi). Carry passport copy & photo. Activation takes 2-24 hours.',
        time: new Date().toISOString(),
        read: false
    });

    // Railway safety
    if (dest.includes('train') || dest.includes('railway')) {
        notifs.push({
            id: 'info-rail-safety',
            category: 'info',
            severity: 'info',
            icon: '🚂',
            title: 'Railway Safety',
            message: 'Use only official IRCTC counters for tickets. Keep luggage tagged. Emergency button is available in every coach.',
            time: new Date().toISOString(),
            read: false
        });
    }

    // Food safety
    notifs.push({
        id: 'info-food-safety',
        category: 'info',
        severity: 'info',
        icon: '🍽️',
        title: 'Food Safety Tip',
        message: 'Drink only bottled or purified water. Avoid street food from unhygienic stalls. Carry ORS packets for emergencies.',
        time: new Date().toISOString(),
        read: false
    });

    return notifs;
}

function renderNotifs() {
    const list = document.getElementById('notif-list');
    if (!list) return;

    const filtered = notifFilter === 'all'
        ? notifications
        : notifications.filter(n => n.category === notifFilter);

    if (filtered.length === 0) {
        list.innerHTML = '<div class="notif-empty"><i class="fas fa-bell-slash"></i><p>No notifications</p></div>';
        return;
    }

    list.innerHTML = filtered.map(n => {
        const timeStr = getTimeAgo(new Date(n.time));
        return `
            <div class="notif-item ${n.read ? '' : 'unread'}" onclick="readNotif('${n.id}')">
                <div class="notif-icon ${n.severity}">${n.icon}</div>
                <div class="notif-content">
                    <h4>${n.title}</h4>
                    <p>${n.message}</p>
                    <div class="notif-time">${timeStr}</div>
                </div>
                <button class="notif-dismiss" onclick="event.stopPropagation(); dismissNotif('${n.id}')" title="Dismiss">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
    }).join('');
}

function getTimeAgo(date) {
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
    if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
    return Math.floor(diff / 86400) + 'd ago';
}

function readNotif(id) {
    const notif = notifications.find(n => n.id === id);
    if (notif) {
        notif.read = true;
        saveNotifs();
        renderNotifs();
        updateNotifBadge();
    }
}

function dismissNotif(id) {
    notifications = notifications.filter(n => n.id !== id);
    saveNotifs();
    renderNotifs();
    updateNotifBadge();
}

function markAllNotifsRead() {
    notifications.forEach(n => n.read = true);
    saveNotifs();
    renderNotifs();
    updateNotifBadge();
}

function clearAllNotifs() {
    notifications = [];
    saveNotifs();
    renderNotifs();
    updateNotifBadge();
}

function filterNotifs(category, btn) {
    notifFilter = category;
    document.querySelectorAll('.notif-filter-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    renderNotifs();
}

function updateNotifBadge() {
    const badge = document.getElementById('notif-badge');
    if (!badge) return;
    const unread = notifications.filter(n => !n.read).length;
    badge.textContent = unread > 9 ? '9+' : unread;
    badge.classList.toggle('empty', unread === 0);
}

function saveNotifs() {
    localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(notifications));
}

function pushNotif(category, severity, icon, title, message) {
    const id = category + '-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);
    const notif = {
        id: id,
        category: category,
        severity: severity,
        icon: icon,
        title: title,
        message: message,
        time: new Date().toISOString(),
        read: false
    };
    notifications.unshift(notif);
    if (notifications.length > 50) notifications = notifications.slice(0, 50);
    saveNotifs();
    renderNotifs();
    updateNotifBadge();
    showToast(notif);
    return notif;
}

function showToast(notif) {
    const toastContainer = document.getElementById('notif-toast');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'notif-toast-item ' + notif.severity;
    toast.innerHTML = `
        <span class="toast-icon">${notif.icon}</span>
        <div class="toast-text">
            <h4>${notif.title}</h4>
            <p>${notif.message}</p>
        </div>
        <button class="toast-dismiss" onclick="this.closest('.notif-toast-item').remove()" aria-label="Close">\u00d7</button>
    `;
    toastContainer.appendChild(toast);

    const timer = setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 5000);
    toast.querySelector('.toast-dismiss').addEventListener('click', () => clearTimeout(timer));
}

// ══════════════════════════════════════════════════
// THEME TOGGLE
// ══════════════════════════════════════════════════

const THEME_KEY = 'bharatSurakshaTheme';

function applyTheme(theme) {
    if (theme === 'light') {
        document.body.classList.add('light-theme');
    } else {
        document.body.classList.remove('light-theme');
    }
}

function toggleTheme() {
    const isLight = document.body.classList.contains('light-theme');
    const newTheme = isLight ? 'dark' : 'light';
    applyTheme(newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
}

// Apply saved theme on page load (before DOM ready for instant effect)
(function() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) applyTheme(saved);
})();

function handleLogout() {
    localStorage.removeItem('bharatSurakshaCurrentUser');
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('main-app').classList.remove('visible');
}

// ══════════════════════════════════════════════════
// EDIT PROFILE MODAL
// ══════════════════════════════════════════════════

function openProfileModal() {
    const user = JSON.parse(localStorage.getItem('bharatSurakshaCurrentUser') || '{}');
    document.getElementById('edit-location').value = user.location || '';
    document.getElementById('edit-destination').value = user.destination || '';
    document.getElementById('edit-budget').value = user.budget || 'Moderate';
    document.getElementById('edit-accessibility').value = user.accessibility || 'none';
    document.getElementById('edit-nationality').value = user.nationality || 'Indian';
    document.getElementById('edit-language').value = user.language || 'en';
    document.getElementById('profile-modal').classList.add('open');
}

function closeProfileModal() {
    document.getElementById('profile-modal').classList.remove('open');
}

function saveProfile() {
    const user = JSON.parse(localStorage.getItem('bharatSurakshaCurrentUser') || '{}');
    const oldDest = user.destination;
    const oldBudget = user.budget;
    user.location = document.getElementById('edit-location').value.trim();
    user.destination = document.getElementById('edit-destination').value.trim();
    user.budget = document.getElementById('edit-budget').value;
    user.accessibility = document.getElementById('edit-accessibility').value;
    user.nationality = document.getElementById('edit-nationality').value;
    user.language = document.getElementById('edit-language').value;
    localStorage.setItem('bharatSurakshaCurrentUser', JSON.stringify(user));
    closeProfileModal();
    populateDashboard();
    // Re-generate notifications based on updated destination/accessibility
    notifications = [];
    generateNotifications();
    renderNotifs();
    updateNotifBadge();
    // Show saved toast
    const toast = document.createElement('div');
    toast.className = 'profile-saved-toast';
    toast.innerHTML = '<i class="fas fa-check-circle"></i> Profile updated successfully!';
    document.body.appendChild(toast);
    setTimeout(() => { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 3000);
}

// Close modal on overlay click
document.addEventListener('click', function(e) {
    const modal = document.getElementById('profile-modal');
    if (modal && modal.classList.contains('open') && e.target === modal) {
        closeProfileModal();
    }
});

// Close modal on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeProfileModal();
});

function populateDashboard() {
    const user = JSON.parse(localStorage.getItem('bharatSurakshaCurrentUser') || '{}');
    if (!user.name) return;
    document.getElementById('dash-welcome-text').textContent = 'Welcome, ' + user.name + '!';
    document.getElementById('dash-avatar').textContent = user.name.charAt(0).toUpperCase();
    document.getElementById('dash-user-name').textContent = user.name;
    document.getElementById('dash-user-dest').textContent = 'Destination: ' + user.destination;
    document.getElementById('dash-nationality').textContent = user.nationality || '--';
    document.getElementById('dash-budget').textContent = user.budget || '--';
    document.getElementById('dash-from').textContent = user.location || '--';
    document.getElementById('dash-to').textContent = user.destination || '--';
    const langNames = {en:'English',hi:'Hindi',bn:'Bengali',te:'Telugu',mr:'Marathi',ta:'Tamil',ur:'Urdu',gu:'Gujarati',kn:'Kannada',ml:'Malayalam',or:'Odia',pa:'Punjabi',ne:'Nepali'};
    document.getElementById('dash-lang').textContent = langNames[user.language] || user.language || '--';
    const accLabels = {none:'None',wheelchair:'Wheelchair',visual:'Visual',hearing:'Hearing',mobility:'Mobility',other:'Other'};
    document.getElementById('dash-access').textContent = accLabels[user.accessibility] || user.accessibility || '--';

    generateWeatherAlerts(user.destination);
    generateCrowdAlerts(user.destination);
    generateAccessibilityInfo(user.destination, user.accessibility);
    setTimeout(() => {
        var fromCity = user.location;
        if (lastKnownPosition) {
            fromCity = lastKnownPosition.lat + ',' + lastKnownPosition.lng;
        }
        initRouteMap(fromCity, user.destination);
    }, 200);
    var dangerFrom = lastKnownPosition ? lastKnownPosition.lat + ',' + lastKnownPosition.lng : user.location;
    generateRouteDangerAlerts(dangerFrom, user.destination);
    generateAttractions(user.destination);
}

// ==================== WEATHER ALERTS ====================
function generateWeatherAlerts(destination) {
    const alerts = [];
    const dest = (destination || '').toLowerCase();
    const month = new Date().getMonth();
    const isMonsoon = month >= 5 && month <= 9;
    const isWinter = month >= 10 || month <= 2;

    if (isMonsoon) {
        alerts.push({ severity: 'severe', icon: '🌧️', title: 'Heavy Monsoon Rainfall', desc: 'Active monsoon season. Expect heavy rainfall, waterlogging, and flight/train delays.', time: 'Current' });
        alerts.push({ severity: 'moderate', icon: '⛈️', title: 'Thunderstorm Warning', desc: 'Thunderstorms expected in the next 6 hours. Stay indoors if possible.', time: '6h' });
    }
    if (dest.includes('kashmir') || dest.includes('manali') || dest.includes('shimla') || dest.includes('ladakh') || dest.includes('rishikesh')) {
        alerts.push({ severity: 'severe', icon: '🏔️', title: 'Landslide Risk', desc: 'High risk of landslides on mountain roads. Avoid travel during heavy rain.', time: 'Ongoing' });
    }
    if (dest.includes('chennai') || dest.includes('kolkata') || dest.includes('pondicherry') || dest.includes('andaman')) {
        if (month >= 9 && month <= 11) {
            alerts.push({ severity: 'severe', icon: '🌀', title: 'Cyclone Alert', desc: 'Cyclone season active. Coastal areas at risk. Monitor IMD updates.', time: 'Oct-Dec' });
        }
    }
    if (dest.includes('jaipur') || dest.includes('udaipur') || dest.includes('pushkar')) {
        if (!isMonsoon) {
            alerts.push({ severity: 'moderate', icon: '🌡️', title: 'Extreme Heat Warning', desc: 'Temperatures may exceed 42°C. Stay hydrated. Avoid outdoor activity 12-3 PM.', time: 'Daytime' });
        }
    }
    if (dest.includes('delhi') || dest.includes('agra') || dest.includes('lucknow')) {
        if (isWinter) {
            alerts.push({ severity: 'moderate', icon: '😷', title: 'Air Quality Alert', desc: 'AQI levels may exceed 300+. Wear N95 masks. Avoid outdoor exercise.', time: 'Nov-Feb' });
        }
    }
    if (dest.includes('goa') || dest.includes('mumbai')) {
        alerts.push({ severity: 'mild', icon: '🌊', title: 'High Tide Advisory', desc: 'High tides expected. Stay away from shore during advisory hours.', time: 'Check local' });
    }
    alerts.push({ severity: 'mild', icon: '☀️', title: 'UV Index: High', desc: 'Apply SPF 50+ sunscreen. Wear sunglasses and a hat outdoors.', time: 'Always' });

    const container = document.getElementById('weather-alerts');
    if (!container) return;
    container.innerHTML = alerts.map(a => `
        <div class="weather-alert ${a.severity}">
            <span class="alert-icon">${a.icon}</span>
            <div class="alert-content"><h4>${a.title}</h4><p>${a.desc}</p></div>
            <span class="alert-time">${a.time}</span>
        </div>
    `).join('');
}

// ==================== OVERCROWDING ====================
function generateCrowdAlerts(destination) {
    const user = JSON.parse(localStorage.getItem('bharatSurakshaCurrentUser') || '{}');
    const origin = (user.location || '').toLowerCase();
    const dest = (destination || '').toLowerCase();

    const allSpots = [
        { name: 'Red Fort, Delhi', city: 'delhi', level: 'high', pct: 85, tip: 'Visit before 9 AM or after 5 PM' },
        { name: 'Taj Mahal, Agra', city: 'agra', level: 'extreme', pct: 95, tip: 'Buy tickets online. Friday closed. Go early.' },
        { name: 'Gateway of India, Mumbai', city: 'mumbai', level: 'high', pct: 80, tip: 'Weekdays are less crowded' },
        { name: 'Hawa Mahal, Jaipur', city: 'jaipur', level: 'moderate', pct: 60, tip: 'Early morning is best for photos' },
        { name: 'Varanasi Ghats', city: 'varanasi', level: 'high', pct: 88, tip: 'Evening aarti is very crowded. Arrive early.' },
        { name: 'Marina Beach, Chennai', city: 'chennai', level: 'extreme', pct: 92, tip: 'Avoid weekends and evenings' },
        { name: 'Howrah Bridge, Kolkata', city: 'kolkata', level: 'moderate', pct: 65, tip: 'Morning hours are calmer' },
        { name: 'Mysore Palace', city: 'mysore', level: 'moderate', pct: 55, tip: 'Sunday illumination draws large crowds' },
        { name: 'Meenakshi Temple, Madurai', city: 'madurai', level: 'high', pct: 78, tip: 'Festival days are extremely crowded' },
        { name: 'Golden Temple, Amritsar', city: 'amritsar', level: 'moderate', pct: 70, tip: 'Langar hall is always busy — try off-peak hours' },
        { name: 'Charminar, Hyderabad', city: 'hyderabad', level: 'high', pct: 82, tip: 'Evening market is very crowded' },
        { name: 'Qutub Minar, Delhi', city: 'delhi', level: 'high', pct: 78, tip: 'Weekends are crowded. Go on weekdays.' },
        { name: 'India Gate, Delhi', city: 'delhi', level: 'moderate', pct: 70, tip: 'Evening time is busiest' },
        { name: 'Chhatrapati Shivaji Terminus, Mumbai', city: 'mumbai', level: 'extreme', pct: 90, tip: 'Rush hours 8-10 AM, 5-8 PM extremely crowded' },
        { name: 'Amber Fort, Jaipur', city: 'jaipur', level: 'high', pct: 82, tip: 'Jeep ride queue is long. Go early.' },
        { name: 'City Palace, Jaipur', city: 'jaipur', level: 'moderate', pct: 65, tip: 'Guided tours reduce wait time' },
        { name: 'Meenakshi Temple, Madurai', city: 'madurai', level: 'high', pct: 78, tip: 'Festival days are extremely crowded' },
    ];

    // Filter: only show spots in origin city, destination city, or on route
    const routeSpots = allSpots.filter(s => {
        const c = s.city.toLowerCase();
        return origin.includes(c) || dest.includes(c);
    });

    // If no route-specific spots found, show destination spots
    const spots = routeSpots.length > 0 ? routeSpots : allSpots.filter(s => dest.includes(s.city));
    // Fallback: show first 5
    const finalSpots = spots.length > 0 ? spots : allSpots.slice(0, 5);

    const container = document.getElementById('crowd-list');
    if (!container) return;

    if (finalSpots.length === 0) {
        container.innerHTML = '<p style="color:var(--text-muted);font-size:0.9rem;text-align:center;padding:20px;">No crowd data available for your route.</p>';
        return;
    }

    container.innerHTML = finalSpots.map(s => {
        const barColor = s.pct > 85 ? '#e74c3c' : s.pct > 65 ? '#f39c12' : '#27ae60';
        const routeTag = (origin.includes(s.city) || dest.includes(s.city)) ? '<span style="font-size:0.65rem;background:rgba(0,150,214,0.15);color:#0096d6;padding:1px 6px;border-radius: 15000px;margin-left:6px;">ON ROUTE</span>' : '';
        return `
        <div class="crowd-item">
            <div class="crowd-level ${s.level}">${s.pct}%</div>
            <div class="crowd-info"><h4>${s.name}${routeTag}</h4><p>${s.tip}</p></div>
            <div class="crowd-bar"><div class="crowd-fill" style="width:${s.pct}%;background:${barColor};"></div></div>
        </div>`;
    }).join('');
}

// ==================== ACCESSIBILITY INFO ====================
function generateAccessibilityInfo(destination, accessibility) {
    const data = [
        { icon: '🏛️', name: 'Monuments & Museums', desc: 'Wheelchair ramps available at major sites. Ask at entry for assistance.', rating: 3 },
        { icon: '🚂', name: 'Railway Stations', desc: 'Dedicated counters for disabled travelers. Ramps available at major stations.', rating: 3 },
        { icon: '✈️', name: 'Airports', desc: 'Full wheelchair assistance available. Book 24h in advance.', rating: 4 },
        { icon: '🏨', name: 'Hotels', desc: 'Many hotels offer accessible rooms. Book in advance and confirm.', rating: 3 },
        { icon: '🚌', name: 'Public Transport', desc: 'Limited accessibility in buses. Metro systems are more accessible.', rating: 2 },
        { icon: '🗺️', name: 'Tourist Sites', desc: 'Carry a portable ramp if needed. Many older sites have steps only.', rating: 2 },
        { icon: '🍽️', name: 'Restaurants', desc: 'Fine dining is usually accessible. Street food areas may be difficult.', rating: 3 },
        { icon: '🏥', name: 'Hospitals', desc: 'Government hospitals have disability departments. Private hospitals are better equipped.', rating: 4 },
    ];
    if (accessibility && accessibility !== 'none') {
        const labels = { wheelchair: 'wheelchair users', visual: 'visually impaired', hearing: 'hearing impaired', mobility: 'mobility limited', other: 'special needs' };
        data.unshift({ icon: '♿', name: 'Your Accessibility Profile', desc: `Tips for ${labels[accessibility] || 'differently-abled'} travelers in this region. Call 1800-180-1551 (Toll Free) for disability helpline.`, rating: 3 });
    }
    const container = document.getElementById('accessibility-list');
    if (!container) return;
    container.innerHTML = data.map(d => {
        const stars = Array(5).fill(0).map((_, i) => `<span class="star ${i < d.rating ? 'filled' : 'empty'}">★</span>`).join('');
        return `
        <div class="access-item">
            <span class="access-icon">${d.icon}</span>
            <div class="access-info"><h4>${d.name}</h4><p>${d.desc}</p></div>
            <div class="access-rating">${stars}</div>
        </div>`;
    }).join('');
}

const CITY_ATTRACTIONS = {
    delhi: [
        { name: 'Red Fort', cat: 'heritage', desc: 'UNESCO World Heritage Mughal fort built in 1638', icon: '🏰' },
        { name: 'Qutub Minar', cat: 'heritage', desc: '73m tall victory tower, UNESCO site since 1993', icon: '🗼' },
        { name: 'India Gate', cat: 'monument', desc: '42m war memorial arch, iconic landmark of Delhi', icon: '🏛️' },
        { name: 'Humayun\'s Tomb', cat: 'heritage', desc: 'Mughal garden tomb, precursor to the Taj Mahal', icon: '🕌' },
        { name: 'Lotus Temple', cat: 'spiritual', desc: 'Stunning lotus-shaped Bahá\'í House of Worship', icon: '🪷' },
        { name: 'Chandni Chowk', cat: 'market', desc: 'One of oldest & busiest markets in Old Delhi', icon: '🛒' },
        { name: 'Akshardham Temple', cat: 'spiritual', desc: 'Sprawling Hindu temple complex with exhibitions', icon: '🛕' },
        { name: 'Jama Masjid', cat: 'spiritual', desc: 'India\'s largest mosque, built by Shah Jahan', icon: '🕌' },
        { name: 'Connaught Place', cat: 'shopping', desc: 'Colonial-era shopping & dining hub', icon: '🛍️' },
        { name: 'National Museum', cat: 'museum', desc: 'Largest museum in India with 200K+ artifacts', icon: '🏛️' },
        { name: 'Hauz Khas Village', cat: 'nightlife', desc: 'Trendy area with ruins, cafes, and boutiques', icon: '🌃' },
        { name: 'Rajpath (Kartavya Path)', cat: 'monument', desc: 'Grand ceremonial boulevard from India Gate to Rashtrapati Bhavan', icon: '🛣️' },
    ],
    mumbai: [
        { name: 'Gateway of India', cat: 'monument', desc: 'Iconic arch overlooking the Arabian Sea, built 1924', icon: '🏗️' },
        { name: 'Marine Drive', cat: 'scenic', desc: '3.6km queens necklace along the coast', icon: '🌊' },
        { name: 'Elephanta Caves', cat: 'heritage', desc: 'UNESCO rock-cut caves with Shiva sculptures', icon: '🗿' },
        { name: 'Chhatrapati Shivaji Terminus', cat: 'heritage', desc: 'Gothic railway station, UNESCO World Heritage', icon: '🚂' },
        { name: 'Juhu Beach', cat: 'beach', desc: 'Famous beach with street food and sunset views', icon: '🏖️' },
        { name: 'Siddhivinayak Temple', cat: 'spiritual', desc: 'Most revered Ganesha temple in Mumbai', icon: '🛕' },
        { name: 'Haji Ali Dargah', cat: 'spiritual', desc: 'Mosque on an islet, accessible at low tide', icon: '🕌' },
        { name: 'Colaba Causeway', cat: 'shopping', desc: 'Bustling street market for clothes and antiques', icon: '🛒' },
        { name: 'Prince of Wales Museum', cat: 'museum', desc: 'Indo-Saracenic museum with art & history', icon: '🏛️' },
        { name: 'Wankhede Stadium', cat: 'landmark', desc: 'Iconic cricket stadium, 2011 World Cup final venue', icon: '🏏' },
        { name: 'Sanjay Gandhi National Park', cat: 'nature', desc: 'Lush park with Kanheri Caves and leopard sightings', icon: '🦁' },
        { name: 'Sagar Vihar Garden', cat: 'scenic', desc: 'Seaside garden with panoramic Arabian Sea views', icon: '🌺' },
    ],
    bangalore: [
        { name: 'Lalbagh Botanical Garden', cat: 'nature', desc: '240-acre garden with glass house inspired by Crystal Palace', icon: '🌿' },
        { name: 'Cubbon Park', cat: 'nature', desc: '300-acre green lung in the heart of the city', icon: '🌳' },
        { name: 'Bangalore Palace', cat: 'heritage', desc: 'Tudor-style palace built in 1887', icon: '🏰' },
        { name: 'ISKCON Temple', cat: 'spiritual', desc: 'One of the largest ISKCON temples in the world', icon: '🛕' },
        { name: 'Tipu Sultan\'s Palace', cat: 'heritage', desc: 'Ornate wooden palace of the Mysore ruler', icon: '🏯' },
        { name: 'Nandi Hills', cat: 'nature', desc: 'Scenic hilltop fort with sunrise views, 60km away', icon: '⛰️' },
        { name: 'Vidhana Soudha', cat: 'monument', desc: 'Massive legislative building, Asia\'s largest', icon: '🏛️' },
        { name: 'Commercial Street', cat: 'shopping', desc: 'Bustling shopping street for clothes and electronics', icon: '🛍️' },
        { name: 'Innovative Film City', cat: 'entertainment', desc: 'Theme park with wax museum and adventure rides', icon: '🎢' },
        { name: 'HAL Aerospace Museum', cat: 'museum', desc: 'India\'s first aerospace museum', icon: '✈️' },
        { name: 'Ulsoor Lake', cat: 'scenic', desc: 'Picturesque lake with boating facilities', icon: '🚣' },
        { name: 'UB City Mall', cat: 'shopping', desc: 'Premium luxury shopping and dining destination', icon: '🛍️' },
    ],
    chennai: [
        { name: 'Marina Beach', cat: 'beach', desc: 'World\'s second longest urban beach, 13km stretch', icon: '🏖️' },
        { name: 'Kapaleeshwarar Temple', cat: 'spiritual', desc: '7th century Dravidian temple in Mylapore', icon: '🛕' },
        { name: 'Fort St. George', cat: 'heritage', desc: 'First British fortress in India, built 1644', icon: '🏰' },
        { name: 'Santhome Cathedral', cat: 'spiritual', desc: 'Basilica built over the tomb of St. Thomas', icon: '⛪' },
        { name: 'Government Museum', cat: 'museum', desc: 'Second oldest museum in India, rich Bronze Gallery', icon: '🏛️' },
        { name: 'Guindy National Park', cat: 'nature', desc: 'Small national park inside the city with blackbuck', icon: '🦌' },
        { name: 'Elliot\'s Beach', cat: 'beach', desc: 'Quiet, clean beach popular with families', icon: '🏖️' },
        { name: 'Vivekananda House', cat: 'heritage', desc: 'Where Swami Vivekananda stayed in 1897', icon: '🏛️' },
        { name: 'DakshinaChitra', cat: 'culture', desc: 'Living heritage museum of South Indian culture', icon: '🎭' },
        { name: 'T. Nagar Shopping', cat: 'shopping', desc: 'Bustling commercial hub for silk sarees and gold', icon: '🛍️' },
        { name: 'MGR Film City', cat: 'entertainment', desc: 'Film studio complex with gardens and sets', icon: '🎬' },
        { name: 'Mylapore', cat: 'culture', desc: 'Ancient neighborhood with temples and Carnatic music', icon: '🎵' },
    ],
    kolkata: [
        { name: 'Victoria Memorial', cat: 'heritage', desc: 'Magnificent white marble museum dedicated to Queen Victoria', icon: '🏛️' },
        { name: 'Howrah Bridge', cat: 'monument', desc: 'Iconic cantilever bridge over Hooghly River, 1943', icon: '🌉' },
        { name: 'Indian Museum', cat: 'museum', desc: 'Oldest & largest museum in India, est. 1814', icon: '🏛️' },
        { name: 'Dakshineswar Kali Temple', cat: 'spiritual', desc: 'Famous Kali temple where Ramakrishna had visions', icon: '🛕' },
        { name: 'Birla Industrial & Technological Museum', cat: 'museum', desc: 'India\'s first science museum, interactive exhibits', icon: '🔬' },
        { name: 'Alipore Zoological Gardens', cat: 'nature', desc: 'India\'s oldest zoo, est. 1876, home to white tigers', icon: '🦁' },
        { name: 'Eden Gardens', cat: 'landmark', desc: 'Iconic cricket stadium, "Colosseum of cricket"', icon: '🏏' },
        { name: 'Birla Planetarium', cat: 'museum', desc: 'Largest planetarium in Asia, cosmic shows daily', icon: '🌌' },
        { name: 'Jorasanko Thakur Bari', cat: 'heritage', desc: 'Ancestral home of the Tagore family, Rabindranath Tagore\'s birthplace', icon: '🏠' },
        { name: 'Kalighat Temple', cat: 'spiritual', desc: 'One of the 51 Shakti Peethas, Kolkata\'s oldest temple', icon: '🛕' },
        { name: 'Prinsep Ghat', cat: 'scenic', desc: 'Greek/Gothic palladian ghat with river views', icon: '🌅' },
        { name: 'Science City', cat: 'museum', desc: 'Largest science centre in the Indian subcontinent', icon: '🔭' },
        { name: 'Nicco Park', cat: 'entertainment', desc: '"Disneyland of the East" — theme park and water park', icon: '🎢' },
        { name: 'South City Mall', cat: 'shopping', desc: 'One of Kolkata\'s largest shopping malls', icon: '🛍️' },
        { name: 'Millennium Park', cat: 'scenic', desc: 'Riverside park with floral gardens along Hooghly', icon: '🌺' },
        { name: 'Birla Mandir', cat: 'spiritual', desc: 'Elegant white marble Lakshmi Narayan temple', icon: '🛕' },
    ],
    pune: [
        { name: 'Aga Khan Palace', cat: 'heritage', desc: 'Where Mahatma Gandhi was imprisoned (1942-44)', icon: '🏰' },
        { name: 'Shaniwar Wada', cat: 'heritage', desc: '18th century Peshwa fortification palace', icon: '🏯' },
        { name: 'Sinhagad Fort', cat: 'heritage', desc: 'Hill fortress with legendary Battle of Sinhagad history', icon: '⛰️' },
        { name: 'Dagdusheth Halwai Ganpati', cat: 'spiritual', desc: 'Most famous Ganesh temple in Pune', icon: '🛕' },
        { name: 'Raja Dinkar Kelkar Museum', cat: 'museum', desc: 'Quirky museum with 20,000+ Indian artifacts', icon: '🏛️' },
        { name: 'Pataleshwar Cave Temple', cat: 'heritage', desc: '8th century rock-cut Shiva temple in the city', icon: '🗿' },
        { name: 'Osho Ashram', cat: 'spiritual', desc: 'World-famous meditation resort in Koregaon Park', icon: '🧘' },
        { name: 'Lavasa', cat: 'nature', desc: 'Planned hill city near Pune, scenic drives', icon: '🏘️' },
        { name: 'Empress Garden', cat: 'nature', desc: 'Beautiful botanical garden since British era', icon: '🌺' },
        { name: 'FC Road', cat: 'shopping', desc: 'Vibrant street with cafes, shops, and nightlife', icon: '🛍️' },
        { name: 'Parvati Hill', cat: 'scenic', desc: 'Hilltop with temples and panoramic city views', icon: '⛰️' },
        { name: 'Katraj Snake Park', cat: 'nature', desc: 'Home to rare Indian reptiles and a snake venom center', icon: '🐍' },
    ],
    jaipur: [
        { name: 'Amber Fort', cat: 'heritage', desc: 'Majestic hilltop fortress with Sheesh Mahal mirror palace', icon: '🏰' },
        { name: 'Hawa Mahal', cat: 'heritage', desc: 'Palace of Winds with 953 pink sandstone windows', icon: '🏯' },
        { name: 'City Palace', cat: 'heritage', desc: 'Royal residence blending Rajput and Mughal architecture', icon: '🏛️' },
        { name: 'Jantar Mantar', cat: 'heritage', desc: 'UNESCO astronomical observation site, largest stone sundial', icon: '🔭' },
        { name: 'Nahargarh Fort', cat: 'heritage', desc: 'Hilltop fort with stunning sunset views over Jaipur', icon: '⛰️' },
        { name: 'Jal Mahal', cat: 'scenic', desc: 'Water palace floating in Man Sagar Lake', icon: '🏰' },
        { name: 'Albert Hall Museum', cat: 'museum', desc: 'Oldest museum in Rajasthan, Egyptian mummy on display', icon: '🏛️' },
        { name: 'Birla Mandir', cat: 'spiritual', desc: 'Stunning white marble Lakshmi Narayan temple', icon: '🛕' },
        { name: 'Johari Bazaar', cat: 'shopping', desc: 'Famous for jewelry, textiles, and lac bangles', icon: '🛒' },
        { name: 'Chokhi Dhani', cat: 'culture', desc: 'Rajasthani village theme park with folk dance & food', icon: '🎭' },
        { name: 'Galtaji Temple', cat: 'spiritual', desc: 'Ancient pilgrimage site in a narrow gorge', icon: '🛕' },
        { name: 'Bapu Bazaar', cat: 'shopping', desc: 'Market for mojaris (shoes), textiles, and handicrafts', icon: '🛍️' },
    ],
    varanasi: [
        { name: 'Dashashwamedh Ghat', cat: 'spiritual', desc: 'Main ghat with spectacular evening Ganga Aarti ceremony', icon: '🔥' },
        { name: 'Kashi Vishwanath Temple', cat: 'spiritual', desc: 'One of 12 Jyotirlingas, most sacred Shiva temple', icon: '🛕' },
        { name: 'Assi Ghat', cat: 'spiritual', desc: 'Southernmost ghat, popular for morning yoga and prayers', icon: '🌅' },
        { name: 'Sarnath', cat: 'heritage', desc: 'Where Buddha gave his first sermon, 10km from Varanasi', icon: '☸️' },
        { name: 'Manikarnika Ghat', cat: 'spiritual', desc: 'Most sacred cremation ghat in Hinduism', icon: '🔥' },
        { name: 'Banaras Hindu University', cat: 'heritage', desc: 'Asia\'s largest residential university, est. 1916', icon: '🏛️' },
        { name: 'Ramnagar Fort', cat: 'heritage', desc: '18th century Mughal-style fort across the Ganges', icon: '🏰' },
        { name: 'Tulsi Manas Temple', cat: 'spiritual', desc: 'Temple where Ramcharitmanas was written', icon: '🛕' },
        { name: 'BHARAT KALA BHAVAN', cat: 'museum', desc: 'Art museum at BHU with miniature paintings and sculptures', icon: '🎨' },
        { name: 'Vishwanath Gali', cat: 'shopping', desc: 'Famous bangle and silk shopping street', icon: '🛒' },
        { name: 'Chunar Fort', cat: 'heritage', desc: 'Ancient fort on the Ganges, 30km from Varanasi', icon: '🏰' },
        { name: 'Boat Ride on Ganges', cat: 'experience', desc: 'Sunrise boat ride past all the ghats — unforgettable', icon: '🛶' },
    ],
    goa: [
        { name: "Basilica of Bom Jesus", cat: "heritage", desc: "UNESCO World Heritage. Baroque architecture, St. Francis Xavier.", icon: "⛪" },
        { name: "Calangute Beach", cat: "beach", desc: "Queen of beaches. Water sports, shacks, nightlife.", icon: "🏖️" },
        { name: "Fort Aguada", cat: "heritage", desc: "17th-century Portuguese fort with lighthouse.", icon: "🏰" },
        { name: "Dudhsagar Falls", cat: "nature", desc: "603m four-tiered waterfall. One of India tallest.", icon: "🌊" },
        { name: "Anjuna Flea Market", cat: "shopping", desc: "Wednesday flea market. Hippie culture, trinkets.", icon: "🛍️" },
        { name: "Chapora Fort", cat: "heritage", desc: "Dil Chahta Hai fort. Panoramic Vagator views.", icon: "🏰" },
        { name: "Spice Plantations", cat: "nature", desc: "Sahakari farm tour. Pepper, cardamom, vanilla.", icon: "🌿" },
        { name: "Fontainhas", cat: "culture", desc: "Latin Quarter. Colorful Portuguese houses.", icon: "🎨" }
    ],
    agra: [
        { name: "Taj Mahal", cat: "monument", desc: "UNESCO Wonder of the World. White marble masterpiece.", icon: "🕌" },
        { name: "Agra Fort", cat: "heritage", desc: "UNESCO site. Massive red sandstone Mughal fortress.", icon: "🏰" },
        { name: "Fatehpur Sikri", cat: "heritage", desc: "Abandoned Mughal city. Buland Darwaza, Panch Mahal.", icon: "🏛️" },
        { name: "Mehtab Bagh", cat: "nature", desc: "Moonlight Garden. Perfect Taj Mahal sunset view.", icon: "🌅" },
        { name: "Itimad-ud-Daulah", cat: "monument", desc: "Baby Taj. Precursor to Taj Mahal with inlay work.", icon: "🕌" },
        { name: "Kinari Bazaar", cat: "shopping", desc: "Busy market near Jama Masjid. Marble inlay souvenirs.", icon: "🛍️" },
        { name: "Akbars Tomb", cat: "heritage", desc: "Sikandra. Grand Mughal garden tomb.", icon: "🏛️" },
        { name: "Chini Ka Rauza", cat: "heritage", desc: "Persian-style tomb. Exquisite glazed tile work.", icon: "🏛️" }
    ],
    udaipur: [
        { name: "Lake Pichola", cat: "scenic", desc: "Iconic lake. Boat ride to Jag Mandir and Lake Palace.", icon: "⛵" },
        { name: "City Palace", cat: "heritage", desc: "Largest palace complex in Rajasthan.", icon: "🏰" },
        { name: "Jag Mandir", cat: "heritage", desc: "Island palace. Inspiration for Taj Mahal.", icon: "🏛️" },
        { name: "Saheliyon Ki Bari", cat: "nature", desc: "Garden of Maidens. Lotus pools, marble elephants.", icon: "🌿" },
        { name: "Monsoon Palace", cat: "heritage", desc: "Hilltop palace. Panoramic sunset views.", icon: "🏰" },
        { name: "Jagdish Temple", cat: "spiritual", desc: "Indo-Aryan temple. Intricate carvings, daily aarti.", icon: "🛕" },
        { name: "Fateh Sagar Lake", cat: "scenic", desc: "Scenic lake with Nehru Island. Boating.", icon: "🌊" },
        { name: "Shilpgram", cat: "culture", desc: "Arts and crafts village. Rajasthani folk performances.", icon: "🎭" }
    ],
    shimla: [
        { name: "The Ridge", cat: "landmark", desc: "Open space in heart of Shimla. Mountain views.", icon: "🏔️" },
        { name: "Mall Road", cat: "shopping", desc: "Colonial-era shopping street. Cafes, shops.", icon: "🛍️" },
        { name: "Jakhoo Temple", cat: "spiritual", desc: "Hanuman temple on highest point. 33m statue.", icon: "🛕" },
        { name: "Christ Church", cat: "heritage", desc: "Second oldest church in North India.", icon: "⛪" },
        { name: "Kufri", cat: "nature", desc: "Hill station 16km away. Snow activities.", icon: "⛷️" },
        { name: "Toy Train", cat: "experience", desc: "UNESCO Kalka-Shimla railway. Scenic journey.", icon: "🚂" },
        { name: "Chadwick Falls", cat: "nature", desc: "Waterfall in dense forests. Best in monsoon.", icon: "🌊" },
        { name: "Naldehra", cat: "nature", desc: "Golf course with mountain backdrop.", icon: "⛳" }
    ],
    manali: [
        { name: "Solang Valley", cat: "nature", desc: "Adventure hub. Paragliding, zorbing, skiing.", icon: "🏔️" },
        { name: "Rohtang Pass", cat: "nature", desc: "Snow-capped pass at 3,978m. Stunning views.", icon: "🗻" },
        { name: "Hadimba Temple", cat: "spiritual", desc: "Ancient cave temple in cedar forest.", icon: "🛕" },
        { name: "Old Manali", cat: "culture", desc: "Bohemian village. Cafes, live music, backpacker vibes.", icon: "🎵" },
        { name: "Jogini Waterfall", cat: "nature", desc: "Trek through apple orchards to waterfall.", icon: "🌊" },
        { name: "Vashisht Hot Springs", cat: "nature", desc: "Natural hot sulphur springs. Temple nearby.", icon: "♨️" },
        { name: "Manu Temple", cat: "spiritual", desc: "Ancient temple dedicated to sage Manu.", icon: "🛕" },
        { name: "Mall Road Manali", cat: "shopping", desc: "Main street. Shops, cafes, Tibetan market.", icon: "🛍️" }
    ],
    srinagar: [
        { name: "Dal Lake", cat: "scenic", desc: "Jewel of Srinagar. Shikara rides, floating gardens.", icon: "⛵" },
        { name: "Mughal Gardens", cat: "nature", desc: "Nishat Bagh, Shalimar Bagh. Terraced gardens.", icon: "🌿" },
        { name: "Shankaracharya Temple", cat: "spiritual", desc: "Ancient hilltop temple. Panoramic lake views.", icon: "🛕" },
        { name: "Pari Mahal", cat: "heritage", desc: "Palace of Fairies. Mughal-era terraced garden.", icon: "🏰" },
        { name: "Nigeen Lake", cat: "scenic", desc: "Tranquil lake. Quieter alternative to Dal Lake.", icon: "🌊" },
        { name: "Jamia Masjid", cat: "spiritual", desc: "Grand mosque. Beautiful Indo-Saracenic architecture.", icon: "🕌" },
        { name: "Floating Market", cat: "experience", desc: "Morning vegetable market on boats.", icon: "🛶" },
        { name: "Pahalgam", cat: "nature", desc: "Valley of Shepherds. Meadow trek, river rafting.", icon: "🏔️" }
    ],
    amritsar: [
        { name: "Golden Temple", cat: "spiritual", desc: "Holiest Sikh shrine. Gold-plated, sacred pool.", icon: "🛕" },
        { name: "Jallianwala Bagh", cat: "heritage", desc: "Memorial of 1919 massacre. Narrow passage.", icon: "🏛️" },
        { name: "Wagah Border", cat: "experience", desc: "India-Pakistan border ceremony. Flag lowering.", icon: "🇮🇳" },
        { name: "Partition Museum", cat: "museum", desc: "First museum on Partition. Powerful exhibits.", icon: "🏛️" },
        { name: "Hall Bazaar", cat: "shopping", desc: "Historic bazaar. Punjabi juttis, fabrics.", icon: "🛍️" },
        { name: "Ram Tirath", cat: "spiritual", desc: "Birthplace of Luv and Kush. Ancient temple.", icon: "🛕" },
        { name: "Gobindgarh Fort", cat: "heritage", desc: "18th century fort. Light shows, museums.", icon: "🏰" },
        { name: "Khalsa College", cat: "heritage", desc: "Gothic-Sikh architecture. Beautiful building.", icon: "🏛️" }
    ],
    rishikesh: [
        { name: "Laxman Jhula", cat: "landmark", desc: "Iconic suspension bridge over Ganges.", icon: "🌉" },
        { name: "Ram Jhula", cat: "landmark", desc: "Suspension bridge connecting ashrams.", icon: "🌉" },
        { name: "Beatles Ashram", cat: "heritage", desc: "Where Beatles meditated in 1968. Street art.", icon: "🎵" },
        { name: "Triveni Ghat", cat: "spiritual", desc: "Sacred confluence. Evening Ganga Aarti.", icon: "🔥" },
        { name: "Neer Garh Waterfall", cat: "nature", desc: "Two-tiered waterfall. Short trek.", icon: "🌊" },
        { name: "River Rafting", cat: "experience", desc: "White water rafting on Ganges.", icon: "🚣" },
        { name: "Kunjapuri Temple", cat: "spiritual", desc: "Hilltop temple. Sunrise views of Himalayas.", icon: "🌅" },
        { name: "Neelkanth Mahadev", cat: "spiritual", desc: "Shiva temple in forest. Pilgrimage trek.", icon: "🛕" }
    ],
    hampi: [
        { name: "Virupaksha Temple", cat: "spiritual", desc: "Living temple. UNESCO site, 50m tower.", icon: "🛕" },
        { name: "Vijaya Vittala Temple", cat: "heritage", desc: "Musical pillars, stone chariot.", icon: "🏛️" },
        { name: "Hampi Bazaar", cat: "heritage", desc: "Ancient market street. Ruins, boulders.", icon: "🛍️" },
        { name: "Matanga Hill", cat: "nature", desc: "Best sunset point. Climb among boulders.", icon: "🌅" },
        { name: "Royal Enclosure", cat: "heritage", desc: "Ruins of palaces, baths, elephant stables.", icon: "🏰" },
        { name: "Elephant Stables", cat: "heritage", desc: "Indo-Islamic domed halls. Royal elephants.", icon: "🐘" },
        { name: "Hemakuta Hill", cat: "nature", desc: "Sunrise spot. Jain temples, boulder landscape.", icon: "🌄" },
        { name: "Tungabhadra Dam", cat: "nature", desc: "Massive dam. Boating, gardens.", icon: "🌊" }
    ],
    leh: [
        { name: "Pangong Lake", cat: "scenic", desc: "134km long lake. Color-changing waters at 4,350m.", icon: "🌊" },
        { name: "Leh Palace", cat: "heritage", desc: "17th century palace. Tibetan architecture.", icon: "🏰" },
        { name: "Nubra Valley", cat: "nature", desc: "Valley of flowers. Double-humped camels.", icon: "🏔️" },
        { name: "Thiksey Monastery", cat: "spiritual", desc: "12-story gompa. Mini Potala.", icon: "🛕" },
        { name: "Khardung La", cat: "nature", desc: "Highest motorable pass at 5,359m.", icon: "🗻" },
        { name: "Magnetic Hill", cat: "experience", desc: "Gravity-defying hill. Optical illusion.", icon: "🧲" },
        { name: "Shanti Stupa", cat: "spiritual", desc: "White-domed stupa. 360-degree valley views.", icon: "🌅" },
        { name: "Hemis Monastery", cat: "spiritual", desc: "Largest monastery. Famous Hemis festival.", icon: "🛕" }
    ],
    darjeeling: [
        { name: "Tiger Hill", cat: "nature", desc: "Sunrise over Kanchenjunga. Best panorama.", icon: "🌅" },
        { name: "Batasia Loop", cat: "experience", desc: "Spiral railway loop. War memorial.", icon: "🚂" },
        { name: "Darjeeling Himalayan Railway", cat: "experience", desc: "UNESCO Toy Train. Steam engines.", icon: "🚂" },
        { name: "Peace Pagoda", cat: "spiritual", desc: "Japanese Buddhist stupa. Four avatars.", icon: "🛕" },
        { name: "Tea Gardens", cat: "nature", desc: "Makaibari, Happy Valley. Tea plucking tours.", icon: "🍵" },
        { name: "Padmaja Naidu Zoo", cat: "nature", desc: "Snow leopards, red pandas.", icon: "🐼" },
        { name: "Rock Garden", cat: "nature", desc: "Mini Zoo park. Waterfalls, trekking.", icon: "🌿" },
        { name: "Observatory Hill", cat: "scenic", desc: "Panoramic views. Mahakal Temple.", icon: "🏔️" }
    ],
    mysore: [
        { name: "Mysore Palace", cat: "heritage", desc: "Indo-Saracenic palace. 98,000 lights Sundays.", icon: "🏰" },
        { name: "Chamundi Hills", cat: "spiritual", desc: "Chamundeshwari Temple. City views.", icon: "🛕" },
        { name: "Brindavan Gardens", cat: "nature", desc: "Terraced gardens. Musical fountain.", icon: "🌿" },
        { name: "St. Philomena Church", cat: "heritage", desc: "Neo-Gothic church. One of tallest.", icon: "⛪" },
        { name: "Devaraja Market", cat: "shopping", desc: "Century-old market. Mysore silk, spices.", icon: "🛍️" },
        { name: "Karanji Lake", cat: "nature", desc: "Butterfly park, bird sanctuary.", icon: "🦋" },
        { name: "Jaganmohan Palace", cat: "museum", desc: "Art gallery. Raja Ravi Varma paintings.", icon: "🎨" },
        { name: "Rail Museum", cat: "museum", desc: "Heritage locomotives. Royal carriages.", icon: "🚂" }
    ],
    hyderabad: [
        { name: "Charminar", cat: "monument", desc: "Iconic 1591 monument. Four minarets.", icon: "🕌" },
        { name: "Golconda Fort", cat: "heritage", desc: "Massive fortress. Acoustic engineering.", icon: "🏰" },
        { name: "Hussain Sagar Lake", cat: "scenic", desc: "Heart-shaped lake. Buddha statue.", icon: "🌊" },
        { name: "Salar Jung Museum", cat: "museum", desc: "Largest one-man collection. Veiled Rebecca.", icon: "🏛️" },
        { name: "Birla Mandir", cat: "spiritual", desc: "White marble temple. City views.", icon: "🛕" },
        { name: "Ramoji Film City", cat: "entertainment", desc: "Largest film studio complex. Theme parks.", icon: "🎬" },
        { name: "Chowmahalla Palace", cat: "heritage", desc: "Nizam palace. Vintage cars, chandeliers.", icon: "🏰" },
        { name: "Laad Bazaar", cat: "shopping", desc: "Bangle market near Charminar.", icon: "🛍️" }
    ],
    ooty: [
        { name: "Botanical Garden", cat: "nature", desc: "1848 garden. 650+ plant species.", icon: "🌿" },
        { name: "Ooty Lake", cat: "scenic", desc: "Boating on artificial lake.", icon: "⛵" },
        { name: "Nilgiri Mountain Railway", cat: "experience", desc: "UNESCO Toy Train. 16 tunnels.", icon: "🚂" },
        { name: "Doddabetta Peak", cat: "nature", desc: "Highest point. Telescope house.", icon: "🏔️" },
        { name: "Tea Museum", cat: "museum", desc: "Tea processing history. Tasting.", icon: "🍵" },
        { name: "Rose Garden", cat: "nature", desc: "17,000 rose varieties. Annual flower show.", icon: "🌹" },
        { name: "Pykara Lake", cat: "nature", desc: "Scenic lake. Boating, waterfalls.", icon: "🌊" },
        { name: "Lambs Rock", cat: "scenic", desc: "Viewpoint. Coimbatore plains, tea estates.", icon: "🌅" }
    ],
    // ── ADDITIONAL NORTH INDIA ──
    tawang: [
        { name: "Tawang Monastery", cat: "spiritual", desc: "India's largest Buddhist monastery, 17th century", icon: "🛕" },
        { name: "Sela Pass", cat: "nature", desc: "High-altitude pass at 4,170m with frozen lake", icon: "🗻" },
        { name: "Madhuri Lake", cat: "scenic", desc: "Shonga-Tser Lake, stunning valley views", icon: "🌊" },
        { name: "Tawang War Memorial", cat: "heritage", desc: "Tribute to Indian soldiers of 1962 War", icon: "🏛️" },
        { name: "Gorichen Peak", cat: "nature", desc: "Highest peak in Arunachal Pradesh at 6,488m", icon: "🏔️" },
        { name: "Nuranang Falls", cat: "nature", desc: "Scenic 100m waterfall, also called Jang Falls", icon: "🌊" },
        { name: "Bumla Pass", cat: "experience", desc: "Indo-China border pass at 4,642m", icon: "🇮🇳" },
        { name: "PTSO Lake", cat: "scenic", desc: "High-altitude lake with yak pastures", icon: "⛰️" },
    ],
    bodhgaya: [
        { name: "Mahabodhi Temple", cat: "spiritual", desc: "UNESCO. Where Buddha attained enlightenment", icon: "☸️" },
        { name: "Bodhi Tree", cat: "spiritual", desc: "Direct descendant of original enlightenment tree", icon: "🌿" },
        { name: "Dungeshwari Caves", cat: "spiritual", desc: "Where Buddha practiced austerities", icon: "🕉️" },
        { name: "Thai Monastery", cat: "spiritual", desc: "Beautiful Thai-style monastery with golden Buddha", icon: "🛕" },
        { name: "Great Buddha Statue", cat: "monument", desc: "25m tall Buddha in meditation pose", icon: "🗿" },
        { name: "Chinese Temple", cat: "spiritual", desc: "Ornate Chinese Buddhist pagoda temple", icon: "🛕" },
        { name: "Animeshlochana Stupa", cat: "heritage", desc: "Where Buddha gazed at Bodhi Tree", icon: "🏛️" },
        { name: "Tibetan Market", cat: "shopping", desc: "Prayer wheels, thangkas, Buddhist artifacts", icon: "🛍️" },
    ],
    khajuraho: [
        { name: "Western Group Temples", cat: "heritage", desc: "UNESCO. Kandariya Mahadeva with sculptures", icon: "🏛️" },
        { name: "Kandariya Mahadeva", cat: "heritage", desc: "Largest temple, 31m tall", icon: "🛕" },
        { name: "Eastern Group Temples", cat: "heritage", desc: "Jain temples of Parsvanath", icon: "🏛️" },
        { name: "Raneh Falls", cat: "nature", desc: "Granite canyon with colored rock formations", icon: "🌊" },
        { name: "Panna National Park", cat: "nature", desc: "Tiger reserve with Ken River safaris", icon: "🐅" },
        { name: "Dulhadeo Temple", cat: "heritage", desc: "Finest sculptures in Khajuraho", icon: "🏛️" },
        { name: "Khajuraho Museum", cat: "museum", desc: "Sculptures and artifacts from ruins", icon: "🎨" },
        { name: "Dance Festival", cat: "culture", desc: "Annual classical dance against temple backdrop", icon: "💃" },
    ],
    // ── SOUTH INDIA ──
    pondicherry: [
        { name: "Promenade Beach", cat: "beach", desc: "1.5km stretch along Bay of Bengal", icon: "🏖️" },
        { name: "Auroville", cat: "spiritual", desc: "Experimental township, Matrimandir golden dome", icon: "🌟" },
        { name: "French Quarter", cat: "heritage", desc: "Pastel colonial buildings, cafes", icon: "🇫🇷" },
        { name: "Aurobindo Ashram", cat: "spiritual", desc: "Peaceful ashram founded 1926", icon: "🧘" },
        { name: "Paradise Beach", cat: "beach", desc: "Golden sand beach, boat access", icon: "🏖️" },
        { name: "Botanical Garden", cat: "nature", desc: "250-year-old garden, 900+ species", icon: "🌿" },
        { name: "Rock Beach", cat: "beach", desc: "Rocky coastline for evening walks", icon: "🌅" },
        { name: "Sacred Heart Basilica", cat: "heritage", desc: "Largest church, French Gothic", icon: "⛪" },
    ],
    alleppey: [
        { name: "Alleppey Backwaters", cat: "scenic", desc: "Venice of the East. Houseboat rides", icon: "🛺" },
        { name: "Houseboat Cruise", cat: "experience", desc: "Overnight kettuvallam with Kerala cuisine", icon: "⛵" },
        { name: "Alappuzha Beach", cat: "beach", desc: "Beach with lighthouse and old pier", icon: "🏖️" },
        { name: "Krishnapuram Palace", cat: "heritage", desc: "Largest mural in India", icon: "🏰" },
        { name: "Marari Beach", cat: "beach", desc: "Quiet fishing village beach", icon: "🏖️" },
        { name: "Vallam Kali", cat: "experience", desc: "Snake boat races during Onam", icon: "🚣" },
        { name: "Chettikulangara Temple", cat: "spiritual", desc: "Kettukazhcha festival", icon: "🛕" },
        { name: "Pathiramanal Island", cat: "nature", desc: "Birdwatcher's paradise", icon: "🐦" },
    ],
    munnar: [
        { name: "Tea Plantations", cat: "nature", desc: "Endless emerald gardens, factory tours", icon: "🍵" },
        { name: "Eravikulam NP", cat: "nature", desc: "Endangered Nilgiri Tahr", icon: "🐐" },
        { name: "Top Station", cat: "scenic", desc: "3,200m, panoramic Western Ghats views", icon: "🏔️" },
        { name: "Mattupetty Dam", cat: "scenic", desc: "Speed boating in hills", icon: "🌊" },
        { name: "Echo Point", cat: "scenic", desc: "Voice echoes across valley", icon: "⛰️" },
        { name: "Attukal Waterfall", cat: "nature", desc: "Cardamom plantation trek", icon: "🌊" },
        { name: "Kundala Lake", cat: "scenic", desc: "Shikara boats, Neelakurinji blooms", icon: "⛵" },
        { name: "Photo Point", cat: "scenic", desc: "Tea garden photo frames", icon: "📸" },
    ],
    kochi: [
        { name: "Fort Kochi", cat: "heritage", desc: "Portuguese/Dutch influences", icon: "🏰" },
        { name: "Chinese Fishing Nets", cat: "landmark", desc: "14th century cantilever nets", icon: "🎣" },
        { name: "Mattancherry Palace", cat: "heritage", desc: "Dutch Palace with Kerala murals", icon: "🏛️" },
        { name: "Jew Town", cat: "heritage", desc: "Antique shops, Paradesi Synagogue", icon: "🛍️" },
        { name: "St. Francis Church", cat: "heritage", desc: "First European church in India (1503)", icon: "⛪" },
        { name: "Marine Drive", cat: "scenic", desc: "Palm-lined waterfront sunset", icon: "🌅" },
        { name: "Kathakali Centre", cat: "culture", desc: "Kerala dance performances nightly", icon: "🎭" },
        { name: "Folklore Museum", cat: "museum", desc: "Three-floor Kerala tribal art", icon: "🎨" },
    ],
    tirupati: [
        { name: "Venkateswara Temple", cat: "spiritual", desc: "World's most visited pilgrimage", icon: "🛕" },
        { name: "Talakona Waterfall", cat: "nature", desc: "Andhra's highest waterfall at 82m", icon: "🌊" },
        { name: "Padmavathi Temple", cat: "spiritual", desc: "Temple of Goddess Padmavathi", icon: "🛕" },
        { name: "Chandragiri Fort", cat: "heritage", desc: "16th century Vijayanagara fort", icon: "🏰" },
        { name: "SV Museum", cat: "museum", desc: "Ancient sculptures and paintings", icon: "🎨" },
        { name: "Govindaraja Temple", cat: "spiritual", desc: "Oldest temple, 11th century", icon: "🛕" },
        { name: "Kapila Theertham", cat: "spiritual", desc: "Waterfall and Shiva temple", icon: "🌊" },
        { name: "Deer Park", cat: "nature", desc: "Natural park on Tirumala hills", icon: "🦌" },
    ],
    madurai: [
        { name: "Meenakshi Amman Temple", cat: "spiritual", desc: "14 gopurams, 33,000 sculptures", icon: "🛕" },
        { name: "Thirumalai Nayak Palace", cat: "heritage", desc: "17th century Indo-Saracenic", icon: "🏰" },
        { name: "Gandhi Museum", cat: "museum", desc: "Gandhi's blood-stained dhoti", icon: "🏛️" },
        { name: "Alagar Kovil", cat: "spiritual", desc: "Vishnu temple in Alagar Hills", icon: "🛕" },
        { name: "Pazhamudhir Solai", cat: "nature", desc: "Fruit garden hilltop temple", icon: "🌿" },
        { name: "Samayapuram Temple", cat: "spiritual", desc: "Tamil Nadu's busiest temple", icon: "🛕" },
        { name: "Vaigai Dam", cat: "scenic", desc: "Scenic dam with gardens", icon: "🌊" },
        { name: "Banana Market", cat: "shopping", desc: "Asia's largest banana market", icon: "🍌" },
    ],
    trivandrum: [
        { name: "Padmanabhaswamy Temple", cat: "spiritual", desc: "World's richest temple", icon: "🛕" },
        { name: "Kovalam Beach", cat: "beach", desc: "Crescent beach with lighthouse", icon: "🏖️" },
        { name: "Napier Museum", cat: "museum", desc: "19th century Kerala art museum", icon: "🎨" },
        { name: "Poovar Island", cat: "scenic", desc: "River, lake, and sea converge", icon: "🌿" },
        { name: "Varkala Beach", cat: "beach", desc: "Dramatic red cliffs over sea", icon: "🏖️" },
        { name: "Shanghumukham Beach", cat: "beach", desc: "Giant mermaid sculpture", icon: "🧜" },
        { name: "Agastyamalai", cat: "nature", desc: "Western Ghats rainforest", icon: "🦜" },
        { name: "Children's Museum", cat: "museum", desc: "Toys and dolls worldwide", icon: "🎨" },
    ],
    // ── EAST & NORTHEAST ──
    gangtok: [
        { name: "MG Marg", cat: "shopping", desc: "Pedestrian street, cafes, shops", icon: "🛍️" },
        { name: "Tsomgo Lake", cat: "scenic", desc: "Glacial lake at 3,753m", icon: "🌊" },
        { name: "Baba Harbhajan Temple", cat: "spiritual", desc: "Memorial at 13,123ft", icon: "🛕" },
        { name: "Rumtek Monastery", cat: "spiritual", desc: "Largest in Sikkim", icon: "🛕" },
        { name: "Nathu La Pass", cat: "experience", desc: "Indo-China border at 4,310m", icon: "🇮🇳" },
        { name: "Do Drul Chorten", cat: "spiritual", desc: "Stupa with 108 prayer wheels", icon: "☸️" },
        { name: "Hanuman Tok", cat: "spiritual", desc: "Hilltop with Kanchenjunga views", icon: "⛰️" },
        { name: "Flower Exhibition", cat: "nature", desc: "Rare orchids and flora", icon: "🌸" },
    ],
    // ── WEST INDIA ──
    ahmedabad: [
        { name: "Sabarmati Ashram", cat: "heritage", desc: "Gandhi's home for 12 years", icon: "🏛️" },
        { name: "Adalaj Stepwell", cat: "heritage", desc: "15th century Indo-Islamic stepwell", icon: "🏛️" },
        { name: "Jama Masjid", cat: "spiritual", desc: "Yellow sandstone mosque", icon: "🕌" },
        { name: "Kankaria Lake", cat: "scenic", desc: "Lake with zoo and amusement park", icon: "🌊" },
        { name: "Sidi Saiyyed Mosque", cat: "heritage", desc: "Famous stone lattice jali window", icon: "🕌" },
        { name: "Calico Museum", cat: "museum", desc: "World-famous textile collection", icon: "🎨" },
        { name: "Akshardham Temple", cat: "spiritual", desc: "Modern Hindu temple complex", icon: "🛕" },
        { name: "Manek Chowk", cat: "market", desc: "Textile market, street food by night", icon: "🛒" },
    ],
    rann_of_kutch: [
        { name: "White Rann", cat: "scenic", desc: "Vast white salt desert", icon: "🌕" },
        { name: "Kutch Museum", cat: "museum", desc: "Gujarat's oldest museum", icon: "🎨" },
        { name: "Aina Mahal", cat: "heritage", desc: "18th century mirror palace", icon: "🏰" },
        { name: "Rann Utsav", cat: "culture", desc: "Festival tent city Nov-Feb", icon: "🎪" },
        { name: "Wild Ass Sanctuary", cat: "nature", desc: "Last habitat of Indian wild ass", icon: "🦓" },
        { name: "Mandvi Beach", cat: "beach", desc: "Pristine beach with palace", icon: "🏖️" },
        { name: "Bhuj", cat: "culture", desc: "Bandhani, mirror work capital", icon: "🎨" },
        { name: "Koteshwar Temple", cat: "spiritual", desc: "Shiva temple on an island", icon: "🛕" },
    ],
    // ── CENTRAL INDIA ──
    orchha: [
        { name: "Orchha Fort Complex", cat: "heritage", desc: "16th century Bundela fort", icon: "🏰" },
        { name: "Chaturbhuj Temple", cat: "spiritual", desc: "Unique architecture", icon: "🛕" },
        { name: "Raja Ram Temple", cat: "spiritual", desc: "Lord Ram as king", icon: "🛕" },
        { name: "Laxminarayan Temple", cat: "heritage", desc: "Ramayana frescoes", icon: "🎨" },
        { name: "Cenotaphs", cat: "heritage", desc: "14 royal memorials", icon: "🏛️" },
        { name: "Phool Bagh", cat: "nature", desc: "Formal garden with fountains", icon: "🌺" },
        { name: "Betwa River Rafting", cat: "experience", desc: "Raft past forts", icon: "🚣" },
        { name: "Paper Factory", cat: "culture", desc: "Handmade paper artisans", icon: "🎨" },
    ],
    sanchi: [
        { name: "Sanchi Stupa", cat: "heritage", desc: "UNESCO. Ashoka's Buddhist stupa", icon: "☸️" },
        { name: "Great Stupa", cat: "heritage", desc: "Earliest stone structure in India", icon: "🏛️" },
        { name: "Ashoka Pillar", cat: "heritage", desc: "Four lions, India's emblem", icon: "🦁" },
        { name: "Monasteries Ruins", cat: "heritage", desc: "Ancient Buddhist cells", icon: "🏛️" },
        { name: "Archaeological Museum", cat: "museum", desc: "Buddhist sculptures", icon: "🎨" },
        { name: "Udayagiri Caves", cat: "heritage", desc: "Gupta-era rock-cut caves", icon: "🗿" },
        { name: "Bhedaghat Rocks", cat: "nature", desc: "Narmada river gorge", icon: "🌊" },
        { name: "Bhimbetka Shelters", cat: "heritage", desc: "30,000-year-old cave paintings", icon: "🎨" },
    ],
    // ── ADDITIONAL KEY CITIES ──
    coorg: [
        { name: "Abbey Falls", cat: "nature", desc: "Waterfall in coffee plantations", icon: "🌊" },
        { name: "Dubare Elephant Camp", cat: "experience", desc: "Elephant bathing and feeding", icon: "🐘" },
        { name: "Raja's Seat", cat: "scenic", desc: "Panoramic valley viewpoint", icon: "🌅" },
        { name: "Talakaveri", cat: "spiritual", desc: "Origin of River Kaveri", icon: "🏔️" },
        { name: "Coffee Plantations", cat: "nature", desc: "India's coffee capital tours", icon: "☕" },
        { name: "Namdroling Monastery", cat: "spiritual", desc: "Largest Tibetan center outside Tibet", icon: "☸️" },
        { name: "Bylakuppe", cat: "culture", desc: "Tibetan settlement", icon: "🛕" },
        { name: "Nisargadhama", cat: "nature", desc: "River island, bamboo groves", icon: "🌿" },
    ],
    pushkar: [
        { name: "Pushkar Lake", cat: "spiritual", desc: "Sacred lake with 52 ghats", icon: "🌊" },
        { name: "Brahma Temple", cat: "spiritual", desc: "Rare Brahma temple", icon: "🛕" },
        { name: "Camel Fair", cat: "culture", desc: "Annual November fair", icon: "🐪" },
        { name: "Savitri Temple", cat: "spiritual", desc: "Hilltop, ropeway access", icon: "⛰️" },
        { name: "Varah Temple", cat: "spiritual", desc: "Mughal-era temple", icon: "🛕" },
        { name: "Pushkar Bazaar", cat: "shopping", desc: "Handicrafts and textiles", icon: "🛍️" },
        { name: "Rose Garden", cat: "nature", desc: "India's rose capital", icon: "🌹" },
        { name: "Man Mahal", cat: "heritage", desc: "Rajput palace on lake", icon: "🏰" },
    ],
    jodhpur: [
        { name: "Mehrangarh Fort", cat: "heritage", desc: "India's finest hilltop fort", icon: "🏰" },
        { name: "Umaid Bhawan", cat: "heritage", desc: "Art Deco, largest private residence", icon: "🏛️" },
        { name: "Jaswant Thada", cat: "heritage", desc: "White marble cenotaph", icon: "🏛️" },
        { name: "Sardar Market", cat: "shopping", desc: "Spices, textiles, antiques", icon: "🛒" },
        { name: "Blue City Walk", cat: "culture", desc: "Blue-painted Brahmin houses", icon: "🎨" },
        { name: "Rao Jodha Park", cat: "nature", desc: "Restored rocky landscape", icon: "🌿" },
        { name: "Mandore Gardens", cat: "nature", desc: "Royal cenotaphs, gardens", icon: "🌺" },
        { name: "Bishnoi Village", cat: "experience", desc: "Wildlife conservation villages", icon: "🦌" },
    ],
    surat: [
        { name: "Dutch Garden", cat: "heritage", desc: "Dutch-era cemetery and gardens", icon: "🌿" },
        { name: "Patel Museum", cat: "museum", desc: "Iron Man of India tribute", icon: "🎨" },
        { name: "Dumas Beach", cat: "beach", desc: "Black sand beach", icon: "🏖️" },
        { name: "Surat Castle", cat: "heritage", desc: "16th century fort", icon: "🏰" },
        { name: "Textile Market", cat: "shopping", desc: "Diamond and textile capital", icon: "🛍️" },
        { name: "Swaminarayan Temple", cat: "spiritual", desc: "Ornate BAPS temple", icon: "🛕" },
        { name: "Science Centre", cat: "museum", desc: "Interactive museum, planetarium", icon: "🔬" },
        { name: "Vansda National Park", cat: "nature", desc: "Teak forests, wildlife", icon: "🦌" },
    ],
    lucknow: [
        { name: "Bara Imambara", cat: "heritage", desc: "Largest imambara, arched hall", icon: "🏛️" },
        { name: "Chota Imambara", cat: "heritage", desc: "Palace of Lights", icon: "🏰" },
        { name: "Rumi Darwaza", cat: "monument", desc: "Awadhi Turkish Gate", icon: "🏛️" },
        { name: "Hazratganj", cat: "shopping", desc: "Premier shopping street", icon: "🛍️" },
        { name: "British Residency", cat: "heritage", desc: "1857 Siege ruins", icon: "🏛️" },
        { name: "Lucknow Zoo", cat: "nature", desc: "One of oldest zoos", icon: "🦁" },
        { name: "Chota Manzil", cat: "heritage", desc: "Grand Nawabi mansion", icon: "🏛️" },
        { name: "Awadhi Food Trail", cat: "experience", desc: "Kebabs, biryani paradise", icon: "🍽️" },
    ],
    pachmarhi: [
        { name: "Bee Falls", cat: "nature", desc: "30m cascade in Satpura", icon: "🌊" },
        { name: "Chauragarh Temple", cat: "spiritual", desc: "Hilltop Shiva, 1300 steps", icon: "🛕" },
        { name: "Pandava Caves", cat: "heritage", desc: "Rock-cut caves", icon: "🗿" },
        { name: "Dhoopgarh Point", cat: "scenic", desc: "Highest Satpura, sunset views", icon: "🌅" },
        { name: "Satpura NP", cat: "nature", desc: "Tiger reserve, sal forests", icon: "🐅" },
        { name: "Jatashankar", cat: "nature", desc: "Shiva lingam in cave", icon: "🕉️" },
        { name: "Handi Khoh", cat: "scenic", desc: "Deep gorge, waterfall", icon: "⛰️" },
        { name: "Apsara Vihar", cat: "nature", desc: "Natural pool, waterfall", icon: "🏊" },
    ],
    andaman: [
        { name: "Cellular Jail", cat: "heritage", desc: "Colonial-era prison, light & sound show", icon: "🏛️" },
        { name: "Radhanagar Beach", cat: "beach", desc: "Havelock's white-sand beach, best sunset", icon: "🏖️" },
        { name: "Ross Island", cat: "heritage", desc: "British ruins reclaimed by forest", icon: "🏝️" },
        { name: "North Bay", cat: "experience", desc: "Snorkelling and glass-bottom boats", icon: "🤿" },
        { name: "Neil Island", cat: "beach", desc: "Quiet island with natural rock bridge", icon: "🌴" },
        { name: "Elephant Beach", cat: "experience", desc: "Coral reef, sea walking and kayaking", icon: "🐠" },
        { name: "Mahatma Gandhi Marine NP", cat: "nature", desc: "Coral reefs and Jolly Buoy island", icon: "🌊" },
        { name: "Chidiya Tapu", cat: "scenic", desc: "Birdwatching and Munda Pahad sunset point", icon: "🌅" },
    ],
    patna: [
        { name: "Bihar Museum", cat: "museum", desc: "Modern museum with Mauryan and Gupta relics", icon: "🏛️" },
        { name: "Golghar", cat: "monument", desc: "1786 granary with spiral staircase views", icon: "🏛️" },
        { name: "Takht Sri Patna Sahib", cat: "spiritual", desc: "Birthplace of Guru Gobind Singh", icon: "🛕" },
        { name: "Mahavir Mandir", cat: "spiritual", desc: "One of India's busiest Hanuman temples", icon: "🛕" },
        { name: "Patna Museum", cat: "museum", desc: "Mauryan sculptures and the Didarganj Yakshi", icon: "🎨" },
        { name: "Nalanda Ruins", cat: "heritage", desc: "UNESCO ruins of the ancient university", icon: "🗿" },
        { name: "Sanjay Gandhi Biological Park", cat: "nature", desc: "Zoo and botanical garden", icon: "🦁" },
        { name: "Gandhi Maidan", cat: "landmark", desc: "Historic ground and Gandhi Sangrahalaya", icon: "🏛️" },
    ],
    puri: [
        { name: "Jagannath Temple", cat: "spiritual", desc: "Char Dham temple, Rath Yatra chariot festival", icon: "🛕" },
        { name: "Puri Beach", cat: "beach", desc: "Golden sand, sunrise and sand art", icon: "🏖️" },
        { name: "Konark Sun Temple", cat: "heritage", desc: "UNESCO stone chariot of the sun god", icon: "☀️" },
        { name: "Chilika Lake", cat: "nature", desc: "Asia's largest brackish lagoon, dolphins", icon: "🐬" },
        { name: "Raghurajpur", cat: "culture", desc: "Pattachitra artist village", icon: "🎨" },
        { name: "Chandrabhaga Beach", cat: "beach", desc: "Quiet beach beside the Sun Temple", icon: "🌊" },
        { name: "Sakshi Gopal Temple", cat: "spiritual", desc: "12th century Gopal temple", icon: "🛕" },
        { name: "Swargadwar", cat: "culture", desc: "Cremation ghat and spiritual quarter", icon: "🪔" },
    ],
};

// Shown when the destination is not one of the cities above
const INDIA_TOP_ATTRACTIONS = [
    { name: "Taj Mahal, Agra", cat: "heritage", desc: "UNESCO marble mausoleum, one of the world's wonders", icon: "🕌" },
    { name: "Amber Fort, Jaipur", cat: "heritage", desc: "Rajput hilltop fort with Sheesh Mahal", icon: "🏰" },
    { name: "Gateway of India, Mumbai", cat: "monument", desc: "Iconic arch on the Arabian Sea waterfront", icon: "🏛️" },
    { name: "Golden Temple, Amritsar", cat: "spiritual", desc: "Holiest Sikh shrine, community kitchen", icon: "🛕" },
    { name: "Kerala Backwaters, Alleppey", cat: "scenic", desc: "Houseboat cruises through palm-lined canals", icon: "🛺" },
    { name: "Dal Lake, Srinagar", cat: "scenic", desc: "Shikara rides and floating gardens", icon: "⛵" },
    { name: "Pangong Lake, Ladakh", cat: "scenic", desc: "High-altitude lake that changes colour", icon: "🏔️" },
    { name: "Varanasi Ghats", cat: "spiritual", desc: "Ganga aarti on the oldest living city's steps", icon: "🪔" },
    { name: "Hampi Ruins", cat: "heritage", desc: "UNESCO Vijayanagara boulder-strewn ruins", icon: "🗿" },
    { name: "Meenakshi Temple, Madurai", cat: "spiritual", desc: "Towering gopurams covered in sculpture", icon: "🛕" },
    { name: "Sun Temple, Konark", cat: "heritage", desc: "13th century stone chariot in Odisha", icon: "☀️" },
    { name: "Elephanta Caves, Mumbai", cat: "heritage", desc: "Rock-cut Shiva caves on an island", icon: "🗿" },
];

function generateAttractions(destination) {
    const container = document.getElementById('attractions-list');
    if (!container) return;
    const dest = (destination || '').trim().toLowerCase();
    const destUnknown = !dest || dest === 'not specified';
    
    const destAliases = {
        "kashmir": "srinagar", "ladakh": "leh", "himachal": "shimla",
        "uttarakhand": "rishikesh", "kerala": "alleppey", "rajasthan": "jaipur",
        "northeast": "gangtok", "jammu": "srinagar", "madhya pradesh": "sanchi",
        "karnataka": "bangalore", "tamil nadu": "madurai", "andhra pradesh": "tirupati",
        "west bengal": "kolkata", "maharashtra": "mumbai", "gujarat": "ahmedabad",
        "odisha": "puri", "assam": "kaziranga", "himachal pradesh": "shimla",
        "jammu and kashmir": "srinagar", "pondicherry": "pondicherry", "puducherry": "pondicherry",
        "munnar": "munnar", "kochi": "kochi", "cochin": "kochi",
        "alappuzha": "alleppey", "backwaters": "alleppey",
        "tirupati": "tirupati", "madurai": "madurai", "trivandrum": "trivandrum",
        "bodh gaya": "bodhgaya", "bodhgaya": "bodhgaya",
        "khajuraho": "khajuraho", "tawang": "tawang", "gangtok": "gangtok",
        "sikkim": "gangtok", "arunachal": "tawang", "arunachal pradesh": "tawang",
        "coorg": "coorg", "kodagu": "coorg", "pushkar": "pushkar",
        "jodhpur": "jodhpur", "ahmedabad": "ahmedabad", "surat": "surat",
        "lucknow": "lucknow", "orchha": "orchha", "sanchi": "sanchi",
        "rann of kutch": "rann_of_kutch", "kutch": "rann_of_kutch", "bhuj": "rann_of_kutch",
        "pachmarhi": "pachmarhi", "satpura": "pachmarhi",
        "andaman": "andaman", "port blair": "andaman", "havelock": "andaman",
        "nicobar": "andaman", "patna": "patna", "bihar": "patna", "nalanda": "patna",
        "odisha": "puri", "orissa": "puri", "konark": "puri", "chilika": "puri",
    };
    
    let cityKey = "";
    if (!destUnknown) {
        for (const k of Object.keys(CITY_ATTRACTIONS)) {
            if (dest.includes(k)) { cityKey = k; break; }
        }
        if (!cityKey) {
            for (const [alias, key] of Object.entries(destAliases)) {
                if (dest.includes(alias)) { cityKey = key; break; }
            }
        }
    }
    
    let attractions = [];
    if (cityKey && CITY_ATTRACTIONS[cityKey]) {
        attractions = CITY_ATTRACTIONS[cityKey];
    } else if (!destUnknown && typeof CHATBOT_DB !== "undefined") {
        for (const [key, cityData] of Object.entries(CHATBOT_DB)) {
            if (dest.includes(key) || key.includes(dest)) {
                const typeIcons = { monument: "🏛️", landmark: "🗼", spiritual: "🛕", nature: "🌿", heritage: "🏰", market: "🛍️", beach: "🏖️", museum: "🎨", culture: "🎭", scenic: "🏔️", experience: "⭐", entertainment: "🎪" };
                const typeCats = { monument: "monument", landmark: "landmark", spiritual: "spiritual", nature: "nature", heritage: "heritage", market: "shopping", beach: "beach", museum: "museum", culture: "culture", scenic: "scenic", experience: "experience", entertainment: "entertainment" };
                attractions = cityData.places.map(p => ({
                    name: p.name,
                    cat: typeCats[p.type] || "heritage",
                    desc: p.desc + (p.budget ? " (Entry: " + p.budget + ")" : "") + (p.tip ? " Tip: " + p.tip : ""),
                    icon: typeIcons[p.type] || "📍"
                }));
                cityKey = key;
                break;
            }
        }
    }
    
    // Unknown destination: fall back to India's most popular attractions
    const usingFallback = attractions.length === 0;
    if (usingFallback) attractions = INDIA_TOP_ATTRACTIONS;
    const catColors = { heritage: '#8B4513', monument: '#1a5276', spiritual: '#9b59b6', nature: '#27ae60', beach: '#0096d6', museum: '#f39c12', shopping: '#e74c3c', culture: '#e67e22', nightlife: '#7B68EE', market: '#e74c3c', scenic: '#0096d6', entertainment: '#ff6b35', experience: '#9b59b6', landmark: '#1a5276' };
    const catLabels = { heritage: 'Heritage', monument: 'Monument', spiritual: 'Spiritual', nature: 'Nature', beach: 'Beach', museum: 'Museum', shopping: 'Shopping', culture: 'Culture', nightlife: 'Nightlife', market: 'Market', scenic: 'Scenic', entertainment: 'Fun', experience: 'Must-Do', landmark: 'Landmark' };

    // Group by category
    const cats = {};
    attractions.forEach(a => {
        if (!cats[a.cat]) cats[a.cat] = [];
        cats[a.cat].push(a);
    });

    const cityName = usingFallback ? 'India' : (cityKey ? (typeof CHATBOT_DB !== 'undefined' && CHATBOT_DB[cityKey] ? CHATBOT_DB[cityKey].name : cityKey.charAt(0).toUpperCase() + cityKey.slice(1)) : destination);
    const headline = usingFallback ? 'Showing India\'s most popular attractions' : 'Showing top spots in ' + cityName;
    let html = '<div style="margin-bottom:12px;padding:10px 16px;background:var(--card-bg);border-radius: 15000px;border-left:4px solid var(--primary);display:flex;align-items:center;gap:10px;"><i class="fas fa-map-marker-alt" style="color:var(--primary);font-size:1.1rem;"></i><div><strong style="color:var(--text);">' + headline + '</strong><span style="color:var(--text-muted);font-size:0.85rem;margin-left:8px;">' + attractions.length + ' attractions found</span></div></div>';
    if (usingFallback) {
        html += '<div style="margin-bottom:12px;padding:10px 14px;background:rgba(255,107,53,0.08);border-left:3px solid var(--primary);border-radius:0 6px 6px 0;font-size:0.82rem;color:var(--text-secondary);"><i class="fas fa-info-circle" style="color:var(--primary);margin-right:6px;"></i>' + (destUnknown ? 'Set your destination in your profile' : 'No attraction list for "' + destination + '" yet') + ' — showing India\'s most-visited places instead. Try: Delhi, Mumbai, Jaipur, Goa, Varanasi, Shimla, Manali, Srinagar, Leh or Andaman for city-specific spots.</div>';
    }
    Object.keys(cats).forEach(cat => {
        const color = catColors[cat] || '#64748b';
        html += '<div class="attraction-category">';
        html += '<div class="attraction-cat-header"><span class="attraction-cat-tag" style="background:' + color + '15;color:' + color + ';">' + (catLabels[cat] || cat) + ' (' + cats[cat].length + ')</span></div>';
        html += '<div class="attraction-grid">';
        cats[cat].forEach(a => {
            html += '<div class="attraction-chip">';
            html += '<span class="attraction-icon">' + a.icon + '</span>';
            html += '<div class="attraction-info"><strong>' + a.name + '</strong><span>' + a.desc + '</span></div>';
            html += '</div>';
        });
        html += '</div></div>';
    });
    container.innerHTML = html;
}

// General advisories shown when no specific danger zone matches the route
const COMMON_TRAVEL_DANGERS = [
    {
        name: "Pickpocketing & Bag Snatching",
        risk: "moderate",
        riskLabel: "Theft & Petty Crime",
        icon: "🎒",
        description: "Crowded markets, railway stations and famous monuments are hotspots. Carry bags in front, keep zips closed, avoid flashing cash, jewellery or phones, and never leave valuables in parked vehicles."
    },
    {
        name: "Tourist Scams & Overcharging",
        risk: "moderate",
        riskLabel: "Scams & Fraud",
        icon: "💸",
        description: "Fake guides, duplicate ticket counters, inflated auto-rickshaw fares and 'the monument is closed today' detours to shops. Use prepaid taxi counters, official booking apps and pay by meter."
    },
    {
        name: "Monsoon Flooding & Waterlogging",
        risk: "natural",
        riskLabel: "Seasonal Flood Risk",
        icon: "🌧️",
        description: "June to September downpours flood roads and delay trains and flights across India. Avoid low-lying routes, never wade or drive through moving water, and check forecasts before travelling."
    },
    {
        name: "Heatwave & Dehydration",
        risk: "natural",
        riskLabel: "Extreme Heat",
        icon: "🌡️",
        description: "April to June temperatures cross 45°C in northern and western India. Carry drinking water, avoid the 12-4pm sun, wear light cotton, and watch for dizziness, cramps or heat exhaustion."
    },
    {
        name: "Unsafe Night Travel",
        risk: "moderate",
        riskLabel: "Night Safety",
        icon: "🌙",
        description: "Poorly lit roads, unverified cabs and isolated stretches are risky after dark. Prefer app-based or hotel-arranged cabs, share your ride details with someone, and avoid solo walks in unfamiliar areas."
    },
    {
        name: "Food & Water Borne Illness",
        risk: "moderate",
        riskLabel: "Food & Water Safety",
        icon: "🥤",
        description: "Drink sealed bottled or filtered water, skip ice from street stalls, and eat at busy places where food is cooked fresh and hot. Carry oral rehydration salts for stomach upsets."
    },
    {
        name: "Road & Traffic Hazards",
        risk: "moderate",
        riskLabel: "Road Safety",
        icon: "🛣️",
        description: "Traffic can be unpredictable, with unlit vehicles and mountain roads that lack barriers. Wear a helmet on two-wheelers, avoid overnight highway drives, and book transport through trusted operators."
    },
];

function generateRouteDangerAlerts(origin, destination) {
    const container = document.getElementById('route-danger-alerts');
    if (!container) return;
    const o = (origin || '').toLowerCase();
    const d = (destination || '').toLowerCase();
    const destUnknown = !d.trim() || d.trim() === 'not specified';

    // Terms that should never be treated as place names
    const stopWords = new Set(['not', 'the', 'and', 'for', 'your', 'with', 'from', 'near', 'this', 'that', 'any', 'all', 'are', 'was', 'has', 'its', 'you', 'can', 'may', 'but', 'out', 'per', 'via', 'city', 'area', 'zone', 'route', 'trip', 'tour']);
    const placeWords = (text) => (text.toLowerCase().match(/[a-z]{3,}/g) || []).filter(w => !stopWords.has(w));
    const routeTerms = placeWords(o).concat(placeWords(d));

    // Find danger zones that match origin, destination, or are along common routes
    const routeZones = dangerZones.filter(zone => {
        const zn = zone.name.toLowerCase();
        const zdesc = (zone.description || '').toLowerCase();
        // Check if the zone name or description mentions a place on the route
        return routeTerms.some(w => {
            const re = new RegExp('\\b' + w + '\\b');
            return re.test(zn) || re.test(zdesc);
        });
    });

    // Also check the destination city against danger zone coords
    const CITY_COORDS2 = {
        delhi: [28.6139, 77.2090], mumbai: [19.0760, 72.8777], bangalore: [12.9716, 77.5946],
        chennai: [13.0827, 80.2707], kolkata: [22.5726, 88.3639], pune: [18.5204, 73.8567],
        jaipur: [26.9124, 75.7873], varanasi: [25.3176, 83.0064],
        manali: [32.2396, 77.1887], shimla: [31.1048, 77.1734],
        kashmir: [34.0837, 74.7973], ladakh: [34.1526, 77.5771]
    };

    let allRelevant = [...routeZones];

    // If origin is GPS coordinates, check proximity to danger zones along route
    const originParts = (origin || '').split(',').map(Number);
    if (originParts.length === 2 && !isNaN(originParts[0]) && !isNaN(originParts[1])) {
        const oLat = originParts[0], oLng = originParts[1];
        dangerZones.forEach(zone => {
            const dist = getDistance(oLat, oLng, zone.lat, zone.lng);
            if (dist < zone.radius / 1000 + 200 && !allRelevant.find(z => z.name === zone.name)) {
                allRelevant.push(zone);
            }
        });
    }

    // Check each city key in destination
    Object.keys(CITY_COORDS2).forEach(city => {
        if (d.includes(city) || o.includes(city)) {
            dangerZones.forEach(zone => {
                const dist = getDistance(CITY_COORDS2[city][0], CITY_COORDS2[city][1], zone.lat, zone.lng);
                if (dist < zone.radius / 1000 + 100 && !allRelevant.find(z => z.name === zone.name)) {
                    allRelevant.push(zone);
                }
            });
        }
    });

    // Also check the destination against the full city coordinate list
    if (!destUnknown && typeof DESTINATION_COORDS !== 'undefined') {
        Object.keys(DESTINATION_COORDS).forEach(city => {
            if (!d.includes(city)) return;
            const c = DESTINATION_COORDS[city];
            dangerZones.forEach(zone => {
                const dist = getDistance(c.lat, c.lng, zone.lat, zone.lng);
                if (dist < zone.radius / 1000 + 100 && !allRelevant.find(z => z.name === zone.name)) {
                    allRelevant.push(zone);
                }
            });
        });
    }

    // Deduplicate
    const seen = new Set();
    allRelevant = allRelevant.filter(z => { if (seen.has(z.name)) return false; seen.add(z.name); return true; });

    if (allRelevant.length === 0) {
        // Nothing route-specific: list the dangers that apply to any Indian trip
        container.innerHTML = '<div style="margin-bottom:12px;padding:10px 14px;background:rgba(231,76,60,0.08);border-left:3px solid var(--danger);border-radius:0 6px 6px 0;font-size:0.82rem;color:var(--text-secondary);"><i class="fas fa-info-circle" style="color:var(--danger);margin-right:6px;"></i>' + (destUnknown ? 'Set your destination in your profile for route-specific zones. Until then, here are the dangers common to any Indian trip:' : 'No mapped danger zone covers this route yet — here are the dangers common to any Indian trip:') + '</div>';
        container.innerHTML += COMMON_TRAVEL_DANGERS.map(item => {
            return `<div class="danger-alert-item ${item.risk}">
                <span class="alert-zone-icon">${item.icon}</span>
                <div class="alert-zone-info">
                    <h4>${item.name}</h4>
                    <p>${item.description}</p>
                    <span class="risk-tag ${item.risk}">${item.riskLabel}</span>
                </div>
            </div>`;
        }).join('');
        return;
    }

    const riskIcons = { high: '🚨', moderate: '⚠️', natural: '🌍', safe: '✅' };
    container.innerHTML = allRelevant.map(zone => {
        const icon = riskIcons[zone.risk] || '⚠️';
        return `<div class="danger-alert-item ${zone.risk}">
            <span class="alert-zone-icon">${icon}</span>
            <div class="alert-zone-info">
                <h4>${zone.name}</h4>
                <p>${zone.description}</p>
                <span class="risk-tag ${zone.risk}">${zone.riskLabel}</span>
            </div>
        </div>`;
    }).join('');
}

// ==================== ROUTE MAP ====================
let routeMap = null;
let currentTravelMode = 'driving';
let routeFrom = '', routeTo = '';

function switchTravelMode(mode) {
    currentTravelMode = mode;
    document.querySelectorAll('.travel-mode-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });
    initRouteMap(routeFrom, routeTo);
}

function initRouteMap(from, to) {
    routeFrom = from;
    routeTo = to;
    var fromKey = (from || '').toLowerCase().split(',')[0].trim();
    var toKey = (to || '').toLowerCase().split(',')[0].trim();
    // Check if 'from' is GPS coordinates (lat,lng) or a city name
    var fromParts = (from || '').split(',').map(Number);
    var fromCoord;
    if (fromParts.length === 2 && !isNaN(fromParts[0]) && !isNaN(fromParts[1])) {
        fromCoord = { lat: fromParts[0], lng: fromParts[1] };
    } else {
        fromCoord = DESTINATION_COORDS[fromKey] || DESTINATION_COORDS['delhi'];
    }
    var toCoord = DESTINATION_COORDS[toKey];
    if (!toCoord) {
        document.getElementById('route-info').innerHTML = '<div class="route-stat"><i class="fas fa-info-circle"></i> <strong>Destination not found. Showing Delhi as default.</strong></div>';
        return initRouteMap(from, 'delhi');
    }
    if (routeMap) { routeMap.remove(); routeMap = null; }
    var mapEl = document.getElementById('route-map');
    if (!mapEl) return;

    routeMap = L.map(mapEl, {
        center: [(fromCoord.lat + toCoord.lat) / 2, (fromCoord.lng + toCoord.lng) / 2],
        zoom: 6,
        zoomControl: true
    });

    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community',
        maxZoom: 18
    }).addTo(routeMap);

    L.control.scale({ imperial: false }).addTo(routeMap);

    // Determine origin label
    var originLabel = from || 'Origin';
    var originParts = (from || '').split(',').map(Number);
    if (originParts.length === 2 && !isNaN(originParts[0]) && !isNaN(originParts[1])) {
        originLabel = '📍 Your Current Location (' + originParts[0].toFixed(4) + ', ' + originParts[1].toFixed(4) + ')';
    }

    // Origin marker (orange)
    L.circleMarker([fromCoord.lat, fromCoord.lng], {
        radius: 8, fillColor: '#ff6b35', color: '#fff', weight: 2, fillOpacity: 1
    }).addTo(routeMap).bindPopup('<b>' + originLabel + '</b>');

    // Destination marker (green)
    L.circleMarker([toCoord.lat, toCoord.lng], {
        radius: 8, fillColor: '#27ae60', color: '#fff', weight: 2, fillOpacity: 1
    }).addTo(routeMap).bindPopup('<b>🏁 ' + (to || 'Destination') + '</b>');

    // Fit bounds initially
    var bounds = L.latLngBounds([fromCoord.lat, fromCoord.lng], [toCoord.lat, toCoord.lng]);
    routeMap.fitBounds(bounds, { padding: [50, 50] });

    // Straight dashed line as fallback (will be replaced by OSRM route)
    var fallbackLine = L.polyline(
        [[fromCoord.lat, fromCoord.lng], [toCoord.lat, toCoord.lng]],
        { color: '#ff6b35', weight: 2, opacity: 0.4, dashArray: '8, 8' }
    ).addTo(routeMap);

    // Show loading state
    var speedMap = { driving: 80, bus: 35, train: 110, plane: 800, cycling: 15, walking: 5 };
    var iconMap = { driving: 'fa-car', bus: 'fa-bus', train: 'fa-train', plane: 'fa-plane', cycling: 'fa-bicycle', walking: 'fa-walking' };
    var labelMap = { driving: 'Drive', bus: 'Bus', train: 'Train', plane: 'Flight', cycling: 'Cycle', walking: 'Walk' };
    var modeLabel = labelMap[currentTravelMode] || 'Drive';

    document.getElementById('route-info').innerHTML = '<div class="route-stat"><i class="fas fa-spinner fa-spin"></i> <strong>Calculating shortest route...</strong></div>';

    // Fetch actual road route from OSRM
    var osrmProfile = currentTravelMode === 'cycling' ? 'bike' : currentTravelMode === 'walking' ? 'foot' : 'car';
    var osrmUrl = 'https://router.project-osrm.org/route/v1/' + osrmProfile + '/' + fromCoord.lng + ',' + fromCoord.lat + ';' + toCoord.lng + ',' + toCoord.lat + '?overview=full&geometries=geojson&steps=true';

    fetch(osrmUrl)
        .then(function(resp) { return resp.json(); })
        .then(function(data) {
            if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
                var route = data.routes[0];
                var coords = route.geometry.coordinates.map(function(c) { return [c[1], c[0]]; });

                // Remove fallback line
                try { routeMap.removeLayer(fallbackLine); } catch(e) {}

                // Draw actual road route with gradient effect
                // Outer glow
                L.polyline(coords, { color: '#ff6b35', weight: 8, opacity: 0.25 }).addTo(routeMap);
                // Main route line
                L.polyline(coords, { color: '#ff6b35', weight: 4, opacity: 0.9 }).addTo(routeMap);
                // Inner highlight
                L.polyline(coords, { color: '#ffaa00', weight: 2, opacity: 0.6 }).addTo(routeMap);

                // Fit map to route
                routeMap.fitBounds(L.latLngBounds(coords), { padding: [40, 40] });

                // Calculate actual road distance
                var roadDist = route.distance / 1000; // meters to km

                // Also compute straight-line distance for flight/train
                var R = 6371;
                var dLat = (toCoord.lat - fromCoord.lat) * Math.PI / 180;
                var dLon = (toCoord.lng - fromCoord.lng) * Math.PI / 180;
                var a = Math.sin(dLat/2)*Math.sin(dLat/2) + Math.cos(fromCoord.lat*Math.PI/180)*Math.cos(toCoord.lat*Math.PI/180)*Math.sin(dLon/2)*Math.sin(dLon/2);
                var straightDist = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

                // Calculate ETA based on travel mode
                var routeEta;
                if (currentTravelMode === 'driving') {
                    // Use OSRM car duration directly
                    var dur = route.duration;
                    var hrs = Math.floor(dur / 3600);
                    var mins = Math.round((dur % 3600) / 60);
                    routeEta = hrs > 0 ? hrs + 'h ' + mins + 'm' : mins + 'm';
                } else if (currentTravelMode === 'bus') {
                    // Bus: road distance / 35 km/h (includes stops)
                    var busHours = roadDist / 35;
                    var bHrs = Math.floor(busHours);
                    var bMins = Math.round((busHours - bHrs) * 60);
                    routeEta = bHrs > 0 ? bHrs + 'h ' + bMins + 'm' : bMins + 'm';
                } else if (currentTravelMode === 'train') {
                    // Train: road distance * 1.1 (track detours) / 110 km/h avg
                    var trainHours = (roadDist * 1.1) / 110;
                    var tHrs = Math.floor(trainHours);
                    var tMins = Math.round((trainHours - tHrs) * 60);
                    routeEta = tHrs > 0 ? tHrs + 'h ' + tMins + 'm' : tMins + 'm';
                } else if (currentTravelMode === 'plane') {
                    // Flight: straight line * 1.15 / 800 km/h + 3h airport time
                    var flyHours = (straightDist * 1.15) / 800 + 3;
                    var fHrs = Math.floor(flyHours);
                    var fMins = Math.round((flyHours - fHrs) * 60);
                    routeEta = fHrs + 'h ' + fMins + 'm';
                } else if (currentTravelMode === 'cycling') {
                    // Cycling: road distance / 15 km/h
                    var cycleHours = roadDist / 15;
                    if (cycleHours > 24) {
                        var cDays = Math.floor(cycleHours / 24);
                        var cRemHrs = Math.floor(cycleHours % 24);
                        var cMins = Math.round(((cycleHours % 24) - cRemHrs) * 60);
                        routeEta = cDays + 'd ' + cRemHrs + 'h ' + cMins + 'm';
                    } else {
                        var cHrs = Math.floor(cycleHours);
                        var cMi = Math.round((cycleHours - cHrs) * 60);
                        routeEta = cHrs > 0 ? cHrs + 'h ' + cMi + 'm' : cMi + 'm';
                    }
                } else if (currentTravelMode === 'walking') {
                    // Walking: road distance / 5 km/h
                    var walkHours = roadDist / 5;
                    if (walkHours > 24) {
                        var wDays = Math.floor(walkHours / 24);
                        var wRemHrs = Math.floor(walkHours % 24);
                        var wMins = Math.round(((walkHours % 24) - wRemHrs) * 60);
                        routeEta = wDays + 'd ' + wRemHrs + 'h ' + wMins + 'm';
                    } else {
                        var wHrs = Math.floor(walkHours);
                        var wMi = Math.round((walkHours - wHrs) * 60);
                        routeEta = wHrs > 0 ? wHrs + 'h ' + wMi + 'm' : wMi + 'm';
                    }
                } else {
                    var dur = route.duration;
                    var hrs = Math.floor(dur / 3600);
                    var mins = Math.round((dur % 3600) / 60);
                    routeEta = hrs > 0 ? hrs + 'h ' + mins + 'm' : mins + 'm';
                }

                // Show route steps (first 5)
                var stepsHtml = '';
                if (route.legs && route.legs[0] && route.legs[0].steps) {
                    var steps = route.legs[0].steps;
                    var showSteps = steps.slice(0, 6);
                    stepsHtml = '<div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--border);"><div style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;"><i class="fas fa-directions"></i> Route Directions</div>';
                    showSteps.forEach(function(step, i) {
                        var stepDist = (step.distance / 1000).toFixed(1);
                        var maneuver = step.maneuver ? step.maneuver.type : '';
                        var maneuverIcon = '➡️';
                        if (maneuver === 'turn') maneuverIcon = step.maneuver.modifier === 'right' ? '➡️' : '⬅️';
                        else if (maneuver === 'roundabout') maneuverIcon = '🔄';
                        else if (maneuver === 'exit roundabout') maneuverIcon = '↩️';
                        else if (maneuver === 'arrive') maneuverIcon = '🏁';
                        else if (maneuver === 'depart') maneuverIcon = '🚗';
                        var name = step.name && step.name !== '' ? step.name : 'Continue';
                        stepsHtml += '<div style="display:flex;align-items:center;gap:8px;padding:4px 0;font-size:0.8em;"><span>' + maneuverIcon + '</span><span style="flex:1;color:var(--text);">' + name + '</span><span style="color:var(--text-muted);">' + stepDist + ' km</span></div>';
                    });
                    if (steps.length > 6) {
                        stepsHtml += '<div style="font-size:0.75rem;color:var(--text-muted);padding:4px 0;">... and ' + (steps.length - 6) + ' more steps</div>';
                    }
                    stepsHtml += '</div>';
                }

                document.getElementById('route-info').innerHTML =
                    '<div class="route-stat"><i class="fas ' + iconMap[currentTravelMode] + '"></i> Mode: <strong>' + modeLabel + '</strong></div>' +
                    '<div class="route-stat"><i class="fas fa-road"></i> Distance: <strong>' + roadDist.toFixed(0) + ' km</strong></div>' +
                    '<div class="route-stat"><i class="fas fa-clock"></i> Est. Time: <strong>' + routeEta + '</strong></div>' +
                    '<div class="route-stat"><i class="fas fa-map-marker-alt"></i> From: <strong>' + originLabel + '</strong></div>' +
                    '<div class="route-stat"><i class="fas fa-flag-checkered"></i> To: <strong>' + to + '</strong></div>' +
                    '<div class="route-stat" style="font-size:0.78em;color:var(--text-muted);"><i class="fas fa-info-circle"></i> As the crow flies: ' + straightDist.toFixed(0) + ' km | Road: ' + roadDist.toFixed(0) + ' km</div>' +
                    '<div class="route-stat"><i class="fas fa-external-link-alt"></i> <a href="https://www.openstreetmap.org/directions?engine=fossgis_osrm_' + osrmProfile + '&route=' + fromCoord.lat + ',' + fromCoord.lng + ';' + toCoord.lat + ',' + toCoord.lng + '" target="_blank" style="color:var(--primary);font-weight:600;">Open in OpenStreetMap</a></div>' +
                    stepsHtml;

            } else {
                // OSRM failed, keep fallback
                var R = 6371;
                var dLat = (toCoord.lat - fromCoord.lat) * Math.PI / 180;
                var dLon = (toCoord.lng - fromCoord.lng) * Math.PI / 180;
                var a = Math.sin(dLat/2)*Math.sin(dLat/2) + Math.cos(fromCoord.lat*Math.PI/180)*Math.cos(toCoord.lat*Math.PI/180)*Math.sin(dLon/2)*Math.sin(dLon/2);
                var dist = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                var speed = speedMap[currentTravelMode] || 80;
                var rawHours = dist / speed;
                var hrs = Math.floor(rawHours);
                var mins = Math.round((rawHours - hrs) * 60);
                var eta = hrs > 0 ? hrs + 'h ' + mins + 'm' : mins + 'm';
                document.getElementById('route-info').innerHTML =
                    '<div class="route-stat"><i class="fas ' + iconMap[currentTravelMode] + '"></i> Mode: <strong>' + modeLabel + '</strong></div>' +
                    '<div class="route-stat"><i class="fas fa-road"></i> Distance: <strong>' + dist.toFixed(0) + ' km (straight line)</strong></div>' +
                    '<div class="route-stat"><i class="fas fa-clock"></i> Est. Time: <strong>' + eta + '</strong></div>' +
                    '<div class="route-stat"><i class="fas fa-map-marker-alt"></i> From: <strong>' + originLabel + '</strong></div>' +
                    '<div class="route-stat"><i class="fas fa-flag-checkered"></i> To: <strong>' + to + '</strong></div>' +
                    '<div class="route-stat"><i class="fas fa-external-link-alt"></i> <a href="https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=' + fromCoord.lat + ',' + fromCoord.lng + ';' + toCoord.lat + ',' + toCoord.lng + '" target="_blank" style="color:var(--primary);font-weight:600;">Open in OpenStreetMap</a></div>';
            }
        })
        .catch(function(err) {
            // Network error, keep fallback
            var R = 6371;
            var dLat = (toCoord.lat - fromCoord.lat) * Math.PI / 180;
            var dLon = (toCoord.lng - fromCoord.lng) * Math.PI / 180;
            var a = Math.sin(dLat/2)*Math.sin(dLat/2) + Math.cos(fromCoord.lat*Math.PI/180)*Math.cos(toCoord.lat*Math.PI/180)*Math.sin(dLon/2)*Math.sin(dLon/2);
            var dist = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            var speed = speedMap[currentTravelMode] || 80;
            var rawHours = dist / speed;
            var hrs = Math.floor(rawHours);
            var mins = Math.round((rawHours - hrs) * 60);
            var eta = hrs > 0 ? hrs + 'h ' + mins + 'm' : mins + 'm';
            document.getElementById('route-info').innerHTML =
                '<div class="route-stat"><i class="fas ' + iconMap[currentTravelMode] + '"></i> Mode: <strong>' + modeLabel + '</strong></div>' +
                '<div class="route-stat"><i class="fas fa-road"></i> Distance: <strong>' + dist.toFixed(0) + ' km</strong></div>' +
                '<div class="route-stat"><i class="fas fa-clock"></i> Est. Time: <strong>' + eta + '</strong></div>' +
                '<div class="route-stat"><i class="fas fa-map-marker-alt"></i> From: <strong>' + originLabel + '</strong></div>' +
                '<div class="route-stat"><i class="fas fa-flag-checkered"></i> To: <strong>' + to + '</strong></div>' +
                '<div class="route-stat"><i class="fas fa-exclamation-triangle" style="color:#f39c12;"></i> <strong>Offline mode</strong> — showing straight-line estimate</div>' +
                '<div class="route-stat"><i class="fas fa-external-link-alt"></i> <a href="https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=' + fromCoord.lat + ',' + fromCoord.lng + ';' + toCoord.lat + ',' + toCoord.lng + '" target="_blank" style="color:var(--primary);font-weight:600;">Open in OpenStreetMap</a></div>';
        });
}

let routePOIMarkers = [];
let routePOIVisible = true;

function addRoutePOIMarkers(fromCoord, toCoord, from, to) {
    // Clear existing POI markers
    routePOIMarkers.forEach(m => { try { routeMap.removeLayer(m); } catch(e){} });
    routePOIMarkers = [];

    if (!samplePlaces || !routeMap) return;

    const fromKey = (from || '').toLowerCase().split(',')[0].trim();
    const toKey = (to || '').toLowerCase().split(',')[0].trim();

    // Find places from origin and destination cities
    const relevantPlaces = samplePlaces.filter(p => p.city === fromKey || p.city === toKey);

    // Also find places roughly along the route (within ~150km of the route line)
    const allPlaces = samplePlaces.filter(p => {
        if (p.city === fromKey || p.city === toKey) return false;
        // Check if place is roughly between origin and destination
        const minLat = Math.min(fromCoord.lat, toCoord.lat) - 3;
        const maxLat = Math.max(fromCoord.lat, toCoord.lat) + 3;
        const minLng = Math.min(fromCoord.lng, toCoord.lng) - 3;
        const maxLng = Math.max(fromCoord.lng, toCoord.lng) + 3;
        return p.lat >= minLat && p.lat <= maxLat && p.lng >= minLng && p.lng <= maxLng;
    });

    const allNearby = [...relevantPlaces, ...allPlaces];

    const colors = { hospital: '#3498db', police: '#9b59b6', hotel: '#f1c40f', restaurant: '#27ae60' };
    const icons = { hospital: '🏥', police: '🚔', hotel: '🏨', restaurant: '🍽️' };
    const labels = { hospital: 'Hospital', police: 'Police', hotel: 'Hotel', restaurant: 'Restaurant' };

    allNearby.forEach(place => {
        if (!place.lat || !place.lng || !routePOIVisible) return;

        const color = colors[place.type] || '#ff6b35';
        const icon = icons[place.type] || '📍';

        // Create custom icon
        const poiIcon = L.divIcon({
            className: 'route-poi-marker',
            html: '<div style="background:' + color + ';color:white;border-radius: 15000%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:14px;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);cursor:pointer;">' + icon + '</div>',
            iconSize: [28, 28],
            iconAnchor: [14, 14]
        });

        const marker = L.marker([place.lat, place.lng], { icon: poiIcon }).addTo(routeMap);

        const budgetColor = place.budget && place.budget.includes('Luxury') ? '#e74c3c' :
                            place.budget && place.budget.includes('Premium') ? '#f39c12' :
                            place.budget && place.budget.includes('Budget') ? '#27ae60' :
                            place.budget && place.budget.includes('Free') ? '#3498db' : '#64748b';

        marker.bindPopup(
            '<div style="min-width:200px;font-family:inherit;">' +
            '<div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">' +
            '<span style="background:' + color + '20;color:' + color + ';padding:2px 8px;border-radius: 15000px;font-size:0.75rem;font-weight:600;">' + labels[place.type] + '</span>' +
            '<span style="background:' + budgetColor + '20;color:' + budgetColor + ';padding:2px 8px;border-radius: 15000px;font-size:0.75rem;font-weight:600;">' + (place.budget || 'N/A') + '</span>' +
            '</div>' +
            '<b style="font-size:1.05em;">' + icon + ' ' + place.name + '</b><br>' +
            '<small style="color:#666;">' + place.address + '</small><br>' +
            '<div style="margin-top:4px;display:flex;gap:12px;align-items:center;">' +
            '<span style="color:#f39c12;font-weight:600;">⭐ ' + (place.rating || 'N/A') + '</span>' +
            '<span style="color:#888;font-size:0.8em;">(' + formatNumber(place.reviews || 0) + ' reviews)</span>' +
            '</div>' +
            '<a href="tel:' + place.phone + '" style="display:inline-block;margin-top:6px;padding:4px 12px;background:#27ae60;color:white;border-radius: 15000px;text-decoration:none;font-size:0.85rem;font-weight:600;">📞 Call ' + place.phone + '</a>' +
            '</div>'
        );

        marker._poiType = place.type;
        routePOIMarkers.push(marker);
    });

    // Update POI count badge
    updatePOICount();
}

let activePOIFilter = 'all';
function toggleRoutePOI(type) {
    if (type === 'all') {
        activePOIFilter = 'all';
    } else {
        activePOIFilter = (activePOIFilter === type) ? 'all' : type;
    }
    routePOIMarkers.forEach(m => {
        if (activePOIFilter === 'all' || m._poiType === activePOIFilter) {
            m.addTo(routeMap);
        } else {
            try { routeMap.removeLayer(m); } catch(e){}
        }
    });
    // Update toggle button states
    document.querySelectorAll('.route-poi-toggle').forEach(btn => {
        const btnType = btn.getAttribute('onclick').match(/toggleRoutePOI\('(\w+)'/);
        if (btnType) {
            btn.classList.toggle('active', btnType[1] === activePOIFilter);
        }
    });
    // Update toggle button states
    document.querySelectorAll('.route-poi-toggle').forEach(btn => {
        if (type === 'all') {
            btn.classList.toggle('active', routePOIVisible);
        }
    });
    updatePOICount();
}

function updatePOICount() {
    const badge = document.getElementById('route-poi-count');
    if (badge) {
        const visible = routePOIMarkers.filter(m => routeMap.hasLayer(m)).length;
        badge.textContent = visible + ' places';
    }
}

// ==================== TOURIST GUIDE CHATBOT ====================

const CHATBOT_DB = {

    delhi: {

        name: 'Delhi', state: 'Delhi (NCR)', bestTime: 'October to March',

        tagline: 'Heart of India — Mughal heritage meets modern metropolis',

        places: [

            { name: 'Red Fort', type: 'monument', desc: 'UNESCO site. Stunning Mughal fortress built by Shah Jahan.', tip: 'Book online. Closed Mondays.', budget: '₹35' },

            { name: 'Qutub Minar', type: 'monument', desc: '73m victory tower from 1193. UNESCO World Heritage.', tip: 'Visit early morning.', budget: '₹35' },

            { name: 'India Gate', type: 'landmark', desc: 'War memorial honoring 70,000+ soldiers. Beautiful lawns.', tip: 'Visit after 6 PM for lights.', budget: 'Free' },

            { name: 'Humayun\'s Tomb', type: 'monument', desc: 'Inspiration for the Taj Mahal. UNESCO site.', tip: 'Golden hour light is best.', budget: '₹35' },

            { name: 'Lotus Temple', type: 'spiritual', desc: 'Lotus-shaped Bahá\'í House of Peace. 2,500 capacity.', tip: 'Silence enforced inside.', budget: 'Free' },

            { name: 'Chandni Chowk', type: 'market', desc: 'Oldest market in Old Delhi. Parathewali Gali.', tip: 'Take a cycle-rickshaw.', budget: 'Free' },

            { name: 'Akshardham', type: 'spiritual', desc: 'Modern Hindu temple. Boat ride + musical fountain.', tip: 'No phones inside.', budget: 'Free' },

            { name: 'Jama Masjid', type: 'spiritual', desc: 'India\'s largest mosque. Stunning Old Delhi views.', tip: 'Climb south minaret.', budget: 'Free' }

        ],

        food: ['Paranthas at Paranthe Wali Gali', 'Chole Bhature at Sita Ram', 'Butter Chicken at Moti Mahal', 'Chaat at Bengali Market', 'Kebabs at Karim\'s', 'Kulfi at Kuremal'],

        hotels: [{ name: 'The Imperial', budget: 'Luxury ₹15K+', rating: '4.7' }, { name: 'Taj Mahal Hotel', budget: 'Luxury ₹12K+', rating: '4.6' }, { name: 'The LaLiT', budget: 'Premium ₹7K+', rating: '4.4' }, { name: 'Zostel Delhi', budget: 'Budget ₹500-1500', rating: '4.0' }],

        transport: ['Delhi Metro (best)', 'Auto-rickshaw', 'Uber/Ola', 'Hop-on Hop-off bus', 'Cycle-rickshaw in Old Delhi'],

        tips: ['Wear mask Nov-Feb (AQI 400+)', 'Beware touts at monuments', 'Get Tourist Metro Card', 'Weekend getaway: Agra 2h by train']
        ,
        packing: {'climate':'Extreme heat (45C summer), cold foggy winters (2-5C)','dress':'Light cotton summer, heavy woolens winter, modest for mosques','shoes':'Comfortable walking shoes, sandals','medicine':'N95 masks (AQI 400+), sunscreen SPF50, ORS','comfort':'Water bottle, hand sanitizer, power bank, umbrella','snacks':'Dry fruits, energy bars'},

    },

    mumbai: {

        name: 'Mumbai', state: 'Maharashtra', bestTime: 'November to February',

        tagline: 'City of Dreams — Bollywood, Gateway, and beyond',

        places: [

            { name: 'Gateway of India', type: 'monument', desc: 'Iconic arch overlooking Arabian Sea. Ferry point.', tip: 'Visit at sunset.', budget: 'Free' },

            { name: 'Marine Drive', type: 'landmark', desc: '3.6km curved promenade. Queen\'s Necklace at night.', tip: 'Evening walk is magical.', budget: 'Free' },

            { name: 'Elephanta Caves', type: 'monument', desc: 'UNESCO rock-cut caves. 7th century Shiva sculptures.', tip: 'Ferry takes 1 hour.', budget: '₹40 + ₹150 ferry' },

            { name: 'CST Station', type: 'heritage', desc: 'UNESCO Gothic Victorian railway station.', tip: 'Best at night lit up.', budget: 'Free' },

            { name: 'Juhu Beach', type: 'beach', desc: 'Most famous Mumbai beach. Street food paradise.', tip: 'Try bhel puri.', budget: 'Free' },

            { name: 'Haji Ali Dargah', type: 'spiritual', desc: 'Mosque on sea islet. Accessible at low tide.', tip: 'Check tide timings.', budget: 'Free' },

            { name: 'Siddhivinayak Temple', type: 'spiritual', desc: 'Most popular Ganesh temple. Bollywood visits.', tip: 'Tuesday is busiest.', budget: 'Free' },

            { name: 'Colaba Causeway', type: 'market', desc: 'Bustling street market. Bargain shopping.', tip: 'Haggle at 40% of price.', budget: 'Free' }

        ],

        packing: {'climate':'Hot humid (32-37C), monsoon Jun-Sep, mild winters (18-25C)','dress':'Light cotton, waterproof jacket monsoon, light layers winter','shoes':'Comfortable walking shoes, waterproof sandals','medicine':'ORS, mosquito repellent, sunscreen, basic first-aid','comfort':'Umbrella/raincoat, waterproof bag, power bank','snacks':'Dry fruits, packaged water'},

        food: ['Vada Pav at Ashok Vada Pav', 'Pav Bhaji at Sardar', 'Pani Puri at Elco', 'Bombil Fry at Mahesh', 'Missal Pav at Aaswad', 'Kheema Pav at Café Madras'],

        hotels: [{ name: 'Taj Mahal Palace', budget: 'Luxury ₹18K+', rating: '4.8' }, { name: 'Leela Mumbai', budget: 'Luxury ₹12K+', rating: '4.6' }, { name: 'Trident BKC', budget: 'Premium ₹8K+', rating: '4.5' }, { name: 'Hotel Residency', budget: 'Budget ₹2K-4K', rating: '3.9' }],

        transport: ['Local Train (fastest)', 'BEST Bus', 'Metro Line 1&2', 'Uber/Ola', 'Auto-rickshaw (suburbs)'],

        tips: ['Avoid local trains peak hours', 'Monsoon Jun-Sep disrupts city', 'Try Irani cafés', 'Gateway→Elephanta ferry']

    },

    kolkata: {

        name: 'Kolkata', state: 'West Bengal', bestTime: 'October to March',

        tagline: 'City of Joy — cultural capital of India',

        places: [

            { name: 'Victoria Memorial', type: 'monument', desc: 'White marble memorial. Museum with 28,394 artifacts.', tip: 'Evening sound & light show.', budget: '₹30' },

            { name: 'Howrah Bridge', type: 'landmark', desc: 'World\'s longest cantilever bridge over Hooghly.', tip: 'View from Prinsep Ghat.', budget: 'Free' },

            { name: 'BITM', type: 'museum', desc: 'India\'s first science museum. Interactive exhibits.', tip: 'Great for families.', budget: '₹50' },

            { name: 'Alipore Zoo', type: 'attraction', desc: 'Oldest zoo. Royal Bengal Tigers, elephants.', tip: 'Closed Thursdays.', budget: '₹50' },

            { name: 'Eden Gardens', type: 'landmark', desc: 'India\'s largest cricket stadium. 68,000 seats.', tip: 'Check match schedules.', budget: 'Free' },

            { name: 'Birla Planetarium', type: 'museum', desc: 'Largest in Asia. Sky shows daily.', tip: 'Shows at 12:30, 2:30, 4:30.', budget: '₹80' },

            { name: 'Jorasanko Thakur Bari', type: 'heritage', desc: 'Tagore family home. Rabindranath\'s birthplace.', tip: 'Guided tours available.', budget: '₹50' },

            { name: 'Kalighat Temple', type: 'spiritual', desc: 'One of 51 Shakti Peethas. Goddess Kali shrine.', tip: 'Visit early morning.', budget: 'Free' }

        ],

        packing: {'climate':'Hot humid (30-38C), pleasant winters (12-25C), monsoon Jun-Sep','dress':'Light cotton, shawl for AC, modest for temples','shoes':'Walking shoes, waterproof sandals','medicine':'ORS, mosquito repellent, sunscreen, digestive tablets','comfort':'Umbrella, power bank, water bottle, wet wipes','snacks':'Dry fruits, packaged water'},

        food: ['Kathi Rolls at Kusum Rolls', 'Mishti Doi at 6 Ballygunge Place', 'Bengali Thali at Oh! Calcutta', 'Puchka at Vivekananda Park', 'Rosogolla at KC Das', 'Biryani at Arsalan'],

        hotels: [{ name: 'Oberoi Grand', budget: 'Luxury ₹15K+', rating: '4.7' }, { name: 'Taj Bengal', budget: 'Luxury ₹12K+', rating: '4.6' }, { name: 'ITC Sonar', budget: 'Premium ₹8K+', rating: '4.5' }, { name: 'Hotel Astor', budget: 'Budget ₹2K-4K', rating: '3.8' }],

        transport: ['Metro (fastest)', 'Tram (oldest in India)', 'Yellow Taxi', 'Uber/Ola', 'Ferry across Hooghly'],

        tips: ['Durga Puja Oct is incredible but crowded', 'Learn "Dhonnobad" (Thank you)', 'Park Street for nightlife', 'Try the tram ride']

    },

    bangalore: {

        name: 'Bangalore', state: 'Karnataka', bestTime: 'October to February',

        tagline: 'Garden City of India — tech hub with green soul',

        places: [

            { name: 'Lalbagh Garden', type: 'park', desc: '240 acres. 1,854 plant species. Glass house.', tip: 'Morning visit best.', budget: '₹20' },

            { name: 'Cubbon Park', type: 'park', desc: '300-acre green lung. Victorian buildings.', tip: 'Great for walks.', budget: 'Free' },

            { name: 'Bangalore Palace', type: 'heritage', desc: 'Tudor-style palace. Royal artifacts.', tip: 'Audio guide recommended.', budget: '₹230' },

            { name: 'ISKCON Temple', type: 'spiritual', desc: 'Largest ISKCON temple. Evening aarti.', tip: 'Aarti at 7 PM.', budget: 'Free' },

            { name: 'Nandi Hills', type: 'nature', desc: 'Hill station 60km away. Sunrise point.', tip: 'Start 5 AM for sunrise.', budget: '₹20' },

            { name: 'Bannerghatta', type: 'nature', desc: 'Wildlife safari, zoo, butterfly park.', tip: 'Full day trip.', budget: '₹800 safari' },

            { name: 'UB City', type: 'shopping', desc: 'Premium luxury mall. Fine dining.', tip: 'Evening outings.', budget: 'Free' },

            { name: 'Vidhana Soudha', type: 'landmark', desc: 'Legislative building. Illuminated Sundays.', tip: 'Night viewing best.', budget: 'Exterior only' }

        ],

        packing: {'climate':'Pleasant year-round (20-33C), occasional rain, cool evenings','dress':'Light cotton, light jacket for evenings, casual comfortable','shoes':'Walking shoes, sneakers, comfortable sandals','medicine':'Sunscreen, basic first-aid, allergy tablets','comfort':'Light jacket evenings, power bank, umbrella','snacks':'Dry fruits, filter coffee, energy bars'},

        food: ['Masala Dosa at MTR', 'Filter Coffee at Indian Coffee House', 'Bisi Bele Bath at Vidyarthi Bhavan', 'Pulao at Meghana Foods', 'Momos at Tibetan Kitchen', 'Craft Beer at Toit'],

        hotels: [{ name: 'Leela Palace', budget: 'Luxury ₹15K+', rating: '4.7' }, { name: 'Taj West End', budget: 'Luxury ₹10K+', rating: '4.6' }, { name: 'JW Marriott', budget: 'Premium ₹7K+', rating: '4.5' }, { name: 'Zostel Bangalore', budget: 'Budget ₹500-1500', rating: '4.0' }],

        transport: ['Namma Metro', 'BMTC Bus', 'Uber/Ola', 'Auto-rickshaw', 'Rented bikes'],

        tips: ['Traffic is legendary — plan 2x time', 'Pleasant weather year-round', 'Craft beer culture is huge', 'Weekend: Nandi Hills, Coorg']

    },

    chennai: {

        name: 'Chennai', state: 'Tamil Nadu', bestTime: 'November to February',

        tagline: 'Gateway to South India — temples, beaches, Carnatic music',

        places: [

            { name: 'Marina Beach', type: 'beach', desc: '2nd longest urban beach. 13km.', tip: 'Evening visits only.', budget: 'Free' },

            { name: 'Kapaleeshwarar Temple', type: 'spiritual', desc: '7th century Dravidian temple. Colorful gopuram.', tip: 'Evening puja.', budget: 'Free' },

            { name: 'Fort St. George', type: 'heritage', desc: 'First English fortress in India (1644).', tip: 'Closed Fridays.', budget: '₹25' },

            { name: 'Government Museum', type: 'museum', desc: '2nd oldest museum. Bronze gallery famous.', tip: 'Allow 3 hours.', budget: '₹15' },

            { name: 'Santhome Cathedral', type: 'spiritual', desc: 'Built over Apostle St. Thomas\'s tomb.', tip: 'Beautiful stained glass.', budget: 'Free' },

            { name: 'Mylapore', type: 'cultural', desc: 'Historic neighborhood. Silk shops, music.', tip: 'Dec music season famous.', budget: 'Free' },

            { name: 'Cholamandal Artists Village', type: 'art', desc: 'Artists\' commune. Galleries, sculpture.', tip: 'Handmade souvenirs.', budget: 'Free' },

            { name: 'VGP Universal Kingdom', type: 'entertainment', desc: 'Beach-side amusement park.', tip: 'Combo tickets save.', budget: '₹600-800' }

        ],

        packing: {'climate':'Hot humid (25-38C), heavy monsoon Oct-Dec, pleasant Dec-Feb','dress':'Light breathable cotton, covered for temples, rain gear monsoon','shoes':'Comfortable sandals, walking shoes','medicine':'ORS, mosquito repellent, sunscreen SPF50+','comfort':'Umbrella, wet wipes, power bank, water bottle','snacks':'Dry fruits, buttermilk packets'},

        food: ['Dosa at Saravana Bhavan', 'Chettinad Chicken at Ponnusamy', 'Filter Coffee at Mylapore', 'Biryani at Dindigul Thalappakatti', 'Idli at Murugan Idli Shop', 'Meals at Anjappar'],

        hotels: [{ name: 'Taj Coromandel', budget: 'Luxury ₹12K+', rating: '4.7' }, { name: 'ITC Grand Chola', budget: 'Luxury ₹10K+', rating: '4.6' }, { name: 'Radisson Blu', budget: 'Premium ₹5K+', rating: '4.3' }, { name: 'Zostel Chennai', budget: 'Budget ₹500-1500', rating: '4.0' }],

        transport: ['Chennai Metro', 'MTC Bus', 'Suburban Train', 'Uber/Ola', 'Auto-rickshaw'],

        tips: ['Very hot — carry water always', 'Dec music season is world-famous', 'Dress modestly at temples', 'Day trip to Mahabalipuram']

    },

    pune: {

        name: 'Pune', state: 'Maharashtra', bestTime: 'October to March',

        tagline: 'Oxford of the East — history, culture, nightlife',

        places: [

            { name: 'Aga Khan Palace', type: 'heritage', desc: 'Where Gandhi was imprisoned. Beautiful gardens.', tip: 'Gandhi\'s ashes preserved.', budget: '₹30' },

            { name: 'Shaniwar Wada', type: 'monument', desc: 'Peshwa fortress (1732). Sound & light show.', tip: 'Show at 7:15 PM.', budget: '₹25' },

            { name: 'Sinhagad Fort', type: 'nature', desc: 'Hill fortress. Trekking, waterfalls.', tip: 'Best in monsoon.', budget: '₹20' },

            { name: 'Dagdusheth Ganpati', type: 'spiritual', desc: 'Most famous Ganesh temple. Elaborate festivals.', tip: 'Festival time spectacular.', budget: 'Free' },

            { name: 'Kelkar Museum', type: 'museum', desc: 'Quirky museum. 20,000+ artifacts.', tip: 'Fascinating and underrated.', budget: '₹20' },

            { name: 'Pashan Lake', type: 'nature', desc: 'Serene lake. Birdwatching, flamingos in winter.', tip: 'Early morning for birds.', budget: 'Free' },

            { name: 'Okayama Friendship Garden', type: 'park', desc: 'Japanese garden. Bonsai, zen.', tip: 'Peaceful retreat.', budget: '₹10' },

            { name: 'Koregaon Park', type: 'nightlife', desc: 'Trendy cafes, pubs, Osho Resort.', tip: 'Friday nights vibrant.', budget: 'Free' }

        ],

        packing: {'climate':'Pleasant (15-35C), heavy monsoon Jun-Sep, cool winters','dress':'Light layers, rain gear monsoon, warm jacket winter mornings','shoes':'Walking shoes, waterproof shoes monsoon','medicine':'Sunscreen, basic first-aid, allergy tablets','comfort':'Light jacket, power bank, umbrella','snacks':'Dry fruits, energy bars'},

        food: ['Mastani at Sujata Mastani', 'Misal Pav at Bedekar', 'Vada Pav at Garden Vada Pav', 'Bakarvadi at Chitale', 'Chinese at Marzorin', 'Thali at Shreyas'],

        hotels: [{ name: 'JW Marriott', budget: 'Luxury ₹10K+', rating: '4.6' }, { name: 'Westin Pune', budget: 'Luxury ₹8K+', rating: '4.5' }, { name: 'Novotel', budget: 'Premium ₹5K+', rating: '4.3' }, { name: 'Zostel Pune', budget: 'Budget ₹500-1500', rating: '4.0' }],

        transport: ['Pune Metro', 'PMPML Bus', 'Uber/Ola', 'Auto-rickshaw', 'Rent bike for forts'],

        tips: ['Trekker\'s paradise — Sinhagad, Rajgad, Torna', 'Ganesh Chaturthi Aug-Sep is biggest festival', 'Weekend: Lonavala, Alibaug within 2h', 'MG Road for cafes']

    },

    jaipur: {

        name: 'Jaipur', state: 'Rajasthan', bestTime: 'October to March',

        tagline: 'Pink City — royal heritage and vibrant bazaars',

        places: [

            { name: 'Amber Fort', type: 'monument', desc: 'Magnificent hilltop fortress. Mirror palace.', tip: 'Go early. Jeep ride up.', budget: '₹100' },

            { name: 'Hawa Mahal', type: 'monument', desc: 'Palace of Winds. 953 small windows.', tip: 'Photo from opposite café.', budget: '₹50' },

            { name: 'City Palace', type: 'heritage', desc: 'Royal family home. Museum inside.', tip: 'Allow 3 hours.', budget: '₹200' },

            { name: 'Jantar Mantar', type: 'monument', desc: 'UNESCO astronomical observatory.', tip: 'Guided tour recommended.', budget: '₹50' },

            { name: 'Nahargarh Fort', type: 'nature', desc: 'Panoramic Jaipur views. Sunset point.', tip: 'Open till 10 PM.', budget: '₹50' },

            { name: 'Jal Mahal', type: 'landmark', desc: 'Water palace in Man Sagar Lake.', tip: 'Boat rides available.', budget: 'Free' },

            { name: 'Albert Hall Museum', type: 'museum', desc: 'Oldest Rajasthan museum. Egyptian mummy.', tip: 'Beautiful at night.', budget: '₹40' },

            { name: 'Birla Mandir', type: 'spiritual', desc: 'White marble temple. Stunning carvings.', tip: 'Beautiful at night.', budget: 'Free' }

        ],

        packing: {'climate':'Hot (25-45C summer), pleasant winters (8-22C), monsoon Jul-Sep','dress':'Light cotton, comfortable modest clothing for forts/palaces, head scarf','shoes':'Comfortable walking shoes, sandals','medicine':'Sunscreen SPF50+, ORS, lip balm, anti-dehydration tablets','comfort':'Water bottle (2L+), hat/cap, umbrella, sunglasses','snacks':'Dry fruits, energy bars, extra water'},

        food: ['Dal Bati Churma at Chokhi Dhani', 'Kachori at Rawat', 'Lassi at Lassiwala MI Road', 'Laal Maas at 1135 AD', 'Pyaaz Kachori at Tapri', 'Ghewar at Laxmi Bhandar'],

        hotels: [{ name: 'Rambagh Palace', budget: 'Luxury ₹25K+', rating: '4.9' }, { name: 'Oberoi Rajvilas', budget: 'Luxury ₹20K+', rating: '4.8' }, { name: 'Samode Haveli', budget: 'Premium ₹8K+', rating: '4.6' }, { name: 'Zostel Jaipur', budget: 'Budget ₹500-1500', rating: '4.1' }],

        transport: ['Jaipur Metro', 'BSRT Bus', 'Uber/Ola', 'Auto-rickshaw', 'Rented scooter'],

        tips: ['Bargain hard at Johari Bazaar', 'Comfortable shoes needed', 'Chokhi Dhani for Rajasthani experience', 'Ranthambore 3.5h for tiger safari']

    },

    varanasi: {

        name: 'Varanasi', state: 'Uttar Pradesh', bestTime: 'October to March',

        tagline: 'Spiritual capital — where the Ganges meets eternity',

        places: [

            { name: 'Dashashwamedh Ghat', type: 'spiritual', desc: 'Main ghat. Spectacular Ganga Aarti.', tip: 'Reach by 5 PM.', budget: 'Free' },

            { name: 'Kashi Vishwanath', type: 'spiritual', desc: 'One of 12 Jyotirlingas. Most sacred.', tip: 'Long queues. Special darshan.', budget: 'Free' },

            { name: 'Sarnath', type: 'monument', desc: 'Buddha\'s first sermon site. Dhamek Stupa.', tip: 'Half day trip.', budget: '₹20 museum' },

            { name: 'Assi Ghat', type: 'spiritual', desc: 'Southern ghat. Sunrise yoga.', tip: 'Morning yoga classes.', budget: 'Free' },

            { name: 'Manikarnika Ghat', type: 'spiritual', desc: 'Cremation ghat. Deeply spiritual.', tip: 'Be respectful. No photos.', budget: 'Free' },

            { name: 'Ramnagar Fort', type: 'heritage', desc: '18th century Mughal fort. Museum.', tip: 'Boat ride to fort.', budget: '₹50' },

            { name: 'BHU Campus', type: 'spiritual', desc: 'University campus. Modern temple.', tip: 'Peaceful walks.', budget: 'Free' },

            { name: 'Tulsi Manas Temple', type: 'spiritual', desc: 'Where Ramcharitmanas was written.', tip: 'Marble carved verses.', budget: 'Free' }

        ],

        packing: {'climate':'Extreme heat (40-48C summer), pleasant winters (8-22C)','dress':'Light cotton, modest for ghats/temples, head covering optional','shoes':'Comfortable walking shoes, waterproof sandals','medicine':'ORS, sunscreen SPF50+, mosquito repellent, anti-diarrheal','comfort':'Water bottle, umbrella, flashlight for evening aarti','snacks':'Dry fruits, malaiyo (winter specialty)'},

        food: ['Kachori Sabzi at Kachori Gali', 'Banarasi Paan at Deepak', 'Malaiyo at Dashashwamedh', 'Lassi at Blue Lassi Shop', 'Chaat at Kashi Chaat Bhandar', 'Thandai at Bhimsen Ghat'],

        hotels: [{ name: 'Taj Nadesar Palace', budget: 'Luxury ₹15K+', rating: '4.7' }, { name: 'BrijRama Palace', budget: 'Luxury ₹12K+', rating: '4.8' }, { name: 'Suryaudho Haveli', budget: 'Premium ₹5K+', rating: '4.5' }, { name: 'Zostel Varanasi', budget: 'Budget ₹400-1200', rating: '4.2' }],

        transport: ['E-rickshaw', 'Boat rides', 'Auto-rickshaw', 'Walking (best for ghats)', 'Cycle-rickshaw old city'],

        tips: ['Sunrise boat ride is essential', 'Easy-off shoes for temples', 'Visit during Dev Deepawali (Nov)', 'Carry cloth for cremation ghat visit']

    },

    agra: {

        name: 'Agra', state: 'Uttar Pradesh', bestTime: 'October to March',

        tagline: 'City of the Taj — home to the world\'s greatest love monument',

        places: [

            { name: 'Taj Mahal', type: 'monument', desc: 'UNESCO site. Wonder of the World. Shah Jahan\'s tribute.', tip: 'Sunrise visit. Closed Fridays. ₹45 foreigners.', budget: '₹50 Indians' },

            { name: 'Agra Fort', type: 'monument', desc: 'UNESCO Mughal fortress. Taj Mahal view from here.', tip: '3 hours needed.', budget: '₹50' },

            { name: 'Fatehpur Sikri', type: 'monument', desc: 'UNESCO ghost city. Mughal capital for 10 years.', tip: '40km from Agra. Half day trip.', budget: '₹50' },

            { name: 'Mehtab Bagh', type: 'park', desc: 'Moonlight garden. Taj Mahal view across river.', tip: 'Best for sunset photos.', budget: '₹25' },

            { name: 'Itimad-ud-Daulah', type: 'monument', desc: 'Baby Taj. Exquisite marble inlay work.', tip: 'Less crowded than Taj.', budget: '₹30' },

            { name: 'Akbar\'s Tomb', type: 'monument', desc: 'Sikandara. Impressive Mughal architecture.', tip: 'Large campus.', budget: '₹25' },

            { name: 'Kinari Bazaar', type: 'market', desc: 'Chaos of colors. Marble souvenirs.', tip: 'Haggle hard.', budget: 'Free' },

            { name: 'Chini Ka Rauza', type: 'monument', desc: 'Chinese glazed tile tomb. Unique.', tip: 'Off the beaten path.', budget: '₹20' }

        ],

        packing: {'climate':'Hot (25-45C), pleasant winters (8-22C), foggy Dec-Jan','dress':'Light cotton summer, warm layers winter, modest for monuments','shoes':'Comfortable walking shoes (lots of walking at Taj)','medicine':'Sunscreen, ORS, basic first-aid','comfort':'Water bottle, hat, umbrella, sunglasses','snacks':'Dry fruits, petha (local sweet), energy bars'},

        food: ['Petha at Various Shops', 'Bedai & Jalebi at Deviram', 'Mughlai at Pinch of Spice', 'Chole Bhature at Sita Ram', 'Lassi atshaliram', 'Tandoori at Taj Resorts'],

        hotels: [{ name: 'The Oberoi Amarvilas', budget: 'Luxury ₹30K+', rating: '4.9' }, { name: 'ITC Mughal', budget: 'Luxury ₹10K+', rating: '4.6' }, { name: 'Courtyard by Marriott', budget: 'Premium ₹5K+', rating: '4.3' }, { name: 'Zostel Agra', budget: 'Budget ₹400-1200', rating: '4.1' }],

        transport: ['Cycle-rickshaw', 'Auto-rickshaw', 'Uber/Ola', 'Tonga (horse carriage)', 'Delhi-Agra train (2h)'],

        tips: ['Book Taj tickets online to skip lines', 'Taj by moonlight on full moon night', 'Agra is a day trip from Delhi', 'Buy marble inlay souvenirs']

    },

    goa: {

        name: 'Goa', state: 'Goa', bestTime: 'November to February',

        tagline: 'Beach Paradise — sun, sand, seafood, and nightlife',

        places: [

            { name: 'Baga Beach', type: 'beach', desc: 'Most popular beach. Water sports, nightlife.', tip: 'Night markets nearby.', budget: 'Free' },

            { name: 'Old Goa Churches', type: 'monument', desc: 'UNESCO Portuguese churches. Basilica of Bom Jesus.', tip: 'Dress modestly.', budget: 'Free' },

            { name: 'Dudhsagar Falls', type: 'nature', desc: 'India\'s tallest waterfall. 310 meters.', tip: 'Jeep safari only.', budget: '₹500' },

            { name: 'Fort Aguada', type: 'heritage', desc: '17th century Portuguese fort. Lighthouse.', tip: 'Sunset views.', budget: 'Free' },

            { name: 'Palolem Beach', type: 'beach', desc: 'Crescent-shaped. Calm waters. South Goa.', tip: 'Kayak to monkey island.', budget: 'Free' },

            { name: 'Anjuna Flea Market', type: 'market', desc: 'Wednesday market. Hippie vibes. Souvenirs.', tip: 'Bargain is key.', budget: 'Free' },

            { name: 'Chapora Fort', type: 'heritage', desc: 'Dil Chahta Hai fort. Panoramic views.', tip: 'Climb for sunset.', budget: 'Free' },

            { name: 'Spice Plantations', type: 'nature', desc: 'Ponda spice farms. Tours with lunch.', tip: 'Sahakari plantation is popular.', budget: '₹400' }

        ],

        packing: {'climate':'Hot humid (25-33C), pleasant Nov-Feb, monsoon Jun-Sep','dress':'Beachwear, swimwear, light cotton, modest for churches/temples','shoes':'Flip-flops, sandals, water shoes for rocky beaches','medicine':'Sunscreen SPF50+, mosquito repellent, ORS, anti-diarrheal','comfort':'Beach towel, waterproof bag, hat, sunglasses','snacks':'Coconut water, cashewnuts, seafood'},

        food: ['Fish Curry Rice at local shacks', 'Bebinca at Venite', 'Prawn Balchão at Gunpowder', 'Vindaloo at Gunpowder', 'Feni at local bars', 'Xacuti at Fisherman\'s Wharf'],

        hotels: [{ name: 'Taj Fort Aguada', budget: 'Luxury ₹15K+', rating: '4.7' }, { name: 'Leela Goa', budget: 'Luxury ₹12K+', rating: '4.8' }, { name: 'The Park', budget: 'Premium ₹5K+', rating: '4.3' }, { name: 'Zostel Goa', budget: 'Budget ₹400-1200', rating: '4.0' }],

        transport: ['Rented scooter/bike (best)', 'Auto-rickshaw', 'Uber/Ola (limited)', 'Bus (Kadamba)', 'Taxi'],

        tips: ['Rent a scooter — best way to explore', 'North Goa = party, South Goa = peace', 'Monsoon Jun-Sep closes many beach shacks', 'Carry sunscreen always']

    },

    udaipur: {

        name: 'Udaipur', state: 'Rajasthan', bestTime: 'September to March',

        tagline: 'City of Lakes — Venice of the East',

        places: [

            { name: 'City Palace', type: 'heritage', desc: 'Largest palace complex in Rajasthan.', tip: 'Allow 3-4 hours.', budget: '₹300' },

            { name: 'Lake Pichola', type: 'nature', desc: 'Iconic lake. Boat rides to Jag Mandir.', tip: 'Sunset boat ride.', budget: '₹400 boat' },

            { name: 'Jagdish Temple', type: 'spiritual', desc: 'Indo-Aryan temple. Intricate carvings.', tip: 'Evening aarti.', budget: 'Free' },

            { name: 'Saheliyon Ki Bari', type: 'park', desc: 'Garden of Maidens. Lotus pools, fountains.', tip: 'Peaceful morning visit.', budget: '₹30' },

            { name: 'Monsoon Palace', type: 'monument', desc: 'Hilltop palace. Panoracular views.', tip: 'Sunset is spectacular.', budget: '₹80' },

            { name: 'Jag Mandir', type: 'heritage', desc: 'Island palace in Lake Pichola.', tip: 'Boat from City Palace.', budget: '₹400' },

            { name: 'Fateh Sagar Lake', type: 'nature', desc: 'Second lake. Nehru Island Garden.', tip: 'Speed boat rides.', budget: '₹50' },

            { name: 'Shilpgram', type: 'cultural', desc: 'Rural arts & crafts village. Live demos.', tip: 'Dec festival is amazing.', budget: '₹30' }

        ],

        packing: {'climate':'Hot (25-42C summer), pleasant winters (8-22C), monsoon Jul-Sep','dress':'Light cotton, comfortable clothing for palaces, evening wear','shoes':'Comfortable walking shoes, sandals','medicine':'Sunscreen, ORS, lip balm, basic medicines','comfort':'Water bottle, hat, umbrella, sunglasses','snacks':'Dry fruits, dal baati churma'},

        food: ['Dal Bati at Raas Leela', 'Rajasthani Thali at Ambrai', 'Pyaaz Kachori at MP Shadows', 'Lassi at Fateh Sagar', 'Italian at Upré by 1559 AD', 'Street food at Hathi Pol'],

        hotels: [{ name: 'Taj Lake Palace', budget: 'Luxury ₹25K+', rating: '4.9' }, { name: 'Oberoi Udaivilas', budget: 'Luxury ₹30K+', rating: '4.9' }, { name: 'Jagat Niwas', budget: 'Premium ₹4K+', rating: '4.5' }, { name: 'Zostel Udaipur', budget: 'Budget ₹400-1200', rating: '4.2' }],

        transport: ['Auto-rickshaw', 'Walking (old city)', 'Uber/Ola (limited)', 'Boat rides', 'Rented bike'],

        tips: ['Sunset boat ride is a must', 'Roof-top restaurants for lake views', 'Painting workshops available', '2-3 days minimum needed']

    },

    shimla: {

        name: 'Shimla', state: 'Himachal Pradesh', bestTime: 'March to June, December to January',

        tagline: 'Queen of Hills — colonial charm meets mountain serenity',

        places: [

            { name: 'The Ridge', type: 'landmark', desc: 'Open space in heart of Shimla. Mountain views.', tip: 'Evening stroll.', budget: 'Free' },

            { name: 'Mall Road', type: 'market', desc: 'Shopping street. Colonial-era buildings.', tip: 'Cars banned. Walking only.', budget: 'Free' },

            { name: 'Jakhoo Temple', type: 'spiritual', desc: 'Hanuman temple on highest point. 33m statue.', tip: 'Monkeys are aggressive.', budget: 'Free' },

            { name: 'Christ Church', type: 'heritage', desc: 'Second oldest church in North India. Gothic.', tip: 'Beautiful stained glass.', budget: 'Free' },

            { name: 'Kufri', type: 'nature', desc: 'Hill station 16km away. Snow activities.', tip: 'Winter for skiing.', budget: 'Free' },

            { name: 'Chadwick Falls', type: 'nature', desc: 'Waterfall surrounded by forests.', tip: 'Monsoon for best flow.', budget: 'Free' },

            { name: 'Naldehra', type: 'nature', desc: 'Golf course with mountain backdrop.', tip: 'Best for picnics.', budget: 'Free' },

            { name: 'Toy Train', type: 'heritage', desc: 'UNESCO Kalka-Shimla railway.', tip: 'Book in advance.', budget: '₹800' }

        ],

        packing: {'climate':'Cool (5-25C summer), cold snowy winters (-2 to 8C)','dress':'Warm layers, heavy woolens winter, light jacket summer, rain gear','shoes':'Trekking boots with grip, waterproof shoes, comfortable walking shoes','medicine':'Cold medicine, sunscreen (high altitude UV), lip balm, basic first-aid','comfort':'Thermos flask, warm socks, gloves, umbrella','snacks':'Hot chocolate, dry fruits, Maggi (local favorite)'},

        food: ['Siddu at local dhabas', 'Chana Madra at Himachali Rasoi', 'Thukpa at Nepal House', 'Momos at every corner', 'Apple pie at Wake & Bake', 'Tudor at Goofa Coffee'],

        hotels: [{ name: 'Wildflower Hall', budget: 'Luxury ₹25K+', rating: '4.8' }, { name: 'The Oberoi', budget: 'Luxury ₹20K+', rating: '4.7' }, { name: 'Hotel Combermere', budget: 'Premium ₹4K+', rating: '4.2' }, { name: 'Zostel Shimla', budget: 'Budget ₹500-1500', rating: '4.0' }],

        transport: ['Walking (best in Mall Road)', 'Local bus', 'Taxi', 'Toy Train', 'Auto-rickshaw'],

        tips: ['Book Toy Train well in advance', 'Carry warm clothes even in summer', 'Avoid weekends — too crowded', 'Snowfall Dec-Jan is magical']

    },

    manali: {

        name: 'Manali', state: 'Himachal Pradesh', bestTime: 'March to June, December to February',

        tagline: 'Adventure Capital — mountains, snow, and adrenaline',

        places: [

            { name: 'Solang Valley', type: 'nature', desc: 'Adventure hub. Paragliding, skiing, zorbing.', tip: 'Winter for skiing.', budget: 'Activities ₹500-2000' },

            { name: 'Hadimba Temple', type: 'spiritual', desc: 'Wooden temple in cedar forest.', tip: 'Beautiful setting.', budget: 'Free' },

            { name: 'Old Manali', type: 'cultural', desc: 'Quaint village. Cafes, shops, backpacker vibe.', tip: 'Best for evening walks.', budget: 'Free' },

            { name: 'Rohtang Pass', type: 'nature', desc: 'Mountain pass at 3,978m. Snow-capped.', tip: 'Permit needed. Book online.', budget: '₹500 + permit' },

            { name: 'Jogini Waterfall', type: 'nature', desc: 'Trek to beautiful waterfall.', tip: 'Easy 2-hour trek.', budget: 'Free' },

            { name: 'Vashisht Village', type: 'spiritual', desc: 'Hot springs and ancient temple.', tip: 'Natural hot water bath.', budget: 'Free' },

            { name: 'Mall Road Manali', type: 'market', desc: 'Shopping and dining street.', tip: 'Evening stroll.', budget: 'Free' },

            { name: 'Great Himalayan National Park', type: 'nature', desc: 'UNESCO site. Wildlife and trekking.', tip: 'Full day needed.', budget: '₹200' }

        ],

        packing: {'climate':'Cool (10-25C summer), freezing snowy winters (-7 to 5C)','dress':'Heavy woolens winter, light layers summer, waterproof jacket monsoon','shoes':'Trekking boots with grip, waterproof shoes','medicine':'Altitude sickness pills (for Rohtang), cold medicine, sunscreen','comfort':'Thermos, warm gloves, beanie cap, power bank','snacks':'Siddu (local bread), dry fruits, hot soups'},

        food: ['Thukpa at Lily\'s', 'Momos at Uncle\'s Kitchen', 'Trout at Johnson\'s Café', 'Dham at local feasts', 'Israeli food at Lazy Dog', 'Maggi at every café'],

        hotels: [{ name: 'The Himalayan', budget: 'Luxury ₹12K+', rating: '4.6' }, { name: 'Manu Allaya', budget: 'Luxury ₹10K+', rating: '4.7' }, { name: 'Hotel Beas', budget: 'Premium ₹3K+', rating: '4.0' }, { name: 'Zostel Manali', budget: 'Budget ₹400-1200', rating: '4.1' }],

        transport: ['Walking (old town)', 'Local bus', 'Taxi', 'Rented bike/scooter', 'HRTC bus to Rohtang'],

        tips: ['Rohtang permit sells out fast', 'Acclimatize before going high', 'Carry layers — weather changes fast', 'Old Manali > New Manali for vibes']

    },

    darjeeling: {

        name: 'Darjeeling', state: 'West Bengal', bestTime: 'April to June, October to December',

        tagline: 'Queen of the Himalayas — tea gardens and Kanchenjunga views',

        places: [

            { name: 'Tiger Hill', type: 'nature', desc: 'Sunrise point. Kanchenjunga view.', tip: 'Start 4 AM.', budget: '₹30 jeep' },

            { name: 'Darjeeling Himalayan Railway', type: 'heritage', desc: 'UNESCO Toy Train. Steam engine.', tip: 'Joy ride recommended.', budget: '₹800' },

            { name: 'Tea Gardens', type: 'nature', desc: 'Lush tea plantations. Factory tours.', tip: 'Makaibari estate.', budget: '₹100-300' },

            { name: 'Batasia Loop', type: 'landmark', desc: 'Spiral railway with war memorial.', tip: 'Great photo spot.', budget: '₹10' },

            { name: 'Padmaja Naidu Zoo', type: 'attraction', desc: 'Snow leopards, red pandas.', tip: 'Closed Mondays.', budget: '₹50' },

            { name: 'Peace Pagoda', type: 'spiritual', desc: 'Japanese Buddhist stupa. Serene.', tip: 'Panoramic views.', budget: 'Free' },

            { name: 'Rock Garden', type: 'park', desc: 'Terraced garden. Waterfalls.', tip: 'Good for walks.', budget: '₹10' },

            { name: 'Observatory Hill', type: 'spiritual', desc: 'Makalay temple. Mountain views.', tip: 'Best sunset point.', budget: 'Free' }

        ],

        packing: {'climate':'Cool (5-25C), foggy mornings, cold snowy winters (-2 to 8C)','dress':'Warm layers, heavy woolens winter, light jacket summer, rain gear','shoes':'Trekking boots, waterproof shoes, comfortable walking shoes','medicine':'Cold medicine, sunscreen, lip balm, basic first-aid','comfort':'Thermos, warm socks, gloves, rain poncho','snacks':'Momos, thukpa, Darjeeling tea, dry fruits'},

        food: ['Momos everywhere', 'Thukpa', 'Darjeeling Tea at tea houses', 'Sel Roti at local shops', 'Chowmein at Keventers', 'Chinese at Hong Kong Restaurant'],

        hotels: [{ name: 'Mayfair Darjeeling', budget: 'Luxury ₹10K+', rating: '4.6' }, { name: 'Windamere Hotel', budget: 'Premium ₹6K+', rating: '4.5' }, { name: 'Hotel Sinclairs', budget: 'Premium ₹4K+', rating: '4.2' }, { name: 'Zostel Darjeeling', budget: 'Budget ₹400-1000', rating: '4.0' }],

        transport: ['Toy Train', 'Shared jeeps', 'Walking', 'Taxi', 'Ropeway'],

        tips: ['Wake 4 AM for Tiger Hill sunrise', 'Carry warm clothes even in summer', 'Buy tea as souvenir', 'Toy train ride is a must']

    },

    srinagar: {

        name: 'Srinagar', state: 'Jammu & Kashmir', bestTime: 'March to October',

        tagline: 'Paradise on Earth — houseboats, gardens, and Dal Lake',

        places: [

            { name: 'Dal Lake', type: 'nature', desc: 'Iconic lake. Shikara rides, floating markets.', tip: 'Sunrise shikara ride.', budget: '₹500-1000 shikara' },

            { name: 'Mughal Gardens', type: 'park', desc: 'Nishat, Shalimar, Chashme Shahi.', tip: 'All three in one day.', budget: '₹50 each' },

            { name: 'Nigeen Lake', type: 'nature', desc: 'Quieter alternative to Dal Lake.', tip: 'Houseboat stays.', budget: 'Varies' },

            { name: 'Shankaracharya Temple', type: 'spiritual', desc: 'Ancient hilltop temple. Valley views.', tip: '250 steps to top.', budget: 'Free' },

            { name: 'Pari Mahal', type: 'heritage', desc: 'Mughal garden school. Terraced gardens.', tip: 'Evening light.', budget: '₹20' },

            { name: 'Hazratbal Shrine', type: 'spiritual', desc: 'White marble mosque on Dal Lake.', tip: 'Peaceful setting.', budget: 'Free' },

            { name: 'Floating Vegetable Market', type: 'market', desc: 'Early morning floating market on Dal Lake.', tip: 'Start 6 AM.', budget: 'Free' },

            { name: 'Gulmarg Gondola', type: 'nature', desc: 'World\'s highest cable car. Skiing.', tip: '2 hours from Srinagar.', budget: '₹700 gondola' }

        ],

        packing: {'climate':'Pleasant (10-25C summer), cold snowy winters (-2 to 10C)','dress':'Warm layers even summer, heavy woolens winter, rain gear monsoon','shoes':'Trekking boots, waterproof shoes, comfortable walking shoes','medicine':'Cold medicine, sunscreen, basic first-aid','comfort':'Thermos, warm clothing, rain gear','snacks':'Kahwa tea, dry fruits, local wazwan'},

        food: ['Rogan Josh at Ahdoos', 'Dum Aloo at Matamaal', 'Kahwa tea everywhere', 'Sheermal at local bakeries', 'Wazwan feast (traditional)', 'Noshe Doodh at tea shops'],

        hotels: [{ name: 'The Lalit Grand Palace', budget: 'Luxury ₹12K+', rating: '4.7' }, { name: 'Houseboats', budget: 'Premium ₹5K-15K', rating: '4.5' }, { name: 'Hotel Heevan', budget: 'Premium ₹4K+', rating: '4.3' }, { name: 'Zostel Srinagar', budget: 'Budget ₹400-1200', rating: '4.1' }],

        transport: ['Shikara on Dal Lake', 'Auto-rickshaw', 'Taxi', 'Walking', 'Shared sumos'],

        tips: ['Stay on a houseboat at least one night', 'Check security advisories before visit', 'Carry cash — ATMs unreliable', 'Gulmarg gondola needs advance booking']

    },

    amritsar: {

        name: 'Amritsar', state: 'Punjab', bestTime: 'October to March',

        tagline: 'Spiritual Heart of Sikhism — Golden Temple city',

        places: [

            { name: 'Golden Temple', type: 'spiritual', desc: 'Holiest Sikh shrine. Gold-plated. Langar feeds 50,000 daily.', tip: 'Visit at night when lit.', budget: 'Free' },

            { name: 'Jallianwala Bagh', type: 'monument', desc: '1919 massacre memorial. Bullet marks visible.', tip: 'Emotionally powerful.', budget: 'Free' },

            { name: 'Wagah Border', type: 'landmark', desc: 'India-Pakistan border ceremony.', tip: 'Reach 2 hours early.', budget: 'Free' },

            { name: 'Partition Museum', type: 'museum', desc: 'Tales of 1947 partition. Moving stories.', tip: 'Allow 2-3 hours.', budget: '₹10' },

            { name: 'Gobindgarh Fort', type: 'heritage', desc: '200-year-old fort. Museum, light show.', tip: 'Evening light show.', budget: '₹150' },

            { name: 'Hall Bazaar', type: 'market', desc: 'Traditional market. Phulkari, juttis.', tip: 'Haggle for souvenirs.', budget: 'Free' },

            { name: 'Durgiana Temple', type: 'spiritual', desc: 'Hindu temple similar to Golden Temple.', tip: 'Evening visit.', budget: 'Free' },

            { name: 'Ram Tirath', type: 'spiritual', desc: 'Ancient site. Birthplace of Luv and Kush.', tip: 'Annual fair in November.', budget: 'Free' }

        ],

        packing: {'climate':'Extreme (0-45C), hot summers, cold foggy winters, pleasant Oct-Mar','dress':'Light cotton summer, heavy woolens winter, head covering for Golden Temple','shoes':'Comfortable walking shoes, slip-ons for temple','medicine':'Sunscreen, ORS, cold medicine, basic first-aid','comfort':'Water bottle, head covering, warm shawl winter','snacks':'Amritsari kulcha, lassi, dry fruits'},

        food: ['Langar at Golden Temple (free!)', 'Amritsari Kulcha at Kulcha Land', 'Chole at Bharawan Da Dhaba', 'Lassi at Ahuja Milk Bhai', 'Jalebi at Old City', 'Fish at Makhan Fish Corner'],

        hotels: [{ name: 'Taj Swarna', budget: 'Luxury ₹8K+', rating: '4.6' }, { name: 'Hyatt Amritsar', budget: 'Luxury ₹7K+', rating: '4.5' }, { name: 'Hotel Gold Palace', budget: 'Premium ₹3K+', rating: '4.0' }, { name: 'Zostel Amritsar', budget: 'Budget ₹400-1000', rating: '4.1' }],

        transport: ['Auto-rickshaw', 'Cycle-rickshaw', 'Uber/Ola', 'Walking (old city)', 'Bus'],

        tips: ['Golden Temple langar is a must — free meal for all', 'Cover your head at Golden Temple', 'Wagah border ceremony starts 4 PM', 'Try the kulcha-chole breakfast']

    },

    rishikesh: {

        name: 'Rishikesh', state: 'Uttarakhand', bestTime: 'September to November, February to May',

        tagline: 'Yoga Capital of the World — spirituality meets adventure',

        places: [

            { name: 'Laxman Jhula', type: 'landmark', desc: 'Iconic suspension bridge over Ganges.', tip: 'Best at sunset.', budget: 'Free' },

            { name: 'Ram Jhula', type: 'landmark', desc: 'Larger suspension bridge. Markets nearby.', tip: 'Explore Swarg Ashram.', budget: 'Free' },

            { name: 'Ganga Aarti', type: 'spiritual', desc: 'Evening ceremony at Parmarth Niketan.', tip: 'Reach by 5:30 PM.', budget: 'Free' },

            { name: 'Beatles Ashram', type: 'heritage', desc: 'Where Beatles stayed in 1968. Meditation caves.', tip: 'Allow 2 hours.', budget: '₹150' },

            { name: 'Neelkanth Mahadev', type: 'spiritual', desc: 'Shiva temple in forested hills.', tip: '30km drive. steep climb.', budget: 'Free' },

            { name: 'River Rafting', type: 'adventure', desc: 'White water rafting on Ganges. Grade 1-4.', tip: 'Book with certified operators.', budget: '₹1000-3000' },

            { name: 'Triveni Ghat', type: 'spiritual', desc: 'Confluence of 3 rivers. Evening aarti.', tip: 'Peaceful morning visit.', budget: 'Free' },

            { name: 'Neer Garh Waterfall', type: 'nature', desc: 'Two-tier waterfall. Short trek.', tip: 'Monsoon for best flow.', budget: '₹30' }

        ],

        packing: {'climate':'Pleasant (15-35C), warm summers, cool winters (5-20C), monsoon Jul-Sep','dress':'Comfortable cotton, modest for temples/ashrams, light layers winter','shoes':'Trekking shoes (for rafting/trekking), comfortable sandals','medicine':'Sunscreen, basic first-aid, motion sickness pills (rafting)','comfort':'Waterproof bag, power bank, flashlight','snacks':'Dry fruits, banana chips, energy bars'},

        food: ['Aloo Puri at Chotiwala', 'Thali at Gandhaati Restaurant', 'Pizza at Little Buddha Café', 'Juices at Ganga Beach', 'Indian at Chula', 'Lassi at Revision'],

        hotels: [{ name: 'Taj Rishikesh', budget: 'Luxury ₹12K+', rating: '4.7' }, { name: 'EllBee Ganga View', budget: 'Premium ₹5K+', rating: '4.4' }, { name: 'Hotel Ganga Kinare', budget: 'Premium ₹4K+', rating: '4.3' }, { name: 'Zostel Rishikesh', budget: 'Budget ₹400-1000', rating: '4.2' }],

        transport: ['Walking', 'Auto-rickshaw', 'Local bus', 'Bike rental', 'Dehradun airport (35km)'],

        tips: ['Best for yoga retreats — try 200hr course', 'Bungee jumping at Mohan Chatti', 'Visit during International Yoga Festival (Mar)', 'Cafes along Ganga are magical']

    },

    mysore: {

        name: 'Mysore', state: 'Karnataka', bestTime: 'October to March',

        tagline: 'City of Palaces — royal elegance and silk sarees',

        places: [

            { name: 'Mysore Palace', type: 'heritage', desc: 'Stunning Indo-Saracenic palace. Illuminated Sundays.', tip: 'Sunday evening illumination.', budget: '₹70' },

            { name: 'Chamundi Hills', type: 'spiritual', desc: 'Chamundeshwari temple. City panoramic view.', tip: 'Sunset is best.', budget: 'Free' },

            { name: 'Brindavan Gardens', type: 'park', desc: 'Terraced gardens. Musical fountain.', tip: 'Fountain at 7 PM.', budget: '₹15' },

            { name: 'Mysore Zoo', type: 'attraction', desc: 'One of oldest zoos. Well-maintained.', tip: 'Closed Tuesdays.', budget: '₹50' },

            { name: 'St. Philomena\'s Church', type: 'heritage', desc: 'Neo-Gothic cathedral. 2nd tallest in Asia.', tip: 'Beautiful interior.', budget: 'Free' },

            { name: 'Karanji Lake', type: 'nature', desc: 'Butterfly park, bird sanctuary.', tip: 'Morning walk.', budget: '₹30' },

            { name: 'Devaraja Market', type: 'market', desc: 'Traditional market. Sandalwood, silk.', tip: 'Buy Mysore silk.', budget: 'Free' },

            { name: 'Rail Museum', type: 'museum', desc: 'Royal rail carriages. Vintage locomotives.', tip: 'Kids love it.', budget: '₹20' }

        ],

        packing: {'climate':'Pleasant (20-35C), cool winters (15-25C), monsoon Jun-Oct','dress':'Light cotton, traditional dress optional for palace, modest for temples','shoes':'Comfortable walking shoes, sandals','medicine':'Sunscreen, mosquito repellent, basic first-aid','comfort':'Water bottle, umbrella, power bank','snacks':'Mysore pak, dry fruits, filter coffee'},

        food: ['Mysore Pak at Guru Sweets', 'Masala Dosa at Vinayaka', 'Mysore Bonda at Park View', 'Filter Coffee at Coffee Day', 'Thali at Hotel RRR', 'Non-veg at Parkview'],

        hotels: [{ name: 'Radisson Blu Plaza', budget: 'Luxury ₹7K+', rating: '4.5' }, { name: 'The Gateway Hotel', budget: 'Premium ₹5K+', rating: '4.4' }, { name: 'Southern Star', budget: 'Premium ₹3K+', rating: '4.2' }, { name: 'Zostel Mysore', budget: 'Budget ₹400-1000', rating: '4.0' }],

        transport: ['Auto-rickshaw', 'City bus', 'Uber/Ola', 'Walking (old city)', 'Cycle-rickshaw'],

        tips: ['Sunday palace illumination is spectacular', 'Dasara festival (Oct) is grand', 'Buy Mysore silk and sandalwood', 'Day trip to Coorg (3h)']

    },

    hampi: {

        name: 'Hampi', state: 'Karnataka', bestTime: 'October to February',

        tagline: 'Ruins of Vijayanagara — boulder-strewn wonderland',

        places: [

            { name: 'Virupaksha Temple', type: 'spiritual', desc: 'Active temple. Insanction pillar.', tip: 'Evening aarti.', budget: 'Free' },

            { name: 'Vijaya Vittala Temple', type: 'monument', desc: 'Stone chariot and musical pillars.', tip: 'Famous stone chariot.', budget: '₹40' },

            { name: 'Hampi Bazaar', type: 'heritage', desc: 'Ancient market street. Ruins.', tip: 'Walk through history.', budget: 'Free' },

            { name: 'Matanga Hill', type: 'nature', desc: 'Best sunset point in Hampi.', tip: 'Climb 30 minutes.', budget: 'Free' },

            { name: 'Hemakuta Hill', type: 'nature', desc: 'Sunrise point. Group of temples.', tip: 'Easy climb.', budget: 'Free' },

            { name: 'Royal Enclosure', type: 'monument', desc: 'Queen\'s bath, elephant stables.', tip: 'Large complex.', budget: '₹40' },

            { name: 'Coracle Ride', type: 'adventure', desc: 'Traditional round boat on Tungabhadra.', tip: 'Sunset ride.', budget: '₹100' },

            { name: 'Anegundi Village', type: 'cultural', desc: 'Heritage village across the river.', tip: 'Walk or coracle across.', budget: 'Free' }

        ],

        packing: {'climate':'Hot (25-38C), pleasant Nov-Feb, monsoon Jun-Oct','dress':'Light cotton, comfortable for climbing rocks, modest for temples','shoes':'Sturdy walking/rock-climbing shoes, sandals','medicine':'Sunscreen SPF50+, ORS, basic first-aid','comfort':'Water bottle (carry extra!), hat, umbrella','snacks':'Dry fruits, bananas, energy bars'},

        food: ['Thali at Mango Tree', 'Pizza at Goan Corner', 'Banana Pancakes at German Bakery', 'Lassi at various cafes', 'South Indian at Virupaksha Bazaar', 'Smoothies at Laughing Buddha'],

        hotels: [{ name: 'Evolve Back Hampi', budget: 'Luxury ₹25K+', rating: '4.9' }, { name: 'Clarks Inn', budget: 'Premium ₹4K+', rating: '4.2' }, { name: 'Goan Corner', budget: 'Budget ₹800-2000', rating: '4.0' }, { name: 'Zostel Hampi', budget: 'Budget ₹400-1000', rating: '4.1' }],

        transport: ['Auto-rickshaw', 'Rented bicycle/moped', 'Walking', 'Coracle', 'Bus to Hospet (13km)'],

        tips: ['Rent a bicycle to explore', 'Carry lots of water', 'Hampi is huge — 2-3 days minimum', 'Sunrise from Hemakuta, sunset from Matanga']

    },

    khajuraho: {

        name: 'Khajuraho', state: 'Madhya Pradesh', bestTime: 'October to March',

        tagline: 'Temples of Passion — medieval erotic sculptures',

        places: [

            { name: 'Western Group Temples', type: 'monument', desc: 'UNESCO site. Kandariya Mahadeva.', tip: 'Sound & light show evening.', budget: '₹40' },

            { name: 'Eastern Group Temples', type: 'monument', desc: 'Jain and Hindu temples.', tip: 'Less crowded.', budget: 'Free' },

            { name: 'Khajuraho Dance Festival', type: 'cultural', desc: 'Feb classical dance festival.', tip: 'Book early.', budget: 'Free outdoor' },

            { name: 'Raneh Falls', type: 'nature', desc: 'Granite canyon waterfall.', tip: 'Monsoon for best flow.', budget: '₹25' },

            { name: 'Panna National Park', type: 'nature', desc: 'Tiger reserve. Jeep safari.', tip: 'Morning safari.', budget: '₹1500' },

            { name: 'Archaeological Museum', type: 'museum', desc: 'Sculptures and artifacts.', tip: 'Good context for temples.', budget: '₹10' },

            { name: 'Vishwanath Temple', type: 'monument', desc: 'Nandi bull statue entrance.', tip: 'Well-preserved.', budget: '₹40' },

            { name: 'Lakshmi Temple', type: 'spiritual', desc: 'Small but beautiful temple.', tip: 'Quick visit.', budget: '₹40' }

        ],

        packing: {'climate':'Hot (25-42C), pleasant Oct-Mar, monsoon Jul-Sep','dress':'Light cotton, comfortable clothing for temple visits','shoes':'Comfortable walking shoes, sandals','medicine':'Sunscreen, ORS, mosquito repellent','comfort':'Water bottle, hat, umbrella, sunglasses','snacks':'Dry fruits, local food, energy bars'},

        food: ['Thali at Local restaurants', 'Indian at Madhu Kitchen', 'Continental at Raja Café', 'Chaat near temples', 'South Indian at SSE Café', 'Lassi at various'],

        hotels: [{ name: 'Taj Chandela', budget: 'Luxury ₹8K+', rating: '4.6' }, { name: 'Radisson Blu', budget: 'Premium ₹5K+', rating: '4.4' }, { name: 'Hotel Clarks', budget: 'Premium ₹3K+', rating: '4.1' }, { name: 'Zostel Khajuraho', budget: 'Budget ₹400-1000', rating: '4.0' }],

        transport: ['Auto-rickshaw', 'Bicycle rental', 'Walking', 'Taxi', 'Train from Jhansi (3h)'],

        tips: ['Visit Western Group at dawn for fewer crowds', 'Sound & light show at 7 PM is excellent', 'Combine with Panna safari', '2 days is enough']

    },

    leh: {

        name: 'Leh', state: 'Ladakh', bestTime: 'June to September',

        tagline: 'Land of High Passes — otherworldly landscapes',

        places: [

            { name: 'Pangong Lake', type: 'nature', desc: 'Iconic blue lake at 14,270ft. Bollywood famous.', tip: 'Overnight camp by lake.', budget: '₹1500 camp' },

            { name: 'Nubra Valley', type: 'nature', desc: 'Double-humped camel valley. Sand dunes.', tip: '2-day trip minimum.', budget: '₹3000 package' },

            { name: 'Leh Palace', type: 'heritage', desc: '17th century palace. City views.', tip: 'Sunset from top.', budget: '₹25' },

            { name: 'Magnetic Hill', type: 'landmark', desc: 'Gravity-defying hill. Optical illusion?', tip: 'On way to Gurudwara.', budget: 'Free' },

            { name: 'Shanti Stupa', type: 'spiritual', desc: 'White-domed stupa. Panoramic views.', tip: 'Best sunrise point.', budget: 'Free' },

            { name: 'Thiksey Monastery', type: 'spiritual', desc: 'Mini Potala Palace. Tibetan Buddhism.', tip: '6:30 AM prayer.', budget: '₹50' },

            { name: 'Khardung La', type: 'nature', desc: 'World\'s highest motorable pass (17,982ft).', tip: 'Altitude sickness risk.', budget: 'Free' },

            { name: 'Hemis Monastery', type: 'spiritual', desc: 'Largest monastery. Festival in June.', tip: 'June festival is spectacular.', budget: '₹50' }

        ],

        packing: {'climate':'Extreme cold (-30C to 15C), high altitude, dry desert climate','dress':'Heavy woolens, thermal innerwear, windproof jacket, sunglasses','shoes':'Trekking boots, warm socks, sturdy walking shoes','medicine':'Altitude sickness pills (Diamox), sunscreen SPF50+, lip balm, oxygen canisters','comfort':'Thermos, hand warmers, warm gloves, sleeping bag liner','snacks':'Thukpa, momos, butter tea, energy bars'},

        food: ['Thukpa at Chopsticks', 'Momos at Tibetan Kitchen', 'Skyu at Local Kitchen', 'Butter Tea everywhere', 'Tingmo at Alchi Kitchen', 'Momos and noodles'],

        hotels: [{ name: 'The Grand Dragon', budget: 'Luxury ₹10K+', rating: '4.6' }, { name: 'Hotel Zen Ladakh', budget: 'Premium ₹4K+', rating: '4.3' }, { name: 'Hotel Ladakh Palace', budget: 'Premium ₹3K+', rating: '4.2' }, { name: 'Zostel Leh', budget: 'Budget ₹500-1500', rating: '4.0' }],

        transport: ['Rented bike (best!)', 'Shared taxi', 'Auto-rickshaw', 'Bus', 'Private taxi for day trips'],

        tips: ['Acclimatize 2-3 days before anything', 'Carry oxygen if going above 14,000ft', 'Bike ride on Khardung La is bucket list', 'Carry cash — no ATMs in remote areas']

    },

    hderabad: {

        name: 'Hyderabad', state: 'Telangana', bestTime: 'October to March',

        tagline: 'City of Pearls and Biryani — Nizam\'s grand legacy',

        places: [

            { name: 'Charminar', type: 'monument', desc: 'Iconic 1591 monument. Four minarets.', tip: 'Climb for Laad Bazaar view.', budget: '₹25' },

            { name: 'Golconda Fort', type: 'monument', desc: 'Medieval fortress. Acoustic engineering marvel.', tip: 'Sound & light show.', budget: '₹25' },

            { name: 'Hussain Sagar Lake', type: 'landmark', desc: 'Buddha statue in middle of lake.', tip: 'Boat ride at sunset.', budget: 'Free' },

            { name: 'Salar Jung Museum', type: 'museum', desc: 'One man\'s collection. World\'s largest.', tip: 'Allow full day.', budget: '₹20' },

            { name: 'Chowmahalla Palace', type: 'heritage', desc: 'Nizam\'s palace. Vintage car collection.', tip: 'Well-maintained.', budget: '₹100' },

            { name: 'Birla Mandir', type: 'spiritual', desc: 'White marble temple on hill.', tip: 'City views at night.', budget: 'Free' },

            { name: 'Laad Bazaar', type: 'market', desc: 'Bangle market near Charminar.', tip: 'Buy lac bangles.', budget: 'Free' },

            { name: 'Ramoji Film City', type: 'entertainment', desc: 'World\'s largest film studio complex.', tip: 'Full day needed.', budget: '₹1200' }

        ],

        packing: { climate: "Cold (-30 to 20C), dry, high altitude UV", dress: "Heavy woolens, thermal layers, waterproof jacket, sunglasses essential", shoes: "Insulated waterproof boots, trekking shoes, warm socks", medicine: "Altitude sickness Diamox, SPF50+ sunscreen, lip balm, first-aid", comfort: "Thermal innerwear, gloves, beanie, balaclava, oxygen can, power bank", snacks: "Dry fruits, nuts, energy bars, glucose, warm liquids" },

        food: ['Biryani at Paradise/Shah Ghouse', 'Haleem during Ramadan', 'Irani Chai at Nimrah', 'Double Ka Meetha at Hotel', 'Luqmi at Hotel Nayaab', 'Chicken 65 — invented here!'],

        hotels: [{ name: 'Taj Falaknuma Palace', budget: 'Luxury ₹15K+', rating: '4.8' }, { name: 'Park Hyatt', budget: 'Luxury ₹10K+', rating: '4.7' }, { name: 'ITC Kakatiya', budget: 'Premium ₹6K+', rating: '4.5' }, { name: 'Zostel Hyderabad', budget: 'Budget ₹500-1500', rating: '4.0' }],

        transport: ['Metro', 'Auto-rickshaw', 'Uber/Ola', 'City bus', 'Cycle-rickshaw old city'],

        tips: ['Biryani at Paradise is overrated — try Shah Ghouse', 'Old city walk is incredible', 'Ramoji Film City needs full day', 'Buy pearls as souvenirs']

    },

    ahmedabad: {

        name: 'Ahmedabad', state: 'Gujarat', bestTime: 'November to February',

        tagline: 'Heritage City — Gandhi\'s home and textile capital',

        places: [

            { name: 'Sabarmati Ashram', type: 'heritage', desc: 'Gandhi\'s home. Museum of independence.', tip: 'Peaceful, reflective.', budget: 'Free' },

            { name: 'Adalaj Stepwell', type: 'monument', desc: '5-story octagonal stepwell. Islamic architecture.', tip: 'Cool inside even in summer.', budget: 'Free' },

            { name: 'Jama Masjid', type: 'spiritual', desc: 'Ahmedabad\'s largest mosque. Yellow sandstone.', tip: 'Beautiful interior.', budget: 'Free' },

            { name: 'Kankaria Lake', type: 'landmark', desc: 'Circular lake. Zoo, toy train, amusement.', tip: 'Evening stroll.', budget: '₹25' },

            { name: 'Calico Museum', type: 'museum', desc: 'World\'s finest textile collection.', tip: 'Guided tour only.', budget: 'Free' },

            { name: 'Sidi Saiyyed Mosque', type: 'spiritual', desc: 'Famous stone lattice window (tree of life).', tip: 'Symbol of Ahmedabad.', budget: 'Free' },

            { name: 'Heritage Walk', type: 'cultural', desc: 'Walk through Pols (traditional neighborhoods).', tip: 'Start at 8 AM from Calico Museum.', budget: '₹200 guided' },

            { name: 'Science City', type: 'attraction', desc: 'IMAX theatre, space museum.', tip: 'Great for kids.', budget: '₹100' }

        ],

        food: ['Dhokla at various', 'Khaman at Jagdish', 'Undhiyu (winter)', 'Fafda-Jalebi breakfast', 'Gujarati Thali at Agashiye', 'Khandvi at Mothers Recipe'],

        hotels: [{ name: 'Taj Skyline', budget: 'Luxury ₹8K+', rating: '4.6' }, { name: 'Hyatt Regency', budget: 'Luxury ₹7K+', rating: '4.5' }, { name: 'Hotel Comfort Inn', budget: 'Premium ₹3K+', rating: '4.0' }, { name: 'Zostel Ahmedabad', budget: 'Budget ₹400-1000', rating: '4.0' }],

        transport: ['BRTS Bus', 'Auto-rickshaw', 'Uber/Ola', 'Walking (old city)', 'Metro'],

        tips: ['Heritage walk is essential', 'Try Gujarati Thali — unlimited food!', 'Diwali celebrations are spectacular', 'Combine with Rann of Kutch (5h)']
        ,
        packing: {'climate':'Very hot summers (45C+), mild pleasant winters (10-25C)','dress':'Light cotton clothing, sun-protective hats','shoes':'Breathable walking shoes, sandals','medicine':'Sunscreen SPF50+, ORS sachets','comfort':'Cotton towel, water bottle, electrolyte packets','snacks':'Dry snacks, water'},

    },

    lucknow: {

        name: 'Lucknow', state: 'Uttar Pradesh', bestTime: 'October to March',

        tagline: 'City of Nawabs — tehzeeb (culture) and kebabs',

        places: [

            { name: 'Bara Imambara', type: 'monument', desc: 'Grand Nawabi architecture. Bhool Bhulaiya maze.', tip: 'Hire guide for maze.', budget: '₹50' },

            { name: 'Rumi Darwaza', type: 'monument', desc: 'Awadhi architecture gateway. Iconic.', tip: 'Best at night lit up.', budget: 'Free' },

            { name: 'Chota Imambara', type: 'monument', desc: 'Crystal chandeliers, gold throne.', tip: 'Stunning interior.', budget: '₹25' },

            { name: 'Hazratganj', type: 'market', desc: 'Colonial-era shopping street.', tip: 'For kebabs and shopping.', budget: 'Free' },

            { name: 'British Residency', type: 'heritage', desc: '1857 siege site. Ruins and cemetery.', tip: 'Historically significant.', budget: '₹25' },

            { name: 'Clock Tower', type: 'landmark', desc: 'Husainabad Clock Tower. Victorian Gothic.', tip: 'Photogenic.', budget: 'Free' },

            { name: 'Ambedkar Park', type: 'park', desc: 'Grand memorial park. Stone elephants.', tip: 'Beautiful at night.', budget: 'Free' },

            { name: 'Chowk', type: 'market', desc: 'Old Lucknow market. Chikankari capital.', tip: 'Buy chikankari embroidery.', budget: 'Free' }

        ],

        packing: {'climate':'Extreme heat (40-46C summer), foggy cold winters (2-15C)','dress':'Light cotton summer, heavy woolens winter, moderate clothing','shoes':'Comfortable walking shoes, sandals','medicine':'Sunscreen, ORS, mosquito repellent, cold medicine winter','comfort':'Water bottle, umbrella, warm shawl winter','snacks':'Kebabs, biryani, dry fruits'},

        food: ['Galouti Kebab at Dastarkhwan', 'Tunday Kebab at Tunday Kababi', 'Biryani at Idrees', 'Chaat at Royal Cafe', 'Sheermal at Chowk', 'Roomali Roti at Sakhawat'],

        hotels: [{ name: 'Taj Mahal Lucknow', budget: 'Luxury ₹8K+', rating: '4.6' }, { name: 'Vivanta Lucknow', budget: 'Luxury ₹6K+', rating: '4.5' }, { name: 'Hotel Clarks Avadh', budget: 'Premium ₹4K+', rating: '4.2' }, { name: 'Zostel Lucknow', budget: 'Budget ₹400-1000', rating: '4.0' }],

        transport: ['Metro', 'Auto-rickshaw', 'Uber/Ola', 'Cycle-rickshaw', 'Walking (Chowk area)'],

        tips: ['Lucknow is a foodie paradise', 'Bhool Bhulaiya maze is tricky — follow guide', 'Buy chikankari embroidery souvenirs', 'Nawabi hospitality is legendary']

    },

    pondicherry: {

        name: 'Pondicherry', state: 'Tamil Nadu', bestTime: 'October to March',

        tagline: 'French Riviera of the East — colonial charm meets spirituality',

        places: [

            { name: 'Promenade Beach', type: 'beach', desc: '1.5km rock beach. French quarter nearby.', tip: 'Morning walk.', budget: 'Free' },

            { name: 'Auroville', type: 'spiritual', desc: 'Experimental township. Matrimandir.', tip: 'Book Matrimandir visit online.', budget: 'Free' },

            { name: 'French Quarter', type: 'cultural', desc: 'Colonial buildings, cafes, boutiques.', tip: 'Walk or cycle.', budget: 'Free' },

            { name: 'Aurobindo Ashram', type: 'spiritual', desc: 'Spiritual community. Meditation.', tip: 'Silence maintained.', budget: 'Free' },

            { name: 'Paradise Beach', type: 'beach', desc: 'Boat ride to island beach.', tip: 'Catamaran ride.', budget: '₹200 boat' },

            { name: 'Chunnambar Boat House', type: 'nature', desc: 'Backwater boat rides.', tip: 'Sunset cruise.', budget: '₹150' },

            { name: 'Rock Beach', type: 'beach', desc: 'Rocky coastline. Evening vibes.', tip: 'Street food at night.', budget: 'Free' },

            { name: 'Botanical Garden', type: 'park', desc: 'French-era garden. 280+ plant species.', tip: 'Quick visit.', budget: '₹10' }

        ],

        packing: {'climate':'Hot humid (25-38C), pleasant Oct-Feb, monsoon Oct-Dec','dress':'Light cotton, beachwear, French Quarter casual wear','shoes':'Comfortable walking shoes, flip-flops','medicine':'Sunscreen, mosquito repellent, ORS, basic first-aid','comfort':'Beach towel, hat, sunglasses, water bottle','snacks':'Croissants, filter coffee, seafood'},

        food: ['Croissants at Baker Street', 'French cuisine at Carte Blanche', 'South Indian at Murugan', 'Seafood at The Promenade', 'Crepes at Indian Kafe', 'Filter Coffee everywhere'],

        hotels: [{ name: 'The Promenade', budget: 'Luxury ₹10K+', rating: '4.7' }, { name: 'Palais de Mahe', budget: 'Premium ₹6K+', rating: '4.6' }, { name: 'Hotel Atithi', budget: 'Premium ₹3K+', rating: '4.2' }, { name: 'Zostel Pondicherry', budget: 'Budget ₹400-1200', rating: '4.1' }],

        transport: ['Rented bicycle/scooter (best)', 'Auto-rickshaw', 'Walking (French Quarter)', 'Uber/Ola (limited)', 'Bus'],

        tips: ['Rent a scooter to explore', 'French Quarter is best walked/cycled', 'Matrimandir visit needs advance booking', 'Combine with Mahabalipuram day trip']

    },

    jodhpur: {

        name: 'Jodhpur', state: 'Rajasthan', bestTime: 'October to March',

        tagline: 'Blue City — Mehrangarh fortress crowns the skyline',

        places: [

            { name: 'Mehrangarh Fort', type: 'monument', desc: 'Massive fortress. One of India\'s finest museums.', tip: 'Audio guide included.', budget: '₹200' },

            { name: 'Blue City Walk', type: 'cultural', desc: 'Brahmpuri neighborhood. Blue houses.', tip: 'Guided walk recommended.', budget: 'Free' },

            { name: 'Jaswant Thada', type: 'monument', desc: 'White marble cenotaph. "Taj Mahal of Marwar".', tip: 'Golden hour light.', budget: '₹30' },

            { name: 'Clock Tower & Sardar Market', type: 'market', desc: 'Vibrant bazaar. Spices, textiles.', tip: 'Buy spices and bandhani.', budget: 'Free' },

            { name: 'Umaid Bhawan Palace', type: 'heritage', desc: 'Still home to Jodhpur royal family. Part museum.', tip: 'Don\'t miss the vintage car collection.', budget: '₹30 museum' },

            { name: 'Mandore Gardens', type: 'park', desc: 'Cenotaphs of Marwar rulers. Beautiful gardens.', tip: 'Peaceful evening.', budget: 'Free' },

            { name: 'Toorji Ka Jhalra', type: 'monument', desc: 'Stepwell restored by Queen Toorji.', tip: 'Great photo spot.', budget: 'Free' },

            { name: 'Bishnoi Village Safari', type: 'cultural', desc: 'Rural Rajasthan. Wildlife, pottery, weaving.', tip: 'Half day trip.', budget: '₹1000' }

        ],

        packing: {'climate':'Extreme desert heat (25-45C), pleasant winters (7-22C)','dress':'Full cotton/linen covering body, scarf for sand, light layers winter','shoes':'Closed sandals/boots, comfortable walking shoes','medicine':'Sunscreen SPF50+, ORS, lip balm, eye drops','comfort':'Scarf/dupatta, sunglasses, water bottle (2L+), hat/cap','snacks':'Dal baati churma, mirchi vada, pyaaz kachori'},

        food: ['Mirchi Bada at Jodhpur Sweets', 'Mawa Kachori at Jhankar', 'Dal Bati at Gypsy Restaurant', 'Lassi at Mishrilal', 'Pyaaz Kachori at Patel', 'Street food at Clock Tower'],

        hotels: [{ name: 'Umaid Bhawan Palace', budget: 'Luxury ₹25K+', rating: '4.9' }, { name: 'RAAS Jodhpur', budget: 'Luxury ₹12K+', rating: '4.8' }, { name: 'Indana Palace', budget: 'Premium ₹5K+', rating: '4.5' }, { name: 'Zostel Jodhpur', budget: 'Budget ₹400-1200', rating: '4.1' }],

        transport: ['Auto-rickshaw', 'Walking (blue city)', 'Uber/Ola', 'Taxi for fort', 'Cycle-rickshaw'],

        tips: ['Mehrangarh Fort is jaw-dropping — give it 3 hours', 'Blue City walk is magical at dawn', 'Buy bandhani and spices at Sardar Market', 'Desert safari available (Thar Desert)']

    },

    ooty: {

        name: 'Ooty', state: 'Tamil Nadu', bestTime: 'October to June',

        tagline: 'Queen of Hill Stations — Nilgiri tea gardens and pleasant weather',

        places: [

            { name: 'Nilgiri Mountain Railway', type: 'heritage', desc: 'UNESCO Toy Train. Steam engine.', tip: 'Book well in advance.', budget: '₹250' },

            { name: 'Botanical Garden', type: 'park', desc: '1848 garden. 650+ plant species.', tip: 'Fossilized tree trunk.', budget: '₹30' },

            { name: 'Ooty Lake', type: 'nature', desc: 'Boating on serene lake.', tip: 'Pedal boat.', budget: '₹200' },

            { name: 'Doddabetta Peak', type: 'nature', desc: 'Highest point in Nilgiris. Telescope house.', tip: 'Clear days for views.', budget: '₹15' },

            { name: 'Tea Museum', type: 'museum', desc: 'History of tea in Nilgiris. Tasting.', tip: 'Buy fresh tea.', budget: '₹100' },

            { name: 'Rose Garden', type: 'park', desc: '20,000 rose varieties.', tip: 'Blooms Apr-May.', budget: '₹30' },

            { name: 'Pykara Falls', type: 'nature', desc: 'Waterfall and lake. Boating.', tip: '20km from Ooty.', budget: '₹20' },

            { name: 'Coonoor', type: 'nature', desc: 'Tea town. Sim\'s Park.', tip: 'Toy train stops here.', budget: 'Free' }

        ],

        packing: {'climate':'Cool (10-25C year-round), misty mornings, chilly evenings, rain Jun-Sep','dress':'Light woolens, jacket for evenings, rain gear monsoon','shoes':'Comfortable walking shoes for tea estates, waterproof shoes','medicine':'Mosquito repellent, sunscreen, basic medicines','comfort':'Light shawl/cardigan, water bottle, camera','snacks':'Tea estate cafe snacks, homemade chocolates, dry fruits'},

        food: ['Tea at tea shops', 'Chocolate at Kingstar', 'South Indian at Claudius', 'Homemade cakes at bakeries', 'Biryani at Shinkow', 'Eucalyptus oil souvenirs'],

        hotels: [{ name: 'Savoy Hotel', budget: 'Luxury ₹10K+', rating: '4.6' }, { name: 'Sterling Ooty', budget: 'Premium ₹5K+', rating: '4.3' }, { name: 'Hotel Darshan', budget: 'Premium ₹3K+', rating: '4.0' }, { name: 'Zostel Ooty', budget: 'Budget ₹400-1000', rating: '4.0' }],

        transport: ['Toy Train', 'Bus', 'Taxi', 'Auto-rickshaw', 'Walking (town)'],

        tips: ['Toy Train is a must — book 2 weeks ahead', 'Carry warm jacket — always cold', 'Tea plantations everywhere — buy fresh', 'Combine with Coonoor and Kotagiri']

    },

    pushkar: {

        name: 'Pushkar', state: 'Rajasthan', bestTime: 'October to March',

        tagline: 'Sacred Lake Town — pilgrimage meets hippie vibes',

        places: [

            { name: 'Pushkar Lake', type: 'spiritual', desc: 'Sacred lake. 52 ghats. Holy dip.', tip: 'Sunrise is magical.', budget: 'Free' },

            { name: 'Brahma Temple', type: 'spiritual', desc: 'One of few Brahma temples in world.', tip: 'Small but significant.', budget: 'Free' },

            { name: 'Pushkar Camel Fair', type: 'cultural', desc: 'Nov annual fair. Thousands of camels.', tip: 'Book accommodation months ahead.', budget: 'Free' },

            { name: 'Savitri Temple', type: 'spiritual', desc: 'Hilltop temple. Panoramic views.', tip: 'Ropeway or trek.', budget: '₹75 ropeway' },

            { name: 'Varah Ghat', type: 'spiritual', desc: 'Main evening aarti ghat.', tip: 'Attend evening aarti.', budget: 'Free' },

            { name: 'Pushkar Bazaar', type: 'market', desc: 'Leather goods, jewelry, textiles.', tip: 'Bargain is essential.', budget: 'Free' },

            { name: 'Cardamom Cafe', type: 'cultural', desc: 'Rooftop cafe with lake views.', tip: 'Live music evenings.', budget: 'Free entry' },

            { name: 'Rose Garden', type: 'nature', desc: 'Pushkar grows finest roses in India.', tip: 'Buy rose products.', budget: 'Free' }

        ],

        packing: {'climate':'Hot (25-42C summer), pleasant winters (5-22C), monsoon Jul-Sep','dress':'Light cotton, modest clothing for temples (no alcohol/meat)','shoes':'Comfortable walking shoes, sandals','medicine':'Sunscreen SPF50+, ORS, lip balm','comfort':'Water bottle, hat, umbrella, sunglasses','snacks':'Malpua, dry fruits, lassi'},

        food: ['Malpua at corner shops', 'Dal Bati at Sunset Café', 'Thali at Little Italy', 'Pizza at Café Edelweiss', 'Lassi at Rainbow Café', 'Chai at every rooftop'],

        hotels: [{ name: 'The Westin Pushkar', budget: 'Luxury ₹10K+', rating: '4.6' }, { name: 'Inn Seventh Heaven', budget: 'Premium ₹3K+', rating: '4.4' }, { name: 'Hotel Temple View', budget: 'Budget ₹1K-2K', rating: '4.0' }, { name: 'Zostel Pushkar', budget: 'Budget ₹400-1000', rating: '4.1' }],

        transport: ['Walking (town is small)', 'Auto-rickshaw', 'Camel rides', 'Scooter rental', 'Bus from Ajmer (14km)'],

        tips: ['Pushkar Lake holy dip is a spiritual experience', 'Camel Fair (Nov) is world-famous', 'Rooftop cafes for sunset views', 'Pushkar is small — 2 days enough']

    },

    dharamshala: {

        name: 'Dharamshala', state: 'Himachal Pradesh', bestTime: 'March to June, September to November',

        tagline: 'Little Lhasa — Dalai Lama\'s home in the Himalayas',

        places: [

            { name: 'Tsuglagkhang Complex', type: 'spiritual', desc: 'Dalai Lama\'s temple. Tibetan Parliament.', tip: 'Free photography outside.', budget: 'Free' },

            { name: 'McLeod Ganj', type: 'cultural', desc: 'Tibetan settlement. Cafes, shops, monasteries.', tip: 'Walk the main street.', budget: 'Free' },

            { name: 'Bhagsu Waterfall', type: 'nature', desc: 'Beautiful waterfall. Short walk.', tip: 'Bhagsu Nag temple nearby.', budget: 'Free' },

            { name: 'Triund Trek', type: 'adventure', desc: 'Easy Himalayan trek. Spectacular views.', tip: '2 days recommended.', budget: 'Free' },

            { name: 'Namgyal Monastery', type: 'spiritual', desc: 'Largest Tibetan monastery outside Tibet.', tip: 'Morning prayers.', budget: 'Free' },

            { name: 'Kangra Fort', type: 'heritage', desc: 'Oldest fort in India. Stunning valley views.', tip: 'Allow 2 hours.', budget: '₹150' },

            { name: 'Naddi Viewpoint', type: 'nature', desc: 'Panoramic Dhauladhar range views.', tip: 'Sunset point.', budget: 'Free' },

            { name: 'Tibetan Market', type: 'market', desc: 'Handicrafts, thangkas, singing bowls.', tip: 'Buy singing bowls.', budget: 'Free' }

        ],

        packing: {'climate':'Cool (0-25C), cold snowy winters (-2 to 8C), monsoon Jul-Sep','dress':'Warm layers, heavy woolens winter, light jacket summer, rain gear','shoes':'Trekking boots, waterproof shoes, comfortable walking shoes','medicine':'Cold medicine, sunscreen, basic first-aid','comfort':'Thermos, warm socks, gloves, rain poncho','snacks':'Tibetan thukpa, momos, dry fruits'},

        food: ['Thukpa at被告 Lunch Box', 'Momos at Snow Lion', 'Tibetan food at Norbulingka Café', 'Pizza at Jimmy\'s Italian', 'Chai at every cafe', 'Tingmo at local Tibetan shops'],

        hotels: [{ name: 'The Dalai Lama Residency Hotel', budget: 'Premium ₹5K+', rating: '4.5' }, { name: 'Hotel Devs', budget: 'Premium ₹3K+', rating: '4.2' }, { name: 'Snow Lion Residency', budget: 'Premium ₹3K+', rating: '4.3' }, { name: 'Zostel McLeod Ganj', budget: 'Budget ₹400-1200', rating: '4.2' }],

        transport: ['Walking (McLeod Ganj)', 'Auto-rickshaw', 'Bus', 'Taxi', 'Gaggal Airport (15km)'],

        tips: ['Triund trek is amazing — start early', 'Attend a cooking class for Tibetan food', 'Buy singing bowls and thangkas', 'Meditation courses available at monasteries']

    },

    coorg: {

        name: 'Coorg', state: 'Karnataka', bestTime: 'October to May',

        tagline: 'Scotland of India — coffee plantations and misty hills',

        places: [

            { name: 'Abbey Falls', type: 'nature', desc: 'Beautiful waterfall surrounded by coffee estates.', tip: 'Monsoon for best flow.', budget: '₹15' },

            { name: 'Raja\'s Seat', type: 'nature', desc: 'Viewpoint with musical garden.', tip: 'Sunset point.', budget: '₹10' },

            { name: 'Dubare Elephant Camp', type: 'nature', desc: 'Elephant bathing, feeding, and safari.', tip: 'Book river rafting too.', budget: '₹500' },

            { name: 'Namdroling Monastery', type: 'spiritual', desc: 'Tibetan monastery. Golden Temple.', tip: 'Peaceful setting.', budget: 'Free' },

            { name: 'Talacauvery', type: 'spiritual', desc: 'Origin of river Kaveri. Brahmagiri hills.', tip: 'Early morning for views.', budget: 'Free' },

            { name: 'Coffee Plantation Tour', type: 'cultural', desc: 'Walk through coffee estates. Tasting.', tip: 'Stay at a plantation stay.', budget: '₹200-500' },

            { name: 'Bylakuppe', type: 'cultural', desc: 'Tibetan settlement. Golden Temple.', tip: 'Authentic Tibetan food.', budget: 'Free' },

            { name: 'Nisargadhama', type: 'nature', desc: 'Island park. Bamboo rafting, deer park.', tip: 'Great for families.', budget: '₹50' }

        ],

        packing: {'climate':'Pleasant (10-25C), misty, heavy monsoon Jun-Sep','dress':'Light woolens, rain jacket, comfortable cotton','shoes':'Waterproof trekking shoes, comfortable sandals','medicine':'Leech repellent (monsoon), mosquito repellent, sunscreen','comfort':'Rain poncho, umbrella, water bottle','snacks':'Coffee plantation snacks, pork curry, dry fruits'},

        food: ['Pandi Curry (pork) at Coorg Kitchen', 'Akki Roti at local homes', 'Bamboo Shoot Curry', 'Coffee at plantation cafes', 'Kadambuttu (rice dumplings)', 'Coorgi Biryani at Empire'],

        hotels: [{ name: 'Tamara Coorg', budget: 'Luxury ₹20K+', rating: '4.8' }, { name: 'The Orange County', budget: 'Luxury ₹15K+', rating: '4.7' }, { name: 'Coorg Wilderness Resort', budget: 'Premium ₹5K+', rating: '4.5' }, { name: 'Zostel Coorg', budget: 'Budget ₹500-1500', rating: '4.1' }],

        transport: ['Rented car (essential)', 'Jeep safari', 'Walking (plantation area)', 'Bus from Mysore (3h)', 'Taxi'],

        tips: ['Rented car is essential — no public transport', 'Stay at a coffee plantation', 'Try authentic Coorgi Pandi Curry', 'Rains Jun-Sep — carry rain gear']

    },

    munnar: {

        name: 'Munnar', state: 'Kerala', bestTime: 'September to May',

        tagline: 'Tea Capital of South India — rolling green hills',

        places: [

            { name: 'Tea Plantations', type: 'nature', desc: 'Endless green hills of tea.', tip: 'Tata Tea Museum.', budget: '₹75 museum' },

            { name: 'Eravikulam National Park', type: 'nature', desc: 'Nilgiri Tahr habitat. Shuttle bus only.', tip: 'Go early — tickets limited.', budget: '₹120' },

            { name: 'Top Station', type: 'nature', desc: 'Highest point. Kerala-Tamil Nadu border.', tip: 'Fog can block views.', budget: 'Free' },

            { name: 'Mattupetty Dam', type: 'nature', desc: 'Dam with boating. Indo-Swiss farm.', tip: 'Speed boat ride.', budget: '₹50' },

            { name: 'Echo Point', type: 'nature', desc: 'Lake with echo. Shola forests.', tip: 'Quick stop.', budget: '₹10' },

            { name: 'Kundala Lake', type: 'nature', desc: 'Scenic lake. Shikara and pedal boats.', tip: 'Less crowded.', budget: '₹150' },

            { name: 'Attukal Waterfalls', type: 'nature', desc: 'Beautiful cascading waterfall.', tip: 'Short trek.', budget: 'Free' },

            { name: 'Photo Point', type: 'nature', desc: 'Scenic valley viewpoint.', tip: 'Great photos.', budget: 'Free' }

        ],

        packing: {'climate':'Cool (10-25C), misty mornings, heavy monsoon Jun-Oct','dress':'Light woolens, waterproof jacket, comfortable layers','shoes':'Waterproof trekking shoes, comfortable walking shoes','medicine':'Leech repellent (monsoon), mosquito repellent, sunscreen','comfort':'Rain poncho, umbrella, warm shawl for evenings','snacks':'Tea, cardamom snacks, dry fruits'},

        food: ['Kerala meals at Saravana Bhavan', 'Appam and Stew at local restaurants', 'Cardamom Tea everywhere', 'Kerala Fish Curry', 'Dosa at various', 'Chocolate at Snow Valley'],

        hotels: [{ name: 'SpiceTree Munnar', budget: 'Luxury ₹12K+', rating: '4.7' }, { name: 'Fragrant Nature', budget: 'Premium ₹5K+', rating: '4.5' }, { name: 'Blanket Hotel', budget: 'Premium ₹4K+', rating: '4.3' }, { name: 'Zostel Munnar', budget: 'Budget ₹500-1200', rating: '4.0' }],

        transport: ['Rented car (best)', 'Auto-rickshaw', 'Bus from Kochi (4h)', 'Taxi', 'Walking (town)'],

        tips: ['Carry warm clothes — always misty', 'Eravikulam tickets sell out by 8 AM', 'Visit a tea factory', 'Combine with Thekkady (2h)']

    },

    haridwar: {

        name: 'Haridwar', state: 'Uttarakhand', bestTime: 'October to March',

        tagline: 'Gateway to the Gods — sacred Ganges ghat city',

        places: [

            { name: 'Har Ki Pauri Ghat', type: 'spiritual', desc: 'Most sacred ghat. Evening Ganga Aarti.', tip: 'Reach by 5 PM for aarti.', budget: 'Free' },

            { name: 'Mansa Devi Temple', type: 'spiritual', desc: 'Hilltop temple. Cable car available.', tip: 'Ropeway ride is scenic.', budget: '₹120 ropeway' },

            { name: 'Chandi Devi Temple', type: 'spiritual', desc: 'Neel Parvat hilltop temple.', tip: 'Trek or cable car.', budget: '₹100 ropeway' },

            { name: 'Maya Devi Temple', type: 'spiritual', desc: 'One of 51 Shakti Peethas.', tip: 'Ancient and powerful.', budget: 'Free' },

            { name: 'Bharat Mata Temple', type: 'spiritual', desc: 'Multi-story temple with unity map.', tip: 'Unique architecture.', budget: 'Free' },

            { name: 'Daksha Mahadev Temple', type: 'spiritual', desc: 'Ancient Shiva temple. Mythological significance.', tip: 'Kumbh Mela site.', budget: 'Free' },

            { name: 'Vaishno Devi Temple', type: 'spiritual', desc: 'Replica of Kashmir Vaishno Devi.', tip: 'Artificial cave temple.', budget: '₹50' },

            { name: 'Rajaji National Park', type: 'nature', desc: 'Wildlife sanctuary. Elephants, tigers.', tip: 'Jeep safari available.', budget: '₹150' }

        ],

        food: ['Kachori at Mohan Ji', 'Puri Sabzi at Brijwasi', 'Chole Bhature', 'Aloo Puri', 'Lassi at Hoshiyar Singh', 'Prasad at temples'],

        hotels: [{ name: 'Radisson Blu', budget: 'Premium ₹5K+', rating: '4.4' }, { name: 'Hotel Ganga Lahari', budget: 'Premium ₹3K+', rating: '4.2' }, { name: 'Hotel Alpana', budget: 'Budget ₹1K-2K', rating: '3.8' }, { name: 'Zostel Haridwar', budget: 'Budget ₹400-1000', rating: '4.0' }],

        transport: ['Auto-rickshaw', 'Cycle-rickshaw', 'Walking ghat area', 'Bus', 'Train from Delhi 4h'],

        tips: ['Ganga Aarti at Har Ki Pauri is unmissable', 'Carry a bag for ghats — shoes stay outside', 'Kumbh Mela happens every 12 years', 'Combine with Rishikesh (25km)']
        ,
        packing: {'climate':'Hot summers (40C), pleasant winters (5-20C)','dress':'Modest clothing for temples, light cottons','shoes':'Slip-on shoes (remove at temples), waterproof sandals','medicine':'ORS, basic first-aid','comfort':'Reusable water bottle, mosquito repellent, flashlight','snacks':'Temple prasad area snacks, dry fruits'},

    },

    dehradun: {

        name: 'Dehradun', state: 'Uttarakhand', bestTime: 'March to June, September to November',

        tagline: 'Valley of Gods — Doon School city and gateway to Mussoorie',

        places: [

            { name: 'Robber\'s Cave', type: 'nature', desc: 'Natural river cave formation. Picnic spot.', tip: 'Wear waterproof shoes.', budget: '₹25' },

            { name: 'Sahastradhara', type: 'nature', desc: 'Thousand-fold waterfall. Sulphur springs.', tip: 'Monsoon for best flow.', budget: '₹20' },

            { name: 'Forest Research Institute', type: 'museum', desc: 'Gothic building. Botanical museum.', tip: 'Allow 2 hours.', budget: '₹40' },

            { name: 'Mindrolling Monastery', type: 'spiritual', desc: 'Tibetan monastery. 60m Buddha statue.', tip: 'Peaceful gardens.', budget: '₹20' },

            { name: 'Tiger Falls', type: 'nature', desc: '312m waterfall. Trek required.', tip: 'Carry water and snacks.', budget: '₹50' },

            { name: 'Malsi Deer Park', type: 'nature', desc: 'Deer park with nature walk.', tip: 'Quick visit.', budget: '₹30' },

            { name: 'Paltan Bazaar', type: 'market', desc: 'Main market. Local shopping.', tip: 'Buy caramel balls.', budget: 'Free' },

            { name: 'Clock Tower', type: 'landmark', desc: 'Ghanta Ghar. City center.', tip: 'Photo spot.', budget: 'Free' }

        ],

        food: ['Momos everywhere', 'Chole Bhature at Kolkata House', 'Rajma Chawal at local dhabas', 'Kadhi Chawal', 'Aloo Tikki at Paltan Bazaar', 'Bal Mithai famous sweet'],

        hotels: [{ name: 'JW Marriott', budget: 'Luxury ₹8K+', rating: '4.6' }, { name: 'Hyatt Regency', budget: 'Premium ₹5K+', rating: '4.4' }, { name: 'Hotel Madhuban', budget: 'Premium ₹3K+', rating: '4.0' }, { name: 'Zostel Dehradun', budget: 'Budget ₹400-1000', rating: '4.1' }],

        transport: ['City bus', 'Auto-rickshaw', 'Uber/Ola', 'Walking', 'Train from Delhi 5h'],

        tips: ['Gateway to Mussoorie (35km)', 'Try the famous Bal Mithai sweet', 'Robber\'s Cave is crowded on weekends', 'Combine with Mussoorie weekend trip']
        ,
        packing: {'climate':'Pleasant (15-35C), monsoon heavy Jul-Sep','dress':'Light layers, rain jacket monsoon','shoes':'Waterproof trekking shoes, comfortable walking shoes','medicine':'Leech repellent (monsoon), sunscreen, ORS','comfort':'Rain poncho, power bank, reusable water bottle','snacks':'Local petha, dry fruits'},

    },

    mussoorie: {

        name: 'Mussoorie', state: 'Uttarakhand', bestTime: 'March to June, September to November',

        tagline: 'Queen of the Hills — colonial hill station above the clouds',

        places: [

            { name: 'Kempty Falls', type: 'nature', desc: 'Famous waterfall. Swimming pool at base.', tip: 'Go early to avoid crowds.', budget: '₹50' },

            { name: 'Camel\'s Back Road', type: 'nature', desc: '3km walking path. Rock shaped like camel.', tip: 'Best for sunset walks.', budget: 'Free' },

            { name: 'Gun Hill', type: 'nature', desc: 'Second highest point. Ropeway to top.', tip: 'Panoramic views.', budget: '₹75 ropeway' },

            { name: 'Lal Tibba', type: 'nature', desc: 'Highest point in Mussoorie.', tip: 'Telescope views of Himalayas.', budget: '₹50' },

            { name: 'Cloud\'s End', type: 'nature', desc: 'Where clouds meet the earth. Forest trails.', tip: 'Nature walks.', budget: 'Free' },

            { name: 'Company Garden', type: 'park', desc: 'Boating, waterfall, mini zoo.', tip: 'Great for families.', budget: '₹25' },

            { name: 'Mall Road', type: 'market', desc: 'Shopping street. colonial charm.', tip: 'Evening stroll.', budget: 'Free' },

            { name: 'Christ Church', type: 'heritage', desc: '1836 church. Gothic architecture.', tip: 'Historic landmark.', budget: 'Free' }

        ],

        food: ['Momos at every corner', 'Rajma Chawal', 'Bun Tikki', 'Russian Cuisine at Emily\'s', 'Magaaz at local shops', 'Chai with bun maska'],

        hotels: [{ name: 'JW Marriott Mussoorie', budget: 'Luxury ₹15K+', rating: '4.7' }, { name: 'The Savoy', budget: 'Luxury ₹12K+', rating: '4.6' }, { name: 'Hotel Royal Orchid', budget: 'Premium ₹4K+', rating: '4.2' }, { name: 'Zostel Mussoorie', budget: 'Budget ₹500-1200', rating: '4.0' }],

        transport: ['Walking Mall Road', 'Taxi', 'Local bus from Dehradun', 'Ropeway', 'Rented bike'],

        tips: ['Book accommodation in advance on weekends', 'Mall Road is pedestrian-only', 'Kempty Falls gets very crowded', 'Snowfall in December is magical']
        ,
        packing: {'climate':'Cool (0-25C), freezing in winter with snow','dress':'Heavy woolens winter, light layers summer','shoes':'Trekking boots with grip, waterproof shoes','medicine':'Cold medication, sunscreen','comfort':'Thermos flask, warm socks, gloves, umbrella','snacks':'Hot chocolate supplies, dry fruits, energy bars'},

    },

    nainital: {

        name: 'Nainital', state: 'Uttarakhand', bestTime: 'March to June, October to December',

        tagline: 'Lake District of India — emerald lake in a valley',

        places: [

            { name: 'Naini Lake', type: 'nature', desc: 'Heart-shaped lake. Boating paradise.', tip: 'Rowing and paddling boats.', budget: '₹150-300 boat' },

            { name: 'Naina Devi Temple', type: 'spiritual', desc: 'Shakti Peetha on lake northern shore.', tip: 'Lake view from temple.', budget: 'Free' },

            { name: 'Snow View Point', type: 'nature', desc: 'Cable car to Himalayan views.', tip: 'Nanda Devi peak visible.', budget: '₹150 ropeway' },

            { name: 'Tiffin Top', type: 'nature', desc: 'Horse ride to hilltop viewpoint.', tip: 'Panoramic valley views.', budget: '₹200 horse' },

            { name: 'Eco Cave Gardens', type: 'nature', desc: 'Connected animal-shaped caves.', tip: 'Fun for kids.', budget: '₹60' },

            { name: 'Bhimtal Lake', type: 'nature', desc: 'Larger lake 22km away. Quieter.', tip: 'Fish aquarium on island.', budget: '₹100 boat' },

            { name: 'Nal Damyanti Tal', type: 'nature', desc: 'Small natural lake. Peaceful.', tip: 'Picnic spot.', budget: 'Free' },

            { name: 'Thandi Sadak', type: 'nature', desc: 'Cool walkway around lake.', tip: 'Evening stroll.', budget: 'Free' }

        ],

        food: ['Ras reshad at local restaurants', 'Momos', 'Aloo ke gutke', 'Bal Mithai', 'Chai by the lake', 'Chinese at Sakley\'s'],

        hotels: [{ name: 'The Naini Retreat', budget: 'Luxury ₹8K+', rating: '4.5' }, { name: 'Hotel Shiv Regency', budget: 'Premium ₹3K+', rating: '4.2' }, { name: 'Hotel Evergreen', budget: 'Budget ₹1.5K-3K', rating: '3.9' }, { name: 'Zostel Nainital', budget: 'Budget ₹500-1200', rating: '4.1' }],

        transport: ['Walking lake area', 'Taxi', 'Trolley/Cable car', 'Horse rides', 'Bus from Delhi 7h'],

        tips: ['Naini Lake boating is must', 'Avoid weekends — extremely crowded', 'Visit Bhimtal for quieter experience', 'Snow in December-January']
        ,
        packing: {'climate':'Cool (0-28C), snowfall Dec-Feb','dress':'Heavy woolens winter, light cotton summer','shoes':'Trekking boots (snow grip), waterproof shoes','medicine':'Cold cream, lip balm, sunscreen SPF50','comfort':'Thermos, warm blanket, gloves','snacks':'Hot soup packets, dry fruits, chocolate'},

    },

    dalhousie: {

        name: 'Dalhousie', state: 'Himachal Pradesh', bestTime: 'March to June, October to December',

        tagline: 'Little Switzerland of India — pine-clad slopes and colonial charm',

        places: [

            { name: 'Khajjiar', type: 'nature', desc: 'Mini Switzerland. Meadow lake.', tip: 'Horse riding available.', budget: '₹100 entry' },

            { name: 'Dainkund Peak', type: 'nature', desc: 'Highest point. Wind sings through trees.', tip: '1.5km trek.', budget: 'Free' },

            { name: 'Kalatop Wildlife Sanctuary', type: 'nature', desc: 'Bear sanctuary. Nature trails.', tip: 'Guided walks.', budget: '₹100' },

            { name: 'Subhash Baoli', type: 'nature', desc: 'Spring where Netaji stayed.', tip: 'Peaceful picnic spot.', budget: 'Free' },

            { name: 'St. John\'s Church', type: 'heritage', desc: '1863 church. Gothic architecture.', tip: 'Beautiful stained glass.', budget: 'Free' },

            { name: 'Garam Sadak', type: 'landmark', desc: 'Warm road — never gets cold.', tip: 'Unique microclimate.', budget: 'Free' },

            { name: 'Panchpula', type: 'nature', desc: 'Waterfalls and streams.', tip: 'Picnic spot.', budget: 'Free' },

            { name: 'Satdhara Falls', type: 'nature', desc: 'Seven springs waterfall.', tip: 'Medicinal water.', budget: 'Free' }

        ],

        food: ['Siddu at dhabas', 'Rajma Chawal', 'Momos', 'Thukpa', 'Chai with pakoras', 'Local Himachali thali'],

        hotels: [{ name: 'Hotel Himdhara', budget: 'Premium ₹4K+', rating: '4.3' }, { name: 'Elgin Hall', budget: 'Premium ₹3K+', rating: '4.2' }, { name: 'Hotel Sachin', budget: 'Budget ₹1K-2K', rating: '3.8' }, { name: 'Zostel Dalhousie', budget: 'Budget ₹400-1000', rating: '4.0' }],

        transport: ['Walking', 'Taxi', 'Local bus', 'Shared jeeps', 'Gypsy for Khajjiar'],

        tips: ['Khajjiar is a day trip from Dalhousie', 'Carry warm clothes even in summer', 'Kalatop for nature lovers', 'Less crowded than Manali/Shimla']
        ,
        packing: {'climate':'Cold (-5 to 25C), heavy snowfall Dec-Feb','dress':'Heavy woolens, thermal innerwear, waterproof jacket','shoes':'Snow boots with grip, waterproof trekking shoes','medicine':'Cold and flu medicine, lip balm','comfort':'Hand warmers, thermos, sleeping bag','snacks':'Energy bars, chocolate, dry fruits'},

    },

    kasol: {

        name: 'Kasol', state: 'Himachal Pradesh', bestTime: 'March to June, September to November',

        tagline: 'Mini Israel of India — backpacker paradise in Parvati Valley',

        places: [

            { name: 'Kheerganga Trek', type: 'adventure', desc: 'Famous trek to natural hot springs.', tip: '2-day trek. Camp overnight.', budget: 'Free trek' },

            { name: 'Parvati River', type: 'nature', desc: 'Crystal clear river flowing through town.', tip: 'Riverside cafes.', budget: 'Free' },

            { name: 'Tosh Village', type: 'cultural', desc: 'End of road village. Mountain views.', tip: '2km walk from road end.', budget: 'Free' },

            { name: 'Malana Village', type: 'cultural', desc: 'Ancient democracy village. Restricted entry.', tip: 'Respect local customs.', budget: 'Free' },

            { name: 'Rasol Waterfall', type: 'nature', desc: 'Hidden waterfall trek.', tip: 'Ask locals for route.', budget: 'Free' },

            { name: 'Manikaran Sahib', type: 'spiritual', desc: 'Gurudwara with hot springs.', tip: 'Cook rice in hot spring!', budget: 'Free' },

            { name: 'Chalal Trek', type: 'adventure', desc: 'Easy 3km riverside trek.', tip: 'Best for beginners.', budget: 'Free' },

            { name: 'Café Culture', type: 'cultural', desc: 'Israeli, German, Italian cafes.', tip: 'Try shakshuka and hummus.', budget: 'Free entry' }

        ],

        food: ['Shakshuka at Evergreen Café', 'Hummus and Pita', 'Israeli breakfast', 'Italian pizza', 'Himachali Dham', 'Chai everywhere'],

        hotels: [{ name: 'The Hosteller Kasol', budget: 'Premium ₹2K+', rating: '4.3' }, { name: 'Hotel Sandhya', budget: 'Budget ₹1K-2K', rating: '3.9' }, { name: 'Parvati Woods Camps', budget: 'Budget ₹800-2000', rating: '4.0' }, { name: 'Zostel Kasol', budget: 'Budget ₹400-1000', rating: '4.2' }],

        transport: ['Walking', 'Local bus', 'Shared taxi', 'Hitchhiking common', 'Bike rental'],

        tips: ['Kheerganga trek is a must', 'Start trek early morning', 'Cash is king — limited ATMs', 'Respect local village rules']
        ,
        packing: {'climate':'Cool (0-25C), cold nights year-round','dress':'Warm layers even in summer, rain gear','shoes':'Trekking boots essential, waterproof sandals','medicine':'Leech repellent, altitude sickness pills','comfort':'Sleeping bag liner, flashlight, power bank','snacks':'Trail mix, energy bars, instant noodles'},

    },

    coonoor: {

        name: 'Coonoor', state: 'Tamil Nadu', bestTime: 'October to May',

        tagline: 'Tea town with SIM\'s Park and stunning viewpoints',

        places: [

            { name: 'SIM\'s Park', type: 'park', desc: 'Botanical garden. 240+ species.', tip: 'Annual flower show May.', budget: '₹30' },

            { name: 'Dolphin\'s Nose', type: 'nature', desc: 'Viewpoint shaped like dolphin nose.', tip: 'Catherine Falls view.', budget: '₹10' },

            { name: 'Tea Factories', type: 'cultural', desc: 'Tea processing tours. Tasting.', tip: 'Buy fresh tea.', budget: '₹100' },

            { name: 'Lamb\'s Rock', type: 'nature', desc: 'Cliff viewpoint. Tea estates below.', tip: 'Sunrise point.', budget: 'Free' },

            { name: 'Pasteur Institute', type: 'museum', desc: '1907 institute. Rose garden.', tip: 'Quick visit.', budget: 'Free' },

            { name: 'Law\'s Falls', type: 'nature', desc: 'Waterfall in forest.', tip: 'Short walk from road.', budget: 'Free' },

            { name: 'Toy Train Station', type: 'heritage', desc: 'UNESCO railway. Ooty connection.', tip: 'Book in advance.', budget: '₹200' },

            { name: 'Wellington Golf Course', type: 'nature', desc: 'Military golf course. Scenic.', tip: 'For golf enthusiasts.', budget: 'Varies' }

        ],

        food: ['Tea at plantation cafes', 'South Indian at local restaurants', 'Chocolate at shops', 'Momos', 'Home-made cakes', 'Filter coffee'],

        hotels: [{ name: 'Stinger by Taj', budget: 'Premium ₹5K+', rating: '4.4' }, { name: 'Hotel Gateway Coonoor', budget: 'Premium ₹3K+', rating: '4.2' }, { name: 'Club Mahindra', budget: 'Premium ₹4K+', rating: '4.1' }, { name: 'Zostel Coonoor', budget: 'Budget ₹400-1000', rating: '4.0' }],

        transport: ['Auto-rickshaw', 'Taxi', 'Walking town area', 'Toy train', 'Bus from Mettupalayam'],

        tips: ['Less crowded alternative to Ooty', 'Toy train between Ooty-Coonoor', 'Buy fresh tea from factories', 'Combine with Ooty trip']
        ,
        packing: {'climate':'Pleasant (10-25C), misty mornings, chilly evenings','dress':'Light woolens, jacket for evenings','shoes':'Comfortable walking shoes for tea estate treks','medicine':'Mosquito repellent, sunscreen','comfort':'Light shawl/cardigan, water bottle, camera','snacks':'Tea estate cafe snacks, dry fruits, chocolates'},

    },

    kodaikanal: {

        name: 'Kodaikanal', state: 'Tamil Nadu', bestTime: 'October to June',

        tagline: 'Princess of Hill Stations — misty forests and star-shaped lake',

        places: [

            { name: 'Kodai Lake', type: 'nature', desc: 'Star-shaped lake. Boating, cycling.', tip: 'Cycle around the lake.', budget: '₹200 boat, ₹150 cycle' },

            { name: 'Coaker\'s Walk', type: 'nature', desc: '1km mountain path. Valley views.', tip: 'Morning walk.', budget: '₹10' },

            { name: 'Bryant Park', type: 'park', desc: 'Botanical garden. Rose garden.', tip: 'Annual flower show.', budget: '₹30' },

            { name: 'Pillar Rocks', type: 'nature', desc: 'Three giant rock pillars.', tip: 'Sunrise/sunset.', budget: '₹10' },

            { name: 'Dolphin\'s Nose', type: 'nature', desc: 'Rock shaped like dolphin. Falls view.', tip: 'Catherine Falls visible.', budget: '₹10' },

            { name: 'Berijam Lake', type: 'nature', desc: 'Forest-surrounded lake.', tip: 'Permit needed.', budget: '₹50' },

            { name: 'Pine Forest', type: 'nature', desc: 'Dense pine forest walk.', tip: 'Photography paradise.', budget: 'Free' },

            { name: 'Silver Cascade Falls', type: 'nature', desc: 'Waterfall near road.', tip: 'Quick stop.', budget: 'Free' }

        ],

        food: ['Chocolate at local shops', 'South Indian meals', 'Momos', 'Tibetan food', 'Home-made cheese', 'Filter coffee'],

        hotels: [{ name: 'The Tamara Kodai', budget: 'Luxury ₹12K+', rating: '4.7' }, { name: 'Vivanta Kodai', budget: 'Premium ₹5K+', rating: '4.4' }, { name: 'Hotel Kodai International', budget: 'Premium ₹3K+', rating: '4.1' }, { name: 'Zostel Kodaikanal', budget: 'Budget ₹500-1200', rating: '4.0' }],

        transport: ['Walking', 'Taxi', 'Auto-rickshaw', 'Bicycle rental', 'Bus from Madurai 3h'],

        tips: ['Cycle around Kodai Lake', 'Carry warm clothes always misty', 'Homemade chocolates are famous', 'Combine with Madurai temple visit']
        ,
        packing: {'climate':'Cool (8-25C), misty and rainy Jul-Oct','dress':'Light woolens, waterproof jacket','shoes':'Waterproof trekking shoes, comfortable sandals','medicine':'Leech repellent, cold cream, sunscreen, ORS','comfort':'Umbrella, rain poncho, warm socks','snacks':'Homemade chocolates, dry fruits'},

    },

    wayanad: {

        name: 'Wayanad', state: 'Kerala', bestTime: 'October to May',

        tagline: 'Land of Paddy Fields — spice plantations and wildlife',

        places: [

            { name: 'Edakkal Caves', type: 'monument', desc: 'Prehistoric petroglyphs. 6000 years old.', tip: 'Steep climb.', budget: '₹100' },

            { name: 'Banasura Sagar Dam', type: 'landmark', desc: 'Largest earth dam in India.', tip: 'Boating available.', budget: '₹50' },

            { name: 'Chembra Peak', type: 'nature', desc: 'Heart-shaped lake trek.', tip: 'Permit needed. Start early.', budget: '₹75' },

            { name: 'Wayanad Wildlife Sanctuary', type: 'nature', desc: 'Elephant, tiger, deer habitat.', tip: 'Jeep safari.', budget: '₹300' },

            { name: 'Thirunelli Temple', type: 'spiritual', desc: 'Ancient Vishnu temple in forest.', tip: 'Papanasini stream.', budget: 'Free' },

            { name: 'Lakkidi Viewpoint', type: 'nature', desc: 'Gateway to Wayanad. Valley views.', tip: 'Photo stop.', budget: 'Free' },

            { name: 'Pookode Lake', type: 'nature', desc: 'Freshwater lake. Boating.', tip: 'Aquarium.', budget: '₹50' },

            { name: 'Kuruva Island', type: 'nature', desc: 'River island. Bamboo rafting.', tip: 'Nature walk.', budget: '₹100' }

        ],

        food: ['Kerala Meals on banana leaf', 'Fish Curry', 'Appam and Stew', 'Malabar Biryani', 'Banana chips', 'Spice tea'],

        hotels: [{ name: 'Vythiri Village Resort', budget: 'Luxury ₹12K+', rating: '4.7' }, { name: 'Windflower Resort', budget: 'Premium ₹5K+', rating: '4.5' }, { name: 'Hilton Garden Inn', budget: 'Premium ₹4K+', rating: '4.3' }, { name: 'Zostel Wayanad', budget: 'Budget ₹500-1200', rating: '4.0' }],

        transport: ['Rented car/jeep', 'Auto-rickshaw', 'Taxi', 'Bus from Calicut 3h', 'Walking resort area'],

        tips: ['Rented jeep is essential', 'Edakkal Caves require steep climb', 'Carry insect repellent', 'Spice plantation tours available']
        ,
        packing: {'climate':'Tropical (20-35C), heavy monsoon Jun-Oct','dress':'Light cotton, waterproof jacket monsoon','shoes':'Waterproof trekking shoes essential','medicine':'Leech repellent, mosquito repellent, ORS','comfort':'Rain poncho, insect repellent, power bank','snacks':'Trail mix, water bottles, energy bars'},

    },

    alleppey: {

        name: 'Alleppey', state: 'Kerala', bestTime: 'September to May',

        tagline: 'Venice of the East — houseboats on serene backwaters',

        places: [

            { name: 'Houseboat Cruise', type: 'nature', desc: 'Overnight backwater experience.', tip: 'Book in advance. Includes meals.', budget: '₹5000-15000' },

            { name: 'Alleppey Beach', type: 'beach', desc: 'Lighthouse beach. Beautiful sunset.', tip: 'Evening walk.', budget: 'Free' },

            { name: 'Backwater Canoe Ride', type: 'adventure', desc: 'Narrow canals through villages.', tip: 'Morning is best.', budget: '₹500-1000' },

            { name: 'Krishnapuram Palace', type: 'heritage', desc: '18th century palace. Kerala mural.', tip: 'Gajendra Moksha painting.', budget: '₹20' },

            { name: 'Marari Beach', type: 'beach', desc: 'Quiet fishing village beach.', tip: 'Coconut groves.', budget: 'Free' },

            { name: 'Vembanad Lake', type: 'nature', desc: 'Longest lake in India.', tip: 'Sunset cruise.', budget: '₹300-500' },

            { name: 'Champakulam Church', type: 'heritage', desc: 'One of oldest churches in India.', tip: 'Syrian Christian heritage.', budget: 'Free' },

            { name: 'Coir Museum', type: 'museum', desc: 'Coconut fiber products.', tip: 'Buy souvenirs.', budget: '₹20' }

        ],

        food: ['Kerala Meals banana leaf', 'Karimeen Pearl Spot fish', 'Appam with stew', 'Puttu and Kadala', 'Toddy shop food', 'Banana chips'],

        hotels: [{ name: 'Kumarakom Lake Resort', budget: 'Luxury ₹12K+', rating: '4.7' }, { name: 'Coconut Lagoon', budget: 'Premium ₹6K+', rating: '4.5' }, { name: 'Houseboat stay', budget: 'Premium ₹5K-15K', rating: '4.4' }, { name: 'Zostel Alleppey', budget: 'Budget ₹400-1200', rating: '4.1' }],

        transport: ['Houseboat', 'Auto-rickshaw', 'Canoe', 'Taxi', 'Bus from Cochin 1.5h'],

        tips: ['Overnight houseboat is a must', 'Book houseboat 2 weeks in advance', 'Monsoon houseboat is magical but rainy', 'Backwater canoe for narrow canals']
        ,
        packing: {'climate':'Hot humid (25-35C), heavy monsoon Jun-Sep','dress':'Light cotton/linen, rain gear','shoes':'Waterproof sandals, comfortable walking shoes','medicine':'Mosquito repellent, sunscreen, ORS','comfort':'Waterproof bag for houseboat, hat, umbrella','snacks':'Coconut water, banana chips, dry fruits'},

    },

    madurai: {

        name: 'Madurai', state: 'Tamil Nadu', bestTime: 'October to March',

        tagline: 'Temple City — 2500 years of continuous culture',

        places: [

            { name: 'Meenakshi Amman Temple', type: 'spiritual', desc: 'Magnificent Dravidian temple. 33000 sculptures.', tip: 'Evening ceremony.', budget: 'Free' },

            { name: 'Thirumalai Nayak Palace', type: 'heritage', desc: '17th century palace. Sound & light show.', tip: 'Show at 7 PM.', budget: '₹50' },

            { name: 'Gandhi Memorial Museum', type: 'museum', desc: 'Freedom struggle artifacts.', tip: 'Allow 2 hours.', budget: '₹10' },

            { name: 'Alagar Koil', type: 'spiritual', desc: 'Vishnu temple in hills. Scenic.', tip: '14km from city.', budget: 'Free' },

            { name: 'Vandiyur Mariamman Teppakulam', type: 'landmark', desc: '16th century tank. Float festival.', tip: 'Jan festival.', budget: 'Free' },

            { name: 'Pudhu Mandapam', type: 'market', desc: 'Market near temple. Shopping.', tip: 'Buy silk and brass.', budget: 'Free' },

            { name: 'Samayapuram Temple', type: 'spiritual', desc: 'Mariamman temple. Powerful.', tip: '30km from city.', budget: 'Free' },

            { name: 'Aayiram Kaal Mandapam', type: 'heritage', desc: 'Thousand-pillar hall.', tip: 'Architecture marvel.', budget: 'Free' }

        ],

        food: ['Jigarthanda at Famous Jigarthanda', 'Chettinad Chicken', 'Banana leaf meals', 'Kari Dosa', 'Idiyappam', 'Kothu Parotta'],

        hotels: [{ name: 'Heritage Madurai', budget: 'Luxury ₹8K+', rating: '4.6' }, { name: 'Taj Gateway Pasumalai', budget: 'Premium ₹5K+', rating: '4.4' }, { name: 'Hotel Royal Court', budget: 'Budget ₹2K-4K', rating: '4.0' }, { name: 'Zostel Madurai', budget: 'Budget ₹400-1000', rating: '4.0' }],

        transport: ['Auto-rickshaw', 'City bus', 'Walking temple area', 'Taxi', 'Train from Chennai 8h'],

        tips: ['Meenakshi Temple is unmissable', 'Evening ceremony is spectacular', 'Try Jigarthanda — unique drink', 'Combine with Rameshwaram trip']
        ,
        packing: {'climate':'Hot (25-40C), dry summers, pleasant Nov-Feb','dress':'Light cotton, covered shoulders/knees for temple','shoes':'Comfortable slip-ons, walking shoes','medicine':'Sunscreen, ORS, electrolyte tablets','comfort':'Water bottle, umbrella, power bank','snacks':'Jigarthanda drink, dry snacks'},

    },

    puri: {

        name: 'Puri', state: 'Odisha', bestTime: 'October to March',

        tagline: 'Jagannath Dham — holy city of Lord of the Universe',

        places: [

            { name: 'Jagannath Temple', type: 'spiritual', desc: 'One of Char Dham. Rath Yatra site.', tip: 'Non-Hindus cannot enter.', budget: 'Free' },

            { name: 'Puri Beach', type: 'beach', desc: 'Golden beach. Sunrise point.', tip: 'Morning swim.', budget: 'Free' },

            { name: 'Konark Sun Temple', type: 'monument', desc: 'UNESCO chariot temple. 30km away.', tip: 'Half day trip.', budget: '₹35' },

            { name: 'Chilika Lake', type: 'nature', desc: 'Asia\'s largest lagoon. Irrawaddy dolphins.', tip: 'Boat to Kalijai island.', budget: '₹300 boat' },

            { name: 'Raghurajpur', type: 'cultural', desc: 'Heritage crafts village. Pattachitra art.', tip: 'Buy paintings.', budget: 'Free' },

            { name: 'Gundicha Temple', type: 'spiritual', desc: 'Jagannath\'s garden house.', tip: 'Rath Yatra destination.', budget: 'Free' },

            { name: 'Swargadwar', type: 'landmark', desc: 'Sea beach market.', tip: 'Shopping.', budget: 'Free' },

            { name: 'Alarnath Temple', type: 'spiritual', desc: 'Kuldeep temple. 25km away.', tip: 'During Rath Yatra.', budget: 'Free' }

        ],

        food: ['Mahaprasad at Jagannath Temple', 'Chhena Poda', 'Khaja sweet', 'Dahi Vada', 'Puri and Sabji', 'Chilika fish'],

        hotels: [{ name: 'Mayfair Puri', budget: 'Premium ₹5K+', rating: '4.4' }, { name: 'Toshali Sands', budget: 'Premium ₹4K+', rating: '4.3' }, { name: 'Hotel holiday Resort', budget: 'Budget ₹1.5K-3K', rating: '3.9' }, { name: 'Zostel Puri', budget: 'Budget ₹400-1000', rating: '4.0' }],

        transport: ['Auto-rickshaw', 'Cycle-rickshaw', 'Bus', 'Taxi', 'Train from Bhubaneswar 2h'],

        tips: ['Rath Yatra (Jul) is world-famous', 'Mahaprasad is free temple food', 'Konark Temple is unmissable', 'Chilika Lake dolphin watching']
        ,
        packing: {'climate':'Hot humid (25-40C), cyclone season Oct-Dec','dress':'Light cotton, beachwear, modest for temple','shoes':'Sandals for beach, comfortable walking shoes','medicine':'Sunscreen SPF50, mosquito repellent, ORS','comfort':'Beach towel, waterproof bag, hat, umbrella','snacks':'Chuda ghasa, dry fruits, bottled water'},

    },

    gangtok: {

        name: 'Gangtok', state: 'Sikkim', bestTime: 'March to May, October to December',

        tagline: 'Land of Pure Bliss — Buddhist monasteries and Himalayan views',

        places: [

            { name: 'Tsomgo Lake', type: 'nature', desc: 'Glacial lake at 12,313ft.', tip: 'Permit needed. Book through hotel.', budget: '₹200 + permit' },

            { name: 'Baba Mandir', type: 'spiritual', desc: 'War memorial at 13,123ft.', tip: 'Combine with Tsomgo.', budget: 'Free' },

            { name: 'Rumtek Monastery', type: 'spiritual', desc: 'Largest monastery in Sikkim.', tip: 'Peaceful setting.', budget: 'Free' },

            { name: 'MG Marg', type: 'market', desc: 'Main street. Pedestrian only.', tip: 'Shopping and food.', budget: 'Free' },

            { name: 'Enchey Monastery', type: 'spiritual', desc: '200-year-old monastery.', tip: 'City view.', budget: 'Free' },

            { name: 'Hanuman Tok', type: 'spiritual', desc: 'Hanuman temple on hilltop.', tip: 'Sunrise views.', budget: 'Free' },

            { name: 'Ganesh Tok', type: 'spiritual', desc: 'Ganesh temple with city view.', tip: 'Small but scenic.', budget: 'Free' },

            { name: 'Tashi Viewpoint', type: 'nature', desc: 'Kanchenjunga views.', tip: 'Morning best.', budget: 'Free' }

        ],

        food: ['Momos everywhere', 'Thukpa', 'Gyathuk', 'Sel Roti', 'Churpee cheese', 'Sikkimese thali'],

        hotels: [{ name: 'Mayfair Gangtok', budget: 'Premium ₹5K+', rating: '4.5' }, { name: 'Hotel Denzong Regency', budget: 'Premium ₹3K+', rating: '4.3' }, { name: 'Hotel Tashi Delek', budget: 'Budget ₹2K-4K', rating: '4.0' }, { name: 'Zostel Gangtok', budget: 'Budget ₹500-1200', rating: '4.1' }],

        transport: ['Walking MG Marg', 'Taxi', 'Shared jeep', 'Ropeway', 'Bus'],

        tips: ['Inner Line Permit needed for some areas', 'Tsomgo Lake permit books fast', 'MG Marg is pedestrian-only', 'Combine with Pelling/Darjeeling']
        ,
        packing: {'climate':'Cool (0-25C), monsoon heavy Jun-Sep','dress':'Warm layers, waterproof jacket','shoes':'Trekking boots with grip, waterproof shoes','medicine':'Altitude sickness pills, cold medicine','comfort':'Power bank, reusable water bottle, warm gloves','snacks':'Momos, thukpa, energy bars for treks'},

    },

    shillong: {

        name: 'Shillong', state: 'Meghalaya', bestTime: 'October to May',

        tagline: 'Scotland of the East — music, waterfalls, and living root bridges',

        places: [

            { name: 'Umiam Lake', type: 'nature', desc: 'Man-made lake. Boating, kayaking.', tip: 'Sunset is stunning.', budget: '₹150 boat' },

            { name: 'Don Bosco Museum', type: 'museum', desc: 'NE India\'s largest museum.', tip: 'Allow 3 hours.', budget: '₹100' },

            { name: 'Ward\'s Lake', type: 'park', desc: 'Colonial lake. Gardens.', tip: 'Evening walk.', budget: '₹10' },

            { name: 'Shillong Peak', type: 'nature', desc: 'Highest point. City panorama.', tip: 'Military area — carry ID.', budget: 'Free' },

            { name: 'Elephant Falls', type: 'nature', desc: 'Three-tier waterfall.', tip: '25km from city.', budget: '₹20' },

            { name: 'Police Bazaar', type: 'market', desc: 'Main market. Shopping.', tip: 'Buy Khasi handicrafts.', budget: 'Free' },

            { name: 'Air Force Museum', type: 'museum', desc: 'Aviation history.', tip: 'Quick visit.', budget: 'Free' },

            { name: 'Laitlum Canyon', type: 'nature', desc: 'Dramatic canyon. Trek.', tip: 'Less crowded.', budget: 'Free' }

        ],

        food: ['Jadoh (red rice with pork)', 'Dohneiiong', 'Tungrymbai', 'Momos', 'Smoked meat', 'Khasi traditional food'],

        hotels: [{ name: 'Ri Kynjai', budget: 'Premium ₹5K+', rating: '4.5' }, { name: 'Hotel Centre Point', budget: 'Premium ₹3K+', rating: '4.2' }, { name: 'Hotel Alpine', budget: 'Budget ₹1.5K-3K', rating: '3.9' }, { name: 'Zostel Shillong', budget: 'Budget ₹500-1200', rating: '4.0' }],

        transport: ['Walking', 'Taxi', 'Shared taxi', 'Bus', 'Rented bike'],

        tips: ['Live music capital of NE India', 'Try Khasi food — unique flavors', 'Living root bridges nearby (Cherrapunji)', 'Carry rain gear always']
        ,
        packing: {'climate':'Pleasant (4-25C), heavy monsoon Jun-Sep','dress':'Light woolens, rain jacket','shoes':'Waterproof trekking shoes, comfortable sandals','medicine':'Leech repellent, sunscreen, cold medicine','comfort':'Umbrella, rain poncho, warm shawl','snacks':'Local street food, dry fruits'},

    },

    kaziranga: {

        name: 'Kaziranga', state: 'Assam', bestTime: 'November to April',

        tagline: 'One-Horned Rhino Capital — UNESCO wildlife sanctuary',

        places: [

            { name: 'Jeep Safari', type: 'nature', desc: 'Rhino, elephant, tiger, buffalo.', tip: 'Book early morning slot.', budget: '₹3500 jeep + ₹100 permit' },

            { name: 'Elephant Safari', type: 'nature', desc: 'Ride through grasslands.', tip: 'Most intimate experience.', budget: '₹1500' },

            { name: 'Kaziranga Orchid Park', type: 'park', desc: '500+ orchid species.', tip: 'Best Feb-Mar.', budget: '₹100' },

            { name: 'Kakochang Waterfall', type: 'nature', desc: 'Waterfall near sanctuary.', tip: 'Picnic spot.', budget: '₹20' },

            { name: 'Deoparbat Ruins', type: 'monument', desc: 'Ahom-era ruins.', tip: 'Historical significance.', budget: 'Free' },

            { name: 'Mithimukh Tea Estate', type: 'cultural', desc: 'Tea garden walks.', tip: 'Buy Assam tea.', budget: 'Free' },

            { name: 'Bokakhat Town', type: 'cultural', desc: 'Gateway town. Local market.', tip: 'Buy local crafts.', budget: 'Free' },

            { name: 'River Island Walk', type: 'nature', desc: 'Brahmaputra sandbar.', tip: 'Sunset.', budget: 'Free' }

        ],

        food: ['Assamese Thali', 'Masor Tenga (sour fish)', 'Duck curry', 'Pitha rice cakes', 'Jolpan breakfast', 'Tea from gardens'],

        hotels: [{ name: 'Vivanta Kaziranga', budget: 'Luxury ₹10K+', rating: '4.6' }, { name: 'Iora Retreat', budget: 'Premium ₹5K+', rating: '4.5' }, { name: 'Hotel Wild Grass', budget: 'Premium ₹3K+', rating: '4.2' }, { name: 'Zostel Kaziranga', budget: 'Budget ₹500-1200', rating: '4.0' }],

        transport: ['Jeep (essential)', 'Elephant safari', 'Auto-rickshaw', 'Taxi', 'Train from Guwahati 4h'],

        tips: ['Book safari 2 weeks in advance', 'Morning slot has best wildlife sightings', 'Carry binoculars', 'Elephant safari is more intimate than jeep']
        ,
        packing: {'climate':'Tropical (10-35C), park closed monsoon Jun-Sep','dress':'Earth-tone/olive clothing, long sleeves, hat','shoes':'Closed-toe sturdy shoes for safari','medicine':'Mosquito repellent, sunscreen, basic first-aid','comfort':'Binoculars, camera, water bottle, hat','snacks':'Packed lunch for safari, dry snacks'},

    },

    darbhanga: {

        name: 'Darbhanga', state: 'Bihar', bestTime: 'October to March',

        tagline: 'Cultural Capital of Mithila — art, literature, and traditions',

        places: [

            { name: 'Darbhanga Raj Palace', type: 'heritage', desc: 'Royal palace. Mithila art collection.', tip: 'Guided tours available.', budget: 'Free' },

            { name: 'Kusheshwar Asthan', type: 'spiritual', desc: 'Ancient Shiva temple.', tip: 'Bird sanctuary nearby.', budget: 'Free' },

            { name: 'Mithila Art Institute', type: 'cultural', desc: 'Learn Madhubani painting.', tip: 'Workshops available.', budget: '₹500 workshop' },

            { name: 'Ahilya Sthan', type: 'spiritual', desc: 'Mythological Ramayana site.', tip: 'Peaceful setting.', budget: 'Free' },

            { name: 'Lalit Narayan Mithila University', type: 'cultural', desc: 'Historic university campus.', tip: 'Architecture walk.', budget: 'Free' },

            { name: 'Sonauli Border', type: 'landmark', desc: 'India-Nepal border.', tip: 'Shopping cross-border.', budget: 'Free' },

            { name: 'Mithila Paintings Village', type: 'cultural', desc: 'Madhubani art village.', tip: 'Buy authentic paintings.', budget: 'Free' },

            { name: 'Jal庙 Temple', type: 'spiritual', desc: 'Water temple.', tip: 'Unique architecture.', budget: 'Free' }

        ],

        food: ['Litti Chokha', 'Thekua sweet', 'Dahi Chura', 'Makhana dishes', 'Mithila Thali', 'Tilkut'],

        hotels: [{ name: 'Hotel Vaishali', budget: 'Premium ₹3K+', rating: '4.0' }, { name: 'Hotel Sri Ram', budget: 'Budget ₹1K-2K', rating: '3.8' }, { name: 'OYO Hotels', budget: 'Budget ₹800-1500', rating: '3.5' }, { name: 'Treebo Hotels', budget: 'Budget ₹1K-2K', rating: '3.7' }],

        transport: ['Auto-rickshaw', 'Cycle-rickshaw', 'Bus', 'Taxi', 'Train from Patna 3h'],

        tips: ['Buy Madhubani paintings as souvenirs', 'Try Litti Chokha — Bihari specialty', 'Mithila culture is unique', 'Combine with Vaishali archaeological site']
        ,
        packing: {'climate':'Extreme (2-45C), hot summers, cold foggy winters','dress':'Light cotton summers, heavy woolens winters','shoes':'Comfortable walking shoes, sandals','medicine':'Sunscreen, ORS, mosquito repellent','comfort':'Water bottle, umbrella, power bank','snacks':'Dry fruits, bottled water'},

    },

    warangal: {

        name: 'Warangal', state: 'Telangana', bestTime: 'October to March',

        tagline: 'Kakatiya Heritage — medieval architectural marvels',

        places: [

            { name: 'Warangal Fort', type: 'monument', desc: 'Kakatiya fortress. Stone gateway.', tip: 'Allow 2 hours.', budget: '₹25' },

            { name: 'Thousand Pillar Temple', type: 'monument', desc: '1000-pillar temple. Star-shaped.', tip: 'Architecture marvel.', budget: '₹25' },

            { name: 'Ramappa Temple', type: 'monument', desc: 'UNESCO site. Floating bricks!', tip: 'One of finest temples.', budget: '₹25' },

            { name: 'Bhadrakali Temple', type: 'spiritual', desc: 'Goddess Kali temple.', tip: 'City patron deity.', budget: 'Free' },

            { name: 'Kakatiya Musical Garden', type: 'park', desc: 'Musical fountain garden.', tip: 'Evening show.', budget: '₹20' },

            { name: 'Eturnagaram Wildlife', type: 'nature', desc: 'Wildlife sanctuary.', tip: 'Jeep safari.', budget: '₹100' },

            { name: 'Packalu Lake', type: 'nature', desc: 'Scenic lake. Boating.', tip: 'Picnic spot.', budget: '₹30' },

            { name: 'Govindarajula Lake', type: 'nature', desc: 'Sunset point.', tip: 'Evening visit.', budget: 'Free' }

        ],

        food: ['Biryani Hyderabadi style', 'Sakinalu snack', 'Sarva Pindi', 'Hyderabadi Haleem', 'Double Ka Meetha', 'Lemon Rice'],

        hotels: [{ name: 'Hotel Grand Kakatiya', budget: 'Premium ₹4K+', rating: '4.3' }, { name: 'Hotel Makakita', budget: 'Budget ₹2K-3K', rating: '4.0' }, { name: 'OYO Hotels', budget: 'Budget ₹800-1500', rating: '3.5' }, { name: 'Treebo Hotels', budget: 'Budget ₹1K-2K', rating: '3.7' }],

        transport: ['Auto-rickshaw', 'Bus', 'Taxi', 'Walking old city', 'Train from Hyderabad 3h'],

        tips: ['Ramappa Temple is UNESCO listed', 'Buy Kakatiya crafts', 'Combine with Hyderabad trip', 'Thousand Pillar Temple is extraordinary']
        ,
        packing: {'climate':'Hot (20-42C), monsoon Jul-Oct','dress':'Light cotton, temple-appropriate clothing','shoes':'Comfortable walking shoes, sandals','medicine':'Sunscreen, ORS, mosquito repellent','comfort':'Water bottle, hat, umbrella, power bank','snacks':'Local sweets, dry fruits'},

    },

    badami: {

        name: 'Badami', state: 'Karnataka', bestTime: 'October to February',

        tagline: 'Cave Temple Town — Chalukyan rock-cut marvels',

        places: [

            { name: 'Badami Cave Temples', type: 'monument', desc: '4 cave temples. 6th century.', tip: 'All 4 caves need 3 hours.', budget: '₹25' },

            { name: 'Agastya Lake', type: 'nature', desc: 'Sacred lake below cliffs.', tip: 'Sunrise reflections.', budget: 'Free' },

            { name: 'Bhutanatha Group', type: 'monument', desc: 'Lakeside temple group.', tip: 'Beautiful setting.', budget: '₹25' },

            { name: 'Upper Shivalaya', type: 'monument', desc: 'Hilltop temple. City views.', tip: 'Climb for panorama.', budget: '₹25' },

            { name: 'Badami Fort', type: 'heritage', desc: 'Hilltop fort. Military architecture.', tip: 'Steep climb.', budget: '₹25' },

            { name: 'Malgudi Days Village', type: 'cultural', desc: 'TV serial location.', tip: 'Literary connection.', budget: 'Free' },

            { name: 'Banashankari Temple', type: 'spiritual', desc: 'Ancient temple 5km away.', tip: 'Car festival.', budget: 'Free' },

            { name: 'Pattadakal', type: 'monument', desc: 'UNESCO site. Chalukyan architecture.', tip: '30km away.', budget: '₹25' }

        ],

        food: ['Jolada Rotti', 'Ennegai stuffed brinjal', 'Badami Puran Poli', 'North Karnataka Thali', 'Ragi Mudde', 'Yenne Badnekayi'],

        hotels: [{ name: 'Hotel The Heritage', budget: 'Premium ₹3K+', rating: '4.2' }, { name: 'Hotel Badami Court', budget: 'Budget ₹1.5K-3K', rating: '4.0' }, { name: 'Homestays', budget: 'Budget ₹800-2000', rating: '4.1' }, { name: 'MTDC Resort', budget: 'Premium ₹3K+', rating: '4.0' }],

        transport: ['Auto-rickshaw', 'Walking caves', 'Taxi', 'Bus', 'Train from Hubli 2h'],

        tips: ['Combine Badami-Aihole-Pattadakal circuit', 'Cave 1 has finest carvings', 'Early morning for best photos', 'Hampi is 6 hours away']
        ,
        packing: {'climate':'Very hot (25-42C), pleasant Nov-Feb','dress':'Light cotton, sun hat','shoes':'Sturdy walking shoes for cave exploration','medicine':'Sunscreen, ORS, anti-heat medicine','comfort':'Water bottle (carry extra!), hat, umbrella','snacks':'Local food, energy bars'},

    },

    gokarna: {

        name: 'Gokarna', state: 'Karnataka', bestTime: 'October to March',

        tagline: 'Temple Town turned Beach Paradise — India\'s alternative to Goa',

        places: [

            { name: 'Om Beach', type: 'beach', desc: 'Om-shaped beach. Surfing.', tip: 'Best for sunset.', budget: 'Free' },

            { name: 'Kudle Beach', type: 'beach', desc: 'Longest beach. Hippie vibes.', tip: 'Best cafes.', budget: 'Free' },

            { name: 'Mahabaleshwar Temple', type: 'spiritual', desc: 'Ancient Shiva temple.', tip: 'Dress modestly.', budget: 'Free' },

            { name: 'Half Moon Beach', type: 'beach', desc: 'Secluded beach. Trek to reach.', tip: 'Carry water and food.', budget: 'Free' },

            { name: 'Paradise Beach', type: 'beach', desc: 'Remote beach. Boat access.', tip: 'Boat from Om Beach.', budget: '₹200 boat' },

            { name: 'Yana Rocks', type: 'nature', desc: 'Limestone rock formations.', tip: 'Trek through forest.', budget: 'Free' },

            { name: 'Murudeshwar Temple', type: 'spiritual', desc: 'Giant Shiva statue. 1hr away.', tip: 'World\'s second tallest.', budget: 'Free' },

            { name: 'Beach Trek', type: 'adventure', desc: 'Trek between beaches.', tip: 'Start from Kudle.', budget: 'Free' }

        ],

        food: ['Thali at Namaste Café', 'Israeli food', 'Pizza at Café Inferno', 'Fresh fish curry', 'Banana pancakes', 'Chai everywhere'],

        hotels: [{ name: 'SwaSwara', budget: 'Luxury ₹15K+', rating: '4.7' }, { name: 'Namaste Sanjeevini', budget: 'Premium ₹2K+', rating: '4.2' }, { name: 'Beach huts', budget: 'Budget ₹500-1500', rating: '3.9' }, { name: 'Zostel Gokarna', budget: 'Budget ₹400-1000', rating: '4.1' }],

        transport: ['Walking beach treks', 'Auto-rickshaw', 'Boat between beaches', 'Shared jeep', 'Train from Hubli 3h'],

        tips: ['Beach trek is the highlight', 'Less crowded than Goa', 'Om Beach for surfing', 'Carry cash — limited ATMs']
        ,
        packing: {'climate':'Hot humid (22-35C), monsoon Jun-Sep','dress':'Beachwear, modest for temples','shoes':'Flip-flops for beach, sturdy sandals','medicine':'Sunscreen SPF50, mosquito repellent, ORS','comfort':'Beach towel, waterproof bag, hat','snacks':'Coconut water, seafood, dry fruits'},

    },

    mcleodganj: {

        name: 'McLeod Ganj', state: 'Himachal Pradesh', bestTime: 'March to June, September to November',

        tagline: 'Little Lhasa — Dalai Lama\'s home and Tibetan culture hub',

        places: [

            { name: 'Tsuglagkhang Complex', type: 'spiritual', desc: 'Dalai Lama\'s temple. Museum.', tip: 'Morning prayers.', budget: 'Free' },

            { name: 'Triund Trek', type: 'adventure', desc: 'Famous Himalayan trek.', tip: '2 days recommended.', budget: 'Free' },

            { name: 'Bhagsu Waterfall', type: 'nature', desc: 'Beautiful waterfall. Short walk.', tip: 'Nag temple nearby.', budget: 'Free' },

            { name: 'Namgyal Monastery', type: 'spiritual', desc: 'Largest Tibetan monastery outside Tibet.', tip: 'Meditation sessions.', budget: 'Free' },

            { name: 'Dal Lake', type: 'nature', desc: 'Small lake. Peaceful.', tip: 'Quick visit.', budget: 'Free' },

            { name: 'Norbulingka Institute', type: 'cultural', desc: 'Tibetan art preservation.', tip: 'Workshops available.', budget: 'Free' },

            { name: 'Tibetan Market', type: 'market', desc: 'Handicrafts, singing bowls.', tip: 'Buy singing bowls.', budget: 'Free' },

            { name: 'St. John in Wilderness', type: 'heritage', desc: '1852 Gothic church.', tip: 'Historic landmark.', budget: 'Free' }

        ],

        food: ['Tibetan food at Norbulingka', 'Momos everywhere', 'Thukpa', 'Tingmo', 'Tibetan bread', 'Chai at every cafe'],

        hotels: [{ name: 'Bir Hotel', budget: 'Premium ₹4K+', rating: '4.3' }, { name: 'Hotel Asia', budget: 'Premium ₹3K+', rating: '4.1' }, { name: 'Snow Lion Residency', budget: 'Premium ₹3K+', rating: '4.2' }, { name: 'Zostel McLeod Ganj', budget: 'Budget ₹400-1200', rating: '4.2' }],

        transport: ['Walking', 'Auto-rickshaw', 'Taxi', 'Shared jeep', 'Bus from Dharamshala'],

        tips: ['Triund trek is bucket list', 'Cooking classes for Tibetan food', 'Buy singing bowls and thangkas', 'Meditation courses available']
        ,
        packing: {'climate':'Cool (0-25C), snowfall in winter','dress':'Heavy woolens winter, light layers summer','shoes':'Trekking boots (Triund trek), waterproof shoes','medicine':'Cold medicine, altitude pills','comfort':'Thermos, warm gloves, sleeping bag liner','snacks':'Tibetan thukpa, momos, energy bars'},

    },

    varkala: {

        name: 'Varkala', state: 'Kerala', bestTime: 'October to March',

        tagline: 'Cliff Beach Paradise — red cliffs meeting Arabian Sea',

        places: [

            { name: 'Varkala Beach', type: 'beach', desc: 'Cliff-side beach. Surfer paradise.', tip: 'South cliff is quieter.', budget: 'Free' },

            { name: 'Papanasam Beach', type: 'beach', desc: 'Holy beach. Pilgrimage spot.', tip: 'Ritual bathing.', budget: 'Free' },

            { name: 'Janardanaswamy Temple', type: 'spiritual', desc: '2000-year-old Vishnu temple.', tip: 'Dress modestly.', budget: 'Free' },

            { name: 'Sivagiri Mutt', type: 'spiritual', desc: 'Sree Narayana Guru\'s ashram.', tip: 'Hilltop views.', budget: 'Free' },

            { name: 'Cliff Walk', type: 'nature', desc: 'Walk along cliff edge. Shops below.', tip: 'Sunset walk.', budget: 'Free' },

            { name: 'Kappil Beach', type: 'beach', desc: 'Where lake meets sea.', tip: '2km from Varkala.', budget: 'Free' },

            { name: 'Anchuthengu Fort', type: 'heritage', desc: '17th century British fort.', tip: '15km away.', budget: 'Free' },

            { name: 'Ayurvedic Centers', type: 'cultural', desc: 'Authentic Kerala Ayurveda.', tip: 'Book treatments.', budget: '₹1000+' }

        ],

        food: ['Fresh fish curry', 'Kerala meals banana leaf', 'Thali at Café del Mar', 'Smoothie bowls', 'Israeli food', 'Chai on cliff'],

        hotels: [{ name: 'Taj Green Cove Resort', budget: 'Luxury ₹10K+', rating: '4.7' }, { name: 'Cliff Abode', budget: 'Premium ₹3K+', rating: '4.4' }, { name: 'Beach huts', budget: 'Budget ₹800-2000', rating: '3.9' }, { name: 'Zostel Varkala', budget: 'Budget ₹400-1000', rating: '4.0' }],

        transport: ['Walking', 'Auto-rickshaw', 'Scooter rental', 'Bus', 'Train from Trivandrum 1h'],

        tips: ['Less crowded than Goa', 'Ayurveda treatments are authentic', 'South cliff is quieter', 'Sunset from cliff is magical']
        ,
        packing: {'climate':'Hot humid (22-35C), monsoon Jun-Sep','dress':'Beachwear, light cotton','shoes':'Sandals, flip-flops, water shoes','medicine':'Sunscreen SPF50, mosquito repellent, ORS','comfort':'Beach mat, waterproof bag, hat','snacks':'Fresh fish, coconut water, banana chips'},

    },

    rameshwaram: {

        name: 'Rameshwaram', state: 'Tamil Nadu', bestTime: 'October to April',

        tagline: 'Island Temple — one of Char Dham and bridge to Lanka',

        places: [

            { name: 'Ramanathaswamy Temple', type: 'spiritual', desc: 'Char Dham. Longest corridor in world.', tip: 'Holy dip in 22 theerthams.', budget: 'Free' },

            { name: 'Pamban Bridge', type: 'landmark', desc: 'Bridge connecting island to mainland.', tip: 'Train crossing is thrilling.', budget: 'Free' },

            { name: 'Dhanushkodi', type: 'landmark', desc: 'Ghost town. Land\'s end of India.', tip: 'Remains of 1964 cyclone.', budget: '₹50 jeep' },

            { name: 'Kothandaramaswamy Temple', type: 'spiritual', desc: 'Temple on Dhanushkodi shore.', tip: 'Historical Ramayana site.', budget: 'Free' },

            { name: 'APJ Abdul Kalam Memorial', type: 'museum', desc: 'Former president\'s memorial.', tip: 'Inspiring museum.', budget: 'Free' },

            { name: 'Villoondi Theertham', type: 'spiritual', desc: 'Underwater spring. Well in sea.', tip: 'Unique natural phenomenon.', budget: 'Free' },

            { name: 'Gandhamadhana Parvatham', type: 'spiritual', desc: 'Hilltop temple. Ram\'s footprint.', tip: 'City panoramic view.', budget: 'Free' },

            { name: 'Agni Theertham', type: 'spiritual', desc: 'Holy sea bathing spot.', tip: 'Early morning dip.', budget: 'Free' }

        ],

        food: ['South Indian meals', 'Fish curry', 'Rasam rice', 'Idli sambar', 'Paniyaram', 'Seer fish fry'],

        hotels: [{ name: 'Hotel Daiict', budget: 'Premium ₹3K+', rating: '4.2' }, { name: 'Hotel TamilNadu', budget: 'Premium ₹3K+', rating: '4.1' }, { name: 'Hotel Ashoka', budget: 'Budget ₹1K-2K', rating: '3.8' }, { name: 'OYO Hotels', budget: 'Budget ₹800-1500', rating: '3.5' }],

        transport: ['Auto-rickshaw', 'Bicycle', 'Bus', 'Taxi', 'Train from Madurai 3h'],

        tips: ['Holy dip in 22 theerthams is main ritual', 'Pamban Bridge train crossing is thrilling', 'Dhanushkodi ghost town is haunting', 'Combine with Madurai temple visit']
        ,
        packing: {'climate':'Hot (25-37C), humid year-round','dress':'Light cotton, traditional dress for temple','shoes':'Slip-on for temple, walking shoes','medicine':'Sunscreen, ORS, mosquito repellent','comfort':'Water bottle, umbrella','snacks':'Panchamirtham, dry snacks'},

    },





    jaisalmer: {

        name: 'Jaisalmer', state: 'Rajasthan', bestTime: 'October to March',

        tagline: 'Golden City — desert fortress rising from Thar sands',

        places: [

            { name: 'Jaisalmer Fort', type: 'monument', desc: 'Living fort. 1/4 of city lives inside.', tip: 'Explore all day.', budget: '₹50' },

            { name: 'Sam Sand Dunes', type: 'nature', desc: 'Desert dunes. Camel safari.', tip: 'Sunset camel ride.', budget: '₹1000-3000 package' },

            { name: 'Patwon Ki Haveli', type: 'heritage', desc: 'Largest haveli. Intricate carvings.', tip: '5 havelis in complex.', budget: '₹50' },

            { name: 'Gadisar Lake', type: 'nature', desc: 'Artificial lake. Boating.', tip: 'Sunset.', budget: '₹100 boat' },

            { name: 'Bada Bagh', type: 'heritage', desc: 'Royal cenotaphs.', tip: 'Sunrise/sunset.', budget: '₹50' },

            { name: 'Desert National Park', type: 'nature', desc: 'Great Indian Bustard habitat.', tip: 'Jeep safari.', budget: '₹200' },

            { name: 'Kuldhara Ghost Village', type: 'heritage', desc: 'Abandoned haunted village.', tip: 'Spooky evening.', budget: '₹50' },

            { name: 'Vyas Chattri', type: 'heritage', desc: 'Cenotaphs of poets.', tip: 'Architecture.', budget: 'Free' }

        ],

        food: ['Dal Bati', 'Ker Sangri', 'Gatte Ki Sabji', 'Makhaniya Lassi', 'Desert camp dinner', 'Bajra Roti'],

        hotels: [{ name: 'Suryagarh', budget: 'Luxury ₹15K+', rating: '4.8' }, { name: 'Hotel Helsinki House', budget: 'Premium ₹3K+', rating: '4.3' }, { name: '1st Gate Home Fusion', budget: 'Premium ₹3K+', rating: '4.5' }, { name: 'Zostel Jaisalmer', budget: 'Budget ₹400-1200', rating: '4.2' }],

        transport: ['Walking fort area', 'Auto-rickshaw', 'Camel', 'Jeep safari', 'Train from Jodhpur 5h'],

        tips: ['Desert camp overnight is must', 'Fort has shops, cafes inside', 'Buy leather and mirror work', 'Camel safari at sunset is magical']
        ,
        packing: {'climate':'Extreme desert (5-48C)','dress':'Full cotton/linen covering body, scarf for sand','shoes':'Closed sandals/boots, walking shoes','medicine':'Sunscreen SPF50+, ORS, lip balm, eye drops','comfort':'Scarf, sunglasses, water bottle (2L+), hat','snacks':'Dal baati churma, pyaaz kachori'},

    }

};

// Greeting patterns

const greetings = ['hi', 'hello', 'hey', 'namaste', 'namaskar', 'vanakkam', 'good morning', 'good evening', 'good afternoon', 'howdy', 'sup', 'nǐ hǎo'];

const thankPatterns = ['thank', 'thanks', 'dhanyavad', 'shukriya', 'dhonnobad', 'thank you', 'thx'];

const stopWords = ['the', 'a', 'an', 'in', 'at', 'to', 'of', 'for', 'and', 'or', 'is', 'are', 'what', 'where', 'how', 'which', 'about', 'tell', 'me', 'show', 'give', 'some', 'can', 'you', 'please', 'from', 'near', 'my', 'i', 'want', 'need', 'going', 'visit', 'trip', 'travel'];



const topicKeywords = {

    places: ['place', 'spot', 'visit', 'see', 'attraction', 'monument', 'temple', 'fort', 'museum', 'park', 'garden', 'beach', 'ghat', 'landmark', 'church', 'mosque', 'palace', 'sight', 'sightseeing', 'explore', 'tour', 'temple', 'lake', 'falls', 'waterfall'],

    food: ['food', 'eat', 'restaurant', 'cafe', 'dish', 'cuisine', 'snack', 'breakfast', 'lunch', 'dinner', 'street food', 'thali', 'biryani', 'dosa', 'chaat', 'drink', 'coffee', 'tea', 'hungry', 'non-veg', 'veg', 'best food'],

    hotels: ['hotel', 'stay', 'room', 'lodge', 'hostel', 'accommodation', 'resort', 'airbnb', 'where to stay', 'night', 'sleep', 'book'],

    transport: ['transport', 'travel', 'get around', 'bus', 'train', 'metro', 'taxi', 'cab', 'auto', 'rickshaw', 'ride', 'commute', 'fly', 'flight', 'airport', 'how to reach'],

    time: ['when', 'best time', 'season', 'month', 'weather', 'climate', 'temperature', 'summer', 'winter', 'monsoon', 'rain'],

    budget: ['budget', 'cost', 'price', 'expensive', 'cheap', 'money', 'afford', 'splurge', 'save', 'rupee'],

    tips: ['tip', 'advice', 'suggestion', 'recommend', 'hack', 'avoid', 'must', 'should', 'important', 'note', 'careful', 'warning', 'safe', 'danger', 'risk'],

    packing: ['pack', 'packing', 'carry', 'bring', 'essential', 'essentials', 'clothes', 'dress', 'shoes', 'kit', 'bag', 'luggage', 'prepare', 'what to wear', 'what to carry', 'what to bring', 'outfit'],

    climate: ['climate', 'temperature', 'how hot', 'how cold', 'weather now', 'is it cold', 'is it hot', 'rainy', 'sunny', 'snow', 'fog'],

    medicine: ['medicine', 'medical', 'health', 'tablet', 'first aid', 'sick', 'pharmacy', 'doctor'],

    guide: ['guide', 'tell me about', 'tell me', 'overview', 'everything about', 'what to know', 'know about', 'info about', 'information about', 'comprehensive', 'complete guide', 'full guide', 'describe', 'details about', 'about ', 'what is', 'introduce', 'explain', 'help me plan', 'plan my trip', 'trip plan', 'travel guide', 'tour guide', 'explore']

};



function extractCity(query) {

    const lower = query.toLowerCase();

    const ALIASES = {
        'kashmir': 'srinagar', 'ladakh': 'leh', 'himachal': 'shimla',
        'uttarakhand': 'rishikesh', 'kerala': 'alleppey', 'rajasthan': 'jaipur',
        'northeast': 'gangtok', 'jammu': 'srinagar', 'madhya pradesh': 'khajuraho',
        'karnataka': 'bangalore', 'tamil nadu': 'chennai', 'andhra pradesh': 'hderabad',
        'west bengal': 'kolkata', 'maharashtra': 'mumbai', 'gujarat': 'ahmedabad',
        'odisha': 'puri', 'assam': 'kaziranga', 'himachal pradesh': 'shimla',
        'jammu and kashmir': 'srinagar', 'goa beaches': 'goa', 'pink city': 'jaipur',
        'city of joy': 'kolkata', 'city of lakes': 'udaipur', 'sun city': 'jodhpur',
        'holy city': 'varanasi', 'golden city': 'jaisalmer', 'queen of hills': 'darjeeling',
        'silicon valley': 'bangalore', 'gateway of india': 'mumbai',
    };

    for (const [alias, city] of Object.entries(ALIASES)) {
        if (lower.includes(alias)) return city;
    }

    for (const city of Object.keys(CHATBOT_DB)) {

        if (lower.includes(city)) return city;

    }

    const words = lower.split(/[\s,]+/);

    for (const word of words) {

        for (const city of Object.keys(CHATBOT_DB)) {

            if (city.startsWith(word) || word.startsWith(city.substring(0, 4))) return city;

        }

    }

    return null;

}



function detectTopics(query) {

    const lower = query.toLowerCase();

    const found = [];

    for (const [topic, keywords] of Object.entries(topicKeywords)) {

        for (const kw of keywords) {

            if (lower.includes(kw)) { found.push(topic); break; }

        }

    }

    if (found.length === 0) found.push('places');

    return found;

}



function formatPlaces(cityData, limit = 8) {

    let msg = `🗺️ Top places to visit in ${cityData.name}:\n\n`;

    const shown = cityData.places.slice(0, limit);

    const typeEmoji = { monument: '🏛️', landmark: '🏗️', spiritual: '🛕', nature: '🌿', beach: '🏖️', museum: '🏛️', market: '🛍️', park: '🌳', heritage: '🏰', entertainment: '🎢', art: '🎨', cultural: '🎭', nightlife: '🌙', adventure: '🪂' };

    shown.forEach((p, i) => {

        msg += `${typeEmoji[p.type] || '📍'} ${i + 1}. ${p.name}\n   ${p.desc}\n   💡 Tip: ${p.tip}\n   💰 ${p.budget}\n\n`;

    });

    return msg;

}



function formatFood(cityData) {

    let msg = `🍽️ Must-try food in ${cityData.name}:\n\n`;

    cityData.food.forEach((f, i) => { msg += `${i + 1}. ${f}\n`; });

    msg += `\n💡 Ask locals for hidden food gems — they always know best!`;

    return msg;

}



function formatHotels(cityData) {

    let msg = `🏨 Recommended stays in ${cityData.name}:\n\n`;

    cityData.hotels.forEach((h, i) => { msg += `${i + 1}. ${h.name} — ${h.budget} (⭐ ${h.rating})\n`; });

    return msg;

}



function formatTransport(cityData) {

    let msg = `🚗 Getting around ${cityData.name}:\n\n`;

    cityData.transport.forEach((t, i) => { msg += `${i + 1}. ${t}\n`; });

    return msg;

}



function formatTips(cityData) {

    let msg = `💡 Essential tips for ${cityData.name}:\n\n`;

    cityData.tips.forEach((t, i) => { msg += `${i + 1}. ${t}\n`; });

    return msg;

}



function formatPacking(cityData) {

    if (!cityData.packing) return 'No specific packing info available.';

    const p = cityData.packing;

    let msg = '\ud83c\udf92 Essential Packing Guide for ' + cityData.name + ':\n\n';

    msg += '\u2744\ufe0f Climate: ' + p.climate + '\n\n';

    msg += '\ud83d\udc55 Dress: ' + p.dress + '\n\n';

    msg += '\ud83d\udc5f Shoes: ' + p.shoes + '\n\n';

    msg += '\ud83d\udc8a Medicine: ' + p.medicine + '\n\n';

    msg += '\ud83e\uddec Comfort: ' + p.comfort + '\n\n';

    msg += '\ud83c\udf79 Snacks: ' + p.snacks + '\n\n';

    msg += 'Always carry ID copy and emergency contacts printed separately from phone!';

    return msg;

}



function generateChatResponse(query) {

    const lower = query.toLowerCase().trim();

    for (const g of greetings) {

        if (lower === g || lower.startsWith(g)) {

            const user = getCurrentUser();

            const dest = user && user.destination ? user.destination : null;

            let response = `Namaste! 🙏 I'm <b>Bharat Guide</b>, your AI tourist assistant.\n\nI have detailed info about 30+ Indian cities.`;

            if (dest) {

                const destLower = dest.toLowerCase().split(',')[0].trim();

                if (CHATBOT_DB[destLower]) {

                    response += `\n\n📍 Heading to ${CHATBOT_DB[destLower].name}? Here's your complete guide!\n\n`;

                    response += formatComprehensiveGuide(CHATBOT_DB[destLower]);

                }

            }

            response += `\n\nJust type a city name or ask anything!`;

            return response;

        }

    }

    for (const t of thankPatterns) {

        if (lower.includes(t)) return `You're welcome! 😊 Have a wonderful trip! Feel free to ask anything else. Bharat Mata Ki Jai! 🇮🇳`;

    }

    if (lower.includes('all cities') || lower.includes('list all') || lower.includes('which cities') || lower.includes('supported')) {

        let msg = `🌍 I have info about these cities:\n\n`;

        const sorted = Object.values(CHATBOT_DB).sort((a, b) => a.name.localeCompare(b.name));

        sorted.forEach(c => { msg += `📍 ${c.name} — ${c.tagline}\n`; });

        msg += `\nAsk me about any of these!`;

        return msg;

    }

    const city = extractCity(lower);

    const topics = detectTopics(lower);

    if (!city) {

        const user = getCurrentUser();

        if (user && user.destination) {

            const destLower = user.destination.toLowerCase().split(',')[0].trim();

            if (CHATBOT_DB[destLower]) {

                const cityData = CHATBOT_DB[destLower];

                let response = `📍 About ${cityData.name} (your destination):\n\n`;

                if (topics.includes('places')) response += formatPlaces(cityData, 5) + '\n';

                if (topics.includes('food')) response += formatFood(cityData) + '\n';

                if (topics.includes('hotels')) response += formatHotels(cityData) + '\n';

                if (topics.includes('transport')) response += formatTransport(cityData) + '\n';

                if (topics.includes('time')) response += `📅 Best time: ${cityData.bestTime}\n\n`;

                if (topics.includes('budget')) response += formatHotels(cityData) + '\n' + formatTips(cityData);

                if (topics.includes('tips')) response += formatTips(cityData);
                if (topics.includes('packing')) response += formatPacking(cityData) + '\n';
                if (topics.includes('guide')) response += formatComprehensiveGuide(cityData) + '\n';

                if (!response) response = formatComprehensiveGuide(cityData);

                return response.trim();

            }

        }

        const cityList = Object.keys(CHATBOT_DB).map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(', ');

        return `🤔 I'm not sure which city you mean. I have info about:\n\n${cityList}\n\nTry: "Places to visit in Kolkata" or "Best food in Delhi"`;

    }

    const cityData = CHATBOT_DB[city];

    let response = '';

    if (topics.includes('places')) response += formatPlaces(cityData) + '\n';

    if (topics.includes('food')) response += formatFood(cityData) + '\n';

    if (topics.includes('hotels')) response += formatHotels(cityData) + '\n';

    if (topics.includes('transport')) response += formatTransport(cityData) + '\n';

    if (topics.includes('time')) response += `📅 Best time to visit ${cityData.name}: ${cityData.bestTime}\n\n`;

    if (topics.includes('budget')) { response += `💰 Budget tips for ${cityData.name}:\n\n` + formatHotels(cityData) + '\n' + formatTips(cityData); }

    if (topics.includes('tips')) response += formatTips(cityData) + '\n';

    if (topics.includes('packing')) response += formatPacking(cityData) + '\n';
    if (topics.includes('guide')) response += formatComprehensiveGuide(cityData) + '\n';

    if (topics.includes('climate')) response += '\u2744\ufe0f Climate in ' + cityData.name + ': ' + (cityData.packing ? cityData.packing.climate : cityData.bestTime) + '\n\nBest time: ' + cityData.bestTime + '\n\n';

    if (topics.includes('medicine')) response += '\ud83d\udc8a Health for ' + cityData.name + ': ' + (cityData.packing ? cityData.packing.medicine : 'Carry basic first-aid.') + '\n\nCall 108 (Ambulance) or 104 (Health)\n';

    if (!response) response = formatComprehensiveGuide(cityData);

    return response.trim();

}




function formatComprehensiveGuide(cityData) {
    var msg = '';
    var typeEmoji = { monument: '\u26f2\ufe0f', landmark: '\ud83c\udfd7\ufe0f', spiritual: '\ud83d\uded5', nature: '\ud83c\udf3f', beach: '\ud83c\udfd6\ufe0f', museum: '\ud83c\udfdb\ufe0f', market: '\ud83d\udecd\ufe0f', park: '\ud83c\udf33', heritage: '\ud83c\udff0', adventure: '\ud83e\ude82', art: '\ud83c\udfa8', cultural: '\ud83c\udfad' };

    msg += '\ud83d\udccd ' + cityData.name + ' \u2014 ' + cityData.tagline + '\n';
    msg += '\ud83d\udccd State/Region: ' + cityData.state + '\n\n';
    msg += '\ud83d\udcc5 Best Time to Visit: ' + cityData.bestTime + '\n\n';

    msg += '\ud83d\uddfa\ufe0f TOP PLACES TO VISIT:\n';
    cityData.places.slice(0, 8).forEach(function(p, i) {
        msg += (typeEmoji[p.type] || '\ud83d\udccd') + ' ' + (i+1) + '. ' + p.name + '\n';
        msg += '   ' + p.desc + '\n';
        msg += '   \ud83d\udca1 Tip: ' + p.tip + '  |  \ud83d\udcb0 ' + p.budget + '\n';
    });
    msg += '\n';

    msg += '\ud83c\udf7d\ufe0f MUST-TRY FOOD:\n';
    cityData.food.forEach(function(f, i) { msg += (i+1) + '. ' + f + '\n'; });
    msg += '\n';

    if (cityData.packing) {
        msg += '\u2744\ufe0f WEATHER & CLIMATE:\n' + cityData.packing.climate + '\n\n';
        msg += '\ud83d\udc55 DRESS CODE:\n' + cityData.packing.dress + '\n\n';
        msg += '\ud83d\udc5f FOOTWEAR:\n' + cityData.packing.shoes + '\n\n';
        msg += '\ud83d\udc8a MEDICINES TO CARRY:\n' + cityData.packing.medicine + '\n\n';
        msg += '\ud83e\uddcc COMFORT TIPS:\n' + cityData.packing.comfort + '\n\n';
        msg += '\ud83c\udf79 SNACKS FOR JOURNEY:\n' + cityData.packing.snacks + '\n\n';
    }

    msg += '\ud83d\ude97 GETTING AROUND:\n';
    cityData.transport.forEach(function(t, i) { msg += (i+1) + '. ' + t + '\n'; });
    msg += '\n';

    msg += '\ud83c\udfe8 WHERE TO STAY:\n';
    cityData.hotels.forEach(function(h, i) { msg += (i+1) + '. ' + h.name + ' \u2014 ' + h.budget + ' (\u2b50 ' + h.rating + ')\n'; });
    msg += '\n';

    msg += '\ud83d\udca1 TRAVEL TIPS:\n';
    cityData.tips.forEach(function(t, i) { msg += (i+1) + '. ' + t + '\n'; });
    msg += '\n';

    msg += '\ud83d\ude4f Always carry ID copy and emergency contacts separately from phone!';
    msg += '\n\ud83d\udcde Emergency: 112 (Police) | 108 (Ambulance) | 1800-111-363 (Tourist Helpline)';
    return msg;
}
// ==================== CHATBOT UI ====================

function populateChatSuggestions() {

    const container = document.getElementById('chatbot-suggestions');

    if (!container) return;



    const allCities = Object.keys(CHATBOT_DB);

    const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;

    const dest = user && user.destination ? user.destination.toLowerCase().split(',')[0].trim() : null;



    let suggestions = [];



    // First: user's destination guide

    if (dest && CHATBOT_DB[dest]) {

        suggestions.push({ text: 'Tell me about ' + CHATBOT_DB[dest].name, label: '\ud83d\udccd Complete guide for ' + CHATBOT_DB[dest].name });

    }



    // Pick 5 diverse cities from different regions

    const regionPicks = ['goa', 'jaipur', 'varanasi', 'munnar', 'kolkata', 'shimla', 'leh', 'srinagar', 'udaipur', 'rishikesh', 'pondicherry', 'gangtok', 'jaisalmer', 'ooty', 'hampi', 'coorg', 'madurai', 'jodhpur', 'manali', 'amritsar'];

    const available = regionPicks.filter(c => allCities.includes(c) && c !== dest);

    // Shuffle and pick 5

    for (let i = available.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [available[i], available[j]] = [available[j], available[i]];

    }

    const pickedCities = available.slice(0, 5);

    pickedCities.forEach(c => {

        suggestions.push({ text: 'Tell me about ' + CHATBOT_DB[c].name, label: '\ud83d\udccd ' + CHATBOT_DB[c].name });

    });



    // Topic-based suggestions for user's destination

    const topicCity = dest && CHATBOT_DB[dest] ? CHATBOT_DB[dest].name : pickedCities[0] ? CHATBOT_DB[pickedCities[0]].name : 'Delhi';

    suggestions.push({ text: 'Best food in ' + topicCity, label: '\ud83c\udf7d\ufe0f Food in ' + topicCity });

    suggestions.push({ text: 'Packing for ' + topicCity, label: '\ud83c\udf92 Packing for ' + topicCity });

    suggestions.push({ text: 'How to reach ' + topicCity, label: '\ud83d\ude97 Transport to ' + topicCity });

    suggestions.push({ text: 'List all cities', label: '\ud83c\udf0d All cities' });



    container.innerHTML = suggestions.map(s =>

        '<button onclick="chatQuickAsk(\'' + s.text.replace(/'/g, "\\'") + '\')">' + s.label + '</button>'

    ).join('');

}



function toggleChatbot() {

    const panel = document.getElementById('chatbot-panel');

    const badge = document.getElementById('chatbot-badge');

    panel.classList.toggle('open');

    if (badge) badge.style.display = 'none';

    populateChatSuggestions();

}



function chatQuickAsk(text) {

    document.getElementById('chatbot-input').value = text;

    sendChatMessage();

}



function sendChatMessage() {

    const input = document.getElementById('chatbot-input');

    const msg = input.value.trim();

    if (!msg) return;

    const messages = document.getElementById('chatbot-messages');

    const userDiv = document.createElement('div');

    userDiv.className = 'chat-msg user';

    userDiv.innerHTML = '<div class="chat-avatar"><i class="fas fa-user"></i></div><div class="chat-bubble">' + escapeHtml(msg) + '</div>';

    messages.appendChild(userDiv);

    input.value = '';

    messages.scrollTop = messages.scrollHeight;

    const typingDiv = document.createElement('div');

    typingDiv.className = 'chat-msg bot';

    typingDiv.id = 'chat-typing';

    typingDiv.innerHTML = '<div class="chat-avatar"><i class="fas fa-robot"></i></div><div class="chat-typing"><span></span><span></span><span></span></div>';

    messages.appendChild(typingDiv);

    messages.scrollTop = messages.scrollHeight;

    setTimeout(() => {

        typingDiv.remove();

        const response = generateChatResponse(msg);

        const botDiv = document.createElement('div');

        botDiv.className = 'chat-msg bot';

        botDiv.innerHTML = '<div class="chat-avatar"><i class="fas fa-robot"></i></div><div class="chat-bubble">' + response.replace(/\n/g, '<br>') + '</div>';

        messages.appendChild(botDiv);

        messages.scrollTop = messages.scrollHeight;

    }, 600 + Math.random() * 800);

}



function escapeHtml(text) {

    const div = document.createElement('div');

    div.textContent = text;

    return div.innerHTML;

}

// ==================== AUTO-LOGIN CHECK ====================
setTimeout(() => {
    const currentUser = localStorage.getItem('bharatSurakshaCurrentUser');
    if (currentUser) {
        try {
            const user = JSON.parse(currentUser);
            if (user.name) enterApp();
        } catch(e) {}
    }
    // Ensure map is always initialized after login
    setTimeout(() => { try { ensureMapInitialized(); } catch(e) {} }, 1000);
    setTimeout(() => { try { ensureMapInitialized(); } catch(e) {} }, 2500);
}, 500);
