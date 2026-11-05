/* =====================================================
   DÁTA HRY – tu upravuješ takmer všetko
   Po zmene súbor uložíš a priečinok znova nahráš na Netlify.
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
  prihlaska: ""
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
