import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2 } from 'lucide-react';
import { API_BASE_URL } from '../../config';
import { toast } from 'sonner';

// Helper to get auth headers
function getAuthHeaders() {
  const token = localStorage.getItem('jivhala_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function ClientsAdmin() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    mobile_number: '',
    password: '',
    height: '',
    target_weight: ''
  });
  const [submitting, setSubmitting] = useState(false);

  // In a real app, you would fetch all clients here
  // For now, we will just support creation

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        height: formData.height ? parseFloat(formData.height) : null,
        target_weight: formData.target_weight ? parseFloat(formData.target_weight) : null
      };
      await axios.post(`${API_BASE_URL}/api/v1/clients/`, payload, {
        headers: getAuthHeaders(),
      });
      toast.success('Client portal account created successfully!');
      setShowModal(false);
      setFormData({username: '', mobile_number: '', password: '', height: '', target_weight: ''});
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create client.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[calc(100vh-8rem)]">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Client Portal Accounts</h2>
          <p className="text-sm text-gray-500">Create access credentials for your clients.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-[#006400] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#004d00] transition-colors flex items-center gap-2"
        >
          <Plus size={16} /> Create Client Account
        </button>
      </div>

      <div className="p-6 flex-grow flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-4">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        </div>
        <h3 className="text-lg font-bold text-gray-900">Manage Clients</h3>
        <p className="text-gray-500 mt-2 max-w-sm">Click "Create Client Account" to generate login credentials and assign a personalized dashboard to a user.</p>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">New Client Account</h3>
              <p className="text-sm text-gray-500">Provide these details to the client so they can login.</p>
            </div>
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Name</label>
                <input 
                  type="text" required
                  value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none" 
                  placeholder="e.g. Ramesh Patil"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Mobile Number (Login ID)</label>
                <input 
                  type="tel" required
                  value={formData.mobile_number} onChange={e => setFormData({...formData, mobile_number: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none" 
                  placeholder="+91 98765 43210"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Password</label>
                <input 
                  type="text" required
                  value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none" 
                  placeholder="Generated Password"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Height (cm)</label>
                  <input 
                    type="number" step="0.1"
                    value={formData.height} onChange={e => setFormData({...formData, height: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Target Weight (kg)</label>
                  <input 
                    type="number" step="0.1" required
                    value={formData.target_weight} onChange={e => setFormData({...formData, target_weight: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none" 
                  />
                </div>
              </div>
              
              <div className="mt-4 flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 text-sm font-semibold text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={submitting} className="flex-1 py-2 text-sm font-semibold text-white bg-[#006400] rounded-lg hover:bg-[#004d00] disabled:opacity-50">Create Client</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
