window.createEditor = async () => {
  const editor = CodeMirror(document.getElementById('editor'), {
    value: await StorageService.getValue(),
    mode: 'markdown',
    theme: 'idea',
    lineWrapping: true,
  });

  StorageService.onChange((text) => {
    editor.getDoc().setValue(text);
  });

  editor.on('change', () => {
    StorageService.setValue(editor.getDoc().getValue());
  });
};
