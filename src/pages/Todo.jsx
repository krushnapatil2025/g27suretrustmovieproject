import React from "react";
import { useState, useEffect } from "react";
const API_URL = "http://localhost:4005"; //base url for the API
const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [editingTodo, setEditingTodo] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  //api to fetch all todos
  const fetchTodos = async () => {
    try {
      const response = await fetch(`${API_URL}/all/todos`);
      const data = await response.json();
      console.log("Fetched todos:", data);
      setTodos(data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const addTodo = async () => {
    if (!title.trim()) {
      alert("Please enter a todo title");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });
      fetchTodos(); // Refresh the todo list after adding a new todo
      setTitle("");
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await fetch(`${API_URL}/todos/${id}`, {
        method: "DELETE",
      });
      setTodos(todos.filter((todo) => todo.id !== id));
      console.log("Todo deleted successfully");
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };
  //api to update the title of a todo
  const updateTitle = async () => {
    if (!editingTitle.trim()) {
      alert("Please enter a todo title");
      return;
    }
    const apiUrl = `${API_URL}/todos/${editingTodo.id}`;

    try {
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: editingTitle }),
      });
      setEditingTodo(null); // Clear the editing state
      setEditingTitle(""); // Clear the editing title input
      fetchTodos(); // Refresh the todo list after updating
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };
  useEffect(
    () => {
      fetchTodos();
    },
    [] // to run only once when the component mounts
  );
  return (
    <>
      <div>
        <h1>Todo List</h1>

        <input
          className="border border-gray-300 p-2 rounded"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <button
          onClick={addTodo}
          className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
        >
          Add Todo
        </button>

        {todos.length === 0 ? (
          <>No Tasks Found</>
        ) : (
          <>
            {todos.map((todo) => (
              <div key={todo.id}>
                {editingTodo?.id === todo.id ? (
                  <>
                    <input
                      className="border border-gray-300 p-2 rounded"
                      type="text"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                    />
                    <button
                    className="bg-amber-500 text-white px-4 py-2 rounded ml-2"
                    onClick={updateTitle}>Save</button>
                    <button
                    onClick={() => {
                      setEditingTodo(null);
                      setEditingTitle("");
                    }}
                    className="bg-red-500 text-white px-4 py-2 rounded ml-2"
                    >Cancel</button>
                  </>
                ) : (
                  <>
                  <div
                    className="flex items-center justify-between border-b border-gray-200 py-2">

              
                    {todo.title}
                    <button
                      onClick={() => {
                        setEditingTodo(todo);
                        setEditingTitle(todo.title);
                      }}
                      className="bg-green-500 text-white px-4 py-2 rounded ml-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded ml-2"
                    >
                      Delete
                    </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
};

export default Todo;