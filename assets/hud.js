/* REGENIX — HUD animation engine.
   Self-contained, dependency-free. Included on every page before </body>.
   Handles: scroll-reveal (+ stagger), count-up stats, nav scroll state,
   subtle pointer parallax on heroes. Respects prefers-reduced-motion. */
(function () {
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var root = document.documentElement;
  root.classList.add("js-fade");

  /* ---------- scroll reveal ---------- */
  function initReveal() {
    var els = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
    if (!els.length) return;
    if (reduce || !("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    // stagger siblings sharing a parent marked [data-stagger]
    document.querySelectorAll("[data-stagger]").forEach(function (group) {
      var kids = group.querySelectorAll(".reveal");
      var step = parseFloat(group.getAttribute("data-stagger")) || 90;
      Array.prototype.forEach.call(kids, function (k, i) {
        k.style.transitionDelay = (i * step) + "ms";
      });
    });
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          obs.unobserve(e.target);
          if (e.target.hasAttribute("data-count") || e.target.classList.contains("hud-countup")) {
            countUp(e.target);
          }
          // count up any descendants
          e.target.querySelectorAll("[data-count]").forEach(countUp);
        }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
    els.forEach(function (el) { obs.observe(el); });

    // standalone count-up targets not wrapped in a .reveal
    document.querySelectorAll("[data-count]").forEach(function (el) {
      if (!el.closest(".reveal")) obs2.observe(el);
    });
    var obs2 = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { countUp(e.target); obs2.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
  }

  /* ---------- count up ---------- */
  function countUp(el) {
    if (el.__counted) return; el.__counted = true;
    var target = parseFloat(el.getAttribute("data-count"));
    if (isNaN(target)) return;
    var dur = parseInt(el.getAttribute("data-count-dur"), 10) || 1300;
    var dec = parseInt(el.getAttribute("data-count-dec"), 10) || 0;
    var prefix = el.getAttribute("data-count-prefix") || "";
    var suffix = el.getAttribute("data-count-suffix") || "";
    if (reduce) { el.textContent = prefix + target.toFixed(dec) + suffix; return; }
    var start = null;
    function frame(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = target * eased;
      el.textContent = prefix + val.toFixed(dec) + suffix;
      if (p < 1) requestAnimationFrame(frame);
      else el.textContent = prefix + target.toFixed(dec) + suffix;
    }
    requestAnimationFrame(frame);
  }

  /* ---------- nav scroll state ---------- */
  function initNav() {
    var nav = document.querySelector(".nav");
    if (!nav) return;
    var onScroll = function () {
      if (window.scrollY > 24) nav.classList.add("scrolled");
      else nav.classList.remove("scrolled");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- subtle pointer parallax on hero device ---------- */
  function initParallax() {
    if (reduce) return;
    var stage = document.querySelector(".hud-hero");
    if (!stage) return;
    var dev = stage.querySelector(".hud-device img");
    var copy = stage.querySelector(".hud-copy");
    stage.addEventListener("pointermove", function (e) {
      var r = stage.getBoundingClientRect();
      var dx = (e.clientX - r.left) / r.width - 0.5;
      var dy = (e.clientY - r.top) / r.height - 0.5;
      if (dev) dev.style.transform = "translateX(-46%) translate(" + (dx * 16) + "px," + (dy * 12) + "px)";
      if (copy) copy.style.transform = "translate(" + (dx * -7) + "px," + (dy * -5) + "px)";
    });
    stage.addEventListener("pointerleave", function () {
      if (dev) dev.style.transform = "translateX(-46%)";
      if (copy) copy.style.transform = "";
    });
  }

  function init() { initReveal(); initNav(); initParallax(); }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else { init(); }
})();
