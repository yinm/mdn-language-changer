import { install } from "@github/hotkey";
import { createSnackbar } from "./createSnackbar";

export function setKeybinding(
  languageCode: string,
  hotkey: string,
  languageNameInMdn: string
): void {
  const linkElement: HTMLElement | null = document.querySelector(
    `[lang="${languageCode}"] a`
  );

  if (linkElement) {
    install(linkElement, hotkey);
  } else {
    const snackbar = createSnackbar(languageNameInMdn);
    setTimeout(() => {
      snackbar.style.display = "none";
    }, 5000);
  }
}
