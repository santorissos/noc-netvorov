/* =====================================================
   DÁTA HRY – tu upravuješ takmer všetko
   Po zmene súbor uložíš a priečinok znova nahráš na Netlify.
   ===================================================== */

/* ---- STAV HRY (pás pod úvodom) ---- */
var STAV = {
  den: 1,                            // číslo dňa
  faza: "Deň",                       // "Deň" alebo "Noc"
  dalsiaNazov: "Poprava o",          // čo nasleduje
  dalsiaCas: "2026-11-02T20:00:00",  // kedy (rok-mesiac-deň T hodina:minúta)
  messenger: "https://m.me/ch/TVOJ_ODKAZ", // odkaz na skupinový chat
  zvuk: "audio/ambient.mp3"          // zvuk na pozadí (voliteľné)
};

/* ---- ODKAZY NA FORMULÁRE ----
   prihlaska: formulár s prihláškou do hry (Google Forms)
   Odkaz na vloženie: Google Forms → Odoslať → ikona <> → skopíruj len adresu zo src="…"  */
var ODKAZY = {
  prihlaska: ""
};

/* ---- HRÁČI ----
   foto:  názov súboru v priečinku img/hraci/ (bez diakritiky, napr. jan.jpg)
   stav:  "zije" alebo "mrtvy"
   rola:  napíš rolu až keď hráč zomrie, dovtedy "?"
   poznamka: napr. "Obesený, deň 1" alebo "Zožratý v noci 2"            */
var HRACI = [
  {meno:"Hráč 1", foto:"hrac1.jpg", stav:"zije", rola:"?", poznamka:""},
  {meno:"Hráč 2", foto:"hrac2.jpg", stav:"zije", rola:"?", poznamka:""},
  {meno:"Hráč 3", foto:"hrac3.jpg", stav:"zije", rola:"?", poznamka:""},
  {meno:"Hráč 4", foto:"hrac4.jpg", stav:"zije", rola:"?", poznamka:""},
  {meno:"Hráč 5", foto:"hrac5.jpg", stav:"zije", rola:"?", poznamka:""},
  {meno:"Hráč 6", foto:"hrac6.jpg", stav:"zije", rola:"?", poznamka:""},
  {meno:"Hráč 7", foto:"hrac7.jpg", stav:"zije", rola:"?", poznamka:""},
  {meno:"Hráč 8", foto:"hrac8.jpg", stav:"zije", rola:"?", poznamka:""},
  {meno:"Hráč 9", foto:"hrac9.jpg", stav:"zije", rola:"?", poznamka:""},
  {meno:"Hráč 10", foto:"hrac10.jpg", stav:"zije", rola:"?", poznamka:""},
  {meno:"Hráč 11", foto:"hrac11.jpg", stav:"zije", rola:"?", poznamka:""},
  {meno:"Hráč 12", foto:"hrac12.jpg", stav:"zije", rola:"?", poznamka:""},
  {meno:"Hráč 13", foto:"hrac13.jpg", stav:"zije", rola:"?", poznamka:""},
  {meno:"Hráč 14", foto:"hrac14.jpg", stav:"zije", rola:"?", poznamka:""},
  {meno:"Hráč 15", foto:"hrac15.jpg", stav:"zije", rola:"?", poznamka:""},
  {meno:"Hráč 16", foto:"hrac16.jpg", stav:"zije", rola:"?", poznamka:""},
];

/* ---- HLASOVANIE ----
   Jeden riadok = jeden hlas. Stránka ich sama zráta.                    */
var HLASY = [
  {den:1, kto:"Hráč 1", koho:"Hráč 3"},
  {den:1, kto:"Hráč 2", koho:"Hráč 3"},
  {den:1, kto:"Hráč 4", koho:"Hráč 2"}
];

/* ---- RANNÉ OBETE (kto zomrel v noci) ----
   den:  deň, v ktorý to ráno oznámiš
   kto:  meno hráča, alebo "" (prázdne), ak v noci nikto nezomrel
   ako:  napr. "Zožratý vlkolakmi" (voliteľné)
   rola: rola obete, ak ju chceš odhaliť (voliteľné)                      */
var UMRTIA = [
  {den:2, kto:"Hráč 4", ako:"Zožratý v noci", rola:"Roľník"}
];

/* ---- PRÍBEH / KRONIKA (zobrazuje sa na hlavnej stránke) ----
   Jeden záznam = jeden deň. Píš, kto čo spravil a čo sa stalo.
   text: zoznam odsekov, každý odsek v úvodzovkách, oddelený čiarkou.
   Najnovší deň môžeš pridať na koniec, stránka ich sama zoradí.
   Pri exporte do archívu sa príbeh prenesie sám.                         */
var KRONIKA = [
  {den:1, nadpis:"Prvá noc",
   text:["Dedina sa uložila k spánku. Nikto nevedel, kto sa medzi nimi skrýva.",
         "Veštec si v tme posvietil na Hráča 3. To, čo zbadal, si nechal pre seba."]}
];

/* ---- ARCHÍV HIER ----
   Povinné: nazov, datum, hracov, strana, vitazi, popis
   Voliteľné (divák si ich rozklikne ako "Priebeh hry"):
     pribeh: príbeh po dňoch (rovnaký formát ako KRONIKA)
     hraci: zoznam hráčov s rolou a osudom
     dni:   noc a poprava po dňoch
     hlasy: hlasovanie (rovnaký formát ako HLASY vyššie)
   Najjednoduchšie: otvor archiv.html#admin a použi tlačidlo na export. */
var ARCHIV = [
  {nazov:"Ukážkové kolo", datum:"1. 11. 2026", hracov:4, strana:"Dedina", vitazi:["Hráč 1","Hráč 2"],
   popis:"Dedina vyhrala v 2. dni. Zmaž tento záznam a pridaj svoje.",
   pribeh:[
     {den:1, nadpis:"Prvá noc", text:["Veštec zbadal vlkolaka a ráno to oznámil dedine.","Dedina Hráča 3 obesila."]}
   ],
   hraci:[
     {meno:"Hráč 1", rola:"Veštec",  osud:"Prežil"},
     {meno:"Hráč 2", rola:"Roľník",  osud:"Prežil"},
     {meno:"Hráč 3", rola:"Vlkolak", osud:"Obesený, deň 1"},
     {meno:"Hráč 4", rola:"Roľník",  osud:"Zožratý v noci 1"}
   ],
   dni:[
     {den:1, noc:"Dedina sa prebudila. Zomrel Hráč 4.", poprava:"Dedina obesila Hráča 3. Bol to Vlkolak."}
   ],
   hlasy:[
     {den:1, kto:"Hráč 1", koho:"Hráč 3"},
     {den:1, kto:"Hráč 2", koho:"Hráč 3"}
   ]}
];
