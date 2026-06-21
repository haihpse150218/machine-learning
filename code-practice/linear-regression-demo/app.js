/* ===== TAB SWITCHING ===== */
function switchTab(name) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
  document.getElementById('tab-content-' + name).classList.add('active');
  document.getElementById('tab-' + name).classList.add('active');
  if (name === 'theory') drawOLSAnim();
  if (name === 'gradient') { resetGD(); }
  if (name === 'overfitting') { ofInit(); }
}

/* ===== STATE ===== */
let points = [];
let mode = 'add';
let olsSlope = 0, olsIntercept = 0;
let manualSlope = 0, manualIntercept = 0;
let useManual = false;

/* ===== CANVAS SETUP ===== */
const canvas = document.getElementById('regCanvas');
const ctx = canvas.getContext('2d');
const W = canvas.width, H = canvas.height;
const PAD = 48;

/* data range */
let xMin = 0, xMax = 10, yMin = 0, yMax = 10;

function toCanvas(x, y) {
  return [
    PAD + (x - xMin) / (xMax - xMin) * (W - 2*PAD),
    H - PAD - (y - yMin) / (yMax - yMin) * (H - 2*PAD)
  ];
}
function fromCanvas(cx, cy) {
  return [
    xMin + (cx - PAD) / (W - 2*PAD) * (xMax - xMin),
    yMin + (H - PAD - cy) / (H - 2*PAD) * (yMax - yMin)
  ];
}

/* ===== OLS ===== */
function computeOLS(pts) {
  if (pts.length < 2) return { slope: 0, intercept: 0 };
  const n = pts.length;
  const mx = pts.reduce((s,p)=>s+p.x,0)/n;
  const my = pts.reduce((s,p)=>s+p.y,0)/n;
  const num = pts.reduce((s,p)=>s+(p.x-mx)*(p.y-my),0);
  const den = pts.reduce((s,p)=>s+(p.x-mx)**2,0);
  const slope = den===0 ? 0 : num/den;
  const intercept = my - slope*mx;
  return { slope, intercept };
}

function computeMetrics(pts, slope, intercept) {
  if (pts.length < 2) return null;
  const n = pts.length;
  const my = pts.reduce((s,p)=>s+p.y,0)/n;
  let ss_res=0, ss_tot=0, mae=0;
  for (const p of pts) {
    const yhat = slope*p.x + intercept;
    ss_res += (p.y-yhat)**2;
    ss_tot += (p.y-my)**2;
    mae += Math.abs(p.y-yhat);
  }
  const mse = ss_res/n;
  const r2 = ss_tot===0 ? 1 : 1 - ss_res/ss_tot;
  return { r2: Math.max(0,r2), mse, mae: mae/n };
}

/* ===== DRAW ===== */
function draw() {
  ctx.clearRect(0,0,W,H);
  drawGrid();
  const slope = useManual ? manualSlope : olsSlope;
  const intercept = useManual ? manualIntercept : olsIntercept;
  if (points.length >= 2) {
    drawResiduals(slope, intercept);
    drawRegressionLine(slope, intercept);
  }
  drawPoints();
  updateUI(slope, intercept);
  drawResidualChart(slope, intercept);
}

function drawGrid() {
  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx.lineWidth = 1;
  const steps = 10;
  for (let i=0; i<=steps; i++) {
    const x = PAD + i*(W-2*PAD)/steps;
    const y = PAD + i*(H-2*PAD)/steps;
    ctx.beginPath(); ctx.moveTo(x, PAD); ctx.lineTo(x, H-PAD); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(PAD, y); ctx.lineTo(W-PAD, y); ctx.stroke();
  }
  // Axes
  ctx.strokeStyle = 'rgba(255,255,255,0.2)';
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(PAD,PAD); ctx.lineTo(PAD,H-PAD); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(PAD,H-PAD); ctx.lineTo(W-PAD,H-PAD); ctx.stroke();
  // Labels
  ctx.fillStyle = 'rgba(148,163,184,0.7)';
  ctx.font = '11px Inter';
  ctx.textAlign = 'center';
  for (let i=0; i<=5; i++) {
    const v = xMin + i*(xMax-xMin)/5;
    const [cx] = toCanvas(v, yMin);
    ctx.fillText(v.toFixed(1), cx, H-PAD+16);
    const [,cy] = toCanvas(xMin, yMin + i*(yMax-yMin)/5);
    ctx.textAlign = 'right';
    ctx.fillText((yMin+i*(yMax-yMin)/5).toFixed(1), PAD-6, cy+4);
    ctx.textAlign = 'center';
  }
  ctx.fillStyle = 'rgba(148,163,184,0.9)';
  ctx.font = '12px Inter';
  ctx.fillText('x', W-PAD+16, H-PAD+4);
  ctx.textAlign = 'left';
  ctx.fillText('y', PAD-8, PAD-10);
}

function drawResiduals(slope, intercept) {
  for (const p of points) {
    const yhat = slope*p.x + intercept;
    const [cx, cy] = toCanvas(p.x, p.y);
    const [,cyhat] = toCanvas(p.x, yhat);
    const isPos = p.y > yhat;
    ctx.strokeStyle = isPos ? 'rgba(99,102,241,0.35)' : 'rgba(239,68,68,0.35)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3,3]);
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx, cyhat); ctx.stroke();
    ctx.setLineDash([]);
  }
}

function drawRegressionLine(slope, intercept) {
  const y1 = slope*xMin + intercept;
  const y2 = slope*xMax + intercept;
  const [x1c, y1c] = toCanvas(xMin, y1);
  const [x2c, y2c] = toCanvas(xMax, y2);
  const grad = ctx.createLinearGradient(x1c,0,x2c,0);
  grad.addColorStop(0,'rgba(99,102,241,0.9)');
  grad.addColorStop(1,'rgba(6,182,212,0.9)');
  ctx.strokeStyle = grad;
  ctx.lineWidth = 2.5;
  ctx.shadowColor = '#6366f1'; ctx.shadowBlur = 10;
  ctx.beginPath(); ctx.moveTo(x1c,y1c); ctx.lineTo(x2c,y2c); ctx.stroke();
  ctx.shadowBlur = 0;
}

function drawPoints() {
  for (const p of points) {
    const [cx, cy] = toCanvas(p.x, p.y);
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI*2);
    ctx.fillStyle = '#e2e8f0';
    ctx.fill();
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

/* ===== RESIDUAL CHART ===== */
const rcv = document.getElementById('residualCanvas');
const rctx = rcv.getContext('2d');
function drawResidualChart(slope, intercept) {
  const RW = rcv.width, RH = rcv.height;
  rctx.clearRect(0,0,RW,RH);
  if (points.length < 2) return;
  const residuals = points.map(p => ({ x: p.x, r: p.y - (slope*p.x+intercept) }));
  const maxR = Math.max(1, ...residuals.map(r=>Math.abs(r.r)));
  const RP = 32;
  rctx.strokeStyle = 'rgba(255,255,255,0.08)';
  rctx.lineWidth = 1;
  rctx.beginPath(); rctx.moveTo(RP, RH/2); rctx.lineTo(RW-RP, RH/2); rctx.stroke();
  for (const {x, r} of residuals) {
    const cx = RP + (x-xMin)/(xMax-xMin)*(RW-2*RP);
    const cy = RH/2 - (r/maxR)*(RH/2-RP);
    rctx.fillStyle = r>=0 ? 'rgba(99,102,241,0.8)' : 'rgba(239,68,68,0.8)';
    rctx.strokeStyle = r>=0 ? '#6366f1' : '#ef4444';
    rctx.lineWidth = 1.5;
    rctx.beginPath(); rctx.moveTo(cx, RH/2); rctx.lineTo(cx, cy); rctx.stroke();
    rctx.beginPath(); rctx.arc(cx, cy, 4, 0, Math.PI*2); rctx.fill();
  }
  rctx.fillStyle='rgba(148,163,184,0.6)'; rctx.font='11px Inter'; rctx.textAlign='center';
  rctx.fillText('0', RP-16, RH/2+4);
}

/* ===== UPDATE UI ===== */
function updateUI(slope, intercept) {
  const sEl = document.getElementById('eqSlope');
  const iEl = document.getElementById('eqIntercept');
  sEl.textContent = slope.toFixed(3);
  iEl.textContent = (intercept>=0?'+':'')+intercept.toFixed(3);
  sEl.style.transform = 'scale(1.1)'; setTimeout(()=>sEl.style.transform='',300);
  document.getElementById('nPoints').textContent = points.length;
  const m = computeMetrics(points, slope, intercept);
  if (m) {
    document.getElementById('r2Score').textContent = m.r2.toFixed(4);
    document.getElementById('mseScore').textContent = m.mse.toFixed(4);
    document.getElementById('maeScore').textContent = m.mae.toFixed(4);
    document.getElementById('r2Bar').style.width = (m.r2*100).toFixed(1)+'%';
    const r2el = document.getElementById('r2Score');
    r2el.style.color = m.r2>0.8?'#10b981':m.r2>0.5?'#f59e0b':'#ef4444';
  } else {
    ['r2Score','mseScore','maeScore'].forEach(id=>document.getElementById(id).textContent='—');
    document.getElementById('r2Bar').style.width='0%';
  }
  // sliders sync
  if (!useManual) {
    document.getElementById('slopeSlider').value = slope;
    document.getElementById('interceptSlider').value = intercept;
    document.getElementById('slopeVal').textContent = slope.toFixed(3);
    document.getElementById('interceptVal').textContent = intercept.toFixed(3);
  }
  predict();
}

/* ===== INTERACTION ===== */
canvas.addEventListener('click', e => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = W / rect.width;
  const scaleY = H / rect.height;
  const cx = (e.clientX - rect.left)*scaleX;
  const cy = (e.clientY - rect.top)*scaleY;
  const [x,y] = fromCanvas(cx,cy);
  if (x<xMin||x>xMax||y<yMin||y>yMax) return;
  if (mode==='add') {
    points.push({x,y});
    document.getElementById('canvasHint').style.opacity='0';
  } else {
    let minD=Infinity, minI=-1;
    points.forEach((p,i)=>{
      const [pcx,pcy]=toCanvas(p.x,p.y);
      const d=Math.hypot(pcx-cx,pcy-cy);
      if(d<minD){minD=d;minI=i;}
    });
    if(minI>=0 && minD<20) points.splice(minI,1);
  }
  recompute();
});

function recompute() {
  const r = computeOLS(points);
  olsSlope = r.slope; olsIntercept = r.intercept;
  if (!useManual) { manualSlope=olsSlope; manualIntercept=olsIntercept; }
  draw();
}

function setMode(m) {
  mode = m;
  document.getElementById('btn-add').classList.toggle('active', m==='add');
  document.getElementById('btn-remove').classList.toggle('active', m==='remove');
  canvas.style.cursor = m==='remove' ? 'not-allowed' : 'crosshair';
}

function clearPoints() {
  points=[];
  document.getElementById('canvasHint').style.opacity='1';
  recompute();
}

function manualUpdate() {
  useManual = true;
  manualSlope = parseFloat(document.getElementById('slopeSlider').value);
  manualIntercept = parseFloat(document.getElementById('interceptSlider').value);
  document.getElementById('slopeVal').textContent = manualSlope.toFixed(3);
  document.getElementById('interceptVal').textContent = manualIntercept.toFixed(3);
  draw();
}

function resetToOLS() {
  useManual = false;
  recompute();
}

function predict() {
  const xv = parseFloat(document.getElementById('predX').value);
  const slope = useManual ? manualSlope : olsSlope;
  const intercept = useManual ? manualIntercept : olsIntercept;
  if (isNaN(xv) || points.length < 2) {
    document.querySelector('.pred-eq').textContent='ŷ = ?'; return;
  }
  const yhat = slope*xv+intercept;
  document.querySelector('.pred-eq').textContent=`ŷ = ${yhat.toFixed(4)}`;
}

/* ===== PRESETS ===== */
function loadPreset(name) {
  const presets = {
    linear: Array.from({length:12},(_,i)=>({x:i*0.8+0.5,y:1.5*i*0.8+1+randn()*0.4})),
    noisy:  Array.from({length:14},(_,i)=>({x:i*0.7+0.3,y:i*0.7*0.8+2+randn()*2.5})),
    scattered: Array.from({length:16},()=>({x:rand(1,9),y:rand(1,9)})),
    salary: [
      {x:1,y:3.5},{x:2,y:4.0},{x:3,y:4.8},{x:4,y:5.5},{x:5,y:6.2},
      {x:6,y:7.0},{x:7,y:7.5},{x:8,y:8.3},{x:9,y:9.0},{x:10,y:9.8}
    ]
  };
  points = presets[name] || [];
  document.getElementById('canvasHint').style.opacity='0';
  useManual=false;
  recompute();
}
function randn(){let u=0,v=0;while(!u)u=Math.random();while(!v)v=Math.random();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);}
function rand(a,b){return a+Math.random()*(b-a);}

/* ===== OLS ANIMATION (Theory tab) ===== */
function drawOLSAnim() {
  const oc = document.getElementById('olsCanvas');
  const o = oc.getContext('2d');
  const OW=oc.width, OH=oc.height;
  const sample=[{x:1,y:2},{x:2,y:2.8},{x:3,y:4.5},{x:4,y:4.2},{x:5,y:6},{x:6,y:6.8},{x:7,y:7.5}];
  const OP=40;
  const ols=computeOLS(sample);
  o.clearRect(0,0,OW,OH);
  const tx=v=>OP+(v-0)/(8)*(OW-2*OP);
  const ty=v=>OH-OP-(v-0)/(10)*(OH-2*OP);
  // grid
  o.strokeStyle='rgba(255,255,255,0.05)'; o.lineWidth=1;
  for(let i=0;i<=8;i++){const x=tx(i);o.beginPath();o.moveTo(x,OP);o.lineTo(x,OH-OP);o.stroke();}
  for(let i=0;i<=10;i++){const y=ty(i);o.beginPath();o.moveTo(OP,y);o.lineTo(OW-OP,y);o.stroke();}
  // residual squares
  for(const p of sample){
    const yhat=ols.slope*p.x+ols.intercept;
    const r=Math.abs(p.y-yhat);
    const cx=tx(p.x); const cy1=ty(p.y); const cy2=ty(yhat);
    const sz=Math.abs(cy1-cy2);
    o.fillStyle=p.y>yhat?'rgba(99,102,241,0.12)':'rgba(239,68,68,0.12)';
    o.strokeStyle=p.y>yhat?'rgba(99,102,241,0.4)':'rgba(239,68,68,0.4)';
    o.lineWidth=1;
    o.fillRect(cx-sz,Math.min(cy1,cy2),sz,sz);
    o.strokeRect(cx-sz,Math.min(cy1,cy2),sz,sz);
  }
  // regression line
  const g=o.createLinearGradient(tx(0),0,tx(8),0);
  g.addColorStop(0,'rgba(99,102,241,0.9)'); g.addColorStop(1,'rgba(6,182,212,0.9)');
  o.strokeStyle=g; o.lineWidth=2.5;
  o.shadowColor='#6366f1'; o.shadowBlur=8;
  o.beginPath(); o.moveTo(tx(0),ty(ols.intercept)); o.lineTo(tx(8),ty(ols.slope*8+ols.intercept)); o.stroke();
  o.shadowBlur=0;
  // points
  for(const p of sample){
    o.beginPath(); o.arc(tx(p.x),ty(p.y),6,0,Math.PI*2);
    o.fillStyle='#e2e8f0'; o.fill();
    o.strokeStyle='#6366f1'; o.lineWidth=2; o.stroke();
  }
}

/* ===== GRADIENT DESCENT TAB ===== */
const gdCanvas=document.getElementById('gdCanvas');
const gdCtx=gdCanvas.getContext('2d');
const GW=gdCanvas.width, GH=gdCanvas.height;
const lcv=document.getElementById('lossCanvas');
const lctx=lcv.getContext('2d');

let gdPoints=[], gdB0=0, gdB1=0, gdLR=0.01, gdEpochs=200, gdRunning=false, lossHistory=[], gdDelay=300;

function resetGD(){
  gdRunning=false;
  gdPoints=[{x:1,y:2.1},{x:2,y:3.0},{x:3,y:4.8},{x:4,y:4.5},{x:5,y:6.2},{x:6,y:6.9},{x:7,y:8.1},{x:8,y:8.8}];
  gdB0=0; gdB1=0; lossHistory=[];
  document.getElementById('gdEpoch').textContent='0';
  document.getElementById('gdB0').textContent='0.000';
  document.getElementById('gdB1').textContent='0.000';
  document.getElementById('gdLoss').textContent='—';
  document.getElementById('gdRunBtn').textContent='▶ Chạy';
  drawGD();
}
function updateSpeed(){
  const v=parseInt(document.getElementById('speedSlider').value);
  // slider: 1 (nhanh) → 1000 (chậm), map ngược lại
  gdDelay=v;
  const label=v>=800?'Rất chậm':v>=400?'Chậm':v>=150?'Vừa':'Nhanh';
  document.getElementById('speedVal').textContent=label+' ('+v+'ms)';
}

function updateLR(){ gdLR=parseFloat(document.getElementById('lrSlider').value); document.getElementById('lrVal').textContent=gdLR.toFixed(3); }
function updateEpochs(){ gdEpochs=parseInt(document.getElementById('epochSlider').value); document.getElementById('epochVal').textContent=gdEpochs; }

function gdStep(){
  const n=gdPoints.length;
  let dB0=0,dB1=0,loss=0;
  for(const p of gdPoints){
    const err=gdB0+gdB1*p.x-p.y;
    dB0+=err; dB1+=err*p.x; loss+=err*err;
  }
  gdB0-=gdLR*(dB0/n);
  gdB1-=gdLR*(dB1/n);
  lossHistory.push(loss/n);
}

async function runGD(){
  if(gdRunning){gdRunning=false;document.getElementById('gdRunBtn').textContent='▶ Chạy';return;}
  gdRunning=true; gdB0=0; gdB1=0; lossHistory=[];
  document.getElementById('gdRunBtn').textContent='⏹ Stop';
  for(let e=0;e<gdEpochs;e++){
    if(!gdRunning) break;
    gdStep();
    document.getElementById('gdB0').textContent=gdB0.toFixed(4);
    document.getElementById('gdB1').textContent=gdB1.toFixed(4);
    document.getElementById('gdLoss').textContent=lossHistory[lossHistory.length-1].toFixed(4);
    document.getElementById('gdEpoch').textContent=e+1;
    drawGD();
    drawLoss();
    await new Promise(r=>setTimeout(r,gdDelay));
  }
  gdRunning=false;
  document.getElementById('gdRunBtn').textContent='▶ Chạy';
}

function drawGD(){
  gdCtx.clearRect(0,0,GW,GH);
  const GP=44;
  const xs=gdPoints.map(p=>p.x), ys=gdPoints.map(p=>p.y);
  const xmn=Math.min(...xs)-0.5, xmx=Math.max(...xs)+0.5;
  const ymn=Math.min(...ys)-1, ymx=Math.max(...ys)+1;
  const tx=v=>GP+(v-xmn)/(xmx-xmn)*(GW-2*GP);
  const ty=v=>GH-GP-(v-ymn)/(ymx-ymn)*(GH-2*GP);
  // grid
  gdCtx.strokeStyle='rgba(255,255,255,0.05)'; gdCtx.lineWidth=1;
  for(let i=0;i<=8;i++){const x=tx(xmn+i*(xmx-xmn)/8);gdCtx.beginPath();gdCtx.moveTo(x,GP);gdCtx.lineTo(x,GH-GP);gdCtx.stroke();}
  for(let i=0;i<=6;i++){const y=ty(ymn+i*(ymx-ymn)/6);gdCtx.beginPath();gdCtx.moveTo(GP,y);gdCtx.lineTo(GW-GP,y);gdCtx.stroke();}
  // line
  if(lossHistory.length>0){
    const g=gdCtx.createLinearGradient(tx(xmn),0,tx(xmx),0);
    g.addColorStop(0,'rgba(139,92,246,0.9)'); g.addColorStop(1,'rgba(6,182,212,0.9)');
    gdCtx.strokeStyle=g; gdCtx.lineWidth=2.5;
    gdCtx.shadowColor='#8b5cf6'; gdCtx.shadowBlur=8;
    gdCtx.beginPath(); gdCtx.moveTo(tx(xmn),ty(gdB0+gdB1*xmn)); gdCtx.lineTo(tx(xmx),ty(gdB0+gdB1*xmx)); gdCtx.stroke();
    gdCtx.shadowBlur=0;
  }
  // residuals
  for(const p of gdPoints){
    const yhat=gdB0+gdB1*p.x;
    gdCtx.strokeStyle='rgba(139,92,246,0.3)'; gdCtx.lineWidth=1.5; gdCtx.setLineDash([3,3]);
    gdCtx.beginPath(); gdCtx.moveTo(tx(p.x),ty(p.y)); gdCtx.lineTo(tx(p.x),ty(yhat)); gdCtx.stroke();
    gdCtx.setLineDash([]);
  }
  // points
  for(const p of gdPoints){
    gdCtx.beginPath(); gdCtx.arc(tx(p.x),ty(p.y),6,0,Math.PI*2);
    gdCtx.fillStyle='#e2e8f0'; gdCtx.fill();
    gdCtx.strokeStyle='#8b5cf6'; gdCtx.lineWidth=2; gdCtx.stroke();
  }
}

function drawLoss(){
  const LW=lcv.width, LH=lcv.height;
  lctx.clearRect(0,0,LW,LH);
  if(lossHistory.length<2) return;
  const lp=16;
  const maxL=Math.max(...lossHistory);
  lctx.strokeStyle='rgba(255,255,255,0.07)'; lctx.lineWidth=1;
  lctx.beginPath(); lctx.moveTo(lp,LH/2); lctx.lineTo(LW-lp,LH/2); lctx.stroke();
  const g=lctx.createLinearGradient(0,0,LW,0);
  g.addColorStop(0,'rgba(239,68,68,0.9)'); g.addColorStop(1,'rgba(16,185,129,0.9)');
  lctx.strokeStyle=g; lctx.lineWidth=2;
  lctx.beginPath();
  lossHistory.forEach((l,i)=>{
    const x=lp+i/(lossHistory.length-1)*(LW-2*lp);
    const y=LH-lp-(l/maxL)*(LH-2*lp);
    i===0?lctx.moveTo(x,y):lctx.lineTo(x,y);
  });
  lctx.stroke();
  lctx.fillStyle='rgba(148,163,184,0.6)'; lctx.font='10px Inter';
  lctx.textAlign='left'; lctx.fillText('High',lp,lp+8);
  lctx.fillText('Low',lp,LH-lp);
}

/* ===== INIT ===== */
setMode('add');
loadPreset('salary');
resetGD();

/* =====================================================
   OVERFITTING MODULE
   ===================================================== */

/* ----- State ----- */
let ofDegree = 1;
let ofNoise  = 0.3;
let ofNTrain = 20;
let ofTrainPts = [], ofTestPts = [];
let ofErrorHistory = [];  // [{degree, trainMSE, testMSE}]
let ofInited = false;

/* ----- Canvas refs ----- */
const ofCv  = document.getElementById('ofCanvas');
const ofCtx = ofCv.getContext('2d');
const OFW = ofCv.width, OFH = ofCv.height;
const ofErrCv  = document.getElementById('ofErrorCanvas');
const ofErrCtx = ofErrCv.getContext('2d');
const OERW = ofErrCv.width, OERH = ofErrCv.height;

/* ----- True underlying function ----- */
function ofTrueFn(x) {
  // sin wave: y = sin(2x) normalised to [0,10] range
  return 5 + 3.2 * Math.sin(x * 1.1 - 0.6);
}

/* ----- Generate data ----- */
function ofGenData() {
  const nTotal = ofNTrain + 12;  // 12 test points always
  const allPts = [];
  for (let i = 0; i < nTotal; i++) {
    const x = 0.5 + (i / (nTotal - 1)) * 9.0 + (Math.random() - 0.5) * 0.3;
    const y = ofTrueFn(x) + randn() * ofNoise * 3;
    allPts.push({ x, y });
  }
  // shuffle and split
  shuffle(allPts);
  ofTrainPts = allPts.slice(0, ofNTrain);
  ofTestPts  = allPts.slice(ofNTrain);
  // sort by x for nicer display
  ofTrainPts.sort((a,b) => a.x - b.x);
  ofTestPts.sort((a,b) => a.x - b.x);
  // recompute error history for all degrees 1-15
  ofComputeAllErrors();
  ofRender();
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

/* ----- Polynomial regression via normal equations ----- */
function ofPolyFit(pts, deg) {
  const n = pts.length;
  if (n <= deg) return null;
  // Build Vandermonde matrix X (n × deg+1)
  const d = deg + 1;
  // Use numeric.js-style manual implementation
  // Form X^T X and X^T y
  const XtX = Array.from({length: d}, () => new Array(d).fill(0));
  const Xty = new Array(d).fill(0);
  for (const p of pts) {
    const row = Array.from({length: d}, (_, k) => Math.pow(p.x, k));
    for (let i = 0; i < d; i++) {
      Xty[i] += row[i] * p.y;
      for (let j = 0; j < d; j++) XtX[i][j] += row[i] * row[j];
    }
  }
  // Gaussian elimination with partial pivoting
  const coeffs = gaussSolve(XtX, Xty);
  return coeffs;
}

function gaussSolve(A, b) {
  const n = A.length;
  const M = A.map((row, i) => [...row, b[i]]);
  for (let col = 0; col < n; col++) {
    // find pivot
    let maxRow = col;
    for (let row = col+1; row < n; row++) {
      if (Math.abs(M[row][col]) > Math.abs(M[maxRow][col])) maxRow = row;
    }
    [M[col], M[maxRow]] = [M[maxRow], M[col]];
    if (Math.abs(M[col][col]) < 1e-14) return null;
    for (let row = col+1; row < n; row++) {
      const f = M[row][col] / M[col][col];
      for (let k = col; k <= n; k++) M[row][k] -= f * M[col][k];
    }
  }
  const x = new Array(n).fill(0);
  for (let i = n-1; i >= 0; i--) {
    x[i] = M[i][n] / M[i][i];
    for (let k = i-1; k >= 0; k--) M[k][n] -= M[k][i] * x[i];
  }
  return x;
}

function ofEval(coeffs, x) {
  if (!coeffs) return NaN;
  return coeffs.reduce((s, c, k) => s + c * Math.pow(x, k), 0);
}

function ofMSE(coeffs, pts) {
  if (!coeffs || pts.length === 0) return Infinity;
  return pts.reduce((s, p) => s + (p.y - ofEval(coeffs, p.x))**2, 0) / pts.length;
}

function ofR2(coeffs, pts) {
  if (!coeffs || pts.length < 2) return NaN;
  const my = pts.reduce((s,p) => s+p.y, 0) / pts.length;
  const ss_tot = pts.reduce((s,p) => s + (p.y - my)**2, 0);
  const ss_res = pts.reduce((s,p) => s + (p.y - ofEval(coeffs, p.x))**2, 0);
  return ss_tot === 0 ? 1 : 1 - ss_res / ss_tot;
}

/* ----- Compute errors for all degrees 1-15 ----- */
function ofComputeAllErrors() {
  ofErrorHistory = [];
  for (let d = 1; d <= 15; d++) {
    const coeffs = ofPolyFit(ofTrainPts, d);
    const trainMSE = ofMSE(coeffs, ofTrainPts);
    const testMSE  = ofMSE(coeffs, ofTestPts);
    ofErrorHistory.push({ degree: d, trainMSE: isFinite(trainMSE) ? trainMSE : 99, testMSE: isFinite(testMSE) ? testMSE : 99 });
  }
}

/* ----- Determine status ----- */
function ofStatus(degree, trainMSE, testMSE) {
  const gap = testMSE - trainMSE;
  const relGap = gap / (trainMSE + 0.001);
  if (degree <= 2) return 'underfit';
  if (relGap > 0.8 || degree >= 9) return 'overfit';
  return 'goodfit';
}

/* ----- Update banner & badge ----- */
function ofUpdateBanner(degree, trainMSE, testMSE) {
  const status = ofStatus(degree, trainMSE, testMSE);
  const banner = document.getElementById('ofBanner');
  const icon   = document.getElementById('ofBannerIcon');
  const title  = document.getElementById('ofBannerTitle');
  const sub    = document.getElementById('ofBannerSub');
  const badge  = document.getElementById('ofDegreeBadge');
  banner.className = 'of-banner ' + status;
  badge.className  = 'of-degree-badge ' + status;
  badge.textContent = degree;
  if (status === 'underfit') {
    icon.textContent  = '📉';
    title.textContent = `Degree ${degree} — UNDERFITTING`;
    sub.textContent   = 'Mô hình quá đơn giản. Bias cao, Variance thấp. Cả train và test error đều cao.';
  } else if (status === 'goodfit') {
    icon.textContent  = '✅';
    title.textContent = `Degree ${degree} — GOOD FIT`;
    sub.textContent   = 'Mô hình cân bằng tốt. Tổng quát hoá được trên dữ liệu mới.';
  } else {
    icon.textContent  = '🔥';
    title.textContent = `Degree ${degree} — OVERFITTING`;
    sub.textContent   = 'Mô hình quá phức tạp. Train error thấp nhưng Test error tăng vọt — không tổng quát được!';
  }
}

/* ----- Main render ----- */
function ofRender() {
  const coeffs = ofPolyFit(ofTrainPts, ofDegree);
  const trainMSE = ofMSE(coeffs, ofTrainPts);
  const testMSE  = ofMSE(coeffs, ofTestPts);
  const trainR2  = ofR2(coeffs, ofTrainPts);
  const testR2   = ofR2(coeffs, ofTestPts);
  const gap = testMSE - trainMSE;

  ofUpdateBanner(ofDegree, trainMSE, testMSE);
  ofUpdateMetrics(trainMSE, testMSE, trainR2, testR2, gap);
  ofUpdateFormula(coeffs, ofDegree);
  ofDrawMain(coeffs);
  ofDrawErrorCurve();
}

function ofUpdateMetrics(trainMSE, testMSE, trainR2, testR2, gap) {
  const fmt = v => isFinite(v) ? v.toFixed(4) : '∞';
  document.getElementById('ofTrainMSE').textContent = fmt(trainMSE);
  document.getElementById('ofTestMSE').textContent  = fmt(testMSE);
  document.getElementById('ofTrainR2').textContent  = isFinite(trainR2) ? trainR2.toFixed(4) : '—';
  document.getElementById('ofTestR2').textContent   = isFinite(testR2)  ? testR2.toFixed(4)  : '—';
  const gapEl = document.getElementById('ofGap');
  gapEl.textContent = isFinite(gap) ? fmt(gap) : '—';
  gapEl.style.color = gap > 1 ? 'var(--red)' : gap > 0.2 ? 'var(--orange)' : 'var(--green)';
}

function ofUpdateFormula(coeffs, deg) {
  const el = document.getElementById('ofFormula');
  if (!coeffs) { el.textContent = 'ŷ = (không đủ dữ liệu)'; return; }
  let parts = ['ŷ ='];
  for (let k = deg; k >= 0; k--) {
    const c = coeffs[k];
    if (Math.abs(c) < 1e-6 && k > 0) continue;
    const sign = c >= 0 ? (k < deg ? ' + ' : ' ') : ' − ';
    const val  = Math.abs(c).toFixed(3);
    const term = k === 0 ? val : k === 1 ? `${val}x` : `${val}x^${k}`;
    parts.push(sign + term);
  }
  el.textContent = parts.join('');
}

/* ----- Draw main scatter + curve ----- */
function ofDrawMain(coeffs) {
  const OFP = 44;
  ofCtx.clearRect(0, 0, OFW, OFH);

  // axis ranges
  const allPts = [...ofTrainPts, ...ofTestPts];
  const xs = allPts.map(p => p.x), ys = allPts.map(p => p.y);
  const xmn = Math.min(...xs) - 0.3, xmx = Math.max(...xs) + 0.3;
  const ymn = Math.min(...ys) - 0.8, ymx = Math.max(...ys) + 0.8;

  const tx = v => OFP + (v - xmn) / (xmx - xmn) * (OFW - 2*OFP);
  const ty = v => OFH - OFP - (v - ymn) / (ymx - ymn) * (OFH - 2*OFP);

  // grid
  ofCtx.strokeStyle = 'rgba(255,255,255,0.04)'; ofCtx.lineWidth = 1;
  for (let i = 0; i <= 10; i++) {
    const x = OFP + i*(OFW-2*OFP)/10;
    const y = OFP + i*(OFH-2*OFP)/10;
    ofCtx.beginPath(); ofCtx.moveTo(x, OFP); ofCtx.lineTo(x, OFH-OFP); ofCtx.stroke();
    ofCtx.beginPath(); ofCtx.moveTo(OFP, y); ofCtx.lineTo(OFW-OFP, y); ofCtx.stroke();
  }
  // axes
  ofCtx.strokeStyle = 'rgba(255,255,255,0.18)'; ofCtx.lineWidth = 1.5;
  ofCtx.beginPath(); ofCtx.moveTo(OFP, OFP); ofCtx.lineTo(OFP, OFH-OFP); ofCtx.stroke();
  ofCtx.beginPath(); ofCtx.moveTo(OFP, OFH-OFP); ofCtx.lineTo(OFW-OFP, OFH-OFP); ofCtx.stroke();

  // True function (faint reference)
  ofCtx.strokeStyle = 'rgba(148,163,184,0.2)'; ofCtx.lineWidth = 1.5; ofCtx.setLineDash([5,5]);
  ofCtx.beginPath();
  for (let px = 0; px <= OFW - 2*OFP; px++) {
    const xv = xmn + (px / (OFW - 2*OFP)) * (xmx - xmn);
    const yv = ofTrueFn(xv);
    const cx = OFP + px, cy = ty(yv);
    px === 0 ? ofCtx.moveTo(cx, cy) : ofCtx.lineTo(cx, cy);
  }
  ofCtx.stroke(); ofCtx.setLineDash([]);

  // Polynomial fit curve
  if (coeffs) {
    const status = ofStatus(ofDegree, ofMSE(coeffs, ofTrainPts), ofMSE(coeffs, ofTestPts));
    const colors = { underfit: ['#f59e0b','#fbbf24'], goodfit: ['#10b981','#34d399'], overfit: ['#ef4444','#f87171'] };
    const [c1, c2] = colors[status];
    const grad = ofCtx.createLinearGradient(OFP, 0, OFW-OFP, 0);
    grad.addColorStop(0, c1 + 'dd'); grad.addColorStop(1, c2 + 'dd');
    ofCtx.strokeStyle = grad; ofCtx.lineWidth = 2.5;
    ofCtx.shadowColor = c1; ofCtx.shadowBlur = 12;
    ofCtx.beginPath();
    let first = true;
    for (let px = 0; px <= OFW - 2*OFP; px++) {
      const xv = xmn + (px / (OFW - 2*OFP)) * (xmx - xmn);
      const yv = ofEval(coeffs, xv);
      if (!isFinite(yv) || yv < ymn - 5 || yv > ymx + 5) { first = true; continue; }
      const cx = OFP + px, cy = ty(yv);
      first ? ofCtx.moveTo(cx, cy) : ofCtx.lineTo(cx, cy);
      first = false;
    }
    ofCtx.stroke();
    ofCtx.shadowBlur = 0;
  }

  // Test points (orange, square)
  for (const p of ofTestPts) {
    const cx = tx(p.x), cy = ty(p.y);
    ofCtx.fillStyle = 'rgba(245,158,11,0.9)';
    ofCtx.strokeStyle = '#fbbf24'; ofCtx.lineWidth = 1.5;
    ofCtx.beginPath();
    ofCtx.rect(cx - 5, cy - 5, 10, 10);
    ofCtx.fill(); ofCtx.stroke();
  }

  // Train points (indigo, circle)
  for (const p of ofTrainPts) {
    const cx = tx(p.x), cy = ty(p.y);
    ofCtx.beginPath(); ofCtx.arc(cx, cy, 5.5, 0, Math.PI*2);
    ofCtx.fillStyle = 'rgba(99,102,241,0.85)';
    ofCtx.strokeStyle = '#818cf8'; ofCtx.lineWidth = 1.5;
    ofCtx.fill(); ofCtx.stroke();
  }

  // Legend on canvas
  ofCtx.font = '11px Inter'; ofCtx.fillStyle = 'rgba(148,163,184,0.7)';
  ofCtx.textAlign = 'left';
  ofCtx.fillText('— Hàm thực (tham chiếu)', OFP+8, OFH-OFP-12);
}

/* ----- Draw error curve ----- */
function ofDrawErrorCurve() {
  const P = 44;
  ofErrCtx.clearRect(0, 0, OERW, OERH);
  if (ofErrorHistory.length === 0) return;

  const trainVals = ofErrorHistory.map(e => e.trainMSE);
  const testVals  = ofErrorHistory.map(e => e.testMSE);
  const maxE = Math.min(Math.max(...trainVals, ...testVals) * 1.1, 50);
  const minE = 0;
  const degrees = ofErrorHistory.length;

  const tx = i => P + (i / (degrees - 1)) * (OERW - 2*P);
  const ty = v => OERH - P - (Math.min(v, maxE) / (maxE - minE)) * (OERH - 2*P);

  // grid
  ofErrCtx.strokeStyle = 'rgba(255,255,255,0.05)'; ofErrCtx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = P + i*(OERH-2*P)/4;
    ofErrCtx.beginPath(); ofErrCtx.moveTo(P, y); ofErrCtx.lineTo(OERW-P, y); ofErrCtx.stroke();
  }
  for (let i = 0; i < degrees; i++) {
    const x = tx(i);
    ofErrCtx.beginPath(); ofErrCtx.moveTo(x, P); ofErrCtx.lineTo(x, OERH-P); ofErrCtx.stroke();
  }

  // Highlight current degree column
  const curX = tx(ofDegree - 1);
  ofErrCtx.fillStyle = 'rgba(255,255,255,0.04)';
  ofErrCtx.fillRect(curX - 14, P, 28, OERH - 2*P);

  // Train MSE line (indigo)
  ofErrCtx.strokeStyle = '#6366f1'; ofErrCtx.lineWidth = 2;
  ofErrCtx.shadowColor = '#6366f1'; ofErrCtx.shadowBlur = 6;
  ofErrCtx.beginPath();
  ofErrorHistory.forEach((e, i) => {
    const x = tx(i), y = ty(e.trainMSE);
    i === 0 ? ofErrCtx.moveTo(x,y) : ofErrCtx.lineTo(x,y);
  });
  ofErrCtx.stroke();

  // Test MSE line (orange)
  ofErrCtx.strokeStyle = '#f59e0b'; ofErrCtx.lineWidth = 2;
  ofErrCtx.shadowColor = '#f59e0b'; ofErrCtx.shadowBlur = 6;
  ofErrCtx.beginPath();
  ofErrorHistory.forEach((e, i) => {
    const x = tx(i), y = ty(e.testMSE);
    i === 0 ? ofErrCtx.moveTo(x,y) : ofErrCtx.lineTo(x,y);
  });
  ofErrCtx.stroke();
  ofErrCtx.shadowBlur = 0;

  // Dots on current degree
  const curEntry = ofErrorHistory[ofDegree - 1];
  [[curEntry.trainMSE,'#818cf8'],[curEntry.testMSE,'#fbbf24']].forEach(([v,c]) => {
    ofErrCtx.beginPath(); ofErrCtx.arc(curX, ty(v), 5, 0, Math.PI*2);
    ofErrCtx.fillStyle = c; ofErrCtx.fill();
    ofErrCtx.strokeStyle = '#fff'; ofErrCtx.lineWidth = 1.5; ofErrCtx.stroke();
  });

  // X axis labels
  ofErrCtx.fillStyle = 'rgba(148,163,184,0.6)'; ofErrCtx.font = '11px Inter'; ofErrCtx.textAlign = 'center';
  for (let i = 0; i < degrees; i++) {
    if ((i+1) % 2 === 1)
      ofErrCtx.fillText(i+1, tx(i), OERH - P + 14);
  }
  ofErrCtx.textAlign = 'left';
  ofErrCtx.fillText('Degree →', P, OERH - P + 14);

  // Y axis label
  ofErrCtx.save(); ofErrCtx.translate(12, P + (OERH - 2*P)/2);
  ofErrCtx.rotate(-Math.PI/2); ofErrCtx.textAlign = 'center';
  ofErrCtx.fillText('MSE', 0, 0);
  ofErrCtx.restore();
}

/* ----- Controls ----- */
function ofUpdateDegree() {
  ofDegree = parseInt(document.getElementById('ofDegreeSlider').value);
  ofRender();
}

function ofChangeNoise() {
  ofNoise = parseFloat(document.getElementById('ofNoiseSlider').value);
  document.getElementById('ofNoiseVal').textContent = ofNoise.toFixed(2);
  ofGenData();
}

function ofChangeNTrain() {
  ofNTrain = parseInt(document.getElementById('ofNTrainSlider').value);
  document.getElementById('ofNTrainVal').textContent = ofNTrain;
  ofGenData();
}

/* ----- Init ----- */
function ofInit() {
  if (!ofInited) {
    ofInited = true;
    ofGenData();
  } else {
    ofRender();
  }
}

