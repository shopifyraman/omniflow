'use client';

import React, { useState, useEffect } from 'react';
import { useStore, Role, Post, Client, Employee } from '../store/useStore';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { 
  Building, Wallet, Database, Clock, Sparkles, Send, Check, X,
  Plus, Users, FileText, Image, ChevronRight, UserPlus, History, Activity as ActivityIcon, MessageSquare, Edit3, Save, Settings as SettingsIcon
} from 'lucide-react';

export default function Home() {
  const { 
    activeRole, clients, employees, posts, tasks, theme, activities, settings, setRole, addClient, updateClient, addPost, updatePost, updatePostStatus, addComment, addEmployee, updateEmployee, createNewVersion, updateSettings
  } = useStore();

  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  
  // Modals / toggles
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);

  // Edit Panel Selection
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  // Theme support
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Form states for creation
  const [postTitle, setPostTitle] = useState('');
  const [postClient, setPostClient] = useState('');
  const [postPlatform, setPostPlatform] = useState<'Instagram' | 'Facebook' | 'LinkedIn' | 'Twitter' | 'YouTube'>('Instagram');
  const [postCaption, setPostCaption] = useState('');
  const [postMediaUrl, setPostMediaUrl] = useState('https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&fit=crop&q=80');
  const [newCommentText, setNewCommentText] = useState('');

  // Form states for client onboarding / editing
  const [clientName, setClientName] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientWebsite, setClientWebsite] = useState('');
  const [clientNotes, setClientNotes] = useState('');

  // Form states for employee creation / editing
  const [empName, setEmpName] = useState('');
  const [empRole, setEmpRole] = useState('');
  const [empEmail, setEmpEmail] = useState('');
  const [empDept, setEmpDept] = useState('');

  // Version/Revision editing
  const [editCaption, setEditCaption] = useState('');
  const [editMediaUrl, setEditMediaUrl] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [isInlineEditingPost, setIsInlineEditingPost] = useState(false);

  // Setting states
  const [agencyNameInput, setAgencyNameInput] = useState(settings.agencyName);
  const [timezoneInput, setTimezoneInput] = useState(settings.timezone);
  const [brandToneInput, setBrandToneInput] = useState(settings.aiBrandTone);
  const [slackNotifyInput, setSlackNotifyInput] = useState(settings.slackNotifications);
  const [twoFactorInput, setTwoFactorInput] = useState(settings.twoFactorAuth);
  const [emailTemplateInput, setEmailTemplateInput] = useState(settings.emailTemplates);

  useEffect(() => {
    if (selectedPost) {
      setEditCaption(selectedPost.caption);
      setEditMediaUrl(selectedPost.mediaUrl);
      setEditTitle(selectedPost.title);
    }
  }, [selectedPost]);

  const handleAICaption = () => {
    if (postClient.includes('Nike') || !postClient) {
      setPostCaption("Push beyond your limits. ⚡️ Experience responsive cushioning engineered to fuel every mile. Just do it. #NikeAirMax #RunningGoals");
    } else {
      setPostCaption("Unwind and refresh. 🧊☕️ Sip on cold brew perfection, cold foam-topped, and ready to brighten your summer afternoon. #CoffeeChill #Starbucks");
    }
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle || !postCaption) return;

    addPost({
      title: postTitle,
      caption: postCaption,
      platform: postPlatform,
      mediaUrl: postMediaUrl,
      mediaType: 'image',
      hashtags: '#BrandGoals #Marketing',
      mentions: '@omniflow',
      scheduleDate: new Date().toISOString().split('T')[0],
      priority: 'High',
      status: 'Internal Review',
      clientName: postClient || 'Nike Digital',
      employeeName: 'Alex Rivera'
    });

    setPostTitle('');
    setPostCaption('');
    setShowCreatePostModal(false);
  };

  const handleOnboardClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail) return;

    addClient({
      name: clientName,
      companyName: clientCompany,
      email: clientEmail,
      phone: clientPhone || '+1 (555) 0000',
      brandName: clientCompany,
      website: clientWebsite || (clientCompany.toLowerCase().replace(/\s+/g, '') + '.com'),
      socialLinks: { instagram: '@' + clientCompany.toLowerCase() },
      address: 'Main St, San Francisco',
      notes: clientNotes || 'New account onboarded via Next.js panel.',
      assignedEmployee: 'Alex Rivera',
      status: 'Active',
      logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&fit=crop&q=80'
    });

    setClientName('');
    setClientCompany('');
    setClientEmail('');
    setClientPhone('');
    setClientWebsite('');
    setClientNotes('');
    setShowClientModal(false);
  };

  const handleSaveClientEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient) return;

    updateClient(editingClient.id, {
      name: clientName,
      companyName: clientCompany,
      email: clientEmail,
      phone: clientPhone,
      website: clientWebsite,
      notes: clientNotes
    });

    setEditingClient(null);
  };

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empName || !empEmail) return;

    addEmployee({
      name: empName,
      email: empEmail,
      phone: '+1 (555) 1234',
      role: empRole || 'Social Media Specialist',
      department: empDept || 'Marketing',
      assignedClients: ['Nike Digital']
    });

    setEmpName('');
    setEmpRole('');
    setEmpEmail('');
    setEmpDept('');
    setShowEmployeeModal(false);
  };

  const handleSaveEmployeeEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmployee) return;

    updateEmployee(editingEmployee.id, {
      name: empName,
      email: empEmail,
      role: empRole,
      department: empDept
    });

    setEditingEmployee(null);
  };

  const handleAddComment = (postId: string) => {
    if (!newCommentText.trim()) return;
    addComment(postId, {
      author: activeRole === 'client' ? 'John Doe' : 'Alex Rivera',
      role: activeRole,
      text: newCommentText
    });
    setNewCommentText('');
    const updatedPost = posts.find(p => p.id === postId);
    if (updatedPost) setSelectedPost(updatedPost);
  };

  const handleSaveNewVersion = (postId: string) => {
    createNewVersion(postId, editMediaUrl, editCaption);
    const updatedPost = useStore.getState().posts.find(p => p.id === postId);
    if (updatedPost) setSelectedPost(updatedPost);
  };

  const handleSavePostEdit = (postId: string) => {
    updatePost(postId, {
      title: editTitle,
      caption: editCaption,
      mediaUrl: editMediaUrl
    });
    setIsInlineEditingPost(false);
    const updatedPost = useStore.getState().posts.find(p => p.id === postId);
    if (updatedPost) setSelectedPost(updatedPost);
  };

  const handleSaveSettings = () => {
    updateSettings({
      agencyName: agencyNameInput,
      timezone: timezoneInput,
      aiBrandTone: brandToneInput,
      slackNotifications: slackNotifyInput,
      twoFactorAuth: twoFactorInput,
      emailTemplates: emailTemplateInput
    });
  };

  const getStatusBadge = (status: Post['status']) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400';
      case 'Client Reviewing': return 'bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400';
      case 'Internal Review': return 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400';
      case 'Rejected': return 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400';
      case 'Needs Changes': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[var(--background)]">
      
      {/* Sidebar */}
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header */}
        <Header currentView={currentView === 'settings' ? `Settings (${settings.agencyName})` : currentView} onQuickCreate={() => setShowCreatePostModal(true)} />

        {/* Dynamic View panels */}
        <main className="flex-1 overflow-y-auto p-6">
          
          {currentView === 'dashboard' && (
            <div className="space-y-6">
              {/* Top KPI row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-[var(--card)] p-6 rounded-2xl border border-[var(--border)] shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 rounded-xl"><Building className="w-6 h-6" /></div>
                    <div>
                      <div className="text-xs font-semibold text-gray-500">Clients</div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{clients.length}</div>
                    </div>
                  </div>
                </div>
                <div className="bg-[var(--card)] p-6 rounded-2xl border border-[var(--border)] shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-50 dark:bg-green-950/40 text-green-600 rounded-xl"><Wallet className="w-6 h-6" /></div>
                    <div>
                      <div className="text-xs font-semibold text-gray-500">Revenue</div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">$284,500</div>
                    </div>
                  </div>
                </div>
                <div className="bg-[var(--card)] p-6 rounded-2xl border border-[var(--border)] shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/40 text-amber-600 rounded-xl"><Clock className="w-6 h-6" /></div>
                    <div>
                      <div className="text-xs font-semibold text-gray-500">Approvals Pending</div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {posts.filter(p => p.status.includes('Reviewing')).length}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-[var(--card)] p-6 rounded-2xl border border-[var(--border)] shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-600 rounded-xl"><Database className="w-6 h-6" /></div>
                    <div>
                      <div className="text-xs font-semibold text-gray-500">Campaigns</div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">4 Active</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom detail row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left col: list of approvals queue */}
                <div className="lg:col-span-2 bg-[var(--card)] p-6 rounded-2xl border border-[var(--border)] shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Recent Content Campaigns</h3>
                    <button onClick={() => setCurrentView('posts')} className="text-xs font-semibold text-indigo-600 hover:underline">View All Queue</button>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="text-gray-400 font-semibold border-b border-[var(--border)] pb-2">
                          <th className="pb-3">Campaign Title</th>
                          <th className="pb-3">Client</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {posts.map((post) => (
                          <tr key={post.id} className="border-b border-[var(--border)] last:border-none hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
                            <td className="py-3.5 font-bold text-gray-900 dark:text-gray-100">{post.title}</td>
                            <td>{post.clientName}</td>
                            <td>
                              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusBadge(post.status)}`}>
                                {post.status}
                              </span>
                            </td>
                            <td>
                              <button 
                                onClick={() => {
                                  setSelectedPost(post);
                                  setCurrentView('posts');
                                }}
                                className="text-xs bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 px-3 py-1.5 rounded-lg border border-[var(--border)] font-semibold"
                              >
                                Review
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right col: Live Activity Feed */}
                <div className="bg-[var(--card)] p-6 rounded-2xl border border-[var(--border)] shadow-sm space-y-4">
                  <div className="flex items-center gap-2">
                    <ActivityIcon className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Live Activity Feed</h3>
                  </div>
                  <div className="space-y-4">
                    {activities.map((act) => (
                      <div key={act.id} className="flex gap-3 text-xs">
                        <div className="w-6 h-6 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                          {act.user[0]}
                        </div>
                        <div>
                          <p className="text-gray-700 dark:text-gray-300">
                            <strong>{act.user}</strong> {act.action} <strong>{act.target}</strong>
                          </p>
                          <span className="text-[10px] text-gray-400">{act.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {currentView === 'clients' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 font-title">Portfolios & Client Directory</h2>
                <button 
                  onClick={() => setShowClientModal(true)} 
                  className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold shadow-sm"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Onboard Client</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {clients.map((client) => (
                  <div key={client.id} className="bg-[var(--card)] p-6 rounded-2xl border border-[var(--border)] shadow-sm space-y-4 hover:shadow-md transition-shadow relative group">
                    <button 
                      onClick={() => {
                        setEditingClient(client);
                        setClientName(client.name);
                        setClientCompany(client.companyName);
                        setClientEmail(client.email);
                        setClientPhone(client.phone);
                        setClientWebsite(client.website);
                        setClientNotes(client.notes);
                      }}
                      className="absolute top-4 right-4 p-1.5 bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-indigo-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity border border-[var(--border)]"
                      title="Edit Client"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-4">
                      <img src={client.logo} className="w-12 h-12 rounded-xl object-cover border border-[var(--border)]" />
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-gray-100">{client.name}</h4>
                        <p className="text-xs text-gray-500">{client.companyName}</p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 space-y-2 border-t border-[var(--border)] pt-3">
                      <div><strong>Industry:</strong> {client.brandName}</div>
                      <div><strong>Email:</strong> {client.email}</div>
                      <div><strong>Phone:</strong> {client.phone}</div>
                      <div><strong>Website:</strong> <span className="text-indigo-600 hover:underline cursor-pointer">{client.website}</span></div>
                      <div><strong>Notes:</strong> {client.notes}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentView === 'employees' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 font-title">Employees Directory</h2>
                <button 
                  onClick={() => setShowEmployeeModal(true)} 
                  className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Employee</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {employees.map((emp) => (
                  <div key={emp.id} className="bg-[var(--card)] p-6 rounded-2xl border border-[var(--border)] shadow-sm text-center space-y-3 hover:shadow-md transition-shadow relative group">
                    <button 
                      onClick={() => {
                        setEditingEmployee(emp);
                        setEmpName(emp.name);
                        setEmpEmail(emp.email);
                        setEmpRole(emp.role);
                        setEmpDept(emp.department);
                      }}
                      className="absolute top-4 right-4 p-1.5 bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-indigo-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity border border-[var(--border)]"
                      title="Edit Employee"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 flex items-center justify-center font-bold text-lg mx-auto">
                      {emp.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-gray-100">{emp.name}</h4>
                      <p className="text-xs text-gray-500">{emp.role}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800/40 p-3 rounded-xl text-xs space-y-1 text-left">
                      <div><strong>Dept:</strong> {emp.department}</div>
                      <div><strong>Email:</strong> {emp.email}</div>
                      <div><strong>Clients:</strong> {emp.assignedClients.join(', ')}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentView === 'posts' && (
            <div className="space-y-6">
              {selectedPost ? (
                // Detailed single post review & approvals view
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <button onClick={() => setSelectedPost(null)} className="text-xs text-indigo-600 font-semibold hover:underline">← Back to Queue</button>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setIsInlineEditingPost(!isInlineEditingPost)} 
                        className="text-xs flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-[var(--border)] text-gray-700 dark:text-gray-300 font-semibold"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>{isInlineEditingPost ? 'Cancel Inline Edit' : 'Edit Post Details'}</span>
                      </button>
                      <button 
                        onClick={() => setShowVersionHistory(!showVersionHistory)} 
                        className="text-xs flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-[var(--border)] text-gray-700 dark:text-gray-300 font-semibold"
                      >
                        <History className="w-3.5 h-3.5" />
                        <span>{showVersionHistory ? 'Show Post Workspace' : 'View Version History'}</span>
                      </button>
                    </div>
                  </div>
                  
                  {/* Approval State steps visualizer */}
                  <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800/30 p-4 rounded-xl border border-[var(--border)]">
                    {selectedPost.timeline.map((step, idx) => (
                      <React.Fragment key={idx}>
                        {idx > 0 && <ChevronRight className="w-4 h-4 text-gray-400" />}
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 text-xs flex items-center justify-center font-bold">{idx + 1}</span>
                          <div>
                            <div className="text-xs font-semibold">{step.status}</div>
                            <div className="text-[9px] text-gray-400">{step.timestamp}</div>
                          </div>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>

                  {showVersionHistory ? (
                    /* Content Version History comparison pane */
                    <div className="bg-[var(--card)] p-6 rounded-2xl border border-[var(--border)] shadow-sm space-y-4">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Post Version Control Directory</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {selectedPost.versions.map((ver) => (
                          <div key={ver.version} className="p-4 bg-gray-50 dark:bg-gray-800/20 border border-[var(--border)] rounded-xl space-y-3">
                            <div className="flex justify-between items-center border-b border-[var(--border)] pb-2">
                              <span className="text-xs font-bold text-indigo-600">Version {ver.version}</span>
                              <span className="text-[10px] text-gray-400">{ver.timestamp} by {ver.changedBy}</span>
                            </div>
                            <img src={ver.mediaUrl} className="w-full h-40 object-cover rounded-lg" />
                            <p className="text-xs text-gray-600 dark:text-gray-400">{ver.caption}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* Standard post detail view */
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      
                      {/* Left visual mock-up preview */}
                      <div className="lg:col-span-2 bg-[var(--card)] p-6 rounded-2xl border border-[var(--border)] shadow-sm space-y-4">
                        <div className="border border-[var(--border)] rounded-xl overflow-hidden max-w-sm mx-auto shadow-sm bg-white dark:bg-gray-900">
                          <div className="p-3 flex items-center gap-3 border-b border-[var(--border)]">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-semibold text-xs text-indigo-600">ND</div>
                            <span className="text-xs font-bold text-gray-900 dark:text-gray-100">{selectedPost.clientName}</span>
                            <span className="text-[10px] bg-indigo-50 dark:bg-indigo-950 text-indigo-600 px-2 py-0.5 rounded-full font-bold ml-auto">{selectedPost.platform}</span>
                          </div>
                          
                          <img src={editMediaUrl} className="w-full h-64 object-cover" />
                          
                          <div className="p-3 text-xs text-gray-700 dark:text-gray-300 space-y-2">
                            {isInlineEditingPost ? (
                              <div className="space-y-2 pt-2">
                                <label className="block text-[10px] font-bold text-gray-400">Inline Media URL Editor</label>
                                <input 
                                  type="text" 
                                  value={editMediaUrl} 
                                  onChange={(e) => setEditMediaUrl(e.target.value)} 
                                  className="w-full bg-gray-50 dark:bg-gray-800 text-xs p-2 rounded-lg border border-[var(--border)] outline-none"
                                />
                                <label className="block text-[10px] font-bold text-gray-400">Inline Caption Editor</label>
                                <textarea 
                                  value={editCaption} 
                                  onChange={(e) => setEditCaption(e.target.value)} 
                                  rows={3}
                                  className="w-full bg-gray-50 dark:bg-gray-800 text-xs p-2 rounded-lg border border-[var(--border)] outline-none"
                                />
                                <button 
                                  onClick={() => handleSavePostEdit(selectedPost.id)}
                                  className="flex items-center gap-1 py-1.5 px-3 bg-indigo-600 text-white rounded-lg text-[10px] font-bold shadow-sm"
                                >
                                  <Save className="w-3 h-3" /> Save Changes
                                </button>
                              </div>
                            ) : (
                              <p>{selectedPost.caption}</p>
                            )}
                          </div>
                        </div>

                        {/* Editor inputs for saving new version */}
                        {activeRole === 'employee' && !isInlineEditingPost && (
                          <div className="pt-4 border-t border-[var(--border)] space-y-3">
                            <h4 className="font-bold text-xs">Upload Revision / Create Version</h4>
                            <input 
                              type="text" 
                              value={editMediaUrl} 
                              onChange={(e) => setEditMediaUrl(e.target.value)} 
                              placeholder="Revised Media URL" 
                              className="w-full bg-gray-50 dark:bg-gray-800 text-xs p-2.5 rounded-lg border border-[var(--border)] outline-none"
                            />
                            <textarea 
                              value={editCaption} 
                              onChange={(e) => setEditCaption(e.target.value)} 
                              placeholder="Revised Caption" 
                              rows={2}
                              className="w-full bg-gray-50 dark:bg-gray-800 text-xs p-2.5 rounded-lg border border-[var(--border)] outline-none"
                            />
                            <button 
                              onClick={() => handleSaveNewVersion(selectedPost.id)}
                              className="py-1.5 px-3 bg-indigo-600 text-white rounded-lg text-xs font-semibold"
                            >
                              Save as New Version
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Right workflow actions and discussion */}
                      <div className="space-y-6">
                        <div className="bg-[var(--card)] p-6 rounded-2xl border border-[var(--border)] shadow-sm space-y-4">
                          <h4 className="font-bold text-gray-900 dark:text-gray-100">Workflow Operations</h4>
                          <div className="text-xs space-y-2 text-gray-600 dark:text-gray-400">
                            <div><strong>Campaign Post:</strong> {selectedPost.title}</div>
                            <div><strong>Creator:</strong> {selectedPost.employeeName}</div>
                            <div><strong>Scheduled Publish:</strong> {selectedPost.scheduleDate}</div>
                            <div><strong>Status:</strong> <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${getStatusBadge(selectedPost.status)}`}>{selectedPost.status}</span></div>
                          </div>

                          <div className="flex gap-2 pt-2 border-t border-[var(--border)]">
                            {activeRole === 'client' && selectedPost.status === 'Client Reviewing' ? (
                              <>
                                <button 
                                  onClick={() => {
                                    updatePostStatus(selectedPost.id, 'Approved');
                                    setSelectedPost(null);
                                  }}
                                  className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5"
                                >
                                  <Check className="w-3.5 h-3.5" /> Approve
                                </button>
                                <button 
                                  onClick={() => {
                                    updatePostStatus(selectedPost.id, 'Needs Changes');
                                    setSelectedPost(null);
                                  }}
                                  className="flex-1 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5"
                                >
                                  <X className="w-3.5 h-3.5" /> Request Changes
                                </button>
                              </>
                            ) : (
                              selectedPost.status === 'Internal Review' && activeRole !== 'client' && (
                                <button 
                                  onClick={() => {
                                    updatePostStatus(selectedPost.id, 'Client Reviewing');
                                    setSelectedPost(null);
                                  }}
                                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5"
                                >
                                  <Send className="w-3.5 h-3.5" /> Send to Client Review
                                </button>
                              )
                            )}
                          </div>
                        </div>

                        {/* Comments Thread */}
                        <div className="bg-[var(--card)] p-6 rounded-2xl border border-[var(--border)] shadow-sm space-y-4">
                          <h4 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" /> Discussion Thread
                          </h4>
                          <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                            {selectedPost.comments.map((comment) => (
                              <div key={comment.id} className="flex gap-2 text-xs">
                                <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center font-bold text-[10px] text-indigo-600 flex-shrink-0">
                                  {comment.author[0]}
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-800/40 p-2.5 rounded-xl flex-1 border border-[var(--border)]">
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="font-bold text-gray-900 dark:text-gray-100">{comment.author}</span>
                                    <span className="text-[9px] text-gray-400">{comment.time}</span>
                                  </div>
                                  <p className="text-gray-600 dark:text-gray-400">{comment.text}</p>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              value={newCommentText}
                              onChange={(e) => setNewCommentText(e.target.value)}
                              placeholder="Add reply..." 
                              className="flex-1 bg-gray-50 dark:bg-gray-800 text-xs px-3 py-1.5 rounded-lg border border-[var(--border)] outline-none"
                            />
                            <button 
                              onClick={() => handleAddComment(selectedPost.id)}
                              className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs"
                            >
                              Send
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Kanban board list columns
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6">Workflow Campaign Board</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Internal Review */}
                    <div className="bg-gray-50 dark:bg-gray-900/40 p-4 rounded-2xl border border-[var(--border)] space-y-4">
                      <div className="flex justify-between items-center border-b border-[var(--border)] pb-2">
                        <span className="text-xs font-bold text-gray-600 dark:text-gray-400">Internal Review</span>
                        <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">
                          {posts.filter(p => p.status === 'Internal Review').length}
                        </span>
                      </div>
                      <div className="space-y-3">
                        {posts.filter(p => p.status === 'Internal Review').map(post => (
                          <div key={post.id} onClick={() => setSelectedPost(post)} className="bg-[var(--card)] p-4 rounded-xl border border-[var(--border)] shadow-sm cursor-pointer hover:border-indigo-500 hover:shadow-md transition-all">
                            <h4 className="font-bold text-xs text-gray-900 dark:text-gray-100 mb-1">{post.title}</h4>
                            <p className="text-[10px] text-gray-500 truncate mb-2">{post.caption}</p>
                            <span className="text-[9px] bg-indigo-50 dark:bg-indigo-950 text-indigo-600 px-2 py-0.5 rounded-full font-semibold">{post.platform}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Client Reviewing */}
                    <div className="bg-gray-50 dark:bg-gray-900/40 p-4 rounded-2xl border border-[var(--border)] space-y-4">
                      <div className="flex justify-between items-center border-b border-[var(--border)] pb-2">
                        <span className="text-xs font-bold text-gray-600 dark:text-gray-400">Client Reviewing</span>
                        <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold">
                          {posts.filter(p => p.status === 'Client Reviewing' || p.status === 'Needs Changes').length}
                        </span>
                      </div>
                      <div className="space-y-3">
                        {posts.filter(p => p.status === 'Client Reviewing' || p.status === 'Needs Changes').map(post => (
                          <div key={post.id} onClick={() => setSelectedPost(post)} className="bg-[var(--card)] p-4 rounded-xl border border-[var(--border)] shadow-sm cursor-pointer hover:border-indigo-500 hover:shadow-md transition-all">
                            <h4 className="font-bold text-xs text-gray-900 dark:text-gray-100 mb-1">{post.title}</h4>
                            <p className="text-[10px] text-gray-500 truncate mb-2">{post.caption}</p>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-[9px] bg-indigo-50 dark:bg-indigo-950 text-indigo-600 px-2 py-0.5 rounded-full font-semibold">{post.platform}</span>
                              <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${getStatusBadge(post.status)}`}>{post.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Approved / Scheduled */}
                    <div className="bg-gray-50 dark:bg-gray-900/40 p-4 rounded-2xl border border-[var(--border)] space-y-4">
                      <div className="flex justify-between items-center border-b border-[var(--border)] pb-2">
                        <span className="text-xs font-bold text-gray-600 dark:text-gray-400">Client Approved</span>
                        <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">
                          {posts.filter(p => p.status === 'Approved').length}
                        </span>
                      </div>
                      <div className="space-y-3">
                        {posts.filter(p => p.status === 'Approved').map(post => (
                          <div key={post.id} onClick={() => setSelectedPost(post)} className="bg-[var(--card)] p-4 rounded-xl border border-[var(--border)] shadow-sm cursor-pointer hover:border-indigo-500 hover:shadow-md transition-all">
                            <h4 className="font-bold text-xs text-gray-900 dark:text-gray-100 mb-1">{post.title}</h4>
                            <p className="text-[10px] text-gray-500 truncate mb-2">{post.caption}</p>
                            <span className="text-[9px] bg-indigo-50 dark:bg-indigo-950 text-indigo-600 px-2 py-0.5 rounded-full font-semibold">{post.platform}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {currentView === 'settings' && (
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 space-y-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <SettingsIcon className="w-5 h-5 text-indigo-600 animate-spin-slow" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 font-title">Workspace Configuration Settings</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div className="space-y-3">
                  <div>
                    <label className="block text-gray-500 font-semibold mb-1">Agency Brand Title</label>
                    <input 
                      type="text" 
                      value={agencyNameInput} 
                      onChange={(e) => setAgencyNameInput(e.target.value)} 
                      className="w-full bg-gray-50 dark:bg-gray-800 border border-[var(--border)] p-2.5 rounded-xl outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-gray-500 font-semibold mb-1">Timezone Location</label>
                    <select 
                      value={timezoneInput} 
                      onChange={(e) => setTimezoneInput(e.target.value)} 
                      className="w-full bg-gray-50 dark:bg-gray-800 border border-[var(--border)] p-2.5 rounded-xl outline-none"
                    >
                      <option>UTC-5 (EST)</option>
                      <option>UTC+0 (GMT)</option>
                      <option>UTC+5:30 (IST)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-500 font-semibold mb-1">AI Brand Tone Strategy</label>
                    <select 
                      value={brandToneInput} 
                      onChange={(e) => setBrandToneInput(e.target.value as any)} 
                      className="w-full bg-gray-50 dark:bg-gray-800 border border-[var(--border)] p-2.5 rounded-xl outline-none"
                    >
                      <option>Professional</option>
                      <option>Casual</option>
                      <option>Creative</option>
                      <option>Bold</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800/20 border border-[var(--border)] rounded-xl">
                    <div>
                      <strong className="block text-[11px]">Instant Slack Notification</strong>
                      <span className="text-[10px] text-gray-400">Ping channel on client actions</span>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={slackNotifyInput} 
                      onChange={(e) => setSlackNotifyInput(e.target.checked)} 
                      className="w-4 h-4 text-indigo-600 border-[var(--border)] rounded focus:ring-indigo-500" 
                    />
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800/20 border border-[var(--border)] rounded-xl">
                    <div>
                      <strong className="block text-[11px]">Enforce Two-Factor Auth (2FA)</strong>
                      <span className="text-[10px] text-gray-400">Require OTP code for employees</span>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={twoFactorInput} 
                      onChange={(e) => setTwoFactorInput(e.target.checked)} 
                      className="w-4 h-4 text-indigo-600 border-[var(--border)] rounded focus:ring-indigo-500" 
                    />
                  </div>

                  <div>
                    <label className="block text-gray-500 font-semibold mb-1">Onboard Welcome Mail Template</label>
                    <textarea 
                      value={emailTemplateInput} 
                      onChange={(e) => setEmailTemplateInput(e.target.value)} 
                      rows={3} 
                      className="w-full bg-gray-50 dark:bg-gray-800 border border-[var(--border)] p-2.5 rounded-xl outline-none text-xs" 
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--border)] flex justify-end">
                <button 
                  onClick={handleSaveSettings}
                  className="py-2.5 px-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm"
                >
                  Save Settings Changes
                </button>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* CREATE POST MODAL */}
      {showCreatePostModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
          <form onSubmit={handleCreatePost} className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 w-[450px] space-y-4 shadow-xl">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-gray-900 dark:text-gray-100">Create Campaign Post</h3>
              <button type="button" onClick={() => setShowCreatePostModal(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md text-gray-400"><X className="w-4 h-4" /></button>
            </div>
            
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-500 font-semibold mb-1">Post Title</label>
                <input required type="text" value={postTitle} onChange={(e) => setPostTitle(e.target.value)} placeholder="e.g. Nike Air Max Launch" className="w-full bg-gray-50 dark:bg-gray-800 border border-[var(--border)] p-2.5 rounded-xl outline-none" />
              </div>
              <div>
                <label className="block text-gray-500 font-semibold mb-1">Client Brand</label>
                <select value={postClient} onChange={(e) => setPostClient(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-800 border border-[var(--border)] p-2.5 rounded-xl outline-none">
                  {clients.map(c => <option key={c.id} value={c.companyName}>{c.companyName}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-gray-500 font-semibold mb-1">Social Platform</label>
                <select value={postPlatform} onChange={(e) => setPostPlatform(e.target.value as any)} className="w-full bg-gray-50 dark:bg-gray-800 border border-[var(--border)] p-2.5 rounded-xl outline-none">
                  <option>Instagram</option>
                  <option>LinkedIn</option>
                  <option>Facebook</option>
                  <option>Twitter</option>
                </select>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-gray-500 font-semibold">Post Caption</label>
                  <button type="button" onClick={handleAICaption} className="text-indigo-600 flex items-center gap-1 font-bold text-[10px]"><Sparkles className="w-3 h-3" /> AI Write</button>
                </div>
                <textarea required rows={3} value={postCaption} onChange={(e) => setPostCaption(e.target.value)} placeholder="Enter post caption..." className="w-full bg-gray-50 dark:bg-gray-800 border border-[var(--border)] p-2.5 rounded-xl outline-none" />
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-[var(--border)]">
              <button type="button" onClick={() => setShowCreatePostModal(false)} className="flex-1 py-2 border border-[var(--border)] text-gray-700 dark:text-gray-300 rounded-lg text-xs font-semibold">Cancel</button>
              <button type="submit" className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold">Submit Draft</button>
            </div>
          </form>
        </div>
      )}

      {/* CLIENT ONBOARDING / EDITING MODAL */}
      {(showClientModal || editingClient) && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
          <form onSubmit={editingClient ? handleSaveClientEdit : handleOnboardClient} className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 w-[400px] space-y-4 shadow-xl">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-gray-900 dark:text-gray-100">{editingClient ? 'Edit Client Record' : 'Onboard New Client Portfolios'}</h3>
              <button type="button" onClick={() => { setShowClientModal(false); setEditingClient(null); }} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md text-gray-400"><X className="w-4 h-4" /></button>
            </div>
            
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-500 font-semibold mb-1">Client Name</label>
                <input required type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="e.g. John Doe" className="w-full bg-gray-50 dark:bg-gray-800 border border-[var(--border)] p-2.5 rounded-xl outline-none" />
              </div>
              <div>
                <label className="block text-gray-500 font-semibold mb-1">Company / Brand Name</label>
                <input required type="text" value={clientCompany} onChange={(e) => setClientCompany(e.target.value)} placeholder="e.g. Nike Pro" className="w-full bg-gray-50 dark:bg-gray-800 border border-[var(--border)] p-2.5 rounded-xl outline-none" />
              </div>
              <div>
                <label className="block text-gray-500 font-semibold mb-1">Contact Email Address</label>
                <input required type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} placeholder="john@nike.com" className="w-full bg-gray-50 dark:bg-gray-800 border border-[var(--border)] p-2.5 rounded-xl outline-none" />
              </div>
              <div>
                <label className="block text-gray-500 font-semibold mb-1">Phone Number</label>
                <input type="text" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} placeholder="+1 (555) 0122" className="w-full bg-gray-50 dark:bg-gray-800 border border-[var(--border)] p-2.5 rounded-xl outline-none" />
              </div>
              <div>
                <label className="block text-gray-500 font-semibold mb-1">Website URL</label>
                <input type="text" value={clientWebsite} onChange={(e) => setClientWebsite(e.target.value)} placeholder="nike.com" className="w-full bg-gray-50 dark:bg-gray-800 border border-[var(--border)] p-2.5 rounded-xl outline-none" />
              </div>
              <div>
                <label className="block text-gray-500 font-semibold mb-1">Brand Strategy Notes</label>
                <textarea value={clientNotes} onChange={(e) => setClientNotes(e.target.value)} placeholder="Campaign priorities..." rows={2} className="w-full bg-gray-50 dark:bg-gray-800 border border-[var(--border)] p-2.5 rounded-xl outline-none" />
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-[var(--border)]">
              <button type="button" onClick={() => { setShowClientModal(false); setEditingClient(null); }} className="flex-1 py-2 border border-[var(--border)] text-gray-700 dark:text-gray-300 rounded-lg text-xs font-semibold">Cancel</button>
              <button type="submit" className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold">{editingClient ? 'Save Changes' : 'Onboard & Mail Creds'}</button>
            </div>
          </form>
        </div>
      )}

      {/* EMPLOYEE ONBOARDING / EDITING MODAL */}
      {(showEmployeeModal || editingEmployee) && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
          <form onSubmit={editingEmployee ? handleSaveEmployeeEdit : handleAddEmployee} className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 w-[400px] space-y-4 shadow-xl">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-gray-900 dark:text-gray-100">{editingEmployee ? 'Edit Employee Info' : 'Add New Team Member'}</h3>
              <button type="button" onClick={() => { setShowEmployeeModal(false); setEditingEmployee(null); }} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md text-gray-400"><X className="w-4 h-4" /></button>
            </div>
            
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-500 font-semibold mb-1">Full Name</label>
                <input required type="text" value={empName} onChange={(e) => setEmpName(e.target.value)} placeholder="e.g. Elena Rostova" className="w-full bg-gray-50 dark:bg-gray-800 border border-[var(--border)] p-2.5 rounded-xl outline-none" />
              </div>
              <div>
                <label className="block text-gray-500 font-semibold mb-1">Email Address</label>
                <input required type="email" value={empEmail} onChange={(e) => setEmpEmail(e.target.value)} placeholder="elena@omniflow.io" className="w-full bg-gray-50 dark:bg-gray-800 border border-[var(--border)] p-2.5 rounded-xl outline-none" />
              </div>
              <div>
                <label className="block text-gray-500 font-semibold mb-1">Job Role</label>
                <input required type="text" value={empRole} onChange={(e) => setEmpRole(e.target.value)} placeholder="e.g. Strategist" className="w-full bg-gray-50 dark:bg-gray-800 border border-[var(--border)] p-2.5 rounded-xl outline-none" />
              </div>
              <div>
                <label className="block text-gray-500 font-semibold mb-1">Department</label>
                <input required type="text" value={empDept} onChange={(e) => setEmpDept(e.target.value)} placeholder="e.g. Content Design" className="w-full bg-gray-50 dark:bg-gray-800 border border-[var(--border)] p-2.5 rounded-xl outline-none" />
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-[var(--border)]">
              <button type="button" onClick={() => { setShowEmployeeModal(false); setEditingEmployee(null); }} className="flex-1 py-2 border border-[var(--border)] text-gray-700 dark:text-gray-300 rounded-lg text-xs font-semibold">Cancel</button>
              <button type="submit" className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold">{editingEmployee ? 'Save Changes' : 'Invite User'}</button>
            </div>
          </form>
        </div>
      )}

      {/* ROLE SWITCHER FLOATING BAR */}
      <div className="fixed bottom-6 right-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-[var(--border)] p-1.5 rounded-2xl shadow-xl flex gap-1.5 z-50">
        <button 
          onClick={() => setRole('super_admin')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${activeRole === 'super_admin' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
        >
          Admin
        </button>
        <button 
          onClick={() => setRole('employee')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${activeRole === 'employee' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
        >
          Employee
        </button>
        <button 
          onClick={() => setRole('client')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${activeRole === 'client' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
        >
          Client
        </button>
      </div>

    </div>
  );
}
