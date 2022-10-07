import { deepEqual } from '../deepEqual.js';
import { EditorDataService } from '../services/EditorDataService.js';
import { I18NService } from '../services/I18NService.js';
import { StorageService } from '../services/StorageService.js';

export const editorTabs = () => {
  const tabForm = document.getElementById('editorTabsForm');
  const tabTemplate = document.getElementById('tabTemplate');
  const editorTabList = document.getElementById('editorTabList');
  const addTabButton = document.getElementById('addTabButton');

  addTabButton.addEventListener('click', () => {
    EditorDataService.addEditor();
  });

  tabForm.addEventListener('change', () => {
    EditorDataService.setEditor(new FormData(tabForm).get('tab'));
    editorTabList.querySelector('.checked')?.classList.remove('checked');
    editorTabList
      .querySelector(`[value="${EditorDataService.getEditor()}"]`)
      ?.parentElement?.classList.add('checked');
  });

  StorageService.onChange('EDITOR', (value) => {
    const tabEntries = Object.entries(value)
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

    const localTabEntries = Array.from(
      editorTabList.querySelectorAll('.tab-label')
    ).map((labelElement) => ({
      value: labelElement.querySelector('.tab-input').value,
      label: labelElement.querySelector('.tab-label__content').innerText,
    }));

    if (deepEqual(tabEntries, localTabEntries)) {
      editorTabList.querySelector('.checked')?.classList.remove('checked');

      editorTabList
        .querySelector(`[value="${EditorDataService.getEditor()}"]`)
        ?.parentElement?.classList.add('checked');

      return;
    }

    editorTabList.innerHTML = '';

    tabEntries.forEach(({ label, value }) => {
      const tabElement = tabTemplate.content.cloneNode('true');
      const tabLabel = tabElement.querySelector('.tab-label');
      const tabInput = tabElement.querySelector('.tab-input');
      const tabContent = tabElement.querySelector('.tab-label__content');

      tabInput.value = value;
      tabContent.innerText = label;

      if (value === EditorDataService.getEditor()) {
        tabLabel.classList.add('checked');
        tabInput.checked = true;
      }

      editorTabList.appendChild(tabElement);
    });
  });
};
