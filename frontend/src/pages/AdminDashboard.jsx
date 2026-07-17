import { useState, useEffect } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { Users, Filter, MoreVertical, LayoutDashboard, Settings, LogOut, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import SuccessStoriesAdmin from '../components/admin/SuccessStoriesAdmin';
import VlogsAdmin from '../components/admin/VlogsAdmin';
import ClientsAdmin from '../components/admin/ClientsAdmin';
import { API_BASE_URL } from '../config';
import { toast } from 'sonner';

// Helper to get auth headers
function getAuthHeaders() {
  const token = localStorage.getItem('jivhala_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('leads');
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Route guard — redirect if not logged in as admin
  useEffect(() => {
    const token = localStorage.getItem('jivhala_token');
    const role = localStorage.getItem('jivhala_role');
    
    if (!token || role !== 'admin') {
      toast.error('Admin access required. Please login.');
      navigate('/login');
      return;
    }
    
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/leads/`, {
        headers: getAuthHeaders(),
      });
      setLeads(response.data);
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error('Session expired or access denied.');
        localStorage.removeItem('jivhala_token');
        localStorage.removeItem('jivhala_role');
        navigate('/login');
      } else {
        console.error('Failed to fetch leads', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'converted': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Helmet>
        <title>Admin Dashboard - Jivhala</title>
      </Helmet>

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-100 flex items-center justify-center">
          <Link to="/" className="flex flex-col items-center">
            <div className="text-[var(--color-primary)]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
              </svg>
            </div>
            <span className="text-[0.5rem] font-bold text-[var(--color-primary)] uppercase tracking-widest mt-1">Jivhala Admin</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab('leads')}
            className={`flex items-center gap-3 px-4 py-3 font-semibold rounded-xl transition-colors ${activeTab === 'leads' ? 'bg-[#eaf5eb] text-[#006400]' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <LayoutDashboard size={20} />
            Leads
          </button>
            <button 
              onClick={() => setActiveTab('clients')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-colors ${activeTab === 'clients' ? 'bg-green-50 text-[var(--color-primary)] font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Users size={20} /> Client Portal
            </button>
            <button 
              onClick={() => setActiveTab('stories')}
            className={`flex items-center gap-3 px-4 py-3 font-semibold rounded-xl transition-colors ${activeTab === 'stories' ? 'bg-[#eaf5eb] text-[#006400]' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Star size={20} />
            Success Stories
          </button>
          <button 
            onClick={() => setActiveTab('vlogs')}
            className={`flex items-center gap-3 px-4 py-3 font-semibold rounded-xl transition-colors ${activeTab === 'vlogs' ? 'bg-[#eaf5eb] text-[#006400]' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
            Vlogs
          </button>
          <button className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
            <Users size={20} />
            Users
          </button>
          <button className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
            <Settings size={20} />
            Settings
          </button>
        </nav>
        
        <div className="p-4 border-t border-gray-100">
          <button onClick={() => navigate('/')} className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-red-600 hover:bg-red-50 w-full rounded-xl transition-colors">
            <LogOut size={20} />
            Exit Admin
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-200 px-8 py-5 flex justify-between items-center sticky top-0 z-10">
          <h1 className="text-xl font-bold text-gray-800">
            {activeTab === 'leads' ? 'Leads Management' : activeTab === 'stories' ? 'Manage Success Stories' : 'Manage Vlogs'}
          </h1>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-[#006400] text-white flex items-center justify-center font-bold text-sm">
              A
            </div>
          </div>
        </header>

        <div className="p-8">
          {activeTab === 'leads' && (
            <>
              {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-gray-500 text-sm font-medium mb-2">Total Leads</h3>
              <p className="text-3xl font-bold text-gray-900">{leads.length}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-gray-500 text-sm font-medium mb-2">New</h3>
              <p className="text-3xl font-bold text-blue-600">
                {leads.filter(l => l.call_status === 'new').length}
              </p>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="font-semibold text-gray-800">Recent Registrations</h2>
              <button className="text-gray-500 hover:text-gray-700 flex items-center gap-2 text-sm bg-white border border-gray-200 px-3 py-1.5 rounded-lg">
                <Filter size={16} /> Filter
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-sm text-gray-500">
                    <th className="px-6 py-4 font-medium">Name</th>
                    <th className="px-6 py-4 font-medium">Contact</th>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-gray-500">Loading leads...</td>
                    </tr>
                  ) : leads.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-gray-500">No leads found.</td>
                    </tr>
                  ) : (
                    leads.map(lead => (
                      <tr key={lead.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{lead.name}</div>
                          {lead.consent_given && <div className="text-[10px] text-green-600 font-medium uppercase mt-0.5 tracking-wider">Consent Given</div>}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-800">{lead.mobile_number}</div>
                          <div className="text-xs text-gray-500">{lead.email || 'No email provided'}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(lead.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(lead.call_status)}`}>
                            {lead.call_status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-gray-400 hover:text-gray-600 p-1">
                            <MoreVertical size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
            </>
          )}

        {activeTab === 'clients' && <ClientsAdmin />}

        {activeTab === 'stories' && <SuccessStoriesAdmin />}

        {activeTab === 'vlogs' && (
          <VlogsAdmin />
        )}
        </div>
      </main>
    </div>
  );
}
