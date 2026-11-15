/* Cal Poly AI Ethics Lab — shared page script */
(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Fill footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Fade page content in on load (home only)
  document.querySelectorAll(".page-fade").forEach((el) => {
    if (prefersReducedMotion) {
      el.classList.add("is-visible");
      return;
    }
    requestAnimationFrame(() => {
      requestAnimationFrame(() => el.classList.add("is-visible"));
    });
  });

  // Person photos: replace broken/empty images with an initials tile.
  // We swap the <img> for a <div> so the placeholder renders cleanly
  // (pseudo-elements can't render on replaced <img> elements, and the
  // alt text would otherwise appear as fallback).
  document.querySelectorAll(".person-photo").forEach((img) => {
    const nameEl = img.closest(".person-card")?.querySelector(".person-name");
    const name = nameEl ? nameEl.textContent.trim() : "";
    const initials = name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join("");

    const swapToInitials = () => {
      if (!img.parentNode) return;
      const tile = document.createElement("div");
      tile.className = "person-photo no-photo";
      tile.setAttribute("role", "img");
      tile.setAttribute("aria-label", name || "");
      tile.textContent = initials || "";
      img.replaceWith(tile);
    };

    const src = img.getAttribute("src");
    if (!src || src.endsWith("/")) {
      swapToInitials();
    } else {
      img.addEventListener("error", swapToInitials, { once: true });
    }
  });
})();
