(() => {
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector("#navigation");
  const mobile = window.matchMedia("(max-width: 760px)");

  const closeMenu = (restoreFocus = false) => {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
    navigation.classList.remove("is-open");
    if (restoreFocus) menuButton.focus();
  };

  menuButton.hidden = false;
  navigation.classList.add("is-enhanced");
  menuButton.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute(
      "aria-label",
      open ? "Close navigation" : "Open navigation",
    );
    navigation.classList.toggle("is-open", open);
  });
  navigation.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!link) return;
    closeMenu();
    if (mobile.matches)
      document
        .querySelector(link.getAttribute("href"))
        ?.focus({ preventScroll: true });
  });
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      menuButton.getAttribute("aria-expanded") === "true"
    )
      closeMenu(true);
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".site-header")) closeMenu();
  });
  document.addEventListener("focusin", (event) => {
    if (!event.target.closest(".site-header")) closeMenu();
  });
  mobile.addEventListener("change", () => closeMenu());

  const filters = document.querySelector(".filters");
  const findings = [...document.querySelectorAll(".finding")];
  const count = document.querySelector("#finding-count");
  filters.hidden = false;
  filters.addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");
    if (!button) return;
    const severity = button.dataset.filter;
    filters
      .querySelectorAll("button")
      .forEach((item) =>
        item.setAttribute("aria-pressed", String(item === button)),
      );
    findings.forEach((finding) => {
      finding.hidden =
        severity !== "all" && finding.dataset.severity !== severity;
    });
    const visibleCount = findings.filter((finding) => !finding.hidden).length;
    count.textContent = `${visibleCount} ${severity === "all" ? "accepted" : severity + "-severity"} findings`;
  });

  const navLinks = [...document.querySelectorAll("[data-spy]")];
  const sections = [...document.querySelectorAll("main > section[id]")];
  let pendingFrame = false;
  const updateNavigation = () => {
    const threshold = window.innerHeight * 0.35;
    let current = "";
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= threshold)
        current = section.id;
    }
    navLinks.forEach((link) => {
      if (link.getAttribute("href") === "#" + current)
        link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
    pendingFrame = false;
  };
  window.addEventListener(
    "scroll",
    () => {
      if (!pendingFrame) {
        pendingFrame = true;
        requestAnimationFrame(updateNavigation);
      }
    },
    { passive: true },
  );
  updateNavigation();

  const copyButton = document.querySelector(".copy-email");
  const copyLabel = copyButton.querySelector("span");
  const copyStatus = document.querySelector("#copy-status");
  let copyTimeout;
  if (window.isSecureContext && navigator.clipboard?.writeText) {
    copyButton.hidden = false;
    copyButton.addEventListener("click", async () => {
      clearTimeout(copyTimeout);
      try {
        await navigator.clipboard.writeText("rhaikal91@gmail.com");
        copyLabel.textContent = "Copied!";
        copyStatus.textContent = "Email address copied to clipboard.";
      } catch {
        copyLabel.textContent = "Try again";
        copyStatus.textContent =
          "Copy unavailable. Select rhaikal91@gmail.com or use the email link.";
      }
      copyTimeout = setTimeout(() => {
        copyLabel.textContent = "Copy email";
      }, 2500);
    });
  }
  document.querySelector("#year").textContent = new Date().getFullYear();
})();
