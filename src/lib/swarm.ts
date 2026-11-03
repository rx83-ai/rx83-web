/* ------------------------------------------------------------------
   Enjambre: agentes autónomos con separación, alineación, cohesión y un
   objetivo por escuadra. Nadie los dirige desde afuera — la coordinación
   emerge de reglas locales.

   Vecinos por REJILLA ESPACIAL con tope por agente. Medido en Node:
   4.200 agentes cuestan 2,8 ms por paso; las vistas con cámara, 1,5.
   Presupuesto a 60 fps: 16,7 ms.

   La misma simulación se mira con tres cámaras:
     fija     · el campo entero, de fondo
     cluster  · sigue el centroide de una escuadra, de cerca
     agente   · montada sobre una unidad, rota con su rumbo
   Las dos últimas saltan de objetivo cada pocos segundos, y la embarcada
   puede saltar a una unidad de otra escuadra.

   Es una traducción directa del motor de output/landing-rx83/page.html:
   las dos versiones tienen que moverse juntas.
   ------------------------------------------------------------------ */
import { isStill } from "./motionState";

export type Camara = "fija" | "cluster" | "agente";

export type SwarmOpts = {
  grupos: number;
  densidad: number;
  max: number;
  tam: number;
  sep: number;
  ali: number;
  coh: number;
  tope: number;
  vel: number;
  fuerzaPtr: number;
  radioPtr: number;
  camara?: Camara;
  zoom?: number;
  corte?: number;
};

type Meta = { x: number; y: number };
type Flash = { x: number; y: number; v: number };

function crear(o: SwarmOpts) {
  let N = 0, W = 0, H = 0, ini = false;
  const GR = o.grupos;
  let x!: Float32Array, y!: Float32Array, vx!: Float32Array, vy!: Float32Array, g!: Uint8Array;
  let metas: Meta[] = [], flash: Flash[] = [];
  let CELDA = 0, cols = 0, filas = 0;
  let head!: Int32Array, next!: Int32Array;
  const modo = o.camara || 'fija', ZOOM = o.zoom || 1, CORTE = o.corte || 6;
  const cam = { x: 0, y: 0, z: 1, rot: 0, t: 0, idx: 0, grp: 0, etq: '', nueva: true };
  const ptr = { x: 0, y: 0, on: false };

  function meta(){ return {x:W*(0.08+Math.random()*0.84), y:H*(0.10+Math.random()*0.80)}; }
  function corto(d: number, L: number) { if(d>L/2) d-=L; else if(d<-L/2) d+=L; return d; }
  function envuelve(v: number, L: number) { v%=L; return v<0? v+L : v; }

  function resize(w: number, h: number) {
    if(ini && Math.abs(w-W)<2 && Math.abs(h-H)<2) return;   /* el RO dispara al mostrar/ocultar */
    W=w; H=h; ini=true;
    const dens = w < 760 ? o.densidad * 0.5 : o.densidad;
    N=Math.max(220, Math.min(o.max, Math.round(w*h*dens)));
    x=new Float32Array(N); y=new Float32Array(N);
    vx=new Float32Array(N); vy=new Float32Array(N); g=new Uint8Array(N);
    for(var i=0;i<N;i++){
      x[i]=Math.random()*W; y[i]=Math.random()*H;
      vx[i]=(Math.random()-.5)*o.vel; vy[i]=(Math.random()-.5)*o.vel; g[i]=i%GR;
    }
    metas=[]; for(var k=0;k<GR;k++) metas.push(meta());
    flash=[];
    CELDA=Math.max(16,o.coh);
    cols=Math.max(1,Math.ceil(W/CELDA)); filas=Math.max(1,Math.ceil(H/CELDA));
    head=new Int32Array(cols*filas); next=new Int32Array(N);
    cam.x=W/2; cam.y=H/2; cam.z=(modo==='fija')?1:ZOOM; cam.rot=0;
    if(modo!=='fija') nuevoObjetivo();
  }
  function reducir(){ if(N>420) N=Math.round(N*0.55); }
  function puntero(px: number, py: number, on: boolean) { ptr.x=px; ptr.y=py; ptr.on=on; }

  function nuevoObjetivo(){
    cam.t=0; cam.nueva=true;
    cam.z=ZOOM*1.5;                       /* arranca abierta y se asienta: lee como foco */
    if(modo==='agente'){
      cam.idx=Math.floor(Math.random()*N); cam.grp=g[cam.idx];
      cam.etq='unidad '+String(cam.idx).padStart(4,'0')+' · escuadra '+String(cam.grp+1).padStart(2,'0');
    } else {
      cam.grp=Math.floor(Math.random()*GR);
      cam.etq='escuadra '+String(cam.grp+1).padStart(2,'0')+' · '+GR+' en operación';
    }
  }
  /* Centroide en un toro: promediar coordenadas da el punto equivocado
     cuando la escuadra cruza un borde. Se promedia sobre el círculo. */
  function centroide(grupo: number) {
    var sx=0,cx=0,sy=0,cy=0,n=0, TAU=Math.PI*2;
    for(var i=0;i<N;i++){ if(g[i]!==grupo) continue;
      var ax=x[i]/W*TAU, ay=y[i]/H*TAU;
      cx+=Math.cos(ax); sx+=Math.sin(ax);
      cy+=Math.cos(ay); sy+=Math.sin(ay); n++;
    }
    if(!n) return {x:W/2,y:H/2};
    return { x: envuelve(Math.atan2(sx/n,cx/n)/TAU*W, W),
             y: envuelve(Math.atan2(sy/n,cy/n)/TAU*H, H) };
  }

  function camaraPaso(dt: number) {
    if(modo==='fija'){ cam.x=W/2; cam.y=H/2; cam.z=1; cam.rot=0; return; }
    cam.t+=dt;
    if(cam.t>CORTE) nuevoObjetivo();
    var tx,ty,trot=0;
    if(modo==='agente'){
      var i=Math.min(cam.idx,N-1);
      tx=x[i]; ty=y[i];
      trot=-Math.atan2(vy[i],vx[i])-Math.PI/2;   /* su rumbo apunta hacia arriba */
    } else {
      var c=centroide(cam.grp); tx=c.x; ty=c.y;
    }
    var kp=1-Math.pow(1-(modo==='agente'?0.22:0.08), dt*60);
    cam.x=envuelve(cam.x+corto(tx-cam.x,W)*kp, W);
    cam.y=envuelve(cam.y+corto(ty-cam.y,H)*kp, H);
    var dr=corto(trot-cam.rot, Math.PI*2);
    cam.rot+=dr*(1-Math.pow(1-0.05, dt*60));
    cam.z+=(ZOOM-cam.z)*(1-Math.pow(1-0.035, dt*60));
  }

  function step(dt: number) {
    if(!ini||!N) return;
    camaraPaso(dt);
    head.fill(-1);
    var i,j;
    for(i=0;i<N;i++){
      let cxi: number = x[i]/CELDA|0, cyi: number = y[i]/CELDA|0;
      if(cxi<0)cxi=0; if(cxi>=cols)cxi=cols-1;
      if(cyi<0)cyi=0; if(cyi>=filas)cyi=filas-1;
      var b=cyi*cols+cxi; next[i]=head[b]; head[b]=i;
    }
    /* puntero de pantalla a mundo: se deshace la cámara */
    var pmx=0,pmy=0;
    if(ptr.on){
      var sx=(ptr.x-W/2)/cam.z, sy=(ptr.y-H/2)/cam.z;
      var cr=Math.cos(-cam.rot), sr=Math.sin(-cam.rot);
      pmx=cam.x+(sx*cr-sy*sr); pmy=cam.y+(sx*sr+sy*cr);
    }
    var R=o.radioPtr||120, R2=R*R;
    var sep2=o.sep*o.sep, ali2=o.ali*o.ali, coh2=o.coh*o.coh;
    for(i=0;i<N;i++){
      var ssx=0,ssy=0,aax=0,aay=0,ccx=0,ccy=0,nA=0,nC=0,vistos=0;
      let gx: number = x[i]/CELDA|0, gy: number = y[i]/CELDA|0;
      if(gx<0)gx=0; if(gx>=cols)gx=cols-1;
      if(gy<0)gy=0; if(gy>=filas)gy=filas-1;
      for(var oy=-1;oy<=1 && vistos<o.tope;oy++){
        const yy: number = gy+oy; if(yy<0||yy>=filas) continue;
        for(var ox=-1;ox<=1 && vistos<o.tope;ox++){
          const xx: number = gx+ox; if(xx<0||xx>=cols) continue;
          for(j=head[yy*cols+xx]; j!==-1 && vistos<o.tope; j=next[j]){
            if(j===i||j>=N) continue;
            var dx=x[j]-x[i], dy=y[j]-y[i], d2=dx*dx+dy*dy;
            if(d2>coh2) continue;
            vistos++;
            if(d2<sep2){ ssx-=dx; ssy-=dy; }
            if(d2<ali2){ aax+=vx[j]; aay+=vy[j]; nA++; }
            if(g[j]===g[i]){ ccx+=x[j]; ccy+=y[j]; nC++; }
          }
        }
      }
      if(nA){ vx[i]+=(aax/nA-vx[i])*1.1*dt; vy[i]+=(aay/nA-vy[i])*1.1*dt; }
      if(nC){ vx[i]+=((ccx/nC)-x[i])*0.70*dt; vy[i]+=((ccy/nC)-y[i])*0.70*dt; }
      vx[i]+=ssx*3.0*dt; vy[i]+=ssy*3.0*dt;
      var m=metas[g[i]], mdx=m.x-x[i], mdy=m.y-y[i];
      var md=Math.sqrt(mdx*mdx+mdy*mdy)||1;
      vx[i]+=(mdx/md)*118*dt; vy[i]+=(mdy/md)*118*dt;
      /* el cursor aparta el enjambre: se abre a su paso y se cierra atrás */
      if(ptr.on){
        var px2=corto(x[i]-pmx,W), py2=corto(y[i]-pmy,H), pd2=px2*px2+py2*py2;
        if(pd2<R2 && pd2>0.01){
          var pd=Math.sqrt(pd2), fz=(1-pd2/R2);
          vx[i]+=(px2/pd)*o.fuerzaPtr*fz*dt; vy[i]+=(py2/pd)*o.fuerzaPtr*fz*dt;
        }
      }
      var v=Math.sqrt(vx[i]*vx[i]+vy[i]*vy[i])||1;
      if(v>o.vel){ vx[i]=vx[i]/v*o.vel; vy[i]=vy[i]/v*o.vel; }
      x[i]=envuelve(x[i]+vx[i]*dt, W); y[i]=envuelve(y[i]+vy[i]*dt, H);
    }
    var sX=new Float64Array(GR), sY=new Float64Array(GR), cn=new Int32Array(GR);
    for(i=0;i<N;i++){ var gg=g[i]; sX[gg]+=x[i]; sY[gg]+=y[i]; cn[gg]++; }
    for(var k=0;k<GR;k++){
      if(!cn[k]) continue;
      var mx=sX[k]/cn[k], my=sY[k]/cn[k], mm=metas[k];
      if(Math.hypot(mx-mm.x,my-mm.y)<26){ flash.push({x:mm.x,y:mm.y,v:1}); metas[k]=meta(); }
    }
    for(var f=flash.length-1;f>=0;f--){ flash[f].v-=dt*1.7; if(flash[f].v<=0) flash.splice(f,1); }
  }

  function draw(c: CanvasRenderingContext2D) {
    if(!ini||!N) return;
    var cs=getComputedStyle(document.documentElement);
    var tinta=(cs.getPropertyValue('--swarm-ink')||'244,244,246').trim();
    var azul=(cs.getPropertyValue('--brand-dot')||'#2E5BFF').trim();
    var tam=o.tam/Math.max(1,Math.pow(cam.z,0.55));   /* al acercarse no se vuelven bloques */
    var radio=Math.hypot(W,H)/(2*cam.z)+40;           /* descarte: lo de fuera no se recorre */
    c.save();
    c.translate(W/2,H/2); c.rotate(cam.rot); c.scale(cam.z,cam.z); c.translate(-cam.x,-cam.y);
    var niv=[0.92,0.70,0.52,0.38], n,k,dx,dy;
    for(n=0;n<4;n++){
      c.fillStyle='rgba('+tinta+','+niv[n]+')'; c.beginPath();
      for(k=0;k<N;k++){
        if((g[k]&3)!==n) continue;
        dx=corto(x[k]-cam.x,W); dy=corto(y[k]-cam.y,H);
        if(dx<-radio||dx>radio||dy<-radio||dy>radio) continue;
        c.rect(cam.x+dx-tam/2, cam.y+dy-tam/2, tam, tam);
      }
      c.fill();
    }
    var lado=12/Math.max(1,Math.pow(cam.z,0.6));
    c.strokeStyle=azul; c.lineWidth=1.2/Math.max(1,cam.z*0.6); c.beginPath();
    for(k=0;k<metas.length;k++){
      dx=corto(metas[k].x-cam.x,W); dy=corto(metas[k].y-cam.y,H);
      if(dx<-radio||dx>radio||dy<-radio||dy>radio) continue;
      c.rect(cam.x+dx-lado/2, cam.y+dy-lado/2, lado, lado);
    }
    c.stroke();
    c.fillStyle=azul; c.beginPath();
    for(k=0;k<metas.length;k++){
      dx=corto(metas[k].x-cam.x,W); dy=corto(metas[k].y-cam.y,H);
      if(dx<-radio||dx>radio||dy<-radio||dy>radio) continue;
      c.rect(cam.x+dx-tam*0.9, cam.y+dy-tam*0.9, tam*1.8, tam*1.8);
    }
    c.fill();
    for(k=0;k<flash.length;k++){
      var fo=flash[k], r=(1-fo.v)*38/Math.max(1,cam.z*0.5);
      dx=corto(fo.x-cam.x,W); dy=corto(fo.y-cam.y,H);
      c.strokeStyle='rgba(46,91,255,'+fo.v.toFixed(3)+')';
      c.lineWidth=1.3/Math.max(1,cam.z*0.6);
      c.strokeRect(cam.x+dx-r, cam.y+dy-r, r*2, r*2);
    }
    /* en cámara embarcada, la unidad que lleva la toma se marca */
    if(modo==='agente'){
      var i2=Math.min(cam.idx,N-1);
      c.strokeStyle=azul; c.lineWidth=1.4/Math.max(1,cam.z*0.6);
      var lr=tam*3.2;
      c.strokeRect(x[i2]-lr, y[i2]-lr, lr*2, lr*2);
    }
    c.restore();
  }

  return { resize, step, draw, reducir, puntero,
    etiqueta(): string | null { if (cam.nueva) { cam.nueva = false; return cam.etq; } return null; },
    info() { return { n: N, g: GR }; } };
}

/* ---------------- registro: un solo bucle para todos ---------------- */
type Entrada = { tick: (dt: number) => void; saltando: () => boolean };
const entradas: Entrada[] = [];
let bucle = false;

export function montarSwarm(
  canvas: HTMLCanvasElement,
  opts: SwarmOpts,
  hud?: HTMLElement | null,
): () => void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};
  const sim = crear(opts);
  let W = 0, H = 0, visible = true, muestras = 0, suma = 0, saltar = false;

  function size() {
    const r = canvas.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w2 = Math.round(r.width * dpr), h2 = Math.round(r.height * dpr);
    W = r.width; H = r.height;
    if (canvas.width === w2 && canvas.height === h2) return;  // reasignar width borra el lienzo
    canvas.width = w2; canvas.height = h2;
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    sim.resize(W, H);
  }
  function pinta(dt: number) {
    if (!W) return;
    const t0 = performance.now();
    sim.step(dt); ctx!.clearRect(0, 0, W, H); sim.draw(ctx!);
    if (hud) { const et = sim.etiqueta(); if (et) hud.textContent = et; }
    if (muestras < 120) {
      suma += performance.now() - t0;
      if (++muestras === 120) {
        const med = suma / 120;
        if (med > 9) saltar = true;      // equipo justo: la mitad de los pasos
        if (med > 15) sim.reducir();     // equipo lento: además menos población
      }
    }
  }

  const alSalir = () => sim.puntero(0, 0, false);
  const alMover = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    const dentro = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    sim.puntero(e.clientX - r.left, e.clientY - r.top, dentro);
  };
  canvas.addEventListener("pointerleave", alSalir);
  window.addEventListener("pointermove", alMover, { passive: true });

  size();
  const ro = new ResizeObserver(() => { size(); pinta(0); });
  ro.observe(canvas);
  pinta(0);                              // primer cuadro, síncrono

  const io = new IntersectionObserver((e) => { visible = e[0].isIntersecting; }, { rootMargin: "140px" });
  io.observe(canvas);

  const entrada: Entrada = { tick: (dt) => { if (visible) pinta(dt); }, saltando: () => saltar };
  entradas.push(entrada);

  if (isStill()) {
    pinta(0);                            // sin coreografía: un cuadro y quieto
  } else if (!bucle) {
    bucle = true;
    let ultimo = performance.now(), impar = false;
    const paso = (now: number) => {
      requestAnimationFrame(paso);
      const dt = Math.min(.05, (now - ultimo) / 1000); ultimo = now;
      impar = !impar;
      for (const e of entradas) if (!e.saltando() || impar) e.tick(dt);
    };
    requestAnimationFrame(paso);
  }

  return () => {
    ro.disconnect(); io.disconnect();
    canvas.removeEventListener("pointerleave", alSalir);
    window.removeEventListener("pointermove", alMover);
    const i = entradas.indexOf(entrada);
    if (i >= 0) entradas.splice(i, 1);
  };
}
