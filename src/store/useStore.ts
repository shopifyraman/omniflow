import { create } from 'zustand';

export type Role = 'super_admin' | 'admin' | 'employee' | 'client';

export interface Client {
  id: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  brandName: string;
  website: string;
  socialLinks: { instagram?: string; facebook?: string; linkedin?: string; twitter?: string; youtube?: string };
  address: string;
  notes: string;
  assignedEmployee: string;
  status: 'Active' | 'Suspended' | 'Archived';
  logo: string;
  projectsCount: number;
  joinedDate: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  assignedClients: string[];
  completedPosts: number;
  pendingPosts: number;
  performance: number;
  avatar?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  clientName: string;
  teamMembers: string[];
  campaignType: 'Brand Awareness' | 'Product Launch' | 'Lead Generation' | 'Seasonal Promotion' | 'Rebranding';
  startDate: string;
  endDate: string;
  status: 'Planning' | 'In Progress' | 'In Review' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
  filesCount: number;
  tasksCount: number;
  completedTasks: number;
  approvalProgress: number; // percentage
}

export interface PostVersion {
  version: number;
  mediaUrl: string;
  mediaType: 'image' | 'video' | 'pdf';
  caption: string;
  hashtags: string;
  mentions: string;
  changedBy: string;
  timestamp: string;
  changesSummary: string;
}

export interface TimelineStep {
  status: string;
  timestamp: string;
  user: string;
  notes?: string;
}

export interface CommentReaction {
  emoji: string;
  count: number;
  users: string[];
}

export interface Comment {
  id: string;
  author: string;
  role: string;
  avatar?: string;
  text: string;
  time: string;
  resolved: boolean;
  isPinned?: boolean;
  parentId?: string;
  reactions: CommentReaction[];
  attachmentUrl?: string;
  attachmentName?: string;
}

export type WorkflowStage = 
  | 'Idea' 
  | 'Draft' 
  | 'Design' 
  | 'Internal Review' 
  | 'Approved by Admin' 
  | 'Sent to Client' 
  | 'Client Review' 
  | 'Needs Changes' 
  | 'Resubmitted' 
  | 'Approved' 
  | 'Rejected'
  | 'Scheduled' 
  | 'Published' 
  | 'Archived';

export interface Post {
  id: string;
  title: string;
  caption: string;
  platform: 'Instagram' | 'Facebook' | 'LinkedIn' | 'Twitter' | 'YouTube';
  mediaUrl: string;
  mediaType: 'image' | 'video' | 'pdf';
  hashtags: string;
  mentions: string;
  scheduleDate: string;
  priority: 'Low' | 'Medium' | 'High';
  status: WorkflowStage;
  clientName: string;
  employeeName: string;
  projectName?: string;
  comments: Comment[];
  versions: PostVersion[];
  timeline: TimelineStep[];
}

export interface Task {
  id: string;
  title: string;
  assignee: string;
  clientName: string;
  dueDate: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Todo' | 'In Progress' | 'Review' | 'Done';
  progress: number;
  checklist: { id: string; text: string; completed: boolean }[];
  timeTrackedMinutes: number;
  isTimerRunning?: boolean;
}

export interface MediaItem {
  id: string;
  name: string;
  type: 'image' | 'video' | 'pdf' | 'logo' | 'font' | 'template';
  url: string;
  size: string;
  folder: 'General' | 'Logos & Branding' | 'Campaign Assets' | 'Templates' | 'Documents';
  tags: string[];
  uploadedBy: string;
  uploadedAt: string;
  clientName: string;
}

export interface Activity {
  id: string;
  user: string;
  userRole: string;
  action: string;
  target: string;
  time: string;
  ipAddress?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'approval' | 'comment' | 'task' | 'system' | 'mention';
  time: string;
  read: boolean;
  link?: string;
}

export interface Integration {
  id: string;
  name: string;
  category: 'Auth' | 'Storage' | 'Communication' | 'Social Media';
  icon: string;
  description: string;
  status: 'Connected' | 'Disconnected' | 'Syncing';
  connectedBy?: string;
  lastSync?: string;
}

export interface AppSettings {
  agencyName: string;
  timezone: string;
  aiBrandTone: 'Professional' | 'Casual' | 'Creative' | 'Bold';
  slackNotifications: boolean;
  twoFactorAuth: boolean;
  emailTemplates: string;
  autoSessionTimeoutMinutes: number;
  dailyBackup: boolean;
  darkTheme: boolean;
}

interface AppState {
  activeRole: Role;
  activeUser: { name: string; email: string; avatar: string; department: string };
  clients: Client[];
  employees: Employee[];
  projects: Project[];
  posts: Post[];
  tasks: Task[];
  mediaItems: MediaItem[];
  notifications: NotificationItem[];
  activities: Activity[];
  integrations: Integration[];
  settings: AppSettings;
  theme: 'light' | 'dark';
  
  // Auth & Security state
  isAuthenticated: boolean;
  userEmail: string;
  loginHistory: { id: string; date: string; device: string; ip: string; status: string }[];
  activeSessions: { id: string; device: string; location: string; lastActive: string; current: boolean }[];
  
  // Actions
  setRole: (role: Role) => void;
  toggleTheme: () => void;
  login: (email: string) => void;
  logout: () => void;
  
  // Client CRUD
  addClient: (client: Omit<Client, 'id' | 'projectsCount' | 'joinedDate'>) => void;
  updateClient: (clientId: string, client: Partial<Client>) => void;
  updateClientStatus: (clientId: string, status: Client['status']) => void;
  
  // Employee CRUD
  addEmployee: (emp: Omit<Employee, 'id' | 'completedPosts' | 'pendingPosts' | 'performance'>) => void;
  updateEmployee: (empId: string, emp: Partial<Employee>) => void;
  
  // Project CRUD
  addProject: (proj: Omit<Project, 'id' | 'filesCount' | 'tasksCount' | 'completedTasks' | 'approvalProgress'>) => void;
  updateProject: (projId: string, proj: Partial<Project>) => void;
  
  // Post & Workflow Actions
  addPost: (post: Omit<Post, 'id' | 'comments' | 'versions' | 'timeline'>) => void;
  updatePost: (postId: string, post: Partial<Post>) => void;
  updatePostStatus: (postId: string, status: WorkflowStage, notes?: string) => void;
  createNewVersion: (postId: string, mediaUrl: string, caption: string, changesSummary?: string) => void;
  restoreVersion: (postId: string, versionNumber: number) => void;
  
  // Comment Actions
  addComment: (postId: string, comment: { text: string; parentId?: string; attachmentUrl?: string; attachmentName?: string }) => void;
  toggleCommentReaction: (postId: string, commentId: string, emoji: string) => void;
  toggleResolveComment: (postId: string, commentId: string) => void;
  togglePinComment: (postId: string, commentId: string) => void;
  
  // Task Actions
  addTask: (task: Omit<Task, 'id' | 'progress' | 'timeTrackedMinutes' | 'checklist'>) => void;
  updateTaskStatus: (taskId: string, status: Task['status']) => void;
  toggleTaskChecklist: (taskId: string, checklistId: string) => void;
  toggleTaskTimer: (taskId: string) => void;
  
  // Media Actions
  addMediaItem: (item: Omit<MediaItem, 'id' | 'uploadedBy' | 'uploadedAt'>) => void;
  deleteMediaItem: (id: string) => void;
  
  // Notifications & Integrations & Settings
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  toggleIntegration: (id: string) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
}

export const useStore = create<AppState>((set, get) => ({
  activeRole: 'super_admin',
  activeUser: { name: 'Sarah Jenkins', email: 'sarah@omniflow.io', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&fit=crop&q=80', department: 'Executive Management' },
  theme: 'light',
  isAuthenticated: true,
  userEmail: 'sarah@omniflow.io',

  loginHistory: [
    { id: 'lh1', date: '2026-08-02 22:45', device: 'Chrome on Windows 11', ip: '192.168.1.105', status: 'Success (OAuth Google)' },
    { id: 'lh2', date: '2026-08-01 14:12', device: 'Safari on macOS Sequoia', ip: '172.56.21.90', status: 'Success (Email/Password)' },
    { id: 'lh3', date: '2026-07-30 09:20', device: 'OmniFlow Mobile (iOS)', ip: '107.12.89.4', status: 'Success (2FA verified)' }
  ],

  activeSessions: [
    { id: 's1', device: 'Chrome 127 (Windows 11)', location: 'San Francisco, CA', lastActive: 'Active Now', current: true },
    { id: 's2', device: 'Safari (iPhone 15 Pro)', location: 'San Francisco, CA', lastActive: '2 hours ago', current: false }
  ],

  settings: {
    agencyName: 'OmniFlow Global Media',
    timezone: 'America/Los_Angeles (PST)',
    aiBrandTone: 'Creative',
    slackNotifications: true,
    twoFactorAuth: true,
    emailTemplates: 'Hello {{client_name}}, a new social media post is waiting for your review on OmniFlow.',
    autoSessionTimeoutMinutes: 30,
    dailyBackup: true,
    darkTheme: false
  },

  clients: [
    {
      id: 'c1',
      name: 'John Doe',
      companyName: 'Nike Digital',
      email: 'john@nike.com',
      phone: '+1 (555) 0122',
      brandName: 'Nike',
      website: 'nike.com',
      socialLinks: { instagram: '@nike', twitter: '@Nike', linkedin: 'company/nike' },
      address: 'One Bowerman Dr, Beaverton, OR',
      notes: 'Focus on Air Max launch campaign and sustainable footwear messaging.',
      assignedEmployee: 'Alex Rivera',
      status: 'Active',
      logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=120&fit=crop&q=80',
      projectsCount: 3,
      joinedDate: '2026-01-15'
    },
    {
      id: 'c2',
      name: 'Clara Oswald',
      companyName: 'Starbucks Rewards',
      email: 'clara@starbucks.com',
      phone: '+1 (555) 0988',
      brandName: 'Starbucks',
      website: 'starbucks.com',
      socialLinks: { instagram: '@starbucks', facebook: 'facebook.com/starbucks' },
      address: '2401 Utah Ave S, Seattle, WA',
      notes: 'Promote summer chillers and mobile order app downloads.',
      assignedEmployee: 'Alex Rivera',
      status: 'Active',
      logo: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=120&fit=crop&q=80',
      projectsCount: 2,
      joinedDate: '2026-03-10'
    },
    {
      id: 'c3',
      name: 'Marcus Vance',
      companyName: 'Tesla Energy',
      email: 'marcus@tesla.com',
      phone: '+1 (555) 8877',
      brandName: 'Tesla',
      website: 'tesla.com',
      socialLinks: { twitter: '@Tesla', youtube: 'youtube.com/tesla' },
      address: '1 Tesla Road, Austin, TX',
      notes: 'Solar Roof and Powerwall consumer campaigns.',
      assignedEmployee: 'Jessica Chen',
      status: 'Active',
      logo: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=120&fit=crop&q=80',
      projectsCount: 4,
      joinedDate: '2026-02-01'
    }
  ],

  employees: [
    {
      id: 'e1',
      name: 'Alex Rivera',
      email: 'alex@omniflow.io',
      phone: '+1 (555) 3322',
      role: 'Senior Content Strategist',
      department: 'Content & Social',
      assignedClients: ['Nike Digital', 'Starbucks Rewards'],
      completedPosts: 42,
      pendingPosts: 6,
      performance: 96,
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&fit=crop&q=80'
    },
    {
      id: 'e2',
      name: 'Jessica Chen',
      email: 'jessica@omniflow.io',
      phone: '+1 (555) 4411',
      role: 'Creative Motion Designer',
      department: 'Creative Studio',
      assignedClients: ['Tesla Energy'],
      completedPosts: 28,
      pendingPosts: 3,
      performance: 92,
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&fit=crop&q=80'
    },
    {
      id: 'e3',
      name: 'David Kalu',
      email: 'david@omniflow.io',
      phone: '+1 (555) 9900',
      role: 'Community Manager',
      department: 'Operations',
      assignedClients: ['Nike Digital'],
      completedPosts: 35,
      pendingPosts: 4,
      performance: 94,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&fit=crop&q=80'
    }
  ],

  projects: [
    {
      id: 'proj-1',
      name: 'Air Max 2026 Global Launch',
      description: 'Multi-platform launch campaign for Nike Air Max 2026 featuring interactive Reels and influencer takeovers.',
      clientName: 'Nike Digital',
      teamMembers: ['Alex Rivera', 'Jessica Chen', 'David Kalu'],
      campaignType: 'Product Launch',
      startDate: '2026-07-01',
      endDate: '2026-08-31',
      status: 'In Progress',
      priority: 'High',
      filesCount: 18,
      tasksCount: 12,
      completedTasks: 8,
      approvalProgress: 75
    },
    {
      id: 'proj-2',
      name: 'Summer Chiller Series',
      description: 'Highlighting cold drinks and rewards bonus point drops on Instagram and TikTok.',
      clientName: 'Starbucks Rewards',
      teamMembers: ['Alex Rivera'],
      campaignType: 'Seasonal Promotion',
      startDate: '2026-06-15',
      endDate: '2026-09-01',
      status: 'In Progress',
      priority: 'Medium',
      filesCount: 14,
      tasksCount: 8,
      completedTasks: 5,
      approvalProgress: 60
    },
    {
      id: 'proj-3',
      name: 'Powerwall Home Energy Revolution',
      description: 'Educational LinkedIn carousel ads and YouTube video series.',
      clientName: 'Tesla Energy',
      teamMembers: ['Jessica Chen'],
      campaignType: 'Lead Generation',
      startDate: '2026-08-01',
      endDate: '2026-10-15',
      status: 'Planning',
      priority: 'High',
      filesCount: 6,
      tasksCount: 10,
      completedTasks: 2,
      approvalProgress: 20
    }
  ],

  posts: [
    {
      id: 'p1',
      title: 'Run with the Air: Nike Max 2026',
      caption: 'The future of running has landed. Experience responsive cushioning made from 40% recycled materials. Engineered for speed and maximum vertical energy return. 🏃‍♂️✨',
      platform: 'Instagram',
      mediaUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&fit=crop&q=80',
      mediaType: 'image',
      hashtags: '#NikeAirMax #JustDoIt #RunningGear #Sneakerhead',
      mentions: '@nike @niketraining',
      scheduleDate: '2026-08-05',
      priority: 'High',
      status: 'Client Review',
      clientName: 'Nike Digital',
      employeeName: 'Alex Rivera',
      projectName: 'Air Max 2026 Global Launch',
      comments: [
        { 
          id: 'c1', 
          author: 'Alex Rivera', 
          role: 'employee', 
          avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&fit=crop&q=80',
          text: 'Hey John, here is the updated hero visual with the vibrant neon gradient overlay.', 
          time: '2 hours ago', 
          resolved: false,
          isPinned: true,
          reactions: [{ emoji: '👍', count: 2, users: ['John Doe', 'Sarah Jenkins'] }] 
        },
        { 
          id: 'c2', 
          author: 'John Doe', 
          role: 'client', 
          avatar: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&fit=crop&q=80',
          text: 'Love the color intensity! Could we also double-check if the link in bio sticker is tagged correctly?', 
          time: '45 mins ago', 
          resolved: false,
          reactions: [{ emoji: '❤️', count: 1, users: ['Alex Rivera'] }] 
        }
      ],
      versions: [
        { 
          version: 1, 
          mediaUrl: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&fit=crop&q=80', 
          mediaType: 'image',
          caption: 'Nike Air Max 2026 - first initial draft render.', 
          hashtags: '#NikeAirMax', 
          mentions: '@nike', 
          changedBy: 'Alex Rivera', 
          timestamp: 'Yesterday at 14:20',
          changesSummary: 'Initial post creation with basic copy'
        },
        { 
          version: 2, 
          mediaUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&fit=crop&q=80', 
          mediaType: 'image',
          caption: 'The future of running has landed. Experience responsive cushioning made from 40% recycled materials. Engineered for speed and maximum vertical energy return. 🏃‍♂️✨', 
          hashtags: '#NikeAirMax #JustDoIt #RunningGear #Sneakerhead', 
          mentions: '@nike @niketraining', 
          changedBy: 'Alex Rivera', 
          timestamp: 'Today at 10:15',
          changesSummary: 'Updated high-res studio shot, refined copy and added trending hashtags'
        }
      ],
      timeline: [
        { status: 'Idea', timestamp: '2026-07-29 09:00', user: 'Alex Rivera', notes: 'Conceived concept during creative session' },
        { status: 'Draft', timestamp: '2026-07-30 11:30', user: 'Alex Rivera', notes: 'Created copy and caption' },
        { status: 'Design', timestamp: '2026-07-31 16:00', user: 'Jessica Chen', notes: 'Rendered hero image asset' },
        { status: 'Internal Review', timestamp: '2026-08-01 10:00', user: 'Alex Rivera', notes: 'Passed internal agency checklist' },
        { status: 'Approved by Admin', timestamp: '2026-08-01 14:00', user: 'Sarah Jenkins', notes: 'Approved by Agency Manager' },
        { status: 'Sent to Client', timestamp: '2026-08-01 15:30', user: 'Alex Rivera', notes: 'Notification emailed to John Doe' },
        { status: 'Client Review', timestamp: '2026-08-02 09:00', user: 'John Doe', notes: 'Under client review' }
      ]
    },
    {
      id: 'p2',
      title: 'Summer Cold Brew Chillers',
      caption: 'Escape the heat wave with our iced sub-zero cold brew topped with salted caramel cold foam. 🧊☕️ Which flavor are you grabbing first?',
      platform: 'Instagram',
      mediaUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=800&fit=crop&q=80',
      mediaType: 'image',
      hashtags: '#StarbucksColdBrew #SummerChillers #CoffeeBreak',
      mentions: '@starbucks',
      scheduleDate: '2026-08-08',
      priority: 'Medium',
      status: 'Approved',
      clientName: 'Starbucks Rewards',
      employeeName: 'Alex Rivera',
      projectName: 'Summer Chiller Series',
      comments: [
        {
          id: 'c10',
          author: 'Clara Oswald',
          role: 'client',
          text: 'Approved! This looks refreshing and hits our brand guidelines perfectly.',
          time: '3 hours ago',
          resolved: true,
          reactions: [{ emoji: '🚀', count: 2, users: ['Alex Rivera', 'Sarah Jenkins'] }]
        }
      ],
      versions: [
        {
          version: 1,
          mediaUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=800&fit=crop&q=80',
          mediaType: 'image',
          caption: 'Escape the heat wave with our iced sub-zero cold brew topped with salted caramel cold foam. 🧊☕️ Which flavor are you grabbing first?',
          hashtags: '#StarbucksColdBrew #SummerChillers',
          mentions: '@starbucks',
          changedBy: 'Alex Rivera',
          timestamp: '2026-08-01 09:00',
          changesSummary: 'Original post submission'
        }
      ],
      timeline: [
        { status: 'Sent to Client', timestamp: '2026-08-01 10:00', user: 'Alex Rivera' },
        { status: 'Approved', timestamp: '2026-08-02 18:30', user: 'Clara Oswald', notes: 'Approved without revisions' }
      ]
    },
    {
      id: 'p3',
      title: 'Powerwall 3 Energy Autonomy',
      caption: 'Store excess solar energy during the day and power your home through grid outages seamless. Experience true clean energy independence.',
      platform: 'LinkedIn',
      mediaUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&fit=crop&q=80',
      mediaType: 'image',
      hashtags: '#TeslaEnergy #Powerwall #CleanTech #Sustainability',
      mentions: '@tesla',
      scheduleDate: '2026-08-12',
      priority: 'High',
      status: 'Internal Review',
      clientName: 'Tesla Energy',
      employeeName: 'Jessica Chen',
      projectName: 'Powerwall Home Energy Revolution',
      comments: [],
      versions: [
        {
          version: 1,
          mediaUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&fit=crop&q=80',
          mediaType: 'image',
          caption: 'Store excess solar energy during the day and power your home through grid outages seamless.',
          hashtags: '#TeslaEnergy #Powerwall',
          mentions: '@tesla',
          changedBy: 'Jessica Chen',
          timestamp: '2026-08-02 11:00',
          changesSummary: 'Drafted LinkedIn infographic post'
        }
      ],
      timeline: [
        { status: 'Idea', timestamp: '2026-08-01 14:00', user: 'Jessica Chen' },
        { status: 'Draft', timestamp: '2026-08-02 09:30', user: 'Jessica Chen' },
        { status: 'Internal Review', timestamp: '2026-08-02 11:00', user: 'Jessica Chen' }
      ]
    }
  ],

  tasks: [
    { 
      id: 't1', 
      title: 'Schedule Starbucks Summer Photoshoot', 
      assignee: 'Alex Rivera', 
      clientName: 'Starbucks Rewards',
      dueDate: '2026-08-06', 
      priority: 'High', 
      status: 'In Progress', 
      progress: 60,
      checklist: [
        { id: 'chk-1', text: 'Book outdoor cafe venue', completed: true },
        { id: 'chk-2', text: 'Confirm drink props and ice styling', completed: true },
        { id: 'chk-3', text: 'Hire lighting assistant', completed: false }
      ],
      timeTrackedMinutes: 145,
      isTimerRunning: false
    },
    { 
      id: 't2', 
      title: 'Draft Nike Air Max 2026 Reel Audio Script', 
      assignee: 'Alex Rivera', 
      clientName: 'Nike Digital',
      dueDate: '2026-08-07', 
      priority: 'Medium', 
      status: 'Todo', 
      progress: 25,
      checklist: [
        { id: 'chk-4', text: 'Review voiceover talent samples', completed: true },
        { id: 'chk-5', text: 'Draft 30-sec script hook', completed: false }
      ],
      timeTrackedMinutes: 40,
      isTimerRunning: false
    },
    { 
      id: 't3', 
      title: 'Render Tesla Powerwall 3D Infographic', 
      assignee: 'Jessica Chen', 
      clientName: 'Tesla Energy',
      dueDate: '2026-08-10', 
      priority: 'High', 
      status: 'Review', 
      progress: 90,
      checklist: [
        { id: 'chk-6', text: 'Model house exterior', completed: true },
        { id: 'chk-7', text: 'Animate power flow arrows', completed: true }
      ],
      timeTrackedMinutes: 320,
      isTimerRunning: false
    }
  ],

  mediaItems: [
    {
      id: 'm1',
      name: 'Nike_AirMax_Hero_4K.jpg',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&fit=crop&q=80',
      size: '4.8 MB',
      folder: 'Campaign Assets',
      tags: ['Hero', 'Product', 'Footwear'],
      uploadedBy: 'Jessica Chen',
      uploadedAt: '2026-08-01',
      clientName: 'Nike Digital'
    },
    {
      id: 'm2',
      name: 'Starbucks_ColdBrew_Teaser.mp4',
      type: 'video',
      url: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=800&fit=crop&q=80',
      size: '28.4 MB',
      folder: 'Campaign Assets',
      tags: ['Video', 'Reel', 'Coffee'],
      uploadedBy: 'Alex Rivera',
      uploadedAt: '2026-08-01',
      clientName: 'Starbucks Rewards'
    },
    {
      id: 'm3',
      name: 'Nike_Brand_Guidelines_2026.pdf',
      type: 'pdf',
      url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&fit=crop&q=80',
      size: '12.1 MB',
      folder: 'Documents',
      tags: ['Brand', 'Guidelines', 'PDF'],
      uploadedBy: 'Sarah Jenkins',
      uploadedAt: '2026-07-15',
      clientName: 'Nike Digital'
    },
    {
      id: 'm4',
      name: 'Tesla_Official_Logo_Vector.png',
      type: 'logo',
      url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&fit=crop&q=80',
      size: '850 KB',
      folder: 'Logos & Branding',
      tags: ['Logo', 'Vector'],
      uploadedBy: 'Marcus Vance',
      uploadedAt: '2026-07-20',
      clientName: 'Tesla Energy'
    }
  ],

  notifications: [
    {
      id: 'n1',
      title: 'New Client Comment',
      message: 'John Doe commented on "Run with the Air: Nike Max 2026"',
      type: 'comment',
      time: '45 mins ago',
      read: false
    },
    {
      id: 'n2',
      title: 'Post Approved!',
      message: 'Clara Oswald approved "Summer Cold Brew Chillers"',
      type: 'approval',
      time: '3 hours ago',
      read: false
    },
    {
      id: 'n3',
      title: 'Task Assigned',
      message: 'You were assigned to "Render Tesla Powerwall 3D Infographic"',
      type: 'task',
      time: '1 day ago',
      read: true
    }
  ],

  activities: [
    { id: 'act-1', user: 'John Doe', userRole: 'Client', action: 'added a comment to', target: 'Nike Max 2026', time: '45 mins ago', ipAddress: '198.51.100.44' },
    { id: 'act-2', user: 'Alex Rivera', userRole: 'Employee', action: 'uploaded Version 2 for', target: 'Nike Max 2026', time: '2 hours ago', ipAddress: '192.168.1.105' },
    { id: 'act-3', user: 'Clara Oswald', userRole: 'Client', action: 'approved post', target: 'Summer Cold Brew Chillers', time: '3 hours ago', ipAddress: '203.0.113.12' },
    { id: 'act-4', user: 'Sarah Jenkins', userRole: 'Super Admin', action: 'updated system security settings', target: 'Enforced 2FA', time: '5 hours ago', ipAddress: '192.168.1.1' }
  ],

  integrations: [
    { id: 'int-1', name: 'Google Workspace OAuth', category: 'Auth', icon: 'google', description: 'Single sign-on and direct Google Drive file import.', status: 'Connected', connectedBy: 'Sarah Jenkins', lastSync: '10 mins ago' },
    { id: 'int-2', name: 'Google Drive', category: 'Storage', icon: 'drive', description: 'Sync asset libraries and client video files automatically.', status: 'Connected', connectedBy: 'Sarah Jenkins', lastSync: '1 hour ago' },
    { id: 'int-3', name: 'Google Calendar', category: 'Communication', icon: 'gcal', description: 'Sync content publishing schedule to agency team calendars.', status: 'Connected', connectedBy: 'Alex Rivera', lastSync: '30 mins ago' },
    { id: 'int-4', name: 'Slack Workspace', category: 'Communication', icon: 'slack', description: 'Instant notification alerts for client approvals and comments.', status: 'Connected', connectedBy: 'Sarah Jenkins', lastSync: 'Real-time' },
    { id: 'int-5', name: 'Meta Business Suite (FB & IG)', category: 'Social Media', icon: 'meta', description: 'Direct publishing, reels upload, and insights sync.', status: 'Connected', connectedBy: 'Alex Rivera', lastSync: '15 mins ago' },
    { id: 'int-6', name: 'LinkedIn Company Pages', category: 'Social Media', icon: 'linkedin', description: 'Publish corporate posts, carousels, and employee advocacy.', status: 'Connected', connectedBy: 'Alex Rivera', lastSync: '2 hours ago' },
    { id: 'int-7', name: 'YouTube Studio API', category: 'Social Media', icon: 'youtube', description: 'Upload Short reels and scheduled long-form video content.', status: 'Connected', connectedBy: 'Jessica Chen', lastSync: 'Yesterday' },
    { id: 'int-8', name: 'X / Twitter API v2', category: 'Social Media', icon: 'x', description: 'Publish threads, polls, and monitor audience mentions.', status: 'Connected', connectedBy: 'Alex Rivera', lastSync: '4 hours ago' },
    { id: 'int-9', name: 'Dropbox Business', category: 'Storage', icon: 'dropbox', description: 'Cloud backup for raw 4K video assets and project files.', status: 'Disconnected' },
    { id: 'int-10', name: 'Microsoft OneDrive', category: 'Storage', icon: 'onedrive', description: 'Enterprise file storage integration for corporate clients.', status: 'Disconnected' },
    { id: 'int-11', name: 'Microsoft Teams', category: 'Communication', icon: 'teams', description: 'Send review requests to enterprise client Teams channels.', status: 'Disconnected' },
    { id: 'int-12', name: 'Zoom Meetings', category: 'Communication', icon: 'zoom', description: 'Schedule client strategy review calls directly from tasks.', status: 'Connected', connectedBy: 'Sarah Jenkins', lastSync: '3 days ago' }
  ],

  setRole: (role) => set((state) => {
    let name = 'Sarah Jenkins';
    let email = 'sarah@omniflow.io';
    let avatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&fit=crop&q=80';
    let department = 'Executive Management';

    if (role === 'admin') {
      name = 'Michael Ross';
      email = 'michael@omniflow.io';
      avatar = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&fit=crop&q=80';
      department = 'Agency Operations';
    } else if (role === 'employee') {
      name = 'Alex Rivera';
      email = 'alex@omniflow.io';
      avatar = 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&fit=crop&q=80';
      department = 'Content & Social';
    } else if (role === 'client') {
      name = 'John Doe';
      email = 'john@nike.com';
      avatar = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&fit=crop&q=80';
      department = 'Nike Digital Marketing';
    }

    return { 
      activeRole: role, 
      activeUser: { name, email, avatar, department },
      userEmail: email
    };
  }),

  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),

  login: (email) => set((state) => ({
    isAuthenticated: true,
    userEmail: email,
    loginHistory: [
      { id: 'lh-' + Date.now(), date: new Date().toISOString().replace('T', ' ').substring(0, 16), device: 'Web Browser', ip: '192.168.1.100', status: 'Success' },
      ...state.loginHistory
    ]
  })),

  logout: () => set({ isAuthenticated: false }),

  addClient: (client) => set((state) => {
    const newClient: Client = {
      ...client,
      id: 'c' + (state.clients.length + 1),
      projectsCount: 0,
      joinedDate: new Date().toISOString().split('T')[0]
    };
    return {
      clients: [...state.clients, newClient],
      activities: [
        { id: 'act-' + Date.now(), user: state.activeUser.name, userRole: state.activeRole, action: 'onboarded new client', target: client.companyName, time: 'Just now' },
        ...state.activities
      ]
    };
  }),

  updateClient: (clientId, client) => set((state) => ({
    clients: state.clients.map(c => c.id === clientId ? { ...c, ...client } : c)
  })),

  updateClientStatus: (clientId, status) => set((state) => ({
    clients: state.clients.map(c => c.id === clientId ? { ...c, status } : c),
    activities: [
      { id: 'act-' + Date.now(), user: state.activeUser.name, userRole: state.activeRole, action: `changed client status to ${status}`, target: state.clients.find(c => c.id === clientId)?.companyName || '', time: 'Just now' },
      ...state.activities
    ]
  })),

  addEmployee: (emp) => set((state) => ({
    employees: [...state.employees, {
      ...emp,
      id: 'e' + (state.employees.length + 1),
      completedPosts: 0,
      pendingPosts: 0,
      performance: 100,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&fit=crop&q=80'
    }]
  })),

  updateEmployee: (empId, emp) => set((state) => ({
    employees: state.employees.map(e => e.id === empId ? { ...e, ...emp } : e)
  })),

  addProject: (proj) => set((state) => ({
    projects: [...state.projects, {
      ...proj,
      id: 'proj-' + (state.projects.length + 1),
      filesCount: 0,
      tasksCount: 0,
      completedTasks: 0,
      approvalProgress: 0
    }]
  })),

  updateProject: (projId, proj) => set((state) => ({
    projects: state.projects.map(p => p.id === projId ? { ...p, ...proj } : p)
  })),

  addPost: (post) => set((state) => {
    const newPost: Post = {
      ...post,
      id: 'post-' + (state.posts.length + 1),
      comments: [],
      versions: [
        { 
          version: 1, 
          mediaUrl: post.mediaUrl, 
          mediaType: post.mediaType,
          caption: post.caption, 
          hashtags: post.hashtags,
          mentions: post.mentions,
          changedBy: post.employeeName, 
          timestamp: 'Just now',
          changesSummary: 'Created initial post draft'
        }
      ],
      timeline: [
        { status: 'Idea', timestamp: 'Just now', user: post.employeeName, notes: 'Post idea created' },
        { status: post.status, timestamp: 'Just now', user: post.employeeName, notes: `Set initial status to ${post.status}` }
      ]
    };
    return {
      posts: [newPost, ...state.posts],
      activities: [
        { id: 'act-' + Date.now(), user: post.employeeName, userRole: state.activeRole, action: 'created content post', target: post.title, time: 'Just now' },
        ...state.activities
      ]
    };
  }),

  updatePost: (postId, post) => set((state) => ({
    posts: state.posts.map(p => p.id === postId ? { ...p, ...post } : p)
  })),

  updatePostStatus: (postId, status, notes) => set((state) => {
    const timeText = 'Just now';
    const activeUserName = state.activeUser.name;
    const activeRoleName = state.activeRole;

    const targetPost = state.posts.find(p => p.id === postId);

    return {
      posts: state.posts.map(p => p.id === postId ? {
        ...p,
        status,
        timeline: [...p.timeline, { status, timestamp: timeText, user: activeUserName, notes: notes || `Moved to ${status}` }]
      } : p),
      activities: [
        { id: 'act-' + Date.now(), user: activeUserName, userRole: activeRoleName, action: `moved status to ${status} for`, target: targetPost?.title || '', time: timeText },
        ...state.activities
      ],
      notifications: [
        {
          id: 'n-' + Date.now(),
          title: `Post Status: ${status}`,
          message: `${activeUserName} updated "${targetPost?.title}" status to ${status}`,
          type: status.includes('Approved') ? 'approval' : 'system',
          time: 'Just now',
          read: false
        },
        ...state.notifications
      ]
    };
  }),

  createNewVersion: (postId, mediaUrl, caption, changesSummary) => set((state) => {
    const activeUserName = state.activeUser.name;
    return {
      posts: state.posts.map(p => {
        if (p.id === postId) {
          const nextVer = p.versions.length + 1;
          const newVersion: PostVersion = {
            version: nextVer,
            mediaUrl,
            mediaType: p.mediaType,
            caption,
            hashtags: p.hashtags,
            mentions: p.mentions,
            changedBy: activeUserName,
            timestamp: 'Just now',
            changesSummary: changesSummary || `Created Version ${nextVer}`
          };
          return {
            ...p,
            mediaUrl,
            caption,
            versions: [...p.versions, newVersion]
          };
        }
        return p;
      })
    };
  }),

  restoreVersion: (postId, versionNumber) => set((state) => {
    return {
      posts: state.posts.map(p => {
        if (p.id === postId) {
          const targetVer = p.versions.find(v => v.version === versionNumber);
          if (!targetVer) return p;
          return {
            ...p,
            mediaUrl: targetVer.mediaUrl,
            caption: targetVer.caption,
            hashtags: targetVer.hashtags,
            mentions: targetVer.mentions
          };
        }
        return p;
      })
    };
  }),

  addComment: (postId, { text, parentId, attachmentUrl, attachmentName }) => set((state) => {
    const newComment: Comment = {
      id: 'c-' + Date.now(),
      author: state.activeUser.name,
      role: state.activeRole,
      avatar: state.activeUser.avatar,
      text,
      time: 'Just now',
      resolved: false,
      parentId,
      reactions: [],
      attachmentUrl,
      attachmentName
    };

    return {
      posts: state.posts.map(p => p.id === postId ? {
        ...p,
        comments: [...p.comments, newComment]
      } : p),
      activities: [
        { id: 'act-' + Date.now(), user: state.activeUser.name, userRole: state.activeRole, action: 'posted a comment on', target: state.posts.find(p => p.id === postId)?.title || '', time: 'Just now' },
        ...state.activities
      ]
    };
  }),

  toggleCommentReaction: (postId, commentId, emoji) => set((state) => {
    const userName = state.activeUser.name;
    return {
      posts: state.posts.map(p => {
        if (p.id !== postId) return p;
        return {
          ...p,
          comments: p.comments.map(c => {
            if (c.id !== commentId) return c;
            const existingReaction = c.reactions.find(r => r.emoji === emoji);
            let updatedReactions = [...c.reactions];
            if (existingReaction) {
              if (existingReaction.users.includes(userName)) {
                updatedReactions = updatedReactions.map(r => r.emoji === emoji ? {
                  ...r,
                  count: r.count - 1,
                  users: r.users.filter(u => u !== userName)
                } : r).filter(r => r.count > 0);
              } else {
                updatedReactions = updatedReactions.map(r => r.emoji === emoji ? {
                  ...r,
                  count: r.count + 1,
                  users: [...r.users, userName]
                } : r);
              }
            } else {
              updatedReactions.push({ emoji, count: 1, users: [userName] });
            }
            return { ...c, reactions: updatedReactions };
          })
        };
      })
    };
  }),

  toggleResolveComment: (postId, commentId) => set((state) => ({
    posts: state.posts.map(p => {
      if (p.id !== postId) return p;
      return {
        ...p,
        comments: p.comments.map(c => c.id === commentId ? { ...c, resolved: !c.resolved } : c)
      };
    })
  })),

  togglePinComment: (postId, commentId) => set((state) => ({
    posts: state.posts.map(p => {
      if (p.id !== postId) return p;
      return {
        ...p,
        comments: p.comments.map(c => c.id === commentId ? { ...c, isPinned: !c.isPinned } : c)
      };
    })
  })),

  addTask: (task) => set((state) => ({
    tasks: [
      {
        ...task,
        id: 't-' + Date.now(),
        progress: 0,
        timeTrackedMinutes: 0,
        checklist: []
      },
      ...state.tasks
    ]
  })),

  updateTaskStatus: (taskId, status) => set((state) => ({
    tasks: state.tasks.map(t => t.id === taskId ? {
      ...t,
      status,
      progress: status === 'Done' ? 100 : status === 'In Progress' ? 50 : status === 'Review' ? 85 : 0
    } : t)
  })),

  toggleTaskChecklist: (taskId, checklistId) => set((state) => ({
    tasks: state.tasks.map(t => {
      if (t.id !== taskId) return t;
      const updatedChecklist = t.checklist.map(item => item.id === checklistId ? { ...item, completed: !item.completed } : item);
      const completedCount = updatedChecklist.filter(i => i.completed).length;
      const progress = updatedChecklist.length > 0 ? Math.round((completedCount / updatedChecklist.length) * 100) : t.progress;
      return { ...t, checklist: updatedChecklist, progress };
    })
  })),

  toggleTaskTimer: (taskId) => set((state) => ({
    tasks: state.tasks.map(t => t.id === taskId ? { ...t, isTimerRunning: !t.isTimerRunning } : t)
  })),

  addMediaItem: (item) => set((state) => ({
    mediaItems: [
      {
        ...item,
        id: 'm-' + Date.now(),
        uploadedBy: state.activeUser.name,
        uploadedAt: new Date().toISOString().split('T')[0]
      },
      ...state.mediaItems
    ]
  })),

  deleteMediaItem: (id) => set((state) => ({
    mediaItems: state.mediaItems.filter(m => m.id !== id)
  })),

  markNotificationRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
  })),

  markAllNotificationsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, read: true }))
  })),

  toggleIntegration: (id) => set((state) => ({
    integrations: state.integrations.map(i => i.id === id ? {
      ...i,
      status: i.status === 'Connected' ? 'Disconnected' : 'Connected',
      connectedBy: i.status === 'Connected' ? undefined : state.activeUser.name,
      lastSync: i.status === 'Connected' ? undefined : 'Just now'
    } : i)
  })),

  updateSettings: (settings) => set((state) => ({
    settings: { ...state.settings, ...settings }
  }))
}));
