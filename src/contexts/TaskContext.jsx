import { createContext, useContext, useState, useMemo } from 'react';

// Sample data for marketing agency / software dev team
const initialTasks = [
  {
    id: 't-1',
    title: 'Design Marketing Landing Page',
    description: 'Create high-converting landing page for new product launch.',
    status: 'In Progress',
    priority: 'High',
    assignee: 'Alice Designer',
    dueDate: '2026-05-10',
    comments: [
      { id: 'c-1', author: 'Bob Manager', text: 'Make sure to use the new brand guidelines.', timestamp: '2026-05-01T10:00:00Z' }
    ]
  },
  {
    id: 't-2',
    title: 'Implement Authentication API',
    description: 'Set up JWT-based authentication in the Node.js backend.',
    status: 'To Do',
    priority: 'High',
    assignee: 'Charlie Dev',
    dueDate: '2026-05-08',
    comments: []
  },
  {
    id: 't-3',
    title: 'Review Quarterly Ad Spend',
    description: 'Analyze ROI from Q1 campaigns across Google and Meta.',
    status: 'Done',
    priority: 'Medium',
    assignee: 'Diana Marketing',
    dueDate: '2026-04-30',
    comments: []
  },
  {
    id: 't-4',
    title: 'Fix Navigation Bug on Mobile',
    description: 'Menu icon is unresponsive on iOS Safari.',
    status: 'To Do',
    priority: 'Low',
    assignee: 'Charlie Dev',
    dueDate: '2026-05-15',
    comments: []
  },
  {
    id: 't-5',
    title: 'Draft Q3 Content Strategy',
    description: 'Outline blog posts and webinar topics for next quarter.',
    status: 'In Progress',
    priority: 'Medium',
    assignee: 'Diana Marketing',
    dueDate: '2026-05-20',
    comments: []
  }
];

const TaskContext = createContext();

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [currentUser] = useState({ id: 'u-1', name: 'Admin User', role: 'Admin' }); // Simplified RBAC

  const addTask = (taskData) => {
    const newTask = {
      ...taskData,
      id: `t-${Date.now()}`,
      comments: [],
      status: 'To Do'
    };
    setTasks([...tasks, newTask]);
  };

  const updateTaskStatus = (taskId, newStatus) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const updatedTask = { ...task, status: newStatus };
        // Simulate automated workflow timestamp log
        if (newStatus === 'Done') {
            updatedTask.completedAt = new Date().toISOString();
            console.log(`[Automation Workflow] Notification sent: Task "${task.title}" completed.`);
        }
        return updatedTask;
      }
      return task;
    }));
  };

  const addComment = (taskId, text) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const newComment = {
          id: `c-${Date.now()}`,
          author: currentUser.name,
          text,
          timestamp: new Date().toISOString()
        };
        return { ...task, comments: [...task.comments, newComment] };
      }
      return task;
    }));
  };

  const value = useMemo(() => ({
    tasks,
    currentUser,
    addTask,
    updateTaskStatus,
    addComment
  }), [tasks, currentUser]);

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
}
