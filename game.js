(() => {
  const FIXED = 1 / 60;
  const START_HSI = 20000;
  const SEASON = 480;
  const HARD_AT = 240;
  const HK0 = { lon: 114.17, lat: 22.32 };
  const WEST = 105, EAST = 140, SOUTH = 7, NORTH = 31;
  const MASK_WEST = 100, MASK_EAST = 140, MASK_SOUTH = 7, MASK_NORTH = 36;
  const MOVE = 1.26;
  const LEE_MAX = 4;
  const T8_DRAG = 475;
  const SIG_MULT = { 0: 0, 1: 0.2, 3: 0.5, 8: 1, 9: 2, 10: 4 };
  const NAMES = ["馬鞍","小犬","蘇拉","海葵","泰利","暹芭","軒嵐諾","梅花","楊柳","蝴蝶","韋帕","榕樹"];
  const PLACES = [
    { name: "廣州", lon: 113.26, lat: 23.13 },
    { name: "台北", lon: 121.57, lat: 25.03 },
    { name: "馬尼拉", lon: 120.98, lat: 14.6 },
    { name: "那霸", lon: 127.68, lat: 26.21 },
    { name: "河內", lon: 105.85, lat: 21.03 },
    { name: "上海", lon: 121.47, lat: 31.23 },
    { name: "海口", lon: 110.35, lat: 20.02 },
    { name: "廈門", lon: 118.09, lat: 24.48 },
  ];

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerpHeading = (a, b, t) => {
    const d = ((b - a + 540) % 360) - 180;
    return (a + d * t + 360) % 360;
  };
  const raiseSignal = (cur, next) => (next > cur ? next : cur);
  function distKm(lon1, lat1, lon2, lat2) {
    const R = 6371, p1 = lat1 * Math.PI / 180, p2 = lat2 * Math.PI / 180;
    const dp = (lat2 - lat1) * Math.PI / 180, dl = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dp / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2;
    return 2 * R * Math.asin(Math.min(1, Math.sqrt(a)));
  }
  function decodeMask(hex, n) {
    const bits = new Uint8Array(n);
    for (let i = 0; i < hex.length; i += 2) {
      const b = parseInt(hex.slice(i, i + 2), 16);
      for (let k = 0; k < 8; k++) {
        const idx = (i / 2) * 8 + k;
        if (idx < n) bits[idx] = (b >> (7 - k)) & 1;
      }
    }
    return bits;
  }
  const fmtHsi = (n) => n.toLocaleString("en-HK", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmtTime = (s) => {
    const m = Math.floor(s / 60), sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };
  const sigLabel = (s) => (s === 0 ? "除下" : `${s}號`);

  class Game {
    constructor(canvas, ui) {
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.ui = ui;
      this.keys = new Set();
      this.map = null;
      this.running = false;
      this.ended = false;
      this.paused = false;
      this.acc = 0;
      this.last = 0;
      this.raf = 0;
    }

    async load() {
      const res = await fetch("maps/east-asia.json");
      const j = await res.json();
      this.map = {
        land: j.land,
        cols: j.mask.cols,
        rows: j.mask.rows,
        bits: decodeMask(j.mask.hex, j.mask.cols * j.mask.rows),
      };
    }

    start() {
      this.reset();
      this.running = true;
      this.last = performance.now();
      const loop = (now) => {
        if (!this.running) return;
        let dt = (now - this.last) / 1000;
        this.last = now;
        if (dt > 0.1) dt = 0.1;
        if (!this.ended) {
          this.acc += dt;
          while (this.acc >= FIXED) {
            this.step(FIXED);
            this.acc -= FIXED;
          }
        }
        this.draw();
        this.raf = requestAnimationFrame(loop);
      };
      this.raf = requestAnimationFrame(loop);
      this.pushHud();
    }

    reset() {
      this.hk = { lon: HK0.lon, lat: HK0.lat, vx: 0, vy: 0 };
      this.storms = [];
      this.hsi = START_HSI;
      this.hsiDelta = 0;
      this.hsiMark = START_HSI;
      this.hsiMarkT = 0;
      this.cycle = Math.random() < 0.55 ? "bull" : "bear";
      this.cycleT = 38 + Math.random() * 22;
      this.signal = 0;
      this.lastSignal = 0;
      this.time = 0;
      this.ended = false;
      this.loseKind = null;
      this.banner = this.cycle === "bull" ? "牛市展開 · 恆指以兩萬點開市" : "熊市開局 · 仍以兩萬點起步";
      this.bannerT = 2.6;
      this.trauma = 0;
      this.leeCharges = LEE_MAX;
      this.leeCd = 0;
      this.leeT = 0;
      this.dodged = 0;
      this.nameI = 0;
      this.nextSpawn = 0.8;
      this.noise = 0;
      this.waveT = 0;
      this.gapT = 1.6 + Math.random() * 1.4;
      this.spaceWas = false;
      this.fWas = false;
      this.haltCharges = 1;
      this.haltT = 0;
      this.hardAnnounced = false;
      this.devilCount = 0;
      this._nearest = 0;
    }

    isLand(lon, lat) {
      const m = this.map;
      if (!m) return false;
      const i = Math.floor(((lon - MASK_WEST) / (MASK_EAST - MASK_WEST)) * m.cols);
      const j = Math.floor(((MASK_NORTH - lat) / (MASK_NORTH - MASK_SOUTH)) * m.rows);
      if (i < 0 || j < 0 || i >= m.cols || j >= m.rows) return false;
      return m.bits[j * m.cols + i] === 1;
    }

    step(dt) {
      this.time += dt;
      this.moveHk(dt);
      if (this.haltT <= 0) {
        this.spawnStorms();
        this.moveStorms(dt);
        this.applyFujiwhara(dt);
      }
      this.updateSignal();
      if (this.haltT > 0) {
        this.haltT = Math.max(0, this.haltT - dt);
        if (this.haltT <= 0) this.finishHalt();
      } else this.updateHsi(dt);
      this.leeCd = Math.max(0, this.leeCd - dt);
      if (this.leeT > 0) this.leeT = Math.max(0, this.leeT - dt);
      if (this.just("Space", "spaceWas")) this.tryLee();
      if (this.just("KeyF", "fWas")) this.tryHalt();
      if (!this.hardAnnounced && this.time >= HARD_AT) {
        this.hardAnnounced = true;
        this.flash("下半季開始 · 魔鬼風暴可能生成", 2.5);
        this.trauma = 0.35;
      }
      this.trauma = Math.max(0, this.trauma - dt * 1.4);
      this.bannerT -= dt;
      if (this.bannerT <= 0) this.banner = null;
      this.hsiMarkT += dt;
      if (this.hsiMarkT >= 0.45) {
        this.hsiDelta = this.hsi - this.hsiMark;
        this.hsiMark = this.hsi;
        this.hsiMarkT = 0;
      }
      if (this.time >= SEASON && !this.ended) this.win();
      if (this.hsi <= 0 && !this.ended) this.lose("zero");
      this.pushHud();
    }

    just(code, flag) {
      const now = this.keys.has(code);
      const edge = now && !this[flag];
      this[flag] = now;
      return edge;
    }

    moveHk(dt) {
      let ix = 0, iy = 0;
      if (this.keys.has("KeyA") || this.keys.has("ArrowLeft")) ix -= 1;
      if (this.keys.has("KeyD") || this.keys.has("ArrowRight")) ix += 1;
      if (this.keys.has("KeyW") || this.keys.has("ArrowUp")) iy -= 1;
      if (this.keys.has("KeyS") || this.keys.has("ArrowDown")) iy += 1;
      const m = Math.hypot(ix, iy);
      if (m > 1) { ix /= m; iy /= m; }
      this.hk.vx = ix * MOVE;
      this.hk.vy = -iy * MOVE;
      this.hk.lon = clamp(this.hk.lon + this.hk.vx * dt, WEST + 0.6, EAST - 0.6);
      this.hk.lat = clamp(this.hk.lat + this.hk.vy * dt, SOUTH + 0.6, NORTH - 0.6);
    }

    randomOcean() {
      const m = this.map;
      if (!m) return null;
      for (let n = 0; n < 90; n++) {
        const i = Math.floor(Math.random() * m.cols);
        const j = Math.floor(Math.random() * m.rows);
        if (m.bits[j * m.cols + i] === 1) continue;
        const lon = MASK_WEST + ((i + 0.5) / m.cols) * (MASK_EAST - MASK_WEST);
        const lat = MASK_NORTH - ((j + 0.5) / m.rows) * (MASK_NORTH - MASK_SOUTH);
        if (lon < WEST + 0.4 || lon > EAST - 0.4 || lat < SOUTH + 0.4 || lat > NORTH - 0.4) continue;
        return { lon, lat };
      }
      return null;
    }

    spawnStorms() {
      if (this.time < this.nextSpawn || this.time > SEASON - 12) return;
      const hard = this.time >= HARD_AT;
      this.nextSpawn += hard ? 3.8 : 5.3;
      let pos = null;
      for (let n = 0; n < 12; n++) {
        const cand = this.randomOcean();
        if (!cand) continue;
        if (distKm(cand.lon, cand.lat, this.hk.lon, this.hk.lat) < 480) continue;
        pos = cand;
        break;
      }
      if (!pos) pos = this.randomOcean();
      if (!pos) return;
      const devil = hard && this.devilCount < 4 && Math.random() < (this.devilCount === 0 ? 0.62 : 0.14);
      const japan = Math.random() < 0.36;
      const name = NAMES[this.nameI++ % NAMES.length];
      if (devil) this.devilCount += 1;
      this.storms.push({
        name, lon: pos.lon, lat: pos.lat,
        heading: 272 + Math.random() * 28,
        speed: devil ? 2.05 + Math.random() * 0.55 : 1.68 + Math.random() * 0.72,
        kt: devil ? 102 + Math.random() * 16 : 22 + Math.random() * 10,
        track: [{ lon: pos.lon, lat: pos.lat }],
        age: 0, dead: false,
        steer: japan ? "japan" : "west",
        recurveAt: 4 + Math.random() * 5,
        devil,
      });
      this.flash(devil ? `魔鬼風暴 ${name} 生成` : `熱帶低氣壓 ${name} 生成`, devil ? 2.4 : 1.8);
      if (devil) this.trauma = 0.55;
    }

    envHeading(s) {
      const wobble = Math.sin(s.age * 0.35 + s.lon) * 12;
      if (s.steer === "japan") {
        const t = clamp((s.age - s.recurveAt) / 7, 0, 1);
        const e = t * t * (3 - 2 * t);
        return lerpHeading(276 + wobble * 0.35, 38 + wobble * 0.4, e);
      }
      const latF = clamp((s.lat - 8) / 18, 0, 1);
      const ageF = clamp(s.age / 16, 0, 1);
      return (272 + latF * ageF * 70 + wobble + 360) % 360;
    }

    moveStorms(dt) {
      const field = this.leeT > 0;
      for (const s of this.storms) {
        if (s.dead) continue;
        s.age += dt;
        let h = lerpHeading(s.heading, this.envHeading(s), 0.08);
        if (field) {
          const dlon = s.lon - this.hk.lon, dlat = s.lat - this.hk.lat;
          const d = Math.hypot(dlon, dlat) || 0.01;
          if (d < 10) {
            const away = Math.atan2(dlon, dlat) * 180 / Math.PI;
            h = lerpHeading(h, away, (1 - d / 10) * 0.55);
          }
        }
        s.heading = h;
        const rad = s.heading * Math.PI / 180;
        s.lon += Math.sin(rad) * s.speed * dt;
        s.lat += Math.cos(rad) * s.speed * dt;
        if (this.isLand(s.lon, s.lat)) s.kt -= 5.95 * dt;
        else s.kt += (s.kt < 34 ? 1.6 : s.kt < 64 ? 1.1 : s.kt < 95 ? 0.55 : 0.15) * dt;
        s.kt = clamp(s.kt, 0, s.devil ? 165 : 145);
        if (s.age % 0.35 < dt) s.track.push({ lon: s.lon, lat: s.lat });
        if (s.track.length > 90) s.track.shift();
        if (s.kt < 16 || s.lon < WEST - 2 || s.lon > EAST + 2 || s.lat < SOUTH - 2 || s.lat > NORTH + 2) {
          s.dead = true;
          this.dodged += 1;
        }
      }
    }

    applyFujiwhara(dt) {
      const live = this.storms.filter((s) => !s.dead);
      for (let i = 0; i < live.length; i++) {
        for (let j = i + 1; j < live.length; j++) {
          const a = live[i], b = live[j];
          const d = Math.hypot(b.lon - a.lon, b.lat - a.lat);
          if (d > 9 || d < 0.12) continue;
          const wa = Math.max(a.kt, 8), wb = Math.max(b.kt, 8);
          const cx = (a.lon * wa + b.lon * wb) / (wa + wb);
          const cy = (a.lat * wa + b.lat * wb) / (wa + wb);
          const omega = (6.8 * (1 - d / 9) * Math.PI) / 180;
          const raLon = a.lon - cx, raLat = a.lat - cy, rbLon = b.lon - cx, rbLat = b.lat - cy;
          a.lon += -raLat * omega * dt; a.lat += raLon * omega * dt;
          b.lon += -rbLat * omega * dt; b.lat += rbLon * omega * dt;
          const pull = 0.07 * (1 - d / 9);
          a.lon += (cx - a.lon) * pull * dt; a.lat += (cy - a.lat) * pull * dt;
          b.lon += (cx - b.lon) * pull * dt; b.lat += (cy - b.lat) * pull * dt;
          const stronger = a.kt >= b.kt ? a : b;
          const weaker = a.kt >= b.kt ? b : a;
          if (d < 2.4 && stronger.kt >= weaker.kt + 6) weaker.kt -= 3.2 * dt;
          if (d < 1.25 && stronger.kt >= weaker.kt + 8) {
            stronger.kt = clamp(stronger.kt + weaker.kt * 0.22, 0, 145);
            weaker.dead = true;
          }
        }
      }
    }

    updateSignal() {
      let sig = 0, nearest = 1e9;
      for (const s of this.storms) {
        if (s.dead) continue;
        const km = distKm(this.hk.lon, this.hk.lat, s.lon, s.lat);
        nearest = Math.min(nearest, km);
        const rad = s.heading * Math.PI / 180;
        const approaching = (this.hk.lon - s.lon) * Math.sin(rad) + (this.hk.lat - s.lat) * Math.cos(rad) > 0;
        if (s.kt >= 64 && km < 220) sig = raiseSignal(sig, 10);
        else if (s.kt >= 48 && km < 320) sig = raiseSignal(sig, 9);
        else if (s.kt >= 34 && km < 480) sig = raiseSignal(sig, 8);
        else if (s.kt >= 22 && km < 800) sig = raiseSignal(sig, 3);
        else if (km < 1100 && approaching) sig = raiseSignal(sig, 1);
      }
      this._nearest = nearest > 9e8 ? 0 : nearest;
      if (sig !== this.lastSignal) {
        const prev = this.lastSignal;
        this.lastSignal = sig;
        this.signal = sig;
        if (sig > prev) {
          if (sig === 10) this.flash("十號颶風信號 · 恆指急挫", 2.4);
          else if (sig === 9) this.flash("九號烈風增強信號 · 大市受壓", 2.2);
          else if (sig === 8) this.flash("八號烈風或暴風信號生效 · 恆指受拖累", 2.4);
          else if (sig === 3) this.flash("三號強風信號 · 恐慌拋售加劇", 1.8);
          else if (sig === 1) this.flash("一號戒備信號 · 市場恐慌拋售", 1.6);
        } else if (sig < prev) {
          const drop = SIG_MULT[prev] - SIG_MULT[sig];
          if (drop > 0) this.hsi = Math.max(0, this.hsi + drop * (520 + Math.random() * 380));
          if (prev >= 8 && sig < 8) this.flash("八號或以上除下 · 市場回穩", 2.2);
          else if (sig === 0) this.flash("警告除下 · 恐慌減退", 1.8);
        }
      } else this.signal = sig;
    }

    updateHsi(dt) {
      this.cycleT -= dt;
      if (this.cycleT <= 0) {
        this.cycle = this.cycle === "bull" ? "bear" : "bull";
        this.cycleT = 36 + Math.random() * 28;
        this.flash(this.cycle === "bull" ? "牛市展開" : "熊市來襲", 2);
      }
      const axis = this.cycle === "bull" ? 18 : -16;
      this.waveT += dt;
      const wave = Math.sin(this.waveT * 1.7) * 56 + Math.sin(this.waveT * 4.3 + 0.8) * 32;
      this.noise = this.noise * 0.9 + (Math.random() * 2 - 1) * 96;
      this.gapT -= dt;
      if (this.gapT <= 0) {
        this.gapT = 2.8 + Math.random() * 4.2;
        const withTrend = this.cycle === "bull" ? 1 : -1;
        const dir = Math.random() < 0.38 ? -withTrend : withTrend;
        this.hsi = Math.max(0, this.hsi + dir * (120 + Math.random() * 280));
      }
      const extra = -T8_DRAG * SIG_MULT[this.signal] * dt;
      this.hsi = Math.max(0, this.hsi + (axis + wave + this.noise) * dt + extra);
    }

    tryLee() {
      if (this.leeT > 0 || this.leeCd > 0 || this.leeCharges <= 0) return;
      this.leeCharges -= 1;
      this.leeT = 7.5;
      this.leeCd = 16;
      this.flash("李氏力場展開 · 氣旋受拒", 2);
      this.trauma = 0.25;
    }

    tryHalt() {
      if (this.ended || this.haltT > 0 || this.haltCharges <= 0) return;
      if (this.time < HARD_AT) { this.flash("下半季才可停市", 1.6); return; }
      this.haltCharges -= 1;
      this.haltT = 5;
      this.flash("停市五秒 · 八號或以上未除則強制收市", 2.4);
    }

    finishHalt() {
      if (this.ended) return;
      if (this.signal >= 8) {
        this.flash("停市結束 · 八號或以上仍生效", 2.4);
        this.lose("halt");
        return;
      }
      this.flash("恢復交易", 1.8);
    }

    flash(text, t) { this.banner = text; this.bannerT = t; }
    win() {
      this.ended = true;
      this.hsi = Math.max(1, this.hsi);
      this.ui.end(true, this);
    }
    lose(kind) {
      this.ended = true;
      this.loseKind = kind;
      if (kind === "zero") this.hsi = 0;
      this.ui.end(false, this);
    }

    pushHud() {
      this.ui.hud(this);
    }

    layout() {
      const { width: w, height: h } = this.canvas;
      const scale = w / (this.canvas.clientWidth || w);
      const padT = 86 * scale, padB = 92 * scale, padX = 18 * scale;
      const availW = w - padX * 2, availH = h - padT - padB;
      const aspect = (EAST - WEST) / (NORTH - SOUTH);
      let mapW = availW, mapH = mapW / aspect;
      if (mapH > availH) { mapH = availH; mapW = mapH * aspect; }
      return { x: (w - mapW) / 2, y: padT + (availH - mapH) / 2, w: mapW, h: mapH };
    }
    xy(lon, lat, L) {
      return {
        x: L.x + ((lon - WEST) / (EAST - WEST)) * L.w,
        y: L.y + ((NORTH - lat) / (NORTH - SOUTH)) * L.h,
      };
    }

    draw() {
      const ctx = this.ctx, w = this.canvas.width, h = this.canvas.height;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = "#070c11";
      ctx.fillRect(0, 0, w, h);
      const L = this.layout();
      const shake = this.trauma * this.trauma * 10;
      ctx.save();
      ctx.translate(shake ? Math.sin(this.time * 41) * shake / 2 : 0, shake ? Math.cos(this.time * 33) * shake / 2 : 0);
      ctx.beginPath(); ctx.rect(L.x, L.y, L.w, L.h); ctx.clip();
      const g = ctx.createLinearGradient(L.x, L.y, L.x, L.y + L.h);
      g.addColorStop(0, "#0c3a52"); g.addColorStop(0.55, "#0a2a3c"); g.addColorStop(1, "#071820");
      ctx.fillStyle = g; ctx.fillRect(L.x, L.y, L.w, L.h);
      this.drawGrid(ctx, L);
      this.drawLand(ctx, L);
      this.drawTracks(ctx, L);
      this.drawPlaces(ctx, L);
      this.drawStorms(ctx, L);
      this.drawHk(ctx, L);
      ctx.restore();
      ctx.strokeStyle = "rgba(231,226,216,0.16)";
      ctx.strokeRect(L.x + 0.5, L.y + 0.5, L.w - 1, L.h - 1);
      ctx.fillStyle = "rgba(154,164,178,0.45)";
      ctx.font = "10px 'IBM Plex Mono', monospace";
      ctx.textAlign = "right";
      ctx.fillText("7–31°N  ·  105–140°E", w - 16, h - 14);
    }

    drawGrid(ctx, L) {
      ctx.strokeStyle = "rgba(154,164,178,0.12)";
      ctx.lineWidth = 1;
      ctx.fillStyle = "rgba(154,164,178,0.45)";
      ctx.font = "10px 'IBM Plex Mono', monospace";
      ctx.textAlign = "left";
      for (let lon = Math.ceil(WEST / 5) * 5; lon <= EAST; lon += 5) {
        const p = this.xy(lon, SOUTH, L);
        ctx.beginPath(); ctx.moveTo(p.x, L.y); ctx.lineTo(p.x, L.y + L.h); ctx.stroke();
        ctx.fillText(`${lon}°E`, p.x + 3, L.y + L.h - 6);
      }
      for (let lat = Math.ceil(SOUTH / 5) * 5; lat <= NORTH; lat += 5) {
        const p = this.xy(WEST, lat, L);
        ctx.beginPath(); ctx.moveTo(L.x, p.y); ctx.lineTo(L.x + L.w, p.y); ctx.stroke();
        ctx.fillText(`${lat}°N`, L.x + 4, p.y - 3);
      }
    }

    drawLand(ctx, L) {
      if (!this.map) return;
      ctx.fillStyle = "#4a5c4e";
      ctx.strokeStyle = "rgba(200, 214, 190, 0.25)";
      ctx.lineWidth = 1;
      for (const ring of this.map.land) {
        if (ring.length < 3) continue;
        ctx.beginPath();
        ring.forEach((pt, i) => {
          const p = this.xy(pt[0], pt[1], L);
          if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
    }

    drawTracks(ctx, L) {
      for (const s of this.storms) {
        if (s.track.length < 2) continue;
        ctx.strokeStyle = s.dead ? "rgba(154,164,178,0.25)" : s.devil ? "rgba(168,130,255,0.7)" : "rgba(196,69,60,0.55)";
        ctx.lineWidth = 1.6;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        s.track.forEach((t, i) => {
          const p = this.xy(t.lon, t.lat, L);
          if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
        });
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    drawPlaces(ctx, L) {
      ctx.fillStyle = "rgba(231,226,216,0.55)";
      ctx.textAlign = "left";
      ctx.font = "11px 'Noto Sans TC', sans-serif";
      for (const c of PLACES) {
        const p = this.xy(c.lon, c.lat, L);
        ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI * 2); ctx.fill();
        ctx.fillText(c.name, p.x + 5, p.y + 4);
      }
    }

    drawStorms(ctx, L) {
      for (const s of this.storms) {
        if (s.dead) continue;
        const p = this.xy(s.lon, s.lat, L);
        const r = 14 + s.kt * 0.16;
        const galeKm = s.devil ? 200 : s.kt >= 64 ? 220 : s.kt >= 48 ? 280 : 360;
        const gale = (galeKm / 111) * (L.w / (EAST - WEST));
        ctx.beginPath(); ctx.arc(p.x, p.y, gale, 0, Math.PI * 2);
        ctx.fillStyle = s.devil ? "rgba(124,58,237,0.18)" : "rgba(196,69,60,0.12)";
        ctx.fill();
        ctx.strokeStyle = s.devil ? "rgba(196,181,253,0.65)" : "rgba(196,69,60,0.4)";
        ctx.stroke();
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(this.time * (s.devil ? 2.2 : 1.6));
        ctx.strokeStyle = s.devil ? "#c4b5fd" : "#e07068";
        ctx.lineWidth = s.devil ? 3.2 : 2.4;
        ctx.beginPath();
        for (let i = 0; i < 2; i++) {
          ctx.rotate(Math.PI);
          ctx.moveTo(3, 0);
          ctx.quadraticCurveTo(r * 0.7, r * 0.28, r, 0);
        }
        ctx.stroke();
        ctx.restore();
        ctx.beginPath(); ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = s.devil ? "#ddd6fe" : "#f0c9c6"; ctx.fill();
        ctx.fillStyle = s.devil ? "#c4b5fd" : "#e7e2d8";
        ctx.font = "600 11px 'Noto Sans TC', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(s.devil ? `魔鬼 ${s.name}` : s.name, p.x, p.y - r - 6);
        ctx.font = "10px 'IBM Plex Mono', monospace";
        ctx.fillStyle = s.devil ? "rgba(196,181,253,0.9)" : "rgba(231,226,216,0.7)";
        ctx.fillText(`${s.kt.toFixed(0)} kt`, p.x, p.y + r + 12);
      }
    }

    drawHk(ctx, L) {
      const p = this.xy(this.hk.lon, this.hk.lat, L);
      const home = this.xy(HK0.lon, HK0.lat, L);
      if (Math.hypot(this.hk.lon - HK0.lon, this.hk.lat - HK0.lat) > 0.35) {
        ctx.setLineDash([4, 3]);
        ctx.beginPath(); ctx.moveTo(home.x, home.y); ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = "rgba(201,161,91,0.45)"; ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = "rgba(231,226,216,0.55)";
        ctx.font = "11px 'Noto Sans TC', sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("原址", home.x + 7, home.y + 4);
      }
      if (this.leeT > 0) {
        const rad = (10 / (EAST - WEST)) * L.w * (1 + 0.05 * Math.sin(this.time * 6));
        ctx.beginPath(); ctx.arc(p.x, p.y, rad, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(201,161,91,0.8)"; ctx.lineWidth = 2; ctx.stroke();
      }
      ctx.beginPath();
      ctx.moveTo(p.x, p.y - 7); ctx.lineTo(p.x + 6, p.y + 5); ctx.lineTo(p.x - 6, p.y + 5);
      ctx.closePath();
      ctx.fillStyle = "#e7e2d8"; ctx.fill();
      ctx.strokeStyle = "#c4453c"; ctx.lineWidth = 1.6; ctx.stroke();
      ctx.fillStyle = "#e7e2d8";
      ctx.font = "700 13px 'Noto Sans TC', sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("香港", p.x + 10, p.y - 6);
    }
  }

  const canvas = document.getElementById("map");
  const ui = {
    hud(g) {
      const sig = document.getElementById("sig");
      sig.textContent = sigLabel(g.signal);
      sig.className = "chip" + (g.signal >= 9 ? " hot" : g.signal === 8 ? " warn" : "");
      const cy = document.getElementById("cycle");
      cy.textContent = g.cycle === "bull" ? "牛市" : "熊市";
      cy.className = "chip " + g.cycle;
      const hsi = document.getElementById("hsi");
      hsi.textContent = fmtHsi(g.hsi);
      const up = g.hsiDelta >= 0;
      hsi.className = g.haltT > 0 ? "halted" : up ? "up" : "down";
      const d = document.getElementById("delta");
      d.className = g.haltT > 0 ? "halted" : up ? "up" : "down";
      d.textContent = g.haltT > 0 ? `停市 ${g.haltT.toFixed(1)}s` : `${up ? "+" : ""}${g.hsiDelta.toFixed(0)}`;
      const ban = document.getElementById("banner");
      if (g.banner) { ban.textContent = g.banner; ban.classList.remove("hidden"); }
      else ban.classList.add("hidden");
      const live = g.storms.filter((s) => !s.dead).length;
      document.getElementById("stats").innerHTML =
        `風季剩餘 ${fmtTime(Math.max(0, SEASON - g.time))}${g.time >= HARD_AT ? " · 下半季" : ""}<br>` +
        `力場 ${g.leeCharges}/${LEE_MAX}${g.leeT > 0 ? " · 展開中" : ""}<br>` +
        `停市 ${g.haltCharges}/1${g.haltT > 0 ? " · 生效中" : g.time >= HARD_AT ? "" : " · 下半季解鎖"}<br>` +
        `在場氣旋 ${live} · 消散 ${g.dodged}<br>` +
        `香港 ${g.hk.lat.toFixed(2)}°N ${g.hk.lon.toFixed(2)}°E<br>` +
        `${g._nearest > 0 ? `最近風暴 ${Math.round(g._nearest)} km` : "暫無威脅"}<br>` +
        `WASD 搬遷 · 空白力場 · F 停市`;
      document.getElementById("lee").disabled = !(g.leeCharges > 0 && g.leeCd <= 0 && g.leeT <= 0);
      document.getElementById("halt").disabled = !(g.time >= HARD_AT && g.haltCharges > 0 && g.haltT <= 0);
    },
    end(win, g) {
      document.getElementById("hud").classList.add("hidden");
      const el = document.getElementById("end");
      el.classList.remove("hidden");
      const haltFail = !win && g.loseKind === "halt";
      document.getElementById("endKicker").textContent = win ? "風季結束" : haltFail ? "強制收市" : "市場停擺";
      document.getElementById("endTitle").textContent = win ? "收市" : haltFail ? "停市失敗" : "恆指歸零";
      document.getElementById("endBody").textContent = win
        ? `你把香港熬過這個風季。收市恆指 ${fmtHsi(g.hsi)}。`
        : haltFail
          ? "停市五秒結束，八號或以上警告仍未除下。"
          : "八號風球疊加熊市，指數再無支撐。";
    },
  };

  const game = new Game(canvas, ui);
  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.floor(r.width * dpr));
    canvas.height = Math.max(1, Math.floor(r.height * dpr));
  };
  resize();
  window.addEventListener("resize", resize);

  window.addEventListener("keydown", (e) => {
    game.keys.add(e.code);
    if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) e.preventDefault();
  });
  window.addEventListener("keyup", (e) => game.keys.delete(e.code));

  document.getElementById("helpBtn").onclick = () => {
    document.getElementById("title").classList.add("hidden");
    document.getElementById("help").classList.remove("hidden");
  };
  document.getElementById("helpBack").onclick = () => {
    document.getElementById("help").classList.add("hidden");
    document.getElementById("title").classList.remove("hidden");
  };
  document.getElementById("start").onclick = async () => {
    document.getElementById("start").disabled = true;
    await game.load();
    document.getElementById("title").classList.add("hidden");
    document.getElementById("hud").classList.remove("hidden");
    game.start();
  };
  document.getElementById("lee").onclick = () => game.tryLee();
  document.getElementById("halt").onclick = () => game.tryHalt();
  document.getElementById("replay").onclick = () => location.reload();
})();
