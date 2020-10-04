import { StorageService } from '../services/StorageService.js';
import { STORAGE_KEYS } from '../constants/STORAGE_KEYS.js';
import { EDITOR_ELEMENTS } from '../constants/EDITOR_ELEMENTS.js';

export const editor = async () => {
  const textarea = document.getElementById('editorTextarea');
  const wrapper = document.getElementById('editorMirror');

  const editor = CodeMirror.fromTextArea(textarea, {
    value: '',
    mode: 'markdown',
    keyMap: 'sublime',
    theme: 'idea',
    lineWrapping: true,
  });

  const doc = editor.getDoc();
  doc.setValue(await StorageService.get(STORAGE_KEYS.text));
  doc.eachLine((line) => parseLine(doc, line));

  try {
    doc.setHistory(StorageService.getLocal(STORAGE_KEYS.editorHistory));
  } catch (error) {
    doc.setHistory({ done: [], undone: [] });
  }

  StorageService.onChange(STORAGE_KEYS.text, (value) => {
    if (value !== doc.getValue()) {
      doc.setValue(value);
      doc.eachLine((line) => parseLine(doc, line));
    }
  });

  editor.on('change', (_, change) => {
    // Remote change, do nothing
    if (change.origin === 'setValue') {
      return;
    }

    StorageService.setLocal(STORAGE_KEYS.editorHistory, doc.getHistory());
    StorageService.setLocal(STORAGE_KEYS.editorBackup, {
      date: Date.now(),
      text: doc.getValue(),
    });
    StorageService.set(STORAGE_KEYS.text, doc.getValue());

    if (
      change.origin === '+input' &&
      ['', ' '].includes(change.text[change.text.length - 1])
    ) {
      const line = change.from.line;
      const toCh = change.to.ch;

      const chunks = doc
        .getRange({ line, ch: 0 }, { line, ch: toCh }, ' ')
        .split(/\s/)
        .filter((s) => s);

      chunks.pop();

      const fromCh =
        chunks.map((s) => s.length).reduce((a, b) => a + b, 0) + chunks.length;

      addMarks(doc, { line, ch: fromCh }, { line, ch: toCh });
    } else if (change.origin === 'paste' || change.origin === '+swapLine') {
      doc.eachLine(
        change.from.line,
        change.to.line + change.text.length,
        (line) => parseLine(doc, line)
      );
    }
  });
};

function addMarks(doc, from, to) {
  if (doc.findMarks(from, to).length) {
    return;
  }

  let marker = null;
  let trimmedTo = to;
  let text = doc.getRange(from, trimmedTo);

  while (text.endsWith(' ') && trimmedTo.ch > 0) {
    trimmedTo = { ...trimmedTo, ch: trimmedTo.ch - 1 };
    text = doc.getRange(from, trimmedTo);
  }

  const element = (() => {
    const EditorElement = EDITOR_ELEMENTS.find((EditorElement) =>
      EditorElement.regexp.test(text)
    );

    if (EditorElement) {
      const matches = EditorElement.regexp.exec(text).slice(1);
      const element = EditorElement({
        text,
        matches,

        onChange: (value) => {
          if (marker?.find) {
            const { from, to } = marker.find();
            marker.doc.replaceRange(value, from, to, 'paste');
          }
        },

        onRender: () => {
          marker?.changed();
        },
      });

      requestAnimationFrame(() => {
        marker?.changed();
      });

      element.classList.add(`editor-element--${EditorElement.name}`);
      return element;
    }
  })();

  if (element) {
    marker = doc.markText(from, trimmedTo, {
      replacedWith: element,
      clearOnEnter: false,
      inclusiveLeft: false,
      inclusiveRight: false,
    });
  }
}

function parseLine(doc, line) {
  const chunks = line.text.split(' ');
  const lineNo = line.lineNo();
  let fromCh = 0;

  while (chunks.length) {
    const toCh = fromCh + chunks.shift().length + 1;
    addMarks(doc, { line: lineNo, ch: fromCh }, { line: lineNo, ch: toCh });
    fromCh = toCh;
  }
}
