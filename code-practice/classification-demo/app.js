"use strict";
/* ============================================================
   Phân loại tương tác — Logistic (nhị phân) & Softmax (đa lớp)
   Toán tự cài (giống 2 notebook), vanilla JS + canvas.
   ============================================================ */

// ----- hằng số chung -----
const DOMAIN = { min: 0, max: 10 };        // miền dữ liệu x1,x2
const PAD = { l: 44, r: 14, t: 14, b: 30 };
const CLASS_COLORS = ["#f59e0b", "#06b6d4", "#10b981", "#8b5cf6"]; // c0..c3
const CLASS_RGB = [[245, 158, 11], [6, 182, 212], [16, 185, 129], [139, 92, 246]];

// ----- tiện ích -----
const sigmoid = (z) => z >= 0 ? 1 / (1 + Math.exp(-z)) : Math.exp(z) / (1 + Math.exp(z));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

function switchTab(name) {
  document.querySelectorAll(".tab-content").forEach(e => e.classList.remove("active"));
  document.querySelectorAll(".nav-btn").forEach(e => e.classList.remove("active"));
  document.getElementById("tab-content-" + name).classList.add("active");
  document.getElementById("tab-" + name).classList.add("active");
}

// ----- toạ độ: dữ liệu <-> pixel -----
function makeMapper(canvas) {
  const W = canvas.width, H = canvas.height;
  const pw = W - PAD.l - PAD.r, ph = H - PAD.t - PAD.b;
  const span = DOMAIN.max - DOMAIN.min;
  return {
    pw, ph,
    toPx: (x1, x2) => [PAD.l + (x1 - DOMAIN.min) / span * pw,
                       PAD.t + (1 - (x2 - DOMAIN.min) / span) * ph],
    toData: (px, py) => [DOMAIN.min + (px - PAD.l) / pw * span,
                         DOMAIN.min + (1 - (py - PAD.t) / ph) * span],
  };
}

// ----- chuẩn hoá đặc trưng (giúp GD hội tụ nhanh & ổn định) -----
function fitScaler(pts) {
  const n = Math.max(pts.length, 1);
  let mu = [0, 0];
  for (const p of pts) { mu[0] += p.x[0]; mu[1] += p.x[1]; }
  mu = [mu[0] / n, mu[1] / n];
  let sd = [0, 0];
  for (const p of pts) { sd[0] += (p.x[0] - mu[0]) ** 2; sd[1] += (p.x[1] - mu[1]) ** 2; }
  sd = [Math.sqrt(sd[0] / n) || 1, Math.sqrt(sd[1] / n) || 1];
  return { mu, sd, tf: (x) => [(x[0] - mu[0]) / sd[0], (x[1] - mu[1]) / sd[1]] };
}

// ----- vẽ lưới + trục -----
function drawAxes(ctx, map, canvas) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#0a0e1a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "rgba(255,255,255,0.06)";
  ctx.lineWidth = 1;
  ctx.fillStyle = "#64748b";
  ctx.font = "11px 'JetBrains Mono', monospace";
  for (let v = 0; v <= 10; v += 2) {
    const [px, py] = map.toPx(v, 0);
    const [, py0] = map.toPx(0, v);
    ctx.beginPath(); ctx.moveTo(px, PAD.t); ctx.lineTo(px, PAD.t + map.ph); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(PAD.l, py0); ctx.lineTo(PAD.l + map.pw, py0); ctx.stroke();
    ctx.fillText(v, px - 4, PAD.t + map.ph + 18);
    ctx.fillText(v, 14, py0 + 4);
  }
}

// ----- vẽ điểm dữ liệu -----
function drawPoints(ctx, map, pts) {
  for (const p of pts) {
    const [px, py] = map.toPx(p.x[0], p.x[1]);
    ctx.beginPath();
    ctx.arc(px, py, 6, 0, Math.PI * 2);
    ctx.fillStyle = CLASS_COLORS[p.y];
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "rgba(10,14,26,0.9)";
    ctx.stroke();
  }
}

/* ===========================================================
   LOGISTIC (nhị phân)
   =========================================================== */
const LG = {
  pts: [], w: [0, 0], b: 0, scaler: null,
  addClass: 0, removeMode: false, threshold: 0.5, lr: 0.5,
  epoch: 0, loss: 0, anim: null,
  canvas: null, ctx: null, map: null,

  init() {
    this.canvas = document.getElementById("lgCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.map = makeMapper(this.canvas);
    this.canvas.addEventListener("click", (e) => this.onClick(e));
    this.preset("blobs");
  },

  setClass(c) {
    this.addClass = c; this.removeMode = false;
    document.getElementById("lg-remove").classList.remove("active");
    document.getElementById("lg-chip0").classList.toggle("active", c === 0);
    document.getElementById("lg-chip1").classList.toggle("active", c === 1);
  },
  toggleRemove() {
    this.removeMode = !this.removeMode;
    document.getElementById("lg-remove").classList.toggle("active", this.removeMode);
  },
  onLR() { this.lr = +document.getElementById("lg-lr").value; document.getElementById("lg-lrVal").textContent = this.lr.toFixed(2); },
  onThreshold() {
    this.threshold = +document.getElementById("lg-thr").value;
    document.getElementById("lg-thrVal").textContent = this.threshold.toFixed(2);
    this.draw();
  },

  onClick(e) {
    const r = this.canvas.getBoundingClientRect();
    const px = (e.clientX - r.left) * this.canvas.width / r.width;
    const py = (e.clientY - r.top) * this.canvas.height / r.height;
    const [x1, x2] = this.map.toData(px, py);
    if (x1 < 0 || x1 > 10 || x2 < 0 || x2 > 10) return;
    if (this.removeMode) {
      let bi = -1, bd = 1e9;
      this.pts.forEach((p, i) => { const d = (p.x[0] - x1) ** 2 + (p.x[1] - x2) ** 2; if (d < bd) { bd = d; bi = i; } });
      if (bi >= 0 && bd < 0.6) this.pts.splice(bi, 1);
    } else {
      this.pts.push({ x: [x1, x2], y: this.addClass });
    }
    this.train(); this.draw();
    document.getElementById("lgHint").style.opacity = "0";
  },

  clear() { this.pts = []; this.w = [0, 0]; this.b = 0; this.epoch = 0; this.draw(); this.updateStats(); },

  // huấn luyện đồng bộ một burst (toán giống notebook, trong không gian chuẩn hoá)
  train(steps = 1500) {
    if (this.pts.length < 2 || !this.bothClasses()) { this.w = [0, 0]; this.b = 0; this.epoch = 0; this.updateStats(); return; }
    this.scaler = fitScaler(this.pts);
    this.w = [0, 0]; this.b = 0;
    for (let s = 0; s < steps; s++) this.step();
    this.epoch = steps;
    this.updateStats();
  },
  step() {
    const m = this.pts.length;
    let gw = [0, 0], gb = 0;
    for (const p of this.pts) {
      const sx = this.scaler.tf(p.x);
      const e = sigmoid(this.w[0] * sx[0] + this.w[1] * sx[1] + this.b) - p.y;
      gw[0] += e * sx[0]; gw[1] += e * sx[1]; gb += e;
    }
    this.w[0] -= this.lr * gw[0] / m; this.w[1] -= this.lr * gw[1] / m; this.b -= this.lr * gb / m;
  },
  bothClasses() { return this.pts.some(p => p.y === 0) && this.pts.some(p => p.y === 1); },

  probaRaw(x) {
    if (!this.scaler) return 0.5;
    const sx = this.scaler.tf(x);
    return sigmoid(this.w[0] * sx[0] + this.w[1] * sx[1] + this.b);
  },

  // animation: reset rồi học chậm cho thấy ranh giới di chuyển
  animate() {
    if (this.anim) { cancelAnimationFrame(this.anim); this.anim = null; document.getElementById("lg-runBtn").textContent = "▶ Xem học (animation)"; return; }
    if (this.pts.length < 2 || !this.bothClasses()) return;
    this.scaler = fitScaler(this.pts);
    this.w = [0, 0]; this.b = 0; this.epoch = 0;
    document.getElementById("lg-runBtn").textContent = "⏸ Dừng";
    const loop = () => {
      for (let k = 0; k < 12; k++) { this.step(); this.epoch++; }
      this.updateStats(); this.draw();
      if (this.epoch < 2400) { this.anim = requestAnimationFrame(loop); }
      else { this.anim = null; document.getElementById("lg-runBtn").textContent = "▶ Xem học (animation)"; }
    };
    loop();
  },

  draw() {
    const ctx = this.ctx, map = this.map;
    drawAxes(ctx, map, this.canvas);
    // tô nền theo xác suất (chỉ khi đã học)
    if (this.scaler && this.bothClasses()) {
      const step = 7;
      for (let px = PAD.l; px < PAD.l + map.pw; px += step) {
        for (let py = PAD.t; py < PAD.t + map.ph; py += step) {
          const [x1, x2] = map.toData(px + step / 2, py + step / 2);
          const p = this.probaRaw([x1, x2]);          // P(lớp 1)
          const t = clamp((p - this.threshold) * 3 + 0.5, 0, 1); // nhấn quanh ngưỡng
          const c0 = CLASS_RGB[0], c1 = CLASS_RGB[1];
          const r = Math.round(c0[0] + (c1[0] - c0[0]) * t);
          const g = Math.round(c0[1] + (c1[1] - c0[1]) * t);
          const b = Math.round(c0[2] + (c1[2] - c0[2]) * t);
          ctx.fillStyle = `rgba(${r},${g},${b},0.16)`;
          ctx.fillRect(px, py, step, step);
        }
      }
      this.drawBoundary();
    }
    drawPoints(ctx, map, this.pts);
  },

  // ranh giới: nơi P = threshold  ⇔  z = logit(threshold)
  drawBoundary() {
    const ctx = this.ctx, map = this.map, sc = this.scaler;
    const L0 = Math.log(this.threshold / (1 - this.threshold));
    // z(x1,x2) = w0*(x1-mu0)/sd0 + w1*(x2-mu1)/sd1 + b ; giải x2 theo x1
    const a = this.w[1] / sc.sd[1];
    if (Math.abs(a) < 1e-9) return;
    const x2at = (x1) => {
      const c = this.w[0] * (x1 - sc.mu[0]) / sc.sd[0] + this.b - this.w[1] * sc.mu[1] / sc.sd[1];
      return (L0 - c) / a;
    };
    const p1 = map.toPx(0, x2at(0)), p2 = map.toPx(10, x2at(10));
    ctx.save();
    ctx.beginPath(); ctx.moveTo(p1[0], p1[1]); ctx.lineTo(p2[0], p2[1]);
    ctx.strokeStyle = "#e2e8f0"; ctx.lineWidth = 2.5; ctx.setLineDash([7, 5]); ctx.stroke();
    ctx.restore();
  },

  metrics() {
    let TP = 0, FP = 0, FN = 0, TN = 0;
    for (const p of this.pts) {
      const pred = this.probaRaw(p.x) >= this.threshold ? 1 : 0;
      if (p.y === 1 && pred === 1) TP++;
      else if (p.y === 1 && pred === 0) FN++;
      else if (p.y === 0 && pred === 1) FP++;
      else TN++;
    }
    const acc = (TP + TN) / Math.max(this.pts.length, 1);
    const prec = TP + FP ? TP / (TP + FP) : 0;
    const rec = TP + FN ? TP / (TP + FN) : 0;
    const f1 = prec + rec ? 2 * prec * rec / (prec + rec) : 0;
    return { TP, FP, FN, TN, acc, prec, rec, f1 };
  },
  logLoss() {
    if (!this.scaler || !this.bothClasses()) return 0;
    let s = 0;
    for (const p of this.pts) { const h = clamp(this.probaRaw(p.x), 1e-9, 1 - 1e-9); s += -(p.y * Math.log(h) + (1 - p.y) * Math.log(1 - h)); }
    return s / this.pts.length;
  },

  updateStats() {
    const ok = this.scaler && this.bothClasses();
    document.getElementById("lg-w1").textContent = ok ? (this.w[0] / this.scaler.sd[0]).toFixed(2) : "—";
    document.getElementById("lg-w2").textContent = ok ? (this.w[1] / this.scaler.sd[1]).toFixed(2) : "—";
    document.getElementById("lg-b").textContent = ok ? this.b.toFixed(2) : "—";
    const m = this.metrics();
    const set = (id, v) => document.getElementById(id).textContent = v;
    set("lg-acc", this.pts.length ? m.acc.toFixed(3) : "—");
    set("lg-f1", ok ? m.f1.toFixed(3) : "—");
    set("lg-prec", ok ? m.prec.toFixed(3) : "—");
    set("lg-rec", ok ? m.rec.toFixed(3) : "—");
    document.getElementById("lg-accBar").style.width = (m.acc * 100) + "%";
    document.getElementById("lg-f1Bar").style.width = (m.f1 * 100) + "%";
    set("lg-TP", m.TP); set("lg-FP", m.FP); set("lg-FN", m.FN); set("lg-TN", m.TN);
    this.loss = this.logLoss();
    document.getElementById("lg-trainInfo").textContent = `epoch ${this.epoch} · loss ${ok ? this.loss.toFixed(4) : "—"}`;
  },

  preset(kind) {
    this.pts = [];
    const rnd = mulberry32(kind === "blobs" ? 1 : kind === "overlap" ? 7 : 3);
    const gauss = (cx, cy, sd, n, cls) => { for (let i = 0; i < n; i++) this.pts.push({ x: [clamp(cx + randn(rnd) * sd, 0.2, 9.8), clamp(cy + randn(rnd) * sd, 0.2, 9.8)], y: cls }); };
    if (kind === "blobs") { gauss(3, 3, 0.8, 25, 0); gauss(7, 7, 0.8, 25, 1); }
    else if (kind === "overlap") { gauss(4, 4.5, 1.3, 30, 0); gauss(6, 5.5, 1.3, 30, 1); }
    else if (kind === "xor") { gauss(3, 3, 0.7, 18, 0); gauss(7, 7, 0.7, 18, 0); gauss(3, 7, 0.7, 18, 1); gauss(7, 3, 0.7, 18, 1); }
    this.train(); this.draw();
    document.getElementById("lgHint").style.opacity = "0";
  },
};

/* ===========================================================
   SOFTMAX (đa lớp)
   =========================================================== */
const SM = {
  pts: [], W: [], b: [], scaler: null, K: 3,
  addClass: 0, removeMode: false, lr: 0.5, epoch: 0, loss: 0, anim: null,
  canvas: null, ctx: null, map: null,

  init() {
    this.canvas = document.getElementById("smCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.map = makeMapper(this.canvas);
    this.canvas.addEventListener("click", (e) => this.onClick(e));
    this.buildChips();
    this.preset();
  },

  buildChips() {
    const row = document.getElementById("sm-chips");
    row.querySelectorAll(".chip").forEach(e => e.remove());
    for (let k = 0; k < this.K; k++) {
      const chip = document.createElement("span");
      chip.className = "chip c" + k + (k === this.addClass ? " active" : "");
      chip.innerHTML = `<span class="dot" style="background:${CLASS_COLORS[k]}"></span>Lớp ${k}`;
      chip.onclick = () => this.setClass(k);
      row.appendChild(chip);
    }
  },
  setClass(c) {
    this.addClass = c; this.removeMode = false;
    document.getElementById("sm-remove").classList.remove("active");
    document.querySelectorAll("#sm-chips .chip").forEach((e, i) => e.classList.toggle("active", i === c));
  },
  setK(k) { this.K = k; if (this.addClass >= k) this.addClass = 0; this.buildChips(); this.preset(); },
  toggleRemove() { this.removeMode = !this.removeMode; document.getElementById("sm-remove").classList.toggle("active", this.removeMode); },
  onLR() { this.lr = +document.getElementById("sm-lr").value; document.getElementById("sm-lrVal").textContent = this.lr.toFixed(2); },

  onClick(e) {
    const r = this.canvas.getBoundingClientRect();
    const px = (e.clientX - r.left) * this.canvas.width / r.width;
    const py = (e.clientY - r.top) * this.canvas.height / r.height;
    const [x1, x2] = this.map.toData(px, py);
    if (x1 < 0 || x1 > 10 || x2 < 0 || x2 > 10) return;
    if (this.removeMode) {
      let bi = -1, bd = 1e9;
      this.pts.forEach((p, i) => { const d = (p.x[0] - x1) ** 2 + (p.x[1] - x2) ** 2; if (d < bd) { bd = d; bi = i; } });
      if (bi >= 0 && bd < 0.6) this.pts.splice(bi, 1);
    } else this.pts.push({ x: [x1, x2], y: this.addClass });
    this.train(); this.draw();
    document.getElementById("smHint").style.opacity = "0";
  },
  clear() { this.pts = []; this.W = []; this.b = []; this.epoch = 0; this.draw(); this.updateStats(); },

  classesPresent() { const s = new Set(this.pts.map(p => p.y)); return s.size >= 2; },

  train(steps = 1200) {
    if (this.pts.length < this.K || !this.classesPresent()) { this.W = []; this.epoch = 0; this.updateStats(); return; }
    this.scaler = fitScaler(this.pts);
    this.W = Array.from({ length: 2 }, () => new Array(this.K).fill(0));
    this.b = new Array(this.K).fill(0);
    for (let s = 0; s < steps; s++) this.step();
    this.epoch = steps;
    this.updateStats();
  },
  softmax(z) {
    const mx = Math.max(...z);
    const e = z.map(v => Math.exp(v - mx));
    const s = e.reduce((a, b) => a + b, 0);
    return e.map(v => v / s);
  },
  probaRaw(x) {
    const sx = this.scaler.tf(x);
    const z = new Array(this.K).fill(0);
    for (let k = 0; k < this.K; k++) z[k] = this.W[0][k] * sx[0] + this.W[1][k] * sx[1] + this.b[k];
    return this.softmax(z);
  },
  step() {
    const m = this.pts.length;
    const gW = [new Array(this.K).fill(0), new Array(this.K).fill(0)];
    const gb = new Array(this.K).fill(0);
    for (const p of this.pts) {
      const sx = this.scaler.tf(p.x);
      const z = new Array(this.K).fill(0);
      for (let k = 0; k < this.K; k++) z[k] = this.W[0][k] * sx[0] + this.W[1][k] * sx[1] + this.b[k];
      const S = this.softmax(z);
      for (let k = 0; k < this.K; k++) {
        const err = S[k] - (p.y === k ? 1 : 0);   // S − one-hot
        gW[0][k] += err * sx[0]; gW[1][k] += err * sx[1]; gb[k] += err;
      }
    }
    for (let k = 0; k < this.K; k++) {
      this.W[0][k] -= this.lr * gW[0][k] / m;
      this.W[1][k] -= this.lr * gW[1][k] / m;
      this.b[k] -= this.lr * gb[k] / m;
    }
  },
  predict(x) { const p = this.probaRaw(x); let bi = 0; for (let k = 1; k < this.K; k++) if (p[k] > p[bi]) bi = k; return bi; },

  animate() {
    if (this.anim) { cancelAnimationFrame(this.anim); this.anim = null; document.getElementById("sm-runBtn").textContent = "▶ Xem học (animation)"; return; }
    if (this.pts.length < this.K || !this.classesPresent()) return;
    this.scaler = fitScaler(this.pts);
    this.W = Array.from({ length: 2 }, () => new Array(this.K).fill(0));
    this.b = new Array(this.K).fill(0); this.epoch = 0;
    document.getElementById("sm-runBtn").textContent = "⏸ Dừng";
    const loop = () => {
      for (let k = 0; k < 10; k++) { this.step(); this.epoch++; }
      this.updateStats(); this.draw();
      if (this.epoch < 2000) this.anim = requestAnimationFrame(loop);
      else { this.anim = null; document.getElementById("sm-runBtn").textContent = "▶ Xem học (animation)"; }
    };
    loop();
  },

  draw() {
    const ctx = this.ctx, map = this.map;
    drawAxes(ctx, map, this.canvas);
    if (this.W.length && this.classesPresent()) {
      const step = 7;
      for (let px = PAD.l; px < PAD.l + map.pw; px += step) {
        for (let py = PAD.t; py < PAD.t + map.ph; py += step) {
          const [x1, x2] = map.toData(px + step / 2, py + step / 2);
          const c = CLASS_RGB[this.predict([x1, x2])];
          ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},0.16)`;
          ctx.fillRect(px, py, step, step);
        }
      }
    }
    drawPoints(ctx, map, this.pts);
  },

  // confusion KxK + macro
  stats() {
    const K = this.K;
    const cm = Array.from({ length: K }, () => new Array(K).fill(0));
    for (const p of this.pts) cm[p.y][this.predict(p.x)]++;
    let correct = 0; for (let k = 0; k < K; k++) correct += cm[k][k];
    const acc = correct / Math.max(this.pts.length, 1);
    const per = [];
    for (let k = 0; k < K; k++) {
      const TP = cm[k][k];
      let FP = 0, FN = 0; for (let j = 0; j < K; j++) { if (j !== k) { FP += cm[j][k]; FN += cm[k][j]; } }
      const support = cm[k].reduce((a, b) => a + b, 0);
      const P = TP + FP ? TP / (TP + FP) : 0, R = TP + FN ? TP / (TP + FN) : 0;
      const F = P + R ? 2 * P * R / (P + R) : 0;
      per.push({ P, R, F, support });
    }
    const macroF = per.reduce((a, b) => a + b.F, 0) / K;
    return { acc, per, macroF };
  },
  crossEntropy() {
    if (!this.W.length || !this.classesPresent()) return 0;
    let s = 0;
    for (const p of this.pts) { const S = this.probaRaw(p.x); s += -Math.log(clamp(S[p.y], 1e-9, 1)); }
    return s / this.pts.length;
  },

  updateStats() {
    const ok = this.W.length && this.classesPresent();
    const st = this.stats();
    document.getElementById("sm-acc").textContent = this.pts.length ? st.acc.toFixed(3) : "—";
    document.getElementById("sm-f1").textContent = ok ? st.macroF.toFixed(3) : "—";
    document.getElementById("sm-accBar").style.width = (st.acc * 100) + "%";
    document.getElementById("sm-f1Bar").style.width = (st.macroF * 100) + "%";
    const tb = document.querySelector("#sm-table tbody");
    tb.innerHTML = "";
    for (let k = 0; k < this.K; k++) {
      const r = st.per[k];
      const tr = document.createElement("tr");
      tr.innerHTML = `<td><span class="swatch" style="background:${CLASS_COLORS[k]}"></span>Lớp ${k}</td>` +
        `<td>${ok ? r.P.toFixed(2) : "—"}</td><td>${ok ? r.R.toFixed(2) : "—"}</td>` +
        `<td>${ok ? r.F.toFixed(2) : "—"}</td><td>${r.support}</td>`;
      tb.appendChild(tr);
    }
    const trm = document.createElement("tr");
    trm.className = "macro";
    trm.innerHTML = `<td>macro</td><td colspan="2"></td><td>${ok ? st.macroF.toFixed(2) : "—"}</td><td></td>`;
    tb.appendChild(trm);
    this.loss = this.crossEntropy();
    document.getElementById("sm-trainInfo").textContent = `epoch ${this.epoch} · loss ${ok ? this.loss.toFixed(4) : "—"}`;
  },

  preset() {
    this.pts = [];
    const rnd = mulberry32(42 + this.K);
    const centers = [[3, 3], [7, 3], [5, 7.5], [8, 7]];
    for (let k = 0; k < this.K; k++) {
      const c = centers[k];
      for (let i = 0; i < 22; i++) this.pts.push({ x: [clamp(c[0] + randn(rnd) * 0.85, 0.2, 9.8), clamp(c[1] + randn(rnd) * 0.85, 0.2, 9.8)], y: k });
    }
    this.train(); this.draw();
    document.getElementById("smHint").style.opacity = "0";
  },
};

// ----- RNG có seed + Gaussian (Box-Muller) cho preset tái lập -----
function mulberry32(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function randn(rnd) {
  let u = 0, v = 0;
  while (u === 0) u = rnd();
  while (v === 0) v = rnd();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

// ----- khởi động -----
window.addEventListener("DOMContentLoaded", () => {
  LG.init();
  SM.init();
});
