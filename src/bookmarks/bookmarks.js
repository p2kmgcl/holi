const bookmarks = document.getElementById('bookmarks');

const renderChild = (child, depth = 0) => {
  if (child.title && depth > 0) {
    let node;

    if (child.url) {
      node = document.createElement('a');
      node.classList.add('link');
      node.href = child.url;

      node.innerHTML = `
        <img class="icon" src="chrome://favicon/${child.url}" alt="" />
        <span>${child.title}</span>
      `;
    } else {
      node = document.createElement(`h${depth}`);
      node.classList.add('heading');
      node.innerText = child.title;
    }

    bookmarks.appendChild(node);
  }

  if (child.children) {
    const grandChildDepth = Math.min(depth + 1, 6);

    child.children.map((grandChild) =>
      renderChild(grandChild, grandChildDepth)
    );
  }
};

window.createBookmarks = () => {
  chrome.bookmarks.getTree((children) => {
    children[0].children.map((child) => renderChild(child));
  });
};
