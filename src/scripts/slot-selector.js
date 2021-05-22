import { EditorDataService } from '../services/EditorDataService.js';
import { I18NService } from '../services/I18NService.js';
import { StorageService } from '../services/StorageService.js';

export const slotSelector = () => {
  const slotForm = document.getElementById('slotSelectorForm');
  const slotTemplate = document.getElementById('slotTemplate');
  const slotSelectorList = document.getElementById('slotSelectorList');
  const addSlotButton = document.getElementById('addSlotButton');

  addSlotButton.addEventListener('click', () => {
    EditorDataService.addEditor();
    document.querySelector('#editor .CodeMirror-code').focus();
  });

  slotForm.addEventListener('change', () => {
    EditorDataService.setEditor(new FormData(slotForm).get('slot'));
    slotSelectorList.querySelector('.checked')?.classList.remove('checked');
    slotSelectorList
      .querySelector(`[value="${EditorDataService.getEditor()}"]`)
      ?.parentElement?.classList.add('checked');
  });

  StorageService.onChange('EDITOR', (value) => {
    slotSelectorList.innerHTML = '';

    Object.entries(value)
      .sort(
        ([editorIdA], [editorIdB]) =>
          (parseInt(editorIdA, 10) || 0) - (parseInt(editorIdB, 10) || 0)
      )
      .forEach(([editorId, content]) => {
        const slotElement = slotTemplate.content.cloneNode('true');
        const slotLabel = slotElement.querySelector('.slot-label');
        const slotInput = slotElement.querySelector('.slot-input');
        const slotContent = slotElement.querySelector('.slot-label__content');

        slotInput.value = editorId;

        slotContent.innerText =
          content
            .split('\n')
            .map((line) => line.trim())
            .filter((line) => line)[0] || I18NService.get('untitled');

        if (editorId === EditorDataService.getEditor()) {
          slotLabel.classList.add('checked');
          slotInput.checked = true;
        }

        slotSelectorList.appendChild(slotElement);
      });
  });
};
