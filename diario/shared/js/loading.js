/* =========================================================
   loading.js — tela de loading 2s com ASCII, barra e som
   ========================================================= */
(function () {
  const SCREEN_HTML = `
    <div class="loading-screen" id="loading-screen">
      <button class="loading-mute" id="loading-mute" aria-label="Mute/unmute">[ MUTE ]</button>
      <pre class="loading-ascii" aria-hidden="true">
   _____   _   _____   _____   ____
  |  _  | | | |  _  | |  _  | |    \\
  | |_| | | | | |_| | | |_| | | |\\  \\
  |  _  | | | |     | |    /  | | | |
  |_| |_| |_| |_|_|_| |_|\\_\\  |_|/__/

  &gt;&gt;&gt; PORTFOLIO // DIARIO_CRIATIVO &lt;&lt;&lt;
      </pre>
      <div class="loading-text">CARREGANDO<span class="loading-cursor"></span></div>
      <div class="loading-bar" id="loading-bar"></div>
      <div class="loading-meta">
        <span>v.0.1.0</span>
        <span id="loading-pct">0%</span>
        <span>boot_seq</span>
      </div>
    </div>`;

  // Injeta a tela antes de qualquer outra coisa
  document.documentElement.insertAdjacentHTML("afterbegin", SCREEN_HTML);

  const DURATION = 2000;
  const CHUNKS = 24;
  const bar = document.getElementById("loading-bar");
  const pct = document.getElementById("loading-pct");
  const screen = document.getElementById("loading-screen");
  const muteBtn = document.getElementById("loading-mute");

  // Cria chunks
  const chunks = [];
  for (let i = 0; i < CHUNKS; i++) {
    const el = document.createElement("div");
    el.className = "loading-bar__chunk";
    bar.appendChild(el);
    chunks.push(el);
  }

  // Som de disquete (arquivo placeholder + fallback via WebAudio)
  let muted = LV.storage.get("lv-mute", "0") === "1";
  muteBtn.textContent = muted ? "[ UNMUTE ]" : "[ MUTE ]";

  let audio;
  function startSound() {
    if (muted) return;
    try {
      audio = new Audio("shared/assets/diskette.mp3");
      audio.volume = 0.18;
      audio.loop = true;
      audio.play().catch(() => synthDiskette());
    } catch { synthDiskette(); }
  }
  let ctxAudio, synthInt;
  function synthDiskette() {
    if (muted) return;
    try {
      ctxAudio = new (window.AudioContext || window.webkitAudioContext)();
      const tick = () => {
        const o = ctxAudio.createOscillator();
        const g = ctxAudio.createGain();
        o.type = "square";
        o.frequency.value = 80 + Math.random() * 60;
        g.gain.value = 0.02;
        o.connect(g).connect(ctxAudio.destination);
        o.start();
        o.stop(ctxAudio.currentTime + 0.04);
      };
      synthInt = setInterval(tick, 90);
    } catch {}
  }
  function stopSound() {
    if (audio) { audio.pause(); audio = null; }
    if (synthInt) { clearInterval(synthInt); synthInt = null; }
    if (ctxAudio) { try { ctxAudio.close(); } catch {} ctxAudio = null; }
  }

  muteBtn.addEventListener("click", () => {
    muted = !muted;
    LV.storage.set("lv-mute", muted ? "1" : "0");
    muteBtn.textContent = muted ? "[ UNMUTE ]" : "[ MUTE ]";
    if (muted) stopSound(); else startSound();
  });

  startSound();

  // Progresso
  const start = performance.now();
  function tick(now) {
    const p = Math.min(1, (now - start) / DURATION);
    const filled = Math.floor(p * CHUNKS);
    chunks.forEach((c, i) => c.classList.toggle("is-on", i < filled));
    pct.textContent = Math.floor(p * 100) + "%";
    if (p < 1) requestAnimationFrame(tick);
    else end();
  }
  function end() {
    stopSound();
    screen.classList.add("is-hidden");
    setTimeout(() => screen.remove(), 700);
    document.dispatchEvent(new CustomEvent("lv:loaded"));
  }
  requestAnimationFrame(tick);
})();
