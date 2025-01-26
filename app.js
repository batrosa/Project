import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker, { registerLocale } from "react-datepicker";
import ru from "date-fns/locale/ru";
import "react-datepicker/dist/react-datepicker.css";
import { v4 as uuidv4 } from 'uuid'; // Импорт uuid

registerLocale("ru", ru);

const ProjectManager = () => {
  const [projects, setProjects] = useState([]);
  const [projectDetails, setProjectDetails] = useState({ name: "", description: "", deadline: null });
  const [taskDetails, setTaskDetails] = useState({ name: "", deadline: null, assignee: "", comments: "" });
  const [employees, setEmployees] = useState([]);
  const [employeeName, setEmployeeName] = useState("");
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState({ status: false, projectId: null });
  const [isManagingEmployees, setIsManagingEmployees] = useState(false); // Новое состояние для управления сотрудниками
  const [isEditingProject, setIsEditingProject] = useState(null);
  const [isEditingTask, setIsEditingTask] = useState({ status: false, projectId: null, task: null });

  // Функция добавления проекта
  const addProject = () => {
    if (projectDetails.name.trim() && projectDetails.deadline) {
      setProjects([
        ...projects,
        { 
          ...projectDetails, 
          id: uuidv4(), // Используем uuid для уникального id
          tasks: [],
          status: "В процессе" 
        }
      ]);
      setProjectDetails({ name: "", description: "", deadline: null });
      setIsAddingProject(false);
    } else {
      alert("Пожалуйста, заполните все обязательные поля проекта.");
    }
  };

  // Функция редактирования проекта
  const editProject = (project) => {
    setIsEditingProject(project);
    setProjectDetails({ name: project.name, description: project.description, deadline: new Date(project.deadline) });
  };

  // Функция сохранения изменений проекта
  const saveProject = () => {
    if (projectDetails.name.trim() && projectDetails.deadline) {
      setProjects(
        projects.map((project) =>
          project.id === isEditingProject.id
            ? { 
                ...project, 
                name: projectDetails.name, 
                description: projectDetails.description, 
                deadline: projectDetails.deadline 
              }
            : project
        )
      );
      setIsEditingProject(null);
      setProjectDetails({ name: "", description: "", deadline: null });
    } else {
      alert("Пожалуйста, заполните все обязательные поля проекта.");
    }
  };

  // Функция удаления проекта
  const deleteProject = (id) => {
    if (window.confirm("Вы уверены, что хотите удалить этот проект?")) {
      setProjects(projects.filter((project) => project.id !== id));
    }
  };

  // Функция добавления задачи в проект
  const addTask = (projectId) => {
    if (taskDetails.name.trim() && taskDetails.deadline && taskDetails.assignee) {
      setProjects(
        projects.map((project) =>
          project.id === projectId
            ? { 
                ...project, 
                tasks: [
                  ...project.tasks, 
                  { ...taskDetails, id: uuidv4(), status: "В процессе" } // Используем uuid
                ] 
              }
            : project
        )
      );
      setTaskDetails({ name: "", deadline: null, assignee: "", comments: "" });
      setIsAddingTask({ status: false, projectId: null });
    } else {
      alert("Пожалуйста, заполните все обязательные поля задачи.");
    }
  };

  // Функция редактирования задачи
  const editTask = (projectId, task) => {
    setIsEditingTask({ status: true, projectId, task });
    setTaskDetails({ 
      name: task.name, 
      deadline: new Date(task.deadline), 
      assignee: task.assignee, 
      comments: task.comments || "" 
    });
  };

  // Функция сохранения изменений задачи
  const saveTask = () => {
    const { projectId, task } = isEditingTask;
    if (taskDetails.name.trim() && taskDetails.deadline && taskDetails.assignee) {
      setProjects(
        projects.map((project) =>
          project.id === projectId
            ? { 
                ...project, 
                tasks: project.tasks.map((t) =>
                  t.id === task.id
                    ? { 
                        ...t, 
                        name: taskDetails.name, 
                        deadline: taskDetails.deadline, 
                        assignee: taskDetails.assignee,
                        comments: taskDetails.comments
                      }
                    : t
                ) 
              }
            : project
        )
      );
      setIsEditingTask({ status: false, projectId: null, task: null });
      setTaskDetails({ name: "", deadline: null, assignee: "", comments: "" });
    } else {
      alert("Пожалуйста, заполните все обязательные поля задачи.");
    }
  };

  // Функция завершения задачи
  const completeTask = (projectId, taskId) => {
    setProjects(
      projects.map((project) =>
        project.id === projectId
          ? { 
              ...project, 
              tasks: project.tasks.map((task) => 
                task.id === taskId ? { ...task, status: "Завершена" } : task
              ) 
            }
          : project
      )
    );
  };

  // Функция возврата задачи в процесс
  const revertTask = (projectId, taskId) => {
    setProjects(
      projects.map((project) =>
        project.id === projectId
          ? { 
              ...project, 
              tasks: project.tasks.map((task) => 
                task.id === taskId ? { ...task, status: "В процессе" } : task
              ) 
            }
          : project
      )
    );
  };

  // Функция завершения проекта
  const completeProject = (id) => {
    setProjects(
      projects.map((project) =>
        project.id === id
          ? { ...project, status: "Завершён" }
          : project
      )
    );
  };

  // Функция возврата проекта в процесс
  const revertProject = (id) => {
    setProjects(
      projects.map((project) =>
        project.id === id
          ? { ...project, status: "В процессе" }
          : project
      )
    );
  };

  // Функция удаления задачи
  const deleteTask = (projectId, taskId) => {
    if (window.confirm("Вы уверены, что хотите удалить эту задачу?")) {
      setProjects(
        projects.map((project) =>
          project.id === projectId
            ? { 
                ...project, 
                tasks: project.tasks.filter((task) => task.id !== taskId) 
              }
            : project
        )
      );
    }
  };

  // Функция добавления сотрудника
  const addEmployee = () => {
    if (employeeName.trim()) {
      // Проверка на дублирование имен сотрудников
      if (employees.includes(employeeName.trim())) {
        alert("Сотрудник с таким именем уже существует.");
        return;
      }

      setEmployees([...employees, employeeName.trim()]);
      setEmployeeName("");
      // Модальное окно остаётся открытым для добавления/удаления других сотрудников
    } else {
      alert("Пожалуйста, введите имя сотрудника.");
    }
  };

  // Функция удаления сотрудника
  const deleteEmployee = (employee) => {
    if (window.confirm(`Вы уверены, что хотите удалить сотрудника "${employee}"?`)) {
      setEmployees(employees.filter((emp) => emp !== employee));

      // Обновление задач, назначенных на удалённого сотрудника
      setProjects(
        projects.map((project) => ({
          ...project,
          tasks: project.tasks.map((task) =>
            task.assignee === employee ? { ...task, assignee: "" } : task
          )
        }))
      );
    }
  };

  // Проверка просроченных задач и проектов
  const isOverdue = (deadline) => {
    const currentDate = new Date();
    return deadline && new Date(deadline) < currentDate;
  };

  useEffect(() => {
    setProjects((prevProjects) =>
      prevProjects.map((project) => {
        // Обновление статуса проекта
        if (project.status !== "Завершён" && isOverdue(project.deadline)) {
          return { ...project, status: "Просрочен" };
        }

        // Обновление статусов задач внутри проекта
        const updatedTasks = project.tasks.map((task) => {
          if (task.status !== "Завершена" && isOverdue(task.deadline)) {
            return { ...task, status: "Просрочена" };
          }
          return task;
        });

        return { ...project, tasks: updatedTasks };
      })
    );
  }, [projects]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
      <motion.h1
        className="text-3xl font-bold mb-6 text-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Управление проектами
      </motion.h1>

      <motion.button
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsAddingProject(true)}
      >
        Добавить проект
      </motion.button>

      <motion.button
        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 mt-4"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsManagingEmployees(true)}
      >
        Список сотрудников
      </motion.button>

      <AnimatePresence>
        {/* Модальное окно для добавления/редактирования проекта */}
        {(isAddingProject || isEditingProject) && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-semibold mb-4">
                {isEditingProject ? "Редактировать проект" : "Добавить проект"}
              </h2>
              <input
                type="text"
                placeholder="Название проекта"
                value={projectDetails.name}
                onChange={(e) => setProjectDetails({ ...projectDetails, name: e.target.value })}
                className="w-full p-2 border rounded mb-3"
              />
              <textarea
                placeholder="Описание проекта"
                value={projectDetails.description}
                onChange={(e) => setProjectDetails({ ...projectDetails, description: e.target.value })}
                className="w-full p-2 border rounded mb-3"
              />
              <DatePicker
                locale="ru"
                selected={projectDetails.deadline}
                onChange={(date) => setProjectDetails({ ...projectDetails, deadline: date })}
                placeholderText="Выберите дедлайн проекта"
                className="w-full p-2 border rounded mb-4"
                dateFormat="dd/MM/yyyy"
                showPopperArrow
              />
              <div className="flex justify-between">
                <motion.button
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={isEditingProject ? saveProject : addProject}
                >
                  {isEditingProject ? "Сохранить изменения" : "Сохранить"}
                </motion.button>
                <motion.button
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setIsAddingProject(false);
                    setIsEditingProject(null);
                  }}
                >
                  Отмена
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Модальное окно для добавления/удаления сотрудников */}
        {isManagingEmployees && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-semibold mb-4">Список сотрудников</h2>
              {/* Форма для добавления сотрудника */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Имя сотрудника"
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
                  className="w-full p-2 border rounded mb-2"
                />
                <motion.button
                  className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={addEmployee}
                >
                  Добавить сотрудника
                </motion.button>
              </div>

              {/* Форма для удаления сотрудника */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Удалить сотрудника</h3>
                {employees.length === 0 ? (
                  <p className="text-sm text-gray-500">Нет сотрудников для удаления.</p>
                ) : (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {employees.map((employee) => (
                      <div key={employee} className="flex justify-between items-center">
                        <span>{employee}</span>
                        <motion.button
                          className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => deleteEmployee(employee)}
                        >
                          Удалить
                        </motion.button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <motion.button
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsManagingEmployees(false)}
                >
                  Закрыть
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Модальное окно для добавления задачи */}
        {isAddingTask.status && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-semibold mb-4">Добавить задачу</h2>
              <input
                type="text"
                placeholder="Название задачи"
                value={taskDetails.name}
                onChange={(e) => setTaskDetails({ ...taskDetails, name: e.target.value })}
                className="w-full p-2 border rounded mb-3"
              />
              <DatePicker
                locale="ru"
                selected={taskDetails.deadline}
                onChange={(date) => setTaskDetails({ ...taskDetails, deadline: date })}
                placeholderText="Выберите срок"
                className="w-full p-2 border rounded mb-3"
                dateFormat="dd/MM/yyyy"
                showPopperArrow
              />
              <textarea
                placeholder="Комментарий к задаче"
                value={taskDetails.comments}
                onChange={(e) => setTaskDetails({ ...taskDetails, comments: e.target.value })}
                className="w-full p-2 border rounded mb-3"
              />
              <select
                value={taskDetails.assignee}
                onChange={(e) => setTaskDetails({ ...taskDetails, assignee: e.target.value })}
                className="w-full p-2 border rounded mb-4"
              >
                <option value="">Выберите сотрудника</option>
                {employees.map((employee, index) => (
                  <option key={index} value={employee}>
                    {employee}
                  </option>
                ))}
              </select>

              <div className="flex justify-between">
                <motion.button
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => addTask(isAddingTask.projectId)}
                >
                  Сохранить
                </motion.button>
                <motion.button
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setIsAddingTask({ status: false, projectId: null });
                    setTaskDetails({ name: "", deadline: null, assignee: "", comments: "" });
                  }}
                >
                  Отмена
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Модальное окно для редактирования задачи */}
        {isEditingTask.status && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-semibold mb-4">Редактировать задачу</h2>
              <input
                type="text"
                placeholder="Название задачи"
                value={taskDetails.name}
                onChange={(e) => setTaskDetails({ ...taskDetails, name: e.target.value })}
                className="w-full p-2 border rounded mb-3"
              />
              <DatePicker
                locale="ru"
                selected={taskDetails.deadline}
                onChange={(date) => setTaskDetails({ ...taskDetails, deadline: date })}
                placeholderText="Выберите срок"
                className="w-full p-2 border rounded mb-3"
                dateFormat="dd/MM/yyyy"
                showPopperArrow
              />
              <textarea
                placeholder="Комментарий к задаче"
                value={taskDetails.comments}
                onChange={(e) => setTaskDetails({ ...taskDetails, comments: e.target.value })}
                className="w-full p-2 border rounded mb-3"
              />
              <select
                value={taskDetails.assignee}
                onChange={(e) => setTaskDetails({ ...taskDetails, assignee: e.target.value })}
                className="w-full p-2 border rounded mb-4"
              >
                <option value="">Выберите сотрудника</option>
                {employees.map((employee, index) => (
                  <option key={index} value={employee}>
                    {employee}
                  </option>
                ))}
              </select>

              <div className="flex justify-between">
                <motion.button
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={saveTask}
                >
                  Сохранить изменения
                </motion.button>
                <motion.button
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setIsEditingTask({ status: false, projectId: null, task: null });
                    setTaskDetails({ name: "", deadline: null, assignee: "", comments: "" });
                  }}
                >
                  Отмена
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-4xl mt-6">
        {projects.map((project) => (
          <motion.div
            key={project.id}
            className="bg-white p-6 rounded-lg shadow mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">{project.name}</h2>
                <p className="text-sm text-gray-600">{project.description}</p>
                <p className="text-sm text-gray-600">
                  Дедлайн: {new Date(project.deadline).toLocaleDateString()}
                </p>
                <p
                  className={`text-sm font-bold ${
                    project.status === "Просрочен"
                      ? "text-red-600"
                      : project.status === "Завершён"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  Статус: {project.status}
                </p>
              </div>
              <div className="flex space-x-2">
                <motion.button
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => editProject(project)}
                >
                  Редактировать
                </motion.button>
                <motion.button
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => deleteProject(project.id)}
                >
                  Удалить
                </motion.button>
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-4">
              {project.status !== "Завершён" ? (
                <motion.button
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => completeProject(project.id)}
                >
                  Завершить
                </motion.button>
              ) : (
                <motion.button
                  className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => revertProject(project.id)}
                >
                  Вернуть
                </motion.button>
              )}
            </div>

            <div className="mt-4">
              <h3 className="text-xl font-semibold">Задачи</h3>
              {project.tasks.length === 0 ? (
                <p className="text-sm text-gray-500">Нет задач в этом проекте.</p>
              ) : (
                project.tasks.map((task) => (
                  <motion.div
                    key={task.id}
                    className={`bg-gray-50 p-4 rounded mt-2 ${
                      task.status === "Просрочена"
                        ? "border-l-4 border-red-600"
                        : task.status === "Завершена"
                        ? "border-l-4 border-green-600"
                        : "border-l-4 border-yellow-600"
                    }`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-lg font-semibold">{task.name}</h4>
                        <p className="text-sm">Срок: {new Date(task.deadline).toLocaleDateString()}</p>
                        <p className="text-sm">Ответственный: {task.assignee || "Не назначен"}</p>
                        {task.comments && (
                          <p className="text-sm italic">Комментарий: {task.comments}</p>
                        )}
                        <p
                          className={`text-sm font-bold ${
                            task.status === "Просрочена"
                              ? "text-red-600"
                              : task.status === "Завершена"
                              ? "text-green-600"
                              : "text-yellow-600"
                          }`}
                        >
                          Статус: {task.status}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <motion.button
                          className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => editTask(project.id, task)}
                        >
                          Редактировать
                        </motion.button>
                        {task.status !== "Завершена" ? (
                          <motion.button
                            className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => completeTask(project.id, task.id)}
                          >
                            Завершить
                          </motion.button>
                        ) : (
                          <motion.button
                            className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => revertTask(project.id, task.id)}
                          >
                            Вернуть
                          </motion.button>
                        )}
                        <motion.button
                          className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => deleteTask(project.id, task.id)}
                        >
                          Удалить
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
              <motion.button
                className="mt-3 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsAddingTask({ status: true, projectId: project.id })}
              >
                Добавить задачу
              </motion.button>
            </div>
          </motion.div>
        ))}

        {/* Дополнительные компоненты модальных окон уже реализованы выше */}
      </div>
    </div>
  );
};

export default ProjectManager;
