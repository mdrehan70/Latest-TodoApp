const addBtn = document.getElementById("addTodoBtn");
const textInput = document.getElementById("todoInput");
const todoListUL = document.getElementById("todoList");
const remaining = document.getElementById("remaining-count");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");
const allBtn = document.getElementById("allBlock");
const activeBtn = document.getElementById("activeBlock");
const completedBtn = document.getElementById("completedBlock");

let todoText;
let todos = [];
let todosString = localStorage.getItem("todos");

if (todosString) {
  todos = JSON.parse(todosString);
  remaining.innerHTML = todos.filter((item) => {
    return item.isCompleted != true;
  }).length;
}

const populateTodos = (list = todos) => {
  let string = "";
  for (const todo of list) {
    string += `<li id="${todo.id}" class="todo-item ${
      todo.isCompleted ? "completed" : ""
    }">
                        <input type="checkbox" class="todo-checkbox" ${
                          todo.isCompleted ? "checked" : ""
                        }>
                        <span class="todo-text">${todo.title}</span>
                        <button class="delete-btn">×</button>
                    </li>`;
  }
  todoListUL.innerHTML = string;

  // Add the checkbox logic to populate todos
  const todoCheckboxes = document.querySelectorAll(".todo-checkbox");

  todoCheckboxes.forEach((element) => {
    element.addEventListener("click", (e) => {
      if (e.target.checked) {
        element.parentNode.classList.add("completed");
        // Grab this todo from todos array and updates the todos array to set this todo's isCompleted attributes as true.
        todos = todos.map((todo) => {
          if (todo.id == element.parentNode.id) {
            return { ...todo, isCompleted: true };
          } else {
            return todo;
          }
        });
        remaining.innerHTML = todos.filter((item) => {
          return item.isCompleted != true;
        }).length;
        localStorage.setItem("todos", JSON.stringify(todos));
      } else {
        element.parentNode.classList.remove("completed");
        // Grab this todo from todos array and updates the todos array to set this todo's isCompleted attributes as false.
        todos = todos.map((todo) => {
          if (todo.id == element.parentNode.id) {
            return { ...todo, isCompleted: false };
          } else {
            return todo;
          }
        });
        remaining.innerHTML = todos.filter((item) => {
          return item.isCompleted != true;
        }).length;
        localStorage.setItem("todos", JSON.stringify(todos));
      }
    });
  });

  // Handle the Clear Completed Button click
  clearCompletedBtn.addEventListener("click", () => {
    todos = todos.filter((todo) => todo.isCompleted == false);
    populateTodos();
    localStorage.setItem("todos", JSON.stringify(todos));
  });

  //   Handle the delete buttons
  let deleteBtns = document.querySelectorAll(".delete-btn");
  deleteBtns.forEach((element) => {
    element.addEventListener("click", (e) => {
      const confirmation = confirm("Do you want to delete this todo ?");
      if (confirmation) {
        todos = todos.filter((todo) => {
          return todo.id !== e.target.parentNode.id;
        });
        remaining.innerHTML = todos.filter((item) => {
          return item.isCompleted != true;
        }).length;
        localStorage.setItem("todos", JSON.stringify(todos));
        populateTodos();
      }
    });
  });
};

// Select all filter buttons
const filterBtns = document.querySelectorAll(".filter-btn");

// Show All
allBtn.addEventListener("click", () => {
  populateTodos(todos);
  setActiveButton(allBtn);
});

// Show Active
activeBtn.addEventListener("click", () => {
  const activeTodos = todos.filter((todo) => todo.isCompleted == false);
  populateTodos(activeTodos);
  setActiveButton(activeBtn);
});

// Show Completed
completedBtn.addEventListener("click", () => {
  const completedTodos = todos.filter((todo) => todo.isCompleted == true);
  populateTodos(completedTodos);
  setActiveButton(completedBtn);
});

// Function to handle "active" class
function setActiveButton(activeBtn) {
  filterBtns.forEach((btn) => btn.classList.remove("active"));
  activeBtn.classList.add("active");
}


function addTodo() {
  todoText = textInput.value;
  if (todoText.trim().length < 4) {
    alert("You cannot add a todo that small!");
    return;
  }

  textInput.value = "";
  let todo = {
    id: "todo-" + Date.now(),
    title: todoText,
    isCompleted: false,
  };
  todos.push(todo);
  remaining.innerHTML = todos.filter((item) => {
    return item.isCompleted != true;
  }).length;
  localStorage.setItem("todos", JSON.stringify(todos));
  populateTodos();
}
addBtn.addEventListener("click", addTodo);
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTodo();
  }
});

populateTodos();
