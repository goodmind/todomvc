// @flow

import * as React from 'react';
import { TodoContext } from './todo';
import { useStore } from './effector-react';

const { useContext } = React;

const pluralize = (count, word) => (count === 1 ? word : `${word}s`);

export function TodoCount () {
  const { $activeCount } = useContext(TodoContext);
  const activeCount = useStore($activeCount);
  const activeCountWord = pluralize(activeCount, 'item');

  return (
    <span className="todo-count">
      <strong>{activeCount}</strong>
      <span>{' '}</span>
      <span>{activeCountWord}</span>
      <span> left</span>
    </span>
  );
}
