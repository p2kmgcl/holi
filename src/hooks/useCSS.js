const CSSContext = createContext();

export const CSSContextProvider = ({ children }) => {
  const [styleNode, setStyleNode] = useState(null);

  useLayoutEffect(() => {
    const node = document.createElement('style');
    document.head.appendChild(node);
    setStyleNode(node);

    return () => {
      document.head.removeChild(node);
      setStyleNode(null);
    };
  }, []);

  const context = useMemo(() => {
    if (!styleNode) {
      return {
        addCSS: () => {},
        removeCSS: () => {},
      };
    }

    const map = new Map();

    const updateStyles = () => {
      styleNode.innerHTML = Array.from(map.keys()).reduce(
        (a, b) => `${a}\n${b}`,
        ''
      );
    };

    return {
      addCSS: (css) => {
        const count = map.get(css) || 0;
        map.set(css, count + 1);

        if (count === 0) {
          updateStyles();
        }
      },

      removeCSS: (css) => {
        const count = map.get(css);

        if (count === 1) {
          updateStyles();
          map.delete(css);
        } else {
          map.set(css, count - 1);
        }
      },
    };
  }, [styleNode]);

  return styleNode
    ? html`
        <${CSSContext.Provider} value=${context}>
          ${children}
        <//>
      `
    : null;
};

export const useCSS = (css) => {
  const { addCSS, removeCSS } = useContext(CSSContext);

  useLayoutEffect(() => {
    addCSS(css);
    return () => removeCSS(css);
  }, [addCSS, removeCSS, css]);
};
