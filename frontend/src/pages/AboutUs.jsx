import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { PlayCircle, Leaf, Heart } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { useTranslation } from 'react-i18next';
import FounderImg from '../assets/hero.png';

export default function AboutUs() {
  const { t } = useTranslation();
  const [vlogs, setVlogs] = useState([]);

  useEffect(() => {
    const fetchVlogs = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/v1/vlogs/`);
        if (response.data && Array.isArray(response.data)) {
          setVlogs(response.data);
        } else {
          setVlogs([]);
        }
      } catch (error) {
        console.error('Failed to fetch vlogs:', error);
      }
    };
    fetchVlogs();
  }, []);

  const extractVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };
  return (
    <div className="flex flex-col gap-10 md:gap-16 px-6 md:px-12 lg:px-24 py-6 md:py-10 relative overflow-hidden max-w-7xl mx-auto">
      <Helmet>
        <title>About Us - Jivhala</title>
      </Helmet>

      {/* Header Section */}
      <section className="text-center max-w-3xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#eaf5eb] text-[var(--color-primary)] px-5 py-2 rounded-full text-xs font-bold inline-flex items-center gap-2 mb-4"
        >
          <Leaf size={14} /> {t('about.mission')}
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-5xl font-bold text-[#1a1a1a] mb-4 tracking-tight"
        >
          {t('about.title').split(' ')[0]} <span className="font-serif italic text-[var(--color-primary)]">{t('about.title').split(' ').slice(1).join(' ')}</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-gray-600 text-lg leading-relaxed"
        >
          {t('about.subtitle')}
        </motion.p>
      </section>

      {/* Founder Section */}
      <section className="flex flex-col md:flex-row gap-8 items-center bg-white p-6 md:p-10 rounded-[2rem] shadow-sm border border-gray-100">
        <div className="w-full md:w-5/12">
          <img 
            src={FounderImg} 
            alt="Founder" 
            className="w-full h-[250px] md:h-[350px] object-cover rounded-3xl"
          />
        </div>
        <div className="w-full md:w-7/12 flex flex-col gap-4 md:gap-5">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{t('about.founderTitle')}</h2>
          <p className="text-gray-600 leading-relaxed">
            {t('about.founderP1')}
          </p>
          <p className="text-gray-600 leading-relaxed">
            {t('about.founderP2')}
          </p>
          <div className="flex items-center gap-3 mt-4 text-[var(--color-primary)] font-semibold">
            <Heart fill="currentColor" size={20} />
            <span>{t('about.dedicated')}</span>
          </div>
        </div>
      </section>

      {/* Vlogs / Videos Section */}
      <section className="py-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t('about.vlogsTitle')}</h2>
            <p className="text-gray-600">{t('about.vlogsDesc')}</p>
          </div>
          <button className="hidden md:block text-[#006400] font-semibold hover:underline">{t('about.viewAll')}</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vlogs.length > 0 ? (
            vlogs.map((vlog) => (
              <div key={vlog.id} className="flex flex-col">
                <div className="relative w-full aspect-video rounded-3xl overflow-hidden mb-4 bg-gray-100 shadow-sm border border-gray-100">
                  <iframe 
                    className="absolute inset-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${extractVideoId(vlog.youtube_url)}`} 
                    title={vlog.title} 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-1 hover:text-[var(--color-primary)] transition-colors cursor-pointer">{vlog.title}</h3>
                <p className="text-sm text-gray-500">{vlog.category} • {new Date(vlog.created_at).toLocaleDateString()}</p>
              </div>
            ))
          ) : (
            <div className="col-span-1 md:col-span-3 text-center py-12 text-gray-500">
              {t('about.noVlogs')}
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
