import { StorageService } from '../services/StorageService.js';

export const useStorage = (key, defaultValue) => {
  const [localValue, setLocalValue] = useReducer(
    (value, nextValue) => (value === nextValue ? value : nextValue),
    defaultValue
  );

  useEffect(() => {
    StorageService.get(key).then((initialValue) => {
      if (typeof initialValue !== 'undefined') {
        setLocalValue(initialValue);
      }
    });

    const removeListener = StorageService.onChange(key, (updatedValue) => {
      setLocalValue(updatedValue);
    });

    return () => {
      removeListener();
    };
  }, [key]);

  const updateValue = useCallback(
    (nextValue) => {
      StorageService.set(key, nextValue);
      setLocalValue(nextValue);
    },
    [key]
  );

  return [localValue, updateValue];
};
