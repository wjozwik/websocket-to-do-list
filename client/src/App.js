import io from 'socket.io-client';
import { useState } from 'react';
import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const App = () => {
  const [socket, setSocket] = useState();
  const [tasks, setTasks] = useState([{ id: '1', name: 'go shopping' }]);
  const [taskName, setTaskName] = useState();

  useEffect(() => {
    const socket = io('ws://localhost:8000', { transports: ['websocket'] });
    setSocket(socket);
    socket.on('updateData', (tasks) => updateTasks(tasks));
    socket.on('addTask', (task) => addTask(task));
    socket.on('removeTask', (id) => removeTask(id, true));

    return () => {
      socket.disconnect();
    };
  }, []);

  const updateTasks = (tasks) => {
    setTasks(tasks);
  };

  const removeTask = (id, isServer) => {
    setTasks((tasks) => tasks.filter((task) => task.id !== id));
    if (!isServer) {
      socket.emit('removeTask', id);
    }
  };

  const addTask = (task, isServer) => {
    setTasks((tasks) => [...tasks, task]);
  };

  const submitForm = (e) => {
    e.preventDefault();
    const taskObj = { id: uuidv4(), name: taskName };
    addTask(taskObj);
    socket.emit('addTask', taskObj);
    setTaskName('');
  };

  const changeHandler = (e) => {
    setTaskName(e.target.value);
  };

  return (
    <div className="App">
      <header>
        <h1>ToDoList.app</h1>
      </header>
      <section className="tasks-section" id="tasks-section">
        <h2>Tasks</h2>
        <ul className="tasks-section__list" id="tasks-list">
        {tasks.map((task) => (
            <li key={task.id} className='task'>
              {task.name}
              <button
                className='btn btn--red'
                onClick={() => removeTask(task.id)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
        <form id="add-task-form"onSubmit={submitForm}>
          <input className="text-input" autoComplete="off" type="text" placeholder="Type your description" id="task-name" value={taskName} onChange={changeHandler}/>
          <button className="btn" type="submit">Add</button>
        </form>
      </section>
    </div>
  );
}

export default App;