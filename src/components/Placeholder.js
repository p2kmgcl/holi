export const Placeholder = ({ children, width = 'auto', height }) => {
  const [element, setElement] = useState(null);
  const [visible, setVisible] = useState(false);

  useLayoutEffect(() => {
    if (element) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setVisible(entry?.isIntersecting ?? false);
        },
        { threshold: 0.1 }
      );

      observer.observe(element);
      return () => observer.disconnect();
    }
  }, [element]);

  const style = {
    display: 'inline-block',
    minHeight: height,
    width: width,
  };

  return html`
    <div ref=${setElement} style=${style}>
      ${visible ? children : null}
    </div>
  `;
};
