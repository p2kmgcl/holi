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
      .then((pullRequest) =>
        FetchService.getCachedJSON(pullRequest.statuses_url)
      )
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

        Object.values(mergedStatuses).forEach((mergedStatusValue) => {
          if (
            status === STATUSES.failure ||
            mergedStatusValue === STATUSES.failure
          ) {
            status = STATUSES.failure;
            return;
          }

          if (
            status === STATUSES.pending ||
            mergedStatusValue === STATUSES.pending
          ) {
            status = STATUSES.pending;
            return;
          }

          if (mergedStatusValue === STATUSES.success) {
            status = STATUSES.success;
          }
        });

        anchor.innerHTML = `
          ${
            status === STATUSES.unknown
              ? ''
              : `<span class="status-description" data-status-description="${Object.entries(
                  mergedStatuses
                )
                  .map(
                    ([context, value]) => `${STATUS_TO_EMOJI[value]} ${context}`
                  )
                  .join('\n')}">${STATUS_TO_EMOJI[status]}</span>`
          }
          ${label}
        `;

        getMark().changed();
      });

    return anchor;
  }
}
