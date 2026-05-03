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
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-3 pointer-events-none w-full max-w-sm">
      <AnimatePresence mode="popLayout">
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: -40, scale: 0.9, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.9, filter: 'blur(4px)', transition: { duration: 0.2 } }}
            className="bg-surface/80 backdrop-blur-md border border-primary/20 shadow-xl rounded-2xl p-4 flex items-center gap-4 pointer-events-auto w-max min-w-[280px]"
          >
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-xl shadow-inner border border-primary/10">
                {toast.emoji}
            </div>
            <p className="text-sm font-bold text-textPrimary tracking-tight">{toast.message}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function Sidebar() {
  const { currentUser, teamPulse, setTeamPulse, logout } = useTaskContext();
  
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
          <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20" aria-hidden="true">
            <span className="text-sm">⚡</span>
          </div>
          CollabHub
        </h1>
        <div className="mt-4 p-3 bg-background rounded-xl border border-border">
          <div className="text-xs font-semibold text-textSecondary uppercase tracking-wider mb-2 flex items-center gap-1">
            <Activity size={12} aria-hidden="true" /> Team Pulse
          </div>
          <div className="group relative cursor-pointer flex items-center gap-2 text-sm font-medium text-textPrimary hover:text-primary transition-colors" tabIndex={0} aria-label="Current Team Pulse Status">
             <span className="text-lg" aria-hidden="true">{teamPulse.emoji}</span>
             <span className="truncate">{teamPulse.status}</span>
             
             {/* Simple hover dropdown for status */}
             <div className="absolute top-full left-0 mt-2 w-48 bg-surface border border-border rounded-xl shadow-bento p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
               {statuses.map(s => (
                 <button 
                   key={s.status}
                   className="w-full text-left flex items-center gap-2 p-2 hover:bg-background rounded-lg text-sm transition-colors focus:outline-none focus:bg-background"
                   onClick={() => setTeamPulse(s)}
                 >
                   <span aria-hidden="true">{s.emoji}</span> {s.status}
                 </button>
               ))}
             </div>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-2" aria-label="Main Navigation">
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            `flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${isActive ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-textSecondary hover:text-textPrimary hover:bg-background'}`
          }
        >
          <LayoutDashboard size={18} aria-hidden="true" />
          <span className="font-semibold">Dashboard</span>
        </NavLink>
        <NavLink 
          to="/board" 
          className={({ isActive }) => 
            `flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${isActive ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-textSecondary hover:text-textPrimary hover:bg-background'}`
          }
        >
          <Kanban size={18} aria-hidden="true" />
          <span className="font-semibold">Kanban Board</span>
        </NavLink>
        <NavLink 
          to="/list" 
          className={({ isActive }) => 
            `flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${isActive ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-textSecondary hover:text-textPrimary hover:bg-background'}`
          }
        >
          <List size={18} aria-hidden="true" />
          <span className="font-semibold">List View</span>
        </NavLink>
      </nav>

      <div className="p-4 border-t border-border mt-auto bg-surface">
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-textSecondary hover:text-danger hover:bg-danger/10 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-danger"
          aria-label="Logout"
        >
          <Settings size={18} aria-hidden="true" />
          <span className="font-medium">Logout</span>
        </button>
        <div className="mt-4 flex items-center gap-3 px-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-sm" aria-hidden="true">
            {currentUser?.name.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <div className="text-sm font-bold text-textPrimary truncate">{currentUser?.name}</div>
            <div className="text-xs font-medium text-textSecondary">{currentUser?.role}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MainLayout() {
  const { currentUser, loading, login } = useTaskContext();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="bg-surface p-8 rounded-3xl shadow-bento border border-border max-w-md w-full text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20 mx-auto mb-6">
            <span className="text-2xl" aria-hidden="true">⚡</span>
          </div>
          <h1 className="text-3xl font-bold text-textPrimary tracking-tight mb-2">CollabHub</h1>
          <p className="text-textSecondary mb-8">Sign in to access your enterprise workspace.</p>
          <button 
            onClick={login}
            className="w-full bg-primary hover:bg-primaryHover text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="flex min-h-screen bg-background text-textPrimary font-sans selection:bg-primary/30">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto" id="main-content" tabIndex="-1">
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

function App() {
  return <MainLayout />;
}

export default App;
