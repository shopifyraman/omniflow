import { create } from 'zustand';

export type Role = 'super_admin' | 'employee' | 'client';

export interface Client {
  id: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  brandName: string;
  website: string;
  socialLinks: { instagram?: string; facebook?: string; linkedin?: string; twitter?: string };
  address: string;
  notes: string;
  assignedEmployee: string;
  status: 'Active' | 'Inactive';
  logo: string;
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
}

export interface PostVersion {
  version: number;
  mediaUrl: string;
  caption: string;
  changedBy: string;
  timestamp: string;
}

export interface TimelineStep {
  status: string;
  timestamp: string;
  user: string;
}

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
  status: 'Draft' | 'Ready for Review' | 'Sent to Client' | 'Client Reviewing' | 'Approved' | 'Scheduled' | 'Published' | 'Rejected' | 'Needs Changes' | 'Internal Review';
  clientName: string;
  employeeName: string;
  comments: Comment[];
  versions: PostVersion[];
  timeline: TimelineStep[];
}

export interface Comment {
  id: string;
  author: string;
  role: string;
  text: string;
  time: string;
  resolved: boolean;
}

export interface Task {
  id: string;
  title: string;
  assignee: string;
  dueDate: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Todo' | 'In Progress' | 'Done';
  progress: number;
}

export interface Activity {
  id: string;
  user: string;
  action: string;
  target: string;
  time: string;
}

export interface AppSettings {
  agencyName: string;
  timezone: string;
  aiBrandTone: 'Professional' | 'Casual' | 'Creative' | 'Bold';
  slackNotifications: boolean;
  twoFactorAuth: boolean;
  emailTemplates: string;
}

interface AppState {
  activeRole: Role;
  activeUser: { name: string; email: string };
  clients: Client[];
  employees: Employee[];
  posts: Post[];
  tasks: Task[];
  notifications: string[];
  activities: Activity[];
  settings: AppSettings;
  theme: 'light' | 'dark';
  
  setRole: (role: Role) => void;
  toggleTheme: () => void;
  addClient: (client: Omit<Client, 'id'>) => void;
  updateClient: (clientId: string, client: Partial<Client>) => void;
  addPost: (post: Omit<Post, 'id' | 'comments' | 'versions' | 'timeline'>) => void;
  updatePost: (postId: string, post: Partial<Post>) => void;
  updatePostStatus: (postId: string, status: Post['status']) => void;
  addComment: (postId: string, comment: Omit<Comment, 'id' | 'time' | 'resolved'>) => void;
  addEmployee: (emp: Omit<Employee, 'id' | 'completedPosts' | 'pendingPosts' | 'performance'>) => void;
  updateEmployee: (empId: string, emp: Partial<Employee>) => void;
  createNewVersion: (postId: string, mediaUrl: string, caption: string) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
}

export const useStore = create<AppState>((set) => ({
  activeRole: 'super_admin',
  activeUser: { name: 'Sarah Jenkins', email: 'sarah@omniflow.io' },
  theme: 'light',
  
  settings: {
    agencyName: 'OmniFlow Solutions',
    timezone: 'UTC-5 (EST)',
    aiBrandTone: 'Creative',
    slackNotifications: true,
    twoFactorAuth: false,
    emailTemplates: 'Welcome to OmniFlow! Your temporary credentials are generated.'
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
      socialLinks: { instagram: '@nike', twitter: '@Nike' },
      address: 'One Bowerman Dr, Beaverton, OR',
      notes: 'Focus on Air Max launch campaign.',
      assignedEmployee: 'Alex Rivera',
      status: 'Active',
      logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&fit=crop&q=80',
    },
    {
      id: 'c2',
      name: 'Clara Oswald',
      companyName: 'Starbucks Rewards',
      email: 'clara@starbucks.com',
      phone: '+1 (555) 0988',
      brandName: 'Starbucks',
      website: 'starbucks.com',
      socialLinks: { instagram: '@starbucks' },
      address: '2401 Utah Ave S, Seattle, WA',
      notes: 'Promote summer chillers drinks.',
      assignedEmployee: 'Alex Rivera',
      status: 'Active',
      logo: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=80&fit=crop&q=80',
    }
  ],

  employees: [
    {
      id: 'e1',
      name: 'Alex Rivera',
      email: 'alex@omniflow.io',
      phone: '+1 (555) 3322',
      role: 'Social Media Manager',
      department: 'Marketing',
      assignedClients: ['Nike Digital', 'Starbucks Rewards'],
      completedPosts: 24,
      pendingPosts: 5,
      performance: 92
    }
  ],

  posts: [
    {
      id: 'p1',
      title: 'Run with the Air: Nike Max 2026',
      caption: 'The future of running has landed. Experience responsive cushioning made from 40% recycled materials. 🏃‍♂️✨',
      platform: 'Instagram',
      mediaUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&fit=crop&q=80',
      mediaType: 'image',
      hashtags: '#NikeAirMax #JustDoIt',
      mentions: '@nike',
      scheduleDate: '2026-08-01',
      priority: 'High',
      status: 'Client Reviewing',
      clientName: 'Nike Digital',
      employeeName: 'Alex Rivera',
      comments: [
        { id: '1', author: 'Alex Rivera', role: 'employee', text: 'Hey team, here is the new visual for the launch.', time: '2 hours ago', resolved: false },
        { id: '2', author: 'John Doe', role: 'client', text: 'Looks great! Can we add a link in the bio?', time: '30 mins ago', resolved: false }
      ],
      versions: [
        { version: 1, mediaUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&fit=crop&q=80', caption: 'Nike Air Max 2026 - first draft.', changedBy: 'Alex Rivera', timestamp: '20 hours ago' }
      ],
      timeline: [
        { status: 'Created', timestamp: '3 hours ago', user: 'Alex Rivera' },
        { status: 'Internal Review', timestamp: '2 hours ago', user: 'Alex Rivera' },
        { status: 'Sent to Client', timestamp: '30 mins ago', user: 'Alex Rivera' }
      ]
    }
  ],

  tasks: [
    { id: 't1', title: 'Schedule Starbucks photoshoot', assignee: 'Alex Rivera', dueDate: '2026-07-28', priority: 'Medium', status: 'Todo', progress: 0 },
    { id: 't2', title: 'Draft copy for Airbnb local wonders', assignee: 'Alex Rivera', dueDate: '2026-07-25', priority: 'High', status: 'In Progress', progress: 50 }
  ],

  notifications: [
    'Nike Digital post submitted for approval',
    'New comment added on "Nike Air Max 2026"'
  ],

  activities: [
    { id: 'a1', user: 'Alex Rivera', action: 'uploaded media for', target: 'Nike Max 2026', time: '2 hours ago' },
    { id: 'a2', user: 'John Doe', action: 'commented on', target: 'Nike Max 2026', time: '30 mins ago' }
  ],

  setRole: (role) => set((state) => {
    let name = 'Sarah Jenkins';
    let email = 'sarah@omniflow.io';
    if (role === 'employee') {
      name = 'Alex Rivera';
      email = 'alex@omniflow.io';
    } else if (role === 'client') {
      name = 'John Doe';
      email = 'john@nike.com';
    }
    return { activeRole: role, activeUser: { name, email } };
  }),

  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),

  addClient: (client) => set((state) => ({
    clients: [...state.clients, { ...client, id: 'c' + (state.clients.length + 1) }]
  })),

  updateClient: (clientId, client) => set((state) => ({
    clients: state.clients.map(c => c.id === clientId ? { ...c, ...client } : c)
  })),

  addPost: (post) => set((state) => {
    const newPost: Post = {
      ...post,
      id: 'post-' + (state.posts.length + 1),
      comments: [],
      versions: [
        { version: 1, mediaUrl: post.mediaUrl, caption: post.caption, changedBy: post.employeeName, timestamp: 'Just now' }
      ],
      timeline: [
        { status: 'Created', timestamp: 'Just now', user: post.employeeName }
      ]
    };
    return {
      posts: [newPost, ...state.posts],
      activities: [
        { id: 'act-' + (state.activities.length + 1), user: post.employeeName, action: 'created post draft', target: post.title, time: 'Just now' },
        ...state.activities
      ]
    };
  }),

  updatePost: (postId, post) => set((state) => ({
    posts: state.posts.map(p => p.id === postId ? { ...p, ...post } : p)
  })),

  updatePostStatus: (postId, status) => set((state) => {
    const timeText = 'Just now';
    const activeUserName = state.activeUser.name;
    return {
      posts: state.posts.map(p => p.id === postId ? {
        ...p,
        status,
        timeline: [...p.timeline, { status, timestamp: timeText, user: activeUserName }]
      } : p),
      activities: [
        { id: 'act-' + (state.activities.length + 1), user: activeUserName, action: `updated status to ${status} for`, target: state.posts.find(p => p.id === postId)?.title || '', time: timeText },
        ...state.activities
      ]
    };
  }),

  addComment: (postId, comment) => set((state) => ({
    posts: state.posts.map(p => p.id === postId ? {
      ...p,
      comments: [...p.comments, {
        ...comment,
        id: 'c-' + (p.comments.length + 1),
        time: 'Just now',
        resolved: false
      }]
    } : p)
  })),

  addEmployee: (emp) => set((state) => ({
    employees: [...state.employees, {
      ...emp,
      id: 'e' + (state.employees.length + 1),
      completedPosts: 0,
      pendingPosts: 0,
      performance: 100
    }]
  })),

  updateEmployee: (empId, emp) => set((state) => ({
    employees: state.employees.map(e => e.id === empId ? { ...e, ...emp } : e)
  })),

  createNewVersion: (postId, mediaUrl, caption) => set((state) => {
    const activeUserName = state.activeUser.name;
    return {
      posts: state.posts.map(p => {
        if (p.id === postId) {
          const nextVer = p.versions.length + 1;
          return {
            ...p,
            mediaUrl,
            caption,
            versions: [...p.versions, { version: nextVer, mediaUrl, caption, changedBy: activeUserName, timestamp: 'Just now' }]
          };
        }
        return p;
      })
    };
  }),

  updateSettings: (settings) => set((state) => ({
    settings: { ...state.settings, ...settings }
  }))
}));
