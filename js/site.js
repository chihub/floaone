// Theme toggle (light by default; the visitor's choice is remembered), mobile menu,
// and smooth scrolling via Locomotive Scroll (as in info/Blocomotivejs-main).
(function () {
  var root = document.documentElement;

  function setTheme(next) {
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
  }

  document.querySelectorAll(".theme-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
    });
  });

  var menuBtn = document.querySelector(".menu-toggle");
  var links = document.getElementById("nav-links");
  if (menuBtn && links) {
    menuBtn.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
      // The links sit before the button in the page order, so Tab from the button would skip
      // them. Send keyboard focus into the open menu instead.
      if (open) { var first = links.querySelector("a"); if (first) first.focus(); }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape" || !links.classList.contains("open")) return;
      links.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.focus();
    });
  }

  // Smooth scrolling. Phones and tablets keep native scrolling (Locomotive detects them by
  // device, not width), and so does anyone who has asked their system for reduced motion.
  // A narrow desktop window still gets smooth scrolling.
  var container = document.querySelector("[data-scroll-container]");
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!container || reduced || typeof LocomotiveScroll === "undefined") return;

  var scroll = new LocomotiveScroll({
    el: container,
    smooth: true,
    lerp: 0.09,
    tablet: { breakpoint: 0 }
  });

  var headerOffset = -80;

  // Locomotive moves the content itself, so the window must stay at the top. The browser
  // still scrolls the window natively for a #hash in the URL, back/forward restoration, or
  // find-in-page, and that stacks on top of Locomotive's offset and leaves a blank screen.
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  function pinWindow() { if (window.scrollY || window.scrollX) window.scrollTo(0, 0); }
  pinWindow();
  window.addEventListener("scroll", pinWindow);

  // In-page anchors (#notable, the Practice contents, the skip link) go through the scroller.
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href*="#"]');
    if (!a) return;
    var url = new URL(a.href, location.href);
    if (url.pathname !== location.pathname || !url.hash) return;
    var target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (!target) return;
    e.preventDefault();
    if (links) links.classList.remove("open");
    if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
    scroll.scrollTo(target, { offset: headerOffset });
    history.replaceState(null, "", url.hash);
    // preventDefault also stops the browser moving focus, so keyboard users would stay behind
    // on the link they pressed. Move focus to the target without a native scroll.
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  });

  // Content height changes once web fonts and images arrive; re-measure, then honor a hash
  // in the URL (for example /work/#notable from the Home page).
  function refresh() { scroll.update(); }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
  window.addEventListener("load", function () {
    pinWindow();
    refresh();
    if (location.hash) {
      var target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (target) scroll.scrollTo(target, { offset: headerOffset, duration: 0, disableLerp: true });
    }
  });
})();
