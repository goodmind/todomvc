/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */

// @flow

import * as React from 'react';
import classNames from 'classnames';
import { TodoContext } from './todo';
import { useStore } from './effector-react';

const { useContext } = React;

export function TodoFilters () {
  const {
    $filter, applyFilter, FILTERS, $showTrashed,
  } = useContext(TodoContext);
  const filter = useStore($filter);
  const showTrashed = useStore($showTrashed);

  const { ALL, ACTIVE, COMPLETED } = FILTERS;

  const allClass = classNames({
    selected: filter === ALL,
  });
  const activeClass = classNames({
    selected: filter === ACTIVE,
  });
  const completedClass = classNames({
    selected: filter === COMPLETED,
  });

  return (
    !showTrashed && (
      <ul className="filters">
        <li>
          <a className={allClass} onClick={() => applyFilter(ALL)}>
            All
          </a>
        </li>
        <span>{' '}</span>
        <li>
          <a className={activeClass} onClick={() => applyFilter(ACTIVE)}>
            Active
          </a>
        </li>
        <li>
          <a className={completedClass} onClick={() => applyFilter(COMPLETED)}>
            Completed
          </a>
        </li>
      </ul>
    )
  );
}
