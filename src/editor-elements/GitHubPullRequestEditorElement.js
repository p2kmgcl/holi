import { FetchService } from '../services/FetchService.js';

const STATUSES = {
  unknown: 'unknown',
  success: 'success',
  failure: 'failure',
  pending: 'pending',
};

const STATUS_TO_EMOJI = {
  [STATUSES.success]: '🎉',
  [STATUSES.failure]: '💀',
  [STATUSES.pending]: '🏃',
};

export const GitHubPullRequestEditorElement = ({
  matches,
  text: url,
  onRender,
}) => {
  const [owner, repo, pullNumber] = matches;
  const label = `${owner}/${repo}/pull/${pullNumber}`;

  const link = document.createElement('a');
  link.classList.add('editor-link');
  link.href = url;

  const tooltip = document.createElement('span');
  tooltip.classList.add('editor-tooltip');

  const content = document.createElement('span');
  content.innerText = label;

  link.appendChild(content);

  FetchService.getCachedJSON(
    `https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}`
  )
    .then((pullRequest) => {
      link.classList.toggle(
        'editor-link--closed',
        pullRequest.state === 'closed'
      );

      onRender();
      return FetchService.getCachedJSON(pullRequest.statuses_url);
    })
    .then((statuses) => {
      const mergedStatuses = {};
      let status = STATUSES.unknown;

      statuses
        .sort(
          (a, b) =>
            new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime()
        )
        .forEach((status) => {
          mergedStatuses[status.context] = status.state;
        });

      const mergedStatusesValues = Object.values(mergedStatuses);

      if (mergedStatusesValues.includes(STATUSES.failure)) {
        status = STATUSES.failure;
      } else if (mergedStatusesValues.includes(STATUSES.pending)) {
        status = STATUSES.pending;
      } else if (mergedStatusesValues.includes(STATUSES.success)) {
        status = STATUSES.success;
      }

      if (status !== STATUSES.unknown) {
        tooltip.innerText = STATUS_TO_EMOJI[status];
        tooltip.dataset.tooltip = Object.entries(mergedStatuses)
          .map(([context, value]) => `${STATUS_TO_EMOJI[value]} ${context}`)
          .join('\n');

        link.insertBefore(tooltip, content);
      }

      onRender();
    });

  return link;
};

GitHubPullRequestEditorElement.regexp =
  /^https:\/\/github\.com\/([a-z0-9\-_]+)\/([a-z0-9\-_]+)\/pull\/([0-9]+)\/?/i;
