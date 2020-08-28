export const I18NService = {
  get(key) {
    return chrome.i18n.getMessage(key) || key;
  },
};
