const HERO=(()=>{
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

  /* ---------- сцена-наклейка ---------- */
  const S_=`stroke="${INK}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`;
  const WIN=[];const winRect=(x,y,w,h)=>{WIN.push([x,y,w,h]);return''};
  const CAPS=[];
  function house(x,base,w,h,wall,roof){ // изба: стены, двускатная крыша с напуском, окна с наличниками
    const top=base-h,rt=top-w*.45;
    let s=`<path d="M${x} ${base}V${top}H${x+w}V${base}Z" fill="${wall}" ${S_}/>`;
    s+=`<path d="M${x-10} ${top+2}L${x+w/2} ${rt}L${x+w+10} ${top+2}Z" fill="${roof}" ${S_}/>`;
    CAPS.push(`<path d="M${x-12} ${top+3}L${x+w/2} ${rt-2}L${x+w+12} ${top+3}L${x+w+2} ${top+5}L${x+w/2} ${rt+12}L${x-2} ${top+5}Z"/>`);
    const n=w>90?2:1,ww=22,wy=top+Math.max(14,(h-36)/2);
    for(let i=0;i<n;i++){const wx=n===1?x+w/2-ww/2:x+(i?w*.66:w*.34)-ww/2;winRect(wx,wy,ww,32);s+=`<path d="M${wx-4} ${wy-3}q${ww/2+4} -14 ${ww+8} 0" fill="none" ${S_}/>`}
    return s}
  function build(){
    let w='';const stars=Array.from({length:26},()=>{const x=R()*1200,y=R()*190+10,k=R()*3+3,a=k*.3,f=n=>n.toFixed(1);return `<path class="st" d="M${f(x)} ${f(y-k)}L${f(x+a)} ${f(y-a)}L${f(x+k)} ${f(y)}L${f(x+a)} ${f(y+a)}L${f(x)} ${f(y+k)}L${f(x-a)} ${f(y+a)}L${f(x-k)} ${f(y)}L${f(x-a)} ${f(y-a)}Z" fill="#FFFDF5" style="animation-delay:${(R()*3).toFixed(2)}s"/>`}).join('');
    const clouds=Array.from({length:7},(_,i)=>`<g class="cl" data-i="${i}"><path d="M0 0a36 36 0 0 1 62 -26a46 46 0 0 1 84 18a30 30 0 0 1 8 58H8a28 28 0 0 1 -8 -50z" ${S_}/></g>`).join('');
    // дом с шатром (Красноармейская, 71) — герой картинки
    const shatr=`<g id="sShatr"><path d="M520 330V200L600 160L680 200V330Z" fill="#C8763E" ${S_}/>
      <path d="M560 168V120H640V176" fill="#C8763E" ${S_}/><path d="M552 122L600 20L648 122Z" fill="#3B2BD9" ${S_}/><path d="M600 20V2" ${S_}/><circle cx="600" cy="2" r="5" fill="#FFD43B" ${S_}/>
      <path d="M512 204L600 156L688 204" fill="none" ${S_} stroke-width="6"/><path d="M548 124h104" ${S_}/>
      <path d="M540 236q22 -18 44 0M616 236q22 -18 44 0M584 146q16 -14 32 0" fill="none" ${S_}/></g>`;
    winRect(546,240,32,46);winRect(622,240,32,46);winRect(588,150,24,22);
    const hs=house(330,330,120,86,'#FF5A36','#111111')+house(760,330,140,96,'#FFD43B','#2E8A5C')+house(930,330,96,70,'#B9E4FF','#3B2BD9')+house(200,330,100,64,'#C9F2D2','#FF5A36');
    w=WIN.map(a=>`<rect class="win" data-r="${R().toFixed(3)}" x="${a[0]}" y="${a[1]}" width="${a[2]}" height="${a[3]}" rx="4" ${S_}/>`).join('');
    const firs=[[120,330,46],[470,330,34],[715,330,30],[1080,330,52],[1150,330,36]].map(([x,b,h])=>`<path d="M${x} ${b}L${x-h*.45} ${b}L${x} ${b-h*1.6}L${x+h*.45} ${b}Z" fill="#2E8A5C" ${S_}/>`).join('');
    const decs=[[60,330,30],[1010,330,26],[280,330,22]].map(([x,b,r],i)=>`<path d="M${x} ${b}V${b-r}" ${S_}/><circle class="dec" data-i="${i}" cx="${x}" cy="${b-r-r*.8}" r="${r}" ${S_}/>`).join('');
    const caps=`<g id="sCaps" fill="#FFFDF5" ${S_}>${CAPS.join('')}
      <path d="M508 206L600 154L692 206L686 212L600 168L514 212Z"/><path d="M548 124L600 18L652 124L644 126L600 36L556 126Z"/>
      ${[[120,330,46],[1080,330,52]].map(([x,b,h])=>`<path d="M${x} ${b-h*1.6}L${x-h*.2} ${b-h*.9}L${x+h*.2} ${b-h*.9}Z"/>`).join('')}</g>`;
    // праздники
    let gar='';for(let i=0;i<=20;i++){const t=i/20,x=40+1120*t,y=30+Math.sin(t*Math.PI*6)*-4+26*Math.sin(t*Math.PI*3)**2;gar+=`<circle class="gb" data-p="${i%3}" cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="9" fill="${['#FF5A36','#FFD43B','#3B2BD9'][i%3]}" ${S_}/>`}
    const tree=`<path d="M1080 330L1022 330L1080 214L1138 330Z" fill="#2E8A5C" ${S_}/>${[[1062,300,'#FF5A36'],[1096,292,'#FFD43B'],[1078,262,'#3B2BD9'],[1104,318,'#FFC3D0'],[1056,322,'#FFD43B']].map(([x,y,c])=>`<circle class="gb" data-p="1" cx="${x}" cy="${y}" r="7" fill="${c}" ${S_}/>`).join('')}<path d="M1080 196l7 14h15l-12 9 5 15-15-9-15 9 5-15-12-9h15z" fill="#FFD43B" ${S_}/>`;
    const pumpkin=(x,s)=>`<g transform="translate(${x} 336) scale(${s})"><path d="M0 -22v-12" ${S_}/><ellipse rx="30" ry="22" fill="#FF8A1F" ${S_}/><path d="M-10 -21q-6 21 0 42M10 -21q6 21 0 42" fill="none" ${S_}/><path class="pf" d="M-16 -6l7 -8 7 8zM4 -6l7 -8 7 8zM-14 6q14 10 28 0l-6 6-4-4-4 4-4-4-4 4z" fill="#FFD43B" ${S_} stroke-width="2"/></g>`;
    const flag=(x,y)=>`<g transform="translate(${x} ${y})"><path d="M0 0V-58" ${S_}/><g class="fl"><path d="M0 -58h40v10H0z" fill="#FFFFFF" ${S_} stroke-width="2"/><path d="M0 -48h40v10H0z" fill="#1C57A5" ${S_} stroke-width="2"/><path d="M0 -38h40v10H0z" fill="#D52B1E" ${S_} stroke-width="2"/></g></g>`;
    const tulips=Array.from({length:12},(_,i)=>{const x=60+i*96+(i%2)*22;const c=['#FF5A8A','#FFD43B','#FF5A36','#FFC3D0'][i%4];return `<path d="M${x} 344v-34" ${S_}/><path d="M${x-11} 312q0-20 11-22q11 2 11 22q-11 8-22 0z" fill="${c}" ${S_}/>`}).join('');
    const carn=Array.from({length:10},(_,i)=>{const x=80+i*112;return `<path d="M${x} 344v-30" ${S_}/><circle cx="${x}" cy="308" r="10" fill="#D52B1E" ${S_}/>`}).join('');
    const balloons=[[300,96,'#FF5A36'],[336,80,'#FFD43B'],[372,100,'#3B2BD9'],[880,90,'#C9F2D2'],[916,74,'#FFC3D0']].map(([x,y,c],i)=>`<g class="bl" data-i="${i}"><path d="M${x} ${y+34}Q${x+10} ${y+110} ${x<600?350:900} 250" fill="none" ${S_} stroke-width="2"/><ellipse class="blb" cx="${x}" cy="${y}" rx="22" ry="28" fill="${c}" ${S_}/></g>`).join('');
    return `<svg viewBox="0 0 1200 420" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <rect id="sSky" width="1200" height="420"/><path id="sHz" d="M0 190Q300 170 600 186T1200 180V420H0Z"/>
      <g id="sStars">${stars}</g>
      <g id="sSun"><circle r="54" fill="#FFD43B" ${S_} id="sSunDisc"/><path d="M-70 0h-18M70 0h18M0 -70v-18M0 70v18M-50 -50l-12 -12M50 50l12 12M50 -50l12 -12M-50 50l-12 12" ${S_} id="sRays"/></g>
      <g id="sMoon"><circle r="40" fill="#FFFDF5" ${S_} id="sMoonDisc"/><circle cx="-12" cy="-8" r="7" fill="#E2DED2" ${S_} stroke-width="2"/><circle cx="12" cy="12" r="5" fill="#E2DED2" ${S_} stroke-width="2"/></g>
      <g id="sClouds">${clouds}</g>
      <path id="sHill" d="M0 300Q160 240 330 280T700 262T1000 276T1200 256V420H0Z" ${S_}/>
      <g id="sFirs">${firs}</g><g id="sDecs">${decs}</g>
      ${hs}${shatr}
      <rect id="sNight" width="1200" height="420" fill="#141A4A" opacity="0"/>
      <g id="sWin">${w}</g>${caps}
      <path id="sGround" d="M0 330H1200V420H0Z" ${S_}/>
      <path id="sRiver" d="M0 364Q300 350 600 366T1200 358V420H0Z" ${S_}/>
      <g id="sIce" ${S_} fill="none"><path d="M80 392l70 8 40 -6M380 404l90 -6 30 10M760 396l60 10M980 400l90 -8"/></g>
      <g id="dNy" class="deco">${gar}${tree}</g>
      <g id="dHw" class="deco">${pumpkin(470,1)}${pumpkin(720,.8)}${pumpkin(1110,1.1)}</g>
      <g id="dFlag" class="deco">${flag(390,212)}${flag(830,198)}</g>
      <g id="dMar" class="deco">${tulips}</g><g id="dMay" class="deco">${carn}</g><g id="dBal" class="deco">${balloons}</g>
    </svg>`}

  /* облака */
  const CL=[];
  function placeClouds(){document.querySelectorAll('#heroArt .cl').forEach((g,i)=>{CL[i]={x:R()*1400-150,y:30+R()*120,s:.55+R()*.6,v:5+R()*8}})}

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

  const GREET={night:'Доброй ночи',predawn:'Доброе утро',dawn:'Доброе утро',day:'Добрый день',golden:'Добрый вечер',evening:'Добрый вечер'};
  const GROUND={winter:'#FFFDF5',thaw:'#C8D3C0',spring:'#9BE3A8',summer:'#7FD38F',autumn:'#FFC861'};
  const HILL={winter:'#E6EEF6',thaw:'#A9BCA4',spring:'#6CC27E',summer:'#4FB36A',autumn:'#F29A3B'};
  const DEC={winter:'#B8C4CC',thaw:'#7E9A7A',spring:'#8BD47A',summer:'#3FA66A',autumn:'#FF8A1F'};
  function apply(){
    const c=S.cur=compute();const W=WX[c.wx];const dk=c.ph.dark;
    const wxCol=mix(WXDAY[c.wx],WXNIGHT[c.wx],dk);
    const sky=mix(c.ph.sky,wxCol,W.k),hz=mix(c.ph.hz,wxCol,W.k*.8);
    el('sSky').setAttribute('fill',c.hol==='hw'&&dk>.3?mix(sky,'#3A1F4A',.4):sky);el('sHz').setAttribute('fill',hz);
    el('sStars').style.opacity=c.ph.stars*(c.wx==='clear'||c.wx==='snow'?1:.15);
    const dim=x=>mix(x,'#1A2050',dk*.45);
    el('sHill').setAttribute('fill',dim(HILL[c.sea]));el('sGround').setAttribute('fill',dim(c.snowFx&&c.sea!=='summer'?'#FFFDF5':GROUND[c.sea]));
    el('sRiver').setAttribute('fill',dim(c.sea==='winter'?'#E3F1FF':'#6FB7F2'));el('sIce').style.display=c.sea==='winter'?'':'none';
    document.querySelectorAll('#heroArt .dec').forEach(e=>e.setAttribute('fill',DEC[c.sea]));
    el('sCaps').style.display=(c.sea==='winter'||c.sea==='thaw'||c.snowFx)?'':'none';
    el('sNight').setAttribute('opacity',(dk*.38+(c.wx==='storm'?.12:c.wx==='rain'?.06:0)).toFixed(2));
    // окна: днём голубые, в сумерках и ночью загораются
    const litC=c.hol==='hw'?'#FF9A3B':'#FFD43B';
    document.querySelectorAll('#heroArt .win').forEach(e=>{const lit=+e.dataset.r<c.ph.lit+(c.wx==='storm'||c.wx==='rain'?.15:0);e.dataset.lit=lit?1:0;e.setAttribute('fill',lit?litC:dk>.4?'#2A3366':'#D6EEFF')});
    // солнце и луна по реальному времени
    const dayLen=c.st.set-c.st.rise;const p=(c.mins-c.st.rise)/dayLen;
    const sunVis=p>-.03&&p<1.03,sx=1100-p*1000,sy=250-Math.sin(Math.PI*Math.max(0,Math.min(1,p)))*190;
    el('sSun').setAttribute('transform',`translate(${sx.toFixed(0)} ${sy.toFixed(0)})`);el('sSun').style.opacity=sunVis?(c.wx==='clear'?1:c.wx==='cloudy'?.7:0):0;
    el('sSunDisc').setAttribute('fill',p<.12||p>.85?'#FF9A3B':'#FFD43B');el('sRays').style.display=p>.1&&p<.9?'':'none';
    const q=((c.mins-c.st.set+1440)%1440)/(1440-dayLen);const mx=1100-q*1000,my=230-Math.sin(Math.PI*Math.min(1,q))*170;
    el('sMoon').setAttribute('transform',`translate(${mx.toFixed(0)} ${my.toFixed(0)}) scale(${c.hol==='hw'?1.4:1})`);el('sMoon').style.opacity=sunVis?0:(c.wx==='clear'||c.wx==='snow'?1:c.wx==='cloudy'?.6:0);
    el('sMoonDisc').setAttribute('fill',c.hol==='hw'?'#FF9A3B':'#FFFDF5');
    // облака
    const nCl={clear:2,cloudy:7,rain:7,storm:7,snow:6,fog:5}[c.wx];const clC=c.wx==='storm'?'#6B7590':c.wx==='rain'?'#AEB8C6':dk>.5?'#5A67B0':'#FFFDF5';
    document.querySelectorAll('#heroArt .cl path').forEach((p,i)=>{p.setAttribute('fill',clC);p.parentNode.style.opacity=i<nCl?1:0});
    // праздники
    const deco={dNy:c.hol==='ny',dHw:c.hol==='hw',dFlag:['feb23','may9','jun12'].includes(c.hol),dMar:c.hol==='mar8',dMay:c.hol==='may9',dBal:c.hol==='sep1'||c.hol==='tat'};
    for(const k in deco)el(k).style.display=deco[k]?'':'none';
    if(c.hol==='tat')document.querySelectorAll('#heroArt .blb').forEach((e,i)=>e.setAttribute('fill',['#3B2BD9','#FFFDF5','#B9E4FF'][i%3]));
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
    el('heroGoTxt').textContent=wxp[0];HERO.suggest=wxp[1];if(el('wxTxt'))el('wxTxt').textContent=wxp[0];
    el('hero2').classList.toggle('dark',dk>.5);
    FX.set(c,dk);syncPanel()}

  /* частицы: снег, дождь, листья, лепестки, конфетти, летучие мыши, салют, молния */
  const FX=(()=>{const cv=el('heroFx'),ctx=cv.getContext('2d');let W=0,H=0;const P={rain:[],snow:[],leaf:[],petal:[],conf:[],bats:[],fw:[]};let cfg={},flash=0,bolt=null,nextBolt=3,nextFw=1;
    function size(){const r=cv.parentElement.getBoundingClientRect();const dpr=Math.min(devicePixelRatio,2);W=r.width;H=r.height;cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)}
    new ResizeObserver(size).observe(cv.parentElement);size();
    const fill=(a,n,mk)=>{while(a.length<n)a.push(mk(true));a.length=n};
    const mk={rain:f=>({x:R()*W*1.2,y:f?R()*H:-20,v:700+R()*350,l:14+R()*10}),snow:f=>({x:R()*W,y:f?R()*H:-8,v:22+R()*40,r:3+R()*3.5,ph:R()*6}),
      leaf:f=>({x:R()*W,y:f?R()*H:-12,v:28+R()*30,r:7+R()*4,ph:R()*6,a:R()*6,c:['#FF8A1F','#FFD43B','#FF5A36'][Math.floor(R()*3)]}),
      petal:f=>({x:R()*W,y:f?R()*H:-10,v:30+R()*30,r:6+R()*3,ph:R()*6,a:R()*6,c:['#FF5A8A','#FFC3D0','#FFFDF5'][Math.floor(R()*3)]}),
      conf:f=>({x:R()*W,y:f?R()*H:-8,v:50+R()*60,r:4+R()*3,ph:R()*6,a:R()*6,c:['#3B2BD9','#FFFDF5','#FFD43B','#FF5A36','#C9F2D2'][Math.floor(R()*5)]}),
      bats:()=>({x:R()*W,y:20+R()*H*.35,v:40+R()*50,ph:R()*6,s:.8+R()*.6})};
    function set(c,dk){const autumn=c.sea==='autumn'&&!['rain','storm','snow'].includes(c.wx);
      cfg={rain:c.wx==='rain'?120:c.wx==='storm'?220:0,snow:c.snowFx?(c.wx==='snow'?110:40):0,leaf:c.hol==='sep1'?20:autumn?8:0,petal:c.hol==='mar8'?34:0,conf:c.hol==='tat'?44:0,
        bats:c.hol==='hw'?6:0,fw:(['ny','may9','jun12','feb23'].includes(c.hol)&&dk>.3),storm:c.wx==='storm',dark:dk};
      for(const k of ['rain','snow','leaf','petal','conf','bats'])fill(P[k],cfg[k],mk[k]);if(!cfg.fw)P.fw.length=0;if(reduce)draw(0,0)}
    function burst(){const x=W*(.15+R()*.7),y=H*(.1+R()*.3),col=['#FFD43B','#FF5A36','#B9E4FF','#FFFDF5','#C9F2D2'][Math.floor(R()*5)];
      for(let i=0;i<50;i++){const a=R()*6.28,s=50+R()*120;P.fw.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:1.2+R()*.7,t:0,c:col})}}
    function draw(dt,t){ctx.clearRect(0,0,W,H);ctx.lineJoin='round';
      if(cfg.rain){ctx.strokeStyle=cfg.dark>.4?'rgba(214,238,255,.75)':'rgba(17,17,17,.55)';ctx.lineWidth=2.5;ctx.lineCap='round';ctx.beginPath();
        P.rain.forEach((d,i)=>{d.y+=d.v*dt;d.x-=d.v*.2*dt;if(d.y>H||d.x<-20)P.rain[i]=Object.assign(d,mk.rain(false));ctx.moveTo(d.x,d.y);ctx.lineTo(d.x+d.l*.2,d.y-d.l)});ctx.stroke()}
      if(cfg.snow){ctx.fillStyle='#FFFDF5';ctx.strokeStyle='#111111';ctx.lineWidth=1.5;P.snow.forEach((s,i)=>{s.y+=s.v*dt;s.x+=Math.sin(t+s.ph)*12*dt;if(s.y>H)P.snow[i]=mk.snow(false);ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,6.28);ctx.fill();ctx.stroke()})}
      ['leaf','petal','conf'].forEach(k=>P[k].forEach((l,i)=>{l.y+=l.v*dt;l.x+=Math.sin(t*1.2+l.ph)*30*dt-8*dt;l.a+=dt*2;if(l.y>H+10)P[k][i]=mk[k](false);
        ctx.save();ctx.translate(l.x,l.y);ctx.rotate(l.a);ctx.scale(1,Math.abs(Math.cos(l.a*1.3))*.8+.2);ctx.fillStyle=l.c;ctx.strokeStyle='#111111';ctx.lineWidth=1.5;ctx.beginPath();
        if(k==='conf')ctx.rect(-l.r/2,-l.r,l.r,l.r*2);else ctx.ellipse(0,0,l.r,l.r*.55,0,0,6.28);ctx.fill();ctx.stroke();ctx.restore()}));
      ctx.fillStyle='#111111';P.bats.forEach(b=>{b.x+=b.v*dt;b.y+=Math.sin(t*2+b.ph)*20*dt;if(b.x>W+20)b.x=-20;const f=Math.sin(t*14+b.ph)*7*b.s,s=b.s;
        ctx.beginPath();ctx.moveTo(b.x,b.y);ctx.quadraticCurveTo(b.x-9*s,b.y-7*s-f,b.x-18*s,b.y-f);ctx.quadraticCurveTo(b.x-10*s,b.y+1,b.x,b.y+3*s);ctx.quadraticCurveTo(b.x+10*s,b.y+1,b.x+18*s,b.y-f);ctx.quadraticCurveTo(b.x+9*s,b.y-7*s-f,b.x,b.y);ctx.fill()});
      if(cfg.fw){nextFw-=dt;if(nextFw<=0){burst();nextFw=.9+R()*1.5}
        P.fw=P.fw.filter(p=>{p.t+=dt;if(p.t>p.life)return false;p.vy+=60*dt;p.vx*=.985;p.vy*=.985;p.x+=p.vx*dt;p.y+=p.vy*dt;ctx.globalAlpha=1-p.t/p.life;ctx.fillStyle=p.c;ctx.beginPath();ctx.arc(p.x,p.y,3,0,6.28);ctx.fill();return true});ctx.globalAlpha=1}
      if(cfg.storm){nextBolt-=dt;if(nextBolt<=0){flash=1;nextBolt=4+R()*6;let x=W*(.2+R()*.6),y=0;bolt=[[x,y]];while(y<H*.55){x+=(R()-.5)*44;y+=24+R()*26;bolt.push([x,y])}bolt.t=.22}
        if(bolt&&bolt.t>0){bolt.t-=dt;ctx.lineCap='round';ctx.strokeStyle='#111111';ctx.lineWidth=9;ctx.beginPath();bolt.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();ctx.strokeStyle='#FFD43B';ctx.lineWidth=5;ctx.stroke()}}
      flash=Math.max(0,flash-dt*3.2);el('heroFlash').style.opacity=flash*.5}
    return{set,draw}})();

  let last=performance.now();
  function frame(now){const dt=Math.min(.05,(now-last)/1000);last=now;const t=now/1000;
    document.querySelectorAll('#heroArt .cl').forEach((g,i)=>{const c=CL[i];if(!c)return;c.x+=c.v*dt*(S.cur&&S.cur.wx==='storm'?3:1);if(c.x>1300)c.x=-200;g.setAttribute('transform',`translate(${c.x.toFixed(1)} ${(c.y+Math.sin(t*.6+i)*3).toFixed(1)}) scale(${c.s})`)});
    if(el('dNy').style.display!=='none')document.querySelectorAll('#dNy .gb').forEach(b=>b.style.opacity=(Math.floor(t*1.6)+ +b.dataset.p)%3===0?.35:1);
    if(el('dBal').style.display!=='none')document.querySelectorAll('#heroArt .bl').forEach((b,i)=>b.setAttribute('transform',`translate(0 ${(Math.sin(t*1.3+i)*5).toFixed(1)})`));
    if(el('dFlag').style.display!=='none')document.querySelectorAll('#heroArt .fl').forEach((f,i)=>f.setAttribute('transform',`skewY(${(Math.sin(t*3+i)*5).toFixed(1)})`));
    if(el('dHw').style.display!=='none')document.querySelectorAll('#heroArt .pf').forEach((p,i)=>p.style.opacity=.7+.3*Math.sin(t*9+i*2)*Math.sin(t*3.3+i));
    FX.draw(dt,t);requestAnimationFrame(frame)}

  const ROWS=[['time','Время',[[null,'Сейчас'],['dawn','Утро'],['day','День'],['eve','Вечер'],['night','Ночь']]],
    ['wx','Погода',[[null,'Как сейчас'],['clear','Ясно'],['cloudy','Облачно'],['rain','Дождь'],['snow','Снег'],['storm','Гроза'],['fog','Туман']]],
    ['hol','Праздник',[[null,'По календарю'],['none','Без праздника'],...Object.keys(HOL).map(k=>[k,HOL[k].t])]]];
  function syncPanel(){document.querySelectorAll('#livePanel [data-k]').forEach(b=>b.setAttribute('aria-pressed',String(S.ov[b.dataset.k])===String(b.dataset.v==='null'?null:b.dataset.v)))}
  function init(){
    el('heroArt').innerHTML=build();placeClouds();
    el('livePanel').querySelector('.lp-rows').innerHTML=ROWS.map(([k,t,opts])=>`<div class="lp-row"><b>${t}</b><div>${opts.map(([v,l])=>`<button data-k="${k}" data-v="${v}">${l}</button>`).join('')}</div></div>`).join('');
    el('livePanel').addEventListener('click',e=>{const b=e.target.closest('[data-k]');if(!b)return;S.ov[b.dataset.k]=b.dataset.v==='null'?null:b.dataset.v;apply()});
    el('livePill').addEventListener('click',()=>{const p=el('livePanel');p.hidden=!p.hidden;el('livePill').setAttribute('aria-expanded',!p.hidden)});
    el('liveClose').addEventListener('click',()=>{el('livePanel').hidden=true;el('livePill').setAttribute('aria-expanded',false)});
    el('liveReset').addEventListener('click',()=>{S.ov={time:null,wx:null,hol:null};apply()});
    el('heroGo').addEventListener('click',()=>applyFilter(HERO.suggest,true));
    apply();fetchWeather();setInterval(apply,60000);setInterval(fetchWeather,15*60000);
    if(!reduce)requestAnimationFrame(frame)}
  return{init,suggest:{w:'in'}}})();
