/* eslint-disable react/require-default-props */
/* eslint-disable jsx-a11y/label-has-associated-control, jsx-a11y/label-has-for */

// @flow

import * as React from 'react';
import classNames from 'classnames';
import { TodoList } from './todo-list';
import { TodoCount } from './todo-count';
import { TodoFilters } from './todo-filters';
import { TodoTrash } from './todo-trash';
import type { TodoListModelType } from './model';

const { useContext, useCallback } = React;

// eslint-disable-next-line no-undef
type InputEvent = SyntheticInputEvent<HTMLInputElement>;
type KeyboardEvent = {
	key: string,
	target: HTMLInputElement,
	preventDefault(): void
};

// $FlowFixMe: Context may be undefined
export const TodoContext: React.Context<TodoListModelType> = React.createContext();

type Props = {
	className?: string
};

export function Todo(props: Props) {
	const { className } = props;
	const { addTodo, toggleAll } = useContext(TodoContext);

	const handleAdd = useCallback(
		(event: KeyboardEvent) => {
			if (event.key !== 'Enter') {
				return;
			}
			event.preventDefault();
			const input = event.target;
			if (input.value) {
				addTodo(input.value.trim());
				input.value = '';
			}
		},
		[addTodo]
	);

	const handleToggleAll = useCallback(
		(event: InputEvent) => {
			const checkbox = event.target;
			toggleAll(checkbox.checked);
		},
		[toggleAll]
	);

	return (
		<div>
			<header className="header">
				<h1>todos</h1>
				<input
					className="new-todo"
					placeholder="What needs to be done?"
					onKeyDown={handleAdd}
				/>
			</header>
			<section className="main">
				<input
					type="checkbox"
					className="toggle-all"
					id="toggle-all"
					onChange={handleToggleAll}
				/>
				<label htmlFor="toggle-all" />
				<TodoList />
			</section>
			<footer className="footer">
				<TodoCount />
				<TodoFilters />
				<TodoTrash />
			</footer>
		</div>
	);
}
