/* =====================================================
   DÁTA HRY – tu upravuješ takmer všetko
   Po zmene súbor uložíš a priečinok znova nahráš na GitHub.
   ===================================================== */

/* ---- STAV HRY (pás pod úvodom) ---- */
var STAV = {
  den: 1,                            // číslo dňa
  faza: "Deň",                       // "Deň" alebo "Noc"
  dalsiaNazov: "Začiatok hry",          // čo nasleduje
  dalsiaCas: "2026-12-02T20:00:00",  // kedy (rok-mesiac-deň T hodina:minúta)
  discord: "https://discord.gg/TVOJ_ODKAZ",  // pozvánka na Discord server
  zvuk: "audio/ambient.mp3"          // zvuk na pozadí (voliteľné)
};

/* ---- ODKAZY NA FORMULÁRE ----
   prihlaska: formulár s prihláškou do hry (Google Forms)
   Odkaz na vloženie: Google Forms → Odoslať → ikona <> → skopíruj len adresu zo src="…"  */
var ODKAZY = {
  prihlaska: "https://docs.google.com/forms/d/e/1FAIpQLSdH0t7KNayy4aSZFjlRLUHvfsxekfmKU761mCrS8BIZ0m05yQ/viewform?embedded=true"
};

/* ---- TEXTY WEBU (úvod, pravidlá, časté otázky, pätička) ----
   Upravuješ v admin.html, záložka Texty webu.                              */
var WEB = {
  "uvod": "V dedine Santosville sa skrývajú netvory. Cez deň hlasujete o poprave, v noci netvory lovia. Prežije len ten, kto vie, komu veriť.",
  "pravidla_uvod": [
    "Santosville je webová hra na štýl Městečka Palermo. Má 3 týmy: Osadníci, Netvory a Sólo. Každý hráč má k dispozícii špeciálne schopnosti. Hráči používajú svoje schopnosti a snažia sa vyhrať.",
    "Hra beží na Discorde. Každý deň a každá noc trvá v reálnom čase."
  ],
  "casy": [
    {
      "cas": "08:00",
      "text": "Dedina sa prebúdza. Moderátor oznámi, kto v noci zomrel.",
      "den": true
    },
    {
      "cas": "08:00 – 20:00",
      "text": "Diskusia na Discorde a hlasovanie v ankete.",
      "den": true
    },
    {
      "cas": "20:00",
      "text": "Poprava. Dedina obesí hráča s najviac hlasmi a odhalí sa jeho rola.",
      "den": true
    },
    {
      "cas": "20:00 – 07:30",
      "text": "Noc. Každý napíše moderátorovi do súkromnej správy na Discorde, čo robí.",
      "den": false
    },
    {
      "cas": "07:30",
      "text": "Uzávierka nočných akcií. Kto nenapíše, nič nevykoná.",
      "den": false
    }
  ],
  "casy_poznamka": "Nočnú akciu napíš moderátorovi v súkromnej správe na Discorde.",
  "vyhra": [
    "Osadníci vyhrávajú, keď sú všetky netvory mŕtve.",
    "Netvory vyhrávajú, keď ich je rovnako veľa ako osadníkov.",
    "Sólo roly majú vlastný cieľ, uvedený pri ich karte."
  ],
  "prihlaska_text": "Hrá sa v 16 hráčoch. Vyplň formulár a uveď svoje meno na Discorde.",
  "moderator": "Santos",
  "faq": [
    {
      "o": "Čo ak nestihnem napísať nočnú akciu?",
      "a": "Moderátor ju nezapočíta a tvoja rola v tú noc nič nevykoná."
    },
    {
      "o": "Môžem ukázať svoju rolu ostatným?",
      "a": "Ak chceš, môžeš tvrdiť čokoľvek. Screenshoty zo súkromných správ s moderátorom sú zakázané."
    },
    {
      "o": "Čo ak nemôžem hrať niekoľko dní?",
      "a": "Daj vedieť vopred. Ak mlčíš dva dni po sebe, dedina ťa zoberie ako mŕtveho."
    },
    {
      "o": "Čo sa stane pri remíze v hlasovaní?",
      "a": "Nikto nie je obesený a hra pokračuje nocou."
    }
  ]
};

/* ---- HRÁČI ----
   foto:  názov súboru v priečinku img/hraci/ (bez diakritiky, napr. jan.jpg)
   stav:  "zije" alebo "mrtvy"
   rola:  napíš rolu až keď hráč zomrie, dovtedy "?"
   poznamka: napr. "Obesený, deň 1" alebo "Zožratý v noci 2"
   Údaje do profilu (všetko voliteľné, prázdne sa nezobrazí):
     vek, bydlisko, povolanie, zaluby – krátke údaje
     o_mne – voľný text o hráčovi (pár viet)
     dalsie – ľubovoľné vlastné položky, napr. dalsie:{"Obľúbené jedlo":"pizza"}
   Pozor: profil je verejný, píš len to, s čím hráč súhlasí (mesto, nie adresa).            */
var HRACI = [
  {meno:"Hráč 1", foto:"hrac1.jpg", stav:"zije", rola:"?", poznamka:"", vek:"", bydlisko:"", povolanie:"", zaluby:"", o_mne:""},
  {meno:"Hráč 2", foto:"hrac2.jpg", stav:"zije", rola:"?", poznamka:"", vek:"", bydlisko:"", povolanie:"", zaluby:"", o_mne:""},
  {meno:"Hráč 3", foto:"hrac3.jpg", stav:"zije", rola:"?", poznamka:"", vek:"", bydlisko:"", povolanie:"", zaluby:"", o_mne:""},
  {meno:"Hráč 4", foto:"hrac4.jpg", stav:"zije", rola:"?", poznamka:"", vek:"", bydlisko:"", povolanie:"", zaluby:"", o_mne:""},
  {meno:"Hráč 5", foto:"hrac5.jpg", stav:"zije", rola:"?", poznamka:"", vek:"", bydlisko:"", povolanie:"", zaluby:"", o_mne:""},
  {meno:"Hráč 6", foto:"hrac6.jpg", stav:"zije", rola:"?", poznamka:"", vek:"", bydlisko:"", povolanie:"", zaluby:"", o_mne:""},
  {meno:"Michal", foto:"Michal.jpg", stav:"mrtvy", rola:"?", poznamka:"", vek:"40", bydlisko:"Kolpachy", povolanie:"učiteľ", zaluby:"šerm", o_mne:"Som"},
  {meno:"Hráč 8", foto:"hrac8.jpg", stav:"zije", rola:"?", poznamka:"", vek:"", bydlisko:"", povolanie:"", zaluby:"", o_mne:""},
  {meno:"Hráč 9", foto:"hrac9.jpg", stav:"zije", rola:"?", poznamka:"", vek:"", bydlisko:"", povolanie:"", zaluby:"", o_mne:""},
  {meno:"Hráč 10", foto:"hrac10.jpg", stav:"zije", rola:"?", poznamka:"", vek:"", bydlisko:"", povolanie:"", zaluby:"", o_mne:""},
  {meno:"Hráč 11", foto:"hrac11.jpg", stav:"zije", rola:"?", poznamka:"", vek:"", bydlisko:"", povolanie:"", zaluby:"", o_mne:""},
  {meno:"Hráč 12", foto:"hrac12.jpg", stav:"zije", rola:"?", poznamka:"", vek:"", bydlisko:"", povolanie:"", zaluby:"", o_mne:""},
  {meno:"Hráč 13", foto:"hrac13.jpg", stav:"zije", rola:"?", poznamka:"", vek:"", bydlisko:"", povolanie:"", zaluby:"", o_mne:""},
  {meno:"Hráč 14", foto:"hrac14.jpg", stav:"zije", rola:"?", poznamka:"", vek:"", bydlisko:"", povolanie:"", zaluby:"", o_mne:""},
  {meno:"Hráč 15", foto:"hrac15.jpg", stav:"zije", rola:"?", poznamka:"", vek:"", bydlisko:"", povolanie:"", zaluby:"", o_mne:""},
  {meno:"Hráč 16", foto:"hrac16.jpg", stav:"zije", rola:"?", poznamka:"", vek:"", bydlisko:"", povolanie:"", zaluby:"", o_mne:""},
];

/* ---- ROLY (karty na hlavnej stránke) ----
   nazov: názov role · tim: "dedina" (Osadníci), "netvor" (Netvory) alebo "neutral" (Sólo)
   foto: názov súboru v priečinku img/ (napr. kat.jpg) · popis: text na karte
   skryta: true = karta sa na webe zahmlí (rola ešte nie je odhalená)
   Najjednoduchšie je upravovať v admin.html.                              */
var ROLY = [
  {"nazov":"Emocionálny upír","tim":"dedina","foto":"emupir.jpg","popis":"Nepiješ krv, ale city. V noci sa nepozorovane prikradneš k spiacemu a vysaješ z neho kus jeho životnej energie, v ktorej sa ukáže, kým naozaj je. Vyber si hráča a zisti jeho auru: skorumpovanú, čistú alebo neznámu. Skorumpovaní hráči patria k zloduchom a čistí hráči patria do tímu dobrákov. Nikto ti však nepovie, čo si v obete zanechal ty.","skryta":false},
  {"nazov":"Sudička","tim":"dedina","foto":"sudicka.jpg","popis":"Si bytosť, ktorá pradie nite ľudských životov a v každej vidí pravdu. Odkedy sa v Santosville začalo diať zlo, tvoje vlákna sa chvejú a farby sa miešajú. Ľudia ťa nevidia, no ty vidíš všetkých. Každú noc môžeš vybrať hráča a odhaliť jeho rolu. Nite nelžú, no ty nevieš, kto ich pretne.","skryta":false},
  {"nazov":"Alchymistka","tim":"dedina","foto":"alchymistka.jpg","popis":"Roky si hľadala spôsob, ako rozoznať človeka od netvora, a našla si ho v krvi. Každú noc si vyberieš dvoch hráčov a zmiešaš kvapku ich krvi v skúmavke. Ak sa spoja, patria do rovnakého tímu. Ak sa odpudzujú, nie. Možné tímy sú: Osadníci, Netvory a jednotlivé sólo roly, každá ako samostatný tím. Krv neklame, no ty sa nikdy nedozvieš, komu patrila.","skryta":false},
  {"nazov":"Nekromant","tim":"dedina","foto":"nekromant.jpg","popis":"Dedina sa ťa bojí, no ty vieš, že smrť nie je koniec. Počas noci sa môžeš potichu vkradnúť na cintorín a anonymne hovoriť s mŕtvymi, ktorí ešte nezabudli, čo videli. Raz počas hry si môžeš v noci vybrať mŕtveho osadníka a na konci noci ho oživíš. Vstane z hrobu a bude ti verne slúžiť, no cena za tento rituál je vysoká a už sa nedá zopakovať.","skryta":false},
  {"nazov":"Voodoo Kráľovná","tim":"dedina","foto":"voodoo.jpg","popis":"Vládneš dvom voodoo bábikám. Čiernou bábikou a ihlou pošleš hráča k predkom, bielym handrovým panákom zas ochrániš obeť (ochrana sa minie až pri reálnom útoku). Počas prvej noci nemôžeš zabíjať, takže čiernu bábiku môžeš zatiaľ len hladkať.","skryta":false},
  {"nazov":"Kat","tim":"dedina","foto":"kat.jpg","popis":"Cez deň si vyberieš jedného hráča a zatvoriš ho do mučiarne. V noci s ním môžeš anonymne hovoriť a vypočuť ho, pričom väzeň je chránený pred útokom a nikto iný ho nemôže navštíviť. Potom sa rozhodneš, či ho popravíš, alebo ráno prepustíš. Poprava je definitívna, preto súď s rozvahou, lebo tvoj meč nemá cestu späť.","skryta":false},
  {"nazov":"Morový doktor","tim":"dedina","foto":"doktor.jpg","popis":"Si jediný, kto sa v dedine neštítil ísť k chorým, keď sa všetci ostatní zavreli za dvere. Každú noc si vyberieš jedného hráča a ochrániš ho svojimi bylinami a elixírmi. Ak sa ho niekto pokúsi zabiť, prežije do rána. Ochrániť seba však nemôžeš. Nikdy nevieš, či si ochránil práve toho správneho, a ak vyberieš nesprávne, ráno ťa čaká ďalší hrob.","skryta":false},
  {"nazov":"Vdovec","tim":"dedina","foto":"vdovec.jpg","popis":"Netvory ti zobrali všetko, čo si miloval. V pištoli ti ostali len dve posledné strely, naliate olovom a hnevom. Môžeš nimi niekoho zabiť, no za deň môžeš vystreliť len jednu. Výstrely sú veľmi hlasné a ozývajú sa celou dolinou, a tak bude tvoja rola odhalená už po prvom výstrele. Nemôžeš strieľať počas diskusnej fázy v prvý deň. Dedina ťa bude ľutovať, no ty vieš, že pomsta nikoho nevráti.","skryta":false},
  {"nazov":"Strašiak","tim":"dedina","foto":"strasiak.jpg","popis":"Cez deň si osamelý strážca, ktorý obchádza polia a dohliada na dedinu, no v noci ostávaš stáť na svojom mieste uprostred poľa. Každú noc si môžeš vybrať jedného hráča, ktorého ochrániš. Ten tú noc nemôže byť zabitý a útok dopadne na teba. Keďže si zo slamy aj z dreva, prežiješ prvý útok, no pri druhom sa rozpadneš na handry a slamu. Každú noc sa automaticky chrániš aj sám.","skryta":false},
  {"nazov":"Zaklínač","tim":"dedina","foto":"zaklinac.jpg","popis":"Za mincu si sa naučil loviť to, čoho sa ostatní boja. Každú noc nastražíš pascu na jedného hráča, ktorá sa spustí až nasledujúcu noc. Ten, na koho si ju nastražil, tú noc nemôže byť zabitý. Ak naňho zaútočia netvory, najsilnejší z nich zomrie. Útok sólo zabijakov pascu spustí, ale nezabije ich.","skryta":false},
  {"nazov":"Spovedník","tim":"dedina","foto":"spovednik.jpg","popis":"Dedina ti zverila svoje hriechy a ty si ich niesol v tichu. Vyber si hráča, ktorého rola bude odhalená všetkým, keď zomrieš. Aj po smrti ostane z tvojho tela lebka, ktorá prehovorí v tvojom mene. Čo si sa zaprisahal nezradiť, vyjde z nej nahlas pred celou dedinou.","skryta":false},
  {"nazov":"Barónka","tim":"dedina","foto":"baronka.jpg","popis":"Si pani tohto kraja. Dlho si sa skrývala medzi poddanými a pozorovala, komu sa dá veriť. Raz počas hry môžeš odhaliť svoju rolu a ukázať pečatný prsteň rodu, čím sa tvoj hlas bude počítať dvojmo po zvyšok hry. Odhaliť sa však znamená stať sa terčom všetkých, ktorí sa paní boja.","skryta":false},
  {"nazov":"Bard","tim":"dedina","foto":"bard.jpg","popis":"Putuješ z dediny do dediny a tvoje piesne spájajú srdcia, ktoré by sa inak nikdy nestretli. Počas prvej noci si môžeš vybrať dvoch hráčov ako milenecký pár a zložiť im pieseň, ktorú nikto nemôže prerušiť. Ak je jeden milenec zabitý, zomrie aj druhý, lebo pieseň sa bez nich končí. Vyhráš, ak vyhrajú osadníci alebo ak sú milenci poslední, ktorí prežili. Niektoré balady sa píšu krvou.","skryta":false},
  {"nazov":"Žobrák","tim":"dedina","foto":"zobrak.jpg","popis":"Nemáš strechu nad hlavou, a tak každú noc prosíš o prístrešie u cudzích. Dedina sa na teba nepozerá, no ty vidíš viac, než by si mal. Ak v noci navštíviš iného hráča, nebudeš zabitý, aj keď ťa pri návšteve napadnú. Ak však navštíviš hráča, ktorý je sám napadnutý, alebo ak navštíviš netvora či sólo zabijaka, zomrieš.","skryta":false},
  {"nazov":"Golem","tim":"dedina","foto":"golem.jpg","popis":"Si hlinený obor, ktorého dedina kedysi ulepila na svoju obranu a oživila slovom vpísaným do čela. Každú noc si môžeš vybrať jedného hráča, ktorého budeš chrániť. Ak ty alebo tento hráč budete napadnutí, žiadny z vás nezomrie, namiesto toho si vy obaja uvidíte roly. Vzhľadom na trhliny, ktoré ti úder zanechal v tele, sa však na začiatku nasledujúcej noci rozpadneš na prach. Čím viac ťa dedina potrebuje, tým rýchlejšie sa z teba stáva hlina.","skryta":false},
  {"nazov":"Exorcista","tim":"dedina","foto":"exorcista.jpg","popis":"Si posledný, kto sa ešte odvažuje stáť tvárou v tvár zlu. V kostole si zachránil fľašu svätého ohňa, ktorý horí len tam, kde je zlo. Vieš, že môže byť tvojou spásou, ale aj záhubou. Svoj svätý oheň môžeš hodiť na iného hráča. Ak je týmto hráčom netvor, zhorí v plameňoch svätej sily. Ak nie je netvorom, oheň sa obráti proti tebe a zhoríš ty. Dedina ti verí, no ty musíš mať istotu skôr, než zapáliš knôt.","skryta":false},
  {"nazov":"Striga","tim":"dedina","foto":"striga.jpg","popis":"Do dediny si prišla ako obyčajná susedka, no v tvojej krvi driemie prastará kliatba. Nemáš žiadnu schopnosť a bojuješ po boku osadníkov. Ak ťa však v noci napadnú netvory, nezomrieš. Kliatba sa prebudí a premeníš sa na strigu. Od toho okamihu patríš k netvorom a vyhrávaš s nimi, no svoju moc si už nezískaš. Dedina netuší, že zlo, ktoré hľadá, má tvoju tvár.","skryta":false},
  {"nazov":"Ghúl","tim":"netvor","foto":"ghul.jpg","popis":"Keď zapadne slnko, meníš sa na ghúla, vychádzaš von a ovoniaš jedného hráča. Podľa pachu krvi, strachu a viery spoznáš jeho skutočnú rolu a získaš informáciu, ktorú ostatní záporáci nemajú. Nič ťa nezastaví, ani zamknuté dvere, ani cesnak, ani nič... Pach si pamätáš aj po smrti.","skryta":false},
  {"nazov":"Mora","tim":"netvor","foto":"mora.jpg","popis":"Cez deň sa tváriš ako obyčajný osadník. V noci sa zakrádaš do cudzích snov a zanechávaš v nich svoju tmavú stopu. Hráč, ktorého si takto očarila, sa nasledujúcu noc každému, kto ho skúma, javí ako Mora. Kým dedina hľadá netvora medzi svojimi, ty sa pozeráš, ako sa osadníci obracajú proti nevinným.","skryta":false},
  {"nazov":"Upír","tim":"netvor","foto":"upir.jpg","popis":"Si prastarý pán noci a ostatné netvory ťa poslúchajú, lebo vedia, že pamätáš dlhšie než samotná dedina. Tvoj hlas v noci platí dvojnásobne. Keď sa zotmie, tvoje slovo je zákon a nikto sa neodváži odporovať. Dedina vidí obyčajného suseda, no v tme sa ti klaňajú všetci, ktorí sa skrývajú.","skryta":false},
  {"nazov":"Banshee","tim":"netvor","foto":"banshee.jpg","popis":"Cez deň sa tváriš ako obyčajný osadník, no v noci sa tvoj nárek nesie dedinou a zvestuje smrť. Vyber si iného hráča, ktorý bude zabitý, keď zabijú teba, či už ťa dedina obesí, alebo ťa niekto zabije v noci. Tvoj posledný výkrik nezostane bez odozvy a odnesie so sebou ďalšiu dušu. Kto ti siahne na život, nikdy nebude vedieť, koho ešte tým zničí.","skryta":false},
  {"nazov":"Sandman","tim":"netvor","foto":"sandman.jpg","popis":"Cez deň sa tváriš ako obyčajný osadník, no po západe slnka vychádzaš s vrecom piesku. Dvakrát počas hry si cez deň vyber hráča, ktorého v noci uspíš. Tento hráč počas noci nebude môcť použiť svoje schopnosti. Kto ti raz otvorí oči, zaspí tak hlboko, že ho nezobudí ani kohútí hlas.","skryta":false},
  {"nazov":"Gorgona","tim":"netvor","foto":"gorgona.jpg","popis":"Cez deň sa tváriš ako obyčajný osadník a skrývaš pod šatkou hady, ktorých jed nemá protijed. Počas dňa si môžeš vybrať hráča, ktorého chceš otráviť. Nasledujúcu noc útoky netvorov na tohto hráča ignorujú ochranu, lebo jed prerazí aj štít, aj modlitbu. Jed však neumožňuje netvorom zabíjať sólo zabijakov. Túto schopnosť môžeš použiť dvakrát. Kto sa raz stretne s tvojím pohľadom, tomu sa už nikdy nepodarí vymaniť.","skryta":false},
  {"nazov":"Trickster","tim":"neutral","foto":"trickster.jpg","popis":"Tvojím cieľom je obohrať dobrákov aj zloduchov a dotlačiť ich k tomu, aby ťa hlasovaním poslali na popravisko. Celý život si ich iba vodil za nos svojimi klamstvami, a toto je tvoj finálny, veľkolepý žart – ak ťa vlastnoručne odsúdia a zabijú, vyhrávaš.","skryta":false},
  {"nazov":"Pomstiteľ","tim":"neutral","foto":"pomstitel.jpg","popis":"Na začiatku hry ti je pridelený dedinčan, ktorému dlhuješ odplatu. Tvojím cieľom je, aby ho počas dňa popravila dedina. Aby si vyhral, musíš ho dostať na šibenicu skôr, než zomrieš ty. Ak tvoja obeť zomrie iným spôsobom, pomsta ostane nedokončená, no vyhráš so zlou alianciou (netvory a sólo zabijaci). Obeťou môže byť ktorákoľvek rola dediny okrem Strigy.","skryta":false},
  {"nazov":"Dvojtvár","tim":"neutral","foto":"dvojtvar.jpg","popis":"Cez deň si to obyčajný sused, ktorý sa usmieva, pozdravuje a pomáha pri žatve. Keď sa zotmie, ukáže sa tvoja druhá tvár, a tá nepozná zľutovanie. Každú noc si vyberieš jednu obeť a zabiješ ju, a ráno sa postavíš medzi ostatných s čistým svedomím a nevinným výrazom. Vyhrávaš len vtedy, keď prežiješ ako posledný. Ak ťa dedina pošle na šibenicu, zistí, ktorá z tvojich tvárí bola tá pravá.","skryta":false},
  {"nazov":"Wendigo","tim":"neutral","foto":"wendigo.jpg","popis":"Si duch zimného hladu, ktorý sa nikdy nenasýti. Každú noc môžeš zabiť hráča tým, že ho zješ, alebo si udržať hlad na neskôr. Ak počkáš, tvoj hlad narastie a v jednu noc dokážeš zabiť až 5 hráčov. Čím dlhšie hladuješ, tým krvavejšia bude hostina. Vyhrávaš len vtedy, keď prežiješ ako posledný. Kým žije čo i len jeden človek, tvoj hlad neutíchne.","skryta":false},
  {"nazov":"Ifirit","tim":"neutral","foto":"ifirit.jpg","popis":"Si ohnivý démon, ktorého kedysi zapečatili v lampe a ktorý sa konečne dostal na slobodu. Každú noc si môžeš vybrať dvoch hráčov, ktorých poznačíš žeravým popolom, alebo zapáliť všetkých poznačených hráčov, čím ich zabiješ. Označenie žeravým popolom obchádza všetky ochrany. Kde sa tvoj popol dotkne, tam už nepomôže nič, len plamene.","skryta":false}
];

/* ---- HLASOVANIE ----
   Jeden riadok = jeden hlas. Stránka ich sama zráta.                    */
var HLASY = [
  {den:1, kto:"Hráč X", koho:"Hráč Y"},
  {den:1, kto:"Hráč Y", koho:"Hráč X"},
  {den:1, kto:"Hráč Z", koho:"Hráč X"}
];

/* ---- RANNÉ OBETE (kto zomrel v noci) ----
   den:  deň, v ktorý to ráno oznámiš
   kto:  meno hráča, alebo "" (prázdne), ak v noci nikto nezomrel
   ako:  napr. "Zožratý vlkolakmi" (voliteľné)
   rola: rola obete, ak ju chceš odhaliť (voliteľné)                      */
var UMRTIA = [
  {den:1, kto:"Hráč XY", ako:"Zožratý v noci", rola:"Survivalista"}
];

/* ---- PRÍBEH / KRONIKA (zobrazuje sa na hlavnej stránke) ----
   Jeden záznam = jeden deň. Píš, kto čo spravil a čo sa stalo.
   text: zoznam odsekov, každý odsek v úvodzovkách, oddelený čiarkou.
   Najnovší deň môžeš pridať na koniec, stránka ich sama zoradí.
   Pri exporte do archívu sa príbeh prenesie sám.                         */
var KRONIKA = [
  {den:1, nadpis:"Úvod",
   text:["Santosville bola vždy tichá dedina ukrytá medzi horami. Ľudia si tu poznali mená aj tajomstvá a dlho sa zdalo, že žiadne z nich nie je nebezpečné.",

"Jedného podvečera však pri studni našli stopy, ktoré nepatrili nikomu. Z lesa sa ozvali zvuky, aké tam nikto nikdy nepočul, a po uliciach sa rozniesla zvesť, že medzi domami sa čosi ukrýva.",

"Osadníci sa držia pohromade a hľadajú pravdu. Netvory sa držia v tieni a čakajú na noc. A potom sú tu tí, ktorí nepatria nikomu, každý s vlastným cieľom a vlastnými tajomstvami.",

"Odvtedy sa dedina každý deň schádza, hádá sa, hlasuje a vynáša rozsudky. Každú noc sa v tme deje čosi, o čom ráno nikto nechce hovoriť. Táto kronika zapisuje, čo sa stalo."]},
 /* {den:2, nadpis:"Prvá poprava",
text:["Dedina sa zhromaždila pri studni. Peter obvinil Janu.",
"Jana sa bránila, no hlasy boli jasné. Bola to Roľníčka."]},*/
         
];

var ARCHIV = [];
/* ---- ARCHÍV HIER ----
   Povinné: nazov, datum, hracov, strana, vitazi, popis
   Voliteľné (divák si ich rozklikne ako "Priebeh hry"):
     pribeh: príbeh po dňoch (rovnaký formát ako KRONIKA)
     hraci: zoznam hráčov s rolou a osudom
     dni:   noc a poprava po dňoch
     hlasy: hlasovanie (rovnaký formát ako HLASY vyššie)
   Najjednoduchšie: otvor archiv.html#admin a použi tlačidlo na export. */
/*var ARCHIV = [
 {nazov:"Ukážkové kolo", datum:"1. 11. 2026", hracov:4, strana:"Dedina", vitazi:["Hráč 1","Hráč 2"],
   popis:"Dedina vyhrala v 2. dni. ",
   pribeh:[
     {den:1, nadpis:"Prvá noc", text:["Veštec zbadal vlkolaka a ráno to oznámil dedine.","Dedina Hráča 3 obesila."]}
   ],
   hraci:[
     {meno:"Hráč 1", rola:"Druid",  osud:"Prežil"},
     {meno:"Hráč 2", rola:"Druid",  osud:"Prežil"},
     {meno:"Hráč 3", rola:"Vlkolak", osud:"Obesený, deň 1"},
     {meno:"Hráč 4", rola:"Čarodej",  osud:"Zožratý v noci 1"}
   ],
   dni:[
     {den:1, noc:"Dedina sa prebudila. Zomrel Hráč X.", poprava:"Dedina obesila Hráča Y. Bol to Dilino."}
   ],
   hlasy:[
     {den:1, kto:"Hráč X", koho:"Hráč X"},
     {den:1, kto:"Hráč Y", koho:"Hráč Y"}
   ]}
];*/
