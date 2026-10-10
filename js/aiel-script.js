/* Cal Poly AI Ethics Lab — shared page script */
(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Fill footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Fade page content in on load
  document.querySelectorAll(".page-fade").forEach((el) => {
    if (prefersReducedMotion) {
      el.classList.add("is-visible");
      return;
    }
    // Next frame so the initial opacity:0 is committed before we transition.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => el.classList.add("is-visible"));
    });
  });

  // About page focus-area cards: click / Enter / Space toggles reveal.
  // Hover and keyboard focus also open them via CSS.
  document.querySelectorAll(".focus-card").forEach((card) => {
    const sync = () => {
      card.setAttribute(
        "aria-expanded",
        card.classList.contains("is-open") ? "true" : "false"
      );
    };
    const close = () => { card.classList.remove("is-open"); sync(); };
    const toggle = () => { card.classList.toggle("is-open"); sync(); };

    card.addEventListener("click", toggle);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle();
      }
      if (e.key === "Escape") close();
    });
    card.addEventListener("mouseleave", () => {
      if (!card.matches(":focus-within")) close();
    });
  });

  // Person photos: replace broken/empty images with initials placeholder
  document.querySelectorAll(".person-photo").forEach((img) => {
    const nameEl = img.closest(".person-card")?.querySelector(".person-name");
    const name = nameEl ? nameEl.textContent.trim() : "";
    const initials = name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join("");

    const markMissing = () => {
      img.classList.add("no-photo");
      img.setAttribute("data-initials", initials || "•");
      img.removeAttribute("src");
      img.alt = name ? `${name} (no photo available)` : "No photo available";
    };

    const src = img.getAttribute("src");
    if (!src || src.endsWith("/")) {
      markMissing();
    } else {
      img.addEventListener("error", markMissing, { once: true });
    }
  });
})();
