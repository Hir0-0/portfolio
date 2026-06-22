/* =========================================================
   menu.js — hamburguer mobile + active link
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", nav.classList.contains("is-open"));
    });
    nav.addEventListener("click", (e) => {
      if (e.target.tagName === "A") nav.classList.remove("is-open");
    });
  }

  // marca link ativo
  const here = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".site-nav a").forEach((a) => {
    const href = a.getAttribute("href");
    if (href === here || (here === "" && href === "index.html")) {
      a.classList.add("is-active");
    }
  });
});
