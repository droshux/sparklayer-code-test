import React, { useEffect, useState } from 'react';
import './App.css';
import Todo, { TodoType } from './Todo';

function App() {
  const [todos, setTodos] = useState<TodoType[]>([]);

  const fetchTodos = async () => {
    try {
      const todos = await fetch('http://localhost:8080/');
      if (todos.status !== 200) {
        console.log('Error fetching data');
        return;
      }

      setTodos(await todos.json());
    } catch (e) {
      console.log('Could not connect to server. Ensure it is running. ' + e);
    }
  }
  // Initially fetch todo
  useEffect(() => { fetchTodos() }, []);

  // Use form to upload todo
  const submit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault() // Avoid reloading page

    // Get form contents
    const f = new FormData(event.currentTarget)
    const title = f.get("title")?.toString()
    const description = f.get("description")?.toString()
    if (title === undefined || description === undefined) return

    // Post the form
    const new_todo: TodoType = { title, description }
    await fetch('http://localhost:8080/', {
      method: "POST",
      body: JSON.stringify(new_todo),
      mode: "cors",
      headers: { "Content-Type": "application/json" }
    }).then(
      // Handle response
      res => res.status === 400
        ? console.error("Invalid Input")
        : fetchTodos()
    )
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>TODO</h1>
      </header>

      <div className="todo-list">
        {todos.map((todo) =>
          <Todo
            key={todo.title + todo.description}
            title={todo.title}
            description={todo.description}
          />
        )}
      </div>

      <h2>Add a Todo</h2>
      <form onSubmit={submit}>
        <input placeholder="Title" name="title" autoFocus={true} />
        <input placeholder="Description" name="description" />
        <button>Add Todo</button>
      </form>
    </div>
  );
}

export default App;
