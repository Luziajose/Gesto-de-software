import React, { useState, useEffect, createContext, useContext } from 'react';
import { 
  Shield, 
  ShieldCheck,
  Zap, 
  Globe, 
  Terminal, 
  Settings, 
  Activity, 
  Search, 
  Cpu, 
  Network,
  Lock,
  Server as ServerIcon,
  Code,
  Info,
  ChevronRight,
  ArrowLeft,
  HardDrive,
  FolderOpen,
  CloudDownload,
  ArrowDownAz,
  Copy,
  RefreshCw,
  Wifi,
  FileText,
  Send,
  GitBranch,
  PlusCircle,
  Cloud,
  Trash2,
  LogOut,
  Bell,
  CheckCircle,
  FileDown,
  FileUp,
  Menu,
  MoreVertical,
  Download,
  Upload,
  Clock,
  Eye,
  Radio,
  Tag,
  Gauge,
  LayoutGrid,
  Share2,
  Star,
  Fingerprint,
  HelpCircle,
  X,
  Filter
} from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import Lottie from 'lottie-react';

// --- Types ---
type Tab = 'home' | 'dashboard' | 'payload' | 'host' | 'dns' | 'config' | 'ip' | 'ssh' | 'hwid' | 'tether' | 'notes' | 'v2ray' | 'iphunter' | 'addserver' | 'addtweaks' | 'settings' | 'tools' | 'help' | 'exportconfig' | 'importconfig';
type ConnectionMode = 'direct' | 'payload' | 'host' | 'sni' | 'dnstt' | 'import' | 'udp' | 'tcp';

interface Server {
  id: string;
  name: string;
  location: string;
  flag: string;
  ping: number;
  load: number;
}

interface IPInfo {
  ip: string;
  city: string;
  region: string;
  country: string;
  org: string;
  loc: string;
}

interface AppContextType {
  isConnected: boolean;
  setIsConnected: (v: boolean) => void;
  timer: string;
  speed: { down: number; up: number };
  ipInfo: IPInfo | null;
  selectedServer: string;
  setSelectedServer: (v: string) => void;
  selectedPort: number;
  setSelectedPort: (v: number) => void;
  isPortModalOpen: boolean;
  setIsPortModalOpen: (v: boolean) => void;
  isServerModalOpen: boolean;
  setIsServerModalOpen: (v: boolean) => void;
  isHelpModalOpen: boolean;
  setIsHelpModalOpen: (v: boolean) => void;
  runSpeedTest: () => void;
  isTesting: boolean;
  connectionMode: ConnectionMode;
  setConnectionMode: (v: ConnectionMode) => void;
  customSetup: boolean;
  setCustomSetup: (v: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [ipInfo, setIpInfo] = useState<IPInfo | null>(null);
  const [speed, setSpeed] = useState({ down: 0, up: 0 });
  const [isTesting, setIsTesting] = useState(false);
  const [connectionMode, setConnectionMode] = useState<ConnectionMode>('sni');
  const [customSetup, setCustomSetup] = useState(true);
  
  const [selectedServer, setSelectedServer] = useState<string>('ao');
  const [selectedPort, setSelectedPort] = useState<number>(443);
  const [isServerModalOpen, setIsServerModalOpen] = useState(false);
  const [isPortModalOpen, setIsPortModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [timer, setTimer] = useState('00:00:00');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isConnected) {
      const startTime = Date.now();
      interval = setInterval(() => {
        const diff = Date.now() - startTime;
        const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
        const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
        const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
        setTimer(`${h}:${m}:${s}`);
      }, 1000);
    } else {
      setTimer('00:00:00');
    }
    return () => clearInterval(interval);
  }, [isConnected]);

  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => setIpInfo(data))
      .catch(() => {});
  }, []);

  const runSpeedTest = () => {
    setIsTesting(true);
    let count = 0;
    const interval = setInterval(() => {
      setSpeed({
        down: Math.floor(Math.random() * 50) + 100,
        up: Math.floor(Math.random() * 20) + 30
      });
      count++;
      if (count > 20) {
        clearInterval(interval);
        setIsTesting(false);
      }
    }, 100);
  };

  return (
    <AppContext.Provider value={{
      isConnected, setIsConnected,
      timer,
      speed,
      ipInfo,
      selectedServer, setSelectedServer,
      selectedPort, setSelectedPort,
      isPortModalOpen, setIsPortModalOpen,
      isServerModalOpen, setIsServerModalOpen,
      isHelpModalOpen, setIsHelpModalOpen,
      runSpeedTest,
      isTesting,
      connectionMode, setConnectionMode,
      customSetup, setCustomSetup
    }}>
      {children}
    </AppContext.Provider>
  );
};

// --- Components ---

const Header = ({ onOpenUpdate, onOpenDrawer, activeTab, setActiveTab }: { onOpenUpdate: () => void, onOpenDrawer: () => void, activeTab: Tab, setActiveTab: (t: Tab) => void }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="h-16 bg-surface sticky top-0 z-50 px-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button 
          onClick={onOpenDrawer}
          className="p-2 hover:bg-white/5 rounded-full"
        >
          <Menu className="w-6 h-6 text-on-surface" />
        </button>
        <h1 className="text-lg font-bold tracking-tight">
          <span className="text-primary">VPN</span> FAST NET <span className="text-secondary">PRO</span>
        </h1>
      </div>

      <div className="flex items-center gap-1">
        <button className="p-2 hover:bg-white/5 rounded-full transition-colors relative">
          <Bell className="w-6 h-6 text-outline" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-surface" />
        </button>
        <button 
          onClick={onOpenUpdate}
          className="p-2 hover:bg-white/5 rounded-full transition-colors"
        >
          <RefreshCw className="w-6 h-6 text-outline" />
        </button>
        <div className="relative">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 hover:bg-white/5 rounded-full transition-colors"
          >
            <MoreVertical className="w-6 h-6 text-outline" />
          </button>
          
          {isMenuOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsMenuOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-[#25232A] rounded-2xl shadow-2xl z-20 overflow-hidden animate-in fade-in zoom-in duration-150">
                <button 
                  className="w-full flex items-center gap-3 px-4 py-4 text-sm text-zinc-300 hover:bg-white/5 transition-colors border-b border-white/5"
                  onClick={() => {
                    setIsMenuOpen(false);
                    setActiveTab('importconfig');
                  }}
                >
                  <FileDown className="w-5 h-5 text-primary" />
                  <span>Importar Configuração</span>
                </button>
                <button 
                  className="w-full flex items-center gap-3 px-4 py-4 text-sm text-zinc-300 hover:bg-white/5 transition-colors"
                  onClick={() => {
                    setIsMenuOpen(false);
                    setActiveTab('exportconfig');
                  }}
                >
                  <FileUp className="w-5 h-5 text-primary" />
                  <span>Exportar Configuração</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

const UpdateResourcesModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in duration-200">
        <div className="p-8 text-center space-y-6">
          <h2 className="text-3xl font-bold text-emerald-600 tracking-tight">Atualizar Recursos</h2>
          
          <div className="space-y-4 text-left">
            <div className="flex gap-3">
              <span className="text-emerald-600 font-bold">1.)</span>
              <p className="text-zinc-600 text-sm leading-relaxed">Atualização Online - requer conexão com a internet.</p>
            </div>
            <div className="flex gap-3">
              <span className="text-emerald-600 font-bold">2.)</span>
              <p className="text-zinc-600 text-sm leading-relaxed">Limpar Dados - Limpando todas as configurações.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <button 
              onClick={() => { alert('Atualizando recursos...'); onClose(); }}
              className="py-3 px-4 bg-emerald-50 text-emerald-700 rounded-full font-bold text-sm border border-emerald-100 hover:bg-emerald-100 transition-colors"
            >
              Atualização Online
            </button>
            <button 
              onClick={() => { if(confirm('Limpar todas as configurações?')) { window.location.reload(); } }}
              className="py-3 px-4 bg-emerald-50 text-emerald-700 rounded-full font-bold text-sm border border-emerald-100 hover:bg-emerald-100 transition-colors"
            >
              Limpar Dados
            </button>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="w-full py-4 bg-zinc-50 text-zinc-400 font-bold text-xs uppercase tracking-widest border-t border-zinc-100 hover:bg-zinc-100 transition-colors"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

const Sidebar = ({ activeTab, setActiveTab, onClose }: { activeTab: Tab, setActiveTab: (t: Tab) => void, onClose?: () => void }) => {
  const menuItems = [
    { id: 'home', label: 'Início', icon: Activity },
    { id: 'notes', label: 'Registro', icon: FileText },
    { id: 'tools', label: 'Ferramentas', icon: Terminal },
    { type: 'separator' },
    { id: 'telegram', label: 'Join Telegram', icon: Send },
    { type: 'separator' },
    { id: 'iphunter', label: 'Verificar IP', icon: Eye },
    { id: 'tether', label: 'Rede Móvel', icon: Radio },
    { id: 'settings', label: 'Configurações', icon: Settings },
    { type: 'separator' },
    { id: 'ssh', label: 'Configurações SSH', icon: Cloud },
    { type: 'separator' },
    { id: 'pro', label: 'Atualizar Para Pro', icon: Tag },
    { id: 'speed', label: 'Velocidade da rede', icon: Gauge },
    { id: 'apps', label: 'Mais Evozi Apps', icon: LayoutGrid },
    { id: 'share', label: 'Compartilhar', icon: Share2 },
    { id: 'rate', label: 'Avaliar', icon: Star },
    { type: 'separator' },
    { id: 'hwid', label: 'ID do Dispositivo', icon: Fingerprint },
    { type: 'separator' },
    { id: 'exit', label: 'Sair', icon: LogOut },
  ];

  const handleAction = (item: any) => {
    if (item.type === 'separator') return;
    if (item.id === 'pro') {
      alert('Atualizar Para Pro');
      return;
    }
    if (item.id === 'speed') {
      alert('Velocidade da rede');
      return;
    }
    if (item.id === 'apps') {
      window.open('https://play.google.com/store/apps/developer?id=Evozi', '_blank');
      return;
    }
    if (item.id === 'share') {
      alert('Compartilhar App');
      return;
    }
    if (item.id === 'rate') {
      alert('Avaliar App');
      return;
    }
    if (item.id === 'telegram') {
      window.open('https://t.me/flfastnetilimitada', '_blank');
      return;
    }
    if (item.id === 'exit') {
      if (confirm('Deseja sair do aplicativo?')) {
        window.close();
      }
      return;
    }
    setActiveTab(item.id as Tab);
    if (onClose) onClose();
  };

  return (
    <aside className="w-64 border-r border-[#2a2a2e] hidden md:flex flex-col p-4 gap-1 bg-[#0d0d0f] overflow-y-auto">
      <p className="text-[10px] font-bold text-zinc-600 uppercase mb-2 px-4 tracking-widest">Menu Principal</p>
      {menuItems.map((item: any, idx) => {
        if (item.type === 'separator') {
          return <div key={idx} className="h-px bg-[#2a2a2e] my-2 mx-4" />;
        }
        return (
          <button
            key={idx}
            onClick={() => handleAction(item)}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group ${
              activeTab === item.id 
                ? 'bg-amber-600/10 text-amber-400 border border-amber-600/20' 
                : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200 border border-transparent'
            }`}
          >
            <item.icon className={`w-4 h-4 ${activeTab === item.id ? 'text-amber-400' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
            <span className="font-medium text-sm">{item.label}</span>
            {activeTab === item.id && <ChevronRight className="w-3 h-3 ml-auto" />}
          </button>
        );
      })}
      
      <div className="mt-auto p-4 bg-[#151518] rounded-xl border border-[#2a2a2e]">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-bold uppercase tracking-wider">Status do Túnel</span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] text-zinc-500">
            <span>SSH</span>
            <span className="text-amber-500">CONECTADO</span>
          </div>
          <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full w-3/4" />
          </div>
        </div>
      </div>
    </aside>
  );
};

const Dashboard = ({ setActiveTab }: { setActiveTab: (t: Tab) => void }) => {
  const { 
    isConnected, setIsConnected, 
    timer, ipInfo, 
    selectedServer, setSelectedServer,
    selectedPort, setSelectedPort,
    isPortModalOpen, setIsPortModalOpen,
    isServerModalOpen, setIsServerModalOpen,
    isHelpModalOpen, setIsHelpModalOpen,
    customSetup, setCustomSetup,
    connectionMode, setConnectionMode,
    speed, runSpeedTest, isTesting
  } = useApp();

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImportConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast.success(`Configuração "${file.name}" importada com sucesso!`, {
        description: `Modo de conexão alterado para Configuração Importada.`,
        duration: 4000,
      });
      setConnectionMode('import');
    }
  };

  const servers: Server[] = [
    { id: 'ao-movicel-fr-2026', name: 'A-🇦🇴 Angola | Movicel FR.(2026)', location: '2026 update', flag: '🇦🇴', ping: 45, load: 12 },
    { id: 'ao-movicel', name: 'Ao Movicel 🔥', location: 'new update', flag: '🇦🇴', ping: 38, load: 45 },
    { id: 'ao-nao-compartilhe', name: 'Ao não compartilhe use', location: 'new update', flag: '🇦🇴', ping: 52, load: 28 },
    { id: 'ao-unitel-fr-03', name: 'AO Unitel FR 03 💯', location: '22 January last update', flag: '🇦🇴', ping: 61, load: 82 },
    { id: 'ao-unitel-fr-v2', name: 'AO unitel FR V2', location: '20 January last update', flag: '🇦🇴', ping: 44, load: 35 },
    { id: 'ao-unitel-fr-v2ray', name: 'AO Unitel FR V2RAY', location: '22 January last update', flag: '🇦🇴', ping: 55, load: 60 },
    { id: 'ao-unitel-fr-v2ray-backup-1', name: 'AO unitel FR V2RAY BACKUP 1️⃣', location: '25 January last update', flag: '🇦🇴', ping: 48, load: 15 },
    { id: 'ao-unitel-fr-v2ray-backup-2', name: 'AO unitel FR V2RAY BACKUP 2️⃣', location: '25 January last update', flag: '🇦🇴', ping: 50, load: 22 },
    { id: 'random', name: 'Random Server', location: 'Any Location', flag: '🌐', ping: 120, load: 50 },
    { id: 'us', name: 'United States', location: 'New York', flag: '🇺🇸', ping: 150, load: 65 },
    { id: 'ca', name: 'Canada', location: 'Montreal', flag: '🇨🇦', ping: 160, load: 40 },
    { id: 'de', name: 'Germany', location: 'Frankfurt', flag: '🇩🇪', ping: 210, load: 30 },
    { id: 'uk', name: 'United Kingdom', location: 'London', flag: '🇬🇧', ping: 200, load: 55 },
    { id: 'nl', name: 'Netherlands', location: 'Amsterdam', flag: '🇳🇱', ping: 190, load: 48 },
    { id: 'fr', name: 'France', location: 'Paris', flag: '🇫🇷', ping: 205, load: 38 },
    { id: 'at', name: 'Austria', location: 'Vienna', flag: '🇦🇹', ping: 215, load: 25 },
    { id: 'au', name: 'Australia', location: 'Tasmania', flag: '🇦🇺', ping: 320, load: 18 },
    { id: 'br', name: 'Brazil', location: 'Sao-Paulo', flag: '🇧🇷', ping: 180, load: 72 },
    { id: 'sg', name: 'Singapore', location: 'Simpang', flag: '🇸🇬', ping: 280, load: 42 },
  ];

  const ports = [22, 80, 222, 443, 1080, 3128, 8080, 8081, 8789, 8799, 8888];

  const connectionModes = [
    { id: 'direct', title: 'Conexão Direta', subtitle: 'Internet' },
    { id: 'payload', title: 'Payload Personalizado', subtitle: 'Modo TCP' },
    { id: 'host', title: 'Host Header Personalizado', subtitle: 'Modo HTTP' },
    { id: 'sni', title: 'SNI Personalizado', subtitle: 'Modo SSL, TLS' },
    { id: 'udp', title: 'UDP Personalizado', subtitle: 'Modo UDP' },
    { id: 'tcp', title: 'TCP Personalizado', subtitle: 'Modo TCP' },
    { id: 'dnstt', title: 'Túnel DNSTT', subtitle: 'Modo DNS' },
    { id: 'v2ray', title: 'V2Ray / Xray', subtitle: 'Modo VMess, VLESS' },
    { id: 'import', title: 'Configuração Importada', subtitle: 'Arquivo .HAT' },
  ];

  const currentServer = servers.find(s => s.id === selectedServer) || servers[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Connection Status Card */}
      <div className="android-card flex flex-col items-center justify-center relative overflow-hidden min-h-[400px]">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <Globe className="w-full h-full scale-150" />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-8 w-full">
          {/* Shield Icon */}
          <div className="relative">
            <div className={`w-48 h-48 rounded-full flex items-center justify-center transition-all duration-700 ${isConnected ? 'bg-primary/10 shadow-[0_0_80px_rgba(208,188,255,0.15)]' : 'bg-white/5'}`}>
              <div className="w-36 h-36 relative flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
                  <defs>
                    <linearGradient id="shieldGold" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#D0BCFF" />
                      <stop offset="100%" stopColor="#381E72" />
                    </linearGradient>
                  </defs>
                  <path 
                    d="M50 5 L90 20 V50 C90 75 50 95 50 95 C50 95 10 75 10 50 V20 L50 5Z" 
                    fill="#1C1B1F" 
                    stroke="url(#shieldGold)" 
                    strokeWidth="3"
                  />
                </svg>
                <div className="relative z-10 flex flex-col items-center justify-center translate-y-[-4px]">
                  <span className="text-[42px] font-black italic leading-none text-primary">VPN</span>
                  <span className="text-[10px] font-black text-white/60 tracking-[0.2em] mt-1">FAST NET PRO</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center space-y-2">
            <h2 className={`text-xl font-bold tracking-wide transition-colors ${isConnected ? 'text-primary' : 'text-outline'}`}>
              {isConnected ? 'PROTEGIDO' : 'DESPROTEGIDO'}
            </h2>
            <p className="text-5xl font-mono font-bold text-white tracking-tighter tabular-nums">{timer}</p>
          </div>

          <div className="flex items-center gap-12 w-full justify-center">
            <div className="flex flex-col items-center gap-1">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Download className="w-5 h-5 text-primary" />
              </div>
              <p className="text-[10px] text-outline uppercase font-bold">Down</p>
              <p className="text-sm font-mono font-bold text-white">0 KB</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="p-2 bg-secondary/10 rounded-xl">
                <Upload className="w-5 h-5 text-secondary" />
              </div>
              <p className="text-[10px] text-outline uppercase font-bold">Up</p>
              <p className="text-sm font-mono font-bold text-white">0 KB</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Action Button (FAB Style but centered) */}
      <div className="flex justify-center -mt-12 relative z-20">
        <button 
          onClick={() => setIsConnected(!isConnected)}
          className={`w-24 h-24 rounded-[28px] shadow-2xl flex items-center justify-center transition-all duration-300 active:scale-90 ${
            isConnected 
              ? 'bg-red-500 text-white shadow-red-900/40' 
              : 'bg-primary text-on-primary shadow-primary/40'
          }`}
        >
          <Zap className={`w-10 h-10 ${isConnected ? 'animate-pulse' : ''}`} />
        </button>
      </div>

      {/* Quick Info Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="android-card p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-outline">
            <Globe className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider">IP Público</span>
          </div>
          <p className="text-sm font-mono font-bold text-white truncate">{ipInfo?.ip || 'Detectando...'}</p>
        </div>
        <div className="android-card p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-outline">
            <Cpu className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Latência</span>
          </div>
          <p className="text-sm font-mono font-bold text-white">24ms</p>
        </div>
      </div>

      {/* Configuration Section */}
      <div className="android-card space-y-4">
        <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Configuração</h3>
        
        <button 
          onClick={() => setIsServerModalOpen(true)}
          className="android-list-item bg-white/5"
        >
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-2xl">
            {currentServer.flag}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">{currentServer.name}</p>
            <p className="text-[10px] text-outline font-medium uppercase">{currentServer.location}</p>
          </div>
          <ChevronRight className="w-5 h-5 text-outline" />
        </button>

        <button 
          onClick={() => setIsPortModalOpen(true)}
          className="android-list-item bg-white/5"
        >
          <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center">
            <Network className="w-6 h-6 text-secondary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">Porta: {selectedPort}</p>
            <p className="text-[10px] text-outline font-medium uppercase">Protocolo TCP/UDP</p>
          </div>
          <ChevronRight className="w-5 h-5 text-outline" />
        </button>
      </div>

      {/* Connection Modes */}
      <div className="android-card space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-primary uppercase tracking-widest">Modo de Conexão</h3>
          <button 
            onClick={() => setCustomSetup(!customSetup)}
            className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
              customSetup ? 'bg-primary text-on-primary' : 'bg-white/5 text-outline'
            }`}
          >
            {customSetup ? 'Custom ON' : 'Custom OFF'}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-2">
          <input type="file" ref={fileInputRef} onChange={handleImportConfig} className="hidden" accept=".hat,.config,.vpn" />
          {connectionModes.slice(0, 6).map((mode) => (
            <button
              key={mode.id}
              onClick={() => {
                if (mode.id === 'import') fileInputRef.current?.click();
                else setConnectionMode(mode.id as ConnectionMode);
              }}
              className={`android-list-item border ${
                connectionMode === mode.id ? 'border-primary bg-primary/5' : 'border-transparent bg-white/5'
              }`}
            >
              <div className="w-10 h-10 bg-surface rounded-xl flex items-center justify-center">
                <Zap className={`w-5 h-5 ${connectionMode === mode.id ? 'text-primary' : 'text-outline'}`} />
              </div>
              <div className="flex-1">
                <p className={`text-sm font-bold ${connectionMode === mode.id ? 'text-primary' : 'text-white'}`}>{mode.title}</p>
                <p className="text-[10px] text-outline font-medium uppercase">{mode.subtitle}</p>
              </div>
              {connectionMode === mode.id && <CheckCircle className="w-5 h-5 text-primary" />}
            </button>
          ))}
        </div>
      </div>
      {/* Modals */}
      {isServerModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="android-card w-full max-w-md flex flex-col overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-surface">
              <div className="flex items-center gap-3">
                <Globe className="w-6 h-6 text-primary" />
                <h3 className="font-bold uppercase tracking-widest text-sm text-white">Selecionar Servidor</h3>
              </div>
              <button onClick={() => setIsServerModalOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <X className="w-5 h-5 text-outline" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2 max-h-[60vh]">
              {servers.map((server) => (
                <button
                  key={server.id}
                  onClick={() => {
                    setSelectedServer(server.id);
                    setIsServerModalOpen(false);
                  }}
                  className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all ${
                    selectedServer === server.id 
                      ? 'bg-primary/10 border-primary/50 text-primary' 
                      : 'bg-surface-variant/5 border-white/5 text-outline hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-surface rounded-xl flex items-center justify-center text-2xl">
                      {server.flag}
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-sm text-white">{server.name}</p>
                      <p className="text-[10px] text-outline uppercase">{server.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-[10px] font-mono text-outline">{server.ping}ms</p>
                      <div className="w-12 h-1.5 bg-surface rounded-full mt-1 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${server.load < 50 ? 'bg-green-500' : server.load < 80 ? 'bg-amber-500' : 'bg-red-500'}`}
                          style={{ width: `${server.load}%` }}
                        />
                      </div>
                    </div>
                    {selectedServer === server.id && <CheckCircle className="w-5 h-5 text-primary" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {isPortModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="android-card w-full max-w-sm flex flex-col overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-surface">
              <div className="flex items-center gap-3">
                <Network className="w-6 h-6 text-primary" />
                <h3 className="font-bold uppercase tracking-widest text-sm text-white">Selecionar Porta</h3>
              </div>
              <button onClick={() => setIsPortModalOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <X className="w-5 h-5 text-outline" />
              </button>
            </div>
            <div className="p-4 grid grid-cols-2 gap-2">
              {ports.map((port) => (
                <button
                  key={port}
                  onClick={() => {
                    setSelectedPort(port);
                    setIsPortModalOpen(false);
                  }}
                  className={`p-4 rounded-2xl border font-mono font-bold transition-all ${
                    selectedPort === port 
                      ? 'bg-primary/10 border-primary/50 text-primary' 
                      : 'bg-surface-variant/5 border-white/5 text-outline hover:border-white/10'
                  }`}
                >
                  {port}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {isHelpModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="android-card w-full max-w-md flex flex-col overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-surface">
              <div className="flex items-center gap-3">
                <HelpCircle className="w-6 h-6 text-primary" />
                <h3 className="font-bold uppercase tracking-widest text-sm text-white">Central de Ajuda</h3>
              </div>
              <button onClick={() => setIsHelpModalOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <X className="w-5 h-5 text-outline" />
              </button>
            </div>
            <div className="p-8 text-center space-y-6">
              <p className="text-outline text-sm">Precisa de ajuda com a configuração ou está enfrentando problemas de conexão?</p>
              <div className="space-y-3">
                <button className="android-btn-primary w-full py-3 rounded-xl shadow-lg">
                  Falar com Suporte
                </button>
                <button className="android-btn-tonal w-full py-3 rounded-xl">
                  Ler Documentação
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
const PayloadGenerator = () => {
  const [method, setMethod] = useState('CONNECT');
  const [url, setUrl] = useState('[host_port]');
  const [protocol, setProtocol] = useState('HTTP/1.1');
  const [payload, setPayload] = useState('');

  const generate = () => {
    const p = `${method} ${url} ${protocol}[crlf]Host: ${url.split(':')[0]}[crlf]Connection: Keep-Alive[crlf]User-Agent: [ua][crlf][crlf]`;
    setPayload(p);
  };

  return (
    <div className="android-card space-y-6">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <Code className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-lg font-bold text-white">Gerador de Payload</h2>
        </div>
        <button onClick={generate} className="px-6 py-2 bg-primary text-on-primary rounded-full text-xs font-bold">
          Gerar
        </button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-primary uppercase tracking-widest px-1">Método</label>
          <select 
            value={method} 
            onChange={(e) => setMethod(e.target.value)}
            className="android-input"
          >
            <option className="bg-surface">CONNECT</option>
            <option className="bg-surface">GET</option>
            <option className="bg-surface">POST</option>
            <option className="bg-surface">PUT</option>
            <option className="bg-surface">HEAD</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-primary uppercase tracking-widest px-1">URL / Host</label>
          <input 
            type="text" 
            value={url} 
            onChange={(e) => setUrl(e.target.value)}
            className="android-input" 
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-primary uppercase tracking-widest px-1">Protocolo</label>
          <select 
            value={protocol} 
            onChange={(e) => setProtocol(e.target.value)}
            className="android-input"
          >
            <option className="bg-surface">HTTP/1.0</option>
            <option className="bg-surface">HTTP/1.1</option>
            <option className="bg-surface">HTTP/2</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center px-1">
          <label className="text-[10px] font-bold text-primary uppercase tracking-widest">Payload Gerado</label>
          <button 
            onClick={() => navigator.clipboard.writeText(payload)}
            className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
          >
            <Copy className="w-3 h-3" /> Copiar
          </button>
        </div>
        <textarea 
          readOnly 
          value={payload}
          placeholder="Clique em gerar para criar o payload..."
          className="android-input h-32 resize-none font-mono text-xs"
        />
      </div>

      <div className="bg-primary/5 border border-primary/10 p-4 rounded-2xl">
        <h4 className="text-[10px] font-bold text-primary uppercase mb-2 flex items-center gap-2">
          <Info className="w-3 h-3" /> Dicas
        </h4>
        <p className="text-[11px] text-outline leading-relaxed">
          Use <code className="text-primary">[crlf]</code> para quebras de linha e <code className="text-primary">[host]</code> para o host de destino. A maioria das redes móveis requer cabeçalhos específicos como <code className="text-primary">X-Online-Host</code> para contornar restrições.
        </p>
      </div>
    </div>
  );
};

const HostChecker = () => {
  const [host, setHost] = useState('google.com');
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<any>(null);

  const check = async () => {
    setChecking(true);
    try {
      const start = Date.now();
      const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent('https://' + host)}`);
      const duration = Date.now() - start;
      const data = await res.json();
      setResult({
        status: data.status?.http_code || 200,
        time: duration,
        server: 'Desconhecido (via Proxy)',
        protocol: 'HTTPS'
      });
    } catch (e) {
      setResult({ error: 'Failed to reach host or CORS restriction.' });
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="android-card space-y-6">
      <div className="flex items-center gap-3 border-b border-white/5 pb-4">
        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
          <Search className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-lg font-bold text-white">Verificador de Host</h2>
      </div>

      <div className="flex gap-2">
        <input 
          type="text" 
          value={host}
          onChange={(e) => setHost(e.target.value)}
          placeholder="exemplo.com"
          className="android-input flex-1" 
        />
        <button 
          onClick={check}
          disabled={checking}
          className="w-14 h-14 bg-primary text-on-primary rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-transform"
        >
          {checking ? <RefreshCw className="w-6 h-6 animate-spin" /> : <ChevronRight className="w-6 h-6" />}
        </button>
      </div>

      {result && (
        <div className="android-card bg-surface-variant/20 p-0 overflow-hidden border border-white/5">
          <div className="bg-surface-variant/40 px-4 py-2 border-b border-white/5 flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase text-outline">Resultado</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${result.error ? 'bg-red-500/20 text-red-400' : 'bg-primary/20 text-primary'}`}>
              {result.error ? 'FALHOU' : 'SUCESSO'}
            </span>
          </div>
          <div className="p-4 space-y-3 font-mono text-xs">
            {result.error ? (
              <p className="text-red-400">{result.error}</p>
            ) : (
              <>
                <div className="flex justify-between">
                  <span className="text-outline">Código de Status:</span>
                  <span className="text-primary">{result.status} OK</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-outline">Tempo de Resposta:</span>
                  <span className="text-primary">{result.time}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-outline">Protocolo:</span>
                  <span className="text-primary">{result.protocol}</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const DNSLookup = () => {
  const [domain, setDomain] = useState('google.com');
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const lookup = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://dns.google/resolve?name=${domain}`);
      const data = await res.json();
      setRecords(data.Answer || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="android-card space-y-6">
      <div className="flex items-center gap-3 border-b border-white/5 pb-4">
        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
          <Globe className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-lg font-bold text-white">Consulta DNS</h2>
      </div>

      <div className="flex gap-2">
        <input 
          type="text" 
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="google.com"
          className="android-input flex-1" 
        />
        <button 
          onClick={lookup} 
          className="w-14 h-14 bg-primary text-on-primary rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-transform"
        >
          {loading ? <RefreshCw className="w-6 h-6 animate-spin" /> : <ChevronRight className="w-6 h-6" />}
        </button>
      </div>

      <div className="space-y-2">
        <div className="grid grid-cols-4 px-4 py-2 text-[10px] font-bold text-primary uppercase tracking-widest">
          <span>Nome</span>
          <span>Tipo</span>
          <span>TTL</span>
          <span>Dados</span>
        </div>
        <div className="space-y-2">
          {records.length > 0 ? records.map((r, i) => (
            <div key={i} className="grid grid-cols-4 px-4 py-3 bg-surface-variant/20 rounded-xl border border-white/5 font-mono text-[10px]">
              <span className="truncate text-white">{r.name}</span>
              <span className="text-primary">{r.type === 1 ? 'A' : r.type === 28 ? 'AAAA' : r.type === 15 ? 'MX' : r.type}</span>
              <span className="text-outline">{r.TTL}</span>
              <span className="text-secondary truncate">{r.data}</span>
            </div>
          )) : (
            <div className="text-center py-12 text-outline font-mono text-xs bg-surface-variant/10 rounded-2xl border border-dashed border-white/10">
              Nenhum registro encontrado.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SSHSettings = () => {
  const [usePrivateKey, setUsePrivateKey] = useState(false);

  return (
    <div className="android-card space-y-6">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-lg font-bold text-white">Configurações SSH</h2>
        </div>
        <span className="text-[10px] font-mono text-outline uppercase font-bold tracking-widest">Conta</span>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-primary uppercase tracking-widest px-1">Host SSH / IP</label>
            <input type="text" className="android-input" placeholder="ex: ssh-server.com" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-primary uppercase tracking-widest px-1">Porta SSH</label>
            <input type="text" className="android-input" placeholder="22" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-primary uppercase tracking-widest px-1">Usuário</label>
            <input type="text" className="android-input" placeholder="vpn-user" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-primary uppercase tracking-widest px-1">Senha</label>
            <input type="password" className="android-input" placeholder="••••••••" />
          </div>
        </div>

        {/* Chave Privada Section */}
        <div className="space-y-2 pt-4 border-t border-white/5">
          <div className="android-list-item p-4">
            <div className="flex-1">
              <p className="font-bold text-sm text-white">Chave Privada (Opcional)</p>
              <p className="text-[11px] text-outline">Usar chave privada para autenticar</p>
            </div>
            <button 
              onClick={() => setUsePrivateKey(!usePrivateKey)}
              className={`w-10 h-5 rounded-full relative transition-colors duration-200 ${usePrivateKey ? 'bg-primary' : 'bg-surface-variant'}`}
            >
              <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-200 ${usePrivateKey ? 'left-6' : 'left-1'}`} />
            </button>
          </div>
          <button className="w-full p-4 bg-surface-variant/10 rounded-2xl border border-white/5 text-left active:bg-surface-variant/20 transition-colors">
            <p className="font-bold text-sm text-white">Definir Chave Privada</p>
          </button>
        </div>

        {/* Conexão Section */}
        <div className="space-y-3 pt-4 border-t border-white/5">
          <h3 className="text-[10px] font-bold text-primary uppercase tracking-widest px-1">Conexão</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-primary uppercase tracking-widest px-1">Porta Local</label>
              <input type="text" className="android-input" defaultValue="1080" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-primary uppercase tracking-widest px-1">Porta UDPGW</label>
              <input type="text" className="android-input" placeholder="7300" />
            </div>
          </div>
        </div>

        {/* Configurações Avançadas Section */}
        <div className="space-y-3 pt-4 border-t border-white/5">
          <h3 className="text-[10px] font-bold text-primary uppercase tracking-widest px-1">Avançado</h3>
          <div className="android-list-item p-4">
            <div className="flex-1">
              <p className="font-bold text-sm text-white">Tamanho do Buffer</p>
              <p className="text-[11px] text-outline">Enviar: 16384 | Receber: 32768</p>
            </div>
          </div>
          <div className="android-list-item p-4">
            <div className="flex-1">
              <p className="font-bold text-sm text-white">Configurações Avançadas</p>
              <p className="text-[11px] text-outline">Privilégios para usuário avançado</p>
            </div>
          </div>
        </div>

        <div className="bg-primary/5 border border-primary/10 p-4 rounded-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm text-white font-bold">Compressão de Dados</span>
            </div>
            <button className="w-10 h-5 bg-primary rounded-full relative">
              <div className="absolute top-1 left-6 w-3 h-3 bg-white rounded-full" />
            </button>
          </div>
        </div>
      </div>

      <button className="android-btn-primary w-full py-4 rounded-2xl">Salvar Configurações SSH</button>
    </div>
  );
};

const HardwareID = () => {
  const hwid = "FL-PRO-8829-X921-KB02";
  return (
    <div className="android-card text-center space-y-6">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
        <Shield className="w-8 h-8 text-primary animate-pulse" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white">ID do Hardware (HWID)</h2>
        <p className="text-xs text-outline">Seu identificador exclusivo de dispositivo para configurações bloqueadas.</p>
      </div>
      
      <div className="bg-surface-variant/20 p-6 rounded-2xl border border-white/5 font-mono text-lg text-primary flex items-center justify-between">
        <span className="tracking-widest">{hwid}</span>
        <button onClick={() => navigator.clipboard.writeText(hwid)} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
          <Copy className="w-5 h-5 text-outline" />
        </button>
      </div>

      <p className="text-[10px] text-outline uppercase tracking-widest leading-relaxed">
        Este ID é usado para vincular configurações específicas ao seu dispositivo. 
        Não compartilhe este ID a menos que seja solicitado por um provedor.
      </p>
    </div>
  );
};

const Hotshare = () => {
  return (
    <div className="android-card text-center space-y-6">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
        <Wifi className="w-8 h-8 text-primary" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white">Hotshare / Tethering</h2>
        <p className="text-xs text-outline">Compartilhe sua conexão VPN com outros dispositivos via Hotspot.</p>
      </div>

      <div className="space-y-3 text-left">
        <div className="android-list-item p-4">
          <div className="flex-1">
            <p className="font-bold text-white">Servidor Proxy HTTP</p>
            <p className="text-xs text-outline font-mono">192.168.43.1 : 8080</p>
          </div>
          <button className="px-6 py-2 bg-primary text-on-primary rounded-full text-xs font-bold shadow-lg">INICIAR</button>
        </div>
        <div className="android-list-item p-4">
          <div className="flex-1">
            <p className="font-bold text-white">Hotspot VPN (Root)</p>
            <p className="text-xs text-outline font-mono">Roteamento direto via iptables</p>
          </div>
          <button className="px-6 py-2 bg-surface-variant text-white rounded-full text-xs font-bold">CONFIGURAR</button>
        </div>
      </div>

      <div className="text-xs text-outline bg-primary/5 p-4 rounded-2xl border border-primary/10 text-left space-y-2">
        <p className="font-bold text-primary uppercase tracking-widest text-[10px]">Instruções:</p>
        <ol className="list-decimal list-inside space-y-1 text-[11px] leading-relaxed">
          <li>Ligue seu Hotspot Móvel.</li>
          <li>Clique em "INICIAR" no Servidor Proxy HTTP.</li>
          <li>No dispositivo cliente, defina o proxy para 192.168.43.1 e a porta 8080.</li>
        </ol>
      </div>
    </div>
  );
};

const UpdateNotes = () => (
  <div className="android-card space-y-6">
    <div className="flex items-center gap-4 border-b border-white/5 pb-4">
      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
        <FileText className="w-8 h-8 text-primary" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-white">Notas de Atualização</h2>
        <p className="text-[10px] text-outline uppercase font-bold tracking-widest">Histórico de Versões</p>
      </div>
    </div>
    <div className="space-y-4">
      <div className="bg-surface-variant/10 p-5 rounded-3xl border border-white/5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-primary font-bold text-lg">Versão 8.11</p>
            <p className="text-[10px] text-outline font-bold">15 DE MARÇO DE 2026</p>
          </div>
          <span className="bg-primary/20 text-primary text-[10px] font-bold px-3 py-1 rounded-full">ESTÁVEL</span>
        </div>
        <ul className="space-y-3">
          {[
            'Novos servidores de alta velocidade para Angola.',
            'Melhorada a estabilidade do túnel UDP.',
            'Novo sistema de vinculação de ID de Hardware.',
            'Corrigidos bugs na seleção de servidor.'
          ].map((note, i) => (
            <li key={i} className="flex gap-3 text-sm text-outline leading-tight">
              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0" />
              {note}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

const V2raySettings = () => (
  <div className="android-card space-y-6">
    <div className="flex items-center gap-4 border-b border-white/5 pb-4">
      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
        <Globe className="w-8 h-8 text-primary" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-white">Configurações V2ray</h2>
        <p className="text-[10px] text-outline uppercase font-bold tracking-widest">Protocolo Xray/V2ray</p>
      </div>
    </div>
    <div className="space-y-2">
      <div className="android-list-item p-4">
        <div className="flex-1">
          <p className="font-bold text-white">Ativar Mux</p>
          <p className="text-[10px] text-outline">Multiplexação de conexões</p>
        </div>
        <button className="w-10 h-5 bg-surface-variant rounded-full relative">
          <div className="absolute top-1 left-1 w-3 h-3 bg-white rounded-full" />
        </button>
      </div>
      <div className="android-list-item p-4">
        <div className="flex-1">
          <p className="font-bold text-white">Sniffing</p>
          <p className="text-[10px] text-outline">Detecção de tráfego</p>
        </div>
        <button className="w-10 h-5 bg-primary rounded-full relative">
          <div className="absolute top-1 left-6 w-3 h-3 bg-white rounded-full" />
        </button>
      </div>
    </div>
  </div>
);

const IPHunter = () => (
  <div className="android-card space-y-8 text-center py-8">
    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
      <CheckCircle className="w-10 h-10 text-primary" />
    </div>
    <div className="space-y-2">
      <h2 className="text-2xl font-bold text-white">Procurar IP</h2>
      <p className="text-sm text-outline px-4">Procure por faixas de IP específicas que funcionam com sua rede.</p>
    </div>
    <div className="flex flex-col gap-3 px-2">
      <input type="text" className="android-input text-center" placeholder="ex: 10.0.0.1" />
      <button className="android-btn-primary w-full py-4 rounded-2xl shadow-lg">PROCURAR IP</button>
    </div>
  </div>
);

const AddOwnServer = () => (
  <div className="android-card space-y-6">
    <div className="flex items-center gap-4 border-b border-white/5 pb-4">
      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
        <PlusCircle className="w-8 h-8 text-primary" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-white">Novo Servidor</h2>
        <p className="text-[10px] text-outline uppercase font-bold tracking-widest">Adicionar Manualmente</p>
      </div>
    </div>
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-primary uppercase tracking-widest px-1">Nome do Servidor</label>
        <input type="text" className="android-input" placeholder="Meu Servidor VPS" />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-primary uppercase tracking-widest px-1">Endereço / IP</label>
        <input type="text" className="android-input" placeholder="1.1.1.1" />
      </div>
      <button className="android-btn-primary w-full py-4 rounded-2xl shadow-lg mt-4">ADICIONAR SERVIDOR</button>
    </div>
  </div>
);

const AddOwnTweaks = () => (
  <div className="android-card space-y-6">
    <div className="flex items-center gap-4 border-b border-white/5 pb-4">
      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
        <Cloud className="w-8 h-8 text-primary" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-white">Importar Tweaks</h2>
        <p className="text-[10px] text-outline uppercase font-bold tracking-widest">Configurações Externas</p>
      </div>
    </div>
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-primary uppercase tracking-widest px-1">JSON de Tweaks</label>
        <textarea className="android-input h-48 resize-none font-mono text-xs" placeholder="Cole seu JSON aqui..."></textarea>
      </div>
      <button className="android-btn-primary w-full py-4 rounded-2xl shadow-lg">IMPORTAR TWEAKS</button>
    </div>
  </div>
);

const SettingsView = () => {
  const [settings, setSettings] = useState({
    httpPing: true,
    cpuWakelock: false,
    dnsOverHttps: false,
    dnsForwarding: true,
    useDefaultRoute: true,
    appFilter: false,
    tunnelMode: 'ssh',
    connectionMethod: 'direct',
    customPayload: false,
    darkMode: 'system',
    language: 'default',
    customRoutes: '0.0.0.0/0',
    excludedRoutes: '10.0.0.0/8;172.16.0.0/12;192.168.0.0/16',
    pingUrl: 'clients3.google.com/generate_204'
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const SettingRow = ({ icon: Icon, label, description, children }: any) => (
    <div className="android-list-item p-4">
      <div className="flex gap-4 flex-1">
        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
          {Icon && <Icon className="w-5 h-5 text-primary" />}
        </div>
        <div className="flex-1">
          <p className="font-bold text-sm text-white">{label}</p>
          {description && <p className="text-[11px] text-outline leading-tight mt-0.5">{description}</p>}
        </div>
      </div>
      <div className="ml-4">
        {children}
      </div>
    </div>
  );

  const RadioButton = ({ active, onClick, label, icon: Icon }: any) => (
    <button
      onClick={onClick}
      className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
        active 
          ? 'bg-primary/10 border-primary/50 text-primary' 
          : 'bg-surface-variant/5 border-white/5 text-outline hover:border-white/10'
      }`}
    >
      <div className="flex items-center gap-4">
        {Icon && <Icon className="w-5 h-5" />}
        <span className="font-bold text-sm">{label}</span>
      </div>
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
        active ? 'border-primary' : 'border-outline/30'
      }`}>
        {active && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
      </div>
    </button>
  );

  const Switch = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (
    <button 
      onClick={onChange}
      className={`w-12 h-6 rounded-full relative transition-colors duration-200 ${checked ? 'bg-primary' : 'bg-surface-variant'}`}
    >
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-200 ${checked ? 'left-7' : 'left-1'}`} />
    </button>
  );

  return (
    <div className="space-y-8 pb-24">
      <div className="flex items-center gap-4 px-2">
        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
          <Settings className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Configurações</h2>
          <p className="text-[10px] text-outline uppercase font-bold tracking-widest">Ajustes do Sistema</p>
        </div>
      </div>

      {/* Resumo do Túnel */}
      <div className="android-card bg-primary/5 border-l-4 border-l-primary p-5">
        <p className="text-[10px] text-primary uppercase font-bold tracking-widest">Túnel Ativo</p>
        <p className="text-lg font-bold text-white mt-1">
          {settings.connectionMethod === 'tls_proxy' ? 'SSL/TLS ➔ ' : 
           settings.connectionMethod === 'proxy_http' ? 'HTTP Proxy ➔ ' : 
           settings.connectionMethod === 'tls_stunnel' ? 'Stunnel ➔ ' : ''}
          {settings.tunnelMode === 'ssh' ? 'SSH' : 
           settings.tunnelMode === 'v2ray' ? 'V2Ray/Xray' :
           settings.tunnelMode === 'hysteria' ? 'Hysteria' :
           settings.tunnelMode === 'shadowsocks' ? 'Shadowsocks' :
           settings.tunnelMode === 'dnstt' ? 'DNS (DNSTT)' :
           settings.tunnelMode === 'http_obfs' ? 'HTTP (Obfs)' : 'TLS/SSL (Obfs)'}
        </p>
        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-primary text-[10px] font-bold rounded-full text-on-primary uppercase">
          <Zap className="w-3 h-3" />
          {settings.connectionMethod === 'tls_proxy' || settings.connectionMethod === 'tls_stunnel' ? 'TCP (TLS)' : 
           settings.tunnelMode === 'dnstt' ? 'UDP (DNSTT)' : 'TCP'}
        </div>
      </div>

      {/* Modo de Túneis Section */}
      <section className="space-y-4">
        <h3 className="android-section-title px-2">Modo de túneis</h3>
        <div className="grid grid-cols-1 gap-2">
          {[
            { id: 'ssh', label: 'Modo seguro (SSH)', icon: Shield },
            { id: 'v2ray', label: 'V2Ray/Xray', icon: Globe },
            { id: 'hysteria', label: 'Hysteria', icon: Zap },
            { id: 'shadowsocks', label: 'Shadowsocks', icon: Lock },
            { id: 'dnstt', label: 'DNS (DNSTT)', icon: Network },
            { id: 'http_obfs', label: 'HTTP (Obfs)', icon: Search },
            { id: 'tls_obfs', label: 'TLS/SSL (Obfs)', icon: ShieldCheck },
          ].map((mode) => (
            <RadioButton
              key={mode.id}
              active={settings.tunnelMode === mode.id}
              onClick={() => setSettings(prev => ({ ...prev, tunnelMode: mode.id }))}
              label={mode.label}
              icon={mode.icon}
            />
          ))}
        </div>
      </section>

      {/* Conectar via Section */}
      <section className="space-y-4">
        <h3 className="android-section-title px-2">Conectar via</h3>
        <div className="grid grid-cols-1 gap-2">
          {[
            { id: 'direct', label: 'Nenhum (Direto)', icon: Zap },
            { id: 'proxy_http', label: 'Proxy HTTP', icon: Network },
            { id: 'tls_proxy', label: 'Proxy TLS/SSL', icon: Shield },
            { id: 'tls_stunnel', label: 'TLS/SSL (stunnel)', icon: Lock },
          ].map((method) => (
            <RadioButton
              key={method.id}
              active={settings.connectionMethod === method.id}
              onClick={() => setSettings(prev => ({ ...prev, connectionMethod: method.id }))}
              label={method.label}
              icon={method.icon}
            />
          ))}
        </div>
      </section>

      {/* Opções Section */}
      <section className="space-y-2">
        <h3 className="android-section-title px-2 mb-4">Opções Gerais</h3>
        <div className="android-card p-0 overflow-hidden">
          <SettingRow 
            icon={Activity} 
            label="Ping HTTP" 
            description="Verifica a latência via requisições HTTP"
          >
            <Switch checked={settings.httpPing} onChange={() => toggle('httpPing')} />
          </SettingRow>
          <SettingRow 
            icon={Cpu} 
            label="CPU Wakelock" 
            description="Evita que o sistema entre em repouso profundo"
          >
            <Switch checked={settings.cpuWakelock} onChange={() => toggle('cpuWakelock')} />
          </SettingRow>
          <SettingRow 
            icon={ShieldCheck} 
            label="DNS over HTTPS" 
            description="Criptografa suas consultas DNS"
          >
            <Switch checked={settings.dnsOverHttps} onChange={() => toggle('dnsOverHttps')} />
          </SettingRow>
          <SettingRow 
            icon={Filter} 
            label="Filtro de Apps" 
            description="Escolha quais apps usam a VPN"
          >
            <Switch checked={settings.appFilter} onChange={() => toggle('appFilter')} />
          </SettingRow>
        </div>
      </section>

      {/* Avançado Section */}
      <section className="space-y-4">
        <h3 className="android-section-title px-2">Avançado</h3>
        <div className="android-card space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-primary uppercase tracking-widest px-1">URL de Ping</label>
            <input 
              type="text" 
              value={settings.pingUrl}
              onChange={(e) => setSettings({...settings, pingUrl: e.target.value})}
              className="android-input" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-primary uppercase tracking-widest px-1">Rotas Excluídas</label>
            <textarea 
              value={settings.excludedRoutes}
              onChange={(e) => setSettings({...settings, excludedRoutes: e.target.value})}
              className="android-input h-24 resize-none text-xs font-mono" 
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const ToolsView = () => {
  const [debugMode, setDebugMode] = useState(false);

  const tools = [
    { 
      title: 'Ferramentas de Tethering', 
      description: 'Tether uma conexão VPN ou desbloqueie o limite do hotspot', 
      icon: Wifi,
      action: () => alert('Ferramentas de Tethering')
    },
    { 
      title: 'Procurar IP', 
      description: 'Pesquisar endereço IP local', 
      icon: Network,
      action: () => alert('Procurar IP')
    },
    { 
      title: 'Teste', 
      description: 'STUN, DNS Tunnel', 
      icon: Activity,
      action: () => alert('Teste')
    },
    { 
      title: 'Diagnóstico', 
      description: 'Diagnosticar e solucionar problemas de dispositivo', 
      icon: Info,
      action: () => alert('Diagnóstico')
    },
    { 
      title: 'Velocidade da rede', 
      description: 'Monitore seu uso de rede em tempo real', 
      icon: Zap,
      action: () => alert('Velocidade da rede')
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="px-4">
        <h2 className="text-2xl font-bold text-white">Ferramentas</h2>
        <p className="text-xs text-outline">Utilitários extras para sua conexão</p>
      </div>

      <div className="android-card p-2 space-y-1">
        {tools.map((tool, idx) => (
          <button
            key={idx}
            onClick={tool.action}
            className="android-list-item"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
              <tool.icon className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-bold text-white">{tool.title}</h3>
              <p className="text-[11px] text-outline mt-0.5 leading-tight">{tool.description}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-outline" />
          </button>
        ))}

        <div className="android-list-item">
          <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center">
            <Code className="w-6 h-6 text-secondary" />
          </div>
          <div className="flex-1 text-left">
            <h3 className="font-bold text-white">Modo de depuração</h3>
            <p className="text-[11px] text-outline mt-0.5">Mostrar informações mais detalhadas no registro</p>
          </div>
          <button 
            onClick={() => setDebugMode(!debugMode)}
            className={`w-12 h-6 rounded-full relative transition-colors duration-200 ${debugMode ? 'bg-primary' : 'bg-surface-variant'}`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-200 ${debugMode ? 'left-7' : 'left-1'}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

const SplashScreen = ({ onComplete }: { onComplete: () => void, key?: string }) => {
  const [animationData, setAnimationData] = useState<any>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Try to load the JSON animation
    fetch('/animacao.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load animation');
        return res.json();
      })
      .then(data => setAnimationData(data))
      .catch(() => {
        setError(true);
        // If JSON fails, skip after 3 seconds
        const timer = setTimeout(onComplete, 3000);
        return () => clearTimeout(timer);
      });
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden"
    >
      {animationData ? (
        <div className="w-full h-full flex items-center justify-center">
          <Lottie 
            animationData={animationData} 
            loop={false} 
            onComplete={onComplete}
            className="w-full h-full object-contain"
          />
        </div>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface gap-4">
          <Shield className="w-20 h-20 text-primary animate-pulse" />
          <h2 className="text-xl font-bold text-white">VPN FAST NET PRO</h2>
          <p className="text-xs text-outline">Carregando animação...</p>
        </div>
      )}

      {/* Skip button as a fallback */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
        className="absolute bottom-10"
      >
        <button 
          onClick={onComplete}
          className="px-6 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white/60 text-xs font-bold uppercase tracking-widest hover:bg-white/20 transition-colors"
        >
          Pular
        </button>
      </motion.div>
    </motion.div>
  );
};

const ImportConfigView = ({ onBack }: { onBack: () => void }) => {
  const [view, setView] = useState<'main' | 'files' | 'cloud'>('main');
  const [selectedSource, setSelectedSource] = useState<string>('');
  const [cloudUrl, setCloudUrl] = useState('');

  const items = [
    {
      id: 'internal',
      title: 'Memória Interna',
      subtitle: 'Disponível 699,1 MB de 10,9 GB',
      icon: HardDrive
    },
    {
      id: 'external',
      title: 'Memória Externa',
      subtitle: 'Disponível 25,9 GB de 29,1 GB',
      icon: HardDrive
    },
    {
      id: 'download',
      title: 'Baixar',
      subtitle: '/storage/emulated/0/Download',
      icon: FolderOpen
    },
    {
      id: 'cloud',
      title: 'Configuração na Nuvem',
      subtitle: 'Importar configuração ehi da nuvem',
      icon: CloudDownload
    }
  ];

  const mockFiles = [
    { name: 'FastVPN_Premium_v1.ehi', size: '12 KB', date: '2026-03-25' },
    { name: 'Gaming_LowPing.ehi', size: '8 KB', date: '2026-03-24' },
    { name: 'Streaming_Unblock.config', size: '15 KB', date: '2026-03-23' },
    { name: 'Default_Config.ehi', size: '5 KB', date: '2026-03-20' },
  ];

  const handleFileSelect = (fileName: string) => {
    toast.success(`Configuração "${fileName}" importada com sucesso!`);
    onBack();
  };

  const handleCloudImport = () => {
    if (!cloudUrl) {
      toast.error('Por favor, insira uma URL válida');
      return;
    }
    const promise = new Promise((resolve) => setTimeout(resolve, 2000));
    toast.promise(
      promise,
      {
        loading: 'Baixando configuração da nuvem...',
        success: 'Configuração da nuvem importada com sucesso!',
        error: 'Erro ao baixar configuração',
      }
    );
    promise.then(() => onBack());
  };

  const renderMain = () => (
    <div className="flex-1 p-2 space-y-1">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => {
            if (item.id === 'cloud') {
              setView('cloud');
            } else {
              setSelectedSource(item.title);
              setView('files');
            }
          }}
          className="w-full flex items-center gap-6 px-4 py-4 hover:bg-white/5 transition-colors text-left group"
        >
          <div className="w-10 h-10 flex items-center justify-center">
            <item.icon className="w-8 h-8 text-zinc-400 group-hover:text-primary transition-colors" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-lg font-medium text-zinc-100">{item.title}</p>
            <p className="text-sm text-zinc-500 truncate">{item.subtitle}</p>
          </div>
        </button>
      ))}
    </div>
  );

  const renderFiles = () => (
    <div className="flex-1 flex flex-col">
      <div className="px-4 py-3 bg-white/5 border-b border-white/10">
        <p className="text-xs font-bold text-primary uppercase tracking-widest">{selectedSource}</p>
      </div>
      <div className="p-2 space-y-1">
        {mockFiles.map((file, idx) => (
          <button
            key={idx}
            onClick={() => handleFileSelect(file.name)}
            className="w-full flex items-center gap-4 px-4 py-4 hover:bg-white/5 transition-colors text-left group"
          >
            <FileText className="w-6 h-6 text-zinc-500 group-hover:text-primary transition-colors" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-zinc-100 truncate">{file.name}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[10px] text-zinc-500">{file.size}</span>
                <span className="text-[10px] text-zinc-500">{file.date}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderCloud = () => (
    <div className="flex-1 p-6 space-y-6">
      <div className="space-y-2">
        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">URL da Configuração</label>
        <div className="relative">
          <input
            type="text"
            value={cloudUrl}
            onChange={(e) => setCloudUrl(e.target.value)}
            placeholder="https://exemplo.com/config.ehi"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary/50 transition-colors"
          />
          <CloudDownload className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
        </div>
      </div>

      <button
        onClick={handleCloudImport}
        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-2"
      >
        <CloudDownload className="w-5 h-5" />
        Importar da Nuvem
      </button>

      <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-zinc-400 leading-relaxed">
            Insira o link direto para o arquivo de configuração (.ehi ou .config). Certifique-se de que o link é público e acessível.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0d0d0f] flex flex-col animate-in fade-in slide-in-from-right duration-300">
      {/* Header */}
      <header className="h-16 bg-[#006064] px-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              if (view !== 'main') setView('main');
              else onBack();
            }} 
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-xl font-medium text-white">
            {view === 'main' ? 'Selecione o arquivo' : view === 'files' ? 'Escolha o arquivo' : 'Importar Nuvem'}
          </h1>
        </div>
        {view === 'main' && (
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <ArrowDownAz className="w-6 h-6 text-white" />
          </button>
        )}
      </header>

      {view === 'main' && renderMain()}
      {view === 'files' && renderFiles()}
      {view === 'cloud' && renderCloud()}
    </div>
  );
};

const ExportConfigView = ({ onBack }: { onBack: () => void }) => {
  const [fileName, setFileName] = useState('');
  const [options, setOptions] = useState({
    ssh: false,
    v2ray: false,
    hysteria: false,
    shadowsocks: false
  });

  const handleExport = () => {
    if (!fileName) {
      toast.error('Por favor, insira o nome do arquivo.');
      return;
    }
    toast.success(`Configuração "${fileName}" exportada com sucesso!`);
    onBack();
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col animate-in fade-in slide-in-from-right duration-300">
      {/* Header */}
      <header className="h-16 bg-[#006064] px-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-xl font-medium text-white">Exportar Configuração</h1>
        </div>
        <button 
          onClick={handleExport}
          className="w-14 h-14 bg-[#03A9F4] rounded-full flex items-center justify-center shadow-lg translate-y-8 -translate-x-4 active:scale-95 transition-transform"
        >
          <FileUp className="w-7 h-7 text-white" />
        </button>
      </header>

      <div className="p-4 pt-12 space-y-6">
        {/* File Name Input */}
        <div className="space-y-2">
          <input 
            type="text" 
            placeholder="Nome do arquivo"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="w-full bg-transparent border-b border-zinc-700 py-3 text-white placeholder:text-zinc-500 focus:border-primary outline-none transition-colors"
          />
        </div>

        {/* Export Options */}
        <div className="bg-[#212121] rounded-lg overflow-hidden border border-white/5">
          <div className="p-4 border-b border-white/5">
            <h3 className="text-sm font-medium text-zinc-400">Exportar Configuração</h3>
          </div>
          <div className="p-4 grid grid-cols-2 gap-4">
            {Object.entries(options).map(([key, value]) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${value ? 'bg-primary border-primary' : 'border-zinc-600 group-hover:border-zinc-400'}`}>
                  <input 
                    type="checkbox" 
                    className="hidden" 
                    checked={value}
                    onChange={() => setOptions(prev => ({ ...prev, [key]: !prev[key] }))}
                  />
                  {value && <CheckCircle className="w-4 h-4 text-on-primary" />}
                </div>
                <span className="text-sm text-zinc-300 uppercase font-medium">{key === 'v2ray' ? 'V2Ray' : key}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <Dashboard setActiveTab={setActiveTab} />;
      case 'tools': return <ToolsView />;
      case 'settings': return <SettingsView />;
      case 'notes': return <UpdateNotes />;
      case 'ssh': return <SSHSettings />;
      case 'v2ray': return <V2raySettings />;
      case 'iphunter': return <IPHunter />;
      case 'payload': return <PayloadGenerator />;
      case 'host': return <HostChecker />;
      case 'dns': return <DNSLookup />;
      case 'hwid': return <HardwareID />;
      case 'tether': return <Hotshare />;
      case 'addserver': return <AddOwnServer />;
      case 'addtweaks': return <AddOwnTweaks />;
      case 'exportconfig': return <ExportConfigView onBack={() => setActiveTab('home')} />;
      case 'importconfig': return <ImportConfigView onBack={() => setActiveTab('home')} />;
      default: return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <AppProvider>
      <AnimatePresence mode="wait">
        {showSplash ? (
          <SplashScreen key="splash" onComplete={() => setShowSplash(false)} />
        ) : (
          <motion.div 
            key="main-app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen flex flex-col bg-surface text-on-surface select-none"
          >
            <Toaster position="top-center" theme="dark" richColors />
            <Header 
              onOpenUpdate={() => setIsUpdateModalOpen(true)} 
              onOpenDrawer={() => setIsDrawerOpen(true)}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
            
            <main className="flex-1 overflow-y-auto pb-24 px-4 pt-4">
              <div className="max-w-md mx-auto w-full">
                {renderContent()}
              </div>
            </main>

            <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
            
            <AndroidDrawer 
              isOpen={isDrawerOpen} 
              onClose={() => setIsDrawerOpen(false)} 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
            />
            
            <UpdateResourcesModal 
              isOpen={isUpdateModalOpen} 
              onClose={() => setIsUpdateModalOpen(false)} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </AppProvider>
  );
}

const BottomNavigation = ({ activeTab, setActiveTab }: { activeTab: Tab, setActiveTab: (t: Tab) => void }) => {
  const items = [
    { id: 'home', label: 'Início', icon: Activity },
    { id: 'notes', label: 'Registro', icon: FileText },
    { id: 'tools', label: 'Ferramentas', icon: Terminal },
    { id: 'settings', label: 'Ajustes', icon: Settings },
  ];

  return (
    <nav className="android-bottom-nav">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id as Tab)}
          className={`android-nav-item ${activeTab === item.id ? 'active' : 'text-outline'}`}
        >
          <div className={`android-nav-indicator ${activeTab === item.id ? 'opacity-100' : 'bg-transparent opacity-0'}`}>
            <item.icon className={`w-6 h-6 ${activeTab === item.id ? 'text-on-primary-container' : 'text-outline'}`} />
          </div>
          <span className="text-[11px] font-medium">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

const AndroidDrawer = ({ isOpen, onClose, activeTab, setActiveTab }: { isOpen: boolean, onClose: () => void, activeTab: Tab, setActiveTab: (t: Tab) => void }) => {
  const menuItems = [
    { id: 'home', label: 'Início', icon: Activity },
    { id: 'notes', label: 'Registro', icon: FileText },
    { id: 'tools', label: 'Ferramentas', icon: Terminal },
    { type: 'separator' },
    { id: 'iphunter', label: 'Verificar IP', icon: Eye },
    { id: 'tether', label: 'Rede Móvel', icon: Radio },
    { id: 'settings', label: 'Configurações', icon: Settings },
    { type: 'separator' },
    { id: 'ssh', label: 'Configurações SSH', icon: Cloud },
    { id: 'v2ray', label: 'V2Ray / Xray', icon: Globe },
    { type: 'separator' },
    { id: 'hwid', label: 'ID do Dispositivo', icon: Fingerprint },
    { type: 'separator' },
    { id: 'exit', label: 'Sair', icon: LogOut },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-80 max-w-[85vw] h-full bg-surface shadow-2xl flex flex-col animate-in slide-in-from-left duration-300 rounded-r-[28px]">
        <div className="p-8 pt-12 bg-primary-container/10">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-4 shadow-lg">
            <Shield className="w-10 h-10 text-on-primary" />
          </div>
          <h2 className="text-xl font-bold text-white">VPN FAST NET PRO</h2>
          <p className="text-xs text-primary font-medium">Versão 8.11 Premium</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {menuItems.map((item: any, idx) => {
            if (item.type === 'separator') {
              return <div key={idx} className="h-px bg-white/5 my-2 mx-4" />;
            }
            return (
              <button
                key={idx}
                onClick={() => {
                  if (item.id === 'exit') {
                    if (confirm('Deseja sair?')) window.close();
                    return;
                  }
                  setActiveTab(item.id as Tab);
                  onClose();
                }}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-full transition-colors ${
                  activeTab === item.id 
                    ? 'bg-primary-container text-on-primary-container font-bold' 
                    : 'text-zinc-400 hover:bg-white/5'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </div>
        
        <div className="p-6 border-t border-white/5 text-[10px] text-zinc-600 font-mono text-center">
          © 2026 EVOZI NETWORKS • ANDROID OPTIMIZED
        </div>
      </div>
    </div>
  );
};
