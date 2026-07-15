import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Activity, Target, Flame, Plus, TrendingDown } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { toast } from 'sonner';

export default function ClientDashboard() {
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState([]);
  const [newWeight, setNewWeight] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jivhala_token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    // Decoding token manually (basic method) or rely on backend to use token from headers
    // Since backend requires mobile_number currently in GET param (simplified), let's parse JWT
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      const payload = JSON.parse(jsonPayload);
      const mobileNumber = payload.sub;

      const fetchData = async () => {
        try {
          const userRes = await axios.get(`${API_BASE_URL}/api/v1/clients/me?mobile_number=${encodeURIComponent(mobileNumber)}`);
          setUser(userRes.data);
          
          const progressRes = await axios.get(`${API_BASE_URL}/api/v1/clients/me/progress?mobile_number=${encodeURIComponent(mobileNumber)}`);
          setProgress(progressRes.data);
        } catch (error) {
          console.error(error);
          toast.error("Session expired or invalid.");
          localStorage.removeItem('jivhala_token');
          navigate('/login');
        } finally {
          setLoading(false);
        }
      };
      
      fetchData();
    } catch (error) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogWeight = async (e) => {
    e.preventDefault();
    if (!newWeight) return;
    setSubmitting(true);
    
    try {
      const token = localStorage.getItem('jivhala_token');
      const payload = JSON.parse(atob(token.split('.')[1]));
      const mobileNumber = payload.sub;

      const res = await axios.post(`${API_BASE_URL}/api/v1/clients/me/progress?mobile_number=${encodeURIComponent(mobileNumber)}`, {
        weight: parseFloat(newWeight)
      });
      
      setProgress([...progress, res.data]);
      setUser({...user, streak: user.streak + 1});
      setNewWeight('');
      toast.success("Weight logged successfully! Streak +1 🔥");
    } catch (error) {
      toast.error("Failed to log weight.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-[70vh] flex items-center justify-center">Loading dashboard...</div>;
  }

  const currentWeight = progress.length > 0 ? progress[progress.length - 1].weight : "N/A";
  const weightToLose = user.target_weight && currentWeight !== "N/A" ? (currentWeight - user.target_weight).toFixed(1) : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
      <Helmet>
        <title>My Dashboard - Jivhala</title>
      </Helmet>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.username || 'Client'}! 👋</h1>
          <p className="text-gray-500 mt-1">Here is your wellness overview for today.</p>
        </div>
        <button 
          onClick={() => {
            localStorage.removeItem('jivhala_token');
            localStorage.removeItem('jivhala_role');
            navigate('/login');
          }}
          className="text-sm font-medium text-gray-500 hover:text-red-500 transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Current Weight</p>
            <p className="text-2xl font-bold text-gray-900">{currentWeight} <span className="text-sm font-normal text-gray-400">kg</span></p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
            <Target size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Target Weight</p>
            <p className="text-2xl font-bold text-gray-900">{user.target_weight || '--'} <span className="text-sm font-normal text-gray-400">kg</span></p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
            <Flame size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Current Streak</p>
            <p className="text-2xl font-bold text-gray-900">{user.streak} <span className="text-sm font-normal text-gray-400">Days</span></p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
            <TrendingDown size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">To Lose</p>
            <p className="text-2xl font-bold text-gray-900">{weightToLose > 0 ? weightToLose : 0} <span className="text-sm font-normal text-gray-400">kg</span></p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Log Action */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h3 className="font-bold text-lg mb-4 text-gray-900 flex items-center gap-2">
              <Plus size={20} className="text-[#006400]" /> Log Today
            </h3>
            <form onSubmit={handleLogWeight} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold mb-2 text-gray-500 uppercase tracking-wider">Weight (kg)</label>
                <input 
                  type="number"
                  step="0.1"
                  required
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006400]/20 focus:border-[#006400] transition-all"
                  placeholder="e.g. 70.5"
                />
              </div>
              <button 
                type="submit" 
                disabled={submitting}
                className="bg-[#006400] hover:bg-[#004d00] text-white w-full py-3 rounded-xl font-bold transition-all disabled:opacity-50"
              >
                {submitting ? "Saving..." : "Save Log"}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Chart / History */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 h-full">
            <h3 className="font-bold text-lg mb-6 text-gray-900">Weight History</h3>
            
            {progress.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-gray-400 text-sm">
                <p>No data logged yet.</p>
                <p>Log your first weight to see your progress chart!</p>
              </div>
            ) : (
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 rounded-t-lg">
                    <tr>
                      <th scope="col" className="px-6 py-3 rounded-tl-lg">Date</th>
                      <th scope="col" className="px-6 py-3 rounded-tr-lg">Weight (kg)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...progress].reverse().map((log, idx) => (
                      <tr key={log.id} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                          {new Date(log.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 font-bold text-[#006400]">
                          {log.weight} kg
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
