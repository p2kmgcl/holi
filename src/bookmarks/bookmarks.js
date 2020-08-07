const bookmarks = document.getElementById('bookmarks');

const renderChild = (child, wrapper, depth = 0) => {
  if (child.title && depth > 0) {
    let node;

    if (child.url) {
      node = document.createElement('a');
      node.classList.add('link');
      node.href = child.url;

      node.innerHTML = `
        <img class="link-icon" src="chrome://favicon/${child.url}" alt="" />
        <span class="link-content">${child.title}</span>
      `;
    } else {
      node = document.createElement(`h${depth}`);
      node.classList.add('heading');
      node.innerText = child.title;
    }

    wrapper.appendChild(node);
  }

  if (child.children) {
    const grandChildDepth = Math.min(depth + 1, 6);

    child.children.map((grandChild) =>
      renderChild(grandChild, wrapper, grandChildDepth)
    );
  }
};

window.createBookmarks = () =>
  new Promise((resolve) => {
    const wrapper = document.createElement('div');
    wrapper.classList.add('bookmarks-wrapper')

    chrome.bookmarks.getTree((children) => {
      children[0].children.map((child) => renderChild(child, wrapper));

      requestAnimationFrame(() => {
        bookmarks.appendChild(wrapper);

        requestAnimationFrame(() => {
          resolve();
        });
      });
    });
  });
