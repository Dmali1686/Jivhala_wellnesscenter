import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Search, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const MOCK_STORIES = [
  {
    id: 1,
    name: 'Elena R.',
    goal: 'Lifestyle',
    gender: 'Female',
    story: 'मला शेवटी असा मार्ग सापडला जो शिक्षा देण्याऐवजी पोषण देणारा वाटतो. या आश्रयासारख्या मार्गदर्शनाने माझा संपूर्ण दृष्टिकोन बदलून टाकला.',
    beforeImage: '/kaki_before.png',
    afterImage: '/kaki_after.png',
    beforeWeight: '67',
    afterWeight: '56',
  },
  {
    id: 2,
    name: 'Marcus T.',
    goal: 'Weight Loss',
    gender: 'Male',
    story: 'वजन कमी करणे हा केवळ शारीरिक भाग होता. या मार्गदर्शनातून मला मिळालेली मानसिक स्पष्टता आणि विलक्षण शांतता यामुळेच माझ्या जीवनात खरा बदल घडला.',
    beforeImage: '/annu_sir_before.png',
    afterImage: '/annu_sir_after.png',
    beforeWeight: '90',
    afterWeight: '80',
  },
  {
    id: 3,
    name: 'Sarah M.',
    goal: 'Nutrition',
    gender: 'Female',
    story: 'कोणत्याही बंधनाशिवाय किंवा अपराधीपणाशिवाय माझ्या शरीराला योग्य पोषण कसे द्यावे हे शिकल्यामुळे, मला शेवटी माझ्या मुलांसोबत खेळण्यासाठी भरपूर ऊर्जा मिळाली आहे.',
    beforeImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&auto=format&fit=crop',
    beforeWeight: '85',
    afterWeight: '75',
  }
];

export default function SuccessStories() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'mr';
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedStory, setSelectedStory] = useState(null);
  const [dynamicStories, setDynamicStories] = useState([]);

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
    goal: lang === 'mr' ? ds.loss_mr : ds.loss_en,
    gender: 'Any',
    story: lang === 'mr' ? ds.feedback_mr : ds.feedback_en,
    beforeImage: `${API_BASE_URL}${ds.before_image}`,
    afterImage: `${API_BASE_URL}${ds.after_image}`,
    beforeWeight: ds.before_weight || '',
    afterWeight: ds.after_weight || '',
  })) : MOCK_STORIES;

  const filters = ['All', 'Weight Loss', 'Nutrition', 'Lifestyle'];

  const filteredStories = activeStories.filter(story => {
    const matchesSearch = story.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          story.story.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'All' || story.goal === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="px-6 py-8 relative">
      <Helmet>
        <title>Success Stories - Jivhala</title>
      </Helmet>

      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-3">{t('successStories.title')}</h1>
        <p className="text-[#4a4a4a] text-sm">
          {t('successStories.subtitle')} <br/>
          <span className="italic text-xs text-gray-400 mt-1 inline-block">{t('successStories.disclaimer')}</span>
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredStories.map((story, idx) => (
            <motion.div 
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-3xl p-4 shadow-sm border border-gray-50 flex flex-col gap-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedStory(story)}
            >
              <div className="flex gap-2 aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100">
                <div className="w-1/2 relative group h-full">
                  <img src={story.beforeImage} alt="Before" className="w-full h-full object-cover grayscale opacity-80" />
                  <span className="absolute bottom-2 left-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded-full backdrop-blur-sm">{t('home.before')}</span>
                </div>
                <div className="w-1/2 relative h-full">
                  <img src={story.afterImage} alt="After" className="w-full h-full object-cover" />
                  <span className="absolute bottom-2 right-2 bg-white/80 text-black text-[10px] px-2 py-1 rounded-full backdrop-blur-sm font-semibold">{t('home.after')}</span>
                </div>
              </div>
              <div className="px-2 pb-2">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold">{story.name}</h3>
                  <span className="bg-[#eaf5eb] text-[#006400] text-[10px] font-bold px-2 py-1 rounded-full">{t(`successStories.goals.${story.goal}`)}</span>
                </div>
                <p className="text-sm text-[#4a4a4a] line-clamp-2 leading-relaxed">
                  "{story.story}"
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filteredStories.length === 0 && (
          <div className="text-center py-12 text-gray-500 text-sm">
            No stories found matching your criteria.
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedStory && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 sm:p-6"
            onClick={() => setSelectedStory(null)}
          >
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="sticky top-0 right-0 flex justify-end p-4 z-10">
                <button 
                  onClick={() => setSelectedStory(null)}
                  className="bg-white/80 backdrop-blur-md p-2 rounded-full text-gray-600 hover:bg-gray-100 shadow-sm"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="px-6 pb-8 -mt-6">
                <h2 className="text-2xl font-bold mb-1">{selectedStory.name}</h2>
                <p className="text-[#006400] font-semibold text-sm mb-6">{t(`successStories.goals.${selectedStory.goal}`)} {t('successStories.title')}</p>
                
                <div className="flex flex-col sm:flex-row gap-2 mb-6">
                  <div className="relative w-full sm:w-1/2 flex items-center justify-center bg-gray-100 rounded-2xl overflow-hidden p-2">
                    <img src={selectedStory.beforeImage} alt="Before" className="w-full h-auto max-h-[60vh] object-contain grayscale opacity-90 rounded-xl" />
                    <span className="absolute top-4 left-4 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm shadow-sm z-10">{t('home.before')}</span>
                    {selectedStory.beforeWeight && (
                      <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-3xl font-black drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] tracking-wider z-10">
                        {selectedStory.beforeWeight} kg
                      </span>
                    )}
                  </div>
                  <div className="relative w-full sm:w-1/2 flex items-center justify-center bg-gray-100 rounded-2xl overflow-hidden p-2">
                    <img src={selectedStory.afterImage} alt="After" className="w-full h-auto max-h-[60vh] object-contain rounded-xl" />
                    <span className="absolute top-4 right-4 bg-[#006400] text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm font-bold shadow-sm z-10">{t('home.after')}</span>
                    {selectedStory.afterWeight && (
                      <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-3xl font-black drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] tracking-wider z-10">
                        {selectedStory.afterWeight} kg
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 relative">
                  <span className="text-6xl text-gray-200 font-serif absolute top-2 left-4">"</span>
                  <p className="text-[#4a4a4a] leading-relaxed relative z-10 italic">
                    {selectedStory.story}
                  </p>
                </div>
                
                <p className="text-[10px] text-gray-400 text-center mt-6 uppercase tracking-wider">
                  *Individual results vary based on commitment and personal factors.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
