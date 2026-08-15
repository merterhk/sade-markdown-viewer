"use strict";

browser.runtime.onInstalled.addListener(async ({ reason, previousVersion }) => {
  const upgradingToPermissionFlow = reason === "update" && previousVersion !== "1.0.2";
  if ((reason === "install" || upgradingToPermissionFlow) &&
      !await browser.extension.isAllowedFileSchemeAccess()) {
    await browser.tabs.create({ url: browser.runtime.getURL("welcome.html") });
  }
});
