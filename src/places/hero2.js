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

  /* ================= СЦЕНА: улица деревянного Томска на фоне города =================
     Слои: 0 — дальний (левый берег Томи), 1 — средний (город на холме), 2 — ближний (деревянная улица).
     Цвет каждого элемента = базовый (data-c или сезонный data-s) → дымка для дальних слоёв → ночь/погода. */
  const VW=1600,VH=640;
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
    add(`<rect id="sSky" width="${VW}" height="${VH}"/><path id="sHz" d="M0 250Q400 228 800 246T1600 240V600H0Z"/>`);
    // звёзды-искорки
    let st='';for(let i=0;i<46;i++){const x=R()*VW,y=R()*240+8,k=R()*3.2+2.4,a=k*.28;st+=`<path class="st" d="M${f1(x)} ${f1(y-k)}L${f1(x+a)} ${f1(y-a)}L${f1(x+k)} ${f1(y)}L${f1(x+a)} ${f1(y+a)}L${f1(x)} ${f1(y+k)}L${f1(x-a)} ${f1(y+a)}L${f1(x-k)} ${f1(y)}L${f1(x-a)} ${f1(y-a)}Z" fill="#FFFDF5" style="animation-delay:${(R()*3).toFixed(2)}s"/>`}
    add(`<g id="sStars">${st}</g>`);
    add(`<g id="sSun"><circle r="120" fill="url(#gSun)" id="sSunGlow"/><path id="sRays" d="${Array.from({length:12},(_,i)=>{const a=i*Math.PI/6;return `M${f1(Math.cos(a)*60)} ${f1(Math.sin(a)*60)}L${f1(Math.cos(a)*78)} ${f1(Math.sin(a)*78)}`}).join('')}" ${sw(3.2)}/><circle r="48" id="sSunDisc" ${sw(3)}/><path d="M-22 -14q8 -14 26 -16" fill="none" stroke="#FFFDF5" stroke-width="5" stroke-linecap="round" opacity=".7"/></g>`);
    add(`<g id="sMoon"><circle r="36" id="sMoonDisc" ${sw(3)}/><circle cx="-11" cy="-9" r="7" fill="#000" opacity=".08" ${sw(1.6)}/><circle cx="12" cy="10" r="5" fill="#000" opacity=".08" ${sw(1.6)}/><circle cx="10" cy="-14" r="3" fill="#000" opacity=".08"/></g>`);
    let cl='';for(let i=0;i<8;i++)cl+=`<g class="cl" data-i="${i}"><path class="clb" d="M0 0a38 38 0 0 1 66 -26a50 50 0 0 1 92 14a34 34 0 0 1 12 64H6a30 30 0 0 1 -6 -52z" ${sw(3)}/><path d="M28 -10q16 -20 40 -12M100 -18q22 -6 36 10" fill="none" stroke="#FFFDF5" stroke-width="4" stroke-linecap="round" opacity=".55"/></g>`;
    add(`<g id="sClouds">${cl}</g>`);
    // ---- дальний план: левый берег, тайга, мост, Томь
    add(PS(curve(farY,0,VW,20,430),'farhill',0,1.6,'id="sFar"'));
    let fo='';for(let x=-6;x<VW;x+=13+R()*6){const y=farY(x)+4,h=12+R()*14;fo+=`M${f1(x-5)} ${f1(y)}L${f1(x)} ${f1(y-h)}L${f1(x+5)} ${f1(y)}Z`}
    add(PS(fo,'taiga',0,0));
    add(PS('M0 366Q300 358 700 370T1600 362V430H0Z','river',1,1.8,'id="sRiver"'));
    let br='M30 368H430';for(let x=40;x<=420;x+=48)br+=`M${x} 368V384`;add(P(`M24 362H436V369H24Z`,'#6B7480',0,1.4)+`<path d="${br}" ${sw(1.4)} fill="none"/>`);
    let sh='';for(let i=0;i<14;i++){const x=40+R()*1500,y=374+R()*18;sh+=`<path class="shim" d="M${f1(x)} ${f1(y)}h${f1(14+R()*30)}" stroke="#FFFDF5" stroke-width="2.4" stroke-linecap="round" style="animation-delay:${(R()*3).toFixed(2)}s"/>`}
    add(`<g id="sShim">${sh}</g>`);
    // ---- средний план: город на холме
    add(PS(curve(midY,0,VW,20,600),'midhill',1,2,'id="sMid"'));
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
    // деревья второго плана
    [[60,32],[340,24],[400,30],[530,22],[880,28],[930,22],[1210,26],[1400,30],[1520,24]].forEach(([x,h])=>add(R()<.5?pine(x,midY(x)+16,h*1.6,1):`<path d="M${x} ${f1(midY(x)+16)}V${f1(midY(x)-h*.4)}" ${sw(1.2)}/><circle class="crown" data-s="crown" data-i="${Math.floor(R()*6)}" data-l="1" cx="${x}" cy="${f1(midY(x)-h*.6)}" r="${f1(h*.55)}" ${sw(1.3)}/>`));
    // туман
    add(`<g id="sFog"><path d="M-20 330Q300 310 640 330T1620 320V362Q1200 376 800 360T-20 370Z" fill="#FFFDF5" opacity=".55"/><path d="M-20 392Q400 380 800 398T1620 390V420Q1200 430 800 418T-20 424Z" fill="#FFFDF5" opacity=".45"/></g>`);
    // ---- ближний план: тротуар и дорога
    add(PS('M0 506C300 500 700 512 1000 504S1400 502 1600 507V640H0Z','street',2,2.6,'id="sStreet"'));
    let pl='';for(let x=8;x<VW;x+=16)pl+=`M${x} ${f1(522+Math.sin(x/90)*2)}v14`;add(TEX(pl+'M0 520C400 514 900 526 1600 518M0 538C400 532 900 544 1600 536'));
    add(PS('M0 546C400 540 900 552 1600 545V640H0Z','road',2,2.6,'id="sRoad"'));
    add(TEX('M60 570C400 564 900 576 1560 568M120 596C500 590 1000 602 1520 594M40 620C450 614 950 626 1580 618'));
    // лужи после дождя
    add(`<g id="sPuddles">${[[260,572,70],[880,580,90],[1330,568,60]].map(([x,y,w])=>`<ellipse cx="${x}" cy="${y}" rx="${w}" ry="7" data-c="#7FA6C9" data-l="2" ${sw(2)}/><path d="M${x-w*.5} ${y-1}h${w*.4}" stroke="#FFFDF5" stroke-width="2" stroke-linecap="round"/>`).join('')}</g>`);
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
    add(fence(1476,1600,482,40,'#C69A6B'));
    add(birch(1560,524,280));
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
    add(`<g id="sDrifts">${[[60,520,90],[300,522,60],[600,520,70],[1000,522,60],[1260,520,80],[1500,520,110]].map(([x,y,w])=>`<path d="M${x-w/2} ${y+4}Q${x-w/4} ${y-14} ${x} ${y-8}Q${x+w/4} ${y-16} ${x+w/2} ${y+4}Z" fill="#FFFDF5" ${sw(2.2)}/>`).join('')}</g>`);
    add(`<g id="sCaps" fill="#FFFDF5" ${sw(2)}>${CAPS.join('')}</g>`);
    // клумбы летом
    let fl='';[[110,524],[180,526],[700,526],[1120,526],[1170,524],[1350,526]].forEach(([x,y])=>{for(let i=0;i<5;i++){const xx=x+i*9;fl+=`<path d="M${xx} ${y}v-10" ${sw(1.4)}/><circle cx="${xx}" cy="${y-12}" r="3.6" data-c="${['#FF5A8A','#FFD43B','#FFFDF5','#FF5A36'][i%4]}" data-l="2" ${sw(1.2)}/>`}});
    add(`<g id="sFlowers">${fl}</g>`);
    // дым
    add(`<g id="sSmoke">${SMOKE.map(([x,y],i)=>[0,1,2,3].map(k=>`<circle class="smk" data-x="${x}" data-y="${y}" data-k="${(i*4+k)/12}" cx="${x}" cy="${y}" r="7" fill="#D5DAE0"/>`).join('')).join('')}</g>`);
    // ночь: свечение фонарей поверх
    add(`<g id="sGlows">${GLOWS.join('')}</g>`);
    // ---- праздники
    let gar='';const tops=LAMPS.map(([x,y])=>[x,y-4]);tops.unshift([34,300]);tops.push([1560,320]);
    for(let i=0;i<tops.length-1;i++){const[a,ay]=tops[i],[b,by]=tops[i+1];const sag=46;gar+=`<path d="M${a} ${ay}Q${(a+b)/2} ${Math.max(ay,by)+sag} ${b} ${by}" fill="none" ${sw(1.6)}/>`;
      for(let k=1;k<9;k++){const t=k/9,x=(1-t)*(1-t)*a+2*(1-t)*t*(a+b)/2+t*t*b,y=(1-t)*(1-t)*ay+2*(1-t)*t*(Math.max(ay,by)+sag)+t*t*by;gar+=`<circle class="gb" data-p="${k%3}" cx="${f1(x)}" cy="${f1(y+6)}" r="5" fill="${['#FF5A36','#FFD43B','#3B2BD9'][k%3]}" ${sw(1.4)}/>`}}
    const tree=`<g transform="translate(1268 0)">${[0,1,2,3].map(i=>`<path d="M${-52+i*10} ${520-i*30}L0 ${450-i*30}L${52-i*10} ${520-i*30}Z" fill="#2E6B4E" ${sw(2.2)}/>`).join('')}${[[-24,500,'#FF5A36'],[20,492,'#FFD43B'],[-8,466,'#3B2BD9'],[14,440,'#FFC3D0'],[-12,420,'#FFD43B'],[6,396,'#FF5A36']].map(([x,y,c])=>`<circle class="gb" data-p="1" cx="${x}" cy="${y}" r="5.5" fill="${c}" ${sw(1.4)}/>`).join('')}<path d="M0 334l7 14h15l-12 9 5 15-15-9-15 9 5-15-12-9h15z" fill="#FFD43B" ${sw(1.8)}/></g>`;
    add(`<g id="dNy" class="deco">${gar}${tree}</g>`);
    const pumpkin=(x,y,s)=>`<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 -20v-10" ${sw(3)}/><ellipse rx="26" ry="19" fill="#FF8A1F" ${sw(2.4)}/><path d="M-9 -18q-5 18 0 36M9 -18q5 18 0 36" fill="none" ${sw(1.8)}/><path class="pf" d="M-14 -5l6 -7 6 7zM3 -5l6 -7 6 7zM-12 5q12 9 24 0l-5 5-3-3-4 4-3-3-4 3z" fill="#FFD43B" ${sw(1.4)}/></g>`;
    add(`<g id="dHw" class="deco">${pumpkin(900,512,1)}${pumpkin(1212,514,.8)}${pumpkin(330,514,.9)}${pumpkin(130,516,.7)}</g>`);
    const flag=(x,y,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0V-46" ${sw(2.4)}/><g class="fl"><path d="M0 -46h34v8H0z" fill="#FFFFFF" ${sw(1.6)}/><path d="M0 -38h34v8H0z" fill="#1C57A5" ${sw(1.6)}/><path d="M0 -30h34v8H0z" fill="#D52B1E" ${sw(1.6)}/></g></g>`;
    add(`<g id="dFlag" class="deco">${flag(1130,322)}${flag(380,410,.8)}${flag(1382,394,.8)}</g>`);
    let tu='';for(let i=0;i<30;i++){const x=40+i*52+(i%2)*14;const c=['#FF5A8A','#FFD43B','#FF5A36','#FFC3D0','#FFFDF5'][i%5];tu+=`<path d="M${x} 532v-22" ${sw(1.6)}/><path d="M${x-8} 512q0-15 8-17q8 2 8 17q-8 6-16 0z" fill="${c}" ${sw(1.6)}/>`}
    add(`<g id="dMar" class="deco">${tu}</g>`);
    let ca='';for(let i=0;i<22;i++){const x=60+i*70;ca+=`<path d="M${x} 532v-22" ${sw(1.6)}/><circle cx="${x}" cy="508" r="7" fill="#D52B1E" ${sw(1.6)}/>`}
    add(`<g id="dMay" class="deco">${ca}</g>`);
    const bal=(x,y)=>[[-26,-40,'#FF5A36'],[0,-58,'#FFD43B'],[24,-42,'#3B2BD9'],[-10,-80,'#C9F2D2'],[16,-86,'#FFC3D0']].map(([dx,dy,c],i)=>`<g class="bl" data-i="${i}"><path d="M${x} ${y}Q${x+dx*.4} ${y+dy*.5} ${x+dx} ${y+dy+20}" fill="none" ${sw(1.3)}/><ellipse class="blb" cx="${x+dx}" cy="${y+dy}" rx="15" ry="19" fill="${c}" ${sw(1.8)}/></g>`).join('');
    add(`<g id="dBal" class="deco">${bal(588,420)}${bal(1268,420)}</g>`);
    return `<svg viewBox="0 0 ${VW} ${VH}" preserveAspectRatio="xMidYMax slice" aria-hidden="true">${B.join('')}</svg>`}

  /* облака */
  const CL=[];
  function placeClouds(){document.querySelectorAll('#heroArt .cl').forEach((g,i)=>{CL[i]={x:R()*1900-260,y:22+R()*80,s:.5+R()*.42,v:5+R()*9}})}

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
    el('sSky').setAttribute('fill',sky);el('sHz').setAttribute('fill',hz);
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
    const sunVis=p>-.04&&p<1.04,sx=1420-p*1240,sy=340-Math.sin(Math.PI*Math.max(0,Math.min(1,p)))*250;
    el('sSun').setAttribute('transform',`translate(${sx.toFixed(0)} ${sy.toFixed(0)})`);el('sSun').style.opacity=sunVis?(c.wx==='clear'?1:c.wx==='cloudy'?.75:0):0;
    const low=p<.12||p>.85;el('sSunDisc').setAttribute('fill',low?'#FF9A3B':'#FFD43B');el('sSunGlow').style.opacity=low?1:.55;el('sRays').style.display=p>.1&&p<.9?'':'none';
    const q=((c.mins-c.st.set+1440)%1440)/(1440-dayLen);const mx=1420-q*1240,my=320-Math.sin(Math.PI*Math.min(1,q))*230;
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
    el('heroGoTxt').textContent=wxp[0];HERO.suggest=wxp[1];if(el('wxTxt'))el('wxTxt').textContent=wxp[0];
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
    Q('#heroArt .cl').forEach((g,i)=>{const c=CL[i];if(!c)return;c.x+=c.v*dt*(S.cur&&S.cur.wx==='storm'?3:1);if(c.x>1700)c.x=-260;g.setAttribute('transform',`translate(${c.x.toFixed(1)} ${(c.y+Math.sin(t*.6+i)*3).toFixed(1)}) scale(${c.s})`)});
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
    el('heroGo').addEventListener('click',()=>applyFilter(HERO.suggest,true));
    apply();fetchWeather();setInterval(apply,60000);setInterval(fetchWeather,15*60000);
    if(!reduce)requestAnimationFrame(frame);else staticFrame()}
  return{init,suggest:{w:'in'}}})();
