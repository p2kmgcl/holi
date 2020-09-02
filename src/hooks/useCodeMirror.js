export const useCodeMirror = (value, setValue, getElementForText) => {
  const [element, setElement] = useState(null);
  const [editor, setEditor] = useState(null);

  useEffect(() => {
    if (element) {
      const nextEditor = CodeMirror.fromTextArea(element, {
        value: '',
        mode: 'markdown',
        theme: 'idea',
        lineWrapping: true,
      });

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
        setValue(doc.getValue());

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
        } else if (change.origin === 'paste') {
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

    if (doc && doc.getValue() !== value) {
      doc.setValue(value);
      doc.eachLine((line) => parseLine(doc, line, getElementForText));
    }
  }, [editor, value, getElementForText]);

  return setElement;
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
