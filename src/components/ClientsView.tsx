'use client';

import React, { useState } from 'react';
import { useStore, Client } from '../store/useStore';
import { 
  Building, Plus, Users, Globe, Phone, Mail, FileText, CheckCircle2, AlertCircle, Ban, Edit3, Trash2, ExternalLink 
} from 'lucide-react';

export default function ClientsView() {
  const { clients, addClient, updateClient, updateClientStatus, employees } = useStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  // Form states
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [assignedEmployee, setAssignedEmployee] = useState(employees[0]?.name || 'Alex Rivera');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addClient({
      name: contactName,
      companyName,
      email,
      phone: phone || '+1 (555) 0199',
      brandName: companyName,
      website: website || `${companyName.toLowerCase().replace(/\s+/g, '')}.com`,
      socialLinks: { instagram: `@${companyName.toLowerCase().replace(/\s+/g, '')}` },
      address: 'San Francisco, CA',
      notes: 'Onboarded via OmniFlow Agency Hub',
      assignedEmployee,
      status: 'Active',
      logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=120&fit=crop&q=80'
    });

    setCompanyName('');
    setContactName('');
    setEmail('');
    setPhone('');
    setWebsite('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm">
        <div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white">Client Management & Onboarding</h1>
          <p className="text-xs text-gray-500">Manage client accounts, generate login access, assign agency team members</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Onboard New Client</span>
        </button>
      </div>

      {/* Clients Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => (
          <div key={client.id} className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm hover:shadow-md transition-all space-y-4">
            
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img src={client.logo} alt={client.companyName} className="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-500/20" />
                <div>
                  <h3 className="text-sm font-black text-gray-900 dark:text-white">{client.companyName}</h3>
                  <p className="text-xs text-gray-500">{client.name}</p>
                </div>
              </div>

              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                client.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
              }`}>
                {client.status}
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-gray-400" />
                <span>{client.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-gray-400" />
                <span>{client.website}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-gray-400" />
                <span>{client.phone}</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-[var(--border)] text-xs space-y-1">
              <div className="text-[10px] font-bold text-gray-400 uppercase">Assigned Creator</div>
              <div className="font-bold text-indigo-600 dark:text-indigo-400">{client.assignedEmployee}</div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-[var(--border)]">
              {client.status === 'Active' ? (
                <button
                  onClick={() => updateClientStatus(client.id, 'Suspended')}
                  className="flex-1 py-2 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-bold text-xs rounded-xl hover:bg-amber-100 transition-all flex items-center justify-center gap-1"
                >
                  <Ban className="w-3.5 h-3.5" />
                  <span>Suspend Account</span>
                </button>
              ) : (
                <button
                  onClick={() => updateClientStatus(client.id, 'Active')}
                  className="flex-1 py-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold text-xs rounded-xl hover:bg-emerald-100 transition-all flex items-center justify-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Reactivate</span>
                </button>
              )}
            </div>

          </div>
        ))}
      </div>

      {/* Onboard Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleAddSubmit} className="bg-[var(--card)] border border-[var(--border)] rounded-3xl shadow-2xl w-full max-w-lg p-6 space-y-4">
            <h2 className="text-base font-black text-gray-900 dark:text-white">Onboard New Client Account</h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Company / Client Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nike Digital"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl border border-[var(--border)]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Primary Contact Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl border border-[var(--border)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="john@nike.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl border border-[var(--border)]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+1 (555) 0122"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl border border-[var(--border)]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Assigned Account Manager / Employee</label>
                <select
                  value={assignedEmployee}
                  onChange={(e) => setAssignedEmployee(e.target.value)}
                  className="w-full px-3.5 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl border border-[var(--border)]"
                >
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.name}>{emp.name} ({emp.role})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border)]">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-gray-200 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-md"
              >
                Onboard Client & Send Invite
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
