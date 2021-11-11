import { Request, Router } from 'express';

import { Todo, TodoBody, TodoParams } from '../models/todos';

const TODOS: Array<Todo> = [];

const router = Router();

router.get('/', (req, res) => {
  res.status(200).json({ todos: TODOS });
});

router.post('/todo', (req: Request<{}, any, TodoBody>, res) => {
  const todoText = req.body.text;
  if (!todoText) {
    return res.status(422).json({ message: 'Missing todo text' });
  }
  const newTodo: Todo = { id: new Date().toISOString(), text: todoText };
  TODOS.push(newTodo);
  return res.status(201).json({ message: 'Successful', todo: newTodo, todos: TODOS });
});

router.put('/todo/:todoId', (req: Request<TodoParams, any, TodoBody>, res) => {
  const tid = req.params.todoId;
  const todoIndex = TODOS.findIndex((t) => t.id === tid);
  if (todoIndex === -1) {
    return res.status(404).json({ message: 'Could not find todo for this id' });
  }

  const updatedTodo: Todo = TODOS[todoIndex];
  updatedTodo.text = req.body.text;
  return res.status(200).json({ message: 'Successful', todo: updatedTodo, todos: TODOS });
});

router.delete('/todo/:todoId', (req: Request<TodoParams>, res) => {
  const tid = req.params.todoId;
  const todoIndex = TODOS.findIndex((t) => t.id === tid);
  if (todoIndex === -1) {
    return res.status(404).json({ message: 'Could not find todo for this id' });
  }

  const deletedTodo = TODOS.splice(todoIndex, 1)[0];
  return res.status(200).json({ message: 'Successful', todo: deletedTodo, todos: TODOS });
});

export default router;
