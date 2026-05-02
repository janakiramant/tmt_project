import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { LayoutDashboard, Kanban, List, Settings } from 'lucide-react';
import Dashboard from './components/Dashboard';
import KanbanBoard from './components/KanbanBoard';
import ListView from './components/ListView';
import { useTaskContext } from './contexts/TaskContext';

function Sidebar() {
  const { currentUser } = useTaskContext();
  
  return (
    <div className="w-64 bg-surface border-r border-border flex flex-col h-screen sticky top-0">
      <div className="p-6">
        <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
            <span className="text-sm">⚡</span>
          </div>
          CollabHub
        </h1>
        <div className="mt-2 text-xs text-textSecondary uppercase tracking-wider font-semibold">
          {currentUser.role} View
        </div>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-4">
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-textSecondary hover:text-textPrimary hover:bg-border/50'}`
          }
        >
          <LayoutDashboard size={18} />
          <span className="font-medium">Dashboard</span>
        </NavLink>
        <NavLink 
          to="/board" 
          className={({ isActive }) => 
            `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-textSecondary hover:text-textPrimary hover:bg-border/50'}`
          }
        >
          <Kanban size={18} />
          <span className="font-medium">Kanban Board</span>
        </NavLink>
        <NavLink 
          to="/list" 
          className={({ isActive }) => 
            `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-textSecondary hover:text-textPrimary hover:bg-border/50'}`
          }
        >
          <List size={18} />
          <span className="font-medium">List View</span>
        </NavLink>
      </nav>

      <div className="p-4 border-t border-border mt-auto">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-textSecondary hover:text-textPrimary hover:bg-border/50 cursor-pointer transition-colors">
          <Settings size={18} />
          <span className="font-medium">Settings</span>
        </div>
        <div className="mt-4 flex items-center gap-3 px-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center text-white font-bold text-sm">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <div className="text-sm font-medium text-textPrimary">{currentUser.name}</div>
            <div className="text-xs text-textSecondary">{currentUser.role}</div>
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
      </div>
    </Router>
  );
}

export default App;
