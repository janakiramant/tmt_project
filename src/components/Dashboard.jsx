import { useTaskContext } from '../contexts/TaskContext';
import { CheckCircle2, Clock, AlertCircle, BarChart3, Activity, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';

function StatCard({ title, value, icon: Icon, trend, colorClass }) {
  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className="bg-surface rounded-3xl p-6 border border-border shadow-bento"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-semibold text-textSecondary mb-1 uppercase tracking-wider">{title}</p>
          <h3 className="text-4xl font-bold text-textPrimary tracking-tight">{value}</h3>
        </div>
        <div className={`p-3 rounded-2xl ${colorClass}`}>
          <Icon size={24} />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center text-sm font-medium">
          <span className="text-success bg-success/10 px-2 py-0.5 rounded-md">{trend}</span>
          <span className="text-textSecondary ml-2">vs last week</span>
        </div>
      )}
    </motion.div>
  );
}

// Gamified visual growth component
function ProjectGrowth({ completionRate }) {
  let stage = 0; // seed
  if (completionRate > 20) stage = 1; // sprout
  if (completionRate > 50) stage = 2; // small plant
  if (completionRate > 80) stage = 3; // tree
  if (completionRate === 100) stage = 4; // blooming tree

  const emojis = ['🌱', '🌿', '🪴', '🌳', '🌸'];

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="bg-gradient-to-br from-success/20 to-primary/10 rounded-3xl p-6 border border-success/30 shadow-bento flex flex-col items-center justify-center relative overflow-hidden text-center"
    >
      <div className="absolute -right-4 -top-4 text-success/20">
        <Leaf size={120} />
      </div>
      <p className="text-sm font-semibold text-textSecondary mb-2 uppercase tracking-wider z-10">Project Growth</p>
      
      <motion.div 
        key={stage}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-6xl mb-2 z-10"
      >
        {emojis[stage]}
      </motion.div>
      
      <h3 className="text-2xl font-bold text-textPrimary z-10 mb-1">{completionRate}% Grown</h3>
      <p className="text-sm text-textSecondary z-10">Keep completing tasks!</p>
    </motion.div>
  );
}

export default function Dashboard() {
  const { tasks } = useTaskContext();

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter(t => t.status === 'Done').length;
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
  const highPriorityTasks = tasks.filter(t => t.priority === 'High' && t.status !== 'Done').length;
  
  const completionRate = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-textPrimary tracking-tight">Workspace Overview</h1>
        <p className="text-textSecondary font-medium mt-1">Let's grow your projects today! 🌱</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Active Tasks" 
          value={totalTasks - doneTasks} 
          icon={Activity} 
          trend="+12%"
          colorClass="bg-primary/10 text-primary"
        />
        <StatCard 
          title="In Progress" 
          value={inProgressTasks} 
          icon={Clock} 
          colorClass="bg-warning/20 text-warning"
        />
        <StatCard 
          title="High Priority" 
          value={highPriorityTasks} 
          icon={AlertCircle} 
          colorClass="bg-danger/20 text-danger"
        />
        <ProjectGrowth completionRate={completionRate} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div whileHover={{ y: -2 }} className="lg:col-span-2 bg-surface rounded-3xl border border-border p-6 shadow-bento">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-textPrimary flex items-center gap-2">
              <BarChart3 size={20} className="text-primary" />
              Recent Activity
            </h2>
          </div>
          <div className="space-y-6">
            {tasks.slice(0, 4).map((task) => (
              <div key={task.id} className="flex gap-4 items-start relative group">
                <div className="w-10 h-10 rounded-2xl bg-background flex items-center justify-center flex-shrink-0 z-10 border border-border shadow-sm">
                  {task.status === 'Done' ? (
                    <CheckCircle2 size={18} className="text-success" />
                  ) : (
                    <Clock size={18} className="text-textSecondary" />
                  )}
                </div>
                <div className="flex-1 pb-6 border-b border-border group-last:border-0 group-last:pb-0">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-bold text-textPrimary">{task.title}</p>
                    <span className="text-xs font-semibold text-textSecondary">{task.dueDate}</span>
                  </div>
                  <p className="text-sm font-medium text-textSecondary">{task.description}</p>
                  <div className="mt-3 flex gap-2 items-center">
                    <span className="text-xs font-semibold px-2 py-1 bg-background border border-border rounded-lg text-textSecondary">
                      {task.assignee}
                    </span>
                    {task.reactions && Object.keys(task.reactions).length > 0 && (
                      <div className="flex gap-1">
                        {Object.entries(task.reactions).map(([emoji, count]) => (
                          <span key={emoji} className="text-xs bg-background border border-border rounded-lg px-1.5 py-0.5">
                            {emoji} {count}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                {/* Vertical line connecting timeline items */}
                <div className="absolute left-5 top-10 bottom-0 w-px bg-border -z-0 group-last:hidden"></div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} className="bg-surface rounded-3xl border border-border p-6 shadow-bento">
           <h2 className="text-lg font-bold text-textPrimary mb-6">Upcoming Deadlines</h2>
           <div className="space-y-4">
            {tasks.filter(t => t.status !== 'Done')
                  .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                  .slice(0, 5)
                  .map(task => (
              <div key={task.id} className="flex items-center justify-between p-3 rounded-2xl bg-background border border-border hover:border-primary/50 transition-colors shadow-sm">
                <div className="flex flex-col gap-1 overflow-hidden">
                  <span className="text-sm font-bold text-textPrimary truncate">{task.title}</span>
                  <span className={`text-xs font-bold w-max px-2 py-0.5 rounded-lg ${
                    task.priority === 'High' ? 'bg-danger/20 text-danger' : 
                    task.priority === 'Medium' ? 'bg-warning/30 text-yellow-600' : 'bg-success/20 text-success'
                  }`}>
                    {task.priority}
                  </span>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-sm font-bold text-textSecondary">{new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
            ))}
           </div>
        </motion.div>
      </div>
    </div>
  );
}
