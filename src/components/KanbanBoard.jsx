import { useState } from 'react';
import { useTaskContext } from '../contexts/TaskContext';
import { MessageSquare, Calendar, Clock, User, Plus, Sparkles } from 'lucide-react';
import { generateTaskSummary } from '../lib/gemini';

const columns = ['To Do', 'In Progress', 'In Review', 'Done'];

function TaskCard({ task, onStatusChange, onClick }) {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-[#B91C1C] text-white border-[#B91C1C]'; // High contrast red
      case 'Medium': return 'bg-[#CA8A04] text-white border-[#CA8A04]'; // High contrast amber
      case 'Low': return 'bg-[#15803D] text-white border-[#15803D]'; // High contrast green
      default: return 'bg-gray-700 text-white border-gray-700';
    }
  };

  return (
    <div 
      role="button"
      tabIndex={0}
      aria-label={`Task: ${task.title}, Priority: ${task.priority}, Status: ${task.status}`}
      onClick={() => onClick(task)}
      onKeyDown={(e) => { if(e.key === 'Enter') onClick(task); }}
      className="bg-surface border border-border p-5 rounded-3xl shadow-sm hover:border-primary/50 hover:shadow-bento transition-all cursor-pointer group active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary"
    >
      <div className="flex justify-between items-start mb-3">
        <span className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-lg border ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
        {task.comments.length > 0 && (
          <div className="flex items-center text-textSecondary text-xs gap-1 font-bold">
            <MessageSquare size={12} />
            <span>{task.comments.length}</span>
          </div>
        )}
      </div>
      
      <h4 className="font-bold text-textPrimary mb-3 leading-tight group-hover:text-primary transition-colors">{task.title}</h4>
      
      {task.reactions && Object.keys(task.reactions).length > 0 && (
        <div className="flex gap-1 mb-3 flex-wrap">
          {Object.entries(task.reactions).map(([emoji, count]) => (
            <span key={emoji} className="text-[10px] bg-background border border-border rounded-lg px-1.5 py-0.5">
              {emoji} {count}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-2 pt-4 border-t border-border">
        <div className="flex -space-x-2">
           <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white border-2 border-surface shadow-sm" title={task.assignee}>
              {task.assignee.charAt(0)}
           </div>
        </div>
        <div className="flex items-center text-xs text-textSecondary gap-1 font-bold">
          <Calendar size={12} />
          <span>{new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
        </div>
      </div>
    </div>
  );
}

export default function KanbanBoard() {
  const { tasks, updateTaskStatus, addComment, currentUser, addTask } = useTaskContext();
  const [selectedTask, setSelectedTask] = useState(null);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [aiSummary, setAiSummary] = useState('');
  const [generatingSummary, setGeneratingSummary] = useState(false);

  const [newTaskData, setNewTaskData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    assignee: currentUser?.name || '',
    dueDate: new Date().toISOString().split('T')[0]
  });

  const handleGenerateSummary = async (task) => {
    setGeneratingSummary(true);
    const summary = await generateTaskSummary(task.title, task.description);
    setAiSummary(summary);
    setGeneratingSummary(false);
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTaskData.title.trim()) {
      addTask(newTaskData);
      setShowNewTaskModal(false);
      setNewTaskData({
        title: '',
        description: '',
        priority: 'Medium',
        assignee: currentUser?.name || '',
        dueDate: new Date().toISOString().split('T')[0]
      });
    }
  };

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
          <h1 className="text-3xl font-bold text-textPrimary tracking-tight">Kanban Board</h1>
          <p className="text-textSecondary font-medium mt-1">Drag and drop tasks to update workflow stages.</p>
        </div>
        <button 
          onClick={() => setShowNewTaskModal(true)}
          className="bg-primary hover:bg-primaryHover text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-md shadow-primary/20"
        >
          <Plus size={18} />
          New Task
        </button>
      </div>

      <div className="flex-1 flex gap-6 overflow-x-auto pb-4 custom-scrollbar" role="region" aria-label="Kanban Columns">
        {columns.map(column => (
          <div 
            key={column} 
            className="flex flex-col min-w-[320px] w-[320px] bg-background/50 rounded-3xl p-4 border border-border"
            role="list"
            aria-label={`${column} column`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column)}
          >
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="font-bold text-textPrimary flex items-center gap-2">
                {column}
                <span className="bg-surface text-textSecondary text-xs px-2.5 py-0.5 rounded-lg border border-border shadow-sm" aria-label={`${tasks.filter(t => t.status === column).length} tasks`}>
                  {tasks.filter(t => t.status === column).length}
                </span>
              </h3>
            </div>
            
            <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-1">
              {tasks.filter(task => task.status === column).map(task => (
                <div 
                  key={task.id} 
                  draggable 
                  role="listitem"
                  aria-grabbed="false"
                  onDragStart={(e) => {
                    handleDragStart(e, task.id);
                    e.currentTarget.setAttribute('aria-grabbed', 'true');
                  }}
                  onDragEnd={(e) => e.currentTarget.setAttribute('aria-grabbed', 'false')}
                >
                  <TaskCard task={task} onStatusChange={updateTaskStatus} onClick={setSelectedTask} />
                </div>
              ))}
              {/* Drop Zone hint */}
              <div className="h-20 rounded-2xl border-2 border-dashed border-border bg-surface/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity" aria-hidden="true">
                 <span className="text-textSecondary font-medium text-sm">Drop here</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Task Modal */}
      {showNewTaskModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-border w-full max-w-md rounded-3xl shadow-bento flex flex-col">
            <div className="p-6 border-b border-border flex justify-between items-center bg-background">
              <h2 className="text-xl font-bold text-textPrimary">Create New Task</h2>
              <button onClick={() => setShowNewTaskModal(false)} className="text-textSecondary hover:text-textPrimary">✕</button>
            </div>
            <form onSubmit={handleAddTask} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-textSecondary uppercase block mb-1">Title</label>
                <input 
                  autoFocus
                  required
                  type="text" 
                  value={newTaskData.title}
                  onChange={e => setNewTaskData({...newTaskData, title: e.target.value})}
                  placeholder="Task title..."
                  className="w-full bg-background border border-border rounded-xl p-3 text-sm font-medium text-textPrimary focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-textSecondary uppercase block mb-1">Description</label>
                <textarea 
                  required
                  value={newTaskData.description}
                  onChange={e => setNewTaskData({...newTaskData, description: e.target.value})}
                  placeholder="Task details..."
                  className="w-full bg-background border border-border rounded-xl p-3 text-sm font-medium text-textPrimary focus:outline-none focus:border-primary min-h-[100px] resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-textSecondary uppercase block mb-1">Priority</label>
                  <select 
                    value={newTaskData.priority}
                    onChange={e => setNewTaskData({...newTaskData, priority: e.target.value})}
                    className="w-full bg-background border border-border rounded-xl p-3 text-sm font-bold text-textPrimary focus:outline-none focus:border-primary appearance-none"
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-textSecondary uppercase block mb-1">Due Date</label>
                  <input 
                    type="date" 
                    value={newTaskData.dueDate}
                    onChange={e => setNewTaskData({...newTaskData, dueDate: e.target.value})}
                    className="w-full bg-background border border-border rounded-xl p-3 text-sm font-bold text-textPrimary focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full bg-primary hover:bg-primaryHover text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-primary/20"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-border w-full max-w-2xl rounded-3xl shadow-bento flex flex-col max-h-[90vh] overflow-hidden">
            
            <div className="p-6 border-b border-border flex justify-between items-start bg-background">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-sm text-textSecondary font-mono font-bold">{selectedTask.id}</span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-lg ${
                    selectedTask.status === 'Done' ? 'bg-success/20 text-success' : 'bg-primary/20 text-primary'
                  }`}>
                    {selectedTask.status}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-textPrimary">{selectedTask.title}</h2>
              </div>
              <button 
                onClick={() => {
                  setSelectedTask(null);
                  setAiSummary('');
                }}
                className="p-2 hover:bg-border rounded-xl text-textSecondary hover:text-textPrimary transition-colors"
                aria-label="Close Modal"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <div className="grid grid-cols-2 gap-4 bg-background p-5 rounded-3xl border border-border shadow-sm">
                <div>
                  <span className="text-xs text-textSecondary uppercase tracking-wider font-bold block mb-2">Assignee</span>
                  <div className="flex items-center gap-2 text-textPrimary font-bold">
                    <User size={16} className="text-primary" />
                    {selectedTask.assignee}
                  </div>
                </div>
                <div>
                  <span className="text-xs text-textSecondary uppercase tracking-wider font-bold block mb-2">Due Date</span>
                  <div className="flex items-center gap-2 text-textPrimary font-bold">
                    <Calendar size={16} className="text-warning" />
                    {new Date(selectedTask.dueDate).toLocaleDateString()}
                  </div>
                </div>
                <div className="col-span-2">
                  <span className="text-xs text-textSecondary uppercase tracking-wider font-bold block mb-2">Priority</span>
                  <span className={`inline-block text-xs px-3 py-1 rounded-lg font-bold border ${
                    selectedTask.priority === 'High' ? 'bg-danger/10 text-danger border-danger/20' : 
                    selectedTask.priority === 'Medium' ? 'bg-warning/10 text-yellow-600 border-warning/20' : 'bg-success/10 text-success border-success/20'
                  }`}>
                    {selectedTask.priority}
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-textPrimary">Description</h3>
                  <button 
                    onClick={() => handleGenerateSummary(selectedTask)}
                    disabled={generatingSummary}
                    className="flex items-center gap-2 text-xs font-bold bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Sparkles size={14} />
                    {generatingSummary ? 'Summarizing...' : 'AI Summary'}
                  </button>
                </div>

                {aiSummary && (
                  <div className="mb-4 bg-primary/5 border border-primary/20 p-4 rounded-2xl">
                    <div className="flex items-center gap-2 text-primary font-bold text-sm mb-1">
                      <Sparkles size={14} /> AI Summary
                    </div>
                    <p className="text-sm font-medium text-textPrimary">{aiSummary}</p>
                  </div>
                )}

                <p className="text-textSecondary font-medium leading-relaxed bg-background p-5 rounded-3xl border border-border shadow-sm">
                  {selectedTask.description}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-textPrimary mb-4 flex items-center gap-2">
                  <MessageSquare size={18} />
                  Activity & Comments
                </h3>
                <div className="space-y-4">
                  {selectedTask.comments.map(comment => (
                    <div key={comment.id} className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-border flex items-center justify-center flex-shrink-0 text-sm font-bold text-textPrimary shadow-sm border border-surface">
                        {comment.author.charAt(0)}
                      </div>
                      <div className="flex-1 bg-background p-4 rounded-3xl rounded-tl-none border border-border shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-sm text-textPrimary">{comment.author}</span>
                          <span className="text-xs font-semibold text-textSecondary">
                            {new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-textSecondary">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0 text-sm font-bold text-white mt-1 shadow-md shadow-primary/20 border border-surface">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="flex-1 flex flex-col gap-3">
                    <textarea 
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment or update..."
                      className="w-full bg-background border border-border rounded-2xl p-4 text-sm font-medium text-textPrimary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary min-h-[100px] resize-none shadow-sm"
                    />
                    <div className="flex justify-end">
                      <button 
                        onClick={() => {
                          if (newComment.trim()) {
                            addComment(selectedTask.id, newComment);
                            setNewComment('');
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
                        className="bg-primary hover:bg-primaryHover disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2 rounded-xl text-sm font-bold transition-colors shadow-md shadow-primary/20"
                      >
                        Send
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
