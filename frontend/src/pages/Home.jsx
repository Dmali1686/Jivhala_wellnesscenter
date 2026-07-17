import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Leaf, Salad, Heart, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { API_BASE_URL } from '../config';

export default function Home() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'mr';
  const [dynamicStories, setDynamicStories] = useState([]);
  const featuredStories = [
    {
      id: 1,
      name: t('home.stories.dinesh.name'),
      loss: t('home.stories.dinesh.loss'),
      feedback: t('home.stories.dinesh.feedback'),
      beforeImage: "/papa_before.png",
      afterImage: "/papa_after.jpeg",
      beforeWeight: "67",
      afterWeight: "56"
    },
    {
      id: 2,
      name: t('home.stories.priya.name'),
      loss: t('home.stories.priya.loss'),
      feedback: t('home.stories.priya.feedback'),
      beforeImage: "/aai_before.png",
      afterImage: "/aai_after.jpeg",
      beforeWeight: "90",
      afterWeight: "80"
    },
    {
      id: 3,
      name: t('home.stories.rahul.name'),
      loss: t('home.stories.rahul.loss'),
      feedback: t('home.stories.rahul.feedback'),
      beforeImage: "/vittal_before.png",
      afterImage: "/vitthal_after.png",
      beforeWeight: "92",
      afterWeight: "78"
    }
  ];

  const [currentStory, setCurrentStory] = useState(0);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/v1/stories/`);
        if (response.data && response.data.length > 0) {
          setDynamicStories(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch dynamic stories:', error);
      }
    };
    fetchStories();
  }, []);

  const activeStories = dynamicStories.length > 0 ? dynamicStories.map(ds => ({
    id: ds.id,
    name: lang === 'mr' ? ds.name_mr : ds.name_en,
    loss: lang === 'mr' ? ds.loss_mr : ds.loss_en,
    feedback: lang === 'mr' ? ds.feedback_mr : ds.feedback_en,
    beforeImage: `${API_BASE_URL}${ds.before_image}`,
    afterImage: `${API_BASE_URL}${ds.after_image}`,
    beforeWeight: ds.before_weight,
    afterWeight: ds.after_weight
  })) : featuredStories;

  useEffect(() => {
    if (activeStories.length === 0) return;
    const timer = setInterval(() => {
      setCurrentStory((prev) => (prev + 1) % activeStories.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [activeStories.length]);

  const story = activeStories[currentStory];

  if (!story) return null;

  return (
    <div className="flex flex-col gap-16 md:gap-24 px-6 md:px-12 lg:px-24 relative overflow-hidden max-w-7xl mx-auto">
      {/* Background Gradient */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] md:w-[800px] md:h-[800px] bg-[#dcfce7] rounded-full blur-[100px] md:blur-[150px] opacity-40 -z-10 translate-x-1/3 -translate-y-1/4"></div>

      <Helmet>
        <title>Jivhala</title>
        <meta name="description" content="Personalized wellness routine for those seeking genuine vitality and radical calm in their daily lives." />
      </Helmet>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center text-center md:text-left mt-6 md:mt-16 gap-12 lg:gap-20">
        <div className="flex-1 flex flex-col items-center md:items-start">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#eaf5eb] text-[var(--color-primary)] px-5 py-2 rounded-full text-xs font-bold flex items-center gap-2 mb-8 md:mb-6"
          >
            <Leaf size={14} /> Holistic Coaching
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[2.5rem] md:text-5xl lg:text-6xl leading-tight mb-5 md:mb-6 font-bold text-[#1a1a1a] tracking-tight"
          >
            {t('home.heroTitle').split(' ').slice(0, -1).join(' ')} <br className="hidden md:block"/>
            <span className="font-serif italic text-[var(--color-primary)] tracking-normal md:block">{t('home.heroTitle').split(' ').slice(-1)}</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[#4a4a4a] text-[15px] md:text-lg px-2 md:px-0 mb-10 leading-relaxed max-w-sm md:max-w-md"
          >
            {t('home.heroSubtitle')}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full max-w-xs md:max-w-none"
          >
            <Link to="/register" className="bg-[#006400] hover:bg-[#004d00] text-white w-full md:w-auto md:px-10 py-4 rounded-full font-semibold flex items-center justify-center md:justify-start md:inline-flex gap-2 transition-colors text-[15px] md:text-base shadow-lg shadow-green-900/20 hover:shadow-green-900/30">
              {t('home.ctaStart')} <ArrowRight size={18} strokeWidth={2.5} />
            </Link>
          </motion.div>
        </div>

        {/* Hero Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-14 md:mt-0 relative w-full max-w-sm md:max-w-md lg:max-w-lg mx-auto md:mx-0 flex-1"
        >
          <div className="rounded-[2rem] md:rounded-[3rem] p-1.5 md:p-3 bg-white shadow-xl shadow-green-900/5 border border-gray-100">
            <img 
              src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop" 
              alt="Wellness Coaching Session" 
              className="rounded-[1.75rem] md:rounded-[2.5rem] w-full h-[420px] md:h-[500px] lg:h-[600px] object-cover"
            />
          </div>
          
          <div className="absolute -bottom-5 right-2 md:-left-8 md:right-auto md:bottom-12 bg-white/90 backdrop-blur-md px-5 py-3 rounded-full shadow-lg flex items-center gap-3 border border-gray-100 transition-transform hover:scale-105 cursor-default">
            <div className="flex -space-x-3">
              <img src="https://i.pravatar.cc/100?img=1" className="w-8 h-8 rounded-full border-2 border-white relative z-10" alt="user" />
              <img src="https://i.pravatar.cc/100?img=2" className="w-8 h-8 rounded-full border-2 border-white relative z-20" alt="user" />
              <div className="w-8 h-8 rounded-full border-2 border-white bg-[#86efac] flex items-center justify-center relative z-30 text-[10px] font-bold text-[#006400]">
                +
              </div>
            </div>
            <span className="text-[11px] font-bold text-gray-800 tracking-wide">10k+ Lives Transformed</span>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50 flex flex-col items-center text-center">
          <span className="text-3xl font-bold text-[var(--color-primary)] mb-1">12</span>
          <span className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Expert Coaches</span>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50 flex flex-col items-center text-center">
          <span className="text-3xl font-bold text-[var(--color-primary)] mb-1">98%</span>
          <span className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Success Rate</span>
        </div>
      </section>

      {/* Pathways Section */}
      <section className="py-12 md:py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 md:mb-6">{t('home.pathwaysTitle')}</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto px-4">{t('home.pathwaysSubtitle')}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <PathwayCard 
            icon={<Leaf size={24} className="text-[var(--color-primary)]" />}
            title={t('home.weightLossTitle')}
            description={t('home.weightLossDesc')}
          />
          <PathwayCard 
            icon={<Salad size={24} className="text-[var(--color-primary)]" />}
            title={t('home.nutritionTitle')}
            description={t('home.nutritionDesc')}
          />
          <PathwayCard 
            icon={<Heart size={24} className="text-[var(--color-primary)]" />}
            title={t('home.lifestyleTitle')}
            description={t('home.lifestyleDesc')}
          />
        </div>
      </section>

      {/* Featured Success Story Section */}
      <section className="py-12 md:py-20 mb-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('home.transformationTitle')}</h2>
          <p className="text-gray-600">{t('home.transformationSubtitle')}</p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-8 lg:gap-12 bg-[#f8fdf9] rounded-[2.5rem] p-6 md:p-10 border border-green-50 shadow-sm max-w-6xl mx-auto min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div 
              key={story.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col md:flex-row items-center justify-between w-full gap-8 lg:gap-12"
            >
              {/* Before Image */}
              <div className="w-full md:w-1/3 relative group">
                <div className="w-full h-[400px] md:h-[550px] rounded-3xl overflow-hidden shadow-md bg-gray-100">
                  <img 
                    src={story.beforeImage} 
                    alt="Before" 
                    className="w-full h-full object-cover grayscale opacity-80 transition-transform duration-700 group-hover:scale-105" 
                  />
                </div>
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-black px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">
                  {t('home.before')}
                </div>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-3xl font-black drop-shadow-lg tracking-wider">
                  {story.beforeWeight}
                </div>
              </div>

              {/* Feedback / Text */}
              <div className="w-full md:w-1/3 flex flex-col items-center text-center space-y-6 px-2">
                <div className="flex gap-1 text-[#006400]">
                  <Star fill="currentColor" size={24} />
                  <Star fill="currentColor" size={24} />
                  <Star fill="currentColor" size={24} />
                  <Star fill="currentColor" size={24} />
                  <Star fill="currentColor" size={24} />
                </div>
                
                <p className="text-lg md:text-xl font-medium text-gray-800 italic leading-relaxed relative">
                  <span className="text-4xl text-green-200 absolute -top-4 -left-4 font-serif">"</span>
                  {story.feedback}
                  <span className="text-4xl text-green-200 absolute -bottom-4 -right-4 font-serif rotate-180">"</span>
                </p>
                
                <div className="pt-4 border-t border-gray-100 w-full">
                  <h4 className="font-bold text-gray-900 text-lg">{story.name}</h4>
                  <p className="text-sm text-[var(--color-primary)] font-semibold mt-1 bg-green-50 inline-block px-3 py-1 rounded-full">
                    {story.loss}
                  </p>
                </div>
              </div>

              {/* After Image */}
              <div className="w-full md:w-1/3 relative group">
                <div className="w-full h-[400px] md:h-[550px] rounded-3xl overflow-hidden shadow-2xl shadow-green-900/15 border-[6px] border-white bg-gray-100">
                  <img 
                    src={story.afterImage} 
                    alt="After" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                </div>
                <div className="absolute top-4 right-4 bg-[#006400] text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
                  {t('home.after')}
                </div>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-3xl font-black drop-shadow-lg tracking-wider">
                  {story.afterWeight}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Carousel indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {activeStories.map((_, index) => (
            <button 
              key={index} 
              onClick={() => setCurrentStory(index)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${currentStory === index ? 'bg-[#006400]' : 'bg-gray-300'}`}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/success-stories" className="inline-block border-2 border-[#006400] text-[#006400] hover:bg-[#006400] hover:text-white px-8 py-3 rounded-full font-semibold transition-colors">
            {t('home.viewMore')}
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#f5f8f5] rounded-3xl p-8 text-center flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-3">Begin Your Journey</h2>
        <p className="text-sm text-[var(--color-text-muted)] mb-8">
          Step into a space of radical calm and take the first step towards your well-being.
        </p>
        <Link to="/register" className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white w-full py-3.5 rounded-full font-medium transition-colors">
          Schedule Consultation
        </Link>
      </section>
    </div>
  );
}

function PathwayCard({ icon, title, description }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-50 flex gap-4 items-start">
      <div className="bg-[#eaf5eb] p-3 rounded-full shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-xs text-[var(--color-text-muted)] leading-relaxed mb-2">{description}</p>
        <Link to={`/pathways/${title.toLowerCase().replace(' ', '-')}`} className="text-xs font-semibold text-[var(--color-primary)] flex items-center gap-1 hover:underline">
          Explore Plan <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}
