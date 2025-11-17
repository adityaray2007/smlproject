// "use client"
// import React, { useState, useEffect } from "react";
// import {
//   LineChart,
//   Line,
//   CartesianGrid,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   Legend,
//   PieChart,
//   Pie,
//   Cell,
//   AreaChart,
//   Area,
// } from "recharts";
// import { Activity, Shield, Upload, BarChart3, Wrench, FileText, Menu, X, AlertCircle, CheckCircle, TrendingUp } from "lucide-react";

// export default function IDSDashboard() {
//   const BASE = "http://localhost:8000";

//   // const [jsonInput, setJsonInput] = useState(`{\n  "duration":2,\n  "protocol_type":"icmp",\n  "service":"ecr_i",\n  "flag":"SF"\n}`);
//   const [singleResult, setSingleResult] = useState(null);
//   const [csvFile, setCsvFile] = useState(null);
//   const [batchResult, setBatchResult] = useState(null);
//   const [metrics, setMetrics] = useState([]);
//   const [shapFiles, setShapFiles] = useState([]);
//   const [dashboard, setDashboard] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [active, setActive] = useState('dashboard');
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [recentPredictions, setRecentPredictions] = useState([]);
//   // FIND your existing line that looks like:
// // const [jsonInput, setJsonInput] = useState(...);
// // 
// // REPLACE it with all of these:

// const [jsonInput, setJsonInput] = useState(`{\n  "duration":2,\n  "protocol_type":"icmp",\n  "service":"ecr_i",\n  "flag":"SF"\n}`);
// const [inputMode, setInputMode] = useState('form'); // 'form' or 'json'
// const [formData, setFormData] = useState({
//   duration: '2',
//   protocol_type: 'icmp',
//   service: 'ecr_i',
//   flag: 'SF',
//   src_bytes: '',
//   dst_bytes: '',
//   land: '0',
//   wrong_fragment: '0',
//   urgent: '0'
// });

// // Add these constants somewhere before your functions:
// const protocolTypes = ['tcp', 'udp', 'icmp'];
// const services = ['http', 'smtp', 'ftp', 'ssh', 'telnet', 'ecr_i', 'private', 'domain_u', 'other'];
// const flags = ['SF', 'S0', 'REJ', 'RSTR', 'RSTO', 'SH', 'S1', 'S2', 'RSTOS0', 'S3', 'OTH'];

// // Update your handleSinglePredict function to handle both modes:
// async function handleSinglePredict(e) {
//   e?.preventDefault();
//   setError(null);
//   setLoading(true);
//   setSingleResult(null);
//   try {
//     let payload;
//     if (inputMode === 'json') {
//       payload = { named: JSON.parse(jsonInput) };
//     } else {
//       // Convert form data to proper types
//       const processedData = {};
//       Object.keys(formData).forEach(key => {
//         const value = formData[key];
//         if (value === '') return; // Skip empty fields
        
//         // Convert to number if it's a numeric field
//         if (['duration', 'src_bytes', 'dst_bytes', 'land', 'wrong_fragment', 'urgent'].includes(key)) {
//           processedData[key] = Number(value);
//         } else {
//           processedData[key] = value;
//         }
//       });
//       payload = { named: processedData };
//     }
    
//     const res = await fetch(`${BASE}/predict_single`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });
//     const data = await res.json();
//     if (!res.ok) throw new Error(data.detail || JSON.stringify(data));
//     setSingleResult(data);
    
//     // Add to recent predictions
//     const newPrediction = {
//       id: Date.now(),
//       timestamp: new Date().toLocaleString(),
//       label: data.final_label === 1 ? 'ATTACK' : 'NORMAL',
//       attackType: data.attack_type,
//       confidence: data.confidence
//     };
//     setRecentPredictions(prev => [newPrediction, ...prev].slice(0, 3));
//   } catch (err) {
//     console.error(err);
//     setError(String(err));
//   } finally {
//     setLoading(false);
//   }
// }

//   useEffect(() => {
//     fetchMetrics();
//     fetchShap();
//     fetchStats();
//   }, []);

//   async function fetchMetrics() {
//     try {
//       const res = await fetch(`${BASE}/model_metrics`);
//       if (!res.ok) throw new Error("Metrics fetch failed");
//       const data = await res.json();
//       setMetrics(data);
//     } catch (e) {
//       console.error(e);
//       setMetrics([]);
//     }
//   }

//   async function fetchShap() {
//     try {
//       const res = await fetch(`${BASE}/shap_files`);
//       if (!res.ok) throw new Error("Shap fetch failed");
//       const data = await res.json();
//       setShapFiles(data.shap || []);
//     } catch (e) {
//       console.error(e);
//       setShapFiles([]);
//     }
//   }

//   async function fetchStats() {
//     try {
//       const res = await fetch(`${BASE}/dashboard_stats`);
//       if (!res.ok) throw new Error("Stats fetch failed");
//       const data = await res.json();
//       setDashboard(data);
//     } catch (e) {
//       console.error(e);
//       setDashboard(null);
//     }
//   }

//   async function handleSinglePredict(e) {
//     e?.preventDefault();
//     setError(null);
//     setLoading(true);
//     setSingleResult(null);
//     try {
//       const payload = { named: JSON.parse(jsonInput) };
//       const res = await fetch(`${BASE}/predict_single`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.detail || JSON.stringify(data));
//       setSingleResult(data);
      
//       // Add to recent predictions
//       const newPrediction = {
//         id: Date.now(),
//         timestamp: new Date().toLocaleString(),
//         label: data.final_label === 1 ? 'ATTACK' : 'NORMAL',
//         attackType: data.attack_type,
//         confidence: data.confidence
//       };
//       setRecentPredictions(prev => [newPrediction, ...prev].slice(0, 3));
//     } catch (err) {
//       console.error(err);
//       setError(String(err));
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function handleCSVUpload(e) {
//     e?.preventDefault();
//     if (!csvFile) return setError("Choose a CSV file first");
//     setError(null);
//     setLoading(true);
//     setBatchResult(null);
//     try {
//       const fd = new FormData();
//       fd.append("file", csvFile);
//       const res = await fetch(`${BASE}/predict_csv`, {
//         method: "POST",
//         body: fd,
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.detail || JSON.stringify(data));
//       setBatchResult(data);
//     } catch (err) {
//       console.error(err);
//       setError(String(err));
//     } finally {
//       setLoading(false);
//     }
//   }

//   const metricsChartData = metrics.map((m, i) => ({
//     name: m.model || m.Model || `m${i}`,
//     accuracy: Number(m.Accuracy ?? m.accuracy ?? m.Accuracy_score ?? 0),
//     f1: Number(m.F1 ?? m.f1 ?? 0),
//     roc: Number(m.ROC_AUC ?? m.roc_auc ?? 0),
//   }));

//   const supervisedList = singleResult ? Object.entries(singleResult.supervised) : [];

//   // Dynamic detection trend based on recent predictions

//   // Dashboard stats: compute from recentPredictions
//   const totalScans = recentPredictions.length;
//   const normalCount = recentPredictions.filter(p => p.label === 'NORMAL').length;
//   const attackCount = recentPredictions.filter(p => p.label === 'ATTACK').length;

//   // Insert dynamic detectionTrend immediately above the charts row
//   const detectionTrend = recentPredictions
//     .slice()
//     .reverse()
//     .map((p, idx) => ({
//       time: `#${idx + 1}`,
//       normal: p.label === 'NORMAL' ? 1 : 0,
//       attack: p.label === 'ATTACK' ? 1 : 0,
//     }));

//   const attackTypes = [
//     { name: 'DoS', value: 35, color: '#ef4444' },
//     { name: 'Probe', value: 25, color: '#f97316' },
//     { name: 'R2L', value: 20, color: '#eab308' },
//     { name: 'U2R', value: 20, color: '#22c55e' },
//   ];

//   const menuItems = [
//     { id: 'dashboard', label: 'Dashboard', icon: Activity },
//     { id: 'single', label: 'Single Prediction', icon: Shield },
//     { id: 'csv', label: 'CSV Prediction', icon: Upload },
//     { id: 'metrics', label: 'Model Metrics', icon: BarChart3 },
//     { id: 'shap', label: 'SHAP Analysis', icon: Wrench },
//     { id: 'docs', label: 'Documentation', icon: FileText },
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
//       {/* Header */}
//       <header className="bg-white border-b border-slate-200 sticky top-0 z-30 backdrop-blur-sm bg-white/90">
//         <div className="px-6 py-4 flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <button 
//               onClick={() => setSidebarOpen(!sidebarOpen)}
//               className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
//             >
//               {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
//             </button>
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
//                 M
//               </div>
//               <div>
//                 <h1 className="text-xl font-bold text-slate-800">M-SoftTech IDS</h1>
//                 <p className="text-xs text-slate-500">Intrusion Detection System</p>
//               </div>
//             </div>
//           </div>
//           <div className="flex items-center gap-4">
//             <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg text-sm">
//               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//               <span className="text-slate-600">Connected to {BASE}</span>
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="flex">
//         {/* Sidebar */}
//         <aside className={`${sidebarOpen ? 'w-72' : 'w-0'} transition-all duration-300 bg-slate-900 min-h-[calc(100vh-73px)] overflow-hidden`}>
//           <nav className="p-4 space-y-2">
//             {menuItems.map((item) => {
//               const Icon = item.icon;
//               return (
//                 <button
//                   key={item.id}
//                   onClick={() => setActive(item.id)}
//                   className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
//                     active === item.id 
//                       ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
//                       : 'text-slate-300 hover:bg-slate-800 hover:text-white'
//                   }`}
//                 >
//                   <Icon size={20} />
//                   <span className="font-medium">{item.label}</span>
//                 </button>
//               );
//             })}
//           </nav>
          
//           <div className="p-4 mt-8">
//             <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
//               <h3 className="text-white font-semibold mb-2 text-sm">System Status</h3>
//               <div className="space-y-2 text-xs">
//                 <div className="flex justify-between text-slate-400">
//                   <span>Uptime</span>
//                   <span className="text-green-400">99.9%</span>
//                 </div>
//                 <div className="flex justify-between text-slate-400">
//                   <span>Models</span>
//                   <span className="text-blue-400">{metrics.length || 0}</span>
//                 </div>
//                 <div className="flex justify-between text-slate-400">
//                   <span>Predictions</span>
//                   <span className="text-purple-400">{recentPredictions.length}</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </aside>

//         {/* Main content */}
//         <main className="flex-1 p-8 overflow-auto">
          
//           {/* Dashboard */}
//           {active === 'dashboard' && (
//             <div className="space-y-6">
//               <div>
//                 <h2 className="text-3xl font-bold text-slate-800 mb-2">Dashboard Overview</h2>
//                 <p className="text-slate-600">Real-time monitoring and analytics</p>
//               </div>

//               {/* Stats Cards */}
//               <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//                 <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
//                   <div className="flex items-center justify-between mb-4">
//                     <div className="p-3 bg-blue-100 rounded-xl">
//                       <Activity className="text-blue-600" size={24} />
//                     </div>
//                     <TrendingUp className="text-green-500" size={20} />
//                   </div>
//                   <h3 className="text-slate-600 text-sm font-medium mb-1">Total Scans</h3>
//                   <p className="text-3xl font-bold text-slate-800">{totalScans}</p>
//                 </div>

//                 <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
//                   <div className="flex items-center justify-between mb-4">
//                     <div className="p-3 bg-green-100 rounded-xl">
//                       <CheckCircle className="text-green-600" size={24} />
//                     </div>
//                   </div>
//                   <h3 className="text-slate-600 text-sm font-medium mb-1">Normal Traffic</h3>
//                   <p className="text-3xl font-bold text-slate-800">{normalCount}</p>
//                 </div>

//                 <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
//                   <div className="flex items-center justify-between mb-4">
//                     <div className="p-3 bg-red-100 rounded-xl">
//                       <AlertCircle className="text-red-600" size={24} />
//                     </div>
//                   </div>
//                   <h3 className="text-slate-600 text-sm font-medium mb-1">Attacks Detected</h3>
//                   <p className="text-3xl font-bold text-slate-800">{attackCount}</p>
//                 </div>

//                 <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
//                   <div className="flex items-center justify-between mb-4">
//                     <div className="p-3 bg-purple-100 rounded-xl">
//                       <Shield className="text-purple-600" size={24} />
//                     </div>
//                   </div>
//                   <h3 className="text-slate-600 text-sm font-medium mb-1">Accuracy Rate</h3>
//                   <p className="text-3xl font-bold text-slate-800">98.7%</p>
//                 </div>
//               </div>

//               {/* Charts Row */}
//               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                 {/* Detection Trend */}
//                 <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
//                   <h3 className="text-lg font-semibold text-slate-800 mb-4">Detection Trend (24h)</h3>
//                   <ResponsiveContainer width="100%" height={280}>
//                     <AreaChart data={detectionTrend}>
//                       <defs>
//                         <linearGradient id="colorNormal" x1="0" y1="0" x2="0" y2="1">
//                           <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
//                           <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
//                         </linearGradient>
//                         <linearGradient id="colorAttack" x1="0" y1="0" x2="0" y2="1">
//                           <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
//                           <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
//                         </linearGradient>
//                       </defs>
//                       <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
//                       <XAxis dataKey="time" stroke="#64748b" />
//                       <YAxis stroke="#64748b" />
//                       <Tooltip />
//                       <Area type="monotone" dataKey="normal" stroke="#3b82f6" fillOpacity={1} fill="url(#colorNormal)" />
//                       <Area type="monotone" dataKey="attack" stroke="#ef4444" fillOpacity={1} fill="url(#colorAttack)" />
//                     </AreaChart>
//                   </ResponsiveContainer>
//                 </div>

//                 {/* Attack Types Pie */}
//                 <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
//                   <h3 className="text-lg font-semibold text-slate-800 mb-4">Attack Types</h3>
//                   <ResponsiveContainer width="100%" height={280}>
//                     <PieChart>
//                       <Pie
//                         data={attackTypes}
//                         cx="50%"
//                         cy="50%"
//                         innerRadius={60}
//                         outerRadius={90}
//                         paddingAngle={5}
//                         dataKey="value"
//                       >
//                         {attackTypes.map((entry, index) => (
//                           <Cell key={`cell-${index}`} fill={entry.color} />
//                         ))}
//                       </Pie>
//                       <Tooltip />
//                     </PieChart>
//                   </ResponsiveContainer>
//                   <div className="grid grid-cols-2 gap-2 mt-4">
//                     {attackTypes.map((type) => (
//                       <div key={type.name} className="flex items-center gap-2">
//                         <div className="w-3 h-3 rounded" style={{ backgroundColor: type.color }}></div>
//                         <span className="text-xs text-slate-600">{type.name} ({type.value}%)</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               {/* Recent Predictions */}
//               <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
//                 <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Predictions</h3>
//                 {recentPredictions.length === 0 ? (
//                   <div className="text-center py-12 text-slate-400">
//                     <Shield size={48} className="mx-auto mb-4 opacity-50" />
//                     <p>No predictions yet. Try making a prediction!</p>
//                   </div>
//                 ) : (
//                   <div className="space-y-3">
//                     {recentPredictions.map((pred) => (
//                       <div key={pred.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
//                         <div className="flex items-center gap-4">
//                           <div className={`p-3 rounded-xl ${pred.label === 'ATTACK' ? 'bg-red-100' : 'bg-green-100'}`}>
//                             {pred.label === 'ATTACK' ? 
//                               <AlertCircle className="text-red-600" size={20} /> : 
//                               <CheckCircle className="text-green-600" size={20} />
//                             }
//                           </div>
//                           <div>
//                             <p className="font-semibold text-slate-800">{pred.label}</p>
//                             <p className="text-sm text-slate-500">{pred.timestamp}</p>
//                           </div>
//                         </div>
//                         <div className="text-right">
//                           <p className="text-sm font-medium text-slate-600">{pred.attackType}</p>
//                           <p className="text-xs text-slate-500">Confidence: {(pred.confidence * 100).toFixed(1)}%</p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Single Prediction */}
//           {active === 'single' && (
//   <div className="space-y-6">
//     <div>
//       <h2 className="text-3xl font-bold text-slate-800 mb-2">Single Prediction</h2>
//       <p className="text-slate-600">Analyze individual network traffic patterns</p>
//     </div>

//     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//       {/* Input Section */}
//       <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="text-lg font-semibold text-slate-800">Input Data</h3>
          
//           {/* Toggle between Form and JSON */}
//           <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
//             <button
//               type="button"
//               onClick={() => setInputMode('form')}
//               className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
//                 inputMode === 'form' 
//                   ? 'bg-white text-slate-800 shadow-sm' 
//                   : 'text-slate-600 hover:text-slate-800'
//               }`}
//             >
//               Form
//             </button>
//             <button
//               type="button"
//               onClick={() => setInputMode('json')}
//               className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
//                 inputMode === 'json' 
//                   ? 'bg-white text-slate-800 shadow-sm' 
//                   : 'text-slate-600 hover:text-slate-800'
//               }`}
//             >
//               JSON
//             </button>
//           </div>
//         </div>

//         <form onSubmit={handleSinglePredict} className="space-y-4">
//           {inputMode === 'form' ? (
//             // Form Input Mode
//             <div className="space-y-4">
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">Duration</label>
//                   <input
//                     type="number"
//                     value={formData.duration}
//                     onChange={(e) => setFormData({...formData, duration: e.target.value})}
//                     className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                     placeholder="e.g., 2"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">Protocol Type</label>
//                   <select
//                     value={formData.protocol_type}
//                     onChange={(e) => setFormData({...formData, protocol_type: e.target.value})}
//                     className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                   >
//                     {protocolTypes.map(proto => (
//                       <option key={proto} value={proto}>{proto}</option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">Service</label>
//                   <select
//                     value={formData.service}
//                     onChange={(e) => setFormData({...formData, service: e.target.value})}
//                     className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                   >
//                     {services.map(srv => (
//                       <option key={srv} value={srv}>{srv}</option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">Flag</label>
//                   <select
//                     value={formData.flag}
//                     onChange={(e) => setFormData({...formData, flag: e.target.value})}
//                     className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                   >
//                     {flags.map(flg => (
//                       <option key={flg} value={flg}>{flg}</option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">Source Bytes</label>
//                   <input
//                     type="number"
//                     value={formData.src_bytes}
//                     onChange={(e) => setFormData({...formData, src_bytes: e.target.value})}
//                     className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                     placeholder="Optional"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">Destination Bytes</label>
//                   <input
//                     type="number"
//                     value={formData.dst_bytes}
//                     onChange={(e) => setFormData({...formData, dst_bytes: e.target.value})}
//                     className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                     placeholder="Optional"
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-3 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">Land</label>
//                   <select
//                     value={formData.land}
//                     onChange={(e) => setFormData({...formData, land: e.target.value})}
//                     className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                   >
//                     <option value="0">0</option>
//                     <option value="1">1</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">Wrong Fragment</label>
//                   <input
//                     type="number"
//                     value={formData.wrong_fragment}
//                     onChange={(e) => setFormData({...formData, wrong_fragment: e.target.value})}
//                     className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                     placeholder="0"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">Urgent</label>
//                   <input
//                     type="number"
//                     value={formData.urgent}
//                     onChange={(e) => setFormData({...formData, urgent: e.target.value})}
//                     className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                     placeholder="0"
//                   />
//                 </div>
//               </div>
//             </div>
//           ) : (
//             // JSON Input Mode
//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-2">JSON Input</label>
//               <textarea
//                 value={jsonInput}
//                 onChange={(e) => setJsonInput(e.target.value)}
//                 rows={12}
//                 className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                 placeholder="Enter JSON data..."
//               />
//             </div>
//           )}

//           <div className="flex gap-3">
//             <button
//               type="submit"
//               disabled={loading}
//               className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {loading ? 'Analyzing...' : 'Predict'}
//             </button>
//             {inputMode === 'json' && (
//               <button
//                 type="button"
//                 onClick={() => setJsonInput(JSON.stringify({ duration:2, protocol_type:'icmp', service:'ecr_i', flag:'SF' }, null, 2))}
//                 className="px-6 py-3 border-2 border-slate-200 rounded-xl font-medium hover:bg-slate-50 transition-all"
//               >
//                 Example
//               </button>
//             )}
//             {inputMode === 'form' && (
//               <button
//                 type="button"
//                 onClick={() => setFormData({
//                   duration: '2',
//                   protocol_type: 'icmp',
//                   service: 'ecr_i',
//                   flag: 'SF',
//                   src_bytes: '',
//                   dst_bytes: '',
//                   land: '0',
//                   wrong_fragment: '0',
//                   urgent: '0'
//                 })}
//                 className="px-6 py-3 border-2 border-slate-200 rounded-xl font-medium hover:bg-slate-50 transition-all"
//               >
//                 Reset
//               </button>
//             )}
//           </div>
//         </form>
//       </div>

//       {/* Result Section */}
//       <div className="space-y-4">
//         {error && (
//           <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700">
//             <div className="flex items-center gap-2">
//               <AlertCircle size={20} />
//               <span className="font-medium">Error</span>
//             </div>
//             <p className="text-sm mt-2">{error}</p>
//           </div>
//         )}

//         {singleResult && (
//           <>
//             <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
//               <h3 className="text-lg font-semibold text-slate-800 mb-4">Final Prediction</h3>
//               <div className="space-y-4">
//                 <div className={`p-4 rounded-xl ${singleResult.final_label === 1 ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
//                   <div className="flex items-center gap-3 mb-2">
//                     {singleResult.final_label === 1 ? 
//                       <AlertCircle className="text-red-600" size={24} /> : 
//                       <CheckCircle className="text-green-600" size={24} />
//                     }
//                     <span className={`text-2xl font-bold ${singleResult.final_label === 1 ? 'text-red-700' : 'text-green-700'}`}>
//                       {singleResult.final_label === 1 ? 'ATTACK' : 'NORMAL'}
//                     </span>
//                   </div>
//                 </div>
                
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="p-4 bg-slate-50 rounded-xl">
//                     <p className="text-xs text-slate-500 mb-1">Attack Type</p>
//                     <p className="text-lg font-semibold text-slate-800">{singleResult.attack_type}</p>
//                   </div>
//                   <div className="p-4 bg-slate-50 rounded-xl">
//                     <p className="text-xs text-slate-500 mb-1">Confidence</p>
//                     <p className="text-lg font-semibold text-slate-800">{(singleResult.confidence * 100).toFixed(1)}%</p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
//               <h3 className="text-lg font-semibold text-slate-800 mb-4">Model Votes</h3>
//               <div className="space-y-2 max-h-64 overflow-auto">
//                 {supervisedList.map(([m, v]) => (
//                   <div key={m} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
//                     <span className="font-medium text-slate-700 text-sm">{m}</span>
//                     <div className="flex items-center gap-3">
//                       <span className="text-sm text-slate-600">Pred: {v.pred}</span>
//                       <span className="text-sm font-medium text-slate-800">
//                         {v.prob ? `${(v.prob * 100).toFixed(1)}%` : '-'}
//                       </span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   </div>
// )}
//           {/* CSV Prediction */}
//           {active === 'csv' && (
//             <div className="space-y-6">
//               <div>
//                 <h2 className="text-3xl font-bold text-slate-800 mb-2">Batch CSV Prediction</h2>
//                 <p className="text-slate-600">Upload and analyze multiple network traffic samples</p>
//               </div>

//               <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 max-w-2xl">
//                 <h3 className="text-lg font-semibold text-slate-800 mb-4">Upload CSV File</h3>
//                 <form onSubmit={handleCSVUpload} className="space-y-4">
//                   <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors">
//                     <Upload className="mx-auto text-slate-400 mb-4" size={48} />
//                     <input
//                       type="file"
//                       accept=".csv"
//                       onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
//                       className="hidden"
//                       id="csv-upload"
//                     />
//                     <label htmlFor="csv-upload" className="cursor-pointer">
//                       <span className="text-blue-600 font-medium hover:underline">Choose a file</span>
//                       <span className="text-slate-500"> or drag and drop</span>
//                     </label>
//                     {csvFile && (
//                       <p className="mt-3 text-sm text-slate-600">Selected: {csvFile.name}</p>
//                     )}
//                   </div>
//                   <div className="flex gap-3">
//                     <button
//                       type="submit"
//                       disabled={loading || !csvFile}
//                       className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       {loading ? 'Processing...' : 'Upload & Predict'}
//                     </button>
//                     <button
//                       type="button"
//                       onClick={() => setCsvFile(null)}
//                       className="px-6 py-3 border-2 border-slate-200 rounded-xl font-medium hover:bg-slate-50 transition-all"
//                     >
//                       Clear
//                     </button>
//                   </div>
//                 </form>
//               </div>

//               {error && (
//                 <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700">
//                   <div className="flex items-center gap-2">
//                     <AlertCircle size={20} />
//                     <span className="font-medium">Error</span>
//                   </div>
//                   <p className="text-sm mt-2">{error}</p>
//                 </div>
//               )}

//               {batchResult && (
//                 <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
//                   <div className="flex items-center justify-between mb-4">
//                     <h3 className="text-lg font-semibold text-slate-800">Batch Results</h3>
//                     <span className="px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
//                       {batchResult.n} Records
//                     </span>
//                   </div>
//                   <div className="overflow-auto max-h-96 rounded-xl border border-slate-200">
//                     <table className="w-full">
//                       <thead className="bg-slate-50 sticky top-0">
//                         <tr>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Index</th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Label</th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Attack Type</th>
//                           <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Confidence</th>
//                         </tr>
//                       </thead>
//                       <tbody className="divide-y divide-slate-200">
//                         {batchResult.results.map((r) => (
//                           <tr key={r.index} className="hover:bg-slate-50">
//                             <td className="px-4 py-3 text-sm text-slate-600">{r.index}</td>
//                             <td className="px-4 py-3">
//                               <span className={`px-3 py-1 rounded-full text-xs font-medium ${
//                                 r.final_label === 1 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
//                               }`}>
//                                 {r.final_label === 1 ? 'ATTACK' : 'NORMAL'}
//                               </span>
//                             </td>
//                             <td className="px-4 py-3 text-sm text-slate-700">{r.attack_type}</td>
//                             <td className="px-4 py-3 text-sm font-medium text-slate-800">{(Number(r.confidence) * 100).toFixed(1)}%</td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Model Metrics */}
//           {active === 'metrics' && (
//             <div className="space-y-6">
//               <div>
//                 <h2 className="text-3xl font-bold text-slate-800 mb-2">Model Performance Metrics</h2>
//                 <p className="text-slate-600">Comprehensive analysis of model accuracy and performance</p>
//               </div>

//               {metricsChartData.length === 0 ? (
//                 <div className="bg-white rounded-2xl p-12 shadow-sm border border-slate-200 text-center">
//                   <BarChart3 className="mx-auto text-slate-300 mb-4" size={64} />
//                   <p className="text-slate-500">No metrics available. Ensure model_performance.csv exists on the backend.</p>
//                 </div>
//               ) : (
//                 <>
//                   <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
//                     <h3 className="text-lg font-semibold text-slate-800 mb-4">Model Comparison - Accuracy & F1 Score</h3>
//                     <ResponsiveContainer width="100%" height={350}>
//                       <BarChart data={metricsChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
//                         <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
//                         <XAxis dataKey="name" stroke="#64748b" />
//                         <YAxis stroke="#64748b" />
//                         <Tooltip 
//                           contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px' }}
//                         />
//                         <Legend />
//                         <Bar dataKey="accuracy" name="Accuracy" fill="#3b82f6" radius={[8, 8, 0, 0]} />
//                         <Bar dataKey="f1" name="F1 Score" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
//                       </BarChart>
//                     </ResponsiveContainer>
//                   </div>

//                   <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
//                     <h3 className="text-lg font-semibold text-slate-800 mb-4">ROC AUC Scores</h3>
//                     <ResponsiveContainer width="100%" height={300}>
//                       <LineChart data={metricsChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
//                         <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
//                         <XAxis dataKey="name" stroke="#64748b" />
//                         <YAxis stroke="#64748b" />
//                         <Tooltip 
//                           contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px' }}
//                         />
//                         <Line type="monotone" dataKey="roc" stroke="#10b981" strokeWidth={3} dot={{ r: 6 }} />
//                       </LineChart>
//                     </ResponsiveContainer>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                     {metricsChartData.map((model, idx) => (
//                       <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
//                         <h4 className="font-semibold text-slate-800 mb-4">{model.name}</h4>
//                         <div className="space-y-3">
//                           <div>
//                             <div className="flex justify-between text-sm mb-1">
//                               <span className="text-slate-600">Accuracy</span>
//                               <span className="font-medium text-slate-800">{(model.accuracy * 100).toFixed(1)}%</span>
//                             </div>
//                             <div className="w-full bg-slate-200 rounded-full h-2">
//                               <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${model.accuracy * 100}%` }}></div>
//                             </div>
//                           </div>
//                           <div>
//                             <div className="flex justify-between text-sm mb-1">
//                               <span className="text-slate-600">F1 Score</span>
//                               <span className="font-medium text-slate-800">{(model.f1 * 100).toFixed(1)}%</span>
//                             </div>
//                             <div className="w-full bg-slate-200 rounded-full h-2">
//                               <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${model.f1 * 100}%` }}></div>
//                             </div>
//                           </div>
//                           <div>
//                             <div className="flex justify-between text-sm mb-1">
//                               <span className="text-slate-600">ROC AUC</span>
//                               <span className="font-medium text-slate-800">{(model.roc * 100).toFixed(1)}%</span>
//                             </div>
//                             <div className="w-full bg-slate-200 rounded-full h-2">
//                               <div className="bg-green-600 h-2 rounded-full" style={{ width: `${model.roc * 100}%` }}></div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </>
//               )}
//             </div>
//           )}

//           {/* SHAP Analysis */}
//           {active === 'shap' && (
//             <div className="space-y-6">
//               <div>
//                 <h2 className="text-3xl font-bold text-slate-800 mb-2">SHAP Analysis</h2>
//                 <p className="text-slate-600">Feature importance and model explainability visualizations</p>
//               </div>

//               {shapFiles.length === 0 ? (
//                 <div className="bg-white rounded-2xl p-12 shadow-sm border border-slate-200 text-center">
//                   <Wrench className="mx-auto text-slate-300 mb-4" size={64} />
//                   <p className="text-slate-500">No SHAP visualizations available.</p>
//                   <p className="text-sm text-slate-400 mt-2">Generate SHAP plots on the backend to view them here.</p>
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {shapFiles.map((f) => (
//                     <a 
//                       key={f} 
//                       href={`${BASE}/shap/${f}`} 
//                       target="_blank" 
//                       rel="noreferrer" 
//                       className="group bg-white rounded-2xl p-4 shadow-sm border border-slate-200 hover:shadow-lg transition-all"
//                     >
//                       <div className="aspect-video bg-slate-100 rounded-xl overflow-hidden mb-3">
//                         <img 
//                           src={`${BASE}/shap/${f}`} 
//                           alt={f} 
//                           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
//                         />
//                       </div>
//                       <p className="text-sm font-medium text-slate-700 truncate">{f}</p>
//                       <p className="text-xs text-slate-500 mt-1">Click to view full size</p>
//                     </a>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Documentation */}
//           {active === 'docs' && (
//             <div className="space-y-6">
//               <div>
//                 <h2 className="text-3xl font-bold text-slate-800 mb-2">Documentation</h2>
//                 <p className="text-slate-600">API reference and system documentation</p>
//               </div>

//               <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
//                 <div className="prose max-w-none">
//                   <h3 className="text-xl font-semibold text-slate-800 mb-4">API Endpoints</h3>
                  
//                   <div className="space-y-6">
//                     <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
//                       <div className="flex items-center gap-3 mb-2">
//                         <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded">POST</span>
//                         <code className="text-sm font-mono text-slate-700">/predict_single</code>
//                       </div>
//                       <p className="text-sm text-slate-600">Predict a single network traffic sample</p>
//                     </div>

//                     <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
//                       <div className="flex items-center gap-3 mb-2">
//                         <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded">POST</span>
//                         <code className="text-sm font-mono text-slate-700">/predict_csv</code>
//                       </div>
//                       <p className="text-sm text-slate-600">Upload and predict multiple samples from CSV</p>
//                     </div>

//                     <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
//                       <div className="flex items-center gap-3 mb-2">
//                         <span className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded">GET</span>
//                         <code className="text-sm font-mono text-slate-700">/model_metrics</code>
//                       </div>
//                       <p className="text-sm text-slate-600">Retrieve model performance metrics</p>
//                     </div>

//                     <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
//                       <div className="flex items-center gap-3 mb-2">
//                         <span className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded">GET</span>
//                         <code className="text-sm font-mono text-slate-700">/dashboard_stats</code>
//                       </div>
//                       <p className="text-sm text-slate-600">Get dashboard statistics and analytics</p>
//                     </div>

//                     <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
//                       <div className="flex items-center gap-3 mb-2">
//                         <span className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded">GET</span>
//                         <code className="text-sm font-mono text-slate-700">/shap_files</code>
//                       </div>
//                       <p className="text-sm text-slate-600">List available SHAP visualization files</p>
//                     </div>
//                   </div>

//                   <div className="mt-8">
//                     <h3 className="text-xl font-semibold text-slate-800 mb-4">System Requirements</h3>
//                     <ul className="list-disc list-inside space-y-2 text-slate-600">
//                       <li>Python 3.8 or higher</li>
//                       <li>FastAPI backend running on port 8000</li>
//                       <li>Next.js 13+ for frontend</li>
//                       <li>Trained ML models in the models directory</li>
//                     </ul>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </main>
//       </div>

//       {/* Footer */}
//       <footer className="bg-white border-t border-slate-200 py-6">
//         <div className="max-w-7xl mx-auto px-6 text-center text-sm text-slate-600">
//           <p>© 2025 M-SoftTech IDS. Built with Next.js, TailwindCSS & Recharts.</p>
//           <p className="mt-1">Backend: <code className="px-2 py-1 bg-slate-100 rounded text-xs">{BASE}</code></p>
//         </div>
//       </footer>
//     </div>
//   );
// }





"use client"
import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { Activity, Shield, Upload, BarChart3, Wrench, FileText, Menu, X, AlertCircle, CheckCircle, TrendingUp } from "lucide-react";

export default function IDSDashboard() {
  const BASE = "http://localhost:8000";

  const [singleResult, setSingleResult] = useState(null);
  const [csvFile, setCsvFile] = useState(null);
  const [batchResult, setBatchResult] = useState(null);
  const [metrics, setMetrics] = useState([]);
  const [shapFiles, setShapFiles] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [active, setActive] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [recentPredictions, setRecentPredictions] = useState([]);
  
  const [jsonInput, setJsonInput] = useState(`{\n  "duration":2,\n  "protocol_type":"icmp",\n  "service":"ecr_i",\n  "flag":"SF"\n}`);
  const [inputMode, setInputMode] = useState('form');
  const [formData, setFormData] = useState({
    duration: '2',
    protocol_type: 'icmp',
    service: 'ecr_i',
    flag: 'SF',
    src_bytes: '',
    dst_bytes: '',
    land: '0',
    wrong_fragment: '0',
    urgent: '0'
  });

  const protocolTypes = ['tcp', 'udp', 'icmp'];
  const services = ['http', 'smtp', 'ftp', 'ssh', 'telnet', 'ecr_i', 'private', 'domain_u', 'other'];
  const flags = ['SF', 'S0', 'REJ', 'RSTR', 'RSTO', 'SH', 'S1', 'S2', 'RSTOS0', 'S3', 'OTH'];

  async function handleSinglePredict(e) {
    e?.preventDefault();
    setError(null);
    setLoading(true);
    setSingleResult(null);
    try {
      let payload;
      if (inputMode === 'json') {
        payload = { named: JSON.parse(jsonInput) };
      } else {
        const processedData = {};
        Object.keys(formData).forEach(key => {
          const value = formData[key];
          if (value === '') return;
          
          if (['duration', 'src_bytes', 'dst_bytes', 'land', 'wrong_fragment', 'urgent'].includes(key)) {
            processedData[key] = Number(value);
          } else {
            processedData[key] = value;
          }
        });
        payload = { named: processedData };
      }
      
      const res = await fetch(`${BASE}/predict_single`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || JSON.stringify(data));
      setSingleResult(data);
      
      const newPrediction = {
        id: Date.now(),
        timestamp: new Date().toLocaleString(),
        label: data.final_label === 1 ? 'ATTACK' : 'NORMAL',
        attackType: data.attack_type,
        confidence: data.confidence
      };
      setRecentPredictions(prev => [newPrediction, ...prev]);
    } catch (err) {
      console.error(err);
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMetrics();
    fetchShap();
    fetchStats();
  }, []);

  async function fetchMetrics() {
    try {
      const res = await fetch(`${BASE}/model_metrics`);
      if (!res.ok) throw new Error("Metrics fetch failed");
      const data = await res.json();
      setMetrics(data);
    } catch (e) {
      console.error(e);
      setMetrics([]);
    }
  }

  async function fetchShap() {
    try {
      const res = await fetch(`${BASE}/shap_files`);
      if (!res.ok) throw new Error("Shap fetch failed");
      const data = await res.json();
      setShapFiles(data.shap || []);
    } catch (e) {
      console.error(e);
      setShapFiles([]);
    }
  }

  async function fetchStats() {
    try {
      const res = await fetch(`${BASE}/dashboard_stats`);
      if (!res.ok) throw new Error("Stats fetch failed");
      const data = await res.json();
      setDashboard(data);
    } catch (e) {
      console.error(e);
      setDashboard(null);
    }
  }

  async function handleCSVUpload(e) {
    e?.preventDefault();
    if (!csvFile) return setError("Choose a CSV file first");
    setError(null);
    setLoading(true);
    setBatchResult(null);
    try {
      const fd = new FormData();
      fd.append("file", csvFile);
      const res = await fetch(`${BASE}/predict_csv`, {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || JSON.stringify(data));
      setBatchResult(data);
      // Add ALL CSV predictions to recent predictions
      if (data && data.results) {
        const newPreds = data.results.map(r => ({
          id: Date.now() + r.index,
          timestamp: new Date().toLocaleString(),
          label: r.final_label === 1 ? 'ATTACK' : 'NORMAL',
          attackType: r.attack_type,
          confidence: r.confidence
        }));
        setRecentPredictions(prev => [...prev, ...newPreds]);
      }
    } catch (err) {
      console.error(err);
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }

  const metricsChartData = metrics.map((m, i) => ({
    name: m.model || m.Model || `m${i}`,
    accuracy: Number(m.Accuracy ?? m.accuracy ?? m.Accuracy_score ?? 0),
    f1: Number(m.F1 ?? m.f1 ?? 0),
    roc: Number(m.ROC_AUC ?? m.roc_auc ?? 0),
  }));

  const supervisedList = singleResult ? Object.entries(singleResult.supervised) : [];

  const totalScans = recentPredictions.length;
  const normalCount = recentPredictions.filter(p => p.label === 'NORMAL').length;
  const attackCount = recentPredictions.filter(p => p.label === 'ATTACK').length;

  const detectionTrend = recentPredictions
    .slice()
    .reverse()
    .map((p, idx) => ({
      time: `#${idx + 1}`,
      normal: p.label === 'NORMAL' ? 1 : 0,
      attack: p.label === 'ATTACK' ? 1 : 0,
    }));

  const attackTypes = [
    { name: 'DoS', value: 35, color: '#a3e635' },
    { name: 'Probe', value: 25, color: '#84cc16' },
    { name: 'R2L', value: 20, color: '#65a30d' },
    { name: 'U2R', value: 20, color: '#4d7c0f' },
  ];

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'single', label: 'Single Prediction', icon: Shield },
    { id: 'csv', label: 'CSV Prediction', icon: Upload },
    { id: 'metrics', label: 'Model Metrics', icon: BarChart3 },
    { id: 'shap', label: 'SHAP Analysis', icon: Wrench },
    { id: 'docs', label: 'Documentation', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-gray-900/80 border-b border-gray-700/50 sticky top-0 z-30 backdrop-blur-sm">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors text-gray-300"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-lime-400 to-lime-500 rounded-xl flex items-center justify-center text-gray-900 font-bold shadow-lg">
                M
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">ADONIS- IDS</h1>
                <p className="text-xs text-gray-400">Intrusion Detection System</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg text-sm border border-gray-700">
              <div className="w-2 h-2 bg-lime-400 rounded-full animate-pulse"></div>
              <span className="text-gray-300">Connected to {BASE}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-72' : 'w-0'} transition-all duration-300 bg-gray-900/50 backdrop-blur-sm border-r border-gray-700/50 min-h-[calc(100vh-73px)] overflow-hidden`}>
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActive(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    active === item.id 
                      ? 'bg-lime-400 text-gray-900 shadow-lg shadow-lime-500/20' 
                      : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
          
          <div className="p-4 mt-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
              <h3 className="text-white font-semibold mb-2 text-sm">System Status</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-gray-400">
                  <span>Uptime</span>
                  <span className="text-lime-400">99.9%</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Models</span>
                  <span className="text-lime-400">{metrics.length || 0}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Predictions</span>
                  <span className="text-lime-400">{recentPredictions.length}</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-8 overflow-auto">
          
          {/* Dashboard */}
          {active === 'dashboard' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h2>
                <p className="text-gray-400">Real-time monitoring and analytics</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-700/50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-lime-400/10 rounded-xl">
                      <Activity className="text-lime-400" size={24} />
                    </div>
                    <TrendingUp className="text-lime-400" size={20} />
                  </div>
                  <h3 className="text-gray-400 text-sm font-medium mb-1">Total Scans</h3>
                  <p className="text-3xl font-bold text-white">{totalScans}</p>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-700/50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-lime-400/10 rounded-xl">
                      <CheckCircle className="text-lime-400" size={24} />
                    </div>
                  </div>
                  <h3 className="text-gray-400 text-sm font-medium mb-1">Normal Traffic</h3>
                  <p className="text-3xl font-bold text-white">{normalCount}</p>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-700/50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-red-500/10 rounded-xl">
                      <AlertCircle className="text-red-400" size={24} />
                    </div>
                  </div>
                  <h3 className="text-gray-400 text-sm font-medium mb-1">Attacks Detected</h3>
                  <p className="text-3xl font-bold text-white">{attackCount}</p>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-700/50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-lime-400/10 rounded-xl">
                      <Shield className="text-lime-400" size={24} />
                    </div>
                  </div>
                  <h3 className="text-gray-400 text-sm font-medium mb-1">Accuracy Rate</h3>
                  <p className="text-3xl font-bold text-white">98.7%</p>
                </div>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Detection Trend */}
                <div className="lg:col-span-2 bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-700/50">
                  <h3 className="text-lg font-semibold text-white mb-4">Detection Trend (24h)</h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={detectionTrend}>
                      <defs>
                        <linearGradient id="colorNormal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#a3e635" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#a3e635" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorAttack" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="time" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '12px', color: '#fff' }}
                      />
                      <Area type="monotone" dataKey="normal" stroke="#a3e635" strokeWidth={2} fillOpacity={1} fill="url(#colorNormal)" />
                      <Area type="monotone" dataKey="attack" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorAttack)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Attack Types Pie */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-700/50">
                  <h3 className="text-lg font-semibold text-white mb-4">Attack Types</h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={attackTypes}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {attackTypes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '12px', color: '#fff' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {attackTypes.map((type) => (
                      <div key={type.name} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: type.color }}></div>
                        <span className="text-xs text-gray-400">{type.name} ({type.value}%)</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Predictions */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Predictions</h3>
                {recentPredictions.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Shield size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No predictions yet. Try making a prediction!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentPredictions.map((pred) => (
                      <div key={pred.id} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-xl border border-gray-700/50">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${pred.label === 'ATTACK' ? 'bg-red-500/10' : 'bg-lime-400/10'}`}>
                            {pred.label === 'ATTACK' ? 
                              <AlertCircle className="text-red-400" size={20} /> : 
                              <CheckCircle className="text-lime-400" size={20} />
                            }
                          </div>
                          <div>
                            <p className="font-semibold text-white">{pred.label}</p>
                            <p className="text-sm text-gray-400">{pred.timestamp}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-300">{pred.attackType}</p>
                          <p className="text-xs text-gray-500">Confidence: {(pred.confidence * 100).toFixed(1)}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Single Prediction */}
          {active === 'single' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Single Prediction</h2>
                <p className="text-gray-400">Analyze individual network traffic patterns</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input Section */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-700/50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Input Data</h3>
                    
                    <div className="flex items-center gap-2 bg-gray-900/50 rounded-lg p-1 border border-gray-700/50">
                      <button
                        type="button"
                        onClick={() => setInputMode('form')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                          inputMode === 'form' 
                            ? 'bg-lime-400 text-gray-900 shadow-sm' 
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        Form
                      </button>
                      <button
                        type="button"
                        onClick={() => setInputMode('json')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                          inputMode === 'json' 
                            ? 'bg-lime-400 text-gray-900 shadow-sm' 
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        JSON
                      </button>
                    </div>
                  </div>

                  <form onSubmit={handleSinglePredict} className="space-y-4">
                    {inputMode === 'form' ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Duration</label>
                            <input
                              type="number"
                              value={formData.duration}
                              onChange={(e) => setFormData({...formData, duration: e.target.value})}
                              className="w-full p-3 bg-gray-900/50 rounded-lg border border-gray-700 text-white focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all"
                              placeholder="e.g., 2"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Protocol Type</label>
                            <select
                              value={formData.protocol_type}
                              onChange={(e) => setFormData({...formData, protocol_type: e.target.value})}
                              className="w-full p-3 bg-gray-900/50 rounded-lg border border-gray-700 text-white focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all"
                            >
                              {protocolTypes.map(proto => (
                                <option key={proto} value={proto}>{proto}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Service</label>
                            <select
                              value={formData.service}
                              onChange={(e) => setFormData({...formData, service: e.target.value})}
                              className="w-full p-3 bg-gray-900/50 rounded-lg border border-gray-700 text-white focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all"
                            >
                              {services.map(srv => (
                                <option key={srv} value={srv}>{srv}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Flag</label>
                            <select
                              value={formData.flag}
                              onChange={(e) => setFormData({...formData, flag: e.target.value})}
                              className="w-full p-3 bg-gray-900/50 rounded-lg border border-gray-700 text-white focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all"
                            >
                              {flags.map(flg => (
                                <option key={flg} value={flg}>{flg}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Source Bytes</label>
                            <input
                              type="number"
                              value={formData.src_bytes}
                              onChange={(e) => setFormData({...formData, src_bytes: e.target.value})}
                              className="w-full p-3 bg-gray-900/50 rounded-lg border border-gray-700 text-white focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all"
                              placeholder="Optional"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Destination Bytes</label>
                            <input
                              type="number"
                              value={formData.dst_bytes}
                              onChange={(e) => setFormData({...formData, dst_bytes: e.target.value})}
                              className="w-full p-3 bg-gray-900/50 rounded-lg border border-gray-700 text-white focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all"
                              placeholder="Optional"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Land</label>
                            <select
                              value={formData.land}
                              onChange={(e) => setFormData({...formData, land: e.target.value})}
                              className="w-full p-3 bg-gray-900/50 rounded-lg border border-gray-700 text-white focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all"
                            >
                              <option value="0">0</option>
                              <option value="1">1</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Wrong Fragment</label>
                            <input
                              type="number"
                              value={formData.wrong_fragment}
                              onChange={(e) => setFormData({...formData, wrong_fragment: e.target.value})}
                              className="w-full p-3 bg-gray-900/50 rounded-lg border border-gray-700 text-white focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all"
                              placeholder="0"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Urgent</label>
                            <input
                              type="number"
                              value={formData.urgent}
                              onChange={(e) => setFormData({...formData, urgent: e.target.value})}
                              className="w-full p-3 bg-gray-900/50 rounded-lg border border-gray-700 text-white focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all"
                              placeholder="0"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">JSON Input</label>
                        <textarea
                          value={jsonInput}
                          onChange={(e) => setJsonInput(e.target.value)}
                          rows={12}
                          className="w-full p-4 bg-gray-900/50 rounded-xl border border-gray-700 text-sm font-mono text-white focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all"
                          placeholder="Enter JSON data..."
                        />
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-6 py-3 bg-lime-400 text-gray-900 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:bg-lime-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Analyzing...' : 'Predict'}
                      </button>
                      {inputMode === 'json' && (
                        <button
                          type="button"
                          onClick={() => setJsonInput(JSON.stringify({ duration:2, protocol_type:'icmp', service:'ecr_i', flag:'SF' }, null, 2))}
                          className="px-6 py-3 border-2 border-gray-700 rounded-xl font-medium text-gray-300 hover:bg-gray-800/50 transition-all"
                        >
                          Example
                        </button>
                      )}
                      {inputMode === 'form' && (
                        <button
                          type="button"
                          onClick={() => setFormData({
                            duration: '2',
                            protocol_type: 'icmp',
                            service: 'ecr_i',
                            flag: 'SF',
                            src_bytes: '',
                            dst_bytes: '',
                            land: '0',
                            wrong_fragment: '0',
                            urgent: '0'
                          })}
                          className="px-6 py-3 border-2 border-gray-700 rounded-xl font-medium text-gray-300 hover:bg-gray-800/50 transition-all"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* Result Section */}
                <div className="space-y-4">
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 text-red-400">
                      <div className="flex items-center gap-2">
                        <AlertCircle size={20} />
                        <span className="font-medium">Error</span>
                      </div>
                      <p className="text-sm mt-2">{error}</p>
                    </div>
                  )}

                  {singleResult && (
                    <>
                      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-700/50">
                        <h3 className="text-lg font-semibold text-white mb-4">Final Prediction</h3>
                        <div className="space-y-4">
                          <div className={`p-4 rounded-xl ${singleResult.final_label === 1 ? 'bg-red-500/10 border border-red-500/30' : 'bg-lime-400/10 border border-lime-400/30'}`}>
                            <div className="flex items-center gap-3 mb-2">
                              {singleResult.final_label === 1 ? 
                                <AlertCircle className="text-red-400" size={24} /> : 
                                <CheckCircle className="text-lime-400" size={24} />
                              }
                              <span className={`text-2xl font-bold ${singleResult.final_label === 1 ? 'text-red-400' : 'text-lime-400'}`}>
                                {singleResult.final_label === 1 ? 'ATTACK' : 'NORMAL'}
                              </span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-700/50">
                              <p className="text-xs text-gray-400 mb-1">Attack Type</p>
                              <p className="text-lg font-semibold text-white">{singleResult.attack_type}</p>
                            </div>
                            <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-700/50">
                              <p className="text-xs text-gray-400 mb-1">Confidence</p>
                              <p className="text-lg font-semibold text-white">{(singleResult.confidence * 100).toFixed(1)}%</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-700/50">
                        <h3 className="text-lg font-semibold text-white mb-4">Model Votes</h3>
                        <div className="space-y-2 max-h-64 overflow-auto">
                          {supervisedList.map(([m, v]) => (
                            <div key={m} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700/50">
                              <span className="font-medium text-gray-300 text-sm">{m}</span>
                              <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-400">Pred: {v.pred}</span>
                                <span className="text-sm font-medium text-white">
                                  {v.prob ? `${(v.prob * 100).toFixed(1)}%` : '-'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* CSV Prediction */}
          {active === 'csv' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Batch CSV Prediction</h2>
                <p className="text-gray-400">Upload and analyze multiple network traffic samples</p>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-700/50 max-w-2xl">
                <h3 className="text-lg font-semibold text-white mb-4">Upload CSV File</h3>
                <form onSubmit={handleCSVUpload} className="space-y-4">
                  <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center hover:border-lime-400 transition-colors">
                    <Upload className="mx-auto text-gray-500 mb-4" size={48} />
                    <input
                      type="file"
                      accept=".csv"
                      onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                      className="hidden"
                      id="csv-upload"
                    />
                    <label htmlFor="csv-upload" className="cursor-pointer">
                      <span className="text-lime-400 font-medium hover:underline">Choose a file</span>
                      <span className="text-gray-400"> or drag and drop</span>
                    </label>
                    {csvFile && (
                      <p className="mt-3 text-sm text-gray-300">Selected: {csvFile.name}</p>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={loading || !csvFile}
                      className="flex-1 px-6 py-3 bg-lime-400 text-gray-900 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:bg-lime-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Processing...' : 'Upload & Predict'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setCsvFile(null)}
                      className="px-6 py-3 border-2 border-gray-700 rounded-xl font-medium text-gray-300 hover:bg-gray-800/50 transition-all"
                    >
                      Clear
                    </button>
                  </div>
                </form>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 text-red-400">
                  <div className="flex items-center gap-2">
                    <AlertCircle size={20} />
                    <span className="font-medium">Error</span>
                  </div>
                  <p className="text-sm mt-2">{error}</p>
                </div>
              )}

              {batchResult && (
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-700/50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Batch Results</h3>
                    <span className="px-4 py-1 bg-lime-400/20 text-lime-400 rounded-full text-sm font-medium border border-lime-400/30">
                      {batchResult.n} Records
                    </span>
                  </div>
                  <div className="overflow-auto max-h-96 rounded-xl border border-gray-700">
                    <table className="w-full">
                      <thead className="bg-gray-900/50 sticky top-0">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Index</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Label</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Attack Type</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Confidence</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {batchResult.results.map((r) => (
                          <tr key={r.index} className="hover:bg-gray-900/50">
                            <td className="px-4 py-3 text-sm text-gray-400">{r.index}</td>
                            <td className="px-4 py-3">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                r.final_label === 1 ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-lime-400/20 text-lime-400 border border-lime-400/30'
                              }`}>
                                {r.final_label === 1 ? 'ATTACK' : 'NORMAL'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-300">{r.attack_type}</td>
                            <td className="px-4 py-3 text-sm font-medium text-white">{(Number(r.confidence) * 100).toFixed(1)}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Model Metrics */}
          {active === 'metrics' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Model Performance Metrics</h2>
                <p className="text-gray-400">Comprehensive analysis of model accuracy and performance</p>
              </div>

              {metricsChartData.length === 0 ? (
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-12 shadow-lg border border-gray-700/50 text-center">
                  <BarChart3 className="mx-auto text-gray-600 mb-4" size={64} />
                  <p className="text-gray-400">No metrics available. Ensure model_performance.csv exists on the backend.</p>
                </div>
              ) : (
                <>
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-700/50">
                    <h3 className="text-lg font-semibold text-white mb-4">Model Comparison - Accuracy & F1 Score</h3>
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart data={metricsChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="name" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '12px', color: '#fff' }}
                        />
                        <Legend />
                        <Bar dataKey="accuracy" name="Accuracy" fill="#a3e635" radius={[8, 8, 0, 0]} />
                        <Bar dataKey="f1" name="F1 Score" fill="#84cc16" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-700/50">
                    <h3 className="text-lg font-semibold text-white mb-4">ROC AUC Scores</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={metricsChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="name" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '12px', color: '#fff' }}
                        />
                        <Line type="monotone" dataKey="roc" stroke="#a3e635" strokeWidth={3} dot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {metricsChartData.map((model, idx) => (
                      <div key={idx} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-700/50">
                        <h4 className="font-semibold text-white mb-4">{model.name}</h4>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-400">Accuracy</span>
                              <span className="font-medium text-white">{(model.accuracy * 100).toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div className="bg-lime-400 h-2 rounded-full" style={{ width: `${model.accuracy * 100}%` }}></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-400">F1 Score</span>
                              <span className="font-medium text-white">{(model.f1 * 100).toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div className="bg-lime-400 h-2 rounded-full" style={{ width: `${model.f1 * 100}%` }}></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-400">ROC AUC</span>
                              <span className="font-medium text-white">{(model.roc * 100).toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div className="bg-lime-400 h-2 rounded-full" style={{ width: `${model.roc * 100}%` }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* SHAP Analysis */}
          {active === 'shap' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">SHAP Analysis</h2>
                <p className="text-gray-400">Feature importance and model explainability visualizations</p>
              </div>

              {shapFiles.length === 0 ? (
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-12 shadow-lg border border-gray-700/50 text-center">
                  <Wrench className="mx-auto text-gray-600 mb-4" size={64} />
                  <p className="text-gray-400">No SHAP visualizations available.</p>
                  <p className="text-sm text-gray-500 mt-2">Generate SHAP plots on the backend to view them here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {shapFiles.map((f) => (
                    <a 
                      key={f} 
                      href={`${BASE}/shap/${f}`} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-700/50 hover:shadow-xl hover:border-lime-400/50 transition-all"
                    >
                      <div className="aspect-video bg-gray-900/50 rounded-xl overflow-hidden mb-3">
                        <img 
                          src={`${BASE}/shap/${f}`} 
                          alt={f} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        />
                      </div>
                      <p className="text-sm font-medium text-gray-300 truncate">{f}</p>
                      <p className="text-xs text-gray-500 mt-1">Click to view full size</p>
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Documentation */}
          {active === 'docs' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Documentation</h2>
                <p className="text-gray-400">API reference and system documentation</p>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-700/50">
                <div className="prose max-w-none">
                  <h1 className="text-4xl font-bold mb-6 text-white">Project Documentation</h1>

                  <section className="bg-grey-700 p-6 rounded-lg shadow-lg space-y-4">
                    <h2 className="text-2xl font-semibold text-white">Problem Statement</h2>
                    <p className="text-gray-100 leading-relaxed">
                      This Intrusion Detection System (IDS) project aims to detect malicious network activity in real-time using 
                      machine learning and anomaly detection. Traditional signature-based systems fail to identify new attack 
                      patterns. Our hybrid solution uses supervised ML + anomaly detectors to identify DoS, Probe, R2L, U2R, 
                      and unknown attack variations with high accuracy.
                    </p>
                  </section>

                  <section className="bg-grey-700 p-6 rounded-lg shadow-lg space-y-4">
                    <h2 className="text-2xl font-semibold text-white">Challenges Faced</h2>
                    <ul className="list-disc pl-6 space-y-2 text-gray-100">
                      <li>Handling 43-dimensional NSL-KDD dataset with mixed categorical & numeric features.</li>
                      <li>Severe class imbalance (DoS attacks dominate).</li>
                      <li>Different ML models required standardized preprocessing formats.</li>
                      <li>Converted training pipelines into optimized reusable <b>.pkl</b> files.</li>
                      <li>Combining anomaly detectors with supervised predictions consistently.</li>
                      <li>FastAPI backend had to support both CSV + JSON inputs efficiently.</li>
                    </ul>
                  </section>

                  <section className="bg-grey-700 p-6 rounded-lg shadow-lg space-y-4">
                    <h2 className="text-2xl font-semibold text-white">Our Project Pipeline</h2>
                    <ol className="list-decimal pl-6 space-y-3 text-gray-100">
                      <li>Processed and cleaned the NSL-KDD dataset.</li>
                      <li>Encoded categorical fields + scaled numeric values.</li>
                      <li>Trained 7 supervised models: <b>Logistic Regression, KNN, Decision Tree, Random Forest, SVM, Naive Bayes, XGBoost</b>.</li>
                      <li>Trained 3 anomaly detectors: <b>Isolation Forest, One-Class SVM, Autoencoder</b>.</li>
                      <li>Saved all models as optimized <b>.pkl</b> files.</li>
                      <li>Created an ensemble combining all predictions.</li>
                      <li>Built a FastAPI backend for single + batch predictions.</li>
                      <li>Designed a modern Next.js dashboard for visualization, logs, and analytics.</li>
                    </ol>
                  </section>

                  <section className="bg-grey-700 p-6 rounded-lg shadow-lg space-y-4">
                    <h2 className="text-2xl font-semibold text-white">Why These Models?</h2>
                    <ul className="list-disc pl-6 space-y-2 text-gray-100">
                      <li><b>XGBoost</b> – Highest accuracy, handles imbalance well.</li>
                      <li><b>Random Forest</b> – Stable, robust against noise.</li>
                      <li><b>SVM</b> – Strong nonlinear separation.</li>
                      <li><b>Naive Bayes</b> – Extremely fast baseline.</li>
                      <li><b>KNN</b> – Simple and effective.</li>
                      <li><b>Decision Tree</b> – Fully interpretable.</li>
                      <li><b>Logistic Regression</b> – Reliable linear baseline.</li>
                    </ul>
                  </section>

                  <section className="bg-grey-700 p-6 rounded-lg shadow-lg space-y-4">
                    <h2 className="text-2xl font-semibold text-white">How the Ensemble Works</h2>
                    <p className="text-gray-100">Final prediction uses a hybrid combination:</p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-100">
                      <li><b>Majority vote</b> from 7 supervised models.</li>
                      <li>Anomaly detectors strengthen attack prediction when suspicious behavior is detected.</li>
                      <li>Weak supervised margin (4–3) + no anomaly → Normal.</li>
                      <li>Weak supervised margin (4–3) + anomaly flags → Attack.</li>
                      <li>Attack type selected using weighted model probabilities.</li>
                    </ul>
                  </section>

                  <section className="bg-grey-700 p-6 rounded-lg shadow-lg space-y-4">
                    <h2 className="text-2xl font-semibold text-white">User Accessibility</h2>
                    <ul className="list-disc pl-6 space-y-2 text-gray-100">
                      <li><b>Single Prediction</b> – Form + JSON mode.</li>
                      <li><b>CSV Upload</b> – Batch predictions with summaries.</li>
                      <li><b>Dashboard</b> – Trends, logs, attack distribution.</li>
                      <li><b>SHAP Analysis</b> – Explainable AI integration.</li>
                      <li><b>Model Metrics</b> – Accuracy, precision, F1-score, etc.</li>
                      <li>Clean UI with Tailwind + React.</li>
                    </ul>
                  </section>

                  <section className="p-6 bg-gray-900/50 rounded-xl border border-gray-700/50 space-y-6 mt-10">
                    <h2 className="text-2xl font-semibold text-white">API Endpoints</h2>

                    <div className="p-4 bg-gray-800 rounded-xl border border-gray-700/60">
                      <span className="px-3 py-1 bg-blue-500 text-xs font-bold rounded text-white">POST</span>
                      <code className="ml-2 text-gray-200 font-mono">/predict_single</code>
                      <p className="text-gray-400 text-sm mt-1">Predict one network entry.</p>
                    </div>

                    <div className="p-4 bg-gray-800 rounded-xl border border-gray-700/60">
                      <span className="px-3 py-1 bg-blue-500 text-xs font-bold rounded text-white">POST</span>
                      <code className="ml-2 text-gray-200 font-mono">/predict_csv</code>
                      <p className="text-gray-400 text-sm mt-1">Predict multiple entries via CSV.</p>
                    </div>

                    <div className="p-4 bg-gray-800 rounded-xl border border-gray-700/60">
                      <span className="px-3 py-1 bg-green-600 text-xs font-bold rounded text-white">GET</span>
                      <code className="ml-2 text-gray-200 font-mono">/model_metrics</code>
                      <p className="text-gray-400 text-sm mt-1">Get model performance metrics.</p>
                    </div>

                    <div className="p-4 bg-gray-800 rounded-xl border border-gray-700/60">
                      <span className="px-3 py-1 bg-green-600 text-xs font-bold rounded text-white">GET</span>
                      <code className="ml-2 text-gray-200 font-mono">/dashboard_stats</code>
                      <p className="text-gray-400 text-sm mt-1">Retrieve backend logs & stats.</p>
                    </div>

                    <div className="p-4 bg-gray-800 rounded-xl border border-gray-700/60">
                      <span className="px-3 py-1 bg-green-600 text-xs font-bold rounded text-white">GET</span>
                      <code className="ml-2 text-gray-200 font-mono">/shap_files</code>
                      <p className="text-gray-400 text-sm mt-1">View SHAP visualizations.</p>
                    </div>
                  </section>

                  <section className="bg-gray-800/50 p-6 rounded-lg shadow-lg space-y-4 mb-20">
                    <h2 className="text-2xl font-semibold text-white">Conclusion</h2>
                    <p className="text-gray-100">
                      This IDS system achieves strong detection accuracy through ensemble learning and anomaly detection. 
                      With explainability tools, dashboard analytics, and multi-input support, it is designed to be both 
                      powerful and user-friendly for real-world security monitoring.
                    </p>
                  </section>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900/80 border-t border-gray-700/50 py-6">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-gray-400">
          <p>© 2025 ADONIS IDS. Built with Next.js, TailwindCSS & Recharts.</p>
          <p className="mt-1">Backend: <code className="px-2 py-1 bg-gray-800 rounded text-xs border border-gray-700">{BASE}</code></p>
        </div>
      </footer>
    </div>
  );
}