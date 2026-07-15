import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { PlayCircle, Leaf, Heart } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

export default function AboutUs() {
  const [vlogs, setVlogs] = useState([]);

  useEffect(() => {
    const fetchVlogs = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/v1/vlogs/`);
        setVlogs(response.data);
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
    <div className="flex flex-col gap-16 md:gap-24 px-6 md:px-12 lg:px-24 py-12 relative overflow-hidden max-w-7xl mx-auto">
      <Helmet>
        <title>About Us - Jivhala</title>
      </Helmet>

      {/* Header Section */}
      <section className="text-center max-w-3xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#eaf5eb] text-[var(--color-primary)] px-5 py-2 rounded-full text-xs font-bold inline-flex items-center gap-2 mb-6"
        >
          <Leaf size={14} /> Our Mission
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-6 tracking-tight"
        >
          Rooted in <span className="font-serif italic text-[var(--color-primary)]">Wellness.</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-gray-600 text-lg leading-relaxed"
        >
          At Jivhala Wellness Center, we believe that true vitality is achieved not through restriction, but through a deep, holistic connection to your body, mind, and daily environment.
        </motion.p>
      </section>

      {/* Founder Section */}
      <section className="flex flex-col md:flex-row gap-12 items-center bg-white p-8 md:p-12 rounded-[2rem] shadow-sm border border-gray-100">
        <div className="w-full md:w-1/2">
          <img 
            src="https://images.unsplash.com/photo-1594824436998-dd40b49fbbd8?q=80&w=1000&auto=format&fit=crop" 
            alt="Founder" 
            className="w-full h-[400px] object-cover rounded-3xl"
          />
        </div>
        <div className="w-full md:w-1/2 flex flex-col gap-6">
          <h2 className="text-3xl font-bold text-gray-900">Meet The Founder</h2>
          <p className="text-gray-600 leading-relaxed">
            With over a decade of experience in holistic nutrition and lifestyle coaching, our founder created Jivhala as a sanctuary for those exhausted by fad diets and relentless stress.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Our approach focuses on sustainable, gentle architecture for your daily life. We combine evidence-based nutrition with radical calm practices to help you achieve a state of genuine, effortless health.
          </p>
          <div className="flex items-center gap-3 mt-4 text-[var(--color-primary)] font-semibold">
            <Heart fill="currentColor" size={20} />
            <span>Dedicated to your transformation</span>
          </div>
        </div>
      </section>

      {/* Vlogs / Videos Section */}
      <section className="py-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Latest Vlogs</h2>
            <p className="text-gray-600">Watch our newest insights, wellness tips, and guided routines.</p>
          </div>
          <button className="hidden md:block text-[#006400] font-semibold hover:underline">View All Videos</button>
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
              No vlogs available yet.
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
