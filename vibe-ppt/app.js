(() => {
  const app = document.getElementById("app");
  const slides = Array.from(document.querySelectorAll(".slide"));
  const thumbs = document.getElementById("thumbs");
  const progress = document.getElementById("progress");
  const topbarTitle = document.getElementById("topbarTitle");
  const sidebarToggle = document.getElementById("sidebarToggle");

  const state = {
    index: 0,
    isCollapsed: false,
    isAnimating: false,
  };

  function clampIndex(value) {
    return Math.max(0, Math.min(slides.length - 1, value));
  }

  function parseHashIndex() {
    const raw = window.location.hash.replace(/^#/, "").trim();
    if (!raw) return 0;
    const num = Number(raw);
    if (!Number.isFinite(num)) return 0;
    return clampIndex(Math.floor(num) - 1);
  }

  function setHashIndex(index) {
    const next = `#${index + 1}`;
    if (window.location.hash === next) return;
    window.history.replaceState(null, "", next);
  }

  function slideMeta(slideEl) {
    return {
      title: slideEl.getAttribute("data-title") || "—",
      icon: slideEl.getAttribute("data-icon") || "•",
    };
  }

  function buildThumbs() {
    thumbs.innerHTML = "";
    slides.forEach((slide, idx) => {
      const { title, icon } = slideMeta(slide);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "thumb";
      btn.dataset.index = String(idx);
      btn.setAttribute("aria-current", "false");
      btn.title = title;

      const iconEl = document.createElement("span");
      iconEl.className = "thumb__icon";
      iconEl.textContent = icon;

      const titleEl = document.createElement("span");
      titleEl.className = "thumb__title";
      titleEl.textContent = title;

      btn.appendChild(iconEl);
      btn.appendChild(titleEl);
      btn.addEventListener("click", () => goTo(idx));
      thumbs.appendChild(btn);
    });
  }

  function renderUI() {
    const active = slides[state.index];
    const { title } = slideMeta(active);
    topbarTitle.textContent = title;
    progress.textContent = `${state.index + 1} / ${slides.length}`;

    const buttons = Array.from(thumbs.querySelectorAll(".thumb"));
    buttons.forEach((btn) => {
      const idx = Number(btn.dataset.index || "0");
      btn.setAttribute("aria-current", idx === state.index ? "true" : "false");
    });

    app.classList.toggle("is-collapsed", state.isCollapsed);
    sidebarToggle.setAttribute("aria-pressed", state.isCollapsed ? "true" : "false");
  }

  function animateTransition(fromIdx, toIdx) {
    if (fromIdx === toIdx) return;
    const from = slides[fromIdx];
    const to = slides[toIdx];

    state.isAnimating = true;
    to.classList.add("is-active");
    from.classList.add("is-exiting");
    from.classList.remove("is-active");

    const finish = () => {
      from.classList.remove("is-exiting");
      state.isAnimating = false;
    };

    const prefersReduced =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      finish();
      return;
    }

    const onEnd = (ev) => {
      if (ev.target !== from || ev.propertyName !== "opacity") return;
      from.removeEventListener("transitionend", onEnd);
      finish();
    };
    from.addEventListener("transitionend", onEnd);
    window.setTimeout(finish, 340);
  }

  function goTo(nextIndex) {
    const to = clampIndex(nextIndex);
    if (state.isAnimating || to === state.index) return;
    const from = state.index;
    state.index = to;
    setHashIndex(state.index);
    animateTransition(from, to);
    renderUI();
  }

  function next() {
    goTo(state.index + 1);
  }

  function prev() {
    goTo(state.index - 1);
  }

  function isTypingTarget(target) {
    if (!target) return false;
    if (target.isContentEditable) return true;
    const tag = (target.tagName || "").toLowerCase();
    return tag === "input" || tag === "textarea" || tag === "select";
  }

  function onKeyDown(ev) {
    if (isTypingTarget(ev.target)) return;
    if (ev.key === "ArrowRight") {
      ev.preventDefault();
      next();
    } else if (ev.key === "ArrowLeft") {
      ev.preventDefault();
      prev();
    } else if (ev.key === "Home") {
      ev.preventDefault();
      goTo(0);
    } else if (ev.key === "End") {
      ev.preventDefault();
      goTo(slides.length - 1);
    }
  }

  function onHashChange() {
    const idx = parseHashIndex();
    goTo(idx);
  }

  function toggleSidebar() {
    state.isCollapsed = !state.isCollapsed;
    renderUI();
  }

  buildThumbs();
  state.index = parseHashIndex();
  slides.forEach((s, idx) => s.classList.toggle("is-active", idx === state.index));
  renderUI();

  document.addEventListener("keydown", onKeyDown);
  window.addEventListener("hashchange", onHashChange);
  sidebarToggle.addEventListener("click", toggleSidebar);
})();

