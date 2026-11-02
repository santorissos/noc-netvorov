/* Spoločná logika webu. Bežne ju meniť nemusíš. */
(function(){
  var root=document.documentElement;
  try{ if(localStorage.getItem("tema")==="svetla") root.setAttribute("data-theme","svetla"); }catch(e){}
})();

function esc(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function $(id){return document.getElementById(id)}
function odkazHraca(m){return "hrac.html?h="+encodeURIComponent(m)}
function adminRezim(){return /admin/i.test(location.hash+location.search)}
function iniciala(m){return esc(String(m).trim().charAt(0).toUpperCase())}
function foto(h,trieda){
  var src="img/hraci/"+encodeURIComponent(h.foto||"");
  return '<span class="'+(trieda||"av")+'" data-i="'+iniciala(h.meno)+'">'+
    (h.foto?'<img src="'+src+'" alt="'+esc(h.meno)+'" loading="lazy" onerror="this.remove()">':'')+'</span>';
}

function pribehHtml(z,vzostupne){
  return (z||[]).slice().sort(function(a,b){return vzostupne?a.den-b.den:b.den-a.den}).map(function(d){
    var t=Array.isArray(d.text)?d.text:String(d.text||"").split(/\n\s*\n/);
    return '<div class="den-zaznam"><h3>Deň '+esc(d.den)+(d.nadpis?': '+esc(d.nadpis):'')+'</h3>'+
      t.filter(Boolean).map(function(p){return '<p>'+esc(p)+'</p>'}).join("")+'</div>';
  }).join("");
}

document.addEventListener("DOMContentLoaded",function(){

  /* ---- Navigácia (upravíš tu, platí pre všetky stránky) ---- */
  var nav=$("nav");
  if(nav){
    nav.outerHTML='<nav><div class="wrap">'+
      '<a class="logo" href="index.html">Noc netvorov</a>'+
      '<a href="index.html#kronika">Kronika</a>'+
      '<a href="index.html#pravidla">Pravidlá</a>'+
      '<a href="index.html#roly">Roly</a>'+
      '<a href="hraci.html">Hráči</a>'+
      '<a href="hlasovanie.html">Hlasovanie</a>'+
      '<a href="vitazstva.html">Štatistiky</a>'+
      '<a href="archiv.html">Archív</a>'+
      '<a href="index.html#prihlaska">Prihláška</a>'+
      '<span class="nastroje">'+
        '<button type="button" id="b-zvuk" aria-pressed="false" title="Zvuk na pozadí">Zvuk</button>'+
        '<button type="button" id="b-tema" title="Svetlý / tmavý režim">Režim</button>'+
      '</span></div></nav>';
  }

  /* ---- Svetlý / tmavý režim ---- */
  var bt=$("b-tema");
  if(bt) bt.addEventListener("click",function(){
    var svetla=document.documentElement.getAttribute("data-theme")==="svetla";
    if(svetla) document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme","svetla");
    try{localStorage.setItem("tema",svetla?"tmava":"svetla")}catch(e){}
  });

  /* ---- Zvuk na pozadí (predvolene vypnutý) ---- */
  var bz=$("b-zvuk");
  if(bz){
    var audio=new Audio(STAV.zvuk); audio.loop=true; audio.volume=.35;
    audio.addEventListener("error",function(){bz.hidden=true});
    bz.addEventListener("click",function(){
      var hra=bz.getAttribute("aria-pressed")==="true";
      if(hra){audio.pause()}else{audio.play().catch(function(){bz.hidden=true})}
      bz.setAttribute("aria-pressed",!hra);
    });
  }

  /* ---- Odkazy na Discord ---- */
  document.querySelectorAll("[data-chat]").forEach(function(a){a.href=STAV.discord});

  /* ---- Pás so stavom hry ---- */
  if($("s-den")){
    var zivi=HRACI.filter(function(h){return h.stav!=="mrtvy"}).length;
    $("s-den").textContent=STAV.den;
    $("s-faza").textContent=STAV.faza;
    $("s-nazov").textContent=STAV.dalsiaNazov;
    $("s-zivi").textContent=zivi+" / "+HRACI.length;
    (function tik(){
      var r=new Date(STAV.dalsiaCas)-new Date();
      if(isNaN(r)||r<=0){$("s-odpocet").textContent="už teraz";return}
      var h=Math.floor(r/36e5),m=Math.floor(r%36e5/6e4),s=Math.floor(r%6e4/1e3);
      $("s-odpocet").textContent=h+" h "+m+" min "+(s<10?"0":"")+s+" s";
      setTimeout(tik,1000);
    })();
  }

  /* ---- Mozaika hráčov v pozadí úvodu ---- */
  var moz=$("mozaika");
  if(moz){
    var pol=Math.ceil(HRACI.length/2);
    var bunka=function(h){return '<a class="'+(h.stav==="mrtvy"?"mrtvy":"")+'" href="'+odkazHraca(h.meno)+'" title="'+esc(h.meno)+'">'+foto(h,"av")+'<em>'+esc(h.meno)+'</em></a>'};
    moz.innerHTML='<div class="strana">'+HRACI.slice(0,pol).map(bunka).join("")+'</div>'+
                  '<div class="strana">'+HRACI.slice(pol).map(bunka).join("")+'</div>';
  }

  /* ---- Kronika (príbeh) na hlavnej stránke ---- */
  if($("kronika-zoznam")){
    var kz=$("kronika-zoznam"), kv=$("kronika-vyber");
    var vykresliKroniku=function(){
      var v=kv?kv.value:"vsetky";
      var zoz=v==="vsetky"?KRONIKA:KRONIKA.filter(function(d){return String(d.den)===v});
      kz.innerHTML=pribehHtml(zoz)||'<p class="poznamka">Príbeh sa začne písať s prvou nocou.</p>';
    };
    if(kv){
      var videne={}, dniK=KRONIKA.slice().sort(function(a,b){return b.den-a.den}).filter(function(d){
        if(videne[d.den]) return false; videne[d.den]=true; return true;
      });
      kv.innerHTML='<option value="vsetky">Všetky dni</option>'+dniK.map(function(d){
        return '<option value="'+esc(d.den)+'">Deň '+esc(d.den)+(d.nadpis?': '+esc(d.nadpis):'')+'</option>';
      }).join("");
      if(dniK.length) kv.value=String(dniK[0].den);
      kv.addEventListener("change",vykresliKroniku);
    }
    vykresliKroniku();
  }

  /* ---- Filter rolí ---- */
  document.querySelectorAll(".filter button").forEach(function(b){
    b.addEventListener("click",function(){
      document.querySelectorAll(".filter button").forEach(function(x){x.setAttribute("aria-pressed",x===b)});
      var f=b.dataset.f;
      document.querySelectorAll(".rola").forEach(function(r){
        var t=r.classList.contains("netvor")?"netvor":r.classList.contains("neutral")?"neutral":"dedina";
        r.hidden=!(f==="vsetko"||f===t);
      });
    });
  });

  /* ---- Stránka Hráči ---- */
  if($("hraci-steny")){
    $("hraci-steny").innerHTML=HRACI.map(function(h){
      var m=h.stav==="mrtvy";
      return '<a class="hrac'+(m?" mrtvy":"")+'" href="'+odkazHraca(h.meno)+'">'+foto(h,"av velky")+'<b>'+esc(h.meno)+'</b><small>'+(m?"Padol":"Žije")+'</small></a>';
    }).join("");
    $("hraci-telo").innerHTML=HRACI.map(function(h){
      var m=h.stav==="mrtvy";
      return '<tr class="'+(m?"mrtvy":"")+'"><td><a href="'+odkazHraca(h.meno)+'">'+esc(h.meno)+'</a></td><td>'+(m?"Mŕtvy":"Žije")+'</td><td>'+esc(m?h.rola:"?")+'</td><td>'+esc(h.poznamka)+'</td></tr>';
    }).join("");
    $("h-den").textContent=STAV.den;
  }

  /* ---- Stránka Hlasovanie a obete ---- */
  if($("hlasy")){
    var dni={};
    var dz=function(n){return dni[n]=dni[n]||{hlasy:[],umrtia:[]}};
    HLASY.forEach(function(v){dz(v.den).hlasy.push(v)});
    (typeof UMRTIA!=="undefined"?UMRTIA:[]).forEach(function(u){dz(u.den).umrtia.push(u)});
    var kluce=Object.keys(dni).sort(function(a,b){return b-a});
    $("hlasy").innerHTML=kluce.length?kluce.map(function(n){
      var blok=dni[n], html='<div class="den-blok"><h3>Deň '+esc(n)+'</h3>';
      if(blok.umrtia.length){
        var obete=blok.umrtia.filter(function(u){return u.kto});
        html+='<p class="ranne"><b>Ráno:</b> '+(obete.length?'dedina našla mŕtveho: '+obete.map(function(u){
          return '<span class="obet">'+esc(u.kto)+'</span>'+(u.ako||u.rola?' ('+[u.ako,u.rola].filter(Boolean).map(esc).join(", ")+')':'');
        }).join("; "):'v noci nikto nezomrel.')+'</p>';
      }
      if(blok.hlasy.length){
        var spocet={};
        blok.hlasy.forEach(function(v){(spocet[v.koho]=spocet[v.koho]||[]).push(v.kto)});
        var riadky=Object.keys(spocet).sort(function(a,b){return spocet[b].length-spocet[a].length}).map(function(k){
          return '<tr><td>'+esc(k)+'</td><td class="pocet">'+spocet[k].length+'</td><td>'+spocet[k].map(esc).join(", ")+'</td></tr>';
        }).join("");
        html+='<div class="tbl"><table><thead><tr><th>Cieľ hlasovania</th><th>Hlasov</th><th>Kto hlasoval</th></tr></thead><tbody>'+riadky+'</tbody></table></div>';
      }
      return html+'</div>';
    }).join(""):'<p class="poznamka">Zatiaľ nikto nehlasoval a nikto nezomrel.</p>';
  }

  /* ---- Formulár prihlášky ---- */
  var vlozFormular=function(id,url,vyska,navod){
    var el=$(id); if(!el) return;
    el.innerHTML=/^https:\/\//.test(url||"")?'<iframe src="'+esc(url)+'" height="'+vyska+'" title="Formulár"></iframe>':'<p class="poznamka">'+navod+'</p>';
  };
  vlozFormular("prihlaska-form",ODKAZY.prihlaska,700,"Formulár zatiaľ nie je pripojený. Odkaz doplň v data.js do ODKAZY.prihlaska.");
  /* ---- Profil hráča ---- */
  if($("profil")){
    var mp=new URLSearchParams(location.search).get("h")||"";
    var hr=null; HRACI.forEach(function(x){if(x.meno===mp) hr=x});
    var hist=[], vyhry=0;
    ARCHIV.forEach(function(g){
      var p=null; (g.hraci||[]).forEach(function(x){if(x.meno===mp) p=x});
      var v=(g.vitazi||[]).indexOf(mp)>=0;
      if(p||v){hist.push({g:g,p:p,v:v}); if(v) vyhry++;}
    });
    if(!mp||(!hr&&!hist.length)){
      $("profil").innerHTML='<h2>Hráč sa nenašiel</h2><p class="lead">Vráť sa na zoznam hráčov a vyber ho znova.</p>';
    }else{
      document.title=mp+" – Noc netvorov";
      var mrt=hr&&hr.stav==="mrtvy";
      var stav=!hr?"Nehrá v aktuálnej hre.":mrt?("Padol"+(hr.poznamka?": "+esc(hr.poznamka):"")+(hr.rola&&hr.rola!=="?"?". Bol to <b>"+esc(hr.rola)+"</b>.":".")):"Žije v aktuálnej hre. Jeho rola zostáva tajná.";
      var info=[];
      if(hr){
        [["vek","Vek"],["bydlisko","Bydlisko"],["povolanie","Povolanie"],["zaluby","Záľuby"]].forEach(function(p){if(hr[p[0]]) info.push([p[1],hr[p[0]]])});
        if(hr.dalsie) Object.keys(hr.dalsie).forEach(function(k){if(hr.dalsie[k]) info.push([k,hr.dalsie[k]])});
      }
      var infoHtml=(info.length?'<dl class="profil-info">'+info.map(function(i){return '<dt>'+esc(i[0])+'</dt><dd>'+esc(i[1])+'</dd>'}).join("")+'</dl>':'')+
        (hr&&hr.o_mne?'<p class="o-mne">'+esc(hr.o_mne)+'</p>':'');
      $("profil").innerHTML='<div class="profil-hlavicka">'+foto(hr||{meno:mp,foto:""},"av velky")+
        '<div><h2>'+esc(mp)+'</h2><p class="lead">'+stav+'</p><p>Odohrané hry: <b>'+hist.length+'</b> · Výhry: <b>'+vyhry+'</b></p></div></div>'+infoHtml+
        (hist.length?'<h3>História hier</h3><div class="tbl"><table><thead><tr><th>Hra</th><th>Dátum</th><th>Rola</th><th>Osud</th><th>Výsledok</th></tr></thead><tbody>'+
          hist.slice().reverse().map(function(r){
            return '<tr><td>'+esc(r.g.nazov||"(bez názvu)")+'</td><td>'+esc(r.g.datum)+'</td><td>'+esc(r.p?r.p.rola:"–")+'</td><td>'+esc(r.p?r.p.osud:"–")+'</td><td>'+(r.v?"Výhra":"Prehra")+'</td></tr>';
          }).join("")+'</tbody></table></div>':'<p class="poznamka">V archíve zatiaľ nie je žiadna odohraná hra tohto hráča.</p>');
    }
  }

  /* ---- Stránka Štatistiky a víťazstvá ---- */
  if($("vitazstva")){
    var body={};
    ARCHIV.forEach(function(g){(g.vitazi||[]).forEach(function(m){body[m]=(body[m]||0)+1})});
    var poradie=Object.keys(body).sort(function(a,b){return body[b]-body[a]});
    $("vitazstva").innerHTML=poradie.length?poradie.map(function(m,i){
      return '<tr><td>'+(i+1)+'.</td><td><a href="'+odkazHraca(m)+'">'+esc(m)+'</a></td><td class="pocet">'+body[m]+'</td></tr>';
    }).join(""):'<tr><td colspan="3">Zatiaľ žiadne víťazstvá.</td></tr>';
  }
  if($("stat-strany")){
    var sc={}, sucet=0;
    ARCHIV.forEach(function(g){if(g.strana){sc[g.strana]=(sc[g.strana]||0)+1; sucet++}});
    var sk=Object.keys(sc).sort(function(a,b){return sc[b]-sc[a]});
    $("stat-strany").innerHTML=sk.length?sk.map(function(k){
      return '<tr><td>'+esc(k)+'</td><td class="pocet">'+sc[k]+'</td><td>'+Math.round(sc[k]/sucet*100)+' %</td></tr>';
    }).join(""):'<tr><td colspan="3">Zatiaľ žiadne odohrané hry.</td></tr>';
  }
  if($("stat-roly")){
    var rs={};
    ARCHIV.forEach(function(g){(g.hraci||[]).forEach(function(p){
      if(!p.rola||p.rola==="?") return;
      var r=rs[p.rola]=rs[p.rola]||{h:0,v:0};
      r.h++; if((g.vitazi||[]).indexOf(p.meno)>=0) r.v++;
    })});
    var rk=Object.keys(rs).sort(function(a,b){return rs[b].h-rs[a].h});
    $("stat-roly").innerHTML=rk.length?rk.map(function(k){
      return '<tr><td>'+esc(k)+'</td><td class="pocet">'+rs[k].h+'</td><td class="pocet">'+rs[k].v+'</td><td>'+Math.round(rs[k].v/rs[k].h*100)+' %</td></tr>';
    }).join(""):'<tr><td colspan="4">Zatiaľ nie sú v archíve zapísané roly hráčov.</td></tr>';
  }

  /* ---- Stránka Archív ---- */
  if($("archiv")){
    var jeAdmin=adminRezim;
    var povodnyArchiv=JSON.stringify(ARCHIV);
    var zhrnHlasy=function(hl,den){
      var s={};
      (hl||[]).filter(function(v){return String(v.den)===String(den)}).forEach(function(v){(s[v.koho]=s[v.koho]||[]).push(v.kto)});
      var k=Object.keys(s).sort(function(a,b){return s[b].length-s[a].length});
      return k.map(function(x){return esc(x)+" ("+s[x].length+"): "+s[x].map(esc).join(", ")}).join(" · ");
    };
    var vykresliArchiv=function(){
      var admin=jeAdmin();
      $("archiv").innerHTML=ARCHIV.map(function(g,idx){return {g:g,idx:idx}}).reverse().map(function(p){
        var g=p.g, detail="";
        if(g.pribeh&&g.pribeh.length){
          detail+='<h4>Príbeh hry</h4>'+pribehHtml(g.pribeh,true);
        }
        if(g.hraci&&g.hraci.length){
          detail+='<h4>Hráči a roly</h4><div class="tbl"><table><thead><tr><th>Hráč</th><th>Rola</th><th>Osud</th></tr></thead><tbody>'+
            g.hraci.map(function(h){return '<tr><td>'+esc(h.meno)+'</td><td>'+esc(h.rola)+'</td><td>'+esc(h.osud)+'</td></tr>'}).join("")+'</tbody></table></div>';
        }
        if(g.dni&&g.dni.length){
          detail+='<h4>Priebeh po dňoch</h4>'+g.dni.map(function(d){
            var hl=zhrnHlasy(g.hlasy,d.den);
            return '<div class="den-zaznam"><h3>Deň '+esc(d.den)+'</h3>'+
              (d.noc?'<p class="noc"><b>Noc:</b> '+esc(d.noc)+'</p>':'')+
              (d.poprava?'<p class="poprava"><b>Poprava:</b> '+esc(d.poprava)+'</p>':'')+
              (hl?'<p class="hlasy-riadok"><b>Hlasovanie:</b> '+hl+'</p>':'')+'</div>';
          }).join("");
        }
        return '<article class="archiv-hra"><h3>'+esc(g.nazov||"(bez názvu)")+'</h3>'+
          '<div class="meta">'+esc(g.datum)+' · '+esc(g.hracov)+' hráčov · vyhrala strana: <b>'+esc(g.strana)+'</b></div>'+
          '<p>'+esc(g.popis)+'</p>'+
          (g.vitazi&&g.vitazi.length?'<p class="vitazi">Víťazi: '+g.vitazi.map(esc).join(", ")+'</p>':'')+
          (detail?'<details class="priebeh"><summary>Zobraziť priebeh hry</summary>'+detail+'</details>':'')+
          (admin?'<p><button type="button" class="zmaz" data-idx="'+p.idx+'">Odstrániť túto hru</button></p>':'')+
          '</article>';
      }).join("")||'<p class="poznamka">Archív je zatiaľ prázdny.</p>';
    };
    vykresliArchiv();

    /* Nástroje pre moderátora (viditeľné len na archiv.html#admin) */
    var nastroj=$("exp-nastroj");
    var ukazNastroj=function(){ if(nastroj) nastroj.hidden=!jeAdmin(); vykresliArchiv(); };
    var vypis=function(text,info){
      var out=$("exp-out"); out.value=text; out.hidden=false; out.select();
      try{document.execCommand("copy")}catch(e){}
      $("exp-info").textContent=info;
    };
    if(nastroj){
      ukazNastroj();
      window.addEventListener("hashchange",ukazNastroj);

      $("archiv").addEventListener("click",function(e){
        var b=e.target.closest(".zmaz"); if(!b||!jeAdmin()) return;
        var g=ARCHIV[Number(b.dataset.idx)];
        if(!g||!window.confirm('Odstrániť hru "'+(g.nazov||"bez názvu")+'" zo zoznamu?\nNa stránke sa zmena prejaví až po úprave data.js a nahratí na Netlify.')) return;
        ARCHIV.splice(Number(b.dataset.idx),1);
        vykresliArchiv();
        vypis("var ARCHIV = "+JSON.stringify(ARCHIV,null,1)+";",
          "Hra je odstránená len v náhľade. V data.js nahraď celý blok ARCHIV (od var ARCHIV po ;) týmto textom, ktorý je už skopírovaný, a nahraj na Netlify.");
      });

      $("zaloha-btn").addEventListener("click",function(){
        var cast=function(n,v){return "var "+n+" = "+JSON.stringify(v,null,1)+";\n\n"};
        var t="/* Záloha dát z webu, "+new Date().toLocaleString("sk-SK")+" */\n"+
          cast("STAV",STAV)+cast("ODKAZY",ODKAZY)+cast("HRACI",HRACI)+cast("HLASY",HLASY)+
          cast("UMRTIA",typeof UMRTIA!=="undefined"?UMRTIA:[])+cast("KRONIKA",typeof KRONIKA!=="undefined"?KRONIKA:[])+
          cast("ARCHIV",JSON.parse(povodnyArchiv));
        var b=new Blob([t],{type:"text/javascript"}), l=document.createElement("a");
        l.href=URL.createObjectURL(b); l.download="data-zaloha-"+new Date().toISOString().slice(0,10)+".js";
        document.body.appendChild(l); l.click(); l.remove();
        $("exp-info").textContent="Záloha sa stiahla. Je to kópia dát, ktoré sú práve na webe. Ulož si ju na bezpečné miesto.";
      });

      $("exp-btn").addEventListener("click",function(){
        var dni=[];
        var nocText=function(n){
          var o=(typeof UMRTIA!=="undefined"?UMRTIA:[]).filter(function(u){return Number(u.den)===n});
          if(!o.length) return "";
          var m=o.filter(function(u){return u.kto}).map(function(u){return u.kto});
          return m.length?"Zomrel(i): "+m.join(", ")+".":"Nikto nezomrel.";
        };
        for(var i=1;i<=Number(STAV.den);i++) dni.push('    {den:'+i+', noc:'+JSON.stringify(nocText(i))+', poprava:""}');
        var t='{nazov:"", datum:"'+new Date().toLocaleDateString("sk-SK")+'", hracov:'+HRACI.length+', strana:"", vitazi:[], popis:"",\n'+
          '  pribeh:'+JSON.stringify(KRONIKA,null,1).replace(/\n/g,"\n  ")+',\n'+
          '  hraci:[\n'+HRACI.map(function(h){return '    '+JSON.stringify({meno:h.meno,rola:h.rola,osud:h.stav==="mrtvy"?(h.poznamka||"Mŕtvy"):"Prežil"})}).join(",\n")+'\n  ],\n'+
          '  dni:[\n'+dni.join(",\n")+'\n  ],\n'+
          '  hlasy:[\n'+HLASY.map(function(v){return '    '+JSON.stringify(v)}).join(",\n")+'\n  ]},';
        vypis(t,"Skopírované. Vlož to do data.js do zoznamu ARCHIV a doplň prázdne polia.");
      });
    }
  }
});
