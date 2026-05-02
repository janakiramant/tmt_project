import { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { auth, signInWithGoogle, logout as firebaseLogout } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

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
    reactions: { '🔥': 2, '👀': 1 },
    comments: [
      { id: 'c-1', author: 'Bob Manager', text: 'Make sure to use the new brand guidelines.', timestamp: '2026-05-01T10:00:00Z', reactions: { '👍': 1 } }
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
    reactions: {},
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
    reactions: { '🎉': 3 },
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
    reactions: {},
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
    reactions: { '📝': 1 },
    comments: []
  }
];

const TaskContext = createContext();

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [teamPulse, setTeamPulse] = useState({ emoji: '☕', status: 'Deep Work Mode' });
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser({ id: user.uid, name: user.displayName || 'User', email: user.email, role: 'Member' });
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async () => {
    await signInWithGoogle();
  };

  const logout = async () => {
    await firebaseLogout();
  };

  const addToast = (message, emoji = '🚀') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, emoji }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const addTask = (taskData) => {
    const newTask = {
      ...taskData,
      id: `t-${Date.now()}`,
      reactions: {},
      comments: [],
      status: 'To Do'
    };
    setTasks([...tasks, newTask]);
    addToast(`New task created: ${taskData.title}`, '🚀');
  };

  const updateTaskStatus = (taskId, newStatus) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const updatedTask = { ...task, status: newStatus };
        if (newStatus === 'Done') {
            updatedTask.completedAt = new Date().toISOString();
            addToast(`Task completed: ${task.title}`, '✅');
        } else {
            addToast(`Task moved to ${newStatus}`, '🔄');
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
          timestamp: new Date().toISOString(),
          reactions: {}
        };
        addToast(`New comment on: ${task.title}`, '💬');
        return { ...task, comments: [...task.comments, newComment] };
      }
      return task;
    }));
  };

  const toggleTaskReaction = (taskId, emoji) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const newReactions = { ...task.reactions };
        newReactions[emoji] = (newReactions[emoji] || 0) + 1;
        return { ...task, reactions: newReactions };
      }
      return task;
    }));
  };

  const value = useMemo(() => ({
    tasks,
    currentUser,
    loading,
    login,
    logout,
    teamPulse,
    setTeamPulse,
    toasts,
    addTask,
    updateTaskStatus,
    addComment,
    toggleTaskReaction
  }), [tasks, currentUser, loading, teamPulse, toasts]);

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
