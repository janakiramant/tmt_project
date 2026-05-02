import { useState } from 'react';
import { useTaskContext } from '../contexts/TaskContext';
import { MoreHorizontal, MessageSquare, ArrowUpDown, SmilePlus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ListView() {
  const { tasks, updateTaskStatus, toggleTaskReaction } = useTaskContext();
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
      case 'High': return 'bg-danger/20 text-danger border-danger/20';
      case 'Medium': return 'bg-warning/30 text-yellow-600 border-warning/30';
      case 'Low': return 'bg-success/20 text-success border-success/20';
      default: return 'bg-border text-textSecondary';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Done': return 'bg-success/20 text-success border-success/30';
      case 'In Progress': return 'bg-primary/20 text-primary border-primary/30';
      case 'In Review': return 'bg-purple-500/20 text-purple-600 border-purple-500/30';
      default: return 'bg-background text-textSecondary border-border';
    }
  };

  const emojis = ['🚀', '👀', '✅', '🔥', '🎉'];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-textPrimary tracking-tight">List View</h1>
        <p className="text-textSecondary font-medium mt-2">Manage tasks in a highly-dense data grid.</p>
      </div>

      <motion.div whileHover={{ y: -2 }} className="bg-surface border border-border rounded-3xl shadow-bento overflow-hidden p-2">
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-background text-xs uppercase tracking-wider text-textSecondary">
                <th className="p-4 font-bold cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('title')}>
                  <div className="flex items-center gap-2">Task Name <ArrowUpDown size={12} /></div>
                </th>
                <th className="p-4 font-bold cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('status')}>
                  <div className="flex items-center gap-2">Status <ArrowUpDown size={12} /></div>
                </th>
                <th className="p-4 font-bold cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('priority')}>
                  <div className="flex items-center gap-2">Priority <ArrowUpDown size={12} /></div>
                </th>
                <th className="p-4 font-bold cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('assignee')}>
                  <div className="flex items-center gap-2">Assignee <ArrowUpDown size={12} /></div>
                </th>
                <th className="p-4 font-bold cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('dueDate')}>
                  <div className="flex items-center gap-2">Due Date <ArrowUpDown size={12} /></div>
                </th>
                <th className="p-4 font-bold text-center">Activity</th>
                <th className="p-4 font-bold text-center">Reactions</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-border bg-surface">
              {sortedTasks.map((task) => (
                <tr key={task.id} className="hover:bg-background transition-colors group">
                  <td className="p-4 font-bold text-textPrimary max-w-[250px] truncate" title={task.title}>
                    {task.title}
                  </td>
                  <td className="p-4">
                    <select 
                      value={task.status}
                      onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg border appearance-none outline-none cursor-pointer ${getStatusColor(task.status)}`}
                    >
                      <option className="bg-surface text-textPrimary" value="To Do">To Do</option>
                      <option className="bg-surface text-textPrimary" value="In Progress">In Progress</option>
                      <option className="bg-surface text-textPrimary" value="In Review">In Review</option>
                      <option className="bg-surface text-textPrimary" value="Done">Done</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <span className={`inline-block text-xs font-bold px-3 py-1 rounded-lg border ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="p-4 font-medium text-textSecondary flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-border flex items-center justify-center text-xs font-bold text-textPrimary shadow-sm">
                      {task.assignee.charAt(0)}
                    </div>
                    {task.assignee}
                  </td>
                  <td className="p-4 font-medium text-textSecondary">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-center">
                    {task.comments.length > 0 ? (
                      <span className="inline-flex items-center gap-1.5 font-bold text-textSecondary text-xs bg-background px-2 py-1 rounded-lg border border-border">
                        <MessageSquare size={14} /> {task.comments.length}
                      </span>
                    ) : (
                      <span className="text-textSecondary/30">-</span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1 relative group/reaction">
                       {task.reactions && Object.entries(task.reactions).slice(0,2).map(([emoji, count]) => (
                         <span key={emoji} className="text-xs bg-background border border-border rounded-lg px-1.5 py-0.5">
                           {emoji} {count}
                         </span>
                       ))}
                       <button className="text-textSecondary hover:text-primary transition-colors ml-1 p-1 bg-background rounded-lg border border-border">
                         <SmilePlus size={14} />
                       </button>
                       {/* Quick react popup */}
                       <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-surface border border-border shadow-bento rounded-xl p-1.5 flex gap-1 opacity-0 invisible group-hover/reaction:opacity-100 group-hover/reaction:visible transition-all z-10">
                         {emojis.map(e => (
                           <button 
                             key={e} 
                             onClick={() => toggleTaskReaction(task.id, e)}
                             className="hover:bg-background rounded-lg p-1 transition-colors"
                           >
                             {e}
                           </button>
                         ))}
                       </div>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button className="p-1.5 text-textSecondary hover:text-primary hover:bg-primary/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
