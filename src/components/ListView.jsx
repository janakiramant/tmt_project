import { useState } from 'react';
import { useTaskContext } from '../contexts/TaskContext';
import { MoreHorizontal, MessageSquare, ArrowUpDown } from 'lucide-react';

export default function ListView() {
  const { tasks, updateTaskStatus } = useTaskContext();
  const [sortField, setSortField] = useState('dueDate');
  const [sortDesc, setSortDesc] = useState(false);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDesc(!sortDesc);
    } else {
      setSortField(field);
      setSortDesc(false);
    }
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    let comparison = 0;
    if (a[sortField] > b[sortField]) comparison = 1;
    if (a[sortField] < b[sortField]) comparison = -1;
    return sortDesc ? comparison * -1 : comparison;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-danger/10 text-danger border-danger/20';
      case 'Medium': return 'bg-warning/10 text-warning border-warning/20';
      case 'Low': return 'bg-success/10 text-success border-success/20';
      default: return 'bg-border text-textSecondary';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Done': return 'bg-success/10 text-success border-success/20';
      case 'In Progress': return 'bg-primary/10 text-primary border-primary/20';
      case 'In Review': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default: return 'bg-border text-textSecondary border-border';
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">List View</h1>
        <p className="text-textSecondary mt-2">Manage tasks in a highly-dense data grid.</p>
      </div>

      <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-background/50 text-xs uppercase tracking-wider text-textSecondary">
                <th className="p-4 font-semibold cursor-pointer hover:text-white" onClick={() => handleSort('title')}>
                  <div className="flex items-center gap-2">Task Name <ArrowUpDown size={12} /></div>
                </th>
                <th className="p-4 font-semibold cursor-pointer hover:text-white" onClick={() => handleSort('status')}>
                  <div className="flex items-center gap-2">Status <ArrowUpDown size={12} /></div>
                </th>
                <th className="p-4 font-semibold cursor-pointer hover:text-white" onClick={() => handleSort('priority')}>
                  <div className="flex items-center gap-2">Priority <ArrowUpDown size={12} /></div>
                </th>
                <th className="p-4 font-semibold cursor-pointer hover:text-white" onClick={() => handleSort('assignee')}>
                  <div className="flex items-center gap-2">Assignee <ArrowUpDown size={12} /></div>
                </th>
                <th className="p-4 font-semibold cursor-pointer hover:text-white" onClick={() => handleSort('dueDate')}>
                  <div className="flex items-center gap-2">Due Date <ArrowUpDown size={12} /></div>
                </th>
                <th className="p-4 font-semibold text-center">Activity</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-border/50">
              {sortedTasks.map((task) => (
                <tr key={task.id} className="hover:bg-background/30 transition-colors group">
                  <td className="p-4 font-medium text-white max-w-[250px] truncate" title={task.title}>
                    {task.title}
                  </td>
                  <td className="p-4">
                    <select 
                      value={task.status}
                      onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                      className={`text-xs px-2 py-1 rounded-md border appearance-none outline-none cursor-pointer ${getStatusColor(task.status)}`}
                    >
                      <option className="bg-surface text-textPrimary" value="To Do">To Do</option>
                      <option className="bg-surface text-textPrimary" value="In Progress">In Progress</option>
                      <option className="bg-surface text-textPrimary" value="In Review">In Review</option>
                      <option className="bg-surface text-textPrimary" value="Done">Done</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <span className={`inline-block text-xs px-2 py-1 rounded-full border ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="p-4 text-textSecondary flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-border flex items-center justify-center text-[10px] font-bold text-white">
                      {task.assignee.charAt(0)}
                    </div>
                    {task.assignee}
                  </td>
                  <td className="p-4 text-textSecondary">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-center">
                    {task.comments.length > 0 ? (
                      <span className="inline-flex items-center gap-1 text-textSecondary text-xs">
                        <MessageSquare size={14} /> {task.comments.length}
                      </span>
                    ) : (
                      <span className="text-textSecondary/30">-</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <button className="p-1.5 text-textSecondary hover:text-white rounded-md hover:bg-border transition-colors opacity-0 group-hover:opacity-100">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
