import { BaseEditorElement } from './BaseEditorElement.js';
import { FetchService } from '../services/FetchService.js';

const CLOSED_EMOJI = '🎉';
const OPEN_EMOJI = '🔮';
const PROGRESS_EMOJI = '🏃️';
const REVIEW_EMOJI = '🔎';
const UNKNOWN_EMOJI = '🤷‍♀️';

const STATUSES_TO_EMOJI = {
  'Awaiting PM Review': REVIEW_EMOJI,
  Closed: CLOSED_EMOJI,
  'In Development': PROGRESS_EMOJI,
  'In Progress': PROGRESS_EMOJI,
  'Needs More Information': OPEN_EMOJI,
  Open: OPEN_EMOJI,
  Resolved: CLOSED_EMOJI,
  Verified: OPEN_EMOJI,

  Unknown: UNKNOWN_EMOJI,
};

export class JiraIssueEditorElement extends BaseEditorElement {
  static name = 'jira-issue';
  static regexp = /^https:\/\/issues\.liferay\.com\/browse\/([A-Z]+-[0-9]+)/i;

  static getElement(url, getMark) {
    const anchor = document.createElement('a');
    const [, issueId] = JiraIssueEditorElement.regexp.exec(url);

    anchor.href = url;
    anchor.innerText = issueId;

    FetchService.getCachedJSON(
      `https://cors-anywhere.herokuapp.com/https://issues.liferay.com/rest/api/latest/issue/${issueId}`
    ).then((issue) => {
      anchor.classList.toggle(
        'editor-element_jira-issue--closed',
        STATUSES_TO_EMOJI[issue.fields.status.name] === CLOSED_EMOJI
      );

      const statusEmoji =
        STATUSES_TO_EMOJI[issue.fields.status.name] ||
        STATUSES_TO_EMOJI.Unknown;

      const status = JiraIssueEditorElement.getEditorTooltipHTMLElement(
        statusEmoji,
        `${statusEmoji} ${issue.fields.status.name}\n🦹 ${issue.fields.creator.displayName}\n💃 ${issue.fields.assignee.displayName}`
      );

      const label = document.createElement('span');
      label.innerText = issueId;

      anchor.innerHTML = '';
      anchor.appendChild(status);
      anchor.appendChild(label);

      getMark().changed();
    });

    return anchor;
  }
}
