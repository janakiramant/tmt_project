import { useState } from 'react';
import { useTaskContext } from '../contexts/TaskContext';
import { MessageSquare, Calendar, Clock, User, Plus } from 'lucide-react';

const columns = ['To Do', 'In Progress', 'In Review', 'Done'];

function TaskCard({ task, onStatusChange, onClick }) {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-danger/20 text-danger border-danger/20';
      case 'Medium': return 'bg-warning/20 text-warning border-warning/20';
      case 'Low': return 'bg-success/20 text-success border-success/20';
      default: return 'bg-border text-textSecondary';
    }
  };

  return (
    <div 
      onClick={() => onClick(task)}
      className="bg-surface border border-border p-4 rounded-xl shadow-sm hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group active:scale-[0.98]"
    >
      <div className="flex justify-between items-start mb-3">
        <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full border ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
        {task.comments.length > 0 && (
          <div className="flex items-center text-textSecondary text-xs gap-1">
            <MessageSquare size={12} />
            <span>{task.comments.length}</span>
          </div>
        )}
      </div>
      
      <h4 className="font-semibold text-textPrimary mb-2 leading-tight group-hover:text-primary transition-colors">{task.title}</h4>
      
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
        <div className="flex -space-x-2">
           <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white border-2 border-surface" title={task.assignee}>
              {task.assignee.charAt(0)}
           </div>
        </div>
        <div className="flex items-center text-xs text-textSecondary gap-1">
          <Calendar size={12} />
          <span>{new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
        </div>
      </div>
    </div>
  );
}

export default function KanbanBoard() {
  const { tasks, updateTaskStatus, addComment, currentUser } = useTaskContext();
  const [selectedTask, setSelectedTask] = useState(null);
  const [newComment, setNewComment] = useState('');

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData('taskId', id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, status) => {
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      updateTaskStatus(taskId, status);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col animate-in fade-in duration-500">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Kanban Board</h1>
          <p className="text-textSecondary mt-1">Drag and drop tasks to update workflow stages.</p>
        </div>
        <button className="bg-primary hover:bg-primaryHover text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
          <Plus size={18} />
          New Task
        </button>
      </div>

      <div className="flex-1 flex gap-6 overflow-x-auto pb-4 custom-scrollbar">
        {columns.map(column => (
          <div 
            key={column} 
            className="flex flex-col min-w-[320px] w-[320px] bg-surface/50 rounded-2xl p-4 border border-border"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column)}
          >
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="font-semibold text-textPrimary flex items-center gap-2">
                {column}
                <span className="bg-background text-textSecondary text-xs px-2 py-0.5 rounded-full border border-border">
                  {tasks.filter(t => t.status === column).length}
                </span>
              </h3>
            </div>
            
            <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-1">
              {tasks.filter(task => task.status === column).map(task => (
                <div 
                  key={task.id} 
                  draggable 
                  onDragStart={(e) => handleDragStart(e, task.id)}
                >
                  <TaskCard task={task} onStatusChange={updateTaskStatus} onClick={setSelectedTask} />
                </div>
              ))}
              {/* Drop Zone hint */}
              <div className="h-20 rounded-xl border-2 border-dashed border-border/50 bg-background/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                 <span className="text-textSecondary text-sm">Drop here</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Task Detail Modal - Simple implementation */}
      {selectedTask && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-border w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            
            <div className="p-6 border-b border-border flex justify-between items-start bg-background/50">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm text-textSecondary font-mono">{selectedTask.id}</span>
                  <span className={`text-xs px-2 py-1 rounded-md ${
                    selectedTask.status === 'Done' ? 'bg-success/20 text-success' : 'bg-primary/20 text-primary'
                  }`}>
                    {selectedTask.status}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-white">{selectedTask.title}</h2>
              </div>
              <button 
                onClick={() => setSelectedTask(null)}
                className="p-2 hover:bg-border rounded-lg text-textSecondary hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <div className="grid grid-cols-2 gap-4 bg-background/50 p-4 rounded-xl border border-border/50">
                <div>
                  <span className="text-xs text-textSecondary uppercase tracking-wider font-semibold block mb-1">Assignee</span>
                  <div className="flex items-center gap-2 text-textPrimary">
                    <User size={16} className="text-primary" />
                    {selectedTask.assignee}
                  </div>
                </div>
                <div>
                  <span className="text-xs text-textSecondary uppercase tracking-wider font-semibold block mb-1">Due Date</span>
                  <div className="flex items-center gap-2 text-textPrimary">
                    <Calendar size={16} className="text-warning" />
                    {new Date(selectedTask.dueDate).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <span className="text-xs text-textSecondary uppercase tracking-wider font-semibold block mb-1">Priority</span>
                  <span className={`inline-block text-xs px-2 py-1 rounded-md font-medium border ${
                    selectedTask.priority === 'High' ? 'bg-danger/10 text-danger border-danger/20' : 
                    selectedTask.priority === 'Medium' ? 'bg-warning/10 text-warning border-warning/20' : 'bg-success/10 text-success border-success/20'
                  }`}>
                    {selectedTask.priority}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
                <p className="text-textSecondary leading-relaxed bg-background p-4 rounded-xl border border-border">
                  {selectedTask.description}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <MessageSquare size={18} />
                  Activity & Comments
                </h3>
                <div className="space-y-4">
                  {selectedTask.comments.map(comment => (
                    <div key={comment.id} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-border flex items-center justify-center flex-shrink-0 text-xs font-bold text-white">
                        {comment.author.charAt(0)}
                      </div>
                      <div className="flex-1 bg-background p-4 rounded-xl rounded-tl-none border border-border">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-sm text-textPrimary">{comment.author}</span>
                          <span className="text-xs text-textSecondary">
                            {new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-sm text-textSecondary">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 text-xs font-bold text-white mt-1">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <textarea 
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment or update..."
                      className="w-full bg-background border border-border rounded-xl p-3 text-sm text-textPrimary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary min-h-[80px] resize-none"
                    />
                    <div className="flex justify-end">
                      <button 
                        onClick={() => {
                          if (newComment.trim()) {
                            addComment(selectedTask.id, newComment);
                            setNewComment('');
                            // Re-fetch selected task implicitly via context update, 
                            // simpler approach for this demo:
                            setSelectedTask({
                              ...selectedTask,
                              comments: [...selectedTask.comments, {
                                id: `c-${Date.now()}`,
                                author: currentUser.name,
                                text: newComment,
                                timestamp: new Date().toISOString()
                              }]
                            })
                          }
                        }}
                        disabled={!newComment.trim()}
                        className="bg-primary hover:bg-primaryHover disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Comment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
}
