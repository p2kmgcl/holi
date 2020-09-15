export class RawDOM extends Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    const { className, children, elementRef, tagName, ...rest } = this.props;

    return html`<${tagName || 'div'}
      className=${className || ''}
      ref=${elementRef}
      ...${rest}
    >
      ${children}
    <//>`;
  }
}
