(function () {
  let isArmed = true;
  let isBookmarkingSafe = false;
  let isUnloadingPage = false;

  const style = document.createElement("style");
  style.innerHTML = `
    * {
      -webkit-user-select: none !important;
      user-select: none !important;
    }
    img, canvas, video, svg {
      -webkit-user-drag: none !important;
      user-drag: none !important;
    }
  `;
  document.documentElement.appendChild(style);

  window.addEventListener("beforeunload", () => {
    isUnloadingPage = true;
  });

  window.addEventListener("pagehide", () => {
    isUnloadingPage = true;
  });

  function notifyBackgroundToSpawnPopup() {
    if (document.hidden || isUnloadingPage || !isArmed || isBookmarkingSafe) {
      return;
    }

    try {
      if (typeof chrome !== "undefined" && Boolean(chrome.runtime) && typeof chrome.runtime.sendMessage === "function") {
        chrome.runtime.sendMessage({ action: "TRIGGER_SCARE_POPUP" });
      }
    } catch (e) {}
  }

  window.addEventListener("keydown", (e) => {
    const key = e.key ? e.key.toLowerCase() : "";

    if (e.ctrlKey && key === "w") {
      isUnloadingPage = true;
      return;
    }

    if (e.ctrlKey && key === "d") {
      isBookmarkingSafe = true;
      setTimeout(() => {
        isBookmarkingSafe = false;
      }, 2000);
      return;
    }

    const isCheatShortcut =
      key === "printscreen" ||
      key === "f12" ||
      (e.ctrlKey && e.shiftKey && (key === "s" || key === "i" || key === "c" || key === "j")) ||
      (e.ctrlKey && key === "u");

    if (isCheatShortcut) {
      e.preventDefault();
      e.stopPropagation();
      notifyBackgroundToSpawnPopup();
    }
  }, true);

  window.addEventListener("blur", () => {
    if (document.hidden || isUnloadingPage || !isArmed || isBookmarkingSafe) return;
    notifyBackgroundToSpawnPopup();
  });

  document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  }, true);

  document.addEventListener("dragstart", (e) => {
    e.preventDefault();
    notifyBackgroundToSpawnPopup();
  }, true);
})();