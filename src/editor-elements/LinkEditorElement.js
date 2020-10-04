export const LinkEditorElement = ({ matches, text }) => {
  const element = document.createElement('a');
  element.classList.add('editor-link');
  element.href = text;
  element.innerText = matches[0].replace(/\/$/, '');

  return element;
};

LinkEditorElement.regexp = /^https?:\/\/([^\s]+)$/i;
