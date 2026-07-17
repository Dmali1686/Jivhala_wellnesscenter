import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Phone, ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export default function ClientLogin() {
  const { t } = useTranslation();
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/v1/auth/login`, {
        mobile_number: mobileNumber,
        password: password
      });
      localStorage.setItem('jivhala_token', response.data.access_token);
      localStorage.setItem('jivhala_role', response.data.role);
      toast.success(t('login.welcomeBack'));
      
      // Route based on role: admins → /admin, clients → /dashboard
      if (response.data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || t('login.invalidLogin'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <Helmet>
        <title>{t('login.title')} - Jivhala Wellness</title>
      </Helmet>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-10 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-bl-full -z-10"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-green-50 rounded-tr-full -z-10"></div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('login.title')}</h2>
          <p className="text-gray-500 text-sm">{t('login.subtitle')}</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div>
            <label className="block text-xs font-bold mb-1.5 text-gray-700 uppercase tracking-wider">{t('login.mobileNumber')}</label>
            <div className="relative">
              <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="tel"
                required
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="w-full bg-gray-50 border-2 border-transparent rounded-xl pl-10 pr-4 py-2.5 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#006400]/10 focus:border-[#006400] transition-all text-gray-900 font-medium placeholder-gray-400 shadow-sm text-sm"
                placeholder="+91 98765 43210"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold mb-1.5 text-gray-700 uppercase tracking-wider">{t('login.password')}</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border-2 border-transparent rounded-xl pl-10 pr-4 py-2.5 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#006400]/10 focus:border-[#006400] transition-all text-gray-900 font-medium placeholder-gray-400 shadow-sm text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="mt-4 bg-[#006400] hover:bg-[#004d00] text-white w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 text-base"
          >
            {loading ? t('login.loggingIn') : t('login.accessDashboard')} {!loading && <ArrowRight size={18} />}
          </button>
        </form>
        
        <div className="mt-8 text-center text-xs text-gray-400">
          <p>{t('login.noAccountTitle')} <br/> {t('login.noAccountDesc')}</p>
        </div>
      </motion.div>
    </div>
  );
}
