// @flow

import {
  createEvent,
  createStore,
  createApi,
  restoreEvent,
} from 'effector';

import type { Store, Event } from 'effector';

import {
  createTodo,
  completeTodo,
  toggleTodo,
  editTodo,
  filterTodo,
  applyFilter,
  isActiveTodo,
  isCompletedTodo,
  isTrashedTodo,
  addTodo,
  trashTodo,
  deleteTrashed,
  trashCompleted,
  toggleAll,
  FILTERS,
} from './todo-api';

import { createStoreMap } from './effector-collections';
import type { Todo, Filter } from './todo-api';

type TodoModelConfig = {
  todo?: Todo,
  title?: string,
  completed?: boolean
};

type TodoApi = {|
  toggleTodo: Event<void>,
  completeTodo: Event<boolean>,
  editTodo: Event<string>,
  filterTodo: Event<Filter>,
  trashTodo: Event<boolean | void>
|};

export function TodoModel (config: TodoModelConfig = {}) {
  const { todo, title, completed } = config;
  const $todo: Store<Todo> = createStore(todo || createTodo(title, completed));

  const todoApi: TodoApi = createApi($todo, {
    toggleTodo,
    completeTodo,
    editTodo,
    filterTodo,
    trashTodo,
  });

  return { $todo, ...todoApi };
}

// eslint-disable-next-line no-undef
export type TodoModelType = $Call<typeof TodoModel>

const getDefaultTodos = () => [
  createTodo('React'),
  createTodo('Context', true),
  createTodo('Effector'),
  createTodo('Model', true),
  createTodo('Hooks'),
];

type TodosApi = {|
  addTodo: Event<string>,
  deleteTrashed: Event<void>,
  toggleAll: Event<boolean>,
  applyFilter: Event<Filter>,
  trashCompleted: Event<boolean>,
|}

export function TodoListModel () {
  const $todos = createStore(getDefaultTodos());

  const $todoList: Store<Map<string, TodoModelType>> = createStoreMap($todos, {
    getKey: (todo: Todo) => todo.id,
    createValue: (todo: Todo) => TodoModel({ todo }),
    getStore: (value: TodoModelType) => value.$todo,
    fullSync: false,
  });

  const todosApi: TodosApi = createApi($todos, {
    addTodo,
    deleteTrashed,
    toggleAll,
    applyFilter,
    trashCompleted,
  });

  const $filter: Store<Filter> = restoreEvent(todosApi.applyFilter, FILTERS.ALL);

  const $activeCount: Store<number> = $todos.map(
    todos => todos.filter(isActiveTodo).length,
  );
  const $anyCompleted: Store<boolean> = $todos.map(
    todos => todos.filter(isCompletedTodo).length > 0,
  );
  const $anyTrashed: Store<boolean> = $todos.map(
    todos => todos.filter(isTrashedTodo).length > 0,
  );
  const toggleTrashed: Event<void> = createEvent('toggle trashed');
  const $showTrashed: Store<boolean> = createStore(false);
  $showTrashed.on(toggleTrashed, state => !state);
  $showTrashed.on($anyTrashed, (state, anyTrashed) => (!anyTrashed ? false : state));

  return {
    ...todosApi,
    $todoList,
    $activeCount,
    $anyCompleted,
    $anyTrashed,
    $filter,
    FILTERS,
    $showTrashed,
    toggleTrashed,
  };
}

// eslint-disable-next-line no-undef
export type TodoListModelType = $Call<typeof TodoListModel>
