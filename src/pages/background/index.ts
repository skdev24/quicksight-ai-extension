import reloadOnUpdate from "virtual:reload-on-update-in-background-script";

reloadOnUpdate("pages/background");

chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    id: "getSummary",
    title: "Get Summary",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.menuItemId === "getSummary") {
    chrome.tabs.sendMessage(tab.id, { action: "getSummary" });
  }
});
