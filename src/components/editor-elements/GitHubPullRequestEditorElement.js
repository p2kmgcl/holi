import { FetchService } from '../../services/FetchService.js';
import { EditorLink } from '../editor/EditorLink.js';
import { EditorTooltip } from '../editor/EditorTooltip.js';

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

export const GitHubPullRequestEditorElement = ({ matches, text: url }) => {
  const [owner, repo, pullNumber] = matches;
  const label = `${owner}/${repo}/pull/${pullNumber}`;
  const [closed, setClosed] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    FetchService.getCachedJSON(
      `https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}`
    )
      .then((pullRequest) => {
        setClosed(pullRequest.state === 'closed');
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

        if (status !== STATUSES.unknown) {
          setStatus({
            label: STATUS_TO_EMOJI[status],
            tooltip: Object.entries(mergedStatuses)
              .map(([context, value]) => `${STATUS_TO_EMOJI[value]} ${context}`)
              .join('\n'),
          });
        }
      });
  }, [pullNumber, owner, repo]);

  return html`<${EditorLink} closed=${closed}>
    ${status &&
    html`<${EditorTooltip} label=${status.label} tooltip=${status.tooltip} />`}
    ${label}
  <//>`;
};

GitHubPullRequestEditorElement.regexp = /^https:\/\/github\.com\/([a-z0-9\-_]+)\/([a-z0-9\-_]+)\/pull\/([0-9]+)\/?/i;
