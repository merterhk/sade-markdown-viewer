"use strict";

const button = document.querySelector("#grant");
const status = document.querySelector("#status");

document.documentElement.lang = browser.i18n.getUILanguage().split("-")[0];
document.querySelectorAll("[data-i18n]").forEach(element => {
  element.textContent = browser.i18n.getMessage(element.dataset.i18n);
});

async function refreshPermissionState() {
  const allowed = await browser.extension.isAllowedFileSchemeAccess();
  if (allowed) {
    button.hidden = true;
    status.textContent = browser.i18n.getMessage("permissionGranted");
    status.className = "success";
  }
}

button.addEventListener("click", async () => {
  button.disabled = true;
  try {
    const granted = await browser.permissions.request({ origins: ["file:///*"] });
    if (granted) {
      await refreshPermissionState();
    } else {
      status.textContent = browser.i18n.getMessage("permissionDenied");
      status.className = "error";
      button.disabled = false;
    }
  } catch (error) {
    console.error(error);
    status.textContent = browser.i18n.getMessage("permissionError");
    status.className = "error";
    button.disabled = false;
  }
});

refreshPermissionState();
