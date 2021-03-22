import { FetchService } from '../services/FetchService.js';

const template = `
  <h1></h1>
  <ul class="pr-list"></ul>
  <ul class="issue-list"></ul>
`;

const prTemplate = `
  <a class="editor-link" href=""></a>
  <ul class="label-list"></ul>
  <ul class="person-list"></ul>
`;

const personTemplate = `
  <a class="editor-tooltip editor-tooltip--left" href="">
    <img src="" alt="" />
  </a>
`;

const issueTemplate = `
  <li><a class="editor-link" href=""></a>
`;

export const GitHubRepoEditorElement = ({ matches, onRender }) => {
  const [owner, repo] = matches;

  const wrapper = document.createElement('div');
  wrapper.innerHTML = template;
  wrapper.querySelector('h1').innerHTML =
    `<a href="https://github.com/${owner}/${repo}"># ${owner}/${repo}</a>`;

  const prList = wrapper.querySelector('.pr-list');
  const issueList = wrapper.querySelector('.issue-list');

  FetchService.getCachedJSON(
    `https://api.github.com/repos/${owner}/${repo}/pulls`
  ).then((pullRequests) => {
    pullRequests.forEach((pullRequest) => {
      const prElement = document.createElement('li');
      prElement.classList.add('pr');
      prElement.innerHTML = prTemplate;

      const labelList = prElement.querySelector('.label-list');
      const personList = prElement.querySelector('.person-list');

      const people = [
        pullRequest.user,
        pullRequest.assignee,
        ...pullRequest.assignees,
      ];

      people
        .filter((person) => person)
        .filter(
          (person, index) =>
            index ===
            people.findIndex((_person) => _person?.login === person?.login)
        )
        .forEach((person) => {
          const personElement = document.createElement('li');
          personElement.innerHTML = personTemplate;

          const link = personElement.querySelector('a');
          const img = personElement.querySelector('img');

          link.href = person.html_url;
          link.dataset.tooltip = person.login;
          img.src = person.avatar_url;
          img.alt = person.login;

          personList.appendChild(personElement);
        });

      pullRequest.labels.forEach((label) => {
        const listItem = document.createElement('li');
        listItem.classList.add('editor-tooltip');
        listItem.classList.add('editor-tooltip--left');
        listItem.dataset.tooltip = label.name;

        const labelElement = document.createElement('span');
        labelElement.classList.add('label');
        labelElement.style.backgroundColor = `#${label.color}`;
        labelElement.style.color = invertColor(`#${label.color}`);
        labelElement.innerText = label.name;

        listItem.appendChild(labelElement);
        labelList.appendChild(listItem);
      });

      const prLink = prElement.querySelector('.editor-link');
      prLink.href = pullRequest.html_url;
      prLink.innerText = `#${pullRequest.number} ${pullRequest.title}`;

      prList.appendChild(prElement);
    });

    onRender();
  });

  FetchService.getCachedJSON(
    `https://api.github.com/repos/${owner}/${repo}/issues`
  ).then((issues) => {
    issues
      .filter((issue) => !issue.pull_request?.url)
      .forEach((issue) => {
        const issueElement = document.createElement('li');
        issueElement.classList.add('issue');
        issueElement.innerHTML = prTemplate;

        const issueLink = issueElement.querySelector('.editor-link');
        issueLink.href = issue.html_url;
        issueLink.innerText = `#${issue.number} ${issue.title}`;

        issueList.appendChild(issueElement);
      });

    onRender();
  });

  return wrapper;
};

GitHubRepoEditorElement.regexp = /^https:\/\/github\.com\/([a-z0-9\-_]+)\/([a-z0-9\-_]+)\/?$/i;

function invertColor(hex) {
  if (hex.indexOf('#') === 0) {
    hex = hex.slice(1);
  }
  // convert 3-digit hex to 6-digits.
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length !== 6) {
    throw new Error('Invalid HEX color.');
  }
  // invert color components
  var r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
    g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
    b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
  // pad each with zeros and return
  return '#' + padZero(r) + padZero(g) + padZero(b);
}

function padZero(str, len) {
  len = len || 2;
  var zeros = new Array(len).join('0');
  return (zeros + str).slice(-len);
}
