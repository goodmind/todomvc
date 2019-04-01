// @flow

import { useState, useEffect } from 'react';
import type { Store } from 'effector';

// eslint-disable-next-line arrow-parens
export const useStore = <T>(store: Store<T>): T => {
  const [state, setState] = useState(store.getState);

  useEffect(() => store.watch(setState), [store]);

  return state;
};
