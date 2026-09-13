(() => {
  const FIXED = 1 / 60;
  const START_HSI = 20000;
  const SEASON = 480;
  const HARD_AT = 240;
  const HK0 = { lon: 114.17, lat: 22.32 };
  const WEST = 105, EAST = 140, SOUTH = 7, NORTH = 31;
  const MASK_WEST = 100, MASK_EAST = 140, MASK_SOUTH = 7, MASK_NORTH = 36;
  const MOVE = 1.26;
  const LEE_MAX = 3;
  const DASH_MAX = 5;
  const DASH_DUR = 3;
  const DASH_MULT = 3.2;
  const DASH_CD = 10;
  const LAND_WEAKEN = 5.95 * 0.85;
  const T8_DRAG = 475;
  const SPAWN_N = 5.3 / 1.5;
  const SPAWN_H = 3.8 / 1.5;
  const BEAR_MIN = 14;
  const BEAR_MAX = 96;
  const SIG_MULT = { 0: 0, 1: 0.04, 3: 0.1, 8: 1, 9: 2, 10: 4 };
  const NAMES = ["馬鞍","小犬","蘇拉","海葵","泰利","暹芭","軒嵐諾","梅花","楊柳","蝴蝶","韋帕","榕樹"];
  const PLACES = [
    { name: "廣州", lon: 113.26, lat: 23.13, size: 11 },
    { name: "台北", lon: 121.57, lat: 25.03, size: 11 },
    { name: "馬尼拉", lon: 120.98, lat: 14.6, size: 11 },
    { name: "那霸", lon: 127.68, lat: 26.21, size: 10 },
    { name: "河內", lon: 105.85, lat: 21.03, size: 10 },
    { name: "上海", lon: 121.47, lat: 31.23, size: 11 },
    { name: "海口", lon: 110.35, lat: 20.02, size: 10 },
    { name: "大阪", lon: 135.5, lat: 34.69, size: 10 },
    { name: "廈門", lon: 118.09, lat: 24.48, size: 10 },
    { name: "曼谷", lon: 100.5, lat: 13.76, size: 10 },
  ];
  const SAVE_KEY = "signal8-hsi-v2";

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerpHeading = (a, b, t) => {
    const d = ((b - a + 540) % 360) - 180;
    return (a + d * t + 360) % 360;
  };
  const raiseSignal = (cur, next) => (next > cur ? next : cur);
  const galeRadiusKm = (s) => {
    const base = s.devil ? 200 : s.kt >= 64 ? 220 : s.kt >= 48 ? 280 : 360;
    return base * (s.galeMul ?? (s.devil ? 1.75 : 1));
  };
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

  const save = {
    load() {
      try {
        const raw = localStorage.getItem(SAVE_KEY);
        if (!raw) return { bestClose: 0, stormsDodged: 0, gamesPlayed: 0 };
        const j = JSON.parse(raw);
        return {
          bestClose: j.bestClose || 0,
          stormsDodged: j.stormsDodged || 0,
          gamesPlayed: j.gamesPlayed || 0,
        };
      } catch {
        return { bestClose: 0, stormsDodged: 0, gamesPlayed: 0 };
      }
    },
    record(close, dodged) {
      const prev = save.load();
      const next = {
        bestClose: Math.max(prev.bestClose, close),
        stormsDodged: Math.max(prev.stormsDodged, dodged),
        gamesPlayed: prev.gamesPlayed + 1,
      };
      try { localStorage.setItem(SAVE_KEY, JSON.stringify({ version: 2, ...next })); } catch {}
      return next;
    },
  };

  const audio = {
    ctx: null, master: null, sfx: null, amb: null,
    muted: false, started: false,
    rainGain: null, windGain: null, windFilter: null,
    noiseBuf(seconds = 2) {
      const ac = this.ctx, n = ac.sampleRate * seconds;
      const buf = ac.createBuffer(1, n, ac.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
      return buf;
    },
    unlock() {
      if (!this.ctx) {
        this.ctx = new AudioContext({ latencyHint: "interactive" });
        this.master = this.ctx.createGain();
        this.sfx = this.ctx.createGain();
        this.amb = this.ctx.createGain();
        this.sfx.gain.value = 0.7;
        this.amb.gain.value = 0.45;
        this.sfx.connect(this.master);
        this.amb.connect(this.master);
        this.master.connect(this.ctx.destination);
        this.master.gain.value = this.muted ? 0 : 1;
      }
      if (this.ctx.state === "suspended") void this.ctx.resume();
    },
    startAmbience() {
      if (!this.ctx || !this.amb || this.started) return;
      this.started = true;
      const ac = this.ctx, buf = this.noiseBuf(3);
      this.rainGain = ac.createGain();
      this.rainGain.gain.value = 0.18;
      const rainFilter = ac.createBiquadFilter();
      rainFilter.type = "highpass";
      rainFilter.frequency.value = 1800;
      const rain = ac.createBufferSource();
      rain.buffer = buf; rain.loop = true;
      rain.connect(rainFilter); rainFilter.connect(this.rainGain); this.rainGain.connect(this.amb);
      rain.start();
      this.windGain = ac.createGain();
      this.windGain.gain.value = 0.08;
      this.windFilter = ac.createBiquadFilter();
      this.windFilter.type = "bandpass";
      this.windFilter.frequency.value = 280;
      this.windFilter.Q.value = 0.7;
      const wind = ac.createBufferSource();
      wind.buffer = buf; wind.loop = true;
      wind.connect(this.windFilter); this.windFilter.connect(this.windGain); this.windGain.connect(this.amb);
      wind.start();
    },
    setMuted(v) {
      this.muted = v;
      if (this.master) this.master.gain.setTargetAtTime(v ? 0 : 1, this.ctx.currentTime, 0.03);
    },
    setStorm(signal) {
      if (!this.ctx || !this.rainGain || !this.windGain || !this.windFilter) return;
      const t = this.ctx.currentTime;
      const rain = signal <= 1 ? 0.12 : signal <= 3 ? 0.2 : signal <= 8 ? 0.32 : 0.42;
      const wind = signal <= 1 ? 0.05 : signal <= 3 ? 0.1 : signal <= 8 ? 0.2 : signal >= 10 ? 0.38 : 0.28;
      const freq = signal >= 10 ? 420 : signal >= 8 ? 340 : 240;
      this.rainGain.gain.setTargetAtTime(rain, t, 0.4);
      this.windGain.gain.setTargetAtTime(wind, t, 0.4);
      this.windFilter.frequency.setTargetAtTime(freq, t, 0.5);
    },
    beep(freq, dur, type, gain = 0.12, slide = 0) {
      if (!this.ctx || !this.sfx) return;
      const t = this.ctx.currentTime;
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = type;
      o.frequency.setValueAtTime(freq, t);
      if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t + dur);
      g.gain.setValueAtTime(gain, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      o.connect(g); g.connect(this.sfx);
      o.start(t); o.stop(t + dur + 0.02);
    },
    board() { this.beep(140, 0.16, "square", 0.08, -40); },
    ticker(up) { this.beep(up ? 880 : 220, 0.06, "square", 0.04); },
    signal() { this.beep(392, 0.28, "sine", 0.1); setTimeout(() => this.beep(330, 0.4, "sine", 0.1), 220); },
    thunder() {
      if (!this.ctx || !this.sfx) return;
      const t = this.ctx.currentTime;
      const src = this.ctx.createBufferSource();
      src.buffer = this.noiseBuf(0.8);
      const f = this.ctx.createBiquadFilter();
      f.type = "lowpass";
      f.frequency.setValueAtTime(180, t);
      f.frequency.exponentialRampToValueAtTime(60, t + 0.6);
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(0.55, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.7);
      src.connect(f); f.connect(g); g.connect(this.sfx);
      src.start(t);
    },
    win() { this.beep(523, 0.18, "sine", 0.08); setTimeout(() => this.beep(659, 0.18, "sine", 0.08), 140); setTimeout(() => this.beep(784, 0.3, "sine", 0.09), 280); },
    lose() { this.beep(220, 0.4, "triangle", 0.1, -140); },
    field() { this.beep(523, 0.12, "sine", 0.09); this.beep(784, 0.28, "triangle", 0.07); },
    dash() { this.beep(880, 0.1, "square", 0.07, 420); this.beep(1320, 0.22, "triangle", 0.06, -200); },
    resume() { if (this.ctx && this.ctx.state === "suspended") void this.ctx.resume(); },
  };

  class Game {
    constructor(canvas, ui) {
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.ui = ui;
      this.keys = new Set();
      this.stick = { x: 0, y: 0 };
      this.actEdge = false;
      this.dashEdge = false;
      this.map = null;
      this.running = false;
      this.ended = false;
      this.paused = false;
      this.acc = 0;
      this.last = 0;
      this.raf = 0;
      this.reducedShake = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }

    async load() {
      const res = await fetch("maps/east-asia.json");
      if (!res.ok) throw new Error("地圖未能載入");
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
      this.paused = false;
      this.last = performance.now();
      cancelAnimationFrame(this.raf);
      const loop = (now) => {
        if (!this.running) return;
        let dt = (now - this.last) / 1000;
        this.last = now;
        if (dt > 0.1) dt = 0.1;
        if (!this.paused && !this.ended) {
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

    stop() {
      this.running = false;
      cancelAnimationFrame(this.raf);
      this.keys.clear();
      this.stick.x = 0;
      this.stick.y = 0;
    }

    pause(v) {
      if (this.ended || !this.running || this.awaitingWin) return;
      this.paused = v;
      this.ui.pause(v);
    }

    reset() {
      this.hk = { lon: HK0.lon, lat: HK0.lat, vx: 0, vy: 0 };
      this.storms = [];
      this.hsi = START_HSI;
      this.hsiDelta = 0;
      this.hsiMark = START_HSI;
      this.hsiMarkT = 0;
      this.spark = Array.from({ length: 48 }, () => START_HSI);
      this.sparkT = 0;
      this.cycle = Math.random() < 0.55 ? "bull" : "bear";
      this.bearSpan = 36 + Math.random() * 14;
      this.cycleT = this.cycle === "bear" ? this.bearSpan : 32 + Math.random() * 16;
      this.signal = 0;
      this.lastSignal = 0;
      this.time = 0;
      this.ended = false;
      this.paused = false;
      this.endless = false;
      this.awaitingWin = false;
      this.loseKind = null;
      this.banner = this.cycle === "bull" ? "牛市展開 · 恆指以兩萬點開市" : "熊市開局 · 仍以兩萬點起步";
      this.bannerT = 2.6;
      this.trauma = 0;
      this.leeCharges = LEE_MAX;
      this.leeCd = 0;
      this.leeT = 0;
      this.dashCharges = DASH_MAX;
      this.dashT = 0;
      this.dashCd = 0;
      this.lastIx = 0;
      this.lastIy = 0;
      this.dashTrail = [];
      this.dodged = 0;
      this.nameI = 0;
      this.nextSpawn = 0.8;
      this.noise = 0;
      this.waveT = 0;
      this.gapT = 1.6 + Math.random() * 1.4;
      this.heading = 0;
      this.spaceWas = false;
      this.fWas = false;
      this.eWas = false;
      this.shiftWas = false;
      this.haltCharges = 1;
      this.haltT = 0;
      this.hardAnnounced = false;
      this.devilCount = 0;
      this._nearest = 0;
      this.lastHud = 0;
      this.actEdge = false;
      this.dashEdge = false;
      audio.setStorm(0);
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
      if (this.dashT > 0) this.dashT = Math.max(0, this.dashT - dt);
      this.dashCd = Math.max(0, this.dashCd - dt);
      if (this.actEdge || this.just("Space", "spaceWas")) this.tryLee();
      this.actEdge = false;
      if (this.just("KeyF", "fWas")) this.tryHalt();
      const shiftNow = this.keys.has("ShiftLeft") || this.keys.has("ShiftRight");
      const shiftEdge = shiftNow && !this.shiftWas;
      this.shiftWas = shiftNow;
      if (this.dashEdge || this.just("KeyE", "eWas") || shiftEdge) this.tryDash();
      this.dashEdge = false;
      if (!this.hardAnnounced && this.time >= HARD_AT) {
        this.hardAnnounced = true;
        this.flash("下半季開始 · 魔鬼風暴可能生成", 2.5);
        this.trauma = 0.35;
      }
      this.trauma = Math.max(0, this.trauma - dt * 1.4);
      this.bannerT -= dt;
      if (this.bannerT <= 0) this.banner = null;
      this.sparkT += dt;
      if (this.sparkT > 0.32) {
        this.sparkT = 0;
        this.spark.push(this.hsi);
        if (this.spark.length > 48) this.spark.shift();
      }
      this.lastHud += dt;
      if (this.lastHud > 0.08) {
        this.lastHud = 0;
        this.pushHud();
      }
      if (this.time >= SEASON && !this.ended && !this.endless && !this.awaitingWin) this.offerWin();
      if (this.hsi <= 0 && !this.ended) this.lose("zero");
    }

    just(code, flag) {
      const now = this.keys.has(code);
      const edge = now && !this[flag];
      this[flag] = now;
      return edge;
    }

    moveHk(dt) {
      let ix = this.stick.x, iy = this.stick.y;
      if (this.keys.has("KeyA") || this.keys.has("ArrowLeft")) { ix -= 1; this.heading += 2.6 * dt; }
      if (this.keys.has("KeyD") || this.keys.has("ArrowRight")) { ix += 1; this.heading -= 2.6 * dt; }
      if (this.keys.has("KeyW") || this.keys.has("ArrowUp")) iy -= 1;
      if (this.keys.has("KeyS") || this.keys.has("ArrowDown")) iy += 1;
      const m = Math.hypot(ix, iy);
      if (m > 1) { ix /= m; iy /= m; }
      if (m > 0.12) { this.lastIx = ix; this.lastIy = iy; }
      const dash = this.dashT > 0;
      const useX = m > 0.12 ? ix : dash ? this.lastIx : 0;
      const useY = m > 0.12 ? iy : dash ? this.lastIy : 0;
      const speed = dash ? MOVE * DASH_MULT : MOVE;
      this.hk.vx = useX * speed;
      this.hk.vy = -useY * speed;
      this.hk.lon = clamp(this.hk.lon + this.hk.vx * dt, WEST + 0.6, EAST - 0.6);
      this.hk.lat = clamp(this.hk.lat + this.hk.vy * dt, SOUTH + 0.6, NORTH - 0.6);
      if (dash) {
        this.dashTrail.push({ lon: this.hk.lon, lat: this.hk.lat });
        if (this.dashTrail.length > 22) this.dashTrail.shift();
      } else if (this.dashTrail.length) this.dashTrail.shift();
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

    spawnOffMap(side) {
      if (side === "east") {
        return {
          lon: EAST + 2.4 + Math.random() * 11,
          lat: 9.5 + Math.random() * 16,
          heading: 258 + Math.random() * 30,
        };
      }
      return {
        lon: 108 + Math.random() * 20,
        lat: SOUTH - 1.3 - Math.random() * 5.4,
        heading: (348 + Math.random() * 32) % 360,
      };
    }

    spawnStorms() {
      if (this.time < this.nextSpawn) return;
      if (!this.endless && this.time > SEASON - 12) return;
      const overtime = Math.max(0, this.time - SEASON);
      const hard = this.time >= HARD_AT || this.endless;
      this.nextSpawn += this.endless
        ? Math.max(0.75, SPAWN_H * (1 - Math.min(0.72, overtime / 300)))
        : hard
          ? SPAWN_H
          : SPAWN_N;
      const roll = Math.random();
      const origin = this.nameI === 0 ? "map" : roll < 0.62 ? "map" : roll < 0.84 ? "east" : "south";
      let pos = null;
      if (origin === "east" || origin === "south") {
        for (let n = 0; n < 8; n++) {
          const cand = this.spawnOffMap(origin);
          if (distKm(cand.lon, cand.lat, this.hk.lon, this.hk.lat) < 420) continue;
          pos = cand;
          break;
        }
        if (!pos) pos = this.spawnOffMap(origin);
      } else {
        for (let n = 0; n < 14; n++) {
          const cand = this.randomOcean();
          if (!cand) continue;
          if (distKm(cand.lon, cand.lat, this.hk.lon, this.hk.lat) < 280) continue;
          pos = { lon: cand.lon, lat: cand.lat, heading: 272 + Math.random() * 28 };
          break;
        }
        if (!pos) {
          const fallback = this.randomOcean();
          if (fallback) pos = { lon: fallback.lon, lat: fallback.lat, heading: 272 + Math.random() * 28 };
        }
      }
      if (!pos) return;
      let devil = false;
      if (this.endless) {
        const p = 0.2 + Math.min(0.48, overtime / 280);
        devil = Math.random() < p;
      } else if (hard && this.devilCount < 4) {
        devil = Math.random() < (this.devilCount === 0 ? 0.62 : 0.14);
      }
      const japan = origin !== "south" && Math.random() < 0.34;
      const name = NAMES[this.nameI++ % NAMES.length];
      if (devil) this.devilCount += 1;
      const galeMul = devil ? 1.5 + Math.random() * 0.5 : 1;
      const late = this.endless ? Math.min(0.85, overtime / 320) : 0;
      this.storms.push({
        name, lon: pos.lon, lat: pos.lat, heading: pos.heading,
        speed: (devil ? 2.05 + Math.random() * 0.55 : 1.68 + Math.random() * 0.72) * (1 + late * 0.35),
        kt: devil ? 102 + Math.random() * 16 : 22 + Math.random() * 10,
        track: [{ lon: pos.lon, lat: pos.lat }],
        age: 0, dead: false,
        steer: japan ? "japan" : "west",
        origin,
        recurveAt: 4 + Math.random() * 5,
        devil,
        galeMul,
      });
      const where = origin === "east" ? "自太平洋東面逼近" : origin === "south" ? "自南海以南北上" : "於洋面生成";
      this.flash(`${devil ? "魔鬼風暴" : "熱帶低氣壓"} ${name} ${where}`, devil ? 2.4 : 1.8);
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
        if (this.isLand(s.lon, s.lat)) s.kt -= LAND_WEAKEN * dt;
        else s.kt += (s.kt < 34 ? 1.6 : s.kt < 64 ? 1.1 : s.kt < 95 ? 0.55 : 0.15) * dt;
        s.kt = clamp(s.kt, 0, s.devil ? 165 : 145);
        if (s.age % 0.35 < dt) s.track.push({ lon: s.lon, lat: s.lat });
        if (s.track.length > 90) s.track.shift();
        const off = s.lon < WEST - 6 || s.lon > EAST + 16 || s.lat < SOUTH - 9 || s.lat > NORTH + 5;
        if (s.kt < 16 || off) {
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
        audio.setStorm(sig);
        if (sig > prev) {
          if (sig === 10) { this.flash("十號颶風信號 · 恆指急挫", 2.4); audio.thunder(); audio.signal(); this.trauma = 0.7; }
          else if (sig === 9) { this.flash("九號烈風增強信號 · 大市受壓", 2.2); audio.signal(); }
          else if (sig === 8) { this.flash("八號烈風或暴風信號生效 · 恆指受拖累", 2.4); audio.signal(); audio.thunder(); this.trauma = 0.4; }
          else if (sig === 3) { this.flash("三號強風信號 · 恐慌拋售加劇", 1.8); audio.signal(); }
          else if (sig === 1) this.flash("一號戒備信號 · 市場恐慌拋售", 1.6);
        } else if (sig < prev) {
          const drop = SIG_MULT[prev] - SIG_MULT[sig];
          if (drop > 0) this.hsi = Math.max(0, this.hsi + drop * (520 + Math.random() * 380));
          if (prev >= 8 && sig < 8) this.flash("八號或以上除下 · 市場回穩", 2.2);
          else if (sig === 0) this.flash("警告除下 · 恐慌減退", 1.8);
        }
      } else this.signal = sig;
    }

    inGaleCircle() {
      for (const s of this.storms) {
        if (s.dead) continue;
        if (distKm(this.hk.lon, this.hk.lat, s.lon, s.lat) < galeRadiusKm(s)) return true;
      }
      return false;
    }

    updateHsi(dt) {
      const inCircle = this.inGaleCircle();
      if (inCircle) {
        this.bearSpan = clamp(this.bearSpan + 9 * dt, BEAR_MIN, BEAR_MAX);
        if (this.cycle === "bear") this.cycleT = Math.min(BEAR_MAX, this.cycleT + 8 * dt);
        else this.cycleT -= 1.55 * dt;
      } else {
        this.bearSpan = clamp(this.bearSpan - 5 * dt, BEAR_MIN, BEAR_MAX);
        this.cycleT -= this.cycle === "bear" ? 1.5 * dt : dt;
      }
      if (this.cycleT <= 0) {
        this.cycle = this.cycle === "bull" ? "bear" : "bull";
        this.cycleT = this.cycle === "bear" ? this.bearSpan : 30 + Math.random() * 16;
        this.flash(
          this.cycle === "bull"
            ? "牛市展開"
            : this.bearSpan > 55
              ? "漫長熊市來襲 · 風圈滯留所致"
              : "熊市來襲",
          2
        );
        audio.ticker(this.cycle === "bull");
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
      this.hsiMarkT += dt;
      if (this.hsiMarkT >= 0.45) {
        this.hsiDelta = this.hsi - this.hsiMark;
        this.hsiMark = this.hsi;
        this.hsiMarkT = 0;
      }
    }

    tryLee() {
      if (this.paused || this.ended) return;
      if (this.leeT > 0 || this.leeCd > 0 || this.leeCharges <= 0) return;
      this.leeCharges -= 1;
      this.leeT = 7.5;
      this.leeCd = 16;
      audio.field();
      this.flash("李氏力場展開 · 氣旋受拒", 2);
      this.trauma = 0.25;
    }

    tryDash() {
      if (this.paused || this.ended) return;
      if (this.dashT > 0 || this.dashCd > 0) return;
      if (!this.endless && this.dashCharges <= 0) return;
      if (!this.endless) this.dashCharges -= 1;
      this.dashT = DASH_DUR;
      this.dashCd = DASH_CD;
      audio.dash();
      this.flash(this.endless ? "快閃移動 · 無盡不限次" : "快閃移動 · 香港急航三秒", 1.8);
    }

    tryHalt() {
      if (this.paused || this.ended || this.haltT > 0 || this.haltCharges <= 0) return;
      if (this.time < HARD_AT) { this.flash("下半季才可停市", 1.6); return; }
      this.haltCharges -= 1;
      this.haltT = 5;
      audio.board();
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
      audio.ticker(true);
    }

    flash(text, t) { this.banner = text; this.bannerT = t; }
    offerWin() {
      if (this.ended || this.endless || this.awaitingWin) return;
      this.awaitingWin = true;
      this.paused = true;
      this.hsi = Math.max(1, this.hsi);
      save.record(this.hsi, this.dodged);
      audio.win();
      this.pushHud();
      this.ui.offerWin(this);
    }
    continueEndless() {
      if (!this.awaitingWin || this.ended) return;
      this.awaitingWin = false;
      this.endless = true;
      this.paused = false;
      this.flash("無盡模式 · 魔鬼風暴仍在 · 快閃不限次", 2.6);
      this.ui.resumePlay();
    }
    leaveWin() {
      if (this.ended) return;
      this.awaitingWin = false;
      this.ended = true;
      this.paused = false;
      this.hsi = Math.max(1, this.hsi);
      this.pushHud();
      this.ui.end(true, this);
    }
    win() {
      this.leaveWin();
    }
    lose(kind) {
      this.ended = true;
      this.awaitingWin = false;
      this.paused = false;
      this.loseKind = kind;
      if (kind === "zero") this.hsi = 0;
      save.record(kind === "zero" ? 0 : this.hsi, this.dodged);
      audio.lose();
      this.pushHud();
      this.ui.end(false, this);
    }

    pushHud() { this.ui.hud(this); }

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
      const shake = this.reducedShake ? 0 : this.trauma * this.trauma * 10;
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
      this.drawInbound(ctx, L);
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
      ctx.fillStyle = "#5a6b52";
      ctx.strokeStyle = "rgba(232, 204, 140, 0.7)";
      ctx.lineWidth = 1.6;
      ctx.lineJoin = "round";
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
      for (const c of PLACES) {
        const p = this.xy(c.lon, c.lat, L);
        ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI * 2); ctx.fill();
        ctx.font = `${c.size}px 'Noto Sans TC', sans-serif`;
        ctx.fillText(c.name, p.x + 5, p.y + 4);
      }
    }

    drawStorms(ctx, L) {
      for (const s of this.storms) {
        if (s.dead) continue;
        const p = this.xy(s.lon, s.lat, L);
        const r = 14 + s.kt * 0.16;
        const galeKm = galeRadiusKm(s);
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

    drawInbound(ctx, L) {
      for (const s of this.storms) {
        if (s.dead) continue;
        if (s.lon >= WEST && s.lon <= EAST && s.lat >= SOUTH && s.lat <= NORTH) continue;
        const p = this.xy(s.lon, s.lat, L);
        const x = clamp(p.x, L.x + 10, L.x + L.w - 10);
        const y = clamp(p.y, L.y + 10, L.y + L.h - 10);
        const col = s.devil ? "#c4b5fd" : "#e07068";
        ctx.fillStyle = col;
        ctx.beginPath();
        if (s.lon > EAST) {
          ctx.moveTo(L.x + L.w - 4, y);
          ctx.lineTo(L.x + L.w - 14, y - 7);
          ctx.lineTo(L.x + L.w - 14, y + 7);
        } else {
          ctx.moveTo(x, L.y + L.h - 4);
          ctx.lineTo(x - 7, L.y + L.h - 14);
          ctx.lineTo(x + 7, L.y + L.h - 14);
        }
        ctx.closePath();
        ctx.fill();
        ctx.font = "600 10px 'Noto Sans TC', sans-serif";
        ctx.textAlign = s.lon > EAST ? "right" : "center";
        ctx.fillText(
          s.name,
          s.lon > EAST ? L.x + L.w - 16 : x,
          s.lon > EAST ? y - 10 : L.y + L.h - 18
        );
      }
    }

    drawHk(ctx, L) {
      const p = this.xy(this.hk.lon, this.hk.lat, L);
      const home = this.xy(HK0.lon, HK0.lat, L);
      if (this.dashTrail && this.dashTrail.length > 1) {
        ctx.strokeStyle = "rgba(110,196,216,0.55)";
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.beginPath();
        this.dashTrail.forEach((t, i) => {
          const q = this.xy(t.lon, t.lat, L);
          if (i === 0) ctx.moveTo(q.x, q.y); else ctx.lineTo(q.x, q.y);
        });
        ctx.stroke();
      }
      if (Math.hypot(this.hk.lon - HK0.lon, this.hk.lat - HK0.lat) > 0.35) {
        ctx.setLineDash([4, 3]);
        ctx.beginPath(); ctx.moveTo(home.x, home.y); ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = "rgba(201,161,91,0.45)"; ctx.lineWidth = 1.2; ctx.stroke();
        ctx.setLineDash([]);
        ctx.beginPath(); ctx.arc(home.x, home.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(231,226,216,0.35)"; ctx.fill();
        ctx.strokeStyle = "rgba(201,161,91,0.7)"; ctx.lineWidth = 1; ctx.stroke();
        ctx.fillStyle = "rgba(231,226,216,0.55)";
        ctx.font = "11px 'Noto Sans TC', sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("原址", home.x + 7, home.y + 4);
      }
      if (this.leeT > 0) {
        const rad = (10 / (EAST - WEST)) * L.w * (1 + 0.05 * Math.sin(this.time * 6));
        ctx.beginPath(); ctx.arc(p.x, p.y, rad, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(201,161,91,0.85)"; ctx.lineWidth = 2; ctx.stroke();
        ctx.fillStyle = "rgba(201,161,91,0.12)"; ctx.fill();
      }
      if (this.dashT > 0) {
        const rad = 16 + 6 * Math.sin(this.time * 14);
        ctx.beginPath(); ctx.arc(p.x, p.y, rad, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(110,196,216,0.9)"; ctx.lineWidth = 2; ctx.stroke();
      }
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
        const b = a + Math.PI / 5;
        const x1 = p.x + Math.cos(a) * 8;
        const y1 = p.y + Math.sin(a) * 8;
        if (i === 0) ctx.moveTo(x1, y1);
        else ctx.lineTo(x1, y1);
        ctx.lineTo(p.x + Math.cos(b) * 3.4, p.y + Math.sin(b) * 3.4);
      }
      ctx.closePath();
      ctx.fillStyle = this.dashT > 0 ? "#d8f4fa" : "#e7e2d8"; ctx.fill();
      ctx.strokeStyle = this.dashT > 0 ? "#6ec4d8" : "#c4453c"; ctx.lineWidth = 1.6; ctx.stroke();
      ctx.fillStyle = "#e7e2d8";
      ctx.font = "700 13px 'Noto Sans TC', sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(this.dashT > 0 ? "香港 · 快閃" : "香港", p.x + 10, p.y - 6);
    }
  }

  const $ = (id) => document.getElementById(id);
  const canvas = $("map");
  const spark = $("spark");
  const sparkCtx = spark.getContext("2d");
  let helpFrom = "title";
  let muted = false;

  function drawSpark(data) {
    const w = spark.width, h = spark.height;
    sparkCtx.clearRect(0, 0, w, h);
    if (!data || data.length < 2) return;
    const min = Math.min(...data) - 40, max = Math.max(...data) + 40;
    sparkCtx.beginPath();
    data.forEach((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / (max - min || 1)) * h;
      if (i === 0) sparkCtx.moveTo(x, y); else sparkCtx.lineTo(x, y);
    });
    sparkCtx.strokeStyle = data[data.length - 1] >= data[0] ? "#d4483e" : "#2f8f6b";
    sparkCtx.lineWidth = 1.5;
    sparkCtx.stroke();
  }

  function showRecords() {
    const s = save.load();
    $("records").textContent =
      `收市紀錄 ${s.bestClose > 0 ? fmtHsi(s.bestClose) : "—"} / 逼走氣旋 ${s.stormsDodged}`;
  }

  const ui = {
    hud(g) {
      const sig = $("sig");
      sig.textContent = sigLabel(g.signal);
      sig.className = "chip" + (g.signal >= 9 ? " hot" : g.signal === 8 ? " warn" : "");
      const cy = $("cycle");
      cy.textContent = (g.cycle === "bull" ? "牛市" : "熊市") + " " + Math.max(0, g.cycleT).toFixed(0) + "s";
      cy.className = "chip " + g.cycle;
      const hsi = $("hsi");
      hsi.textContent = fmtHsi(g.hsi);
      const up = g.hsiDelta >= 0;
      hsi.className = g.haltT > 0 ? "halted" : up ? "up" : "down";
      const d = $("delta");
      d.className = g.haltT > 0 ? "halted" : up ? "up" : "down";
      d.textContent = g.haltT > 0 ? `停市 ${g.haltT.toFixed(1)}s` : `${up ? "+" : ""}${g.hsiDelta.toFixed(0)}`;
      const ban = $("banner");
      if (g.banner) { ban.textContent = g.banner; ban.classList.remove("hidden"); }
      else ban.classList.add("hidden");
      const live = g.storms.filter((s) => !s.dead).length;
      $("stats").innerHTML =
        `${g.endless ? `無盡 ${fmtTime(Math.max(0, g.time - SEASON))}` : `風季剩餘 ${fmtTime(Math.max(0, SEASON - g.time))}`}${g.time >= HARD_AT || g.endless ? " · 下半季" : ""}<br>` +
        `力場 ${g.leeCharges}/${LEE_MAX}${g.leeT > 0 ? " · 展開中" : ""}<br>` +
        `快閃 ${g.endless ? "不限" : `${g.dashCharges}/${DASH_MAX}`}${g.dashT > 0 ? ` · ${g.dashT.toFixed(1)}s` : g.dashCd > 0 ? ` · 冷卻 ${g.dashCd.toFixed(0)}s` : ""}<br>` +
        `${g.inGaleCircle() ? "滯留風圈 · 熊市延長" : "未入風圈 · 熊市縮短"}<br>` +
        `停市 ${g.haltCharges}/1${g.haltT > 0 ? " · 生效中" : g.time >= HARD_AT ? "" : " · 下半季解鎖"}<br>` +
        `在場氣旋 ${live} · 消散 ${g.dodged}<br>` +
        `香港 ${g.hk.lat.toFixed(2)}°N ${g.hk.lon.toFixed(2)}°E<br>` +
        `${g._nearest > 0 ? `最近風暴 ${Math.round(g._nearest)} km` : "暫無威脅"}<br>` +
        `<span class="desk-only">WASD 搬遷 · Shift 快閃 · 空白力場 · F 停市 · P 暫停</span>`;
      $("lee").disabled = !(g.leeCharges > 0 && g.leeCd <= 0 && g.leeT <= 0);
      $("dash").disabled = !((g.endless || g.dashCharges > 0) && g.dashT <= 0 && g.dashCd <= 0);
      $("halt").disabled = !(g.time >= HARD_AT && g.haltCharges > 0 && g.haltT <= 0);
      const hint = $("hint");
      const hintText = g.haltT > 0
        ? `停市剩餘 ${g.haltT.toFixed(1)} 秒 · 八號未除即完`
        : g.dashT > 0
          ? `快閃剩餘 ${g.dashT.toFixed(1)} 秒`
          : g.dashCd > 0
            ? `快閃冷卻 ${g.dashCd.toFixed(0)} 秒`
            : g.endless
              ? "無盡模式 · 魔鬼風暴會再來 · Shift 快閃不限次"
              : g.leeCd > 0
                ? `李氏力場冷卻 ${g.leeCd.toFixed(0)} 秒`
                : g.inGaleCircle()
                  ? "滯留風圈 · 熊市延長 · Shift 快閃五次"
                  : g.dashCharges > 0
                    ? "Shift／E：快閃三秒（每季五次、冷卻十秒）· 空白力場 · F 停市"
                    : g.leeCharges > 0
                      ? "空白鍵／力場：發動李氏力場（每季三次）· F 鍵停市"
                      : "力場與快閃已用盡 · F 鍵可停市一次";
      hint.textContent = hintText;
      hint.classList.remove("hidden");
      drawSpark(g.spark);
    },
    pause(on) {
      $("pause").classList.toggle("hidden", !on);
      if (on) $("help").classList.add("hidden");
    },
    resumePlay() {
      $("end").classList.add("hidden");
      $("hud").classList.remove("hidden");
      $("touch").classList.remove("hidden");
    },
    offerWin(g) {
      $("pause").classList.add("hidden");
      const el = $("end");
      el.classList.remove("hidden");
      $("endKicker").textContent = "風季結束";
      $("endTitle").textContent = "守住了";
      $("endBody").textContent = "恆指未歸零。可以收市離開，或以無盡模式繼續——氣旋不會停。";
      $("endStats").innerHTML = [
        ["現時恆指", fmtHsi(g.hsi), true],
        ["消散／逼走", String(g.dodged), false],
      ].map(([l, v, up]) => `<div class="stat"><div class="lbl">${l}</div><div class="val${up ? " up" : ""}">${v}</div></div>`).join("");
      $("endless").classList.remove("hidden");
      $("leaveWin").classList.remove("hidden");
      $("replay").classList.add("hidden");
    },
    end(win, g) {
      $("hud").classList.add("hidden");
      $("touch").classList.add("hidden");
      $("pause").classList.add("hidden");
      const el = $("end");
      el.classList.remove("hidden");
      const haltFail = !win && g.loseKind === "halt";
      $("endKicker").textContent = win ? "風季結束" : haltFail ? "強制收市" : "市場停擺";
      $("endTitle").textContent = win ? "收市" : haltFail ? "停市失敗" : "恆指歸零";
      $("endBody").textContent = win
        ? "你把香港熬過這個風季。以下是收市指數。"
        : haltFail
          ? "停市五秒結束，八號或以上警告仍未除下。"
          : "八號風球疊加熊市，指數再無支撐。";
      $("endStats").innerHTML = [
        ["收市恆指", fmtHsi(g.hsi), win],
        ["消散／逼走", String(g.dodged), false],
        ["周期", g.cycle === "bull" ? "牛" : "熊", false],
        ["結果", win ? "守住" : "失守", false],
      ].map(([l, v, up]) => `<div class="stat"><div class="lbl">${l}</div><div class="val${up ? " up" : ""}">${v}</div></div>`).join("");
      $("endless").classList.add("hidden");
      $("leaveWin").classList.add("hidden");
      $("replay").classList.remove("hidden");
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
    if ((e.code === "KeyP" || e.code === "Escape") && game.running && !game.ended) {
      e.preventDefault();
      game.pause(!game.paused);
    }
  });
  window.addEventListener("keyup", (e) => game.keys.delete(e.code));
  window.addEventListener("blur", () => game.keys.clear());
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") audio.resume();
    else game.keys.clear();
  });

  function openHelp(from) {
    helpFrom = from;
    $("title").classList.add("hidden");
    $("pause").classList.add("hidden");
    $("help").classList.remove("hidden");
  }
  function closeHelp() {
    $("help").classList.add("hidden");
    if (helpFrom === "pause") $("pause").classList.remove("hidden");
    else $("title").classList.remove("hidden");
  }

  $("helpBtn").onclick = () => openHelp("title");
  $("pauseHelp").onclick = () => openHelp("pause");
  $("helpBack").onclick = closeHelp;
  $("start").onclick = async () => {
    $("start").disabled = true;
    audio.unlock();
    audio.startAmbience();
    try {
      if (!game.map) await game.load();
      $("title").classList.add("hidden");
      $("end").classList.add("hidden");
      $("hud").classList.remove("hidden");
      $("touch").classList.remove("hidden");
      game.start();
    } catch (err) {
      $("start").disabled = false;
      $("records").textContent = err instanceof Error ? err.message : "未能載入";
    } finally {
      $("start").disabled = false;
    }
  };
  $("lee").onclick = () => game.tryLee();
  $("dash").onclick = () => game.tryDash();
  $("halt").onclick = () => game.tryHalt();
  $("leeTouch").onpointerdown = (e) => { e.preventDefault(); game.actEdge = true; };
  $("dashTouch").onpointerdown = (e) => { e.preventDefault(); game.tryDash(); };
  $("haltTouch").onpointerdown = (e) => { e.preventDefault(); game.tryHalt(); };
  $("pauseBtn").onclick = () => game.pause(true);
  $("resume").onclick = () => game.pause(false);
  $("quit").onclick = () => {
    game.stop();
    $("pause").classList.add("hidden");
    $("hud").classList.add("hidden");
    $("touch").classList.add("hidden");
    $("title").classList.remove("hidden");
    showRecords();
  };
  $("mute").onclick = () => {
    muted = !muted;
    audio.setMuted(muted);
    $("mute").textContent = muted ? "靜" : "聲";
    $("mute").setAttribute("aria-label", muted ? "開啟聲音" : "靜音");
  };
  $("replay").onclick = async () => {
    audio.unlock();
    audio.startAmbience();
    if (!game.map) await game.load();
    $("end").classList.add("hidden");
    $("hud").classList.remove("hidden");
    $("touch").classList.remove("hidden");
    game.start();
  };
  $("endless").onclick = () => game.continueEndless();
  $("leaveWin").onclick = () => game.leaveWin();

  const pad = $("pad"), knob = $("knob");
  let origin = null;
  pad.onpointerdown = (e) => {
    pad.setPointerCapture(e.pointerId);
    origin = { x: e.clientX, y: e.clientY, id: e.pointerId };
  };
  pad.onpointermove = (e) => {
    if (!origin || origin.id !== e.pointerId) return;
    const dx = e.clientX - origin.x, dy = e.clientY - origin.y;
    const m = Math.hypot(dx, dy), max = 42, k = m > max ? max / m : 1;
    knob.style.transform = `translate(${dx * k}px, ${dy * k}px)`;
    game.stick.x = (dx * k) / max;
    game.stick.y = (dy * k) / max;
  };
  const padUp = (e) => {
    if (origin && origin.id !== e.pointerId) return;
    origin = null;
    knob.style.transform = "";
    game.stick.x = 0;
    game.stick.y = 0;
  };
  pad.onpointerup = padUp;
  pad.onpointercancel = padUp;

  showRecords();
})();
