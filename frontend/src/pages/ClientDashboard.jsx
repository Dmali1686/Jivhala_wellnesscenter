import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Activity, Target, Flame, Plus, TrendingDown, User, Settings, LogOut, Lock, Save, X, Edit3, Calendar, Award } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from 'recharts';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { toast } from 'sonner';

function getAuthHeaders() {
  const token = localStorage.getItem('jivhala_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function ClientDashboard() {
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState([]);
  const [newWeight, setNewWeight] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Profile editing state
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ username: '', height: '', target_weight: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  
  // Password change state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ old_password: '', new_password: '', confirm_password: '' });
  const [savingPassword, setSavingPassword] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jivhala_token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const headers = getAuthHeaders();
      const userRes = await axios.get(`${API_BASE_URL}/api/v1/clients/me`, { headers });
      setUser(userRes.data);
      setProfileForm({
        username: userRes.data.username || '',
        height: userRes.data.height || '',
        target_weight: userRes.data.target_weight || ''
      });
      const progressRes = await axios.get(`${API_BASE_URL}/api/v1/clients/me/progress`, { headers });
      setProgress(progressRes.data);
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
      }
      localStorage.removeItem('jivhala_token');
      localStorage.removeItem('jivhala_role');
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogWeight = async (e) => {
    e.preventDefault();
    if (!newWeight) return;
    setSubmitting(true);
    try {
      const headers = getAuthHeaders();
      const res = await axios.post(`${API_BASE_URL}/api/v1/clients/me/progress`, {
        weight: parseFloat(newWeight)
      }, { headers });
      setProgress([...progress, res.data]);
      setUser({ ...user, streak: user.streak + 1 });
      setNewWeight('');
      toast.success("Weight logged! Streak +1 🔥");
    } catch (error) {
      if (error.response?.status === 401) { navigate('/login'); }
      else toast.error("Failed to log weight.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const headers = getAuthHeaders();
      const res = await axios.put(`${API_BASE_URL}/api/v1/clients/me`, {
        username: profileForm.username || null,
        height: profileForm.height ? parseFloat(profileForm.height) : null,
        target_weight: profileForm.target_weight ? parseFloat(profileForm.target_weight) : null,
      }, { headers });
      setUser(res.data);
      setEditingProfile(false);
      toast.success("Profile updated!");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to update profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      toast.error("Passwords don't match!");
      return;
    }
    if (passwordForm.new_password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    setSavingPassword(true);
    try {
      const headers = getAuthHeaders();
      await axios.put(`${API_BASE_URL}/api/v1/clients/me/password`, {
        old_password: passwordForm.old_password,
        new_password: passwordForm.new_password,
      }, { headers });
      setShowPasswordModal(false);
      setPasswordForm({ old_password: '', new_password: '', confirm_password: '' });
      toast.success("Password changed successfully!");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to change password.");
    } finally {
      setSavingPassword(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('jivhala_token');
    localStorage.removeItem('jivhala_role');
    navigate('/login');
  };

  if (loading || !user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', border: '4px solid #e5e7eb', borderTopColor: '#006400', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <p style={{ color: '#6b7280', fontWeight: 500 }}>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const currentWeight = progress.length > 0 ? progress[progress.length - 1].weight : null;
  const weightToLose = user.target_weight && currentWeight ? (currentWeight - user.target_weight).toFixed(1) : 0;
  const totalLost = progress.length >= 2 ? (progress[0].weight - progress[progress.length - 1].weight).toFixed(1) : 0;
  const progressPercent = user.target_weight && progress.length >= 2
    ? Math.min(100, Math.max(0, ((progress[0].weight - currentWeight) / (progress[0].weight - user.target_weight) * 100))).toFixed(0)
    : 0;

  // Chart data
  const chartData = progress.map(log => ({
    date: new Date(log.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    weight: log.weight,
    fullDate: new Date(log.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
  }));

  // Consistency data — last 30 days
  const last30Days = [];
  const today = new Date();
  const loggedDates = new Set(progress.map(p => new Date(p.date).toDateString()));
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    last30Days.push({
      day: d.getDate(),
      month: d.toLocaleDateString('en-IN', { month: 'short' }),
      logged: loggedDates.has(d.toDateString()),
      isToday: d.toDateString() === today.toDateString(),
    });
  }
  const consistencyRate = last30Days.length > 0
    ? Math.round((last30Days.filter(d => d.logged).length / last30Days.length) * 100)
    : 0;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: 'white', borderRadius: '12px', padding: '12px 16px', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', border: '1px solid #f0f0f0' }}>
          <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>{payload[0].payload.fullDate}</p>
          <p style={{ fontSize: '18px', fontWeight: 700, color: '#006400' }}>{payload[0].value} kg</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px 48px' }}>
      <Helmet><title>My Dashboard - Jivhala</title></Helmet>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#111827', marginBottom: '4px' }}>
            Welcome, {user.username || 'Client'} 👋
          </h1>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>Track your progress and stay on your wellness journey.</p>
        </div>
        <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px', border: '1px solid #e5e7eb', background: 'white', color: '#6b7280', cursor: 'pointer', fontSize: '13px', fontWeight: 500, transition: 'all 0.2s' }}
          onMouseEnter={e => { e.target.style.borderColor = '#ef4444'; e.target.style.color = '#ef4444'; }}
          onMouseLeave={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.color = '#6b7280'; }}
        >
          <LogOut size={16} /> Logout
        </button>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '28px', background: '#f3f4f6', borderRadius: '14px', padding: '4px', width: 'fit-content' }}>
        {[
          { id: 'overview', label: 'Overview', icon: <Activity size={16} /> },
          { id: 'profile', label: 'Profile', icon: <User size={16} /> },
          { id: 'settings', label: 'Settings', icon: <Settings size={16} /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 18px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600, transition: 'all 0.2s',
              background: activeTab === tab.id ? 'white' : 'transparent',
              color: activeTab === tab.id ? '#006400' : '#6b7280',
              boxShadow: activeTab === tab.id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* ========== OVERVIEW TAB ========== */}
      {activeTab === 'overview' && (
        <>
          {/* Metrics Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
            {[
              { label: 'Current Weight', value: currentWeight ?? 'N/A', unit: 'kg', icon: <Activity size={22} />, color: '#3b82f6', bg: '#eff6ff' },
              { label: 'Target Weight', value: user.target_weight || '--', unit: 'kg', icon: <Target size={22} />, color: '#16a34a', bg: '#f0fdf4' },
              { label: 'Current Streak', value: user.streak, unit: 'Days', icon: <Flame size={22} />, color: '#ea580c', bg: '#fff7ed' },
              { label: 'Total Lost', value: totalLost > 0 ? totalLost : '0', unit: 'kg', icon: <TrendingDown size={22} />, color: '#7c3aed', bg: '#f5f3ff' },
            ].map((card, i) => (
              <div key={i} style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color, flexShrink: 0 }}>
                  {card.icon}
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: '#6b7280', fontWeight: 500, marginBottom: '2px' }}>{card.label}</p>
                  <p style={{ fontSize: '24px', fontWeight: 800, color: '#111827', lineHeight: 1 }}>
                    {card.value} <span style={{ fontSize: '13px', fontWeight: 400, color: '#9ca3af' }}>{card.unit}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          {user.target_weight && progress.length >= 2 && (
            <div style={{ background: 'white', borderRadius: '16px', padding: '20px 24px', border: '1px solid #f0f0f0', marginBottom: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>Goal Progress</p>
                <p style={{ fontSize: '14px', fontWeight: 700, color: '#006400' }}>{progressPercent}%</p>
              </div>
              <div style={{ width: '100%', height: '10px', background: '#f3f4f6', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{ width: `${progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, #006400, #16a34a)', borderRadius: '99px', transition: 'width 0.6s ease' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                <span style={{ fontSize: '11px', color: '#9ca3af' }}>Start: {progress[0].weight} kg</span>
                <span style={{ fontSize: '11px', color: '#9ca3af' }}>Target: {user.target_weight} kg</span>
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
            {/* Left: Log Weight + Consistency */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Log Weight Card */}
              <div style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid #f0f0f0' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <Plus size={18} style={{ color: '#006400' }} /> Log Today
                </h3>
                <form onSubmit={handleLogWeight} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Weight (kg)</label>
                    <input
                      type="number" step="0.1" required value={newWeight} onChange={e => setNewWeight(e.target.value)}
                      placeholder="e.g. 70.5"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #e5e7eb', background: '#f9fafb', fontSize: '14px', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                      onFocus={e => e.target.style.borderColor = '#006400'}
                      onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                    />
                  </div>
                  <button type="submit" disabled={submitting}
                    style={{ padding: '11px', borderRadius: '10px', background: '#006400', color: 'white', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '14px', opacity: submitting ? 0.6 : 1, transition: 'all 0.2s' }}
                  >
                    {submitting ? 'Saving...' : 'Save Log'}
                  </button>
                </form>
              </div>

              {/* Consistency Heatmap */}
              <div style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid #f0f0f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={18} style={{ color: '#006400' }} /> Consistency
                  </h3>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#006400', background: '#f0fdf4', padding: '4px 10px', borderRadius: '99px' }}>{consistencyRate}%</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '4px' }}>
                  {last30Days.map((d, i) => (
                    <div key={i} title={`${d.day} ${d.month} — ${d.logged ? 'Logged ✓' : 'Missed'}`}
                      style={{
                        aspectRatio: '1', borderRadius: '4px', cursor: 'default', position: 'relative',
                        background: d.logged ? '#16a34a' : '#f3f4f6',
                        border: d.isToday ? '2px solid #006400' : '1px solid transparent',
                        opacity: d.logged ? 1 : 0.6,
                      }}
                    />
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '12px', justifyContent: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#16a34a' }} /><span style={{ fontSize: '11px', color: '#6b7280' }}>Logged</span></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#f3f4f6' }} /><span style={{ fontSize: '11px', color: '#6b7280' }}>Missed</span></div>
                </div>
              </div>
            </div>

            {/* Right: Chart */}
            <div style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid #f0f0f0', minHeight: '380px', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '20px' }}>Weight Progress</h3>
              {chartData.length < 2 ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
                  <Award size={40} style={{ marginBottom: '12px', opacity: 0.4 }} />
                  <p style={{ fontWeight: 500, fontSize: '14px' }}>Log at least 2 entries to see your chart</p>
                  <p style={{ fontSize: '12px' }}>Start tracking today!</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <defs>
                      <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#006400" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#006400" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} domain={['dataMin - 2', 'dataMax + 2']} />
                    <Tooltip content={<CustomTooltip />} />
                    {user.target_weight && (
                      <ReferenceLine y={user.target_weight} stroke="#16a34a" strokeDasharray="6 4" label={{ value: `Target: ${user.target_weight}kg`, position: 'insideTopRight', fontSize: 11, fill: '#16a34a' }} />
                    )}
                    <Area type="monotone" dataKey="weight" stroke="#006400" strokeWidth={2.5} fill="url(#weightGradient)" dot={{ r: 4, fill: '#006400', stroke: 'white', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#006400' }} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Weight History Table */}
          {progress.length > 0 && (
            <div style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid #f0f0f0', marginTop: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>Recent Entries</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <th style={{ textAlign: 'left', padding: '10px 16px', fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</th>
                      <th style={{ textAlign: 'left', padding: '10px 16px', fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Weight</th>
                      <th style={{ textAlign: 'left', padding: '10px 16px', fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...progress].reverse().slice(0, 10).map((log, idx, arr) => {
                      const prevLog = idx < arr.length - 1 ? arr[idx + 1] : null;
                      const change = prevLog ? (log.weight - prevLog.weight).toFixed(1) : null;
                      return (
                        <tr key={log.id} style={{ borderBottom: '1px solid #f9fafb' }}>
                          <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: 500, color: '#374151' }}>{new Date(log.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                          <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: 700, color: '#006400' }}>{log.weight} kg</td>
                          <td style={{ padding: '12px 16px' }}>
                            {change !== null && (
                              <span style={{ fontSize: '13px', fontWeight: 600, color: parseFloat(change) < 0 ? '#16a34a' : parseFloat(change) > 0 ? '#ef4444' : '#6b7280', background: parseFloat(change) < 0 ? '#f0fdf4' : parseFloat(change) > 0 ? '#fef2f2' : '#f3f4f6', padding: '3px 10px', borderRadius: '99px' }}>
                                {parseFloat(change) > 0 ? '+' : ''}{change} kg
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* ========== PROFILE TAB ========== */}
      {activeTab === 'profile' && (
        <div style={{ maxWidth: '600px' }}>
          <div style={{ background: 'white', borderRadius: '20px', padding: '28px', border: '1px solid #f0f0f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111827' }}>My Profile</h3>
              {!editingProfile ? (
                <button onClick={() => setEditingProfile(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px', border: '1.5px solid #006400', background: 'transparent', color: '#006400', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
                >
                  <Edit3 size={14} /> Edit
                </button>
              ) : (
                <button onClick={() => { setEditingProfile(false); setProfileForm({ username: user.username || '', height: user.height || '', target_weight: user.target_weight || '' }); }}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px', border: '1px solid #e5e7eb', background: 'transparent', color: '#6b7280', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}
                >
                  <X size={14} /> Cancel
                </button>
              )}
            </div>

            {/* Avatar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px', paddingBottom: '24px', borderBottom: '1px solid #f3f4f6' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'linear-gradient(135deg, #006400, #16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '24px', fontWeight: 800, flexShrink: 0 }}>
                {(user.username || 'C')[0].toUpperCase()}
              </div>
              <div>
                <p style={{ fontSize: '18px', fontWeight: 700, color: '#111827' }}>{user.username || 'Client'}</p>
                <p style={{ fontSize: '13px', color: '#6b7280' }}>📱 {user.mobile_number}</p>
                <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>Member since {new Date(user.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</p>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Full Name</label>
                <input
                  type="text" value={profileForm.username} onChange={e => setProfileForm({ ...profileForm, username: e.target.value })}
                  disabled={!editingProfile}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1.5px solid #e5e7eb', fontSize: '14px', outline: 'none', boxSizing: 'border-box', background: editingProfile ? 'white' : '#f9fafb', color: '#111827', transition: 'all 0.2s' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Height (cm)</label>
                  <input
                    type="number" step="0.1" value={profileForm.height} onChange={e => setProfileForm({ ...profileForm, height: e.target.value })}
                    disabled={!editingProfile}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1.5px solid #e5e7eb', fontSize: '14px', outline: 'none', boxSizing: 'border-box', background: editingProfile ? 'white' : '#f9fafb', color: '#111827' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Target Weight (kg)</label>
                  <input
                    type="number" step="0.1" value={profileForm.target_weight} onChange={e => setProfileForm({ ...profileForm, target_weight: e.target.value })}
                    disabled={!editingProfile}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1.5px solid #e5e7eb', fontSize: '14px', outline: 'none', boxSizing: 'border-box', background: editingProfile ? 'white' : '#f9fafb', color: '#111827' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Mobile Number</label>
                <input
                  type="text" value={user.mobile_number} disabled
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1.5px solid #e5e7eb', fontSize: '14px', background: '#f3f4f6', color: '#9ca3af', boxSizing: 'border-box' }}
                />
                <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>Mobile number cannot be changed. Contact admin for help.</p>
              </div>

              {editingProfile && (
                <button type="submit" disabled={savingProfile}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '12px', borderRadius: '10px', background: '#006400', color: 'white', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '14px', opacity: savingProfile ? 0.6 : 1, marginTop: '4px' }}
                >
                  <Save size={16} /> {savingProfile ? 'Saving...' : 'Save Changes'}
                </button>
              )}
            </form>
          </div>
        </div>
      )}

      {/* ========== SETTINGS TAB ========== */}
      {activeTab === 'settings' && (
        <div style={{ maxWidth: '600px' }}>
          <div style={{ background: 'white', borderRadius: '20px', padding: '28px', border: '1px solid #f0f0f0' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', marginBottom: '24px' }}>Account Settings</h3>

            {/* Password Section */}
            <div style={{ padding: '20px', borderRadius: '14px', border: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>
                  <Lock size={18} />
                </div>
                <div>
                  <p style={{ fontWeight: 600, color: '#111827', fontSize: '14px' }}>Change Password</p>
                  <p style={{ fontSize: '12px', color: '#9ca3af' }}>Update your account password</p>
                </div>
              </div>
              <button onClick={() => setShowPasswordModal(true)}
                style={{ padding: '8px 16px', borderRadius: '10px', border: '1.5px solid #006400', background: 'transparent', color: '#006400', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
              >
                Change
              </button>
            </div>

            {/* Danger Zone */}
            <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #fecaca' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#ef4444', marginBottom: '12px' }}>Danger Zone</h4>
              <button onClick={handleLogout}
                style={{ padding: '10px 20px', borderRadius: '10px', background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', cursor: 'pointer', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <LogOut size={16} /> Logout from all devices
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========== PASSWORD MODAL ========== */}
      {showPasswordModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ background: 'white', borderRadius: '20px', width: '100%', maxWidth: '420px', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontWeight: 700, fontSize: '16px', color: '#111827' }}>Change Password</h3>
              <button onClick={() => { setShowPasswordModal(false); setPasswordForm({ old_password: '', new_password: '', confirm_password: '' }); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleChangePassword} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px', textTransform: 'uppercase' }}>Current Password</label>
                <input type="password" required value={passwordForm.old_password} onChange={e => setPasswordForm({ ...passwordForm, old_password: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #e5e7eb', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px', textTransform: 'uppercase' }}>New Password</label>
                <input type="password" required value={passwordForm.new_password} onChange={e => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #e5e7eb', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px', textTransform: 'uppercase' }}>Confirm New Password</label>
                <input type="password" required value={passwordForm.confirm_password} onChange={e => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #e5e7eb', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowPasswordModal(false)}
                  style={{ flex: 1, padding: '11px', borderRadius: '10px', border: '1px solid #e5e7eb', background: 'white', color: '#6b7280', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}
                >
                  Cancel
                </button>
                <button type="submit" disabled={savingPassword}
                  style={{ flex: 1, padding: '11px', borderRadius: '10px', border: 'none', background: '#006400', color: 'white', cursor: 'pointer', fontWeight: 700, fontSize: '14px', opacity: savingPassword ? 0.6 : 1 }}
                >
                  {savingPassword ? 'Saving...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}
