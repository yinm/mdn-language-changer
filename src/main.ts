import { setKeybinding } from "./setKeybinding";

const languages = [
  {
    languageCode: "en-US",
    hotkey: "e n",
    languageNameInMdn: "English",
  },
  {
    languageCode: "ja",
    hotkey: "j a",
    languageNameInMdn: "日本語",
  },
];

const currentLanguage = document
  .querySelector("#header-language-menu")
  ?.textContent?.replace("▼", "") as string;

languages.forEach(({ languageCode, hotkey, languageNameInMdn }) => {
  if (currentLanguage !== languageNameInMdn) {
    setKeybinding(languageCode, hotkey, languageNameInMdn);
  }
});
