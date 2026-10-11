// Theme toggle (dark by default; the visitor's choice is remembered) and mobile menu.
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
    });
  }
})();
