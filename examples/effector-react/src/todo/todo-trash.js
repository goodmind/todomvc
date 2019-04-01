/* eslint-disable jsx-a11y/accessible-emoji */

// @flow

import * as React from 'react';
import { TodoContext } from './todo';
import { useStore } from './effector-react';

const { useContext } = React;

export function TodoTrash () {
  const {
    $showTrashed,
    $anyTrashed,
    $anyCompleted,
    trashCompleted,
    toggleTrashed,
    deleteTrashed,
  } = useContext(TodoContext);

  const showTrashed = useStore($showTrashed);
  const anyTrashed = useStore($anyTrashed);
  const anyCompleted = useStore($anyCompleted);

  return showTrashed ? (
    <div className="trash-bar">
      <button type="button" onClick={toggleTrashed}>📄</button>
      <button type="button" onClick={deleteTrashed}>❌</button>
    </div>
  ) : (
    <div className="trash-bar">
      {anyTrashed && <button type="button" onClick={toggleTrashed}>🗑️</button>}
      {anyCompleted && <button type="button" onClick={trashCompleted}>🆗</button>}
    </div>
  );
}
