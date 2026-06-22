/* =========================================================
   theme-toggle.js — alterna [LIGHT] • [DARK], salva preferência
   ========================================================= */
(function () {
  const KEY = "lv-theme";
  const saved = LV.storage.get(KEY, "light");
  document.documentElement.setAttribute("data-theme", saved);

  document.addEventListener("DOMContentLoaded", () => {
    const btn = document.createElement("button");
    btn.className = "theme-toggle";
    btn.setAttribute("aria-label", "Alternar tema");
    document.body.appendChild(btn);

    const render = () => {
      const t = document.documentElement.getAttribute("data-theme");
      btn.innerHTML = t === "dark"
        ? '[LIGHT] &middot; <b>[DARK]</b>'
        : '<b>[LIGHT]</b> &middot; [DARK]';
    };
    render();

    btn.addEventListener("click", () => {
      const cur = document.documentElement.getAttribute("data-theme");
      const next = cur === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      LV.storage.set(KEY, next);
      render();
    });
  });
})();
