/* =========================================================
   background-switch.js — controla [2D] • [3D] + estático mobile
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  // Mobile: fundo estático sempre
  if (LV.isMobile()) {
    const s = document.createElement("div");
    s.className = "bg-static";
    document.body.appendChild(s);
    return;
  }

  const mode = LV.storage.get("lv-bg", "2d");
  const sw = document.createElement("div");
  sw.className = "bg-switch";
  sw.innerHTML = `
    <button data-mode="2d">[2D]</button>
    <button data-mode="3d">[3D]</button>
  `;
  document.body.appendChild(sw);

  function set(m) {
    LV.storage.set("lv-bg", m);
    sw.querySelectorAll("button").forEach(b => b.classList.toggle("is-active", b.dataset.mode === m));
    if (m === "2d") { window.LVBg3D && LVBg3D.detach(); window.LVBg2D && LVBg2D.attach(); }
    else            { window.LVBg2D && LVBg2D.detach(); window.LVBg3D && LVBg3D.attach(); }
  }
  sw.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (b) set(b.dataset.mode);
  });
  set(mode);
});
