// @flow

import { createMapper, type Mapper } from './effector-collections';

const createId = (): string => `id-${Math.random().toString(36).substring(2, 10)}`;

export type Todo = {
  id: string,
  title: string,
  completed: boolean,
  visible: boolean,
  trashed: boolean,
};

export type Todos = Array<Todo>;

export const createTodo = (
  title: string = 'untitled',
  completed: boolean = false,
): Todo => ({
  id: createId(),
  title,
  completed,
  visible: true,
  trashed: false,
});

export const isActiveTodo = (todo: Todo): boolean => !todo.completed && !todo.trashed;
export const isCompletedTodo = (todo: Todo): boolean => todo.completed && !todo.trashed;
export const isTrashedTodo = (todo: Todo): boolean => todo.trashed;
export const isNotTrashedTodo = (todo: Todo): boolean => !todo.trashed;

export const completeTodo = (todo: Todo, completed: boolean = true): Todo => (
  todo.completed !== completed ? { ...todo, completed } : todo
);

export const toggleTodo = (todo: Todo): Todo => (
  { ...todo, completed: !todo.completed }
);

export const editTodo = (todo: Todo, title: string): Todo => (
  todo.title !== title ? { ...todo, title } : todo
);

export const trashTodo = (todo: Todo, trashed: boolean = true): Todo => (
  todo.trashed !== trashed ? { ...todo, trashed, visible: !trashed } : todo
);

const ALL: 'all' = 'all';
const ACTIVE: 'active' = 'active';
const COMPLETED: 'completed' = 'completed';
export const FILTERS = { ALL, ACTIVE, COMPLETED };
// eslint-disable-next-line no-undef
export type Filter = $Values<typeof FILTERS>;

export const filterTodo = (todo: Todo, filter: Filter): Todo => {
  const visible = {
    [ALL]: true,
    [ACTIVE]: !todo.completed,
    [COMPLETED]: Boolean(todo.completed),
  }[filter];

  return visible !== undefined && todo.visible !== visible
    ? { ...todo, visible }
    : todo;
};

export const addTodo = (todos: Todos, title: string): Todos => todos.concat(createTodo(title));

export const deleteTrashed = (todos: Todos): Todos => todos.filter(isNotTrashedTodo);

export const applyFilter: Mapper<Todos, Filter> = createMapper(filterTodo);
export const trashCompleted: Mapper<Todos, boolean> = createMapper(todo => (
  todo.completed ? trashTodo(todo, true) : todo
));
export const toggleAll: Mapper<Todos, boolean> = createMapper(completeTodo);
