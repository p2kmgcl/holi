const editor = CodeMirror(document.getElementById('editor'), {
  value: localStorage.getItem('holi_editor') || '',
  mode: 'markdown',
  theme: 'idea',
  lineWrapping: false,
});

editor.on('change', () => {
  localStorage.setItem('holi_editor', editor.getDoc().getValue());
});
