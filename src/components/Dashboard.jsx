import { useTaskContext } from '../contexts/TaskContext';
import { CheckCircle2, Clock, AlertCircle, BarChart3, Activity } from 'lucide-react';

function StatCard({ title, value, icon: Icon, trend, colorClass }) {
  return (
    <div className="bg-surface rounded-xl p-6 border border-border shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-textSecondary mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-textPrimary">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${colorClass}`}>
          <Icon size={24} />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center text-sm">
          <span className="text-success font-medium">{trend}</span>
          <span className="text-textSecondary ml-2">vs last week</span>
        </div>
      )}
    </div>
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Workspace Overview</h1>
        <p className="text-textSecondary mt-2">Here's what's happening with your projects today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Active Tasks" 
          value={totalTasks - doneTasks} 
          icon={Activity} 
          trend="+12%"
          colorClass="bg-primary/10 text-primary"
        />
        <StatCard 
          title="In Progress" 
          value={inProgressTasks} 
          icon={Clock} 
          colorClass="bg-warning/10 text-warning"
        />
        <StatCard 
          title="High Priority" 
          value={highPriorityTasks} 
          icon={AlertCircle} 
          colorClass="bg-danger/10 text-danger"
        />
        <StatCard 
          title="Completion Rate" 
          value={`${completionRate}%`} 
          icon={CheckCircle2} 
          trend="+5%"
          colorClass="bg-success/10 text-success"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface rounded-xl border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <BarChart3 size={20} className="text-primary" />
              Recent Activity
            </h2>
          </div>
          <div className="space-y-6">
            {tasks.slice(0, 4).map((task) => (
              <div key={task.id} className="flex gap-4 items-start relative group">
                <div className="w-10 h-10 rounded-full bg-border flex items-center justify-center flex-shrink-0 z-10 border-4 border-surface">
                  {task.status === 'Done' ? (
                    <CheckCircle2 size={16} className="text-success" />
                  ) : (
                    <Clock size={16} className="text-textSecondary" />
                  )}
                </div>
                <div className="flex-1 pb-6 border-b border-border/50 group-last:border-0 group-last:pb-0">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-medium text-textPrimary">{task.title}</p>
                    <span className="text-xs text-textSecondary">{task.dueDate}</span>
                  </div>
                  <p className="text-sm text-textSecondary">{task.description}</p>
                  <div className="mt-2 flex gap-2">
                    <span className="text-xs px-2 py-1 bg-surface border border-border rounded-md text-textSecondary">
                      {task.assignee}
                    </span>
                  </div>
                </div>
                {/* Vertical line connecting timeline items */}
                <div className="absolute left-5 top-10 bottom-0 w-px bg-border -z-0 group-last:hidden"></div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-border p-6 shadow-sm">
           <h2 className="text-lg font-semibold text-white mb-6">Upcoming Deadlines</h2>
           <div className="space-y-4">
            {tasks.filter(t => t.status !== 'Done')
                  .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                  .slice(0, 5)
                  .map(task => (
              <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50 hover:border-primary/50 transition-colors">
                <div className="flex flex-col gap-1 overflow-hidden">
                  <span className="text-sm font-medium text-textPrimary truncate">{task.title}</span>
                  <span className={`text-xs w-max px-2 py-0.5 rounded-full ${
                    task.priority === 'High' ? 'bg-danger/20 text-danger' : 
                    task.priority === 'Medium' ? 'bg-warning/20 text-warning' : 'bg-success/20 text-success'
                  }`}>
                    {task.priority}
                  </span>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-sm font-medium text-textSecondary">{new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
            ))}
           </div>
        </div>
      </div>
    </div>
  );
}
