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
    safe('красная мечеть',()=>{const fr=frameFor(3085,'Трифонова');LMSKIP.add(3085);const g=new THREE.Group();const W=fr.W,D=fr.D;const brick='#A3442E',trim='#EAD4AE',green='#2F7D57';
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
