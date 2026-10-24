const safe=f=>{try{f()}catch(e){console.warn(e)}};
const VSLUG={"nab": "naberezhnaya-tomi", "shatr": "dom-s-shatrom", "kraev": "kraevedcheskij-muzej", "bot": "sibirskij-botanicheskij-sad-tgu", "lager": "lagernyj-sad", "roshcha": "universitetskaya-roshcha", "dragon": "dom-s-drakonami", "art": "tomskij-hudozhestvennyj-muzej", "chekhov": "pamyatnik-chehovu", "gorsad": "gorodskoj-sad", "p0": "voskresenskaya-gora", "p1": "novo-sobornaya-ploshchad", "p2": "ploshchad-lenina", "p3": "kamennyj-most", "p5": "pamyatnik-schastyu", "p6": "pamyatnik-tapochkam", "p7": "lyagushka-puteshestvennica", "p8": "mladenec-v-kapuste", "p9": "pamyatnik-kirovu", "p10": "tatarskaya-sloboda", "p11": "ulica-kuznecova", "p12": "dom-iskusstv-usadba-shishkova", "p13": "dom-za-rubl-na-pushkina-24", "p14": "dom-kryachkova", "p15": "gubernskaya-apteka", "p17": "skver-basni-krylova", "p18": "memorial-na-kashtachnoj-gore", "p19": "iverskaya-chasovnya", "p20": "znamenskaya-cerkov", "p21": "petropavlovskij-sobor", "p22": "polskij-kostel", "p23": "lyuteranskaya-cerkov-svyatoj-marii", "p24": "bogorodice-alekseevskij-monastyr", "p25": "belaya-mechet", "p26": "memorialnyj-muzej-sledstvennaya-tyurma-nkvd", "p27": "muzej-slavyanskoj-mifologii", "p28": "muzej-professorskaya-kvartira", "p29": "muzej-derevyannogo-zodchestva", "p30": "tochka-gravitacii", "p31": "zoologicheskij-muzej-tgu", "p32": "tomskij-planetarij", "p33": "detskij-muzej-volshebnaya-strana", "p34": "muzej-istorii-pozharnoj-ohrany", "p35": "anatomicheskij-muzej-sibgmu", "p36": "tomskij-tyuz", "p37": "teatr-kukly-i-aktera-skomoroh", "p38": "teatr-zhivyh-kukol-2-ku", "p39": "tomskaya-filarmoniya", "p40": "teatr-versiya", "p41": "buff-sad", "p42": "igumenskij-sad", "p43": "mihajlovskaya-roshcha", "p44": "kulaginskij-skver", "p45": "teatralnyj-skver", "p46": "berezovaya-roshcha", "p47": "skver-u-rechnogo-vokzala", "p48": "pryatki-park", "p49": "batutnyj-centr-jordan", "p50": "ekstrim-park-vavilon", "p51": "semejnyj-park-aktivizion", "p52": "akvapark-zhasmin", "p53": "ledovyj-dvorec-kristall", "p54": "matrix-vr", "p55": "razvlekatelnyj-centr-fakel", "p56": "kuhterin", "p57": "vechnyj-zov", "p58": "narym", "p59": "stroganina-bar", "p60": "sibirskaya-trapeza", "p61": "reka-827", "p62": "snegiri", "p63": "snegiri-pizza-grill", "p64": "italy", "p65": "gosti", "p66": "baget-omlet", "p67": "gastrobistro-nova", "p68": "make-love-pizza", "p69": "mama-ya-doma", "p70": "peshkom-postoyu", "p71": "hochu-puri", "p72": "istanbul", "p73": "ugolek", "p74": "kafedra", "p75": "erofej-petrovich", "p76": "rebro", "p77": "sibagro-gurme", "p78": "osobnyak", "p79": "gobi", "p80": "poly-bistro", "p81": "radhika", "p82": "panda", "p83": "molchanie-yagnyat", "p84": "zheltok", "p85": "break-me-fast", "p86": "a-my-tut-plyushkami-baluemsya", "p87": "pumpkin", "p88": "torta", "p89": "mindajk-coffee", "p90": "dzhezva-kofe-na-peske", "p91": "rocket-coffee", "p92": "territoriya-kofe", "p93": "bulanzhe", "p94": "starbooks", "p95": "pro-kraft", "p96": "clever-irish-pub", "p97": "harat-s-pub", "p98": "galereya", "p99": "rockhub", "p100": "hall-bar", "p101": "south-spot", "p102": "beerfolio", "p103": "nastroenie", "p104": "nirvana", "p105": "knizhnyj-magazin-petr-makushin", "p106": "bukinisticheskij-magazin-muzej-suzdalskij", "p107": "sibirskij-kedr", "p109": "krasnaya-zvezda", "p110": "abazhur", "p111": "kuhterin-otel", "p112": "magistrat", "p113": "skandinaviya", "p114": "moment", "p115": "gostinica-tomsk", "o725a58da": "cosmo-beer", "o1eec9744": "dark-time", "o3f728c9c": "hookah-lounge-bar", "oc9f906dd": "infotecs-academy", "o87b45c66": "invino", "o69dfd67b": "jaws-spot", "od9708674": "the-burger-lab", "o97132fa6": "alkopolis", "o00428895": "barin", "o1c68661b": "bistro-soyuz", "o6a1b33e9": "brodvej", "o8fe78ead": "globus", "odcfaf027": "dzhon-golt", "o564f88ac": "zavod", "oe1e3a796": "zakusochnaya", "of6bff8a7": "zvezdnyj", "o9f842bf0": "johan-pivohan", "oe6a92beb": "johan-pivohan-pr-kirova-58", "obf574e8f": "kabinet-redkostej", "o65bcda12": "kanarejka", "oe3e73fea": "sibirskij-pab", "odd1db8f3": "sunduk", "oceb6fbd1": "u-kryugera", "o5556ff55": "harats", "ob8a59562": "sherlok-laudzh-bar", "o1252a353": "shizgara", "ob84394a6": "yasen-hmel", "o805a8cd0": "tomskaya-horalnaya-sinagoga", "ob0055c20": "hram-svyatitelya-feodosiya-chernigovskogo", "o42a07cb3": "hram-svyatogo-aleksandra-nevskogo", "o144993d1": "cerkov-proslavleniya", "of717fd20": "aelita", "o34481c80": "biblioteka-im-s-ya-marshaka", "o73e21750": "biblioteka-imeni-pushkina", "o199cd559": "dom-semi", "od3281e54": "kinomaks", "o859e81d4": "kolcevaya", "o8e95d0e5": "kompyuternyj-mir", "o53ef6517": "lada", "obdc456b2": "nauchnaya-biblioteka-tomskogo-gosudarstvennogo-universiteta", "o106a5c09": "nauchno-medicinskaya-biblioteka-sibgmu", "oeda6831c": "nauchno-tehnicheskaya-biblioteka-tpu", "o915b2be4": "severnaya", "o5bb71227": "teatr-dramy", "oa137b754": "teatralnaya-kvartira", "o12e74df0": "tomskaya-oblastnaya-detsko-yunosheskaya-biblioteka", "o539f9d16": "tomskij-oblastnoj-kraevedcheskij-muzej", "o46f5c083": "fregat", "oa60f227a": "centralnaya", "o4e050b2a": "cerkovno-istoricheskij-muzej", "o037b5ed0": "energetik", "o6fcd40e3": "yunost", "o40cc0099": "ferma", "odcc0210d": "baba-roma", "o0c3d0697": "baba-roma-pr-frunze-25", "o13c21262": "baba-roma-ul-gogolya-55", "o85c55b15": "baba-roma-krasnoarmejskaya-ul-106", "oa9337328": "baba-roma-komsomolskij-pr-48", "od96bea43": "baba-roma-pr-lenina-80", "o6a2d7ef0": "baskin-robbins", "ocbedfa7b": "beerloga", "oebff4175": "bonito", "o04fe85f1": "bundogs", "o6f1a7bfa": "burgerlux", "o994bcbd9": "chicko", "oa389c4ed": "chupito", "o478e974b": "coffee-like", "o66a5ed4c": "coffee-like-pr-frunze-92v", "o8764f58b": "coffee-like-krasnoarmejskaya-ul-101", "ocda908f6": "coffee-like-pr-lenina-119a", "o02ddefc0": "coffee-like-ul-79-j-gvardejskoj-divizii-12b", "oe5a75854": "coffee-like-ul-beringa-10", "o01cc6349": "doner-master", "o6a92158f": "d-ner-master", "o52dbd344": "gangsters-sushi", "o1c1632ce": "give-me-two", "o020c9e01": "gussi", "oecf8973f": "harucha", "o4d6bdcbb": "import", "oc0e1d792": "kafedra-pr-lenina-79", "oe069ed50": "kannam-chicken", "oa15abc65": "klaus-cafe", "o9080f46f": "make-love-pizza-komsomolskij-pr-14a", "oc03a1d40": "max-grill", "o1e60b4e0": "maya-pizza", "o1eaeae51": "maya-pizza-irkutskij-trakt-42", "ofd7b20a5": "meat-tap", "oe51c79f1": "medium-please", "oafbf3209": "mr-roll", "ocb03966b": "paradox-coffee", "o1fe8f14a": "paradox-coffee-pr-lenina-37", "o4bcba57b": "paradox-coffee-krasnyj-per-10a", "o24619eb5": "party-pizza", "o135ba899": "pastamama", "o3828e540": "pine-ridge", "o4aa1054a": "pomodoro", "ob228b3cc": "pugscoffee-corp", "o9477f413": "quua", "o261a744c": "rebro-pr-lenina-77a", "o3b0b1866": "rocket-coffee-kievskaya-ul-147", "ob7287d42": "rocket-coffee-kofejnya", "o3f1d78a3": "rocket-coffee-kofejnya-ul-entuziastov-45", "o0663f141": "rostic-s", "oceedf93f": "rostic-s-pr-lenina-51a", "o7c917766": "rostic-s-ul-elizarovyh-13", "o5b1ce51e": "rostic-s-pr-mira-30", "o9270fbab": "rostic-s-ul-beringa-10", "oe946ba7d": "santa-monica", "o56b6aaa7": "sbl", "oea7c57e7": "surf-coffee", "o94d987a5": "sushi-king", "ofdd8c394": "sweet-concept", "o336a6a88": "velvet", "oeed4b90b": "yoki-toki", "o7a6b3567": "yourtime-kofe-vafli", "oca88d1c8": "antonov-dvor", "oa78f4d5b": "antonov-dvor-kievskaya-ul-147", "o49319fa9": "antonov-dvor-ul-dzerzhinskogo-33", "oe93bf3ad": "antonov-dvor-pr-frunze-129", "oe30a645f": "antonov-dvor-sibirskaya-ul-111b", "odc8430be": "antonov-dvor-vokzalnaya-ul-27", "o2d212202": "antonov-dvor-sibirskaya-ul-56", "o761da19a": "antonov-dvor-ul-gerasimenko-1-13", "of0c63e62": "antonov-dvor-ul-ivana-chernyh-117a", "o2e50a6b2": "antrekot", "o79990d40": "antrekot-ul-rozy-lyuksemburg-16", "o19d5ea5e": "assorti", "oe7f37f34": "astoriya", "oe3ba4148": "baj-kazan", "o750f2811": "bambuk", "o517e40be": "barviha", "ofc096047": "bezumno", "ocae07954": "bezumno-krutaya-shaurma", "obcfd5d7d": "bezumno-krutaya-shaurma-pr-frunze-57", "oeffb2332": "bezumno-krutaya-shaurma-pr-frunze-152", "o5dc0a39a": "bezumno-krutaya-shaurma-pr-frunze-224", "o9105017c": "bezumno-krutaya-shaurma-komsomolskij-pr-39-4", "o10d64659": "bezumno-shaurma", "o17c7f5a4": "belka", "o9f805fce": "bereg-2018", "o3805615c": "bon-kafe", "o24e942b9": "buffet", "o9ca7b0a0": "bublik", "o2145a4d0": "bulanzhe-ul-nahimova-2", "o06abea26": "bulanzhe-pr-lenina-133", "o5b75ea63": "bulochnaya", "o2bab97d1": "bulvar", "of6584885": "burger-king", "off37d4f9": "burger-king-asfaltovyj-per-8", "o0502323b": "buuza", "o691f9769": "buhara", "of0f8a4a4": "vegetarianskoe-kafe-radhika", "o15e53fa6": "vizit", "o7094b96d": "vkusno", "obf45977a": "vkusno-ul-lebedeva-57", "o0979f477": "vkusno-i-tochka", "o96b6b118": "vkusnyashki-ot-manyashki", "o51ec68c6": "vostochnaya-kuhnya", "o51330a43": "vostochnaya-kuhnya-ul-nahimova-8-s1", "oe3001ceb": "galereya-vkusa", "od0b17c1d": "gruzinskaya-pekarnya", "ob3af91bc": "gruziya-i-vino", "oc065368a": "dva-batona", "oc277cce6": "delo-v-kreme", "o989e80ae": "dodo-picca", "ofb40d258": "dodo-picca-pr-frunze-77", "oc331ef17": "dodo-picca-pr-lenina-97", "o79105f5e": "dodo-picca-irkutskij-trakt-70", "o3f105668": "dyhanie-voka", "o2145557b": "dyhanie-voka-pr-lenina-54b", "o84c9471b": "elan", "o67638278": "eli-u-eli", "o5355d6df": "esh-sushi", "o3fa8b2b5": "zhar-pechka", "ocfa512af": "zharim-varim", "o220933db": "zharko", "odb22ee53": "zastole", "o9157c1e6": "zdes-vam-ne-tam", "o90e827ef": "zolotaya-dolina", "o653b8ed2": "zolotaya-dolina-ul-mechnikova-10", "o1cc086a7": "italy-ul-belinskogo-28-1", "ob32d3435": "inzhir", "o0c7b911d": "intort", "oac3274b0": "italiano-picca", "oe2d0ccb8": "kak-doma", "o3149d97a": "karat", "o04db0e15": "kafe-bufe", "odfe8142d": "kafe-shef", "o3425ffbb": "kafeterius", "ofbb7177b": "kincugi", "o1b0f66fc": "kolobok-ru-krasnoarmejskaya-ul-151-1", "o4c47b948": "konfetka", "o1f65cdea": "konfetka-ul-lebedeva-12", "od872d6e9": "korica", "o8163e224": "kofan", "o5a042fdd": "kofe-chaj", "o6cba4bc7": "kofevarka", "ocbc5b64b": "lavka-svet-zhu", "o4d988d6c": "magazin-razlivnogo-piva-chehiya-i-kafe-konditerskaya", "oa910929b": "marrakesh", "o8856cc5a": "mashenkiny-pirogi", "o73e66abe": "mayak", "o0e2d93be": "me-ga-sushi", "oddfe7e08": "miks", "o3203387c": "milana-banketnyj-zal", "o48d71112": "minutka", "o8561b218": "mir", "o589ac5aa": "mir-sushi", "o39edd24c": "muslima", "oc0fdbd65": "myasoroob", "oe1f717a3": "narodnoe-sobranie", "o7478f253": "nasha-kuhnya", "ob38c4292": "nasha-pekarnya", "o0770aae9": "nasha-pekarnya-ul-mayakovskogo-9", "o0ff3b3f5": "nyam-nyam", "o7f59fdaa": "osh", "oba03f3e6": "panda-pr-lenina-60", "o1f942e90": "panda-semejnyj-restoran", "o79611e98": "papa-dzhons", "o606e0b3a": "pekarnya-n71-larec", "o58cc1b25": "pekarnya-korochka", "o0e1ad699": "pekarnya-piroga", "o054d98eb": "pekarnya-hlebberi", "o8f93ac85": "pekarskij-dvorik", "oc7e986a5": "peki-lola", "ob2d644a1": "perchini", "o4c8f56db": "petrushka", "o139b0682": "pechemsya-o-kazhdom", "o8ff6a66a": "piroga", "o77389dee": "pirozhkovaya", "oa1556ea4": "piter", "o8a46087f": "picca-ru", "ob26429ba": "picce-rio", "o2add7953": "picce-rio-krasnoarmejskaya-ul-31", "o70791b89": "praline", "obf075c11": "pro-kofe", "o01147f05": "pryanosti-i-radosti", "o495cf09c": "phiphi", "ob58c34ac": "rada-i-k", "o5cf5c6da": "retro", "o124c5dc6": "rostovskaya-shaurma", "ocd59d87c": "rubin", "o5990d867": "rublevka", "o79d55552": "sasha-varit", "o530eb1c7": "sdoba", "o196dbdfe": "sdoba-ul-usova-44a", "of4e8ede6": "sdoba-komsomolskij-pr-58a", "ode77c285": "sdoba-kievskaya-ul-109-10", "o790eb6e8": "sdoba-pr-frunze-100a", "oe283d46b": "semejnoe-kafe", "o712b4509": "ser-kurush", "od20b1e55": "sibirskie-bliny", "oeb26734a": "sibirskie-bliny-pr-lenina-41", "oe0b79d19": "sibirskie-bliny-ul-nahimova-15a-2", "o4eae6038": "sibirskie-bliny-pr-lenina-1", "od1081292": "sibirskie-bliny-pr-lenina-36", "ob81d303b": "sibirskie-bliny-kievskaya-ul-13", "o0bccf515": "sibirskie-bliny-ul-shevchenko-23a", "ofbcd39a7": "sibirskie-bliny-pl-lenina-8a-str4", "o50232a97": "sibir", "ob4447674": "sibir-imbir", "o963ecb0d": "sladkarnica", "occe7e693": "sladkoezhka", "o77b018a2": "slon", "o4aba3b07": "snegiri-pizza-grill-pr-lenina-1v", "o19db0ee1": "soft-loft", "o4a7f9d98": "sochno-moshchno", "o034dfd26": "soyuz", "oc9289653": "staryj-cherdak", "o33268ebf": "stolovaya", "oe2d12b7f": "stolovaya-ul-fedora-lytkina-3b", "of763d65a": "stolovaya-shkolnyj-per-6", "ob8af3acf": "stolovaya-berdskaya-ul-20", "ob152179a": "stolovaya-12-30", "o15e507c8": "stolovaya-ni-tgu", "oe23e88aa": "stolovaya-sssr", "oec9f9477": "stolovaya-tgpu", "oe71a3cbe": "stolovaya-tgu", "o87872d01": "strana-gulliveriya", "o68703341": "sup-kultura", "o763a5f89": "sushi-sell", "o8d860169": "sushi-darom", "o7fa27397": "sushi-dzhet", "o8e86a6d5": "sushi-dzhet-ul-suvorova-1a", "ob300c122": "sushi-kot", "o3a261d24": "sushi-more", "od4fb88e0": "sushi-ume", "o59810e86": "sushi-kit", "o4b684235": "schastest", "o24591948": "syr-bor", "o138018fc": "sensej", "obf48f762": "tajga", "o5c99bf66": "tamnushki", "oc8efbddd": "tantuni", "oc6b622f5": "tvoya-bulochnaya", "o4afddd70": "tvoya-bulochnaya-ul-elizarovyh-46-1", "oab41c826": "territoriya-kofe-ul-usova-9b", "o75a939f3": "testo", "o172c0c0a": "testo-pr-kirova-5-s8", "o9b9fc280": "timyan", "o2bf9123a": "tomichka", "od15a513f": "tomichka-ul-kulagina-6b", "o119b4999": "tomichka-pr-frunze-119-5-s8", "o9b591959": "torta-ul-mariny-cvetaevoj-32", "o20941888": "torta-ul-gogolya-55", "o4b5bed30": "torta-pr-kirova-5st13", "o496022d4": "torta-2", "o9308ccd5": "torta-ul-pushkina-61-1", "o4ebaae12": "ubojnaya-fobojnaya", "o9cb6f47d": "ubojnaya-fobojnaya-ul-gagarina-4-str-1", "oc5ceca70": "ukromnoe-mestechko", "odb373b8e": "usadba-razgulyaj", "o6b5544b2": "fajz", "o20af49d0": "ferganskaya-kuhnya", "o43f17b30": "fishka", "of6fc1094": "fresh-roll", "o1e3d291b": "hardi-gardi", "o61c22484": "hachapuri-mariko", "o5f9fd484": "hinkali-gali", "o90b0b6c7": "hinkali-tun", "o4b13c194": "hlebosol", "o1a4b270a": "hlebushko", "o8b00af19": "chajnaya-obitel", "oeb472b1a": "charodej", "o3a9d5ef5": "cheburek-mi", "o108d747d": "cheburekmi", "oa30e477a": "chestnaya-kuhnya", "o61b4ffe6": "chokolatte", "o011e2cf6": "chernyj-bob", "o4388c342": "shale", "oef7ffeb9": "shampur", "o81d7ac5a": "shauroom", "o28c42a29": "shaurma-gril", "ofbd6e5fa": "shaurma-gril-akademicheskij-pr-9", "o2ae873b1": "shashlyk", "o62dcafe8": "shashlykoff", "oc7ecb0cf": "shashlykoff-krasnoarmejskaya-ul-101a", "o44a7f5da": "shashlychnaya", "o2d6ace54": "shashlychnyj-dom", "o26f49ce0": "shejk", "ob2cb3754": "shelkovyj-put", "ob6b6137f": "edem", "o4785cba6": "elit-roll", "o0c061ce5": "eskimos", "o2de800b7": "eskimos-pr-lenina-55-1", "o0ba2a6c0": "eskimos-ul-olega-koshevogo-73", "ob3ee69fb": "eskimos-pr-frunze-222", "o2e3652a9": "yuzhane", "o32419334": "yuzhane-ul-karla-marksa-23a", "ob2463965": "yuzhnoe", "o8b70484e": "yablochnaya-stolovaya", "ob4ed6964": "elka", "oe347f097": "elka-pr-lenina-8a-str3", "oe1e00c98": "iquest", "o5656ed5e": "akademiya-tanca", "o976a8d06": "altaj", "o4b961c68": "banya-9", "o75fe696f": "banya-6", "oca008d6a": "barrakuda", "oa99eb335": "burevestnik", "o4f9a9b4c": "delfin", "od186625c": "drajv", "oab8d798b": "ibica", "oa3c4a7cf": "imperial", "oafa9c7e7": "kameliya", "oe91226d9": "kasatka", "oa9752a86": "neptun", "oed8d6bb2": "ozdorovitelnyj-centr-na-plehanova", "ob94e0008": "podpole", "o633a0809": "prestizh", "o79b33639": "sajgon", "o8f35085d": "sovet", "o74a10ee4": "uyut", "oc10c2b78": "fitosauna-relaks", "odeaa467d": "shangri-la", "ocea75003": "big-city", "o5ccf0b43": "infokus", "o204df0db": "tommy-giftshop", "o608a0383": "bum", "o10be91f9": "gum", "o9a4db488": "detskij-park", "oefbc5368": "kosmos", "o89e16197": "krasnyj-ekspress", "o086d6a42": "leto", "oc67c8727": "mantram", "oe43e9ec9": "megapolis", "o385e4302": "miramiks", "o5154ac21": "na-vokzalnoj", "o69b3c514": "ooo-umnica", "o2ba50f20": "podarki-suveniry", "of8bb3542": "pochtalon", "o7a8f2a1b": "sadko", "ob4937b6f": "suvenirnyj-dvorik", "o1b1857a8": "suveniry", "od3989553": "tajnaya-komnata", "odac74537": "tommi", "o8e1acec0": "tomskie-tovary", "od40388f9": "uchebnik", "o571e6ffe": "uchebniki", "o924fbbf7": "cum", "o872cd4fc": "chitaj-gorod", "oaf22bcca": "chitaj-gorod-pr-lenina-104", "o4f6f23c4": "chitaj-gorod-komsomolskij-pr-13b", "o94ac125c": "etnosibir", "o0825cef6": "vodonapornaya-bashnya", "o8dd828ea": "first-apart-hotel", "ofd01743a": "los-i-les", "oc1aa8e3c": "oldtown", "o50e178ab": "avrora", "o7e799371": "ajsavan", "o0a110380": "akademiya", "oe641e7d8": "anikinskaya-zaimka", "o7b61503a": "artplaza", "obf3738d0": "asti-rums", "ob8523312": "atmosfera", "o2b4748d3": "afinskij-kvartal", "o06dc4941": "afrika", "oe66f2da3": "bajk-post-mc-sovdep-tomsk", "o82183fe5": "baston", "oc688ccc4": "baston-ul-gercena-21a", "o9b4ef9de": "belveder", "oa237490b": "bon-apart", "o35fb7a5e": "velkom", "o1b0fd26e": "galereya-bolshaya-podgornaya-ul-2a", "oca3ff6f1": "garantiya", "o7379548e": "gogol", "ocf1486eb": "gorodskoj-dom", "ob1079389": "gostevoj-dom-anikinskaya-zaimka", "oa3fdc036": "grant-i-ko", "oa218e38a": "dom-na-ushajke", "o29be0740": "dom-ohotnika", "o492efd67": "drezden", "ocfb8e0c2": "zander", "oade342e1": "zarechnaya", "o00972bc4": "idilliya", "o76802119": "kak-doma-i-tochka", "od5b7b6ee": "kalejdoskop", "o9d21bcec": "kerch", "o3c49c67b": "klassik", "o134ac793": "kovcheg", "ofde16d64": "kupecheskij-dom", "o0a5a1a57": "lider", "o5038c845": "mandarin", "o92b9e689": "marmarita", "oc19ccdb4": "mirvej", "ob96e9b31": "monomah", "o70b0ad2d": "moroshka", "od6f15fa8": "oazis", "oe3a277c5": "oktyabrskaya", "o7ae76264": "pazl", "ofa015427": "parad-park", "o6afd6933": "paradiz", "o907575b6": "prostornyj", "o90b8a8e1": "randevu", "oc390885e": "sedmoe-nebo", "o266aeb87": "sogdiana", "o7bde6fa8": "sport-otel", "o1f87df86": "toyan", "oa9b8caa0": "universitetskaya", "od8b9840a": "uchebnaya", "o33422fe8": "favorit", "o6eddc5d0": "horoshie-lyudi", "o9cbf645d": "hostel-kak-doma", "oac4a086a": "centralnyj", "o132907f0": "chehov", "o72acba70": "elegant", "o850ba919": "yuniversiti-hostel"};
const ROOT=document.documentElement.dataset.root||'',PAGE=document.documentElement.dataset.page||'home';
const url=u=>/^(https?:|data:|\/)/.test(u)?u:ROOT+u;

const I = {
  food:'<path d="M4 9h12v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z"/><path d="M16 11h2a2 2 0 0 1 0 4h-2"/><path d="M8 3v3M12 3v3"/>',
  culture:'<path d="M3 4h9v6a4.5 4.5 0 0 1-9 0z"/><path d="M12 9h9v6a4.5 4.5 0 0 1-9 0"/><path d="M6 7.5h.01M9 7.5h.01M15 12.5h.01M18 12.5h.01M6 11q1.5 1 3 0M15 16q1.5-1 3 0"/>',
  nature:'<path d="M12 3l5 7h-3l4 6H6l4-6H7z"/><path d="M12 16v5"/>',
  fun:'<rect x="2" y="7" width="20" height="11" rx="5"/><path d="M7 11v3M5.5 12.5h3M15 12h.01M18 13.5h.01"/>',
  kids:'<circle cx="12" cy="12" r="9"/><path d="M8 14a5 5 0 0 0 8 0M9 9.5h.01M15 9.5h.01"/>',
  sport:'<circle cx="6" cy="16" r="3.5"/><circle cx="18" cy="16" r="3.5"/><path d="M6 16l4-7h5l3 7M10 9l3 7M9 6h3"/>',
  shop:'<path d="M5 8h14l-1 12H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
  unusual:'<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
  heart:'<path d="M12 20s-7-4.4-9-8.6C1.6 8.4 3.6 5 7 5c2 0 3.3 1.1 5 3 1.7-1.9 3-3 5-3 3.4 0 5.4 3.4 4 6.4C19 15.6 12 20 12 20z"/>',
  pin:'<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  x:'<path d="M6 6l12 12M18 6L6 18"/>', up:'<path d="M6 15l6-6 6 6"/>', down:'<path d="M6 9l6 6 6-6"/>',
  ext:'<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>'
};
const ico = (k,cls='ico') => `<svg class="${cls}" viewBox="0 0 24 24">${I[k]}</svg>`;

const CATS = [
  {id:'food',name:'Еда и напитки'},{id:'culture',name:'Культура'},{id:'nature',name:'Природа и прогулки'},{id:'fun',name:'Развлечения'},
  {id:'kids',name:'Для детей'},{id:'sport',name:'Спорт и активный отдых'},{id:'shop',name:'Покупки'},{id:'unusual',name:'Необычные места'}
];
const CATCOLOR = {food:'#DB7F33',culture:'#7A4FA0',nature:'#2E8A5C',fun:'#D2456A',kids:'#E0A51E',sport:'#2C7DB8',shop:'#8A4B2A',unusual:'#1D5A42'};

const VENUES0={"v":1,"items":[]};
let PLACES=[],ALLV=[],CATALOG=[];
CATS.push({id:'other',name:'Организации и услуги'});
const MCAT={other:'other',food:'food',bar:'food',culture:'culture',church:'culture',nature:'nature',fun:'fun',shop:'shop',sight:'unusual',stay:'unusual'};
const VMINS={food:75,bar:90,culture:90,church:20,nature:60,sight:20,fun:120,shop:30,stay:30};
const VMOOD={date:'Свидание',rain:'Под крышей',kids:'С детьми',wood:'Деревянный Томск',night:'Вечер',free:'Бесплатно'};
function sceneOf(v){const k=((v.kind||'')+' '+v.name).toLowerCase();switch(v.cat){
  case'food':return/коф|кондит|пекар|десерт|морож/.test(k)?'coffee':'cafe';case'bar':return/концерт|клуб/.test(k)?'concert':'cafe';
  case'culture':return/театр|концерт|филармон|кино/.test(k)?(/кино/.test(k)?'cinema':'concert'):/галер/.test(k)?'gallery':'museum';
  case'church':return'church';case'nature':return/набереж/.test(k)?'river':'garden';case'fun':return/батут|верёв|верев|скалод|экстрим|фитнес|спорт/.test(k)?'climb':'fair';
  case'shop':return'market';default:return'house'}}
function toPlace(v){const mo=v.moods||[];/* moods нужны подбору */const hasGeo=Number.isFinite(v.lon)&&Number.isFinite(v.lat),gx=hasGeo?(v.lon-84.957)*61646:null,gy=hasGeo?(v.lat-56.4755)*111351:null;
  const tags=v.tags&&v.tags.length?v.tags:[v.kind||'Место'].concat(mo.map(m=>VMOOD[m]).filter(t=>t&&t!==v.kind).slice(0,1));
  const ph=(v.photos||[]).map(f=>[f.src,f.credit||'',f.license||'',f.link||'']);
  // мини-карта: свои координаты у первых мест, остальным — приблизительно
  const mx=v.mx!=null?v.mx:Math.max(30,Math.min(970,611+gx*.0678-gy*.0325)),my=v.my!=null?v.my:Math.max(25,Math.min(415,267+gx*.0315-gy*.0277));
  return{id:v.id,name:v.name,cat:MCAT[v.cat]||'unusual',vcat:v.cat,kind:v.kind||'',tags,scene:v.scene||sceneOf(v),indoor:mo.includes('rain')||['food','bar','culture','shop'].includes(v.cat),
    price:v.price!=null?v.price:(v.origin!=='supplier'&&['nature','sight','church'].includes(v.cat)?0:null),addr:v.addr||'',mins:v.mins||(v.origin==='supplier'?null:VMINS[v.cat]||60),kids:mo.includes('kids'),rom:mo.includes('date'),
    desc:v.desc||'',why:v.why||'',origin:v.origin||'',email:v.email||'',social:v.social||{},payment:v.payment||'',hours:v.hours||'',phone:v.phone||'',web:v.web||'',prices:v.prices||'',checked:v.checked||'',src:v.src||'',cuisine:v.cuisine||'',
    feat:!!v.feat,pick:!!v.pick,moods:mo,ph:ph[0]||null,photos:ph,x:mx,y:my,gx:hasGeo?Math.round(gx):null,gy:hasGeo?Math.round(gy):null}}
function applyVenues(V){ALLV=V.items.filter(v=>!v.hidden).map(toPlace);
  PLACES=ALLV.filter(p=>p.pick).sort((a,b)=>(b.feat?1:0)-(a.feat?1:0));
  CATALOG=ALLV.map(p=>[p.name,p.vcat,p.kind,p.gx,p.gy,p.addr,p.hours,p.phone,p.web,p.cuisine,p.id,p.ph?p.ph[0]:''])}
applyVenues(VENUES0);
const MONTHS=['янв','фев','мар','апр','мая','июн','июл','авг','сен','окт','ноя','дек'];
const EVENTS = [
  {id:'e1',d:14,title:'Лекция «Как читать наличники»',place:'Краеведческий музей',tags:['Лекции','Архитектура'],price:0,scene:'house',time:'19:00',kids:false},
  {id:'e2',d:16,title:'Осенний джаз в филармонии',place:'Томская филармония',tags:['Концерты','Джаз'],price:900,scene:'concert',time:'19:00'},
  {id:'e3',d:17,title:'Маркет локальных брендов',place:'Томская филармония, фойе',tags:['Ярмарки','Покупки'],price:0,scene:'market',time:'12:00',kids:true},
  {id:'e4',d:18,title:'Экскурсия «Томск купеческий»',place:'Старт: пл. Новособорная',tags:['Экскурсии','Прогулки'],price:500,scene:'church',time:'11:00',kids:true},
  {id:'e6',d:24,title:'Выставка «Сибирь. Территория открытий»',place:'Краеведческий музей',tags:['Выставки','История'],price:300,scene:'gallery',time:'10:00–18:00',kids:true},
  {id:'e8',d:31,title:'Квест «Тайны старого Томска»',place:'Старт: Дом с шатром',tags:['Квесты','Необычное'],price:700,scene:'quest',time:'20:00'}
];
const STAMPS = [
  {id:'s1',name:'Дом с шатром',addr:'Красноармейская, 71'},
  {id:'s2',name:'Дом с драконами',addr:'Красноармейская, 68'},
  {id:'s3',name:'Дом с жар-птицами',addr:'ул. Гагарина, 42'},
  {id:'s4',name:'Русско-немецкий дом',addr:'ул. Р. Люксембург, 17'},
  {id:'s5',name:'Татарская слобода',addr:'ул. Татарская и окрестности'}
];
const COLLS = [
  {title:'ТОП-10 мест для прогулок в Томске',sub:'Набережные, рощи, смотровые',scene:'river',f:{cat:'nature'}},
  {title:'Где позавтракать в Томске?',sub:'Кофейни и кафе',scene:'coffee',f:{cat:'food'}},
  {title:'Идеи для выходных с детьми',sub:'Музеи, аттракционы, мастер-классы',scene:'fair',f:{cat:'kids'}},
  {title:'Необычные и секретные места',sub:'Драконы, шатры и ирония',scene:'house',f:{cat:'unusual'}}
];

/* ---------- illustrated scenes (вместо фото) ---------- */
let sid=0;
function sky(id,stops){return `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">${stops.map((c,i)=>`<stop offset="${i/(stops.length-1)}" stop-color="${c}"/>`).join('')}</linearGradient>`}
function windows(x,y,n,gap,w,h,fill,lace){let s='';for(let i=0;i<n;i++){const X=x+i*gap;s+=`<rect x="${X}" y="${y}" width="${w}" height="${h}" fill="${fill}"/>`;if(lace)s+=`<path d="M${X-3} ${y-1}Q${X+w/2} ${y-12} ${X+w+3} ${y-1}" stroke="${lace}" stroke-width="2.5" fill="none"/><rect x="${X-3}" y="${y+h}" width="${w+6}" height="3" fill="${lace}"/>`}return s}
function scene(kind){
  const g='s'+(sid++); let d='',b='';
  switch(kind){
    case 'river': d=sky(g,['#8C7BB8','#E8A3A0','#F7C98E']);
      b=`<rect width="400" height="300" fill="url(#${g})"/><circle cx="270" cy="150" r="34" fill="#FFE6B8" opacity=".9"/>
      <path d="M0 170q50-20 100-6t110-4 100 2 90-6v30H0z" fill="#3E5644"/><rect y="186" width="400" height="114" fill="#6E86A8"/>
      <g stroke="#F7D2A6" stroke-width="3" opacity=".7"><path d="M240 200h60M250 214h40M232 228h76M258 244h24"/></g>
      <path d="M0 230l400 40v30H0z" fill="#B49A85"/><path d="M0 226l400 40" stroke="#3B2B2A" stroke-width="3"/>
      <g fill="#2B2226">${[40,120,200,280,360].map(x=>`<rect x="${x}" y="${170+x/10}" width="4" height="${70-x/12}"/><circle cx="${x+2}" cy="${168+x/10}" r="6" fill="#FFE6B8"/>`).join('')}</g>`;break;
    case 'bank': d=sky(g,['#6E97C9','#C7D8E6','#F0E2C6']);
      b=`<rect width="400" height="300" fill="url(#${g})"/><path d="M0 150q100-14 200-4t200-6v20H0z" fill="#7F9A85"/><rect y="160" width="400" height="60" fill="#8FB0C8"/>
      <path d="M0 300V190q80-30 170-10t140 20 90 0v100z" fill="#4E7A4E"/><path d="M0 300V230q120-20 230 0t170-10v80z" fill="#3A5E3D"/>
      <g fill="#2F4F33"><circle cx="330" cy="190" r="28"/><circle cx="360" cy="170" r="32"/><circle cx="60" cy="200" r="24"/></g><rect x="196" y="140" width="10" height="70" fill="#D9D2C4"/><path d="M190 140h22l-11-18z" fill="#C9A15A"/>`;break;
    case 'house': d=sky(g,['#77A3D1','#B9D3E6','#EDE6D3']);
      b=`<rect width="400" height="300" fill="url(#${g})"/><g fill="#3E6B48"><circle cx="40" cy="190" r="50"/><circle cx="370" cy="180" r="56"/></g>
      <rect x="80" y="140" width="240" height="140" fill="#8A4B2A"/><path d="M68 142h264l-28-34H96z" fill="#2E4E3B"/>
      <rect x="170" y="80" width="60" height="200" fill="#9A5530"/><path d="M162 82h76l-38-70z" fill="#2E4E3B"/><path d="M200 12V0" stroke="#2E4E3B" stroke-width="3"/>
      ${windows(96,180,3,24,14,30,'#F4DDB0','#F3EAD8')}${windows(250,180,3,24,14,30,'#F4DDB0','#F3EAD8')}${windows(186,120,2,18,10,24,'#F4DDB0','#F3EAD8')}
      <rect x="186" y="220" width="28" height="60" fill="#4A2616"/><rect y="276" width="400" height="24" fill="#58764F"/>`;break;
    case 'museum': d=sky(g,['#5D8FC8','#A9C9E6','#E8EEF1']);
      b=`<rect width="400" height="300" fill="url(#${g})"/><rect x="40" y="130" width="320" height="140" fill="#E8DCC6"/><path d="M30 132h340l-30-30H60z" fill="#C9B79A"/>
      <path d="M150 104a50 50 0 0 1 100 0z" fill="#9BB9CC"/><path d="M200 54v50M175 62l15 42M225 62l-15 42" stroke="#E8EEF1" stroke-width="2"/>
      <g fill="#F6EFE2">${[60,100,140,240,280,320].map(x=>`<rect x="${x}" y="140" width="14" height="120"/>`).join('')}</g>
      <rect x="170" y="180" width="60" height="90" fill="#6A7F8F"/><rect y="268" width="400" height="32" fill="#B9B3A6"/>`;break;
    case 'garden': d=sky(g,['#E7C17A','#F2DFA6','#F5EBCB']);
      b=`<rect width="400" height="300" fill="url(#${g})"/><g fill="#C0782E"><circle cx="60" cy="110" r="60"/><circle cx="330" cy="100" r="70"/></g>
      <g fill="#D99A3C"><circle cx="150" cy="130" r="48"/><circle cx="250" cy="120" r="44"/></g><g fill="#7C5A2E"><rect x="56" y="150" width="8" height="100"/><rect x="326" y="150" width="8" height="100"/><rect x="146" y="160" width="6" height="80"/><rect x="246" y="150" width="6" height="90"/></g>
      <rect y="230" width="400" height="70" fill="#8C9A55"/><ellipse cx="200" cy="262" rx="110" ry="20" fill="#7FA9B4"/><path d="M110 262h180" stroke="#E7D7A8" stroke-width="2" opacity=".6"/>`;break;
    case 'cafe': d=sky(g,['#2A160E','#5A2E18','#8F4E25']);
      b=`<rect width="400" height="300" fill="url(#${g})"/>${[70,150,230,310].map((x,i)=>`<path d="M${x} 0v${60+i%2*20}" stroke="#1A0E08" stroke-width="2"/><circle cx="${x}" cy="${70+i%2*20}" r="34" fill="#FFB65C" opacity=".18"/><circle cx="${x}" cy="${70+i%2*20}" r="9" fill="#FFD48A"/>`).join('')}
      <rect x="20" y="40" width="70" height="110" fill="#3D2416" stroke="#6E3E20" stroke-width="4"/><rect x="310" y="40" width="70" height="110" fill="#3D2416" stroke="#6E3E20" stroke-width="4"/>
      <rect y="210" width="400" height="90" fill="#3A2013"/><rect x="60" y="196" width="280" height="14" fill="#B26A33"/><path d="M80 210v60M320 210v60" stroke="#2A160E" stroke-width="8"/>
      <g fill="#F5E6CF"><rect x="120" y="184" width="16" height="12" rx="2"/><rect x="250" y="184" width="16" height="12" rx="2"/></g>`;break;
    case 'coffee': d=sky(g,['#E9D4B6','#D9B48A','#9C6A3E']);
      b=`<rect width="400" height="300" fill="url(#${g})"/><rect x="40" y="30" width="140" height="150" fill="#F6EAD6" stroke="#8A4B2A" stroke-width="8"/><path d="M110 30v150M40 105h140" stroke="#8A4B2A" stroke-width="5"/><path d="M30 34q80-40 160 0" stroke="#8A4B2A" stroke-width="6" fill="none"/>
      <rect y="200" width="400" height="100" fill="#6B3F22"/><ellipse cx="260" cy="210" rx="70" ry="14" fill="#F4EFE8"/><path d="M225 160h70v30a35 25 0 0 1-70 0z" fill="#F4EFE8"/><path d="M295 168h12a10 10 0 0 1 0 20h-10" stroke="#F4EFE8" stroke-width="6" fill="none"/><ellipse cx="260" cy="162" rx="35" ry="6" fill="#5A2E14"/>
      <path d="M250 140q-8-14 4-26M270 140q-8-14 4-26" stroke="#FFF" stroke-width="3" fill="none" opacity=".7"/><path d="M80 214q30-30 70 0z" fill="#D9A15A"/>`;break;
    case 'gallery': d=sky(g,['#EDE4D6','#E2D5C1','#CDBDA4']);
      b=`<rect width="400" height="300" fill="url(#${g})"/><rect y="230" width="400" height="70" fill="#8C6A4A"/>
      <rect x="40" y="60" width="90" height="120" fill="#6E8C7A" stroke="#B88A3E" stroke-width="7"/><rect x="160" y="40" width="100" height="150" fill="#C6795A" stroke="#B88A3E" stroke-width="7"/><rect x="290" y="70" width="80" height="100" fill="#4F6A8F" stroke="#B88A3E" stroke-width="7"/>
      <circle cx="210" cy="100" r="22" fill="#F1D3A8"/><path d="M180 190q30-60 60 0" fill="#7A3E2A"/><path d="M50 160l30-40 20 25 25-30v65H50z" fill="#3F5F4D"/>
      <g fill="#2B2420"><circle cx="110" cy="214" r="10"/><path d="M98 300v-70q12-10 24 0v70z"/></g>`;break;
    case 'fair': d=sky(g,['#7FB2DE','#BFDBEF','#F2E8CF']);
      b=`<rect width="400" height="300" fill="url(#${g})"/><circle cx="260" cy="130" r="90" fill="none" stroke="#D2456A" stroke-width="6"/>${Array.from({length:12},(_,i)=>{const a=i*Math.PI/6;return `<path d="M260 130L${260+90*Math.cos(a)} ${130+90*Math.sin(a)}" stroke="#D2456A" stroke-width="2"/><rect x="${252+90*Math.cos(a)}" y="${126+90*Math.sin(a)}" width="16" height="14" rx="3" fill="${['#E0A51E','#2C7DB8','#2E8A5C'][i%3]}"/>`}).join('')}
      <path d="M260 130l-40 140M260 130l40 140" stroke="#7A2E44" stroke-width="5"/><g fill="#3E6B48"><circle cx="50" cy="220" r="44"/><circle cx="110" cy="240" r="34"/></g><rect y="266" width="400" height="34" fill="#6B8A55"/>`;break;
    case 'climb': d=sky(g,['#2F4E66','#3E6680','#5C86A0']);
      b=`<rect width="400" height="300" fill="url(#${g})"/><path d="M60 300L130 0h200l40 300z" fill="#D9D3C6"/>
      ${[[150,60,'#E0A51E'],[200,100,'#D2456A'],[170,150,'#2E8A5C'],[240,180,'#2C7DB8'],[210,230,'#E0A51E'],[280,120,'#DB7F33'],[260,60,'#2E8A5C'],[300,220,'#D2456A']].map(([x,y,c])=>`<ellipse cx="${x}" cy="${y}" rx="11" ry="8" fill="${c}"/>`).join('')}
      <path d="M232 0v150" stroke="#F4F1EA" stroke-width="2"/><g fill="#1F2E38"><circle cx="232" cy="160" r="9"/><path d="M226 170h12l6 30-8 2-4-18-4 18-8-2z"/></g>`;break;
    case 'market': d=sky(g,['#F2C894','#F6DDB6','#F7EAD6']);
      b=`<rect width="400" height="300" fill="url(#${g})"/><path d="M0 40q50 20 100 0t100 0 100 0 100 0" stroke="#5A3A22" stroke-width="2" fill="none"/>${Array.from({length:9},(_,i)=>`<circle cx="${20+i*45}" cy="${46+(i%2)*6}" r="5" fill="#FFE29A"/>`).join('')}
      ${[20,150,280].map((x,i)=>`<rect x="${x}" y="150" width="100" height="100" fill="#8A4B2A"/>${Array.from({length:5},(_,k)=>`<rect x="${x-6+k*22.4}" y="110" width="22.4" height="40" fill="${k%2?'#F7EAD6':['#1D5A42','#D2456A','#DB7F33'][i]}"/>`).join('')}<path d="M${x-6} 150q11 12 22 0t22 0 22 0 22 0 24 0" fill="${['#1D5A42','#D2456A','#DB7F33'][i]}"/><g fill="#F1DFC2"><circle cx="${x+25}" cy="175" r="10"/><rect x="${x+50}" y="166" width="22" height="18" rx="3"/></g>`).join('')}
      <rect y="250" width="400" height="50" fill="#B79878"/>`;break;
    case 'concert': d=sky(g,['#160C28','#3B1752','#A23675']);
      b=`<rect width="400" height="300" fill="url(#${g})"/><g fill="#F7D3F0" opacity=".22"><path d="M200 60L60 300h60z"/><path d="M200 60l140 240h-60z"/><path d="M200 60l-20 240h40z"/></g>
      <circle cx="200" cy="60" r="16" fill="#FFF3FB"/><circle cx="200" cy="60" r="40" fill="#FFB8E8" opacity=".3"/>
      <g fill="#0D0715">${Array.from({length:14},(_,i)=>`<circle cx="${i*30+10}" cy="${250+(i%3)*8}" r="16"/><rect x="${i*30-6}" y="${258+(i%3)*8}" width="32" height="60" rx="10"/>`).join('')}<path d="M70 240l-10-40M330 236l12-44" stroke="#0D0715" stroke-width="8" stroke-linecap="round"/></g>`;break;
    case 'cinema': d=sky(g,['#0F1424','#1F2A44','#2C3A58']);
      b=`<rect width="400" height="300" fill="url(#${g})"/><rect x="60" y="30" width="280" height="140" fill="#E8E1CF"/><rect x="70" y="40" width="260" height="120" fill="#7D9AB8"/><circle cx="260" cy="80" r="18" fill="#F4D37A"/><path d="M70 160l80-60 50 40 40-30 90 50z" fill="#3D5A4A"/>
      <path d="M20 30v270M380 30v270" stroke="#8C2B32" stroke-width="30"/><g fill="#0A0D17">${Array.from({length:8},(_,i)=>`<circle cx="${40+i*46}" cy="236" r="16"/><rect x="${24+i*46}" y="246" width="32" height="60" rx="10"/>`).join('')}</g>`;break;
    case 'church': d=sky(g,['#7E9BCB','#D0B7C8','#F3D2A6']);
      b=`<rect width="400" height="300" fill="url(#${g})"/><rect x="130" y="120" width="140" height="160" fill="#EFE7DA"/><rect x="180" y="70" width="40" height="60" fill="#EFE7DA"/>
      <path d="M200 20q-24 26-18 50h36q6-24-18-50z" fill="#3E6B48"/><path d="M200 6v14" stroke="#C9A15A" stroke-width="3"/><path d="M150 120q-12 16-8 28h36q4-12-8-28" fill="#3E6B48"/><path d="M250 120q-12 16-8 28h36q4-12-8-28" fill="#3E6B48"/>
      ${windows(152,170,4,28,12,34,'#7A6A5A')}<rect y="276" width="400" height="24" fill="#7C8A72"/><g fill="#5A6B5C"><circle cx="50" cy="250" r="40"/><circle cx="360" cy="246" r="44"/></g>`;break;
    case 'quest': d=sky(g,['#0E1A2B','#1F3048','#3B4F6B']);
      b=`<rect width="400" height="300" fill="url(#${g})"/><circle cx="320" cy="60" r="26" fill="#F4E8C6"/><circle cx="310" cy="54" r="26" fill="#1A2A40"/>
      <path d="M60 300V170l70-60 70 60v130z" fill="#0A1220"/><path d="M110 120l20-60 20 60" fill="#0A1220"/>${windows(86,190,3,30,14,24,'#F5B95A')}
      <path d="M260 300v-70" stroke="#0A1220" stroke-width="6"/><circle cx="260" cy="224" r="12" fill="#F5B95A"/><circle cx="260" cy="224" r="40" fill="#F5B95A" opacity=".15"/>
      <g fill="#F4E8C6">${[[40,40],[150,30],[220,80],[370,130],[90,90]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="1.6"/>`).join('')}</g>`;break;
  }
  return `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs>${d}</defs>${b}</svg>`;
}

/* ================= ЖИВОЙ ГЕРОЙ: реальное время, погода, сезон, праздники ================= */
const HERO=!document.getElementById('hero2')?{init(){},suggest:{w:'in'}}:(()=>{
  /* Живая «открытка» Томска в стиле наклеек: время суток (по солнцу), настоящая погода, сезон и праздники. */
  const LAT=56.4977,LNG=84.9744,TZ=7;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hexA=c=>[1,3,5].map(i=>parseInt(c.slice(i,i+2),16));
  const toHex=a=>'#'+a.map(v=>Math.round(Math.max(0,Math.min(255,v))).toString(16).padStart(2,'0')).join('');
  const mix=(a,b,t)=>{const A=hexA(a),B=hexA(b);return toHex(A.map((v,i)=>v+(B[i]-v)*t))};
  const R=Math.random,el=id=>document.getElementById(id);
  const INK='#111111';

  function sunMinutes(date){const rad=Math.PI/180,J1970=2440588,J2000=2451545,dayMs=864e5,e=rad*23.4397,J0=.0009;
    const d=date.valueOf()/dayMs-.5+J1970-J2000,lw=rad*-LNG,phi=rad*LAT;
    const n=Math.round(d-J0-lw/(2*Math.PI)),ds=J0+lw/(2*Math.PI)+n;
    const M=rad*(357.5291+.98560028*ds),C=rad*(1.9148*Math.sin(M)+.02*Math.sin(2*M)+.0003*Math.sin(3*M)),L=M+C+rad*102.9372+Math.PI;
    const dec=Math.asin(Math.sin(e)*Math.sin(L));const w=Math.acos((Math.sin(-.833*rad)-Math.sin(phi)*Math.sin(dec))/(Math.cos(phi)*Math.cos(dec)));
    const noon=J2000+ds+.0053*Math.sin(M)-.0069*Math.sin(2*L),set=J2000+J0+(w+lw)/(2*Math.PI)+n+.0053*Math.sin(M)-.0069*Math.sin(2*L),rise=noon-(set-noon);
    const toMin=J=>{const ms=(J+.5-J1970)*dayMs+TZ*3600e3;return((ms/6e4)%1440+1440)%1440};
    return{rise:toMin(rise),set:toMin(set)}}
  const tomskDate=()=>new Date(Date.now()+TZ*3600e3);
  const fmt=m=>String(Math.floor(m/60)%24).padStart(2,'0')+':'+String(Math.floor(m%60)).padStart(2,'0');

  /* плоские цвета неба по фазам дня */
  const PH={
    night:{sky:'#23307A',hz:'#34428F',dark:1,lit:.6,stars:1},
    predawn:{sky:'#4B3F8C',hz:'#C97A9A',dark:.6,lit:.4,stars:.4},
    dawn:{sky:'#FFC9A0',hz:'#FFE3B8',dark:0,lit:.1,stars:0},
    day:{sky:'#9FD8FF',hz:'#D6EEFF',dark:0,lit:0,stars:0},
    golden:{sky:'#FFAE6B',hz:'#FFD59A',dark:0,lit:.25,stars:0},
    evening:{sky:'#FF7F66',hz:'#6E55C2',dark:.45,lit:.75,stars:.3}};
  const lerpPh=(a,b,t)=>({sky:mix(a.sky,b.sky,t),hz:mix(a.hz,b.hz,t),dark:a.dark+(b.dark-a.dark)*t,lit:a.lit+(b.lit-a.lit)*t,stars:a.stars+(b.stars-a.stars)*t});
  const smooth=t=>t*t*(3-2*t);

  const WX={clear:{t:'ясно',k:0},cloudy:{t:'облачно',k:.25},rain:{t:'дождь',k:.55},storm:{t:'гроза',k:.75},snow:{t:'снег',k:.45},fog:{t:'туман',k:.6}};
  const WXDAY={rain:'#8FA3B8',storm:'#5D6A86',snow:'#D6E4EE',fog:'#CDD5DC',cloudy:'#BFD3E2',clear:'#9FD8FF'};
  const WXNIGHT={rain:'#2A3150',storm:'#1C2038',snow:'#3A4680',fog:'#3A4060',cloudy:'#2C3770',clear:'#23307A'};
  function wmo(c){if(c<=1)return'clear';if(c<=3)return'cloudy';if(c<=48)return'fog';if(c>=95)return'storm';if((c>=71&&c<=77)||c===85||c===86)return'snow';return'rain'}

  const HOL={
    ny:{t:'Новый год',d:[12,31],s:'С Новым годом!',pre:'Скоро Новый год!'},
    tat:{t:'Татьянин день',d:[1,25],s:'С Днём студента!'},
    feb23:{t:'23 февраля',d:[2,23],s:'С 23 Февраля!'},
    mar8:{t:'8 Марта',d:[3,8],s:'С 8 Марта!'},
    may9:{t:'9 Мая',d:[5,9],s:'С Днём Победы!'},
    jun12:{t:'День России',d:[6,12],s:'С Днём России!'},
    sep1:{t:'1 сентября',d:[9,1],s:'С Днём знаний!'},
    hw:{t:'Хеллоуин',d:[10,31],s:'Жуткий Хеллоуин!'}};
  function autoHoliday(m,d){
    if((m===12&&d>=20)||(m===1&&d<=10))return'ny';
    if(m===1&&d===25)return'tat';if(m===2&&d===23)return'feb23';if(m===3&&d>=6&&d<=8)return'mar8';
    if(m===5&&d===9)return'may9';if(m===6&&d===12)return'jun12';if(m===9&&d===1)return'sep1';if((m===10&&d>=29)||(m===11&&d===1))return'hw';return null}
  function nextHoliday(now){let best=null;for(const k in HOL){if(k==='ny')continue;const[m,d]=HOL[k].d;let dt=Date.UTC(now.getUTCFullYear(),m-1,d);if(dt<now)dt=Date.UTC(now.getUTCFullYear()+1,m-1,d);
      const days=Math.ceil((dt-now)/864e5);if(!best||days<best.days)best={k,days}}
    const ny=Date.UTC(now.getUTCFullYear(),11,31);const nd=Math.ceil((ny-now)/864e5);if(nd>=0&&nd<best.days)best={k:'ny',days:nd};return best}
  function season(m,d){if(m===12||m<=2||(m===3&&d<25)||(m===11&&d>=10))return'winter';if(m===3||m===4||m===5)return m===5||(m===4&&d>20)?'spring':'thaw';if(m<=8)return'summer';return'autumn'}

  /* ================= СЦЕНА: улица деревянного Томска на фоне города =================
     Слои: 0 — дальний (левый берег Томи), 1 — средний (город на холме), 2 — ближний (деревянная улица).
     Цвет каждого элемента = базовый (data-c или сезонный data-s) → дымка для дальних слоёв → ночь/погода. */
  const VW=1600,VH=640,X0=-400,X1=2000,Y0=-460;
  const sw=w=>`stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
  const f1=n=>Math.round(n*10)/10;
  const P=(d,c,l,w,extra='')=>`<path d="${d}" data-c="${c}" data-l="${l}" ${w?sw(w):''} ${extra}/>`;
  const PS=(d,s,l,w,extra='')=>`<path d="${d}" data-s="${s}" data-l="${l}" ${w?sw(w):''} ${extra}/>`;
  const RC=(x,y,w,h,c,l,sw_,extra='')=>P(`M${f1(x)} ${f1(y)}h${f1(w)}v${f1(h)}h${f1(-w)}Z`,c,l,sw_,extra);
  const TEX=d=>`<path d="${d}" fill="none" stroke="${INK}" stroke-opacity=".3" stroke-width="1.4" stroke-linecap="round"/>`;
  const WINS=[],CAPS=[],DRIFT=[],SMOKE=[],LAMPS=[],GLOWS=[];
  let wid=0;

  // окно с резным наличником (сибирский «кокошник» сверху, полотенце снизу)
  function nal(x,y,w,h,trim,l=2,style=0){
    let s='';const t=trim;
    WINS.push(wid);s+=`<rect class="win" data-w="${wid++}" data-r="${R().toFixed(3)}" x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" ${sw(l===2?2.2:1.6)}/>`;
    s+=`<path d="M${f1(x+w/2)} ${f1(y)}V${f1(y+h)}M${f1(x)} ${f1(y+h*.38)}H${f1(x+w)}" fill="none" ${sw(l===2?1.8:1.2)}/>`;
    if(l<2)return s;
    s+=RC(x-6,y-2,6,h+4,t,l,1.8)+RC(x+w,y-2,6,h+4,t,l,1.8);
    if(style===0){ // кокошник
      s+=P(`M${f1(x-9)} ${f1(y-2)}H${f1(x+w+9)}L${f1(x+w+5)} ${f1(y-9)}Q${f1(x+w/2)} ${f1(y-30)} ${f1(x-5)} ${f1(y-9)}Z`,t,l,1.8);
      s+=`<circle cx="${f1(x+w/2)}" cy="${f1(y-13)}" r="3.2" fill="${INK}"/>`;
      for(let i=0;i<4;i++)s+=`<path d="M${f1(x-4+i*(w+8)/4)} ${f1(y-2)}l${f1((w+8)/8)} 5l${f1((w+8)/8)} -5" fill="none" ${sw(1.4)}/>`;
    }else{ // треугольный фронтон
      s+=P(`M${f1(x-9)} ${f1(y-2)}H${f1(x+w+9)}L${f1(x+w/2)} ${f1(y-20)}Z`,t,l,1.8);
      s+=`<path d="M${f1(x+w/2-6)} ${f1(y-6)}L${f1(x+w/2)} ${f1(y-13)}L${f1(x+w/2+6)} ${f1(y-6)}" fill="none" ${sw(1.4)}/>`;
    }
    s+=P(`M${f1(x-8)} ${f1(y+h)}H${f1(x+w+8)}V${f1(y+h+6)}H${f1(x-8)}Z`,t,l,1.8);
    let teeth='';for(let i=0;i<5;i++){const tx=x-4+i*(w+8)/5;teeth+=`M${f1(tx)} ${f1(y+h+6)}l${f1((w+8)/10)} 7l${f1((w+8)/10)} -7`}
    s+=P(teeth+'Z',t,l,1.4);
    return s}
  // кружевная «подзорная доска» под карнизом
  function lace(x1,x2,y,trim,l=2,r=6){let d=`M${x1} ${y}H${x2}V${y+4}`;for(let x=x2;x>x1;x-=r*2)d+=`A${r} ${r} 0 0 1 ${Math.max(x1,x-r*2)} ${y+4}`;d+='Z';
    let holes='';for(let x=x1+r;x<x2;x+=r*2)holes+=`<circle cx="${x}" cy="${y+5}" r="1.6" fill="${INK}"/>`;return P(d,trim,l,1.6)+holes}
  // штакетник с острыми верхушками
  function fence(x1,x2,y,h,c){let s='';for(let x=x1;x<x2-3;x+=10){s+=P(`M${x} ${y+h}V${y+6}L${x+3.5} ${y}L${x+7} ${y+6}V${y+h}Z`,c,2,1.6)}
    s+=P(`M${x1-2} ${y+12}H${x2+2}v5H${x1-2}Z`,c,2,1.6)+P(`M${x1-2} ${y+h-12}H${x2+2}v5H${x1-2}Z`,c,2,1.6);
    for(let x=x1;x<x2-3;x+=10)CAPS.push(`<path d="M${x-1} ${y+5}L${x+3.5} ${y-2}L${x+8} ${y+5}Z"/>`);return s}
  // фонарь
  function lamp(x,top){LAMPS.push([x,top+8]);GLOWS.push(`<circle class="glow" cx="${x}" cy="${top+8}" r="58" fill="url(#gLamp)"/>`);
    return P(`M${x-2.5} 524V${top+18}h5V524Z`,'#2B2B33',2,1.6)+P(`M${x-9} ${top+18}h18v4h-18Z`,'#2B2B33',2,1.4)+
      `<path class="lampLight" d="M${x-7} ${top+18}L${x-9} ${top+4}h18L${x+7} ${top+18}Z" ${sw(1.8)}/>`+P(`M${x-11} ${top+4}L${x} ${top-6}L${x+11} ${top+4}Z`,'#2B2B33',2,1.6)}
  // берёза: белый ствол с чёрными чёрточками, крона по сезону
  function birch(x,base,h,l=2){let s=P(`M${x-6} ${base}L${x-4} ${base-h}h7L${x+6} ${base}Z`,'#F4F1EA',l,l===2?2:1.4);
    let marks='';for(let y=base-14;y>base-h+10;y-=13+R()*8)marks+=`M${f1(x-5+R()*3)} ${f1(y)}h${f1(4+R()*4)}`;s+=`<path d="${marks}" stroke="${INK}" stroke-width="${l===2?2.6:1.6}" stroke-linecap="round"/>`;
    let br='';[[-1,.55],[1,.62],[-1,.75],[1,.85],[-1,.92]].forEach(([d,k])=>{const y=base-h*k;br+=`M${x} ${f1(y)}q${d*18} -10 ${d*34} -26`});
    s+=`<path class="bare" d="${br}" fill="none" ${sw(l===2?2:1.3)}/>`;
    const cr=[[0,1,34],[-26,.86,26],[26,.84,26],[-18,.66,24],[20,.62,22],[0,.74,30]];
    s+=cr.map(([dx,k,r],i)=>`<circle class="crown" data-s="crown" data-i="${i}" data-l="${l}" cx="${f1(x+dx)}" cy="${f1(base-h*k)}" r="${f1(r*(l===2?1:.6))}" ${sw(l===2?2:1.3)}/>`).join('');
    CAPS.push(`<path d="M${x-30} ${f1(base-h*.75-2)}q${16} -8 ${30} -2M${x+6} ${f1(base-h*.86)}q${14} -8 ${28} -2"/>`);
    return s}
  function pine(x,base,h,l){let s='';for(let i=0;i<3;i++){const y=base-h*(.15+i*.3),w=h*(.42-i*.1);s+=P(`M${f1(x-w)} ${f1(y)}L${x} ${f1(y-h*.42)}L${f1(x+w)} ${f1(y)}Z`,'#2E6B4E',l,l===2?2:1.3)}
    s+=P(`M${x-3} ${base}V${f1(base-h*.15)}h6V${base}Z`,'#5A3A22',l,1.2);return s}
  // дым из трубы
  function chimney(x,y,c){SMOKE.push([x+5,y-4]);return RC(x,y,12,24,c,2,1.8)+RC(x-2,y-4,16,5,c,2,1.6)}
  function curve(fn,x0,x1,step,bottom){let d=`M${x0} ${f1(fn(x0))}`;for(let x=x0+step;x<=x1;x+=step)d+=`L${x} ${f1(fn(x))}`;return d+`V${bottom}H${x0}Z`}

  const farY=x=>338+10*Math.sin(x/140)+6*Math.sin(x/47+1.3)-(x>900?(x-900)*.012:0);
  const midY=x=>402-14*Math.sin(x/260+.4)-(x>700?(x-700)*.02:0);

  function build(){
    const B=[];const add=s=>B.push(s);
    add(`<defs><radialGradient id="gLamp"><stop offset="0" stop-color="#FFD46B" stop-opacity=".75"/><stop offset=".45" stop-color="#FFC24A" stop-opacity=".22"/><stop offset="1" stop-color="#FFC24A" stop-opacity="0"/></radialGradient>
      <radialGradient id="gSun"><stop offset="0" stop-color="#FFF2C2" stop-opacity=".9"/><stop offset="1" stop-color="#FFF2C2" stop-opacity="0"/></radialGradient></defs>`);
    add(`<rect id="sSky" x="${X0}" y="${Y0}" width="${X1-X0}" height="${VH-Y0}"/><path id="sHz" d="M${X0} 236Q0 214 400 230T1200 236T2000 232V640H${X0}Z"/>`);
    // звёзды-искорки
    let st='';for(let i=0;i<110;i++){const x=X0+R()*(X1-X0),y=Y0+30+R()*(240-Y0-30),k=R()*3.2+2.4,a=k*.28;st+=`<path class="st" d="M${f1(x)} ${f1(y-k)}L${f1(x+a)} ${f1(y-a)}L${f1(x+k)} ${f1(y)}L${f1(x+a)} ${f1(y+a)}L${f1(x)} ${f1(y+k)}L${f1(x-a)} ${f1(y+a)}L${f1(x-k)} ${f1(y)}L${f1(x-a)} ${f1(y-a)}Z" fill="#FFFDF5" style="animation-delay:${(R()*3).toFixed(2)}s"/>`}
    add(`<g id="sStars">${st}</g>`);
    add(`<g id="sSun"><circle r="120" fill="url(#gSun)" id="sSunGlow"/><path id="sRays" d="${Array.from({length:12},(_,i)=>{const a=i*Math.PI/6;return `M${f1(Math.cos(a)*60)} ${f1(Math.sin(a)*60)}L${f1(Math.cos(a)*78)} ${f1(Math.sin(a)*78)}`}).join('')}" ${sw(3.2)}/><circle r="48" id="sSunDisc" ${sw(3)}/><path d="M-22 -14q8 -14 26 -16" fill="none" stroke="#FFFDF5" stroke-width="5" stroke-linecap="round" opacity=".7"/></g>`);
    add(`<g id="sMoon"><circle r="36" id="sMoonDisc" ${sw(3)}/><circle cx="-11" cy="-9" r="7" fill="#000" opacity=".08" ${sw(1.6)}/><circle cx="12" cy="10" r="5" fill="#000" opacity=".08" ${sw(1.6)}/><circle cx="10" cy="-14" r="3" fill="#000" opacity=".08"/></g>`);
    let cl='';for(let i=0;i<12;i++)cl+=`<g class="cl" data-i="${i}"><path class="clb" d="M0 0a38 38 0 0 1 66 -26a50 50 0 0 1 92 14a34 34 0 0 1 12 64H6a30 30 0 0 1 -6 -52z" ${sw(3)}/><path d="M28 -10q16 -20 40 -12M100 -18q22 -6 36 10" fill="none" stroke="#FFFDF5" stroke-width="4" stroke-linecap="round" opacity=".55"/></g>`;
    add(`<g id="sClouds">${cl}</g>`);
    // ---- дальний план: левый берег, тайга, мост, Томь
    add(PS(curve(farY,X0,X1,20,430),'farhill',0,1.6,'id="sFar"'));
    let fo='';for(let x=X0-6;x<X1;x+=13+R()*6){const y=farY(x)+4,h=12+R()*14;fo+=`M${f1(x-5)} ${f1(y)}L${f1(x)} ${f1(y-h)}L${f1(x+5)} ${f1(y)}Z`}
    add(PS(fo,'taiga',0,0));
    add(PS('M-400 368Q-100 358 300 366T1100 368T2000 364V430H-400Z','river',1,1.8,'id="sRiver"'));
    let br='M30 368H430';for(let x=40;x<=420;x+=48)br+=`M${x} 368V384`;add(P(`M24 362H436V369H24Z`,'#6B7480',0,1.4)+`<path d="${br}" ${sw(1.4)} fill="none"/>`);
    let sh='';for(let i=0;i<22;i++){const x=X0+40+R()*2300,y=374+R()*18;sh+=`<path class="shim" d="M${f1(x)} ${f1(y)}h${f1(14+R()*30)}" stroke="#FFFDF5" stroke-width="2.4" stroke-linecap="round" style="animation-delay:${(R()*3).toFixed(2)}s"/>`}
    add(`<g id="sShim">${sh}</g>`);
    // ---- средний план: город на холме
    add(PS(curve(midY,X0,X1,20,600),'midhill',1,2,'id="sMid"'));
    // Воскресенская церковь
    {const b=midY(220)+10,c='#F4F0E6',r='#2F5A4E';
      add(RC(110,b-56,58,56,c,1,1.6)+RC(160,b-86,110,86,c,1,1.6)+P(`M156 ${b-86}L215 ${b-108}L274 ${b-86}Z`,r,1,1.6));
      add(RC(198,b-128,34,26,c,1,1.4)+P(`M196 ${b-128}Q215 ${b-160} 234 ${b-128}Z`,r,1,1.4)+`<path d="M215 ${b-160}v-14M209 ${b-168}h12" ${sw(1.6)}/>`);
      add(RC(266,b-150,40,150,c,1,1.6)+RC(272,b-184,28,34,c,1,1.4)+P(`M268 ${b-184}L286 ${b-236}L304 ${b-184}Z`,r,1,1.4)+`<path d="M286 ${b-236}v-14M281 ${b-244}h10" ${sw(1.6)}/>`);
      [[176,b-70],[204,b-70],[232,b-70],[278,b-120],[278,b-60],[124,b-40]].forEach(([x,y])=>add(`<path class="win" data-r="${R().toFixed(3)}" d="M${x} ${y+18}V${y+4}a6 6 0 0 1 12 0V${y+18}Z" ${sw(1.2)}/>`));}
    // колесо обозрения Горсада (вращается)
    {const cx=470,cy=284,r=62,b=midY(470)+12;add(`<path d="M${cx-34} ${b}L${cx} ${cy}L${cx+34} ${b}M${cx-20} ${b}L${cx} ${cy}L${cx+20} ${b}" fill="none" ${sw(2)}/>`);
      let sp='';for(let i=0;i<12;i++){const a=i*Math.PI/6;sp+=`M${cx} ${cy}L${f1(cx+Math.cos(a)*r)} ${f1(cy+Math.sin(a)*r)}`}
      const cab=Array.from({length:12},(_,i)=>{const a=i*Math.PI/6;return `<circle class="cab" data-a="${a.toFixed(4)}" cx="${f1(cx+Math.cos(a)*r)}" cy="${f1(cy+Math.sin(a)*r+8)}" r="7" data-c="${['#FF5A36','#FFD43B','#3B2BD9','#2E8A5C'][i%4]}" data-l="1" ${sw(1.6)}/>`}).join('');
      add(`<g id="sWheel"><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" ${sw(2.4)}/><circle cx="${cx}" cy="${cy}" r="${r-8}" fill="none" ${sw(1.2)}/><path d="${sp}" ${sw(1.4)}/></g><g id="sCabs">${cab}</g><circle cx="${cx}" cy="${cy}" r="6" fill="#FFD43B" ${sw(2)}/>`);}
    // панельки и дома второго плана
    [[548,58,64,'#D9D4C8'],[600,40,92,'#E8E2D4'],[952,52,70,'#D9D4C8'],[996,44,96,'#EDE7DA']].forEach(([x,w,h,c])=>{const b=midY(x)+14;add(RC(x,b-h,w,h,c,1,1.4));let wn='';for(let yy=b-h+8;yy<b-6;yy+=12)for(let xx=x+6;xx<x+w-6;xx+=11)wn+=`<rect class="win" data-r="${R().toFixed(3)}" x="${xx}" y="${yy}" width="6" height="7" ${sw(.8)}/>`;add(wn)});
    // Богоявленский собор
    {const x0=1058,b=midY(1100)+12,c='#F1E2B6',g='#2E7D5B';
      add(RC(x0,b-92,128,92,c,1,1.6)+P(`M${x0-4} ${b-92}L${x0+64} ${b-116}L${x0+132} ${b-92}Z`,c,1,1.6));
      add(RC(x0+46,b-150,36,40,c,1,1.4)+P(`M${x0+42} ${b-150}Q${x0+44} ${b-190} ${x0+64} ${b-200}Q${x0+84} ${b-190} ${x0+86} ${b-150}Z`,g,1,1.6)+`<path d="M${x0+64} ${b-200}v-18M${x0+57} ${b-210}h14" stroke="#E2B44A" stroke-width="3" stroke-linecap="round"/>`);
      [[x0+14,b-104],[x0+114,b-104]].forEach(([x,y])=>add(RC(x-9,y-14,18,16,c,1,1.2)+P(`M${x-11} ${y-14}Q${x-10} ${y-34} ${x} ${y-40}Q${x+10} ${y-34} ${x+11} ${y-14}Z`,g,1,1.4)+`<path d="M${x} ${y-40}v-10" stroke="#E2B44A" stroke-width="2.4" stroke-linecap="round"/>`));
      add(RC(x0+140,b-160,34,160,c,1,1.6)+RC(x0+145,b-196,24,36,c,1,1.4)+P(`M${x0+142} ${b-196}L${x0+157} ${b-246}L${x0+172} ${b-196}Z`,g,1,1.4)+`<path d="M${x0+157} ${b-246}v-12" stroke="#E2B44A" stroke-width="2.4" stroke-linecap="round"/>`);
      for(let i=0;i<4;i++)add(`<path class="win" data-r="${R().toFixed(3)}" d="M${x0+14+i*30} ${b-30}V${b-58}a7 7 0 0 1 14 0V${b-30}Z" ${sw(1.2)}/>`);
      add(`<path d="M${x0+8} ${b-62}V${b-4}M${x0+120} ${b-62}V${b-4}" ${sw(1.2)}/>`);}
    // главный корпус ТГУ
    {const x0=1236,b=midY(1300)+14,c='#F7F3EA';add(RC(x0,b-64,190,64,c,1,1.6)+RC(x0+70,b-82,50,82,c,1,1.6)+P(`M${x0+64} ${b-82}L${x0+95} ${b-104}L${x0+126} ${b-82}Z`,c,1,1.6)+P(`M${x0+84} ${b-104}Q${x0+95} ${b-128} ${x0+106} ${b-104}Z`,'#7FA3A0',1,1.4));
      let col='';for(let i=0;i<4;i++)col+=`M${x0+78+i*11} ${b-74}V${b-6}`;add(`<path d="${col}" ${sw(1.4)}/>`);
      let wn='';for(let r=0;r<2;r++)for(let i=0;i<10;i++){const x=x0+8+i*18+(i>=4?52:0);if(x>x0+182)continue;wn+=`<rect class="win" data-r="${R().toFixed(3)}" x="${x}" y="${b-54+r*24}" width="8" height="13" ${sw(.9)}/>`}add(wn);}
    // Красная мечеть
    {const x0=1440,b=midY(1460)+14,c='#B5432F',g='#2E7D5B';add(RC(x0,b-58,70,58,c,1,1.6)+P(`M${x0-3} ${b-58}h76l-8 -10h-60Z`,c,1,1.4)+P(`M${x0+19} ${b-68}Q${x0+35} ${b-100} ${x0+51} ${b-68}Z`,g,1,1.6));
      add(RC(x0+80,b-150,16,150,c,1,1.4)+P(`M${x0+76} ${b-118}h24v6h-24Z`,'#E9D9B8',1,1.2)+P(`M${x0+78} ${b-150}L${x0+88} ${b-196}L${x0+98} ${b-150}Z`,g,1,1.4)+`<path d="M${x0+88} ${b-196}v-8" stroke="#E2B44A" stroke-width="2.4"/><path d="M${x0+84} ${b-212}a5 5 0 1 0 8 0a4 4 0 1 1 -8 0" fill="#E2B44A"/>`);
      for(let i=0;i<3;i++)add(`<path class="win" data-r="${R().toFixed(3)}" d="M${x0+10+i*20} ${b-12}V${b-36}a5 5 0 0 1 10 0V${b-12}Z" ${sw(1.1)}/>`);}
    // телевышка
    {const x=1566,b=midY(1566)+14;let d=`M${x-12} ${b}L${x-2} ${b-230}h4L${x+12} ${b}`;for(let y=b-20;y>b-220;y-=22)d+=`M${f1(x-12+10*(b-y)/230)} ${y}L${f1(x+12-10*(b-y)/230)} ${y-22}`;
      add(`<path d="${d}" fill="none" stroke="#B5432F" stroke-width="2"/><path d="M${x} ${b-230}v-40" ${sw(1.6)}/><circle id="sTvLight" cx="${x}" cy="${b-272}" r="4" fill="#FF3B30"/>`);}
    // окраины второго плана: панельки и деревянная церковка
    [[-330,56,72,'#E3DDCF'],[-270,44,96,'#D9D4C8'],[1640,60,78,'#E8E2D4'],[1702,46,104,'#D9D4C8'],[1930,56,66,'#E3DDCF']].forEach(([x,w,h,c])=>{const b=midY(x)+14;add(RC(x,b-h,w,h,c,1,1.4));let wn='';for(let yy=b-h+8;yy<b-6;yy+=12)for(let xx=x+6;xx<x+w-6;xx+=11)wn+=`<rect class="win" data-r="${R().toFixed(3)}" x="${xx}" y="${yy}" width="6" height="7" ${sw(.8)}/>`;add(wn)});
    {const x0=1790,b=midY(1820)+14,c='#9A6B45',g='#3E5A7E';add(RC(x0,b-60,90,60,c,1,1.6)+P(`M${x0-4} ${b-60}L${x0+45} ${b-84}L${x0+94} ${b-60}Z`,g,1,1.5)+RC(x0+30,b-120,30,40,c,1,1.4)+P(`M${x0+26} ${b-120}Q${x0+45} ${b-170} ${x0+64} ${b-120}Z`,g,1,1.5)+`<path d="M${x0+45} ${b-160}v-16M${x0+39} ${b-170}h12" stroke="#E2B44A" stroke-width="2.4" stroke-linecap="round"/>`);
      for(let i=0;i<3;i++)add(`<path class="win" data-r="${R().toFixed(3)}" d="M${x0+12+i*26} ${b-10}V${b-34}a6 6 0 0 1 12 0V${b-10}Z" ${sw(1.1)}/>`);}
    // деревья второго плана
    [[-380,28],[-200,30],[-150,24],[-90,32],[-20,26],[1620,26],[1770,30],[1900,24],[1980,30]].forEach(([x,h])=>add(R()<.6?pine(x,midY(x)+16,h*1.6,1):`<path d="M${x} ${f1(midY(x)+16)}V${f1(midY(x)-h*.4)}" ${sw(1.2)}/><circle class="crown" data-s="crown" data-i="${Math.floor(R()*6)}" data-l="1" cx="${x}" cy="${f1(midY(x)-h*.6)}" r="${f1(h*.55)}" ${sw(1.3)}/>`));
    [[60,32],[340,24],[400,30],[530,22],[880,28],[930,22],[1210,26],[1400,30],[1520,24]].forEach(([x,h])=>add(R()<.5?pine(x,midY(x)+16,h*1.6,1):`<path d="M${x} ${f1(midY(x)+16)}V${f1(midY(x)-h*.4)}" ${sw(1.2)}/><circle class="crown" data-s="crown" data-i="${Math.floor(R()*6)}" data-l="1" cx="${x}" cy="${f1(midY(x)-h*.6)}" r="${f1(h*.55)}" ${sw(1.3)}/>`));
    // туман
    add(`<g id="sFog"><path d="M-420 334Q-60 312 300 330T1020 326T2020 322V362Q1600 378 1200 362T400 364T-420 372Z" fill="#FFFDF5" opacity=".55"/><path d="M-420 394Q0 380 400 396T1200 392T2020 390V420Q1600 432 1200 418T400 420T-420 426Z" fill="#FFFDF5" opacity=".45"/></g>`);
    // ---- ближний план: тротуар и дорога
    add(PS('M-400 508C-100 500 300 512 700 506S1300 502 1600 507S1900 510 2000 506V640H-400Z','street',2,2.6,'id="sStreet"'));
    let pl='';for(let x=X0+8;x<X1;x+=16)pl+=`M${x} ${f1(522+Math.sin(x/90)*2)}v14`;add(TEX(pl+'M-400 520C200 514 900 526 2000 518M-400 538C200 532 900 544 2000 536'));
    add(PS('M-400 546C200 540 900 552 2000 545V640H-400Z','road',2,2.6,'id="sRoad"'));
    add(TEX('M-360 570C300 564 900 576 1960 568M-300 596C400 590 1000 602 1920 594M-380 620C350 614 950 626 1980 618'));
    // лужи после дождя
    add(`<g id="sPuddles">${[[260,572,70],[880,580,90],[1330,568,60]].map(([x,y,w])=>`<ellipse cx="${x}" cy="${y}" rx="${w}" ry="7" data-c="#7FA6C9" data-l="2" ${sw(2)}/><path d="M${x-w*.5} ${y-1}h${w*.4}" stroke="#FFFDF5" stroke-width="2" stroke-linecap="round"/>`).join('')}</g>`);
    // типовая изба с наличниками и причелинами
    function izba(x,w,c,t,r,sh){const m=x+w/2,ap=444-w*.31,n=Math.max(2,Math.floor((w-24)/50));
      add(chimney(x+w*.72,ap+16,'#A9503C'));
      add(RC(x,444,w,78,c,2,2.6)+TEX(Array.from({length:6},(_,i)=>`M${x+2} ${456+i*11}H${x+w-2}`).join('')));
      add(P(`M${x} 444L${m} ${f1(ap)}L${x+w} 444Z`,c,2,2.6)+TEX(`M${x+w*.15} 430H${x+w*.85}M${x+w*.3} 414H${x+w*.7}`));
      add(P(`M${x-14} 448L${m} ${f1(ap-14)}L${x+w+14} 448L${x+w+6} 454L${m} ${f1(ap-2)}L${x-6} 454Z`,r,2,2.4)+P(`M${x-8} 446L${m} ${f1(ap-8)}L${x+w+8} 446L${x+w+2} 450L${m} ${f1(ap+2)}L${x-2} 450Z`,t,2,1.6));
      add(`<circle class="win" data-r="${R().toFixed(3)}" cx="${m}" cy="${f1(ap+28)}" r="8" ${sw(2)}/>`);
      const gap=w/n;for(let i=0;i<n;i++){const wx=x+gap*i+gap/2-12;add(nal(wx,462,24,36,t,2,i%2));if(sh)add(RC(wx-16,462,9,38,sh,2,1.6)+RC(wx+31,462,9,38,sh,2,1.6))}
      CAPS.push(`<path d="M${x-16} 448L${m} ${f1(ap-18)}L${x+w+16} 448L${x+w+6} 442L${m} ${f1(ap-8)}L${x-6} 442Z"/>`)}
    izba(-380,176,'#C9675A','#FFFDF5','#2E6B4E');
    add(fence(-196,-130,482,40,'#B88B5E'));
    add(lamp(-112,418));
    add(fence(-96,24,482,40,'#C69A6B'));
    // берёзы по краям
    add(birch(34,524,300));
    // ===== дом A: бирюзовая изба с причелинами
    {const c='#5E9C8A',t='#FFFDF5',r='#C8463A';
      add(chimney(196,372,'#A9503C'));
      add(RC(70,436,170,86,c,2,2.6)+TEX(Array.from({length:7},(_,i)=>`M72 ${448+i*11}H238`).join('')));
      add(P('M70 436L155 384L240 436Z',c,2,2.6)+TEX('M95 422H215M120 407H190M140 395H170'));
      add(P('M56 440L155 370L254 440L246 446L155 382L64 446Z',r,2,2.4));
      add(P('M62 438L155 376L248 438L242 442L155 386L68 442Z',t,2,1.8));
      let dr='';for(let i=1;i<8;i++){const k=i/8;dr+=`M${f1(62+93*k)} ${f1(438-62*k+4)}l3 7l3 -7`;dr+=`M${f1(248-93*k)} ${f1(438-62*k+4)}l3 7l3 -7`}add(`<path d="${dr}" fill="none" ${sw(1.3)}/>`);
      add(`<circle class="win" data-r="${R().toFixed(3)}" cx="155" cy="414" r="9" ${sw(2)}/>`+P('M143 400a12 12 0 0 1 24 0',t,2,1.6,'fill="none"'));
      add(nal(88,456,26,38,t,2,0)+nal(142,456,26,38,t,2,0)+nal(196,456,26,38,t,2,0));
      CAPS.push('<path d="M54 438L155 366L256 438L248 432L155 376L62 432Z"/>');}
    add(fence(250,300,482,40,'#C69A6B'));
    // ===== дом B: «Дом с драконами» — тёмное дерево, два фронтона, драконы на коньках
    {const c='#6B4430',t='#E0A84A',r='#2E3B36';
      add(RC(310,404,240,118,c,2,2.6)+TEX(Array.from({length:10},(_,i)=>`M312 ${414+i*11}H548`).join('')));
      [[310,430],[430,550]].forEach(([a,b2])=>{const m=(a+b2)/2;add(P(`M${a} 404L${m} 334L${b2} 404Z`,c,2,2.6)+TEX(`M${a+24} 392H${b2-24}M${a+44} 376H${b2-44}M${a+62} 360H${b2-62}`));
        add(P(`M${a-12} 408L${m} 324L${b2+12} 408L${b2+4} 414L${m} 336L${a-4} 414Z`,r,2,2.4));
        add(P(`M${a-6} 406L${m} 330L${b2+6} 406L${b2} 410L${m} 340L${a} 410Z`,t,2,1.6));
        // драконы
        add(P(`M${m} 324c-4 -10 2 -20 12 -18c6 1 8 8 4 12c6 0 10 -6 8 -12c8 6 6 18 -4 22c-8 3 -16 2 -20 -4z`,'#2B2B33',2,1.4)+`<circle cx="${m+12}" cy="315" r="1.8" fill="#FFD43B"/>`);
        add(nal(m-14,350,28,40,t,2,1));
        CAPS.push(`<path d="M${a-14} 406L${m} 322L${b2+14} 406L${b2+6} 400L${m} 332L${a-6} 400Z"/>`)});
      [326,382,464,520].forEach(x=>add(nal(x-13,452,26,36,t,2,1)));
      add(lace(310,550,404,t,2,7));}
    add(fence(560,616,482,40,'#B88B5E'));
    add(lamp(588,418));
    // ===== дом C: «Дом с шатром» — кирпичный цоколь, голубой терем, восьмигранная башня с шатром
    {const c='#86BEDB',t='#FFFDF5',k='#B4553C',r='#3E5A7E';
      add(chimney(886,318,'#A9503C'));
      add(P('M640 386L684 340H918L962 386Z',r,2,2.6)+TEX('M700 352H902M672 368H930'+Array.from({length:10},(_,i)=>`M${700+i*24} 342L${f1(690+i*26.5)} 384`).join('')));
      add(P('M780 344L800 306L820 344Z',c,2,2)+P('M774 346L800 300L826 346L820 348L800 312L780 348Z',r,2,1.8)+`<circle cx="800" cy="332" r="6" fill="#FFD43B" ${sw(1.6)}/>`);
      add(RC(650,386,300,86,c,2,2.6)+TEX(Array.from({length:7},(_,i)=>`M652 ${396+i*11}H948`).join('')));
      add(lace(650,950,386,t,2,6));
      add(RC(640,470,322,52,k,2,2.6));let bk='';for(let y=478;y<520;y+=9){const o=((y-478)/9)%2?9:0;for(let x=644+o;x<958;x+=18)bk+=`M${x} ${y}h12`}add(TEX(bk));
      [[676,486],[738,486],[800,486],[862,486]].forEach(([x,y])=>add(`<path class="win" data-r="${R().toFixed(3)}" d="M${x} ${y+22}V${y+8}a9 9 0 0 1 18 0V${y+22}Z" ${sw(2)}/>`));
      add(RC(914,478,30,44,'#5A3A22',2,2.2)+`<circle cx="938" cy="502" r="2" fill="${INK}"/>`+P('M906 478h46l-6 -10h-34Z',r,2,1.8));
      [722,782,842].forEach(x=>add(nal(x,402,28,48,t,2,0)));
      // башня
      add(RC(612,470,88,52,k,2,2.6)+TEX('M616 479h12M640 479h12M664 479h12M686 479h10M622 488h12M646 488h12M670 488h12M616 497h12M640 497h12M664 497h12M686 497h10M622 506h12M646 506h12M670 506h12'));
      add(RC(614,300,84,170,c,2,2.6)+P('M614 300h18v170h-18Z','#6EA8C8',2,0)+`<path d="M632 300V470M680 300V470" ${sw(1.8)}/>`+TEX(Array.from({length:15},(_,i)=>`M616 ${310+i*11}H696`).join('')));
      add(nal(642,396,28,52,t,2,0)+nal(646,326,20,30,t,2,1));
      add(lace(610,702,300,t,2,5));
      add(P('M600 304L656 146L712 304Z',r,2,2.6)+`<path d="M656 146L634 304M656 146L678 304" ${sw(1.6)}/>`+P('M644 262l6 -16l6 16Z','#FFD43B',2,1.6)+P('M662 228l5 -13l5 13Z','#FFD43B',2,1.4));
      add(`<path d="M656 146V108" ${sw(2.4)}/><circle cx="656" cy="118" r="6" fill="#E2B44A" ${sw(1.8)}/><path id="sVane" d="M657 104h16l-4 5 4 5h-16Z" fill="#E2B44A" ${sw(1.6)}/>`);
      CAPS.push('<path d="M636 386L684 336H918L966 386L956 384L914 344H688L646 384Z"/><path d="M600 304L656 142L712 304L700 298L656 162L612 298Z"/><path d="M772 346L800 296L828 346L820 344L800 308L780 344Z"/>');}
    add(fence(986,1024,482,40,'#C69A6B'));
    add(lamp(1004,418));
    // кот на заборе
    add(`<g id="sCat"><path d="M1012 482c-2 -10 0 -18 6 -22l-1 -8 5 5c2 -1 5 -1 7 0l5 -5 -1 8c6 4 6 14 2 22Z" fill="#2B2B33" ${sw(1.6)}/><path d="M1031 480q14 2 10 -12" fill="none" ${sw(3.2)}/><circle class="eye" cx="1020" cy="462" r="1.8" fill="#FFD43B"/><circle class="eye" cx="1028" cy="462" r="1.8" fill="#FFD43B"/></g>`);
    // ===== дом D: жёлтый дом с мезонином и жар-птицей
    {const c='#E8B64A',t='#FFFDF5',r='#2E6B4E';
      add(P('M1018 426L1062 388H1196L1240 426Z',r,2,2.6)+TEX('M1060 400H1198M1040 414H1218'));
      add(RC(1098,356,64,48,c,2,2.4)+P('M1090 358L1130 322L1170 358Z',r,2,2.4)+P('M1102 356L1130 332L1158 356Z',c,2,1.8));
      add(P('M1118 352c4 -10 14 -12 20 -6c-4 0 -6 4 -4 8c4 -6 10 -4 12 0c-6 -2 -10 2 -12 6c-6 2 -14 -2 -16 -8z','#D2453A',2,1.4));
      add(nal(1116,372,28,26,t,2,1));
      add(RC(1030,426,200,96,c,2,2.6)+TEX(Array.from({length:8},(_,i)=>`M1032 ${436+i*11}H1228`).join('')));
      add(lace(1030,1230,426,t,2,6));
      [1046,1094,1142,1190].forEach(x=>add(nal(x,454,26,40,t,2,0)));
      CAPS.push('<path d="M1014 428L1062 384H1196L1244 428L1234 424L1192 392H1066L1024 424Z"/><path d="M1086 360L1130 318L1174 360L1166 356L1130 328L1094 356Z"/>');}
    add(fence(1240,1294,482,40,'#B88B5E'));
    add(lamp(1268,418));
    // ===== дом E: синяя изба со ставнями и лавочкой
    {const c='#6C8FD0',t='#FFFDF5',r='#8A3B2E',sh='#FFD43B';
      add(chimney(1430,388,'#A9503C'));
      add(RC(1302,444,160,78,c,2,2.6)+TEX(Array.from({length:6},(_,i)=>`M1304 ${456+i*11}H1460`).join('')));
      add(P('M1302 444L1382 394L1462 444Z',c,2,2.6)+TEX('M1326 430H1438M1350 414H1414'));
      add(P('M1288 448L1382 380L1476 448L1468 454L1382 392L1296 454Z',r,2,2.4)+P('M1294 446L1382 386L1470 446L1464 450L1382 396L1300 450Z',t,2,1.6));
      add(`<circle class="win" data-r="${R().toFixed(3)}" cx="1382" cy="422" r="8" ${sw(2)}/>`);
      [1322,1370,1418].forEach(x=>{add(nal(x,462,24,36,t,2,0));add(RC(x-18,462,10,38,sh,2,1.6)+RC(x+32,462,10,38,sh,2,1.6)+`<path d="M${x-13} 476l-3 5l3 5l3 -5ZM${x+37} 476l-3 5l3 5l3 -5Z" fill="${INK}"/>`)});
      add(RC(1316,506,70,5,'#8A5A3A',2,1.6)+`<path d="M1322 511v10M1380 511v10" ${sw(2.2)}/>`);
      CAPS.push('<path d="M1284 448L1382 376L1480 448L1470 442L1382 386L1294 442Z"/>');}
    add(fence(1476,1640,482,40,'#C69A6B'));
    add(birch(1560,524,280));
    izba(1650,170,'#9C86C9','#FFFDF5','#3E5A7E','#FFD43B');
    add(lamp(1860,418));
    add(fence(1876,2000,482,40,'#B88B5E'));
    add(birch(1950,524,290));
    // прохожие: зонт в дождь, шапка и санки зимой
    const person=(x,coat,dir,id)=>`<g id="${id}" class="ppl" data-x="${x}"><g transform="translate(${x} 530) scale(${dir} 1)">
      <path d="M-5 -2l-3 -16M5 -2l2 -16" ${sw(3)}/><path d="M-9 -2h6M3 -2h6" ${sw(3)}/>
      <path d="M-10 -16Q-12 -40 0 -42Q12 -40 10 -16Z" data-c="${coat}" data-l="2" ${sw(2)}/>
      <path d="M8 -36q8 6 6 16" fill="none" ${sw(2.6)}/>
      <circle cx="0" cy="-50" r="8" data-c="#F2C9A6" data-l="2" ${sw(2)}/>
      <path class="hat" d="M-9 -52q0 -12 9 -12q9 0 9 12Z" data-c="#FF5A36" data-l="2" ${sw(1.8)}/><circle class="hat" cx="0" cy="-65" r="3" fill="#FFFDF5" ${sw(1.4)}/>
      <path class="scarf" d="M-7 -42h14v5h-14ZM3 -38l3 10h-5Z" data-c="#FFD43B" data-l="2" ${sw(1.4)}/>
      <g class="umb"><path d="M10 -36V-74" ${sw(2)}/><path d="M-16 -70Q10 -96 36 -70Q30 -74 23 -70Q16 -76 10 -70Q4 -76 -3 -70Q-10 -74 -16 -70Z" data-c="#FF5A36" data-l="2" ${sw(2)}/></g>
    </g></g>`;
    add(person(276,'#3B2BD9',1,'pA')+person(1258,'#2E8A5C',-1,'pB'));
    add(`<g id="sSled"><path d="M1196 528h34q6 0 6 -6" fill="none" ${sw(2.2)}/><path d="M1198 522h30v-6h-30Z" data-c="#C8463A" data-l="2" ${sw(1.8)}/><path d="M1230 520L1250 498" ${sw(1.6)}/></g>`);
    // сугробы и снег на крышах
    add(`<g id="sDrifts">${[[-330,520,110],[-60,522,80],[60,520,90],[300,522,60],[600,520,70],[1000,522,60],[1260,520,80],[1500,520,110],[1740,520,100],[1920,522,90]].map(([x,y,w])=>`<path d="M${x-w/2} ${y+4}Q${x-w/4} ${y-14} ${x} ${y-8}Q${x+w/4} ${y-16} ${x+w/2} ${y+4}Z" fill="#FFFDF5" ${sw(2.2)}/>`).join('')}</g>`);
    add(`<g id="sCaps" fill="#FFFDF5" ${sw(2)}>${CAPS.join('')}</g>`);
    // клумбы летом
    let fl='';[[110,524],[180,526],[700,526],[1120,526],[1170,524],[1350,526]].forEach(([x,y])=>{for(let i=0;i<5;i++){const xx=x+i*9;fl+=`<path d="M${xx} ${y}v-10" ${sw(1.4)}/><circle cx="${xx}" cy="${y-12}" r="3.6" data-c="${['#FF5A8A','#FFD43B','#FFFDF5','#FF5A36'][i%4]}" data-l="2" ${sw(1.2)}/>`}});
    add(`<g id="sFlowers">${fl}</g>`);
    // дым
    add(`<g id="sSmoke">${SMOKE.map(([x,y],i)=>[0,1,2,3].map(k=>`<circle class="smk" data-x="${x}" data-y="${y}" data-k="${(i*4+k)/12}" cx="${x}" cy="${y}" r="7" fill="#D5DAE0"/>`).join('')).join('')}</g>`);
    // ночь: свечение фонарей поверх
    add(`<g id="sGlows">${GLOWS.join('')}</g>`);
    // ---- праздники
    let gar='';const tops=[...LAMPS.map(([x,y])=>[x,y-4]),[34,300],[1560,320]].sort((a,b)=>a[0]-b[0]);
    for(let i=0;i<tops.length-1;i++){const[a,ay]=tops[i],[b,by]=tops[i+1];const sag=46;gar+=`<path d="M${a} ${ay}Q${(a+b)/2} ${Math.max(ay,by)+sag} ${b} ${by}" fill="none" ${sw(1.6)}/>`;
      for(let k=1;k<9;k++){const t=k/9,x=(1-t)*(1-t)*a+2*(1-t)*t*(a+b)/2+t*t*b,y=(1-t)*(1-t)*ay+2*(1-t)*t*(Math.max(ay,by)+sag)+t*t*by;gar+=`<circle class="gb" data-p="${k%3}" cx="${f1(x)}" cy="${f1(y+6)}" r="5" fill="${['#FF5A36','#FFD43B','#3B2BD9'][k%3]}" ${sw(1.4)}/>`}}
    const tree=`<g transform="translate(1268 0)">${[0,1,2,3].map(i=>`<path d="M${-52+i*10} ${520-i*30}L0 ${450-i*30}L${52-i*10} ${520-i*30}Z" fill="#2E6B4E" ${sw(2.2)}/>`).join('')}${[[-24,500,'#FF5A36'],[20,492,'#FFD43B'],[-8,466,'#3B2BD9'],[14,440,'#FFC3D0'],[-12,420,'#FFD43B'],[6,396,'#FF5A36']].map(([x,y,c])=>`<circle class="gb" data-p="1" cx="${x}" cy="${y}" r="5.5" fill="${c}" ${sw(1.4)}/>`).join('')}<path d="M0 334l7 14h15l-12 9 5 15-15-9-15 9 5-15-12-9h15z" fill="#FFD43B" ${sw(1.8)}/></g>`;
    add(`<g id="dNy" class="deco">${gar}${tree}</g>`);
    const pumpkin=(x,y,s)=>`<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 -20v-10" ${sw(3)}/><ellipse rx="26" ry="19" fill="#FF8A1F" ${sw(2.4)}/><path d="M-9 -18q-5 18 0 36M9 -18q5 18 0 36" fill="none" ${sw(1.8)}/><path class="pf" d="M-14 -5l6 -7 6 7zM3 -5l6 -7 6 7zM-12 5q12 9 24 0l-5 5-3-3-4 4-3-3-4 3z" fill="#FFD43B" ${sw(1.4)}/></g>`;
    add(`<g id="dHw" class="deco">${pumpkin(900,512,1)}${pumpkin(1212,514,.8)}${pumpkin(330,514,.9)}${pumpkin(130,516,.7)}</g>`);
    const flag=(x,y,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0V-46" ${sw(2.4)}/><g class="fl"><path d="M0 -46h34v8H0z" fill="#FFFFFF" ${sw(1.6)}/><path d="M0 -38h34v8H0z" fill="#1C57A5" ${sw(1.6)}/><path d="M0 -30h34v8H0z" fill="#D52B1E" ${sw(1.6)}/></g></g>`;
    add(`<g id="dFlag" class="deco">${flag(1130,322)}${flag(380,410,.8)}${flag(1382,394,.8)}</g>`);
    let tu='';for(let i=0;i<46;i++){const x=-370+i*52+(i%2)*14;const c=['#FF5A8A','#FFD43B','#FF5A36','#FFC3D0','#FFFDF5'][i%5];tu+=`<path d="M${x} 532v-22" ${sw(1.6)}/><path d="M${x-8} 512q0-15 8-17q8 2 8 17q-8 6-16 0z" fill="${c}" ${sw(1.6)}/>`}
    add(`<g id="dMar" class="deco">${tu}</g>`);
    let ca='';for(let i=0;i<34;i++){const x=-350+i*70;ca+=`<path d="M${x} 532v-22" ${sw(1.6)}/><circle cx="${x}" cy="508" r="7" fill="#D52B1E" ${sw(1.6)}/>`}
    add(`<g id="dMay" class="deco">${ca}</g>`);
    const bal=(x,y)=>[[-26,-40,'#FF5A36'],[0,-58,'#FFD43B'],[24,-42,'#3B2BD9'],[-10,-80,'#C9F2D2'],[16,-86,'#FFC3D0']].map(([dx,dy,c],i)=>`<g class="bl" data-i="${i}"><path d="M${x} ${y}Q${x+dx*.4} ${y+dy*.5} ${x+dx} ${y+dy+20}" fill="none" ${sw(1.3)}/><ellipse class="blb" cx="${x+dx}" cy="${y+dy}" rx="15" ry="19" fill="${c}" ${sw(1.8)}/></g>`).join('');
    add(`<g id="dBal" class="deco">${bal(588,420)}${bal(1268,420)}</g>`);
    return `<svg viewBox="${X0} ${Y0} ${X1-X0} ${VH-Y0}" preserveAspectRatio="xMidYMax slice" aria-hidden="true">${B.join('')}</svg>`}

  /* облака */
  const CL=[];
  function placeClouds(){document.querySelectorAll('#heroArt .cl').forEach((g,i)=>{CL[i]={x:-600+R()*2700,y:-330+R()*420,s:.5+R()*.5,v:5+R()*9}})}

  const S={ov:{time:null,wx:null,hol:null},live:{wx:null,temp:null},cur:null};
  async function fetchWeather(){try{const ctl=new AbortController();setTimeout(()=>ctl.abort(),5000);
      const r=await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LNG}&current=temperature_2m,weather_code&timezone=Asia%2FTomsk`,{signal:ctl.signal});
      const j=await r.json();S.live.wx=wmo(j.current.weather_code);S.live.temp=Math.round(j.current.temperature_2m);apply()}catch(e){/* нет сети — остаёмся без погоды */}}

  function compute(){
    const now=tomskDate();let mo=now.getUTCMonth()+1,day=now.getUTCDate();let mins=now.getUTCHours()*60+now.getUTCMinutes();
    const hol=S.ov.hol===null?autoHoliday(mo,day):(S.ov.hol==='none'?null:S.ov.hol);
    let dateForSun=new Date();
    if(S.ov.hol&&S.ov.hol!=='none'){[mo,day]=HOL[S.ov.hol].d;dateForSun=new Date(Date.UTC(now.getUTCFullYear(),mo-1,day,12))}
    const st=sunMinutes(dateForSun);
    if(S.ov.time)mins={dawn:st.rise+15,day:13*60,eve:st.set+8,night:60}[S.ov.time];
    const K=[[st.rise-100,'night'],[st.rise-35,'predawn'],[st.rise+25,'dawn'],[st.rise+130,'day'],[st.set-130,'day'],[st.set-30,'golden'],[st.set+25,'evening'],[st.set+100,'night']];
    let ph=PH.night,name='night';
    for(let i=0;i<K.length-1;i++){if(mins>=K[i][0]&&mins<K[i+1][0]){const t=smooth((mins-K[i][0])/(K[i+1][0]-K[i][0]));ph=lerpPh(PH[K[i][1]],PH[K[i+1][1]],t);name=t<.5?K[i][1]:K[i+1][1];break}}
    let wx=S.ov.wx||S.live.wx||'clear';const sea=season(mo,day);
    if(sea==='winter'&&wx==='rain')wx='snow';
    const snowFx=wx==='snow'||(hol==='ny'&&wx==='clear');
    return{mins,st,ph,name,wx,hol,sea,mo,day,snowFx}}

  /* сезонные палитры для data-s */
  const SEA={
    farhill:{winter:'#C9D6E2',thaw:'#8FA08A',spring:'#5E9C6A',summer:'#3E8A58',autumn:'#C7783A'},
    taiga:{winter:'#6E8A80',thaw:'#4A6A58',spring:'#2F6B4A',summer:'#2A6446',autumn:'#46694C'},
    river:{winter:'#E3F1FF',thaw:'#9DB9CF',spring:'#5FA8E8',summer:'#5FA8E8',autumn:'#4F8FC8'},
    midhill:{winter:'#EEF3F7',thaw:'#B3BFA6',spring:'#8ED08A',summer:'#6CC07A',autumn:'#CDB45A'},
    street:{winter:'#FFFDF5',thaw:'#B49A78',spring:'#C9A27A',summer:'#D2AE82',autumn:'#C49A6C'},
    road:{winter:'#E4EAF0',thaw:'#857B6E',spring:'#9A9286',summer:'#A39A8C',autumn:'#8F8578'}};
  const CROWN={spring:['#9BE07A','#B5EA8C','#8AD46E','#A6E37F','#C2EE98','#93DA74'],summer:['#3FA66A','#4CB872','#35965E','#45AE6C','#56BE78','#3A9E64'],
    autumn:['#FF8A1F','#FFD43B','#F25C2A','#FFB02E','#E8642A','#FFC93B']};
  const NIGHT='#141B4D',GREY='#8E98A6';
  let NODES=null;

  const GREET={night:'Доброй ночи',predawn:'Доброе утро',dawn:'Доброе утро',day:'Добрый день',golden:'Добрый вечер',evening:'Добрый вечер'};
  function apply(){
    const c=S.cur=compute();const W=WX[c.wx];const dk=c.ph.dark;
    const wxCol=mix(WXDAY[c.wx],WXNIGHT[c.wx],dk);
    let sky=mix(c.ph.sky,wxCol,W.k),hz=mix(c.ph.hz,wxCol,W.k*.8);
    const hwNight=c.hol==='hw'&&dk>.3;if(hwNight){sky=mix(sky,'#3A1F4A',.45);hz=mix(hz,'#6A2F6A',.4)}
    el('sSky').setAttribute('fill',sky);el('hero2').style.backgroundColor=sky;el('hero2').style.setProperty('--h2-sky',sky);el('sHz').setAttribute('fill',hz);
    el('sStars').style.opacity=c.ph.stars*(c.wx==='clear'||c.wx==='snow'?1:.15);
    const snowy=c.sea==='winter'||(c.snowFx&&c.sea!=='summer');
    const sea=snowy?'winter':c.sea;
    const nightTo=hwNight?'#22143A':NIGHT;
    const shade=(base,l)=>{let x=mix(base,GREY,W.k*.22);if(l==0)x=mix(x,hz,.45);else if(l==1)x=mix(x,hz,.14);return mix(x,nightTo,dk*[.7,.6,.5][l])};
    NODES.c.forEach(e=>e.setAttribute('fill',shade(e.dataset.c,+e.dataset.l)));
    NODES.s.forEach(e=>{const k=e.dataset.s,l=+e.dataset.l;
      if(k==='crown'){const pal=CROWN[sea];e.style.display=pal?'':'none';if(pal)e.setAttribute('fill',shade(pal[+e.dataset.i%pal.length],l));return}
      e.setAttribute('fill',shade(SEA[k][sea],l))});
    el('sCaps').style.display=(snowy||c.sea==='thaw')?'':'none';
    el('sCaps').setAttribute('fill',shade('#FFFDF5',2));
    el('sDrifts').style.display=snowy?'':'none';el('sDrifts').querySelectorAll('path').forEach(p=>p.setAttribute('fill',shade('#FFFDF5',2)));
    el('sFlowers').style.display=(c.sea==='summer'||c.sea==='spring')&&!snowy&&!c.hol?'':'none';
    el('sPuddles').style.display=(c.wx==='rain'||c.wx==='storm'||(c.sea==='thaw'&&!snowy))?'':'none';
    el('sShim').style.display=sea==='winter'?'none':'';
    el('sFog').style.opacity={fog:1,rain:.35,storm:.25,cloudy:.1}[c.wx]||(c.name==='dawn'||c.name==='predawn'?.45:0);
    el('sFog').querySelectorAll('path').forEach(p=>p.setAttribute('fill',mix('#FFFDF5',hz,.3+dk*.5)));
    // окна: днём голубые, в сумерках и ночью загораются тёплым
    const litC=c.hol==='hw'?'#FF9A3B':'#FFD46B',offC=mix(mix('#CFE8F7',GREY,W.k*.3),'#2A3366',dk);
    const extra=c.wx==='storm'||c.wx==='rain'||c.wx==='fog'?.15:0;
    NODES.w.forEach(e=>{const lit=+e.dataset.r<c.ph.lit+extra;e.dataset.lit=lit?1:0;e.setAttribute('fill',lit?litC:offC)});
    const lampsOn=dk>.3||extra>0||c.name==='golden';
    document.querySelectorAll('#heroArt .lampLight').forEach(e=>e.setAttribute('fill',lampsOn?'#FFD46B':shade('#F4F1EA',2)));
    el('sGlows').style.opacity=lampsOn?Math.min(1,.35+dk):0;
    el('sTvLight').style.display=dk>.3?'':'none';
    el('sSmoke').style.display=(c.sea!=='summer'||dk>.6)&&c.wx!=='storm'?'':'none';
    el('sSmoke').querySelectorAll('circle').forEach(p=>p.setAttribute('fill',shade('#D5DAE0',2)));
    const wet=c.wx==='rain'||c.wx==='storm',cold=snowy||c.sea==='thaw'||c.sea==='autumn';
    document.querySelectorAll('#heroArt .umb').forEach(e=>e.style.display=wet?'':'none');
    document.querySelectorAll('#heroArt .hat').forEach(e=>e.style.display=cold&&!wet?'':'none');
    document.querySelectorAll('#heroArt .scarf').forEach(e=>e.style.display=cold?'':'none');
    el('sSled').style.display=snowy&&!wet?'':'none';el('pB').style.display=dk>.7&&c.wx!=='snow'?'none':'';
    el('sCat').querySelectorAll('.eye').forEach(e=>e.setAttribute('r',dk>.4?2.6:1.8));
    // солнце и луна по реальному времени (восток справа)
    const dayLen=c.st.set-c.st.rise;const p=(c.mins-c.st.rise)/dayLen;
    const sunVis=p>-.04&&p<1.04,sx=1700-p*1800,sy=330-Math.sin(Math.PI*Math.max(0,Math.min(1,p)))*420;
    el('sSun').setAttribute('transform',`translate(${sx.toFixed(0)} ${sy.toFixed(0)})`);el('sSun').style.opacity=sunVis?(c.wx==='clear'?1:c.wx==='cloudy'?.75:0):0;
    const low=p<.12||p>.85;el('sSunDisc').setAttribute('fill',low?'#FF9A3B':'#FFD43B');el('sSunGlow').style.opacity=low?1:.55;el('sRays').style.display=p>.1&&p<.9?'':'none';
    const q=((c.mins-c.st.set+1440)%1440)/(1440-dayLen);const mx=1700-q*1800,my=320-Math.sin(Math.PI*Math.min(1,q))*400;
    el('sMoon').setAttribute('transform',`translate(${mx.toFixed(0)} ${my.toFixed(0)}) scale(${c.hol==='hw'?1.5:1})`);el('sMoon').style.opacity=sunVis?0:(c.wx==='clear'||c.wx==='snow'?1:c.wx==='cloudy'?.6:0);
    el('sMoonDisc').setAttribute('fill',c.hol==='hw'?'#FF9A3B':'#FFF6D8');
    // облака
    const nCl={clear:2,cloudy:6,rain:8,storm:8,snow:6,fog:4}[c.wx];
    const clC=mix(c.wx==='storm'?'#6B7590':c.wx==='rain'?'#AEB8C6':'#FFFDF5',nightTo,dk*.62);
    document.querySelectorAll('#heroArt .clb').forEach((p,i)=>{p.setAttribute('fill',clC);p.parentNode.style.opacity=i<nCl?1:0});
    // праздники
    const deco={dNy:c.hol==='ny',dHw:c.hol==='hw',dFlag:['feb23','may9','jun12'].includes(c.hol),dMar:c.hol==='mar8',dMay:c.hol==='may9',dBal:c.hol==='sep1'||c.hol==='tat'};
    for(const k in deco)el(k).style.display=deco[k]?'':'none';
    document.querySelectorAll('#heroArt .blb').forEach((e,i)=>e.setAttribute('fill',c.hol==='tat'?['#3B2BD9','#FFFDF5','#B9E4FF'][i%3]:['#FF5A36','#FFD43B','#3B2BD9','#C9F2D2','#FFC3D0'][i%5]));
    // тексты
    const temp=S.live.temp!=null&&!S.ov.wx?(S.live.temp>0?'+':S.live.temp<0?'−':'')+Math.abs(S.live.temp)+'°':null;
    el('hGreet').textContent=GREET[c.name];
    const tEl=el('hTemp');tEl.hidden=!temp;if(temp){tEl.textContent=temp;tEl.dataset.cold=S.live.temp<=0||c.wx==='snow'||c.wx==='rain'?1:0}
    const wxLine={clear:'Ясно',cloudy:'Облачно',rain:'Идёт дождь',storm:'Гроза',snow:'Идёт снег',fog:'Туман'}[c.wx];
    el('hWx').textContent=`${S.live.wx||S.ov.wx?wxLine+' · ':''}восход ${fmt(c.st.rise)}, закат ${fmt(c.st.set)}`;
    let sticker='';
    if(c.hol)sticker=c.hol==='ny'&&c.mo===12&&c.day<31?HOL.ny.pre:HOL[c.hol].s;
    else sticker={storm:'Переждём грозу в кафе?',rain:'Томск красив и под дождём',snow:'Томск в снегу ♡',fog:'Томск в тумане…'}[c.wx]||{night:'Томск не спит ♡',predawn:'Томск просыпается',dawn:'Доброе утро, Томск!',day:'Томск вдохновляет ♡',golden:'Золотой час над Томью',evening:'Хорошего вечера!'}[c.name];
    el('hand').textContent=sticker;
    const real=!S.ov.time&&!S.ov.hol&&!S.ov.wx;
    el('liveTxt').textContent=`${real?'Томск, '+fmt(c.mins):'Предпросмотр'} · ${W.t}${temp?', '+temp:''}`;
    const nh=nextHoliday(tomskDate());
    el('liveSub').textContent=c.hol?`Сегодня: ${HOL[c.hol].t}`:nh&&nh.days<=30?`До праздника «${HOL[nh.k].t}» ${nh.days} ${plural(nh.days,['день','дня','дней'])}`:'';
    const wxp={rain:['Дождь: места под крышей',{w:'in'}],storm:['Гроза: музей или кофейня',{w:'in'}],snow:['Снег: где тепло и вкусно',{w:'in'}],fog:['Туман: уютные места под крышей',{w:'in'}]}[c.wx]
      ||(dk>.5?['Ночью: виды на огни Томи',{cat:'nature'}]:c.name==='golden'?['Золотой час: успейте к закату',{cat:'nature'}]:['Хорошая погода: куда прогуляться',{w:'out'}]);
    HERO.suggest=wxp[1];if(el('wxTxt'))el('wxTxt').textContent=wxp[0];
    el('hero2').classList.toggle('dark',dk>.5);
    FX.set(c,dk);syncPanel();if(reduce)staticFrame()}

  /* частицы: снег, дождь, листья, лепестки, конфетти, птицы, летучие мыши, салют, молния */
  const FX=(()=>{const cv=el('heroFx'),ctx=cv.getContext('2d');let W=0,H=0;const P={rain:[],snow:[],leaf:[],petal:[],conf:[],bats:[],birds:[],fw:[]};let cfg={},flash=0,bolt=null,nextBolt=3,nextFw=1;
    function size(){const r=cv.parentElement.getBoundingClientRect();const dpr=Math.min(devicePixelRatio,2);W=r.width;H=r.height;cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)}
    new ResizeObserver(size).observe(cv.parentElement);size();
    const fill=(a,n,mk)=>{while(a.length<n)a.push(mk(true));a.length=n};
    const pick=a=>a[Math.floor(R()*a.length)];
    const mk={rain:f=>({x:R()*W*1.2,y:f?R()*H:-20,v:700+R()*350,l:14+R()*10}),snow:f=>({x:R()*W,y:f?R()*H:-8,v:20+R()*36,r:2.2+R()*3,ph:R()*6}),
      leaf:f=>({x:R()*W,y:f?R()*H*.8:-12,v:24+R()*22,r:4.5+R()*2.5,ph:R()*6,a:R()*6,c:pick(['#FF8A1F','#FFC93B','#F25C2A'])}),
      petal:f=>({x:R()*W,y:f?R()*H:-10,v:30+R()*30,r:5+R()*3,ph:R()*6,a:R()*6,c:pick(['#FF5A8A','#FFC3D0','#FFFDF5'])}),
      conf:f=>({x:R()*W,y:f?R()*H:-8,v:50+R()*60,r:4+R()*3,ph:R()*6,a:R()*6,c:pick(['#3B2BD9','#FFFDF5','#FFD43B','#FF5A36','#C9F2D2'])}),
      bats:()=>({x:R()*W,y:20+R()*H*.35,v:40+R()*50,ph:R()*6,s:.8+R()*.6}),
      birds:()=>({x:R()*W,y:30+R()*H*.28,v:26+R()*22,ph:R()*6,s:.6+R()*.5})};
    function set(c,dk){const calm=!['rain','storm','snow','fog'].includes(c.wx);
      cfg={rain:c.wx==='rain'?120:c.wx==='storm'?220:0,snow:c.snowFx?(c.wx==='snow'?110:40):0,leaf:c.hol==='sep1'?12:(c.sea==='autumn'&&calm&&dk<.4?6:0),petal:c.hol==='mar8'?30:0,conf:c.hol==='tat'?44:0,
        bats:c.hol==='hw'?6:0,birds:calm&&dk<.3&&c.sea!=='winter'&&!c.hol?4:0,fw:(['ny','may9','jun12','feb23'].includes(c.hol)&&dk>.3),storm:c.wx==='storm',dark:dk};
      for(const k of ['rain','snow','leaf','petal','conf','bats','birds'])fill(P[k],cfg[k],mk[k]);if(!cfg.fw)P.fw.length=0;if(reduce)draw(0,0)}
    function burst(){const x=W*(.15+R()*.7),y=H*(.1+R()*.3),col=pick(['#FFD43B','#FF5A36','#B9E4FF','#FFFDF5','#C9F2D2']);
      for(let i=0;i<50;i++){const a=R()*6.28,s=50+R()*120;P.fw.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:1.2+R()*.7,t:0,c:col})}}
    function draw(dt,t){ctx.clearRect(0,0,W,H);ctx.lineJoin='round';ctx.lineCap='round';
      if(cfg.rain){ctx.strokeStyle=cfg.dark>.4?'rgba(214,238,255,.7)':'rgba(17,17,17,.45)';ctx.lineWidth=2;ctx.beginPath();
        P.rain.forEach((d,i)=>{d.y+=d.v*dt;d.x-=d.v*.2*dt;if(d.y>H||d.x<-20)P.rain[i]=Object.assign(d,mk.rain(false));ctx.moveTo(d.x,d.y);ctx.lineTo(d.x+d.l*.2,d.y-d.l)});ctx.stroke()}
      if(cfg.snow){ctx.fillStyle='#FFFDF5';ctx.strokeStyle='#111111';ctx.lineWidth=1.3;P.snow.forEach((s,i)=>{s.y+=s.v*dt;s.x+=Math.sin(t+s.ph)*12*dt;if(s.y>H)P.snow[i]=mk.snow(false);ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,6.28);ctx.fill();ctx.stroke()})}
      ['leaf','petal','conf'].forEach(k=>P[k].forEach((l,i)=>{l.y+=l.v*dt;l.x+=Math.sin(t*1.2+l.ph)*30*dt-8*dt;l.a+=dt*2;if(l.y>H+10)P[k][i]=mk[k](false);
        ctx.save();ctx.translate(l.x,l.y);ctx.rotate(l.a);ctx.scale(1,Math.abs(Math.cos(l.a*1.3))*.8+.2);ctx.fillStyle=l.c;ctx.strokeStyle='#111111';ctx.lineWidth=1.3;ctx.beginPath();
        const r=l.r;if(k==='conf')ctx.rect(-r/2,-r,r,r*2);else if(k==='leaf'){ctx.moveTo(-r,0);ctx.quadraticCurveTo(0,-r*.9,r,0);ctx.quadraticCurveTo(0,r*.9,-r,0)}else ctx.ellipse(0,0,r,r*.55,0,0,6.28);
        ctx.fill();ctx.stroke();if(k==='leaf'){ctx.beginPath();ctx.moveTo(-r*1.3,0);ctx.lineTo(r*.7,0);ctx.lineWidth=1;ctx.stroke()}ctx.restore()}));
      ctx.strokeStyle='#111111';ctx.lineWidth=2;P.birds.forEach(b=>{b.x+=b.v*dt;b.y+=Math.sin(t*.8+b.ph)*6*dt;if(b.x>W+20){b.x=-20;b.y=30+R()*H*.28}const f=Math.sin(t*7+b.ph)*4*b.s,s=8*b.s;
        ctx.beginPath();ctx.moveTo(b.x-s,b.y-s*.3-f);ctx.quadraticCurveTo(b.x-s*.45,b.y-s*.7-f*.5,b.x,b.y);ctx.quadraticCurveTo(b.x+s*.45,b.y-s*.7-f*.5,b.x+s,b.y-s*.3-f);ctx.stroke()});
      ctx.fillStyle='#111111';P.bats.forEach(b=>{b.x+=b.v*dt;b.y+=Math.sin(t*2+b.ph)*20*dt;if(b.x>W+20)b.x=-20;const f=Math.sin(t*14+b.ph)*7*b.s,s=b.s;
        ctx.beginPath();ctx.moveTo(b.x,b.y);ctx.quadraticCurveTo(b.x-9*s,b.y-7*s-f,b.x-18*s,b.y-f);ctx.quadraticCurveTo(b.x-10*s,b.y+1,b.x,b.y+3*s);ctx.quadraticCurveTo(b.x+10*s,b.y+1,b.x+18*s,b.y-f);ctx.quadraticCurveTo(b.x+9*s,b.y-7*s-f,b.x,b.y);ctx.fill()});
      if(cfg.fw){nextFw-=dt;if(nextFw<=0){burst();nextFw=.9+R()*1.5}
        P.fw=P.fw.filter(p=>{p.t+=dt;if(p.t>p.life)return false;p.vy+=60*dt;p.vx*=.985;p.vy*=.985;p.x+=p.vx*dt;p.y+=p.vy*dt;ctx.globalAlpha=1-p.t/p.life;ctx.fillStyle=p.c;ctx.beginPath();ctx.arc(p.x,p.y,3,0,6.28);ctx.fill();return true});ctx.globalAlpha=1}
      if(cfg.storm){nextBolt-=dt;if(nextBolt<=0){flash=1;nextBolt=4+R()*6;let x=W*(.2+R()*.6),y=0;bolt=[[x,y]];while(y<H*.5){x+=(R()-.5)*44;y+=24+R()*26;bolt.push([x,y])}bolt.t=.22}
        if(bolt&&bolt.t>0){bolt.t-=dt;ctx.strokeStyle='#111111';ctx.lineWidth=9;ctx.beginPath();bolt.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();ctx.strokeStyle='#FFD43B';ctx.lineWidth=5;ctx.stroke()}}
      flash=Math.max(0,flash-dt*3.2);el('heroFlash').style.opacity=flash*.5}
    return{set,draw}})();

  /* анимация сцены: облака, колесо обозрения, дым, блики на Томи, огонёк телевышки, гирлянды */
  let last=performance.now(),WH=null;
  const QC={},Q=sel=>QC[sel]||(QC[sel]=[...document.querySelectorAll(sel)]);
  function animScene(t,dt){
    Q('#heroArt .cl').forEach((g,i)=>{const c=CL[i];if(!c)return;c.x+=c.v*dt*(S.cur&&S.cur.wx==='storm'?3:1);if(c.x>2100)c.x=-600;g.setAttribute('transform',`translate(${c.x.toFixed(1)} ${(c.y+Math.sin(t*.6+i)*3).toFixed(1)}) scale(${c.s})`)});
    const rot=t*.07;el('sWheel').setAttribute('transform',`rotate(${(rot*57.3).toFixed(2)} 470 284)`);
    WH.forEach(([e,a])=>{e.setAttribute('cx',(470+Math.cos(a+rot)*62).toFixed(1));e.setAttribute('cy',(284+Math.sin(a+rot)*62+8).toFixed(1))});
    if(el('sSmoke').style.display!=='none')Q('#sSmoke .smk').forEach(e=>{const ph=(t*.18+ +e.dataset.k*4)%1;
      e.setAttribute('cx',(+e.dataset.x+ph*34+Math.sin(t+ph*6)*3).toFixed(1));e.setAttribute('cy',(+e.dataset.y-ph*80).toFixed(1));e.setAttribute('r',(5+ph*13).toFixed(1));e.style.opacity=(ph<.1?ph*10:1)*(1-ph)*.75});
    Q('#sShim .shim').forEach((e,i)=>e.style.opacity=(.25+.75*Math.abs(Math.sin(t*1.2+i*1.7))).toFixed(2));
    Q('#heroArt .ppl').forEach((g,i)=>g.setAttribute('transform',`translate(0 ${(-Math.abs(Math.sin(t*2.4+i))*1.6).toFixed(1)})`));
    el('sTvLight').style.opacity=Math.sin(t*3)>0?1:.15;
    if(el('dNy').style.display!=='none')Q('#dNy .gb').forEach(b=>b.style.opacity=(Math.floor(t*1.6)+ +b.dataset.p)%3===0?.35:1);
    if(el('dBal').style.display!=='none')Q('#heroArt .bl').forEach((b,i)=>b.setAttribute('transform',`translate(0 ${(Math.sin(t*1.3+i)*5).toFixed(1)})`));
    if(el('dFlag').style.display!=='none')Q('#heroArt .fl').forEach((f,i)=>f.setAttribute('transform',`skewY(${(Math.sin(t*3+i)*5).toFixed(1)})`));
    if(el('dHw').style.display!=='none')Q('#heroArt .pf').forEach((p,i)=>p.style.opacity=.7+.3*Math.sin(t*9+i*2)*Math.sin(t*3.3+i))}
  function staticFrame(){if(!WH)return;animScene(8,0)}
  let visible=true;
  function frame(now){const dt=Math.min(.05,(now-last)/1000);last=now;const t=now/1000;
    if(visible&&!document.hidden){animScene(t,dt);FX.draw(dt,t)}
    requestAnimationFrame(frame)}

  const ROWS=[['time','Время',[[null,'Сейчас'],['dawn','Утро'],['day','День'],['eve','Вечер'],['night','Ночь']]],
    ['wx','Погода',[[null,'Как сейчас'],['clear','Ясно'],['cloudy','Облачно'],['rain','Дождь'],['snow','Снег'],['storm','Гроза'],['fog','Туман']]],
    ['hol','Праздник',[[null,'По календарю'],['none','Без праздника'],...Object.keys(HOL).map(k=>[k,HOL[k].t])]]];
  function syncPanel(){document.querySelectorAll('#livePanel [data-k]').forEach(b=>b.setAttribute('aria-pressed',String(S.ov[b.dataset.k])===String(b.dataset.v==='null'?null:b.dataset.v)))}
  function init(){
    el('heroArt').innerHTML=build();placeClouds();
    const art=el('heroArt');NODES={c:[...art.querySelectorAll('[data-c]')],s:[...art.querySelectorAll('[data-s]')],w:[...art.querySelectorAll('.win')]};
    WH=[...art.querySelectorAll('.cab')].map(e=>[e,+e.dataset.a]);
    if('IntersectionObserver' in window)new IntersectionObserver(es=>{visible=es[0].isIntersecting}).observe(art);
    el('livePanel').querySelector('.lp-rows').innerHTML=ROWS.map(([k,t,opts])=>`<div class="lp-row"><b>${t}</b><div>${opts.map(([v,l])=>`<button data-k="${k}" data-v="${v}">${l}</button>`).join('')}</div></div>`).join('');
    el('livePanel').addEventListener('click',e=>{const b=e.target.closest('[data-k]');if(!b)return;S.ov[b.dataset.k]=b.dataset.v==='null'?null:b.dataset.v;apply()});
    el('livePill').addEventListener('click',()=>{const p=el('livePanel');p.hidden=!p.hidden;el('livePill').setAttribute('aria-expanded',!p.hidden)});
    el('liveClose').addEventListener('click',()=>{el('livePanel').hidden=true;el('livePill').setAttribute('aria-expanded',false)});
    el('liveReset').addEventListener('click',()=>{S.ov={time:null,wx:null,hol:null};apply()});
    el('heroGo').addEventListener('click',()=>{const r=document.getElementById('pickRes');if(r)r.scrollIntoView({behavior:'smooth'})});
    apply();fetchWeather();setInterval(apply,60000);setInterval(fetchWeather,15*60000);
    if(!reduce)requestAnimationFrame(frame);else staticFrame()}
  return{init,suggest:{w:'in'}}})();

/* ---------- state + storage ---------- */
const store={get(k,d){try{const v=localStorage.getItem('tomsk:'+k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem('tomsk:'+k,JSON.stringify(v))}catch(e){}}};
let favs=new Set(store.get('favs',[]));
let route=store.get('route',[]);
let stamps=new Set(store.get('stamps',[]));
const F={cat:null,q:'',free:false,rom:false,w:'',fav:false,showAll:false};

/* часы работы в формате OpenStreetMap: «Mo-Fr 09:00-18:00; Sa 10:00-16:00; Su off» */
const OH=(()=>{const D=['Su','Mo','Tu','We','Th','Fr','Sa'],RU=['вс','пн','вт','ср','чт','пт','сб'],ORD=[1,2,3,4,5,6,0];const cache=new Map();
  function parse(s){if(!s)return null;if(cache.has(s))return cache.get(s);let r=null;try{r=parse0(s)}catch(e){r={raw:s}}cache.set(s,r);return r}
  function parse0(s){s=s.trim();const week=[[],[],[],[],[],[],[]];if(/^24\/7$/.test(s)){for(let d=0;d<7;d++)week[d]=[[0,1440]];return{week,all:true}}
    let any=false;for(let part of s.split(/;|\|\|/)){part=part.trim();if(!part||/^PH\b/.test(part)||/^SH\b/.test(part))continue;
      const m=part.match(/^((?:(?:Mo|Tu|We|Th|Fr|Sa|Su)(?:\s*-\s*(?:Mo|Tu|We|Th|Fr|Sa|Su))?\s*,?\s*)+)?(.*)$/);const days=[];
      if(m[1]){m[1].split(',').forEach(x=>{x=x.trim();if(!x)return;const[a,b]=x.split('-').map(t=>t.trim());const ia=D.indexOf(a),ib=b?D.indexOf(b):ia;if(ia<0||ib<0)return;for(let k=ia;;k=(k+1)%7){days.push(k);if(k===ib)break}})}else for(let k=0;k<7;k++)days.push(k);
      const rest=(m[2]||'').trim();if(/^(off|closed)$/i.test(rest)){days.forEach(d=>week[d]=[]);any=true;continue}
      if(/^24\/7$|^00:00-24:00$/.test(rest)){days.forEach(d=>week[d]=[[0,1440]]);any=true;continue}
      const sp=[];(rest.match(/\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2}/g)||[]).forEach(t=>{const[a,b]=t.split('-').map(x=>x.trim().split(':').map(Number));let o=a[0]*60+a[1],c=b[0]*60+b[1];if(c<=o)c+=1440;sp.push([o,c])});
      if(!sp.length)return{raw:s};days.forEach(d=>week[d]=sp);any=true}
    return any?{week}:{raw:s}}
  const fm=m=>{m%=1440;return String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0')};
  function nowT(){const d=new Date(Date.now()+(7*60+new Date().getTimezoneOffset())*60000);return{d:d.getDay(),m:d.getHours()*60+d.getMinutes()}}
  function status(s){const P=parse(s);if(!P||!P.week)return null;if(P.all)return{open:true,txt:'Круглосуточно'};const{d,m}=nowT();
    for(const[o,c]of P.week[d])if(m>=o&&m<c)return{open:true,txt:'Открыто до '+fm(c)};
    const y=(d+6)%7;for(const[o,c]of P.week[y])if(c>1440&&m<c-1440)return{open:true,txt:'Открыто до '+fm(c)};
    for(const[o]of P.week[d])if(o>m)return{open:false,txt:'Закрыто, откроется в '+fm(o)};
    for(let k=1;k<=7;k++){const dd=(d+k)%7;if(P.week[dd].length)return{open:false,txt:'Закрыто, откроется '+(k===1?'завтра':RU[dd])+' в '+fm(P.week[dd][0][0])}}
    return{open:false,txt:'Закрыто'}}
  function human(s){const P=parse(s);if(!P)return'';if(!P.week)return s;if(P.all)return'круглосуточно';const key=d=>P.week[d].map(x=>fm(x[0])+'–'+fm(x[1])).join(', ')||'выходной';
    const g=[];ORD.forEach(d=>{const k=key(d);const L=g[g.length-1];if(L&&L.k===k)L.b=d;else g.push({a:d,b:d,k})});
    if(g.length===1)return'ежедневно '+g[0].k;return g.map(x=>(x.a===x.b?RU[x.a]:RU[x.a]+'–'+RU[x.b])+' '+x.k).join('; ')}
  return{status,human,parse}})();

const byId=id=>ALLV.find(p=>p.id===id)||PLACES.find(p=>p.id===id);
const PHOTOS={"nab": ["https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Набережная_реки_Томь.jpg/960px-Набережная_реки_Томь.jpg", "Артём Полоз", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Набережная_реки_Томь.jpg"], "shatr": ["https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Krasnoarmeyskaya_Street_71_Tomsk.jpg/960px-Krasnoarmeyskaya_Street_71_Tomsk.jpg", "Ymblanter", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Krasnoarmeyskaya_Street_71_Tomsk.jpg"], "kraev": ["https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Tomsk_Regional_Museum.jpg/960px-Tomsk_Regional_Museum.jpg", "Павел Андрющенко", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Tomsk_Regional_Museum.jpg"], "lager": ["https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Лагерный_сад.jpg/960px-Лагерный_сад.jpg", "Артём Полоз", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Лагерный_сад.jpg"], "roshcha": ["https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/University_Grove_TSU.JPG/960px-University_Grove_TSU.JPG", "Bogdanov-62", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:University_Grove_TSU.JPG"], "dragon": ["https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Дом_с_драконами.JPG/960px-Дом_с_драконами.JPG", "LEANSER", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Дом_с_драконами.JPG"], "art": ["https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Томский_художественный_музей.jpg/960px-Томский_художественный_музей.jpg", "Максим Вотяков", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Томский_художественный_музей.jpg"], "chekhov": ["https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Anton_Chekhov_statue%2C_Tomsk%2C_Russia.jpg/960px-Anton_Chekhov_statue%2C_Tomsk%2C_Russia.jpg", "Sandy Balfour", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Anton_Chekhov_statue,_Tomsk,_Russia.jpg"], "gorsad": ["https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/City_garden_IMG_4900.jpg/960px-City_garden_IMG_4900.jpg", "Figure19", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:City_garden_IMG_4900.jpg"], "Ново-Соборная площадь": ["https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Сквер_на_Новособорной_площади.jpg/960px-Сквер_на_Новособорной_площади.jpg", "Sv lary", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Сквер_на_Новособорной_площади.jpg"], "Площадь Ленина": ["https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Tomsk_LeninSquare.jpg/960px-Tomsk_LeninSquare.jpg", "Maximaximax", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Tomsk_LeninSquare.jpg"], "Каменный мост": ["https://upload.wikimedia.org/wikipedia/commons/4/45/Stone_bridge_(Tomsk).jpg", "Павел Андрющенко", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Stone_bridge_(Tomsk).jpg"], "Татарская слобода": ["https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Татарская_ул.%2C_д._22.jpg/960px-Татарская_ул.%2C_д._22.jpg", "Павел Андрющенко", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Татарская_ул.,_д._22.jpg"], "Дом Крячкова": ["https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Кирова_7_IMG_2045.jpg/960px-Кирова_7_IMG_2045.jpg", "Figure19", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Кирова_7_IMG_2045.jpg"], "Университетская роща": ["https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/University_Grove_TSU.JPG/960px-University_Grove_TSU.JPG", "Bogdanov-62", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:University_Grove_TSU.JPG"], "Иверская часовня": ["https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/RussiaB_2879_-_Iberian_Chapel_(4160229085).jpg/960px-RussiaB_2879_-_Iberian_Chapel_(4160229085).jpg", "Dennis G. Jarvis", "CC BY-SA 2.0", "https://commons.wikimedia.org/wiki/File:RussiaB_2879_-_Iberian_Chapel_(4160229085).jpg"], "Знаменская церковь": ["https://upload.wikimedia.org/wikipedia/commons/5/5a/Знаменская_церковь_в_Томске.jpg", "Нестеров Олег", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Знаменская_церковь_в_Томске.jpg"], "Петропавловский собор": ["https://upload.wikimedia.org/wikipedia/commons/a/a4/Петропавловская_церковь_в_Томске.jpg", "Нестеров Олег", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Петропавловская_церковь_в_Томске.jpg"], "Польский костёл": ["https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Польский-костёл-в-Томске.jpg/960px-Польский-костёл-в-Томске.jpg", "Maximaximax", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Польский-костёл-в-Томске.jpg"], "Лютеранская церковь Святой Марии": ["https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Томская-кирха-DSC35819.jpg/960px-Томская-кирха-DSC35819.jpg", "Pavel Andryushchenko", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Томская-кирха-DSC35819.jpg"], "Богородице-Алексеевский монастырь": ["https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Kazan_church_in_Tomsk.jpg/960px-Kazan_church_in_Tomsk.jpg", "Maximaximax", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Kazan_church_in_Tomsk.jpg"], "Белая мечеть": ["https://upload.wikimedia.org/wikipedia/commons/f/fc/White-Mosque-(Tomsk).jpg", "Павел Андрющенко", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:White-Mosque-(Tomsk).jpg"], "Мемориальный музей «Следственная тюрьма НКВД»": ["https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Building_44_on_Lenin_Avenue_in_the_city_of_Tomsk.JPG/960px-Building_44_on_Lenin_Avenue_in_the_city_of_Tomsk.JPG", "Bogdanov-62", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Building_44_on_Lenin_Avenue_in_the_city_of_Tomsk.JPG"], "Музей деревянного зодчества": ["https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Кирова_7_IMG_2045.jpg/960px-Кирова_7_IMG_2045.jpg", "Figure19", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Кирова_7_IMG_2045.jpg"], "Томский планетарий": ["https://upload.wikimedia.org/wikipedia/commons/0/09/Prospekt_Lenina_in_Tomsk%2C_82а-1.jpg", "Павел Андрющенко", "CC BY-SA 2.5", "https://commons.wikimedia.org/wiki/File:Prospekt_Lenina_in_Tomsk,_82а-1.jpg"], "Томский ТЮЗ": ["https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Томский_ТЮЗ_DSC51868.jpg/960px-Томский_ТЮЗ_DSC51868.jpg", "Павел Андрющенко", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Томский_ТЮЗ_DSC51868.jpg"], "Театр куклы и актёра «Скоморох»": ["https://upload.wikimedia.org/wikipedia/commons/a/a7/Соляная-4-DSN43436-Panorama.jpg", "Павел Андрющенко", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Соляная-4-DSN43436-Panorama.jpg"], "Томская филармония": ["https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Томская_областная_государственная_филармония.jpg/960px-Томская_областная_государственная_филармония.jpg", "Тара-Амингу", "CC0", "https://commons.wikimedia.org/wiki/File:Томская_областная_государственная_филармония.jpg"], "Буфф-сад": ["https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Buff-garden_(Tomsk).jpg/960px-Buff-garden_(Tomsk).jpg", "Максим Вотяков", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Buff-garden_(Tomsk).jpg"], "Игуменский сад": ["https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Игуменский_парк.jpg/960px-Игуменский_парк.jpg", "Артём Полоз", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Игуменский_парк.jpg"], "Михайловская роща": ["https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Михайловская_роща_в_Томске.jpg/960px-Михайловская_роща_в_Томске.jpg", "Максим Вотяков", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Михайловская_роща_в_Томске.jpg"], "Набережная Томи": ["https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Набережная_реки_Томь.jpg/960px-Набережная_реки_Томь.jpg", "Артём Полоз", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Набережная_реки_Томь.jpg"]};
const photo=p=>{const f=p.ph||PHOTOS[p.id]||PHOTOS[p.name]||null;return f?[url(f[0]),...f.slice(1)]:null};
const phImg=p=>{const f=photo(p);return f?`<img class="ph" src="${f[0]}" alt="${esc(p.name)}" loading="lazy" referrerpolicy="no-referrer" onerror="this.remove()">`:''};
const phCredit=p=>{const f=photo(p);if(!f||!(f[1]||f[3]))return'';return`<p class="credit">Фото: ${f[3]?`<a href="${f[3]}" target="_blank" rel="noopener">${f[1]||'источник'}</a>`:f[1]}${f[2]?', '+f[2]:''}${/wikimedia/.test(f[3]||'')?' · Wikimedia Commons':''}</p>`};
const priceTxt=p=>p===0?'Бесплатно':p==null?'уточняйте':`от ${p} ₽`;
const tint=id=>{let h=0;for(const c of id)h=(h*31+c.charCodeAt(0))%997;return id[0]==='p'?`filter:hue-rotate(${h%70-35}deg) brightness(${.9+(h%7)/30})`:''};
const NUL=new Proxy(function(){},{get:(t,k)=>k===Symbol.toPrimitive?()=>'':k==='length'?0:k==='then'||k===Symbol.iterator?undefined:NUL,set:()=>true,apply:()=>NUL});
const $=s=>document.querySelector(s)||NUL;
function toast(t){const el=$('#toast');el.textContent=t;el.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>el.classList.remove('show'),1800)}

/* hero chips */
const HCHIPS=[['Кафе',{cat:'food'}],['Парки',{cat:'nature'}],['Музеи',{cat:'culture'}],['Для детей',{cat:'kids'}],['Необычное',{cat:'unusual'}],['Романтика',{rom:true}],['Бесплатно',{free:true}],['Под крышей',{w:'in'}]];
$('#heroChips').innerHTML=HCHIPS.map((c,i)=>`<button class="chip" data-i="${i}" aria-pressed="false">${c[0]}</button>`).join('');
$('#heroChips').addEventListener('click',e=>{const b=e.target.closest('.chip');if(!b)return;applyFilter(HCHIPS[b.dataset.i][1],true)});

function goPlaces(f){location.href=ROOT+'mesta/?f='+encodeURIComponent(JSON.stringify(f||{}))}
function applyFilter(f,scroll){if(!document.getElementById('placeGrid')){goPlaces(f);return}Object.assign(F,{cat:null,q:'',free:false,rom:false,w:'',fav:false},f);$('#q').value=F.q;renderAll();if(scroll)$('#places').scrollIntoView({behavior:'smooth'})}

/* categories */
$('#cats').innerHTML=CATS.map(c=>`<button class="cat" data-c="${c.id}" aria-pressed="false"><span class="tile">${ico(c.id)}</span>${c.name}</button>`).join('');
$('#cats').addEventListener('click',e=>{const b=e.target.closest('.cat');if(!b)return;const c=b.dataset.c;Object.assign(F,{cat:F.cat===c?null:c,fav:false});renderAll()});

/* places */
function matchPlace(p){
  if(F.fav&&!favs.has(p.id))return false;
  if(F.cat){if(F.cat==='kids'?!p.kids:p.cat!==F.cat)return false}
  if(F.free&&p.price!==0)return false;
  if(F.rom&&!p.rom)return false;
  if(F.w==='in'&&!p.indoor)return false;
  if(F.w==='out'&&p.indoor)return false;
  if(F.q){const s=(p.name+' '+p.tags.join(' ')+' '+p.addr+' '+p.desc).toLowerCase();if(!F.q.toLowerCase().split(/\s+/).every(t=>s.includes(t)))return false}
  return true;
}
function placeCard(p){
  const inR=route.includes(p.id);
  return `<article class="card" data-open="${p.id}" tabindex="0">
    <div class="media"><div style="position:absolute;inset:0;${tint(p.id)}">${scene(p.scene)}</div>${phImg(p)}<button class="fav" data-fav="${p.id}" aria-pressed="${favs.has(p.id)}" aria-label="Хочу сходить">${ico('heart')}</button></div>
    <div class="card-body"><h3>${VSLUG[p.id]?`<a class="card-link" href="${ROOT}mesto/${VSLUG[p.id]}/">${esc(p.name)}</a>`:p.name}</h3><p class="meta">${p.tags.join(' · ')}</p>
    <div class="foot"><span class="price">${p.price==null?'':priceTxt(p.price)}</span><span class="card-st">${p.hours&&OH.status(p.hours)?OH.status(p.hours).txt:''}</span></div></div></article>`;
}
function renderPlaces(){
  const list=PLACES.filter(matchPlace);
  const shown=F.showAll?list:list.slice(0,12);
  $('#placeGrid').innerHTML=shown.length?shown.map(placeCard).join(''):`<div class="empty">Ничего не нашли по этим условиям. Попробуйте снять фильтр или ищите по-другому, например «кофе» или «музей».</div>`;
  $('#placeCount').textContent=`${list.length} ${plural(list.length,['место','места','мест'])}`;
  $('#morePlaces').hidden=list.length<=12;
  $('#morePlaces').firstChild.textContent=F.showAll?'Свернуть ':'Смотреть все ';
  const af=[];
  if(F.cat)af.push(['cat',CATS.find(c=>c.id===F.cat).name]);
  if(F.q)af.push(['q','«'+F.q+'»']);if(F.free)af.push(['free','Бесплатно']);if(F.rom)af.push(['rom','Романтика']);if(F.fav)af.push(['fav','Избранное']);
  $('#activeFilters').innerHTML=af.map(([k,t])=>`<span class="active-filter">${t}<button data-clear="${k}" aria-label="Убрать фильтр">${ico('x')}</button></span>`).join('');
  document.querySelectorAll('#weatherSeg button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.w===F.w));
  document.querySelectorAll('.cat').forEach(b=>b.setAttribute('aria-pressed',b.dataset.c===F.cat));
  document.querySelectorAll('#heroChips .chip').forEach(b=>{const f=HCHIPS[b.dataset.i][1];const k=Object.keys(f)[0];b.setAttribute('aria-pressed',F[k]===f[k])});
}
function plural(n,f){const a=n%100,b=n%10;return f[a>10&&a<20?2:b===1?0:b>=2&&b<=4?1:2]}
$('#activeFilters').addEventListener('click',e=>{const b=e.target.closest('[data-clear]');if(!b)return;const k=b.dataset.clear;F[k]=k==='q'||k==='cat'?(k==='q'?'':null):false;if(k==='q')$('#q').value='';renderAll()});
$('#weatherSeg').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;F.w=b.dataset.w;renderAll()});
$('#morePlaces').addEventListener('click',()=>{F.showAll=!F.showAll;renderPlaces()});
$('#rainBtn').addEventListener('click',()=>applyFilter(HERO.suggest,true));
$('#searchForm').addEventListener('submit',e=>{e.preventDefault();if(PAGE!=='places'){goPlaces({q:$('#q').value.trim()});return}F.q=$('#q').value.trim();F.cat=null;F.fav=false;renderAll();$('#places').scrollIntoView({behavior:'smooth'})});
$('#searchJump').addEventListener('click',()=>{if(!document.getElementById('q')){location.href=ROOT+'mesta/#all';return}window.scrollTo({top:0,behavior:'smooth'});setTimeout(()=>$('#q').focus(),300)});
$('#favBtn').addEventListener('click',()=>{if(!favs.size){toast('Нажмите ♡ на карточке — место попадёт в список «Хочу сходить»');return}applyFilter({fav:true},true)});
$('#menuBtn').addEventListener('click',()=>$('#nav').classList.toggle('open'));
$('#nav').addEventListener('click',e=>{if(e.target.tagName==='A')$('#nav').classList.remove('open')});
$('#loginBtn').addEventListener('click',()=>toast('Вход появится во второй версии'));

/* global clicks: fav / add / open */
document.addEventListener('click',e=>{
  const f=e.target.closest('[data-fav]');if(f){e.stopPropagation();const id=f.dataset.fav;favs.has(id)?favs.delete(id):favs.add(id);store.set('favs',[...favs]);toast(favs.has(id)?'Сохранили в «Хочу сходить»':'Убрали из «Хочу сходить»');renderAll();if(f.closest('.sheet'))openSheet(id);return}
  const a=e.target.closest('[data-add]');if(a){e.stopPropagation();toggleRoute(a.dataset.add);if(a.closest('.sheet'))openSheet(a.dataset.add);if(a.closest('.pop'))showPop(a.dataset.add);return}
  const o=e.target.closest('[data-open]');if(o&&VSLUG[o.dataset.open]&&!e.target.closest('.sheet')){if(!e.target.closest('a'))location.href=ROOT+'mesto/'+VSLUG[o.dataset.open]+'/';return}if(o&&!e.target.closest('.sheet')){openSheet(o.dataset.open)}
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeSheet();closeDrawer();hidePop()}if(e.key==='Enter'&&e.target.matches('.card[data-open]'))openSheet(e.target.dataset.open)});

/* detail sheet */
function openSheet(id){
  const p=byId(id);if(!p)return;const inR=route.includes(id);
  const yurl='https://yandex.ru/maps/?text='+encodeURIComponent('Томск, '+p.name+', '+p.addr);
  $('#sheet').innerHTML=`<button class="x" id="sheetX" aria-label="Закрыть">${ico('x')}</button><div class="media">${scene(p.scene)}${phImg(p)}<button class="fav" data-fav="${p.id}" aria-pressed="${favs.has(p.id)}" aria-label="Хочу сходить" style="right:54px">${ico('heart')}</button></div>
  <div class="card-body"><p class="meta">${CATS.find(c=>c.id===p.cat).name}${p.demo?' · демо-заведение':''}</p><h3>${esc(p.name)}</h3>${VSLUG[p.id]?`<p><a class="btn btn-primary" style="text-decoration:none" href="${ROOT}mesto/${VSLUG[p.id]}/">Страница места →</a></p>`:''}${p.why?`<p class="desc"><b>${esc(p.why)}.</b></p>`:''}<p class="desc">${esc(p.desc)}</p>
  <div class="facts"><div>Что это<b>${esc(p.tags[0]||p.kind)}</b></div><div>Вход<b>${priceTxt(p.price)}</b></div><div>Займёт<b>${fmtMins(p.mins)}</b></div></div>
  <div class="where">${ico('pin')}${esc(p.addr)}</div>${infoBlock(p)}${phCredit(p)}
  <div class="plan-actions"><button class="btn btn-primary" data-fav="${p.id}">${favs.has(p.id)?'♥ В списке «Хочу сходить»':'♡ Хочу сходить'}</button>${p.demo?'':`<a class="btn btn-ghost" href="${yurl}" target="_blank" rel="noopener">${ico('ext')}Яндекс Карты</a>`}</div></div>`;
  $('#sheet').classList.add('open');$('#scrim').classList.add('open');$('#sheetX').onclick=closeSheet;
}
function infoBlock(p){const st=p.hours?OH.status(p.hours):null;let h='';
  if(p.photos&&p.photos.length>1)h+=`<div class="gal">${p.photos.slice(1,7).map(f=>`<a href="${f[0]}" target="_blank" rel="noopener"><img src="${f[0]}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.parentNode.remove()"></a>`).join('')}</div>`;
  if(p.hours)h+=`<div class="oh ${st?(st.open?'on':'off'):''}">${st?`<b>${st.txt}</b> · `:''}${esc(OH.human(p.hours))}</div>`;
  if(p.prices)h+=`<p class="desc" style="font-size:14px">Цены: ${esc(p.prices)}</p>`;
  const L=[];if(p.phone)L.push(`<a class="btn btn-ghost" href="tel:${p.phone.split(/[,;]/)[0].replace(/[^+\d]/g,'')}">${esc(p.phone)}</a>`);if(p.web)L.push(`<a class="btn btn-ghost" href="${p.web}" target="_blank" rel="noopener">${ico('ext')}Сайт</a>`);
  if(p.email)L.push('<span class="credit">'+esc(p.email)+'</span>');
  if(p.payment)h+='<p class="credit">Оплата: '+esc(p.payment)+'</p>';
  if(L.length)h+=`<div class="plan-actions" style="margin-top:0">${L.join('')}</div>`;
  h+=`<p class="credit">${p.checked?`Часы проверены ${p.checked.split('-').reverse().join('.')} по <a href="${p.src}" target="_blank" rel="noopener">сайту заведения</a>. `:p.hours?(p.origin==='supplier'?'Часы из предоставленной базы — уточните перед визитом. ':p.origin==='osm'?'Часы по данным OpenStreetMap — лучше уточнить перед визитом. ':'Часы лучше уточнить перед визитом. '):''}<button class="linkbtn" data-report="${p.name.replace(/"/g,'&quot;')}">Это ваше место или нашли ошибку?</button></p>`;return h}
function closeSheet(){$('#sheet').classList.remove('open');if(!document.querySelector('#drawer')?.classList.contains('open'))$('#scrim').classList.remove('open')}
$('#scrim').addEventListener('click',()=>{closeSheet();closeDrawer()});

/* route */
function fmtMins(m){if(m==null)return'Уточняется';const h=Math.floor(m/60),r=m%60;return h?`${h} ч${r?' '+r+' мин':''}`:`${r} мин`}
function toggleRoute(id){const i=route.indexOf(id);if(i>=0){route.splice(i,1);toast('Убрано из маршрута')}else{route.push(id);toast('Добавлено в маршрут · '+route.length)}saveRoute()}
function saveRoute(){store.set('route',route);renderRoute();renderPlaces();renderMap()}
function renderRoute(){
  $('#routeFabTxt').textContent=route.length?`Мой маршрут · ${route.length}`:'Мой маршрут';
  if(!route.length){$('#routeList').innerHTML=`<div class="empty" style="padding:28px">Здесь соберётся ваш день. Нажимайте «+ Маршрут» на карточках или попросите план в блоке «Удиви меня».</div>`;$('#routeTotal').textContent='0 мин';return}
  let total=0;$('#routeList').innerHTML=route.map((id,i)=>{const p=byId(id);total+=p.mins+(i?15:0);
    return `${i?`<div class="r-walk">≈ 15 мин в пути</div>`:''}<div class="r-item"><span class="r-num">${i+1}</span><div style="min-width:0"><b>${esc(p.name)}</b><small>${fmtMins(p.mins)} · ${priceTxt(p.price)}</small></div>
    <div class="r-ctrl"><button data-mv="${i},-1" aria-label="Выше">${ico('up')}</button><button data-mv="${i},1" aria-label="Ниже">${ico('down')}</button><button data-rm="${i}" aria-label="Убрать">${ico('x')}</button></div></div>`}).join('');
  $('#routeTotal').textContent='≈ '+fmtMins(total);
}
$('#routeList').addEventListener('click',e=>{const m=e.target.closest('[data-mv]'),r=e.target.closest('[data-rm]');
  if(m){const [i,d]=m.dataset.mv.split(',').map(Number),j=i+d;if(j<0||j>=route.length)return;[route[i],route[j]]=[route[j],route[i]];saveRoute()}
  if(r){route.splice(+r.dataset.rm,1);saveRoute()}});
$('#clearRoute').addEventListener('click',()=>{route=[];saveRoute()});
function openDrawer(){document.querySelector('#drawer')?.classList.add('open');$('#scrim').classList.add('open')}
function closeDrawer(){document.querySelector('#drawer')?.classList.remove('open');if(!$('#sheet').classList.contains('open'))$('#scrim').classList.remove('open')}
$('#routeFab').addEventListener('click',openDrawer);$('#closeDrawer').addEventListener('click',closeDrawer);

/* events */
const BASE=new Date(2026,9,12);const WD=['вс','пн','вт','ср','чт','пт','сб'];let selDay=null;
function renderDates(){
  const today=new Date();let h=`<button class="date all" data-d="" aria-pressed="${selDay===null}">Все даты</button>`;
  for(let i=0;i<21;i++){const dt=new Date(BASE);dt.setDate(BASE.getDate()+i);const d=dt.getDate(),m=dt.getMonth();const key=m===9?d:null;
    const has=EVENTS.some(e=>e.d===d&&m===9);const isT=dt.toDateString()===today.toDateString();
    h+=`<button class="date ${has?'has':''} ${dt.getDay()%6===0?'weekend':''}" data-d="${m===9?d:'n'+d}" aria-pressed="${selDay===String(m===9?d:'n'+d)}"><small>${isT?'сегодня':WD[dt.getDay()]}</small><b>${d}</b></button>`}
  $('#dates').innerHTML=h;
}
$('#dates').addEventListener('click',e=>{const b=e.target.closest('.date');if(!b)return;selDay=b.dataset.d===''?null:(selDay===b.dataset.d?null:b.dataset.d);renderDates();renderEvents()});
function eventCard(e){return `<article class="card" data-ev="${e.id}"><div class="media">${scene(e.scene)}<div class="ev-date"><b>${e.d}</b><small>${MONTHS[9]}</small></div></div>
  <div class="card-body"><h3>${e.title}</h3><div class="where">${ico('pin')}${e.place} · ${e.time}</div><div class="tags">${e.price===0?'<span class="tag free">Бесплатно</span>':`<span class="tag">${e.price} ₽</span>`}${e.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div></div></article>`}
function renderEvents(){
  let list=EVENTS.filter(e=>selDay===null||String(e.d)===selDay);
  if(F.q){const q=F.q.toLowerCase();list=list.filter(e=>(e.title+e.place+e.tags.join(' ')).toLowerCase().includes(q))}
  if(F.free)list=list.filter(e=>e.price===0);if(F.cat==='kids')list=list.filter(e=>e.kids);
  if(selDay===null&&!F.q&&!F.free&&F.cat!=='kids')list=list.slice(0,8);
  $('#eventGrid').innerHTML=list.length?list.map(eventCard).join(''):`<div class="empty">В этот день событий пока нет. Загляните на выходные, там всегда что-то происходит.</div>`;
  const wk=EVENTS.filter(e=>e.d>=12&&e.d<19).length;$('#weekCount').textContent=`${wk} ${plural(wk,['событие','события','событий'])}`;
}
$('#eventGrid').addEventListener('click',e=>{const c=e.target.closest('[data-ev]');if(!c)return;const ev=EVENTS.find(x=>x.id===c.dataset.ev);toast(`${ev.d} октября, ${ev.time} · ${ev.place}`)});

/* surprise */
const S={who:'pair',budget:'mid',w:'any'};let plan=[];
document.querySelectorAll('.opt .row').forEach(r=>r.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;S[r.dataset.k]=b.dataset.v;r.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b));roll()}));
const pick=a=>a[Math.floor(Math.random()*a.length)];
function fitBudget(p){return S.budget==='free'?p.price===0:S.budget==='mid'?(p.price==null||p.price<=1000):true}
function fitW(p){return S.w==='any'||(S.w==='in'?p.indoor:!p.indoor)}
function roll(){
  const ok=PLACES.filter(p=>fitBudget(p)&&fitW(p)&&(S.who!=='kids'||p.kids));
  let walk=ok.filter(p=>['nature','unusual','culture','sport'].includes(p.cat));
  if(S.who==='pair'){const r=walk.filter(p=>p.rom);if(r.length)walk=r}
  const a=pick(walk.length?walk:PLACES.filter(p=>p.cat==='nature'));
  const food=PLACES.filter(p=>p.cat==='food'&&(S.budget!=='free'));
  const b=food.length?pick(food):null;
  let ev=EVENTS.filter(e=>(S.budget==='free'?e.price===0:S.budget==='mid'?e.price<=1000:true)&&(S.who!=='kids'||e.kids));
  const evening=pick(ok.filter(p=>p.id!==a.id&&['fun','culture','shop','sport'].includes(p.cat)).concat(ok.filter(p=>p.id!==a.id)));
  const e=ev.length&&Math.random()>.4?pick(ev):null;
  plan=[{t:'12:00',l:'Прогулка',p:a}];
  plan.push(b?{t:'14:30',l:'Перекус',p:b}:{t:'14:30',l:'Пикник',txt:'Термос чая и пирожки из пекарни',sub:'Бесплатно, если взять с собой',scene:'coffee'});
  plan.push(e?{t:e.time.slice(0,5),l:'Вечер',txt:e.title,sub:`${e.d} октября · ${e.place}`,scene:e.scene}:{t:'17:00',l:'Вечер',p:evening||a});
  $('#plan').innerHTML=plan.map(s=>{const p=s.p;return `<div class="plan-step"><div class="plan-time">${s.t}<small>${s.l}</small></div><div class="plan-thumb">${scene(p?p.scene:s.scene)}${p?phImg(p):''}</div>
    <div style="min-width:0"><h3>${p?p.name:s.txt}</h3><p>${p?`${esc(p.tags[0]||p.kind)} · ${priceTxt(p.price)} · ${fmtMins(p.mins)}`:s.sub}</p></div>${p?`<button class="add" data-open="${p.id}">Подробнее</button>`:''}</div>`}).join('');
}
$('#rollBtn').addEventListener('click',roll);$('#rollAgain').addEventListener('click',roll);
$('#planToRoute').addEventListener('click',()=>{let n=0;plan.forEach(s=>{if(s.p&&!route.includes(s.p.id)){route.push(s.p.id);n++}});saveRoute();toast(n?`Добавлено мест: ${n}`:'Эти места уже в маршруте');openDrawer()});

/* map */
let mapCat=null,popId=null;
$('#legend').innerHTML=`<button data-mc="" aria-pressed="true">Все</button>`+CATS.filter(c=>c.id!=='kids').map(c=>`<button data-mc="${c.id}" aria-pressed="false">${c.name}</button>`).join('');
$('#legend').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;mapCat=b.dataset.mc||null;$('#legend').querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b));hidePop();renderMap()});
function renderMap(){
  const roads=[[430,60,900,60],[440,150,920,140],[450,240,940,230],[470,330,960,320],[560,0,620,440],[700,0,720,440],[820,0,850,440]];
  const rpts=route.map(byId).filter(p=>p&&p.feat);
  const routeLine=rpts.length>1?`<path d="M${rpts.map(p=>p.x+' '+p.y).join(' L')}" fill="none" stroke="var(--amber)" stroke-width="4" stroke-dasharray="2 9" stroke-linecap="round"/>`:'';
  $('#mapEl').innerHTML=`<svg class="base" viewBox="0 0 1000 440" preserveAspectRatio="none" aria-hidden="true">
    <rect width="1000" height="440" fill="var(--map-land)"/>
    ${[[480,80,60,50],[620,90,60,40],[740,170,60,50],[480,170,60,50],[740,260,70,50],[870,80,90,50],[870,250,90,50],[600,360,80,60]].map(([x,y,w,h])=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="var(--map-block)"/>`).join('')}
    ${roads.map(r=>`<path d="M${r[0]} ${r[1]}L${r[2]} ${r[3]}" stroke="var(--map-road)" stroke-width="7" stroke-linecap="round"/>`).join('')}
    <path d="M150 440C250 330 320 300 360 220S380 70 470 0" fill="none" stroke="var(--river)" stroke-width="70"/>
    <path d="M1000 380C900 360 800 380 700 360S520 300 400 280" fill="none" stroke="var(--river)" stroke-width="12"/>
    <path d="M110 120q50 40 100 0t100 10" stroke="var(--map-block)" stroke-width="40" fill="none" stroke-linecap="round"/>
    <text x="300" y="300" fill="var(--ink-2)" font-size="16" font-style="italic" font-family="Manrope,sans-serif" transform="rotate(-58 300 300)">р. Томь</text>
    <text x="840" y="372" fill="var(--ink-2)" font-size="12" font-style="italic" font-family="Manrope,sans-serif">р. Ушайка</text>
    <text x="760" y="120" fill="var(--ink-2)" font-size="22" font-weight="800" letter-spacing="6" font-family="Unbounded,sans-serif" opacity=".55">ТОМСК</text>
    ${routeLine}</svg>
    ${PLACES.filter(p=>p.feat).map(p=>{const dim=mapCat&&p.cat!==mapCat;return `<button class="pin ${dim?'dim':''} ${popId===p.id?'on':''}" data-pin="${p.id}" style="left:${p.x/10}%;top:${p.y/4.4}%" aria-label="${esc(p.name)}">
      <svg class="shape" viewBox="0 0 36 44"><path d="M18 43s15-13.5 15-25A15 15 0 0 0 3 18c0 11.5 15 25 15 25z" fill="${CATCOLOR[p.cat]}" stroke="#fff" stroke-width="2.5"/></svg>${ico(p.cat)}</button>`}).join('')}<div id="popWrap"></div>`;
  if(popId)showPop(popId);
}
$('#mapEl').addEventListener('click',e=>{const b=e.target.closest('[data-pin]');if(b){showPop(b.dataset.pin);return}if(e.target.closest('.x'))hidePop()});
function showPop(id){
  popId=id;const p=byId(id);const box=$('#mapEl').getBoundingClientRect();
  let left=p.x/1000*box.width+18,top=p.y/440*box.height-60;
  if(left+260>box.width)left=p.x/1000*box.width-268;left=Math.max(12,left);top=Math.min(Math.max(12,top),box.height-240);
  document.querySelectorAll('.pin').forEach(x=>x.classList.toggle('on',x.dataset.pin===id));
  const inR=route.includes(id);
  $('#popWrap').innerHTML=`<div class="pop" style="left:${left}px;top:${top}px"><button class="x" aria-label="Закрыть">${ico('x')}</button><div class="media">${scene(p.scene)}${phImg(p)}</div>
    <div class="card-body"><h3>${esc(p.name)}</h3><div class="where">${ico('pin')}${esc(p.addr)}</div><div class="foot"><span class="price">${esc(p.tags[0]||p.kind)}</span><button class="add" data-open="${p.id}">Открыть</button></div></div></div>`;
}
function hidePop(){popId=null;const w=$('#popWrap');if(w)w.innerHTML='';document.querySelectorAll('.pin.on').forEach(x=>x.classList.remove('on'))}

/* passport */
const SEAL='<svg class="seal" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="32" cy="32" r="29" stroke-dasharray="3 3"/><circle cx="32" cy="32" r="23"/><path d="M18 44V30l14-12 14 12v14M24 44V32h16v12M22 30q10-10 20 0M32 18v-6"/></svg>';
function renderStamps(){
  const n=STAMPS.filter(s=>stamps.has(s.id)).length,all=n===STAMPS.length;
  $('#stamps').innerHTML=STAMPS.map(s=>`<button class="stamp" data-st="${s.id}" aria-pressed="${stamps.has(s.id)}">${SEAL}${s.name}<small>${stamps.has(s.id)?'Отмечено ✓':s.addr}</small></button>`).join('')+
    `<div class="stamp reward ${all?'got':''}">${SEAL.replace('class="seal"','class="seal" style="color:'+(all?'var(--on-forest)':'var(--line)')+'"')}${all?'Знаток деревянного Томска':'Финальный штамп'}<small>${all?'Значок появится в вашем профиле':'Отметьте все 5 домов'}</small></div>`;
  $('#meter').style.width=n/STAMPS.length*100+'%';$('#meterTxt').textContent=`${n} из ${STAMPS.length} домов найдено`;
}
$('#stamps').addEventListener('click',e=>{const b=e.target.closest('[data-st]');if(!b)return;const id=b.dataset.st;stamps.has(id)?stamps.delete(id):stamps.add(id);store.set('stamps',[...stamps]);renderStamps();if(stamps.size===STAMPS.length)toast('Все дома найдены! Финальный штамп ваш')});

/* collections */
$('#collGrid').innerHTML=COLLS.map((c,i)=>`<button class="coll" data-coll="${i}">${scene(c.scene)}<span>${c.title}<small>${c.sub}</small></span></button>`).join('');
$('#collGrid').addEventListener('click',e=>{const b=e.target.closest('[data-coll]');if(b)applyFilter(COLLS[b.dataset.coll].f,true)});

const MAP_URL=ROOT+'map.html';
const CATN={food:'Кафе и рестораны',bar:'Бары',culture:'Музеи, театры, кино',fun:'Развлечения и спорт',nature:'Парки',sight:'Достопримечательности',church:'Храмы',stay:'Где жить',shop:'Магазины и подарки'};
CATN.other='Другие организации';
const CF={q:'',c:'',open:false,n:30};
function vStatus(v){return v[6]?OH.status(v[6]):null}
function catFilter(){const q=CF.q.toLowerCase().replace(/ё/g,'е').split(/\s+/).filter(Boolean);
  return CATALOG.filter(v=>{if(CF.c&&v[1]!==CF.c)return false;if(q.length){const s=(v[0]+' '+v[2]+' '+v[5]+' '+v[9]).toLowerCase().replace(/ё/g,'е');if(!q.every(t=>s.includes(t)))return false}
    if(CF.open){const st=vStatus(v);if(!st||!st.open)return false}return true})}
function vRow(v,i){const st=vStatus(v);const q=encodeURIComponent(v[0]+(v[5]?', '+v[5]:''));
  return `<article class="vrow">${v[11]?`<img class="vthumb" src="${esc(v[11])}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.remove()">`:''}<h3><button class="vname" data-open="${v[10]}">${esc(v[0])}</button></h3><div class="k">${esc(v[2])}${v[9]?' · '+esc(v[9].split(';').slice(0,2).join(', ').replace(/_/g,' ')):''}</div>
  ${v[5]?`<div class="a">${esc(v[5])}</div>`:''}${st?`<div class="s ${st.open?'on':'off'}">${st.txt}</div>`:v[6]?`<div class="a">${esc(v[6])}</div>`:''}
  <div class="acts">${Number.isFinite(v[3])&&Number.isFinite(v[4])?`<a href="${MAP_URL}#poi=${v[3]},${v[4]}" target="_blank" rel="noopener">На карте</a>`:''}<a href="https://2gis.ru/tomsk/search/${q}" target="_blank" rel="noopener">2ГИС</a><a href="https://yandex.ru/maps/?text=${encodeURIComponent('Томск, ')}${q}" target="_blank" rel="noopener">Яндекс</a>
  ${v[8]?`<a href="${esc(v[8])}" target="_blank" rel="noopener">Сайт</a>`:''}${v[7]?`<a href="tel:${v[7].split(/[,;]/)[0].replace(/[^+\d]/g,'')}">Позвонить</a>`:''}<button data-report="${esc(v[0])}">Исправить</button></div></article>`}
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function renderCatalog(){const L=catFilter();
  // сначала места с часами и контактами — они полезнее
  L.sort((a,b)=>((b[6]?2:0)+(b[8]||b[7]?1:0))-((a[6]?2:0)+(a[8]||a[7]?1:0))||a[0].localeCompare(b[0],'ru'));
  $('#catList').innerHTML=L.length?L.slice(0,CF.n).map(vRow).join(''):`<div class="empty">Ничего не нашли. Попробуйте другое слово или снимите фильтр «Открыто сейчас».</div>`;
  $('#catCount').textContent=`${L.length} ${plural(L.length,['место','места','мест'])}`;$('#catMore').hidden=L.length<=CF.n;
  const cnt={};CATALOG.forEach(v=>cnt[v[1]]=(cnt[v[1]]||0)+1);
  $('#catChips').innerHTML=`<button data-c="" aria-pressed="${!CF.c}">Все<small>${CATALOG.length}</small></button>`+Object.keys(CATN).filter(k=>cnt[k]).map(k=>`<button data-c="${k}" aria-pressed="${CF.c===k}">${CATN[k]}<small>${cnt[k]}</small></button>`).join('')}
let catT=0;$('#catQ').addEventListener('input',e=>{clearTimeout(catT);catT=setTimeout(()=>{CF.q=e.target.value.trim();CF.n=30;renderCatalog()},150)});
$('#catChips').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;CF.c=b.dataset.c;CF.n=30;renderCatalog()});
$('#catOpen').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;CF.open=!!b.dataset.o;$('#catOpen').querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b));CF.n=30;renderCatalog()});
$('#catMore').addEventListener('click',()=>{CF.n+=30;renderCatalog()});
renderCatalog();

/* ---------- форма «Я владелец / нашли ошибку / добавить место» ---------- */
function openReport(name){const el=$('#rep');el.innerHTML=`<button class="x" id="repX" aria-label="Закрыть">${ico('x')}</button><form class="card-body" id="repForm" enctype="multipart/form-data">
  <h3>${name?'Обновить данные о месте':'Добавить место'}</h3><p class="desc" style="font-size:14px;color:var(--ink-2)">Мы проверим и обновим карточку. Если вы владелец — пришлите актуальные часы, цены и фото, это бесплатно.</p>
  <label>Кто вы<select name="who"><option value="owner">Владелец или сотрудник заведения</option><option value="guest">Посетитель — нашёл ошибку</option></select></label>
  <label>Название места<input name="place" required value="${esc(name||'')}" maxlength="120"></label>
  <div class="row2"><label>Часы работы<input name="hours" placeholder="пн–пт 9–21, сб–вс 10–22" maxlength="200"></label><label>Средний чек или цены<input name="prices" placeholder="например, 600–900 ₽" maxlength="200"></label></div>
  <div class="row2"><label>Телефон заведения<input name="phone" maxlength="40"></label><label>Сайт или соцсети<input name="web" maxlength="200"></label></div>
  <label>Что ещё исправить или рассказать<textarea name="text" maxlength="3000" placeholder="Например: переехали, новое меню, есть детская комната…"></textarea></label>
  <label>Фото (до 5 штук, до 8 МБ каждое)<input type="file" name="photos[]" accept="image/jpeg,image/png,image/webp" multiple></label>
  <label>Как с вами связаться (не публикуется)<input name="contact" maxlength="120" placeholder="телефон, почта или Telegram"></label>
  <label class="chk"><input type="checkbox" name="consent" value="1" required>Фото и данные мои или я вправе ими распоряжаться; разрешаю опубликовать их на сайте</label>
  <input name="website2" style="display:none" tabindex="-1" autocomplete="off">
  <div class="plan-actions"><button class="btn btn-primary" type="submit">Отправить</button></div><div id="repMsg"></div></form>`;
  el.classList.add('open');$('#scrim').classList.add('open');$('#repX').onclick=closeReport;
  $('#repForm').addEventListener('submit',async e=>{e.preventDefault();const f=e.target;const files=f.querySelector('input[type=file]').files;
    if(files.length>5){$('#repMsg').innerHTML='<p class="desc">Не больше 5 фото.</p>';return}for(const x of files)if(x.size>8e6){$('#repMsg').innerHTML='<p class="desc">Фото «'+esc(x.name)+'» больше 8 МБ.</p>';return}
    const btn=f.querySelector('button[type=submit]');btn.disabled=true;btn.textContent='Отправляем…';
    try{const r=await fetch(ROOT+'report.php',{method:'POST',body:new FormData(f)});const j=await r.json();if(!j.ok)throw new Error(j.error||'ошибка');
      f.innerHTML='<div class="ok">Спасибо! Мы получили данные и обновим карточку после проверки.</div>'}
    catch(err){btn.disabled=false;btn.textContent='Отправить';$('#repMsg').innerHTML='<p class="desc" style="color:#B5462E">Не получилось отправить. Форма работает, когда сайт размещён на хостинге; попробуйте позже.</p>'}})}
function closeReport(){$('#rep').classList.remove('open');if(!$('#sheet').classList.contains('open')&&!document.querySelector('#drawer')?.classList.contains('open'))$('#scrim').classList.remove('open')}
document.addEventListener('click',e=>{const b=e.target.closest('[data-report]');if(!b)return;e.preventDefault();e.stopPropagation();closeSheet();openReport(b.dataset.report)},true);
$('#scrim').addEventListener('click',closeReport);document.addEventListener('keydown',e=>{if(e.key==='Escape')closeReport()});
{const m=location.hash.match(/^#report=(.*)$/);if(m)setTimeout(()=>openReport(decodeURIComponent(m[1])),300)}

fetch(ROOT+'data/venues.json',{cache:'no-cache'}).then(r=>r.ok?r.json():null).then(V=>{if(!V||!V.items)return;window.VRAW=V;applyVenues(V);renderAll();renderCatalog();renderMap();renderRoute();safe(renderStamps);if(!plan.length)safe(roll);document.dispatchEvent(new Event('venues'))}).catch(()=>{});

/* ===== подбор: с кем и когда ===== */
const PK={who:null,when:'now',seed:0};
try{const s=JSON.parse(localStorage.getItem('tomsk:pick')||'null');if(s){PK.who=s.who||null;PK.when=s.when||'now'}}catch(e){}
const PK_WHO={date:'вдвоём',friends:'с друзьями',kids:'с детьми',solo:'одному'};
const PK_WHEN={now:'прямо сейчас',eve:'вечером',wknd:'в выходные'};
const PK_PAGE={date:'s-devushkoj',friends:'s-druzyami',kids:'s-detmi',eve:'vecherom',wknd:'na-vyhodnyh'};
const PK_GROUP=p=>['food','bar'].includes(p.vcat)?'eat':['nature','sight','church'].includes(p.vcat)?'walk':'do';
function tomskNow(){const d=new Date(Date.now()+(7*60+new Date().getTimezoneOffset())*60000);return{d:d.getDay(),m:d.getHours()*60+d.getMinutes()}}
function openAt(h,day,m){const P=OH.parse(h);if(!P||!P.week)return null;if(P.all)return true;
  for(const[o,c]of P.week[day])if(m>=o&&m<c)return true;const y=(day+6)%7;for(const[o,c]of P.week[y])if(c>1440&&m<c-1440)return true;return false}
// без часов работы: примерные рамки по типу места
const PK_GUESS={food:[600,1320],bar:[960,1560],nature:[420,1380],sight:[420,1380],church:[480,1140],culture:[600,1140],fun:[600,1260],shop:[600,1200]};
function fitsWhen(p,when){
  const night=(p.moods||[]).includes('night');
  const at=(d,m)=>{const r=p.hours?openAt(p.hours,d,m):null;if(r!==null)return r;const g=PK_GUESS[p.vcat];if(!g)return false;
    if(['nature','sight'].includes(p.vcat)&&m>=1140&&!night)return false;return m>=g[0]&&m<g[1]};
  if(when==='now'){const t=tomskNow();return at(t.d,t.m)&&at(t.d,(t.m+45)%1440)}
  if(when==='eve'){const t=tomskNow();if(['culture','fun','church','sight','nature','shop'].includes(p.vcat)&&!night)return false;return at(t.d,1200)}
  return at(6,780)||at(0,780)}
function rnd(seed,s){let h=seed*2654435761>>>0;for(const c of s)h=Math.imul(h^c.charCodeAt(0),2246822519)>>>0;h^=h>>>15;return(h>>>0)/4294967296}
function pickList(){
  const bad=HERO.suggest&&HERO.suggest.w==='in'&&PK.when!=='wknd';
  const pool=PLACES.filter(p=>p.vcat!=='stay'&&(p.vcat!=='shop'||(p.moods||[]).some(m=>m==='solo'||m==='date'))&&(!PK.who||(p.moods||[]).includes(PK.who)));
  let ok=pool.filter(p=>fitsWhen(p,PK.when));
  if(bad){const dry=ok.filter(p=>p.indoor);if(dry.length>=4)ok=dry}
  const sc=p=>rnd(PK.seed+1,p.id)*1.4+(p.feat?.15:0)+(p.photos&&p.photos.length?.1:0)+(p.why?.1:0)+(bad&&p.indoor?.5:0)+(PK.when==='eve'&&(p.moods||[]).includes('night')?.4:0);
  const by={eat:[],walk:[],do:[]};ok.map(p=>[p,sc(p)]).sort((a,b)=>b[1]-a[1]).forEach(([p])=>by[PK_GROUP(p)].push(p));
  const order=PK.when==='eve'?['eat','do','walk']:bad?['do','eat','walk']:['walk','eat','do'];
  const out=[];for(let r=0;out.length<6&&r<6;r++)for(const g of order){if(by[g][r]&&out.length<6)out.push(by[g][r])}
  return{list:out,total:ok.length}}
function pickCard(p){const st=p.hours?OH.status(p.hours):null;const href=VSLUG[p.id]?`${ROOT}mesto/${VSLUG[p.id]}/`:null;
  return `<article class="card pk-card" data-open="${p.id}" tabindex="0">
    <div class="media"><div style="position:absolute;inset:0;${tint(p.id)}">${scene(p.scene)}</div>${phImg(p)}<button class="fav" data-fav="${p.id}" aria-pressed="${favs.has(p.id)}" aria-label="Хочу сходить">${ico('heart')}</button>
      <span class="pk-kind">${p.kind||p.tags[0]||''}</span></div>
    <div class="card-body"><h3>${href?`<a class="card-link" href="${href}">${esc(p.name)}</a>`:p.name}</h3>${p.why||p.desc?`<p class="pk-why">${(p.why||p.desc.split('. ')[0]).replace(/\.$/,'')}</p>`:''}
    <div class="foot"><span class="price">${p.price==null?'':priceTxt(p.price)}</span>${st?`<span class="pk-st ${st.open?'on':'off'}">${st.txt}</span>`:''}</div></div></article>`}
function renderPick(){
  document.querySelectorAll('#pick [data-k]').forEach(g=>g.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(PK[g.dataset.k]===b.dataset.v))));
  const grid=document.getElementById('pkGrid');if(!grid)return;
  if(!PLACES.length){grid.innerHTML='<div class="empty">Подбираем места…</div>';return}
  const{list,total}=pickList();
  const who=PK.who?PK_WHO[PK.who]+' ':'',when=PK_WHEN[PK.when];
  $('#pkTitle').textContent=(who?'Куда сходить '+who:'Куда сходить ')+when;
  const t=tomskNow();
  $('#pkSub').textContent=!list.length?'':PK.when==='now'?`Открыто сейчас и подходит по погоде · ${total} ${plural(total,['вариант','варианта','вариантов'])}`:
    PK.when==='eve'?`Работает вечером, после 20:00 · ${total} ${plural(total,['вариант','варианта','вариантов'])}`:`Открыто в субботу или воскресенье днём · ${total} ${plural(total,['вариант','варианта','вариантов'])}`;
  const pg=PK_PAGE[PK.who]||PK_PAGE[PK.when];const l=$('#pkLink');l.href=ROOT+'kuda-shodit/'+(pg?pg+'/':'');
  l.firstChild.textContent=PK_PAGE[PK.who]?`Все идеи: куда сходить ${PK_WHO[PK.who].replace('вдвоём','с девушкой')} `:pg?`Все идеи: куда сходить ${when} `:'Все идеи ';
  $('#pkMore').hidden=total<=6;
  grid.innerHTML=list.length?list.map(pickCard).join(''):`<div class="empty">${PK.when==='now'&&(t.m<420||t.m>1380)?'Ночью почти всё закрыто. Посмотрите, что можно запланировать на вечер или выходные.':'Под эти условия ничего не нашлось. Попробуйте другой вариант.'}
    <div style="margin-top:12px;display:flex;gap:8px;justify-content:center;flex-wrap:wrap"><button class="btn btn-ghost" data-pk="eve">Вечером</button><button class="btn btn-ghost" data-pk="wknd">В выходные</button></div></div>`}
document.addEventListener('click',e=>{
  const b=e.target.closest('#pick [data-k] button');
  const q=e.target.closest('[data-pk]');
  if(b){const k=b.parentNode.dataset.k;PK[k]=k==='who'&&PK.who===b.dataset.v?null:b.dataset.v}else if(q){PK.when=q.dataset.pk}else if(e.target.closest('#pkMore')){PK.seed++}else return;
  try{localStorage.setItem('tomsk:pick',JSON.stringify({who:PK.who,when:PK.when}))}catch(e){}
  renderPick();
  if(b||q){const r=document.getElementById('pickRes');if(r&&r.getBoundingClientRect().top>innerHeight-160)r.scrollIntoView({behavior:'smooth'})}
});
document.addEventListener('venues',renderPick);

function renderAll(){renderPlaces();renderEvents();const c=$('#favCount');c.textContent=favs.size;c.hidden=!favs.size}
window.addEventListener('resize',()=>{if(popId)showPop(popId)});
[HERO.init,renderDates,renderAll,renderPick,renderMap,renderStamps].forEach(safe);if(PLACES.length)safe(roll);
if(PAGE==='places'){F.showAll=true;const P=new URLSearchParams(location.search);try{const f=JSON.parse(P.get('f')||'null');if(f){applyFilter(f,false);if(f.q){CF.q=f.q;$('#catQ').value=f.q;renderCatalog()}}}catch(e){}}

document.querySelectorAll('[data-st]').forEach(e=>{const s=OH.status(e.dataset.st);if(s){e.textContent=s.txt;e.classList.add(s.open?'on':'off')}});
