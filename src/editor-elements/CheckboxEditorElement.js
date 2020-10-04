export const CheckBoxEditorElement = ({ text, matches, onChange }) => {
  const element = document.createElement('input');
  element.type = 'checkbox';
  element.checked = matches[0].toLowerCase() === 'x';

  element.addEventListener('change', () => {
    onChange(`[${element.checked ? 'x' : ''}]`);
  });

  return element;
};

CheckBoxEditorElement.regexp = /^\[(x?)\]$/i;
