/* =========================================================
   background-2d.js — formas construtivistas reativas ao mouse
   ========================================================= */
(function () {
  let canvas, ctx, shapes = [], raf, w = 0, h = 0;
  const mouse = { x: -9999, y: -9999, active: false };

  function palette() {
    const t = document.documentElement.getAttribute("data-theme");
    return t === "dark"
      ? ["#54D930", "#05AFF2", "#F2A03D", "#F25430", "#F2E8D5"]
      : ["#04B2D9", "#05AFF2", "#F2A03D", "#F25430", "#54D930"];
  }

  function makeShapes() {
    const colors = palette();
    const count = Math.min(60, Math.floor((w * h) / 18000));
    shapes = [];
    for (let i = 0; i < count; i++) {
      shapes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 12 + Math.random() * 90,
        type: ["circle", "rect", "line", "tri"][Math.floor(Math.random() * 4)],
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        rot: Math.random() * Math.PI,
        rotSpeed: (Math.random() - 0.5) * 0.005,
        alpha: 0.70 + Math.random() * 0.30
      });
    }
  }

  function resize() {
    const dims = LV.resizeCanvas(canvas);
    w = dims.w; h = dims.h;
    makeShapes();
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (const s of shapes) {
      // reação ao mouse
      if (mouse.active) {
        const dx = s.x - mouse.x;
        const dy = s.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        const max = 350 * 350;
        if (d2 < max) {
          const f = (1 - d2 / max) * 2.0;
          s.x += (dx / Math.sqrt(d2 || 1)) * f;
          s.y += (dy / Math.sqrt(d2 || 1)) * f;
        }
      }
      s.x += s.vx; s.y += s.vy; s.rot += s.rotSpeed;
      if (s.x < -120) s.x = w + 120;
      if (s.x > w + 120) s.x = -120;
      if (s.y < -120) s.y = h + 120;
      if (s.y > h + 120) s.y = -120;

      ctx.save();
      ctx.globalAlpha = s.alpha;
      ctx.translate(s.x, s.y);
      ctx.rotate(s.rot);
      ctx.strokeStyle = s.color;
      ctx.fillStyle = s.color;
      ctx.lineWidth = 1.5;

      if (s.type === "circle") {
        ctx.beginPath();
        ctx.arc(0, 0, s.r, 0, Math.PI * 2);
        ctx.stroke();
      } else if (s.type === "rect") {
        ctx.strokeRect(-s.r / 2, -s.r / 2, s.r, s.r);
      } else if (s.type === "line") {
        ctx.beginPath();
        ctx.moveTo(-s.r, 0); ctx.lineTo(s.r, 0);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.moveTo(0, -s.r * 0.6);
        ctx.lineTo(s.r * 0.6, s.r * 0.4);
        ctx.lineTo(-s.r * 0.6, s.r * 0.4);
        ctx.closePath();
        ctx.stroke();
      }
      ctx.restore();
    }
    raf = requestAnimationFrame(draw);
  }

  function attach() {
    if (LV.isMobile()) return;
    canvas = document.createElement("canvas");
    canvas.id = "bg-canvas";
    document.body.appendChild(canvas);
    ctx = canvas.getContext("2d");
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX; mouse.y = e.clientY; mouse.active = true;
    });
    window.addEventListener("mouseout", () => { mouse.active = false; });
    draw();
  }
  function detach() {
    if (raf) cancelAnimationFrame(raf);
    if (canvas) canvas.remove();
    canvas = null;
  }

  window.LVBg2D = { attach, detach };
})();
