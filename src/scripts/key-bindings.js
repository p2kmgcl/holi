import { I18NService } from '../services/I18NService.js';

export const keyBindings = () => {
  const keyBindingsDialog = document.getElementById('keyBindingsDialog');
  const keyBindingsTableBody = document.getElementById('keyBindingsTableBody');

  const toggleHelpDialog = () => {
    keyBindingsDialog.classList.toggle('hidden');

    if (!keyBindingsDialog.classList.contains('hidden')) {
      keyBindingsDialog.focus();
    }
  };

  keyBindingsDialog.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      toggleHelpDialog();
    }
  });

  keyBindingsDialog.addEventListener('focusout', () => {
    if (!keyBindingsDialog.classList.contains('hidden')) {
      keyBindingsDialog.focus();
    }
  });

  const KEY_BINDINGS = [
    {
      keys: ['control', 'b'],
      action: () => document.querySelector('#bookmarks a')?.focus(),
      description: I18NService.get('focusBookmarkList'),
    },
    {
      keys: ['control', 'shift', 'e'],
      action: () => document.querySelector('#editor .CodeMirror-code').focus(),
      description: I18NService.get('focusTextEditor'),
    },
    {
      keys: ['control', 'shift', 's'],
      action: () =>
        document.querySelector('#slotSelectorList .checked input').focus(),
      description: I18NService.get('focusSlotSelector'),
    },
    {
      keys: ['control', '?'],
      action: toggleHelpDialog,
      description: I18NService.get('showHideKeyBindingsHelpDialog'),
    },
    {
      keys: ['control', 'shift', '?'],
      action: toggleHelpDialog,
      description: I18NService.get('showHideKeyBindingsHelpDialog'),
    },
  ];

  KEY_BINDINGS.forEach(({ keys, description }) => {
    const tr = document.createElement('tr');

    const actionTd = document.createElement('td');
    actionTd.innerText = description;

    const keyboardShortcutTd = document.createElement('td');

    keys.forEach((key) => {
      const kbd = document.createElement('kbd');
      kbd.innerText = key;

      if (keyboardShortcutTd.children.length) {
        const plusText = document.createTextNode('+');
        keyboardShortcutTd.appendChild(plusText);
      }

      keyboardShortcutTd.appendChild(kbd);
    });

    tr.appendChild(actionTd);
    tr.appendChild(keyboardShortcutTd);

    keyBindingsTableBody.appendChild(tr);
  });

  document.body.addEventListener('keydown', (event) => {
    let pressedKeys = new Set();

    if (event.ctrlKey) pressedKeys.add('control');
    if (event.metaKey) pressedKeys.add('meta');
    if (event.altKey) pressedKeys.add('alt');
    if (event.shiftKey) pressedKeys.add('shift');

    pressedKeys.add(event.key.toLowerCase());

    KEY_BINDINGS.forEach(({ keys, action }) => {
      if (
        pressedKeys.size === keys.length &&
        keys.every((key) => pressedKeys.has(key))
      ) {
        event.stopPropagation();
        action();
      }
    });
  });
};
