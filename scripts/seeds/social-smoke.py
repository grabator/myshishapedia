# Social Smoke okusi: sastav i opisi na osnovu zvaničnih opisa sa socialsmoke.com (novembar 2026),
# napisani našim riječima. Profili su naša procjena. Pokretanje: python3 scripts/seeds/social-smoke.py
# pravi scripts/seeds/2026-11-social-smoke.json za scripts/flavor-gen.mjs.
import json, os

F = []
def fl(slug, name, ing, prof, short, desc, mix, tags=None, mood=None, role=None):
    s, fr, fu, c = prof
    d = {"id": "social-smoke-" + slug, "brand": "social-smoke", "name": name, "ing": ing,
         "profile": {"sweetness": s, "freshness": fr, "fruitiness": fu, "cooling": c, "strength": 5},
         "short": dict(zip(("bs", "en", "de"), short)),
         "desc": {l: [p[i] for p in desc] for i, l in enumerate(("bs", "en", "de"))},
         "mix": {l: [p[i] for p in mix] for i, l in enumerate(("bs", "en", "de"))}}
    if tags: d["tags"] = tags
    if mood: d["mood"] = mood
    if role: d["mixRole"] = role
    F.append(d)

fl("absolute-zero", "Absolute Zero", ["pepermint:8", "menta:7", "kristal:9"], (4, 10, 1, 10),
   ("Mješavina više menti sa jakim, ledenim hlađenjem.", "A blend of several mints with strong, icy cooling.", "Eine Mischung aus mehreren Minzen mit starker, eisiger Kühle."),
   [("Absolute Zero je jedan od najpoznatijih Social Smoke okusa: mješavina više vrsta mente sa jakim, ledenim hlađenjem.", "Absolute Zero is one of Social Smoke's best-known flavors: a blend of several kinds of mint with strong, icy cooling.", "Absolute Zero ist einer der bekanntesten Geschmäcker von Social Smoke: eine Mischung aus mehreren Minzsorten mit starker, eisiger Kühle."),
    ("Sam je za ljubitelje jake mente, a u miksevima je jedan od najboljih načina da voću dodaš led.", "On its own it is for fans of strong mint, and in mixes it is one of the best ways to add ice to fruit.", "Pur ist er für Fans starker Minze, und in Mixen ist er eine der besten Möglichkeiten, Obst Eis zu geben.")],
   [("Absolute Zero i Watermelon, 30/70, za ledenu lubenicu.", "Absolute Zero with Watermelon, 30/70, for an icy watermelon.", "Absolute Zero mit Watermelon, 30/70, für eine eisige Wassermelone."),
    ("Absolute Zero i Tiger's Blood, 30/70, za ledene bobice.", "Absolute Zero with Tiger's Blood, 30/70, for icy berries.", "Absolute Zero mit Tiger's Blood, 30/70, für eisige Beeren.")],
   tags=["mint", "ledeni", "osvjezavajuci"], role="cooler")

fl("arctic-lemon", "Arctic Lemon", ["limun:8", "menta:7", "kristal:6"], (5, 9, 7, 7),
   ("Svježa korica limuna i ledena menta.", "Fresh lemon zest and ice-cold mint.", "Frische Zitronenschale und eiskalte Minze."),
   [("Arctic Lemon spaja svježu, hrskavu koricu limuna sa ledenom mentom.", "Arctic Lemon pairs fresh, crisp lemon zest with ice-cold mint.", "Arctic Lemon verbindet frische, knackige Zitronenschale mit eiskalter Minze."),
    ("Kiselkast je i jako osvježavajući, odličan za vruće dane.", "It is tangy and very refreshing, great for hot days.", "Er ist säuerlich und sehr erfrischend, super für heiße Tage.")],
   [("Arctic Lemon i Watermelon, za ledenu limunadu od lubenice.", "Arctic Lemon with Watermelon for an icy watermelon lemonade.", "Arctic Lemon mit Watermelon für eine eisige Wassermelonen-Limonade."),
    ("Arctic Lemon i Blackberry, za ledenu limunadu od kupine.", "Arctic Lemon with Blackberry for an icy blackberry lemonade.", "Arctic Lemon mit Blackberry für eine eisige Brombeer-Limonade.")])

fl("baja-blue", "Baja Blue", ["borovnica:8", "malina:6", "grozdje:6", "cokolada:4:Mliječna čokolada|Milk chocolate|Milchschokolade:#8a5a3a"], (8, 4, 9, 0),
   ("Borovnica, malina i grožđe sa notom mliječne čokolade.", "Blueberry, raspberry and grape with a touch of milk chocolate.", "Heidelbeere, Himbeere und Traube mit einem Hauch Milchschokolade."),
   [("Baja Blue je voćni mix borovnice, maline i grožđa.", "Baja Blue is a fruit blend of blueberry, raspberry and grape.", "Baja Blue ist eine Fruchtmischung aus Heidelbeere, Himbeere und Traube."),
    ("Na kraju dolazi nota mliječne čokolade, pa okus podsjeća na voće prelito čokoladom.", "A touch of milk chocolate comes at the end, so it recalls fruit dipped in chocolate.", "Am Ende kommt ein Hauch Milchschokolade, deshalb erinnert er an Obst mit Schokolade.")],
   [("Baja Blue i Absolute Zero, 80/20, za hladnije bobice.", "Baja Blue with Absolute Zero, 80/20, for cooler berries.", "Baja Blue mit Absolute Zero, 80/20, für kühlere Beeren."),
    ("Baja Blue i Coconut, za voćni desert.", "Baja Blue with Coconut for a fruity dessert.", "Baja Blue mit Coconut für ein fruchtiges Dessert.")])

fl("banana-foster", "Banana Foster", ["banana:8", "karamel:6:Smeđi šećer i puter|Brown sugar and butter|Brauner Zucker und Butter:#b7742f", "liker:4:Tamni rum|Dark rum|Dunkler Rum:#b5651d", "sladoled:5:Sladoled od vanile|Vanilla ice cream|Vanilleeis:#f5e9c8"], (9, 2, 6, 0),
   ("Topla banana sa puterom, smeđim šećerom, rumom i sladoledom od vanile.", "Warm banana with butter, brown sugar, rum and vanilla ice cream.", "Warme Banane mit Butter, braunem Zucker, Rum und Vanilleeis."),
   [("Banana Foster je inspirisan poznatim desertom iz New Orleansa: topla banana sa puterom, smeđim šećerom i tamnim rumom.", "Banana Foster is inspired by the famous New Orleans dessert: warm banana with butter, brown sugar and dark rum.", "Banana Foster ist vom bekannten Dessert aus New Orleans inspiriert: warme Banane mit Butter, braunem Zucker und dunklem Rum."),
    ("Na vrhu je sladoled od vanile, pa je okus bogat, sladak i kremast.", "It is topped with vanilla ice cream, so the flavor is rich, sweet and creamy.", "Obendrauf kommt Vanilleeis, deshalb ist der Geschmack reich, süß und cremig.")],
   [("Banana Foster i Coconut, za tropski desert.", "Banana Foster with Coconut for a tropical dessert.", "Banana Foster mit Coconut für ein tropisches Dessert."),
    ("Banana Foster i Cinnamon Roll, za desert sa cimetom.", "Banana Foster with Cinnamon Roll for a cinnamon dessert.", "Banana Foster mit Cinnamon Roll für ein Dessert mit Zimt.")],
   tags=["desertni", "slatki", "nocni"])

fl("berry-punch", "Berry Punch", ["kupina:8:Bobičasto voće|Mixed berries|Beerenmix:#7a2f6b"], (7, 5, 9, 0),
   ("Jak mix zrelih bobica sa voćnim završetkom.", "A bold mix of ripe berries with a fruity finish.", "Eine kräftige Mischung reifer Beeren mit fruchtigem Abgang."),
   [("Berry Punch je jak mix zrelog bobičastog voća.", "Berry Punch is a bold mix of ripe berries.", "Berry Punch ist eine kräftige Mischung reifer Beeren."),
    ("Okus je sladak i voćan od početka do kraja, kao voćni punč.", "The flavor is sweet and fruity from start to finish, like a fruit punch.", "Der Geschmack ist von Anfang bis Ende süß und fruchtig, wie ein Fruchtpunsch.")],
   [("Berry Punch i Lemon, za limunadu od bobica.", "Berry Punch with Lemon for a berry lemonade.", "Berry Punch mit Lemon für eine Beeren-Limonade."),
    ("Berry Punch i Absolute Zero, 80/20, za ledene bobice.", "Berry Punch with Absolute Zero, 80/20, for icy berries.", "Berry Punch mit Absolute Zero, 80/20, für eisige Beeren.")])

fl("blackberry", "Blackberry", ["kupina:9:Kupina|Blackberry|Brombeere"], (7, 5, 8, 0),
   ("Tamna kupina, slatka i kiselkasta.", "Dark blackberry, sweet and tart.", "Dunkle Brombeere, süß und säuerlich."),
   [("Blackberry je sočna tamna kupina sa ravnotežom slatkog i kiselog.", "Blackberry is a juicy dark blackberry with a balance of sweet and tart.", "Blackberry ist eine saftige dunkle Brombeere mit einem Gleichgewicht aus süß und sauer."),
    ("Dobar je sam i kao tamna voćna baza za mikseve.", "Good on its own and as a dark fruit base for mixes.", "Gut pur und als dunkle Fruchtbasis für Mixe.")],
   [("Blackberry i Arctic Lemon, za ledenu limunadu od kupine.", "Blackberry with Arctic Lemon for an icy blackberry lemonade.", "Blackberry mit Arctic Lemon für eine eisige Brombeer-Limonade."),
    ("Blackberry i Mint, 70/30, za kupinu sa mentom.", "Blackberry with Mint, 70/30, for blackberry with mint.", "Blackberry mit Mint, 70/30, für Brombeere mit Minze.")])

fl("blue-raspberry", "Blue Raspberry", ["malina:8", "bombon:5:Plavi bombon|Blue candy|Blaues Bonbon:#3d6fd8"], (8, 5, 8, 0),
   ("Slatka i kisela malina sa daškom plavog bombona.", "Sweet and tart raspberry with a hint of blue candy.", "Süße und saure Himbeere mit einem Hauch blauem Bonbon."),
   [("Blue Raspberry spaja slatku zrelu malinu i kiselu malinu.", "Blue Raspberry combines sweet ripe raspberry and tart raspberry.", "Blue Raspberry verbindet süße reife Himbeere und saure Himbeere."),
    ("Dašak plavog bombona ga čini sličnim plavim lizalicama i sokovima.", "A hint of blue candy makes it taste like blue lollipops and drinks.", "Ein Hauch blaues Bonbon lässt ihn wie blaue Lutscher und Getränke schmecken.")],
   [("Blue Raspberry i Lemon, za plavu limunadu.", "Blue Raspberry with Lemon for a blue lemonade.", "Blue Raspberry mit Lemon für eine blaue Limonade."),
    ("Blue Raspberry i Absolute Zero, 80/20, za ledeni bombon.", "Blue Raspberry with Absolute Zero, 80/20, for an icy candy.", "Blue Raspberry mit Absolute Zero, 80/20, für ein eisiges Bonbon.")])

fl("cali-peach", "Cali Peach", ["breskva:9"], (8, 5, 8, 0),
   ("Mekana, slatka ljetna breskva.", "Smooth, sweet summer peach.", "Weicher, süßer Sommerpfirsich."),
   [("Cali Peach je mekana, slatka breskva, kao zrela breskva usred ljeta.", "Cali Peach is a smooth, sweet peach, like a ripe peach in the middle of summer.", "Cali Peach ist ein weicher, süßer Pfirsich, wie ein reifer Pfirsich mitten im Sommer."),
    ("Okus je opušten i lagan, dobar za duge ljetne sesije.", "The flavor is relaxed and easy, good for long summer sessions.", "Der Geschmack ist entspannt und leicht, gut für lange Sommer-Sessions.")],
   [("Cali Peach i Mint, 70/30, za breskvu sa mentom.", "Cali Peach with Mint, 70/30, for peach with mint.", "Cali Peach mit Mint, 70/30, für Pfirsich mit Minze."),
    ("Cali Peach i Chai Latte, za čaj od breskve.", "Cali Peach with Chai Latte for a peach tea.", "Cali Peach mit Chai Latte für einen Pfirsichtee.")])

fl("cantaloupe-chill", "Cantaloupe Chill", ["dinja:8:Kantalupa|Cantaloupe|Cantaloupe-Melone:#f6a35a", "menta:6"], (7, 8, 8, 5),
   ("Slatka kantalupa dinja sa hladnom mentom.", "Sweet cantaloupe melon with cool mint.", "Süße Cantaloupe-Melone mit kühler Minze."),
   [("Cantaloupe Chill je slatka, osvježavajuća kantalupa dinja sa hladnom mentom.", "Cantaloupe Chill is sweet, refreshing cantaloupe melon with cool mint.", "Cantaloupe Chill ist süße, erfrischende Cantaloupe-Melone mit kühler Minze."),
    ("Dinja je glavna, a menta je tu da osvježi izdah.", "The melon leads, and the mint is there to freshen the exhale.", "Die Melone steht vorne, und die Minze erfrischt das Ausatmen.")],
   [("Cantaloupe Chill i Watermelon, za duplu dinju sa mentom.", "Cantaloupe Chill with Watermelon for a double melon with mint.", "Cantaloupe Chill mit Watermelon für eine doppelte Melone mit Minze."),
    ("Cantaloupe Chill i Cali Peach, za ljetni voćni mix.", "Cantaloupe Chill with Cali Peach for a summer fruit mix.", "Cantaloupe Chill mit Cali Peach für einen Sommer-Fruchtmix.")])

fl("chai-latte", "Chai Latte", ["caj:8:Crni čaj|Black tea|Schwarzer Tee", "kardamom:5"], (5, 3, 1, 0),
   ("Crni čaj sa daškom kardamoma.", "Black tea with a touch of cardamom.", "Schwarzer Tee mit einem Hauch Kardamom."),
   [("Chai Latte je jak crni čaj sa daškom kardamoma.", "Chai Latte is brisk black tea with a touch of cardamom.", "Chai Latte ist kräftiger schwarzer Tee mit einem Hauch Kardamom."),
    ("Nije voćni okus, nego topao i začinski, za mirne večernje sesije.", "It is not a fruit flavor but a warm, spiced one, for calm evening sessions.", "Er ist kein fruchtiger, sondern ein warmer, würziger Geschmack, für ruhige Abend-Sessions.")],
   [("Chai Latte i Cali Peach, za čaj od breskve.", "Chai Latte with Cali Peach for a peach tea.", "Chai Latte mit Cali Peach für einen Pfirsichtee."),
    ("Chai Latte i French Vanilla, za kremasti chai.", "Chai Latte with French Vanilla for a creamy chai.", "Chai Latte mit French Vanilla für einen cremigen Chai.")],
   tags=["caj", "zacinski", "nocni"])

fl("cigar", "Cigar", ["bilje:9:Duhanski list|Tobacco leaf|Tabakblatt:#8a5a3a"], (3, 2, 1, 0),
   ("Dubok, zaobljen okus prirodnog duhanskog lista.", "The deep, rounded taste of natural tobacco leaf.", "Der tiefe, runde Geschmack von natürlichem Tabakblatt."),
   [("Cigar nije voćni okus: to je mekan, dubok okus prirodnog duhanskog lista.", "Cigar is not a fruit flavor: it is the smooth, deep taste of natural tobacco leaf.", "Cigar ist kein fruchtiger Geschmack: Es ist der weiche, tiefe Geschmack von natürlichem Tabakblatt."),
    ("Za one koji vole okus samog duhana, ili žele da voćnim miksevima dodaju dubinu.", "For people who like the taste of tobacco itself, or want to add depth to fruit mixes.", "Für alle, die den Geschmack von Tabak selbst mögen, oder Fruchtmixen mehr Tiefe geben wollen.")],
   [("Cigar i French Vanilla, za cigaru sa vanilom.", "Cigar with French Vanilla for a vanilla cigar.", "Cigar mit French Vanilla für eine Zigarre mit Vanille."),
    ("Cigar i Dulce De Leche, za cigaru sa karamelom.", "Cigar with Dulce De Leche for a caramel cigar.", "Cigar mit Dulce De Leche für eine Zigarre mit Karamell.")],
   tags=["klasicni", "nocni"], mood="night")
F[-1]["similar"] = ["adalya-wind-of-cuba", "social-smoke-french-vanilla", "social-smoke-dulce-de-leche"]

fl("cinnamint", "Cinnamint", ["cimet:8", "menta:6"], (5, 7, 1, 5),
   ("Ljuti cimet sa osvježavajućom mentom.", "Hot cinnamon with refreshing mint.", "Scharfer Zimt mit erfrischender Minze."),
   [("Cinnamint spaja vatren, ljut cimet sa osvježavajućom mentom u pozadini.", "Cinnamint pairs fiery, hot cinnamon with refreshing mint in the background.", "Cinnamint verbindet feurigen, scharfen Zimt mit erfrischender Minze im Hintergrund."),
    ("Okus podsjeća na cimet žvaku: topao naprijed, hladan na kraju.", "It recalls cinnamon gum: warm up front, cool at the end.", "Er erinnert an Zimtkaugummi: vorne warm, am Ende kühl.")],
   [("Cinnamint i Double Apple, za jabuku sa cimetom.", "Cinnamint with Double Apple for apple and cinnamon.", "Cinnamint mit Double Apple für Apfel mit Zimt."),
    ("Cinnamint i Orange, za zimski začinski kotlić.", "Cinnamint with Orange for a spiced winter bowl.", "Cinnamint mit Orange für einen würzigen Winterkopf.")],
   tags=["zacinski", "mint"])

fl("cinnamon-roll", "Cinnamon Roll", ["rolat:8:Rolat sa cimetom|Cinnamon roll|Zimtschnecke:#c98a45", "vanila:6:Glazura|Frosting|Zuckerguss"], (9, 2, 1, 0),
   ("Topli rolat sa cimetom i bogatom glazurom.", "A warm cinnamon roll with rich frosting.", "Eine warme Zimtschnecke mit reichem Zuckerguss."),
   [("Cinnamon Roll je desert u nargili: svježe pečen, topao rolat sa cimetom.", "Cinnamon Roll is a dessert in a bowl: a freshly baked, warm cinnamon roll.", "Cinnamon Roll ist ein Dessert im Kopf: eine frisch gebackene, warme Zimtschnecke."),
    ("Na vrhu je bogata, slatka glazura, pa je okus pun i sladak.", "It is topped with rich, sweet frosting, so the flavor is full and sweet.", "Obendrauf kommt reicher, süßer Zuckerguss, deshalb ist der Geschmack voll und süß.")],
   [("Cinnamon Roll i Double Apple, za pitu od jabuke.", "Cinnamon Roll with Double Apple for an apple pie.", "Cinnamon Roll mit Double Apple für einen Apfelkuchen."),
    ("Cinnamon Roll i Chai Latte, za čaj sa kolačem.", "Cinnamon Roll with Chai Latte for tea and cake.", "Cinnamon Roll mit Chai Latte für Tee und Kuchen.")],
   tags=["desertni", "slatki", "zacinski"])

fl("citrus-chill", "Citrus Chill", ["narandza:7:Citrusi|Citrus|Zitrus", "limun:6", "menta:6"], (6, 9, 7, 6),
   ("Živ, kiselkast citrus sa mirnim, hladnim završetkom.", "A lively, zesty citrus kick with a calm, cool finish.", "Ein lebendiger, spritziger Zitrus-Kick mit ruhigem, kühlem Abgang."),
   [("Citrus Chill je energičan citrusni okus sa kiselinom naprijed.", "Citrus Chill is an energetic citrus flavor with tang up front.", "Citrus Chill ist ein energiegeladener Zitrus-Geschmack mit Säure vorne."),
    ("Završetak je miran i hladan, pa je okus svjež od početka do kraja.", "The finish is calm and cool, so the flavor stays fresh from start to finish.", "Der Abgang ist ruhig und kühl, deshalb bleibt der Geschmack von Anfang bis Ende frisch.")],
   [("Citrus Chill i Berry Punch, za ledeni punč.", "Citrus Chill with Berry Punch for an icy punch.", "Citrus Chill mit Berry Punch für einen eisigen Punsch."),
    ("Citrus Chill i Watermelon, za ljetnu citrusnu lubenicu.", "Citrus Chill with Watermelon for a summery citrus watermelon.", "Citrus Chill mit Watermelon für eine sommerliche Zitrus-Wassermelone.")])

fl("citrus-peach", "Citrus Peach", ["breskva:8", "narandza:6:Citrusi|Citrus|Zitrus"], (7, 6, 8, 0),
   ("Kiseli citrus i topla, mekana breskva.", "Tart citrus with warm, soft peach.", "Säuerliche Zitrus mit warmem, weichem Pfirsich."),
   [("Citrus Peach spaja kiseli citrus sa toplom, mekanom breskvom.", "Citrus Peach pairs tart citrus with warm, soft peach.", "Citrus Peach verbindet säuerliche Zitrus mit warmem, weichem Pfirsich."),
    ("Okus je sunčan i voćan, sa ravnotežom slatkog i kiselog.", "The flavor is sunny and fruity, with a balance of sweet and tart.", "Der Geschmack ist sonnig und fruchtig, mit einem Gleichgewicht aus süß und sauer.")],
   [("Citrus Peach i Mint, 70/30, za svježu breskvu.", "Citrus Peach with Mint, 70/30, for a fresh peach.", "Citrus Peach mit Mint, 70/30, für einen frischen Pfirsich."),
    ("Citrus Peach i Chai Latte, za ledeni čaj od breskve.", "Citrus Peach with Chai Latte for a peach iced tea.", "Citrus Peach mit Chai Latte für einen Pfirsich-Eistee.")])

fl("coconut", "Coconut", ["kokos:9"], (7, 3, 5, 0),
   ("Bogat, mliječan i kremast kokos.", "Rich, milky, creamy coconut.", "Reiche, milchige, cremige Kokosnuss."),
   [("Coconut je bogat, mliječan kokos punog, kremastog okusa.", "Coconut is a rich, milky coconut with a full, creamy taste.", "Coconut ist eine reiche, milchige Kokosnuss mit vollem, cremigem Geschmack."),
    ("Najbolje se pokazuje u miksevima, gdje drugim okusima daje kremastu, tropsku notu.", "It shines most in mixes, where it gives other flavors a creamy, tropical note.", "Am besten zeigt er sich in Mixen, wo er anderen Geschmäckern eine cremige, tropische Note gibt.")],
   [("Coconut i Sunbeam, za tropski kotlić.", "Coconut with Sunbeam for a tropical bowl.", "Coconut mit Sunbeam für einen tropischen Kopf."),
    ("Coconut i Banana Foster, za tropski desert.", "Coconut with Banana Foster for a tropical dessert.", "Coconut mit Banana Foster für ein tropisches Dessert.")],
   tags=["tropski", "slatki", "desertni"])

fl("cucumber-chill", "Cucumber Chill", ["krastavac:8", "menta:7", "bilje:4:Cvjetne i biljne note|Floral and herbal notes|Blumige und kräuterige Noten:#8fae6a"], (4, 9, 5, 6),
   ("Svježi krastavac i menta sa cvjetnim i biljnim notama.", "Fresh green cucumber and mint with floral and herbal notes.", "Frische grüne Gurke und Minze mit blumigen und kräuterigen Noten."),
   [("Cucumber Chill spaja svježi zeleni krastavac i osvježavajuću mentu.", "Cucumber Chill pairs fresh green cucumber with invigorating mint.", "Cucumber Chill verbindet frische grüne Gurke mit belebender Minze."),
    ("U pozadini su cvjetne i biljne note, pa je okus smirujući i mirisan.", "Floral and herbal notes sit in the background, so the flavor is calming and fragrant.", "Im Hintergrund sind blumige und kräuterige Noten, deshalb ist der Geschmack beruhigend und duftend.")],
   [("Cucumber Chill i Lime, za mojito sa krastavcem.", "Cucumber Chill with Lime for a cucumber mojito.", "Cucumber Chill mit Lime für einen Gurken-Mojito."),
    ("Cucumber Chill i Watermelon, za ljetni zeleni mix.", "Cucumber Chill with Watermelon for a summery green mix.", "Cucumber Chill mit Watermelon für einen sommerlichen grünen Mix.")],
   tags=["biljni", "mint", "osvjezavajuci"])

fl("double-apple", "Double Apple", ["jabuka:8:Crvena jabuka|Red apple|Roter Apfel", "jabuka:6:Žuta jabuka|Yellow apple|Gelber Apfel:#e8c547", "anis:6:Sladić i začini|Licorice and spices|Lakritz und Gewürze"], (6, 3, 6, 0),
   ("Crvena i žuta jabuka sa sladićem i začinima.", "Red and yellow apple with licorice and spices.", "Roter und gelber Apfel mit Lakritz und Gewürzen."),
   [("Double Apple je klasik: hrskava Red Delicious jabuka i slatka žuta jabuka.", "Double Apple is a classic: crisp Red Delicious apple and sweet yellow apple.", "Double Apple ist ein Klassiker: knackiger Red-Delicious-Apfel und süßer gelber Apfel."),
    ("Sladić i začini mu daju toplu, tradicionalnu notu.", "Licorice and spices give it a warm, traditional note.", "Lakritz und Gewürze geben ihm eine warme, traditionelle Note.")],
   [("Double Apple i Mint, 70/30, za klasičnu jabuku sa mentom.", "Double Apple with Mint, 70/30, for classic apple with mint.", "Double Apple mit Mint, 70/30, für klassischen Apfel mit Minze."),
    ("Double Apple i Cinnamint, za jabuku sa cimetom.", "Double Apple with Cinnamint for apple and cinnamon.", "Double Apple mit Cinnamint für Apfel mit Zimt.")],
   tags=["klasicni", "vocni", "zacinski"])

fl("dulce-de-leche", "Dulce De Leche", ["karamel:9:Karamel|Caramel|Karamell", "sejk:5:Krema|Cream|Sahne"], (9, 2, 1, 0),
   ("Zlatni karamel sa slatkim, kremastim završetkom.", "Golden caramel with a sweet, creamy finish.", "Goldenes Karamell mit süßem, cremigem Abgang."),
   [("Dulce De Leche je gust, zlatni karamel, kao latinoamerički karamel od mlijeka.", "Dulce De Leche is thick golden caramel, like the Latin American milk caramel.", "Dulce De Leche ist dickes, goldenes Karamell, wie das lateinamerikanische Milchkaramell."),
    ("Završetak je sladak i kremast, za ljubitelje desertnih okusa.", "The finish is sweet and creamy, for fans of dessert flavors.", "Der Abgang ist süß und cremig, für Fans von Dessert-Geschmäckern.")],
   [("Dulce De Leche i Banana Foster, za karamel bananu.", "Dulce De Leche with Banana Foster for a caramel banana.", "Dulce De Leche mit Banana Foster für eine Karamell-Banane."),
    ("Dulce De Leche i Golden Delicious Apple, za karamel jabuku.", "Dulce De Leche with Golden Delicious Apple for a caramel apple.", "Dulce De Leche mit Golden Delicious Apple für einen Karamellapfel.")],
   tags=["desertni", "slatki", "nocni"])

fl("french-vanilla", "French Vanilla", ["vanila:9", "cimet:3:Egzotični začini|Exotic spices|Exotische Gewürze"], (8, 2, 1, 0),
   ("Čista vanila sa egzotičnim začinima.", "Pure vanilla with exotic spices.", "Reine Vanille mit exotischen Gewürzen."),
   [("French Vanilla je elegantan spoj čiste vanile i egzotičnih začina.", "French Vanilla is an elegant blend of pure vanilla and exotic spices.", "French Vanilla ist eine elegante Mischung aus reiner Vanille und exotischen Gewürzen."),
    ("Mekan je i sladak, a začini mu daju malo topline.", "It is soft and sweet, and the spices give it a little warmth.", "Er ist weich und süß, und die Gewürze geben ihm etwas Wärme.")],
   [("French Vanilla i Chai Latte, za kremasti chai.", "French Vanilla with Chai Latte for a creamy chai.", "French Vanilla mit Chai Latte für einen cremigen Chai."),
    ("French Vanilla i Cigar, za cigaru sa vanilom.", "French Vanilla with Cigar for a vanilla cigar.", "French Vanilla mit Cigar für eine Zigarre mit Vanille.")],
   tags=["desertni", "slatki"])

fl("ginger-tea", "Ginger Tea", ["djumbir:8", "caj:6"], (5, 5, 1, 0),
   ("Začinski čaj sa đumbirom.", "A spicy, ginger-spiked tea.", "Ein würziger Tee mit Ingwer."),
   [("Ginger Tea je čaj sa đumbirom, inspirisan Azijom.", "Ginger Tea is a ginger-spiked tea inspired by Asia.", "Ginger Tea ist ein Tee mit Ingwer, inspiriert von Asien."),
    ("Đumbir daje ljutkastu, živu notu koja budi čula.", "The ginger gives a spicy, lively note that wakes up the senses.", "Der Ingwer gibt eine scharfe, lebendige Note, die die Sinne weckt.")],
   [("Ginger Tea i Lemon, za čaj od đumbira i limuna.", "Ginger Tea with Lemon for a ginger lemon tea.", "Ginger Tea mit Lemon für einen Ingwer-Zitronen-Tee."),
    ("Ginger Tea i Orange, za zimski čaj.", "Ginger Tea with Orange for a winter tea.", "Ginger Tea mit Orange für einen Wintertee.")],
   tags=["caj", "zacinski"])

fl("golden-delicious-apple", "Golden Delicious Apple", ["jabuka:9:Žuta jabuka|Yellow apple|Gelber Apfel:#e8c547"], (7, 6, 8, 0),
   ("Slatka, hrskava žuta jabuka.", "A sweet, crisp golden apple.", "Ein süßer, knackiger goldener Apfel."),
   [("Golden Delicious Apple je slatka, hrskava žuta jabuka, kao iz sunčanog voćnjaka.", "Golden Delicious Apple is a sweet, crisp golden apple, like one from a sunny orchard.", "Golden Delicious Apple ist ein süßer, knackiger goldener Apfel, wie aus einem sonnigen Obstgarten."),
    ("Za razliku od Double Applea, nema anisa ni začina, pa je to čista jabuka.", "Unlike Double Apple, there is no anise or spice, so it is pure apple.", "Anders als Double Apple gibt es keinen Anis und keine Gewürze, deshalb ist es reiner Apfel.")],
   [("Golden Delicious Apple i Dulce De Leche, za karamel jabuku.", "Golden Delicious Apple with Dulce De Leche for a caramel apple.", "Golden Delicious Apple mit Dulce De Leche für einen Karamellapfel."),
    ("Golden Delicious Apple i Mint, 70/30, za svježu jabuku.", "Golden Delicious Apple with Mint, 70/30, for a fresh apple.", "Golden Delicious Apple mit Mint, 70/30, für einen frischen Apfel.")])

fl("grape", "Grape", ["grozdje:9"], (7, 5, 8, 0),
   ("Mix crnog, crvenog i zelenog grožđa.", "A mix of black, red and green grapes.", "Eine Mischung aus schwarzen, roten und grünen Trauben."),
   [("Grape spaja tri vrste grožđa: crno, crveno i zeleno.", "Grape blends three kinds of grapes: black, red and green.", "Grape mischt drei Traubensorten: schwarz, rot und grün."),
    ("Okus je zato puniji od običnog grožđa, sladak i sočan.", "That makes it fuller than plain grape, sweet and juicy.", "Deshalb ist er voller als einfache Traube, süß und saftig.")],
   [("Grape i Mint, 70/30, za klasično grožđe sa mentom.", "Grape with Mint, 70/30, for classic grape mint.", "Grape mit Mint, 70/30, für klassische Traube mit Minze."),
    ("Grape i Berry Punch, za tamno voće.", "Grape with Berry Punch for dark fruit.", "Grape mit Berry Punch für dunkles Obst.")])

fl("grape-chill", "Grape Chill", ["grozdje:9", "menta:5"], (7, 7, 8, 4),
   ("Zrelo, slatko grožđe sa nježnom mentom.", "Ripe, sweet grapes with delicate mint.", "Reife, süße Trauben mit zarter Minze."),
   [("Grape Chill je zrelo, slatko grožđe sa nježnom notom mente.", "Grape Chill is ripe, sweet grape with a delicate mint note.", "Grape Chill ist reife, süße Traube mit einer zarten Minznote."),
    ("Menta je blaga, pa grožđe ostaje glavno.", "The mint is gentle, so the grape stays in the lead.", "Die Minze ist sanft, deshalb bleibt die Traube vorne.")],
   [("Grape Chill i Blackberry, za tamno voće sa mentom.", "Grape Chill with Blackberry for dark fruit with mint.", "Grape Chill mit Blackberry für dunkles Obst mit Minze."),
    ("Grape Chill i Lemon, za kiselkastije grožđe.", "Grape Chill with Lemon for a tangier grape.", "Grape Chill mit Lemon für eine säuerlichere Traube.")])

fl("grapefruit-chill", "Grapefruit Chill", ["grejpfrut:8", "menta:6", "grejpfrut:4:Pomelo|Pomelo|Pomelo:#e8e07a"], (5, 9, 7, 5),
   ("Kisela korica grejpfruta, menta i gorkasti pomelo.", "Tart grapefruit peel, garden mint and bitter pomelo.", "Herbe Grapefruitschale, Gartenminze und bittere Pomelo."),
   [("Grapefruit Chill spaja kiselu koricu grejpfruta, baštensku mentu i gorkasti pomelo.", "Grapefruit Chill combines tart grapefruit peel, garden mint and bitter pomelo.", "Grapefruit Chill verbindet herbe Grapefruitschale, Gartenminze und bittere Pomelo."),
    ("Sočni citrusi i hladan završetak ga čine jako osvježavajućim.", "Juicy citrus and a cool finish make it very refreshing.", "Saftige Zitrus und ein kühler Abgang machen ihn sehr erfrischend.")],
   [("Grapefruit Chill i Berry Punch, za ružičastu limunadu.", "Grapefruit Chill with Berry Punch for a pink lemonade.", "Grapefruit Chill mit Berry Punch für eine pinke Limonade."),
    ("Grapefruit Chill i Watermelon, za ljetni citrus.", "Grapefruit Chill with Watermelon for a summery citrus.", "Grapefruit Chill mit Watermelon für eine sommerliche Zitrus.")])

fl("gumtastic", "Gumtastic", ["zvaka:7:Mastika|Mastic gum|Mastix", "kupina:4:Voćne note|Fruity notes|Fruchtige Noten:#e8457a", "vanila:4"], (7, 6, 4, 2),
   ("Mastika žvaka sa voćnim notama i vanilom.", "Mastic gum with fruity notes and vanilla.", "Mastix-Kaugummi mit fruchtigen Noten und Vanille."),
   [("Gumtastic je biljni, aromatičan okus mastike, smole od koje se pravi tradicionalna žvaka.", "Gumtastic is an herbal, aromatic mastic flavor, from the resin used in traditional chewing gum.", "Gumtastic ist ein kräuteriger, aromatischer Mastix-Geschmack, aus dem Harz für traditionellen Kaugummi."),
    ("Voćne note i vanila ga omekšaju, pa je okus svjež i sladak.", "Fruity notes and vanilla soften it, so the flavor is fresh and sweet.", "Fruchtige Noten und Vanille machen ihn weicher, deshalb ist der Geschmack frisch und süß.")],
   [("Gumtastic i Mint, 70/30, za klasičnu žvaku sa mentom.", "Gumtastic with Mint, 70/30, for a classic gum with mint.", "Gumtastic mit Mint, 70/30, für einen klassischen Kaugummi mit Minze."),
    ("Gumtastic i Berry Punch, za voćnu žvaku.", "Gumtastic with Berry Punch for a fruity gum.", "Gumtastic mit Berry Punch für einen fruchtigen Kaugummi.")],
   tags=["bombon", "biljni", "slatki"])

fl("honeydew-melon", "Honeydew Melon", ["dinja:9:Medena dinja|Honeydew melon|Honigmelone"], (7, 6, 8, 0),
   ("Klasična, sočna medena dinja.", "Classic, succulent honeydew melon.", "Klassische, saftige Honigmelone."),
   [("Honeydew Melon je klasična, sočna medena dinja prirodnog okusa.", "Honeydew Melon is a classic, succulent honeydew with a natural taste.", "Honeydew Melon ist eine klassische, saftige Honigmelone mit natürlichem Geschmack."),
    ("Bez mente je, pa je okus čist i voćni.", "It has no mint, so the flavor is clean and fruity.", "Sie hat keine Minze, deshalb ist der Geschmack klar und fruchtig.")],
   [("Honeydew Melon i Watermelon, za duplu dinju.", "Honeydew Melon with Watermelon for a double melon.", "Honeydew Melon mit Watermelon für eine doppelte Melone."),
    ("Honeydew Melon i Absolute Zero, 80/20, za ledenu dinju.", "Honeydew Melon with Absolute Zero, 80/20, for an icy melon.", "Honeydew Melon mit Absolute Zero, 80/20, für eine eisige Melone.")])

fl("honeydew-melon-chill", "Honeydew Melon Chill", ["dinja:8:Medena dinja|Honeydew melon|Honigmelone", "menta:6"], (7, 8, 8, 5),
   ("Medena dinja sa mentom, nježna i osvježavajuća.", "Honeydew melon with mint, delicate and refreshing.", "Honigmelone mit Minze, zart und erfrischend."),
   [("Honeydew Melon Chill je medena dinja sa dodatkom mente.", "Honeydew Melon Chill is honeydew melon with added mint.", "Honeydew Melon Chill ist Honigmelone mit Minze."),
    ("Okus je nježan i osvježavajući, dobar za ljeto.", "The flavor is delicate and refreshing, good for summer.", "Der Geschmack ist zart und erfrischend, gut für den Sommer.")],
   [("Honeydew Melon Chill i Watermelon Chill, za ledene dinje.", "Honeydew Melon Chill with Watermelon Chill for icy melons.", "Honeydew Melon Chill mit Watermelon Chill für eisige Melonen."),
    ("Honeydew Melon Chill i Lemon, za limunadu od dinje.", "Honeydew Melon Chill with Lemon for a melon lemonade.", "Honeydew Melon Chill mit Lemon für eine Melonen-Limonade.")])

fl("hong-kong-milk-tea", "Hong Kong Milk Tea", ["caj:8:Crni čaj|Black tea|Schwarzer Tee", "sejk:6:Mlijeko|Milk|Milch"], (6, 3, 1, 0),
   ("Crni čaj sa kremastim mlijekom i malo šećera.", "Black tea with creamy milk and a dash of sugar.", "Schwarzer Tee mit cremiger Milch und etwas Zucker."),
   [("Hong Kong Milk Tea je mekan crni čaj umiješan sa kremastim mlijekom.", "Hong Kong Milk Tea is smooth black tea swirled with creamy milk.", "Hong Kong Milk Tea ist weicher schwarzer Tee mit cremiger Milch."),
    ("Malo šećera ga zaokruži, pa je okus blag i kremast.", "A dash of sugar rounds it off, so the flavor is mild and creamy.", "Etwas Zucker rundet ihn ab, deshalb ist der Geschmack mild und cremig.")],
   [("Hong Kong Milk Tea i Coconut, za kokos čaj sa mlijekom.", "Hong Kong Milk Tea with Coconut for a coconut milk tea.", "Hong Kong Milk Tea mit Coconut für einen Kokos-Milchtee."),
    ("Hong Kong Milk Tea i Dulce De Leche, za karamel čaj.", "Hong Kong Milk Tea with Dulce De Leche for a caramel tea.", "Hong Kong Milk Tea mit Dulce De Leche für einen Karamelltee.")],
   tags=["caj", "pice", "desertni"])

fl("horchata-cajeta", "Horchata Cajeta", ["riza:7:Napitak od riže|Rice drink|Reisgetränk:#f6ecd0", "karamel:5:Karamel|Caramel|Karamell", "cimet:5"], (8, 2, 1, 0),
   ("Meksički napitak od riže sa karamelom i cimetom.", "The Mexican rice drink with caramel and cinnamon.", "Das mexikanische Reisgetränk mit Karamell und Zimt."),
   [("Horchata Cajeta je inspirisan meksičkom horčatom, napitkom od riže.", "Horchata Cajeta is inspired by Mexican horchata, a rice drink.", "Horchata Cajeta ist von mexikanischer Horchata inspiriert, einem Reisgetränk."),
    ("Karamel i cimet mu daju slatku, toplu, desertnu notu.", "Caramel and cinnamon give it a sweet, warm, dessert-like note.", "Karamell und Zimt geben ihm eine süße, warme Dessert-Note.")],
   [("Horchata Cajeta i Coconut, za kremasti kokos.", "Horchata Cajeta with Coconut for a creamy coconut.", "Horchata Cajeta mit Coconut für eine cremige Kokosnuss."),
    ("Horchata Cajeta i Banana Foster, za desertni mix.", "Horchata Cajeta with Banana Foster for a dessert mix.", "Horchata Cajeta mit Banana Foster für einen Dessert-Mix.")],
   tags=["desertni", "pice", "zacinski"])

fl("japanese-yuzu", "Japanese Yuzu", ["limun:8:Yuzu|Yuzu|Yuzu:#f2d23c", "grejpfrut:4"], (5, 8, 7, 0),
   ("Japanski citrus yuzu: kiseo kao limun, cvjetan, sa daškom grejpfruta.", "Japanese yuzu: tart like lemon, floral, with a touch of grapefruit.", "Japanische Yuzu: sauer wie Zitrone, blumig, mit einem Hauch Grapefruit."),
   [("Japanese Yuzu je okus yuzua, posebnog japanskog citrusa.", "Japanese Yuzu is the flavor of yuzu, a special Japanese citrus.", "Japanese Yuzu ist der Geschmack von Yuzu, einer besonderen japanischen Zitrusfrucht."),
    ("Kiseo je kao limun, ali ima cvjetnu notu i blagu gorčinu grejpfruta.", "It is tart like lemon, but with a floral lift and a light grapefruit bitterness.", "Er ist sauer wie Zitrone, aber mit blumiger Note und leichter Grapefruit-Bitterkeit.")],
   [("Japanese Yuzu i Mint, 70/30, za svjež citrus.", "Japanese Yuzu with Mint, 70/30, for a fresh citrus.", "Japanese Yuzu mit Mint, 70/30, für eine frische Zitrus."),
    ("Japanese Yuzu i Honeydew Melon, za dinju sa citrusom.", "Japanese Yuzu with Honeydew Melon for melon with citrus.", "Japanese Yuzu mit Honeydew Melon für Melone mit Zitrus.")])

fl("lemon", "Lemon", ["limun:9"], (6, 8, 7, 0),
   ("Sunčani limun sa kiselkastim, mekim završetkom.", "Sun-ripened lemon with a tangy, smooth finish.", "Sonnengereifte Zitrone mit säuerlichem, weichem Abgang."),
   [("Lemon je zreo, sunčan limun.", "Lemon is a ripe, sun-ripened lemon.", "Lemon ist eine reife, sonnengereifte Zitrone."),
    ("Kiselkast je, ali sa mekim završetkom, pa je dobar i sam i kao citrusna nota u miksevima.", "It is tangy but with a smooth finish, so it works on its own and as a citrus note in mixes.", "Er ist säuerlich, aber mit weichem Abgang, deshalb passt er pur und als Zitrusnote in Mixen.")],
   [("Lemon i Mint, 60/40, za limunadu sa mentom.", "Lemon with Mint, 60/40, for a mint lemonade.", "Lemon mit Mint, 60/40, für eine Minz-Limonade."),
    ("Lemon i Berry Punch, za limunadu od bobica.", "Lemon with Berry Punch for a berry lemonade.", "Lemon mit Berry Punch für eine Beeren-Limonade.")])

fl("lemon-chill", "Lemon Chill", ["limun:8", "menta:6"], (6, 9, 7, 5),
   ("Slatki, kiselkasti limun sa svježom mentom.", "Sweet and tangy lemon with fresh mint.", "Süße, säuerliche Zitrone mit frischer Minze."),
   [("Lemon Chill je slatki, kiselkasti limun sa svježom mentom.", "Lemon Chill is sweet and tangy lemon with fresh mint.", "Lemon Chill ist süße, säuerliche Zitrone mit frischer Minze."),
    ("Menta daje hladan završetak, pa je okus kao limunada sa mentom.", "The mint gives a cool finish, so it tastes like mint lemonade.", "Die Minze gibt einen kühlen Abgang, deshalb schmeckt er wie Minz-Limonade.")],
   [("Lemon Chill i Watermelon, za ljetnu limunadu.", "Lemon Chill with Watermelon for a summer lemonade.", "Lemon Chill mit Watermelon für eine Sommer-Limonade."),
    ("Lemon Chill i Blackberry, za limunadu od kupine.", "Lemon Chill with Blackberry for a blackberry lemonade.", "Lemon Chill mit Blackberry für eine Brombeer-Limonade.")])

fl("lemon-drop", "Lemon Drop", ["limun:7", "bombon:6:Limun bombon|Lemon drop candy|Zitronenbonbon:#f7e04b"], (8, 6, 6, 0),
   ("Slatki limun bomboni.", "Sweet lemon drop candies.", "Süße Zitronenbonbons."),
   [("Lemon Drop je okus slatkih limun bombona.", "Lemon Drop is the flavor of sweet lemon drop candies.", "Lemon Drop ist der Geschmack süßer Zitronenbonbons."),
    ("Slađi je od običnog limuna, sa kiselinom koja je tek u pozadini.", "It is sweeter than plain lemon, with the tang only in the background.", "Er ist süßer als einfache Zitrone, die Säure ist nur im Hintergrund.")],
   [("Lemon Drop i Mint, 70/30, za limun bombon sa mentom.", "Lemon Drop with Mint, 70/30, for a mint lemon candy.", "Lemon Drop mit Mint, 70/30, für ein Zitronenbonbon mit Minze."),
    ("Lemon Drop i Strawberry Kiwi, za voćne bombone.", "Lemon Drop with Strawberry Kiwi for fruit candies.", "Lemon Drop mit Strawberry Kiwi für Fruchtbonbons.")],
   tags=["bombon", "citrusni", "slatki"])

fl("lemon-pie", "Lemon Pie", ["limun:7", "puslica:6:Puslica|Meringue|Baiser", "kolac:5:Tijesto|Pastry|Mürbeteig"], (8, 5, 5, 0),
   ("Kiselkasti limun i slatka, kremasta puslica.", "Tangy lemon with sweet, creamy meringue.", "Säuerliche Zitrone mit süßem, cremigem Baiser."),
   [("Lemon Pie je desert: kiselkasti limun i slatka, kremasta puslica.", "Lemon Pie is a dessert: tangy lemon and sweet, creamy meringue.", "Lemon Pie ist ein Dessert: säuerliche Zitrone und süßes, cremiges Baiser."),
    ("Okus je osvježavajući i sladak u isto vrijeme, kao pita od limuna.", "The flavor is refreshing and sweet at the same time, like a lemon meringue pie.", "Der Geschmack ist erfrischend und süß zugleich, wie ein Zitronen-Baiser-Kuchen.")],
   [("Lemon Pie i French Vanilla, za kremastiju pitu.", "Lemon Pie with French Vanilla for a creamier pie.", "Lemon Pie mit French Vanilla für einen cremigeren Kuchen."),
    ("Lemon Pie i Blackberry, za pitu od limuna i kupine.", "Lemon Pie with Blackberry for a lemon blackberry pie.", "Lemon Pie mit Blackberry für einen Zitronen-Brombeer-Kuchen.")],
   tags=["desertni", "citrusni", "slatki"])

fl("lime", "Lime", ["limeta:9"], (5, 8, 7, 0),
   ("Kisela limeta sa mekim završetkom.", "Zesty lime with a tart, smooth finish.", "Spritzige Limette mit saurem, weichem Abgang."),
   [("Lime je živa, kisela limeta.", "Lime is a zesty, tart lime.", "Lime ist eine spritzige, saure Limette."),
    ("Završetak je mekan, pa nije oštra, a odlično se slaže sa mentom i voćem.", "The finish is smooth, so it is not harsh, and it goes great with mint and fruit.", "Der Abgang ist weich, deshalb ist sie nicht scharf, und sie passt super zu Minze und Obst.")],
   [("Lime i Mint, za mojito.", "Lime with Mint for a mojito.", "Lime mit Mint für einen Mojito."),
    ("Lime i Watermelon, za lubenicu sa limetom.", "Lime with Watermelon for watermelon with lime.", "Lime mit Watermelon für Wassermelone mit Limette.")])

fl("lime-chill", "Lime Chill", ["limeta:8", "menta:6"], (5, 9, 7, 5),
   ("Kisela limeta sa hladnom mentom.", "Tangy lime with cool mint.", "Säuerliche Limette mit kühler Minze."),
   [("Lime Chill je kisela limeta sa hladnom mentom.", "Lime Chill is tangy lime with cool mint.", "Lime Chill ist säuerliche Limette mit kühler Minze."),
    ("Jednostavan, jako svjež okus, blizak mojitu.", "A simple, very fresh flavor, close to a mojito.", "Ein einfacher, sehr frischer Geschmack, nah an einem Mojito.")],
   [("Lime Chill i Strawberry Margarita, za ledenu margaritu.", "Lime Chill with Strawberry Margarita for an icy margarita.", "Lime Chill mit Strawberry Margarita für eine eisige Margarita."),
    ("Lime Chill i Watermelon, za ljetni kotlić.", "Lime Chill with Watermelon for a summer bowl.", "Lime Chill mit Watermelon für einen Sommerkopf.")])

fl("mango-habanero", "Mango Habanero", ["mango:8", "kardamom:5:Habanero papričica|Habanero pepper|Habanero-Chili:#e04a2a"], (7, 4, 8, 0),
   ("Sočni mango sa ljutinom habanero papričice.", "Juicy mango with the heat of habanero pepper.", "Saftige Mango mit der Schärfe von Habanero-Chili."),
   [("Mango Habanero spaja svjež, sočan mango sa ljutom habanero papričicom.", "Mango Habanero pairs fresh, juicy mango with hot habanero pepper.", "Mango Habanero verbindet frische, saftige Mango mit scharfem Habanero-Chili."),
    ("Neobičan okus: slatko tropsko voće naprijed, a ljutina na kraju.", "An unusual flavor: sweet tropical fruit up front and heat at the end.", "Ein ungewöhnlicher Geschmack: süßes tropisches Obst vorne und Schärfe am Ende.")],
   [("Mango Habanero i Coconut, za blaži, kremasti mango.", "Mango Habanero with Coconut for a milder, creamy mango.", "Mango Habanero mit Coconut für eine mildere, cremige Mango."),
    ("Mango Habanero i Lime, za ljuti tropski koktel.", "Mango Habanero with Lime for a spicy tropical cocktail.", "Mango Habanero mit Lime für einen scharfen tropischen Cocktail.")],
   tags=["vocni", "tropski", "zacinski"])

fl("margarita", "Margarita", ["limeta:8", "liker:5:Tekila i agava|Tequila and agave|Tequila und Agave:#e8d68a"], (5, 7, 6, 0),
   ("Koktel od limete, agave i tekile.", "The cocktail of zesty lime, agave and tequila.", "Der Cocktail aus Limette, Agave und Tequila."),
   [("Margarita je inspirisana poznatim koktelom: kisela limeta, agava i tekila.", "Margarita is inspired by the famous cocktail: zesty lime, agave and tequila.", "Margarita ist vom bekannten Cocktail inspiriert: spritzige Limette, Agave und Tequila."),
    ("Okus je osvježavajući i kiselkast, za ljubitelje okusa pića.", "The flavor is refreshing and tangy, for fans of drink flavors.", "Der Geschmack ist erfrischend und säuerlich, für Fans von Getränke-Geschmäckern.")],
   [("Margarita i Strawberry Margarita, za voćnu margaritu.", "Margarita with Strawberry Margarita for a fruity margarita.", "Margarita mit Strawberry Margarita für eine fruchtige Margarita."),
    ("Margarita i Mango Habanero, za ljutu margaritu.", "Margarita with Mango Habanero for a spicy margarita.", "Margarita mit Mango Habanero für eine scharfe Margarita.")],
   tags=["pice", "citrusni", "kiseli"])

fl("melon-rush", "Melon Rush", ["dinja:8:Medena dinja|Honeydew melon|Honigmelone", "kupina:6:Bobičasto voće|Mixed berries|Beerenmix:#7a2f6b"], (7, 7, 9, 0),
   ("Slatka, hrskava medena dinja sa raznim bobicama.", "Sweet, crisp honeydew with assorted berries.", "Süße, knackige Honigmelone mit verschiedenen Beeren."),
   [("Melon Rush spaja slatku, hrskavu medenu dinju sa raznim bobičastim voćem.", "Melon Rush combines sweet, crisp honeydew with assorted berries.", "Melon Rush verbindet süße, knackige Honigmelone mit verschiedenen Beeren."),
    ("Okus je osvježavajući i voćan, dobar za ljeto.", "The flavor is refreshing and fruity, good for summer.", "Der Geschmack ist erfrischend und fruchtig, gut für den Sommer.")],
   [("Melon Rush i Absolute Zero, 80/20, za ledeni mix.", "Melon Rush with Absolute Zero, 80/20, for an icy mix.", "Melon Rush mit Absolute Zero, 80/20, für einen eisigen Mix."),
    ("Melon Rush i Lemon, za kiselkastiji kotlić.", "Melon Rush with Lemon for a tangier bowl.", "Melon Rush mit Lemon für einen säuerlicheren Kopf.")])

fl("mesmerise", "Mesmerise", ["bomboni:8:Voćni bomboni|Fruit candy|Fruchtbonbons:#ff4fa3"], (9, 4, 7, 0),
   ("Slojevit mix voćnih bombona za ljubitelje slatkog.", "A multi-layered fruit candy blend for a sweet tooth.", "Eine vielschichtige Fruchtbonbon-Mischung für Naschkatzen."),
   [("Mesmerise je slojevit mix voćnih bombona.", "Mesmerise is a multi-layered fruit candy blend.", "Mesmerise ist eine vielschichtige Fruchtbonbon-Mischung."),
    ("Jako je sladak, pa je za one koji vole bombone i slatke okuse.", "It is very sweet, so it is for people who love candy and sweet flavors.", "Er ist sehr süß, deshalb ist er für alle, die Bonbons und süße Geschmäcker lieben.")],
   [("Mesmerise i Absolute Zero, 80/20, za ledene bombone.", "Mesmerise with Absolute Zero, 80/20, for icy candy.", "Mesmerise mit Absolute Zero, 80/20, für eisige Bonbons."),
    ("Mesmerise i Lemon, ako ti je presladak.", "Mesmerise with Lemon if it is too sweet for you.", "Mesmerise mit Lemon, wenn er dir zu süß ist.")],
   tags=["bombon", "slatki", "vocni"])

fl("mint", "Mint", ["pepermint:9"], (4, 9, 1, 8),
   ("Intenzivan prirodni pepermint, mlađi brat Absolute Zera.", "Intense natural peppermint, Absolute Zero's younger sibling.", "Intensive natürliche Pfefferminze, der jüngere Bruder von Absolute Zero."),
   [("Mint je intenzivan, prirodni pepermint.", "Mint is an intense, natural peppermint.", "Mint ist eine intensive, natürliche Pfefferminze."),
    ("Social Smoke ga zove mlađim bratom Absolute Zera: svjež i živ, ali čistiji i manje leden.", "Social Smoke calls it Absolute Zero's younger sibling: fresh and lively, but cleaner and less icy.", "Social Smoke nennt ihn den jüngeren Bruder von Absolute Zero: frisch und lebendig, aber klarer und weniger eisig.")],
   [("Mint i Double Apple, 30/70, za klasičnu jabuku sa mentom.", "Mint with Double Apple, 30/70, for classic apple mint.", "Mint mit Double Apple, 30/70, für klassischen Apfel mit Minze."),
    ("Mint i Lemon, za limunadu sa mentom.", "Mint with Lemon for a mint lemonade.", "Mint mit Lemon für eine Minz-Limonade.")],
   tags=["mint", "osvjezavajuci"])

fl("mirage", "Mirage", ["menta:7", "ruza:6:Jasmin|Jasmine flower|Jasminblüte:#f4f0d8"], (5, 8, 1, 5),
   ("Menta i cvijet jasmina.", "Mint with jasmine flower.", "Minze mit Jasminblüte."),
   [("Mirage je neobičan spoj mente i cvijeta jasmina.", "Mirage is an unusual blend of mint and jasmine flower.", "Mirage ist eine ungewöhnliche Mischung aus Minze und Jasminblüte."),
    ("Jasmin daje mirisnu, cvjetnu notu, a menta svježinu.", "The jasmine brings a fragrant, floral note, and the mint brings freshness.", "Der Jasmin bringt eine duftende, blumige Note, und die Minze Frische.")],
   [("Mirage i Lemon, za cvjetnu limunadu.", "Mirage with Lemon for a floral lemonade.", "Mirage mit Lemon für eine blumige Limonade."),
    ("Mirage i Honeydew Melon, za cvjetnu dinju.", "Mirage with Honeydew Melon for a floral melon.", "Mirage mit Honeydew Melon für eine blumige Melone.")],
   tags=["mint", "biljni", "osvjezavajuci"])

fl("mojito", "Mojito", ["limeta:7", "menta:7", "med:4:Šećer|Sugar|Zucker:#f3c96b"], (6, 9, 6, 5),
   ("Koktel od šećera, soka limete i mente.", "The highball of sugar, lime juice and mint.", "Der Longdrink aus Zucker, Limettensaft und Minze."),
   [("Mojito je inspirisan poznatim koktelom: šećer, sok limete i menta.", "Mojito is inspired by the famous cocktail: sugar, lime juice and mint.", "Mojito ist vom bekannten Cocktail inspiriert: Zucker, Limettensaft und Minze."),
    ("Okus je svjež, kiselkast i lagano sladak.", "The flavor is fresh, tangy and lightly sweet.", "Der Geschmack ist frisch, säuerlich und leicht süß.")],
   [("Mojito i Passion Fruit Mojito, za tropski mojito.", "Mojito with Passion Fruit Mojito for a tropical mojito.", "Mojito mit Passion Fruit Mojito für einen tropischen Mojito."),
    ("Mojito i Watermelon, za mojito od lubenice.", "Mojito with Watermelon for a watermelon mojito.", "Mojito mit Watermelon für einen Wassermelonen-Mojito.")],
   tags=["pice", "mint", "citrusni", "osvjezavajuci"])

fl("orange", "Orange", ["narandza:9"], (7, 7, 8, 0),
   ("Slatke, svježe narandže.", "Sweet, fresh oranges.", "Süße, frische Orangen."),
   [("Orange je slatka, sunčana narandža, svježe ubrana.", "Orange is a sweet, sunny orange, freshly picked.", "Orange ist eine süße, sonnige Orange, frisch gepflückt."),
    ("Bez mente je, pa je to čist citrus.", "It has no mint, so it is pure citrus.", "Sie hat keine Minze, deshalb ist sie reine Zitrus.")],
   [("Orange i Mint, 70/30, za svjež sok od narandže.", "Orange with Mint, 70/30, for a fresh orange juice.", "Orange mit Mint, 70/30, für einen frischen Orangensaft."),
    ("Orange i French Vanilla, za kremu od narandže.", "Orange with French Vanilla for an orange cream.", "Orange mit French Vanilla für eine Orangencreme.")])

fl("paan", "Paan", ["visnja:7:Višnja|Cherry|Kirsche", "cimet:6"], (7, 4, 6, 0),
   ("Zrele crvene višnje sa gorko-slatkim cimetom.", "Ripe red cherries with bittersweet cinnamon.", "Reife rote Kirschen mit bittersüßem Zimt."),
   [("Paan spaja zrele crvene višnje sa gorko-slatkim cimetom.", "Paan combines ripe red cherries with bittersweet cinnamon.", "Paan verbindet reife rote Kirschen mit bittersüßem Zimt."),
    ("Okus je začinski i sladak, toplog karaktera.", "The flavor is spiced and sweet, with a warm character.", "Der Geschmack ist würzig und süß, mit warmem Charakter.")],
   [("Paan i Pandora's Box, za indijski mix.", "Paan with Pandora's Box for an Indian-style mix.", "Paan mit Pandora's Box für einen indischen Mix."),
    ("Paan i Mint, 70/30, za svježiju višnju.", "Paan with Mint, 70/30, for a fresher cherry.", "Paan mit Mint, 70/30, für eine frischere Kirsche.")],
   tags=["vocni", "zacinski", "slatki"])

fl("pandoras-box", "Pandora's Box", ["betel:7", "karamel:5:Areka orah|Areca nut|Arekanuss:#8a5a3a", "anis:4:Začini|Spices|Gewürze", "dzem:4:Suho voće|Dried fruit|Trockenobst:#b0103a"], (6, 4, 3, 0),
   ("Areka orah, začini i suho voće umotani u betel list.", "Areca nuts, spices and dried fruit wrapped in a betel leaf.", "Arekanüsse, Gewürze und Trockenobst in einem Betelblatt."),
   [("Pandora's Box je inspirisan indijskom grickalicom: areka orah, začini i komadići suhog voća umotani u betel list.", "Pandora's Box is inspired by an Indian snack: areca nuts, spices and bits of dried fruit wrapped in a betel leaf.", "Pandora's Box ist von einem indischen Snack inspiriert: Arekanüsse, Gewürze und Trockenobst in einem Betelblatt."),
    ("Okus je neobičan, biljni i začinski, za one koji žele nešto potpuno drugačije.", "The flavor is unusual, herbal and spiced, for people who want something completely different.", "Der Geschmack ist ungewöhnlich, kräuterig und würzig, für alle, die etwas völlig anderes wollen.")],
   [("Pandora's Box i Paan, za indijski mix.", "Pandora's Box with Paan for an Indian-style mix.", "Pandora's Box mit Paan für einen indischen Mix."),
    ("Pandora's Box i Mint, 80/20, za svježiji kraj.", "Pandora's Box with Mint, 80/20, for a fresher finish.", "Pandora's Box mit Mint, 80/20, für einen frischeren Abgang.")],
   tags=["biljni", "zacinski"])

fl("passion-fruit-mojito", "Passion Fruit Mojito", ["marakuja:8", "limun:5", "limeta:5", "menta:6"], (7, 8, 8, 5),
   ("Limun, limeta, egzotična marakuja i hladna menta.", "Lemon and lime juice, exotic passion fruit and cool mint.", "Zitronen- und Limettensaft, exotische Maracuja und kühle Minze."),
   [("Passion Fruit Mojito spaja sok limuna i limete, egzotičnu marakuju i hladnu mentu.", "Passion Fruit Mojito combines lemon and lime juice, exotic passion fruit and cool mint.", "Passion Fruit Mojito verbindet Zitronen- und Limettensaft, exotische Maracuja und kühle Minze."),
    ("To je tropska verzija mojita: voćnija i slađa od klasičnog.", "It is a tropical take on the mojito: fruitier and sweeter than the classic.", "Er ist eine tropische Version des Mojitos: fruchtiger und süßer als der Klassiker.")],
   [("Passion Fruit Mojito i Mojito, za više mente i limete.", "Passion Fruit Mojito with Mojito for more mint and lime.", "Passion Fruit Mojito mit Mojito für mehr Minze und Limette."),
    ("Passion Fruit Mojito i Sunbeam, za tropski koktel.", "Passion Fruit Mojito with Sunbeam for a tropical cocktail.", "Passion Fruit Mojito mit Sunbeam für einen tropischen Cocktail.")],
   tags=["pice", "tropski", "mint", "osvjezavajuci"])

fl("pear-chill", "Pear Chill", ["kruska:8:Kruška|Pear|Birne", "menta:5"], (6, 7, 7, 4),
   ("Blaga, slatka kruška sa mekom mentom.", "Mild, sweet pear with smooth mint.", "Milde, süße Birne mit weicher Minze."),
   [("Pear Chill je blaga, slatka kruška sa suptilnom mentom.", "Pear Chill is mild, sweet pear with a subtle touch of mint.", "Pear Chill ist milde, süße Birne mit einem dezenten Hauch Minze."),
    ("Okus je nježan i osvježavajući, dobar i za početnike.", "The flavor is gentle and refreshing, good for beginners too.", "Der Geschmack ist sanft und erfrischend, auch gut für Einsteiger.")],
   [("Pear Chill i Golden Delicious Apple, za voćnjak.", "Pear Chill with Golden Delicious Apple for an orchard mix.", "Pear Chill mit Golden Delicious Apple für einen Obstgarten-Mix."),
    ("Pear Chill i Cinnamon Roll, za krušku sa cimetom.", "Pear Chill with Cinnamon Roll for pear with cinnamon.", "Pear Chill mit Cinnamon Roll für Birne mit Zimt.")])

fl("pink-lemonade", "Pink Lemonade", ["limun:8", "malina:5:Ružičasti dodatak|Pink splash|Pinker Schuss"], (7, 8, 7, 0),
   ("Slatki, kiselkasti limun sa ružičastim dodatkom.", "Sweet, tangy lemons with a splash of pink.", "Süße, säuerliche Zitronen mit einem pinken Schuss."),
   [("Pink Lemonade je ljetni klasik: slatki, kiselkasti limun sa ružičastim, voćnim dodatkom.", "Pink Lemonade is a summer classic: sweet, tangy lemon with a pink, fruity splash.", "Pink Lemonade ist ein Sommerklassiker: süße, säuerliche Zitrone mit einem pinken, fruchtigen Schuss."),
    ("Osvježavajuća je i lagana, kao hladna limunada.", "It is refreshing and light, like a cold lemonade.", "Sie ist erfrischend und leicht, wie eine kalte Limonade.")],
   [("Pink Lemonade i Absolute Zero, 80/20, za ledenu limunadu.", "Pink Lemonade with Absolute Zero, 80/20, for an icy lemonade.", "Pink Lemonade mit Absolute Zero, 80/20, für eine eisige Limonade."),
    ("Pink Lemonade i Watermelon, za limunadu od lubenice.", "Pink Lemonade with Watermelon for a watermelon lemonade.", "Pink Lemonade mit Watermelon für eine Wassermelonen-Limonade.")],
   tags=["pice", "citrusni", "osvjezavajuci", "ljetni"])

fl("pistachio-breeze", "Pistachio Breeze", ["pistacija:8", "kardamom:4:Šafran|Saffron|Safran:#e8a03a", "vanila:4"], (7, 2, 1, 0),
   ("Puterasta pistacija, šafran i dašak vanile.", "Buttery pistachio, saffron and a touch of vanilla.", "Buttrige Pistazie, Safran und ein Hauch Vanille."),
   [("Pistachio Breeze spaja puterastu pistaciju sa šafranom i daškom vanile.", "Pistachio Breeze blends buttery pistachio with saffron and a touch of vanilla.", "Pistachio Breeze verbindet buttrige Pistazie mit Safran und einem Hauch Vanille."),
    ("Okus podsjeća na orijentalni desert, mekan i bogat.", "It recalls an oriental dessert, soft and rich.", "Er erinnert an ein orientalisches Dessert, weich und reich.")],
   [("Pistachio Breeze i Wonder Flower, za pistaciju sa ružom.", "Pistachio Breeze with Wonder Flower for pistachio with rose.", "Pistachio Breeze mit Wonder Flower für Pistazie mit Rose."),
    ("Pistachio Breeze i Chai Latte, za začinski desert.", "Pistachio Breeze with Chai Latte for a spiced dessert.", "Pistachio Breeze mit Chai Latte für ein würziges Dessert.")],
   tags=["desertni", "zacinski", "slatki"])

fl("sex-panther", "Sex Panther", ["breskva:7", "bobice:6:Brusnica|Cranberry|Cranberry", "narandza:6"], (7, 6, 9, 0),
   ("Koktel od breskve, kisele brusnice i slatke narandže.", "A cocktail of peach, tangy cranberry and sweet orange.", "Ein Cocktail aus Pfirsich, säuerlicher Cranberry und süßer Orange."),
   [("Sex Panther je voćni koktel od breskve, kisele brusnice i slatke narandže.", "Sex Panther is a fruit cocktail of peach, tangy cranberry and sweet orange.", "Sex Panther ist ein Fruchtcocktail aus Pfirsich, säuerlicher Cranberry und süßer Orange."),
    ("Okus je sočan i živ, sa ravnotežom slatkog i kiselog.", "The flavor is juicy and lively, with a balance of sweet and tart.", "Der Geschmack ist saftig und lebendig, mit einem Gleichgewicht aus süß und sauer.")],
   [("Sex Panther i Mint, 70/30, za svježiji koktel.", "Sex Panther with Mint, 70/30, for a fresher cocktail.", "Sex Panther mit Mint, 70/30, für einen frischeren Cocktail."),
    ("Sex Panther i Cali Peach, za više breskve.", "Sex Panther with Cali Peach for more peach.", "Sex Panther mit Cali Peach für mehr Pfirsich.")],
   tags=["vocni", "pice", "slatki"])

fl("strawberry-kiwi", "Strawberry Kiwi", ["jagoda:8", "kivi:7"], (7, 7, 9, 0),
   ("Lagan, osvježavajući spoj jagode i kivija.", "A light, refreshing combination of strawberry and kiwi.", "Eine leichte, erfrischende Kombination aus Erdbeere und Kiwi."),
   [("Strawberry Kiwi spaja slatku jagodu i svježi kivi.", "Strawberry Kiwi combines sweet strawberry and fresh kiwi.", "Strawberry Kiwi verbindet süße Erdbeere und frische Kiwi."),
    ("Okus je lagan i osvježavajući, poznata kombinacija iz sokova.", "The flavor is light and refreshing, a familiar combination from juices.", "Der Geschmack ist leicht und erfrischend, eine bekannte Kombination aus Säften.")],
   [("Strawberry Kiwi i Mint, 70/30, za svjež voćni kotlić.", "Strawberry Kiwi with Mint, 70/30, for a fresh fruit bowl.", "Strawberry Kiwi mit Mint, 70/30, für einen frischen Fruchtkopf."),
    ("Strawberry Kiwi i Lemon, za limunadu od jagode i kivija.", "Strawberry Kiwi with Lemon for a strawberry kiwi lemonade.", "Strawberry Kiwi mit Lemon für eine Erdbeer-Kiwi-Limonade.")])

fl("strawberry-margarita", "Strawberry Margarita", ["jagoda:8", "limeta:6", "liker:3:Tekila|Tequila|Tequila:#e8d68a"], (7, 7, 8, 0),
   ("Sočne jagode i limeta sa daškom tekile.", "Juicy strawberries and zesty lime with a touch of tequila.", "Saftige Erdbeeren und Limette mit einem Hauch Tequila."),
   [("Strawberry Margarita spaja sočne jagode i kiselu limetu sa daškom tekile.", "Strawberry Margarita blends juicy strawberries and zesty lime with a touch of tequila.", "Strawberry Margarita verbindet saftige Erdbeeren und spritzige Limette mit einem Hauch Tequila."),
    ("Voćnija je i slađa od obične Margarite.", "It is fruitier and sweeter than the plain Margarita.", "Sie ist fruchtiger und süßer als die einfache Margarita.")],
   [("Strawberry Margarita i Lime Chill, za ledenu margaritu.", "Strawberry Margarita with Lime Chill for an icy margarita.", "Strawberry Margarita mit Lime Chill für eine eisige Margarita."),
    ("Strawberry Margarita i Margarita, za više limete.", "Strawberry Margarita with Margarita for more lime.", "Strawberry Margarita mit Margarita für mehr Limette.")],
   tags=["pice", "vocni", "citrusni"])

fl("sunbeam", "Sunbeam", ["kokos:7", "djumbir:5", "ananas:7"], (7, 6, 8, 0),
   ("Kokos, đumbir i ananas u tropskom spoju.", "Coconut, ginger and pineapple in a tropical treat.", "Kokos, Ingwer und Ananas in einem tropischen Genuss."),
   [("Sunbeam spaja kokos, đumbir i ananas.", "Sunbeam brings together coconut, ginger and pineapple.", "Sunbeam vereint Kokos, Ingwer und Ananas."),
    ("Ananas i kokos daju tropsku slatkoću, a đumbir blagu ljutinu.", "Pineapple and coconut bring tropical sweetness, and ginger a light heat.", "Ananas und Kokos bringen tropische Süße, und Ingwer eine leichte Schärfe.")],
   [("Sunbeam i Coconut, za više kokosa.", "Sunbeam with Coconut for more coconut.", "Sunbeam mit Coconut für mehr Kokos."),
    ("Sunbeam i Passion Fruit Mojito, za tropski koktel.", "Sunbeam with Passion Fruit Mojito for a tropical cocktail.", "Sunbeam mit Passion Fruit Mojito für einen tropischen Cocktail.")],
   tags=["tropski", "vocni", "zacinski"])

fl("tangerine-rush", "Tangerine Rush", ["narandza:8:Mandarina|Mandarin|Mandarine", "limun:5:Citrusi|Citrus|Zitrus"], (7, 8, 8, 0),
   ("Svježe mandarine sa raznim sočnim citrusima.", "Fresh tangerines with a variety of juicy citrus.", "Frische Mandarinen mit verschiedenen saftigen Zitrusfrüchten."),
   [("Tangerine Rush je val svježih mandarina sa raznim sočnim citrusima.", "Tangerine Rush is a rush of fresh tangerines with a variety of juicy citrus.", "Tangerine Rush ist eine Welle frischer Mandarinen mit verschiedenen saftigen Zitrusfrüchten."),
    ("Sladak je i živ, sa citrusnom svježinom.", "It is sweet and lively, with citrus freshness.", "Er ist süß und lebendig, mit Zitrusfrische.")],
   [("Tangerine Rush i Mint, 70/30, za ledeni sok.", "Tangerine Rush with Mint, 70/30, for an icy juice.", "Tangerine Rush mit Mint, 70/30, für einen eisigen Saft."),
    ("Tangerine Rush i Berry Punch, za voćni punč.", "Tangerine Rush with Berry Punch for a fruit punch.", "Tangerine Rush mit Berry Punch für einen Fruchtpunsch.")])

fl("tigers-blood", "Tiger's Blood", ["borovnica:6", "malina:6", "jagoda:6", "visnja:6:Višnja|Cherry|Kirsche"], (8, 5, 9, 0),
   ("Borovnica, malina, jagoda i višnja.", "Blueberries, raspberries, strawberries and cherries.", "Heidelbeeren, Himbeeren, Erdbeeren und Kirschen."),
   [("Tiger's Blood je mix zrelih borovnica, malina, jagoda i višanja.", "Tiger's Blood is a mix of ripe blueberries, raspberries, strawberries and cherries.", "Tiger's Blood ist eine Mischung aus reifen Heidelbeeren, Himbeeren, Erdbeeren und Kirschen."),
    ("Okus je sladak, pun i voćan, crveno i tamno voće zajedno.", "The flavor is sweet, full and fruity, red and dark fruit together.", "Der Geschmack ist süß, voll und fruchtig, rotes und dunkles Obst zusammen.")],
   [("Tiger's Blood i Absolute Zero, 70/30, za ledene bobice.", "Tiger's Blood with Absolute Zero, 70/30, for icy berries.", "Tiger's Blood mit Absolute Zero, 70/30, für eisige Beeren."),
    ("Tiger's Blood i Coconut, za voćni desert.", "Tiger's Blood with Coconut for a fruity dessert.", "Tiger's Blood mit Coconut für ein fruchtiges Dessert.")])

fl("twisted", "Twisted", ["mango:7", "jagoda:6", "malina:6", "borovnica:6"], (8, 5, 9, 0),
   ("Mango, jagoda, malina i borovnica.", "Mango, strawberry, raspberry and blueberry.", "Mango, Erdbeere, Himbeere und Heidelbeere."),
   [("Twisted spaja slatki mango, sočne jagode, maline i borovnice.", "Twisted combines sweet mango, juicy strawberries, raspberries and blueberries.", "Twisted verbindet süße Mango, saftige Erdbeeren, Himbeeren und Heidelbeeren."),
    ("Okus je voćan i sladak, sa tropskom notom manga.", "The flavor is fruity and sweet, with a tropical mango note.", "Der Geschmack ist fruchtig und süß, mit tropischer Mango-Note.")],
   [("Twisted i Mint, 70/30, za svjež voćni mix.", "Twisted with Mint, 70/30, for a fresh fruit mix.", "Twisted mit Mint, 70/30, für einen frischen Fruchtmix."),
    ("Twisted i Lemon, za kiselkastiji kotlić.", "Twisted with Lemon for a tangier bowl.", "Twisted mit Lemon für einen säuerlicheren Kopf.")])

fl("voltage", "Voltage", ["lubenica:8", "limun:6", "karamel:4:Badem (amaretto)|Almond (amaretto)|Mandel (Amaretto):#d6b48a"], (7, 7, 8, 0),
   ("Lubenica i limun sa daškom badema kao u amarettu.", "Watermelon and lemon with a hint of amaretto-style almond.", "Wassermelone und Zitrone mit einem Hauch Mandel wie im Amaretto."),
   [("Voltage spaja lubenicu i limun sa daškom slatkog badema, kao u amarettu.", "Voltage combines watermelon and lemon with a hint of sweet almond, like amaretto.", "Voltage verbindet Wassermelone und Zitrone mit einem Hauch süßer Mandel, wie Amaretto."),
    ("Lubenica i limun su svježi, a badem dodaje neobičnu, mekanu dubinu.", "The watermelon and lemon are fresh, and the almond adds an unusual, soft depth.", "Wassermelone und Zitrone sind frisch, und die Mandel gibt eine ungewöhnliche, weiche Tiefe.")],
   [("Voltage i Absolute Zero, 80/20, za ledeni kotlić.", "Voltage with Absolute Zero, 80/20, for an icy bowl.", "Voltage mit Absolute Zero, 80/20, für einen eisigen Kopf."),
    ("Voltage i Watermelon, za više lubenice.", "Voltage with Watermelon for more watermelon.", "Voltage mit Watermelon für mehr Wassermelone.")])

fl("watermelon", "Watermelon", ["lubenica:9"], (7, 7, 9, 0),
   ("Sočna, slatka i osvježavajuća lubenica.", "Juicy, sweet and refreshing watermelon.", "Saftige, süße und erfrischende Wassermelone."),
   [("Watermelon je sočna, slatka lubenica punog okusa.", "Watermelon is juicy, sweet watermelon with a full flavor.", "Watermelon ist saftige, süße Wassermelone mit vollem Geschmack."),
    ("Bez mente je, pa je to čisto ljetno voće.", "It has no mint, so it is pure summer fruit.", "Sie hat keine Minze, deshalb ist sie reines Sommerobst.")],
   [("Watermelon i Absolute Zero, 70/30, za ledenu lubenicu.", "Watermelon with Absolute Zero, 70/30, for an icy watermelon.", "Watermelon mit Absolute Zero, 70/30, für eine eisige Wassermelone."),
    ("Watermelon i Lime, za lubenicu sa limetom.", "Watermelon with Lime for watermelon with lime.", "Watermelon mit Lime für Wassermelone mit Limette.")])

fl("watermelon-chill", "Watermelon Chill", ["lubenica:9", "menta:6"], (7, 8, 9, 5),
   ("Sočna lubenica sa izraženom mentom.", "Juicy watermelon with deep hints of mint.", "Saftige Wassermelone mit deutlicher Minze."),
   [("Watermelon Chill je sočna lubenica sa izraženom, osvježavajućom mentom.", "Watermelon Chill is juicy watermelon with deep, refreshing hints of mint.", "Watermelon Chill ist saftige Wassermelone mit deutlicher, erfrischender Minze."),
    ("Klasična ljetna kombinacija, dobra i za početnike.", "A classic summer pairing, good for beginners too.", "Eine klassische Sommer-Kombination, auch gut für Einsteiger.")],
   [("Watermelon Chill i Lemon, za ljetnu limunadu.", "Watermelon Chill with Lemon for a summer lemonade.", "Watermelon Chill mit Lemon für eine Sommer-Limonade."),
    ("Watermelon Chill i Honeydew Melon Chill, za ledene dinje.", "Watermelon Chill with Honeydew Melon Chill for icy melons.", "Watermelon Chill mit Honeydew Melon Chill für eisige Melonen.")])

fl("white-gummy-bear", "White Gummy Bear", ["medo:8:Bijeli gumeni medvjedić|White gummy bear|Weißes Gummibärchen:#fff0a0", "ananas:6"], (8, 5, 7, 0),
   ("Slatki i kiselkasti bijeli gumeni medvjedići sa ananasom.", "The sweet and tangy pineapple twist of white gummy bears.", "Der süße und säuerliche Ananas-Twist von weißen Gummibärchen."),
   [("White Gummy Bear je okus bijelih gumenih medvjedića.", "White Gummy Bear is the flavor of white gummy bears.", "White Gummy Bear ist der Geschmack von weißen Gummibärchen."),
    ("Sladak je i kiselkast, sa notom ananasa.", "It is sweet and tangy, with a pineapple note.", "Er ist süß und säuerlich, mit Ananas-Note.")],
   [("White Gummy Bear i Absolute Zero, 80/20, za ledene bombone.", "White Gummy Bear with Absolute Zero, 80/20, for icy candy.", "White Gummy Bear mit Absolute Zero, 80/20, für eisige Bonbons."),
    ("White Gummy Bear i Strawberry Kiwi, za voćne bombone.", "White Gummy Bear with Strawberry Kiwi for fruit candy.", "White Gummy Bear mit Strawberry Kiwi für Fruchtbonbons.")],
   tags=["bombon", "vocni", "slatki"])

fl("wild-berry", "Wild Berry", ["kupina:8:Šumsko voće|Wild berries|Waldbeeren:#5a2a5e", "ruza:3:Cvijet bobica|Berry blossom|Beerenblüte:#e86a9a"], (7, 5, 9, 0),
   ("Šumsko voće sa notom cvijeta bobica.", "Wild berries with hints of berry blossom.", "Waldbeeren mit einem Hauch Beerenblüte."),
   [("Wild Berry je sočan mix šumskog voća.", "Wild Berry is a juicy mix of wild berries.", "Wild Berry ist eine saftige Mischung aus Waldbeeren."),
    ("U pozadini je blaga cvjetna nota cvijeta bobica.", "A light floral note of berry blossom sits in the background.", "Im Hintergrund ist eine leichte blumige Note von Beerenblüte.")],
   [("Wild Berry i Lemon, za limunadu od šumskog voća.", "Wild Berry with Lemon for a wild berry lemonade.", "Wild Berry mit Lemon für eine Waldbeer-Limonade."),
    ("Wild Berry i Coconut, za voćni desert.", "Wild Berry with Coconut for a fruity dessert.", "Wild Berry mit Coconut für ein fruchtiges Dessert.")])

fl("wild-berry-chill", "Wild Berry Chill", ["kupina:8:Šumsko voće|Wild berries|Waldbeeren:#5a2a5e", "menta:6"], (7, 7, 9, 5),
   ("Šumsko voće sa hladnim završetkom mente.", "Wild berries with a cool mint finish.", "Waldbeeren mit kühlem Minz-Abgang."),
   [("Wild Berry Chill je egzotičan mix šumskog voća sa mentom.", "Wild Berry Chill is an exotic mix of wild berries with mint.", "Wild Berry Chill ist eine exotische Mischung aus Waldbeeren mit Minze."),
    ("Menta daje hladan završetak, pa je okus svježiji od običnog Wild Berryja.", "The mint gives a cool finish, so it is fresher than plain Wild Berry.", "Die Minze gibt einen kühlen Abgang, deshalb ist er frischer als einfaches Wild Berry.")],
   [("Wild Berry Chill i Lemon Chill, za ledenu limunadu od bobica.", "Wild Berry Chill with Lemon Chill for an icy berry lemonade.", "Wild Berry Chill mit Lemon Chill für eine eisige Beeren-Limonade."),
    ("Wild Berry Chill i Grape, za tamno voće sa mentom.", "Wild Berry Chill with Grape for dark fruit with mint.", "Wild Berry Chill mit Grape für dunkles Obst mit Minze.")])

fl("wonder-flower", "Wonder Flower", ["pistacija:8", "ruza:5"], (7, 3, 1, 0),
   ("Kremasta pistacija sa laganom notom ruže.", "Creamy pistachio with light notes of rose.", "Cremige Pistazie mit leichten Rosennoten."),
   [("Wonder Flower spaja kremastu pistaciju sa laganom notom ruže.", "Wonder Flower pairs creamy pistachio with light notes of rose.", "Wonder Flower verbindet cremige Pistazie mit leichten Rosennoten."),
    ("Okus podsjeća na orijentalne slatkiše, bogat i mirisan.", "It recalls oriental sweets, rich and fragrant.", "Er erinnert an orientalische Süßigkeiten, reich und duftend.")],
   [("Wonder Flower i Pistachio Breeze, za više pistacije.", "Wonder Flower with Pistachio Breeze for more pistachio.", "Wonder Flower mit Pistachio Breeze für mehr Pistazie."),
    ("Wonder Flower i French Vanilla, za kremasti desert.", "Wonder Flower with French Vanilla for a creamy dessert.", "Wonder Flower mit French Vanilla für ein cremiges Dessert.")],
   tags=["desertni", "slatki"])

out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "2026-11-social-smoke.json")
json.dump(F, open(out, "w"), ensure_ascii=False, indent=1)
print(len(F), "okusa ->", out)
