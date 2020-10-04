export const GitHubLinkEditorElement = ({ matches, text }) => {
  const element = document.createElement('a');
  element.classList.add('editor-link');
  element.href = text;
  element.innerText = matches[0];

  return element;
};

GitHubLinkEditorElement.regexp = /^https:\/\/github\.com\/([^\s]+)/i;
