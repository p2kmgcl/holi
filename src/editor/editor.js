const addMarks = (doc, from, to) => {
  const markText = (replacedWith) => {
    doc.markText(from, to, {
      replacedWith,
      clearOnEnter: true,
      inclusiveLeft: false,
      inclusiveRight: false,
    });
  };

  if (doc.findMarks(from, to).length) {
    return;
  }

  const text = doc.getRange(from, to);

  if (text === '---') {
    const hrElement = document.createElement('hr');
    hrElement.classList.add('editor-inline-hr');

    markText(hrElement);
  }

  text.replace(/https?:\/\/[^\s]+/gi, (url) => {
    const linkElement = document.createElement('a');

    linkElement.classList.add('editor-inline-link');
    linkElement.href = url;
    linkElement.innerText = url
      .replace(/^https:\/\/issues\.liferay\.com\/browse\//i, '')
      .replace(/^https:\/\/github\.com\//i, '')
      .replace(/^https?:\/\//i, '');

    markText(linkElement);

    return url;
  });
};

const parseLine = (doc, line) => {
  const chunks = line.text.split(' ');
  const lineNo = line.lineNo();
  let fromCh = 0;

  while (chunks.length) {
    const toCh = fromCh + chunks.shift().length + 1;
    addMarks(doc, { line: lineNo, ch: fromCh }, { line: lineNo, ch: toCh });
    fromCh = toCh;
  }
};

window.createEditor = async () => {
  const editor = CodeMirror(document.getElementById('editor'), {
    value: await StorageService.getValue(),
    mode: 'markdown',
    theme: 'idea',
    lineWrapping: true,
  });

  const doc = editor.getDoc();
  doc.eachLine((line) => parseLine(doc, line));

  StorageService.onChange((text) => {
    doc.setValue(text);
  });

  editor.on('change', (_, range) => {
    if (
      range.origin === '+input' &&
      ['', ' '].includes(range.text[range.text.length - 1])
    ) {
      const line = range.from.line;
      const toCh = range.to.ch;

      const chunks = doc
        .getRange({ line, ch: 0 }, { line, ch: toCh }, ' ')
        .split(/\s/)
        .filter((s) => s);

      chunks.pop();

      const fromCh =
        chunks.map((s) => s.length).reduce((a, b) => a + b, 0) + chunks.length;

      addMarks(doc, { line, ch: fromCh }, { line, ch: toCh });
    } else if (range.origin === 'paste') {
      doc.eachLine(range.from.line, range.to.line + range.text.length, (line) =>
        parseLine(doc, line)
      );
    }

    StorageService.setValue(doc.getValue());
  });
};
