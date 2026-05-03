import { useState } from 'react';
import { useTaskContext } from '../contexts/TaskContext';
import { MoreHorizontal, MessageSquare, ArrowUpDown, SmilePlus, Trash2, Copy, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ListView() {
  const { tasks, updateTaskStatus, toggleTaskReaction, deleteTask, duplicateTask } = useTaskContext();
  const [sortField, setSortField] = useState('dueDate');
  const [sortDesc, setSortDesc] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

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
    <div className="animate-in fade-in duration-500 relative">
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
                  <td className="p-4 text-right relative">
                    <button 
                      onClick={() => setActiveMenu(activeMenu === task.id ? null : task.id)}
                      className={`p-1.5 rounded-lg transition-colors ${activeMenu === task.id ? 'bg-primary text-white' : 'text-textSecondary hover:text-primary hover:bg-primary/10 opacity-0 group-hover:opacity-100'}`}
                    >
                      <MoreHorizontal size={18} />
                    </button>
                    
                    {/* Action Menu Dropdown */}
                    <AnimatePresence>
                      {activeMenu === task.id && (
                        <>
                          <div className="fixed inset-0 z-20" onClick={() => setActiveMenu(null)} />
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            className="absolute right-4 top-full mt-1 bg-surface border border-border shadow-bento rounded-2xl p-2 z-30 min-w-[180px] text-left"
                          >
                            <div className="px-3 py-1 mb-2">
                                <span className="text-[10px] font-bold text-textSecondary uppercase tracking-widest">Move to Stage</span>
                            </div>
                            <div className="grid grid-cols-1 gap-1 mb-3">
                                {['To Do', 'In Progress', 'In Review', 'Done'].map(status => (
                                    <button 
                                        key={status}
                                        onClick={() => {
                                            updateTaskStatus(task.id, status);
                                            setActiveMenu(null);
                                        }}
                                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                                            task.status === status ? 'bg-primary/10 text-primary' : 'hover:bg-background text-textSecondary'
                                        }`}
                                    >
                                        {status}
                                        {task.status === status && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                                    </button>
                                ))}
                            </div>

                            <div className="h-px bg-border my-2" />
                            
                            <div className="px-3 py-1 mb-1">
                                <span className="text-[10px] font-bold text-textSecondary uppercase tracking-widest">Manage Task</span>
                            </div>
                            <button 
                              onClick={() => {
                                duplicateTask(task);
                                setActiveMenu(null);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-textPrimary hover:bg-background rounded-xl transition-colors"
                            >
                              <Copy size={14} className="text-primary" /> Duplicate
                            </button>
                            <button 
                              onClick={() => {
                                setDeleteConfirm(task.id);
                                setActiveMenu(null);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-danger hover:bg-danger/10 rounded-xl transition-colors"
                            >
                              <Trash2 size={14} /> Delete Task
                            </button>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-surface border border-border w-full max-w-sm rounded-3xl shadow-bento p-6 text-center"
            >
              <div className="w-16 h-16 bg-danger/10 text-danger rounded-2xl flex items-center justify-center mx-auto mb-4 border border-danger/20">
                <AlertTriangle size={32} />
              </div>
              <h2 className="text-xl font-bold text-textPrimary mb-2">Delete Task?</h2>
              <p className="text-textSecondary text-sm mb-6 font-medium">Are you sure you want to remove this task? This action cannot be undone.</p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 bg-background border border-border hover:bg-border text-textPrimary font-bold py-2.5 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    deleteTask(deleteConfirm);
                    setDeleteConfirm(null);
                  }}
                  className="flex-1 bg-danger hover:bg-red-700 text-white font-bold py-2.5 rounded-xl transition-all shadow-md shadow-danger/20"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

