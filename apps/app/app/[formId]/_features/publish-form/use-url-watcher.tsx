import { useQueryState } from 'nuqs';
import { useEffect, useState } from 'react';

export function useUrlWatcher() {
  const [form] = useQueryState('form');
  const [changed, setChanged] = useState(false);
  const [originalState, setOriginalState] = useState(form);

  useEffect(() => {
    if (form !== originalState) {
      setChanged(true);
    } else {
      setChanged(false);
    }
  }, [form, originalState]);

  function reset() {
    setChanged(false);
    setOriginalState(form);
  }

  return { changed, reset };
}
