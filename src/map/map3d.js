/* ================== 3D-ГОРОД: рельеф, здания OpenStreetMap, детальные модели ================== */
const M3=(()=>{
  const lay={};let inited=false,renderer,scene,camera,controls,hemi,sun,ground,water,cityLow,cityTall,cityMat,lampPts,treeGroup,landGroup,selLine,beams=[];
  const host=$('#v3d');const BASE=70;let WL=74;
  const U={night:{value:0},lit:{value:.55},season:{value:0}};
  /* ---------- рельеф ---------- */
  let EZ=null,EZ2=null,mask=null,MW=0,MH=0,MS=10;
  function smooth(E){const n=E.nx,m=E.ny,z=E.z;const o=new Float32Array(n*m);
    for(let j=0;j<m;j++)for(let i=0;i<n;i++){let s=0,w=0;for(let dj=-1;dj<=1;dj++)for(let di=-1;di<=1;di++){const ii=i+di,jj=j+dj;if(ii<0||jj<0||ii>=n||jj>=m)continue;const k=(di||dj)?1:2;s+=z[jj*n+ii]*k;w+=k}o[j*n+i]=s/w}return o}
  function prepElev(){EZ=smooth(DATA.elev);if(DATA.elev2)EZ2=smooth(DATA.elev2);
    const ext=DATA.ext;MW=Math.ceil((ext[2]-ext[0])/MS);MH=Math.ceil((ext[3]-ext[1])/MS);const cv=document.createElement('canvas');cv.width=MW;cv.height=MH;const c=cv.getContext('2d');
    c.setTransform(1/MS,0,0,1/MS,-ext[0]/MS,ext[3]/MS);c.fillStyle='#fff';c.fill(M2.paths.areas.water,'evenodd');
    const d=c.getImageData(0,0,MW,MH).data;mask=new Uint8Array(MW*MH);for(let i=0;i<MW*MH;i++)mask[i]=d[i*4+3]>100?1:0;
    const s=[];for(let k=0;k<20000&&s.length<6000;k++){const x=-1200+Math.random()*2400,y=-3000+Math.random()*6000;if(isWater(x,y))s.push(rawH(x,y))}
    s.sort((a,b)=>a-b);WL=s.length?s[Math.floor(s.length*.5)]:74}
  function bil(E,Z,x,y){let fx=(x-E.x0)/E.step,fy=(y-E.y0)/E.step;fx=Math.max(0,Math.min(E.nx-1.001,fx));fy=Math.max(0,Math.min(E.ny-1.001,fy));
    const ix=Math.floor(fx),iy=Math.floor(fy),tx=fx-ix,ty=fy-iy,n=E.nx;return(Z[iy*n+ix]*(1-tx)+Z[iy*n+ix+1]*tx)*(1-ty)+(Z[(iy+1)*n+ix]*(1-tx)+Z[(iy+1)*n+ix+1]*tx)*ty}
  function rawH(x,y){const E=DATA.elev;const h1=bil(E,EZ,x,y);if(!EZ2)return h1;const E2=DATA.elev2;
    const ex0=E.x0,ey0=E.y0,ex1=E.x0+(E.nx-1)*E.step,ey1=E.y0+(E.ny-1)*E.step;const d=Math.min(x-ex0,ex1-x,y-ey0,ey1-y);if(d<=0)return bil(E2,EZ2,x,y);if(d>=400)return h1;const t=d/400;return h1*t+bil(E2,EZ2,x,y)*(1-t)}
  function isWater(x,y){const ext=DATA.ext;const i=Math.floor((x-ext[0])/MS),j=Math.floor((ext[3]-y)/MS);if(i<0||j<0||i>=MW||j>=MH)return false;return mask[j*MW+i]===1}
  function gH(x,y){let h=rawH(x,y);if(isWater(x,y))h=Math.min(h,WL-2.5);else{
      let near=false;for(let a=0;a<6&&!near;a++){const t=a*1.047;if(isWater(x+Math.cos(t)*14,y+Math.sin(t)*14))near=true}if(near)h=Math.min(h,Math.max(WL+.6,h-1.2))}
    return h-BASE}
  /* ---------- текстура земли: общая + детальная, которая следует за камерой ---------- */
  const TREE_IN=[-1300,-3200,1500,3000];let INNER=[-1300,-1300,1300,1300];let innerTex=null,groundSh=null,innerSize=2048,lastPaint=null;
  function month(){return new Date(Date.now()+7*3600e3).getUTCMonth()+1}
  function groundPalette(){const m=month();const P=JSON.parse(JSON.stringify(M2.PAL.light));P.bg='#CFCDB4';
    if(m>=11||m<=3){Object.assign(P,{bg:'#EEF1F4',wood:'#D7DED9',scrub:'#E4E9E8',grass:'#F3F5F7',park:'#E9EEEE',cemetery:'#E6EAEA',sport:'#F0F2F4',allot:'#ECEFF0',wetland:'#E2E8EA',sand:'#ECEDEA',square:'#E7E6E2',parking:'#DEDDD9'});P.road=Object.assign(P.road,{t:'#C9C6C0',r:'#D4D1CB',u:'#D4D1CB',l:'#D8D5D0',s:'#DCD9D4',P:'#BDB6AC',S:'#C4BEB4',f:'#B8B4AC'});P.casing='#B9B4AC';P.casingMain='#ACA59A'}
    else if(m>=9){Object.assign(P,{bg:'#CBC6A6',grass:'#BFC992',park:'#B4C386',wood:'#A3AE74',scrub:'#B8BA84',square:'#E6DFCE'})}
    else if(m<=5){Object.assign(P,{bg:'#D9DBC0',grass:'#CFE0B0',park:'#C3DBA6'})}
    return P}
  function paintCanvas(cv,x0,y0,x1,y1,inner){const W=cv.width,H=cv.height;const c=cv.getContext('2d');const C=groundPalette();c.setTransform(1,0,0,1,0,0);
    c.fillStyle=C.bg;c.fillRect(0,0,W,H);const kx=W/(x1-x0),ky=H/(y1-y0);c.setTransform(kx,0,0,ky,-x0*kx,y1*ky);
    const cells=M2.drawBase(c,C,inner?Math.min(kx,1.1):kx,{view:[x0,y0,x1,y1]});
    if(inner){c.save();try{c.filter='blur(3px)'}catch(e){}c.fillStyle='rgba(70,60,45,.32)';cells.forEach(cl=>{for(const k in cl.bld)c.fill(cl.bld[k],'evenodd')});c.restore()}}
  function mkTex(cv){const t=new THREE.CanvasTexture(cv);t.encoding=THREE.sRGBEncoding;t.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());t.generateMipmaps=true;t.minFilter=THREE.LinearMipmapLinearFilter;return t}
  function paintTex(x0,y0,x1,y1,W,H,inner){const cv=document.createElement('canvas');cv.width=W;cv.height=H;paintCanvas(cv,x0,y0,x1,y1,inner);return mkTex(cv)}
  function setInnerUV(){if(!groundSh)return;const ext=DATA.ext;groundSh.uniforms.uInMin.value.set((INNER[0]-ext[0])/(ext[2]-ext[0]),(INNER[1]-ext[1])/(ext[3]-ext[1]));groundSh.uniforms.uInMax.value.set((INNER[2]-ext[0])/(ext[2]-ext[0]),(INNER[3]-ext[1])/(ext[3]-ext[1]))}
  function repaintInner(cx,cy){const half=window.__LITE?1100:1300;INNER=[cx-half,cy-half,cx+half,cy+half];paintCanvas(innerTex.image,INNER[0],INNER[1],INNER[2],INNER[3],true);innerTex.needsUpdate=true;setInnerUV();lastPaint=[cx,cy]}
  function buildGround(){const ext=DATA.ext;const step=DATA.elev2?40:25;const nx=Math.ceil((ext[2]-ext[0])/step)+1,ny=Math.ceil((ext[3]-ext[1])/step)+1;
    const pos=new Float32Array(nx*ny*3),uv=new Float32Array(nx*ny*2);
    for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){const x=Math.min(ext[2],ext[0]+i*step),y=Math.min(ext[3],ext[1]+j*step);const k=j*nx+i;pos[k*3]=x;pos[k*3+1]=gH(x,y);pos[k*3+2]=-y;uv[k*2]=(x-ext[0])/(ext[2]-ext[0]);uv[k*2+1]=(y-ext[1])/(ext[3]-ext[1])}
    const idx=new Uint32Array((nx-1)*(ny-1)*6);let p=0;for(let j=0;j<ny-1;j++)for(let i=0;i<nx-1;i++){const a=j*nx+i,b=a+1,c=a+nx,d=c+1;idx[p++]=a;idx[p++]=b;idx[p++]=d;idx[p++]=a;idx[p++]=d;idx[p++]=c}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setAttribute('uv',new THREE.BufferAttribute(uv,2));g.setIndex(new THREE.BufferAttribute(idx,1));g.computeVertexNormals();
    const big=renderer.capabilities.maxTextureSize>=8192&&!window.__LITE;
    const outer=paintTex(ext[0],ext[1],ext[2],ext[3],2048,2048,false);
    innerSize=2048;const icv=document.createElement('canvas');icv.width=icv.height=innerSize;innerTex=mkTex(icv);
    const m=new THREE.MeshStandardMaterial({map:outer,roughness:.95,metalness:0});
    m.onBeforeCompile=sh=>{groundSh=sh;sh.uniforms.uInner={value:innerTex};sh.uniforms.uInMin={value:new THREE.Vector2()};sh.uniforms.uInMax={value:new THREE.Vector2()};setInnerUV();
      sh.fragmentShader=sh.fragmentShader.replace('#include <map_pars_fragment>','#include <map_pars_fragment>\nuniform sampler2D uInner;uniform vec2 uInMin;uniform vec2 uInMax;')
        .replace('#include <map_fragment>',`vec2 iuv=(vUv-uInMin)/(uInMax-uInMin);vec4 texelColor;
          if(iuv.x>0.0&&iuv.x<1.0&&iuv.y>0.0&&iuv.y<1.0){texelColor=texture2D(uInner,iuv);vec4 o=texture2D(map,vUv);float e=min(min(iuv.x,1.0-iuv.x),min(iuv.y,1.0-iuv.y));texelColor=mix(o,texelColor,smoothstep(0.0,0.06,e));}else texelColor=texture2D(map,vUv);
          texelColor=mapTexelToLinear(texelColor);diffuseColor*=texelColor;`)};
    const c0=M2.cam;repaintInner(c0.x,c0.y);
    ground=new THREE.Mesh(g,m);ground.receiveShadow=true;scene.add(ground);
    // вода
    const wm=new THREE.MeshStandardMaterial({color:new THREE.Color('#7FAFC8').convertSRGBToLinear(),roughness:.18,metalness:.15,transparent:true,opacity:.94});
    const wg=[];DATA.areas.filter(a=>a.k==='water').forEach(a=>{const toV=r=>{const v=[];for(let k=0;k<r.length;k+=2)v.push(new THREE.Vector2(r[k],r[k+1]));return v};
      const outerR=toV(a.rings[0]);if(outerR.length<3)return;const holes=a.rings.slice(1).map(toV);let faces;try{faces=THREE.ShapeUtils.triangulateShape(outerR,holes)}catch(e){return}
      const all=outerR.concat(...holes);faces.forEach(f=>f.forEach(i=>wg.push(all[i].x,WL-BASE-.3,-all[i].y)))});
    const wgeo=new THREE.BufferGeometry();wgeo.setAttribute('position',new THREE.Float32BufferAttribute(wg,3));wgeo.computeVertexNormals();
    // нормали вверх
    const nrm=wgeo.attributes.normal;for(let i=0;i<nrm.count;i++)nrm.setXYZ(i,0,1,0);
    water=new THREE.Mesh(wgeo,wm);water.material.side=THREE.DoubleSide;water.receiveShadow=true;scene.add(water)}

  /* ---------- здания ---------- */
  const LMSKIP=new Set();
  function geoAcc(){return{p:[],n:[],c:[],w:[]}}
  const _v1=new THREE.Vector3(),_v2=new THREE.Vector3(),_n=new THREE.Vector3();
  function tri(G,a,b,c,col,wa,wb,wc,hint){_v1.set(b[0]-a[0],b[1]-a[1],b[2]-a[2]);_v2.set(c[0]-a[0],c[1]-a[1],c[2]-a[2]);_n.crossVectors(_v1,_v2);
    if(hint&&_n.x*hint[0]+_n.y*hint[1]+_n.z*hint[2]<0){const t=b;b=c;c=t;const tw=wb;wb=wc;wc=tw;_n.negate()}
    _n.normalize();for(const [v,w] of [[a,wa],[b,wb],[c,wc]]){G.p.push(v[0],v[1],v[2]);G.n.push(_n.x,_n.y,_n.z);G.c.push(col.r,col.g,col.b);G.w.push(w[0],w[1],w[2],w[3])}}
  const W0=[0,0,0,0];
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
  const CEN=[-430,560];const LOWDEV=matchMedia('(max-width:760px)').matches||(navigator.hardwareConcurrency||8)<=4;
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
  function edgeBox(G,p,q,s0,s1,dep,y0,y1,col,lite){const dx=q[0]-p[0],dy=q[1]-p[1],L=Math.hypot(dx,dy);const ux=dx/L,uy=dy/L,nx=uy,ny=-ux;
    const P=(s,d)=>[p[0]+ux*s+nx*d,p[1]+uy*s+ny*d];const a=P(s0,0),b=P(s1,0),c=P(s1,dep),d=P(s0,dep);const V=(xy,h)=>[xy[0],h,-xy[1]];
    const out=[nx,0,-ny],sideA=[-ux,0,uy],sideB=[ux,0,-uy];
    tri(G,V(d,y0),V(c,y0),V(c,y1),col,W0,W0,W0,out);tri(G,V(d,y0),V(c,y1),V(d,y1),col,W0,W0,W0,out);
    if(!lite){tri(G,V(a,y0),V(d,y0),V(d,y1),col,W0,W0,W0,sideA);tri(G,V(a,y0),V(d,y1),V(a,y1),col,W0,W0,W0,sideA);
    tri(G,V(c,y0),V(b,y0),V(b,y1),col,W0,W0,W0,sideB);tri(G,V(c,y0),V(b,y1),V(c,y1),col,W0,W0,W0,sideB);}
    tri(G,V(a,y1),V(b,y1),V(c,y1),col,W0,W0,W0,[0,1,0]);tri(G,V(a,y1),V(c,y1),V(d,y1),col,W0,W0,W0,[0,1,0]);
    if(lite!==2){tri(G,V(a,y0),V(c,y0),V(b,y0),col,W0,W0,W0,[0,-1,0]);tri(G,V(a,y0),V(d,y0),V(c,y0),col,W0,W0,W0,[0,-1,0])}}
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
    const wc=C(Lk.wall),rc=C(Lk.roof).lerp(C('#8A8A86'),b.rcol?.3:.18),k=Lk.kind+10*(Lk.st||0),id=b.i;
    // стены
    const edges=[];
    for(const ring of [outer,...holes]){let u=0;for(let i=0;i<ring.length;i++){const p=ring[i],q=ring[(i+1)%ring.length];const L=Math.hypot(q[0]-p[0],q[1]-p[1]);if(L<.05)continue;
      const hint=[q[1]-p[1],0,q[0]-p[0]];const vb=bot-base,vt=wt-base;
      const A=[p[0],bot,-p[1]],B=[q[0],bot,-q[1]],Cc=[q[0],wt,-q[1]],D=[p[0],wt,-p[1]];
      tri(G,A,B,Cc,wc,[u,vb,k,id],[u+L,vb,k,id],[u+L,vt,k,id],hint);tri(G,A,Cc,D,wc,[u,vb,k,id],[u+L,vt,k,id],[u,vt,k,id],hint);if(ring===outer)edges.push({p,q,L,u});u+=L}}
    // детали фасада
    if(XG&&!b.part&&(!LOWDEV||Math.hypot(b.cx-CEN[0],b.cy-CEN[1])<1500)){
      if(Lk.cornice&&wt-base>2.5&&Math.hypot(b.cx-CEN[0],b.cy-CEN[1])<2600){const cc=C(Lk.corniceCol||'#EEE8DC');edges.forEach(e=>{if(e.L<3)return;edgeBox(XG,e.p,e.q,-.05,e.L+.05,Lk.cornice,wt-.5,wt,cc,1)})}
      const floors=Math.floor((wt-base)/3.05);
      if((Lk.balc||Lk.entr)&&floors>=3){const long=edges.filter(e=>e.L>12).sort((a,b)=>b.L-a.L);
        if(long.length>=2){// балконы на одной длинной стороне, подъезды на противоположной
          const e1=long[0];const d1=[(e1.q[0]-e1.p[0])/e1.L,(e1.q[1]-e1.p[1])/e1.L];const e2=long.find(e=>{const d=[(e.q[0]-e.p[0])/e.L,(e.q[1]-e.p[1])/e.L];return d[0]*d1[0]+d[1]*d1[1]<-.8})||long[1];
          const balCol=C(Lk.accent&&rnd(id,7)<.5?Lk.accent:Lk.wall).multiplyScalar(.92);const glaze=rnd(id,8)<.5;
          if(Lk.balc){for(let kk=Math.ceil(e1.u/3.3-.5);(kk+.5)*3.3-e1.u<e1.L-1.2;kk++){const s=(kk+.5)*3.3-e1.u;if(s<1.2)continue;if(rnd(id*7+kk,9)>Lk.balc)continue;
            for(let f=1;f<floors;f++){const y=base+f*3.1;edgeBox(XG,e1.p,e1.q,s-1.35,s+1.35,1.05,y-.15,y+(glaze?2.5:1.05),balCol,0)}}}
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

  function toMesh(G,mat){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(G.p,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(G.n,3));
    g.setAttribute('color',new THREE.Float32BufferAttribute(G.c,3));g.setAttribute('aw',new THREE.Float32BufferAttribute(G.w,4));g.computeBoundingSphere();const m=new THREE.Mesh(g,mat);m.castShadow=true;m.receiveShadow=true;return m}
  function cityMaterial(){const m=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.85,metalness:0,flatShading:false});
    m.onBeforeCompile=sh=>{sh.uniforms.uNight=U.night;sh.uniforms.uLit=U.lit;
      sh.vertexShader=sh.vertexShader.replace('#include <common>','#include <common>\nattribute vec4 aw;varying vec4 vAw;').replace('#include <begin_vertex>','#include <begin_vertex>\nvAw=aw;');
      sh.fragmentShader=sh.fragmentShader.replace('#include <common>',`#include <common>
        varying vec4 vAw;uniform float uNight;uniform float uLit;float wmask;float wlit;
        float h31(vec3 p){p=fract(p*0.3183099+.1);p*=17.0;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}`)
        .replace('#include <color_fragment>',`#include <color_fragment>
        wmask=0.0;wlit=0.0;float kz=floor(vAw.z+0.5);float kind=mod(kz,10.0);float st=floor(kz/10.0+0.01);
        float dist=length(vViewPosition);
        if(kz>0.5){
          if(mod(st,2.0)>0.5&&vAw.y<0.95)diffuseColor.rgb*=0.6;
          float near=1.0-smoothstep(60.0,260.0,dist);
          if(mod(floor(st/2.0),2.0)>0.5){float ln=step(fract(vAw.y/2.85),0.03)+step(fract(vAw.x/3.3),0.018);diffuseColor.rgb*=1.0-0.12*clamp(ln,0.0,1.0)*(1.0-smoothstep(120.0,500.0,dist));}
          if(mod(floor(st/4.0),2.0)>0.5){vec2 bc=floor(vec2(vAw.x/0.26+mod(floor(vAw.y/0.077),2.0)*0.5,vAw.y/0.077));float hb=fract(sin(dot(bc,vec2(12.9898,78.233)))*43758.5453);float mort=step(fract(vAw.y/0.077),0.14);diffuseColor.rgb*=mix(1.0,(0.9+0.18*hb)*(1.0-0.25*mort),near);}
          if(mod(floor(st/8.0),2.0)>0.5&&vAw.y>2.0){float fb=step(fract((vAw.y-0.3)/3.6),0.06);diffuseColor.rgb=mix(diffuseColor.rgb,vec3(0.93,0.9,0.84),fb*0.55);}
          if(kind>5.5&&kind<6.5){float door=step(0.08,fract(vAw.x/3.1))*step(fract(vAw.x/3.1),0.92)*step(vAw.y,2.3);diffuseColor.rgb=mix(diffuseColor.rgb,vec3(0.32,0.31,0.3),door*0.7);}
        }
        if(kind>0.5&&kind<5.5){float sx=kind<1.5?3.3:kind<2.5?2.0:kind<3.5?2.7:kind<4.5?4.2:3.9;float sy=kind<2.5?3.1:kind<3.5?3.0:kind<4.5?5.2:4.6;
          vec2 g=vec2(vAw.x/sx,vAw.y/sy);vec2 f=fract(g);vec2 cl=floor(g);
          float ww=kind<1.5?0.44:kind<2.5?0.86:kind<3.5?0.34:kind<4.5?0.3:0.38;float wh=kind<2.5?0.46:kind<3.5?0.5:kind<4.5?0.62:0.56;float y0=kind<3.5?0.34:kind<4.5?0.2:0.26;
          float inside=step(0.5-ww*0.5,f.x)*step(f.x,0.5+ww*0.5)*step(y0,f.y)*step(f.y,y0+wh)*step(1.0,vAw.y);
          float fade=1.0-smoothstep(260.0,900.0,dist);wmask=inside*fade;
          vec3 glass=kind<2.5?vec3(0.07,0.1,0.13):vec3(0.06,0.06,0.07);
          if(kind>2.5&&kind<3.5){float fr=step(0.5-ww*0.5-0.08,f.x)*step(f.x,0.5+ww*0.5+0.08)*step(y0-0.08,f.y)*step(f.y,y0+wh+0.1)*(1.0-inside)*fade;diffuseColor.rgb=mix(diffuseColor.rgb,vec3(0.92,0.9,0.86),fr*0.9);}
          diffuseColor.rgb=mix(diffuseColor.rgb,glass,wmask*0.88);
          wlit=wmask*step(h31(vec3(cl,vAw.w*0.0137)),uLit);}`)
        .replace('#include <emissivemap_fragment>',`#include <emissivemap_fragment>
        totalEmissiveRadiance+=wlit*uNight*vec3(1.0,0.72,0.38)*1.6;`)
        .replace('#include <roughnessmap_fragment>','#include <roughnessmap_fragment>\nroughnessFactor=mix(roughnessFactor,0.25,wmask);')};
    return m}
  function inheritParts(){DATA.buildings.forEach(b=>{if(!b.part)return;const par=M2.buildingAt(b.cx,b.cy);if(!par)return;if(b.ty==='p')b.ty=par.ty;if(b.mat==='-')b.mat=par.mat;if(!b.col&&par.col)b.col=par.col;if(b.kind==null&&par.kind!=null)b.kind=par.kind;if(b.st==null&&par.st!=null)b.st=par.st;b._parent=par.i})}
  const CHUNK=600;let chunks=[],treeCells=[];
  // город строится по кварталам: сначала то, что рядом с камерой, остальное — понемногу в свободное время кадра;
  // дальние кварталы выгружаются из памяти видеокарты
  let dm2=null,goldMat=null,streamEl=null;
  function buildCity(){inheritParts();const t0=performance.now();const acc={};
    DATA.buildings.forEach(b=>{if(b.hasParts||LMSKIP.has(b.i)||(b.part&&LMSKIP.has(b._parent)))return;if(!b.rings[0]||b.rings[0].length<6)return;
      const kx=Math.floor(b.cx/CHUNK),ky=Math.floor(b.cy/CHUNK),key=kx+','+ky;(acc[key]||(acc[key]={cx:(kx+.5)*CHUNK,cy:(ky+.5)*CHUNK,list:[]})).list.push(b)});
    cityMat=cityMaterial();dm2=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.85});
    goldMat=new THREE.MeshStandardMaterial({color:C('#E2B44A'),metalness:.8,roughness:.3,emissive:C('#3A2A00')});
    cityLow=new THREE.Group();cityTall=new THREE.Group();scene.add(cityLow,cityTall);
    Object.values(acc).forEach(A=>chunks.push({cx:A.cx,cy:A.cy,list:A.list,built:false,meshes:[],det:[]}));
    console.log('город: кварталов',chunks.length,'разметка',((performance.now()-t0)|0)+' мс')}
  function buildChunk(ch){const G=geoAcc(),GX=geoAcc();const c0=LANDX.cross.length;
    ch.list.forEach(b=>{try{const outer=ringArr(b.rings[0]);if(outer.length<3)return;const base=b.part?(b._pbase??baseOf(outer)):baseOf(outer);addBuilding(G,b,base,GX)}catch(e){}});
    if(G.p.length){const m=toMesh(G,cityMat);m.userData.city=1;cityLow.add(m);ch.meshes.push(m)}
    if(GX.p.length){const m=toMesh(GX,dm2);m.userData.detail=1;cityLow.add(m);ch.det.push(m)}
    const cr=LANDX.cross.splice(c0);if(cr.length){const cg=new THREE.Group();cr.forEach(([x,y,yy,s])=>{const v=new THREE.Mesh(new THREE.BoxGeometry(.18*s,1.6*s,.18*s),goldMat);v.position.set(x,y+.8*s,-yy);const h=new THREE.Mesh(new THREE.BoxGeometry(.9*s,.16*s,.16*s),goldMat);h.position.set(x,y+1.1*s,-yy);cg.add(v,h)});
      cityLow.add(cg);mergeGroup(cg);cg.children.forEach(m=>{m.userData.detail=1});ch.meshes.push(cg)}
    ch.built=true}
  function dropChunk(ch){[...ch.meshes,...ch.det].forEach(m=>{cityLow.remove(m);m.traverse(o=>{if(o.geometry)o.geometry.dispose()})});ch.meshes=[];ch.det=[];ch.built=false}
  // строим ближние кварталы, пока не исчерпан бюджет времени кадра
  function streamCity(tx,ty,lim,budget){const t0=performance.now();let todo=0,done=0;
    const want=chunks.filter(ch=>!ch.built&&Math.hypot(ch.cx-tx,ch.cy-ty)<lim).sort((a,b)=>Math.hypot(a.cx-tx,a.cy-ty)-Math.hypot(b.cx-tx,b.cy-ty));
    for(const ch of want){if(performance.now()-t0>budget&&done>0){todo++;continue}buildChunk(ch);done++}
    chunks.forEach(ch=>{if(ch.built&&Math.hypot(ch.cx-tx,ch.cy-ty)>lim*1.35+CHUNK)dropChunk(ch)});
    if(!streamEl){streamEl=document.createElement('div');streamEl.className='stream';host.appendChild(streamEl)}
    streamEl.textContent='Достраиваем город · ещё '+todo+' '+plural(todo,['квартал','квартала','кварталов']);streamEl.classList.toggle('on',todo>0);return done}

  /* ---------- деревья и фонари ---------- */
  function pipA(x,y,a){let c=false;for(let i=0,j=a.length-2;i<a.length;j=i,i+=2){const xi=a[i],yi=a[i+1],xj=a[j],yj=a[j+1];if((yi>y)!=(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)c=!c}return c}
  function buildTrees(){const m=month();const pts=[];const R=Math.random;
    DATA.areas.forEach(a=>{const dens={wood:1/110,park:1/170,scrub:1/260,cemetery:1/150,grass:1/1400}[a.k];if(!dens)return;const r=a.rings[0];let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;for(let k=0;k<r.length;k+=2){x0=Math.min(x0,r[k]);x1=Math.max(x1,r[k]);y0=Math.min(y0,r[k+1]);y1=Math.max(y1,r[k+1])}
      const inner=x1>TREE_IN[0]&&x0<TREE_IN[2]&&y1>TREE_IN[1]&&y0<TREE_IN[3];let n=Math.floor((x1-x0)*(y1-y0)*dens*(inner?.8:.07));n=Math.min(n,inner?4000:500);
      for(let i=0;i<n;i++){const x=x0+R()*(x1-x0),y=y0+R()*(y1-y0);if(!pipA(x,y,r))continue;let hole=false;for(let h=1;h<a.rings.length;h++)if(pipA(x,y,a.rings[h])){hole=true;break}if(hole||isWater(x,y))continue;if(M2.buildingAt(x,y))continue;
        pts.push([x,y,a.k==='wood'&&R()<(inner?.22:.6)?1:0])}});
    // аллеи вдоль главных улиц в центре
    DATA.roads.forEach(rd=>{if(!'PSt'.includes(rd.t)||rd.bridge)return;const p=rd.p;for(let k=0;k+3<p.length;k+=2){const dx=p[k+2]-p[k],dy=p[k+3]-p[k+1],L=Math.hypot(dx,dy);const nx=-dy/L,ny=dx/L;for(let s=6;s<L;s+=14){const t=s/L;for(const side of[-1,1]){const off=({P:13,S:11,t:9})[rd.t];const x=p[k]+dx*t+nx*off*side,y=p[k+1]+dy*t+ny*off*side;
        if(x<TREE_IN[0]||x>TREE_IN[2]||y<TREE_IN[1]||y>TREE_IN[3])continue;if(R()<.45||isWater(x,y)||M2.buildingAt(x,y))continue;pts.push([x,y,0])}}}});
    const lmc=CUR.map(c=>[c.x,c.y]);for(let i=pts.length-1;i>=0;i--){const p=pts[i];if(lmc.some(([x,y])=>Math.abs(p[0]-x)<34&&Math.abs(p[1]-y)<34))pts.splice(i,1)}
    if(pts.length>14000){for(let i=pts.length-1;i>0;i--){const j=Math.floor(R()*(i+1));[pts[i],pts[j]]=[pts[j],pts[i]]}pts.length=14000}
    const dec=pts.filter(p=>!p[2]),con=pts.filter(p=>p[2]);
    const leaf=m>=11||m<=3?['#B9BFB6','#C8CCC4','#A9B0A6']:m>=9?['#E2B13C','#D9922E','#C9A23A','#B9B14A','#8FA54A','#E8C55A','#C46E2A']:m<=5?['#9CC46A','#86B85E','#A9CF78']:['#5E8F4E','#4E7F45','#6E9A55','#557F48'];
    treeGroup=new THREE.Group();const dm=new THREE.Object3D();
    const crown=new THREE.IcosahedronGeometry(1,0);crown.translate(0,.9,0);const trunk=new THREE.CylinderGeometry(.18,.28,1,5);trunk.translate(0,.5,0);
    const cm=new THREE.MeshStandardMaterial({flatShading:true,roughness:.9}),tm=new THREE.MeshStandardMaterial({color:C('#5A4636'),roughness:1});
    const TC=2000,cells={};const cell=p=>{const k=Math.floor(p[0]/TC)+','+Math.floor(p[1]/TC);return cells[k]||(cells[k]={d:[],c:[],cx:(Math.floor(p[0]/TC)+.5)*TC,cy:(Math.floor(p[1]/TC)+.5)*TC})};
    dec.forEach(p=>cell(p).d.push(p));con.forEach(p=>cell(p).c.push(p));
    const cone=new THREE.ConeGeometry(1,1,6);cone.translate(0,.5,0);const pcm=new THREE.MeshStandardMaterial({flatShading:true,roughness:.9});
    Object.values(cells).forEach(T=>{const ms=[];
      if(T.d.length){const ic=new THREE.InstancedMesh(crown,cm,T.d.length),it=new THREE.InstancedMesh(trunk,tm,T.d.length);
        T.d.forEach((p,i)=>{const s=.8+R()*.6,h=gH(p[0],p[1]);const bare=(m>=11||m<=3)?.75:1;dm.position.set(p[0],h+2.4*s,-p[1]);dm.rotation.set(R()*.3,R()*6,0);dm.scale.set(2.5*s*bare,3.0*s*bare,2.5*s*bare);dm.updateMatrix();ic.setMatrixAt(i,dm.matrix);ic.setColorAt(i,C(leaf[Math.floor(R()*leaf.length)]));
          dm.position.set(p[0],h,-p[1]);dm.rotation.set(0,0,0);dm.scale.set(s,3*s,s);dm.updateMatrix();it.setMatrixAt(i,dm.matrix)});ms.push(ic,it)}
      if(T.c.length){const pc=new THREE.InstancedMesh(cone,pcm,T.c.length);
        T.c.forEach((p,i)=>{const s=.8+R()*.6,h=gH(p[0],p[1]);dm.position.set(p[0],h+1.5,-p[1]);dm.rotation.set(0,R()*6,0);dm.scale.set(2.6*s,11*s,2.6*s);dm.updateMatrix();pc.setMatrixAt(i,dm.matrix);pc.setColorAt(i,C(m>=11||m<=3?(R()<.5?'#3E5A4A':'#E8EEF0'):(R()<.5?'#2F5A3E':'#3B6B48')))});ms.push(pc)}
      ms.forEach(x=>{x.frustumCulled=false;x.castShadow=false;x.receiveShadow=false;if(x.instanceColor)x.instanceColor.needsUpdate=true;treeGroup.add(x)});
      treeCells.push({cx:T.cx,cy:T.cy,meshes:ms,sph:new THREE.Sphere(new THREE.Vector3(T.cx,gH(T.cx,T.cy),-T.cy),TC*.8)})});
    scene.add(treeGroup);
    // фонари
    const lp=[];DATA.roads.forEach(rd=>{if(!'PStru'.includes(rd.t))return;const p=rd.p;let acc=0;for(let k=0;k+3<p.length;k+=2){const L=Math.hypot(p[k+2]-p[k],p[k+3]-p[k+1]);for(let s=(30-acc%30);s<L;s+=30){const t=s/L;const x=p[k]+(p[k+2]-p[k])*t,y=p[k+1]+(p[k+3]-p[k+1])*t;if(isWater(x,y))continue;lp.push(x,(rd.bridge?Math.max(gH(x,y),WL-BASE+8):gH(x,y))+6,-y)}acc+=L}});
    const tex=(()=>{const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');const g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,240,210,1)');g.addColorStop(.25,'rgba(255,200,120,.75)');g.addColorStop(1,'rgba(255,170,80,0)');x.fillStyle=g;x.fillRect(0,0,64,64);return new THREE.CanvasTexture(c)})();
    const lg=new THREE.BufferGeometry();lg.setAttribute('position',new THREE.Float32BufferAttribute(lp,3));
    lampPts=new THREE.Points(lg,new THREE.PointsMaterial({size:9,map:tex,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,opacity:0,color:0xFFD9A0}));scene.add(lampPts)}

  /* ---------- мосты ---------- */
  function buildBridges(){const G=geoAcc();const col=C('#B8B2A6'),side=C('#8E8880');
    DATA.roads.forEach(rd=>{if(!rd.bridge||!'MTPStrul'.includes(rd.t))return;const p=rd.p;const n=p.length/2;const w=({M:22,T:20,P:17,S:14,t:11,r:8,u:8,l:7})[rd.t]||8;
      const h0=gH(p[0],p[1]),h1=gH(p[p.length-2],p[p.length-1]);let tot=0;const seg=[0];for(let k=0;k+3<p.length;k+=2){tot+=Math.hypot(p[k+2]-p[k],p[k+3]-p[k+1]);seg.push(tot)}
      const deckH=(i)=>{const t=seg[i]/(tot||1);return Math.max(h0+(h1-h0)*t,WL-BASE+7)+.4};
      for(let i=0;i<n-1;i++){const x0=p[i*2],y0=p[i*2+1],x1=p[i*2+2],y1=p[i*2+3];const L=Math.hypot(x1-x0,y1-y0);if(L<.1)continue;const nx=-(y1-y0)/L*w/2,ny=(x1-x0)/L*w/2;const a=deckH(i),b=deckH(i+1);
        const A=[x0+nx,a,-(y0+ny)],B=[x1+nx,b,-(y1+ny)],Cc=[x1-nx,b,-(y1-ny)],D=[x0-nx,a,-(y0-ny)];tri(G,A,B,Cc,col,W0,W0,W0,[0,1,0]);tri(G,A,Cc,D,col,W0,W0,W0,[0,1,0]);
        const A2=[A[0],a-1.6,A[2]],B2=[B[0],b-1.6,B[2]],C2=[Cc[0],b-1.6,Cc[2]],D2=[D[0],a-1.6,D[2]];
        tri(G,A,B,B2,side,W0,W0,W0,[nx,0,-ny]);tri(G,A,B2,A2,side,W0,W0,W0,[nx,0,-ny]);tri(G,D,Cc,C2,side,W0,W0,W0,[-nx,0,ny]);tri(G,D,C2,D2,side,W0,W0,W0,[-nx,0,ny]);
        if(isWater((x0+x1)/2,(y0+y1)/2)&&i%2===0){const px=(x0+x1)/2,py=(y0+y1)/2;const pb=WL-BASE-3,pt=(a+b)/2-1.6;for(const s of[-1,1]){const cx=px+nx*s*.6,cy=py+ny*s*.6;const q=[[cx-1,cy-1],[cx+1,cy-1],[cx+1,cy+1],[cx-1,cy+1]];for(let e=0;e<4;e++){const u=q[e],v=q[(e+1)%4];tri(G,[u[0],pb,-u[1]],[v[0],pb,-v[1]],[v[0],pt,-v[1]],side,W0,W0,W0,[v[1]-u[1],0,v[0]-u[0]]);tri(G,[u[0],pb,-u[1]],[v[0],pt,-v[1]],[u[0],pt,-u[1]],side,W0,W0,W0,[v[1]-u[1],0,v[0]-u[0]])}}}}});
    const m=toMesh(G,new THREE.MeshStandardMaterial({vertexColors:true,roughness:.9}));scene.add(m)}

  /* ---------- небо, свет, время ---------- */
  function sunPos(date){const rad=Math.PI/180,lat=56.4977*rad,lw=-84.9744*rad;const d=date.valueOf()/864e5-.5+2440588-2451545;const M=rad*(357.5291+.98560028*d);const Cc=rad*(1.9148*Math.sin(M)+.02*Math.sin(2*M)+.0003*Math.sin(3*M));const L=M+Cc+rad*102.9372+Math.PI;
    const e=rad*23.4397;const dec=Math.asin(Math.sin(e)*Math.sin(L)),ra=Math.atan2(Math.sin(L)*Math.cos(e),Math.cos(L));const th=rad*(280.16+360.9856235*d)-lw;const H=th-ra;
    const alt=Math.asin(Math.sin(lat)*Math.sin(dec)+Math.cos(lat)*Math.cos(dec)*Math.cos(H));const az=Math.atan2(Math.sin(H),Math.cos(H)*Math.sin(lat)-Math.tan(dec)*Math.cos(lat));return{alt,az}} // az от юга, по часовой к западу
  const SKY={night:{top:'#0B1230',bot:'#25305A',fog:'#1B2444',hs:'#3A4A78',hg:'#141820',hi:.32,sc:'#8FA6E8',si:.32},
    twi:{top:'#2D3A72',bot:'#E3A58C',fog:'#9C8EA6',hs:'#B8A8C8',hg:'#4A4050',hi:.55,sc:'#FF9A6A',si:.7},
    gold:{top:'#7E9CCF',bot:'#F7C79A',fog:'#EBC6A6',hs:'#F2D8C2',hg:'#6A5A4A',hi:.58,sc:'#FFB070',si:1.6},
    day:{top:'#5E9BD6',bot:'#CFE3EF',fog:'#C9DCE6',hs:'#DDE8F5',hg:'#7A7458',hi:.62,sc:'#FFF2DE',si:1.75}};
  const THEMES={lace:{top:'#D98E7A',bot:'#F8D3A8',fog:'#F0C49E',hs:'#FFD9B8',hg:'#6B4A3A',hi:.6,sc:'#FFB070',si:1.6,p:'leaves',frame:'lace'},
    dragon:{top:'#6F6AAE',bot:'#EFB592',fog:'#D3A6A4',hs:'#E8C0D8',hg:'#4A3A50',hi:.52,sc:'#FF9A6A',si:1.4,p:'leaves',frame:'lace'},
    green:{top:'#8FCBA3',bot:'#EAF4D8',fog:'#D7EACB',hs:'#F0FFE8',hg:'#4A6A40',hi:.68,sc:'#FFF4D6',si:1.6,p:'pollen',frame:'green'},
    vintage:{top:'#C9B48E',bot:'#F1E6CF',fog:'#E6D7B8',hs:'#FFF0D6',hg:'#7A6040',hi:.65,sc:'#FFE0B0',si:1.5,p:'dust',frame:'vintage',filter:'sepia(.6) saturate(.85)'},
    gallery:{top:'#DDD5C6',bot:'#F8F4EC',fog:'#EFE9DD',hs:'#FFFAF0',hg:'#8A7A60',hi:.68,sc:'#FFF0D8',si:1.5,p:'dust',frame:'gallery'},
    neon:{top:'#0B061C',bot:'#2A1040',fog:'#1E0F36',hs:'#5A3A8A',hg:'#08040F',hi:.42,sc:'#C08AFF',si:.5,p:'sparks',frame:'neon',night:1,beams:1},
    sunset:{top:'#E2857A',bot:'#FCD49E',fog:'#F4BE94',hs:'#FFD0A8',hg:'#4A3A50',hi:.55,sc:'#FF7A3A',si:1.7,p:'sparkle',frame:'sunset',sunset:1},
    dusk:{top:'#5E70AE',bot:'#F2B694',fog:'#C8A8B0',hs:'#C8C8F0',hg:'#3A3A50',hi:.52,sc:'#FF9466',si:1.5,p:'sparkle',frame:'sunset',sunset:1}};
  const cur={},tgt={};const KC=['top','bot','fog','hs','hg','sc'],KN=['hi','si','night','beams'];
  function toT(o,night){const r={};KC.forEach(k=>r[k]=new THREE.Color(o[k]));r.hi=o.hi;r.si=o.si;r.night=night!=null?night:(o.night||0);r.beams=o.beams||0;return r}
  function mixSky(a,b,t){const r={};KC.forEach(k=>r[k]=mixHex(a[k],b[k],t));['hi','si'].forEach(k=>r[k]=a[k]+(b[k]-a[k])*t);return r}
  function mixHex(a,b,t){const A=new THREE.Color(a),B=new THREE.Color(b);return '#'+A.lerp(B,t).getHexString()}
  let timeMode='now',sunDir=new THREE.Vector3(.3,.8,.4),theme=null;
  function tomskDateFor(mode){const now=new Date();if(mode==='now')return now;const st=sunMinutes(now);const mins={dawn:st.rise+25,day:13*60,eve:st.set-20,night:23*60+20}[mode];
    const t=new Date(Date.now()+7*3600e3);t.setUTCHours(0,0,0,0);return new Date(t.getTime()-7*3600e3+mins*6e4)}
  function updateSky(){const d=tomskDateFor(timeMode);let{alt,az}=sunPos(d);const deg=alt*180/Math.PI;
    let s;if(deg<-7)s=SKY.night;else if(deg<0)s=mixSky(SKY.night,SKY.twi,(deg+7)/7);else if(deg<7)s=mixSky(SKY.twi,SKY.gold,deg/7);else if(deg<20)s=mixSky(SKY.gold,SKY.day,(deg-7)/13);else s=SKY.day;
    const night=deg<-4?1:deg<3?1-(deg+4)/7:0;
    // направление солнца (az от юга по часовой к западу): юг = -y = +Z
    const a=Math.max(alt,deg<0?.25:alt);sunDir.set(-Math.sin(az)*Math.cos(a),Math.sin(a),Math.cos(az)*Math.cos(a)).normalize();
    if(deg<0){sunDir.set(-Math.sin(az+Math.PI)*.6,.75,Math.cos(az+Math.PI)*.6).normalize()} // луна
    Object.assign(tgt,toT(theme?THEMES[theme]:s,theme&&THEMES[theme].night?1:night));
    if(theme&&THEMES[theme].sunset){const st=sunMinutes(new Date());/* закат: солнце на западе-юго-западе низко */sunDir.set(-0.85,.16,.25).normalize()}
    return{deg,d}}
  /* ---------- частицы погружения ---------- */
  const N=500;let pts=null,pType=null,pCen=new THREE.Vector3();const pPos=new Float32Array(N*3),pVel=new Float32Array(N*3),pPh=new Float32Array(N);
  const PCOL={leaves:['#E3A03C','#D9772B','#E8C55A','#B5551D'],pollen:['#F4F0A0','#CFE88A','#FFFFFF'],dust:['#F1DDB0','#E8CC98'],sparks:['#FF4FD8','#4FD8FF','#FFD84A'],sparkle:['#FFE2B0','#FFF4DC','#FFC890']};
  function spawn(i,first){const c=pCen,R=Math.random;let x,y,z;switch(pType){case'leaves':x=c.x+(R()-.5)*90;z=c.z+(R()-.5)*90;y=c.y+(first?R()*45:45);pVel[i*3+1]=-(1.5+R()*1.5);break;
      case'pollen':case'dust':x=c.x+(R()-.5)*70;z=c.z+(R()-.5)*70;y=c.y+R()*25;break;case'sparks':x=c.x+(R()-.5)*40;z=c.z+(R()-.5)*40;y=c.y+(first?R()*60:5);pVel[i*3+1]=6+R()*8;break;
      case'sparkle':x=c.x+(R()-.5)*260;z=c.z+(R()-.5)*260;y=WL-BASE+.1;break}pPos.set([x,y,z],i*3);pPh[i]=R()*6.28}
  function setParticles(type,center){if(!pts){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pPos,3));g.setAttribute('color',new THREE.BufferAttribute(new Float32Array(N*3),3));
      const tex=lampPts.material.map;pts=new THREE.Points(g,new THREE.PointsMaterial({size:1.6,map:tex,vertexColors:true,transparent:true,depthWrite:false,opacity:0}));pts.frustumCulled=false;scene.add(pts)}
    pType=type;if(!type)return;pCen.copy(center);const col=pts.geometry.attributes.color;for(let i=0;i<N;i++){spawn(i,true);const c=new THREE.Color(PCOL[type][i%PCOL[type].length]);col.setXYZ(i,c.r,c.g,c.b)}col.needsUpdate=true;
    pts.material.size={leaves:1.8,pollen:.8,dust:.7,sparks:1.2,sparkle:3}[type];pts.material.blending=type==='sparks'||type==='sparkle'?THREE.AdditiveBlending:THREE.NormalBlending;pts.material.needsUpdate=true}
  function stepParticles(dt,t){if(!pts)return;pts.material.opacity+=((pType?.95:0)-pts.material.opacity)*Math.min(1,dt*2);if(!pType)return;
    for(let i=0;i<N;i++){const k=i*3;let x=pPos[k],y=pPos[k+1],z=pPos[k+2];const ph=pPh[i];
      switch(pType){case'leaves':x+=(1+Math.sin(t*1.7+ph)*1.5)*dt;z+=Math.cos(t*1.3+ph)*1.2*dt;y+=pVel[k+1]*dt;if(y<pCen.y-2){spawn(i);continue}break;
        case'pollen':case'dust':x+=Math.sin(t*.6+ph)*.8*dt;y+=Math.cos(t*.5+ph)*.5*dt;z+=Math.cos(t*.7+ph)*.8*dt;break;case'sparks':y+=pVel[k+1]*dt;if(y>pCen.y+70){spawn(i);continue}break;
        case'sparkle':y=WL-BASE+.1+Math.max(0,Math.sin(t*3+ph*3))*.4;break}pPos[k]=x;pPos[k+1]=y;pPos[k+2]=z}
    pts.geometry.attributes.position.needsUpdate=true}

  /* ---------- детальные модели ---------- */
  const MAT={};function mat(hex,o){const k=hex+JSON.stringify(o||{});return MAT[k]||(MAT[k]=new THREE.MeshStandardMaterial(Object.assign({color:C(hex),roughness:.82,flatShading:true},o||{})))}
  function box(g,w,h,d,col,x,y,z,o){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),typeof col==='string'?mat(col,o):col);m.position.set(x,y+h/2,z);m.castShadow=m.receiveShadow=true;g.add(m);return m}
  function cyl(g,r,h,seg,col,x,y,z,r2,o){const m=new THREE.Mesh(new THREE.CylinderGeometry(r2==null?r:r2,r,h,seg),typeof col==='string'?mat(col,o):col);m.position.set(x,y+h/2,z);m.castShadow=m.receiveShadow=true;g.add(m);return m}
  function cone(g,r,h,seg,col,x,y,z,o){const m=new THREE.Mesh(new THREE.ConeGeometry(r,h,seg),typeof col==='string'?mat(col,o):col);m.position.set(x,y+h/2,z);if(seg===4)m.rotation.y=Math.PI/4;m.castShadow=true;g.add(m);return m}
  function prism(g,w,h,d,col,x,y,z,ry){const s=new THREE.Shape();s.moveTo(-w/2,0);s.lineTo(w/2,0);s.lineTo(0,h);s.closePath();const ge=new THREE.ExtrudeGeometry(s,{depth:d,bevelEnabled:false});ge.translate(0,0,-d/2);
    const m=new THREE.Mesh(ge,typeof col==='string'?mat(col):col);m.position.set(x,y,z);m.rotation.y=ry||0;m.castShadow=m.receiveShadow=true;g.add(m);return m}
  function hipRoof(g,w,d,h,col,x,y,z){const geo=new THREE.BufferGeometry();const L=Math.max(w,d)/2,S=Math.min(w,d)/2,r=Math.max(0,L-S);const along=w>=d;
    const P=(u,v,hh)=>along?[u,hh,v]:[v,hh,u];const c=[P(-L,-S,0),P(L,-S,0),P(L,S,0),P(-L,S,0)],r0=P(-r,0,h),r1=P(r,0,h);
    const v=[...c[0],...c[1],...r1,...c[0],...r1,...r0,...c[2],...c[3],...r0,...c[2],...r0,...r1,...c[1],...c[2],...r1,...c[3],...c[0],...r0];
    geo.setAttribute('position',new THREE.Float32BufferAttribute(v,3));geo.computeVertexNormals();const m=new THREE.Mesh(geo,typeof col==='string'?mat(col,{side:THREE.DoubleSide}):col);m.position.set(x,y,z);m.castShadow=true;g.add(m);return m}
  function octTower(g,r,h,col,x,y,z){return cyl(g,r,h,8,col,x,y,z)}
  function carvedWindow(g,x,y,z,w,h,ry,trim,glass){const s=new THREE.Group();box(s,w,h,.12,glass||'#2A3138',0,0,0,{roughness:.2});
    box(s,w+.5,.22,.2,trim,0,h,.06);prism(s,w+.9,.7,.18,trim,0,h+.2,.06);box(s,w+.4,.18,.24,trim,0,-.18,.06);box(s,.16,h,.2,trim,-w/2-.12,0,.06);box(s,.16,h,.2,trim,w/2+.12,0,.06);
    box(s,.1,h,.14,trim,0,0,.05);box(s,w,.08,.14,trim,0,h*.62,.05);s.position.set(x,y,z);s.rotation.y=ry||0;g.add(s);return s}
  function laceBoard(g,len,x,y,z,ry,col){const s=new THREE.Group();const n=Math.max(2,Math.round(len/.8));for(let i=0;i<n;i++){const m=new THREE.Mesh(new THREE.CylinderGeometry(.32,.32,.1,10,1,false,0,Math.PI),mat(col));m.rotation.z=Math.PI/2;m.rotation.y=Math.PI/2;m.position.set(-len/2+(i+.5)*len/n,0,0);s.add(m)}
    box(s,len,.25,.12,col,0,.05,0);s.position.set(x,y,z);s.rotation.y=ry||0;g.add(s);return s}
  function dragon(g,s,col,x,y,z,ry){const sh=new THREE.Shape();sh.moveTo(0,0);sh.bezierCurveTo(.6,.2,1,.8,.8,1.4);sh.bezierCurveTo(1.3,1.5,1.7,1.9,1.5,2.3);sh.lineTo(1.2,2.0);sh.bezierCurveTo(1.1,2.3,.8,2.4,.6,2.2);sh.bezierCurveTo(.4,1.6,.2,1,-.3,.6);sh.bezierCurveTo(-.6,.9,-1,.8,-1.1,.4);sh.bezierCurveTo(-.7,.5,-.5,.2,0,0);
    const ge=new THREE.ExtrudeGeometry(sh,{depth:.18,bevelEnabled:false});ge.translate(0,0,-.09);const m=new THREE.Mesh(ge,mat(col,{metalness:.1}));m.scale.setScalar(s);m.position.set(x,y,z);m.rotation.y=ry||0;m.castShadow=true;g.add(m);return m}
  function bird(g,s,col,x,y,z,ry){const sh=new THREE.Shape();sh.moveTo(0,0);sh.bezierCurveTo(.5,.3,.9,.3,1.2,.6);sh.bezierCurveTo(1.0,.9,.7,.8,.5,.7);sh.bezierCurveTo(.6,1.3,.2,1.8,-.2,1.9);sh.bezierCurveTo(0,1.4,0,1,-.3,.7);sh.bezierCurveTo(-.9,1,-1.5,.8,-1.9,1.2);sh.bezierCurveTo(-1.6,.6,-1,.3,0,0);
    const ge=new THREE.ExtrudeGeometry(sh,{depth:.12,bevelEnabled:false});const m=new THREE.Mesh(ge,mat(col,{emissive:C('#3A1A00')}));m.scale.setScalar(s);m.position.set(x,y,z);m.rotation.y=ry||0;g.add(m);return m}
  function goldDome(g,r,x,y,z,onion){const pts=onion?[[0,0],[r*1.05,.1*r],[r*1.25,.55*r],[r*1.1,1.05*r],[r*.6,1.55*r],[r*.15,1.95*r],[0,2.1*r]]:[[0,0],[r,0],[r*.95,.4*r],[r*.75,.8*r],[r*.4,1.05*r],[0,1.15*r]];
    const m=new THREE.Mesh(new THREE.LatheGeometry(pts.map(p=>new THREE.Vector2(p[0],p[1])),16),mat('#D9A93E',{metalness:.85,roughness:.28,emissive:C('#2A1C00'),flatShading:false}));m.position.set(x,y,z);m.castShadow=true;g.add(m);
    const top=y+(onion?2.1:1.15)*r;box(g,.12*r+.05,1.4,.12*r+.05,mat('#E2B44A',{metalness:.85,roughness:.3}),x,top,z);box(g,.8,.12,.12,mat('#E2B44A',{metalness:.85,roughness:.3}),x,top+.9,z);return m}
  // рамка по реальному контуру: центр, оси, фасад к нужной улице
  function frameFor(bi,street){const b=DATA.buildings[bi];const a=ringArr(b.rings[0]);const o=obb(a);let fx=0,fy=0,best=1e18;
    DATA.roads.forEach(r=>{if(!r.name||!r.name.includes(street))return;const p=r.p;for(let k=0;k<p.length;k+=2){const d=(p[k]-o.cx)**2+(p[k+1]-o.cy)**2;if(d<best){best=d;fx=p[k];fy=p[k+1]}}});
    if(best===1e18){fx=o.cx-o.s*100;fy=o.cy+o.c*100}
    const dx=fx-o.cx,dy=fy-o.cy;const U=[o.c,o.s],V=[-o.s,o.c];const du=dx*U[0]+dy*U[1],dv=dx*V[0]+dy*V[1];let F,W,D;
    if(Math.abs(du)>Math.abs(dv)){F=du>0?U:[-U[0],-U[1]];W=o.S;D=o.L}else{F=dv>0?V:[-V[0],-V[1]];W=o.L;D=o.S}
    const base=baseOf(a);return{bi,cx:o.cx,cy:o.cy,F,W,D,base,ry:Math.atan2(F[0],-F[1])}} // ry: поворот, чтобы локальная +Z смотрела на фасад
  function place(g,fr){g.position.set(fr.cx,fr.base,-fr.cy);g.rotation.y=Math.atan2(fr.F[0],-fr.F[1]);landGroup.add(g)}
  const LM={};

  // склеиваем детали каждого знакового здания по материалам: сотни мелких мешей → единицы вызовов отрисовки
  function mergeLandmarks(){if(!landGroup)return;const inv=new THREE.Matrix4(),rel=new THREE.Matrix4();let before=0,after=0;
    landGroup.children.forEach(g=>{if(g===LM.wheel)return;const r=mergeGroup(g);before+=r[0];after+=r[1]});
    console.log('ориентиры: мешей',before,'→',after)}
  function mergeGroup(g){const inv=new THREE.Matrix4(),rel=new THREE.Matrix4();let before=0,after=0;{g.updateMatrixWorld(true);inv.copy(g.matrixWorld).invert();const by=new Map(),kill=[];
      g.traverse(o=>{if(!o.isMesh||o===LM.flame||Array.isArray(o.material)||!o.material.isMeshStandardMaterial||o.material.transparent||o.material.map)return;
        before++;rel.multiplyMatrices(inv,o.matrixWorld);let ge=o.geometry.index?o.geometry.toNonIndexed():o.geometry.clone();ge.applyMatrix4(rel);if(!ge.attributes.normal)ge.computeVertexNormals();
        if(!by.has(o.material))by.set(o.material,[]);by.get(o.material).push(ge);kill.push(o)});
      kill.forEach(o=>{if(o.parent)o.parent.remove(o)});
      by.forEach((list,m)=>{let n=0;list.forEach(ge=>n+=ge.attributes.position.count);const P=new Float32Array(n*3),N=new Float32Array(n*3);let k=0;
        list.forEach(ge=>{P.set(ge.attributes.position.array,k*3);N.set(ge.attributes.normal.array,k*3);k+=ge.attributes.position.count;ge.dispose()});
        const mg=new THREE.BufferGeometry();mg.setAttribute('position',new THREE.BufferAttribute(P,3));mg.setAttribute('normal',new THREE.BufferAttribute(N,3));mg.computeBoundingSphere();
        const mesh=new THREE.Mesh(mg,m);mesh.castShadow=true;mesh.receiveShadow=true;g.add(mesh);after++})}
    return[before,after]}
  function buildLandmarks(){landGroup=new THREE.Group();scene.add(landGroup);
    // 1. Дом с шатром (особняк Голованова), Красноармейская, 71
    try{const fr=frameFor(696,'Красноармейская');LMSKIP.add(696);const g=new THREE.Group();const W=fr.W,D=fr.D;const blue='#86BEDB',white='#F7F4EC',brick='#9A5238',roof='#6D8796';
      box(g,W,1.6,D,brick,0,-1,0);box(g,W,3.6,D,blue,0,.6,0);box(g,W+.3,.35,D+.3,white,0,4.2,0);box(g,W,3.4,D,blue,0,4.55,0);box(g,W+.6,.4,D+.6,white,0,7.95,0);
      hipRoof(g,W+.8,D+.8,3.2,roof,0,8.35,0);
      const n=Math.max(2,Math.round((W-4)/2.6));for(let fl=0;fl<2;fl++)for(let i=0;i<n;i++){const x=-W/2+2.6+i*(W-5.2)/(n-1||1);if(Math.abs(x-(W/2-2.6))<1.6)continue;carvedWindow(g,x,1.6+fl*3.9,D/2+.05,1.1,1.8,0,white)}
      const sn=Math.max(3,Math.round(D/3));for(let fl=0;fl<2;fl++)for(let i=0;i<sn;i++){const z=-D/2+2+i*(D-4)/(sn-1);carvedWindow(g,W/2+.05,1.6+fl*3.9,z,1.1,1.8,Math.PI/2,white);carvedWindow(g,-W/2-.05,1.6+fl*3.9,z,1.1,1.8,-Math.PI/2,white)}
      laceBoard(g,W,0,7.6,D/2+.25,0,white);laceBoard(g,D,W/2+.25,7.6,0,Math.PI/2,white);laceBoard(g,D,-W/2-.25,7.6,0,-Math.PI/2,white);
      // восьмигранная башня с шатром на углу фасада
      const tx=W/2-2.2,tz=D/2-1.6;octTower(g,2.3,1.6,brick,tx,-1,tz);octTower(g,2.25,9.6,blue,tx,.6,tz);cyl(g,2.55,.4,8,white,tx,10.2,tz);
      for(let i=0;i<8;i++){const a=i/8*Math.PI*2+Math.PI/8;const s=new THREE.Group();carvedWindow(s,0,0,0,.8,1.5,0,white);s.position.set(tx+Math.sin(a)*2.12,7.8,tz+Math.cos(a)*2.12);s.rotation.y=a;g.add(s)}
      cone(g,2.7,7.5,8,'#7FB3D3',tx,10.6,tz);cyl(g,.12,3.2,6,'#3A3A3A',tx,18.1,tz);cyl(g,.35,.35,8,'#D9A93E',tx,19.4,tz,null,{metalness:.8,roughness:.3});
      // крыльцо и балкон
      box(g,3.2,.3,2,white,-W/4,3.9,D/2+1);for(let i=0;i<4;i++)box(g,.15,1,.15,white,-W/4-1.4+i*.93,4.2,D/2+1.9);box(g,3.2,.12,.15,white,-W/4,5.1,D/2+1.9);
      box(g,2.4,3,.6,blue,-W/4,.6,D/2+.4);prism(g,3,1,1.4,white,-W/4,3.6,D/2+.7);
      place(g,fr);LM.shatr={g,fr}}catch(e){console.warn('шатёр',e)}
    // 2. Дом с драконами, Красноармейская, 68
    try{const fr=frameFor(2892,'Красноармейская');LMSKIP.add(2892);const g=new THREE.Group();const W=fr.W,D=fr.D;const log='#4A3A30',blue='#5D86B8',white='#F4F1EA',roof='#5E6A70';
      box(g,W,.9,D,'#7A4A38',0,-.6,0);box(g,W,6.6,D,log,0,.3,0);for(let i=0;i<20;i++)box(g,W+.12,.07,D+.12,'#3A2C24',0,.6+i*.32,0);
      box(g,W+.5,.3,D+.5,white,0,6.9,0);prism(g,W+.6,4.2,D+.6,roof,0,7.2,0,Math.PI/2);
      // фасадные фронтоны
      const gf=new THREE.Group();prism(gf,6.4,4.6,1.2,roof,0,0,0);prism(gf,5.6,3.8,1.3,blue,0,.2,0);carvedWindow(gf,0,1,.7,1,1.6,0,white);gf.position.set(-W/4,6.9,D/2-.2);g.add(gf);
      const gf2=gf.clone();gf2.position.set(W/4,6.9,D/2-.2);g.add(gf2);
      for(let fl=0;fl<2;fl++)for(const x of[-W/2+2,-W/4,0,W/4,W/2-2])carvedWindow(g,x,1.3+fl*3.1,D/2+.05,1,1.7,0,white);
      for(let fl=0;fl<2;fl++)for(let i=0;i<4;i++){const z=-D/2+2+i*(D-4)/3;carvedWindow(g,W/2+.05,1.3+fl*3.1,z,1,1.7,Math.PI/2,white);carvedWindow(g,-W/2-.05,1.3+fl*3.1,z,1,1.7,-Math.PI/2,white)}
      // угловая башня с острым шатром
      const tx=-W/2+1.4,tz=D/2-1.4;box(g,2.8,8.6,2.8,log,tx,.3,tz);box(g,3.1,.3,3.1,white,tx,8.9,tz);cone(g,2.3,7.4,4,blue,tx,9.2,tz);cyl(g,.08,2.4,5,'#2A2A2A',tx,16.6,tz);
      // козырёк над входом
      box(g,3.4,.25,1.8,blue,W/6,3.3,D/2+.9);for(const s of[-1,1])box(g,.18,3.3,.18,white,W/6+s*1.5,0,D/2+1.7);
      // семь драконов: попарно на север, юг, запад и один на восход
      const dc='#2F6E8E';[[-W/4-2.9,7.1,D/2+.4,0],[-W/4+2.9,7.1,D/2+.4,Math.PI],[W/4-2.9,7.1,D/2+.4,0],[W/4+2.9,7.1,D/2+.4,Math.PI],[W/2+.3,8.6,-D/4,Math.PI/2],[W/2+.3,8.6,D/4,-Math.PI/2],[W/6+1.4,3.6,D/2+1.8,0]].forEach(([x,y,z,r])=>dragon(g,.85,dc,x,y,z,r));
      place(g,fr);LM.dragon={g,fr}}catch(e){console.warn('драконы',e)}
    // 3. Дом с жар-птицами, Красноармейская, 67/1
    try{const fr=frameFor(2951,'Красноармейская');LMSKIP.add(2951);const g=new THREE.Group();const W=fr.W,D=fr.D;const wall='#D8AE5A',white='#FBF6EA',roof='#9C3B2A';
      box(g,W,1,D,'#8A5A40',0,-.7,0);box(g,W,5.4,D,wall,0,.3,0);box(g,W+.4,.3,D+.4,white,0,5.7,0);hipRoof(g,W+.8,D+.8,3.6,roof,0,6,0);
      for(const s of[-1,1]){const ex=s*W/4;const e=new THREE.Group();cyl(e,1.9,5.4,6,wall,0,0,0);cyl(e,2.1,.3,6,white,0,5.4,0);cone(e,2.1,4,6,roof,0,5.7,0);cyl(e,.07,2,5,'#2A2A2A',0,9.7,0);
        for(let i=0;i<3;i++){const a=-Math.PI/3+i*Math.PI/3;const w=new THREE.Group();carvedWindow(w,0,1.2,0,.8,1.6,0,white);w.position.set(Math.sin(a)*1.68,0,Math.cos(a)*1.68);w.rotation.y=a;e.add(w)}
        e.position.set(ex,.3,D/2);g.add(e);bird(g,.9,'#E8742A',ex-1,10.2,D/2,0)}
      for(const x of[0])carvedWindow(g,x,1.4,D/2+.05,1.1,1.8,0,white);for(let i=0;i<4;i++){const z=-D/2+2+i*(D-4)/3;carvedWindow(g,W/2+.05,1.4,z,1.1,1.8,Math.PI/2,white);carvedWindow(g,-W/2-.05,1.4,z,1.1,1.8,-Math.PI/2,white)}
      bird(g,1.2,'#F08A2E',-1.2,9.4,0,0);laceBoard(g,W,0,5.3,D/2+.25,0,white);
      place(g,fr);LM.firebird={g,fr}}catch(e){console.warn('жар-птицы',e)}
    // 4. Краеведческий музей (усадьба Асташева): ампир, жёлтые стены, белый портик
    try{const fr=frameFor(1846,'Ленина');const b=DATA.buildings[1846];b.col='E9C98E';b.h=11.5;b.roof='hipped';const g=new THREE.Group();const W=Math.min(fr.W,30);
      const white='#F8F4EA';box(g,14,.8,4.6,white,0,0,fr.D/2+1.4);for(let i=0;i<6;i++)cyl(g,.42,8.2,12,white,-5.6+i*2.24,.8,fr.D/2+3.1,.36,{flatShading:false});
      box(g,13.6,1,4.8,white,0,9,fr.D/2+1.6);prism(g,14.2,2.6,1.2,white,0,10,fr.D/2+3.3);prism(g,12.4,2,1.25,'#E9C98E',0,10.25,fr.D/2+3.35);
      cyl(g,.9,.4,16,'#D9A93E',0,10.9,fr.D/2+4,null,{metalness:.7,roughness:.3});
      for(let i=0;i<5;i++){box(g,.25,1.1,.3,white,-6+i*3,0,fr.D/2+6.5)}box(g,13,.15,.12,'#2A2A2A',0,1.1,fr.D/2+6.5);
      place(g,fr);LM.kraev={g,fr}}catch(e){console.warn('музей',e)}
    // 5. Воскресенская церковь: сибирское барокко, белые стены, зелёные кровли, золотые главы
    try{const fr=frameFor(2184,'Октябрьский');LMSKIP.add(2184);const g=new THREE.Group();const L=Math.max(fr.W,fr.D),Sx=Math.min(fr.W,fr.D);const white='#EBD9A8',green='#3A3A3A',ochre='#F6F1E6';
      const along=fr.W>=fr.D;const G2=new THREE.Group();if(!along)G2.rotation.y=Math.PI/2;g.add(G2);
      // трапезная, четверик, восьмерик, колокольня по длинной оси
      box(G2,L*.34,7,Sx*.8,white,-L*.12,0,0);hipRoof(G2,L*.34+.6,Sx*.8+.6,2.2,green,-L*.12,7,0);
      box(G2,L*.26,10.5,Sx,white,L*.18,0,0);box(G2,L*.26+.4,.5,Sx+.4,ochre,L*.18,10.5,0);octTower(G2,Sx*.38,5.5,white,L*.18,11,0);cyl(G2,Sx*.42,.4,8,ochre,L*.18,16.5,0);
      const dome=new THREE.Mesh(new THREE.LatheGeometry([[Sx*.42,0],[Sx*.4,1.4],[Sx*.3,2.6],[Sx*.12,3.4],[0,3.6]].map(p=>new THREE.Vector2(p[0],p[1])),8),mat(green,{side:THREE.DoubleSide}));dome.position.set(L*.18,16.9,0);G2.add(dome);
      cyl(G2,.7,1.6,8,white,L*.18,20.4,0);goldDome(G2,.9,L*.18,22,0,true);
      for(const[dx,dz] of[[-1,-1],[1,-1],[1,1],[-1,1]]){cyl(G2,.5,1.2,8,white,L*.18+dx*L*.09,10.9,dz*Sx*.36);goldDome(G2,.55,L*.18+dx*L*.09,12.1,dz*Sx*.36,true)}
      box(G2,L*.08,3.8,Sx*.55,white,L*.34,0,0);// апсида
      const bx=-L*.38;box(G2,Sx*.62,9,Sx*.62,white,bx,0,0);box(G2,Sx*.66,.4,Sx*.66,ochre,bx,9,0);box(G2,Sx*.48,5.5,Sx*.48,white,bx,9.4,0);octTower(G2,Sx*.24,3.5,white,bx,14.9,0);cone(G2,Sx*.3,7,8,green,bx,18.4,0);goldDome(G2,.5,bx,25.4,0,true);
      for(let i=0;i<4;i++){const a=i*Math.PI/2;const s=new THREE.Group();box(s,1.2,2.4,.2,'#2A2A2A',0,0,0);s.position.set(bx+Math.sin(a)*Sx*.245,11.3,Math.cos(a)*Sx*.245);s.rotation.y=a;G2.add(s)}
      // окна с наличниками барокко
      for(let i=0;i<3;i++)for(const s of[-1,1]){const w=new THREE.Group();box(w,1,2.2,.15,'#2A3138',0,0,0,{roughness:.2});box(w,1.6,.3,.2,ochre,0,2.2,0);box(w,1.5,.25,.2,ochre,0,-.25,0);w.position.set(L*.08+i*L*.08,3.4,s*(Sx/2+.08));if(s<0)w.rotation.y=Math.PI;G2.add(w)}
      place(g,fr);LM.voskr={g,fr}}catch(e){console.warn('воскресенская',e)}
    try{[7996,7997,7998,8003,3977].forEach(i=>{const b=DATA.buildings[i];if(b)b.col='F1E8D2'})}catch(e){}
    // 6. Богоявленский собор: OSM-части + золотые кресты (добавлены автоматически), подсветка цвета
    try{[8902,8903,8904,8906,8907,8908,8909,8912,8943,8944,1396].forEach(i=>{const b=DATA.buildings[i];if(b){b.col=b.col||'EAD2C8'}})}catch(e){}
    // 7. Мемориал «Родина-мать» и вечный огонь в Лагерном саду
    try{const x=-351,y=-2440,h=gH(x,y);const g=new THREE.Group();const st='#9AA0A2',br='#6E5A3E';box(g,9,.8,9,'#C9C2B4',0,0,0);box(g,3.2,2.4,2.4,st,0,.8,0);
      const fig=(dx,hh,col)=>{cyl(g,.9,hh*.55,10,col,dx,3.2,0,.6);cyl(g,.55,hh*.3,10,col,dx,3.2+hh*.55,0,.5);const head=new THREE.Mesh(new THREE.SphereGeometry(.42,12,8),mat(col));head.position.set(dx,3.2+hh*.88,0);head.castShadow=true;g.add(head)};
      fig(-.7,6.2,br);fig(.8,6.8,br);box(g,.18,2.6,.18,br,.15,6.2,0).rotation.z=.6;
      const fl=new THREE.Mesh(new THREE.ConeGeometry(.6,1.6,10),new THREE.MeshBasicMaterial({color:0xFF8A2E}));fl.position.set(0,1.4,4.4);g.add(fl);cyl(g,1.4,.5,16,'#5A5A5A',0,.8,4.4);LM.flame=fl;
      g.scale.setScalar(1.7);g.position.set(x,h,-y);landGroup.add(g)}catch(e){}
    // 8. Памятник Чехову на набережной
    try{const x=-741,y=1098,h=gH(x,y);const g=new THREE.Group();const brz='#4A4036';box(g,1.6,.5,1.6,'#B9B2A6',0,0,0);box(g,.9,.18,1.6,brz,0,.5,.25);cyl(g,.28,1.5,8,brz,0,.68,0,.22);
      const hd=new THREE.Mesh(new THREE.SphereGeometry(.22,10,8),mat(brz));hd.position.set(0,2.45,0);g.add(hd);cyl(g,.32,.06,12,brz,0,2.62,0);cyl(g,.2,.25,10,brz,0,2.66,0);box(g,.06,1.3,.06,brz,.2,.6,-.25).rotation.z=.3;
      g.position.set(x,h,-y);g.rotation.y=-1.2;landGroup.add(g)}catch(e){}
    // 9. Колесо обозрения в Городском саду
    try{const x=-107,y=-237,h=gH(x,y);const g=new THREE.Group();const R=13,steel='#E9E4DA';const rim=new THREE.Mesh(new THREE.TorusGeometry(R,.25,6,48),mat(steel));rim.position.y=R+2;g.add(rim);
      const rim2=rim.clone();rim2.position.z=1.2;g.add(rim2);for(let i=0;i<16;i++){const a=i/16*Math.PI*2;const sp=new THREE.Mesh(new THREE.BoxGeometry(.12,R,.12),mat(steel));sp.position.set(Math.sin(a)*R/2,R+2+Math.cos(a)*R/2,.6);sp.rotation.z=-a;g.add(sp);
        const cab=new THREE.Mesh(new THREE.BoxGeometry(1.4,1.6,1.4),mat(['#D2456A','#E0A51E','#2C7DB8','#2E8A5C'][i%4]));cab.position.set(Math.sin(a)*R,R+2+Math.cos(a)*R-1.2,.6);cab.castShadow=true;g.add(cab)}
      for(const s of[-1,1]){const leg=new THREE.Mesh(new THREE.BoxGeometry(.4,R+3,.4),mat('#B8B2A6'));leg.position.set(s*4,(R+2)/2,.6);leg.rotation.z=-s*.28;g.add(leg)}
      g.position.set(x,h,-y);g.rotation.y=.4;landGroup.add(g);LM.wheel=g}catch(e){}
    /* ===== знаковые здания: по фотографиям ===== */
    function domeC(g,r,x,y,z,shape,col,o={}){let pr;
      if(shape==='onion')pr=[[0,0],[r*1.05,.1*r],[r*1.25,.55*r],[r*1.1,1.05*r],[r*.6,1.55*r],[r*.15,1.95*r],[0,2.1*r]];
      else if(shape==='helmet')pr=[[0,0],[r,0],[r,.45*r],[r*.88,.95*r],[r*.55,1.35*r],[r*.12,1.65*r],[0,1.72*r]];
      else pr=[[0,0],[r,0],[r*.97,.3*r],[r*.86,.6*r],[r*.62,.86*r],[r*.32,1.0*r],[0,1.04*r]];
      const metal=col==='#D9A93E'||col==='#B9C2C8'||col==='#C8CED2';
      const m=new THREE.Mesh(new THREE.LatheGeometry(pr.map(p=>new THREE.Vector2(p[0],p[1])),20),mat(col,{metalness:metal?.75:.2,roughness:metal?.3:.6,flatShading:false}));m.position.set(x,y,z);m.castShadow=true;g.add(m);
      const top=y+pr[pr.length-1][1];const gold=mat('#E2B44A',{metalness:.85,roughness:.3});
      if(o.cross!==false&&!o.crescent){box(g,.14*Math.max(1,r/2),r*.9,.14*Math.max(1,r/2),gold,x,top,z);box(g,r*.5,.12,.12,gold,x,top+r*.6,z)}
      if(o.crescent){cyl(g,.06,r*.8,5,gold,x,top,z);const t=new THREE.Mesh(new THREE.TorusGeometry(r*.28,.07,6,14,Math.PI*1.4),gold);t.position.set(x,top+r*.95,z);t.rotation.z=Math.PI*.3;g.add(t)}
      return top}
    function portico(g,n,h,span,z,dep,col,ped){const step=span/(n-1);box(g,span+2,.6,dep+.8,col,0,0,z+dep/2);for(let i=0;i<n;i++)cyl(g,.42,h,12,col,-span/2+i*step,.6,z+dep,.36,{flatShading:false});
      box(g,span+1.6,1,dep+.6,col,0,h+.6,z+dep/2);if(ped)prism(g,span+2,2.6,1,col,0,h+1.6,z+dep)}
    function archWins(g,W,y,z,n,w,h,frame,glass){for(let i=0;i<n;i++){const x=-W/2+W*(i+.5)/n;box(g,w,h,.12,glass||'#2A3138',x,y,z,{roughness:.2});box(g,w+.5,.25,.2,frame,x,y+h,z+.05);box(g,w+.4,.2,.22,frame,x,y-.2,z+.05)}}
    const keep=(i,props)=>{const b=DATA.buildings[i];if(b)Object.assign(b,props);return b};
    const safe=(name,fn)=>{try{fn()}catch(e){console.warn(name,e)}};

    // Красная мечеть: красный кирпич, зелёные купола, минарет с шатром и полумесяцем
    safe('красная мечеть',()=>{const fr=frameFor(3085,'Трифонова');LMSKIP.add(3085);const g=new THREE.Group();const W=fr.W,D=fr.D;const brick='#9A4430',trim='#EAD4AE',green='#2F7D57';
      box(g,W,1,D,'#8A3A28',0,-.8,0);box(g,W,8,D*.72,brick,0,0,-D*.14);box(g,W+.4,.5,D*.72+.4,trim,0,8,-D*.14);hipRoof(g,W+.6,D*.72+.6,2,green,0,8.5,-D*.14);
      cyl(g,3.4,2.4,8,brick,0,9.4,-D*.14);domeC(g,3.6,0,11.8,-D*.14,'onion',green,{crescent:true});
      for(const sx of[-1,1])for(const sz of[-1,1]){cyl(g,.9,1.6,8,brick,sx*(W/2-1.2),8.5,-D*.14+sz*(D*.36-1.2));domeC(g,.9,sx*(W/2-1.2),10.1,-D*.14+sz*(D*.36-1.2),'onion',green,{crescent:true})}
      archWins(g,W-2,2.2,D*.22+.05-D*.14+.01,5,1.2,3,trim);
      // вход и минарет на фасаде
      const fz=D/2-3;box(g,W*.5,7,6,brick,0,0,fz);box(g,W*.5+.4,.5,6.4,trim,0,7,fz);box(g,4.4,10,4.4,brick,0,0,fz);box(g,4.8,.5,4.8,trim,0,10,fz);
      cyl(g,1.8,7,8,brick,0,10.5,fz);cyl(g,2.4,.5,8,trim,0,17.5,fz);for(let i=0;i<8;i++){const a=i/8*Math.PI*2;box(g,.12,1,.12,trim,Math.sin(a)*2.3,18,fz+Math.cos(a)*2.3)}
      cyl(g,1.3,4,8,brick,0,18,fz);cyl(g,1.6,.4,8,trim,0,22,fz);cone(g,1.6,5.5,8,green,0,22.4,fz);cyl(g,.06,1.6,5,'#E2B44A',0,27.9,fz);
      const t=new THREE.Mesh(new THREE.TorusGeometry(.45,.08,6,14,Math.PI*1.4),mat('#E2B44A',{metalness:.8}));t.position.set(0,29.9,fz);t.rotation.z=Math.PI*.3;g.add(t);
      place(g,fr);LM.redmosque={g,fr}});
    // Белая мечеть: белые стены, серебристый купол, трёхъярусный минарет
    safe('белая мечеть',()=>{const fr=frameFor(443,'Московский');LMSKIP.add(443);const g=new THREE.Group();const W=fr.W,D=fr.D;const wh='#F4F3EE',sil='#C8CED2';
      box(g,W,1,D,'#D9D6CE',0,-.8,0);box(g,W,7.5,D,wh,0,0,0);box(g,W+.4,.4,D+.4,'#E6E4DE',0,7.5,0);box(g,W,.6,D,wh,0,7.9,0);
      cyl(g,Math.min(W,D)*.3,2,12,wh,0,8.5,-D*.05);domeC(g,Math.min(W,D)*.32,0,10.5,-D*.05,'dome',sil,{crescent:true});
      archWins(g,W-2,2,D/2+.05,4,1.1,3,'#E6E4DE');
      const mz=D/2-1.8,mx=0;box(g,3.6,9,3.6,wh,mx,0,mz);cyl(g,1.5,7,8,wh,mx,9,mz);cyl(g,2.1,.4,8,'#E6E4DE',mx,16,mz);cyl(g,1.1,4.5,8,wh,mx,16.4,mz);cyl(g,1.6,.35,8,'#E6E4DE',mx,20.9,mz);cyl(g,.8,1.6,8,wh,mx,21.2,mz);domeC(g,.85,mx,22.8,mz,'onion',sil,{crescent:true});
      place(g,fr);LM.whitemosque={g,fr}});
    // Петропавловский собор: вишнёвый кирпич, серебристые главы
    safe('петропавловский',()=>{const fr=frameFor(1359,'Алтайская');LMSKIP.add(1359);const g=new THREE.Group();const W=fr.W,D=fr.D;const brick='#A2452F',trim='#E6D3A8',sil='#C8CED2';
      const big=Math.max(W,D),sm=Math.min(W,D);const G2=new THREE.Group();g.add(G2);if(W<D)G2.rotation.y=Math.PI/2;const L=big,S=sm; // длинная ось — вдоль X в G2
      box(G2,L*.42,13,S,brick,L*.18,0,0);box(G2,L*.42+.4,.6,S+.4,trim,L*.18,13,0);hipRoof(G2,L*.42+.6,S+.6,1.6,'#6E7478',L*.18,13.6,0);
      cyl(G2,S*.2,5,12,brick,L*.18,14.4,0);cyl(G2,S*.22,.5,12,trim,L*.18,19.4,0);domeC(G2,S*.21,L*.18,19.9,0,'helmet',sil);
      for(const dx of[-1,1])for(const dz of[-1,1]){cyl(G2,1.5,3.2,10,brick,L*.18+dx*L*.14,13.6,dz*S*.33);domeC(G2,1.6,L*.18+dx*L*.14,16.8,dz*S*.33,'onion',sil)}
      box(G2,L*.08,10,S*.6,brick,L*.43,0,0);// апсида
      box(G2,L*.28,8,S*.7,brick,-L*.14,0,0);hipRoof(G2,L*.28+.5,S*.7+.5,2,'#6E7478',-L*.14,8,0);
      const bx=-L*.38;box(G2,6.5,16,6.5,brick,bx,0,0);box(G2,6.9,.5,6.9,trim,bx,16,0);cyl(G2,2.6,6,8,brick,bx,16.5,0);cyl(G2,2.9,.4,8,trim,bx,22.5,0);domeC(G2,2.4,bx,22.9,0,'onion',sil);
      for(let i=0;i<4;i++){const a=i*Math.PI/2;const s=new THREE.Group();box(s,1.4,3,.2,'#2A2A2A',0,0,0);s.position.set(bx+Math.sin(a)*2.6,18,Math.cos(a)*2.6);s.rotation.y=a;G2.add(s)}
      // жёлтый портал из песчаника
      box(G2,.6,7,4,'#D9B977',bx-3.5,0,0);place(g,fr);LM.petropav={g,fr}});
    // Польский костёл (Покрова Пресвятой Богородицы): белый, башня на фасаде
    safe('костёл',()=>{const fr=frameFor(1157,'Бакунина');LMSKIP.add(1157);const g=new THREE.Group();const W=fr.W,D=fr.D;const wh='#F2EFE8',roof='#7D858A';
      box(g,W*.7,9,D-3,wh,0,0,-1.5);prism(g,W*.7+.6,5,D-2.4,roof,0,9,-1.5,Math.PI/2);
      box(g,5,17,4,wh,0,0,D/2-2.2);box(g,5.4,.4,4.4,'#E3DED3',0,17,D/2-2.2);cone(g,3.6,6,4,roof,0,17.4,D/2-2.2);box(g,.14,1.6,.14,'#E2B44A',0,23.4,D/2-2.2);box(g,.9,.12,.12,'#E2B44A',0,24.3,D/2-2.2);
      for(const s of[-1,1]){box(g,1.2,11,1.2,wh,s*(W*.35-.6),0,D/2-.6);cone(g,.9,2.4,4,roof,s*(W*.35-.6),11,D/2-.6)}
      for(let i=0;i<3;i++)for(const s of[-1,1]){box(g,.15,3.4,1.2,'#2A3138',s*(W*.35+.01),2.5,-D/2+3+i*(D-6)/2,{roughness:.2})}
      box(g,1.6,3.2,.15,'#5A4636',0,0,D/2-.15);place(g,fr);LM.kostel={g,fr}});
    // Лютеранская церковь Святой Марии: сосновый сруб, синий шпиль
    safe('кирха',()=>{const fr=frameFor(109,'Карташова');LMSKIP.add(109);const g=new THREE.Group();const W=fr.W,D=fr.D;const wood='#C99A55',dark='#7A5532',blue='#3E6FA8';
      box(g,W,1,D,'#8E8A84',0,-.8,0);box(g,W*.85,7,D-3,wood,0,0,-1.5);for(let i=0;i<14;i++)box(g,W*.85+.1,.06,D-2.9,dark,0,.5+i*.48,-1.5);
      prism(g,W*.85+1.2,6.5,D-2.2,'#5E6E80',0,7,-1.5,Math.PI/2);
      box(g,4.2,12.5,4.2,wood,0,0,D/2-2.3);box(g,4.6,.3,4.6,dark,0,12.5,D/2-2.3);cone(g,3.2,13,4,blue,0,12.8,D/2-2.3);box(g,.12,1.4,.12,'#E2B44A',0,25.8,D/2-2.3);
      for(let i=0;i<3;i++)for(const s of[-1,1])box(g,.15,2.6,1,'#2A3138',s*(W*.425+.01),2.4,-D/2+3+i*(D-7)/2);
      place(g,fr);LM.kirha={g,fr}});
    // Музей истории Томска: жёлтый дом и деревянная пожарная каланча — смотровая площадка
    safe('каланча',()=>{const fr=frameFor(9451,'Бакунина');LMSKIP.add(9451);const g=new THREE.Group();const W=fr.W,D=fr.D;const yel='#E6C777',wh='#F6F1E6',wood='#4A3A2E';
      box(g,W,1,D,'#B8B2A6',0,-.8,0);box(g,W,8,D,yel,0,0,0);box(g,W+.5,.5,D+.5,wh,0,8,0);hipRoof(g,W+.8,D+.8,2.4,'#7E8A8C',0,8.3,0);
      archWins(g,W-2,1.4,D/2+.05,6,1.1,1.9,wh);archWins(g,W-2,4.9,D/2+.05,6,1.1,1.9,wh);
      cyl(g,2.6,8.5,8,wood,0,9,0);cyl(g,3.4,.35,8,wood,0,15,0);for(let i=0;i<16;i++){const a=i/16*Math.PI*2;box(g,.12,1.1,.12,wood,Math.sin(a)*3.3,15.35,Math.cos(a)*3.3)}
      cyl(g,3.4,.12,16,wood,0,16.4,0);cone(g,2.9,3.6,8,'#2E2620',0,17.5,0);cyl(g,.07,4,5,'#3A3A3A',0,21,0);box(g,.04,.9,1.5,'#C9302C',0,24,.8);
      place(g,fr);LM.kalancha={g,fr}});
    // Дом науки: белый, центральная башня с красным куполом
    safe('дом науки',()=>{const fr=frameFor(2249,'Соляная');keep(2249,{col:'F3EFE6',rcol:'8F9497',kind:5,st:9,h:12,cornice:.5});const g=new THREE.Group();
      box(g,8,15,7,'#F3EFE6',0,0,fr.D/2-2.5);box(g,8.6,.5,7.6,'#E6E0D3',0,15,fr.D/2-2.5);cyl(g,3.4,2,12,'#F3EFE6',0,15.5,fr.D/2-2.5);domeC(g,3.6,0,17.5,fr.D/2-2.5,'helmet','#A1452F',{cross:false});cyl(g,.08,2.5,5,'#3A3A3A',0,23.6,fr.D/2-2.5);
      archWins(g,6,5,fr.D/2+1.05,3,1.1,3.2,'#E6E0D3');place(g,fr)});
    // Пассаж Второва: модерн, светлый фасад, аттик с аркой
    safe('пассаж',()=>{const fr=frameFor(363,'Ленина');keep(363,{col:'EFE8D8',rcol:'90969A',kind:5,st:9,cornice:.55});const g=new THREE.Group();const b=DATA.buildings[363];
      const shape=new THREE.Shape();shape.moveTo(-9,0);shape.lineTo(9,0);shape.lineTo(9,3);shape.quadraticCurveTo(0,8.5,-9,3);shape.closePath();const ge=new THREE.ExtrudeGeometry(shape,{depth:1,bevelEnabled:false});
      const at=new THREE.Mesh(ge,mat('#EFE8D8'));at.position.set(0,b.h,fr.D/2-1);at.castShadow=true;g.add(at);box(g,6,3,.15,'#3E5560',0,b.h+.8,fr.D/2+.02,{roughness:.3});
      for(const s of[-1,1]){box(g,3.4,b.h+1.5,3.4,'#EFE8D8',s*(fr.W/2-2),0,fr.D/2-1.6);domeC(g,1.9,s*(fr.W/2-2),b.h+1.5,fr.D/2-1.6,'helmet','#7C8C93',{cross:false})}
      place(g,fr)});
    // Главпочтамт, Дом офицеров, Гостиный двор, ТПУ, речной вокзал, администрация
    keep(3052,{col:'EAD7A2',rcol:'8A8F90',kind:5,st:9,cornice:.5});keep(3053,{col:'EAD7A2',rcol:'8A8F90',kind:5,st:9});
    keep(3029,{col:'A44E35',rcol:'7A7E80',kind:5,st:13,h:15,cornice:.5});
    keep(17,{col:'A5503A',rcol:'6E6A66',kind:5,st:13,cornice:.45});
    safe('гостиный',()=>{const fr=frameFor(17,'Ленина');const g=new THREE.Group();cyl(g,1.4,26,12,'#9C4A34',fr.W/2-3,0,-fr.D/2+3,1.0);cyl(g,1.2,.6,12,'#7A3A28',fr.W/2-3,26,-fr.D/2+3);place(g,fr)});
    keep(912,{col:'D9D3C6',rcol:'7E8487',kind:5,st:9,h:17,cornice:.6});
    safe('тпу',()=>{const fr=frameFor(912,'Ленина');const g=new THREE.Group();box(g,14,12,2.2,'#D9D3C6',0,0,fr.D/2-.4);archWins(g,10,1.5,fr.D/2+.75,3,1.6,3.6,'#ECE7DC','#3A3530');prism(g,15,2.6,1.6,'#D9D3C6',0,17,fr.D/2+.3);place(g,fr)});
    keep(1461,{col:'F1EFEA',rcol:'8C8C88',kind:2,st:1,h:12});
    keep(9429,{col:'F2F2EE',rcol:'8C8C88',kind:2,st:1});
    keep(1405,{col:'E5DFD3',rcol:'8C8C88'});
    // Научная библиотека ТГУ: мятные стены и белая колоннада
    [847,3966,3967,3968,3969,3970,9445].forEach(i=>keep(i,{col:'A9D3C3',rcol:'B9BFBC',kind:5,st:9}));
    safe('библиотека',()=>{const fr=frameFor(9445,'Ленина');const g=new THREE.Group();portico(g,6,10,16,fr.D/2-.6,3,'#F6F3EC',false);place(g,fr)});
    // Главный корпус ТГУ: белый, центральный ризалит
    [7996,7997,7998,8003,3977].forEach(i=>keep(i,{col:'F4EFE4',rcol:'9DA6A0',kind:5,st:9,cornice:.6}));
    safe('тгу',()=>{const fr=frameFor(7997,'Ленина');const g=new THREE.Group();const b=DATA.buildings[7997];
      for(let i=0;i<8;i++)box(g,.7,b.h-2.5,.6,'#FBF8F1',-10.5+i*3,1.2,fr.D/2+.2);box(g,24,1.2,1.2,'#FBF8F1',0,b.h-1.4,fr.D/2+.3);
      box(g,14,3.2,1,'#F4EFE4',0,b.h-.2,fr.D/2-.2);prism(g,14.6,2,1.1,'#F4EFE4',0,b.h+3,fr.D/2-.2);box(g,6,2.2,.2,'#2E5E8E',0,b.h+.3,fr.D/2+.32);
      box(g,7,4,3,'#F4EFE4',0,0,fr.D/2+1.4);place(g,fr)});
    // Драматический театр: белый объём на стеклянном основании
    safe('драмтеатр',()=>{const fr=frameFor(301,'Ленина');LMSKIP.add(301);const g=new THREE.Group();const W=fr.W,D=fr.D;
      box(g,W-6,5.5,D-6,'#2E3A40',0,0,0,{roughness:.15,metalness:.3});box(g,W,14.4,D,'#EFEDE6',0,5.5,0);
      for(let i=0;i<4;i++)box(g,W+.2,.35,D+.2,'#7A5A44',0,7.5+i*3.2,0);box(g,W*.5,3,D*.5,'#E3E0D8',0,19.9,0);
      for(let i=0;i<10;i++)cyl(g,.35,5.5,8,'#D9D6CE',-W/2+4+i*(W-8)/9,0,D/2-3.2);place(g,fr);LM.drama={g,fr}});
    // Знаменская и Богоявленский — части OSM, уточняем цвета по фото
    [8902,8903,8904,8906,8909,8912,8943,8944,1396].forEach(i=>keep(i,{col:'EBD6C2'}));
    // прожекторы для театрального погружения
    const d=CUR.find(c=>c.id==='drama');['#FF4FD8','#4FD8FF','#FFD84A'].forEach((c,i)=>{const geo=new THREE.ConeGeometry(9,80,20,1,true);geo.rotateX(Math.PI);geo.translate(0,40,0);
      const m=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));m.position.set(d.x-12+i*12,gH(d.x,d.y)+20,-d.y);scene.add(m);beams.push(m)});
  }

  /* ---------- подписи ---------- */
  const labelsEl=$('#labels3d');let labelEls=[];
  function buildLabels(){labelsEl.innerHTML='';labelEls=CUR.map(c=>{const d=document.createElement('button');d.className='l3';d.innerHTML=`<span class="dot" style="background:${c.col}">${ico(c.ic)}</span><span class="t">${c.name}</span>`;
    d.addEventListener('click',()=>APP.select({type:'c',c}));labelsEl.appendChild(d);const b=c.b!=null?DATA.buildings[c.b]:null;const h=(b?b.h:8)+gH(c.x,c.y)+4;return{c,el:d,v:new THREE.Vector3(c.x,h,-c.y)}})}
  const tv=new THREE.Vector3();
  function updateLabels(){const W=lay.W||host.clientWidth,H=lay.H||host.clientHeight;const camPos=camera.position;const vis=new Set(APP.curFiltered());
    labelEls.forEach(L=>{tv.copy(L.v).project(camera);const dist=camPos.distanceTo(L.v);const on=tv.z<1&&vis.has(L.c)&&dist<5200&&!(APP.focusId===L.c.id);
      L.el.classList.toggle('hide',!on);if(on){L.el.style.transform=`translate(${(tv.x*.5+.5)*W}px,${(-tv.y*.5+.5)*H}px) translate(-50%,-100%) scale(${Math.max(.72,Math.min(1,900/dist))})`;L.el.style.zIndex=String(10000-Math.round(dist))}})}

  /* ---------- камера ---------- */
  let fly=null;const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
  function flyTo(target,dist,az,pol,dur=2){if(window.__LITE)dur=.01;const end=new THREE.Vector3(target.x+Math.sin(az)*Math.sin(pol)*dist,target.y+Math.cos(pol)*dist,target.z+Math.cos(az)*Math.sin(pol)*dist);
    fly={p0:camera.position.clone(),t0:controls.target.clone(),p1:end,t1:target.clone(),t:0,dur,arc:Math.min(220,camera.position.distanceTo(end)*.18)};controls.enabled=false}
  function lookAtWorld(x,y,dist){const t=new THREE.Vector3(x,gH(x,y)+4,-y);const off=camera.position.clone().sub(controls.target);const az=Math.atan2(off.x,off.z);flyTo(t,dist||off.length(),az,Math.min(1.15,Math.acos(off.y/off.length())),1.4)}
  /* ---------- выбор ---------- */
  const ray=new THREE.Raycaster(),mv=new THREE.Vector2();let down=null;
  function pickAt(e){const r=renderer.domElement.getBoundingClientRect();mv.set((e.clientX-r.left)/r.width*2-1,-((e.clientY-r.top)/r.height)*2+1);ray.setFromCamera(mv,camera);
    const hits=ray.intersectObjects([cityLow,cityTall,landGroup,ground].filter(o=>o&&o.visible),true).filter(h=>!h.object.userData.detail&&h.object.visible);if(!hits.length)return null;const h=hits[0];
    if(h.object===ground){return null}
    // детальная модель?
    for(const k in LM){let o=h.object;while(o){if(o===LM[k].g){const c=CUR.find(c=>c.id===k);return c?{type:'c',c}:(LM[k].fr&&DATA.buildings[LM[k].fr.bi]?{type:'b',b:DATA.buildings[LM[k].fr.bi]}:null)}o=o.parent}}
    if(h.object.userData.city){const id=Math.round(h.object.geometry.attributes.aw.getW(h.face.a));const b=DATA.buildings[id];if(!b)return null;const c=CUR.find(c=>c.b===id);return c?{type:'c',c}:{type:'b',b}}
    return null}
  function highlight(b){if(selLine){scene.remove(selLine);selLine.geometry.dispose();selLine=null}if(!b)return;const a=ringArr(b.rings[0]);const base=baseOf(a)-.5,top=base+b.h+.5;const v=[];
    for(let i=0;i<a.length;i++){const p=a[i],q=a[(i+1)%a.length];v.push(p[0],base,-p[1],q[0],base,-q[1],p[0],top,-p[1],q[0],top,-q[1],p[0],base,-p[1],p[0],top,-p[1])}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(v,3));selLine=new THREE.LineSegments(g,new THREE.LineBasicMaterial({color:0xDB7F33,depthTest:false,transparent:true}));selLine.renderOrder=10;scene.add(selLine)}
  /* ---------- погружение ---------- */
  function focusPlace(c){APP.focusId=c.id;theme=c.theme;const b=c.b!=null?DATA.buildings[c.b]:null;const h=gH(c.x,c.y);const size=b?Math.max(b.bb[2]-b.bb[0],b.bb[3]-b.bb[1]):30;
    let az=.6;const lm=LM[c.id];if(lm){az=Math.atan2(lm.fr.F[0],-lm.fr.F[1])+.5}
    flyTo(new THREE.Vector3(c.x,h+(b?b.h*.45:4),-c.y),Math.min(Math.max(48,size*2.3),c.dist||240),az,1.12,2.2);
    setParticles(THEMES[c.theme].p,new THREE.Vector3(c.x,h,-c.y));$('#frame').className='on '+THEMES[c.theme].frame;applyFilter();if(b)highlight(null)}
  function unfocus(){if(!APP.focusId)return;APP.focusId=null;theme=null;setParticles(null);$('#frame').className='';applyFilter()}
  let hist=false;function applyFilter(){const t=theme&&THEMES[theme].filter;renderer.domElement.style.filter=hist?'sepia(.85) contrast(1.05) brightness(.97)':t||''}
  function setHist(on){hist=on;applyFilter();cityTall.userData.target=on?0:1}
  /* ---------- инициализация ---------- */
  function webglOK(){try{const c=document.createElement('canvas');const g=c.getContext('webgl2')||c.getContext('webgl');if(!g)return 0;
    const d=g.getExtension('WEBGL_debug_renderer_info');const r=d?String(g.getParameter(d.UNMASKED_RENDERER_WEBGL)):'';const l=g.getExtension('WEBGL_lose_context');l&&l.loseContext();
    // программная отрисовка без видеокарты — 3D будет неработоспособно медленным
    if(/swiftshader|llvmpipe|softpipe|basic render|microsoft basic/i.test(r)&&!window.__LITE&&!/force3d/.test(location.hash))return 2;return 1}catch(e){return 0}}
  function init(onStep){if(inited)return;{const w=webglOK();if(w!==1){const e=new Error('WebGL недоступен');e.webgl=w===0;e.soft=w===2;throw e}}
    try{init0()}catch(e){try{renderer&&renderer.dispose();renderer&&renderer.forceContextLoss&&renderer.forceContextLoss();renderer&&renderer.domElement.remove()}catch(_){}renderer=null;throw e}inited=true}
  function init0(){
    renderer=new THREE.WebGLRenderer({antialias:(devicePixelRatio||1)<1.3,alpha:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));renderer.outputEncoding=THREE.sRGBEncoding;
    renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.86;renderer.shadowMap.enabled=!window.__LITE;renderer.shadowMap.type=THREE.PCFSoftShadowMap;host.appendChild(renderer.domElement);
    scene=new THREE.Scene();scene.fog=new THREE.Fog(0xD4E6EF,900,5200);
    camera=new THREE.PerspectiveCamera(42,1,2,12000);
    controls=new THREE.MapControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.09;controls.screenSpacePanning=false;controls.maxPolarAngle=1.42;controls.minDistance=12;controls.maxDistance=5200;
    hemi=new THREE.HemisphereLight(0xffffff,0x8f8a70,1);scene.add(hemi);sun=new THREE.DirectionalLight(0xffffff,2.4);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);
    Object.assign(sun.shadow.camera,{left:-420,right:420,top:420,bottom:-420,near:10,far:3000});sun.shadow.bias=-.0004;sun.shadow.normalBias=.6;scene.add(sun,sun.target);
    const TT={};const safe=(n,f)=>{const t0=performance.now();try{f()}catch(e){console.warn('3D: пропущено «'+n+'»',e)}TT[n]=Math.round(performance.now()-t0)};window.__TT=TT;
    safe('рельеф',prepElev);safe('земля',buildGround);safe('ориентиры',buildLandmarks);safe('склейка',mergeLandmarks);if(!landGroup){landGroup=new THREE.Group();scene.add(landGroup)}safe('город',buildCity);safe('мосты',buildBridges);safe('деревья',buildTrees);safe('подписи',buildLabels);
    renderer.domElement.addEventListener('webglcontextlost',ev=>{ev.preventDefault();toast('Видеокарта не справилась с 3D — переключаемся на 2D');setTimeout(()=>{try{APP.setMode&&APP.setMode('2d')}catch(_){};document.querySelector('#m2')&&document.querySelector('#m2').click()},50)});
    const W=host.clientWidth,H=host.clientHeight;renderer.setSize(W,H);camera.aspect=W/H;camera.updateProjectionMatrix();
    new ResizeObserver(()=>{const W=host.clientWidth,H=host.clientHeight;if(!W||!H)return;renderer.setSize(W,H);camera.aspect=W/H;camera.updateProjectionMatrix()}).observe(host);
    // стартовый вид: центр, смотрим с востока на Томь
    const c=M2.cam;controls.target.set(c.x,gH(c.x,c.y),-c.y);camera.position.set(c.x+420,gH(c.x,c.y)+430,-c.y+520);controls.update();streamCity(c.x,c.y,900,1e9);
    Object.assign(cur,toT(SKY.day,0));updateSky();
    renderer.domElement.addEventListener('pointerdown',e=>{down=[e.clientX,e.clientY];if(fly){fly=null;controls.enabled=true}APP.stopTour()});
    renderer.domElement.addEventListener('pointerup',e=>{if(!down||Math.hypot(e.clientX-down[0],e.clientY-down[1])>6)return;APP.select(pickAt(e))});
    let last=performance.now(),acc=0,chunkT=0,stillT=0,lastBg='',skip=0,fpsT=0,fpsN=0,goodT=0;const vo={x:0,y:0};const frus=new THREE.Frustum(),pm=new THREE.Matrix4();
    const lastCam=new THREE.Matrix4();
    // уровни качества: подстраиваемся под видеокарту
    const DPR=Math.min(devicePixelRatio||1,1.75);const QL=[{pr:Math.min(DPR,1.5),sh:true,lim:6000,tree:2400},{pr:1,sh:false,lim:4800,tree:1800},{pr:.85,sh:false,lim:3800,tree:1400},{pr:.7,sh:false,lim:3000,tree:1000},{pr:.55,sh:false,lim:2400,tree:700}];
    let qi=window.__LITE?1:(matchMedia('(pointer:coarse)').matches?2:1);try{const sv=localStorage.getItem('tomsk3dQ2');if(sv!==null&&+sv>=0&&+sv<QL.length)qi=+sv}catch(e){}let Q=QL[qi];
    const applyQ=()=>{Q=QL[qi];renderer.setPixelRatio(Q.pr);renderer.setSize(host.clientWidth,host.clientHeight,false);sun.castShadow=Q.sh;try{localStorage.setItem('tomsk3dQ2',qi)}catch(e){}};applyQ();
    const loop=now=>{requestAnimationFrame(loop);const rawDt=Math.max(0,(now-last)/1000);const dt=Math.min(.05,rawDt);last=now;if(APP.mode!=='3d')return;const t=now/1000;
      // замер скорости: если медленно — снижаем качество, если долго быстро — повышаем
      if(!window.__LITE&&document.visibilityState==='visible'&&skip===0){fpsT+=rawDt;fpsN++;if(fpsT>1.5){const fps=fpsN/fpsT;fpsT=0;fpsN=0;
        if(fps<40&&qi<QL.length-1){qi++;applyQ();goodT=0}else if(fps>58&&qi>0){goodT+=1.5;if(goodT>12){qi--;applyQ();goodT=0}}else goodT=0}}
      if(fly){fly.t+=dt/fly.dur;const k=ease(Math.min(1,fly.t));camera.position.lerpVectors(fly.p0,fly.p1,k);camera.position.y+=Math.sin(Math.PI*k)*fly.arc;controls.target.lerpVectors(fly.t0,fly.t1,k);if(fly.t>=1){fly=null;controls.enabled=true}}
      const e=DATA.ext;controls.target.x=Math.max(e[0],Math.min(e[2],controls.target.x));controls.target.z=Math.max(-e[3],Math.min(-e[1],controls.target.z));controls.update();
      acc+=dt;if(acc>2||window.__LITE){acc=0;updateSky()}
      const a=window.__LITE?1:1-Math.exp(-dt*2.4);KC.forEach(k=>cur[k]?cur[k].lerp(tgt[k],a):(cur[k]=tgt[k].clone()));KN.forEach(k=>cur[k]=(cur[k]||0)+((tgt[k]||0)-(cur[k]||0))*a);
      {const bg=`linear-gradient(#${cur.top.getHexString()},#${cur.bot.getHexString()} 75%)`;if(bg!==lastBg){lastBg=bg;host.style.background=bg}}scene.fog.color.copy(cur.fog);
      const dist=camera.position.distanceTo(controls.target);const visLim=Math.min(Math.max(2000,dist*2.8),Q.lim);scene.fog.near=Math.min(Math.max(600,dist*1.1),visLim*.45);scene.fog.far=Math.min(Math.max(3800,dist*3.6),visLim*.98);
      hemi.color.copy(cur.hs);hemi.groundColor.copy(cur.hg);hemi.intensity=cur.hi;sun.color.copy(cur.sc);sun.intensity=cur.si;
      sun.position.copy(sunDir).multiplyScalar(1200).add(controls.target);sun.target.position.copy(controls.target);
      const sz=Math.min(900,Math.max(160,dist*.9));if(Math.abs(sun.shadow.camera.right-sz)>20){Object.assign(sun.shadow.camera,{left:-sz,right:sz,top:sz,bottom:-sz});sun.shadow.camera.updateProjectionMatrix()}
      U.night.value=cur.night;lampPts.material.opacity=cur.night*.95;lampPts.material.size=8+Math.min(10,dist/120);
      beams.forEach((b,i)=>{b.material.opacity=(cur.beams||0)*.22;b.rotation.z=Math.sin(t*.9+i*2)*.4;b.rotation.x=Math.cos(t*.7+i)*.25});
      if(LM.flame){LM.flame.scale.set(1+Math.sin(t*9)*.08,1+Math.sin(t*7.3)*.18,1+Math.cos(t*8)*.08)}
      if(LM.wheel)LM.wheel.children.forEach((ch,i)=>{});
      if(cityTall.userData.target!=null){const s=cityTall.scale.y;const ns=s+(cityTall.userData.target-s)*Math.min(1,dt*3);cityTall.scale.y=Math.max(.001,ns);cityTall.visible=ns>.01}
      {if(!lay.t||now-lay.t>300){const card=document.getElementById('card');lay.t=now;lay.open=card.classList.contains('open');lay.W=host.clientWidth;lay.H=host.clientHeight;lay.cw=card.offsetWidth;lay.ch=card.offsetHeight}
        const Wd=lay.W,Hd=lay.H;let ox=0,oy=0;if(lay.open){if(Wd>760)ox=(lay.cw+12)/2;else oy=Math.min(lay.ch,Hd*.6)/2}
        vo.x+=(ox-vo.x)*Math.min(1,dt*4);vo.y+=(oy-vo.y)*Math.min(1,dt*4);if(window.__LITE){vo.x=ox;vo.y=oy}
        if(Math.abs(vo.x)>.5||Math.abs(vo.y)>.5)camera.setViewOffset(Wd,Hd,vo.x,vo.y,Wd,Hd);else camera.clearViewOffset()}
      {const tx=controls.target.x,ty=-controls.target.z;streamCity(tx,ty,Math.min(visLim,Q.lim),fly?3:7)}
      chunkT+=dt;if(chunkT>.25){chunkT=0;const tx=controls.target.x,ty=-controls.target.z;const lim=visLim,shR=sz+CHUNK*.8,cast=renderer.shadowMap.enabled&&sun.castShadow;
          chunks.forEach(ch=>{const d=Math.hypot(ch.cx-tx,ch.cy-ty),v=d<lim;ch.meshes.forEach(m=>{m.visible=v;m.castShadow=cast&&d<shR});ch.det.forEach(m=>{m.visible=d<Math.min(lim,900)&&dist<700;m.castShadow=cast&&d<shR})});
          frus.setFromProjectionMatrix(pm.multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse));
          const tl=Math.min(lim,Q.tree);treeCells.forEach(T=>{const v=Math.hypot(T.cx-tx,T.cy-ty)<tl&&frus.intersectsSphere(T.sph);T.meshes.forEach(m=>m.visible=v)});
          if(landGroup)landGroup.children.forEach(g=>{if(!g.userData.c){const b=new THREE.Box3().setFromObject(g);g.userData.c=b.isEmpty()?[0,0]:[(b.min.x+b.max.x)/2,-(b.min.z+b.max.z)/2]}g.visible=Math.hypot(g.userData.c[0]-tx,g.userData.c[1]-ty)<Math.min(lim,3200)});
        if(!fly&&lastPaint&&Math.hypot(tx-lastPaint[0],ty-lastPaint[1])>650){if(stillT>.5)repaintInner(tx,ty)}}
      if(fly)stillT=0;else stillT+=dt;
      stepParticles(dt,t);
      // в покое (камера стоит, ничего не летит) рисуем реже — меньше нагрев и тормоза интерфейса
      const moving=!lastCam.equals(camera.matrixWorld)||fly||pType||Math.abs(vo.x-(vo.px||0))>.3;lastCam.copy(camera.matrixWorld);vo.px=vo.x;
      if(moving)skip=0;else if(++skip%4!==1&&stillT>1.2)return;
      updateLabels();renderer.render(scene,camera)};
    requestAnimationFrame(loop)}
  window.__M3s=()=>{const o={};scene.traverse(m=>{if(!m.isMesh&&!m.isPoints&&!m.isLine)return;const k=(m.isInstancedMesh?'inst':m.userData.city?'city':m.userData.detail?'det':m.isPoints?'pts':'mesh')+(m.visible?'':'-hid')+(m.frustumCulled?'':'-nofc');o[k]=(o[k]||0)+1});return JSON.stringify(o)};
  window.__M3r=()=>{const t0=performance.now();renderer.render(scene,camera);const i=renderer.info.render;return{calls:i.calls,tris:i.triangles,ms:Math.round(performance.now()-t0),pr:renderer.getPixelRatio(),sh:renderer.shadowMap.enabled}};
  window.__M3dbg=()=>({cam:camera.position.toArray().map(Math.round),tgt:controls.target.toArray().map(Math.round),WL,BASE,g0:gH(-300,0),fog:[scene.fog.near,scene.fog.far,'#'+scene.fog.color.getHexString()],sun:[sun.intensity,sunDir.toArray()],hemi:hemi.intensity,night:U.night.value,exp:renderer.toneMappingExposure,info:renderer.info.render});
  return{init,get ready(){return inited},flyTo,lookAtWorld,focusPlace,unfocus,setHist,highlight,
    zoomBy(f){const off=camera.position.clone().sub(controls.target);const d=Math.max(15,Math.min(5200,off.length()*f));off.setLength(d);flyTo(controls.target.clone(),d,Math.atan2(off.x,off.z),Math.acos(off.y/d),.6)},
    setTime(m){timeMode=m;updateSky()},sync(){const c=M2.cam;if(!inited)return;const off=camera.position.clone().sub(controls.target);controls.target.set(c.x,gH(c.x,c.y),-c.y);
      const d=Math.max(160,Math.min(3200,700/c.s));off.setLength(d);camera.position.copy(controls.target).add(off);controls.update()},
    center(){return inited?[controls.target.x,-controls.target.z,camera.position.distanceTo(controls.target)]:null},
    sunsetTime(){return fmtMin(sunMinutes(new Date()).set)}}
})();
