import "./App.css";
import "./css/index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useState, useEffect } from "react";

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [id, setId] = useState(0);

  // Load todos from localStorage
  // useEffect(() => {
  //   console.log("Saved todos:", localStorage.getItem("todos"));
  //   const savedTodos = localStorage.getItem("todos");
  //   if (savedTodos) {
  //     try {
  //       const parsedTodos = JSON.parse(savedTodos);
  //       setTodos(parsedTodos);
  //       if (parsedTodos.length > 0) {
  //         setId(parsedTodos[parsedTodos.length - 1].id + 1); // Ensure unique ID for new todos
  //       }
  //     } catch (error) {
  //       console.error("Failed to parse todos from localStorage", error);
  //     }
  //   }
  // }, []);

  // // Save todos to localStorage whenever todos change
  // useEffect(() => {
  //   console.log("Saving todos to localStorage:", todos);
  //   localStorage.setItem("todos", JSON.stringify(todos));
  // }, [todos]);
  const addTodo = () => {
    const trimmedInput = input.trim();
    const isExisting = todos.some((todo) => todo.text === trimmedInput);

    if (isExisting) {
      toast.error("Todo already exists!");
      return;
    }
    if (trimmedInput !== "") {
      setTodos([...todos, { id: id, text: trimmedInput, status: false }]);

      toast.success("Added successfully");
      setInput("");
      setId(id + 1);
    } else {
      toast.error("Enter your todo");
    }
  };
  // add to do by enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTodo();
    }
  };

  // delete
  const deleteId = (id, text) => {
    Swal.fire({
      title: `Are you sure you want to delete: ${text}?`,
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      focusConfirm: false,
      customClass: {
        confirmButton: "custom-confirm-button",
        cancelButton: "custom-cancel-button",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        let newTodo = todos.filter((todo) => todo.id !== id);
        setTodos(newTodo);
        toast.success("Deleted successfully");
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        toast.info("Deletion canceled");
      }
    });
  };

  // handle checkbox
  const handleCheckbox = (id) => {
    let newTodos = [];
    for (let todo of todos) {
      if (todo.id === id) {
        newTodos.push({ ...todo, status: !todo.status });
      } else {
        newTodos.push({ ...todo });
      }
    }
    setTodos(newTodos);
  };

  // update ID
  const updateID = (id, text) => {
    Swal.fire({
      title: `Are you sure you want to update: ${text}?`,
      input: "text",
      inputValue: text,
      showCancelButton: true,
      confirmButtonText: "Update",
      cancelButtonText: "Cancel",
      customClass: {
        confirmButton: "custom-update-button",
        cancelButton: "custom-cancel-button",
      },
      inputValidator: (value) => {
        if (!value) {
          return "Enter your todo";
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const isExisting = todos.some((todo) => todo.text === result.value);
        if (isExisting) {
          toast.error("Todo already exists!");
          return;
        }
        let updatedTodos = todos.map((todo) =>
          todo.id === id ? { ...todo, text: result.value } : todo
        );
        setTodos(updatedTodos);
        toast.success("Todo updated successfully");
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        toast.info("Update canceled");
      }
    });
  };
  return (
    <div className="App">
      <ToastContainer position="top-center" autoClose={1000} />
      <div className="container">
        <InputGroup className="mb-3 custom-input-group">
          <Form.Control
            placeholder="Enter Your Todo"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
            onKeyDown={handleKeyDown} // event when enter
          />
          <Button
            onClick={() => {
              addTodo();
            }}
            variant="outline-success"
            id="button-addon2"
          >
            ADD TASK
          </Button>
        </InputGroup>

        <div className="list-todo">
          <div className="title">
            <span>Name Todo</span>
            <span className="status">Status</span>
            <span className="actions">Update | Delete</span>
          </div>
          <div className="list-display">
            {todos === 0 ? (
              <span className="emty-todo">No todo list</span>
            ) : (
              todos.map((todo) => (
                <div key={todo.id} className="list">
                  <span
                    className={todo.status ? "name-todo_line" : "name-todo"}
                  >
                    {todo.text}
                  </span>
                  <span>
                    <input
                      className="checkbox"
                      type="checkbox"
                      checked={todo.status}
                      onChange={() => {
                        handleCheckbox(todo.id);
                      }}
                    />
                  </span>

                  <div>
                    <button
                      className="button but-up"
                      onClick={() => updateID(todo.id, todo.text)}
                    >
                      Update
                    </button>{" "}
                    |{" "}
                    <button
                      onClick={() => {
                        deleteId(todo.id, todo.text);
                      }}
                      className="button but-de"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
