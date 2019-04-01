// @flow

import React from "react";
import { Todo, TodoContext, TodoListModel } from "../todo";

const todoListModel = TodoListModel();

export function App() {
	return (
		<TodoContext.Provider value={todoListModel}>
			<Todo />
		</TodoContext.Provider>
	);
}
