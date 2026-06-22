/* =========================================================
   utils.js — helpers compartilhados
   ========================================================= */
(function (global) {
  const isMobile = () => window.matchMedia("(max-width: 720px)").matches;
  const prefersReduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const storage = {
    get(key, def) {
      try { const v = localStorage.getItem(key); return v === null ? def : v; }
      catch { return def; }
    },
    set(key, val) { try { localStorage.setItem(key, val); } catch {} }
  };

  // Anima cor com requestAnimationFrame e canvas helper
  function resizeCanvas(canvas) {
    const dpr = window.devicePixelRatio || 1;
    const { innerWidth: w, innerHeight: h } = window;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { w, h, dpr };
  }

  global.LV = { isMobile, prefersReduced, $, $$, storage, resizeCanvas };
})(window);
