import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function WhatsAppWidget() {
  const { t } = useTranslation();
  const [showTooltip, setShowTooltip] = useState(false);
  const phoneNumber = "918483807846"; // Business number
  const message = t('whatsapp.defaultMessage');
  const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  useEffect(() => {
    // Show the tooltip popup after 3 seconds of being on the page
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Tooltip Popup */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 max-w-[250px] relative origin-bottom-right"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t('whatsapp.title')}</span>
              <button 
                onClick={() => setShowTooltip(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            <p className="text-sm text-gray-800 leading-relaxed font-medium">
              {t('whatsapp.tooltip')}
            </p>
            {/* Triangle pointer */}
            <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-b border-r border-gray-100 rotate-45"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onMouseEnter={() => setShowTooltip(true)}
        className="w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg shadow-green-900/20 hover:shadow-green-900/40 transition-shadow relative z-10"
        aria-label="Chat with us on WhatsApp"
      >
        {/* WhatsApp Icon SVG */}
        <svg 
          width="28" 
          height="28" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="white" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
          <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
          <path d="M14 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
          <path d="M9.5 13.5c.5 1 1.5 1 2.5 1s2-.5 2.5-1" />
        </svg>
      </motion.a>
    </div>
  );
}
