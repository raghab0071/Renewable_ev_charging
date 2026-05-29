import React, { useEffect, useState } from "react";
import Routes from "./Routes";
import { supabase } from "./utils/supabase";

function App() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    async function getTodos() {
      const { data, error } = await supabase.from("todos").select();

      if (error) {
        console.error("Supabase fetch error:", error);
        return;
      }

      if (data) {
        setTodos(data);
      }
    }

    getTodos();
  }, []);

  return (
    <>
      {todos.length > 0 && (
        <section className="p-4 bg-slate-50">
          <h2 className="text-xl font-semibold mb-2">Todos</h2>
          <ul className="list-disc ml-5">
            {todos.map((todo) => (
              <li key={todo.id}>{todo.name ?? todo.title ?? JSON.stringify(todo)}</li>
            ))}
          </ul>
        </section>
      )}
      <Routes />
    </>
  );
}

export default App;
