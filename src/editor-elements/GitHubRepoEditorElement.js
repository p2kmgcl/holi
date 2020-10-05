import { FetchService } from '../services/FetchService.js';

export const GitHubRepoEditorElement = ({ matches, onRender }) => {
  const [owner, repo] = matches;

  const wrapper = document.createElement('div');

  const title = document.createElement('h1');
  title.innerText = `# ${owner}/${repo}`;
  wrapper.appendChild(title);

  const prList = document.createElement('ul');
  wrapper.appendChild(prList);

  const issueList = document.createElement('ul');
  wrapper.appendChild(issueList);

  FetchService.getCachedJSON(
    `https://api.github.com/repos/${owner}/${repo}/pulls`
  ).then((pullRequests) => {
    pullRequests.forEach((pullRequest) => {
      const listItem = document.createElement('li');

      const link = document.createElement('a');
      link.classList.add('editor-link');
      link.href = pullRequest.html_url;
      link.innerText = `#${pullRequest.number} ${pullRequest.title}`;

      listItem.appendChild(link);
      prList.appendChild(listItem);
    });

    onRender();
  });

  FetchService.getCachedJSON(
    `https://api.github.com/repos/${owner}/${repo}/issues`
  ).then((issues) => {
    issues
      .filter((issue) => !issue.pull_request?.url)
      .forEach((issue) => {
        const listItem = document.createElement('li');

        const link = document.createElement('a');
        link.classList.add('editor-link');
        link.href = issue.html_url;
        link.innerText = `#${issue.number} ${issue.title}`;

        listItem.appendChild(link);
        issueList.appendChild(listItem);
      });

    onRender();
  });

  return wrapper;
};

GitHubRepoEditorElement.regexp = /^https:\/\/github\.com\/([a-z0-9\-_]+)\/([a-z0-9\-_]+)\/?/i;
