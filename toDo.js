let inputTask = document.querySelector(`[name="task"]`);
let btnAdd = document.querySelector(".add");
let containerTasks = document.querySelector(".tasks");

let updatePopup = document.querySelector(".popupUpdate .update");
let overlayPopup = document.querySelector(".popupUpdate .overlay");
let closePopUp = document.querySelector(".title i");
let inputUpdate = document.querySelector(`[name="update"]`);
let btnUpdate = document.querySelector(".save");

let contentAlert = document.querySelector(".contentAlert");
let noTask = document.querySelector(".noavailabel");
let DelAllContent = document.querySelector(".delAll");
let btnDeleteAll = document.querySelector(".deleteAll");
let count = 0;

function Alert(message) {
  let alert = document.createElement("div");
  alert.classList.add("alert");
  let logoAlert = document.createElement("img");
  logoAlert.setAttribute("src", "Images/alert.png");
  logoAlert.setAttribute("alt", "imgAlert");
  let titleAlert = document.createElement("p");
  titleAlert.append(message);
  alert.append(logoAlert, titleAlert);
  contentAlert.prepend(alert);
  setTimeout(() => {
    alert.remove();
  }, 3000);
}

//#############

// Empty array to store the tasks
let arrayOfTasks = [];

// check if tasks exist in localstorage
if (localStorage.getItem("tasks")) {
  arrayOfTasks = JSON.parse(localStorage.getItem("tasks"));
}

// check to No Available Apperance
if (localStorage.getItem("count") !== "0") {
  count = localStorage.getItem("count");
  noTask.classList.add("show");
  DelAllContent.classList.remove("show");
} else {
  DelAllContent.classList.add("show");
}

getDataFromLocalStorage();

//Add Task
btnAdd.addEventListener("click", function (e) {
  e.preventDefault();

  if (inputTask.value) {
    let date = new Intl.DateTimeFormat("en-us", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    });

    addTaskToArray(inputTask.value, date.format());

    //   ******************
    Alert("Your Task Added Successfully");
    //   ******************
    //
    count++;
    window.localStorage.setItem("count", count);
    if (localStorage.getItem("count") !== "0") {
      noTask.classList.add("show");
      DelAllContent.classList.remove("show");
    }
    //
    inputTask.value = "";
  } else {
    Alert("Please Add Your Task");
  }
});

// Delete Task Button
containerTasks.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete")) {
    let divTask = document.querySelector(".task");

    // remove task from localStorage
    deleteTaskWith(divTask.getAttribute("task-id"));

    // remove task from page
    divTask.remove();

    //   ******************
    Alert("Your Task Deleted Successfully");
    //   ******************
    //
    count--;
    window.localStorage.setItem("count", count);
    if (localStorage.getItem("count") === "0") {
      noTask.classList.remove("show");
      DelAllContent.classList.add("show");
    }
    //
  }

  // Task Element
  if (e.target.classList.contains("task")) {
    // toggle completed task
    statusTaskWith(e.target.getAttribute("task-id"));
    // toggle Done Class
    e.target.classList.toggle("done");
  }
});

// Update Task
btnUpdate.addEventListener("click", () => {
  // update title task in page
  document.querySelector(".task>h2").innerHTML = inputUpdate.value;
  closePopUp.click();
  // update title to localStorage
  updateTask(
    document.querySelector(".task").getAttribute("task-id"),
    inputUpdate.value
  );
  Alert("Your Task Updated Successfully");
});

function addTaskToArray(taskText, datte) {
  // task Data
  const task = {
    id: Date.now(),
    title: taskText,
    date: datte,
    completed: false,
  };
  // push task to array of tasks
  arrayOfTasks.push(task);
  // create task and append to page
  addElementsToPageForm(arrayOfTasks);
  // Add tasks to localStorage
  addDataToLocalStorageFrom(arrayOfTasks);
}

function addElementsToPageForm(arrayOfTasks) {
  // Empty to Div Tasks
  document.querySelectorAll(".task").forEach((task) => {
    task.remove();
  });
  // Looping of array of tasks
  arrayOfTasks.forEach((task) => {
    let divTask = document.createElement("div");
    divTask.classList.add("task");
    // Check If Task Is Done
    if (task.completed) {
      divTask.classList.add("done");
    }
    //
    divTask.setAttribute("task-id", task.id);

    let head = document.createElement("h2");
    //
    head.append(task.title);

    let divContent = document.createElement("div");
    divContent.classList.add("content");

    let date = document.createElement("p");
    date.classList.add("date");
    //
    date.append(task.date);

    let iconTask = document.createElement("div");
    iconTask.classList.add("iconetask");

    let treblleIcone = document.createElement("i");
    treblleIcone.classList.add("fa-solid", "fa-ellipsis");

    let popupEditDelete = document.createElement("div");
    popupEditDelete.classList.add("btn-edit-delete");

    let btnEdit = document.createElement("div");
    let iconEdit = document.createElement("i");
    btnEdit.classList.add("edit");
    iconEdit.classList.add("fa-solid", "fa-pen");
    btnEdit.append(iconEdit, "Edit");

    let btnDelete = document.createElement("div");
    let iconDelete = document.createElement("i");
    btnDelete.classList.add("delete");
    iconDelete.classList.add("fa-solid", "fa-trash");
    btnDelete.append(iconDelete, "Delete");

    popupEditDelete.append(btnEdit, btnDelete);
    iconTask.append(treblleIcone, popupEditDelete);
    divContent.append(date, iconTask);
    divTask.append(head, divContent);
    containerTasks.append(divTask);

    // Show menu Edit and Delete
    treblleIcone.addEventListener("click", () => {
      popupEditDelete.classList.toggle("visible");
      document.addEventListener("click", (e) => {
        if (e.target !== treblleIcone) {
          popupEditDelete.classList.remove("visible");
        }
      });
    });
    //test
    btnEdit.addEventListener("click", () => {
      updatePopup.parentElement.classList.toggle("active");
      inputUpdate.value = head.innerHTML;
      inputUpdate.focus();
      popupEditDelete.classList.remove("visible");
    });

    closePopUp.addEventListener("click", () => {
      updatePopup.parentElement.classList.remove("active");
    });
    overlayPopup.addEventListener("click", () => {
      closePopUp.click();
    });
  });
}

function addDataToLocalStorageFrom(arrayOfTasks) {
  window.localStorage.setItem("tasks", JSON.stringify(arrayOfTasks));
}

function getDataFromLocalStorage() {
  let data = window.localStorage.getItem("tasks");
  if (data) {
    let tasks = JSON.parse(data);
    addElementsToPageForm(tasks);
  }
}

function deleteTaskWith(taskId) {
  arrayOfTasks = arrayOfTasks.filter((task) => task.id != taskId);
  addDataToLocalStorageFrom(arrayOfTasks);
}

function statusTaskWith(taskId) {
  for (let i = 0; i < arrayOfTasks.length; i++) {
    if (arrayOfTasks[i].id == taskId) {
      arrayOfTasks[i].completed == false
        ? (arrayOfTasks[i].completed = true)
        : (arrayOfTasks[i].completed = false);
    }
  }
  addDataToLocalStorageFrom(arrayOfTasks);
}

function updateTask(taskId, inputUpValue) {
  for (let i = 0; i < arrayOfTasks.length; i++) {
    if (arrayOfTasks[i].id == taskId) {
      arrayOfTasks[i].title = inputUpValue;
    }
  }
  addDataToLocalStorageFrom(arrayOfTasks);
}

// Delete All Tasks
btnDeleteAll.addEventListener("click", () => {
  document.querySelectorAll(".task").forEach((task) => {
    task.remove();
  });
  window.localStorage.removeItem("tasks");
  window.localStorage.setItem("count", 0);
  noTask.classList.remove("show");
  DelAllContent.classList.add("show");
  // Update
  arrayOfTasks = [];
  count = 0;
  // *****************
  Alert("Your Tasks Deleted Successfully");
  // *****************
});

// Clear All
// document.querySelectorAll(".task").forEach((task) => {
//   task.remove();
// });
// localStorage.clear();
