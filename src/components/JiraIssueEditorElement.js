import { FetchService } from '../services/FetchService.js';
import { EditorTooltip } from './EditorTooltip.js';
import { EditorLink } from './EditorLink.js';

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

export const JiraIssueEditorElement = ({ text: url, marker, matches }) => {
  const [issueId] = matches;
  const [status, setStatus] = useState(null);

  useEffect(() => {
    FetchService.getCachedJSON(
      `https://cors-anywhere.herokuapp.com/https://issues.liferay.com/rest/api/latest/issue/${issueId}`
    ).then((issue) => {
      const statusEmoji =
        STATUSES_TO_EMOJI[issue.fields.status.name] ||
        STATUSES_TO_EMOJI.Unknown;

      setStatus({
        closed: statusEmoji === CLOSED_EMOJI,
        label: statusEmoji,
        tooltip: `${statusEmoji} ${issue.fields.status.name}\n🦹 ${issue.fields.creator.displayName}\n💃 ${issue.fields.assignee.displayName}`,
      });
    });
  }, [issueId]);

  return html`<${EditorLink} closed=${status?.closed} href=${url}>
    ${status &&
    html`
      <${EditorTooltip} label=${status.label} tooltip=${status.tooltip} />
    `}
    ${issueId}
  <//>`;
};

JiraIssueEditorElement.regexp = /^https:\/\/issues\.liferay\.com\/browse\/([A-Z]+-[0-9]+)/i;
