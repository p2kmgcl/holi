import { StorageService } from '../services/StorageService.js';
import { STORAGE_KEYS } from '../constants/STORAGE_KEYS.js';
import { EDITOR_ELEMENTS } from '../constants/EDITOR_ELEMENTS.js';

export const useCodeMirror = (value, setValue) => {
  const [element, setElement] = useState(null);
  const [editor, setEditor] = useState(null);
  const [portals, setPortals] = useState([]);

  const getElementForText = useCallback((text, getMarker) => {
    const Component = EDITOR_ELEMENTS.find((EditorElement) =>
      EditorElement.regexp.test(text)
    );

    if (Component) {
      const element = document.createElement('div');
      element.classList.add('editor-element-wrapper');
      element.classList.add(`editor-element-wrapper--${Component.name}`);

      requestAnimationFrame(() => {
        const marker = getMarker();
        const matches = Component.regexp.exec(text).slice(1);

        setPortals((prevPortals) => [
          ...prevPortals.filter((portal) =>
            document.body.contains(portal.element)
          ),
          {
            element,
            component: () => {
              useLayoutEffect(() => {
                marker.changed();
              });

              return html`<${Component}
                marker=${marker}
                matches=${matches}
                text=${text}
              />`;
            },
          },
        ]);
      });

      return element;
    }
  }, []);

  useEffect(() => {
    if (element) {
      const nextEditor = CodeMirror.fromTextArea(element, {
        value: '',
        mode: 'markdown',
        keyMap: 'sublime',
        theme: 'idea',
        lineWrapping: true,
      });

      const history = StorageService.getLocal(STORAGE_KEYS.editorHistory);

      try {
        nextEditor.getDoc().setHistory(history);
      } catch (error) {
        nextEditor.getDoc().setHistory({ done: [], undone: [] });
      }

      setEditor(nextEditor);

      return () => {
        nextEditor.toTextArea(element);
        setEditor(null);
      };
    }
  }, [element]);

  useEffect(() => {
    if (editor) {
      const handleChange = (_, change) => {
        // Remote change, do nothing
        if (change.origin === 'setValue') {
          return;
        }

        const doc = editor.getDoc();
        const docValue = doc.getValue();

        setValue(docValue);

        StorageService.setLocal(STORAGE_KEYS.editorHistory, doc.getHistory());
        StorageService.setLocal(STORAGE_KEYS.editorBackup, {
          date: Date.now(),
          text: docValue,
        });

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
            chunks.map((s) => s.length).reduce((a, b) => a + b, 0) +
            chunks.length;

          addMarks(
            doc,
            { line, ch: fromCh },
            { line, ch: toCh },
            getElementForText
          );
        } else if (change.origin === 'paste' || change.origin === '+swapLine') {
          doc.eachLine(
            change.from.line,
            change.to.line + change.text.length,
            (line) => parseLine(doc, line, getElementForText)
          );
        }
      };

      editor.on('change', handleChange);
      return () => editor.off('change', handleChange);
    }
  }, [editor, getElementForText]);

  useLayoutEffect(() => {
    const doc = editor?.getDoc();
    const prevValue = doc?.getValue();

    if (doc && prevValue !== value) {
      doc.setValue(value);
      doc.eachLine((line) => parseLine(doc, line, getElementForText));

      if (!prevValue) {
        const { done, undone } = doc.getHistory();
        const history = { done: done.slice(0, done.length - 2), undone };
        doc.setHistory(history);
        StorageService.setLocal(STORAGE_KEYS.editorHistory, history);
      }
    }
  }, [editor, value, getElementForText]);

  return [setElement, portals];
};

const addMarks = (doc, from, to, getElementForText) => {
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

  const element = getElementForText(text, () => marker);

  if (element) {
    marker = doc.markText(from, trimmedTo, {
      replacedWith: element,
      clearOnEnter: false,
      inclusiveLeft: false,
      inclusiveRight: false,
    });
  }
};

const parseLine = (doc, line, getElementForText) => {
  const chunks = line.text.split(' ');
  const lineNo = line.lineNo();
  let fromCh = 0;

  while (chunks.length) {
    const toCh = fromCh + chunks.shift().length + 1;

    addMarks(
      doc,
      { line: lineNo, ch: fromCh },
      { line: lineNo, ch: toCh },
      getElementForText
    );

    fromCh = toCh;
  }
};
