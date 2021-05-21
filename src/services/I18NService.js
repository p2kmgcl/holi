export const I18NService = {
  init() {
    const elements = document.querySelectorAll('[data-translate]');

    for (const element of elements) {
      element.innerHTML = I18NService.get(element.innerHTML.trim());
      element.removeAttribute('data-translate');
    }
  },

  get(key) {
    return chrome.i18n.getMessage(key) || key;
  },
};
