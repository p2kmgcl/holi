import { BaseEditorElement } from './BaseEditorElement.js';
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

export class GitHubPullRequestEditorElement extends BaseEditorElement {
  static name = 'github-pull-request';
  static regexp = /^https:\/\/github\.com\/([a-z0-9\-_]+)\/([a-z0-9\-_]+)\/pull\/([0-9]+)\/?/i;

  static getElement(text, getMark) {
    const anchor = document.createElement('a');
    const [
      ,
      owner,
      repo,
      pullNumber,
    ] = GitHubPullRequestEditorElement.regexp.exec(text);

    const label = `${owner}/${repo}/pull/${pullNumber}`;

    anchor.href = text;
    anchor.innerText = label;

    FetchService.getCachedJSON(
      `https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}`
    )
      .then((pullRequest) => {
        anchor.classList.toggle(
          'editor-element_github-pull-request--closed',
          pullRequest.state === 'closed'
        );

        return FetchService.getCachedJSON(pullRequest.statuses_url);
      })
      .then((statuses) => {
        const mergedStatuses = {};
        let status = STATUSES.unknown;

        statuses
          .sort(
            (a, b) =>
              new Date(a.updated_at).getTime() -
              new Date(b.updated_at).getTime()
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

        if (status === STATUSES.unknown) {
          anchor.innerText = label;
        } else {
          const statusDescription = GitHubPullRequestEditorElement.getEditorTooltipHTMLElement(
            STATUS_TO_EMOJI[status],
            Object.entries(mergedStatuses)
              .map(([context, value]) => `${STATUS_TO_EMOJI[value]} ${context}`)
              .join('\n')
          );

          const statusText = document.createElement('span');
          statusText.innerText = label;

          anchor.innerHTML = '';
          anchor.appendChild(statusDescription);
          anchor.appendChild(statusText);
        }

        getMark().changed();
      });

    return anchor;
  }
}
