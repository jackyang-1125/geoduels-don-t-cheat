(function () {
  let isTriggered = false;
  const initialWidth = window.innerWidth;
  const initialHeight = window.innerHeight;

  function triggerInstantLensPenalty() {
    if (isTriggered) return;
    isTriggered = true;

    try {
      if (typeof chrome !== "undefined" && Boolean(chrome.runtime) && typeof chrome.runtime.sendMessage === "function") {
        chrome.runtime.sendMessage({ action: "LENS_OVERLAY_OPENED" });
      }
    } catch (e) {}

    document.documentElement.innerHTML = "";
  }

  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", () => {
      const widthDiff = initialWidth - window.visualViewport.width;
      const heightDiff = initialHeight - window.visualViewport.height;
      if (widthDiff > 180 || heightDiff > 150) {
        triggerInstantLensPenalty();
      }
    });
  }

  window.addEventListener("resize", () => {
    const diff = initialWidth - window.innerWidth;
    if (diff > 180) {
      triggerInstantLensPenalty();
    }
  });

  window.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    e.stopPropagation();
  }, true);

  document.addEventListener("dragstart", (e) => {
    e.preventDefault();
  }, true);

  window.addEventListener("keydown", (e) => {
    const key = e.key ? e.key.toLowerCase() : "";
    if (
      key === "f12" ||
      (e.ctrlKey && e.shiftKey && (key === "i" || key === "j" || key === "c" || key === "s")) ||
      (e.ctrlKey && key === "u")
    ) {
      e.preventDefault();
      e.stopPropagation();
      triggerInstantLensPenalty();
    }
  }, true);
})();