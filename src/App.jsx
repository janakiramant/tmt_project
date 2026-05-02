import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { LayoutDashboard, Kanban, List, Settings, Coffee, Gamepad2, Headphones, Activity } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Dashboard from './components/Dashboard';
import KanbanBoard from './components/KanbanBoard';
import ListView from './components/ListView';
import { useTaskContext } from './contexts/TaskContext';

function Toasts() {
  const { toasts } = useTaskContext();
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className="bg-surface border border-border shadow-bento rounded-lg p-4 flex items-center gap-3 pointer-events-auto"
          >
            <span className="text-xl">{toast.emoji}</span>
            <p className="text-sm font-medium text-textPrimary">{toast.message}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function Sidebar() {
  const { currentUser, teamPulse, setTeamPulse } = useTaskContext();
  
  const statuses = [
    { emoji: '☕', status: 'Deep Work Mode' },
    { emoji: '🎧', status: 'In a Meeting' },
    { emoji: '🚲', status: 'Cycling/AFK' },
    { emoji: '🚀', status: 'Shipping Code' }
  ];

  return (
    <div className="w-64 bg-surface border-r border-border flex flex-col h-screen sticky top-0 shadow-sm z-20">
      <div className="p-6">
        <h1 className="text-xl font-bold tracking-tight text-primary flex items-center gap-2">
          <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20">
            <span className="text-sm">⚡</span>
          </div>
          CollabHub
        </h1>
        <div className="mt-4 p-3 bg-background rounded-xl border border-border">
          <div className="text-xs font-semibold text-textSecondary uppercase tracking-wider mb-2 flex items-center gap-1">
            <Activity size={12} /> Team Pulse
          </div>
          <div className="group relative cursor-pointer flex items-center gap-2 text-sm font-medium text-textPrimary hover:text-primary transition-colors">
             <span className="text-lg">{teamPulse.emoji}</span>
             <span className="truncate">{teamPulse.status}</span>
             
             {/* Simple hover dropdown for status */}
             <div className="absolute top-full left-0 mt-2 w-48 bg-surface border border-border rounded-xl shadow-bento p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
               {statuses.map(s => (
                 <div 
                   key={s.status}
                   className="flex items-center gap-2 p-2 hover:bg-background rounded-lg text-sm transition-colors"
                   onClick={() => setTeamPulse(s)}
                 >
                   <span>{s.emoji}</span> {s.status}
                 </div>
               ))}
             </div>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-2">
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            `flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${isActive ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-textSecondary hover:text-textPrimary hover:bg-background'}`
          }
        >
          <LayoutDashboard size={18} />
          <span className="font-semibold">Dashboard</span>
        </NavLink>
        <NavLink 
          to="/board" 
          className={({ isActive }) => 
            `flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${isActive ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-textSecondary hover:text-textPrimary hover:bg-background'}`
          }
        >
          <Kanban size={18} />
          <span className="font-semibold">Kanban Board</span>
        </NavLink>
        <NavLink 
          to="/list" 
          className={({ isActive }) => 
            `flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${isActive ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-textSecondary hover:text-textPrimary hover:bg-background'}`
          }
        >
          <List size={18} />
          <span className="font-semibold">List View</span>
        </NavLink>
      </nav>

      <div className="p-4 border-t border-border mt-auto bg-surface">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl text-textSecondary hover:text-textPrimary hover:bg-background cursor-pointer transition-colors">
          <Settings size={18} />
          <span className="font-medium">Settings</span>
        </div>
        <div className="mt-4 flex items-center gap-3 px-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <div className="text-sm font-bold text-textPrimary">{currentUser.name}</div>
            <div className="text-xs font-medium text-textSecondary">{currentUser.role}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-background text-textPrimary font-sans selection:bg-primary/30">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/board" element={<KanbanBoard />} />
            <Route path="/list" element={<ListView />} />
          </Routes>
        </main>
        <Toasts />
      </div>
    </Router>
  );
}

export default App;
