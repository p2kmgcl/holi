const parseLinks = (doc, { fromLine, toLine }) => {
  doc.eachLine(fromLine, toLine, (line) => {
    const lineNumber = doc.getLineNumber(line);

    if (line.text === '---') {
      const hrElement = document.createElement('hr');
      hrElement.classList.add('editor-inline-hr');

      doc.markText(
        { line: lineNumber, ch: 0 },
        { line: lineNumber, ch: 3 },
        {
          replacedWith: hrElement,
          inclusiveLeft: false,
          inclusiveRight: false,
        }
      );
    }

    line.text.replace(/https?:\/\/[^\s]+/gi, (url, index) => {
      const linkElement = document.createElement('a');

      linkElement.classList.add('editor-inline-link');
      linkElement.href = url;
      linkElement.innerText = url
        .replace(/^https:\/\/issues\.liferay\.com\/browse\//i, '')
        .replace(/^https:\/\/github\.com\//i, '')
        .replace(/^https?:\/\//i, '');

      doc.markText(
        { line: lineNumber, ch: index },
        { line: lineNumber, ch: index + url.length },
        {
          replacedWith: linkElement,
          inclusiveLeft: false,
          inclusiveRight: false,
        }
      );

      return url;
    });
  });
};

window.createEditor = async () => {
  const editor = CodeMirror(document.getElementById('editor'), {
    value: await StorageService.getValue(),
    mode: 'markdown',
    theme: 'idea',
    lineWrapping: true,
  });

  const doc = editor.getDoc();
  parseLinks(doc, { fromLine: 0, toLine: doc.lastLine() + 1 });

  StorageService.onChange((text) => {
    doc.setValue(text);
  });

  editor.on('change', (_, range) => {
    parseLinks(doc, {
      fromLine: range.from.line - 1,
      toLine: range.to.line + 1,
    });

    StorageService.setValue(doc.getValue());
  });
};
