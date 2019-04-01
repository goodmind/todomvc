// @flow

import * as React from 'react';
import { TodoContext } from './todo';
import { useStore } from './effector-react';
import { TodoItem } from './todo-item';

const { useContext } = React;

export function TodoList () {
  const { $todoList } = useContext(TodoContext);
  const todoList = useStore($todoList);

  return (
    <ul className="todo-list">
      {Array.from(todoList).map(([id, todoModel]) => (
        <TodoItem key={id} todoModel={todoModel} />
      ))}
    </ul>
  );
}
