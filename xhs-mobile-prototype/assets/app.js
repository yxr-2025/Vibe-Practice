function getParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

function setActiveTab() {
  const page = document.body.getAttribute("data-page");
  if (!page) return;
  document.querySelectorAll(".tabbar .tab").forEach((a) => {
    if (a.getAttribute("data-tab") === page) a.classList.add("active");
  });
}

function applyState() {
  const state = (getParam("state") || "normal").toLowerCase();
  const allowed = new Set(["normal", "loading", "empty", "error"]);
  const picked = allowed.has(state) ? state : "normal";
  document.querySelectorAll("[data-state]").forEach((el) => {
    el.style.display = el.getAttribute("data-state") === picked ? "" : "none";
  });
}

function applyTabs() {
  const tab = (getParam("tab") || "").toLowerCase();
  if (!tab) return;
  const tabs = document.querySelectorAll("[data-tab-panel]");
  if (!tabs.length) return;

  tabs.forEach((el) => {
    el.style.display = el.getAttribute("data-tab-panel") === tab ? "" : "none";
  });

  document.querySelectorAll("[data-tab-link]").forEach((a) => {
    a.classList.remove("active");
    if (a.getAttribute("data-tab-link") === tab) a.classList.add("active");
  });
}

function wireBackButtons() {
  document.querySelectorAll("[data-back]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      if (window.history.length > 1) window.history.back();
      else window.location.href = btn.getAttribute("href") || "home.html";
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setActiveTab();
  applyState();
  applyTabs();
  wireBackButtons();
});
