/* ================= ЖИВОЙ ГЕРОЙ: реальное время, погода, сезон, праздники ================= */
const HERO=(()=>{
  const LAT=56.4977,LNG=84.9744,TZ=7; // Томск, UTC+7
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hexA=c=>[1,3,5].map(i=>parseInt(c.slice(i,i+2),16));
  const toHex=a=>'#'+a.map(v=>Math.round(Math.max(0,Math.min(255,v))).toString(16).padStart(2,'0')).join('');
  const mix=(a,b,t)=>{const A=hexA(a),B=hexA(b);return toHex(A.map((v,i)=>v+(B[i]-v)*t))};
  const rgba=(c,a)=>{const[r,g,b]=hexA(c);return `rgba(${r},${g},${b},${a})`};
  const R=Math.random,el=id=>document.getElementById(id);

  /* --- солнце: восход и закат по алгоритму SunCalc --- */
  function sunMinutes(date){const rad=Math.PI/180,J1970=2440588,J2000=2451545,dayMs=864e5,e=rad*23.4397,J0=.0009;
    const d=date.valueOf()/dayMs-.5+J1970-J2000,lw=rad*-LNG,phi=rad*LAT;
    const n=Math.round(d-J0-lw/(2*Math.PI)),ds=J0+lw/(2*Math.PI)+n;
    const M=rad*(357.5291+.98560028*ds),C=rad*(1.9148*Math.sin(M)+.02*Math.sin(2*M)+.0003*Math.sin(3*M)),L=M+C+rad*102.9372+Math.PI;
    const dec=Math.asin(Math.sin(e)*Math.sin(L));const w=Math.acos((Math.sin(-.833*rad)-Math.sin(phi)*Math.sin(dec))/(Math.cos(phi)*Math.cos(dec)));
    const noon=J2000+ds+.0053*Math.sin(M)-.0069*Math.sin(2*L),set=J2000+J0+(w+lw)/(2*Math.PI)+n+.0053*Math.sin(M)-.0069*Math.sin(2*L),rise=noon-(set-noon);
    const toMin=J=>{const ms=(J+.5-J1970)*dayMs+TZ*3600e3;return((ms/6e4)%1440+1440)%1440};
    return{rise:toMin(rise),set:toMin(set)}}
  const tomskDate=()=>new Date(Date.now()+TZ*3600e3); // читать через getUTC*
  const fmt=m=>String(Math.floor(m/60)%24).padStart(2,'0')+':'+String(Math.floor(m%60)).padStart(2,'0');

  /* --- палитры неба по фазам дня --- */
  const PH={
    night:{sky:['#0A1130','#16204A','#26305E','#343A68'],water:['#1C2545','#0F1530'],shade:.62,lit:.55,stars:1,cloud:'#394166'},
    predawn:{sky:['#1D2556','#4A4880','#9A7194','#D89A8C'],water:['#5A5A80','#2A2E50'],shade:.38,lit:.35,stars:.35,cloud:'#7A6E92'},
    dawn:{sky:['#6E86C0','#C9A0B8','#F4B596','#F9D9AE'],water:['#C9A6B0','#7E7A9E'],shade:.08,lit:.08,stars:0,cloud:'#F6D7CE'},
    day:{sky:['#4D8FD0','#83B9E4','#BCDBEF','#E4EFEA'],water:['#8DBAD6','#5E8DB0'],shade:0,lit:0,stars:0,cloud:'#FFFFFF'},
    golden:{sky:['#8E7FB9','#C996B6','#EFA894','#F6C58E'],water:['#B98EA8','#7B6E95'],shade:.06,lit:.25,stars:0,cloud:'#F6D6C8'},
    evening:{sky:['#2C3468','#5E5590','#B67C98','#E19C86'],water:['#6E5E86','#3A3A62'],shade:.34,lit:.7,stars:.3,cloud:'#8A7896'}
  };
  function lerpPh(a,b,t){const o={};o.sky=a.sky.map((c,i)=>mix(c,b.sky[i],t));o.water=a.water.map((c,i)=>mix(c,b.water[i],t));
    ['shade','lit','stars'].forEach(k=>o[k]=a[k]+(b[k]-a[k])*t);o.cloud=mix(a.cloud,b.cloud,t);return o}
  const smooth=t=>t*t*(3-2*t);

  /* --- погода --- */
  const WX={clear:{t:'ясно',k:0,to:'#000000'},cloudy:{t:'облачно',k:.35,to:'#9AA4B0'},rain:{t:'дождь',k:.55,to:'#7F8896'},storm:{t:'гроза',k:.72,to:'#363B4C'},snow:{t:'снег',k:.42,to:'#C8D0DA'},fog:{t:'туман',k:.6,to:'#C9CDD2'}};
  function wmo(c){if(c<=1)return'clear';if(c<=3)return'cloudy';if(c<=48)return'fog';if(c>=95)return'storm';if((c>=71&&c<=77)||c===85||c===86)return'snow';return'rain'}

  /* --- праздники --- */
  const HOL={
    ny:{t:'Новый год',d:[12,31],hand:'С Новым годом,<br>Томск! ✦',pre:'Скоро Новый год,<br>Томск ✦'},
    tat:{t:'Татьянин день',d:[1,25],hand:'С Днём студента!<br>Томск, ты молод ♡'},
    feb23:{t:'23 февраля',d:[2,23],hand:'С Днём защитника<br>Отечества!'},
    mar8:{t:'8 Марта',d:[3,8],hand:'С 8 Марта,<br>милые томички ♡'},
    may9:{t:'9 Мая',d:[5,9],hand:'С Днём Победы!<br>Помним ♡'},
    jun12:{t:'День России',d:[6,12],hand:'С Днём России!'},
    sep1:{t:'1 сентября',d:[9,1],hand:'С Днём знаний!<br>Удачи, студенты ♡'},
    hw:{t:'Хеллоуин',d:[10,31],hand:'Жутко красивый<br>Хеллоуин ♡'}
  };
  function autoHoliday(m,d){ // m: 1..12
    if((m===12&&d>=20)||(m===1&&d<=10))return'ny';
    if(m===1&&d===25)return'tat';if(m===2&&d===23)return'feb23';if(m===3&&d>=6&&d<=8)return'mar8';
    if(m===5&&d===9)return'may9';if(m===6&&d===12)return'jun12';if(m===9&&d===1)return'sep1';if((m===10&&d>=29)||(m===11&&d===1))return'hw';return null}
  function nextHoliday(now){let best=null;for(const k in HOL){if(k==='ny')continue;const[m,d]=HOL[k].d;let dt=Date.UTC(now.getUTCFullYear(),m-1,d);if(dt<now)dt=Date.UTC(now.getUTCFullYear()+1,m-1,d);
      const days=Math.ceil((dt-now)/864e5);if(!best||days<best.days)best={k,days}}
    const ny=Date.UTC(now.getUTCFullYear(),11,31);const nd=Math.ceil((ny-now)/864e5);if(nd>=0&&nd<best.days)best={k:'ny',days:nd};return best}
  function season(m,d){if(m===12||m<=2||(m===3&&d<25)||(m===11&&d>=10))return'winter';if((m===3)||m===4||m===5)return m===5||(m===4&&d>20)?'spring':'thaw';if(m<=8)return'summer';return'autumn'}

  /* --- сцена --- */
  const FOL={summer:['#2F5A3E','#3B6B48','#2A4E36'],spring:['#5E8F4E','#7AA85A','#4E7A42'],thaw:['#4A5A50','#3E4E44'],autumn:['#C9782E','#D99A3C','#B5651D','#3B5A40'],winter:['#3E4E46','#46564C']};
  const trees=[[700,300,70],[1170,250,90],[1110,190,70],[660,350,50],[612,388,32],[1192,340,46]];
  const winList=[];
  function buildSVG(){
    let w='',lace='';
    const addW=(x,y,ww,hh)=>{winList.push([x,y,ww,hh]);lace+=`<path d="M${x-4} ${y-1}Q${x+ww/2} ${y-14} ${x+ww+4} ${y-1}" stroke="#F4E6CF" stroke-width="3" fill="none" data-c="#F4E6CF"/><rect x="${x-4}" y="${y+hh}" width="${ww+8}" height="4" fill="#F4E6CF" data-c="#F4E6CF"/>`};
    addW(925,190,22,46);addW(961,190,22,46);addW(788,226,26,32);addW(1090,226,26,32);
    for(let i=0;i<9;i++){addW(770+i*42,300,20,44);addW(770+i*42,372,20,40)}
    w=winList.map((a,i)=>`<rect class="hw" data-r="${R().toFixed(3)}" x="${a[0]}" y="${a[1]}" width="${a[2]}" height="${a[3]}"/>`).join('');
    const stars=Array.from({length:70},()=>`<circle cx="${(R()*1200).toFixed(0)}" cy="${(R()*300).toFixed(0)}" r="${(R()*1.4+.4).toFixed(1)}" fill="#FFF8E8" style="animation-delay:${(R()*4).toFixed(2)}s"/>`).join('');
    const fol=trees.map(([x,y,r],i)=>`<circle class="hf" data-i="${i}" cx="${x}" cy="${y}" r="${r}"/>`).join('');
    const tsnow=trees.map(([x,y,r])=>`<ellipse cx="${x}" cy="${y-r*.55}" rx="${r*.72}" ry="${r*.28}" fill="#F2F6FA" data-c="#F2F6FA"/>`).join('');
    const fence=Array.from({length:70},(_,i)=>`<rect x="${600+i*9}" y="424" width="5" height="22" fill="#5C4030" data-c="#5C4030"/>`).join('');
    // гирлянда
    let gar='';for(let i=0;i<=24;i++){const t=i/24,x=740+420*t,y=274+Math.sin(t*Math.PI*4)*-6+8*Math.sin(t*Math.PI);gar+=`<circle class="gb" data-p="${i%3}" cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="4.5" fill="${['#FF5A5A','#FFD24A','#5AD1FF'][i%3]}"/>`}
    for(let i=0;i<=8;i++){const t=i/8;gar+=`<circle class="gb" data-p="${i%3}" cx="${(955-62*t).toFixed(0)}" cy="${(40+120*t).toFixed(0)}" r="4" fill="${['#FFD24A','#5AD1FF','#FF5A5A'][i%3]}"/><circle class="gb" data-p="${(i+1)%3}" cx="${(955+62*t).toFixed(0)}" cy="${(40+120*t).toFixed(0)}" r="4" fill="${['#5AD1FF','#FF5A5A','#FFD24A'][i%3]}"/>`}
    const fir=`<g id="hFir"><rect x="632" y="420" width="10" height="20" fill="#5A3A22"/>${[[637,300,26],[637,340,38],[637,380,50]].map(([x,y,h],i)=>`<path d="M${x} ${y}L${x+h*.9} ${y+h*1.05}H${x-h*.9}Z" fill="#1F4D36"/><path d="M${x-h*.5} ${y+h*.6}l${h*.25} -6 ${h*.25} 6 ${h*.25} -6 ${h*.25} 6" stroke="#F2F6FA" stroke-width="4" fill="none"/>`).join('')}
      ${[[625,345,'#FF5A5A'],[650,370,'#FFD24A'],[620,400,'#5AD1FF'],[655,410,'#FF5A5A'],[640,322,'#5AD1FF'],[630,375,'#FFD24A']].map(([x,y,c],i)=>`<circle class="gb" data-p="${i%3}" cx="${x}" cy="${y}" r="5" fill="${c}"/>`).join('')}
      <path d="M637 284l4 9 10 1-7 7 2 10-9-5-9 5 2-10-7-7 10-1z" fill="#FFD24A"/></g>`;
    const pumpkin=(x,s=1)=>`<g transform="translate(${x} 430) scale(${s})"><path d="M-2 -14q2-8 8-9" stroke="#3E5A2A" stroke-width="3" fill="none"/><ellipse rx="19" ry="14" fill="#E07A1E"/><ellipse rx="9" ry="14" fill="#C9661A"/><ellipse rx="2.5" ry="14" fill="#E07A1E"/>
      <path class="pf" d="M-11 -4l5-6 5 6zM1 -4l5-6 5 6zM-10 4q10 7 20 0l-4 4-3-3-3 3-3-3-3 3z" fill="#FFD24A"/></g>`;
    const flag=(x,y)=>`<g transform="translate(${x} ${y})"><path d="M0 0V-52" stroke="#3A2A20" stroke-width="2.5"/><g class="hflag"><rect x="0" y="-52" width="34" height="7.3" fill="#FFFFFF"/><rect x="0" y="-44.7" width="34" height="7.3" fill="#1C57A5"/><rect x="0" y="-37.4" width="34" height="7.3" fill="#D52B1E"/></g></g>`;
    const tulips=Array.from({length:26},(_,i)=>{const x=606+i*23,c=['#E8476A','#F06A9A','#FFD24A','#E8476A','#FFFFFF'][i%5];return `<path d="M${x} 446v-22" stroke="#3E7A3A" stroke-width="2.5"/><path d="M${x-6} 424q0-12 6-14q6 2 6 14q-6 5-12 0z" fill="${c}"/>`}).join('');
    const mimosa=Array.from({length:40},()=>`<circle cx="${(600+R()*600).toFixed(0)}" cy="${(410+R()*14).toFixed(0)}" r="3" fill="#F6D33C"/>`).join('');
    const carn=Array.from({length:20},(_,i)=>{const x=612+i*29;return `<path d="M${x} 446v-24" stroke="#3E6A3A" stroke-width="2"/><circle cx="${x}" cy="420" r="6" fill="#C8102E"/><circle cx="${x-3}" cy="417" r="3" fill="#E8304A"/>`}).join('');
    const balloons=Array.from({length:7},(_,i)=>{const x=670+(i%4)*22-(i>3?-11:0),y=280+(i>3?-34:0)+(i%2)*10;return `<g class="hb" data-i="${i}"><path d="M${x} ${y+20}Q${x+6} ${y+80} 690 430" stroke="#5A4A40" stroke-width="1.2" fill="none"/><ellipse class="hbb" cx="${x}" cy="${y}" rx="15" ry="19"/><path d="M${x-3} ${y+19}h6l-3 5z" class="hbb"/></g>`}).join('');
    return `<svg viewBox="0 0 1200 520" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs><linearGradient id="hSky" x1="0" y1="0" x2="0" y2="1"><stop id="hs0" offset="0"/><stop id="hs1" offset=".42"/><stop id="hs2" offset=".74"/><stop id="hs3" offset="1"/></linearGradient>
      <linearGradient id="hWat" x1="0" y1="0" x2="0" y2="1"><stop id="hw0" offset="0"/><stop id="hw1" offset="1"/></linearGradient>
      <radialGradient id="hGlow"><stop offset="0" stop-color="#FFE9C0" stop-opacity=".75"/><stop offset="1" stop-color="#FFE9C0" stop-opacity="0"/></radialGradient></defs>
    <rect width="1200" height="520" fill="url(#hSky)"/>
    <g id="hStars">${stars}</g>
    <g id="hSun"><circle r="160" fill="url(#hGlow)" id="hSunGlow"/><circle r="56" fill="#FFE5B6" id="hSunDisc"/></g>
    <g id="hMoon"><circle r="110" fill="url(#hGlow)" opacity=".35"/><circle r="32" fill="#F4EEDC" id="hMoonDisc"/><circle cx="-9" cy="-7" r="5" fill="#000" opacity=".07"/><circle cx="9" cy="9" r="4" fill="#000" opacity=".07"/><circle cx="12" cy="-10" r="2.5" fill="#000" opacity=".07"/></g>
    <g id="hClouds"></g>
    <path d="M0 398Q120 368 260 386T510 380T740 388T970 382T1200 388V432H0Z" fill="#4D5B57" data-c="#4D5B57" data-w="#D7DEE5"/>
    <rect y="410" width="1200" height="110" fill="url(#hWat)"/>
    <g id="hIce" opacity="0"><rect y="410" width="1200" height="110" fill="#E3EBF2"/><path d="M40 440l90 12 60-8M300 470l120-10 40 16M560 450l70 14M200 500l140-6" stroke="#B8C8D6" stroke-width="2" fill="none"/></g>
    <g id="hShim" stroke-linecap="round" stroke-width="4"></g>
    <g id="hFol">${fol}</g><g id="hTreeSnow">${tsnow}</g>
    <rect x="740" y="270" width="420" height="170" fill="#7A3E22" data-c="#7A3E22"/><path d="M720 272h460l-46-52H766z" fill="#28443A" data-c="#28443A"/>
    <rect x="900" y="160" width="110" height="280" fill="#8A4728" data-c="#8A4728"/><path d="M888 162h134l-67-130z" fill="#28443A" data-c="#28443A"/><path d="M955 32V4" stroke="#28443A" stroke-width="5" data-s="#28443A"/><circle cx="955" cy="4" r="5" fill="#C9A15A" data-c="#C9A15A"/>
    <rect x="770" y="200" width="66" height="72" fill="#8A4728" data-c="#8A4728"/><path d="M760 202h86l-43-74z" fill="#28443A" data-c="#28443A"/><rect x="1070" y="200" width="66" height="72" fill="#8A4728" data-c="#8A4728"/><path d="M1060 202h86l-43-74z" fill="#28443A" data-c="#28443A"/>
    <g id="hRoofSnow"><path d="M770 220h360l10 12H760z" fill="#F2F6FA"/><path d="M955 34l16 34h-32z" fill="#F2F6FA"/><path d="M803 130l12 26h-24z" fill="#F2F6FA"/><path d="M1103 130l12 26h-24z" fill="#F2F6FA"/><rect x="600" y="430" width="600" height="8" fill="#F2F6FA"/></g>
    <g id="hWin">${w}</g><g>${lace}</g>
    <path d="M740 272h420" stroke="#F4E6CF" stroke-width="4" data-s="#F4E6CF"/><path d="M740 352h420" stroke="#5A2C14" stroke-width="3" data-s="#5A2C14"/>
    <rect y="436" width="1200" height="84" fill="#3A4F42" data-c="#3A4F42" data-w="#E6ECF1" id="hGround"/>
    <g>${fence}</g><rect x="600" y="430" width="600" height="4" fill="#5C4030" data-c="#5C4030"/>
    <g id="dNy" class="deco">${gar}${fir}</g>
    <g id="dHw" class="deco">${pumpkin(760)}${pumpkin(842,.8)}${pumpkin(1015,1.1)}${pumpkin(1120,.85)}</g>
    <g id="dFlag" class="deco">${flag(803,128)}${flag(1103,128)}</g>
    <g id="dMar" class="deco">${mimosa}${tulips}</g>
    <g id="dMay" class="deco">${carn}</g>
    <g id="dBal" class="deco">${balloons}</g>
    </svg>`}

  /* облака */
  const CL=[];
  function buildClouds(){const g=el('hClouds');let h='';for(let i=0;i<8;i++){const s=.6+R()*.9,y=40+R()*230;const parts=[`<ellipse cx="0" cy="0" rx="95" ry="22"/>`];
      for(let k=0;k<4;k++)parts.push(`<circle cx="${-60+k*38+R()*10}" cy="${-14-R()*16}" r="${26+R()*20}"/>`);
      h+=`<g class="hcl" data-i="${i}" transform="translate(${R()*1400-100} ${y}) scale(${s})">${parts.join('')}</g>`;CL.push({x:R()*1400-100,y,s,v:6+R()*10})}
    g.innerHTML=h}

  /* состояние */
  const S={ov:{time:null,wx:null,hol:null},live:{wx:null,temp:null},cur:null};
  async function fetchWeather(){try{const ctl=new AbortController();setTimeout(()=>ctl.abort(),5000);
      const r=await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LNG}&current=temperature_2m,weather_code&timezone=Asia%2FTomsk`,{signal:ctl.signal});
      const j=await r.json();S.live.wx=wmo(j.current.weather_code);S.live.temp=Math.round(j.current.temperature_2m);apply()}catch(e){/* нет сети или блокировка: остаёмся на ясной погоде */}}

  function compute(){
    const now=tomskDate();let mo=now.getUTCMonth()+1,day=now.getUTCDate();let mins=now.getUTCHours()*60+now.getUTCMinutes();
    let hol=S.ov.hol===null?autoHoliday(mo,day):(S.ov.hol==='none'?null:S.ov.hol);
    let dateForSun=new Date();
    if(S.ov.hol&&S.ov.hol!=='none'){[mo,day]=HOL[S.ov.hol].d;dateForSun=new Date(Date.UTC(now.getUTCFullYear(),mo-1,day,12))}
    const st=sunMinutes(dateForSun);
    if(S.ov.time){mins={dawn:st.rise+15,day:13*60,eve:st.set+8,night:60}[S.ov.time]}
    const K=[[st.rise-100,'night'],[st.rise-35,'predawn'],[st.rise+25,'dawn'],[st.rise+130,'day'],[st.set-130,'day'],[st.set-30,'golden'],[st.set+25,'evening'],[st.set+100,'night']];
    let ph=PH.night,name='night';
    for(let i=0;i<K.length-1;i++){if(mins>=K[i][0]&&mins<K[i+1][0]){const t=smooth((mins-K[i][0])/(K[i+1][0]-K[i][0]));ph=lerpPh(PH[K[i][1]],PH[K[i+1][1]],t);name=t<.5?K[i][1]:K[i+1][1];break}}
    const label={night:'ночь',predawn:'рассвет',dawn:'утро',day:'день',golden:'вечер',evening:'вечер'}[name];
    let wx=S.ov.wx||S.live.wx||'clear';
    const sea=season(mo,day);
    if(sea==='winter'&&wx==='rain')wx='snow';
    const snowFx=wx==='snow'||(hol==='ny'&&wx==='clear');
    return{mins,st,ph,name,label,wx,hol,sea,mo,day,snowFx,live:!S.ov.wx&&S.live.wx}}

  function apply(){
    const c=S.cur=compute();const W=WX[c.wx];
    const dark=Math.min(1,c.ph.shade+(c.wx==='storm'?.22:c.wx==='rain'?.08:0));
    const wxTo=mix(W.to,'#121726',c.ph.shade*.9);
    const sky=c.ph.sky.map(s=>mix(s,wxTo,W.k));
    sky.forEach((s,i)=>el('hs'+i).setAttribute('stop-color',c.hol==='hw'&&c.ph.shade>.3?mix(s,'#3A1F4A',.35):s));
    c.ph.water.forEach((s,i)=>el('hw'+i).setAttribute('stop-color',mix(s,wxTo,W.k*.8)));
    const tint='#0B1026';
    document.querySelectorAll('#heroArt [data-c]').forEach(e=>{const base=c.sea==='winter'&&e.dataset.w?e.dataset.w:e.dataset.c;e.setAttribute('fill',mix(mix(base,'#8E98A6',W.k*.25),tint,dark*.85))});
    document.querySelectorAll('#heroArt [data-s]').forEach(e=>e.setAttribute('stroke',mix(e.dataset.s,tint,dark*.85)));
    const fol=FOL[c.sea];document.querySelectorAll('#heroArt .hf').forEach(e=>e.setAttribute('fill',mix(mix(fol[e.dataset.i%fol.length],'#8E98A6',W.k*.2),tint,dark*.85)));
    el('hTreeSnow').style.display=el('hRoofSnow').style.display=(c.sea==='winter'||c.sea==='thaw')?'':'none';
    el('hIce').setAttribute('opacity',c.sea==='winter'?1:c.sea==='thaw'?.6:0);
    // окна
    const litC=c.hol==='hw'?'#FFB050':'#FFD27A';
    document.querySelectorAll('#heroArt .hw').forEach(e=>{const lit=+e.dataset.r<c.ph.lit+(c.wx==='storm'||c.wx==='rain'?.15:0);e.dataset.lit=lit?1:0;e.setAttribute('fill',lit?litC:mix('#B9CCD8',tint,Math.min(1,dark*1.3)))});
    // солнце и луна
    const dayLen=c.st.set-c.st.rise;let p=(c.mins-c.st.rise)/dayLen;
    const sunVis=p>-.03&&p<1.03,sx=1120-p*1000,sy=430-Math.sin(Math.PI*Math.max(0,Math.min(1,p)))*320;
    el('hSun').setAttribute('transform',`translate(${sx} ${sy})`);el('hSun').style.opacity=sunVis?(c.wx==='clear'?1:c.wx==='cloudy'?.35:0):0;
    el('hSunDisc').setAttribute('fill',p<.12||p>.85?'#FFC48A':'#FFF1CC');
    let q=((c.mins-c.st.set+1440)%1440)/(1440-dayLen);const mx=1120-q*1000,my=400-Math.sin(Math.PI*Math.min(1,q))*300;
    el('hMoon').setAttribute('transform',`translate(${mx} ${my}) scale(${c.hol==='hw'?1.5:1})`);el('hMoon').style.opacity=sunVis?0:(c.wx==='clear'?1:c.wx==='cloudy'?.4:0);
    el('hMoonDisc').setAttribute('fill',c.hol==='hw'?'#F2A35A':'#F4EEDC');
    el('hStars').style.opacity=c.ph.stars*(c.wx==='clear'?1:c.wx==='cloudy'?.3:0);
    // блики на воде под светилом
    const lx=sunVis?sx:mx,lc=sunVis?'#FFE2B0':'#E8ECFF',lo=(sunVis?(c.wx==='clear'?.7:.2):(c.wx==='clear'?.45:0))*(c.sea==='winter'?0:1);
    el('hShim').innerHTML=[0,1,2,3,4].map(i=>`<path class="sh" d="M${lx-50+i*8+(i%2)*14} ${425+i*18}h${80-i*10}" stroke="${lc}"/>`).join('');el('hShim').style.opacity=lo;
    // облака
    const nCl={clear:2,cloudy:8,rain:8,storm:8,snow:7,fog:5}[c.wx];const clC=mix(mix(c.ph.cloud,W.to==='#000000'?c.ph.cloud:W.to,W.k*.8),'#151A2C',c.wx==='storm'?.5:0);
    document.querySelectorAll('#heroArt .hcl').forEach((g,i)=>{g.setAttribute('fill',clC);g.style.opacity=i<nCl?(c.wx==='clear'?.55:.92):0});
    // декор праздников
    const deco={dNy:c.hol==='ny',dHw:c.hol==='hw',dFlag:['feb23','may9','jun12'].includes(c.hol),dMar:c.hol==='mar8',dMay:c.hol==='may9',dBal:c.hol==='sep1'||c.hol==='tat'};
    for(const k in deco)el(k).style.display=deco[k]?'':'none';
    const balC=c.hol==='tat'?['#3D6FD6','#FFFFFF','#8FB8FF']:['#E8476A','#FFD24A','#3D9BE9','#4FBF7A','#FF8A3A'];
    document.querySelectorAll('#heroArt .hbb').forEach((e,i)=>e.setAttribute('fill',balC[Math.floor(i/2)%balC.length]));
    // текст поверх
    const heroEl=document.querySelector('.hero');heroEl.classList.toggle('dark',dark>.3);
    const ov=mix(sky[2],dark>.3?'#0A0F24':'#FFFFFF',dark>.3?.45:.35);heroEl.style.setProperty('--ov',rgba(ov,dark>.3?.8:.88));heroEl.style.setProperty('--ov2',rgba(ov,dark>.3?.45:.5));
    let hand;
    if(c.hol){hand=c.hol==='ny'&&c.mo===12&&c.day<31?HOL.ny.pre:HOL[c.hol].hand}
    else hand={storm:'Переждём грозу<br>в кофейне?',rain:'Даже под дождём<br>Томск красив ♡',snow:'Томск<br>в снегу ♡',fog:'Томск<br>в тумане…'}[c.wx]||{night:'Доброй ночи,<br>Томск ♡',predawn:'Томск<br>просыпается',dawn:'Доброе утро,<br>Томск ♡',day:'Томск<br>вдохновляет ♡',golden:'Золотой час<br>над Томью',evening:'Хорошего вечера,<br>Томск'}[c.name];
    el('hand').innerHTML=hand;
    // плашка «сейчас»
    const real=!S.ov.time&&!S.ov.hol;
    el('liveTxt').innerHTML=`${real?'Томск, '+fmt(c.mins):'Предпросмотр'} · ${c.label} · ${W.t}${S.live.temp!=null&&!S.ov.wx?`, ${S.live.temp>0?'+':''}${S.live.temp}°`:''}`;
    const nh=nextHoliday(tomskDate());
    el('liveSub').textContent=c.hol?`Сегодня праздник: ${HOL[c.hol].t}`:nh&&nh.days<=30?`До праздника «${HOL[nh.k].t}» ${nh.days} ${plural(nh.days,['день','дня','дней'])}`:`Восход ${fmt(c.st.rise)} · закат ${fmt(c.st.set)}`;
    // подсказка под героем
    const wxp={rain:['Сейчас дождь: собрали места под крышей',{w:'in'}],storm:['Гроза: самое время для музея или кофейни',{w:'in'}],snow:['Снег идёт: тёплые места и красивые прогулки',{w:'in'}],fog:['Туман над Томью: уютные места под крышей',{w:'in'}]}[c.wx]
      ||(c.ph.shade>.4?['Не спится? Ночные виды на Томь',{cat:'nature'}]:c.name==='golden'?['Золотой час: успейте на набережную к закату',{cat:'nature'}]:['Хорошая погода: места для прогулок',{w:'out'}]);
    el('wxTxt').textContent=wxp[0];HERO.suggest=wxp[1];
    // эффекты для холста
    FX.set(c,dark);
    syncPanel()}

  /* --- холст: дождь, снег, листья, лепестки, салют, летучие мыши, молния --- */
  const FX=(()=>{const cv=el('heroFx'),ctx=cv.getContext('2d');let W=0,H=0,dpr=1;const P={rain:[],snow:[],leaf:[],petal:[],conf:[],bats:[],fw:[],birds:[]};let cfg={},flash=0,bolt=null,nextBolt=3,nextFw=1;
    function size(){const r=cv.parentElement.getBoundingClientRect();dpr=Math.min(devicePixelRatio,2);W=r.width;H=r.height;cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)}
    new ResizeObserver(size).observe(el('heroFx').parentElement);size();
    function fill(arr,n,mk){while(arr.length<n)arr.push(mk(true));arr.length=n}
    const mk={rain:f=>({x:R()*W*1.2,y:f?R()*H:-20,v:850+R()*450,l:12+R()*12}),snow:f=>({x:R()*W,y:f?R()*H:-6,v:25+R()*55,r:1+R()*2.4,ph:R()*6}),
      leaf:f=>({x:R()*W,y:f?R()*H:-12,v:28+R()*30,r:5+R()*4,ph:R()*6,a:R()*6,c:['#D9772B','#E3A03C','#B5551D','#E8C55A'][Math.floor(R()*4)]}),
      petal:f=>({x:R()*W,y:f?R()*H:-10,v:30+R()*30,r:4+R()*3,ph:R()*6,a:R()*6,c:['#F7A8C0','#F06A9A','#FFD3E0'][Math.floor(R()*3)]}),
      conf:f=>({x:R()*W,y:f?R()*H:-8,v:50+R()*60,r:3+R()*3,ph:R()*6,a:R()*6,c:['#3D6FD6','#FFFFFF','#FFD24A','#E8476A','#4FBF7A'][Math.floor(R()*5)]}),
      bats:()=>({x:R()*W,y:30+R()*H*.4,v:40+R()*50,ph:R()*6,s:.7+R()*.6}),birds:()=>({x:R()*W,y:40+R()*H*.25,v:18+R()*14,ph:R()*6,s:.7+R()*.4})};
    function set(c,dark){const autumnLeaves=c.sea==='autumn'&&!['rain','storm','snow'].includes(c.wx);
      cfg={rain:c.wx==='rain'?220:c.wx==='storm'?420:0,snow:c.snowFx?(c.wx==='snow'?220:70):0,leaf:c.hol==='sep1'?26:autumnLeaves?10:0,petal:c.hol==='mar8'?46:0,conf:c.hol==='tat'?60:0,
        bats:c.hol==='hw'?7:0,birds:c.ph.shade<.1&&c.wx==='clear'&&c.sea!=='winter'&&!c.hol?4:0,fw:(['ny','may9','jun12','feb23'].includes(c.hol)&&dark>.25),storm:c.wx==='storm',fog:c.wx==='fog',wind:c.wx==='storm'?-.35:-.15,dark};
      for(const k of ['rain','snow','leaf','petal','conf','bats','birds'])fill(P[k],cfg[k],mk[k]);if(!cfg.fw)P.fw.length=0;if(reduce)draw(0,0)}
    function burst(){const x=W*(.35+R()*.6),y=H*(.1+R()*.3),col=['#FFD24A','#FF5A7A','#5AD1FF','#FFFFFF','#9DFF8A','#D52B1E','#1C57A5'][Math.floor(R()*7)];
      for(let i=0;i<70;i++){const a=R()*6.28,s=60+R()*140;P.fw.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:1.4+R()*.8,t:0,c:col})}}
    function draw(dt,t){ctx.clearRect(0,0,W,H);
      if(cfg.fog){for(let i=0;i<4;i++){const y=H*(.45+i*.13),x=((t*12*(i%2?1:-1)+i*300)%(W+600))-300;const g=ctx.createRadialGradient(x+W*.4,y,0,x+W*.4,y,W*.6);g.addColorStop(0,'rgba(235,238,242,.35)');g.addColorStop(1,'rgba(235,238,242,0)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H)}}
      if(cfg.rain){ctx.strokeStyle=cfg.dark>.3?'rgba(170,185,220,.45)':'rgba(215,225,240,.55)';ctx.lineWidth=1.2;ctx.beginPath();
        P.rain.forEach((d,i)=>{d.y+=d.v*dt;d.x+=d.v*cfg.wind*dt;if(d.y>H||d.x<-20)P.rain[i]=Object.assign(d,mk.rain(false));ctx.moveTo(d.x,d.y);ctx.lineTo(d.x-d.l*cfg.wind,d.y-d.l)});ctx.stroke()}
      if(cfg.snow){ctx.fillStyle='rgba(255,255,255,.9)';P.snow.forEach((s,i)=>{s.y+=s.v*dt;s.x+=Math.sin(t+s.ph)*14*dt;if(s.y>H)P.snow[i]=mk.snow(false);ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,6.28);ctx.fill()})}
      ['leaf','petal','conf'].forEach(k=>P[k].forEach((l,i)=>{l.y+=l.v*dt;l.x+=Math.sin(t*1.2+l.ph)*30*dt-8*dt;l.a+=dt*2;if(l.y>H+10)P[k][i]=mk[k](false);
        ctx.save();ctx.translate(l.x,l.y);ctx.rotate(l.a);ctx.scale(1,Math.abs(Math.cos(l.a*1.3))*.8+.2);ctx.fillStyle=l.c;ctx.beginPath();
        if(k==='conf')ctx.rect(-l.r/2,-l.r,l.r,l.r*2);else ctx.ellipse(0,0,l.r,l.r*.55,0,0,6.28);ctx.fill();ctx.restore()}));
      ctx.strokeStyle=cfg.dark>.3?'rgba(230,230,240,.7)':'rgba(40,40,50,.7)';ctx.lineWidth=1.6;
      P.birds.forEach(b=>{b.x-=b.v*dt;if(b.x<-20)b.x=W+20;const f=Math.sin(t*6+b.ph)*4*b.s;ctx.beginPath();ctx.moveTo(b.x-7*b.s,b.y-f);ctx.quadraticCurveTo(b.x-3*b.s,b.y-2,b.x,b.y);ctx.quadraticCurveTo(b.x+3*b.s,b.y-2,b.x+7*b.s,b.y-f);ctx.stroke()});
      ctx.fillStyle='#1A0E22';P.bats.forEach(b=>{b.x+=b.v*dt;b.y+=Math.sin(t*2+b.ph)*20*dt;if(b.x>W+20)b.x=-20;const f=Math.sin(t*14+b.ph)*6*b.s,s=b.s;
        ctx.beginPath();ctx.moveTo(b.x,b.y);ctx.quadraticCurveTo(b.x-8*s,b.y-6*s-f,b.x-16*s,b.y-f);ctx.quadraticCurveTo(b.x-9*s,b.y+1,b.x,b.y+3*s);ctx.quadraticCurveTo(b.x+9*s,b.y+1,b.x+16*s,b.y-f);ctx.quadraticCurveTo(b.x+8*s,b.y-6*s-f,b.x,b.y);ctx.fill()});
      if(cfg.fw){nextFw-=dt;if(nextFw<=0){burst();nextFw=.9+R()*1.6}ctx.globalCompositeOperation='lighter';
        P.fw=P.fw.filter(p=>{p.t+=dt;if(p.t>p.life)return false;p.vy+=60*dt;p.vx*=.985;p.vy*=.985;p.x+=p.vx*dt;p.y+=p.vy*dt;ctx.globalAlpha=1-p.t/p.life;ctx.fillStyle=p.c;ctx.beginPath();ctx.arc(p.x,p.y,1.8,0,6.28);ctx.fill();return true});
        ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over'}
      if(cfg.storm){nextBolt-=dt;if(nextBolt<=0){flash=1;nextBolt=4+R()*6;let x=W*(.2+R()*.7),y=0;bolt=[[x,y]];while(y<H*.62){x+=(R()-.5)*50;y+=20+R()*30;bolt.push([x,y])}bolt.t=.18}
        if(bolt&&bolt.t>0){bolt.t-=dt;ctx.strokeStyle='rgba(240,245,255,.95)';ctx.lineWidth=2.4;ctx.shadowColor='#C8D8FF';ctx.shadowBlur=14;ctx.beginPath();bolt.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();ctx.shadowBlur=0}}
      flash=Math.max(0,flash-dt*3.2);el('heroFlash').style.opacity=flash*.55}
    return{set,draw}})();

  /* анимация: облака, блики, гирлянда, шары, флаги */
  let last=performance.now();
  function frame(now){const dt=Math.min(.05,(now-last)/1000);last=now;const t=now/1000;
    document.querySelectorAll('#heroArt .hcl').forEach((g,i)=>{const c=CL[i];c.x+=c.v*dt*(S.cur&&S.cur.wx==='storm'?3:1);if(c.x>1350)c.x=-250;g.setAttribute('transform',`translate(${c.x.toFixed(1)} ${c.y}) scale(${c.s})`)});
    document.querySelectorAll('#heroArt .sh').forEach((s,i)=>s.style.opacity=.45+.55*Math.sin(t*2+i*1.7)**2);
    if(el('dNy').style.display!=='none')document.querySelectorAll('#dNy .gb').forEach(b=>b.style.opacity=(Math.floor(t*1.6)+ +b.dataset.p)%3===0?.25:1);
    if(el('dBal').style.display!=='none')document.querySelectorAll('#heroArt .hb').forEach((b,i)=>b.setAttribute('transform',`translate(0 ${(Math.sin(t*1.3+i)*4).toFixed(1)})`));
    if(el('dFlag').style.display!=='none')document.querySelectorAll('#heroArt .hflag').forEach((f,i)=>f.setAttribute('transform',`skewY(${(Math.sin(t*3+i)*6).toFixed(1)})`));
    if(el('dHw').style.display!=='none')document.querySelectorAll('#heroArt .pf').forEach((p,i)=>p.style.opacity=.75+.25*Math.sin(t*9+i*2)*Math.sin(t*3.3+i));
    if(S.cur&&S.cur.ph.lit>0&&Math.random()<dt*.4){const lit=[...document.querySelectorAll('#heroArt .hw[data-lit="1"]')];const w=lit[Math.floor(R()*lit.length)];if(w){w.style.opacity=.55;setTimeout(()=>w.style.opacity=1,300+R()*600)}}
    FX.draw(dt,t);requestAnimationFrame(frame)}

  /* панель предпросмотра */
  const ROWS=[['time','Время',[[null,'Сейчас'],['dawn','Рассвет'],['day','День'],['eve','Вечер'],['night','Ночь']]],
    ['wx','Погода',[[null,'Как сейчас'],['clear','Ясно'],['cloudy','Облачно'],['rain','Дождь'],['snow','Снег'],['storm','Гроза'],['fog','Туман']]],
    ['hol','Праздник',[[null,'По календарю'],['none','Без праздника'],...Object.keys(HOL).map(k=>[k,HOL[k].t])]]];
  function syncPanel(){document.querySelectorAll('#livePanel [data-k]').forEach(b=>b.setAttribute('aria-pressed',String(S.ov[b.dataset.k])===String(b.dataset.v==='null'?null:b.dataset.v)))}
  function init(){
    el('heroArt').innerHTML=buildSVG();buildClouds();
    el('livePanel').querySelector('.lp-rows').innerHTML=ROWS.map(([k,t,opts])=>`<div class="lp-row"><b>${t}</b><div>${opts.map(([v,l])=>`<button data-k="${k}" data-v="${v}">${l}</button>`).join('')}</div></div>`).join('');
    el('livePanel').addEventListener('click',e=>{const b=e.target.closest('[data-k]');if(!b)return;S.ov[b.dataset.k]=b.dataset.v==='null'?null:b.dataset.v;apply()});
    el('livePill').addEventListener('click',()=>{const p=el('livePanel');p.hidden=!p.hidden;el('livePill').setAttribute('aria-expanded',!p.hidden)});
    el('liveClose').addEventListener('click',()=>{el('livePanel').hidden=true;el('livePill').setAttribute('aria-expanded',false)});
    el('liveReset').addEventListener('click',()=>{S.ov={time:null,wx:null,hol:null};apply()});
    apply();fetchWeather();setInterval(apply,60000);setInterval(fetchWeather,15*60000);
    if(!reduce)requestAnimationFrame(frame)}
  return{init,suggest:{w:'in'}}})();
