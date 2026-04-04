import trashCan from "./assets/delete.svg";
import plusSign from "./assets/plus.svg";
import { format } from "date-fns";

class DomHandler {
  makeChildOf(parent, tag, properties) {
    // helper function for appending child with multiple properties. returns child element
    const child = document.createElement(tag);

    for (const [property, value] of Object.entries(properties)) {
      child[property] = value;
    }

    parent.appendChild(child);

    return child;
  }

  createAddButton(text) {
    const btn = this.makeChildOf(this.topContainer, "button", {
      className: "add-btn",
    });
    this.makeChildOf(btn, "img", { src: plusSign });
    this.makeChildOf(btn, "span", { textContent: text });

    return btn;
  }

  createInfoMessage(text) {
    const info = this.makeChildOf(this.topContainer, "div", {
      className: "info-message",
      textContent: text,
    });

    return info;
  }

  remove(child) {
    this.topContainer.removeChild(child);
  }

  add(child) {
    this.topContainer.appendChild(child);
  }

  resetState() {
    this.topContainer.innerHTML = "";
  }
}

export class ProjectContentHandler extends DomHandler {
  topContainer = document.querySelector("#project-content");

  changeName(projectName) {
    const nameElement = document.querySelector(
      ".container+.container>.subtitle",
    );
    nameElement.textContent = projectName;
  }

  completeTask(element) {
    const flag = element.querySelector("div");

    element.classList.add("completed");
    flag.classList.add("completed-flag");
  }

  uncompleteTask(element) {
    const flag = element.querySelector("div");

    element.classList.remove("completed");
    flag.classList.remove("completed-flag");
  }

  createTaskElement(task) {
    // creates task element and return references of bunch of elements
    const taskContainer = this.makeChildOf(this.topContainer, "li", {
      className: "task",
    });

    const checkBox = this.makeChildOf(taskContainer, "label", {
      className: "flag-check",
    });
    this.makeChildOf(checkBox, "div", {
      className: `priority ${task.priority}`,
    });
    const checkMark = this.makeChildOf(checkBox, "input", { type: "checkbox" });

    this.makeChildOf(taskContainer, "div", {
      className: "task-title",
      textContent: task.title,
    });
    this.makeChildOf(taskContainer, "div", { textContent: task.dueIn() });

    const delBtn = this.makeChildOf(taskContainer, "button", {
      className: "del-btn",
    });
    this.makeChildOf(delBtn, "img", { src: trashCan });

    if (task.completed) {
      checkMark.checked = true;
      this.completeTask(taskContainer);
    }

    return [delBtn, checkBox, checkMark, taskContainer];
  }

  createNewTaskForm() {
    // creates form like element to collect imput for new task
    this.newTaskContainer = this.makeChildOf(this.topContainer, "li", {
      className: "form",
    });
    this.makeChildOf(this.newTaskContainer, "div", {
      className: "form-title",
      textContent: "New Task",
    });

    const inputs = this.makeChildOf(this.newTaskContainer, "div", {
      className: "inputs",
    });
    const input1 = this.makeChildOf(inputs, "div", {});
    const input2 = this.makeChildOf(inputs, "div", {});

    this.inputTitle = this.makeChildOf(input1, "input", {
      type: "text",
      placeholder: "What needs to be done?",
    });
    this.inputDesc = this.makeChildOf(input1, "textarea", {
      placeholder: "You can write a little more details here.",
    });

    const prio = this.makeChildOf(input2, "fieldset", {});
    this.makeChildOf(prio, "legend", { textContent: "Select priority:" });
    const option1 = this.makeChildOf(prio, "label", {});
    this.makeChildOf(option1, "input", {
      type: "radio",
      name: "priority",
      value: "high",
    });
    this.makeChildOf(option1, "span", { textContent: "High" });
    const option2 = this.makeChildOf(prio, "label", {});
    this.makeChildOf(option2, "input", {
      type: "radio",
      name: "priority",
      value: "normal",
      checked: "true",
    });
    this.makeChildOf(option2, "span", { textContent: "Normal" });
    const option3 = this.makeChildOf(prio, "label", {});
    this.makeChildOf(option3, "input", {
      type: "radio",
      name: "priority",
      value: "low",
    });
    this.makeChildOf(option3, "span", { textContent: "Low" });

    const todayDate = new Date();
    this.inputDue = this.makeChildOf(input2, "input", {
      type: "date",
      valueAsDate: todayDate,
      min: format(todayDate, "yyyy-MM-dd"),
    });

    const btns = this.makeChildOf(this.newTaskContainer, "div", {
      className: "form-btns",
    });
    this.cancelBtn = this.makeChildOf(btns, "button", {
      className: "cancel-btn",
      textContent: "Cancel",
    });
    this.confirmBtn = this.makeChildOf(btns, "button", {
      className: "confirm-btn",
      textContent: "Confirm",
    });
  }

  getFormValues() {
    const title = this.inputTitle.value.trim();
    const desc = this.inputDesc.value.trim();
    const dueDate = this.inputDue.valueAsDate;
    const priority = document.querySelector(
      "input[name='priority']:checked",
    ).value;

    return { title, desc, dueDate, priority };
  }
}

export class ListProjectsHandler extends DomHandler {
  topContainer = document.querySelector("#projects-list");

  createListItem(projectName) {
    // creates element with project name and returns it. also returns delete button.
    const li = this.makeChildOf(this.topContainer, "li", {});
    const proj = this.makeChildOf(li, "div", {
      className: "li-proj",
      textContent: projectName,
    });
    const delBtn = this.makeChildOf(li, "button", { className: "del-btn" });
    this.makeChildOf(delBtn, "img", { src: trashCan });

    return [proj, delBtn];
  }

  createNewProjectForm() {
    // creates form like element to collect imput for new project.
    this.newProjectContainer = this.makeChildOf(this.topContainer, "li", {
      className: "form",
    });
    this.makeChildOf(this.newProjectContainer, "div", {
      className: "form-title",
      textContent: "New Project",
    });
    this.inputTitle = this.makeChildOf(this.newProjectContainer, "input", {
      type: "text",
      placeholder: "Project Name",
    });

    const btns = this.makeChildOf(this.newProjectContainer, "div", {
      className: "form-btns",
    });
    this.cancelBtn = this.makeChildOf(btns, "button", {
      className: "cancel-btn",
      textContent: "Cancel",
    });
    this.confirmBtn = this.makeChildOf(btns, "button", {
      className: "confirm-btn",
      textContent: "Confirm",
    });
  }

  getNewProjectName() {
    const name = this.inputTitle.value.trim();

    return name;
  }
}

export class TaskDetailsHandler extends DomHandler {
  topContainer = document.querySelector("#task-details");

  displayDetails(task) {
    this.makeChildOf(this.topContainer, "div", {
      className: "field-key",
      textContent: "Task",
    });
    this.makeChildOf(this.topContainer, "div", {
      className: "field-value",
      textContent: task.title,
    });

    this.makeChildOf(this.topContainer, "div", {
      className: "field-key",
      textContent: "More info",
    });
    this.makeChildOf(this.topContainer, "div", {
      className: "field-value",
      textContent: task.desc,
    });

    this.makeChildOf(this.topContainer, "div", {
      className: "field-key",
      textContent: "Created on",
    });
    this.makeChildOf(this.topContainer, "div", {
      className: "field-value",
      textContent: format(task.createdDate, "dd/MM/yyyy"),
    });

    this.makeChildOf(this.topContainer, "div", {
      className: "field-key",
      textContent: "Due date",
    });
    this.makeChildOf(this.topContainer, "div", {
      className: "field-value",
      textContent: format(task.dueDate, "dd/MM/yyyy"),
    });

    this.makeChildOf(this.topContainer, "div", {
      className: "field-key",
      textContent: "Priority",
    });
    this.makeChildOf(this.topContainer, "div", {
      className: "field-value",
      textContent: task.priority.toUpperCase(),
    });

    if (task.completed) {
      this.makeChildOf(this.topContainer, "div", {
        className: "field-completed",
        textContent: "Completed!",
      });
    } else {
      this.makeChildOf(this.topContainer, "div", {
        className: "field-completed",
        textContent: "Not completed yet!",
      });
    }
  }
}
