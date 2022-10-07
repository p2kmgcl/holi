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
  'In Review': REVIEW_EMOJI,
  'Needs More Information': OPEN_EMOJI,
  Open: OPEN_EMOJI,
  Resolved: CLOSED_EMOJI,
  Verified: OPEN_EMOJI,

  Unknown: UNKNOWN_EMOJI,
};

export const JiraIssueEditorElement = ({ text: url, matches, onRender }) => {
  const [issueId] = matches;

  const link = document.createElement('a');
  link.classList.add('editor-link');
  link.href = url;

  const tooltip = document.createElement('span');
  tooltip.classList.add('editor-tooltip');

  const content = document.createElement('span');
  content.innerText = issueId;

  link.appendChild(content);

  /*
  FetchService.getCachedJSON(
    `https://cors-anywhere.herokuapp.com/https://issues.liferay.com/rest/api/latest/issue/${issueId}`
  ).then((issue) => {
    const statusEmoji =
      STATUSES_TO_EMOJI[issue.fields.status.name] || STATUSES_TO_EMOJI.Unknown;

    link.classList.toggle('editor-link--closed', statusEmoji === CLOSED_EMOJI);
    tooltip.innerText = statusEmoji;
    tooltip.dataset.tooltip = `${statusEmoji} ${issue.fields.status.name}\n🦹 ${issue.fields.creator.displayName}\n💃 ${issue.fields.assignee.displayName}`;

    link.insertBefore(tooltip, content);

    onRender();
  });
  */

  return link;
};

JiraIssueEditorElement.regexp =
  /^https:\/\/issues\.liferay\.com\/browse\/([A-Z]+-[0-9]+)/i;
