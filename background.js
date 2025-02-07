// Global state: false means "off", true means "on".
let isActive = false;

// When a tab finishes loading, check if it’s DuckDuckGo and set the icon to "on".
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url && tab.url.includes("duckduckgo.com")) {
    isActive = true;
    chrome.action.setIcon({ tabId, path: "images/icon128.png" });
  }
});

// Toggle state on icon click.
chrome.action.onClicked.addListener((tab) => {
  // Toggle the global state.
  isActive = !isActive;
  const iconPath = isActive ? "images/icon128.png" : "images/icon-off128.png";
  chrome.action.setIcon({ tabId: tab.id, path: iconPath });

  // Execute the script that toggles the hidden input.
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      const toggleEl = document.querySelector('input[value="disable-minimal-theme"]');
      if (toggleEl) {
        toggleEl.remove();
      } else {
        const input = document.createElement("input");
        input.type = "hidden";
        input.value = "disable-minimal-theme";
        document.documentElement.appendChild(input);
      }
    }
  });
});
