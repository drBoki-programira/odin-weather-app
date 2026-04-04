import "./styles.css";
import { ToDoTask, Project } from "./objects";
import {
  ProjectContentHandler,
  ListProjectsHandler,
  TaskDetailsHandler,
} from "./display";

(function () {
  const projects = [];
  const projectHandler = new ProjectContentHandler();
  const listHandler = new ListProjectsHandler();
  const taskHandler = new TaskDetailsHandler();

  const remove = function (project) {
    const idx = projects.findIndex((proj) => proj.name === project.name);
    projects.splice(idx, 1);
  };

  const saveProjects = function () {
    localStorage.clear();
    localStorage.setItem("projects", JSON.stringify(projects));
  };

  const loadProjects = function () {
    const projectsJSON = localStorage.getItem("projects");
    const storedProjects = JSON.parse(projectsJSON);

    for (const project of storedProjects) {
      const storedProject = new Project(project.name);

      for (const taskData of project.listTasks) {
        const storedTask = ToDoTask.fromStored(taskData);
        storedProject.add(storedTask);
      }

      projects.push(storedProject);
    }
  };

  const displayTaskDetails = function (task) {
    taskHandler.resetState();

    if (task) {
      taskHandler.displayDetails(task);
    } else {
      taskHandler.createInfoMessage("Click on a task for more details");
    }
  };

  const displayProject = function (project) {
    saveProjects();

    projectHandler.resetState();

    if (project) {
      projectHandler.changeName(project.name);

      project.listTasks.forEach(function (task) {
        const [deleteTaskBtn, checkBoxBtn, checkMark, taskContainer] =
          projectHandler.createTaskElement(task);

        deleteTaskBtn.addEventListener("click", function (event) {
          event.stopPropagation();
          project.remove(task);
          displayProject(project);
          displayTaskDetails();
        });

        checkBoxBtn.addEventListener("click", function () {
          if (checkMark.checked) {
            projectHandler.completeTask(taskContainer);
            task.completed = true;
          } else {
            projectHandler.uncompleteTask(taskContainer);
            task.completed = false;
          }
        });

        taskContainer.addEventListener("click", function () {
          displayTaskDetails(task);
        });
      });

      const addTaskBtn = projectHandler.createAddButton("New Task");

      addTaskBtn.addEventListener("click", function () {
        projectHandler.createNewTaskForm();
        projectHandler.remove(addTaskBtn);

        projectHandler.cancelBtn.addEventListener("click", function () {
          projectHandler.remove(projectHandler.newTaskContainer);
          projectHandler.add(addTaskBtn);
        });

        projectHandler.confirmBtn.addEventListener("click", function () {
          const data = projectHandler.getFormValues();
          const newTask = new ToDoTask(
            data.title,
            data.desc,
            data.dueDate,
            data.priority,
          );
          project.add(newTask);

          projectHandler.remove(projectHandler.newTaskContainer);
          displayProject(project);
        });
      });
    } else {
      projectHandler.changeName("Project Not Selected");
      projectHandler.createInfoMessage("Select a project or create a new one.");
    }
  };

  const listAllProjects = function () {
    saveProjects();

    listHandler.resetState();

    projects.forEach(function (project) {
      const [listItem, delBtn] = listHandler.createListItem(project.name);

      listItem.addEventListener("click", () => {
        displayProject(project);
        displayTaskDetails();
      });

      delBtn.addEventListener("click", function () {
        remove(project);
        displayProject();
        displayTaskDetails();
        listAllProjects();
      });
    });

    const addProjectBtn = listHandler.createAddButton("New Project");
    addProjectBtn.addEventListener("click", function () {
      listHandler.createNewProjectForm();
      listHandler.remove(addProjectBtn);

      listHandler.cancelBtn.addEventListener("click", function () {
        listHandler.remove(listHandler.newProjectContainer);
        listHandler.add(addProjectBtn);
      });

      listHandler.confirmBtn.addEventListener("click", function () {
        const newName = listHandler.getNewProjectName();
        const newProject = new Project(newName);

        projects.push(newProject);
        listHandler.remove(listHandler.newProjectContainer);
        listAllProjects();
      });
    });
  };

  if (localStorage.projects) {
    loadProjects();
  } else {
    projects.push(new Project("Miscellaneous"));
  }

  displayProject();
  listAllProjects();
})();
