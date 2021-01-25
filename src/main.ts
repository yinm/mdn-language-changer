import MouseTrap from "mousetrap";
import { showSnackbar } from "./snackbar";

const languages = [
  {
    languageCode: "en-US",
    hotkey: "e n",
    languageNameInMDN: "English",
  },
  {
    languageCode: "ja",
    hotkey: "j a",
    languageNameInMDN: "日本語",
  },
];

languages.forEach((language) => {
  MouseTrap.bind(language.hotkey, () => {
    const languageSelector = document.querySelector<HTMLSelectElement>(
      "#select_language"
    );
    if (languageSelector === null) {
      showSnackbar("Current language only.");
      return;
    }

    const children = Array.from(
      languageSelector.children
    ) as HTMLOptionElement[];
    const { languageCode, languageNameInMDN } = language;
    if (children[0].value === languageCode) {
      showSnackbar("Now selecting.");
      return;
    }

    const selectableLanguage = children.find((child) =>
      child.value.startsWith(`/${languageCode}`)
    );
    if (selectableLanguage) {
      history.pushState(null, "", selectableLanguage.value);
      location.reload();
    } else {
      showSnackbar(`${languageNameInMDN} is not found.`);
    }
  });
});
