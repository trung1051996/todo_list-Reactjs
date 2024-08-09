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

  // save todo change
  useEffect(() => {
    // Kiểm tra nếu todos là một mảng trước khi lưu
    if (Array.isArray(todos) && todos.length > 0) {
      let newtodo = JSON.stringify(todos);
      localStorage.setItem("todos", newtodo);
    } else {
      console.log("Todos is empty or not an array:", todos);
    }
  }, [todos]);
  //Load todos from localStorage reload
  useEffect(() => {
    // get data from localStorage
    const savedTodos = localStorage.getItem("todos");

    if (savedTodos) {
      // Chỉ parse nếu dữ liệu tồn tại và không bị lỗi
      try {
        let todosArray = JSON.parse(savedTodos);
        console.log("arr", todosArray);

        // Kiểm tra nếu todosArray là một mảng trước khi cập nhật state
        if (Array.isArray(todosArray)) {
          setTodos(todosArray);
        } else {
          console.error("Saved todos is not an array:", todosArray);
        }
      } catch (error) {
        console.error("Failed to parse todos from localStorage", error);
      }
    } else {
      console.log("No todos found in localStorage");
    }
  }, []);

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
        localStorage.removeItem("todos");
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

  // loading
  // loadding data
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Giả lập hiệu ứng loading trong 1 giây
    const timer = setTimeout(() => {
      setLoading(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const Main = () => {
    console.log("todo", todos);
    return (
      <>
        <div>
          {todos.length == 0 ? (
            <span className="emty-todo">No todo list</span>
          ) : (
            todos.map((todo) => (
              <div key={todo.id} className="list">
                <span className={todo.status ? "name-todo_line" : "name-todo"}>
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
      </>
    );
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
            {loading ? (
              <div class="container2">
                <div class="progress-6"></div>
              </div>
            ) : (
              <Main />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
