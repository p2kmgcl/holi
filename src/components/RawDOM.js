export class RawDOM extends preact.Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    const { className, children, elementRef, tagName, ...rest } = this.props;

    return html`<${tagName || 'div'}
      class=${className || ''}
      ref=${elementRef}
      ...${rest}
    >
      ${children}
    <//>`;
  }
}
