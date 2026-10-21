  /* ---------- типы томской застройки ---------- */
  const PAL={
    woodGrey:['#6E5B4A','#7A6652','#5E5048','#83705C','#6A5A4E'],woodPaint:['#7FA6C2','#8DB59A','#D9B866','#C9925A','#A9BCC4','#B9A27A','#9DB8AE'],
    siding:['#E6DFC8','#D9D2BC','#C9D6C2','#E9DDB4','#D6DCE0','#E8D5C4','#CFC6B2'],
    brick:['#A0533A','#B0603F','#9A4A34','#A86448','#8E4632'],plaster:['#E8D7B0','#E6C77C','#E9B98F','#BFD8C0','#B9D0DE','#E4B9A8','#EEE8DC','#E7CFA0','#D9C3A0'],
    silicate:['#E2DED6','#DAD6CE','#E6E2DA','#CFCBC2'],redbrick:['#A65A40','#9E5440'],panel:['#D3CFC6','#DCD8CF','#C9C6BE','#E0DCD3','#CDD3D6'],
    panelNew:['#E6E2DA','#E3DCCF','#DDE2E6','#E8DDCC','#D9CFC2'],tower:['#D8CBB5','#B7795A','#E3E0DA','#C9B49A','#9FB0BC','#E6D2B0'],
    office:['#D9D4CA','#CFC8BC','#E3DDD0','#BFC6C9'],garage:['#9A958C','#A8A196','#8F8B84','#B3AA9C'],ind:['#C2BDB4','#B5B0A6','#A9AFA9','#C9BFAE'],church:['#F3EEE4','#EFE6D6']};
  const RPAL={tin:['#4E6B57','#7B3F30','#7D8384','#9AA0A2','#5E6A66','#6E5A4C','#3F5F6E'],tinNew:['#7B3F30','#4E6B57','#5A5F66','#8A3A2E','#3F5F6E'],bitumen:['#5F5F5C','#6A6A66','#575754'],flat:['#8C8A86','#9A9893','#7F7D79'],church:['#2F5E46','#3E6A52']};
  function pick(arr,i){return arr[Math.abs(Math.floor(Math.sin(i*12.9898+.7)*43758.5453))%arr.length]}
  function rnd(i,s){const v=Math.sin(i*91.17+s*17.3)*43758.5453;return v-Math.floor(v)}
  const CEN=[-430,560];
  function arche(b,area,ob){const d=Math.hypot(b.cx-CEN[0],b.cy-CEN[1]);const old=d<2300&&b.cy>-2700;const el=Math.max(ob.L,ob.S)/Math.max(1,Math.min(ob.L,ob.S));
    if(b.ty==='g'||b.ty==='r')return'garage';if(b.ty==='x')return'ruin';if(b.ty==='i')return'industrial';if(b.ty==='c')return'church';
    if(b.part)return b.h>=24?'panel9':'part';
    if(b.mat==='w')return old?'woodOld':'woodHouse';
    if(b.ty==='h')return b.h<=8.5?(old?'woodOld':'private'):'merchant';
    if(b.mat==='g'||b.mat==='m')return b.h>20?'tower':'mall';
    if(b.h>=40)return'tower';if(b.h>=23.5)return'panel9';
    if(b.ty==='a'){if(b.h>=11)return(el>2.1||!old||b.mat==='c')?'khrush':'stalin';return old?'merchant':'lowres'}
    if(b.ty==='u')return old&&b.h<=22?'publicOld':'public';
    if(b.ty==='o')return b.h<=14&&old?'merchant':'office';
    if(b.h<=7.5&&area<240)return old?'woodOld':'private';
    if(b.h<=14&&old)return'merchant';if(b.h<24)return area>1600?'office':'khrush';return'panel9'}
  // стили для шейдера: 1 цоколь, 2 швы панелей, 4 кирпич, 8 межэтажные пояса
  function look(b,t,area,ob){const i=b.i;const L={wall:null,roof:null,shape:b.roof,rh:b.rh,kind:1,st:1,cornice:0,balc:0,entr:0};
    switch(t){
      case'woodOld':L.wall=rnd(i,1)<.38?pick(PAL.woodPaint,i):pick(PAL.woodGrey,i);L.roof=pick(RPAL.tin,i);L.kind=3;L.st=1;L.cornice=.3;L.corniceCol='#EDE6D6';if(!L.shape)L.shape=rnd(i,2)<.55?'hipped':'gabled';if(L.rh==null)L.rh=Math.min(3.2,Math.min(ob.L,ob.S)*.38);break;
      case'woodHouse':L.wall=rnd(i,1)<.5?pick(PAL.woodPaint,i):pick(PAL.woodGrey,i);L.roof=pick(RPAL.tinNew,i);L.kind=3;if(!L.shape)L.shape='gabled';if(L.rh==null)L.rh=Math.min(3,Math.min(ob.L,ob.S)*.42);break;
      case'private':L.wall=rnd(i,1)<.3?pick(PAL.brick,i):pick(PAL.siding,i);L.roof=pick(RPAL.tinNew,i);L.kind=3;if(!L.shape)L.shape=rnd(i,2)<.6?'gabled':'hipped';if(L.rh==null)L.rh=Math.min(3.2,Math.min(ob.L,ob.S)*.42);break;
      case'merchant':{const br=b.mat==='b'||(b.mat!=='p'&&rnd(i,1)<.42);L.wall=br?pick(PAL.brick,i):pick(PAL.plaster,i);L.st=1+8+(br?4:0);L.kind=5;L.cornice=.45;L.corniceCol=br?'#B8705A':'#F4EFE4';L.roof=pick(RPAL.tin,i);if(!L.shape)L.shape=area<1400?'hipped':'flat';if(L.rh==null)L.rh=Math.min(2.6,Math.min(ob.L,ob.S)*.28);break}
      case'stalin':L.wall=pick(['#E7CFA0','#E3C9A8','#D9C3A0','#E8D7B0','#E6BFA0','#CFC6B8'],i);L.st=1+8;L.kind=5;L.cornice=.6;L.corniceCol='#F2EADA';L.roof=pick(RPAL.tin,i);if(!L.shape)L.shape=area<1800?'hipped':'flat';if(L.rh==null)L.rh=3;L.balc=.35;L.entr=1;break;
      case'khrush':{const br=b.mat==='b'||(b.mat!=='c'&&rnd(i,1)<.55);L.wall=br?(rnd(i,3)<.25?pick(PAL.redbrick,i):pick(PAL.silicate,i)):pick(PAL.panel,i);L.st=1+(br?4:2);L.kind=1;L.roof=pick(RPAL.bitumen,i);L.shape=b.roof||'flat';L.balc=.5;L.entr=1;break}
      case'panel9':L.wall=rnd(i,1)<.5?pick(PAL.panelNew,i):pick(PAL.panel,i);L.st=1+2;L.kind=1;L.roof=pick(RPAL.bitumen,i);L.shape='flat';L.balc=.55;L.entr=1;L.accent=rnd(i,4)<.45?pick(['#C9A07A','#9DB3C6','#B7795A','#A9B89A','#D3B07A'],i):null;break;
      case'tower':L.wall=pick(PAL.tower,i);L.st=1;L.kind=rnd(i,1)<.35?2:1;L.roof=pick(RPAL.bitumen,i);L.shape='flat';L.balc=.25;L.entr=1;L.accent=pick(['#B7795A','#7F8E9B','#C9A07A'],i);break;
      case'publicOld':{const br=b.mat==='b'||rnd(i,1)<.4;L.wall=br?pick(PAL.brick,i):pick(PAL.plaster,i);L.st=1+8+(br?4:0);L.kind=5;L.cornice=.55;L.corniceCol=br?'#B8705A':'#F4EFE4';L.roof=pick(RPAL.tin,i);if(!L.shape)L.shape=area<1600?'hipped':'flat';if(L.rh==null)L.rh=2.8;break}
      case'public':L.wall=pick(PAL.office.concat(PAL.silicate),i);L.st=1+2;L.kind=5;L.roof=pick(RPAL.bitumen,i);L.shape=b.roof||'flat';break;
      case'office':L.wall=pick(PAL.office,i);L.st=1;L.kind=rnd(i,1)<.3?2:1;L.roof=pick(RPAL.flat,i);L.shape=b.roof||'flat';break;
      case'mall':L.wall=pick(['#8FA9B8','#B9C2C6','#D9D4CA'],i);L.st=1;L.kind=2;L.roof=pick(RPAL.flat,i);L.shape='flat';break;
      case'lowres':L.wall=pick(PAL.plaster.concat(PAL.siding),i);L.kind=1;L.roof=pick(RPAL.tinNew,i);if(!L.shape)L.shape='hipped';if(L.rh==null)L.rh=2.4;break;
      case'garage':L.wall=pick(PAL.garage,i);L.st=0;L.kind=b.h<4.5?6:0;L.roof=pick(RPAL.bitumen,i);L.shape='flat';break;
      case'industrial':L.wall=pick(PAL.ind,i);L.st=1+2;L.kind=b.h>7?1:0;L.roof=pick(RPAL.flat,i);L.shape=b.roof||'flat';break;
      case'ruin':L.wall='#9A948A';L.kind=0;L.roof='#77736C';L.shape='flat';break;
      case'church':L.wall=pick(PAL.church,i);L.kind=4;L.st=1+8;L.roof=pick(RPAL.church,i);break;
      default:L.wall=pick(PAL.plaster,i);L.kind=b.h>14?1:5;L.roof=pick(RPAL.flat,i)}
    if(b.col)L.wall='#'+b.col;if(b.rcol)L.roof='#'+b.rcol;if(b.kind!=null)L.kind=b.kind;if(b.st!=null)L.st=b.st;if(b.cornice!=null)L.cornice=b.cornice;
    if(b.h<2.8)L.kind=0;return L}
  const C=h=>new THREE.Color(h).convertSRGBToLinear();
  function ringArr(r){const a=[];for(let k=0;k<r.length;k+=2)a.push([r[k],r[k+1]]);return a}
  function sArea(a){let s=0;for(let i=0;i<a.length;i++){const p=a[i],q=a[(i+1)%a.length];s+=p[0]*q[1]-q[0]*p[1]}return s/2}
  function obb(a){let best=null;for(let i=0;i<a.length;i++){const p=a[i],q=a[(i+1)%a.length];const ang=Math.atan2(q[1]-p[1],q[0]-p[0]);const c=Math.cos(ang),s=Math.sin(ang);let u0=1e9,u1=-1e9,v0=1e9,v1=-1e9;
      for(const [x,y] of a){const u=x*c+y*s,v=-x*s+y*c;if(u<u0)u0=u;if(u>u1)u1=u;if(v<v0)v0=v;if(v>v1)v1=v}const A=(u1-u0)*(v1-v0);if(!best||A<best.A)best={A,ang,c,s,u0,u1,v0,v1}}
    const b=best;b.L=b.u1-b.u0;b.S=b.v1-b.v0;const uc=(b.u0+b.u1)/2,vc=(b.v0+b.v1)/2;b.cx=uc*b.c-vc*b.s;b.cy=uc*b.s+vc*b.c;return b}
  function baseOf(a){let m=1e9;for(const [x,y] of a){const h=gH(x,y);if(h<m)m=h}let s=0;for(const [x,y] of a)s+=gH(x,y);return Math.min(m,s/a.length)}
  // коробка, выступающая из стены p→q наружу: от s0 до s1 вдоль ребра, глубина dep, высоты y0..y1
  function edgeBox(G,p,q,s0,s1,dep,y0,y1,col){const dx=q[0]-p[0],dy=q[1]-p[1],L=Math.hypot(dx,dy);const ux=dx/L,uy=dy/L,nx=uy,ny=-ux;
    const P=(s,d)=>[p[0]+ux*s+nx*d,p[1]+uy*s+ny*d];const a=P(s0,0),b=P(s1,0),c=P(s1,dep),d=P(s0,dep);const V=(xy,h)=>[xy[0],h,-xy[1]];
    const out=[nx,0,-ny],sideA=[-ux,0,uy],sideB=[ux,0,-uy];
    tri(G,V(d,y0),V(c,y0),V(c,y1),col,W0,W0,W0,out);tri(G,V(d,y0),V(c,y1),V(d,y1),col,W0,W0,W0,out);
    tri(G,V(a,y0),V(d,y0),V(d,y1),col,W0,W0,W0,sideA);tri(G,V(a,y0),V(d,y1),V(a,y1),col,W0,W0,W0,sideA);
    tri(G,V(c,y0),V(b,y0),V(b,y1),col,W0,W0,W0,sideB);tri(G,V(c,y0),V(b,y1),V(c,y1),col,W0,W0,W0,sideB);
    tri(G,V(a,y1),V(b,y1),V(c,y1),col,W0,W0,W0,[0,1,0]);tri(G,V(a,y1),V(c,y1),V(d,y1),col,W0,W0,W0,[0,1,0]);
    tri(G,V(a,y0),V(c,y0),V(b,y0),col,W0,W0,W0,[0,-1,0]);tri(G,V(a,y0),V(d,y0),V(c,y0),col,W0,W0,W0,[0,-1,0])}
  const EXTRA={tris:0};
  function addBuilding(G,b,base,XG){const outer=ringArr(b.rings[0]);if(outer.length<3)return;if(sArea(outer)<0)outer.reverse();
    const holes=b.rings.slice(1).map(ringArr).filter(r=>r.length>=3).map(r=>{if(sArea(r)>0)r.reverse();return r});
    const area=Math.abs(sArea(outer));const ob=obb(outer);const rectish=ob.A>0&&area/ob.A>.86;const t=arche(b,area,ob);const Lk=look(b,t,area,ob);b._t=t;
    let shape=Lk.shape;let rh=Lk.rh;
    if(!shape)shape='flat';
    if(['gabled','hipped','half-hipped','gambrel','mansard','saltbox'].includes(shape)&&!rectish)shape=b.h<10&&area<500?'pyramidal':'flat';
    if(shape==='skillion'||shape==='round')shape=shape==='round'?'dome':'flat';
    const sloped=shape!=='flat';if(rh==null||rh<0)rh=sloped?(shape==='dome'||shape==='onion'?Math.min(ob.S*.6,b.h*.5):shape==='pyramidal'||shape==='cone'||shape==='conical'?Math.min(ob.S*.55,6):Math.min(ob.S*.42,5.5)):0;
    // скатная крыша сверху стен: если высота известна только по этажам — добавляем крышу поверх
    let top=base+b.h;if(sloped&&b.rh==null&&!b.part&&['woodOld','woodHouse','private','merchant','stalin','publicOld','lowres'].includes(t))top+=rh*.6;
    const wt=sloped?Math.max(base+.6,top-rh):top;rh=top-wt;const bot=base+(b.mh||0)-(b.mh?0:1.5);
    const wc=C(Lk.wall),rc=C(Lk.roof),k=Lk.kind+10*(Lk.st||0),id=b.i;
    // стены
    const edges=[];
    for(const ring of [outer,...holes]){let u=0;for(let i=0;i<ring.length;i++){const p=ring[i],q=ring[(i+1)%ring.length];const L=Math.hypot(q[0]-p[0],q[1]-p[1]);if(L<.05)continue;
      const hint=[q[1]-p[1],0,q[0]-p[0]];const vb=bot-base,vt=wt-base;
      const A=[p[0],bot,-p[1]],B=[q[0],bot,-q[1]],Cc=[q[0],wt,-q[1]],D=[p[0],wt,-p[1]];
      tri(G,A,B,Cc,wc,[u,vb,k,id],[u+L,vb,k,id],[u+L,vt,k,id],hint);tri(G,A,Cc,D,wc,[u,vb,k,id],[u+L,vt,k,id],[u,vt,k,id],hint);if(ring===outer)edges.push({p,q,L,u});u+=L}}
    // детали фасада
    if(XG&&!b.part){
      if(Lk.cornice&&wt-base>2.5){const cc=C(Lk.corniceCol||'#EEE8DC');edges.forEach(e=>{if(e.L<1.5)return;edgeBox(XG,e.p,e.q,-.05,e.L+.05,Lk.cornice,wt-.5,wt,cc)})}
      const floors=Math.floor((wt-base)/3.05);
      if((Lk.balc||Lk.entr)&&floors>=3){const long=edges.filter(e=>e.L>12).sort((a,b)=>b.L-a.L);
        if(long.length>=2){// балконы на одной длинной стороне, подъезды на противоположной
          const e1=long[0];const d1=[(e1.q[0]-e1.p[0])/e1.L,(e1.q[1]-e1.p[1])/e1.L];const e2=long.find(e=>{const d=[(e.q[0]-e.p[0])/e.L,(e.q[1]-e.p[1])/e.L];return d[0]*d1[0]+d[1]*d1[1]<-.8})||long[1];
          const balCol=C(Lk.accent&&rnd(id,7)<.5?Lk.accent:Lk.wall).multiplyScalar(.92);const glaze=rnd(id,8)<.5;
          if(Lk.balc){for(let kk=Math.ceil(e1.u/3.3-.5);(kk+.5)*3.3-e1.u<e1.L-1.2;kk++){const s=(kk+.5)*3.3-e1.u;if(s<1.2)continue;if(rnd(id*7+kk,9)>Lk.balc)continue;
            for(let f=1;f<floors;f++){const y=base+f*3.1;edgeBox(XG,e1.p,e1.q,s-1.35,s+1.35,1.05,y-.15,y+(glaze?2.5:1.05),balCol)}}}
          if(Lk.entr){const n=Math.max(1,Math.round(e2.L/16));for(let j=0;j<n;j++){const s=(j+.5)*e2.L/n;edgeBox(XG,e2.p,e2.q,s-1.3,s+1.3,1.5,base+2.5,base+2.75,C('#8E8A84'));edgeBox(XG,e2.p,e2.q,s-.7,s+.7,.08,base,base+2.3,C('#3E3832'))}}}}
      if(Lk.accent&&t==='panel9'){const e=edges[0];if(e&&e.L>8)edgeBox(XG,e.p,e.q,e.L*.5-1.6,e.L*.5+1.6,.12,base+.5,wt-.3,C(Lk.accent))}
    }
    const up=[0,1,0];
    // крыша
    if(shape==='flat'){const v2=outer.map(p=>new THREE.Vector2(p[0],p[1]));const hv=holes.map(r=>r.map(p=>new THREE.Vector2(p[0],p[1])));let f;try{f=THREE.ShapeUtils.triangulateShape(v2,hv)}catch(e){f=[]}
      const all=outer.concat(...holes);f.forEach(tt=>tri(G,[all[tt[0]][0],wt,-all[tt[0]][1]],[all[tt[1]][0],wt,-all[tt[1]][1]],[all[tt[2]][0],wt,-all[tt[2]][1]],rc,W0,W0,W0,up));
      if(b.h>9&&area>150&&!b.part){for(let i=0;i<outer.length;i++){const p=outer[i],q=outer[(i+1)%outer.length];const hint=[q[1]-p[1],0,q[0]-p[0]];tri(G,[p[0],wt,-p[1]],[q[0],wt,-q[1]],[q[0],wt+.6,-q[1]],wc,W0,W0,W0,hint);tri(G,[p[0],wt,-p[1]],[q[0],wt+.6,-q[1]],[p[0],wt+.6,-p[1]],wc,W0,W0,W0,hint)}
        // будки выходов на крышу
        if(XG&&area>300&&(t==='khrush'||t==='panel9'||t==='tower')){const n=Math.max(1,Math.round(Math.max(ob.L,ob.S)/30));const long=ob.L>=ob.S;for(let j=0;j<n;j++){const u=(j+.5)/n-.5;const ax=long?[ob.c,ob.s]:[-ob.s,ob.c];const cx=ob.cx+ax[0]*u*Math.max(ob.L,ob.S)*.8,cy=ob.cy+ax[1]*u*Math.max(ob.L,ob.S)*.8;
          const q=[[cx-1.6,cy-1.2],[cx+1.6,cy-1.2]];edgeBox(XG,q[0],q[1],0,3.2,2.4,wt,wt+2.4,C('#8A8780'))}}}
      return}
    if(['gabled','hipped','half-hipped','gambrel','mansard','saltbox'].includes(shape)){const o=ob;const long=o.L>=o.S;
      const ax=long?[o.c,o.s]:[-o.s,o.c],ay=long?[-o.s,o.c]:[-o.c,-o.s];const ov=sloped&&!b.part?.45:0;const L=(long?o.L:o.S)/2+ov,S=(long?o.S:o.L)/2+ov;
      const P=(u,v)=>[o.cx+ax[0]*u+ay[0]*v,o.cy+ax[1]*u+ay[1]*v];const V=(xy,h)=>[xy[0],h,-xy[1]];const ew=wt-ov*.35;
      const c00=V(P(-L,-S),ew),c10=V(P(L,-S),ew),c11=V(P(L,S),ew),c01=V(P(-L,S),ew);const rt=wt+rh;
      const hip=shape==='hipped'||shape==='half-hipped'||shape==='mansard';const r=hip?Math.max(0,L-S):L-ov;const r0=V(P(-r,0),rt),r1=V(P(r,0),rt);
      tri(G,c00,c10,r1,rc,W0,W0,W0,[-ay[0],1,ay[1]]);tri(G,c00,r1,r0,rc,W0,W0,W0,[-ay[0],1,ay[1]]);
      tri(G,c11,c01,r0,rc,W0,W0,W0,[ay[0],1,-ay[1]]);tri(G,c11,r0,r1,rc,W0,W0,W0,[ay[0],1,-ay[1]]);
      // нижняя сторона свеса
      tri(G,c00,c10,c11,rc.clone().multiplyScalar(.6),W0,W0,W0,[0,-1,0]);tri(G,c00,c11,c01,rc.clone().multiplyScalar(.6),W0,W0,W0,[0,-1,0]);
      if(hip){tri(G,c10,c11,r1,rc,W0,W0,W0,[ax[0],1,-ax[1]]);tri(G,c01,c00,r0,rc,W0,W0,W0,[-ax[0],1,ax[1]])}
      else{const g0=V(P(L-ov,-S+ov),wt),g1=V(P(L-ov,S-ov),wt),g2=V(P(-L+ov,S-ov),wt),g3=V(P(-L+ov,-S+ov),wt),ra=V(P(L-ov,0),rt),rb=V(P(-L+ov,0),rt);
        const gw=(t==='woodOld'||t==='woodHouse'||t==='private')?C(Lk.wall):wc;tri(G,g0,g1,ra,gw,W0,W0,W0,[ax[0],0,-ax[1]]);tri(G,g2,g3,rb,gw,W0,W0,W0,[-ax[0],0,ax[1]]);
        tri(G,c10,c11,r1,rc,W0,W0,W0,[ax[0],.2,-ax[1]]);tri(G,c01,c00,r0,rc,W0,W0,W0,[-ax[0],.2,ax[1]])}
      return}
    let cx=0,cy=0;outer.forEach(p=>{cx+=p[0];cy+=p[1]});cx/=outer.length;cy/=outer.length;
    let prof;if(shape==='dome')prof=[[1,0],[.97,.25],[.87,.5],[.7,.72],[.45,.9],[0,1]];else if(shape==='onion')prof=[[1,0],[1.2,.18],[1.22,.34],[1.05,.5],[.72,.66],[.38,.82],[.12,.94],[0,1]];else prof=[[1,0],[0,1]];
    for(let s=0;s<prof.length-1;s++){const[a0,h0]=prof[s],[a1,h1]=prof[s+1];for(let i=0;i<outer.length;i++){const p=outer[i],q=outer[(i+1)%outer.length];
      const Pp=(pt,a,h)=>[cx+(pt[0]-cx)*a,wt+rh*h,-(cy+(pt[1]-cy)*a)];const hint=[(p[0]+q[0])/2-cx,.3,-((p[1]+q[1])/2-cy)];
      const A=Pp(p,a0,h0),B=Pp(q,a0,h0),Cc=Pp(q,a1,h1),D=Pp(p,a1,h1);tri(G,A,B,Cc,rc,W0,W0,W0,hint);if(a1>0)tri(G,A,Cc,D,rc,W0,W0,W0,hint)}}
    if((shape==='dome'||shape==='onion'||shape==='pyramidal'||shape==='cone')&&b.ty==='c'&&rh>1.5){LANDX.cross.push([cx,wt+rh,cy,Math.max(1.2,Math.min(3,rh*.45))])}
  }
  const LANDX={cross:[]};
