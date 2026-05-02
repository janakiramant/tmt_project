import { render, act } from '@testing-library/react';
import { TaskProvider, useTaskContext } from '../contexts/TaskContext';
import { vi } from 'vitest';

// Mock Firebase
vi.mock('../lib/firebase', () => ({
  auth: {},
  signInWithGoogle: vi.fn(),
  logout: vi.fn()
}));

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: (auth, cb) => {
    cb({ uid: 'u-1', displayName: 'Test User', email: 'test@example.com' });
    return () => {};
  }
}));

const TestComponent = ({ onContextReady }) => {
  const context = useTaskContext();
  onContextReady(context);
  return null;
};

describe('TaskContext', () => {
  it('adds a new task correctly', () => {
    let context;
    render(
      <TaskProvider>
        <TestComponent onContextReady={(c) => context = c} />
      </TaskProvider>
    );

    const initialCount = context.tasks.length;
    
    act(() => {
      context.addTask({ title: 'Test Task', description: 'Test Desc', priority: 'High', assignee: 'Me' });
    });

    expect(context.tasks.length).toBe(initialCount + 1);
    expect(context.tasks[context.tasks.length - 1].title).toBe('Test Task');
  });

  it('updates task status correctly', () => {
    let context;
    render(
      <TaskProvider>
        <TestComponent onContextReady={(c) => context = c} />
      </TaskProvider>
    );

    const taskToUpdate = context.tasks[0];
    const newStatus = 'Done';

    act(() => {
      context.updateTaskStatus(taskToUpdate.id, newStatus);
    });

    const updatedTask = context.tasks.find(t => t.id === taskToUpdate.id);
    expect(updatedTask.status).toBe(newStatus);
    // completedAt might be set or not depending on the implementation
    if (updatedTask.status === 'Done' && context.toasts) {
      expect(context.toasts.length).toBeGreaterThan(0);
    }
  });
});
