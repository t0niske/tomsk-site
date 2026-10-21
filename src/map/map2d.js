/* ================== 2D-КАРТА (Canvas, свои векторные стили) ================== */
const M2=(()=>{
  const cv=$('#c2d'),ctx=cv.getContext('2d');let W=0,H=0,dpr=1;
  const cam={x:-300,y:200,s:.32}; // s = пикселей на метр
  let paths=null,dark=false,selected=null,hoverB=null,needs=true;
  const PAL={
    light:{bg:'#EFEDE4',wood:'#C9DDBB',scrub:'#D6E4C6',grass:'#D8E8C6',park:'#C5E1B5',cemetery:'#CCD8C2',sport:'#DCE7C4',allot:'#E3E1C8',wetland:'#CFE2D6',sand:'#EFE3C2',parking:'#E6E2D8',square:'#F6F0E3',religious:'#EADFCB',water:'#A3CFE3',bridge:'#E8E2D6',pier:'#DCD4C4',
      bld:{h:'#E5CFB3',hw:'#DDB896',a:'#DAD3CB',u:'#E2D3C2',o:'#E1D9CE',c:'#EBCB93',g:'#E2DED7',i:'#D9D5CE',y:'#E0D7CB',r:'#E6E2DA',x:'#E3DED6',p:'#E2D6C6'},bldStroke:'#C8BBAA',
      road:{M:'#F7C98C',T:'#F7C98C',P:'#FBDDA8',S:'#FCEBC4',t:'#FFFFFF',r:'#FFFFFF',u:'#FFFFFF',l:'#FFFFFF',s:'#FBFAF6',p:'#F4EDE0',f:'#C9B99F',c:'#8FB8D0',x:'#C9B99F',k:'#C2B08E'},casing:'#D6CCBA',casingMain:'#D9A963',
      rail:'#9C948C',tram:'#A08070',label:'#4A4136',halo:'rgba(247,245,238,.92)',waterLabel:'#3A7EA6',parkLabel:'#3E7A4A'},
    dark:{bg:'#1A201C',wood:'#22362A',scrub:'#25362B',grass:'#25382A',park:'#264030',cemetery:'#26322A',sport:'#2A3A2C',allot:'#2C3328',wetland:'#22342E',sand:'#3A3628',parking:'#262A26',square:'#2E2E28',religious:'#33302A',water:'#1E3F52',bridge:'#3A3A34',pier:'#36352F',
      bld:{h:'#4A3E33',hw:'#55402F',a:'#3C3B3A',u:'#433D36',o:'#403C37',c:'#5A4A2E',g:'#373634',i:'#363532',y:'#3D3A35',r:'#3A3835',x:'#3A3835',p:'#433D36'},bldStroke:'#2A2622',
      road:{M:'#7A5A30',T:'#7A5A30',P:'#6E5634',S:'#5E513C',t:'#4A4842',r:'#45433E',u:'#45433E',l:'#45433E',s:'#3A3934',p:'#3D3A33',f:'#5A5246',c:'#3A5868',x:'#5A5246',k:'#4E4636'},casing:'#2A2824',casingMain:'#3A2E1E',
      rail:'#6E6A64',tram:'#7A6458',label:'#E6DED0',halo:'rgba(26,32,28,.9)',waterLabel:'#8FC3DE',parkLabel:'#8FC69A'}};
  const RW={M:22,T:20,P:17,S:14,t:11,r:8,u:8,l:7,s:4.5,p:7,f:1.8,c:2.2,x:2,k:3}; // ширина в метрах
  const RMIN={M:2.4,T:2.4,P:2.2,S:2,t:1.6,r:1.2,u:1.2,l:1,s:.6,p:1,f:.6,c:.6,x:.6,k:.6}; // мин. пикселей
  const RZ={s:.35,f:.9,c:.6,x:1.2,k:.4,p:.2,l:.15,r:.08,u:.08}; // с какого масштаба показывать

  function pathFromFlat(P,p,closed){P.moveTo(p[0],-p[1]);for(let k=2;k<p.length;k+=2)P.lineTo(p[k],-p[k+1]);if(closed)P.closePath()}
  const CS=600;
  function bbFlat(p,bb){for(let k=0;k<p.length;k+=2){const x=p[k],y=p[k+1];if(x<bb[0])bb[0]=x;if(y<bb[1])bb[1]=y;if(x>bb[2])bb[2]=x;if(y>bb[3])bb[3]=y}return bb}
  function build(){paths={areas:{},bld:{},cmap:{}};
    const cell=bb=>{const key=Math.floor((bb[0]+bb[2])/2/CS)+','+Math.floor((bb[1]+bb[3])/2/CS);let c=paths.cmap[key];if(!c)c=paths.cmap[key]={bb:[1e9,1e9,-1e9,-1e9],areas:{},roads:{},bridges:{},bld:{},rail:new Path2D(),tram:new Path2D(),stream:new Path2D()};
      c.bb[0]=Math.min(c.bb[0],bb[0]);c.bb[1]=Math.min(c.bb[1],bb[1]);c.bb[2]=Math.max(c.bb[2],bb[2]);c.bb[3]=Math.max(c.bb[3],bb[3]);return c};
    paths.areas.water=new Path2D();
    DATA.areas.forEach(a=>{const bb=bbFlat(a.rings[0],[1e9,1e9,-1e9,-1e9]);const c=cell(bb);const P=c.areas[a.k]||(c.areas[a.k]=new Path2D());a.rings.forEach(r=>pathFromFlat(P,r,true));if(a.k==='water')a.rings.forEach(r=>pathFromFlat(paths.areas.water,r,true))});
    DATA.roads.forEach(r=>{const c=cell(bbFlat(r.p,[1e9,1e9,-1e9,-1e9]));if(r.t==='R'){pathFromFlat(c.tram,r.p);return}if(r.t==='Q'){pathFromFlat(c.rail,r.p);return}if(r.t[0]==='w'){pathFromFlat(c.stream,r.p);return}
      const g=r.bridge?c.bridges:c.roads;const P=g[r.t]||(g[r.t]=new Path2D());pathFromFlat(P,r.p)});
    DATA.buildings.forEach(b=>{if(b.part)return;const key=b.ty==='h'||b.mat==='w'?(b.mat==='w'?'hw':'h'):b.ty;const c=cell(b.bb);const P=c.bld[key]||(c.bld[key]=new Path2D());b.rings.forEach(r=>pathFromFlat(P,r,true));
      const G=paths.bld[key]||(paths.bld[key]=new Path2D());b.rings.forEach(r=>pathFromFlat(G,r,true))});
    paths.cells=Object.values(paths.cmap);
    // подписи улиц: самый длинный отрезок каждого имени
    const byName={};DATA.roads.forEach(r=>{if(!r.name||!'MTPStrul p'.includes(r.t))return;(byName[r.name]=byName[r.name]||[]).push(r)});
    paths.streetLabels=Object.entries(byName).map(([n,rs])=>{const segs=[];rs.forEach(r=>{for(let k=0;k+3<r.p.length;k+=2){const dx=r.p[k+2]-r.p[k],dy=r.p[k+3]-r.p[k+1];const L=Math.hypot(dx,dy);if(L>25)segs.push({x:(r.p[k]+r.p[k+2])/2,y:(r.p[k+1]+r.p[k+3])/2,a:Math.atan2(-dy,dx),L,t:r.t})}});
      segs.sort((a,b)=>b.L-a.L);return{n,segs:segs.slice(0,8)}});
    // подписи площадей
    paths.areaLabels=DATA.areas.filter(a=>a.name&&['park','water','wood','grass','square','cemetery'].includes(a.k)).map(a=>{const r=a.rings[0];let sx=0,sy=0,n=0,minx=1e9,maxx=-1e9,miny=1e9,maxy=-1e9;for(let k=0;k<r.length;k+=2){sx+=r[k];sy+=r[k+1];n++;minx=Math.min(minx,r[k]);maxx=Math.max(maxx,r[k]);miny=Math.min(miny,r[k+1]);maxy=Math.max(maxy,r[k+1])}return{n:a.name,x:sx/n,y:sy/n,size:Math.min(maxx-minx,maxy-miny),k:a.k}})
      .filter((l,i,arr)=>arr.findIndex(o=>o.n===l.n)===i||l.size>400);
    // пространственный индекс зданий
    paths.grid={};DATA.buildings.forEach(b=>{if(b.part)return;const gx0=Math.floor(b.bb[0]/100),gx1=Math.floor(b.bb[2]/100),gy0=Math.floor(b.bb[1]/100),gy1=Math.floor(b.bb[3]/100);for(let gx=gx0;gx<=gx1;gx++)for(let gy=gy0;gy<=gy1;gy++){(paths.grid[gx+','+gy]=paths.grid[gx+','+gy]||[]).push(b)}});
  }
  function resize(){const r=cv.getBoundingClientRect();dpr=Math.min(devicePixelRatio,2);W=r.width;H=r.height;cv.width=W*dpr;cv.height=H*dpr;needs=true}
  const toScreen=(x,y)=>[(x-cam.x)*cam.s+W/2,-(y-cam.y)*cam.s+H/2];
  const toWorld=(sx,sy)=>[(sx-W/2)/cam.s+cam.x,-(sy-H/2)/cam.s+cam.y];
  function setT(){ctx.setTransform(dpr*cam.s,0,0,dpr*cam.s,dpr*(W/2-cam.x*cam.s),dpr*(H/2+cam.y*cam.s))}
  /* базовый слой (без зданий и подписей): используется и в 2D, и как текстура земли в 3D */
  function visCells(v){return paths.cells.filter(c=>c.bb[2]>=v[0]&&c.bb[0]<=v[2]&&c.bb[3]>=v[1]&&c.bb[1]<=v[3])}
  function drawBase(c,C,s,opt={}){const cells=visCells(opt.view||[-1e9,-1e9,1e9,1e9]);
    ['wood','scrub','grass','park','cemetery','allot','wetland','sand','sport','religious','parking','square','pier'].forEach(k=>{if(k==='parking'&&s<=.25)return;c.fillStyle=C[k];cells.forEach(cl=>{if(cl.areas[k])c.fill(cl.areas[k],'evenodd')})});
    if(!opt.noWater){c.fillStyle=C.water;cells.forEach(cl=>{if(cl.areas.water)c.fill(cl.areas.water,'evenodd')})}
    c.lineCap='round';c.lineJoin='round';
    c.strokeStyle=C.water;c.lineWidth=Math.max(1.2/s,3);cells.forEach(cl=>c.stroke(cl.stream));
    const order=['k','x','f','c','s','p','l','u','r','t','S','P','T','M'];
    const drawRoads=key=>{
      order.forEach(t=>{if(RZ[t]&&s<RZ[t])return;if(t==='f'||t==='x'||t==='k')return;const w=Math.max(RW[t],RMIN[t]/s);c.strokeStyle=['P','S','T','M'].includes(t)?C.casingMain:C.casing;c.lineWidth=w+Math.max(1.6/s,w*.18);cells.forEach(cl=>{if(cl[key][t])c.stroke(cl[key][t])})});
      order.forEach(t=>{if(RZ[t]&&s<RZ[t])return;const w=Math.max(RW[t],RMIN[t]/s);c.strokeStyle=C.road[t];c.lineWidth=w;
        if(t==='f'||t==='x'||t==='k')c.setLineDash([Math.max(2/s,1.5),Math.max(2/s,1.5)]);cells.forEach(cl=>{if(cl[key][t])c.stroke(cl[key][t])});c.setLineDash([])})};
    drawRoads('roads');
    c.strokeStyle=C.rail;c.lineWidth=Math.max(1.4/s,1.5);c.setLineDash([6/s,5/s]);cells.forEach(cl=>c.stroke(cl.rail));c.setLineDash([]);
    c.strokeStyle=C.tram;c.lineWidth=Math.max(1/s,.8);cells.forEach(cl=>c.stroke(cl.tram));
    if(s>.12)drawRoads('bridges');return cells}
  function draw(){needs=false;if(!paths)return;dark=document.documentElement.dataset.mapdark==='1';const C=dark?PAL.dark:PAL.light,s=cam.s;
    ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle=C.bg;ctx.fillRect(0,0,cv.width,cv.height);setT();
    const view=[cam.x-W/2/s,cam.y-H/2/s,cam.x+W/2/s,cam.y+H/2/s];const cells=drawBase(ctx,C,s,{view});
    // здания
    if(s>.07){const a=Math.min(1,(s-.07)/.1);ctx.globalAlpha=a;
      if(s>.6){ctx.save();ctx.translate(2.2/s,-2.2/s);ctx.fillStyle=dark?'rgba(0,0,0,.35)':'rgba(120,100,70,.18)';cells.forEach(cl=>{for(const k in cl.bld)ctx.fill(cl.bld[k],'evenodd')});ctx.restore()}
      cells.forEach(cl=>{for(const k in cl.bld){ctx.fillStyle=C.bld[k]||C.bld.y;ctx.fill(cl.bld[k],'evenodd')}});
      if(s>.9){ctx.strokeStyle=C.bldStroke;ctx.lineWidth=.8/s;cells.forEach(cl=>{for(const k in cl.bld)ctx.stroke(cl.bld[k])})}
      ctx.globalAlpha=1}
    if(hoverB||selected&&selected.type==='b'){const b=selected&&selected.type==='b'?selected.b:hoverB;const P=new Path2D();b.rings.forEach(r=>pathFromFlat(P,r,true));ctx.fillStyle='rgba(219,127,51,.55)';ctx.fill(P,'evenodd');ctx.strokeStyle='#DB7F33';ctx.lineWidth=2/s;ctx.stroke(P)}
    ctx.setTransform(dpr,0,0,dpr,0,0);
    drawLabels(C);drawPins(C)}
  const boxes=[];
  function free(x,y,w,h){for(const b of boxes)if(x<b[0]+b[2]&&x+w>b[0]&&y<b[1]+b[3]&&y+h>b[1])return false;boxes.push([x,y,w,h]);return true}
  function drawLabels(C){boxes.length=0;const s=cam.s;
    // пины резервируют место первыми
    ctx.textAlign='center';ctx.textBaseline='middle';
    if(s>.25){paths.areaLabels.forEach(l=>{if(l.size*s<70&&!(l.k==='water'&&l.size>500))return;const[x,y]=toScreen(l.x,l.y);if(x<-50||x>W+50||y<-20||y>H+20)return;
      ctx.font=`italic 600 ${l.k==='water'?13:12}px Manrope,sans-serif`;const w=ctx.measureText(l.n).width;if(!free(x-w/2,y-8,w,16))return;
      ctx.lineWidth=3;ctx.strokeStyle=C.halo;ctx.strokeText(l.n,x,y);ctx.fillStyle=l.k==='water'?C.waterLabel:C.parkLabel;ctx.fillText(l.n,x,y)})}
    if(s>.45){ctx.font='600 11.5px Manrope,sans-serif';
      paths.streetLabels.forEach(L=>{const txt=L.n;const w=ctx.measureText(txt).width;for(const g of L.segs){if(g.L*s<w+16)continue;const[x,y]=toScreen(g.x,g.y);if(x<0||x>W||y<0||y>H)continue;
        let a=g.a;if(a>Math.PI/2)a-=Math.PI;if(a<-Math.PI/2)a+=Math.PI;const bw=Math.abs(Math.cos(a))*w+12,bh=Math.abs(Math.sin(a))*w+12;if(!free(x-bw/2,y-bh/2,bw,bh))continue;
        ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.lineWidth=3;ctx.strokeStyle=C.halo;ctx.strokeText(txt,0,0);ctx.fillStyle=C.label;ctx.fillText(txt,0,0);ctx.restore();break}})}
    else if(s>.16){ctx.font='700 11px Manrope,sans-serif';paths.streetLabels.forEach(L=>{const g=L.segs[0];if(!g||!'MTP'.includes(g.t)||g.L*s<ctx.measureText(L.n).width+10)return;const[x,y]=toScreen(g.x,g.y);if(x<0||x>W||y<0||y>H)return;let a=g.a;if(a>Math.PI/2)a-=Math.PI;if(a<-Math.PI/2)a+=Math.PI;const w=ctx.measureText(L.n).width;if(!free(x-w/2,y-8,w,16))return;ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.lineWidth=3;ctx.strokeStyle=C.halo;ctx.strokeText(L.n,0,0);ctx.fillStyle=C.label;ctx.fillText(L.n,0,0);ctx.restore()})}
  }
  const iconCache={};function iconPath(k){return iconCache[k]||(iconCache[k]=new Path2D(IC[k]))}
  let pinHits=[];
  function visiblePOIs(){const s=cam.s;const f=APP.filter;return DATA.pois.filter(p=>{if(f.cats.size&&!f.cats.has(p.cat))return false;if(f.q&&!(p.t.name||'').toLowerCase().includes(f.q))return false;
      if(APP.mood!=='all'&&!(p.pick&&p.pick.moods.includes(APP.mood)))return false;
      if(!f.cats.size&&!f.q){if(p.pick)return s>=.12;if(s<.35&&!['culture','church','sight'].includes(p.cat))return false;if(s<.18)return false}return true}).sort((a,b)=>(b.pick?1:0)-(a.pick?1:0))}
  function drawPins(C){pinHits=[];const s=cam.s;
    // избранные места: крупные метки с подписью
    const cur=APP.curFiltered();
    cur.forEach(c=>{const[x,y]=toScreen(c.x,c.y);if(x<-40||x>W+40||y<-40||y>H+40)return;
      ctx.font='800 12.5px Manrope,sans-serif';const w=ctx.measureText(c.name).width;const bw=w+40,bh=30;const bx=x-bw/2,by=y-bh-8;
      if(!free(bx,by,bw,bh+8)&&!(selected&&selected.c===c))return;
      ctx.save();ctx.shadowColor='rgba(20,30,25,.25)';ctx.shadowBlur=10;ctx.shadowOffsetY=3;ctx.fillStyle=dark?'#1F2823':'#FFFFFF';roundRect(bx,by,bw,bh,15);ctx.fill();ctx.restore();
      ctx.beginPath();ctx.moveTo(x-6,by+bh-1);ctx.lineTo(x,by+bh+7);ctx.lineTo(x+6,by+bh-1);ctx.fillStyle=dark?'#1F2823':'#FFFFFF';ctx.fill();
      ctx.beginPath();ctx.arc(bx+15,by+15,11,0,6.283);ctx.fillStyle=c.col;ctx.fill();
      ctx.save();ctx.translate(bx+15-7,by+15-7);ctx.scale(14/24,14/24);ctx.strokeStyle='#fff';ctx.lineWidth=2.4;ctx.lineCap='round';ctx.lineJoin='round';ctx.stroke(iconPath(c.ic));ctx.restore();
      ctx.fillStyle=dark?'#EDE6DA':'#15221B';ctx.textAlign='left';ctx.fillText(c.name,bx+32,by+15.5);ctx.textAlign='center';
      if(selected&&selected.c===c){ctx.strokeStyle='#DB7F33';ctx.lineWidth=2.5;roundRect(bx-2,by-2,bw+4,bh+4,17);ctx.stroke()}
      pinHits.push({x:bx,y:by,w:bw,h:bh+8,c})});
    const R=s>.8?9:s>.4?7.5:6;
    visiblePOIs().forEach(p=>{const[x,y]=toScreen(p.x,p.y);if(x<-20||x>W+20||y<-20||y>H+20)return;const cat=PCAT[p.cat];
      if(!free(x-R,y-R,R*2,R*2)&&!(selected&&selected.p===p))return;
      if(p.pick){ctx.beginPath();ctx.arc(x,y,R+4.2,0,6.283);ctx.fillStyle='#E8B04A';ctx.fill()}
      ctx.beginPath();ctx.arc(x,y,R+1.6,0,6.283);ctx.fillStyle=dark?'#151A17':'#FFFFFF';ctx.fill();ctx.beginPath();ctx.arc(x,y,R,0,6.283);ctx.fillStyle=cat.c;ctx.fill();
      if(R>7){ctx.save();ctx.translate(x-R*.62,y-R*.62);ctx.scale(R*1.24/24,R*1.24/24);ctx.strokeStyle='#fff';ctx.lineWidth=2.6;ctx.lineCap='round';ctx.lineJoin='round';ctx.stroke(iconPath(cat.i));ctx.restore()}
      if((s>1.1||(p.pick&&s>.45))&&p.t.name){ctx.font='700 11px Manrope,sans-serif';const w=ctx.measureText(p.t.name).width;if(free(x+R+3,y-7,w+4,14)){ctx.textAlign='left';ctx.lineWidth=3;ctx.strokeStyle=C.halo;ctx.strokeText(p.t.name,x+R+4,y);ctx.fillStyle=dark?'#E6DED0':'#3A332B';ctx.fillText(p.t.name,x+R+4,y);ctx.textAlign='center'}}
      if(selected&&selected.p===p){ctx.beginPath();ctx.arc(x,y,R+5,0,6.283);ctx.strokeStyle='#DB7F33';ctx.lineWidth=2.5;ctx.stroke()}
      pinHits.push({x:x-R-3,y:y-R-3,w:R*2+6,h:R*2+6,p})});
  }
  function roundRect(x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()}
  function pip(x,y,r){let c=false;for(let i=0,j=r.length-2;i<r.length;j=i,i+=2){const xi=r[i],yi=r[i+1],xj=r[j],yj=r[j+1];if((yi>y)!=(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)c=!c}return c}
  function buildingAt(x,y){const L=paths.grid[Math.floor(x/100)+','+Math.floor(y/100)]||[];for(const b of L){if(x<b.bb[0]||x>b.bb[2]||y<b.bb[1]||y>b.bb[3])continue;if(pip(x,y,b.rings[0]))return b}return null}
  function pick(sx,sy){for(let i=pinHits.length-1;i>=0;i--){const h=pinHits[i];if(sx>=h.x&&sx<=h.x+h.w&&sy>=h.y&&sy<=h.y+h.h)return h.c?{type:'c',c:h.c}:{type:'p',p:h.p}}
    if(cam.s>.1){const[x,y]=toWorld(sx,sy);const b=buildingAt(x,y);if(b){const c=CUR.find(c=>c.b===b.i);return c?{type:'c',c}:{type:'b',b}}}return null}
  /* управление */
  let drag=null,pointers=new Map(),pinch=null,anim=null;
  function zoomAt(f,sx,sy){const[wx,wy]=toWorld(sx,sy);cam.s=Math.max(.05,Math.min(6,cam.s*f));const[nx,ny]=toWorld(sx,sy);cam.x+=wx-nx;cam.y+=wy-ny;clampCam();needs=true}
  function clampCam(){const e=DATA.ext;cam.x=Math.max(e[0],Math.min(e[2],cam.x));cam.y=Math.max(e[1],Math.min(e[3],cam.y))}
  cv.addEventListener('wheel',e=>{e.preventDefault();anim=null;zoomAt(Math.exp(-e.deltaY*.0018),e.offsetX,e.offsetY)},{passive:false});
  cv.addEventListener('pointerdown',e=>{cv.setPointerCapture(e.pointerId);pointers.set(e.pointerId,[e.offsetX,e.offsetY]);anim=null;
    if(pointers.size===1)drag={x:e.offsetX,y:e.offsetY,cx:cam.x,cy:cam.y,moved:0};else if(pointers.size===2){const[a,b]=[...pointers.values()];pinch={d:Math.hypot(a[0]-b[0],a[1]-b[1]),s:cam.s};drag=null}});
  cv.addEventListener('pointermove',e=>{if(!pointers.has(e.pointerId)){if(cam.s>.3&&paths){const[x,y]=toWorld(e.offsetX,e.offsetY);const b=buildingAt(x,y);if(b!==hoverB){hoverB=b;needs=true;cv.style.cursor=b?'pointer':''}}return}
    pointers.set(e.pointerId,[e.offsetX,e.offsetY]);
    if(pinch&&pointers.size===2){const[a,b]=[...pointers.values()];const d=Math.hypot(a[0]-b[0],a[1]-b[1]);const f=pinch.s*d/pinch.d/cam.s;zoomAt(f,(a[0]+b[0])/2,(a[1]+b[1])/2)}
    else if(drag){const dx=e.offsetX-drag.x,dy=e.offsetY-drag.y;drag.moved=Math.max(drag.moved,Math.hypot(dx,dy));cam.x=drag.cx-dx/cam.s;cam.y=drag.cy+dy/cam.s;clampCam();needs=true}});
  const up=e=>{pointers.delete(e.pointerId);if(pointers.size<2)pinch=null;if(drag&&drag.moved<5&&e.type==='pointerup'){const h=pick(e.offsetX,e.offsetY);APP.select(h)}if(!pointers.size)drag=null};
  cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
  cv.addEventListener('dblclick',e=>{flyTo(...toWorld(e.offsetX,e.offsetY),cam.s*2)});
  function flyTo(x,y,s,dur=900){const a={x0:cam.x,y0:cam.y,s0:cam.s,x,y,s:Math.max(.05,Math.min(6,s||cam.s)),t:0,dur};anim=a}
  let last=performance.now();
  function loop(now){const dt=Math.max(0,now-last);last=now;if(anim){anim.t+=dt;const k=Math.min(1,anim.t/anim.dur),e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;
      const ls=Math.log(anim.s0)+(Math.log(anim.s)-Math.log(anim.s0))*e;cam.s=Math.exp(ls);cam.x=anim.x0+(anim.x-anim.x0)*e;cam.y=anim.y0+(anim.y-anim.y0)*e;needs=true;if(k>=1)anim=null}
    if(needs&&APP.mode==='2d')draw();requestAnimationFrame(loop)}
  new ResizeObserver(resize).observe(cv);
  return{init(){build();resize();requestAnimationFrame(loop)},flyTo,cam,redraw(){needs=true},setSelected(s){selected=s;needs=true},zoom(f){zoomAt(f,W/2,H/2)},visiblePOIs,
    drawBase,PAL,get paths(){return paths},buildingAt:(x,y)=>buildingAt(x,y)}
})();
