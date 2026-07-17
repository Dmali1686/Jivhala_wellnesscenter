import { Menu, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Header() {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'mr' : 'en');
  };
  return (
    <header className="sticky top-0 z-50 bg-[#FAFAFA]/80 backdrop-blur-md px-6 py-4 flex justify-between items-center">
      <Link to="/" className="flex flex-col items-center -ml-2 relative z-50">
        <img src="/logo.png" alt="Jivhala Wellness Center" className="h-10 md:h-12 w-auto object-contain transform scale-[2.5] origin-left" />
      </Link>
      
      <nav className="hidden sm:flex items-center gap-6 text-sm font-semibold text-gray-700">
        <Link to="/login" className="text-[var(--color-primary)] hover:text-[#004d00] transition-colors font-bold border border-[#006400] px-4 py-1.5 rounded-full">Client Portal</Link>
        <Link to="/health-checkup" className="hover:text-[var(--color-primary)] transition-colors flex items-center gap-1">🩺 {i18n.language === 'mr' ? 'आरोग्य तपासणी' : 'Health Check'}</Link>
        <Link to="/about" className="hover:text-[var(--color-primary)] transition-colors">{t('header.about')} & Vlogs</Link>
        <Link to="/success-stories" className="hover:text-[var(--color-primary)] transition-colors">{t('header.successStories')}</Link>
        <Link to="/register" className="bg-[#006400] text-white px-5 py-2 rounded-full hover:bg-[#004d00] transition-colors">{t('header.joinJivhala')}</Link>
        
        <button 
          onClick={toggleLanguage} 
          className="flex items-center gap-2 ml-4 text-[var(--color-primary)] hover:text-[#004d00] transition-colors bg-green-50 px-3 py-1.5 rounded-full font-bold text-xs"
        >
          <Globe size={16} />
          {i18n.language === 'mr' ? 'EN' : 'मराठी'}
        </button>
      </nav>

      <div className="flex items-center gap-4 sm:hidden">
        <button 
          onClick={toggleLanguage} 
          className="flex items-center justify-center text-[var(--color-primary)] bg-green-50 w-8 h-8 rounded-full font-bold text-[10px]"
        >
          {i18n.language === 'mr' ? 'EN' : 'मराठी'}
        </button>
        <button className="p-2 text-gray-700 hover:text-[var(--color-primary)] transition-colors">
          <Menu size={24} />
        </button>
      </div>
    </header>
  );
}
