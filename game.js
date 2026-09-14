(() => {
const MAPS = {"hk":{"id":"hk","mapUrl":"maps/east-asia.json","west":105,"east":140,"south":7,"north":31,"maskWest":100,"maskEast":140,"maskSouth":7,"maskNorth":36,"home":{"lon":114.17,"lat":22.32},"start":20000,"sigMult":{"0":0,"1":0.04,"3":0.1,"8":2,"9":5,"10":12},"skipNine":false,"names":["馬鞍","小犬","蘇拉","海葵","泰利","暹芭","軒嵐諾","梅花","楊柳","蝴蝶","韋帕","榕樹"],"places":[{"name":"廣州","lon":113.26,"lat":23.13,"size":11},{"name":"台北","lon":121.57,"lat":25.03,"size":11},{"name":"馬尼拉","lon":120.98,"lat":14.6,"size":11},{"name":"那霸","lon":127.68,"lat":26.21,"size":10},{"name":"河內","lon":105.85,"lat":21.03,"size":10},{"name":"上海","lon":121.47,"lat":31.23,"size":11},{"name":"海口","lon":110.35,"lat":20.02,"size":10},{"name":"大阪","lon":135.5,"lat":34.69,"size":10},{"name":"廈門","lon":118.09,"lat":24.48,"size":10},{"name":"曼谷","lon":100.5,"lat":13.76,"size":10}],"copy":{"kicker":"西太平洋颱風季 · 恒生指數","title":"八號風球","sub":"李氏力場與搬遷香港","lede":"恆指以兩萬點開市，風季三分鐘。魔鬼風暴與少量超級魔鬼整季都可能出現。撐過可收市或無盡繼續。","start":"進入風季","loading":"正在掛圖…","help":"避風守則","back":"返回","pause":"暫停","pauseLede":"氣旋不會等你。","resume":"繼續","quit":"離開","index":"恒生指數","indexHint":"紅升綠跌 · 基準 20,000","bull":"牛市","bear":"熊市","bullFlash":"牛市展開","bearFlash":"熊市來襲","bearLong":"漫長熊市來襲 · 風圈滯留所致","home":"香港","homeMark":"原址","field":"李氏力場","fieldShort":"力場","fieldFlash":"李氏力場展開 · 擋開氣旋","dash":"快閃移動","dashShort":"快閃","dashFlash":"快閃移動 · 香港急航三秒","dashEndless":"快閃移動 · 無盡不限次","halt":"停市 5 秒","haltShort":"停市","haltFlash":"停市五秒 · 氣旋不停 · 八號未除則強制收市","haltEarly":"後半才可停市","haltResume":"恢復交易","haltFail":"停市結束 · 八號或以上仍生效","sig0":"除下","sig1":"1號","sig3":"3號","sig8":"8號","sig9":"9號","sig10":"10號","raise1":"一號戒備信號 · 市場恐慌拋售","raise3":"三號強風信號 · 恐慌拋售加劇","raise8":"八號烈風或暴風信號生效 · 恆指受拖累","raise9":"九號烈風增強信號 · 大市受壓","raise10":"十號颶風信號 · 恆指急挫","drop8":"八號或以上除下 · 市場回穩","drop0":"警告除下 · 恐慌減退","td":"熱帶低氣壓","devil":"魔鬼風暴","super":"超級魔鬼風暴","fromEast":"自太平洋東面逼近","fromSouth":"自南海以南北上","fromMap":"於洋面生成","pred":"預測","endlessFlash":"無盡模式 · 預測路徑準確度九成五 · 快閃不限次","winKicker":"風季結束","winTitle":"守住了","winBody":"恆指未歸零。可以收市離開，或以無盡模式繼續——氣旋不會停。","winLeave":"離開收市","endless":"無盡模式","overKicker":"市場停擺","haltKicker":"強制收市","overTitle":"恆指歸零","haltTitle":"停市失敗","winClose":"收市","overBody":"八號風球疊加熊市，指數再無支撐。","haltBody":"停市五秒結束，八號或以上警告仍未除下。","winBodyEnd":"你把香港熬過這個風季。以下是收市指數。","replay":"再來一季","seasonLeft":"風季剩餘","endlessHud":"無盡","inCircle":"滯留風圈 · 熊市延長","outCircle":"未入風圈 · 熊市縮短","controls":"WASD 搬遷 · Shift 快閃 · 空白力場 · F 停市","locale":"zh-HK","startBannerBull":"牛市展開 · 恆指以兩萬點開市","startBannerBear":"熊市開局 · 仍以兩萬點起步","hardFlash":"後半開始 · 氣旋更密 · 停市已解鎖","labelDevil":"魔鬼","labelSuper":"超魔","leeOn":"展開中","dashCd":"冷卻","haltOn":"生效中","haltLock":"後半解鎖","liveLabel":"在場","nearest":"最近風暴","noThreat":"暫無威脅","predHud":"預測路徑 95%","recClose":"收市紀錄","recDodge":"逼走氣旋","loadFail":"未能載入","muteOn":"靜音","muteOff":"開啟聲音","hardTag":"後半","dissipated":"消散"},"help":["地圖範圍北緯 7–31 度、東經 105–140 度，香港為焦點。","熱帶低氣壓可在可視範圍內任何洋面生成，亦可自圖外東面（西太平洋）或南面（南海）移入，但不會在你附近約 7.5 緯度直徑範圍內生成。登陸減弱偏慢。","一號、三號對恆指拖累已大減八成：一號 4%、三號 10%；八號、九號、十號各加重至 200%、500%、1200%（以原八號為 100%）。","恆指以 20,000 點為基準。牛市／熊市各有主軸。滯留颱風圈會拉長熊市，避開則逐步縮短。警告除下時，回升只及該信號一秒拖累的一半。","風季三分鐘。魔鬼風暴與少量超級魔鬼風暴整季都有機會生成。後半生成加快，可停市一次。","撐過風季且恆指未歸零即可收市，或改入無盡模式。無盡延續後半難度並隨時間再升，顯示未來三秒預測路徑與誤差圈（每三秒更新，準確度約九成五），快閃不限次數（冷卻與時長不變）。","部份氣旋起初偏北移動；其後轉向每秒不超過左右各 45 度。","紫色為魔鬼風暴，玫紅為超級魔鬼。風圈約為普通魔鬼的一倍半至兩倍以上。","後半可停市一次、為時五秒。停市只暫停交易，氣旋仍會移動。結束時若仍是八號或以上，即強制收市。","WASD 或搖桿搬遷香港。Shift 或 E 快閃移動三秒，每季五次，每次冷卻十秒。無盡模式快閃次數不限。","空白鍵發動李氏力場，把進入範圍的氣旋擋住並推開。每季三次，有冷卻。"]},"jp":{"id":"jp","mapUrl":"maps/japan.json","west":124,"east":150,"south":24,"north":46,"maskWest":124,"maskEast":150,"maskSouth":24,"maskNorth":46,"home":{"lon":139.69,"lat":35.69},"start":60000,"sigMult":{"0":0,"1":0.16,"3":0.4,"8":4,"9":4,"10":16},"skipNine":true,"names":["メアリー","ハイシェン","コイヌ","サンサン","ウーコン","マーゴン","トクラジ","マニー","ウサギ","ヤギ","インブド","クーロワン"],"places":[{"name":"大阪","lon":135.5,"lat":34.69,"size":11},{"name":"名古屋","lon":136.91,"lat":35.18,"size":10},{"name":"札幌","lon":141.35,"lat":43.06,"size":11},{"name":"福岡","lon":130.4,"lat":33.59,"size":10},{"name":"那覇","lon":127.68,"lat":26.21,"size":10},{"name":"仙台","lon":140.87,"lat":38.27,"size":10},{"name":"広島","lon":132.46,"lat":34.39,"size":10},{"name":"鹿児島","lon":130.56,"lat":31.6,"size":10},{"name":"ソウル","lon":126.98,"lat":37.57,"size":10}],"copy":{"kicker":"北西太平洋台風季 · 日経平均","title":"暴風警報","sub":"コロッケと東京の避難","lede":"日経は6万点で始まる。台風季は3分。悪魔台風と少数の超悪魔が季を通して出る。守り切れば場を閉じるか、エンドレスへ。","start":"台風季に入る","loading":"図を掛けています…","help":"防災心得","back":"戻る","pause":"一時停止","pauseLede":"台風は待たない。","resume":"続ける","quit":"やめる","index":"日経平均株価","indexHint":"赤上げ緑下げ · 基準 60,000","bull":"強気","bear":"弱気","bullFlash":"強気相場","bearFlash":"弱気相場","bearLong":"長い弱気 · 暴風圏に滞留","home":"東京","homeMark":"原地","field":"コロッケ","fieldShort":"コロッケ","fieldFlash":"コロッケ展開 · 台風を遮る","dash":"閃光移動","dashShort":"閃光","dashFlash":"閃光移動 · 東京が急航","dashEndless":"閃光移動 · 回数無制限","halt":"取引停止 5秒","haltShort":"停止","haltFlash":"取引停止五秒 · 台風は止まない · 暴風警報が残れば強制終了","haltEarly":"後半まで取引停止は使えない","haltResume":"取引再開","haltFail":"停止終了 · 暴風警報が残っている","sig0":"解除","sig1":"早期注意","sig3":"強風注意","sig8":"暴風警報","sig9":"暴風警報","sig10":"特別警報","raise1":"早期注意情報 · 市場が警戒","raise3":"強風注意報 · 売りが広がる","raise8":"暴風警報発令 · 日経が大きく押される","raise9":"暴風警報発令 · 日経が大きく押される","raise10":"暴風特別警報 · 瞬間的な恐慌売り","drop8":"暴風警報解除 · 市場が落ち着く","drop0":"警報解除 · 警戒が退く","td":"熱帯低気圧","devil":"悪魔台風","super":"超悪魔台風","fromEast":"太平洋の東から接近","fromSouth":"フィリピン海から北上","fromMap":"洋上で発生","pred":"予測","endlessFlash":"エンドレス · 予測経路の精度は九割五分 · 閃光無制限","winKicker":"台風季終了","winTitle":"守り切った","winBody":"日経はゼロにならなかった。場を閉じるか、エンドレスで続ける。","winLeave":"場を閉じる","endless":"エンドレス","overKicker":"市場停止","haltKicker":"強制終了","overTitle":"日経ゼロ","haltTitle":"停止失敗","winClose":"引け","overBody":"暴風警報と弱気が重なり、指数が支えを失った。","haltBody":"取引停止の五秒が終わり、暴風警報が残っていた。","winBodyEnd":"東京はこの台風季を越えた。引け値は以下。","replay":"もう一季","seasonLeft":"台風季 残り","endlessHud":"エンドレス","inCircle":"暴風圏に滞留 · 弱気が延びる","outCircle":"圏外 · 弱気が縮む","controls":"WASD 移動 · Shift 閃光 · 空白 コロッケ · F 取引停止","locale":"ja","startBannerBull":"強気スタート · 日経は6万点","startBannerBear":"弱気スタート · それでも6万点から","hardFlash":"後半開始 · 発生が速まる · 取引停止が解禁","labelDevil":"悪魔","labelSuper":"超悪魔","leeOn":"展開中","dashCd":"冷却","haltOn":"発動中","haltLock":"後半で解禁","liveLabel":"場内","nearest":"最寄り台風","noThreat":"脅威なし","predHud":"予測経路 95%","recClose":"引け記録","recDodge":"追い出した台風","loadFail":"読み込みに失敗しました","muteOn":"消音","muteOff":"音声オン","hardTag":"後半","dissipated":"消滅"},"help":["地図は北緯 24–46 度、東経 124–150 度。列島を中央に置く。","熱帯低気圧は可視範囲内の海で発生し、画面の東（太平洋）または南（フィリピン海）からも入る。操作位置から緯度7.5度の直径の内側では発生しない。上陸後の衰弱は遅い。","警報は四段階。早期注意情報は1号相当で日経を16%、強風注意報は3号相当で40%、暴風警報は8号相当で400%、暴風特別警報は10号相当で1600%押し下げ、さらに瞬間的な恐慌売りと強い揺れが起きる。","日経平均は 60,000 点から。強気／弱気の周期がある。暴風圏に滞留すると弱気が延び、圏外なら縮む。警報解除時の戻りは、1秒分の押し下げの半分だけ。","台風季は3分。悪魔台風と少数の超悪魔は季を通して出る。後半は発生が速く、取引停止を一度使える。","季を守り切れば場を閉じるか、エンドレスへ。エンドレスでは予測経路（未来3秒、3秒ごとに更新、精度約95%）が出て、閃光は無制限。","一部の台風は初め北寄りに進み、その後の転向は毎秒左右45度以内。","紫は悪魔台風、紅は超悪魔。風圏は通常の悪魔より大きい。","後半の取引停止は5秒。取引だけ止まり、台風は動き続ける。終了時に暴風警報以上が残れば強制終了。","WASD またはスティックで東京を移す。Shift または E で閃光移動3秒、季ごとに5回、冷却10秒。エンドレスでは回数無制限。","空白キーでコロッケを展開し、範囲内の台風を遮って押し出す。季ごとに3回、冷却あり。"]}};

  const FIXED = 1 / 60;
  const START_HSI = 20000;
  const SEASON = 180;
  const HARD_AT = 90;
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
  const SPAWN_CLEAR_KM = (7.5 * 111) / 2;
  const BEAR_MIN = 14;
  const BEAR_MAX = 96;
  const SIG_MULT = { 0: 0, 1: 0.04, 3: 0.1, 8: 2, 9: 5, 10: 12 };
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
    const base = s.super || s.devil ? 200 : s.kt >= 64 ? 220 : s.kt >= 48 ? 280 : 360;
    return base * (s.galeMul ?? (s.super ? 2.4 : s.devil ? 1.75 : 1));
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
  const sigLabel = (cfg, s) => {
    if (s === 0) return cfg.copy.sig0;
    if (s === 1) return cfg.copy.sig1;
    if (s === 3) return cfg.copy.sig3;
    if (s === 8) return cfg.copy.sig8;
    if (s === 9) return cfg.copy.sig9;
    return cfg.copy.sig10;
  };

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
    muted: false, started: false, lastSignal: 0,
    rainGain: null, windGain: null, windFilter: null, musicGain: null, musicEl: null,
    mix: { 0: [1, 0], 1: [1, 0.1], 3: [0.8, 0.2], 8: [0.6, 0.4], 9: [0.4, 0.6], 10: [0.2, 0.8] },
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
        this.amb.gain.value = 1;
        this.sfx.connect(this.master);
        this.amb.connect(this.master);
        this.master.connect(this.ctx.destination);
        this.master.gain.value = this.muted ? 0 : 1;
      }
      if (this.ctx.state === "suspended") void this.ctx.resume();
    },
    applyMix() {
      if (!this.ctx || !this.rainGain || !this.windGain || !this.musicGain) return;
      const t = this.ctx.currentTime;
      const pair = this.mix[this.lastSignal] || this.mix[0];
      this.musicGain.gain.setTargetAtTime(pair[0] * 0.48, t, 0.35);
      this.rainGain.gain.setTargetAtTime(pair[1] * 0.52 * 0.58, t, 0.4);
      this.windGain.gain.setTargetAtTime(pair[1] * 0.52 * 0.42, t, 0.4);
      if (this.windFilter) {
        const freq = this.lastSignal >= 10 ? 420 : this.lastSignal >= 8 ? 340 : 240;
        this.windFilter.frequency.setTargetAtTime(freq, t, 0.5);
      }
    },
    startAmbience() {
      if (!this.ctx || !this.amb || this.started) return;
      this.started = true;
      const ac = this.ctx, buf = this.noiseBuf(3);
      this.rainGain = ac.createGain();
      this.rainGain.gain.value = 0;
      const rainFilter = ac.createBiquadFilter();
      rainFilter.type = "highpass";
      rainFilter.frequency.value = 1800;
      const rain = ac.createBufferSource();
      rain.buffer = buf; rain.loop = true;
      rain.connect(rainFilter); rainFilter.connect(this.rainGain); this.rainGain.connect(this.amb);
      rain.start();
      this.windGain = ac.createGain();
      this.windGain.gain.value = 0;
      this.windFilter = ac.createBiquadFilter();
      this.windFilter.type = "bandpass";
      this.windFilter.frequency.value = 280;
      this.windFilter.Q.value = 0.7;
      const wind = ac.createBufferSource();
      wind.buffer = buf; wind.loop = true;
      wind.connect(this.windFilter); this.windFilter.connect(this.windGain); this.windGain.connect(this.amb);
      wind.start();
      this.musicGain = ac.createGain();
      this.musicGain.gain.value = 0.48;
      this.musicGain.connect(this.amb);
      this.musicEl = new Audio("audio/breezy-loop.mp3");
      this.musicEl.loop = true;
      this.musicEl.preload = "auto";
      this.musicEl.crossOrigin = "anonymous";
      try {
        ac.createMediaElementSource(this.musicEl).connect(this.musicGain);
      } catch {
        this.musicEl.volume = 0.48;
      }
      void this.musicEl.play().catch(() => {});
      this.applyMix();
    },
    setMuted(v) {
      this.muted = v;
      if (this.master) this.master.gain.setTargetAtTime(v ? 0 : 1, this.ctx.currentTime, 0.03);
      if (this.musicEl) this.musicEl.muted = v;
    },
    setStorm(signal) {
      this.lastSignal = signal;
      this.applyMix();
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
    resume() {
      if (this.ctx && this.ctx.state === "suspended") void this.ctx.resume();
      if (this.musicEl && this.musicEl.paused) void this.musicEl.play().catch(() => {});
    },
  };

  class Game {
    constructor(canvas, ui, locale = "hk") {
      this.cfg = MAPS[locale] || MAPS.hk;
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
      const res = await fetch(this.cfg.mapUrl);
      if (!res.ok) throw new Error(this.cfg.copy.loadFail);
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
      this.hk = { lon: this.cfg.home.lon, lat: this.cfg.home.lat, vx: 0, vy: 0 };
      this.storms = [];
      this.hsi = this.cfg.start;
      this.hsiDelta = 0;
      this.hsiMark = this.cfg.start;
      this.hsiMarkT = 0;
      this.spark = Array.from({ length: 48 }, () => this.cfg.start);
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
      this.banner = this.cycle === "bull" ? this.cfg.copy.startBannerBull : this.cfg.copy.startBannerBear;
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
      this.superCount = 0;
      this._nearest = 0;
      this.lastHud = 0;
      this.actEdge = false;
      this.dashEdge = false;
      audio.setStorm(0);
    }

    isLand(lon, lat) {
      const m = this.map;
      if (!m) return false;
      const i = Math.floor(((lon - this.cfg.maskWest) / (this.cfg.maskEast - this.cfg.maskWest)) * m.cols);
      const j = Math.floor(((this.cfg.maskNorth - lat) / (this.cfg.maskNorth - this.cfg.maskSouth)) * m.rows);
      if (i < 0 || j < 0 || i >= m.cols || j >= m.rows) return false;
      return m.bits[j * m.cols + i] === 1;
    }

    step(dt) {
      this.time += dt;
      this.moveHk(dt);
      this.moveStorms(dt);
      this.applyFujiwhara(dt);
      if (this.haltT <= 0) this.spawnStorms();
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
        this.flash(this.cfg.copy.hardFlash, 2.5);
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
      this.hk.lon = clamp(this.hk.lon + this.hk.vx * dt, this.cfg.west + 0.6, this.cfg.east - 0.6);
      this.hk.lat = clamp(this.hk.lat + this.hk.vy * dt, this.cfg.south + 0.6, this.cfg.north - 0.6);
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
        const lon = this.cfg.maskWest + ((i + 0.5) / m.cols) * (this.cfg.maskEast - this.cfg.maskWest);
        const lat = this.cfg.maskNorth - ((j + 0.5) / m.rows) * (this.cfg.maskNorth - this.cfg.maskSouth);
        if (lon < this.cfg.west + 0.4 || lon > this.cfg.east - 0.4 || lat < this.cfg.south + 0.4 || lat > this.cfg.north - 0.4) continue;
        return { lon, lat };
      }
      return null;
    }

    tooClose(lon, lat) {
      return distKm(lon, lat, this.hk.lon, this.hk.lat) < SPAWN_CLEAR_KM;
    }

    spawnOffMap(side) {
      if (side === "east") {
        return {
          lon: this.cfg.east + 2.4 + Math.random() * 11,
          lat: this.cfg.south + 1.6 + Math.random() * Math.max(4, this.cfg.north - this.cfg.south - 4),
          heading: 258 + Math.random() * 30,
        };
      }
      return {
        lon: this.cfg.west + 4 + Math.random() * Math.max(6, this.cfg.east - this.cfg.west - 8),
        lat: this.cfg.south - 1.3 - Math.random() * 5.4,
        heading: (348 + Math.random() * 32) % 360,
      };
    }

    spawnStorms() {
      if (this.time < this.nextSpawn) return;
      if (!this.endless && this.time > SEASON - 8) return;
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
        for (let n = 0; n < 24; n++) {
          const cand = this.spawnOffMap(origin);
          if (this.tooClose(cand.lon, cand.lat)) continue;
          pos = cand;
          break;
        }
      } else {
        for (let n = 0; n < 40; n++) {
          const cand = this.randomOcean();
          if (!cand || this.tooClose(cand.lon, cand.lat)) continue;
          pos = { lon: cand.lon, lat: cand.lat, heading: 272 + Math.random() * 28 };
          break;
        }
      }
      if (!pos) return;
      const northStart = Math.random() < 0.4;
      if (northStart) pos.heading = (338 + Math.random() * 44) % 360;
      let devil = false;
      let superDevil = false;
      if (this.endless) {
        const pSuper = 0.08 + Math.min(0.2, overtime / 300);
        const pDevil = 0.2 + Math.min(0.4, overtime / 280);
        if (Math.random() < pSuper) superDevil = true;
        else if (Math.random() < pDevil) devil = true;
      } else if (this.superCount < 2 && Math.random() < 0.09) {
        superDevil = true;
      } else if (this.devilCount < 6 && Math.random() < 0.2) {
        devil = true;
      }
      if (superDevil) devil = true;
      const japan = origin !== "south" && Math.random() < 0.34;
      const name = this.cfg.names[this.nameI++ % this.cfg.names.length];
      if (devil) this.devilCount += 1;
      if (superDevil) this.superCount += 1;
      const galeMul = superDevil ? 2.2 + Math.random() * 0.4 : devil ? 1.5 + Math.random() * 0.5 : 1;
      const late = this.endless
        ? Math.min(0.95, overtime / 280)
        : this.time >= HARD_AT
          ? 0.22
          : 0;
      this.storms.push({
        name, lon: pos.lon, lat: pos.lat, heading: pos.heading,
        speed: (superDevil ? 2.7 + Math.random() * 0.55 : devil ? 2.05 + Math.random() * 0.55 : 1.68 + Math.random() * 0.72) * (1.15 + Math.random() * 0.15) * (1 + late * 0.35),
        kt: superDevil ? 132 + Math.random() * 18 : devil ? 102 + Math.random() * 16 : 22 + Math.random() * 10,
        track: [{ lon: pos.lon, lat: pos.lat }],
        age: 0, dead: false,
        steer: japan ? "japan" : "west",
        origin,
        recurveAt: 4 + Math.random() * 5,
        devil,
        super: superDevil,
        galeMul,
        initDur: northStart ? 4.2 + Math.random() * 2.8 : 2.4 + Math.random() * 2,
        northStart,
        forecast: [], forecastCircles: [], forecastAcc: true, forecastBias: 0, forecastFakeJapan: false, forecastT: 0,
      });
      if (this.endless) this.initForecast(this.storms[this.storms.length - 1]);
      const where = origin === "east" ? this.cfg.copy.fromEast : origin === "south" ? this.cfg.copy.fromSouth : this.cfg.copy.fromMap;
      const kind = superDevil ? this.cfg.copy.super : devil ? this.cfg.copy.devil : this.cfg.copy.td;
      this.flash(`${kind} ${name} ${where}`, superDevil ? 2.8 : devil ? 2.4 : 1.8);
      if (superDevil) this.trauma = 0.72;
      else if (devil) this.trauma = 0.55;
    }

    envHeading(s, bias = 0) {
      const wobble = Math.sin(s.age * 0.35 + s.lon) * 12;
      if (s.steer === "japan") {
        const t = clamp((s.age - s.recurveAt) / 7, 0, 1);
        const e = t * t * (3 - 2 * t);
        return lerpHeading(276 + wobble * 0.35, 38 + wobble * 0.4, e) + bias;
      }
      const latF = clamp((s.lat - 8) / 18, 0, 1);
      const ageF = clamp(s.age / 16, 0, 1);
      return (272 + latF * ageF * 70 + wobble + bias + 360) % 360;
    }

    initForecast(s) {
      s.forecastAcc = Math.random() < 0.95;
      s.forecastBias = s.forecastAcc
        ? Math.random() * 10 - 5
        : (42 + Math.random() * 48) * (Math.random() < 0.5 ? -1 : 1);
      s.forecastFakeJapan = !s.forecastAcc && s.steer === "west" && Math.random() < 0.55;
      s.forecastT = 0;
      this.rebuildForecast(s);
    }

    headingStep(s, heading, age, dt, bias) {
      if (age < s.initDur) return heading;
      const desired = this.envHeading({ ...s, heading, age }, bias);
      const delta = ((desired - heading + 540) % 360) - 180;
      return heading + clamp(delta, -45 * dt, 45 * dt);
    }

    rebuildForecast(s) {
      const pts = [{ lon: s.lon, lat: s.lat }];
      const circles = [];
      let lon = s.lon, lat = s.lat, heading = s.heading, age = s.age;
      const ghost = { ...s, lon, lat, heading, age, steer: s.forecastFakeJapan ? "japan" : s.steer };
      const dt = 0.2;
      let t = 0, nextMark = 1;
      while (t < 3) {
        age += dt; t += dt;
        ghost.age = age; ghost.lon = lon; ghost.lat = lat;
        heading = this.headingStep(ghost, heading, age, dt, s.forecastBias);
        const rad = heading * Math.PI / 180;
        lon += Math.sin(rad) * s.speed * dt;
        lat += Math.cos(rad) * s.speed * dt;
        pts.push({ lon, lat });
        if (nextMark <= 3 && t + 1e-6 >= nextMark) {
          circles.push({ lon, lat, rKm: (58 + nextMark * 64) * (s.forecastAcc ? 0.9 : 1.4) });
          nextMark += 1;
        }
      }
      s.forecast = pts;
      s.forecastCircles = circles;
      s.forecastT = 3;
    }

    repelLee(s, dt) {
      const dlon = s.lon - this.hk.lon, dlat = s.lat - this.hk.lat;
      const d = Math.hypot(dlon, dlat) || 0.01;
      if (d >= 10) return;
      const nx = dlon / d, ny = dlat / d;
      s.heading = Math.atan2(dlon, dlat) * 180 / Math.PI;
      const out = 10 + 0.35 + 2.4 * dt;
      s.lon = this.hk.lon + nx * out;
      s.lat = this.hk.lat + ny * out;
    }

    moveStorms(dt) {
      const field = this.leeT > 0;
      for (const s of this.storms) {
        if (s.dead) continue;
        s.age += dt;
        if (!field) s.heading = this.headingStep(s, s.heading, s.age, dt, 0);
        const rad = s.heading * Math.PI / 180;
        s.lon += Math.sin(rad) * s.speed * dt;
        s.lat += Math.cos(rad) * s.speed * dt;
        if (field) this.repelLee(s, dt);
        if (this.isLand(s.lon, s.lat)) s.kt -= LAND_WEAKEN * dt;
        else s.kt += (s.kt < 34 ? 1.6 : s.kt < 64 ? 1.1 : s.kt < 95 ? 0.55 : 0.15) * dt;
        s.kt = clamp(s.kt, 0, s.super ? 190 : s.devil ? 165 : 145);
        if (s.age % 0.35 < dt) s.track.push({ lon: s.lon, lat: s.lat });
        if (s.track.length > 90) s.track.shift();
        if (this.endless) {
          s.forecastT -= dt;
          if (s.forecastT <= 0 || !s.forecast || s.forecast.length < 2) this.rebuildForecast(s);
        }
        const off = s.lon < this.cfg.west - 6 || s.lon > this.cfg.east + 16 || s.lat < this.cfg.south - 9 || s.lat > this.cfg.north + 5;
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
        else if (s.kt >= 48 && km < 320) sig = raiseSignal(sig, this.cfg.skipNine ? 10 : 9);
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
          const c = this.cfg.copy;
          if (sig === 10) {
            this.flash(c.raise10, 2.4); audio.thunder(); audio.signal();
            this.trauma = this.cfg.id === "jp" ? 0.95 : 0.7;
            if (this.cfg.id === "jp") this.hsi = Math.max(0, this.hsi - (2600 + Math.random() * 1800));
          }
          else if (sig === 9) { this.flash(c.raise9, 2.2); audio.signal(); }
          else if (sig === 8) { this.flash(c.raise8, 2.4); audio.signal(); audio.thunder(); this.trauma = 0.4; }
          else if (sig === 3) { this.flash(c.raise3, 1.8); audio.signal(); }
          else if (sig === 1) this.flash(c.raise1, 1.6);
        } else if (sig < prev) {
          const drop = this.cfg.sigMult[prev] - this.cfg.sigMult[sig];
          if (drop > 0) this.hsi = Math.max(0, this.hsi + drop * T8_DRAG * 0.5);
          if (prev >= 8 && sig < 8) this.flash(this.cfg.copy.drop8, 2.2);
          else if (sig === 0) this.flash(this.cfg.copy.drop0, 1.8);
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
            ? this.cfg.copy.bullFlash
            : this.bearSpan > 55
              ? this.cfg.copy.bearLong
              : this.cfg.copy.bearFlash,
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
      const extra = -T8_DRAG * this.cfg.sigMult[this.signal] * dt;
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
      this.flash(this.cfg.copy.fieldFlash, 2);
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
      this.flash(this.endless ? this.cfg.copy.dashEndless : this.cfg.copy.dashFlash, 1.8);
    }

    tryHalt() {
      if (this.paused || this.ended || this.haltT > 0 || this.haltCharges <= 0) return;
      if (this.time < HARD_AT) { this.flash(this.cfg.copy.haltEarly, 1.6); return; }
      this.haltCharges -= 1;
      this.haltT = 5;
      audio.board();
      this.flash(this.cfg.copy.haltFlash, 2.4);
    }

    finishHalt() {
      if (this.ended) return;
      if (this.signal >= 8) {
        this.flash(this.cfg.copy.haltFail, 2.4);
        this.lose("halt");
        return;
      }
      this.flash(this.cfg.copy.haltResume, 1.8);
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
      if (this.ended) return;
      this.awaitingWin = false;
      this.endless = true;
      this.paused = false;
      this.flash(this.cfg.copy.endlessFlash, 2.8);
      for (const s of this.storms) if (!s.dead) this.initForecast(s);
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
      const aspect = (this.cfg.east - this.cfg.west) / (this.cfg.north - this.cfg.south);
      let mapW = availW, mapH = mapW / aspect;
      if (mapH > availH) { mapH = availH; mapW = mapH * aspect; }
      return { x: (w - mapW) / 2, y: padT + (availH - mapH) / 2, w: mapW, h: mapH };
    }
    xy(lon, lat, L) {
      return {
        x: L.x + ((lon - this.cfg.west) / (this.cfg.east - this.cfg.west)) * L.w,
        y: L.y + ((this.cfg.north - lat) / (this.cfg.north - this.cfg.south)) * L.h,
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
      if (this.endless) this.drawForecasts(ctx, L);
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
      ctx.fillText(`${this.cfg.south}–${this.cfg.north}°N  ·  ${this.cfg.west}–${this.cfg.east}°E`, w - 16, h - 14);
    }

    drawGrid(ctx, L) {
      ctx.strokeStyle = "rgba(154,164,178,0.12)";
      ctx.lineWidth = 1;
      ctx.fillStyle = "rgba(154,164,178,0.45)";
      ctx.font = "10px 'IBM Plex Mono', monospace";
      ctx.textAlign = "left";
      for (let lon = Math.ceil(this.cfg.west / 5) * 5; lon <= this.cfg.east; lon += 5) {
        const p = this.xy(lon, this.cfg.south, L);
        ctx.beginPath(); ctx.moveTo(p.x, L.y); ctx.lineTo(p.x, L.y + L.h); ctx.stroke();
        ctx.fillText(`${lon}°E`, p.x + 3, L.y + L.h - 6);
      }
      for (let lat = Math.ceil(this.cfg.south / 5) * 5; lat <= this.cfg.north; lat += 5) {
        const p = this.xy(this.cfg.west, lat, L);
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
        ctx.strokeStyle = s.dead ? "rgba(154,164,178,0.25)" : s.super ? "rgba(244,114,182,0.8)" : s.devil ? "rgba(168,130,255,0.7)" : "rgba(196,69,60,0.55)";
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

    drawForecasts(ctx, L) {
      for (const s of this.storms) {
        if (s.dead || !s.forecast || s.forecast.length < 2) continue;
        ctx.strokeStyle = s.super ? "rgba(253,164,175,0.85)" : s.devil ? "rgba(216,180,254,0.8)" : "rgba(250,204,21,0.75)";
        ctx.lineWidth = 1.8;
        ctx.setLineDash([7, 5]);
        ctx.beginPath();
        s.forecast.forEach((t, i) => {
          const p = this.xy(t.lon, t.lat, L);
          if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
        });
        ctx.stroke();
        ctx.setLineDash([]);
        (s.forecastCircles || []).forEach((c) => {
          const p = this.xy(c.lon, c.lat, L);
          const r = (c.rKm / 111) * (L.w / (this.cfg.east - this.cfg.west));
          ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(250,204,21,0.45)";
          ctx.lineWidth = 1.4;
          ctx.setLineDash([4, 3]);
          ctx.stroke();
          ctx.fillStyle = "rgba(250,204,21,0.07)";
          ctx.fill();
        });
        ctx.setLineDash([]);
        const last = this.xy(s.forecast[s.forecast.length - 1].lon, s.forecast[s.forecast.length - 1].lat, L);
        ctx.beginPath(); ctx.arc(last.x, last.y, 3.2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(250,204,21,0.9)"; ctx.fill();
        ctx.fillStyle = "rgba(250,204,21,0.7)";
        ctx.font = "600 10px 'Noto Sans TC', 'Noto Sans JP', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(this.cfg.copy.pred, last.x, last.y - 8);
      }
    }

    drawPlaces(ctx, L) {
      ctx.fillStyle = "rgba(231,226,216,0.55)";
      ctx.textAlign = "left";
      for (const c of this.cfg.places) {
        const p = this.xy(c.lon, c.lat, L);
        ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI * 2); ctx.fill();
        ctx.font = `${c.size}px 'Noto Sans TC', 'Noto Sans JP', sans-serif`;
        ctx.fillText(c.name, p.x + 5, p.y + 4);
      }
    }

    drawStorms(ctx, L) {
      for (const s of this.storms) {
        if (s.dead) continue;
        const p = this.xy(s.lon, s.lat, L);
        const r = 14 + s.kt * 0.16;
        const galeKm = galeRadiusKm(s);
        const gale = (galeKm / 111) * (L.w / (this.cfg.east - this.cfg.west));
        ctx.beginPath(); ctx.arc(p.x, p.y, gale, 0, Math.PI * 2);
        ctx.fillStyle = s.super ? "rgba(190,24,93,0.22)" : s.devil ? "rgba(124,58,237,0.18)" : "rgba(196,69,60,0.12)";
        ctx.fill();
        ctx.strokeStyle = s.super ? "rgba(251,113,133,0.8)" : s.devil ? "rgba(196,181,253,0.65)" : "rgba(196,69,60,0.4)";
        ctx.stroke();
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(this.time * (s.super ? 2.8 : s.devil ? 2.2 : 1.6));
        ctx.strokeStyle = s.super ? "#fb7185" : s.devil ? "#c4b5fd" : "#e07068";
        ctx.lineWidth = s.super ? 4.2 : s.devil ? 3.2 : 2.4;
        ctx.beginPath();
        for (let i = 0; i < 2; i++) {
          ctx.rotate(Math.PI);
          ctx.moveTo(3, 0);
          ctx.quadraticCurveTo(r * 0.7, r * 0.28, r, 0);
        }
        ctx.stroke();
        ctx.restore();
        ctx.beginPath(); ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = s.super ? "#fecdd3" : s.devil ? "#ddd6fe" : "#f0c9c6"; ctx.fill();
        ctx.fillStyle = s.super ? "#fb7185" : s.devil ? "#c4b5fd" : "#e7e2d8";
        ctx.font = "600 11px 'Noto Sans TC', 'Noto Sans JP', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(s.super ? `${this.cfg.copy.labelSuper} ${s.name}` : s.devil ? `${this.cfg.copy.labelDevil} ${s.name}` : s.name, p.x, p.y - r - 6);
        ctx.font = "10px 'IBM Plex Mono', monospace";
        ctx.fillStyle = s.super ? "rgba(251,113,133,0.95)" : s.devil ? "rgba(196,181,253,0.9)" : "rgba(231,226,216,0.7)";
        ctx.fillText(`${s.kt.toFixed(0)} kt`, p.x, p.y + r + 12);
      }
    }

    drawInbound(ctx, L) {
      for (const s of this.storms) {
        if (s.dead) continue;
        if (s.lon >= this.cfg.west && s.lon <= this.cfg.east && s.lat >= this.cfg.south && s.lat <= this.cfg.north) continue;
        const p = this.xy(s.lon, s.lat, L);
        const x = clamp(p.x, L.x + 10, L.x + L.w - 10);
        const y = clamp(p.y, L.y + 10, L.y + L.h - 10);
        const col = s.super ? "#fb7185" : s.devil ? "#c4b5fd" : "#e07068";
        ctx.fillStyle = col;
        ctx.beginPath();
        if (s.lon > this.cfg.east) {
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
        ctx.font = "600 10px 'Noto Sans TC', 'Noto Sans JP', sans-serif";
        ctx.textAlign = s.lon > this.cfg.east ? "right" : "center";
        ctx.fillText(
          s.name,
          s.lon > this.cfg.east ? L.x + L.w - 16 : x,
          s.lon > this.cfg.east ? y - 10 : L.y + L.h - 18
        );
      }
    }

    drawHk(ctx, L) {
      const p = this.xy(this.hk.lon, this.hk.lat, L);
      const home = this.xy(this.cfg.home.lon, this.cfg.home.lat, L);
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
      if (Math.hypot(this.hk.lon - this.cfg.home.lon, this.hk.lat - this.cfg.home.lat) > 0.35) {
        ctx.setLineDash([4, 3]);
        ctx.beginPath(); ctx.moveTo(home.x, home.y); ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = "rgba(201,161,91,0.45)"; ctx.lineWidth = 1.2; ctx.stroke();
        ctx.setLineDash([]);
        ctx.beginPath(); ctx.arc(home.x, home.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(231,226,216,0.35)"; ctx.fill();
        ctx.strokeStyle = "rgba(201,161,91,0.7)"; ctx.lineWidth = 1; ctx.stroke();
        ctx.fillStyle = "rgba(231,226,216,0.55)";
        ctx.font = "11px 'Noto Sans TC', 'Noto Sans JP', sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(this.cfg.copy.homeMark, home.x + 7, home.y + 4);
      }
      if (this.leeT > 0) {
        const rad = (10 / (this.cfg.east - this.cfg.west)) * L.w * (1 + 0.05 * Math.sin(this.time * 6));
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
      ctx.font = "700 13px 'Noto Sans TC', 'Noto Sans JP', sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(this.dashT > 0 ? `${this.cfg.copy.home} · ${this.cfg.copy.dashShort}` : this.cfg.copy.home, p.x + 10, p.y - 6);
    }
  }

  const $ = (id) => document.getElementById(id);
  const canvas = $("map");
  const spark = $("spark");
  const sparkCtx = spark.getContext("2d");
  let helpFrom = "title";
  let muted = false;
  let locale = "hk";

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
    const c = MAPS[locale].copy;
    $("records").textContent =
      `${c.recClose} ${s.bestClose > 0 ? fmtHsi(s.bestClose) : "—"} / ${c.recDodge} ${s.stormsDodged}`;
  }

  function applyLocale(id) {
    locale = id === "jp" ? "jp" : "hk";
    const cfg = MAPS[locale];
    const c = cfg.copy;
    document.documentElement.lang = c.locale || (locale === "jp" ? "ja" : "zh-HK");
    document.documentElement.classList.toggle("locale-jp", locale === "jp");
    document.title = c.title;
    $("titleKicker").textContent = c.kicker;
    $("titleName").textContent = c.title;
    $("titleSub").textContent = c.sub;
    $("titleLede").textContent = c.lede;
    $("start").textContent = c.start;
    $("helpBtn").textContent = c.help;
    $("helpTitle").textContent = c.help;
    $("helpList").innerHTML = cfg.help.map((line) => `<li>${line}</li>`).join("");
    $("helpBack").textContent = c.back;
    $("pauseTitle").textContent = c.pause;
    $("pauseLede").textContent = c.pauseLede;
    $("resume").textContent = c.resume;
    $("pauseHelp").textContent = c.help;
    $("quit").textContent = c.quit;
    $("tickerIndex").textContent = c.index;
    $("tickerHint").textContent = c.indexHint;
    $("lee").textContent = c.field;
    $("dash").textContent = c.dash;
    $("halt").textContent = c.halt;
    $("leeTouch").textContent = c.fieldShort;
    $("dashTouch").textContent = c.dashShort;
    $("haltTouch").textContent = c.haltShort;
    $("endless").textContent = c.endless;
    $("leaveWin").textContent = c.winLeave;
    $("replay").textContent = c.replay;
    $("pickHk").classList.toggle("on", locale === "hk");
    $("pickJp").classList.toggle("on", locale === "jp");
    $("mute").textContent = muted ? (locale === "jp" ? "静" : "靜") : (locale === "jp" ? "音" : "聲");
    $("mute").setAttribute("aria-label", muted ? c.muteOff : c.muteOn);
    $("pauseBtn").setAttribute("aria-label", c.pause);
    showRecords();
  }

  const ui = {
    hud(g) {
      const c = g.cfg.copy;
      const sig = $("sig");
      sig.textContent = sigLabel(g.cfg, g.signal);
      sig.className = "chip" + (g.signal >= 9 ? " hot" : g.signal === 8 ? " warn" : "");
      const cy = $("cycle");
      cy.textContent = (g.cycle === "bull" ? c.bull : c.bear) + " " + Math.max(0, g.cycleT).toFixed(0) + "s";
      cy.className = "chip " + g.cycle;
      const hsi = $("hsi");
      hsi.textContent = fmtHsi(g.hsi);
      const up = g.hsiDelta >= 0;
      hsi.className = g.haltT > 0 ? "halted" : up ? "up" : "down";
      const d = $("delta");
      d.className = g.haltT > 0 ? "halted" : up ? "up" : "down";
      d.textContent = g.haltT > 0 ? `${c.haltShort} ${g.haltT.toFixed(1)}s` : `${up ? "+" : ""}${g.hsiDelta.toFixed(0)}`;
      const ban = $("banner");
      if (g.banner) { ban.textContent = g.banner; ban.classList.remove("hidden"); }
      else ban.classList.add("hidden");
      const live = g.storms.filter((s) => !s.dead).length;
      $("stats").innerHTML =
        `${g.endless ? `${c.endlessHud} ${fmtTime(Math.max(0, g.time - SEASON))}` : `${c.seasonLeft} ${fmtTime(Math.max(0, SEASON - g.time))}`}${g.time >= HARD_AT || g.endless ? ` · ${c.hardTag}` : ""}${g.endless ? ` · ${c.predHud}` : ""}<br>` +
        `${c.field} ${g.leeCharges}/${LEE_MAX}${g.leeT > 0 ? ` · ${c.leeOn}` : ""}<br>` +
        `${c.dashShort} ${g.endless ? "∞" : `${g.dashCharges}/${DASH_MAX}`}${g.dashT > 0 ? ` · ${g.dashT.toFixed(1)}s` : g.dashCd > 0 ? ` · ${c.dashCd} ${g.dashCd.toFixed(0)}s` : ""}<br>` +
        `${g.inGaleCircle() ? c.inCircle : c.outCircle}<br>` +
        `${c.haltShort} ${g.haltCharges}/1${g.haltT > 0 ? ` · ${c.haltOn}` : g.time >= HARD_AT ? "" : ` · ${c.haltLock}`}<br>` +
        `${c.liveLabel} ${live} · ${g.dodged}<br>` +
        `${c.home} ${g.hk.lat.toFixed(2)}°N ${g.hk.lon.toFixed(2)}°E<br>` +
        `${g._nearest > 0 ? `${c.nearest} ${Math.round(g._nearest)} km` : c.noThreat}<br>` +
        `<span class="desk-only">${c.controls}</span>`;
      $("lee").disabled = !(g.leeCharges > 0 && g.leeCd <= 0 && g.leeT <= 0);
      $("dash").disabled = !((g.endless || g.dashCharges > 0) && g.dashT <= 0 && g.dashCd <= 0);
      $("halt").disabled = !(g.time >= HARD_AT && g.haltCharges > 0 && g.haltT <= 0);
      const hint = $("hint");
      hint.textContent = g.haltT > 0
        ? `${c.haltShort} ${g.haltT.toFixed(1)}s`
        : g.dashT > 0
          ? `${c.dashShort} ${g.dashT.toFixed(1)}s`
          : g.dashCd > 0
            ? `${c.dashShort} ${c.dashCd} ${g.dashCd.toFixed(0)}s`
            : g.endless
              ? c.endlessFlash
              : g.leeCd > 0
                ? `${c.field} ${c.dashCd} ${g.leeCd.toFixed(0)}s`
                : g.inGaleCircle()
                  ? c.inCircle
                  : c.controls;
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
      const c = g.cfg.copy;
      $("pause").classList.add("hidden");
      const el = $("end");
      el.classList.remove("hidden");
      $("endKicker").textContent = c.winKicker;
      $("endTitle").textContent = c.winTitle;
      $("endBody").textContent = c.winBody;
      $("endStats").innerHTML = [
        [c.index, fmtHsi(g.hsi), true],
        [c.home, String(g.dodged), false],
      ].map(([l, v, up]) => `<div class="stat"><div class="lbl">${l}</div><div class="val${up ? " up" : ""}">${v}</div></div>`).join("");
      $("endless").classList.remove("hidden");
      $("leaveWin").classList.remove("hidden");
      $("replay").classList.add("hidden");
    },
    end(win, g) {
      const c = g.cfg.copy;
      $("hud").classList.add("hidden");
      $("touch").classList.add("hidden");
      $("pause").classList.add("hidden");
      const el = $("end");
      el.classList.remove("hidden");
      const haltFail = !win && g.loseKind === "halt";
      $("endKicker").textContent = win ? c.winKicker : haltFail ? c.haltKicker : c.overKicker;
      $("endTitle").textContent = win ? c.winClose : haltFail ? c.haltTitle : c.overTitle;
      $("endBody").textContent = win ? c.winBodyEnd : haltFail ? c.haltBody : c.overBody;
      $("endStats").innerHTML = [
        [c.index, fmtHsi(g.hsi), win],
        [c.home, String(g.dodged), false],
        [g.cycle === "bull" ? c.bull : c.bear, g.cycle === "bull" ? c.bull : c.bear, false],
        [win ? c.winTitle : c.overTitle, win ? c.winTitle : c.overTitle, false],
      ].map(([l, v, up]) => `<div class="stat"><div class="lbl">${l}</div><div class="val${up ? " up" : ""}">${v}</div></div>`).join("");
      $("endless").classList.add("hidden");
      $("leaveWin").classList.add("hidden");
      $("replay").classList.remove("hidden");
    },
  };

  let game = new Game(canvas, ui, locale);
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
    applyLocale(locale);
    $("title").classList.add("hidden");
    $("pause").classList.add("hidden");
    $("help").classList.remove("hidden");
  }
  function closeHelp() {
    $("help").classList.add("hidden");
    if (helpFrom === "pause") $("pause").classList.remove("hidden");
    else $("title").classList.remove("hidden");
  }

  async function boot() {
    audio.unlock();
    audio.startAmbience();
    game.stop();
    game = new Game(canvas, ui, locale);
    await game.load();
    $("title").classList.add("hidden");
    $("end").classList.add("hidden");
    $("help").classList.add("hidden");
    $("pause").classList.add("hidden");
    $("hud").classList.remove("hidden");
    $("touch").classList.remove("hidden");
    applyLocale(locale);
    game.start();
  }

  $("pickHk").onclick = () => applyLocale("hk");
  $("pickJp").onclick = () => applyLocale("jp");
  $("helpBtn").onclick = () => openHelp("title");
  $("pauseHelp").onclick = () => openHelp("pause");
  $("helpBack").onclick = closeHelp;
  $("start").onclick = async () => {
    $("start").disabled = true;
    try { await boot(); }
    catch (err) {
      $("records").textContent = err instanceof Error ? err.message : MAPS[locale].copy.loadFail;
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
    applyLocale(locale);
  };
  $("mute").onclick = () => {
    muted = !muted;
    audio.setMuted(muted);
    applyLocale(locale);
  };
  $("replay").onclick = async () => {
    $("replay").disabled = true;
    try { await boot(); }
    finally { $("replay").disabled = false; }
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

  applyLocale("hk");

})();
