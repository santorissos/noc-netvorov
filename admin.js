/* Správa hry: úpravy cez formuláre, výstup je nový data.js na stiahnutie. */
(function(){
  var KLUC="santosville-admin-koncept-v1";
  var KLUCE=["STAV","ODKAZY","WEB","HRACI","ROLY","KRONIKA","HLASY","UMRTIA","ARCHIV"];
  var clone=function(x){return JSON.parse(JSON.stringify(x))};
  var $=function(id){return document.getElementById(id)};

  /* ---------- Stav (z data.js alebo z konceptu) ---------- */
  var S, zKonceptu=false;
  function zoWebu(){
    var g=function(n,d){try{return clone(window[n])}catch(e){return d}};
    return {STAV:g("STAV",{}),ODKAZY:g("ODKAZY",{}),WEB:g("WEB",{}),HRACI:g("HRACI",[]),ROLY:g("ROLY",[]),
      KRONIKA:g("KRONIKA",[]),HLASY:g("HLASY",[]),UMRTIA:g("UMRTIA",[]),ARCHIV:g("ARCHIV",[])};
  }
  try{var k=localStorage.getItem(KLUC); if(k){S=JSON.parse(k); zKonceptu=true}}catch(e){}
  if(!S) S=zoWebu();
  var zaklad=zoWebu();
  KLUCE.forEach(function(n){if(S[n]==null) S[n]=clone(zaklad[n])});

  var nezmenene=JSON.stringify(zoWebu());
  var timer;
  function zmena(){
    var d=$("a-stav"), zmenene=JSON.stringify(S)!==nezmenene;
    d.textContent=zmenene?"Sú tu zmeny, ktoré nie sú na webe":"Bez zmien oproti webu";
    d.classList.toggle("zmenene",zmenene);
    clearTimeout(timer);
    timer=setTimeout(function(){try{localStorage.setItem(KLUC,JSON.stringify(S))}catch(e){}},300);
    var dl=$("a-hraci"); if(dl) dl.innerHTML=S.HRACI.map(function(h){return '<option value="'+esc(h.meno)+'">'}).join("");
    var dr=$("a-roly"); if(dr) dr.innerHTML=S.ROLY.map(function(r){return '<option value="'+esc(r.nazov)+'">'}).join("");
    obnovKontrolu();
  }
  function kontrola(){
    var w=[], mena={}, role={}, videne={};
    var pridaj=function(t){if(!videne[t]){videne[t]=1;w.push(t)}};
    S.ROLY.forEach(function(r){
      var n=(r.nazov||"").trim();
      if(!n) pridaj("Je tu rola bez názvu."); else {if(role[n.toLowerCase()]) pridaj('Rola "'+n+'" je v zozname rolí dvakrát.'); role[n.toLowerCase()]=1}
    });
    S.HRACI.forEach(function(h){
      var m=(h.meno||"").trim();
      if(!m){pridaj("Je tu hráč bez mena.");return}
      if(mena[m]) pridaj('Meno "'+m+'" je v zozname hráčov dvakrát.'); mena[m]=1;
      if(h.stav==="mrtvy"){
        if(!h.rola||h.rola==="?") pridaj(m+" je mŕtvy, ale nemá vyplnenú rolu.");
        else if(S.ROLY.length&&!role[String(h.rola).trim().toLowerCase()]) pridaj('Rola "'+h.rola+'" (hráč '+m+') nie je medzi rolami, štatistiky ju budú rátať samostatne.');
      }
    });
    var hl={};
    S.HLASY.forEach(function(v){
      if(!v.kto||!v.koho){pridaj("Hlas v deň "+v.den+" má prázdne meno.");return}
      [v.kto,v.koho].forEach(function(n){if(!mena[n]) pridaj('Hlas (deň '+v.den+'): "'+n+'" nie je v zozname hráčov.')});
      var k=v.den+"|"+v.kto; if(hl[k]) pridaj(v.kto+" hlasoval v deň "+v.den+" viackrát."); hl[k]=1;
    });
    S.UMRTIA.forEach(function(u){if(u.kto&&!mena[u.kto]) pridaj('Obeť (deň '+u.den+'): "'+u.kto+'" nie je v zozname hráčov.')});
    var dn={};
    S.KRONIKA.forEach(function(d){
      if(dn[d.den]) pridaj("Deň "+d.den+" je v kronike dvakrát."); dn[d.den]=1;
      if(!d.text||!d.text.length) pridaj("Záznam kroniky pre deň "+d.den+" nemá žiadny text.");
    });
    S.ARCHIV.forEach(function(g){
      if(!g.nazov) pridaj("Záznam v archíve nemá názov.");
      if(!g.vitazi||!g.vitazi.length) pridaj('Hra "'+(g.nazov||"bez názvu")+'" v archíve nemá víťazov.');
    });
    var t=new Date(S.STAV.dalsiaCas);
    if(isNaN(t)) pridaj("Čas „čo nasleduje“ v Stave hry nie je platný dátum.");
    else if(t<new Date()) pridaj("Čas „čo nasleduje“ v Stave hry je v minulosti, odpočet na webe ukáže „už teraz“.");
    return w;
  }
  function obnovKontrolu(){
    var d=$("a-kontrola"); if(!d) return;
    var w=kontrola();
    d.hidden=!w.length;
    d.innerHTML="<summary>Upozornenia ("+w.length+")</summary><ul>"+w.map(function(x){return "<li>"+esc(x)+"</li>"}).join("")+"</ul>";
  }
  function esc(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}

  /* ---------- Pomocné stavebné funkcie ---------- */
  function el(t,a,kids){
    var e=document.createElement(t);
    for(var x in (a||{})){
      if(x==="class") e.className=a[x];
      else if(x==="text") e.textContent=a[x];
      else if(x.slice(0,2)==="on") e.addEventListener(x.slice(2),a[x]);
      else e.setAttribute(x,a[x]);
    }
    (kids||[]).forEach(function(c){if(c!=null) e.appendChild(typeof c==="string"?document.createTextNode(c):c)});
    return e;
  }
  function tlacidlo(text,fn,trieda){return el("button",{type:"button","class":trieda||"btn druhy mala",text:text,onclick:fn})}

  /* Pole viazané na obj[key]. o: type, options, rows, list, hint, get, set, onchange */
  function pole(label,obj,key,o){
    o=o||{}; var t=o.type||"text", inp;
    var get=o.get||function(){return obj[key]==null?"":obj[key]};
    var set=o.set||function(v){obj[key]=(t==="number")?(v===""?"":Number(v)):v};
    if(t==="textarea"){inp=el("textarea",{rows:o.rows||4}); inp.value=get()}
    else if(t==="select"){
      inp=el("select");
      o.options.forEach(function(op){var v=Array.isArray(op)?op[0]:op, l=Array.isArray(op)?op[1]:op; inp.appendChild(el("option",{value:v,text:l}))});
      inp.value=get();
    }
    else if(t==="checkbox"){inp=el("input",{type:"checkbox"}); inp.checked=!!obj[key]}
    else{
      inp=el("input",{type:t==="datetime"?"datetime-local":t});
      if(o.list) inp.setAttribute("list",o.list);
      if(o.ph) inp.setAttribute("placeholder",o.ph);
      inp.value=get();
    }
    inp.addEventListener("input",function(){
      if(t==="checkbox") obj[key]=inp.checked; else set(inp.value);
      zmena();
    });
    if(o.onchange) inp.addEventListener("change",function(){o.onchange(inp.value)});
    return el("label",{"class":"pole"+(t==="checkbox"?" zaskrt":"")+(o.siroke?" siroke":"")},
      t==="checkbox"?[inp,el("span",{text:label})]:[el("span",{text:label}),inp,o.hint?el("small",{text:o.hint}):null]);
  }

  /* Zoznam kariet s presúvaním a mazaním */
  function zoznam(arr,nadpis,telo,novy,pridatText,otvorPosledny,popisPrazdny){
    var box=el("div",{"class":"zoznam"});
    if(!arr.length) box.appendChild(el("p",{"class":"prazdne",text:popisPrazdny||"Zatiaľ nič."}));
    arr.forEach(function(it,i){
      var sum=el("span",{text:nadpis(it,i)});
      var d=el("details",{"class":"karta"},[el("summary",{},[sum])]);
      if(otvorPosledny&&i===arr.length-1) d.setAttribute("open","");
      var body=el("div",{"class":"karta-telo"},[telo(it,i)]);
      var akcie=el("div",{"class":"akcie"},[
        i>0?tlacidlo("↑ Vyššie",function(){arr.splice(i-1,0,arr.splice(i,1)[0]);zmena();prekresli()}):null,
        i<arr.length-1?tlacidlo("↓ Nižšie",function(){arr.splice(i+1,0,arr.splice(i,1)[0]);zmena();prekresli()}):null,
        tlacidlo("Odstrániť",function(){
          if(!window.confirm("Naozaj odstrániť: "+nadpis(it,i)+"?")) return;
          arr.splice(i,1);zmena();prekresli();
        },"zmaz mala")
      ]);
      body.appendChild(akcie);
      d.appendChild(body);
      d.addEventListener("input",function(){sum.textContent=nadpis(it,i)});
      box.appendChild(d);
    });
    box.appendChild(el("p",{},[tlacidlo(pridatText,function(){arr.push(novy());zmena();otvor=true;prekresli()},"btn")]));
    return box;
  }
  var formArchiv=null;
  var otvor=false; // po pridaní sa nová karta otvorí

  function mriezka(polia){return el("div",{"class":"mriezka"},polia)}
  function nadpis(t){return el("h3",{text:t})}
  function dalsiNeniDen(){return Number(S.STAV.den)||1}

  /* ---------- Záložky ---------- */
  var TABY=[
    {id:"stav",nazov:"Stav hry",build:tabStav},
    {id:"hraci",nazov:"Hráči",build:tabHraci},
    {id:"kronika",nazov:"Kronika",build:tabKronika},
    {id:"hlasy",nazov:"Hlasovanie a obete",build:tabHlasy},
    {id:"roly",nazov:"Roly",build:tabRoly},
    {id:"texty",nazov:"Texty webu",build:tabTexty},
    {id:"archiv",nazov:"Archív",build:tabArchiv}
  ];
  var aktivny="stav";
  try{var h=location.hash.replace("#",""); if(TABY.some(function(t){return t.id===h})) aktivny=h}catch(e){}

  function prekresli(){
    var scrollY=window.scrollY;
    $("a-taby").innerHTML="";
    TABY.forEach(function(t){
      var b=tlacidlo(t.nazov,function(){aktivny=t.id;otvor=false;history.replaceState(null,"","#"+t.id);prekresli();window.scrollTo(0,0)},"tab");
      b.setAttribute("aria-pressed",t.id===aktivny);
      $("a-taby").appendChild(b);
    });
    var p=$("a-panel"); p.innerHTML="";
    TABY.filter(function(t){return t.id===aktivny})[0].build(p);
    otvor=false;
    window.scrollTo(0,scrollY);
  }

  /* --- Stav hry --- */
  function tabStav(p){
    var st=S.STAV, od=S.ODKAZY;
    p.appendChild(nadpis("Pás so stavom hry"));
    p.appendChild(mriezka([
      pole("Číslo dňa",st,"den",{type:"number"}),
      pole("Teraz je",st,"faza",{type:"select",options:["Deň","Noc"]}),
      pole("Čo nasleduje",st,"dalsiaNazov",{ph:"napr. Poprava"}),
      pole("Kedy to nastane",st,"dalsiaCas",{type:"datetime",
        get:function(){return String(st.dalsiaCas||"").slice(0,16)},
        set:function(v){st.dalsiaCas=v?v+":00":""}})
    ]));
    p.appendChild(nadpis("Odkazy"));
    p.appendChild(mriezka([
      pole("Pozvánka na Discord",st,"discord",{siroke:true}),
      pole("Zvuk na pozadí (súbor)",st,"zvuk",{ph:"audio/ambient.mp3"}),
      pole("Formulár prihlášky (Google Forms, adresa zo src=\"…\")",od,"prihlaska",{siroke:true})
    ]));
    p.appendChild(nadpis("Rýchly posun hry"));
    p.appendChild(el("p",{"class":"lead",text:"Prepne fázu, číslo dňa a čas ďalšej udalosti. Časy si môžeš zmeniť, prehliadač si ich zapamätá."}));
    var cs=casy();
    p.appendChild(mriezka([
      pole("Ráno (prebudenie dediny) o",cs,"rano",{type:"time",onchange:ulozCasy}),
      pole("Večer (poprava) o",cs,"vecer",{type:"time",onchange:ulozCasy})
    ]));
    p.appendChild(el("p",{},[
      tlacidlo("Večer: prepnúť na Noc",function(){
        ulozCasy(); st.faza="Noc"; st.dalsiaNazov="Ráno o"; st.dalsiaCas=dalsi(cs.rano); zmena(); prekresli();
      },"btn")," ",
      tlacidlo("Ráno: prepnúť na ďalší deň",function(){
        ulozCasy(); st.den=(Number(st.den)||1)+1; st.faza="Deň"; st.dalsiaNazov="Poprava o"; st.dalsiaCas=dalsi(cs.vecer); zmena(); prekresli();
      },"btn")
    ]));
  }
  function casy(){
    var c={rano:"08:00",vecer:"20:00"};
    try{var z=JSON.parse(localStorage.getItem("santosville-admin-casy")); if(z&&z.rano&&z.vecer) c=z}catch(e){}
    casy.hodnoty=c; return c;
  }
  function ulozCasy(){try{localStorage.setItem("santosville-admin-casy",JSON.stringify(casy.hodnoty))}catch(e){}}
  function dalsi(hhmm){
    var q=String(hhmm).split(":"), d=new Date(); d.setHours(Number(q[0])||0,Number(q[1])||0,0,0);
    if(d<=new Date()) d.setDate(d.getDate()+1);
    var z=function(n){return (n<10?"0":"")+n};
    return d.getFullYear()+"-"+z(d.getMonth()+1)+"-"+z(d.getDate())+"T"+z(d.getHours())+":"+z(d.getMinutes())+":00";
  }

  /* --- Hráči --- */
  function novyHrac(){
    var n=S.HRACI.length+1;
    return {meno:"Hráč "+n,foto:"",stav:"zije",rola:"?",poznamka:"",vek:"",bydlisko:"",povolanie:"",zaluby:"",o_mne:""};
  }
  function premenujHraca(stare,nove){
    if(!stare||stare===nove) return;
    S.HLASY.forEach(function(v){if(v.kto===stare) v.kto=nove; if(v.koho===stare) v.koho=nove});
    S.UMRTIA.forEach(function(u){if(u.kto===stare) u.kto=nove});
  }
  function tabHraci(p){
    p.appendChild(nadpis("Hráči ("+S.HRACI.filter(function(h){return h.stav!=="mrtvy"}).length+" žije z "+S.HRACI.length+")"));
    p.appendChild(el("p",{"class":"lead",text:"Rolu napíš až keď hráč zomrie, dovtedy nechaj „?“. Profil je verejný, píš len to, s čím hráč súhlasí."}));
    p.appendChild(rychleUmrtie());
    p.appendChild(zoznam(S.HRACI,
      function(h){return (h.meno||"(bez mena)")+(h.stav==="mrtvy"?" †":"")},
      function(h){
        var stare=h.meno;
        var dal=el("div",{});
        var dalsie=pole("Ďalšie údaje (každý riadok „Názov: hodnota“)",h,"dalsie",{type:"textarea",rows:3,siroke:true,
          get:function(){return Object.keys(h.dalsie||{}).map(function(k){return k+": "+h.dalsie[k]}).join("\n")},
          set:function(v){
            var o={}; v.split("\n").forEach(function(r){var i=r.indexOf(":"); if(i>0&&r.slice(i+1).trim()) o[r.slice(0,i).trim()]=r.slice(i+1).trim()});
            if(Object.keys(o).length) h.dalsie=o; else delete h.dalsie;
          }});
        return mriezka([
          pole("Meno",h,"meno",{onchange:function(v){premenujHraca(stare,v);stare=v}}),
          pole("Fotka (názov súboru v img/hraci/)",h,"foto",{ph:"jan.jpg"}),
          pole("Stav",h,"stav",{type:"select",options:[["zije","Žije"],["mrtvy","Mŕtvy"]]}),
          pole("Rola (až po smrti)",h,"rola"),
          pole("Poznámka",h,"poznamka",{ph:"napr. Obesený, deň 1"}),
          pole("Vek",h,"vek"),
          pole("Bydlisko (mesto)",h,"bydlisko"),
          pole("Povolanie",h,"povolanie"),
          pole("Záľuby",h,"zaluby"),
          pole("O mne",h,"o_mne",{type:"textarea",rows:3,siroke:true}),
          dalsie
        ]);
      },novyHrac,"+ Pridať hráča",otvor,"Zatiaľ žiadni hráči."));
  }

  function rychleUmrtie(){
    var zivi=S.HRACI.filter(function(h){return h.stav!=="mrtvy"});
    var f={kto:zivi[0]?zivi[0].meno:"",ako:"Obesený",rola:"",pozn:""};
    return el("div",{"class":"rychla"},[
      el("h4",{text:"Rýchla akcia: hráč zomrel"}),
      mriezka([
        pole("Hráč",f,"kto",{type:"select",options:zivi.length?zivi.map(function(h){return h.meno}):[""]}),
        pole("Ako zomrel",f,"ako",{type:"select",options:["Obesený","Zožratý v noci","Zabitý v noci","Zastrelený","Iné"]}),
        pole("Rola",f,"rola",{list:"a-roly",ph:"napr. Kat"}),
        pole("Vlastná poznámka (nepovinné)",f,"pozn")
      ]),
      el("p",{},[tlacidlo("Označiť ako mŕtveho",function(){
        var h=S.HRACI.filter(function(x){return x.meno===f.kto})[0]; if(!h) return;
        var den=dalsiNeniDen();
        h.stav="mrtvy"; if(f.rola.trim()) h.rola=f.rola.trim();
        h.poznamka=f.pozn.trim()||(f.ako+", deň "+den);
        if(/v noci/.test(f.ako)) S.UMRTIA.push({den:den,kto:h.meno,ako:f.ako,rola:h.rola==="?"?"":h.rola});
        zmena(); prekresli();
      },"btn")])
    ]);
  }

  /* --- Kronika --- */
  function tabKronika(p){
    p.appendChild(nadpis("Kronika (príbeh)"));
    p.appendChild(el("p",{"class":"lead",text:"Jeden záznam = jeden deň. Odseky v texte oddeľ prázdnym riadkom."}));
    p.appendChild(zoznam(S.KRONIKA,
      function(d){return "Deň "+(d.den===""?"?":d.den)+(d.nadpis?": "+d.nadpis:"")},
      function(d){
        return mriezka([
          pole("Deň",d,"den",{type:"number"}),
          pole("Nadpis",d,"nadpis",{ph:"napr. Prvá poprava"}),
          pole("Text",d,"text",{type:"textarea",rows:10,siroke:true,
            get:function(){return Array.isArray(d.text)?d.text.join("\n\n"):(d.text||"")},
            set:function(v){d.text=v.split(/\n\s*\n/).map(function(s){return s.trim()}).filter(Boolean)}})
        ]);
      },
      function(){var m=0;S.KRONIKA.forEach(function(d){m=Math.max(m,Number(d.den)||0)});return {den:m+1,nadpis:"",text:[]}},
      "+ Pridať deň do kroniky",otvor,"Kronika je prázdna."));
  }

  /* --- Hlasovanie a obete --- */
  function tabHlasy(p){
    p.appendChild(nadpis("Ranné obete"));
    p.appendChild(el("p",{"class":"lead",text:"Deň, v ktorý to ráno oznámiš. Ak v noci nikto nezomrel, nechaj „Kto“ prázdne."}));
    p.appendChild(tabulka(S.UMRTIA,[
      ["Deň","den","number"],["Kto","kto","text","a-hraci"],["Ako","ako","text"],["Rola","rola","text"]
    ],function(){return {den:dalsiNeniDen(),kto:"",ako:"",rola:""}},"+ Pridať obeť"));
    p.appendChild(nadpis("Hlasy"));
    p.appendChild(el("p",{"class":"lead",text:"Jeden riadok = jeden hlas. Zrátajú sa samy."}));
    p.appendChild(rychlyHlas());
    p.appendChild(tabulka(S.HLASY,[
      ["Deň","den","number"],["Kto hlasoval","kto","text","a-hraci"],["Za koho","koho","text","a-hraci"]
    ],function(){
      var posl=S.HLASY[S.HLASY.length-1];
      return {den:posl?posl.den:dalsiNeniDen(),kto:"",koho:""};
    },"+ Pridať hlas"));
  }
  var fHlas=null;
  function rychlyHlas(){
    var zivi=S.HRACI.filter(function(h){return h.stav!=="mrtvy"}).map(function(h){return h.meno});
    var f=fHlas=fHlas||{den:dalsiNeniDen(),kto:"",koho:""};
    var info=el("p",{"class":"info"});
    var nehlasovali=function(){
      var uz=S.HLASY.filter(function(v){return Number(v.den)===Number(f.den)}).map(function(v){return v.kto});
      var ch=S.HRACI.filter(function(h){return h.stav!=="mrtvy"&&uz.indexOf(h.meno)<0}).map(function(h){return h.meno});
      info.textContent=ch.length?"Zatiaľ nehlasovali (deň "+f.den+"): "+ch.join(", ")+".":"V deň "+f.den+" hlasovali všetci žijúci.";
    };
    nehlasovali();
    return el("div",{"class":"rychla"},[
      el("h4",{text:"Rýchle pridanie hlasu"}),
      mriezka([
        pole("Deň",f,"den",{type:"number",onchange:nehlasovali}),
        pole("Kto hlasoval",f,"kto",{type:"select",options:[""].concat(zivi)}),
        pole("Za koho",f,"koho",{type:"select",options:[""].concat(zivi)})
      ]),
      el("p",{},[tlacidlo("+ Pridať hlas",function(){
        if(!f.kto||!f.koho){window.alert("Vyber, kto hlasoval a za koho.");return}
        S.HLASY.push({den:Number(f.den),kto:f.kto,koho:f.koho});
        f.kto="";f.koho="";zmena();prekresli();
      },"btn")]),info
    ]);
  }
  function tabulka(arr,stlpce,novy,pridat){
    var w=el("div",{"class":"tbl"});
    var t=el("table",{"class":"a-tab"});
    t.appendChild(el("thead",{},[el("tr",{},stlpce.map(function(s){return el("th",{text:s[0]})}).concat([el("th")]))]));
    var tb=el("tbody");
    arr.forEach(function(r,i){
      tb.appendChild(el("tr",{},stlpce.map(function(s){
        if(s[2]==="checkbox"){
          var cb=el("input",{type:"checkbox"}); cb.checked=!!r[s[1]]; cb.setAttribute("aria-label",s[0]);
          cb.addEventListener("change",function(){r[s[1]]=cb.checked;zmena()});
          return el("td",{},[cb]);
        }
        var inp=el("input",{type:s[2]}); if(s[3]) inp.setAttribute("list",s[3]);
        inp.value=r[s[1]]==null?"":r[s[1]];
        inp.setAttribute("aria-label",s[0]);
        inp.addEventListener("input",function(){r[s[1]]=s[2]==="number"?(inp.value===""?"":Number(inp.value)):inp.value;zmena()});
        return el("td",{},[inp]);
      }).concat([el("td",{},[tlacidlo("✕",function(){arr.splice(i,1);zmena();prekresli()},"zmaz mala")])])));
    });
    t.appendChild(tb); w.appendChild(t);
    var box=el("div",{},[w]);
    if(!arr.length) box.insertBefore(el("p",{"class":"prazdne",text:"Zatiaľ nič."}),w);
    box.appendChild(el("p",{},[tlacidlo(pridat,function(){arr.push(novy());zmena();prekresli()},"btn")]));
    return box;
  }

  /* --- Roly --- */
  function tabRoly(p){
    p.appendChild(nadpis("Roly ("+S.ROLY.length+")"));
    p.appendChild(el("p",{"class":"lead",text:"Karty na hlavnej stránke v poradí, v akom ich tu vidíš. Fotka patrí do priečinka img/."}));
    var TIM={dedina:"Osadníci",netvor:"Netvory",neutral:"Sólo"};
    p.appendChild(zoznam(S.ROLY,
      function(r){return (r.nazov||"(bez názvu)")+" · "+(TIM[r.tim]||"Osadníci")+(r.skryta?" · zahmlená":"")},
      function(r){
        return mriezka([
          pole("Názov",r,"nazov"),
          pole("Tím",r,"tim",{type:"select",options:[["dedina","Osadníci"],["netvor","Netvory"],["neutral","Sólo"]]}),
          pole("Fotka (názov súboru v img/)",r,"foto",{ph:"kat.jpg"}),
          pole("Zahmliť kartu (rola ešte nie je odhalená)",r,"skryta",{type:"checkbox"}),
          pole("Popis",r,"popis",{type:"textarea",rows:6,siroke:true})
        ]);
      },
      function(){return {nazov:"Nová rola",tim:"dedina",foto:"",popis:"",skryta:false}},
      "+ Pridať rolu",otvor,"Zatiaľ žiadne roly."));
  }

  /* --- Texty webu --- */
  function riadkyPole(w,k){return {get:function(){return (w[k]||[]).join("\n")},set:function(v){w[k]=v.split("\n").map(function(x){return x.trim()}).filter(Boolean)}}}
  function tabTexty(p){
    var w=S.WEB;
    var odseky=function(k){return {type:"textarea",rows:7,siroke:true,
      get:function(){return (w[k]||[]).join("\n\n")},
      set:function(v){w[k]=v.split(/\n\s*\n/).map(function(x){return x.trim()}).filter(Boolean)}}};
    p.appendChild(nadpis("Úvod na hlavnej stránke"));
    p.appendChild(mriezka([pole("Úvodný text pod názvom",w,"uvod",{type:"textarea",rows:3,siroke:true})]));
    p.appendChild(nadpis("Pravidlá"));
    p.appendChild(mriezka([pole("Úvod pravidiel (odseky oddeľ prázdnym riadkom)",w,"pravidla_uvod",odseky("pravidla_uvod"))]));
    p.appendChild(el("h4",{text:"Časová os dňa a noci"}));
    p.appendChild(tabulka(w.casy=w.casy||[],[["Čas","cas","text"],["Čo sa deje","text","text"],["Deň (zlatá bodka)","den","checkbox"]],
      function(){return {cas:"",text:"",den:true}},"+ Pridať riadok"));
    p.appendChild(mriezka([
      pole("Poznámka pod časovou osou",w,"casy_poznamka",{siroke:true}),
      pole("Ako sa vyhráva (jeden riadok = jedna veta)",w,"vyhra",Object.assign({type:"textarea",rows:5,siroke:true},riadkyPole(w,"vyhra")))
    ]));
    p.appendChild(nadpis("Prihláška a pätička"));
    p.appendChild(mriezka([
      pole("Text nad prihláškou",w,"prihlaska_text",{siroke:true}),
      pole("Meno moderátora v päte",w,"moderator")
    ]));
    p.appendChild(nadpis("Časté otázky"));
    p.appendChild(zoznam(w.faq=w.faq||[],
      function(f){return f.o||"(nová otázka)"},
      function(f){return mriezka([pole("Otázka",f,"o",{siroke:true}),pole("Odpoveď",f,"a",{type:"textarea",rows:3,siroke:true})])},
      function(){return {o:"",a:""}},"+ Pridať otázku",otvor,"Zatiaľ žiadne otázky."));
    p.appendChild(el("p",{"class":"poznamka",text:"Náhľad odkazu (og:image) a názov v karte prehliadača ostávajú v index.html, lebo ich čítajú roboty, ktoré nespúšťajú JavaScript."}));
  }

  /* --- Archív --- */
  function tabArchiv(p){
    p.appendChild(nadpis("Ukončiť hru a uložiť do archívu"));
    p.appendChild(el("p",{"class":"lead",text:"Z aktuálnej hry (hráči, roly, hlasy, kronika, obete) vytvorí záznam v archíve. Pred tým si doplň rolu každému hráčovi v záložke Hráči."}));
    var f=formArchiv=formArchiv||{nazov:"",datum:new Date().toLocaleDateString("sk-SK"),strana:"Osadníci",popis:"",vitazi:[]};
    var vit=el("div",{"class":"vitazi-vyber"},S.HRACI.map(function(h){
      var c=el("input",{type:"checkbox"}); c.checked=f.vitazi.indexOf(h.meno)>=0;
      c.addEventListener("change",function(){
        var i=f.vitazi.indexOf(h.meno);
        if(c.checked&&i<0) f.vitazi.push(h.meno); if(!c.checked&&i>=0) f.vitazi.splice(i,1);
      });
      return el("label",{"class":"zaskrt"},[c,el("span",{text:h.meno})]);
    }));
    p.appendChild(mriezka([
      pole("Názov hry",f,"nazov",{ph:"napr. Prvé kolo"}),
      pole("Dátum",f,"datum"),
      pole("Vyhrala strana",f,"strana",{type:"select",options:["Osadníci","Netvory","Sólo"]}),
      pole("Krátky popis",f,"popis",{siroke:true})
    ]));
    p.appendChild(el("div",{"class":"pole siroke"},[el("span",{text:"Víťazi"}),vit]));
    p.appendChild(el("p",{},[
      tlacidlo("Pridať do archívu",function(){
        if(!f.nazov.trim()){window.alert("Doplň názov hry.");return}
        S.ARCHIV.push(vytvorZaznam(f));
        formArchiv=null; zmena(); prekresli();
        window.alert("Hra je v archíve. Ak chceš začať ďalšiu, použi nižšie „Začať novú hru“.");
      },"btn"),
      " ",
      tlacidlo("Začať novú hru (vynulovať hráčov, hlasy, obete a kroniku)",function(){
        if(!window.confirm("Naozaj vynulovať aktuálnu hru? Archív ostane. Ak si ju ešte neuložil do archívu, príde o ňu.")) return;
        S.HLASY=[];S.UMRTIA=[];S.KRONIKA=[];
        S.HRACI.forEach(function(h){h.stav="zije";h.rola="?";h.poznamka=""});
        S.STAV.den=1;S.STAV.faza="Deň";
        zmena();prekresli();
      },"zmaz")
    ]));

    p.appendChild(nadpis("Archív hier ("+S.ARCHIV.length+")"));
    p.appendChild(zoznam(S.ARCHIV,
      function(g){return (g.nazov||"(bez názvu)")+" · "+(g.datum||"")},
      function(g){
        var w=el("div");
        w.appendChild(mriezka([
          pole("Názov",g,"nazov"),pole("Dátum",g,"datum"),
          pole("Vyhrala strana",g,"strana"),pole("Počet hráčov",g,"hracov",{type:"number"}),
          pole("Víťazi (oddelení čiarkou)",g,"vitazi",{siroke:true,
            get:function(){return (g.vitazi||[]).join(", ")},
            set:function(v){g.vitazi=v.split(",").map(function(s){return s.trim()}).filter(Boolean)}}),
          pole("Popis",g,"popis",{type:"textarea",rows:3,siroke:true})
        ]));
        if(g.dni){
          w.appendChild(nadpis("Noc a poprava po dňoch"));
          w.appendChild(tabulka(g.dni,[["Deň","den","number"],["Noc","noc","text"],["Poprava","poprava","text"]],
            function(){return {den:g.dni.length+1,noc:"",poprava:""}},"+ Pridať deň"));
        }else{
          w.appendChild(el("p",{},[tlacidlo("+ Pridať noc a popravu po dňoch",function(){g.dni=[];zmena();prekresli()})]));
        }
        return w;
      },function(){return {nazov:"",datum:"",hracov:0,strana:"",vitazi:[],popis:""}},"+ Pridať prázdny záznam",otvor,"Archív je zatiaľ prázdny."));
  }
  function vytvorZaznam(f){
    var dni=[], den=Number(S.STAV.den)||1;
    for(var i=1;i<=den;i++){
      var o=S.UMRTIA.filter(function(u){return Number(u.den)===i});
      var m=o.filter(function(u){return u.kto}).map(function(u){return u.kto});
      var po=S.HRACI.filter(function(h){var x=/^Obesen\S*,\s*de\S*\s*(\d+)/i.exec(h.poznamka||"");return x&&Number(x[1])===i});
      var pop=po.length?"Dedina obesila: "+po.map(function(h){return h.meno+(h.rola&&h.rola!=="?"?" ("+h.rola+")":"")}).join(", ")+".":"";
      dni.push({den:i,noc:!o.length?"":(m.length?"Zomrel(i): "+m.join(", ")+".":"Nikto nezomrel."),poprava:pop});
    }
    return {nazov:f.nazov.trim(),datum:f.datum,hracov:S.HRACI.length,strana:f.strana,vitazi:f.vitazi.slice(),popis:f.popis,
      pribeh:clone(S.KRONIKA),
      hraci:S.HRACI.map(function(h){return {meno:h.meno,rola:h.rola,osud:h.stav==="mrtvy"?(h.poznamka||"Mŕtvy"):"Prežil"}}),
      dni:dni,hlasy:clone(S.HLASY)};
  }

  /* ---------- Export data.js ---------- */
  function riadky(v,viac){
    if(!v.length) return "[]";
    return "[\n"+v.map(function(x){return "  "+(viac?JSON.stringify(x,null,1).replace(/\n/g,"\n  "):JSON.stringify(x))}).join(",\n")+"\n]";
  }
  function cisla(arr,kluce){arr.forEach(function(r){kluce.forEach(function(k){if(r[k]!==""&&r[k]!=null&&!isNaN(Number(r[k]))) r[k]=Number(r[k])})})}
  function zostavDataJs(){
    var D=clone(S);
    cisla(D.HLASY,["den"]);cisla(D.UMRTIA,["den"]);cisla(D.KRONIKA,["den"]);
    D.STAV.den=Number(D.STAV.den)||1;
    D.ROLY.forEach(function(r){if(!r.skryta) delete r.skryta});
    var kom=function(t){return "/* ---- "+t+" ---- */\n"};
    return "/* =====================================================\n"+
      "   DÁTA HRY – vygenerované v admin.html, "+new Date().toLocaleString("sk-SK")+"\n"+
      "   Tento súbor nahraď v priečinku webu a nahraj na GitHub.\n"+
      "   ===================================================== */\n\n"+
      kom("STAV HRY (pás pod úvodom)")+"var STAV = "+JSON.stringify(D.STAV,null,2)+";\n\n"+
      kom("ODKAZY NA FORMULÁRE")+"var ODKAZY = "+JSON.stringify(D.ODKAZY,null,2)+";\n\n"+
      kom("TEXTY WEBU (úvod, pravidlá, časté otázky, pätička)")+"var WEB = "+JSON.stringify(D.WEB,null,2)+";\n\n"+
      kom("HRÁČI")+"var HRACI = "+riadky(D.HRACI)+";\n\n"+
      kom("ROLY (karty na hlavnej stránke; tim: dedina / netvor / neutral)")+"var ROLY = "+riadky(D.ROLY)+";\n\n"+
      kom("HLASOVANIE (jeden riadok = jeden hlas)")+"var HLASY = "+riadky(D.HLASY)+";\n\n"+
      kom("RANNÉ OBETE")+"var UMRTIA = "+riadky(D.UMRTIA)+";\n\n"+
      kom("PRÍBEH / KRONIKA")+"var KRONIKA = "+riadky(D.KRONIKA,true)+";\n\n"+
      kom("ARCHÍV HIER")+"var ARCHIV = "+riadky(D.ARCHIV,true)+";\n";
  }

  function nacitajZoSuboru(text){
    var vys;
    try{vys=new Function(text+"\n;return {"+KLUCE.map(function(n){return n+":typeof "+n+"!=='undefined'?"+n+":null"}).join(",")+"}")()}
    catch(e){window.alert("Súbor sa nepodarilo prečítať: "+e.message);return}
    if(!vys.HRACI){window.alert("V súbore sa nenašiel zoznam HRACI, asi to nie je data.js.");return}
    if(!window.confirm("Nahradiť všetko, čo je teraz v admine, údajmi zo súboru? Čo v súbore chýba, ostane tak, ako je.")) return;
    KLUCE.forEach(function(n){if(vys[n]!=null) S[n]=clone(vys[n])});
    zmena(); prekresli();
    window.alert("Súbor je načítaný. Skontroluj údaje a nezabudni ho potom znova stiahnuť.");
  }
  document.addEventListener("DOMContentLoaded",function(){
    $("a-stiahnut").addEventListener("click",function(){
      var w=kontrola();
      if(w.length&&!window.confirm("Našli sa upozornenia ("+w.length+"):\n\n- "+w.slice(0,12).join("\n- ")+(w.length>12?"\n…":"")+"\n\nChceš súbor aj tak stiahnuť?")) return;
      var b=new Blob([zostavDataJs()],{type:"text/javascript"}), l=document.createElement("a");
      l.href=URL.createObjectURL(b); l.download="data.js";
      document.body.appendChild(l); l.click(); l.remove();
      setTimeout(function(){URL.revokeObjectURL(l.href)},2000);
    });
    $("a-nacitat").addEventListener("click",function(){$("a-subor").click()});
    $("a-subor").addEventListener("change",function(){
      var f=this.files[0], inp=this; if(!f) return;
      var r=new FileReader();
      r.onload=function(){nacitajZoSuboru(String(r.result)); inp.value=""};
      r.readAsText(f,"utf-8");
    });
    if(zKonceptu) $("a-koncept").hidden=false;
    $("a-zahodit").addEventListener("click",function(){
      if(!window.confirm("Zahodiť všetky neuložené zmeny a načítať dáta, ktoré sú práve na webe?")) return;
      try{localStorage.removeItem(KLUC)}catch(e){}
      location.reload();
    });
    window.zostavDataJs=zostavDataJs; // pre kontrolu
    prekresli(); zmena();
  });
})();
