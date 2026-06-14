import React, { useState, useEffect, useRef } from "react";
import { 
  motion, 
  AnimatePresence 
} from "motion/react";
import { 
  TrendingUp, 
  TrendingDown, 
  Upload, 
  Clock, 
  Search, 
  User, 
  Users, 
  Shield, 
  Bell, 
  LogOut, 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  MessageSquare, 
  DollarSign, 
  Zap, 
  HelpCircle, 
  ArrowRight, 
  Lock, 
  LineChart, 
  RefreshCw, 
  Trash2, 
  Menu, 
  X,
  Award,
  BookOpen,
  PieChart,
  Layers,
  ChevronRight,
  Eye,
  Send
} from "lucide-react";
import { 
  UserStatus, 
  User as UserType, 
  SignalHistory, 
  SystemNotification, 
  UsageStats, 
  DashboardAnalytics 
} from "./types";
import { FireSignalLogo } from "./components/FireSignalLogo";

export default function App() {
  // Loading and Favicon States
  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    // 1. Dynamic Favicon Link Creation
    const svgString = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
        <linearGradient id="flameBack" x1="20" y1="90" x2="80" y2="10" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="40%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#facc15" />
        </linearGradient>
        <linearGradient id="flameFront" x1="30" y1="85" x2="60" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ea580c" />
          <stop offset="60%" stopColor="#facc15" />
          <stop offset="100%" stopColor="#fef08a" />
        </linearGradient>
        <path d="M35,90 C18,85 10,65 14,45 C15,52 18,58 24,62 C20,45 28,25 45,10 C40,28 48,38 52,48 C45,45 38,45 32,55 C24,65 24,80 35,90 Z" fill="url(#flameBack)" opacity="0.95" />
        <path d="M50,92 C68,92 82,75 78,55 C74,38 62,25 58,15 C60,25 58,35 55,42 C50,30 40,25 36,40 C34,48 38,58 45,68 C42,66 38,62 35,58 C32,68 38,82 50,92 Z" fill="url(#flameFront)" />
        <rect x="36" y="65" width="4" height="15" rx="1" fill="#ea580c" opacity="0.8" />
        <rect x="44" y="55" width="4" height="25" rx="1" fill="#facc15" opacity="0.9" />
        <path d="M52,70 L52,45 C52,42 54,40 56,40 L64,40 L64,32 L78,46 L64,60 L64,52 L58,52 C56,52 52,54 52,56 L52,70 Z" fill="#22c55e" transform="rotate(-25 56 46)" />
      </svg>
    `.trim().replace(/\s+/g, ' ');
    
    const tokenized = encodeURIComponent(svgString);
    const dataUrl = `data:image/svg+xml,${tokenized}`;
    
    let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    link.href = dataUrl;

    // 2. Initial Boot Simulation
    const timer = setTimeout(() => {
      setAppLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Global Auth State
  const [token, setToken] = useState<string | null>(localStorage.getItem("fire_signal_token"));
  const [user, setUser] = useState<UserType | null>(null);
  const [authMode, setAuthMode] = useState<"login" | "register" | "verify">("login");
  const [landingMode, setLandingMode] = useState<boolean>(!localStorage.getItem("fire_signal_token"));
  
  // Form structures
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [simulatedCode, setSimulatedCode] = useState("5521");
  const [licensePrompt, setLicensePrompt] = useState(false);

  // Layout selection
  const [currentTab, setCurrentTab] = useState<"analysis" | "history" | "profile" | "notifications" | "admin" | "markets">("analysis");
  const [landingChartView, setLandingChartView] = useState<boolean>(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Application Data States
  const [signalsList, setSignalsList] = useState<SignalHistory[]>([]);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [adminUsers, setAdminUsers] = useState<UserType[]>([]);
  const [adminAnalytics, setAdminAnalytics] = useState<DashboardAnalytics | null>(null);
  const [adminActivityLog, setAdminActivityLog] = useState<any[]>([]);

  // Workspace States (File Upload & Analysis)
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [scanMessage, setScanMessage] = useState("Initializing neural core...");
  const [activeResult, setActiveResult] = useState<SignalHistory | null>(null);

  // Filter States inside History
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDirection, setFilterDirection] = useState<"ALL" | "BUY / UP" | "SELL / DOWN">("ALL");
  const [filterConfidence, setFilterConfidence] = useState<number>(60);

  // Modals / Inspector list
  const [inspectedSignal, setInspectedSignal] = useState<SignalHistory | null>(null);
  const [notificationsPanelOpen, setNotificationsPanelOpen] = useState(false);

  // Global Toast Alert
  const [toast, setToast] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);

  // Live Timer
  const [utcTime, setUtcTime] = useState("");

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Toast Helper
  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Dynamic Clock Tracker
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setUtcTime(now.toISOString().replace("T", "  ").substring(0, 21) + " UTC");
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch initial profile and states if token exists
  useEffect(() => {
    if (token) {
      fetchUserProfile();
    }
  }, [token]);

  // Handle updates when User status changes
  useEffect(() => {
    if (user && user.status === "approved") {
      fetchUserHistory();
      fetchNotifications();
      if (user.isAdmin) {
        fetchAdminData();
      }
    }
  }, [user]);

  // APIs Definitions
  const fetchUserProfile = async () => {
    try {
      const res = await fetch("/api/auth/me", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data);
        if (data.status !== "approved" && !data.isAdmin) {
          setCurrentTab("profile");
        }
      } else {
        // Token expired or invalid
        handleLogout();
      }
    } catch (err) {
      console.error("Profile fetch error", err);
    }
  };

  const fetchUserHistory = async () => {
    try {
      const res = await fetch("/api/user/signals", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSignalsList(data.reverse()); // latest first
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/user/notifications", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.reverse());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const markNotificationsRead = async () => {
    try {
      const res = await fetch("/api/user/notifications/read", {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAdminData = async () => {
    try {
      // Users
      const usersRes = await fetch("/api/admin/users", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (usersRes.ok) {
        const u = await usersRes.json();
        setAdminUsers(u);
      }

      // Analytics
      const analyticsRes = await fetch("/api/admin/analytics", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (analyticsRes.ok) {
        const a = await analyticsRes.json();
        setAdminAnalytics(a);
      }

      // Live log
      const logRes = await fetch("/api/admin/activity-log", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (logRes.ok) {
        const l = await logRes.json();
        setAdminActivityLog(l);
      }
    } catch (err) {
      console.error("Admin aggregation error", err);
    }
  };

  const triggerRequestAccess = async () => {
    try {
      const res = await fetch("/api/user/request-access", {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (user) {
          setUser({ ...user, status: data.status });
        }
        showToast("Access Request successfully broadcasted. Secure Connection Created.", "success");
        fetchNotifications();
      }
    } catch (err) {
      showToast("Access submission failed", "error");
    }
  };

  // Auth Submit Handlers
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formEmail.trim() || !formPassword) {
      showToast("Please provide credentials", "error");
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formEmail, password: formPassword })
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("fire_signal_token", data.token);
        setToken(data.token);
        setUser(data.user);
        setLandingMode(false);
        setFormPassword("");
        showToast(`Welcome back, ${data.user.name}! Connected to mainframe.`, "success");
      } else {
        showToast(data.error || "Authentication failed", "error");
      }
    } catch (err) {
      showToast("Server unreachable", "error");
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim() || !formPassword) {
      showToast("All fields are required", "error");
      return;
    }

    try {
       const res = await fetch("/api/auth/register", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ name: formName, email: formEmail, password: formPassword })
       });
       const data = await res.json();

       if (res.ok) {
         localStorage.setItem("fire_signal_token", data.token);
         setToken(data.token);
         setUser(data.user);
         setLandingMode(false);
         setAuthMode("login");
         setFormName("");
         setFormEmail("");
         setFormPassword("");
         showToast(`Account successfully created! Welcome, ${data.user.name}.`, "success");
       } else {
         showToast(data.error || "Registration failed", "error");
       }
    } catch (err) {
      showToast("Server unreachable", "error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("fire_signal_token");
    setToken(null);
    setUser(null);
    setSignalsList([]);
    setNotifications([]);
    setLandingMode(true);
    setCurrentTab("analysis");
    showToast("Disconnected from trading core.", "info");
  };

  // Administration Commands
  const handleAdminChangeStatus = async (userId: string, newStatus: UserStatus) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/status`, {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        showToast(`User status modified to ${newStatus}`, "success");
        fetchAdminData();
        // If current user, update status
        if (user && user.id === userId) {
          setUser({ ...user, status: newStatus });
        }
      }
    } catch (err) {
      showToast("Administration command failed", "error");
    }
  };

  const handleAdminChangeAccess = async (userId: string, newAccess: boolean) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/access`, {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ has_access: newAccess })
      });
      if (res.ok) {
        showToast(newAccess ? "Access granted successfully! 🟢" : "Access removed successfully. 🔴", "success");
        fetchAdminData();
        // If current user is modified, update local state
        if (user && user.id === userId) {
          setUser({ ...user, has_access: newAccess, status: newAccess ? "Active" : "Inactive" });
        }
      } else {
        const errData = await res.json();
        showToast(errData.error || "Failed to update access status", "error");
      }
    } catch (err) {
      showToast("Administration command failed", "error");
    }
  };

  const handleAdminDeleteUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this user? All historical logs will be discarded.")) return;
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        showToast("User permanently purged from main database", "success");
        fetchAdminData();
      } else {
        const errorData = await res.json();
        showToast(errorData.error || "purge failed", "error");
      }
    } catch (err) {
      showToast("purge failed", "error");
    }
  };

  // File Scanning Logic
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  const processSelectedFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      showToast("Please supply formatted JPG, PNG or WEBP formats", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
      setActiveResult(null);
    };
    reader.readAsDataURL(file);
  };

  const triggerUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  // Run Real AI Scanner after clicking Analyze
  const startAIAnalysis = () => {
    if (!selectedImage) {
      showToast("Drag-and-drop or select a chart snapshot first", "error");
      return;
    }
    setIsAnalyzing(true);
    setAnalysisProgress(0);

    const scanMessages = [
      "Securing mainframe connection...",
      "Reading chart parameters...",
      "Parsing candle volume parameters...",
      "Matching support and resistance grids...",
      "Identifying candlestick patterns...",
      "Triggering AI neural weights search...",
      "Evaluating RSI & MACD cross pivots...",
      "Awaiting premium signal generation...",
      "Finalizing risk ratio scores..."
    ];

    let currentMsgIdx = 0;
    const msgInterval = setInterval(() => {
      if (currentMsgIdx < scanMessages.length - 1) {
        currentMsgIdx++;
        setScanMessage(scanMessages[currentMsgIdx]);
      }
    }, 600);

    // Progress counter (exactly 5.5 seconds simulation)
    const progInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(progInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 110);

    // Make API call
    setTimeout(async () => {
      try {
        const res = await fetch("/api/signals/analyze", {
          method: "POST",
          headers: { 
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ imageBase64: selectedImage })
        });
        const data = await res.json();
        
        clearInterval(msgInterval);
        clearInterval(progInterval);

        if (res.ok) {
          setActiveResult(data);
          fetchUserHistory(); // refresh signal list
          showToast(`Neural analysis completed in ${data.analysisTime}`, "success");
        } else {
          showToast(data.error || "Analysis system error", "error");
        }
      } catch (err) {
        showToast("Mainframe connection lost during scan", "error");
      } finally {
        setIsAnalyzing(false);
      }
    }, 5500);
  };

  // Sandboxed Demo helper: loads an Unsplash image into standard analysis board as local trigger
  const loadSampleChart = (url: string) => {
    setSelectedImage(url);
    setActiveResult(null);
    showToast("Template chart loaded. Click Start Analysis below.", "info");
  };

  // Filter functionality
  const filteredSignals = signalsList.filter(sig => {
    const matchesSearch = sig.reasoning?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          sig.signal.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          sig.date.includes(searchQuery);
    const matchesDirection = filterDirection === "ALL" || sig.signal === filterDirection;
    const matchesConfidence = sig.confidence >= filterConfidence;
    return matchesSearch && matchesDirection && matchesConfidence;
  });

  if (appLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-[#030712] flex flex-col items-center justify-center space-y-6 animate-fade-in">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: [0.8, 1.05, 1], opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex flex-col items-center space-y-4"
        >
          <FireSignalLogo variant="icon" iconSize={80} className="animate-pulse" />
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-amber-100 font-display flex items-center gap-1.5">
              FIRE SIGNAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fbbf24] to-yellow-200">AI</span>
            </h1>
            <p className="text-[10px] font-mono text-slate-500 tracking-[5px] uppercase mt-2 animate-pulse font-bold">
              BOOTING NEURAL SCANNERS...
            </p>
          </div>
        </motion.div>
        
        {/* Progress Bar Loader */}
        <div className="w-48 h-1 bg-slate-900 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
            className="h-full bg-gradient-to-r from-[#ea580c] to-[#fbbf24] rounded-full"
          />
        </div>
      </div>
    );
  }

  return (
    <div id="app_root" className="min-h-screen bg-bg-dark text-slate-100 font-sans relative overflow-x-hidden selection:bg-amber-500 selection:text-black">
      
      {/* Dynamic Background Glow Vectors - Elegant Dark Ambiance */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* GLOBAL TOAST ALERTS */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm w-full shadow-2xl rounded-2xl p-4 border glass-panel flex items-start gap-3 border-[#fbbf24]/20"
          >
            {toast.type === "success" && <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
            {toast.type === "error" && <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />}
            {toast.type === "info" && <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />}
            <div>
              <p className="text-xs font-mono text-[#fbbf24] uppercase tracking-widest font-semibold">{toast.type === "success" ? "CONNECTED" : toast.type === "error" ? "SYSTEM CONFLICT" : "MAINCORE ALERT"}</p>
              <p className="text-sm font-medium text-slate-200 mt-0.5">{toast.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER NAVIGATION */}
      <header className="sticky top-0 z-40 bg-[#070a14]/90 backdrop-blur-xl border-b border-[#fbbf24]/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setLandingMode(true); if (user && (user.status === "approved" || user.status === "Active")) setCurrentTab("analysis"); }}>
          <FireSignalLogo variant="full" iconSize={42} />
        </div>

        {/* CLOCK & PRESETS DISPLAY */}
        <div className="hidden lg:flex items-center gap-4 bg-[#0a0e1a]/80 px-4 py-2 rounded-xl border border-[#fbbf24]/10">
          <Clock className="w-4 h-4 text-[#fbbf24]" />
          <span className="text-xs font-mono text-slate-300 font-medium tracking-wider">{utcTime || "UTC TERMINAL STATUS"}</span>
        </div>

        <nav className="flex items-center gap-4">
          {landingMode ? (
            <>
              <button onClick={() => { setLandingMode(false); setAuthMode("login"); }} className="text-sm font-display font-medium text-slate-300 hover:text-[#fbbf24] transition duration-200">
                Sign In
              </button>
              <button onClick={() => { setLandingMode(false); setAuthMode("register"); }} className="btn-gold-gradient text-sm font-display font-bold px-4 py-2 rounded-xl shadow-lg transition duration-200">
                Get Started
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              {user && (
                <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-bold tracking-widest uppercase border ${
                  user.status === "approved" 
                    ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400" 
                    : user.status === "pending"
                    ? "bg-[#fbbf24]/15 border-[#fbbf24]/35 text-[#fbbf24] animate-pulse"
                    : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />
                  {user.status}
                </div>
              )}

              {/* Notification bell */}
              {user?.status === "approved" && (
                <div className="relative">
                  <button 
                    onClick={() => { setNotificationsPanelOpen(!notificationsPanelOpen); markNotificationsRead(); }}
                    className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
                  >
                    <Bell className="w-5 h-5" />
                    {notifications.some(n => !n.read) && (
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    )}
                  </button>
                  
                  {/* Notifications Popover */}
                  <AnimatePresence>
                    {notificationsPanelOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-80 max-h-[400px] overflow-y-auto glass-panel border border-slate-800 rounded-2xl shadow-2xl p-4 z-50 no-scrollbar"
                      >
                        <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-900 animate-fade-in">
                          <h3 className="text-xs font-mono uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                            <FireSignalLogo variant="icon" iconSize={16} />
                            <span>Alerts Inbox</span>
                          </h3>
                          <button onClick={() => setNotificationsPanelOpen(false)} className="text-xs text-slate-500 hover:text-white">Close</button>
                        </div>
                        {notifications.length === 0 ? (
                          <p className="text-sm text-slate-500 text-center py-6">No notifications on file.</p>
                        ) : (
                          <div className="space-y-3">
                            {notifications.map(n => (
                              <div key={n.id} className={`p-2.5 rounded-xl border ${n.read ? "bg-slate-950/20 border-slate-900/40" : "bg-amber-500/5 border-amber-500/20"}`}>
                                <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                                  {n.type === "approval_granted" && <span className="text-emerald-400">●</span>}
                                  {n.type === "approval_rejected" && <span className="text-rose-500">●</span>}
                                  {n.title}
                                </h4>
                                <p className="text-xs text-slate-400 mt-1">{n.message}</p>
                                <span className="text-[9px] font-mono text-slate-500 mt-1 block">{new Date(n.date).toLocaleDateString()}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              <button 
                onClick={handleLogout}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-rose-500/30 text-slate-400 hover:text-rose-400 transition cursor-pointer"
                title="Disconnect Mainframe"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          )}
        </nav>
      </header>

      {/* MAIN CONTENT ENGINE */}
      <main className="pb-16">
        {landingMode ? (
          /* ================= LANDING MARKETING HOMEPAGE ================= */
          <div className="relative min-h-[calc(100vh-120px)] flex flex-col justify-between overflow-hidden bg-black text-slate-100 font-sans">
            
            {/* LUXURY BACKGROUND EFFECTS */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
              {/* Soft gold/amber lighting radial effects */}
              <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-amber-500/[0.04] rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '8s' }} />
              <div className="absolute top-[40%] right-[10%] w-[400px] h-[400px] bg-amber-600/[0.03] rounded-full blur-[100px]" />
              
              {/* Subtle Grid overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(251,191,36,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(251,191,36,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]" />

              {/* Animated Gold Trading Chart Path */}
              <svg className="absolute bottom-1/4 left-0 w-full h-48 opacity-15" viewBox="0 0 1440 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <motion.path 
                  d="M0,150 C150,110 250,190 400,130 C550,70 650,160 800,100 C950,40 1050,110 1200,60 C1350,10 1400,90 1440,50"
                  stroke="url(#goldGradient)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 3.5, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
                />
                <defs>
                  <linearGradient id="goldGradient" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#d97706" />
                    <stop offset="50%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#fef08a" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Floating Glassmorphism Cards */}
              <motion.div 
                initial={{ y: 20, x: -10, opacity: 0 }}
                animate={{ y: [0, -15, 0], x: [0, 8, 0], opacity: 1 }}
                transition={{ duration: 6, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
                className="absolute top-[18%] left-[8%] hidden xl:flex items-center gap-3 glass-panel p-3 rounded-2xl border border-slate-800/60 shadow-2xl backdrop-blur-xl bg-slate-950/40"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute left-3" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono text-slate-500 tracking-wider">BTC/USDT</span>
                  <span className="text-xs font-bold text-emerald-400 font-mono">🟢 BUY +5.4%</span>
                </div>
              </motion.div>

              <motion.div 
                initial={{ y: -20, x: 10, opacity: 0 }}
                animate={{ y: [0, 15, 0], x: [0, -8, 0], opacity: 1 }}
                transition={{ duration: 7, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }}
                className="absolute bottom-[35%] right-[8%] hidden xl:flex items-center gap-3 glass-panel p-3 rounded-2xl border border-slate-800/60 shadow-2xl backdrop-blur-xl bg-slate-950/40"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono text-slate-500 tracking-wider">XAU/USD</span>
                  <span className="text-xs font-bold text-rose-400 font-mono">🔴 SELL -1.9%</span>
                </div>
              </motion.div>
            </div>

            {/* HERO SECTION CONTAINER */}
            <div className="relative z-10 flex flex-col justify-center items-center px-6 pt-16 md:pt-28 pb-12 w-full text-center max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="mb-8 select-none"
              >
                <FireSignalLogo variant="icon" iconSize={120} />
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-5xl md:text-8xl font-black font-display tracking-tight text-white mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-slate-400"
              >
                Fire Signal AI
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15 }}
                className="inline-block text-xs md:text-sm font-mono tracking-[0.4em] uppercase text-amber-400 bg-amber-500/5 px-6 py-2.5 rounded-full border border-amber-500/15 mb-12 max-w-max mx-auto shadow-sm shadow-amber-500/5 select-none"
              >
                Born To Trade
              </motion.p>

              {/* Luxe Button Layout as described */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex flex-col lg:flex-row items-center justify-center gap-4 w-full max-w-3xl mx-auto"
              >
                <button 
                  onClick={() => { setLandingMode(false); setAuthMode("register"); }}
                  className="w-full lg:w-52 px-6 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-[#fbbf24] text-slate-950 font-display font-black text-xs tracking-widest uppercase transition-all duration-300 transform hover:scale-[1.03] hover:shadow-lg hover:shadow-amber-500/20 active:scale-[0.98] cursor-pointer"
                >
                  Get Started
                </button>
                <button 
                  onClick={() => { setLandingMode(false); setAuthMode("login"); }}
                  className="w-full lg:w-52 px-6 py-4 rounded-xl bg-slate-950/70 text-white font-display font-semibold text-xs tracking-widest uppercase border border-slate-800 hover:border-amber-500/40 hover:bg-slate-950/90 transition-all duration-300 transform hover:scale-[1.03] hover:shadow-lg hover:shadow-slate-950/50 active:scale-[0.98] cursor-pointer"
                >
                  Login
                </button>
                <a 
                  href="https://t.me/coderxx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full lg:w-52 px-6 py-4 rounded-xl bg-sky-950/40 text-sky-400 font-display font-semibold text-xs tracking-widest uppercase border border-sky-500/20 hover:border-sky-400 hover:bg-sky-500/20 hover:text-sky-300 transition-all duration-300 transform hover:scale-[1.03] hover:shadow-lg hover:shadow-sky-500/10 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.24-5.52 3.65-.52.36-.99.53-1.41.52-.46-.01-1.35-.26-2.01-.48-.81-.27-1.46-.42-1.4-.88.03-.24.38-.49 1.04-.75 4.07-1.77 6.79-2.94 8.16-3.5 3.89-1.61 4.7-1.89 5.23-1.9.12 0 .38.03.55.17.14.12.18.28.19.45-.01.07-.02.16-.03.25z"/>
                  </svg>
                  <span>Contact Owner</span>
                </a>
              </motion.div>
            </div>

            {/* FOOTER */}
            <footer className="relative z-10 text-center py-10 border-t border-slate-950 text-slate-600 text-[11px] font-sans flex flex-col items-center justify-center gap-2 select-none">
              <FireSignalLogo variant="icon" iconSize={24} className="opacity-30 hover:opacity-75 transition-opacity" />
              <p>© 2026 Fire Signal AI. All rights reserved. Professional Trading Software.</p>
            </footer>

          </div>
        ) : !token ? (
          /* ================= LOGIN / REGISTER / VERIFY FLOW ================= */
          <div className="max-w-md w-full mx-auto px-6 pt-16">
            <div className="glass-panel p-8 rounded-3xl border border-slate-900 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex flex-col items-center justify-center mb-6 pb-6 border-b border-slate-900">
                <FireSignalLogo variant="full" iconSize={48} />
              </div>

              <div className="text-center mb-8">
                <h2 className="text-3xl font-display font-bold text-white uppercase tracking-tight">
                  {authMode === "login" ? "WORKSPACE LOGIN" : authMode === "register" ? "INITIALIZE ACCOUNT" : "JWT VERIFICATION"}
                </h2>
                <p className="text-xs text-[#fbbf24] font-mono tracking-widest uppercase mt-1">
                  {authMode === "login" ? "Secure entry portal" : authMode === "register" ? "Create trade profile" : "Verification token screen"}
                </p>
              </div>

              {authMode === "login" && (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
                    <input 
                      type="email" 
                      value={formEmail} 
                      onChange={(e) => setFormEmail(e.target.value)} 
                      className="w-full px-4 py-3 rounded-xl border glass-input font-sans text-sm text-slate-100" 
                      placeholder="trader@domain.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">Password</label>
                    <input 
                      type="password" 
                      value={formPassword} 
                      onChange={(e) => setFormPassword(e.target.value)} 
                      className="w-full px-4 py-3 rounded-xl border glass-input font-sans text-sm text-[#fbbf24]" 
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  
                  <div className="flex items-center justify-between text-xs font-mono pt-1">
                    <button type="button" onClick={() => showToast("Password resets are handled by contacting owner: @coderxx", "info")} className="text-slate-400 hover:text-[#fbbf24] transition">Forgot Password?</button>
                  </div>

                  <button type="submit" className="w-full btn-gold-gradient font-bold py-3.5 rounded-xl transition font-display mt-2 cursor-pointer">
                    Login Terminal
                  </button>

                  <p className="text-center text-xs text-slate-400 mt-6 pt-4 border-t border-slate-900/60">
                    Need an account?{" "}
                    <button type="button" onClick={() => setAuthMode("register")} className="text-amber-400 hover:underline">
                      Register Here
                    </button>
                  </p>
                </form>
              )}

              {authMode === "register" && (
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">Your Full Name</label>
                    <input 
                      type="text" 
                      value={formName} 
                      onChange={(e) => setFormName(e.target.value)} 
                      className="w-full px-4 py-3 rounded-xl border glass-input font-sans text-sm text-slate-100" 
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
                    <input 
                      type="email" 
                      value={formEmail} 
                      onChange={(e) => setFormEmail(e.target.value)} 
                      className="w-full px-4 py-3 rounded-xl border glass-input font-sans text-sm text-slate-100" 
                      placeholder="trader@domain.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">Password</label>
                    <input 
                      type="password" 
                      value={formPassword} 
                      onChange={(e) => setFormPassword(e.target.value)} 
                      className="w-full px-4 py-3 rounded-xl border glass-input font-sans text-sm text-[#fbbf24]" 
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  <button type="submit" className="w-full btn-gold-gradient font-bold py-3.5 rounded-xl transition font-display mt-2 cursor-pointer">
                    Create Account
                  </button>

                  <p className="text-center text-xs text-slate-400 mt-6 pt-4 border-t border-slate-900/60">
                    Already registered?{" "}
                    <button type="button" onClick={() => setAuthMode("login")} className="text-amber-400 hover:underline">
                      Sign In
                    </button>
                  </p>
                </form>
              )}

              {/* Need Help? Supported Telegram button */}
              <div className="mt-6 pt-6 border-t border-slate-900/60 flex flex-col items-center">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-sans mb-2.5">
                  Need Help?
                </span>
                <a 
                  href="https://t.me/coderxx" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-950/40 hover:bg-slate-900/40 border border-slate-800 hover:border-[#fbbf24]/30 text-xs font-mono font-bold text-amber-400 tracking-widest uppercase shadow-lg transition duration-300 ease-out hover:scale-[1.02] active:scale-[0.98] cursor-pointer group"
                >
                  <Send className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition duration-300" />
                  Contact Owner
                </a>
              </div>

            </div>

            <div className="text-center mt-6">
              <button onClick={() => setLandingMode(true)} className="text-xs text-slate-500 hover:text-slate-300 underline block mx-auto transition duration-200">
                Return to marketing home
              </button>
            </div>
          </div>
        ) : (
          /* ================= REGISTERED MAIN DASHBOARD CONTAINER ================= */
          <div className="max-w-7xl mx-auto px-6 mt-6">
            <div className="grid lg:grid-cols-12 gap-8">
              
              {/* LEFT DASHBOARD RAIL (TABS) */}
              <div className="lg:col-span-3 space-y-4">
                <div className="glass-panel p-4 rounded-2xl border border-slate-900">
                  <div className="flex justify-center mb-4 pb-4 border-b border-slate-900/60">
                    <FireSignalLogo variant="full" iconSize={36} />
                  </div>

                  <div className="flex items-center gap-3 px-2 pb-3 border-b border-slate-900 mb-4">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-mono text-xs font-bold font-display">
                      {user?.name.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                      <p className="text-[10px] font-mono text-slate-500 truncate">{user?.email}</p>
                    </div>
                  </div>

                  {user && (
                    <div className="mb-4 p-3 bg-slate-950/60 rounded-xl border border-slate-900 flex flex-col gap-1.5 font-mono text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 text-[10px] uppercase">Status:</span>
                        <span className={`font-bold uppercase ${
                          (user.status === "approved" || user.status === "Active")
                            ? "text-emerald-400"
                            : "text-rose-400 font-bold"
                        }`}>
                          {user.status === "approved" || user.status === "Active" ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 text-[10px] uppercase">Access:</span>
                        <span className={`font-bold ${user.has_access || user.isAdmin ? "text-emerald-400" : "text-rose-400"}`}>
                          {user.has_access || user.isAdmin ? "Granted" : "Not Granted"}
                        </span>
                      </div>
                    </div>
                  )}

                  <nav className="space-y-1.5">
                    {user && (
                      <>
                        <button 
                          onClick={() => { setCurrentTab("analysis"); setMobileMenuOpen(false); }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-display font-medium transition cursor-pointer ${
                            currentTab === "analysis" ? "bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-slate-950 font-bold shadow-lg shadow-amber-500/15" : "text-slate-400 hover:bg-[#fbbf24]/5 hover:text-white"
                          }`}
                        >
                          <LineChart className="w-4 h-4 shrink-0 font-bold" />
                          AI Signal Workspace
                        </button>

                        <button 
                          onClick={() => { setCurrentTab("history"); setMobileMenuOpen(false); }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-display font-medium transition cursor-pointer ${
                            currentTab === "history" ? "bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-slate-950 font-bold shadow-lg shadow-amber-500/15" : "text-slate-400 hover:bg-[#fbbf24]/5 hover:text-white"
                          }`}
                        >
                          <FileText className="w-4 h-4 shrink-0" />
                          Scan History
                        </button>
                      </>
                    )}

                    <button 
                      onClick={() => { setCurrentTab("markets"); setMobileMenuOpen(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-display font-medium transition cursor-pointer ${
                        currentTab === "markets" ? "bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-slate-950 font-bold shadow-lg shadow-amber-500/15" : "text-slate-400 hover:bg-[#fbbf24]/5 hover:text-white"
                      }`}
                    >
                      <TrendingUp className="w-4 h-4 shrink-0" />
                      Live Market Charts
                    </button>

                    <button 
                      onClick={() => { setCurrentTab("profile"); setMobileMenuOpen(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-display font-medium transition cursor-pointer ${
                        currentTab === "profile" ? "bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-slate-950 font-bold shadow-lg shadow-amber-500/15" : "text-slate-400 hover:bg-[#fbbf24]/5 hover:text-white"
                      }`}
                    >
                      <User className="w-4 h-4 shrink-0" />
                      Trader Profile
                    </button>

                    {user?.isAdmin && (
                      <button 
                        onClick={() => { setCurrentTab("admin"); setMobileMenuOpen(false); fetchAdminData(); }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-display font-medium transition cursor-pointer ${
                          currentTab === "admin" ? "bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-slate-950 font-bold shadow-lg shadow-amber-500/15" : "text-slate-400 hover:bg-amber-900/40 hover:text-white"
                        }`}
                      >
                        <Shield className="w-4 h-4 shrink-0 text-slate-900" />
                        Admin Headquarters
                      </button>
                    )}
                  </nav>
                </div>

                {/* ADVERTISING license rail */}
                <div className="glass-panel p-4 rounded-2xl border border-slate-900 relative overflow-hidden text-center">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/10 rounded-full blur-2xl" />
                  <Award className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                  <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">LICENSE INQUIRIES</p>
                  <p className="text-xs text-slate-500 leading-relaxed mt-1">For manual approval, unlimited queries or custom integrations, message our master root.</p>
                  <a href="https://t.me/coderxx" target="_blank" rel="noopener noreferrer" className="block text-xs font-mono text-amber-400 font-bold uppercase tracking-widest mt-3 hover:underline">
                    @coderxx on Telegram
                  </a>
                </div>
              </div>

              {/* RIGHT WORKSPACE PANELS */}
              <div className="lg:col-span-9">
                
                {/* 1. APPROVAL REQUIRED COVER SHEET (if not approved and not on profile tab) */}
                {user && (user.status === "pending" || user.status === "rejected" || user.status === "suspended") && currentTab !== "profile" && (
                  <div className="glass-panel p-8 rounded-3xl border border-slate-900 text-center relative overflow-hidden py-16">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-rose-500/5 rounded-full blur-[100px] pointer-events-none" />
                    
                    <Lock className="w-16 h-16 text-rose-500 mx-auto mb-6 stroke-[1.5] animate-pulse" />
                    <h2 className="text-3xl font-bold font-display text-white">ACCESS BLOCKED: LICENSE INACTIVE</h2>
                    
                    {user.status === "pending" && (
                      <p className="text-slate-400 max-w-xl mx-auto mt-4 leading-relaxed font-sans text-sm">
                        Your account application is currently <span className="font-mono text-amber-400 font-bold p-1 bg-amber-500/10 rounded border border-amber-500/20">AWAITING APPROVAL</span>.<br />
                        Our trade supervisors verify standard licenses iteratively. Connect on Telegram directly for priority manual activation code.
                      </p>
                    )}

                    {user.status === "rejected" && (
                      <p className="text-slate-400 max-w-xl mx-auto mt-4 leading-relaxed font-sans text-sm">
                        Your license application has been <span className="font-mono text-rose-400 font-bold p-1 bg-rose-500/10 rounded border border-rose-500/20">REJECTED</span> by moderators.<br />
                        Please check credential indexes or acquire a master trader license key.
                      </p>
                    )}

                    {user.status === "suspended" && (
                      <p className="text-slate-400 max-w-xl mx-auto mt-4 leading-relaxed font-sans text-sm">
                        Your server queries are <span className="font-mono text-rose-400 font-bold p-1 bg-rose-500/10 rounded border border-rose-500/20">SUSPENDED</span> due to token spikes.<br />
                        Contact core support team to reconcile parameters.
                      </p>
                    )}

                    {user.status === "pending" && (
                      <button 
                         onClick={triggerRequestAccess}
                        className="bg-slate-900 hover:bg-slate-800 text-slate-100 font-mono text-xs font-bold px-6 py-3 rounded-xl border border-slate-800 hover:border-slate-700 transition mt-6 tracking-widest uppercase cursor-pointer"
                      >
                        Renew Handshake Request
                      </button>
                    )}

                    <div className="mt-8 pt-8 border-t border-slate-900 max-w-xs mx-auto">
                      <p className="text-xs font-mono text-slate-500 uppercase">Telegram License Master</p>
                      <a 
                        href="https://t.me/coderxx" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-2 mt-2 font-mono text-sm font-bold text-amber-400 hover:text-amber-300 hover:underline transition"
                      >
                        t.me/coderxx <ChevronRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                )}

                {/* Tab workspaces (if user is approved, or on profile page or live chart page) */}
                {((user && (user.status === "approved" || user.status === "Active" || user.status === "Inactive")) || currentTab === "profile" || currentTab === "markets" || user?.isAdmin) && (
                  <div>
                    <AnimatePresence mode="wait">
                      
                      {/* T1. SCANNED WORKSPACE (ANALYSIS) */}
                      {currentTab === "analysis" && (
                        <motion.div 
                          key="tab_analysis"
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -15 }}
                          className="space-y-6"
                        >
                          {!user?.has_access && !user?.isAdmin ? (
                            /* Beautiful Access Required Cover Panel */
                            <div className="glass-panel p-8 py-16 rounded-3xl border border-dashed border-[#fbbf24]/20 text-center max-w-xl mx-auto space-y-6 my-12 animate-fade-in relative overflow-hidden glow-gold">
                              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#fbbf24] to-transparent animate-pulse" />
                              <div className="w-16 h-16 rounded-2xl bg-[#fbbf24]/10 border border-[#fbbf24]/20 mx-auto flex items-center justify-center">
                                <Lock className="w-8 h-8 text-[#fbbf24] animate-pulse" />
                              </div>
                              <div className="space-y-2">
                                <h3 className="text-3xl font-bold font-display text-white">Access Required</h3>
                                <p className="text-sm font-semibold text-slate-200">
                                  Your account is currently inactive. Please contact @coderxx to request access.
                                </p>
                              </div>
                              <div className="pt-2">
                                <a 
                                  href="https://t.me/coderxx" 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="inline-flex items-center gap-2 btn-gold-gradient px-6 py-3.5 rounded-xl font-bold font-display text-sm uppercase tracking-wider cursor-pointer shadow-lg hover:shadow-amber-500/20 text-slate-950 font-black"
                                >
                                  Contact on Telegram
                                </a>
                              </div>
                            </div>
                          ) : (
                            <>
                              {/* Live Performance Header Metrics */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="glass-panel p-4 rounded-2xl border border-slate-900">
                              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Total Scans Run</p>
                              <p className="text-2xl font-bold font-mono text-white mt-1">{signalsList.length}</p>
                            </div>
                            <div className="glass-panel p-4 rounded-2xl border border-slate-900">
                              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Signals Today</p>
                              <p className="text-2xl font-bold font-mono text-white mt-1">
                                {signalsList.filter(s => s.date === new Date().toISOString().split("T")[0]).length}
                              </p>
                            </div>
                            <div className="glass-panel p-4 rounded-2xl border border-slate-900">
                              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Average Confidence</p>
                              <p className="text-2xl font-bold font-mono text-emerald-400 mt-1">91.8%</p>
                            </div>
                            <div className="glass-panel p-4 rounded-2xl border border-slate-900">
                              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Neural Port</p>
                              <p className="text-2xl font-bold font-mono text-amber-500 mt-1 flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                                LIVE
                              </p>
                            </div>
                          </div>

                          {/* Dual Drag Drag scanner board & Result display */}
                          <div className="grid md:grid-cols-12 gap-6">
                            
                            {/* Drag Board Component */}
                            <div className="md:col-span-7 space-y-4">
                              <div className="glass-panel p-6 rounded-3xl border border-slate-900 space-y-4">
                                <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
                                  <Layers className="w-5 h-5 text-amber-400" /> Chart Scanning Sandbox
                                </h3>

                                <div 
                                  onDragOver={handleDragOver}
                                  onDragLeave={handleDragLeave}
                                  onDrop={handleDrop}
                                  onClick={triggerUploadClick}
                                  className={`relative group border-2 border-dashed rounded-2xl p-8 py-12 flex flex-col items-center justify-center text-center cursor-pointer transition ${
                                    isDragging 
                                      ? "border-amber-400 bg-amber-500/5" 
                                      : selectedImage 
                                      ? "border-slate-800 bg-slate-950/20" 
                                      : "border-slate-800 bg-slate-950/50 hover:border-slate-700 hover:bg-slate-900/10"
                                  }`}
                                >
                                  <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    onChange={handleFileChange} 
                                    accept="image/*" 
                                    className="hidden" 
                                  />

                                  {isAnalyzing && (
                                    <div className="absolute inset-0 bg-[#030712]/90 rounded-2xl flex flex-col items-center justify-center p-6 z-10">
                                      <div className="w-full max-w-xs space-y-3 relative">
                                        <div className="flex items-center justify-between font-mono text-xs text-slate-400 uppercase tracking-wider">
                                          <span>AI Scanner Analysis</span>
                                          <span className="text-amber-400 font-bold">{analysisProgress}%</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                                          <div className="h-full bg-amber-500 rounded-full transition-all duration-100 ease-out" style={{ width: `${analysisProgress}%` }} />
                                        </div>
                                        <p className="text-xs font-mono text-slate-300 animate-pulse text-center">{scanMessage}</p>
                                        <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-slate-500">
                                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                                          ESTIMATED TIME LEFT: {Math.max(0, Math.ceil((100 - analysisProgress) * 0.055))}s
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {selectedImage ? (
                                    <div className="w-full relative overflow-hidden rounded-xl bg-slate-950">
                                      {/* Laser Scanning Line Animation */}
                                      {isAnalyzing && <div className="animate-scanline" />}
                                      <img src={selectedImage} alt="Scanned chart" className="max-h-[250px] w-full object-cover rounded-xl" />
                                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent flex items-end justify-center p-2">
                                        <span className="text-[10px] font-mono bg-slate-900/95 text-slate-400 border border-slate-800 px-2 py-1 rounded">Click panel to change screenshot</span>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="space-y-4">
                                      <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto group-hover:scale-105 transition-transform">
                                        <Upload className="w-7 h-7" />
                                      </div>
                                      <div>
                                        <p className="text-sm font-semibold text-slate-200">Drag Trading Chart Screenshot Here</p>
                                        <p className="text-xs text-slate-500 mt-1">Accepts PNG, JPG, WEBP formats from MT4 / MT5 / TradingView</p>
                                      </div>
                                      <span className="inline-block px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-amber-400 font-medium tracking-wide">
                                        Select File From Disk
                                      </span>
                                    </div>
                                  )}
                                </div>

                                {/* Active Command Controls */}
                                <div className="flex gap-4">
                                  {selectedImage && !isAnalyzing && (
                                    <button 
                                      onClick={() => setSelectedImage(null)} 
                                      className="bg-slate-950 hover:bg-slate-900 text-white font-mono text-xs font-bold px-5 rounded-xl border border-[#fbbf24]/20 transition py-3"
                                    >
                                      Reset
                                    </button>
                                  )}
                                  <button 
                                    onClick={startAIAnalysis}
                                    disabled={!selectedImage || isAnalyzing}
                                    className={`flex-1 font-display font-bold py-3.5 rounded-xl transition text-center shadow-lg cursor-pointer ${
                                      !selectedImage 
                                        ? "bg-slate-900/50 text-slate-600 border border-slate-950 cursor-not-allowed shadow-none" 
                                        : isAnalyzing 
                                        ? "bg-amber-500/20 text-amber-400 cursor-not-allowed animate-pulse" 
                                        : "btn-gold-gradient shadow-amber-500/10"
                                    }`}
                                  >
                                    {isAnalyzing ? "Scanning Screenshot Analysis..." : "Start Neural Analysis"}
                                  </button>
                                </div>
                              </div>

                            </div>

                            {/* Signal Output Result Screen */}
                            <div className="md:col-span-5">
                              {activeResult ? (
                                <motion.div 
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="glass-panel p-6 rounded-3xl border border-slate-900 text-center space-y-6 relative overflow-hidden"
                                >
                                  {/* Pulsating background indicators */}
                                  <div className={`absolute top-0 left-0 w-full h-[60px] opacity-10 bg-gradient-to-b ${
                                    activeResult.signal === "BUY / UP" ? "from-emerald-500" : "from-rose-500"
                                  }`} />

                                  <div className="relative">
                                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">AI SCAN OUTCOME</span>
                                    <h4 className="text-xs font-mono text-amber-400 mt-1">Generated at {activeResult.time} ({activeResult.analysisTime})</h4>
                                  </div>

                                  {/* Large Actionable Button Response */}
                                  <div className="py-4">
                                    {activeResult.signal === "BUY / UP" ? (
                                      <motion.div 
                                        animate={{ scale: [1, 1.02, 1] }}
                                        transition={{ repeat: Infinity, duration: 2.5 }}
                                        className="inline-flex flex-col items-center justify-center p-6 px-12 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/80 text-emerald-400 glow-green"
                                      >
                                        <TrendingUp className="w-12 h-12 mb-2 animate-bounce" />
                                        <span className="text-3xl font-display font-black tracking-widest block">🟢 BUY / UP</span>
                                        <span className="text-xs font-mono text-emerald-300 tracking-wider">Bullish Trend Scanner</span>
                                      </motion.div>
                                    ) : (
                                      <motion.div 
                                        animate={{ scale: [1, 1.02, 1] }}
                                        transition={{ repeat: Infinity, duration: 2.5 }}
                                        className="inline-flex flex-col items-center justify-center p-6 px-12 rounded-2xl bg-rose-500/10 border-2 border-rose-500/80 text-rose-400 glow-red"
                                      >
                                        <TrendingDown className="w-12 h-12 mb-2 animate-bounce" />
                                        <span className="text-3xl font-display font-black tracking-widest block">🔴 SELL / DOWN</span>
                                        <span className="text-xs font-mono text-rose-300 tracking-wider">Bearish Distribution scan</span>
                                      </motion.div>
                                    )}
                                  </div>

                                  {/* Slider Scale for Confidence Rating */}
                                  <div className="space-y-2 bg-slate-950/40 p-4 rounded-xl border border-slate-900">
                                    <div className="flex justify-between font-mono text-xs">
                                      <span className="text-slate-400 uppercase tracking-wide">Confidence Quotient</span>
                                      <span className={activeResult.signal === "BUY / UP" ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                                        {activeResult.confidence}% Confidence
                                      </span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                                      <div className={`h-full ${
                                        activeResult.signal === "BUY / UP" ? "bg-emerald-500" : "bg-rose-500"
                                      }`} style={{ width: `${activeResult.confidence}%` }} />
                                    </div>
                                  </div>

                                  {/* Explanatory AI analysis text block */}
                                  <div className="text-left bg-slate-950/60 p-4 rounded-2xl border border-slate-900 font-sans space-y-2">
                                    <p className="text-xs font-mono uppercase text-slate-500 tracking-wider">AI Cues & Support bounds</p>
                                    <p className="text-xs text-slate-300 leading-relaxed font-sans">{activeResult.reasoning || "Technical readings highlight high localized probability setups."}</p>
                                  </div>

                                  <button 
                                    onClick={() => { setSelectedImage(null); setActiveResult(null); }}
                                    className="w-full py-2.5 rounded-xl border border-slate-800 text-xs font-mono hover:border-slate-700 hover:bg-slate-900 text-slate-400 hover:text-white transition cursor-pointer"
                                  >
                                    Scan Another trading Chart
                                  </button>
                                </motion.div>
                              ) : (
                                <div className="glass-panel p-8 rounded-3xl border border-slate-900 text-center py-16 flex flex-col items-center justify-center space-y-4 h-full min-h-[300px]">
                                  <FireSignalLogo variant="icon" iconSize={56} className="opacity-30 mb-2 animate-pulse" />
                                  <div>
                                    <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider font-display">Awaiting Chart Load</h4>
                                    <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">Please select a chart screenshot from MT4 or MT5 dashboard and press analyze button.</p>
                                  </div>
                                </div>
                              )}
                              </div>
                            </div>
                          </>
                        )}
                      </motion.div>
                      )}

                      {/* T2. HISTORY ARCHIVE CORES (HISTORY) */}
                      {currentTab === "history" && (
                        <motion.div 
                          key="tab_history"
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -15 }}
                          className="space-y-6"
                        >
                          {!user?.has_access && !user?.isAdmin ? (
                            /* Beautiful Access Required Cover Panel */
                            <div className="glass-panel p-8 py-16 rounded-3xl border border-dashed border-[#fbbf24]/20 text-center max-w-xl mx-auto space-y-6 my-12 animate-fade-in relative overflow-hidden glow-gold">
                              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#fbbf24] to-transparent animate-pulse" />
                              <div className="w-16 h-16 rounded-2xl bg-[#fbbf24]/10 border border-[#fbbf24]/20 mx-auto flex items-center justify-center">
                                <Lock className="w-8 h-8 text-[#fbbf24] animate-pulse" />
                              </div>
                              <div className="space-y-4">
                                <h3 className="text-3xl font-bold font-display text-white">Access Required</h3>
                                <p className="text-sm font-semibold text-slate-200">
                                  Your account is currently inactive. Please contact @coderxx to request access.
                                </p>
                              </div>
                              <div className="pt-2">
                                <a 
                                  href="https://t.me/coderxx" 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="inline-flex items-center gap-2 btn-gold-gradient px-6 py-3.5 rounded-xl font-bold font-display text-sm uppercase tracking-wider cursor-pointer shadow-lg hover:shadow-amber-500/20 text-slate-950 font-black"
                                >
                                  Contact on Telegram
                                </a>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="glass-panel p-6 rounded-3xl border border-slate-900">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-4 mb-6">
                              <div>
                                <h3 className="text-xl font-bold font-display text-white">Signal History & Verification Logs</h3>
                                <p className="text-xs text-slate-500">Database audits index for previous chart scans</p>
                              </div>

                              {/* Search Query */}
                              <div className="relative">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input 
                                  type="text" 
                                  value={searchQuery}
                                  onChange={(e) => setSearchQuery(e.target.value)}
                                  className="pl-9 pr-4 py-2 text-xs rounded-xl glass-input w-full md:w-64 font-sans text-slate-100 placeholder:text-slate-500"
                                  placeholder="Search reasonings, signals, dates..."
                                />
                              </div>
                            </div>

                            {/* Layout Controllers */}
                            <div className="flex flex-wrap items-center gap-4 bg-slate-950/40 p-4 rounded-xl border border-slate-900 mb-6 font-mono text-xs">
                              <div>
                                <span className="text-slate-500 uppercase tracking-wider block mb-1">Signal Filters</span>
                                <div className="flex gap-1.5">
                                  {["ALL", "BUY / UP", "SELL / DOWN"].map(dir => (
                                    <button 
                                      key={dir}
                                      onClick={() => setFilterDirection(dir as any)}
                                      className={`px-3 py-1 rounded text-[10px] uppercase font-bold tracking-wider ${
                                        filterDirection === dir ? "bg-amber-500 text-slate-950 font-black" : "bg-slate-900 text-slate-400 hover:text-white"
                                      }`}
                                    >
                                      {dir}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <div className="flex-1 min-w-[200px]">
                                <div className="flex justify-between text-slate-500 tracking-wider mb-1">
                                  <span>MIN CONFIDENCE RATE</span>
                                  <span className="text-amber-400 font-bold">{filterConfidence}%</span>
                                </div>
                                <input 
                                  type="range" 
                                  min={60} 
                                  max={95} 
                                  value={filterConfidence}
                                  onChange={(e) => setFilterConfidence(Number(e.target.value))}
                                  className="w-full accent-amber-500"
                                />
                              </div>
                            </div>

                            {/* Tables Grid database representation */}
                            {filteredSignals.length === 0 ? (
                              <div className="text-center py-16 text-slate-500 text-sm flex flex-col items-center justify-center gap-3">
                                <FireSignalLogo variant="icon" iconSize={48} className="opacity-30 mb-1" />
                                <span>No signals match structural queries on current indexes.</span>
                              </div>
                            ) : (
                              <div className="overflow-x-auto">
                                <table className="w-full text-left font-sans text-sm">
                                  <thead>
                                    <tr className="border-b border-slate-900 text-slate-400 text-xs uppercase font-mono tracking-wider">
                                      <th className="pb-3 font-semibold">Screenshot preview</th>
                                      <th className="pb-3 font-semibold">Timestamp</th>
                                      <th className="pb-3 font-semibold">Direction</th>
                                      <th className="pb-3 font-semibold">Confidence</th>
                                      <th className="pb-3 font-semibold">Scan Speed</th>
                                      <th className="pb-3 font-semibold">Readings</th>
                                      <th className="pb-3 text-right">Actions</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-900/60 font-sans">
                                    {filteredSignals.map(sig => (
                                      <tr key={sig.id} className="hover:bg-slate-900/10 transition group">
                                        <td className="py-3">
                                          <div className="w-14 h-10 rounded border border-slate-800 overflow-hidden relative cursor-pointer" onClick={() => setInspectedSignal(sig)}>
                                            <img src={sig.screenshot} alt="scan preview" className="w-full h-full object-cover opacity-60 hover:opacity-100 transition" />
                                            <Eye className="w-3.5 h-3.5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 group-hover:opacity-100 transition" />
                                          </div>
                                        </td>
                                        <td className="py-3 text-slate-300 font-mono text-xs">
                                          {sig.date}<br />
                                          <span className="text-slate-500">{sig.time}</span>
                                        </td>
                                        <td className="py-3">
                                          <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-mono font-bold ${
                                            sig.signal === "BUY / UP" ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20" : "text-rose-400 bg-rose-500/10 border border-rose-500/20"
                                          }`}>
                                            {sig.signal === "BUY / UP" ? "BUY 🟢" : "SELL 🔴"}
                                          </span>
                                        </td>
                                        <td className="py-3 font-mono text-xs font-bold text-slate-200">
                                          {sig.confidence}%
                                        </td>
                                        <td className="py-3 font-mono text-xs text-slate-400">
                                          {sig.analysisTime || "5.4s"}
                                        </td>
                                        <td className="py-3 text-xs text-slate-400 max-w-xs truncate" title={sig.reasoning}>
                                          {sig.reasoning}
                                        </td>
                                        <td className="py-3 text-right">
                                          <button 
                                            onClick={() => setInspectedSignal(sig)}
                                            className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-xs font-mono border border-slate-800 hover:border-slate-700 rounded-lg transition"
                                          >
                                            Inspect Match
                                          </button>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                            </div>
                            </>
                          )}
                        </motion.div>
                      )}

                      {/* T5. LIVE MARKET CHARTS WORKSPACE (MARKETS) */}
                      {currentTab === "markets" && (
                        <motion.div 
                          key="tab_markets"
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -15 }}
                          className="space-y-6"
                        >
                          <LiveTradingViewChart />
                        </motion.div>
                      )}

                      {/* T3. TRADER PROFILE (PROFILE) */}
                      {currentTab === "profile" && (
                        <motion.div 
                          key="tab_profile"
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -15 }}
                          className="space-y-6"
                        >
                          <div className="glass-panel p-6 rounded-3xl border border-slate-900 max-w-2xl mx-auto">
                            <div className="flex flex-col items-center justify-center mb-6 pb-6 border-b border-slate-900 text-center gap-2">
                              <FireSignalLogo variant="full" iconSize={54} />
                            </div>
                            <h3 className="text-lg font-bold font-display text-white pb-3 border-b border-slate-900/40 mb-6 uppercase tracking-wider font-mono">Trader Account Index</h3>
                            
                            <div className="space-y-4 font-sans">
                              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-900/40">
                                <div>
                                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Trader Name</span>
                                  <span className="text-sm font-semibold text-slate-200">{user?.name}</span>
                                </div>
                                <div>
                                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Email Node</span>
                                  <span className="text-sm font-semibold text-slate-200">{user?.email}</span>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-900/40">
                                <div>
                                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Authorized Role</span>
                                  <span className="text-sm font-semibold font-mono text-amber-400">{user?.isAdmin ? "MASTER ADMIN KEY" : "STANDARD TRADER"}</span>
                                </div>
                                <div>
                                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">System Registered Date</span>
                                  <span className="text-sm font-semibold font-mono text-slate-200">{user ? new Date(user.registrationDate).toLocaleDateString() : ""}</span>
                                </div>
                              </div>

                              <div>
                                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Membership Status</span>
                                <div className="flex items-center gap-3 mt-1.5">
                                  <div className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold tracking-widest uppercase border ${
                                    (user?.status === "approved" || user?.status === "Active")
                                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 glow-green" 
                                      : (user?.status === "pending")
                                      ? "bg-amber-500/10 border-amber-500/30 text-amber-400 animate-pulse"
                                      : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                                  }`}>
                                    {user?.status === "approved" || user?.status === "Active" ? "Active" : "Inactive"} License State
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Action Link to contact if pending or inactive */}
                            {(!user?.has_access && !user?.isAdmin) && (
                              <div className="mt-8 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-4">
                                <h4 className="text-xs font-mono uppercase text-amber-400 font-semibold tracking-wider">Awaiting Verification?</h4>
                                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                                  Your current account setup/license status is <span className="font-bold underline">{user?.status || "Inactive"}</span>. 
                                  Traders can bypass long verification times by contacting the owner directly to map static license hashes over our database.
                                </p>
                                <a 
                                  href="https://t.me/coderxx" 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="inline-flex items-center gap-1 text-xs font-mono font-bold btn-gold-gradient px-4 py-2 rounded-xl transition text-slate-950 font-black cursor-pointer align-middle"
                                >
                                  Telegram manual confirmation: @coderxx
                                </a>
                              </div>
                            )}

                          </div>
                        </motion.div>
                      )}

                      {/* T4. ADMIN CONTROL HEADQUARTERS (ADMIN) */}
                      {user?.isAdmin && currentTab === "admin" && (
                        <motion.div 
                          key="tab_admin"
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -15 }}
                          className="space-y-6"
                        >
                          {/* Admin analytics cards */}
                          {adminAnalytics && (
                            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                              <div className="glass-panel p-4 rounded-xl border border-slate-900">
                                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">All Users</p>
                                <p className="text-2xl font-bold font-mono text-white mt-1">{adminAnalytics.totalUsers}</p>
                              </div>
                              <div className="glass-panel p-4 rounded-xl border border-slate-900">
                                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Approved Owners</p>
                                <p className="text-2xl font-bold font-mono text-emerald-400 mt-1">{adminAnalytics.approvedUsers}</p>
                              </div>
                              <div className="glass-panel p-4 rounded-xl border border-slate-900 text-amber-400">
                                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Pending License</p>
                                <p className="text-2xl font-bold font-mono text-amber-400 mt-1 animate-pulse">{adminAnalytics.pendingUsers}</p>
                              </div>
                              <div className="glass-panel p-4 rounded-xl border border-slate-900">
                                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Signals Run</p>
                                <p className="text-2xl font-bold font-mono text-[#fbbf24] mt-1">{adminAnalytics.totalSignalRequests}</p>
                              </div>
                              <div className="glass-panel p-4 rounded-xl border border-slate-900">
                                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Scans 24H</p>
                                <p className="text-2xl font-bold font-mono text-white mt-1">{adminAnalytics.dailySignalRequests}</p>
                              </div>
                              <div className="glass-panel p-4 rounded-xl border border-slate-900">
                                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Scans Monthly</p>
                                <p className="text-2xl font-bold font-mono text-white mt-1">{adminAnalytics.monthlySignalRequests}</p>
                              </div>
                            </div>
                          )}

                          {/* Graphical visual representation chart (pure SVG, beautiful representation) */}
                          <div className="glass-panel p-6 rounded-3xl border border-slate-900">
                            <h4 className="text-sm font-semibold text-white font-display mb-4 flex items-center gap-2">
                              <PieChart className="w-4 h-4 text-emerald-400" /> System Volumes History
                            </h4>
                            
                            {/* Pure SVG Graph */}
                            <div className="h-44 w-full relative">
                              <svg className="w-full h-full" viewBox="0 0 800 150">
                                <defs>
                                  <linearGradient id="gradient_orange" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                                  </linearGradient>
                                </defs>
                                {/* Grid lines */}
                                <line x1="0" y1="30" x2="800" y2="30" stroke="#111827" strokeDasharray="5,5" />
                                <line x1="0" y1="75" x2="800" y2="75" stroke="#111827" strokeDasharray="5,5" />
                                <line x1="0" y1="120" x2="800" y2="120" stroke="#111827" strokeDasharray="5,5" />

                                {/* Wave path */}
                                <path 
                                  d="M 0 130 Q 100 120 180 80 T 360 110 T 540 50 T 720 70 L 800 110 L 800 150 L 0 150 Z" 
                                  fill="url(#gradient_orange)" 
                                />
                                <path 
                                  d="M 0 130 Q 100 120 180 80 T 360 110 T 540 50 T 720 70 L 800 110" 
                                  fill="none" 
                                  stroke="#f59e0b" 
                                  strokeWidth="3.5" 
                                />

                                {/* Points */}
                                <circle cx="180" cy="80" r="5" fill="#f59e0b" stroke="#000" strokeWidth="1.5" />
                                <circle cx="360" cy="110" r="5" fill="#f59e0b" stroke="#000" strokeWidth="1.5" />
                                <circle cx="540" cy="50" r="5" fill="#fbbf24" stroke="#000" strokeWidth="1.5" />
                                <circle cx="720" cy="70" r="5" fill="#fbbf24" stroke="#000" strokeWidth="1.5" />
                              </svg>
                              <div className="absolute bottom-1 right-2 font-mono text-[9px] text-slate-500">DYNAMIC LOAD RATIO INDEX</div>
                            </div>
                            <div className="flex justify-between font-mono text-[10px] text-slate-400 mt-2">
                              <span>30 DAYS AGO</span>
                              <span>15 DAYS AGO</span>
                              <span>7 DAYS AGO</span>
                              <span className="text-amber-400 font-bold">TODAY (LIVE CORE)</span>
                            </div>
                          </div>

                          {/* Users Administration Grid */}
                          <div className="glass-panel p-6 rounded-3xl border border-slate-900">
                            <h4 className="text-sm font-semibold text-white font-display mb-4 flex items-center gap-2">
                              <Users className="w-4 h-4 text-amber-500" /> User Database & Access Control
                            </h4>

                            <div className="overflow-x-auto">
                              <table className="w-full text-left font-sans text-xs">
                                <thead>
                                  <tr className="border-b border-slate-900 text-slate-500 uppercase font-mono tracking-wider">
                                    <th className="pb-3">Traders</th>
                                    <th className="pb-3">System Access Role</th>
                                    <th className="pb-3">Register Index</th>
                                    <th className="pb-3">Active Access / Admin Action</th>
                                    <th className="pb-3 text-right">Verification Command Handshakes</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-900/60 font-sans">
                                  {adminUsers.map(u => (
                                    <tr key={u.id} className="hover:bg-slate-900/10">
                                      <td className="py-3">
                                        <p className="font-semibold text-slate-200">{u.name}</p>
                                        <p className="text-[10px] font-mono text-slate-500">{u.email}</p>
                                      </td>
                                      <td className="py-3 font-mono">
                                        {u.isAdmin ? (
                                          <span className="text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/25">MASTER ADMIN</span>
                                        ) : (
                                          <span className="text-slate-400 font-bold bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">STANDARD TRADER</span>
                                        )}
                                      </td>
                                      <td className="py-3 font-mono text-slate-500">
                                        {new Date(u.registrationDate).toLocaleDateString()}
                                      </td>
                                      <td className="py-3">
                                        <div className="flex items-center gap-3">
                                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
                                            u.has_access || u.isAdmin
                                              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                                              : "bg-rose-500/10 border-rose-500/30 text-rose-400 font-bold"
                                          }`}>
                                            {u.has_access || u.isAdmin ? "Active" : "Inactive"}
                                          </span>

                                          {!u.isAdmin && (
                                            <button
                                              onClick={() => handleAdminChangeAccess(u.id, !u.has_access)}
                                              className={`px-3 py-1 rounded font-mono text-[10px] font-bold tracking-wider uppercase transition cursor-pointer ${
                                                u.has_access 
                                                  ? "bg-rose-950/40 hover:bg-rose-900/40 text-rose-400 border border-rose-900" 
                                                  : "bg-emerald-950/40 hover:bg-emerald-900/40 text-emerald-400 border border-emerald-900"
                                              }`}
                                            >
                                              {u.has_access ? "Remove Access" : "Grant Access"}
                                            </button>
                                          )}
                                        </div>
                                      </td>
                                      <td className="py-3 text-right">
                                        <button 
                                          onClick={() => handleAdminDeleteUser(u.id)}
                                          disabled={u.email.toLowerCase() === "fardinahmed9592@gmail.com"}
                                          className="text-rose-500 hover:text-rose-400 disabled:text-slate-700 disabled:cursor-not-allowed transition p-1 cursor-pointer"
                                          title="Purge user data"
                                        >
                                          <Trash2 className="w-4 h-4 inline" />
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>

                          {/* Recent Activity Log */}
                          <div className="glass-panel p-6 rounded-3xl border border-slate-900">
                            <h4 className="text-sm font-semibold text-white font-display mb-4 flex items-center gap-2 animate-pulse">
                              <BookOpen className="w-4 h-4 text-emerald-400 animate-ping inline-block" /> Live Analysis Workspace Streams
                            </h4>
                            <div className="space-y-3 font-mono text-slate-400 text-xs py-2 h-48 overflow-y-auto no-scrollbar">
                              {adminActivityLog.map(log => (
                                <div key={log.id} className="border-b border-slate-900 pb-2 flex items-start justify-between font-mono gap-4">
                                  <div>
                                    <span className="text-amber-400">[{log.time}]</span>{" "}
                                    <span className="text-white font-bold">{log.user_name}</span>{" "}
                                    scanned trading chart:{" "}
                                    <span className={log.signal === "BUY / UP" ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                                      {log.signal}
                                    </span>
                                  </div>
                                  <div className="text-right text-slate-500">
                                    Conf: <span className="text-white">{log.confidence}%</span> | Speed: <span className="text-white">{log.analysisTime}</span>
                                  </div>
                                </div>
                              ))}
                              {adminActivityLog.length === 0 && <p className="text-slate-500 text-center">No active signals scanned yet.</p>}
                            </div>
                          </div>

                        </motion.div>
                      )}

                    </AnimatePresence>
                  </div>
                )}

              </div>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER METRICS AND META */}
      <footer className="border-t border-[#fbbf24]/10 bg-slate-950/40 py-5 text-center text-[10px] font-mono text-slate-500 sticky bottom-0 w-full backdrop-blur z-25 mt-16 flex items-center justify-between px-6">
        <div>
          <span>FIRE SIGNAL SYSTEM ACTIVE</span>
        </div>
        <div>
          <span>MASTER AUDIT KEY SECURED</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#fbbf24] glow-gold" />
          <span>LICENSE AUTHENTICATED</span>
        </div>
      </footer>

      {/* M1. INSPECT MATCH MODAL */}
      <AnimatePresence>
        {inspectedSignal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#030712]/90 backdrop-blur-md flex items-center justify-center p-6"
            onClick={() => setInspectedSignal(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="glass-panel max-w-3xl w-full rounded-3xl p-6 border border-slate-800 space-y-6 max-h-[90vh] overflow-y-auto no-scrollbar"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-xl font-bold font-display text-white">Verification Diagnostic Match</h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">ID: {inspectedSignal.id} - Date: {inspectedSignal.date} at {inspectedSignal.time}</p>
                </div>
                <button 
                  onClick={() => setInspectedSignal(null)}
                  className="p-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6 items-start">
                <div className="space-y-3">
                  <div className="rounded-2xl overflow-hidden border border-slate-900 bg-slate-950">
                    <img src={inspectedSignal.screenshot} alt="Inspect screenshot" className="w-full h-auto object-contain max-h-[300px]" />
                  </div>
                  <a href={inspectedSignal.screenshot} target="_blank" rel="noreferrer" className="block text-center text-xs text-slate-500 hover:text-amber-400 underline">Open full raw image</a>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">AI TARGET SIGNAL</span>
                    <div className="mt-2">
                      {inspectedSignal.signal === "BUY / UP" ? (
                        <span className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500/10 border-2 border-emerald-500 text-emerald-400 font-display font-black text-xl tracking-widest glow-green">
                          🟢 BUY / UP
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-rose-500/10 border-2 border-rose-500 text-rose-400 font-display font-black text-xl tracking-widest glow-red">
                          🔴 SELL / DOWN
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-500 uppercase">Confidence rating</span>
                      <span className="text-amber-400 font-bold">{inspectedSignal.confidence}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                      <div className={`h-full ${
                        inspectedSignal.signal === "BUY / UP" ? "bg-emerald-500" : "bg-rose-500"
                      }`} style={{ width: `${inspectedSignal.confidence}%` }} />
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Scan speed</span>
                    <span className="text-sm font-semibold text-white font-mono mt-1 block">{inspectedSignal.analysisTime || "5.4s"}</span>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 space-y-1.5">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Neural findings</span>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">{inspectedSignal.reasoning}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

interface LiveTradingViewChartProps {
  height?: string;
}

const LiveTradingViewChart: React.FC<LiveTradingViewChartProps> = ({ height = "520px" }) => {
  const [symbol, setSymbol] = React.useState<string>("BINANCE:BTCUSDT");
  
  const presets = [
    { label: "BTC/USDT", value: "BINANCE:BTCUSDT" },
    { label: "ETH/USDT", value: "BINANCE:ETHUSDT" },
    { label: "SOL/USDT", value: "BINANCE:SOLUSDT" },
    { label: "EUR/USD", value: "FX_IDC:EURUSD" },
    { label: "GBP/USD", value: "FX_IDC:GBPUSD" },
    { label: "S&P 500", value: "SPDR:SPY" },
    { label: "NASDAQ", value: "AMEX:QQQ" },
  ];

  return (
    <div className="glass-panel p-4 md:p-6 rounded-3xl border border-slate-900 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-900/60">
        <div>
          <h3 className="text-lg font-display font-medium text-white flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            Live Real-Time Market Feed
          </h3>
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-0.5">Interactive TradingView Charting Engine</p>
        </div>
        <div className="flex flex-wrap gap-1">
          {presets.map((p) => (
            <button
              key={p.value}
              onClick={() => setSymbol(p.value)}
              className={`px-3 py-1.5 text-xs font-mono font-medium rounded-lg transition cursor-pointer ${
                symbol === p.value
                  ? "bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-slate-950 font-bold shadow-lg shadow-amber-500/15"
                  : "bg-slate-950 hover:bg-slate-900 border border-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-900" style={{ height }}>
        <iframe
          key={symbol}
          title={`TradingView Chart - ${symbol}`}
          src={`https://s.tradingview.com/widgetembed/?frameElementId=tradingview_chart&symbol=${symbol}&interval=D&theme=dark&style=1&timezone=Etc/UTC&studies=[]&locale=en`}
          className="w-full h-full border-0"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};
