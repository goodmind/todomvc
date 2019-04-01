/* eslint-disable jsx-a11y/label-has-associated-control, jsx-a11y/label-has-for */

// @flow

import * as React from 'react';
import classNames from 'classnames';
import { TodoContext } from './todo';
import { useStore } from './effector-react';
import type { TodoModelType } from './model';

const { useContext, useState, useRef } = React;

type Props = { todoModel: TodoModelType }
// eslint-disable-next-line no-undef
type KeyboardEvent = SyntheticKeyboardEvent<HTMLInputElement>

export function TodoItem ({ todoModel }: Props) {
  const {
    $todo, toggleTodo, editTodo, trashTodo, filterTodo,
  } = todoModel;
  const todo = useStore($todo);
  const { $showTrashed, $filter } = useContext(TodoContext);
  const showTrashed = useStore($showTrashed);
  const [isEditing, setEditing] = useState(false);
  const inputRef = useRef();

  const itemClass = classNames({
    completed: todo.completed,
    editing: isEditing,
  });

  const trashClass = classNames({
    destroy: true,
    restore: showTrashed,
  });

  const handleEdit = () => {
    requestAnimationFrame(() => {
      if (inputRef.current) {
        inputRef.current.value = todo.title;
        inputRef.current.focus();
      }
    });
    setEditing(true);
  };

  const handleSubmit = () => {
    if (!isEditing || !inputRef.current) {
      return;
    }

    const value = inputRef.current.value.trim();

    if (value === '') {
      trashTodo();
    } else {
      editTodo(value);
      setEditing(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setEditing(false);
    }
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  const shouldShow = showTrashed ? todo.trashed : todo.visible && !todo.trashed;

  return (
    shouldShow && (
      <li className={itemClass}>
        <div className="view">
          <input
            className="toggle"
            type="checkbox"
            checked={todo.completed}
            onChange={() => {
              toggleTodo();
              filterTodo($filter.getState());
            }}
          />
          <label onDoubleClick={handleEdit}>{todo.title}</label>
          <button
            type="button"
            className={trashClass}
            onClick={() => trashTodo(!showTrashed)}
          />
        </div>
        <input
          ref={inputRef}
          className="edit"
          onBlur={handleSubmit}
          onKeyDown={handleKeyDown}
        />
      </li>
    )
  );
}
