import { deepEqual } from '../deepEqual.js';
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
  });

  slotForm.addEventListener('change', () => {
    EditorDataService.setEditor(new FormData(slotForm).get('slot'));
    slotSelectorList.querySelector('.checked')?.classList.remove('checked');
    slotSelectorList
      .querySelector(`[value="${EditorDataService.getEditor()}"]`)
      ?.parentElement?.classList.add('checked');
  });

  StorageService.onChange('EDITOR', (value) => {
    const slotEntries = Object.entries(value)
      .sort(
        ([editorIdA], [editorIdB]) =>
          (parseInt(editorIdA, 10) || 0) - (parseInt(editorIdB, 10) || 0)
      )
      .map(([editorId, content]) => ({
        label:
          content
            .split('\n')
            .map((line) => line.trim().replace(/^# /, ''))
            .filter((line) => line)
            .map((line) => line.toLowerCase().replace(/[^a-z0-9]+/g, '-'))[0] ||
          I18NService.get('untitled'),
        value: editorId,
      }));

    const localSlotEntries = Array.from(
      slotSelectorList.querySelectorAll('.slot-label')
    ).map((labelElement) => ({
      value: labelElement.querySelector('.slot-input').value,
      label: labelElement.querySelector('.slot-label__content').innerText,
    }));

    if (deepEqual(slotEntries, localSlotEntries)) {
      slotSelectorList.querySelector('.checked')?.classList.remove('checked');

      slotSelectorList
        .querySelector(`[value="${EditorDataService.getEditor()}"]`)
        ?.parentElement?.classList.add('checked');

      return;
    }

    slotSelectorList.innerHTML = '';

    slotEntries.forEach(({ label, value }) => {
      const slotElement = slotTemplate.content.cloneNode('true');
      const slotLabel = slotElement.querySelector('.slot-label');
      const slotInput = slotElement.querySelector('.slot-input');
      const slotContent = slotElement.querySelector('.slot-label__content');

      slotInput.value = value;
      slotContent.innerText = label;

      if (value === EditorDataService.getEditor()) {
        slotLabel.classList.add('checked');
        slotInput.checked = true;
      }

      slotSelectorList.appendChild(slotElement);
    });
  });
};
