const scareUrl = chrome.runtime.getURL("scare.html");
let activeScareWindowId = null;
let lastPunishmentTime = 0;

const TAMPERMONKEY_IDS = [
  "dhdgffkkebhmkfjojejmpbldmpobfkfo",
  "gcalnhmpfdcmepobaendlpkbeeneeiam",
  "jinjaccalgkegednnccohejagnlnfdag",
  "fngmhnnpilhplaeedifhccceomclgfbg",
  "mflgahgkgohkflidkcebjapmgmliaojb",
  "clngdbkpkpeebahjckkjfobafhncgmne",
  "eimadpbcbfnmbkopoojfekhnkhdbieeh"
];

function isTampermonkeyExtension(ext) {
  if (!ext || typeof ext !== "object") return false;
  return TAMPERMONKEY_IDS.includes(ext.id);
}

function isTampermonkeyUrl(url) {
  if (!url || typeof url !== "string") return false;
  const lower = url.toLowerCase();
  for (const id of TAMPERMONKEY_IDS) {
    if (lower.includes(id)) return true;
  }
  return lower.includes("tampermonkey") || lower.includes("violentmonkey") || lower.endsWith(".user.js");
}

function isGoogleLensUrl(url) {
  if (!url || typeof url !== "string") return false;
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    const search = parsed.search.toLowerCase();
    const path = parsed.pathname.toLowerCase();

    if (host.startsWith("lens.google")) return true;

    const isGoogle = /(^|\.)google\.[a-z]{2,3}(\.[a-z]{2})?$/.test(host);
    if (isGoogle) {
      if (path.includes("/searchbyimage") || path.includes("/lens")) return true;
      if (search.includes("udm=24") || search.includes("udm=26") || search.includes("tbs=sbi") || search.includes("vsrid=") || search.includes("lns=")) {
        return true;
      }
    }
  } catch (e) {}
  return false;
}

async function getLiveGeoDuelsTabs() {
  if (!chrome.tabs || typeof chrome.tabs.query !== "function") return [];
  try {
    const tabs1 = await chrome.tabs.query({ url: "*://geoduels.io/*" }).catch(() => []);
    const tabs2 = await chrome.tabs.query({ url: "*://*.geoduels.io/*" }).catch(() => []);
    const unique = new Map();
    [...tabs1, ...tabs2].forEach((t) => {
      if (t && t.id) unique.set(t.id, t);
    });
    return Array.from(unique.values());
  } catch (e) {
    return [];
  }
}

async function disableTampermonkey() {
  if (!chrome.management || typeof chrome.management.getAll !== "function") return;
  try {
    const extensions = await chrome.management.getAll().catch(() => []);
    for (const ext of extensions) {
      if (isTampermonkeyExtension(ext) && ext.enabled) {
        chrome.management.setEnabled(ext.id, false).catch(() => {});
      }
    }
  } catch (err) {}
}

async function spawnScarePopupAndReloadGame() {
  const now = Date.now();
  if (now - lastPunishmentTime < 2000) return;

  const liveTabs = await getLiveGeoDuelsTabs();
  if (liveTabs.length === 0) return;

  lastPunishmentTime = now;

  for (const t of liveTabs) {
    chrome.tabs.reload(t.id).catch(() => {});
  }

  let isWindowAlive = false;
  if (activeScareWindowId) {
    try {
      const existingWin = await chrome.windows.get(activeScareWindowId).catch(() => null);
      if (existingWin) {
        isWindowAlive = true;
        await chrome.windows.update(activeScareWindowId, { focused: true, drawAttention: true }).catch(() => {});
      } else {
        activeScareWindowId = null;
      }
    } catch (e) {
      activeScareWindowId = null;
    }
  }

  if (!isWindowAlive) {
    const win = await chrome.windows.create({
      url: scareUrl,
      type: "popup",
      state: "fullscreen",
      focused: true
    }).catch(() => null);

    if (win && win.id) {
      activeScareWindowId = win.id;
    }
  }
}

chrome.windows.onFocusChanged.addListener((windowId) => {
  if (activeScareWindowId && windowId !== activeScareWindowId && windowId !== chrome.windows.WINDOW_ID_NONE) {
    chrome.windows.update(activeScareWindowId, { focused: true, drawAttention: true }).catch(() => {});
  }
});

chrome.windows.onRemoved.addListener((windowId) => {
  if (windowId === activeScareWindowId) {
    activeScareWindowId = null;
  }
});

if (chrome.management && chrome.management.onEnabled) {
  chrome.management.onEnabled.addListener(async (info) => {
    if (isTampermonkeyExtension(info)) {
      chrome.management.setEnabled(info.id, false).catch(() => {});
      spawnScarePopupAndReloadGame();
    }
  });
}

if (chrome.runtime && chrome.runtime.onMessage) {
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg && msg.action === "TRIGGER_SCARE_POPUP") {
      spawnScarePopupAndReloadGame();
    }
  });
}

if (chrome.tabs) {
  chrome.tabs.onCreated.addListener(async (tab) => {
    if (tab && isTampermonkeyUrl(tab.url)) {
      await disableTampermonkey();
      chrome.tabs.update(tab.id, { url: scareUrl }).catch(() => {});
      return;
    }

    const liveTabs = await getLiveGeoDuelsTabs();
    if (liveTabs.length === 0) return;

    if (tab && isGoogleLensUrl(tab.url)) {
      chrome.tabs.update(tab.id, { url: scareUrl }).catch(() => {});
      return;
    }

    if (tab && (!tab.url || (!tab.url.includes("geoduels.io") && !tab.url.startsWith(scareUrl)))) {
      chrome.tabs.update(tab.id, { url: scareUrl }).catch(() => {});
    }
  });

  chrome.tabs.onActivated.addListener(async (activeInfo) => {
    const currentTab = await chrome.tabs.get(activeInfo.tabId).catch(() => null);
    if (!currentTab) return;

    if (isTampermonkeyUrl(currentTab.url)) {
      await disableTampermonkey();
      chrome.tabs.update(activeInfo.tabId, { url: scareUrl }).catch(() => {});
      return;
    }

    const liveTabs = await getLiveGeoDuelsTabs();
    if (liveTabs.length === 0) return;

    if (currentTab.url && currentTab.url.includes("geoduels.io")) {
      return;
    }

    if (isGoogleLensUrl(currentTab.url)) {
      chrome.tabs.update(activeInfo.tabId, { url: scareUrl }).catch(() => {});
      return;
    }

    if (!currentTab.url || (!currentTab.url.includes("geoduels.io") && !currentTab.url.startsWith(scareUrl))) {
      chrome.tabs.update(activeInfo.tabId, { url: scareUrl }).catch(() => {});
    }
  });

  chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (tab && tab.url && tab.url.includes("geoduels.io")) {
      await disableTampermonkey();
    }

    if (tab && isTampermonkeyUrl(tab.url)) {
      await disableTampermonkey();
      chrome.tabs.update(tabId, { url: scareUrl }).catch(() => {});
      return;
    }

    const liveTabs = await getLiveGeoDuelsTabs();
    if (liveTabs.length === 0) return;

    if (tab && isGoogleLensUrl(tab.url)) {
      chrome.tabs.update(tabId, { url: scareUrl }).catch(() => {});
      return;
    }

    if (tab && tab.active && (!tab.url || (!tab.url.includes("geoduels.io") && !tab.url.startsWith(scareUrl)))) {
      chrome.tabs.update(tabId, { url: scareUrl }).catch(() => {});
    }
  });

  chrome.tabs.onRemoved.addListener(async () => {
    const liveTabs = await getLiveGeoDuelsTabs();
    if (liveTabs.length === 0 && activeScareWindowId) {
      chrome.windows.remove(activeScareWindowId).catch(() => {});
      activeScareWindowId = null;
    }
  });
}