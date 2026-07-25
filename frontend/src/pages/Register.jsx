import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { toast } from 'sonner';
import { Helmet } from 'react-helmet-async';
import { Leaf, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../config';
import { useTranslation } from 'react-i18next';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  mobile_number: z.string().min(10, 'Mobile number must be at least 10 digits'),
  consent_given: z.boolean().refine(val => val === true, {
    message: 'You must agree to be contacted.',
  }),
});

export default function Register() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'mr';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      mobile_number: '',
      consent_given: false,
    }
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // If email is empty string, convert to null for the backend
      const payload = { ...data, language: lang };
      if (!payload.email) payload.email = null;

      await axios.post(`${API_BASE_URL}/api/v1/leads/`, payload);
      setIsSuccess(true);
      toast.success('Consultation requested successfully!');
    } catch (error) {
      if (error.response?.status === 400 || error.response?.status === 409) {
        toast.error(t('register.errorExists'));
      } else {
        toast.error(t('register.errorSubmit'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-[#f3f9f3] via-white to-[#eaf5eb] p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white max-w-lg w-full rounded-3xl shadow-xl p-10 flex flex-col items-center text-center border border-gray-50"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 text-[#006400] rounded-full flex items-center justify-center mb-6 shadow-sm">
            <Leaf size={48} />
          </div>
          <h2 className="text-3xl font-bold mb-4 text-gray-900">{t('register.successTitle')}</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
            {t('register.successDesc')}
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-[#006400] hover:bg-[#004d00] text-white px-8 py-3 rounded-full font-semibold flex items-center gap-2 transition-colors shadow-md hover:shadow-lg"
          >
            {t('register.returnHome')} <ArrowRight size={18} />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-gradient-to-br from-[#f3f9f3] via-white to-[#eaf5eb] p-2 sm:p-4 md:p-8">
      <Helmet>
        <title>Book Consultation - Jivhala</title>
      </Helmet>

      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-gray-100">
        {/* Left Side: Modern Graphic/Text */}
        <div className="w-full md:w-5/12 bg-gradient-to-br from-[#006400] to-[#004d00] text-white p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
          {/* Abstract decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3 blur-xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full translate-y-1/3 -translate-x-1/4 blur-xl"></div>
          
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="bg-white/20 backdrop-blur-sm w-10 h-10 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                <Leaf className="text-white" size={20} />
              </div>
              <h2 className="text-3xl font-bold mb-4 leading-tight drop-shadow-md">{t('register.heroTitle')}</h2>
              <p className="text-green-50 text-sm sm:text-base mb-6 leading-relaxed opacity-90">
                {t('register.heroDesc')}
              </p>
            </div>
            
            <div className="flex items-center gap-4 bg-black/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10 mt-8">
              <div className="flex -space-x-3">
                 <div className="w-10 h-10 rounded-full bg-[#eaf5eb] border-2 border-[#006400] flex items-center justify-center text-[#006400] font-bold text-xs shadow-sm">DM</div>
                 <div className="w-10 h-10 rounded-full bg-[#d5ecd8] border-2 border-[#006400] flex items-center justify-center text-[#006400] font-bold text-xs shadow-sm">PM</div>
                 <div className="w-10 h-10 rounded-full bg-green-200 border-2 border-[#006400] flex items-center justify-center text-[#006400] font-bold text-xs shadow-sm">+</div>
              </div>
              <div>
                <div className="flex text-yellow-400 text-xs mb-1">★★★★★</div>
                <p className="text-xs text-white font-medium">{t('register.trustedBy')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-7/12 p-6 sm:p-8 bg-white flex flex-col justify-center">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-black mb-2 tracking-tight text-gray-900">
              {t('register.formTitle')}
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed">
              {t('register.formDesc')}
            </p>
          </div>

          <motion.form 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onSubmit={handleSubmit(onSubmit)} 
            className="flex flex-col gap-4"
          >
            <div>
              <label className="block text-xs font-bold mb-1.5 text-gray-700 uppercase tracking-wider">{t('register.fullName')}</label>
              <input 
                {...register('name')} 
                className="w-full bg-gray-50 border-2 border-transparent rounded-xl px-4 py-2.5 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#006400]/10 focus:border-[#006400] transition-all text-gray-900 font-medium placeholder-gray-400 shadow-sm text-sm"
                placeholder={t('register.namePlaceholder')}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold mb-1.5 text-gray-700 uppercase tracking-wider">{t('register.mobileNumber')}</label>
              <input 
                {...register('mobile_number')} 
                type="tel"
                className="w-full bg-gray-50 border-2 border-transparent rounded-xl px-4 py-2.5 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#006400]/10 focus:border-[#006400] transition-all text-gray-900 font-medium placeholder-gray-400 shadow-sm text-sm"
                placeholder="+1 234 567 8900"
              />
              {errors.mobile_number && <p className="text-red-500 text-xs mt-1 font-medium">{errors.mobile_number.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold mb-1.5 text-gray-700 uppercase tracking-wider">{t('register.emailLabel')} <span className="text-gray-400 font-normal normal-case">{t('register.optional')}</span></label>
              <input 
                {...register('email')} 
                type="email"
                className="w-full bg-gray-50 border-2 border-transparent rounded-xl px-4 py-2.5 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#006400]/10 focus:border-[#006400] transition-all text-gray-900 font-medium placeholder-gray-400 shadow-sm text-sm"
                placeholder={t('register.emailPlaceholder')}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email.message}</p>}
            </div>

            <div className="flex items-start gap-3 mt-2 bg-gray-50 p-3 rounded-xl border border-gray-100">
              <input 
                type="checkbox" 
                {...register('consent_given')} 
                id="consent"
                className="mt-1 w-5 h-5 text-[#006400] rounded border-gray-300 focus:ring-[#006400]"
              />
              <label htmlFor="consent" className="text-xs sm:text-sm text-gray-600 leading-relaxed cursor-pointer select-none">
                {t('register.consent')}
              </label>
            </div>
            {errors.consent_given && <p className="text-red-500 text-xs font-medium -mt-2">{errors.consent_given.message}</p>}

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="mt-2 bg-[#006400] hover:bg-[#004d00] text-white w-full py-3 rounded-xl font-bold flex items-center justify-center transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 text-base"
            >
              {isSubmitting ? t('register.buttonSubmitting') : t('register.buttonText')}
            </button>
          </motion.form>
        </div>
      </div>
    </div>
  );
}
